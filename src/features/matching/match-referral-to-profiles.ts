import type { PrismaClient } from "@/generated/prisma/client";
import type { TherapistProfileModel } from "@/generated/prisma/models/TherapistProfile";
import type { ReferralPostModel } from "@/generated/prisma/models/ReferralPost";

// ─── Public types ──────────────────────────────────────────────────────────────

export type MatchDimensions = {
  specialty: boolean;
  ageGroup: boolean;
  modality: boolean;
  location: boolean;
};

export type ProfileMatch = {
  profileId: string;
  score: number;
  matchDimensions: MatchDimensions;
};

// ─── Scoring helpers (exported for unit testing) ────────────────────────────

const MS_PER_DAY = 1000 * 60 * 60 * 24;

export function computeSpecialtyScore(
  profileSpecialties: string[],
  presentingIssue: string,
): number {
  const issues = [presentingIssue.toLowerCase()];
  const overlap = profileSpecialties.filter((s) =>
    issues.includes(s.toLowerCase()),
  ).length;
  return Math.min(overlap, 3);
}

export function computeAgeGroupScore(
  profileAgeGroups: string[],
  referralAgeGroup: string,
): number {
  return profileAgeGroups
    .map((g) => g.toLowerCase())
    .includes(referralAgeGroup.toLowerCase())
    ? 1
    : 0;
}

export function computeModalityScore(
  profileModalities: string[],
  referralModality: string,
): number {
  const pMods = profileModalities.map((m) => m.toLowerCase());
  const rMod = referralModality.toLowerCase();

  if (rMod === "both") return 1;
  if (pMods.includes("both")) return 1;
  if (pMods.includes(rMod)) return 1;
  return 0;
}

export function computeLocationScore(
  profileProvince: string,
  profileCity: string,
  referralProvince: string,
  referralCity: string | null,
): number {
  if (!referralCity) {
    // Province-only comparison
    return profileProvince.toLowerCase() === referralProvince.toLowerCase()
      ? 1
      : 0;
  }
  if (profileCity.toLowerCase() === referralCity.toLowerCase()) return 2;
  if (profileProvince.toLowerCase() === referralProvince.toLowerCase())
    return 1;
  return 0;
}

export function computeActivityDecay(
  lastActiveAt: Date,
  now: Date = new Date(),
): number {
  const daysSinceActive = (now.getTime() - lastActiveAt.getTime()) / MS_PER_DAY;
  if (daysSinceActive <= 7) return 1.0;
  if (daysSinceActive <= 14) return 0.8;
  if (daysSinceActive <= 30) return 0.5;
  return 0.2;
}

export function computeCompletenessBoost(profile: {
  bio: string | null;
  therapeuticApproach: string[];
  languages: string[];
  insurers: string[];
}): number {
  let filled = 0;
  if (profile.bio && profile.bio.length > 0) filled++;
  if (profile.therapeuticApproach.length > 0) filled++;
  if (profile.languages.length > 0) filled++;
  if (profile.insurers.length > 0) filled++;
  return (filled / 4) * 0.5;
}

/**
 * Scores a single therapist profile against a referral post.
 * Pure function — no database access.
 */
export function scoreProfile(
  profile: TherapistProfileModel,
  referralPost: ReferralPostModel,
  now: Date = new Date(),
): ProfileMatch {
  const specialty = computeSpecialtyScore(
    profile.specialties,
    referralPost.presentingIssue,
  );
  const ageGroup = computeAgeGroupScore(
    profile.ageGroups,
    referralPost.ageGroup,
  );
  const modality = computeModalityScore(
    profile.modalities,
    referralPost.modality,
  );
  const location = computeLocationScore(
    profile.province,
    profile.city,
    referralPost.locationProvince,
    referralPost.locationCity,
  );

  const activityDecay = computeActivityDecay(profile.lastActiveAt, now);
  const completenessBoost = computeCompletenessBoost(profile);

  const rawScore = specialty + ageGroup + modality + location;
  const finalScore = rawScore * activityDecay + completenessBoost;

  return {
    profileId: profile.id,
    score: Math.round(finalScore * 1000) / 1000, // 3 decimal places
    matchDimensions: {
      specialty: specialty > 0,
      ageGroup: ageGroup > 0,
      modality: modality > 0,
      location: location > 0,
    },
  };
}

// ─── Main matching function ────────────────────────────────────────────────────

/**
 * Matches a referral post against all eligible therapist profiles.
 * Returns the top `batchSize` matches sorted by score descending.
 */
export async function matchReferralToProfiles(
  referralPost: ReferralPostModel,
  prisma: PrismaClient,
  batchSize: number = 5,
): Promise<ProfileMatch[]> {
  // 1. Fetch already-notified profile IDs for this referral
  const alreadyNotified = await prisma.referralNotification.findMany({
    where: { referralPostId: referralPost.id },
    select: { recipientId: true },
  });
  const notifiedIds = new Set(alreadyNotified.map((n) => n.recipientId));

  // 2. Query eligible profiles
  const eligibleProfiles = await prisma.therapistProfile.findMany({
    where: {
      acceptingClients: true,
      country: "CA",
      id: { notIn: [referralPost.authorId] },
    },
  });

  // 3. Filter out already-notified profiles and score the rest
  const now = new Date();
  const scored = eligibleProfiles
    .filter((profile) => !notifiedIds.has(profile.id))
    .map((profile) => scoreProfile(profile, referralPost, now));

  // 4. Sort by score descending, take top N
  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, batchSize);
}
