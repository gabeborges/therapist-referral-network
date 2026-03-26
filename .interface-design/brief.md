# Design Brief

---

## 1. Overview

**Project name:** Therapist Referral Network

**One-sentence description:** A tool that lets solo therapists create referrals by describing client needs, then automatically matches and notifies the best-fit therapists in their network via email.

**Type:** SaaS app

**Scope:** New product

---

## 2. Problem

**What problem does this solve?** Solo therapists have no structured way to find the right colleague for a client referral. They rely on memory, personal contacts, and Facebook groups — which means clients get referred to whoever comes to mind first, not the therapist who best fits their needs.

**What happens today without this?** A therapist finishes a session, realizes the client needs someone with a different specialty (e.g., EMDR for trauma, or someone who accepts a specific insurance). They scroll through phone contacts, post in a Facebook group, or text a few colleagues. The process takes days, depends entirely on who they already know, and there's no way to know if the match was good.

**What does success look like?** Clients consistently end up with therapists who actually fit their needs — right specialty, right availability, right insurance, right location. The referring therapist trusts the match quality.

**What's the hypothesis?** We believe that if therapists can describe what a client needs and receive system-matched suggestions (instead of relying on memory), referral quality will improve — clients will connect with better-fit therapists more consistently.

---

## 3. Audience

**Who is the primary user?** A solo therapist in private practice. They manage their own caseload, have a small informal network of colleagues, and handle referrals themselves.

**Where are they when they use this?** At their desk or on their laptop/phone after a therapy session. They're in a reflective, thoughtful state — processing what happened in the session and deciding next steps for the client.

**What did they do 5 minutes before?** Finished a therapy session. They're writing session notes, thinking about the client's progress, and may have just realized this client would benefit from a different specialist.

**What will they do 5 minutes after?** Move on to their next session, take a break, or handle practice admin. The referral is one task among many — it shouldn't take long.

**What's their relationship with the domain?** Expert in therapy, but not in technology. They want something that works without a learning curve. They're used to simple tools — email, basic scheduling software, maybe a simple EHR.

---

## 4. Goals

**Primary goal:** Send a well-matched referral — describe what the client needs and trust the system to find the right therapists.

**Secondary goals:**

1. Track referral outcomes — know whether matched therapists responded and if the client connected
2. Maintain an accurate profile — keep their own specialties, availability, and insurance info current so they receive relevant referrals
3. Review incoming referrals — see referrals from other therapists where they've been matched

**Non-goals:**

- Direct messaging or chat between therapists (email handles this)
- Client-facing features (clients don't use this platform)
- Practice management (scheduling, billing, EHR — out of scope)
- Storing Protected Health Information (PHI is never stored in the system)

---

## 5. Scope

**Screens/views needed (P0):**

1. **Create referral** — Form to describe client needs (specialty needed, insurance, location preferences, urgency) without capturing PHI
2. **Referral tracker** — List of outgoing and incoming referrals with status (sent, responded, connected, closed)
3. **Therapist profile** — Own profile with specialties, availability status, insurance accepted, location, practice details
4. **Auth screens** — Sign up, sign in, forgot password

**Screens/views (P1 — future):**

5. Network directory — Browse/search therapists manually
6. Dashboard — Overview of referral activity and network stats
7. Notification preferences — Control email frequency and types

**Key user flows:**

1. **Send a referral:** Open app -> Create referral -> Describe needs -> System matches top 5 therapists -> Emails sent -> Track responses
2. **Respond to a referral:** Receive email notification -> Reply via email to accept/decline -> Status updates in tracker
3. **Update profile:** Open profile -> Edit specialties/availability/insurance -> Save (keeps match quality high)

**Data sources:** Supabase (Postgres) for therapist profiles, referral records, match data. No external APIs in V1.

**Integration points:** Email service for referral notifications. Auth.js for authentication. Stripe for future paid tiers (not P0).

---

## 6. Constraints

**Technical constraints:**
- Next.js 15 (App Router, RSC), TypeScript, Supabase, Prisma 7, tRPC, Auth.js, Tailwind CSS v4
- No PHI stored — referral descriptions must be structured around needs (specialty, insurance, location), not client identity
- Responsive design — must work well on both mobile and desktop
- WCAG AA accessibility minimum
- Supabase RLS for data isolation between therapists

**Business constraints:**
- Solo developer project
- No external design team — design system must be self-documenting
- MVP-first approach — ship P0 screens, validate, then expand

**Design constraints:**
- No existing design system — this process creates it
- No brand guidelines yet — brand emerges from the design foundation
- Must feel trustworthy and professional — therapists are handling sensitive referral decisions

---

## 7. Deliverables

**What gets built:** Screen specifications, then HTML/Tailwind interactive mocks (full DSG pipeline)

**Fidelity:** Lo-fi specs (Phase 4) -> Hi-fi HTML mocks (Phase 5) -> Production Next.js code (post-DSG)

**Handoff:** Solo developer implements — specs and mocks serve as the reference during build

**Success criteria:**

- A therapist can create a referral in under 2 minutes
- The referral form captures enough to produce meaningful matches without collecting PHI
- The interface feels trustworthy — a therapist would feel comfortable using this for professional referrals
- Responsive and usable on both phone and laptop
- All interactive elements meet WCAG AA

---

## Sign-off

All 7 sections filled with specific, concrete answers. Ready for `/dsg:foundation`.
