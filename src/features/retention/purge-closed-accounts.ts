import type { PrismaClient } from "@/generated/prisma/client";

const PURGE_DELAY_DAYS = 30;

export async function purgeClosedAccounts(prisma: PrismaClient): Promise<{ purged: number }> {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - PURGE_DELAY_DAYS);

  // Find users marked for deletion more than 30 days ago
  const users = await prisma.user.findMany({
    where: {
      deletedAt: { not: null, lt: cutoff },
    },
    select: { id: true },
  });

  if (users.length === 0) {
    return { purged: 0 };
  }

  // Hard-delete users — cascades to TherapistProfile → ReferralPost → Notification/FulfillmentCheck
  // ConsentLog entries have no FK and are intentionally preserved (24-month retention)
  const { count } = await prisma.user.deleteMany({
    where: {
      id: { in: users.map((u) => u.id) },
    },
  });

  return { purged: count };
}
