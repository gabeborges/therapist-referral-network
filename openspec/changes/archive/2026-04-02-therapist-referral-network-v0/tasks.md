# Tasks: Therapist Referral Network v0

## Phase 1: Data model & schema

### 1.1 Extend Prisma schema
- [x] Add `ReferralPost` model with all fields (presentingIssue, ageGroup, locationCity, locationProvince, modality, additionalNotes, status enum, currentBatch, lastDrippedAt, slug)
- [x] Add `ReferralStatus` enum (OPEN, FULFILLED, EXPIRED)
- [x] Add `ReferralNotification` model (tracks which therapists were notified for which referral, which batch)
- [x] Add `FulfillmentCheck` model (token-based fulfillment response tracking)
- [x] Add `Waitlist` model (email, country)
- [x] Add relations to `TherapistProfile` (postedReferrals, receivedNotifications)
- [x] Run `prisma generate` and verify generated client

### 1.2 Update Zod validations
- [x] Update `referral-post.ts` — add `locationCity`, `locationProvince` (separate fields), align with new schema
- [x] Add `waitlist.ts` validation schema (email, country)
- [x] Add `fulfillment-response.ts` validation schema

## Phase 2: Auth & onboarding

### 2.1 Country gate & onboarding flow
- [x] Create `src/features/onboarding/` feature folder
- [x] Build `CountryGate` component — country selector (Canada proceeds, US/other → waitlist)
- [x] Build onboarding page at `src/app/onboarding/page.tsx` — shows CountryGate, then profile form for CA
- [x] Build waitlist page at `src/app/onboarding/waitlist/page.tsx` — "We'll let you know" message
- [x] Add tRPC `waitlist.join` procedure (or server action) to save email + country

### 2.2 Auth guard & middleware
- [x] Create auth middleware — redirect unauthenticated users to `/auth/signin`
- [x] After sign-in redirect: check if profile exists → if not, redirect to `/onboarding`
- [x] Build sign-in page at `src/app/auth/signin/page.tsx` with Google OAuth button

## Phase 3: Profile management

### 3.1 Profile creation
- [x] Create `src/features/profile/` feature folder
- [x] Build `ProfileForm` client component — react-hook-form + Zod, all profile fields with appropriate inputs (multi-select for specialties, modalities, etc.)
- [x] Add tRPC `therapist.createProfile` procedure — validate input, create TherapistProfile linked to user
- [x] Wire profile form into onboarding flow — after country gate, create profile → redirect to `/referrals`

### 3.2 Profile view & edit
- [x] Build `ProfileView` component — display profile as a card
- [x] Build profile page at `src/app/profile/page.tsx` — show own profile with edit button
- [x] Build profile edit page at `src/app/profile/edit/page.tsx` — pre-populated ProfileForm
- [x] Add tRPC `therapist.updateProfile` procedure
- [x] Update `lastActiveAt` on profile view/edit (activity tracking for matching decay)

## Phase 4: Referral posting

### 4.1 Create referral post
- [x] Create `src/features/referrals/` feature folder
- [x] Build `ReferralPostForm` client component — react-hook-form + Zod for referral criteria
- [x] Build new referral page at `src/app/referrals/new/page.tsx`
- [x] Add tRPC `referral.create` procedure — validate, create ReferralPost with auto-generated slug, set status OPEN

### 4.2 List & view referrals
- [x] Build `ReferralPostCard` component — summary card showing status, criteria, batch info
- [x] Build `ReferralPostList` component — list of own referral posts
- [x] Build referrals index page at `src/app/referrals/page.tsx` — list + "Post a referral" CTA
- [x] Build referral detail page at `src/app/referrals/[id]/page.tsx` — full details with status tracking
- [x] Add tRPC `referral.listMine` and `referral.getById` procedures
- [x] Add `ReferralStatusBadge` component (OPEN/FULFILLED/EXPIRED visual indicator)

## Phase 5: Matching engine

### 5.1 Build matching module
- [x] Create `src/features/matching/` feature folder
- [x] Implement `matchReferralToProfiles(referralPost)` function:
  - Filter by: acceptingClients, country=CA, specialty overlap, ageGroup match, modality match, province match
  - Exclude: already-notified therapists (via ReferralNotification records)
  - Score: specialty match count, location proximity, activity recency decay, profile completeness
  - Return sorted list limited to batch size
- [x] Write unit tests for matching logic with various profile/referral combinations

## Phase 6: Email notifications

### 6.1 Email templates
- [x] Enhance existing `ReferralNotificationEmail` template — add referring therapist contact info (name, email), full referral details, styled with react-email
- [x] Create `FulfillmentCheckEmail` template — referral summary + "Yes fulfilled" / "No, still looking" buttons with token-based URLs
- [x] Test email rendering locally

### 6.2 Notification sending
- [x] Create `src/features/notifications/` feature folder
- [x] Implement `sendReferralBatch(referralPost, matchedProfiles)` — send emails via Resend, create ReferralNotification records with batch number and Resend email ID
- [x] Implement `sendFulfillmentCheck(referralPost)` — send follow-up email to referrer with unique token

## Phase 7: Drip engine

### 7.1 Drip processing logic
- [x] Create `src/features/drip/` feature folder
- [x] Implement `processDripQueue()`:
  - Find all OPEN referrals
  - For each: determine next action (send first batch, send fulfillment check, send next batch, expire)
  - Execute actions (matching → notification → fulfillment check)
- [x] Implement batch progression logic: batch 0 → fulfillment check → batch 1 → ... → max batches → EXPIRED

### 7.2 Fulfillment handling
- [x] Build fulfillment response page at `src/app/referrals/fulfill/[token]/page.tsx`
  - Token-based (no auth required)
  - Read query param `fulfilled=true|false`
  - If true → mark referral FULFILLED, stop drip
  - If false → record response, drip engine will send next batch on next run
- [x] Add tRPC or server action for processing fulfillment response

### 7.3 Cron endpoint
- [x] Create route handler at `src/app/api/cron/drip/route.ts`
  - Secured with CRON_SECRET header check
  - Calls `processDripQueue()`
- [x] Add Vercel cron config in `vercel.json` — every 6 hours

## Phase 8: Shareable referral links

### 8.1 Public referral page
- [x] Build page at `src/app/r/[slug]/page.tsx`:
  - Generate OG metadata (presenting issue, location, modality) via `generateMetadata()`
  - Unauthenticated: show teaser (presenting issue, location, modality) + "Sign up to respond" CTA
  - Authenticated: show full referral details + referring therapist contact info
- [x] Add tRPC `referral.getBySlug` procedure (public, returns limited data for unauthenticated)

## Phase 9: Landing page & navigation

### 9.1 Landing page
- [x] Replace default Next.js page at `src/app/page.tsx` with landing page
  - Hero: value prop for therapists
  - How it works: 3-step explanation (create profile → post referral → get matched)
  - CTA: "Sign up with Google"
  - Mobile responsive

### 9.2 Navigation
- [x] Build shared `Navbar` component — logo, nav links (Referrals, Profile), sign in/out
- [x] Add to layout — show on all authenticated pages
- [x] Build simple `/dashboard` redirect page (profile incomplete → /onboarding, else → /referrals)

## Phase 10: Polish & deploy

### 10.1 Activity tracking
- [x] Update `lastActiveAt` on: login, profile view, referral post creation, referral link click
- [x] Add middleware or tRPC middleware to touch `lastActiveAt` on authenticated requests

### 10.2 Environment & deployment
- [x] Set up all environment variables (RESEND_FROM_EMAIL, DRIP_*, CRON_SECRET, NEXT_PUBLIC_APP_URL)
- [x] Add `vercel.json` with cron configuration
- [x] DNS setup for custom domain + email (SPF, DKIM, DMARC for Resend)
- [x] Test full flow: sign up → create profile → post referral → matching → email → fulfillment

### 10.3 Mobile responsiveness
- [x] Ensure all forms work on mobile (profile creation, referral posting)
- [x] Ensure email templates render well on mobile
- [x] Test shareable link OG preview in Facebook/iMessage

### 10.4 Accessibility
- [x] WCAG 2.1 AA audit on all forms and pages
- [x] Keyboard navigation, focus management, ARIA labels
- [x] Color contrast check
