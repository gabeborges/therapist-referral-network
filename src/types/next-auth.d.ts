import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    needsConsent: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    needsConsent?: boolean;
    pendingProfile?: {
      name: string;
      email: string;
      image: string;
    };
    pendingAccount?: {
      provider: string;
      providerAccountId: string;
    };
  }
}
