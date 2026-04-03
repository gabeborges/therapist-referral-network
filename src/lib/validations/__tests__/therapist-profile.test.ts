import { describe, it, expect } from "vitest";
import { therapistProfileSchema } from "@/lib/validations/therapist-profile";

// ─── Fixtures ──────────────────────────────────────────────────────────────────

function validProfile(overrides: Record<string, unknown> = {}) {
  return {
    firstName: "Jane",
    lastName: "Doe",
    displayName: "Dr. Jane Doe",
    city: "Toronto",
    province: "ON",
    country: "CA" as const,
    specialties: ["spec-id-1"],
    modalities: ["virtual"],
    therapeuticApproach: ["tt-id-1"],
    languages: ["lang-id-1"],
    ages: ["adults"],
    participants: ["Individual"],
    consentCommunitiesServed: false,
    freeConsultation: false,
    proBono: false,
    reducedFees: false,
    acceptsInsurance: false,
    acceptingClients: true,
    ...overrides,
  };
}

// ─── Core validation ──────────────────────────────────────────────────────────

describe("therapistProfileSchema", () => {
  it("should validate a complete profile", () => {
    const result = therapistProfileSchema.safeParse(validProfile());
    expect(result.success).toBe(true);
  });

  it("should reject a profile without required fields", () => {
    const result = therapistProfileSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  // ─── Required field enforcement ───────────────────────────────────────────

  it.each([["firstName"], ["lastName"], ["city"], ["province"]])(
    "rejects empty string for required field %s",
    (field) => {
      const result = therapistProfileSchema.safeParse(validProfile({ [field]: "" }));
      expect(result.success).toBe(false);
    },
  );

  it.each([["specialties"], ["modalities"], ["ages"], ["participants"]])(
    "rejects empty array for required array field %s",
    (field) => {
      const result = therapistProfileSchema.safeParse(validProfile({ [field]: [] }));
      expect(result.success).toBe(false);
    },
  );

  it("rejects country other than CA", () => {
    const result = therapistProfileSchema.safeParse(validProfile({ country: "US" }));
    expect(result.success).toBe(false);
  });

  // ─── URL fields ───────────────────────────────────────────────────────────

  describe("URL fields", () => {
    it.each([["imageUrl"], ["websiteUrl"], ["psychologyTodayUrl"]])(
      "accepts a valid URL for %s",
      (field) => {
        const result = therapistProfileSchema.safeParse(
          validProfile({ [field]: "https://example.com/path" }),
        );
        expect(result.success).toBe(true);
      },
    );

    it.each([["imageUrl"], ["websiteUrl"], ["psychologyTodayUrl"]])(
      "accepts an empty string for optional URL field %s",
      (field) => {
        const result = therapistProfileSchema.safeParse(validProfile({ [field]: "" }));
        expect(result.success).toBe(true);
      },
    );

    it.each([["websiteUrl"], ["psychologyTodayUrl"]])("rejects an invalid URL for %s", (field) => {
      const result = therapistProfileSchema.safeParse(validProfile({ [field]: "not-a-url" }));
      expect(result.success).toBe(false);
    });

    it("accepts null for imageUrl", () => {
      const result = therapistProfileSchema.safeParse(validProfile({ imageUrl: null }));
      expect(result.success).toBe(true);
    });
  });

  // ─── Email field ──────────────────────────────────────────────────────────

  describe("contactEmail", () => {
    it("accepts a valid email", () => {
      const result = therapistProfileSchema.safeParse(
        validProfile({ contactEmail: "jane@example.com" }),
      );
      expect(result.success).toBe(true);
    });

    it("accepts an empty string", () => {
      const result = therapistProfileSchema.safeParse(validProfile({ contactEmail: "" }));
      expect(result.success).toBe(true);
    });

    it("rejects an invalid email", () => {
      const result = therapistProfileSchema.safeParse(
        validProfile({ contactEmail: "not-an-email" }),
      );
      expect(result.success).toBe(false);
    });
  });

  // ─── Array constraints ────────────────────────────────────────────────────

  describe("credentials", () => {
    it("accepts up to 3 credentials", () => {
      const result = therapistProfileSchema.safeParse(
        validProfile({ credentials: ["RP", "RSW", "PhD"] }),
      );
      expect(result.success).toBe(true);
    });

    it("rejects more than 3 credentials", () => {
      const result = therapistProfileSchema.safeParse(
        validProfile({ credentials: ["RP", "RSW", "PhD", "MD"] }),
      );
      expect(result.success).toBe(false);
    });
  });

  describe("topSpecialties", () => {
    it("accepts up to 3 top specialties", () => {
      const result = therapistProfileSchema.safeParse(
        validProfile({ topSpecialties: ["Anxiety", "Depression", "Trauma"] }),
      );
      expect(result.success).toBe(true);
    });

    it("rejects more than 3 top specialties", () => {
      const result = therapistProfileSchema.safeParse(
        validProfile({
          topSpecialties: ["Anxiety", "Depression", "Trauma", "Grief"],
        }),
      );
      expect(result.success).toBe(false);
    });
  });

  describe("faithOrientation", () => {
    it("defaults to empty array when omitted", () => {
      const result = therapistProfileSchema.safeParse(validProfile());
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.faithOrientation).toEqual([]);
      }
    });

    it("accepts an empty array", () => {
      const result = therapistProfileSchema.safeParse(validProfile({ faithOrientation: [] }));
      expect(result.success).toBe(true);
    });

    it("accepts multiple values", () => {
      const result = therapistProfileSchema.safeParse(
        validProfile({ faithOrientation: ["Christian", "Buddhist", "Jewish"] }),
      );
      expect(result.success).toBe(true);
    });
  });

  // ─── Bio max length ───────────────────────────────────────────────────────

  describe("bio", () => {
    it("accepts a bio within the 500 character limit", () => {
      const result = therapistProfileSchema.safeParse(validProfile({ bio: "A".repeat(500) }));
      expect(result.success).toBe(true);
    });

    it("rejects a bio over 500 characters", () => {
      const result = therapistProfileSchema.safeParse(validProfile({ bio: "A".repeat(501) }));
      expect(result.success).toBe(false);
    });
  });

  // ─── Optional fields accept undefined ─────────────────────────────────────

  it("validates when all optional fields are omitted", () => {
    const result = therapistProfileSchema.safeParse(validProfile());
    expect(result.success).toBe(true);
  });

  it("validates with all optional fields populated", () => {
    const result = therapistProfileSchema.safeParse(
      validProfile({
        bio: "Experienced therapist",
        middleName: "Marie",
        imageUrl: "https://example.com/photo.jpg",
        pronouns: "she/her",
        primaryCredential: "RP",
        credentials: ["RP", "RSW"],
        websiteUrl: "https://janedoe.ca",
        psychologyTodayUrl: "https://psychologytoday.com/ca/therapists/12345",
        contactEmail: "jane@practice.ca",
        licensingLevel: "Fully Licensed",
        topSpecialties: ["Anxiety", "Depression"],
        participants: ["Individuals", "Couples"],
        groups: ["ag-id-1"],
        faithOrientation: ["Christian", "Buddhist"],
        ethnicity: ["South Asian"],
        therapyStyle: ["Relational", "Direct"],
        therapistGender: "Female",
        insurers: ["Manulife"],
        paymentMethods: ["pm-id-1"],
        proBono: true,
        reducedFees: false,
        acceptsInsurance: true,
        rateIndividual: 150,
        rateGroup: 80,
        rateFamily: 200,
        rateCouples: 180,
      }),
    );
    expect(result.success).toBe(true);
  });

  // ─── Boolean fields ───────────────────────────────────────────────────────

  it.each([
    ["consentCommunitiesServed"],
    ["freeConsultation"],
    ["acceptingClients"],
    ["proBono"],
    ["reducedFees"],
    ["acceptsInsurance"],
  ])("rejects non-boolean for required boolean field %s", (field) => {
    const result = therapistProfileSchema.safeParse(validProfile({ [field]: "yes" }));
    expect(result.success).toBe(false);
  });

  // ─── Rate fields ──────────────────────────────────────────────────────────

  describe.each([["rateIndividual"], ["rateGroup"], ["rateFamily"], ["rateCouples"]])(
    "%s",
    (field) => {
      it("accepts a positive number", () => {
        const result = therapistProfileSchema.safeParse(validProfile({ [field]: 200 }));
        expect(result.success).toBe(true);
      });

      it("rejects zero", () => {
        const result = therapistProfileSchema.safeParse(validProfile({ [field]: 0 }));
        expect(result.success).toBe(false);
      });

      it("rejects a negative number", () => {
        const result = therapistProfileSchema.safeParse(validProfile({ [field]: -50 }));
        expect(result.success).toBe(false);
      });
    },
  );
});
