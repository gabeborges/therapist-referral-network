import { auth } from "@/lib/auth";

export default auth((req) => {
  const { nextUrl } = req;
  const isAuthenticated = !!req.auth;

  // Define public route patterns
  const publicPatterns = [
    /^\/$/,                    // Home page
    /^\/auth\//,               // Auth pages
    /^\/r\//,                  // Shareable referral links
    /^\/api\//,                // API routes
    /^\/referrals\/fulfill\//, // Fulfillment check responses
  ];

  const isPublicRoute = publicPatterns.some((pattern) =>
    pattern.test(nextUrl.pathname),
  );

  if (!isAuthenticated && !isPublicRoute) {
    const signInUrl = new URL("/auth/signin", nextUrl.origin);
    signInUrl.searchParams.set("callbackUrl", nextUrl.pathname);
    return Response.redirect(signInUrl);
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
