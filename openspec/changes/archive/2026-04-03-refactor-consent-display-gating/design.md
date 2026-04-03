# Design: Refactor Consent Display Gating

## Context

The `ProfileSectionCommunities` component currently wraps faith orientation and ethnicity fields in `{consentCommunitiesServed && (...)}` — hiding them entirely when consent is unchecked. The consent checkbox sits mid-form (between modalities and faith orientation) using a raw `<input type="checkbox">` that doesn't match the project's `CheckboxGroup` styling.

This was built as part of the PIPEDA compliance infrastructure (change `compliance-consent-infrastructure`). The schema, Zod validation, and tRPC routers already handle `consentCommunitiesServed` as a boolean field on `TherapistProfile`. No data model changes are needed.

Currently, no public profile page renders faith/ethnicity fields, and the matching logic doesn't use them yet. This change establishes the gating pattern so that when those features are added, consent is already enforced.

## Goals / Non-Goals

**Goals:**

- Faith orientation and ethnicity fields are always visible and editable in the profile form
- Consent checkbox is restyled to match `CheckboxGroup` visual pattern
- Consent checkbox is repositioned to bottom of Communities Served section
- Consent text is updated to reflect "collecting and displaying" language
- Establish the pattern: consent=false → data saved but not displayed/matched

**Non-Goals:**

- Changing the Zod schema, Prisma schema, or tRPC routers (already correct)
- Building the public profile display for these fields (separate change)
- Implementing referral matching on faith/ethnicity (not yet in matching logic)
- Modifying the onboarding flow (no faith/ethnicity fields there)

## Decisions

### 1. Single-checkbox consent using CheckboxGroup's visual style, not the component itself

`CheckboxGroup` is designed for multi-select arrays (`string[]` via react-hook-form Controller). The consent field is a single `boolean`. Rather than adding a single-boolean mode to `CheckboxGroup`, extract the visual checkbox pattern (sr-only input + styled `.cb-box` span + checkmark SVG) into the consent checkbox markup directly. This keeps `CheckboxGroup` focused on its array use case while ensuring visual consistency.

**Alternative considered:** Wrapping `CheckboxGroup` with a single option `[{ value: "consent", label: "..." }]` and mapping to boolean. Rejected — this overcomplicates a simple boolean field and creates an awkward array-to-boolean impedance mismatch.

### 2. Consent checkbox positioned after Groups field, before FormGroup close

The consent block will be the last element inside the `<FormGroup>` in `ProfileSectionCommunities`, appearing after Languages and Groups. This places it just above the save/cancel buttons (which live in the parent `ProfileForm`), making the consent action the last thing before submission.

### 3. No backend changes in this PR — gating is a frontend concern for now

Since no public profile page currently renders faith/ethnicity and matching doesn't use them, the consent gating is purely a form UX change. When public display or matching is added, those PRs must check `consentCommunitiesServed` before rendering/querying. A code comment will mark this as a required check point.

**Alternative considered:** Adding server-side gating in the tRPC public profile query now. Rejected — there is no public profile query for these fields yet, so there's nothing to gate. Adding dead code creates maintenance burden.

### 4. Data preserved on consent toggle

When a user unchecks consent after filling fields, the data stays in the form (and DB). The fields remain visible and editable. Only the _public display and matching usage_ changes. This avoids data loss and lets users re-consent without re-entering information.

## Risks / Trade-offs

| Risk                                                               | Mitigation                                                                                                                                            |
| ------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Future public profile PR forgets consent check                     | Add TODO comment in proposal/design. Matching test fixtures already set `consentCommunitiesServed: false` — any matching PR will need to handle this. |
| Visual mismatch between consent checkbox and CheckboxGroup         | Use exact same CSS classes (`cb-box`, `sr-only peer`, `peer-checked:bg-brand`, etc.) from CheckboxGroup component.                                    |
| User confusion — fields visible but "not used" when consent is off | Consent text explicitly states what consenting enables. Fields are always editable regardless.                                                        |

## Open Questions

_None — scope is contained to a single component with no schema or API changes._
