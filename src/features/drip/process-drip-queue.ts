import type { PrismaClient } from "@/generated/prisma/client";
import { matchReferralToProfiles } from "@/features/matching/match-referral-to-profiles";
import { sendReferralBatch } from "@/features/notifications/send-referral-batch";
import { sendFulfillmentCheck } from "@/features/notifications/send-fulfillment-check";
import { sendExpiryNotification } from "@/features/notifications/send-expiry-notification";

// ─── Configuration ──────────────────────────────────────────────────────────────

function getDripConfig(): {
  batchSize: number;
  maxBatches: number;
  followupHours: number;
  checkTimeoutHours: number;
} {
  return {
    batchSize: parseInt(process.env.DRIP_BATCH_SIZE ?? "5", 10),
    maxBatches: parseInt(process.env.DRIP_MAX_BATCHES ?? "5", 10),
    followupHours: parseInt(process.env.DRIP_FOLLOWUP_HOURS ?? "24", 10),
    checkTimeoutHours: parseInt(process.env.DRIP_CHECK_TIMEOUT_HOURS ?? "24", 10),
  };
}

// ─── Types ──────────────────────────────────────────────────────────────────────

export type DripQueueSummary = {
  processed: number;
  batched: number;
  fulfillmentChecks: number;
  expired: number;
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
 */
export async function processDripQueue(prisma: PrismaClient): Promise<DripQueueSummary> {
  const config = getDripConfig();
  const now = new Date();

  const summary: DripQueueSummary = {
    processed: 0,
    batched: 0,
    fulfillmentChecks: 0,
    expired: 0,
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

    // ── State 1: No batch sent yet ────────────────────────────────────────────
    if (referral.currentBatch === 0 && referral.lastDrippedAt === null) {
      const matches = await matchReferralToProfiles(referral, prisma, config.batchSize);

      if (matches.length > 0) {
        await sendReferralBatch(referral, matches, prisma);
        summary.batched++;
      }

      continue;
    }

    // ── State 4: Max batches reached → expire ─────────────────────────────────
    if (referral.currentBatch >= config.maxBatches) {
      await prisma.referralPost.update({
        where: { id: referral.id },
        data: { status: "EXPIRED" },
      });
      await sendExpiryNotification(referral, prisma);

      summary.expired++;
      continue;
    }

    const latestCheck = referral.fulfillmentChecks[0] ?? null;

    // A check belongs to the current batch when it was sent after the most recent batch dispatch.
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

      continue;
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

  return summary;
}
