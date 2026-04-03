# Tasks: Compliance Consent Infrastructure

## Milestone 1: Schema & Auth Flow

### ~~Task 1.1: Prisma schema — add consent fields~~ [x]

- **Files**: `prisma/schema.prisma`
- **What**:
  1. Add `agreedToTermsAt DateTime?` to User model
  2. Add `termsVersion String?` to User model
  3. Add `consentCommunitiesServed Boolean @default(false)` to TherapistProfile model
- **Acceptance**: `npx prisma db push` succeeds; fields visible in Supabase Studio

### ~~Task 1.2: TypeScript type augmentation~~ [x]

- **Files**: `src/types/next-auth.d.ts` (new file)
- **What**:
  1. Extend `Session` interface: add `needsConsent: boolean`
  2. Extend `JWT` interface: add `needsConsent?: boolean`, `pendingProfile?: { name: string; email: string; image: string }`, `pendingAccount?: { provider: string; providerAccountId: string }`
- **Acceptance**: No TS errors when accessing `session.needsConsent` or custom JWT fields

### ~~Task 1.3: Remove PrismaAdapter + manual user lookup~~ [x]

- **Files**: `src/lib/auth.ts`, `src/lib/auth.config.ts`
- **What**:
  1. Remove `adapter: PrismaAdapter(prisma)` from auth.ts
  2. Remove `@auth/prisma-adapter` import
  3. Move `session` callback to auth.config.ts (Edge-compatible — maps `token.sub` → `session.user.id`, `token.needsConsent` → `session.needsConsent`)
  4. Add `jwt` callback in auth.ts:
     - On sign-in (`account && profile` present): query `prisma.user.findFirst` by provider + providerAccountId
     - If found (returning user): set `token.sub = user.id`, `token.needsConsent = false`, touch lastActiveAt
     - If not found (new user): set `token.needsConsent = true`, store `pendingProfile` + `pendingAccount` in token
     - On `trigger === "update"`: re-query user by pendingAccount, update token with user ID, clear pending data
- **Acceptance**: Returning users sign in normally (session has correct user ID). New users get `needsConsent = true` in session. No User/Account rows created for new users during OAuth.

### ~~Task 1.4: Middleware — consent gate~~ [x]

- **Files**: `src/middleware.ts`
- **What**:
  1. Read `req.auth?.needsConsent` from session
  2. Add `/terms` and `/privacy` to public route patterns
  3. After the unauthenticated check: if authenticated + `needsConsent` + path is not `/auth/consent` → redirect to `/auth/consent`
- **Acceptance**: New users are redirected to `/auth/consent` after OAuth. Returning users pass through normally. Unauthenticated behavior unchanged.

---

## Milestone 2: Pre-Account Consent Page

### ~~Task 2.1: Consent page — server component~~ [x]

- **Files**: `src/app/auth/consent/page.tsx` (new)
- **What**:
  1. Server component: read session via `auth()`. If `!needsConsent`, redirect to `/onboarding`
  2. Render minimal layout (same chrome as onboarding — logo only, no nav)
  3. Display Terms of Service section (summary or link to /terms)
  4. Display Privacy Policy section (summary or link to /privacy)
  5. Render client component form with:
     - Required checkbox: "I have read and agree to the Terms of Service and Privacy Policy." (with inline links opening in new tab)
     - "Continue" button (disabled until checkbox checked)
- **Acceptance**: Page renders for new users. Returning users redirected away.

### ~~Task 2.2: Accept terms server action~~ [x]

- **Files**: `src/app/auth/consent/actions.ts` (new)
- **What**:
  1. `acceptTerms` server action: reads JWT token to get `pendingProfile` + `pendingAccount`
  2. Creates User row: `{ name, email, image, agreedToTermsAt: new Date(), termsVersion: "2026-04-01" }`
  3. Creates Account row: `{ userId, type: "oidc", provider, providerAccountId }`
  4. Returns success indicator to client
- **Acceptance**: After action, User + Account rows exist in DB with `agreedToTermsAt` populated

### ~~Task 2.3: Consent form client component~~ [x]

- **Files**: `src/app/auth/consent/ConsentForm.tsx` (new)
- **What**:
  1. Client component with checkbox state and "Continue" button
  2. On submit: call `acceptTerms` server action
  3. On success: call `update()` from `next-auth/react` to refresh JWT
  4. After session refresh: `router.push("/onboarding")`
  5. Handle loading/error states
- **Acceptance**: Full flow works: check box → Continue → User created → session refreshed → onboarding page loads

---

## Milestone 3: Cookie Consent System

### ~~Task 3.1: Consent store (cookie read/write)~~ [x]

- **Files**: `src/lib/consent/consent-store.ts` (new)
- **What**:
  1. Define `ConsentPreferences` type
  2. `getConsentPreferences()` — reads `consent-preferences` cookie, returns parsed or null
  3. `setConsentPreferences(prefs)` — writes cookie (365-day expiry, SameSite=Lax, path=/)
  4. `hasConsented()` — returns boolean
- **Acceptance**: Can set and read consent preferences from cookie in browser

### ~~Task 3.2: ConsentProvider + useConsent hook~~ [x]

- **Files**: `src/lib/consent/ConsentProvider.tsx` (new)
- **What**:
  1. `'use client'` component
  2. `ConsentContext` with `{ preferences, hasConsented, updatePreferences }`
  3. `ConsentProvider` — reads cookie on mount, provides context
  4. `useConsent()` hook — consumes context
- **Acceptance**: Hook returns current consent state; updating preferences persists to cookie

### ~~Task 3.3: Add ConsentProvider to root layout~~ [x]

- **Files**: `src/app/layout.tsx`
- **What**:
  1. Wrap children with `ConsentProvider` (inside existing providers)
- **Acceptance**: `useConsent()` works from any client component

### ~~Task 3.4: Cookie consent banner~~ [x]

- **Files**: `src/features/consent/components/CookieConsentBanner.tsx` (new)
- **What**:
  1. Fixed overlay at bottom of viewport
  2. Brief description + three buttons: "Accept all" / "Reject all" / "Customize"
  3. Only renders when `hasConsented === false`
  4. Tailwind styling consistent with existing design tokens
- **Acceptance**: Banner appears on first visit, disappears after any choice

### ~~Task 3.5: Consent preferences modal~~ [x]

- **Files**: `src/features/consent/components/ConsentPreferencesModal.tsx` (new)
- **What**:
  1. Toggle switches: Essential (always on, disabled), Analytics (default off), Session recording (default off)
  2. "Save preferences" button
  3. Accepts `open` and `onClose` props
- **Acceptance**: Modal opens/closes, toggles work, preferences persist to cookie

### ~~Task 3.6: Persistent floating cookie settings trigger~~ [x]

- **Files**: `src/features/consent/components/CookieSettingsTrigger.tsx` (new), `src/app/layout.tsx`
- **What**:
  1. Small floating button, fixed bottom-left corner of viewport
  2. Cookie/shield icon, subtle semi-transparent styling
  3. Only visible when `hasConsented === true` (hidden while banner is showing — avoids double UI)
  4. Clicking opens `ConsentPreferencesModal`
  5. Render in root layout alongside `ConsentProvider` — appears on every page (landing + product)
- **Acceptance**: Button visible on all pages after initial cookie choice; clicking opens preferences modal; hidden while banner is active

### ~~Task 3.7: Landing page footer "Cookie preferences" link~~ [x]

- **Files**: `src/app/page.tsx`
- **What**:
  1. Add "Cookie preferences" text link to inline footer (alongside Terms/Privacy)
  2. Small client component wrapper for the link + modal state
- **Acceptance**: Link visible in landing page footer; clicking opens preferences modal

---

## Milestone 4: Express Consent for Sensitive Fields

### ~~Task 4.1: Zod schema updates~~ [x]

- **Files**: `src/lib/validations/therapist-profile.ts`, `src/lib/validations/onboarding.ts`
- **What**:
  1. Add `consentCommunitiesServed: z.boolean()` to profile schema
  2. Add `consentCommunitiesServed` to onboarding communities step pick
- **Acceptance**: Schemas validate correctly with new field

### ~~Task 4.2: tRPC — accept consentCommunitiesServed~~ [x]

- **Files**: `src/lib/trpc/routers/therapist.ts`
- **What**:
  1. `createProfile`: add `consentCommunitiesServed` to input schema and Prisma create data
  2. `updateProfile`: add `consentCommunitiesServed` to input schema and Prisma update data
- **Acceptance**: Profile create/update accepts and persists consent field

### ~~Task 4.3: Onboarding — no consent checkbox needed~~ [x]

- **Files**: N/A
- **What**: Onboarding step 3 does not include ethnicity or faith orientation fields — those are profile-edit only. No consent checkbox needed. `consentCommunitiesServed` defaults to `false` at profile creation in `handleComplete`.
- **Acceptance**: No consent checkbox in onboarding; field defaults to false

### ~~Task 4.4: Profile edit — communities consent checkbox~~ [x]

- **Files**: `src/features/profile/components/ProfileForm.tsx`
- **What**:
  1. Same checkbox in "Communities served" section, before ethnicity/faith fields
  2. Pre-populated from existing `consentCommunitiesServed` value
  3. Toggling off hides fields from form; toggling on re-shows with preserved data
- **Acceptance**: Checkbox controls field visibility; saved data not deleted on toggle

### ~~Task 4.5: Public profile — gate sensitive fields~~ [x]

- **Files**: profile view/display component (ProfileView, slug page, etc.)
- **What**:
  1. If `consentCommunitiesServed === false`, do not render ethnicity or faith orientation
  2. All other fields render normally
- **Acceptance**: Profile without consent shows no ethnicity/faith; profile with consent shows them

---

## Milestone 5: Verification

### ~~Task 5.1: Grep for ungated sensitive field displays~~ [x]

- **Files**: all `src/`
- **What**:
  1. Grep for any rendering of ethnicity/faith fields not gated by `consentCommunitiesServed`
  2. Check referral detail pages, email templates, notification templates
  3. Fix any ungated displays
- **Acceptance**: Zero places where ethnicity/faith render without consent check

### ~~Task 5.2: Update tests~~ [x]

- **Files**: validation tests, onboarding tests
- **What**:
  1. Add `consentCommunitiesServed` to test fixtures
  2. Test: profile schema accepts boolean consent field
  3. Test: new user flow — no User created until acceptTerms called
  4. Verify existing auth tests still pass after PrismaAdapter removal
- **Acceptance**: All tests pass

---

## Implementation order

```
Milestone 1 (Schema + Auth)        Milestone 2 (Consent Page)
────────────────────────           ──────────────────────────
1.1 Prisma fields ──┐              2.1 Consent page
1.2 Type augment    ├────────────→ 2.2 Accept terms action
1.3 Remove adapter  │              2.3 Consent form client
1.4 Middleware gate ─┘

    ┌──────────── after Milestone 2 ────────────┐
    │                                            │
    ▼                                            ▼
Milestone 3 (Cookie Consent)     Milestones 4+5 (Express Consent)
──────────────────────────       ─────────────────────────────────
3.1 Consent store                4.1 Zod schemas
3.2 Provider + hook              4.2 tRPC changes
3.3 Root layout                  4.3 Onboarding checkbox
3.4 Banner                       4.4 Profile edit checkbox
3.5 Preferences modal            4.5 Public profile gate
3.6 Floating trigger (global)    5.1 Grep ungated fields
3.7 Footer link (landing)        5.2 Update tests
```

**Critical path**: Milestone 1 → Milestone 2 (must be sequential — auth flow change is prerequisite for consent page)

**Parallel tracks after Milestone 2**: Milestone 3 (cookie consent) is fully independent from Milestones 4+5 (express consent)

**Complexity key**: [S] = small (1-2 files, <50 LOC), [M] = medium (2-4 files, 50-150 LOC)
