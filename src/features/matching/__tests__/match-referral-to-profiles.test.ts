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
  computeParticipantsScore,
  computeLanguageScore,
  computeTherapyTypeScore,
  scoreProfile,
  matchReferralToProfiles,
} from "@/features/matching/match-referral-to-profiles";

// ─── Fixtures ──────────────────────────────────────────────────────────────────

const NOW = new Date("2026-03-26T12:00:00Z");

function makeProfile(overrides: Partial<TherapistProfileModel> = {}): TherapistProfileModel {
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
    ages: ["adults"],
    insurers: ["Manulife"],
    acceptingClients: true,
    lastActiveAt: new Date("2026-03-25T12:00:00Z"), // 1 day ago
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date("2026-03-25"),
    // New fields
    middleName: null,
    imageUrl: null,
    pronouns: null,
    primaryCredential: null,
    credentials: [],
    websiteUrl: null,
    psychologyTodayUrl: null,
    contactEmail: null,
    licensingLevel: null,
    freeConsultation: false,
    participants: [],
    topSpecialties: [],
    faithOrientation: [],
    ethnicity: [],
    therapyStyle: [],
    therapistGender: null,
    paymentMethods: [],
    proBono: false,
    reducedFees: false,
    acceptsInsurance: false,
    rateIndividual: null,
    rateGroup: null,
    rateFamily: null,
    rateCouples: null,
    ...overrides,
  };
}

function makeReferralPost(overrides: Partial<ReferralPostModel> = {}): ReferralPostModel {
  return {
    id: "referral-1",
    authorId: "author-profile-id",
    presentingIssue: "anxiety",
    ageGroup: "adults",
    city: "Toronto",
    province: "ON",
    modalities: ["virtual"],
    details: null,
    status: "OPEN",
    currentBatch: 0,
    lastDrippedAt: null,
    slug: "abc123",
    createdAt: new Date("2026-03-20"),
    updatedAt: new Date("2026-03-20"),
    // New fields
    participants: null,
    rate: null,
    therapistGenderPref: null,
    therapyTypes: [],
    languages: [],
    additionalContext: null,
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
    expect(computeModalityScore(["virtual"], ["virtual"])).toBe(1);
  });

  it("returns 1 when there is any overlap between arrays", () => {
    expect(computeModalityScore(["virtual", "in-person"], ["virtual"])).toBe(1);
  });

  it("returns 1 when referral has multiple modalities with overlap", () => {
    expect(computeModalityScore(["in-person"], ["in-person", "virtual"])).toBe(1);
  });

  it("returns 0 when there is no match", () => {
    expect(computeModalityScore(["in-person"], ["virtual"])).toBe(0);
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
  const base = {
    bio: null as string | null,
    therapeuticApproach: [] as string[],
    languages: [] as string[],
    insurers: [] as string[],
    participants: [] as string[],
    topSpecialties: [] as string[],
  };

  it("returns 0.5 when all optional fields are filled", () => {
    expect(
      computeCompletenessBoost({
        ...base,
        bio: "Some bio",
        therapeuticApproach: ["CBT"],
        languages: ["English"],
        insurers: ["Manulife"],
        participants: ["Individuals"],
        topSpecialties: ["Anxiety"],
      }),
    ).toBe(0.5);
  });

  it("returns 0 when no optional fields are filled", () => {
    expect(computeCompletenessBoost(base)).toBe(0);
  });

  it("returns proportional score for partial fill", () => {
    // 3 out of 6 filled = (3/6)*0.5 = 0.25
    expect(
      computeCompletenessBoost({
        ...base,
        bio: "A bio",
        languages: ["French"],
        participants: ["Couples"],
      }),
    ).toBe(0.25);
  });

  it("treats empty string bio as unfilled", () => {
    // 1 out of 6 filled = (1/6)*0.5 ≈ 0.083
    const result = computeCompletenessBoost({
      ...base,
      bio: "",
      therapeuticApproach: ["CBT"],
    });
    expect(result).toBeCloseTo(0.083, 2);
  });
});

// ─── New scoring helpers (participants, language, therapyType) ─────────────────

describe("computeParticipantsScore", () => {
  it("returns 1 when the profile includes the referral participant type", () => {
    expect(computeParticipantsScore(["Individuals", "Couples"], "Couples")).toBe(1);
  });

  it("returns 0 when the profile does not include the referral participant type", () => {
    expect(computeParticipantsScore(["Individuals"], "Couples")).toBe(0);
  });

  it("returns 0 when referralParticipants is null", () => {
    expect(computeParticipantsScore(["Individuals", "Couples"], null)).toBe(0);
  });

  it("returns 0 when profile participants is empty", () => {
    expect(computeParticipantsScore([], "Individuals")).toBe(0);
  });

  it("is case-insensitive", () => {
    expect(computeParticipantsScore(["individuals"], "Individuals")).toBe(1);
  });
});

describe("computeLanguageScore", () => {
  it("returns 1 when there is at least one language overlap", () => {
    expect(computeLanguageScore(["English", "French"], ["French"])).toBe(1);
  });

  it("returns 1 for multiple overlapping languages", () => {
    expect(computeLanguageScore(["English", "French", "Spanish"], ["French", "Spanish"])).toBe(1);
  });

  it("returns 0 when there is no overlap", () => {
    expect(computeLanguageScore(["English"], ["French", "Mandarin"])).toBe(0);
  });

  it("returns 0 when referral languages is empty", () => {
    expect(computeLanguageScore(["English", "French"], [])).toBe(0);
  });

  it("returns 0 when profile languages is empty", () => {
    expect(computeLanguageScore([], ["English"])).toBe(0);
  });

  it("is case-insensitive", () => {
    expect(computeLanguageScore(["english"], ["English"])).toBe(1);
  });
});

describe("computeTherapyTypeScore", () => {
  it("returns 1 when there is at least one therapy type overlap", () => {
    expect(computeTherapyTypeScore(["CBT", "DBT"], ["CBT"])).toBe(1);
  });

  it("returns 1 for multiple overlapping therapy types", () => {
    expect(computeTherapyTypeScore(["CBT", "DBT", "EMDR"], ["DBT", "EMDR"])).toBe(1);
  });

  it("returns 0 when there is no overlap", () => {
    expect(computeTherapyTypeScore(["CBT"], ["EMDR", "Somatic"])).toBe(0);
  });

  it("returns 0 when referral therapy types is empty", () => {
    expect(computeTherapyTypeScore(["CBT", "DBT"], [])).toBe(0);
  });

  it("returns 0 when profile approaches is empty", () => {
    expect(computeTherapyTypeScore([], ["CBT"])).toBe(0);
  });

  it("is case-insensitive", () => {
    expect(computeTherapyTypeScore(["cbt"], ["CBT"])).toBe(1);
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
      participants: false,
      language: false,
      therapyType: false,
    });
    // specialty=1 + ageGroup=1 + modality=1 + location=2 + participants=0 + language=0 = 5
    // decay = 1.0 (1 day ago), completeness = (4/6)*0.5 = 0.333 (bio, approach, languages, insurers filled; participants, topSpecialties empty)
    // score = 5 * 1.0 + 0.333 = 5.333
    expect(result.score).toBe(5.333);
    expect(result.profileId).toBe("profile-1");
  });

  it("scores a partial match (2/4 dimensions)", () => {
    const profile = makeProfile({
      specialties: ["trauma"], // no match
      ages: ["children"], // no match
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
      participants: false,
      language: false,
      therapyType: false,
    });
    // specialty=0 + ageGroup=0 + modality=1 + location=2 = 3
    // decay = 1.0, completeness = (4/6)*0.5 = 0.333
    // score = 3 * 1.0 + 0.333 = 3.333
    expect(result.score).toBe(3.333);
  });

  it("applies activity decay for inactive profiles", () => {
    const profile = makeProfile({
      lastActiveAt: new Date("2026-01-01T00:00:00Z"), // very old
    });
    const referral = makeReferralPost();

    const result = scoreProfile(profile, referral, NOW);

    // specialty=1 + ageGroup=1 + modality=1 + location=2 = 5
    // decay = 0.2, completeness = (4/6)*0.5 = 0.333
    // score = 5 * 0.2 + 0.333 = 1.333
    expect(result.score).toBe(1.333);
  });

  it("scores participants dimension when referral specifies participants", () => {
    const profile = makeProfile({ participants: ["Couples", "Family"] });
    const referral = makeReferralPost({ participants: "Couples" });

    const result = scoreProfile(profile, referral, NOW);

    expect(result.matchDimensions.participants).toBe(true);
  });

  it("does not score participants when referral has no participants", () => {
    const profile = makeProfile({ participants: ["Couples"] });
    const referral = makeReferralPost({ participants: null });

    const result = scoreProfile(profile, referral, NOW);

    expect(result.matchDimensions.participants).toBe(false);
  });

  it("scores language dimension when referral has language requirements", () => {
    const profile = makeProfile({ languages: ["English", "French"] });
    const referral = makeReferralPost({ languages: ["French"] });

    const result = scoreProfile(profile, referral, NOW);

    expect(result.matchDimensions.language).toBe(true);
  });

  it("does not score language when referral has no language requirements", () => {
    const profile = makeProfile({ languages: ["English", "French"] });
    const referral = makeReferralPost({ languages: [] });

    const result = scoreProfile(profile, referral, NOW);

    expect(result.matchDimensions.language).toBe(false);
  });

  it("scores therapyType dimension when referral has therapy types", () => {
    const profile = makeProfile({ therapeuticApproach: ["CBT", "EMDR"] });
    const referral = makeReferralPost({ therapyTypes: ["EMDR"] });

    const result = scoreProfile(profile, referral, NOW);

    expect(result.matchDimensions.therapyType).toBe(true);
  });

  it("does not score therapyType when referral has no therapy types", () => {
    const profile = makeProfile({ therapeuticApproach: ["CBT"] });
    const referral = makeReferralPost({ therapyTypes: [] });

    const result = scoreProfile(profile, referral, NOW);

    expect(result.matchDimensions.therapyType).toBe(false);
  });

  it("adds all new dimension scores to the total", () => {
    const profile = makeProfile({
      participants: ["Couples"],
      languages: ["French"],
      therapeuticApproach: ["EMDR"],
    });
    const referral = makeReferralPost({
      participants: "Couples",
      languages: ["French"],
      therapyTypes: ["EMDR"],
    });

    const result = scoreProfile(profile, referral, NOW);

    expect(result.matchDimensions.participants).toBe(true);
    expect(result.matchDimensions.language).toBe(true);
    expect(result.matchDimensions.therapyType).toBe(true);
    // Base (specialty=1 + ageGroup=1 + modality=1 + location=2 + participants=1 + language=1 + therapyType=1) = 8
    // decay=1.0, completeness includes therapeuticApproach + languages + participants = (5/6)*0.5 = 0.417
    expect(result.score).toBeGreaterThan(7);
  });

  it("scores zero when no dimensions match and profile is incomplete", () => {
    const profile = makeProfile({
      specialties: ["grief"],
      ages: ["children"],
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
      participants: false,
      language: false,
      therapyType: false,
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
    const profiles = [makeProfile({ id: "p1" }), makeProfile({ id: "p2" })];
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

    const findManyCall = (prisma.therapistProfile.findMany as ReturnType<typeof vi.fn>).mock
      .calls[0]![0] as { where: { id: { notIn: string[] } } };
    expect(findManyCall.where.id.notIn).toContain("author-profile-id");
  });

  it("filters to acceptingClients = true and country = CA in the query", async () => {
    const prisma = createMockPrisma([]);
    const referral = makeReferralPost();

    await matchReferralToProfiles(referral, prisma);

    const findManyCall = (prisma.therapistProfile.findMany as ReturnType<typeof vi.fn>).mock
      .calls[0]![0] as {
      where: { acceptingClients: boolean; country: string };
    };
    expect(findManyCall.where.acceptingClients).toBe(true);
    expect(findManyCall.where.country).toBe("CA");
  });

  it("limits results to batchSize", async () => {
    const profiles = Array.from({ length: 10 }, (_, i) => makeProfile({ id: `p${i}` }));
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
        ages: ["children"],
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
        ages: ["adults"],
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
