# Design: Therapist Referral Network v0

## Architecture overview

Standard Next.js 15 App Router application. Server Components by default, Client Components only for forms and interactive elements. tRPC for type-safe API layer. Prisma for database access. Auth.js for authentication. Resend for transactional email.

```
┌─────────────────────────────────────────┐
│              Next.js App Router          │
│  ┌──────────┐  ┌──────────┐  ┌───────┐ │
│  │  Pages    │  │  Server  │  │ Route │ │
│  │  (RSC)    │  │  Actions │  │ Handlers│ │
│  └────┬─────┘  └────┬─────┘  └───┬───┘ │
│       │              │            │      │
│       └──────────────┼────────────┘      │
│                      │                   │
│               ┌──────┴──────┐            │
│               │    tRPC     │            │
│               │   Router    │            │
│               └──────┬──────┘            │
│                      │                   │
│        ┌─────────────┼─────────────┐     │
│        │             │             │     │
│   ┌────┴────┐  ┌────┴────┐  ┌────┴───┐ │
│   │ Prisma  │  │ Auth.js │  │ Resend │ │
│   │   ORM   │  │  (Google│  │ Email  │ │
│   └────┬────┘  │  OAuth) │  └────────┘ │
│        │       └─────────┘              │
└────────┼────────────────────────────────┘
         │
    ┌────┴────┐
    │Supabase │
    │Postgres │
    └─────────┘
```

## Data model

### Existing models (already scaffolded)

- **User** — Auth.js user with email, accounts, sessions
- **TherapistProfile** — Professional info linked 1:1 to User (specialties, location, modalities, etc.)

### New models to add

```prisma
model ReferralPost {
  id        String   @id @default(cuid())
  authorId  String
  author    TherapistProfile @relation("PostedReferrals", fields: [authorId], references: [id], onDelete: Cascade)

  // Referral criteria
  presentingIssue String
  ageGroup        String
  locationCity    String?
  locationProvince String
  modality        String   // "in-person" | "virtual" | "both"
  additionalNotes String?

  // Status
  status    ReferralStatus @default(OPEN)

  // Drip tracking
  currentBatch   Int      @default(0)
  lastDrippedAt  DateTime?

  // Shareable link
  slug      String   @unique @default(cuid())

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  notifications ReferralNotification[]

  @@index([status, createdAt])
  @@index([slug])
}

enum ReferralStatus {
  OPEN
  FULFILLED
  EXPIRED
}

model ReferralNotification {
  id             String       @id @default(cuid())
  referralPostId String
  referralPost   ReferralPost @relation(fields: [referralPostId], references: [id], onDelete: Cascade)
  recipientId    String
  recipient      TherapistProfile @relation("ReceivedNotifications", fields: [recipientId], references: [id])

  batch          Int          // Which drip batch this was sent in
  sentAt         DateTime     @default(now())
  emailId        String?      // Resend email ID for tracking

  @@unique([referralPostId, recipientId])
  @@index([referralPostId, batch])
}

model FulfillmentCheck {
  id             String       @id @default(cuid())
  referralPostId String
  referralPost   ReferralPost @relation(fields: [referralPostId], references: [id], onDelete: Cascade)

  sentAt         DateTime     @default(now())
  respondedAt    DateTime?
  fulfilled      Boolean?     // null = pending, true = yes, false = no

  token          String       @unique @default(cuid()) // Secure token for email link

  @@index([referralPostId])
  @@index([token])
}

model Waitlist {
  id        String   @id @default(cuid())
  email     String   @unique
  country   String   // "US" or other non-CA countries
  createdAt DateTime @default(now())
}
```

### TherapistProfile additions

Add relations to TherapistProfile:
```prisma
// Add to TherapistProfile
postedReferrals      ReferralPost[]          @relation("PostedReferrals")
receivedNotifications ReferralNotification[] @relation("ReceivedNotifications")
```

## Routes & pages

```
/                           → Landing page (public)
/auth/signin                → Sign-in page (Google OAuth)
/onboarding                 → Country gate → profile creation (post-auth)
/onboarding/waitlist        → US waitlist page
/dashboard                  → Redirect: profile incomplete → /onboarding, else → /referrals
/profile                    → View/edit own profile
/profile/edit               → Edit profile form
/referrals                  → List own referral posts + "Post a referral" CTA
/referrals/new              → Create referral post form
/referrals/[id]             → View referral post details (author view with status)
/r/[slug]                   → Public shareable referral link (OG tags, gated content)
/referrals/fulfill/[token]  → Fulfillment response page (from email link)
```

## Feature modules

### `src/features/auth/`
- **Components**: `SignInButton`, `SignOutButton`, `AuthGuard`
- **Logic**: Session provider wrapper, auth middleware

### `src/features/onboarding/`
- **Components**: `CountryGate`, `ProfileCreationForm`, `WaitlistForm`
- **Pages**: `/onboarding`, `/onboarding/waitlist`
- **Logic**: Country selection → route CA to profile form, others to waitlist

### `src/features/profile/`
- **Components**: `ProfileForm`, `ProfileView`, `ProfileCard`
- **Pages**: `/profile`, `/profile/edit`
- **tRPC**: `getProfile`, `updateProfile`, `createProfile`

### `src/features/referrals/`
- **Components**: `ReferralPostForm`, `ReferralPostCard`, `ReferralPostList`, `ReferralStatusBadge`
- **Pages**: `/referrals`, `/referrals/new`, `/referrals/[id]`
- **tRPC**: `createReferral`, `listMyReferrals`, `getReferral`, `markFulfilled`

### `src/features/matching/`
- **Logic**: `matchReferralToProfiles()` — query profiles matching referral criteria, ranked by relevance + activity decay
- **Scoring**: exact specialty match > partial match, activity decay (30+ days → lower rank), accepting clients filter
- **No UI** — internal module consumed by the drip engine

### `src/features/notifications/`
- **Logic**: `sendReferralBatch()` — send emails to a batch of matched therapists
- **Email templates**: Referral notification, fulfillment check
- **tRPC**: none (triggered by cron/server action)

### `src/features/drip/`
- **Logic**: `processDripQueue()` — find OPEN referrals needing next batch, trigger matching + notification
- **Fulfillment**: `handleFulfillmentResponse()` — process yes/no from fulfillment email link
- **Trigger**: Vercel Cron (route handler at `/api/cron/drip`)

### `src/features/share/`
- **Pages**: `/r/[slug]` — public page with OG metadata, gated content
- **Logic**: Generate OG tags (presenting issue, location, modality), show preview to unauthenticated users, full details to authenticated users

## Matching algorithm

```
matchReferralToProfiles(referral):
  1. Filter: acceptingClients = true AND country = "CA"
  2. Filter: specialties OVERLAPS [referral.presentingIssue]
  3. Filter: ageGroups CONTAINS referral.ageGroup
  4. Filter: modalities CONTAINS referral.modality OR modalities CONTAINS "both"
  5. Filter: province = referral.locationProvince (if specified)
  6. Exclude: already notified for this referral
  7. Score:
     - Specialty match count (more overlapping specialties = higher)
     - Location proximity (same city > same province)
     - Activity recency (lastActiveAt within 7 days = 1.0, 14 days = 0.8, 30 days = 0.5, 30+ days = 0.2)
     - Profile completeness (more fields filled = slight boost)
  8. Sort by score descending
  9. Return top N for batch (configurable, default: 5)
```

## Drip mechanics

- **Batch size**: 5 therapists (configurable via env var)
- **Follow-up timing**: 48 hours after batch sent → send fulfillment check to referrer
- **Drip trigger**: If referrer says "no, not fulfilled" → wait 24 hours → send next batch
- **Max batches**: 5 (configurable) — after that, referral status → EXPIRED
- **Cron schedule**: Every 6 hours, process all OPEN referrals that need action

```
Cron job logic (processDripQueue):
  For each OPEN referral:
    1. If no batch sent yet → send batch 0
    2. If last batch sent > 48h ago AND no fulfillment check sent → send fulfillment check
    3. If fulfillment check responded "no" AND response > 24h ago → send next batch
    4. If currentBatch >= maxBatches → mark EXPIRED
```

## Email templates

### Referral notification (to matched therapists)
- Subject: "Referral opportunity: {presentingIssue} in {city}"
- Body: Referral details + referring therapist name + contact info
- CTA: "View full details" → `/r/[slug]`

### Fulfillment check (to referring therapist)
- Subject: "Was your referral fulfilled?"
- Body: Referral summary + two buttons
- CTAs: "Yes, it was filled" → `/referrals/fulfill/[token]?fulfilled=true`, "No, still looking" → `/referrals/fulfill/[token]?fulfilled=false`

## OG tags for shareable links

```html
<meta property="og:title" content="Referral: {presentingIssue}" />
<meta property="og:description" content="A therapist in {city}, {province} is looking for a colleague — {modality}" />
<meta property="og:type" content="website" />
<meta property="og:url" content="https://therapistreferralnetwork.com/r/{slug}" />
```

## Environment variables

```
# Existing
AUTH_GOOGLE_ID, AUTH_GOOGLE_SECRET
DATABASE_URL
RESEND_API_KEY

# New
RESEND_FROM_EMAIL=referrals@therapistreferralnetwork.com
DRIP_BATCH_SIZE=5
DRIP_MAX_BATCHES=5
DRIP_FOLLOWUP_HOURS=48
DRIP_NEXT_BATCH_DELAY_HOURS=24
CRON_SECRET=<secret for securing cron endpoint>
NEXT_PUBLIC_APP_URL=https://therapistreferralnetwork.com
```

## Key decisions

1. **No Supabase RLS in v0** — Prisma handles access control via tRPC middleware. RLS can be layered later.
2. **Cron via Vercel Cron** — simple route handler secured with CRON_SECRET, runs every 6 hours.
3. **No real-time** — email-driven flow, no WebSockets or polling needed.
4. **Fulfillment via email links** — no login required to respond to fulfillment check (token-based).
5. **react-email for templates** — composable, testable email components with Resend.
