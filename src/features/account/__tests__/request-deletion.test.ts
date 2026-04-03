import { describe, expect, it, vi, beforeEach } from "vitest";
import type { PrismaClient } from "@/generated/prisma/client";
import { requestDeletion } from "@/features/account/request-deletion";

function createMockTx(hasProfile = true) {
  return {
    user: {
      update: vi.fn().mockResolvedValue({}),
    },
    therapistProfile: {
      findUnique: vi.fn().mockResolvedValue(hasProfile ? { id: "profile-1" } : null),
      update: vi.fn().mockResolvedValue({}),
    },
    referralPost: {
      updateMany: vi.fn().mockResolvedValue({ count: 2 }),
    },
    session: {
      deleteMany: vi.fn().mockResolvedValue({ count: 1 }),
    },
    account: {
      deleteMany: vi.fn().mockResolvedValue({ count: 1 }),
    },
    consentLog: {
      create: vi.fn().mockResolvedValue({}),
    },
  };
}

function createMockPrisma(tx: ReturnType<typeof createMockTx>) {
  return {
    $transaction: vi.fn().mockImplementation(async (fn: (tx: unknown) => Promise<void>) => fn(tx)),
  } as unknown as PrismaClient;
}

const USER_ID = "user-1";

describe("requestDeletion", () => {
  let tx: ReturnType<typeof createMockTx>;
  let prisma: PrismaClient;

  beforeEach(() => {
    vi.restoreAllMocks();
    tx = createMockTx();
    prisma = createMockPrisma(tx);
  });

  describe("user soft-deletion", () => {
    it("sets deletedAt and deleteReason on user", async () => {
      await requestDeletion(prisma, USER_ID);

      expect(tx.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: USER_ID },
          data: expect.objectContaining({
            deletedAt: expect.any(Date),
            deleteReason: "user_request",
          }),
        }),
      );
    });
  });

  describe("sensitive data clearing", () => {
    it("sets consentCommunitiesServed to false and clears arrays", async () => {
      await requestDeletion(prisma, USER_ID);

      expect(tx.therapistProfile.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: "profile-1" },
          data: {
            consentCommunitiesServed: false,
            faithOrientation: [],
            ethnicity: [],
          },
        }),
      );
    });
  });

  describe("referral cancellation", () => {
    it("cancels all OPEN referral posts", async () => {
      await requestDeletion(prisma, USER_ID);

      expect(tx.referralPost.updateMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { authorId: "profile-1", status: "OPEN" },
          data: expect.objectContaining({
            status: "CANCELLED",
            cancelledAt: expect.any(Date),
          }),
        }),
      );
    });
  });

  describe("auth revocation", () => {
    it("deletes all sessions for the user", async () => {
      await requestDeletion(prisma, USER_ID);

      expect(tx.session.deleteMany).toHaveBeenCalledWith({ where: { userId: USER_ID } });
    });

    it("deletes all OAuth accounts for the user", async () => {
      await requestDeletion(prisma, USER_ID);

      expect(tx.account.deleteMany).toHaveBeenCalledWith({ where: { userId: USER_ID } });
    });
  });

  describe("ConsentLog for deletion", () => {
    it("creates ConsentLog with correct fields", async () => {
      await requestDeletion(prisma, USER_ID);

      expect(tx.consentLog.create).toHaveBeenCalledWith({
        data: {
          userId: USER_ID,
          consentType: "account_deletion",
          action: "withdrawn",
          policyVersion: "2026-04-01",
        },
      });
    });
  });

  describe("when user has no profile", () => {
    beforeEach(() => {
      tx = createMockTx(false);
      prisma = createMockPrisma(tx);
    });

    it("skips profile update and referral cancellation", async () => {
      await requestDeletion(prisma, USER_ID);

      expect(tx.therapistProfile.update).not.toHaveBeenCalled();
      expect(tx.referralPost.updateMany).not.toHaveBeenCalled();
    });

    it("still soft-deletes the user", async () => {
      await requestDeletion(prisma, USER_ID);

      expect(tx.user.update).toHaveBeenCalled();
    });

    it("still creates ConsentLog", async () => {
      await requestDeletion(prisma, USER_ID);

      expect(tx.consentLog.create).toHaveBeenCalled();
    });

    it("still revokes auth sessions and accounts", async () => {
      await requestDeletion(prisma, USER_ID);

      expect(tx.session.deleteMany).toHaveBeenCalled();
      expect(tx.account.deleteMany).toHaveBeenCalled();
    });
  });

  describe("transaction atomicity", () => {
    it("wraps all operations in $transaction", async () => {
      await requestDeletion(prisma, USER_ID);

      expect(prisma.$transaction as ReturnType<typeof vi.fn>).toHaveBeenCalledTimes(1);
    });

    it("propagates transaction errors", async () => {
      tx.user.update.mockRejectedValue(new Error("DB error"));

      await expect(requestDeletion(prisma, USER_ID)).rejects.toThrow("DB error");
    });
  });
});
