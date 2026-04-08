import Google from "next-auth/providers/google";
import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    session({ session, token }) {
      if (token.sub) {
        session.user.id = token.sub;
      }
      session.needsConsent = !!token.needsConsent;
      session.isDeleted = !!token.isDeleted;
      if (token.pendingProfile) session.pendingProfile = token.pendingProfile;
      if (token.pendingAccount) session.pendingAccount = token.pendingAccount;
      return session;
    },
  },
} satisfies NextAuthConfig;
