"use server";

import { auth, signOut } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function deleteAccount(): Promise<{ success: boolean; error?: string }> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Not authenticated" };
  }

  const userId = session.user.id;
  const now = new Date();

  try {
    await prisma.$transaction(async (tx) => {
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

        // 3. Cancel all OPEN referrals immediately
        await tx.referralPost.updateMany({
          where: { authorId: profile.id, status: "OPEN" },
          data: { status: "CANCELLED", cancelledAt: now },
        });
      }

      // 4. Revoke auth — delete sessions and OAuth accounts
      await tx.session.deleteMany({ where: { userId } });
      await tx.account.deleteMany({ where: { userId } });

      // 5. Consent audit log (no FK — survives hard-delete)
      await tx.consentLog.create({
        data: {
          userId,
          consentType: "account_deletion",
          action: "withdrawn",
          policyVersion: "2026-04-01",
        },
      });
    });
  } catch {
    return { success: false, error: "Failed to delete account. Please try again." };
  }

  // signOut clears the JWT cookie and redirects — throws a redirect internally
  await signOut({ redirectTo: "/" });

  return { success: true };
}
