import type { PrismaClient } from "@/generated/prisma/client";

// Referrals are retained for 90 days after reaching a terminal status
const RETENTION_DAYS = 90;

export async function purgeExpiredReferrals(
  prisma: PrismaClient,
): Promise<{ fulfilled: number; cancelled: number; expired: number }> {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - RETENTION_DAYS);

  // Delete fulfilled referrals past retention
  const fulfilled = await prisma.referralPost.deleteMany({
    where: {
      status: "FULFILLED",
      fulfilledAt: { not: null, lt: cutoff },
    },
  });

  // Delete cancelled referrals past retention
  const cancelled = await prisma.referralPost.deleteMany({
    where: {
      status: "CANCELLED",
      cancelledAt: { not: null, lt: cutoff },
    },
  });

  // Delete expired referrals past retention (use updatedAt as the expiry timestamp)
  const expired = await prisma.referralPost.deleteMany({
    where: {
      status: "EXPIRED",
      updatedAt: { lt: cutoff },
    },
  });

  return {
    fulfilled: fulfilled.count,
    cancelled: cancelled.count,
    expired: expired.count,
  };
}
