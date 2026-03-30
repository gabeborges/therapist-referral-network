import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { authConfig } from "@/lib/auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        // Touch lastActiveAt on login (fire-and-forget)
        prisma.therapistProfile
          .update({
            where: { userId: user.id! },
            data: { lastActiveAt: new Date() },
          })
          .catch(() => {
            // Profile may not exist yet (first login before onboarding)
          });
      }
      return token;
    },
    session({ session, token }) {
      if (token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
});
