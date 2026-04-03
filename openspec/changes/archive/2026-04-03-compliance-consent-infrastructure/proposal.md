# Proposal: Compliance Consent Infrastructure

## What

Add three consent mechanisms required for PIPEDA compliance before launch:

1. **Cookie consent banner** — blocks non-essential scripts until user opts in (analytics/session recording categories). No analytics scripts exist today, so this establishes the gate before any are integrated.
2. **Pre-account T&C agreement** — full-page consent screen shown after Google OAuth but before any User record is created in the database. Displays Terms of Service and Privacy Policy text with a required agreement checkbox. No data is stored on our platform until the user accepts.
3. **Express consent for sensitive fields** — separate consent checkbox for ethnicity and faith orientation fields in the onboarding and profile edit forms, gating public display of those fields.

## Why

1. **No data before consent** — PIPEDA Principle 4.3 requires consent before collecting personal information. By deferring User/Account creation until after T&C acceptance, no personal data touches our database until the user has explicitly agreed.
2. **PIPEDA Principle 4.3.6** requires opt-in (not opt-out) for sensitive data. The ethnicity and faith fields currently save without any consent acknowledgement.
3. **Cookie consent** is required before loading analytics scripts. No scripts exist yet, but building the gate now avoids a retrofit when GA or PostHog are added.
4. **Launch readiness** — the compliance MVP plan identifies these as blocking items before the platform can accept real users.

## Auth flow change

Current flow: Google OAuth → PrismaAdapter auto-creates User + Account → onboarding

New flow: Google OAuth → JWT session only (no DB write) → `/auth/consent` screen → on accept, server action creates User + Account with `agreedToTermsAt` → onboarding

This requires removing PrismaAdapter from the NextAuth config. Since we already use JWT session strategy, the session lives in a signed cookie — no DB record is needed for authentication itself. User/Account creation becomes explicit, triggered only after consent.

## Scope

### In scope

1. **Auth flow restructure** — remove PrismaAdapter, manage User/Account creation manually after consent
2. **Pre-account consent page** (`/auth/consent`) — full-page screen with T&C and Privacy Policy text, required agreement checkbox, Continue button. `agreedToTermsAt` + `termsVersion` stored on User model at creation time.
3. **Middleware update** — authenticated users who haven't consented (no User in DB) are redirected to `/auth/consent`
4. **Cookie consent banner + preferences modal** — consent store (cookie-based), banner UI with Accept All / Reject All / Customize, preferences modal with per-category toggles, footer link to reopen preferences
5. **Express consent checkbox** — `consentCommunitiesServed` boolean field in TherapistProfile, checkbox adjacent to ethnicity/faith fields in both onboarding and profile edit forms, gates public display of those fields
6. **Schema migration** — `agreedToTermsAt` + `termsVersion` on User model, `consentCommunitiesServed` on TherapistProfile

### Out of scope

- Privacy Policy page content (#2 in compliance plan — content/legal task)
- Terms of Service page content (same — placeholder pages already exist at /terms and /privacy)
- GA or PostHog integration (consent banner gates future integration)
- Quebec-specific requirements (Law 25 — deferred per compliance plan)
- Consent re-prompting on policy version changes (future enhancement)

## Success criteria

| Metric                | Target                                                                          |
| --------------------- | ------------------------------------------------------------------------------- |
| Pre-account consent   | No User row exists in DB until after T&C accepted                               |
| Auth flow             | Google OAuth → consent screen → User creation → onboarding (no PrismaAdapter)   |
| Cookie consent banner | Renders on first visit, persists choice, accessible from footer                 |
| Script gating         | `useConsent()` hook returns category consent state; no scripts load without it  |
| Express consent       | Checkbox required before ethnicity/faith fields are shown publicly              |
| Consent withdrawal    | Therapist can toggle consent off in profile settings; fields hidden from public |

## Risks

| Risk                                             | Mitigation                                                                                         |
| ------------------------------------------------ | -------------------------------------------------------------------------------------------------- |
| Removing PrismaAdapter changes auth behavior     | JWT strategy doesn't depend on adapter; manual User lookup in jwt callback replaces adapter's role |
| Returning users need manual lookup               | jwt callback queries User by provider + providerAccountId on each sign-in                          |
| JWT stores pending Google profile during consent | Minimal data (name, email, image, providerAccountId) — well within cookie size limits              |
| No analytics scripts to gate yet                 | Build consent infrastructure anyway — hook-based API means zero-cost integration later             |
| Existing profiles lack consentCommunitiesServed  | Migration defaults to false; ethnicity/faith data hidden until consent given                       |
