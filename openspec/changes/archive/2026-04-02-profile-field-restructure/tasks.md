# Tasks: Profile Field Restructure

## Milestone 1: Schema & Validation

### ~~Task 1.1: Update Prisma schema~~ [x]

- **Files**: `prisma/schema.prisma`
- **What**:
  1. **Rename** `professionalEmail String?` → `contactEmail String?`
  2. **Rename** `styleDescriptors String[]` → `therapyStyle String[]`
  3. **Rename** `clientEthnicity String[]` → `ethnicity String[]`
  4. **Rename** relation `alliedGroupRecords AlliedGroup[] @relation("ProfileAlliedGroups")` → `groupRecords AlliedGroup[] @relation("ProfileGroups")`
  5. **Re-add** `therapistGender String?`
  6. **Re-add** `proBono Boolean @default(false)`
  7. **Re-add** `reducedFees Boolean @default(false)`
  8. **Re-add** `acceptsInsurance Boolean @default(false)`
  9. **Remove** `otherTreatmentOrientation String?`
  10. **Remove** `paymentMethodRecords PaymentMethod[] @relation("ProfilePaymentMethods")` (unused — paymentMethods is now a plain String[])
  11. **Update** `paymentMethods` comment to: `// payment instruments: "Visa", "Cash", "Direct billing", etc.`
- **Acceptance**: `npx prisma db push` succeeds

### ~~Task 1.2: Update Zod schema — therapist profile~~ [x]

- **Files**: `src/lib/validations/therapist-profile.ts`
- **What**:
  1. Rename `professionalEmail` → `contactEmail`
  2. Rename `styleDescriptors` → `therapyStyle`
  3. Rename `clientEthnicity` → `ethnicity`
  4. Rename `alliedGroups` → `groups`
  5. Re-add `therapistGender: z.string().optional()`
  6. Re-add `proBono: z.boolean()`
  7. Re-add `reducedFees: z.boolean()`
  8. Re-add `acceptsInsurance: z.boolean()`
  9. Remove `otherTreatmentOrientation`
  10. Replace `PAYMENT_METHOD_OPTIONS` constant with payment instruments: ACH Bank transfer, American Express, Cash, Cheque, Direct billing, Discover, e-Transfer, Health Savings Account, Mastercard, Paypal, Visa, Wire
- **Acceptance**: Schema validates correctly

### ~~Task 1.3: Update onboarding Zod schema~~ [x]

- **Files**: `src/lib/validations/onboarding.ts`
- **What**:
  1. Replace `professionalEmail` → `contactEmail` in all schema picks
  2. **Remove** `paymentMethods` from onboarding schema and step Services pick (payment instruments are profile-only)
  3. **Add** `freeConsultation` to step Services pick
  4. **Add** `proBono` to step Services pick
- **Acceptance**: Onboarding schema has no `paymentMethods`, has `freeConsultation` + `proBono`

---

## Milestone 2: API Layer

### ~~Task 2.1: Update therapist tRPC mutations~~ [x]

- **Files**: `src/lib/trpc/routers/therapist.ts`
- **What**:
  1. Rename all references: `professionalEmail` → `contactEmail`, `styleDescriptors` → `therapyStyle`, `clientEthnicity` → `ethnicity`
  2. Rename `alliedGroupRecords` → `groupRecords` in relation connect/set, and `alliedGroups` → `groups` in input handling
  3. Re-add to create/update data: `therapistGender`, `proBono`, `reducedFees`, `acceptsInsurance`
  4. Remove from create/update data: `otherTreatmentOrientation`
  5. Remove `paymentMethodRecords` connect/set operations entirely
  6. Remove `paymentMethodRecords` from `getProfile` include
- **Acceptance**: Profile create/update works with new field names

### ~~Task 2.2: Update matching logic for renamed fields~~ [x]

- **Files**: `src/features/matching/match-referral-to-profiles.ts`
- **What**:
  1. Check `computeCompletenessBoost` — if it references any renamed fields, update them
  2. Grep for any other references to old field names in matching files
- **Acceptance**: Matching still works, no stale references

---

## Milestone 3: Profile Form UI

### ~~Task 3.1: Restructure ProfileForm into sections with correct field order~~ [x]

- **Files**: `src/features/profile/components/ProfileForm.tsx`
- **What**: Reorganize into 5 sections + availability, following exact field order:

  **Bio** (fieldset):
  1. Profile photo, 2. Name (3 inputs), 3. Pronouns, 4. Gender (re-add select), 5. Display name, 6. Bio, 7. Contact email, 8. Website URL, 9. Psychology Today URL, 10. City + Province

  **Qualifications** (fieldset): 11. Primary credential, 12. Additional credentials, 13. License level

  **Your practice** (fieldset): 14. Therapeutic approaches, 15. Specialties, 16. Top specialties, 17. Therapy style (rename), 18. I offer pro bono sessions (checkbox `proBono`), 19. I offer a free initial consultation (checkbox `freeConsultation`)

  **Communities served** (fieldset, subtitle "your clients"): 20. Participants, 21. Ages, 22. Modalities, 23. Faith orientation, 24. Ethnicity (rename), 25. Languages spoken (label rename), 26. Groups (rename)

  **Finances** (fieldset): 27. Rate, 28. Payment methods (3-column grid), 29. Reduced fees checkbox, 30. Accepts insurance checkbox, 31. Insurance (conditional), 32. Currently accepting clients toggle

- **Acceptance**: All fields render in correct order with correct section groupings

### ~~Task 3.2: Apply field renames and re-adds in ProfileForm~~ [x]

- **Files**: `src/features/profile/components/ProfileForm.tsx`
- **What**:
  1. `professionalEmail` → `contactEmail` (register + label "Contact email")
  2. `styleDescriptors` → `therapyStyle` (label "Therapy style")
  3. `clientEthnicity` → `ethnicity` (label "Ethnicity")
  4. `alliedGroups` → `groups` (label "Groups")
  5. "Languages" label → "Languages spoken"
  6. Re-add gender select in Bio (Female, Male, Non-binary, Prefer not to say)
  7. Re-add `proBono` checkbox: "I offer pro bono sessions" in Your practice
  8. Re-add `reducedFees` checkbox: "I offer reduced fees / sliding scale" in Finances
  9. Re-add `acceptsInsurance` checkbox: "I accept insurance" in Finances (controls insurers visibility)
  10. Move `freeConsultation` checkbox to Your practice section
  11. Remove `otherTreatmentOrientation` field entirely
  12. Ensure ALL labels are sentence case
- **Acceptance**: All labels correct, no Title Case, no stale field names

### ~~Task 3.3: Add payment methods 3-column checkbox grid~~ [x]

- **Files**: `src/features/profile/components/ProfileForm.tsx`
- **What**:
  1. Replace current payment methods section with 3-column responsive checkbox grid
  2. Import `PAYMENT_METHOD_OPTIONS` from validations
  3. Options: ACH Bank transfer, American Express, Cash, Cheque, Direct billing, Discover, e-Transfer, Health Savings Account, Mastercard, Paypal, Visa, Wire
  4. Insurance multi-select only visible when `acceptsInsurance` checkbox is checked
  5. When `acceptsInsurance` is unchecked, clear insurers selection
- **Acceptance**: Grid renders 12 options in 3 columns, insurance toggle works

### ~~Task 3.4: Update profile edit page default values~~ [x]

- **Files**: `src/app/profile/edit/page.tsx`
- **What**:
  1. Rename: `professionalEmail` → `contactEmail`, `styleDescriptors` → `therapyStyle`, `clientEthnicity` → `ethnicity`, `alliedGroups` → `groups`
  2. Add: `therapistGender`, `proBono`, `reducedFees`, `acceptsInsurance`
  3. Remove: `otherTreatmentOrientation`
- **Acceptance**: Edit page loads correctly

---

## Milestone 4: Onboarding Sync

### ~~Task 4.1: Update onboarding step components~~ [x]

- **Files**:
  - `src/features/onboarding/components/OnboardingStepBio.tsx`
  - `src/features/onboarding/components/OnboardingStepServices.tsx`
  - `src/features/onboarding/components/OnboardingWizard.tsx`
- **What**:
  1. **StepBio**: rename `professionalEmail` → `contactEmail` (register + label "Contact email")
  2. **StepServices**: **Remove** all paymentMethods-based checkboxes (the old "I accept insurance", "I offer reduced fees", "I offer pro bono" that stored in paymentMethods[])
  3. **StepServices**: **Add** `proBono` boolean checkbox: "I offer pro bono sessions"
  4. **StepServices**: **Add** `freeConsultation` boolean checkbox: "I offer a free initial consultation"
  5. **Wizard defaults**: update `handleComplete` —
     - Rename `professionalEmail` → `contactEmail`
     - Remove `otherTreatmentOrientation`
     - Remove `paymentMethods: []` from defaults (no longer in onboarding)
     - Rename `styleDescriptors` → `therapyStyle`, `clientEthnicity` → `ethnicity`, `alliedGroups` → `groups`
     - Add: `therapistGender: ""`, `reducedFees: false`, `acceptsInsurance: false`
     - Keep: `proBono` and `freeConsultation` come from the form data now
- **Acceptance**: Onboarding creates profile with correct field names, no paymentMethods in step 3

---

## Milestone 5: Other References

### ~~Task 5.1: Update all remaining file references~~ [x]

- **Files**: Grep `src/` for old field names
- **What**: Search and replace in all files:
  - `professionalEmail` → `contactEmail`
  - `styleDescriptors` → `therapyStyle`
  - `clientEthnicity` → `ethnicity`
  - `alliedGroups` → `groups` (in Zod/form context)
  - `alliedGroupRecords` → `groupRecords` (in Prisma/tRPC context)
  - `otherTreatmentOrientation` → remove references
  - Remove `paymentMethodRecords` references
  - Explicit files to check: ProfileView.tsx, email templates, notification files, referral detail pages, slug page
- **Acceptance**: Zero references to old field names in `src/`

### ~~Task 5.2: Update tests~~ [x]

- **Files**: `src/lib/validations/__tests__/therapist-profile.test.ts`, `src/features/matching/__tests__/match-referral-to-profiles.test.ts`
- **What**:
  1. Rename fields in test fixtures: `professionalEmail` → `contactEmail`, `styleDescriptors` → `therapyStyle`, `clientEthnicity` → `ethnicity`
  2. Add `therapistGender`, `proBono`, `reducedFees`, `acceptsInsurance` to fixtures
  3. Remove `otherTreatmentOrientation` from fixtures
  4. Add boolean field tests for `proBono`, `reducedFees`, `acceptsInsurance`
- **Acceptance**: All tests pass

---

## Implementation order

```
Milestone 1 (Schema)       Milestone 2 (API)       Milestone 3 (Profile UI)
────────────────────       ──────────────────      ─────────────────────────
1.1 Prisma changes ──────→ 2.1 tRPC mutations ──→  3.1 Restructure sections
1.2 Zod schema             2.2 Matching logic       3.2 Field renames + re-adds
1.3 Onboarding Zod                                  3.3 Payment methods grid
                                                    3.4 Edit page defaults

                           Milestone 4 (Onboarding)  Milestone 5 (Cleanup)
                           ────────────────────────   ────────────────────
                           4.1 Step components         5.1 Grep + fix all refs
                                                       5.2 Update tests
```
