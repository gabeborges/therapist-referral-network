# Proposal: Profile Field Restructure

## What

Restructure the profile form into 6 logical sections, rename several DB columns to match their labels, re-add `therapistGender` and three boolean fields (`proBono`, `reducedFees`, `acceptsInsurance`), replace the payment methods semantic (from flags to actual payment instruments), and sync onboarding step 3 with `freeConsultation`.

## Why

1. **Inconsistent field names** — `professionalEmail`, `styleDescriptors`, `clientEthnicity`, `alliedGroups` don't match their user-facing labels. The DB column should match the concept.
2. **Boolean fields stored in array** — `proBono`, `reducedFees`, and `acceptsInsurance` were incorrectly stored as strings in `paymentMethods[]`. They should be proper booleans like `freeConsultation` for simpler queries and consistency.
3. **Payment methods mismatch** — `paymentMethods` was storing insurance/billing flags, not actual payment instruments (Visa, Cash, etc.). Users need to declare what payment instruments they accept.
4. **Missing gender** — Removed in previous change but needed for therapist matching preferences.
5. **Profile form is flat** — No visual grouping. Reorganizing into 6 sections improves scanability.

## Scope

### In scope

1. **DB column renames**: `professionalEmail` → `contactEmail`, `styleDescriptors` → `therapyStyle`, `clientEthnicity` → `ethnicity`, `alliedGroups` relation → `groups`
2. **Re-add fields**: `therapistGender String?`, `proBono Boolean`, `reducedFees Boolean`, `acceptsInsurance Boolean`
3. **Remove fields**: `otherTreatmentOrientation`
4. **Payment methods**: Change `paymentMethods String[]` to store payment instruments (ACH, Visa, Cash, Cheque, Direct billing, Discover, e-Transfer, HSA, Mastercard, Paypal, Wire)
5. **Profile form**: Reorganize into 6 sections (Bio, Qualifications, Your practice, Communities served, Finances, Availability)
6. **Onboarding sync**: Add `freeConsultation` checkbox to step 3, update `professionalEmail` → `contactEmail`
7. **Label renames**: "Languages" → "Languages spoken", sentence case everywhere

### Out of scope

- Referral form changes (already done in previous change)
- Matching algorithm updates
- New taxonomy tables

## Success criteria

| Metric                | Target                                                                 |
| --------------------- | ---------------------------------------------------------------------- |
| Profile form sections | 6 sections in correct order                                            |
| DB column names       | Match user-facing labels                                               |
| Boolean fields        | proBono, reducedFees, acceptsInsurance, freeConsultation — all Boolean |
| Payment methods       | 12 payment instrument options in 3-column grid                         |
| Onboarding            | Step 3 has freeConsultation checkbox, uses contactEmail                |

## Risks

| Risk                            | Mitigation                                   |
| ------------------------------- | -------------------------------------------- |
| Column renames break references | No users — clean rename, grep all references |
| paymentMethods semantic change  | No existing data to migrate                  |
| Re-adding removed fields        | Clean addition, no conflicts                 |
