# Proposal: Therapist Referral Network v0

## What

Build the core platform for the Canadian Therapist Referral Network — a structured matching system where therapists create professional profiles, post referral requests for clients they can't serve, and the system matches and notifies relevant therapists via batched email drips.

## Why

The 1500-member Canadian Therapist Referral Network Facebook community proves demand. But Facebook is the wrong tool: referral requests get buried under self-promotional posts, there's no filtering by criteria, no availability tracking, and no way to know if a referral landed. Therapists waste time scanning noise instead of finding the right colleague.

This platform replaces unstructured Facebook posting with automated matching and fulfillment tracking, giving referring therapists faster results and receiving therapists less noise.

## Scope

### In scope (v0)

1. **Google OAuth signup** via Auth.js + Supabase — country gate routes Canadian therapists to onboarding, US therapists to a waitlist
2. **Therapist profile creation** — structured fields for specialties, location, modalities, languages, insurance, pricing, therapeutic approach, age groups
3. **Referral posting** — referring therapist submits criteria (presenting issue, age group, location, modality, constraints). No PHI.
4. **Matching engine** — matches referral criteria against profiles, ranks by relevance with activity-based decay (30+ days inactive = lower rank)
5. **Email notification drip** — Resend-powered batched emails with referral details + referring therapist contact info. If unfulfilled, drip to next batch.
6. **Fulfillment tracking** — follow-up email to referrer asking "Was this filled?" Yes → close referral. No → trigger next batch.
7. **Shareable referral links** — OG-tagged URLs showing enough info to entice, full details gated behind registration. Designed for Facebook group sharing.

### Out of scope

- Trusted connections / personal referral networks
- Search / browse profiles
- In-app messaging
- Therapist dashboard
- Psychology Today scraping
- US therapists (waitlist only)
- Sponsor branding (plumbing ready, not active)
- Revenue / monetization
- Mobile app (responsive web only)

## Success criteria

| Metric | Target |
|--------|--------|
| Profiles created | 100 |
| Referral posts/week | 5 (sustained) |
| Fulfillment rate | Tracked via follow-up emails |
| Facebook migration | Registrations from shared links |

## Risks

| Risk | Mitigation |
|------|------------|
| Therapists won't switch from Facebook | Shareable links bridge behavior — post on platform, share link in group |
| Email deliverability (notifications are the product) | Proper DNS setup (SPF, DKIM, DMARC) + Resend |
| Matching too broad / too narrow | Start with simple criteria matching, tune batch sizes |
| Low initial profile density | Seed from Facebook community, founder outreach |

## Existing scaffold

The project already has initial setup:
- Next.js 15 App Router with TypeScript
- Auth.js configured with Google OAuth + Prisma adapter
- Prisma schema with User, Account, Session, TherapistProfile models
- tRPC layer with basic therapist router
- Zod validations for therapist profile and referral post
- Resend email client + referral notification template
- Stripe client (for future use)
- Supabase client setup
- Feature-based folder structure ready (`src/features/`)
