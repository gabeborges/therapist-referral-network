# Screen Inventory

Compiled from all 6 flows. This is the work queue for Phase 4 (Screen Spec).

---

## Screens

| # | Screen Name | Appears In | Purpose | Priority |
|---|-------------|-----------|---------|----------|
| 1 | Sign In | Authentication | Returning therapist enters credentials to access the app | P0 |
| 2 | Sign Up | Authentication | New therapist creates an account | P0 |
| 3 | Onboarding | Onboarding | Welcome message + profile setup form for new therapists | P0 |
| 4 | Referral Tracker | Track, Create, Review Incoming | Home screen — list of all sent and received referrals with status | P0 |
| 5 | Create Referral | Create & Send | Form to describe client needs for system matching (no PHI) | P0 |
| 6 | Referral Detail | Track, Review Incoming | Detailed view of a single referral — matches, responses, timeline | P0 |
| 7 | Therapist Profile | Update Profile, Onboarding | View and edit own profile — specialties, insurance, availability | P0 |
| 8 | Forgot Password | Authentication | Enter email to receive password reset link | P1 |
| 9 | Reset Password | Authentication | Set a new password via emailed link | P1 |

**Total: 9 screens (7 P0, 2 P1)**

---

## Screen Relationships

### 1. Sign In
- **Comes from:** App entry (unauthenticated), session expiry, sign-up link ("Already have an account?")
- **Goes to:** Referral Tracker (success), Sign Up ("Create account"), Forgot Password
- **States:** Default, loading (authenticating), error (invalid credentials), rate-limited

### 2. Sign Up
- **Comes from:** Sign In ("Create account" link), app entry
- **Goes to:** Onboarding (success), Sign In ("Already have an account?")
- **States:** Default, loading (creating account), error (validation — email taken, weak password)

### 3. Onboarding
- **Comes from:** Sign Up (new account), Sign In (returning user with incomplete profile)
- **Goes to:** Referral Tracker (profile complete)
- **States:** Welcome step, profile form, loading (saving), validation error

### 4. Referral Tracker
- **Comes from:** Sign In, Onboarding, Create Referral (after send), Referral Detail (back), any top nav click
- **Goes to:** Create Referral ("New Referral" CTA), Referral Detail (click row), Profile (nav)
- **States:** Empty (no referrals — first use), populated, filtered (by status or direction), loading

### 5. Create Referral
- **Comes from:** Referral Tracker ("New Referral" CTA), top nav action
- **Goes to:** Referral Tracker (success — referral sent), Referral Tracker (cancel)
- **States:** Default (empty form), filling, validation error, submitting (matching in progress), no-matches, success

### 6. Referral Detail
- **Comes from:** Referral Tracker (click row)
- **Goes to:** Referral Tracker (back)
- **States:** Loading, populated (with responses), populated (no responses yet), closed referral

### 7. Therapist Profile
- **Comes from:** Top nav "Profile", Onboarding (initially)
- **Goes to:** Stays on profile (edit/save cycle), any screen via nav
- **States:** View mode, edit mode, saving, validation error, success (just saved)

### 8. Forgot Password
- **Comes from:** Sign In ("Forgot password?" link)
- **Goes to:** Check-your-email confirmation, Sign In (back)
- **States:** Default, loading (sending email), success (email sent), error (email not found)

### 9. Reset Password
- **Comes from:** Email link (external entry)
- **Goes to:** Sign In (success)
- **States:** Default, loading (resetting), success, error (invalid/expired link, weak password)

---

## Navigation Structure

**Navigation type:** Top bar

**Why:** Three primary destinations + one action. A sidebar would over-structure a focused tool. Top navigation keeps the content area clean and wide for forms and lists.

### Primary Navigation

| Position | Item | Destination | Notes |
|----------|------|-------------|-------|
| Left | App logo/name | Referral Tracker | Home link |
| Center-right | "Referrals" | Referral Tracker | Active indicator when on tracker or detail |
| Center-right | "Profile" | Therapist Profile | Active indicator when on profile |
| Right | Avatar + name | Profile dropdown (sign out) | Minimal — just sign out for now |

### Primary Action

| Element | Label | Action | Notes |
|---------|-------|--------|-------|
| Button in top nav | "New Referral" | Opens Create Referral | Brand-colored CTA, always accessible. Also appears as CTA in empty tracker state. |

### Secondary Navigation

- **Referral Tracker tabs/filters:** "All" / "Sent" / "Received" — toggles within the tracker, not separate nav items
- **Referral status filters:** "All statuses" / "Sent" / "Responded" / "Connected" / "Closed" — dropdown or pill filter

### Auth Screens Navigation

- Sign In and Sign Up have minimal navigation — app logo only, link to switch between sign in/sign up
- Onboarding has app logo only — no nav (prevent leaving before profile is complete)

### Persistent Elements

- **Top navigation bar:** Visible on all authenticated screens (Tracker, Detail, Profile, Create Referral)
- **Not visible on:** Sign In, Sign Up, Onboarding, Forgot/Reset Password

### Back/Escape Patterns

- **Create Referral → Cancel:** Returns to Referral Tracker (confirm if form has data)
- **Referral Detail → Back:** Returns to Referral Tracker (preserves filter state)
- **Profile Edit → Cancel:** Returns to Profile View (confirm if unsaved changes)
- **Browser back:** Works naturally throughout — no modal traps

---

## Wire Flow

```
                    [Sign Up]
                       │
                       ↓
[Sign In] ──────→ [Onboarding] ──────→ [Referral Tracker] ←──── (home)
    │                                     │          ↑
    └─────────────────────────────────────→           │
                                          │          │
                                     "New Referral"  │
                                          │          │
                                          ↓          │
                                   [Create Referral] ─┘

                                   [Referral Tracker]
                                          │
                                     click row
                                          │
                                          ↓
                                   [Referral Detail] ──→ back to Tracker

                                   [Top Nav: Profile]
                                          │
                                          ↓
                                   [Therapist Profile]
```

### Cross-Flow Transitions

- **Create Referral → Tracker:** After successful send, return to tracker with new referral visible at top, success toast
- **Onboarding → Tracker:** After profile complete, land on empty tracker with welcome message and "Create your first referral" CTA
- **Sign In → Onboarding:** If returning user has incomplete profile, redirect to onboarding instead of tracker
- **Any screen → Profile:** Availability toggle reminder if therapist hasn't updated in a while (P1)

---

## P0 Screen Spec Order

Recommended order for `/dsg:screen-spec`:

1. **Referral Tracker** — Home screen, appears in most flows, defines the shell/nav
2. **Create Referral** — Primary action, core of the product
3. **Referral Detail** — Extends the tracker, shows match quality
4. **Therapist Profile** — Shared between onboarding and settings
5. **Onboarding** — Reuses profile form with onboarding wrapper
6. **Sign In** — Standard but sets the visual tone
7. **Sign Up** — Mirrors sign in
