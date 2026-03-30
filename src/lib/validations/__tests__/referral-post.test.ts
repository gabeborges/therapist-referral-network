import { describe, it, expect } from "vitest";
import { referralPostSchema } from "@/lib/validations/referral-post";

// ─── Fixtures ──────────────────────────────────────────────────────────────────

function validReferral(overrides: Record<string, unknown> = {}) {
  return {
    presentingIssue: "anxiety",
    ageGroup: "adults",
    locationProvince: "ON",
    modality: "virtual" as const,
    ...overrides,
  };
}

// ─── Core validation ──────────────────────────────────────────────────────────

describe("referralPostSchema", () => {
  it("validates a minimal referral post", () => {
    const result = referralPostSchema.safeParse(validReferral());
    expect(result.success).toBe(true);
  });

  it("rejects an empty object", () => {
    const result = referralPostSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  // ─── Required fields ─────────────────────────────────────────────────────

  it.each([["presentingIssue"], ["ageGroup"], ["locationProvince"]])(
    "rejects empty string for required field %s",
    (field) => {
      const result = referralPostSchema.safeParse(
        validReferral({ [field]: "" }),
      );
      expect(result.success).toBe(false);
    },
  );

  // ─── Modality enum ────────────────────────────────────────────────────────

  describe("modality", () => {
    it.each(["in-person", "virtual", "both"])(
      "accepts valid modality: %s",
      (modality) => {
        const result = referralPostSchema.safeParse(
          validReferral({ modality }),
        );
        expect(result.success).toBe(true);
      },
    );

    it("rejects an invalid modality", () => {
      const result = referralPostSchema.safeParse(
        validReferral({ modality: "phone" }),
      );
      expect(result.success).toBe(false);
    });
  });

  // ─── New optional fields ──────────────────────────────────────────────────

  it("validates with all optional fields populated", () => {
    const result = referralPostSchema.safeParse(
      validReferral({
        locationCity: "Toronto",
        participants: "Couples",
        rateBilling: "Sliding scale",
        additionalNotes: "Prefers evenings",
        clientGender: "Female",
        clientAge: "30s",
        therapistGenderPref: "Female",
        therapyTypes: ["CBT", "EMDR"],
        languageRequirements: ["English", "French"],
        additionalContext: "Client has previous CBT experience",
      }),
    );
    expect(result.success).toBe(true);
  });

  // ─── Text length limits ───────────────────────────────────────────────────

  describe("additionalNotes", () => {
    it("accepts up to 1000 characters", () => {
      const result = referralPostSchema.safeParse(
        validReferral({ additionalNotes: "A".repeat(1000) }),
      );
      expect(result.success).toBe(true);
    });

    it("rejects over 1000 characters", () => {
      const result = referralPostSchema.safeParse(
        validReferral({ additionalNotes: "A".repeat(1001) }),
      );
      expect(result.success).toBe(false);
    });
  });

  describe("additionalContext", () => {
    it("accepts up to 2000 characters", () => {
      const result = referralPostSchema.safeParse(
        validReferral({ additionalContext: "A".repeat(2000) }),
      );
      expect(result.success).toBe(true);
    });

    it("rejects over 2000 characters", () => {
      const result = referralPostSchema.safeParse(
        validReferral({ additionalContext: "A".repeat(2001) }),
      );
      expect(result.success).toBe(false);
    });
  });

  // ─── Array fields ─────────────────────────────────────────────────────────

  describe("therapyTypes", () => {
    it("accepts an array of strings", () => {
      const result = referralPostSchema.safeParse(
        validReferral({ therapyTypes: ["CBT", "DBT"] }),
      );
      expect(result.success).toBe(true);
    });

    it("accepts an empty array", () => {
      const result = referralPostSchema.safeParse(
        validReferral({ therapyTypes: [] }),
      );
      expect(result.success).toBe(true);
    });
  });

  describe("languageRequirements", () => {
    it("accepts an array of strings", () => {
      const result = referralPostSchema.safeParse(
        validReferral({ languageRequirements: ["English", "French"] }),
      );
      expect(result.success).toBe(true);
    });

    it("accepts an empty array", () => {
      const result = referralPostSchema.safeParse(
        validReferral({ languageRequirements: [] }),
      );
      expect(result.success).toBe(true);
    });
  });
});
