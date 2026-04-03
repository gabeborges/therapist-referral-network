import type { PrismaClient } from "@/generated/prisma/client";

// Consent logs are retained for 25 months after the user's most recent log entry,
// but only purged for users who have been hard-deleted (no User record exists).
// This gives 24+ months of compliance proof after account closure.
const RETENTION_MONTHS = 25;

export async function purgeConsentLogs(prisma: PrismaClient): Promise<{ purged: number }> {
  const cutoff = new Date();
  cutoff.setMonth(cutoff.getMonth() - RETENTION_MONTHS);

  // Find ConsentLog userIds that have no corresponding User record
  // AND whose most recent log entry is older than the retention period
  const orphanedLogs = await prisma.$queryRaw<{ userId: string }[]>`
    SELECT DISTINCT cl."userId"
    FROM "ConsentLog" cl
    LEFT JOIN "User" u ON u.id = cl."userId"
    WHERE u.id IS NULL
    GROUP BY cl."userId"
    HAVING MAX(cl."createdAt") < ${cutoff}
  `;

  if (orphanedLogs.length === 0) {
    return { purged: 0 };
  }

  const userIds = orphanedLogs.map((r) => r.userId);

  const { count } = await prisma.consentLog.deleteMany({
    where: { userId: { in: userIds } },
  });

  return { purged: count };
}
