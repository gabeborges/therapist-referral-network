import { describe, expect, it, vi, beforeEach } from "vitest";
import type { PrismaClient } from "@/generated/prisma/client";
import { resolveCommunitiesConsent } from "@/features/consent/resolve-communities-consent";

function createMockPrisma(currentConsent: boolean | null) {
  return {
    therapistProfile: {
      findUnique: vi
        .fn()
        .mockResolvedValue(
          currentConsent !== null ? { consentCommunitiesServed: currentConsent } : null,
        ),
    },
  } as unknown as PrismaClient;
}

const USER_ID = "user-1";

describe("resolveCommunitiesConsent", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("field resolution", () => {
    it("retains faithOrientation and ethnicity when consent is true", async () => {
      const prisma = createMockPrisma(true);
      const result = await resolveCommunitiesConsent(
        prisma,
        USER_ID,
        true,
        ["Christian"],
        ["South Asian"],
      );

      expect(result.faithOrientation).toEqual(["Christian"]);
      expect(result.ethnicity).toEqual(["South Asian"]);
    });

    it("forces faithOrientation and ethnicity to [] when consent is false", async () => {
      const prisma = createMockPrisma(true);
      const result = await resolveCommunitiesConsent(
        prisma,
        USER_ID,
        false,
        ["Christian"],
        ["South Asian"],
      );

      expect(result.faithOrientation).toEqual([]);
      expect(result.ethnicity).toEqual([]);
    });

    it("defaults faithOrientation to [] when input is undefined and consent is true", async () => {
      const prisma = createMockPrisma(true);
      const result = await resolveCommunitiesConsent(prisma, USER_ID, true, undefined, undefined);

      expect(result.faithOrientation).toEqual([]);
      expect(result.ethnicity).toEqual([]);
    });
  });

  describe("consent change detection", () => {
    it("detects change from false to true", async () => {
      const prisma = createMockPrisma(false);
      const result = await resolveCommunitiesConsent(prisma, USER_ID, true);

      expect(result.consentLog).toBeDefined();
      expect(result.consentLog!.action).toBe("granted");
    });

    it("detects change from true to false", async () => {
      const prisma = createMockPrisma(true);
      const result = await resolveCommunitiesConsent(prisma, USER_ID, false);

      expect(result.consentLog).toBeDefined();
      expect(result.consentLog!.action).toBe("withdrawn");
    });

    it("no change when both are true", async () => {
      const prisma = createMockPrisma(true);
      const result = await resolveCommunitiesConsent(prisma, USER_ID, true);

      expect(result.consentLog).toBeUndefined();
    });

    it("no change when both are false", async () => {
      const prisma = createMockPrisma(false);
      const result = await resolveCommunitiesConsent(prisma, USER_ID, false);

      expect(result.consentLog).toBeUndefined();
    });

    it("no change when no existing profile (null)", async () => {
      const prisma = createMockPrisma(null);
      const result = await resolveCommunitiesConsent(prisma, USER_ID, true);

      expect(result.consentLog).toBeUndefined();
    });
  });

  describe("ConsentLog on change", () => {
    it("returns log with action 'granted' on false->true", async () => {
      const prisma = createMockPrisma(false);
      const result = await resolveCommunitiesConsent(prisma, USER_ID, true);

      expect(result.consentLog!.action).toBe("granted");
    });

    it("returns log with action 'withdrawn' on true->false", async () => {
      const prisma = createMockPrisma(true);
      const result = await resolveCommunitiesConsent(prisma, USER_ID, false);

      expect(result.consentLog!.action).toBe("withdrawn");
    });

    it("includes fieldsCleared metadata on withdrawal", async () => {
      const prisma = createMockPrisma(true);
      const result = await resolveCommunitiesConsent(prisma, USER_ID, false);

      expect(result.consentLog!.metadata).toEqual({
        fieldsCleared: ["faithOrientation", "ethnicity"],
      });
    });

    it("has no metadata on grant", async () => {
      const prisma = createMockPrisma(false);
      const result = await resolveCommunitiesConsent(prisma, USER_ID, true);

      expect(result.consentLog!.metadata).toBeUndefined();
    });

    it("sets consentType to 'communities_served'", async () => {
      const prisma = createMockPrisma(false);
      const result = await resolveCommunitiesConsent(prisma, USER_ID, true);

      expect(result.consentLog!.consentType).toBe("communities_served");
    });

    it("sets policyVersion to '2026-04-01'", async () => {
      const prisma = createMockPrisma(false);
      const result = await resolveCommunitiesConsent(prisma, USER_ID, true);

      expect(result.consentLog!.policyVersion).toBe("2026-04-01");
    });

    it("sets userId from the provided userId", async () => {
      const prisma = createMockPrisma(false);
      const result = await resolveCommunitiesConsent(prisma, "user-abc", true);

      expect(result.consentLog!.userId).toBe("user-abc");
    });
  });

  describe("no ConsentLog when unchanged", () => {
    it("does NOT create a ConsentLog when consent stays true", async () => {
      const prisma = createMockPrisma(true);
      const result = await resolveCommunitiesConsent(prisma, USER_ID, true);

      expect(result.consentLog).toBeUndefined();
    });

    it("does NOT create a ConsentLog when consent stays false", async () => {
      const prisma = createMockPrisma(false);
      const result = await resolveCommunitiesConsent(prisma, USER_ID, false);

      expect(result.consentLog).toBeUndefined();
    });
  });
});
