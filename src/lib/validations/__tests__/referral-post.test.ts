import { describe, it, expect } from "vitest";
import { referralPostSchema } from "@/lib/validations/referral-post";

// ─── Fixtures ──────────────────────────────────────────────────────────────────

function validReferral(overrides: Record<string, unknown> = {}) {
  return {
    presentingIssue: "anxiety",
    details: "Client experiencing ongoing anxiety symptoms",
    ageGroup: "adults",
    province: "ON",
    modalities: ["virtual"],
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

  it.each([["presentingIssue"], ["ageGroup"]])(
    "rejects empty string for required field %s",
    (field) => {
      const result = referralPostSchema.safeParse(validReferral({ [field]: "" }));
      expect(result.success).toBe(false);
    },
  );

  // ─── Modality enum ────────────────────────────────────────────────────────

  describe("modalities", () => {
    it.each(["in-person", "virtual", "phone"])("accepts valid modality: %s", (modality) => {
      const result = referralPostSchema.safeParse(validReferral({ modalities: [modality] }));
      expect(result.success).toBe(true);
    });

    it("rejects an invalid modality", () => {
      const result = referralPostSchema.safeParse(
        validReferral({ modalities: ["carrier-pigeon"] }),
      );
      expect(result.success).toBe(false);
    });

    it("rejects an empty array", () => {
      const result = referralPostSchema.safeParse(validReferral({ modalities: [] }));
      expect(result.success).toBe(false);
    });
  });

  // ─── New optional fields ──────────────────────────────────────────────────

  it("validates with all optional fields populated", () => {
    const result = referralPostSchema.safeParse(
      validReferral({
        city: "Toronto",
        participants: "Couples",
        rate: "Sliding scale",
        details: "Prefers evenings",
        therapistGenderPref: "Female",
        therapyTypes: ["CBT", "EMDR"],
        languages: ["English", "French"],
      }),
    );
    expect(result.success).toBe(true);
  });

  // ─── Text length limits ───────────────────────────────────────────────────

  describe("details", () => {
    it("accepts up to 1000 characters", () => {
      const result = referralPostSchema.safeParse(validReferral({ details: "A".repeat(1000) }));
      expect(result.success).toBe(true);
    });

    it("rejects over 1000 characters", () => {
      const result = referralPostSchema.safeParse(validReferral({ details: "A".repeat(1001) }));
      expect(result.success).toBe(false);
    });
  });

  // ─── Array fields ─────────────────────────────────────────────────────────

  describe("therapyTypes", () => {
    it("accepts an array of strings", () => {
      const result = referralPostSchema.safeParse(validReferral({ therapyTypes: ["CBT", "DBT"] }));
      expect(result.success).toBe(true);
    });

    it("accepts an empty array", () => {
      const result = referralPostSchema.safeParse(validReferral({ therapyTypes: [] }));
      expect(result.success).toBe(true);
    });
  });

  describe("languages", () => {
    it("accepts an array of strings", () => {
      const result = referralPostSchema.safeParse(
        validReferral({ languages: ["English", "French"] }),
      );
      expect(result.success).toBe(true);
    });

    it("accepts an empty array", () => {
      const result = referralPostSchema.safeParse(validReferral({ languages: [] }));
      expect(result.success).toBe(true);
    });
  });
});
