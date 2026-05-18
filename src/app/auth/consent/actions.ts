"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const TERMS_VERSION = "2026-04-01";

export async function acceptTerms(): Promise<{ success: boolean; error?: string }> {
  const session = await auth();
  if (!session) {
    return { success: false, error: "Not authenticated" };
  }

  const { pendingProfile, pendingAccount } = session;

  if (!pendingProfile || !pendingAccount) {
    return { success: false, error: "No pending profile data" };
  }

  // Check if user already exists (race condition guard + soft-deleted re-registration)
  const existing = await prisma.user.findUnique({
    where: { email: pendingProfile.email },
  });
  if (existing) {
    if (existing.deletedAt) {
      // Reactivate soft-deleted user: wipe old profile data (PIPEDA fresh-consent)
      // and create new OAuth account so the user starts clean from onboarding.
      await prisma.$transaction(async (tx) => {
        // Delete old profile + cascaded data (referrals, notifications, etc.)
        await tx.therapistProfile.deleteMany({ where: { userId: existing.id } });

        await tx.user.update({
          where: { id: existing.id },
          data: {
            deletedAt: null,
            deleteReason: null,
            name: pendingProfile.name,
            image: pendingProfile.image,
            agreedToTermsAt: new Date(),
            termsVersion: TERMS_VERSION,
          },
        });

        await tx.account.create({
          data: {
            userId: existing.id,
            type: "oidc",
            provider: pendingAccount.provider,
            providerAccountId: pendingAccount.providerAccountId,
          },
        });

        await tx.consentLog.create({
          data: {
            userId: existing.id,
            consentType: "terms",
            action: "granted",
            policyVersion: TERMS_VERSION,
          },
        });
      });
      return { success: true };
    }

    // Active user with the same email already exists. The session JWT
    // callback only clears `needsConsent` once an Account row matches
    // the inbound provider tuple. If that Account is missing, returning
    // `{ success: true }` would silently send the user back into the
    // consent screen → infinite loop. Ensure the Account exists.
    const matchingAccount = await prisma.account.findUnique({
      where: {
        provider_providerAccountId: {
          provider: pendingAccount.provider,
          providerAccountId: pendingAccount.providerAccountId,
        },
      },
      select: { userId: true },
    });

    if (matchingAccount === null) {
      // Try to link the inbound provider to the existing user. If a
      // different provider already owns the email, fail loudly so the
      // user is told to sign in with their original provider rather
      // than getting stuck in a redirect loop.
      const otherProviderAccount = await prisma.account.findFirst({
        where: { userId: existing.id },
        select: { provider: true },
      });

      if (otherProviderAccount && otherProviderAccount.provider !== pendingAccount.provider) {
        return {
          success: false,
          error: `This email is already registered via ${otherProviderAccount.provider}. Please sign in with that provider.`,
        };
      }

      await prisma.account.create({
        data: {
          userId: existing.id,
          type: "oidc",
          provider: pendingAccount.provider,
          providerAccountId: pendingAccount.providerAccountId,
        },
      });
    } else if (matchingAccount.userId !== existing.id) {
      // Shouldn't happen given the email lookup, but guard anyway.
      return {
        success: false,
        error: "This account is linked to a different user.",
      };
    }

    return { success: true };
  }

  // Create User + Account in a transaction
  await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        name: pendingProfile.name,
        email: pendingProfile.email,
        image: pendingProfile.image,
        agreedToTermsAt: new Date(),
        termsVersion: TERMS_VERSION,
      },
    });

    await tx.account.create({
      data: {
        userId: user.id,
        type: "oidc",
        provider: pendingAccount.provider,
        providerAccountId: pendingAccount.providerAccountId,
      },
    });

    // Consent audit log — record terms acceptance
    await tx.consentLog.create({
      data: {
        userId: user.id,
        consentType: "terms",
        action: "granted",
        policyVersion: TERMS_VERSION,
      },
    });
  });

  return { success: true };
}
