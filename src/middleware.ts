import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isAuthenticated = !!req.auth;

  // Define public route patterns
  const publicPatterns = [
    /^\/$/, // Home page
    /^\/auth\//, // Auth pages
    /^\/r\//, // Shareable referral links
    /^\/api\//, // API routes
    /^\/referrals\/fulfill\//, // Fulfillment check responses
    /^\/terms$/, // Terms of Service
    /^\/privacy$/, // Privacy Policy
    /^\/cookies$/, // Cookie Policy
  ];

  const isPublicRoute = publicPatterns.some((pattern) => pattern.test(nextUrl.pathname));

  if (!isAuthenticated && !isPublicRoute) {
    const signInUrl = new URL("/auth/signin", nextUrl.origin);
    signInUrl.searchParams.set("callbackUrl", nextUrl.pathname);
    return Response.redirect(signInUrl);
  }

  // Authenticated users shouldn't see signin/signup — send them to referrals
  const isAuthPage = nextUrl.pathname === "/auth/signin" || nextUrl.pathname === "/auth/signup";
  if (isAuthenticated && isAuthPage) {
    return Response.redirect(new URL("/referrals", nextUrl.origin));
  }

  // Authenticated but hasn't accepted terms — force consent screen (skip API routes)
  if (
    isAuthenticated &&
    req.auth?.needsConsent &&
    nextUrl.pathname !== "/auth/consent" &&
    !nextUrl.pathname.startsWith("/api/")
  ) {
    return Response.redirect(new URL("/auth/consent", nextUrl.origin));
  }

  return undefined;
});

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - public assets
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
