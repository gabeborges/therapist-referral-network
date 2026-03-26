import type { PrismaClient } from "@/generated/prisma/client";
import { matchReferralToProfiles } from "@/features/matching/match-referral-to-profiles";
import { sendReferralBatch } from "@/features/notifications/send-referral-batch";
import { sendFulfillmentCheck } from "@/features/notifications/send-fulfillment-check";

// ─── Configuration ──────────────────────────────────────────────────────────────

function getDripConfig(): {
  batchSize: number;
  maxBatches: number;
  followupHours: number;
  nextBatchDelayHours: number;
} {
  return {
    batchSize: parseInt(process.env.DRIP_BATCH_SIZE ?? "5", 10),
    maxBatches: parseInt(process.env.DRIP_MAX_BATCHES ?? "5", 10),
    followupHours: parseInt(process.env.DRIP_FOLLOWUP_HOURS ?? "48", 10),
    nextBatchDelayHours: parseInt(
      process.env.DRIP_NEXT_BATCH_DELAY_HOURS ?? "24",
      10,
    ),
  };
}

// ─── Types ──────────────────────────────────────────────────────────────────────

export type DripQueueSummary = {
  processed: number;
  batched: number;
  fulfillmentChecks: number;
  expired: number;
};

// ─── Helpers ────────────────────────────────────────────────────────────────────

function hoursAgo(hours: number, now: Date): Date {
  return new Date(now.getTime() - hours * 60 * 60 * 1000);
}

// ─── Main drip processor ────────────────────────────────────────────────────────

/**
 * Processes all OPEN referrals and determines the next drip action for each.
 *
 * State machine per referral:
 * 1. No batch sent yet → run matching, send batch 0
 * 2. Last batch sent > followupHours ago AND no pending fulfillment check → send fulfillment check
 * 3. Fulfillment check responded "no" AND response > nextBatchDelayHours ago → send next batch
 * 4. currentBatch >= maxBatches → mark EXPIRED
 */
export async function processDripQueue(
  prisma: PrismaClient,
): Promise<DripQueueSummary> {
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

    const latestCheck = referral.fulfillmentChecks[0] ?? null;

    // ── State 1: No batch sent yet ────────────────────────────────────────────
    if (referral.currentBatch === 0 && referral.lastDrippedAt === null) {
      const matches = await matchReferralToProfiles(
        referral,
        prisma,
        config.batchSize,
      );

      if (matches.length > 0) {
        // sendReferralBatch handles updating currentBatch and lastDrippedAt
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

      summary.expired++;
      continue;
    }

    // ── State 2: Last batch sent > followupHours ago, no pending check ────────
    const followupThreshold = hoursAgo(config.followupHours, now);
    const hasPendingCheck =
      latestCheck !== null && latestCheck.respondedAt === null;
    const lastDripOldEnough =
      referral.lastDrippedAt !== null &&
      referral.lastDrippedAt < followupThreshold;

    if (lastDripOldEnough && !hasPendingCheck) {
      // Only send a fulfillment check if the latest check was not already
      // responded with "no" recently (that case is handled in State 3).
      const latestRespondedNo =
        latestCheck !== null &&
        latestCheck.fulfilled === false &&
        latestCheck.respondedAt !== null;

      if (!latestRespondedNo) {
        await sendFulfillmentCheck(referral, prisma);
        summary.fulfillmentChecks++;
        continue;
      }
    }

    // ── State 3: Fulfillment check responded "no", delay elapsed → next batch ─
    if (
      latestCheck !== null &&
      latestCheck.fulfilled === false &&
      latestCheck.respondedAt !== null
    ) {
      const nextBatchThreshold = hoursAgo(config.nextBatchDelayHours, now);

      if (latestCheck.respondedAt < nextBatchThreshold) {
        const matches = await matchReferralToProfiles(
          referral,
          prisma,
          config.batchSize,
        );

        if (matches.length > 0) {
          // sendReferralBatch handles updating currentBatch and lastDrippedAt
          await sendReferralBatch(referral, matches, prisma);
          summary.batched++;
        } else {
          // No more matches available — expire the referral
          await prisma.referralPost.update({
            where: { id: referral.id },
            data: { status: "EXPIRED" },
          });

          summary.expired++;
        }
      }
    }
  }

  return summary;
}
