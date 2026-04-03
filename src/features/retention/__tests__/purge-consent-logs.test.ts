import { describe, expect, it, vi, beforeEach } from "vitest";
import type { PrismaClient } from "@/generated/prisma/client";
import { purgeConsentLogs } from "@/features/retention/purge-consent-logs";

function createMockPrisma(orphanedUserIds: string[], deleteCount: number) {
  return {
    $queryRaw: vi.fn().mockResolvedValue(orphanedUserIds.map((userId) => ({ userId }))),
    consentLog: {
      deleteMany: vi.fn().mockResolvedValue({ count: deleteCount }),
    },
  } as unknown as PrismaClient;
}

describe("purgeConsentLogs", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("purges logs for orphaned users older than retention period", async () => {
    const prisma = createMockPrisma(["orphan-1", "orphan-2"], 5);
    const result = await purgeConsentLogs(prisma);

    expect(result.purged).toBe(5);
    expect(prisma.consentLog.deleteMany).toHaveBeenCalledWith({
      where: { userId: { in: ["orphan-1", "orphan-2"] } },
    });
  });

  it("returns { purged: 0 } when no logs qualify", async () => {
    const prisma = createMockPrisma([], 0);
    const result = await purgeConsentLogs(prisma);

    expect(result.purged).toBe(0);
    expect(prisma.consentLog.deleteMany).not.toHaveBeenCalled();
  });

  it("passes a cutoff date 25 months in the past to the query", async () => {
    const prisma = createMockPrisma([], 0);
    await purgeConsentLogs(prisma);

    const queryCall = (prisma.$queryRaw as ReturnType<typeof vi.fn>).mock.calls[0]!;
    // Tagged template: first arg is TemplateStringsArray, second is the cutoff date
    const cutoff = queryCall[1] as Date;
    const now = new Date();
    const expectedCutoff = new Date();
    expectedCutoff.setMonth(expectedCutoff.getMonth() - 25);

    // Allow 5s tolerance for test execution time
    expect(Math.abs(cutoff.getTime() - expectedCutoff.getTime())).toBeLessThan(5000);
    expect(cutoff < now).toBe(true);
  });

  it("handles multiple orphaned users in a single run", async () => {
    const prisma = createMockPrisma(["user-a", "user-b", "user-c"], 12);
    const result = await purgeConsentLogs(prisma);

    expect(result.purged).toBe(12);
    const deleteCall = (prisma.consentLog.deleteMany as ReturnType<typeof vi.fn>).mock.calls[0]![0];
    expect(deleteCall.where.userId.in).toHaveLength(3);
  });
});
