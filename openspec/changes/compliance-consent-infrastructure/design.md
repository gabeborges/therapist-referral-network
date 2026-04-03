# Design: Compliance Consent Infrastructure

## Architecture overview

Three consent systems with an auth flow restructure:

1. **Pre-account T&C consent** — new auth flow: remove PrismaAdapter, defer User/Account creation until after terms acceptance. Full-page consent screen between OAuth and onboarding.
2. **Cookie consent** — client-side only (cookie store + React context + banner UI)
3. **Express consent for sensitive fields** — server-side boolean field + form UI + public profile gating

## Auth flow restructure

### Current flow

```
Google OAuth → PrismaAdapter auto-creates User + Account → /onboarding
```

### New flow

```
Google OAuth → JWT session (no DB write) → /auth/consent → accept terms
  → server action creates User + Account (with agreedToTermsAt) → session refresh → /onboarding
```

### Why remove PrismaAdapter

PrismaAdapter automatically creates User + Account rows during the OAuth callback. There is no hook to defer this. Since we use `strategy: "jwt"`, the session lives in a signed cookie — no DB record is needed for authentication. Removing the adapter lets us control exactly when data is written.

### Auth.js callback changes

**auth.config.ts** (Edge-compatible — used by middleware):

```typescript
callbacks: {
  session({ session, token }) {
    if (token.sub) session.user.id = token.sub;
    session.needsConsent = !!token.needsConsent;
    return session;
  },
},
```

**auth.ts** (Node.js — used by handlers):

Remove `adapter: PrismaAdapter(prisma)`. Add jwt callback:

```typescript
async jwt({ token, account, profile, trigger }) {
  if (account && profile) {
    // Sign-in: check if user already exists
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
      // Touch lastActiveAt (fire-and-forget)
      prisma.therapistProfile.update({
        where: { userId: existingUser.id },
        data: { lastActiveAt: new Date() },
      }).catch(() => {});
    } else {
      // New user — needs consent before account creation
      token.needsConsent = true;
      token.pendingProfile = {
        name: profile.name,
        email: profile.email as string,
        image: profile.picture as string,
      };
      token.pendingAccount = {
        provider: account.provider,
        providerAccountId: account.providerAccountId,
      };
    }
  }

  if (trigger === "update") {
    // Session refresh after consent — look up newly created user
    if (token.pendingAccount) {
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
  }

  return token;
}
```

### Middleware changes

In `src/middleware.ts`, add consent gate:

```typescript
export default auth((req) => {
  const { nextUrl } = req;
  const isAuthenticated = !!req.auth;
  const needsConsent = req.auth?.needsConsent;

  const publicPatterns = [
    /^\/$/,
    /^\/auth\//,
    /^\/r\//,
    /^\/api\//,
    /^\/referrals\/fulfill\//,
    /^\/terms$/,
    /^\/privacy$/, // T&C and Privacy pages must be accessible
  ];
  const isPublicRoute = publicPatterns.some((p) => p.test(nextUrl.pathname));

  if (!isAuthenticated && !isPublicRoute) {
    const signInUrl = new URL("/auth/signin", nextUrl.origin);
    signInUrl.searchParams.set("callbackUrl", nextUrl.pathname);
    return Response.redirect(signInUrl);
  }

  // Authenticated but hasn't accepted terms — force consent screen
  if (isAuthenticated && needsConsent && nextUrl.pathname !== "/auth/consent") {
    return Response.redirect(new URL("/auth/consent", nextUrl.origin));
  }
});
```

### TypeScript augmentation

Extend the Auth.js types to include custom JWT/session fields:

```typescript
// src/types/next-auth.d.ts
declare module "next-auth" {
  interface Session {
    needsConsent: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    needsConsent?: boolean;
    pendingProfile?: { name: string; email: string; image: string };
    pendingAccount?: { provider: string; providerAccountId: string };
  }
}
```

## Data model changes

### User — new fields

```prisma
model User {
  // ... existing fields
  agreedToTermsAt  DateTime?
  termsVersion     String?    // e.g. "2026-04-01"
}
```

T&C consent lives on User (not TherapistProfile) because it gates account creation — it happens before any profile data exists.

### TherapistProfile — new field

```prisma
consentCommunitiesServed  Boolean  @default(false)
```

### Cookie consent — no DB fields

Client-side cookie (`consent-preferences`). Shape:

```typescript
type ConsentPreferences = {
  essential: true;
  analytics: boolean;
  sessionRecording: boolean;
  updatedAt: string;
};
```

## Pre-account consent page

### Route: `/auth/consent`

New page: `src/app/auth/consent/page.tsx`

Server component that reads the session. If `!needsConsent`, redirect to `/onboarding`. Otherwise render the consent form.

### Consent screen UI

Full-page layout (same minimal chrome as onboarding — logo only, no nav):

1. Logo + "Therapist Referral Network" header
2. Terms of Service section — rendered from `/terms` page content (or embedded summary)
3. Privacy Policy section — rendered from `/privacy` page content (or embedded summary)
4. Required checkbox: "I have read and agree to the [Terms of Service](/terms) and [Privacy Policy](/privacy)."
5. "Continue" button (disabled until checkbox is checked)

### Accept terms server action

New file: `src/app/auth/consent/actions.ts`

```typescript
async function acceptTerms() {
  const session = await auth();
  const token = await getToken(); // or decode from session

  // Create User
  const user = await prisma.user.create({
    data: {
      name: token.pendingProfile.name,
      email: token.pendingProfile.email,
      image: token.pendingProfile.image,
      agreedToTermsAt: new Date(),
      termsVersion: "2026-04-01",
    },
  });

  // Create Account (link Google OAuth)
  await prisma.account.create({
    data: {
      userId: user.id,
      type: "oidc",
      provider: token.pendingAccount.provider,
      providerAccountId: token.pendingAccount.providerAccountId,
    },
  });

  // Client calls update() to refresh JWT with new user ID
}
```

After the server action succeeds, the client component calls `update()` (from `next-auth/react`) to trigger a JWT refresh, then `router.push("/onboarding")`.

## Cookie consent system

### Consent store

New file: `src/lib/consent/consent-store.ts`

- Read/write consent preferences to a cookie (`consent-preferences`, 365-day expiry, SameSite=Lax)
- `getConsentPreferences()`: returns current preferences or null if no choice made
- `setConsentPreferences(prefs)`: writes cookie
- `hasConsented()`: returns boolean — has the user made any choice

### React context + hook

New file: `src/lib/consent/ConsentProvider.tsx`

- `ConsentProvider` — wraps the app, reads cookie on mount, provides context
- `useConsent()` hook — returns `{ preferences, hasConsented, updatePreferences }`
- Used by future analytics integrations to gate script loading

### Banner component

New file: `src/features/consent/components/CookieConsentBanner.tsx`

- Renders when `hasConsented === false`
- Fixed to bottom of viewport
- Three buttons: "Accept all", "Reject all", "Customize"

### Preferences modal

New file: `src/features/consent/components/ConsentPreferencesModal.tsx`

- Toggle switches: Essential (always on, disabled), Analytics (default off), Session recording (default off)
- "Save preferences" button

### Global access to cookie preferences

Cookie preferences must be accessible from every page — landing page and product pages alike. Two surfaces:

**1. Persistent floating trigger (global)**

New file: `src/features/consent/components/CookieSettingsTrigger.tsx`

- Small floating button in the bottom-left corner of the viewport (standard PIPEDA/GDPR pattern)
- Cookie/shield icon, subtle styling (semi-transparent background, blends with page)
- Only visible AFTER the user has already made a cookie choice (`hasConsented === true`) — while the banner is showing, the trigger is hidden to avoid clutter
- Clicking opens the `ConsentPreferencesModal`
- Rendered in root layout (`src/app/layout.tsx`) alongside `ConsentProvider` — appears on every page

**2. Landing page footer link (additional discoverability)**

In `src/app/page.tsx` (inline footer), add "Cookie preferences" text link alongside existing Terms/Privacy links.

**Why both:** The floating trigger ensures compliance on product pages (which have no footer). The footer link provides a conventional location users expect on the landing page. The trigger disappears when the banner is visible, so users never see both at once.

## Express consent for sensitive fields

### Onboarding — no consent checkbox

The onboarding step for "Communities served" does not include ethnicity or faith orientation fields — those are only available in the full profile edit form. Since there are no sensitive fields to gate, no consent checkbox is needed during onboarding. The `consentCommunitiesServed` field defaults to `false` at profile creation.

### Form integration — profile edit

In `ProfileForm.tsx` section "Communities served":

- Same checkbox, same position
- Toggling off hides fields from form AND public profile
- Toggling on re-shows fields; previously entered data preserved

### Public profile gating

If `consentCommunitiesServed === false`, do not render ethnicity or faith orientation on the public profile. Data stays in DB — just hidden from display.

### Zod schema changes

`src/lib/validations/therapist-profile.ts`:

```typescript
consentCommunitiesServed: z.boolean(),
```

`src/lib/validations/onboarding.ts`:

- No `consentCommunitiesServed` in onboarding schema (field not relevant — sensitive fields are profile-edit only)

### tRPC changes

`src/lib/trpc/routers/therapist.ts`:

- `createProfile`: accept `consentCommunitiesServed`
- `updateProfile`: accept `consentCommunitiesServed` (allow toggling)

## Key decisions

1. **Remove PrismaAdapter** — no User/Account created until terms accepted. Manual creation in server action.
2. **T&C on User model, not TherapistProfile** — consent gates account existence, not profile creation.
3. **JWT carries pending profile during consent** — minimal data (name, email, image, providerAccountId), cleared after User creation.
4. **`update()` to refresh session after consent** — Auth.js v5's session update mechanism triggers jwt callback with `trigger: "update"`.
5. **Cookie consent is client-side only** — no server-side storage needed.
6. **consentCommunitiesServed = false hides, doesn't delete** — data preserved for re-consenting.
7. **Express consent separate from T&C** — different pages, different purposes (PIPEDA requirement).
8. **No consent re-prompting on policy changes** — deferred. `termsVersion` stored for future use.
