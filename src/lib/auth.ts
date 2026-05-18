import NextAuth from "next-auth";
import { prisma } from "@/lib/prisma";
import { authConfig } from "@/lib/auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, account, profile, trigger }) {
      if (account && profile) {
        // Sign-in: check if user already exists in our DB
        const existingUser = await prisma.user.findFirst({
          where: {
            accounts: {
              some: {
                provider: account.provider,
                providerAccountId: account.providerAccountId,
              },
            },
          },
        });

        if (existingUser) {
          // Returning user
          token.sub = existingUser.id;
          token.needsConsent = false;
          // Touch lastActiveAt. Awaited so the write completes before
          // the lambda returns; updateMany with where ensures no throw
          // when the profile row doesn't exist yet (consented but not
          // onboarded).
          await prisma.therapistProfile.updateMany({
            where: { userId: existingUser.id },
            data: { lastActiveAt: new Date() },
          });
        } else {
          // New user — needs consent before account creation
          token.needsConsent = true;
          token.pendingProfile = {
            name: profile.name ?? "",
            email: profile.email as string,
            image: (profile.picture as string) ?? "",
          };
          token.pendingAccount = {
            provider: account.provider,
            providerAccountId: account.providerAccountId,
          };
        }
      }

      // After consent, detect the newly created user and clear needsConsent
      if (token.needsConsent && token.pendingAccount) {
        const user = await prisma.user.findFirst({
          where: {
            accounts: {
              some: {
                provider: token.pendingAccount.provider,
                providerAccountId: token.pendingAccount.providerAccountId,
              },
            },
          },
        });
        if (user) {
          token.sub = user.id;
          token.needsConsent = false;
          delete token.pendingProfile;
          delete token.pendingAccount;
        }
      }

      // Check soft-delete status (throttled: every 10s).
      // Tightened from 60s so a freshly soft-deleted user has at most
      // a 10-second window with a valid JWT against protected routes.
      // Skip for new users who haven't completed consent yet
      // (token.sub is Google's ID, not a DB user ID).
      if (token.sub && !token.isDeleted && !token.needsConsent) {
        const now = Date.now();
        const lastCheck = token.deletedCheckedAt ?? 0;
        if (now - lastCheck > 10_000) {
          const user = await prisma.user.findUnique({
            where: { id: token.sub },
            select: { deletedAt: true },
          });
          if (!user || user.deletedAt) {
            token.isDeleted = true;
          }
          token.deletedCheckedAt = now;
        }
      }

      return token;
    },
  },
});
