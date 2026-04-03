import type { PrismaClient } from "@/generated/prisma/client";

const CONSENT_POLICY_VERSION = "2026-04-01";

export type ConsentLogData = {
  userId: string;
  consentType: "communities_served";
  action: "granted" | "withdrawn";
  policyVersion: string;
  metadata?: { fieldsCleared: string[] };
};

export type ResolvedConsent = {
  faithOrientation: string[];
  ethnicity: string[];
  consentLog?: ConsentLogData;
};

/**
 * Resolves community-served fields based on consent state and detects
 * consent changes for audit logging (PIPEDA 4.5).
 */
export async function resolveCommunitiesConsent(
  prisma: PrismaClient,
  userId: string,
  consentCommunitiesServed: boolean,
  faithOrientation?: string[],
  ethnicity?: string[],
): Promise<ResolvedConsent> {
  // Fetch current consent state for change detection
  const current = await prisma.therapistProfile.findUnique({
    where: { userId },
    select: { consentCommunitiesServed: true },
  });

  const consentChanged =
    current !== null && current.consentCommunitiesServed !== consentCommunitiesServed;

  // Resolve fields — clear sensitive data when consent is withdrawn
  const resolvedFaithOrientation = consentCommunitiesServed ? (faithOrientation ?? []) : [];
  const resolvedEthnicity = consentCommunitiesServed ? (ethnicity ?? []) : [];

  // Build audit log data if consent changed
  let consentLog: ConsentLogData | undefined;
  if (consentChanged) {
    consentLog = {
      userId,
      consentType: "communities_served",
      action: consentCommunitiesServed ? "granted" : "withdrawn",
      policyVersion: CONSENT_POLICY_VERSION,
      ...(consentCommunitiesServed
        ? {}
        : { metadata: { fieldsCleared: ["faithOrientation", "ethnicity"] } }),
    };
  }

  return {
    faithOrientation: resolvedFaithOrientation,
    ethnicity: resolvedEthnicity,
    consentLog,
  };
}
