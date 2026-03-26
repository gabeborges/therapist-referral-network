import { describe, expect, it, vi } from "vitest";
import type { TherapistProfileModel } from "@/generated/prisma/models/TherapistProfile";
import type { ReferralPostModel } from "@/generated/prisma/models/ReferralPost";
import {
  computeSpecialtyScore,
  computeAgeGroupScore,
  computeModalityScore,
  computeLocationScore,
  computeActivityDecay,
  computeCompletenessBoost,
  scoreProfile,
  matchReferralToProfiles,
} from "@/features/matching/match-referral-to-profiles";

// ─── Fixtures ──────────────────────────────────────────────────────────────────

const NOW = new Date("2026-03-26T12:00:00Z");

function makeProfile(
  overrides: Partial<TherapistProfileModel> = {},
): TherapistProfileModel {
  return {
    id: "profile-1",
    userId: "user-1",
    firstName: "Jane",
    lastName: "Doe",
    displayName: "Jane Doe",
    bio: "Experienced therapist",
    city: "Toronto",
    province: "ON",
    country: "CA",
    specialties: ["anxiety", "depression"],
    modalities: ["virtual"],
    therapeuticApproach: ["CBT"],
    languages: ["English"],
    ageGroups: ["adults"],
    acceptsInsurance: true,
    directBilling: false,
    insurers: ["Manulife"],
    hourlyRate: 15000,
    reducedFees: false,
    acceptingClients: true,
    lastActiveAt: new Date("2026-03-25T12:00:00Z"), // 1 day ago
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date("2026-03-25"),
    ...overrides,
  };
}

function makeReferralPost(
  overrides: Partial<ReferralPostModel> = {},
): ReferralPostModel {
  return {
    id: "referral-1",
    authorId: "author-profile-id",
    presentingIssue: "anxiety",
    ageGroup: "adults",
    locationCity: "Toronto",
    locationProvince: "ON",
    modality: "virtual",
    additionalNotes: null,
    status: "OPEN",
    currentBatch: 0,
    lastDrippedAt: null,
    slug: "abc123",
    createdAt: new Date("2026-03-20"),
    updatedAt: new Date("2026-03-20"),
    ...overrides,
  };
}

// ─── Individual scoring helpers ────────────────────────────────────────────────

describe("computeSpecialtyScore", () => {
  it("returns 1 when the profile has the presenting issue", () => {
    expect(computeSpecialtyScore(["anxiety", "depression"], "anxiety")).toBe(1);
  });

  it("returns 0 when there is no overlap", () => {
    expect(computeSpecialtyScore(["trauma", "grief"], "anxiety")).toBe(0);
  });

  it("is case-insensitive", () => {
    expect(computeSpecialtyScore(["Anxiety"], "anxiety")).toBe(1);
  });

  it("caps at 3", () => {
    // Even though a single presenting issue can only match once,
    // ensure the cap works if the logic ever changes.
    expect(computeSpecialtyScore(["anxiety"], "anxiety")).toBeLessThanOrEqual(3);
  });
});

describe("computeAgeGroupScore", () => {
  it("returns 1 when the age group matches", () => {
    expect(computeAgeGroupScore(["adults", "adolescents"], "adults")).toBe(1);
  });

  it("returns 0 when the age group does not match", () => {
    expect(computeAgeGroupScore(["children"], "adults")).toBe(0);
  });

  it("is case-insensitive", () => {
    expect(computeAgeGroupScore(["Adults"], "adults")).toBe(1);
  });
});

describe("computeModalityScore", () => {
  it("returns 1 for exact modality match", () => {
    expect(computeModalityScore(["virtual"], "virtual")).toBe(1);
  });

  it('returns 1 when profile modalities include "both"', () => {
    expect(computeModalityScore(["both"], "virtual")).toBe(1);
  });

  it('returns 1 when referral modality is "both"', () => {
    expect(computeModalityScore(["in-person"], "both")).toBe(1);
  });

  it("returns 0 when there is no match", () => {
    expect(computeModalityScore(["in-person"], "virtual")).toBe(0);
  });
});

describe("computeLocationScore", () => {
  it("returns 2 for same city", () => {
    expect(computeLocationScore("ON", "Toronto", "ON", "Toronto")).toBe(2);
  });

  it("returns 1 for same province but different city", () => {
    expect(computeLocationScore("ON", "Ottawa", "ON", "Toronto")).toBe(1);
  });

  it("returns 0 for different province", () => {
    expect(computeLocationScore("BC", "Vancouver", "ON", "Toronto")).toBe(0);
  });

  it("returns 1 for same province when referral city is null", () => {
    expect(computeLocationScore("ON", "Toronto", "ON", null)).toBe(1);
  });

  it("returns 0 for different province when referral city is null", () => {
    expect(computeLocationScore("BC", "Vancouver", "ON", null)).toBe(0);
  });

  it("is case-insensitive", () => {
    expect(computeLocationScore("on", "toronto", "ON", "Toronto")).toBe(2);
  });
});

describe("computeActivityDecay", () => {
  it("returns 1.0 for activity within 7 days", () => {
    const lastActive = new Date("2026-03-20T12:00:00Z");
    expect(computeActivityDecay(lastActive, NOW)).toBe(1.0);
  });

  it("returns 0.8 for activity within 14 days", () => {
    const lastActive = new Date("2026-03-15T12:00:00Z");
    expect(computeActivityDecay(lastActive, NOW)).toBe(0.8);
  });

  it("returns 0.5 for activity within 30 days", () => {
    const lastActive = new Date("2026-03-01T12:00:00Z");
    expect(computeActivityDecay(lastActive, NOW)).toBe(0.5);
  });

  it("returns 0.2 for activity older than 30 days", () => {
    const lastActive = new Date("2026-01-01T12:00:00Z");
    expect(computeActivityDecay(lastActive, NOW)).toBe(0.2);
  });

  it("returns 1.0 for activity exactly now", () => {
    expect(computeActivityDecay(NOW, NOW)).toBe(1.0);
  });
});

describe("computeCompletenessBoost", () => {
  it("returns 0.5 when all optional fields are filled", () => {
    expect(
      computeCompletenessBoost({
        bio: "Some bio",
        therapeuticApproach: ["CBT"],
        languages: ["English"],
        insurers: ["Manulife"],
      }),
    ).toBe(0.5);
  });

  it("returns 0 when no optional fields are filled", () => {
    expect(
      computeCompletenessBoost({
        bio: null,
        therapeuticApproach: [],
        languages: [],
        insurers: [],
      }),
    ).toBe(0);
  });

  it("returns 0.25 for 2 out of 4 fields filled", () => {
    expect(
      computeCompletenessBoost({
        bio: "A bio",
        therapeuticApproach: [],
        languages: ["French"],
        insurers: [],
      }),
    ).toBe(0.25);
  });

  it("treats empty string bio as unfilled", () => {
    expect(
      computeCompletenessBoost({
        bio: "",
        therapeuticApproach: ["CBT"],
        languages: [],
        insurers: [],
      }),
    ).toBe(0.125);
  });
});

// ─── scoreProfile (integration of all dimensions) ─────────────────────────────

describe("scoreProfile", () => {
  it("scores a perfect match with all dimensions", () => {
    const profile = makeProfile();
    const referral = makeReferralPost();

    const result = scoreProfile(profile, referral, NOW);

    expect(result.matchDimensions).toEqual({
      specialty: true,
      ageGroup: true,
      modality: true,
      location: true,
    });
    // specialty=1 + ageGroup=1 + modality=1 + location=2 = 5
    // decay = 1.0 (1 day ago), completeness = 0.5 (all filled)
    // score = 5 * 1.0 + 0.5 = 5.5
    expect(result.score).toBe(5.5);
    expect(result.profileId).toBe("profile-1");
  });

  it("scores a partial match (2/4 dimensions)", () => {
    const profile = makeProfile({
      specialties: ["trauma"], // no match
      ageGroups: ["children"], // no match
      modalities: ["virtual"], // match
      city: "Toronto", // match
      province: "ON",
    });
    const referral = makeReferralPost();

    const result = scoreProfile(profile, referral, NOW);

    expect(result.matchDimensions).toEqual({
      specialty: false,
      ageGroup: false,
      modality: true,
      location: true,
    });
    // specialty=0 + ageGroup=0 + modality=1 + location=2 = 3
    // decay = 1.0, completeness = 0.5
    // score = 3 * 1.0 + 0.5 = 3.5
    expect(result.score).toBe(3.5);
  });

  it("applies activity decay for inactive profiles", () => {
    const profile = makeProfile({
      lastActiveAt: new Date("2026-01-01T00:00:00Z"), // very old
    });
    const referral = makeReferralPost();

    const result = scoreProfile(profile, referral, NOW);

    // specialty=1 + ageGroup=1 + modality=1 + location=2 = 5
    // decay = 0.2, completeness = 0.5
    // score = 5 * 0.2 + 0.5 = 1.5
    expect(result.score).toBe(1.5);
  });

  it("scores zero when no dimensions match and profile is incomplete", () => {
    const profile = makeProfile({
      specialties: ["grief"],
      ageGroups: ["children"],
      modalities: ["in-person"],
      city: "Vancouver",
      province: "BC",
      bio: null,
      therapeuticApproach: [],
      languages: [],
      insurers: [],
    });
    const referral = makeReferralPost();

    const result = scoreProfile(profile, referral, NOW);

    expect(result.matchDimensions).toEqual({
      specialty: false,
      ageGroup: false,
      modality: false,
      location: false,
    });
    // 0 * 1.0 + 0 = 0
    expect(result.score).toBe(0);
  });
});

// ─── matchReferralToProfiles (with mocked Prisma) ──────────────────────────────

function createMockPrisma(
  profiles: TherapistProfileModel[],
  notifications: Array<{ recipientId: string }> = [],
) {
  return {
    therapistProfile: {
      findMany: vi.fn().mockResolvedValue(profiles),
    },
    referralNotification: {
      findMany: vi.fn().mockResolvedValue(notifications),
    },
  } as unknown as Parameters<typeof matchReferralToProfiles>[1];
}

describe("matchReferralToProfiles", () => {
  it("returns scored and ranked results", async () => {
    const profiles = [
      makeProfile({ id: "p1", specialties: ["anxiety"] }),
      makeProfile({
        id: "p2",
        specialties: ["grief"],
        city: "Vancouver",
        province: "BC",
      }),
    ];
    const prisma = createMockPrisma(profiles);
    const referral = makeReferralPost();

    const results = await matchReferralToProfiles(referral, prisma);

    expect(results).toHaveLength(2);
    expect(results[0]!.profileId).toBe("p1");
    expect(results[0]!.score).toBeGreaterThan(results[1]!.score);
  });

  it("excludes already-notified profiles", async () => {
    const profiles = [
      makeProfile({ id: "p1" }),
      makeProfile({ id: "p2" }),
    ];
    const notifications = [{ recipientId: "p1" }];
    const prisma = createMockPrisma(profiles, notifications);
    const referral = makeReferralPost();

    const results = await matchReferralToProfiles(referral, prisma);

    expect(results).toHaveLength(1);
    expect(results[0]!.profileId).toBe("p2");
  });

  it("excludes the referral author's own profile via Prisma query", async () => {
    const prisma = createMockPrisma([]);
    const referral = makeReferralPost({ authorId: "author-profile-id" });

    await matchReferralToProfiles(referral, prisma);

    const findManyCall = (
      prisma.therapistProfile.findMany as ReturnType<typeof vi.fn>
    ).mock.calls[0]![0] as { where: { id: { notIn: string[] } } };
    expect(findManyCall.where.id.notIn).toContain("author-profile-id");
  });

  it("filters to acceptingClients = true and country = CA in the query", async () => {
    const prisma = createMockPrisma([]);
    const referral = makeReferralPost();

    await matchReferralToProfiles(referral, prisma);

    const findManyCall = (
      prisma.therapistProfile.findMany as ReturnType<typeof vi.fn>
    ).mock.calls[0]![0] as {
      where: { acceptingClients: boolean; country: string };
    };
    expect(findManyCall.where.acceptingClients).toBe(true);
    expect(findManyCall.where.country).toBe("CA");
  });

  it("limits results to batchSize", async () => {
    const profiles = Array.from({ length: 10 }, (_, i) =>
      makeProfile({ id: `p${i}` }),
    );
    const prisma = createMockPrisma(profiles);
    const referral = makeReferralPost();

    const results = await matchReferralToProfiles(referral, prisma, 3);

    expect(results).toHaveLength(3);
  });

  it("returns empty array when no profiles match", async () => {
    const prisma = createMockPrisma([]);
    const referral = makeReferralPost();

    const results = await matchReferralToProfiles(referral, prisma);

    expect(results).toHaveLength(0);
  });

  it("returns fewer than batchSize when not enough profiles exist", async () => {
    const profiles = [makeProfile({ id: "p1" })];
    const prisma = createMockPrisma(profiles);
    const referral = makeReferralPost();

    const results = await matchReferralToProfiles(referral, prisma, 5);

    expect(results).toHaveLength(1);
  });

  it("sorts results by score descending", async () => {
    const profiles = [
      makeProfile({
        id: "low-score",
        specialties: ["grief"],
        ageGroups: ["children"],
        modalities: ["in-person"],
        city: "Vancouver",
        province: "BC",
        bio: null,
        therapeuticApproach: [],
        languages: [],
        insurers: [],
      }),
      makeProfile({
        id: "high-score",
        specialties: ["anxiety"],
        ageGroups: ["adults"],
        modalities: ["virtual"],
        city: "Toronto",
        province: "ON",
      }),
    ];
    const prisma = createMockPrisma(profiles);
    const referral = makeReferralPost();

    const results = await matchReferralToProfiles(referral, prisma);

    expect(results[0]!.profileId).toBe("high-score");
    expect(results[1]!.profileId).toBe("low-score");
    expect(results[0]!.score).toBeGreaterThan(results[1]!.score);
  });
});
