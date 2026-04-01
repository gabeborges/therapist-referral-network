# Design Critique Report

Critique of all 7 P0 mocks against system.md, screen specs, and the interface-design skill's mandate checks.

---

## Summary

| Severity | Count |
|----------|-------|
| Critical | 3 |
| Craft | 7 |
| Polish | 5 |

The design is strategically sound — warm palette, calm spacing, clear hierarchy. But the signature Match Ring is nearly invisible (1 of 7 screens), spacing breaks the 4px scale in multiple places, and some defaults survived the build unchallenged.

---

## Critical — Must Fix

### C1. Match Ring signature exists in only 1 of 7 screens

**What:** The Match Ring — the product's ONE signature element — only appears in `referral-detail.html`. It's completely absent from the referral tracker list, the create referral success feedback, and the therapist profile.

**Where:** `referral-tracker.html`, `therapist-profile.html`

**Why it matters:** The signature test requires 5 specific elements where the signature appears. Currently there's exactly 1 (the detail page match cards). Without the Match Ring appearing in the tracker rows, a user browsing their referrals has no visual signal of match quality. The product's entire visual identity rides on this one element, and it's hidden behind a click.

**Fix:**
- Add compact Match Rings (36px) to referral tracker rows — each row should show the best match quality at a glance
- Add a Match Ring to the therapist profile showing this therapist's overall matching profile (how many dimensions they've filled)
- Consider a simplified Match Ring indicator (small dots or mini rings) in the referral tracker badges

---

### C2. Spacing breaks the 4px scale in multiple places

**What:** Tailwind utility `pt-10` = 40px and `mb-1.5` = 6px. Neither is on the system.md spacing scale (4, 8, 12, 16, 24, 32, 48px). These appear across multiple mocks.

**Where:** All authenticated screens use `pt-10` for page header padding. `mb-1.5` used for label-to-input gaps across forms.

**Why it matters:** Off-scale spacing is the clearest sign of "no system." The system defines a deliberate scale. Using values between steps undermines the rhythm and makes future developers guess instead of follow.

**Fix:**
- Replace `pt-10` (40px) → `pt-12` (48px = `--space-2xl`) for page headers. The extra 8px creates more breathing room, consistent with the "calm and spacious" direction.
- Replace `mb-1.5` (6px) → `mb-1` (4px = `--space-micro`) for label-to-input gaps. 4px is tighter but correct for this pairing. Alternatively `mb-2` (8px = `--space-xs`).

---

### C3. Referral detail and therapist profile missing required states

**What:** `referral-detail.html` only has 2 states (populated, loading) — missing error state. `therapist-profile.html` has 3 states (view, edit, loading) — missing the saving state with spinner and the save-error state.

**Where:** `referral-detail.html`, `therapist-profile.html`

**Why it matters:** Missing states make interfaces feel like photographs of software. A user who hits a network error on the detail page has no recovery path. A user who saves their profile with no feedback doesn't know if it worked.

**Fix:**
- `referral-detail.html`: Add error state — "Couldn't load this referral. Go back to your referrals." with back link
- `therapist-profile.html`: Add saving state — Save button shows spinner + "Saving…", fields disabled. Add success toast and error recovery.

---

## Craft — Should Fix

### F1. Swap test: Buttons and inputs are generic

**What:** The button and input component designs would be indistinguishable from any Tailwind template if you swapped the brand color from teal to blue. There's no shape, proportion, or behavior unique to this product.

**Where:** All mocks — `btn-primary`, `input-base` classes

**Why it matters:** The swap test says: "If you swapped your choices for the most common alternatives and the design didn't feel meaningfully different, you never made real choices." The warmth lives entirely in the color palette. Component shapes are completely standard.

**Fix:** The warm, rounded character of the product should show in component design:
- Inputs: Consider slightly warmer inset background, softer placeholder color, or a subtle inner shadow that feels "recessed like a notebook indent"
- Buttons: The 6px radius is fine, but consider slightly taller buttons (44px instead of 42px) for a more comfortable touch target that also feels less cramped
- These are subtle shifts, not dramatic — but they'd survive a color swap

---

### F2. Form label colors inconsistent across mocks

**What:** Form field labels alternate between `#6B5E57` (--fg-secondary) and `#8F8279` (--fg-tertiary) with no clear pattern.

**Where:** `create-referral.html` uses `#6B5E57` for field labels. `therapist-profile.html` view mode uses `#8F8279` for field labels. `onboarding.html` mixes both.

**Why it matters:** Inconsistent label color creates visual noise. The user can't rely on color to distinguish label from value if the label color shifts between screens.

**Fix:** Standardize on `#6B5E57` (--fg-secondary) for all interactive form labels. Use `#8F8279` (--fg-tertiary) only for read-only field labels in view mode (profile view). Document this distinction in system.md.

---

### F3. Nav component implementation varies slightly across mocks

**What:** The top navigation button sizes, padding, and link styles differ subtly between mocks. Some use `height: 36px; padding: 0 14px`, others use `height: 38px; padding: 0 16px`. The nav-active underline position varies.

**Where:** Compare `referral-tracker.html` nav vs `create-referral.html` nav vs `therapist-profile.html` nav

**Why it matters:** Navigation is THE constant across all authenticated screens. Even subtle inconsistencies (2px height difference, different padding) break the feeling of one cohesive product. If a user flips between screens, the nav should not shift at all.

**Fix:** Extract exact nav HTML into a consistent pattern and replicate identically across all authenticated mocks. Nav "New Referral" button: `height: 36px; padding: 0 14px;`. Nav links: `t-label nav-link` with consistent gap-5.

---

### F4. Typography hierarchy too subtle — Body vs Body-sm barely distinguishable

**What:** Body (15px) and Body-sm (14px) differ by only 1px. At screen distance, these are perceptually identical.

**Where:** All mocks — primary text uses 0.9375rem (15px), secondary uses 0.875rem (14px)

**Why it matters:** Typography hierarchy should be perceptible at a glance. If two levels look the same, the hierarchy fails and you're relying on color alone to differentiate. The squint test suffers.

**Fix:** Increase the gap: make Body-sm 13px (0.8125rem — same as Label size but 400 weight) or keep 14px but add `color: --fg-secondary` as a mandatory pairing so the size+color combination creates sufficient distinction. Document that Body-sm must always pair with a lighter color.

---

### F5. Shadow and border-radius values hardcoded instead of tokenized

**What:** Shadows are written as full `box-shadow` values inline. Border radius uses `rounded-[10px]`, `rounded-[6px]` etc. as Tailwind arbitrary values instead of semantic tokens.

**Where:** All mocks

**Why it matters:** When a developer implements from these mocks, they'll copy-paste magic values instead of using tokens. If the shadow definition changes, every instance must be manually updated. This is the difference between a system and a collection of pages.

**Fix:** Define reusable CSS classes that map to system.md:
- `.shadow-elevated` = elevation level 1
- `.shadow-floating` = elevation level 2
- `.shadow-overlay` = elevation level 3
- `.radius-sm`, `.radius-md`, `.radius-lg`, `.radius-full`
These are defined in the mock styles but used inconsistently.

---

### F6. Onboarding form doesn't show pre-selected chips like other forms

**What:** The onboarding form uses bare `<select>` elements that don't show the chip-based multi-select pattern used in `create-referral.html` (filling state) and `therapist-profile.html` (edit mode).

**Where:** `onboarding.html`

**Why it matters:** The chip multi-select is a key interaction pattern for this product (specialties, insurance, approaches). If the onboarding form looks different from the profile edit form and the referral form, users learn three patterns instead of one.

**Fix:** Update onboarding form to show the same chip-based multi-select interaction as the other forms. At minimum, show the "filling" state with example chips so the user understands the pattern.

---

### F7. PHI reminder notice only in create-referral

**What:** The PHI safety guardrail (terracotta left-border notice) only appears in `create-referral.html`. The onboarding context notes and any free-text fields on the profile should also surface this reminder.

**Where:** `onboarding.html`, `therapist-profile.html`

**Why it matters:** PHI compliance is a system-wide concern (per CLAUDE.md health-data-compliance rules). If a therapist can type free text anywhere, the reminder should be present. Consistency also reinforces trust.

**Fix:** Add the PHI reminder notice above any free-text textarea in onboarding bio field and profile bio field. Same component, same styling.

---

## Polish — Nice to Fix

### P1. Active nav state is too subtle

**What:** The active nav link uses a 2px bottom border in brand teal, positioned 18px below the text. This is hard to notice, especially on mobile.

**Where:** All authenticated mocks

**Fix:** Consider a pill/tag background treatment (subtle `rgba(42,124,124,0.08)` background + teal text) instead of just an underline. Or make the underline thicker (3px) and closer to the text.

---

### P2. Badge variants not documented in system.md

**What:** The mocks define 4 badge styles (badge-sent, badge-responded, badge-connected, badge-closed) with specific colors, but these aren't captured in system.md's Components section.

**Where:** `referral-tracker.html`, `referral-detail.html`

**Fix:** Add a Badge component pattern to system.md documenting all 4 variants with their color mappings. This belongs in the Components section (currently empty, waiting for Phase 5+ patterns).

---

### P3. Avatar initials are hardcoded "SC" everywhere

**What:** The user avatar in the nav always shows "SC" (Sarah Chen). This is fine for a mock but the same initials on every screen makes it feel like a template, not a product.

**Where:** All authenticated mocks

**Fix:** Minor — keep "SC" but ensure it's consistent. Consider adding a subtle hover dropdown on the avatar showing the user's full name and "Sign Out" option (currently inconsistent — some mocks have it, others don't).

---

### P4. Select dropdowns use native `<select>` — cannot be styled

**What:** Form selects use native `<select>` elements which render as OS-native controls and can't be styled to match the design system.

**Where:** `create-referral.html`, `onboarding.html`, `therapist-profile.html`

**Why it matters:** The interface-design skill explicitly says: "Native `<select>` and `<input type="date">` render OS-native elements that cannot be styled. Build custom components."

**Fix:** For mocks, this is acceptable — the visual intent is clear. Note for implementation: replace all `<select>` with custom dropdown components styled with system tokens.

---

### P5. Mobile hamburger menu doesn't show in all mocks

**What:** Some authenticated mocks include the mobile hamburger menu with `mob-menu` toggle, others omit it entirely.

**Where:** `referral-detail.html` and `therapist-profile.html` are missing the mobile menu toggle

**Fix:** Add consistent mobile nav with hamburger toggle to all authenticated mocks.

---

## Mandate Check Summary

| Check | Result | Notes |
|-------|--------|-------|
| **Swap test** | Partial pass | Colors carry identity. Component shapes are generic. Match Ring is the only structural differentiator. |
| **Squint test** | Pass | Hierarchy holds — brand CTA visible, status badges readable, page structure clear when blurred. |
| **Signature test** | Fail | Match Ring appears in 1 of 7 screens. Need 5+ touchpoints. |
| **Token test** | Partial pass | System.md defines comprehensive tokens. Mocks hardcode values instead of using them as CSS custom properties. Off-scale spacing (40px, 6px). |

---

## Priority Order for Fixes

1. **C1** — Add Match Rings to tracker rows and profile (highest impact on product identity)
2. **C2** — Fix off-scale spacing across all mocks
3. **C3** — Add missing states to referral-detail and therapist-profile
4. **F1** — Refine button/input shapes for swap test survival
5. **F2** — Standardize label colors
6. **F3** — Unify nav component across mocks
7. **F6** — Align onboarding form with chip pattern
8. **F7** — Add PHI reminder to all free-text fields
