# Tasks: Refactor Consent Display Gating

## 1. Remove conditional rendering from faith/ethnicity fields

- [x] 1.1 In `ProfileSectionCommunities.tsx`, remove the `{consentCommunitiesServed && (...)}` wrapper around the faith orientation `AutocompleteSelect` (lines 109-124) so it always renders
- [x] 1.2 Remove the `{consentCommunitiesServed && (...)}` wrapper around the ethnicity `CheckboxGroup` (lines 127-137) so it always renders
- [x] 1.3 Remove the `useWatch` import and `consentCommunitiesServed` watch variable (line 47) — no longer needed for conditional rendering

## 2. Restyle and reposition consent checkbox

- [x] 2.1 Move the consent checkbox block (lines 82-106) to after the Groups `AutocompleteSelect` (after line 173), making it the last element inside the `<FormGroup>`
- [x] 2.2 Replace the raw `<input type="checkbox">` with the `CheckboxGroup` visual pattern: sr-only input + `.cb-box` styled span (18px, rounded-[4px], border-border, bg-inset) + checkmark SVG, using the same classes from `CheckboxGroup.tsx`
- [x] 2.3 Update the consent label text to: "I consent to collecting and displaying my cultural background and faith orientation on my public profile and using it for referral matching. I can withdraw this consent at any time from my profile settings."

## 3. Verification

- [x] 3.1 Verify the profile edit form renders faith orientation and ethnicity fields when consent is unchecked
- [x] 3.2 Verify the consent checkbox visually matches other checkboxes in the form
- [x] 3.3 Verify form submission saves faith/ethnicity data regardless of consent state (no schema or tRPC changes needed — already works)
- [x] 3.4 Run type check and lint to confirm no regressions
