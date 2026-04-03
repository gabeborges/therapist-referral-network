# Proposal: Refactor Consent Display Gating

## Why

The communities consent checkbox currently gates **field visibility** — faith orientation and ethnicity inputs are hidden until consent is checked. This conflates data entry with data usage. Users should be able to fill these fields at any time; consent should only control whether the data is **displayed publicly** and **used in referral matching**. The current UX also places the consent checkbox above the fields it controls (confusing) and uses a raw `<input>` instead of the project's `CheckboxGroup` styling.

## What Changes

- **Always render** faith orientation and ethnicity fields (remove conditional `{consentCommunitiesServed && ...}` wrappers)
- **Move consent checkbox** from mid-section to the bottom of the Communities Served form group, just above cancel/save buttons
- **Restyle consent checkbox** to match `CheckboxGroup` component styling (consistent rounded-sm, accent, spacing)
- **Update consent text** to: "I consent to collecting and displaying my cultural background and faith orientation on my public profile and using it for referral matching. I can withdraw this consent at any time from my profile settings."
- **Consent gates usage, not entry** — when consent is false, faith/ethnicity data is still saved to the DB but excluded from public profile display and referral matching queries

## Capabilities

### New Capabilities

_None — this change refactors existing behavior within the communities consent feature._

### Modified Capabilities

_No existing spec-level requirement changes — `form-design-tokens` is unaffected. The consent field and its schema already exist; this changes only the frontend conditional rendering pattern and the backend display/matching gating logic._

## Impact

- **Frontend**: `ProfileSectionCommunities.tsx` — remove conditional rendering, reorder elements, restyle checkbox
- **Backend display**: Any public profile rendering of faith/ethnicity must check `consentCommunitiesServed` before displaying (currently no public profile displays these fields, but the gate must be in place)
- **Referral matching**: Matching queries that use faith/ethnicity must exclude profiles where `consentCommunitiesServed === false`
- **No schema/migration changes** — `consentCommunitiesServed`, `faithOrientation`, and `ethnicity` fields already exist
- **No validation changes** — Zod schema and tRPC routers already handle the field
