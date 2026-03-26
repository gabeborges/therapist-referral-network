import { describe, it, expect } from "vitest";
import { therapistProfileSchema } from "@/lib/validations/therapist-profile";

describe("therapistProfileSchema", () => {
  it("should validate a complete profile", () => {
    const validProfile = {
      firstName: "Jane",
      lastName: "Doe",
      displayName: "Dr. Jane Doe",
      city: "Toronto",
      province: "ON",
      country: "CA" as const,
      specialties: ["anxiety"],
      modalities: ["virtual"],
      therapeuticApproach: ["CBT"],
      languages: ["English"],
      ageGroups: ["adults"],
      acceptsInsurance: true,
      directBilling: false,
      reducedFees: false,
      acceptingClients: true,
    };

    const result = therapistProfileSchema.safeParse(validProfile);
    expect(result.success).toBe(true);
  });

  it("should reject a profile without required fields", () => {
    const result = therapistProfileSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});
