## 1. Verify Shared Styling Baseline

- [x] 1.1 Audit `ReferralPostForm.tsx` for any inline checkbox/radio markup that bypasses `CheckboxGroup` or shared radio styling — list all instances to replace
- [x] 1.2 Confirm `form-styles.ts` utilities (`inputClasses`, `selectClasses`, `selectStyle`) are used for all input/select fields in the referral form

## 2. FormGroup Section Wrapping

- [x] 2.1 Wrap `presentingIssue`, `city`, `province`, and `details` fields in `<FormGroup title="Core Details">`
- [x] 2.2 Wrap `modalities` and `rate` fields in `<FormGroup title="Session Format">`
- [x] 2.3 Create a collapsible "Matching Preferences" section containing `participants` and `ageGroup`
- [x] 2.4 Verify existing "Additional Details" collapsible section still works correctly after restructure

## 3. Component & Styling Alignment

- [x] 3.1 Replace any inline modalities checkbox markup with `<CheckboxGroup>` component
- [x] 3.2 Apply `.cb-box` / `accent-brand` radio styling pattern to the `rate` field radio buttons
- [x] 3.3 Ensure `participants` select dropdown uses `selectClasses` and `selectStyle` from `form-styles.ts`

## 4. Field Changes

- [x] 4.1 Remove `modalities` default value (`defaultValues.modalities = []`) — keep required validation
- [x] 4.2 Move `participants` field into "Matching Preferences" collapsible section (keep as dropdown select)
- [x] 4.3 Move `ageGroup` field into "Matching Preferences" collapsible section
- [x] 4.4 Rename "Age Group" label to "Ages"

## 5. Label Audit

- [x] 5.1 Audit all referral form field labels against Prisma schema field names — fix any mismatches (labels only, not field names)

## 6. Verification

- [x] 6.1 Visual comparison: referral form styling matches profile edit form (spacing, fonts, borders, component styling)
- [ ] 6.2 Form submission works correctly with all field combinations (including empty Matching Preferences)
- [ ] 6.3 Validation error displays when submitting without selecting a modality
- [x] 6.4 Run preflight checks (lint, typecheck, tests)
