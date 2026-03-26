# PRD: Therapist Referral Network

**Version:** v0
**Thread:** free-tools-ecosystem
**Domain:** therapistreferral.network / therapistreferralnetwork.com

---

## What We're Building

A platform where Canadian therapists create structured professional profiles and post referral requests when they have a client they can't serve. The system matches referral criteria against profiles and emails matching therapists in batches with the referral details and the referring therapist's contact info. If the referral isn't fulfilled, the system drips to the next batch of matches. Everything after the email notification happens off-platform.

The platform replaces unstructured Facebook group posting with a matching system that's less noisy, more structured, and tracks whether referrals actually land. Shareable referral links drive registration from the existing 1500-member Canadian Therapist Referral Network Facebook community.

## Who It's For

**Primary user: Referring therapist.** Has a client they can't serve — wrong specialty, full caseload, wrong age group, wrong modality. Needs to find another therapist who fits the client's needs.

**Secondary user: Receiving therapist.** Wants to be findable when referral opportunities arise. Creates a profile so the system can match them to relevant referral posts.

**Initial audience:** 1500-member Canadian Therapist Referral Network Facebook community (owned by the founder), growing ~500/year.

## The Problem We're Solving

When a therapist gets a client they can't serve, they have no structured way to find the right colleague. Today they post in a Facebook group and wait — the group is dominated by self-promotional "I'm accepting clients" posts, making it noisy and hard to find relevant matches. There's no filtering by criteria, no visibility into who's actually accepting clients, and no way to know if a referral was successfully placed.

Alternatively, therapists scroll through personal contacts (limited pool) or search Psychology Today (passive directory designed for clients, not therapist-to-therapist referrals). None of these provide structured matching, availability awareness, or fulfillment tracking.

The Facebook community proves the need is real — 1500 therapists joined specifically for this purpose. The group does the job but does it poorly.

## Competitive Positioning

**Current alternatives and why they fall short:**

- **Facebook groups (including our own):** Unstructured, noisy, no matching, no availability tracking, no fulfillment visibility. Referral requests get buried under self-promotional posts.
- **Psychology Today directory:** Built for clients searching for therapists, not therapist-to-therapist referrals. No referral posting, no matching, no professional network features.
- **Personal networks / texting colleagues:** Limited to who you already know. No way to discover new therapists outside your circle.
- **Other therapist directories:** Passive listings. No active referral matching or notification system.

**Our angle:** Structured matching with less noise than a Facebook group, plus you know if the referral actually landed. The share-to-Facebook flow bridges the existing community behavior into a better tool.

## Goals & Outcomes (v0)

**Primary goals:**
- 100 therapist profiles created
- 5 referral posts per week (sustained)
- Establish referral fulfillment tracking as a core feedback loop

**Secondary goals:**
- Validate that therapists will migrate from Facebook group posting to the platform
- Validate the share-to-Facebook growth loop (post on platform → share link → drive registrations)
- Capture US therapist demand via country-gated waitlist

**Outcome:** Referring therapists find suitable colleagues faster and with more confidence than posting in a Facebook group. Receiving therapists get relevant referral opportunities delivered to their inbox instead of monitoring a noisy group.

## Must-Have Features (v0)

1. **Therapist profile creation** — Structured fields: specialties/presenting issues, location (city/province), modalities (in-person, virtual, both), languages, insurance (accepts, direct billing, specific insurers), pricing/reduced fees, therapeutic approach (CBT, EMDR, psychodynamic, etc.). Google OAuth signup via Supabase.

2. **Country gate with US waitlist** — During onboarding, therapist selects country. Canadian therapists proceed. US therapists see "We're not ready yet, we'll let you know" and are added to a waitlist.

3. **Post a referral** — Referring therapist fills out criteria: presenting issue, age group, location, modality, any constraints. No PHI — enforced via content guidelines and policy, not technical filtering.

4. **Matching engine** — System matches referral criteria against therapist profiles. Activity-based ranking: profiles with no activity (login, clicks, messages) for 30+ days rank lower in matching results.

5. **Email notification with drip mechanic** — Matching therapists receive email (via Resend) with referral details + referring therapist's contact info. Sent in batches, not all at once. If the referral isn't fulfilled after a follow-up check, the next batch gets notified.

6. **Fulfillment tracking** — Follow-up email to the referring therapist after a defined period: "Was this referral filled?" If yes, referral closes and no more batches are sent. If no, system drips to the next batch of matching therapists.

7. **Shareable referral links with gated access** — Each referral post gets a shareable URL with Open Graph preview (enough info to be enticing). Viewing full details and responding requires registration. Designed for sharing in the Facebook group to drive migration.

## Nice-to-Have Features (Later)

1. **Trusted connections** — Personal referral network of 3-5 therapists. System prioritizes trusted list first, checks availability, falls back to open pool.
2. **Search / browse profiles** — Referring therapist actively searches and filters profiles instead of only posting.
3. **In-app messaging** — Platform-native communication between therapists.
4. **Therapist dashboard** — Referral history, response rates, profile views.
5. **Psychology Today profile scraping** — Auto-populate profile fields from existing PT listing.
6. **Curio + Quitewell sponsor branding** — Sponsor placement in referral notification emails. Functionality built in v0, activated later.

## How We'll Know It's Working

| Signal | Target | Measures |
|--------|--------|----------|
| Adoption | 100 profiles created | Profile creation count |
| Usage | 5 referral posts/week | Weekly post count |
| Core value | Referral fulfillment rate | % of posts marked "filled" via follow-up email |
| Engagement | Email effectiveness | Open rate and click rate on referral notifications |
| Efficiency | Time to fulfillment | Duration from post creation to "filled" response |
| Retention | Repeat usage | % of referring therapists who post more than once |
| Growth | Facebook migration | Registrations driven by shared referral links |
| US demand | Waitlist size | Number of US therapists who register and hit the country gate |

## Requirements

### Functional Requirements

- Referral posts must not contain PHI — enforced via content guidelines and policy (not technical filtering in v0)
- When a referral is marked "fulfilled," the system stops dripping to new batches immediately
- Profiles with no activity for 30+ days rank lower in matching priority
- A therapist can have multiple referral posts open simultaneously
- Referral notification emails include referring therapist's name and contact info
- Open Graph tags on referral URLs show: presenting issue, location, modality — enough to be useful, not enough to bypass registration

### Non-Functional Requirements

- **Email deliverability:** Referral notifications are the core product. Emails must land in inbox, not spam. Resend + proper DNS (SPF, DKIM, DMARC) required.
- **Mobile responsive:** Therapists will access from phones. All flows (profile creation, referral posting, email click-through) must work on mobile.
- **Accessibility:** WCAG 2.1 AA compliance.
- **Uptime:** Best effort for v0. No SLA.

## Technical Considerations

### Assumptions

- **Next.js** — aligns with Curio stack and bootstrap thread
- **Vercel** — hosting
- **Supabase** — database (Postgres) + auth (Google OAuth)
- **Resend** — transactional email delivery
- Free tiers of Vercel + Supabase viable at v0 scale (100 profiles, ~20 posts/month)

### Constraints

- **Canada-only for v0** — US therapists captured on waitlist, not served
- **No PHI on the platform** — only therapist professional info and anonymized referral criteria. No PHIPA compliance burden on the platform itself.
- **Budget-conscious** — this is a free tool; infrastructure should stay within free tiers or near-zero cost

### Dependencies

- **Resend** — email delivery
- **Supabase** — database + Google OAuth
- **Facebook community** — primary distribution channel for launch (organic posting, not API integration)

## Integration Points

- **Google OAuth** via Supabase for authentication
- **Resend** for referral notification emails and fulfillment follow-ups
- **Facebook (organic)** — shareable referral links with OG tags. No API integration. Therapists copy-paste links into the Facebook group.
- **Curio + Quitewell** — email sponsor placement functionality built but not activated in v0

## Open Questions

| Question | Status | Impact |
|----------|--------|--------|
| Drip batch size — how many therapists in the first batch? | Open | Affects referrer experience (too few = slow, too many = noisy) |
| Follow-up timing — how long before asking "was this fulfilled?" | Open | Affects drip cadence and referral velocity |
| Required vs. optional fields when posting a referral | Open | Affects matching precision vs. posting friction |
| Matching algorithm ranking beyond activity decay | Open | How to rank when 50 profiles match — proximity? Profile completeness? |
| Referring therapist contact info format in emails | Open | Name + email? Phone? Reply routing? |

### Evidence Tags

| Area | Basis |
|------|-------|
| Problem exists | **Evidence** — 1500-member FB community doing this manually, growing 500/year |
| Primary user is the referrer | **Evidence** — founder's observation of group dynamics |
| 100 profiles / 5 posts per week targets | **Assumption** — not validated |
| Drip mechanic improves outcomes | **Assumption** — hypothesis that batched notifications beat blast-all |
| Share-to-Facebook drives registration | **Assumption** — hypothesis that gated links will convert FB group members |
| Therapists will switch from FB group to platform | **Assumption** — biggest risk; FB group is "good enough" for many |

## What's NOT In Scope

1. **Trusted connections / personal referral network** — v2
2. **Search / browse profiles** — v2
3. **In-app messaging** — v2
4. **US therapists** — country gate with waitlist only
5. **Curio / Quitewell sponsor branding in emails** — functionality ready but not active in v0
6. **Psychology Today profile scraping** — nice-to-have
7. **Therapist dashboard** — v2
8. **Client-facing features** — clients never interact with the platform
9. **Revenue / monetization** — this is a free tool
10. **Mobile app** — responsive web only

---

*Generated: 2026-03-13*
*Version: v0*
