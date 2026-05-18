import type { PrismaClient } from "@/generated/prisma/client";

const CONSENT_POLICY_VERSION = "2026-04-01";

/**
 * Executes the full account deletion workflow in a single transaction:
 * 1. Soft-delete the user
 * 2. Clear sensitive community data (PIPEDA — no retention)
 * 3. Cancel open referral posts
 * 4. Revoke auth (sessions + OAuth accounts)
 * 5. Create audit ConsentLog (no FK — survives hard-delete)
 */
export async function requestDeletion(prisma: PrismaClient, userId: string): Promise<void> {
  const now = new Date();

  await prisma.$transaction(async (tx) => {
    // Idempotent: if the user is already soft-deleted, bail out.
    // Without this guard, a double-submit (or Server Action replay)
    // would reset deletedAt and append a duplicate ConsentLog row,
    // shifting the 25-month retention cutoff.
    const current = await tx.user.findUnique({
      where: { id: userId },
      select: { deletedAt: true },
    });
    if (!current || current.deletedAt !== null) {
      return;
    }

    // 1. Soft-delete the user
    await tx.user.update({
      where: { id: userId },
      data: { deletedAt: now, deleteReason: "user_request" },
    });

    // 2. Clear sensitive data immediately (PIPEDA — no retention for sensitive fields)
    const profile = await tx.therapistProfile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (profile) {
      await tx.therapistProfile.update({
        where: { id: profile.id },
        data: {
          consentCommunitiesServed: false,
          faithOrientation: [],
          ethnicity: [],
        },
      });

      // 3. Cancel all OPEN referrals
      await tx.referralPost.updateMany({
        where: { authorId: profile.id, status: "OPEN" },
        data: { status: "CANCELLED", cancelledAt: now },
      });
    }

    // 4. Revoke auth — delete sessions and OAuth accounts
    await tx.session.deleteMany({ where: { userId } });
    await tx.account.deleteMany({ where: { userId } });

    // 5. Consent audit log (survives hard-delete — no FK)
    await tx.consentLog.create({
      data: {
        userId,
        consentType: "account_deletion",
        action: "withdrawn",
        policyVersion: CONSENT_POLICY_VERSION,
      },
    });
  });
}
