import type { PrismaClient } from "@/generated/prisma/client";
import { matchReferralToProfiles } from "@/features/matching/match-referral-to-profiles";
import { sendReferralBatch } from "@/features/notifications/send-referral-batch";
import { sendFulfillmentCheck } from "@/features/notifications/send-fulfillment-check";
import { sendExpiryNotification } from "@/features/notifications/send-expiry-notification";

// ─── Configuration ──────────────────────────────────────────────────────────────

type DripConfig = {
  batchSize: number;
  maxBatches: number;
  followupHours: number;
  checkTimeoutHours: number;
};

function parsePositiveInt(value: string | undefined, fallback: number, name: string): number {
  if (value === undefined || value === "") return fallback;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`Invalid env value for ${name}: "${value}". Expected a positive integer.`);
  }
  return parsed;
}

function getDripConfig(): DripConfig {
  return {
    batchSize: parsePositiveInt(process.env.DRIP_BATCH_SIZE, 5, "DRIP_BATCH_SIZE"),
    maxBatches: parsePositiveInt(process.env.DRIP_MAX_BATCHES, 5, "DRIP_MAX_BATCHES"),
    followupHours: parsePositiveInt(process.env.DRIP_FOLLOWUP_HOURS, 24, "DRIP_FOLLOWUP_HOURS"),
    checkTimeoutHours: parsePositiveInt(
      process.env.DRIP_CHECK_TIMEOUT_HOURS,
      24,
      "DRIP_CHECK_TIMEOUT_HOURS",
    ),
  };
}

// ─── Types ──────────────────────────────────────────────────────────────────────

export type DripQueueSummary = {
  processed: number;
  batched: number;
  fulfillmentChecks: number;
  expired: number;
  failed: number;
};

type LatestCheck = {
  sentAt: Date;
  respondedAt: Date | null;
  fulfilled: boolean | null;
};

// ─── Helpers ────────────────────────────────────────────────────────────────────

function hoursAgo(hours: number, now: Date): Date {
  return new Date(now.getTime() - hours * 60 * 60 * 1000);
}

/**
 * True when the latest fulfillment check signals "advance to next batch":
 *  (a) therapist explicitly responded "no", OR
 *  (b) check has been pending longer than checkTimeoutHours (implicit "no").
 */
function shouldTriggerNextBatch(
  latestCheck: LatestCheck | null,
  now: Date,
  checkTimeoutHours: number,
): boolean {
  if (latestCheck === null) return false;
  if (latestCheck.fulfilled === false && latestCheck.respondedAt !== null) return true;
  if (latestCheck.respondedAt === null && latestCheck.sentAt < hoursAgo(checkTimeoutHours, now)) {
    return true;
  }
  return false;
}

// ─── Main drip processor ────────────────────────────────────────────────────────

/**
 * Processes all OPEN referrals and determines the next drip action for each.
 *
 * Each cycle has two windows:
 *   Window A (DRIP_FOLLOWUP_HOURS, default 24h): batch send → fulfillment check
 *   Window B (DRIP_CHECK_TIMEOUT_HOURS, default 24h): check sent → implicit "no" timeout
 *
 * States, evaluated in order:
 *   1. No batch sent yet                                       → send first batch
 *   4. currentBatch >= maxBatches                              → mark EXPIRED
 *   2. No check yet for current batch, batch > followupHours   → send fulfillment check
 *   3. Latest check responded "no" OR pending > checkTimeout   → send next batch (or expire if no matches)
 *
 * Each iteration is independently try/caught so a single transient error
 * does not abort the whole queue — only that referral is skipped this tick.
 *
 * NOTE on concurrency: this function does NOT take a distributed lock.
 * If invoked twice in parallel (cron retry + manual trigger), both runs
 * may see the same (lastDrippedAt, currentBatch) and double-send. The
 * route handler caller should gate concurrent invocations.
 */
export async function processDripQueue(prisma: PrismaClient): Promise<DripQueueSummary> {
  const config = getDripConfig();
  const now = new Date();

  const summary: DripQueueSummary = {
    processed: 0,
    batched: 0,
    fulfillmentChecks: 0,
    expired: 0,
    failed: 0,
  };

  const openReferrals = await prisma.referralPost.findMany({
    where: { status: "OPEN" },
    include: {
      fulfillmentChecks: {
        orderBy: { sentAt: "desc" },
        take: 1,
      },
    },
  });

  for (const referral of openReferrals) {
    summary.processed++;
    try {
      await processOneReferral(referral, prisma, now, config, summary);
    } catch (err) {
      summary.failed++;
      // Log without PHI: only opaque IDs.
      console.error("drip iteration failed", {
        referralId: referral.id,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  return summary;
}

type OpenReferralRow = Awaited<ReturnType<PrismaClient["referralPost"]["findMany"]>>[number] & {
  fulfillmentChecks: LatestCheck[];
};

async function processOneReferral(
  referral: OpenReferralRow,
  prisma: PrismaClient,
  now: Date,
  config: DripConfig,
  summary: DripQueueSummary,
): Promise<void> {
  // ── State 1: No batch sent yet ────────────────────────────────────────────
  if (referral.currentBatch === 0 && referral.lastDrippedAt === null) {
    const matches = await matchReferralToProfiles(referral, prisma, config.batchSize);

    if (matches.length > 0) {
      await sendReferralBatch(referral, matches, prisma);
      summary.batched++;
    }
    return;
  }

  // ── State 4: Max batches reached → expire ─────────────────────────────────
  if (referral.currentBatch >= config.maxBatches) {
    await prisma.referralPost.update({
      where: { id: referral.id },
      data: { status: "EXPIRED" },
    });
    await sendExpiryNotification(referral, prisma);
    summary.expired++;
    return;
  }

  const latestCheck = referral.fulfillmentChecks[0] ?? null;

  const hasCheckForCurrentBatch =
    latestCheck !== null &&
    referral.lastDrippedAt !== null &&
    latestCheck.sentAt > referral.lastDrippedAt;

  // ── State 2: Current batch has no check yet → send one after Window A ─────
  if (!hasCheckForCurrentBatch) {
    const followupThreshold = hoursAgo(config.followupHours, now);
    const batchOldEnough =
      referral.lastDrippedAt !== null && referral.lastDrippedAt < followupThreshold;

    if (batchOldEnough) {
      await sendFulfillmentCheck(referral, prisma);
      summary.fulfillmentChecks++;
    }
    return;
  }

  // ── State 3: Advance to next batch (explicit "no" or implicit-no timeout) ─
  if (shouldTriggerNextBatch(latestCheck, now, config.checkTimeoutHours)) {
    const matches = await matchReferralToProfiles(referral, prisma, config.batchSize);

    if (matches.length > 0) {
      await sendReferralBatch(referral, matches, prisma);
      summary.batched++;
    } else {
      await prisma.referralPost.update({
        where: { id: referral.id },
        data: { status: "EXPIRED" },
      });
      await sendExpiryNotification(referral, prisma);
      summary.expired++;
    }
  }
}
