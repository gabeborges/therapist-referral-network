# Tasks: Onboarding & Referral Form Restructure

## Milestone 1: Schema & Validation

Backend-only changes. No UI changes. App stays working throughout.

### ~~Task 1.1: Update Prisma schema — TherapistProfile changes~~ [x]

- **Files**: `prisma/schema.prisma`
- **What**:
  1. Add `middleName String?` after `firstName`
  2. Keep `therapistGender String?` (reintroduced for identity context)
  3. Remove `hourlyRate Float?` — replace with four per-participant rate fields stored as cents:
     - `rateIndividual Int?`
     - `rateGroup Int?`
     - `rateFamily Int?`
     - `rateCouples Int?`
  4. Remove boolean fields: `acceptsInsurance`, `directBilling`, `reducedFees`, `proBono`
     - `paymentMethods String[]` already exists and replaces them
  5. Rename `ageGroups String[]` → `ages String[]`
- **Dependencies**: None
- **Acceptance**: `npx prisma migrate dev` succeeds

### ~~Task 1.2: Update Prisma schema — ReferralPost renames and removals~~ [x]

- **Files**: `prisma/schema.prisma`
- **What**:
  1. Rename `modality String` → `modalities String[]`
  2. Rename `locationCity String?` → `city String?`
  3. Rename `locationProvince String` → `province String?` (also make optional)
  4. Rename `additionalNotes String?` → `details String?`
  5. Rename `rateBilling String?` → `rate String?`
  6. Rename `languageRequirements String[]` → `languages String[]`
  7. Remove `clientGender String?`
  8. Remove `clientAge String?`
- **Dependencies**: None (can run in same migration as 1.1)
- **Acceptance**: Migration succeeds

### ~~Task 1.3: Update Zod schema — therapist profile~~ [x]

- **Files**: `src/lib/validations/therapist-profile.ts`
- **What**:
  1. Add `middleName: z.string().optional()`
  2. Keep `therapistGender` (reintroduced)
  3. Replace `hourlyRate` with `rateIndividual`, `rateGroup`, `rateFamily`, `rateCouples` (all `z.number().optional()`, stored as Int cents)
  4. Remove `acceptsInsurance`, `directBilling`, `reducedFees`, `proBono` booleans
  5. Rename `ageGroups` → `ages`
  6. Update pronouns to enum: `z.enum(["she/her", "he/him", "they/them", "ze/hir", "ze/zir", "ey/em", "other"]).optional()` with a separate `pronounsOther: z.string().max(20).optional()` field, or store the custom value directly in `pronouns`
- **Dependencies**: Task 1.1
- **Acceptance**: Schema validates correctly for onboarding and profile form data

### ~~Task 1.4: Update Zod schema — referral post~~ [x]

- **Files**: `src/lib/validations/referral-post.ts`
- **What**:
  1. Rename `modality: z.enum(...)` → `modalities: z.array(z.enum(["in-person", "virtual", "phone"])).min(1)`
  2. Rename `locationCity` → `city`, `locationProvince` → `province` (make province optional)
  3. Rename `additionalNotes` → `details`
  4. Rename `rateBilling` → `rate`, remove "Direct billing" from options
  5. Rename `languageRequirements` → `languages`
  6. Remove `clientGender` and `clientAge` fields
- **Dependencies**: Task 1.2
- **Acceptance**: Schema validates new referral post shapes

### ~~Task 1.5: Create onboarding-specific Zod schema with step schemas~~ [x]

- **Files**: `src/lib/validations/onboarding.ts` (new)
- **What**:
  1. Create `onboardingSchema` as a subset of the profile schema with only the 16 onboarding fields
  2. Create `stepBioSchema` — pick: profileImageUrl, firstName, middleName, lastName, pronouns, displayName, professionalEmail, city, province
  3. Create `stepCommunitiesSchema` — pick: specialties, participants (min 1 required), ages, modalities
  4. Create `stepServicesSchema` — pick: rateIndividual, rateGroup, rateFamily, rateCouples, paymentMethods, acceptingClients
- **Dependencies**: Task 1.3
- **Acceptance**: Each step schema validates independently, full schema validates all fields

---

## Milestone 2: API Layer

### ~~Task 2.1: Update therapist tRPC mutations~~ [x]

- **Files**: `src/server/routers/therapist.ts` (or wherever therapist mutations live)
- **What**:
  1. Update `createProfile` and `updateProfile` input schemas to use new field names
  2. Handle `middleName`
  3. Handle per-participant rate fields instead of single `hourlyRate`
  4. Remove `therapistGender` from inputs
  5. Remove boolean payment fields, use `paymentMethods` array
  6. Rename `ageGroups` → `ages` in all queries and mutations
- **Dependencies**: Tasks 1.1, 1.3
- **Acceptance**: Profile create/update works with new field structure

### ~~Task 2.2: Update referral tRPC mutations~~ [x]

- **Files**: `src/server/routers/referral.ts` (or wherever referral mutations live)
- **What**:
  1. Update `createReferral` input to use renamed fields (modalities, city, province, details, rate, languages)
  2. Remove `clientGender` and `clientAge` from input
  3. Handle `modalities` as array instead of single string
- **Dependencies**: Tasks 1.2, 1.4
- **Acceptance**: Referral create works with new field names

### ~~Task 2.3: Update matching logic field references~~ [x]

- **Files**: `src/features/matching/` (matching logic files)
- **What**:
  1. Update all references to renamed referral fields: `modality` → `modalities`, `locationCity` → `city`, `locationProvince` → `province`, `languageRequirements` → `languages`
  2. Update profile field references: `ageGroups` → `ages`
  3. Handle `modalities` as array comparison instead of string comparison
- **Dependencies**: Tasks 1.1, 1.2
- **Acceptance**: Matching still works correctly with renamed fields

---

## Milestone 3: Onboarding Wizard UI

### ~~Task 3.1: Create WizardProgress component~~ [x]

- **Files**: `src/features/onboarding/components/WizardProgress.tsx` (new)
- **What**:
  1. Step indicator showing current step (1/4 … 4/4)
  2. Step labels: "Country", "Bio", "Communities", "Services"
  3. Visual states: completed, current, upcoming
  4. Clickable completed steps to navigate back
- **Dependencies**: None
- **Acceptance**: Component renders correct states for each step

### ~~Task 3.2: Create OnboardingWizard orchestrator~~ [x]

- **Files**: `src/features/onboarding/components/OnboardingWizard.tsx` (new)
- **What**:
  1. Single react-hook-form instance with `onboardingSchema` (zodResolver)
  2. Step state management (current step, navigation)
  3. "Next" validates current step schema before advancing
  4. "Back" navigates without validation, preserves data
  5. "Complete" on step 3 validates full form and submits
  6. Renders WizardProgress + current step component
- **Dependencies**: Tasks 1.5, 3.1
- **Acceptance**: Step navigation works, validation blocks advancement on errors

### ~~Task 3.3: Create step components~~ [x]

- **Files**:
  - `src/features/onboarding/components/OnboardingStepBio.tsx` (new)
  - `src/features/onboarding/components/OnboardingStepCommunities.tsx` (new)
  - `src/features/onboarding/components/OnboardingStepServices.tsx` (new)
- **What**:
  1. **StepBio**: ProfileImageUpload, firstName, middleName, lastName, pronouns (select with conditional "other" text input, 20 char max), displayName, professionalEmail, city, province
  2. **StepCommunities**: specialties (AutocompleteSelect), participants (ChipSelect, required), ages (ChipSelect with new options), modalities (ChipSelect)
  3. **StepServices**: dynamic rate inputs (show a currency input for each selected participant — reads `participants` from form state), payment methods (checkboxes: Insurance accepted, Direct billing, Reduced fees/sliding scale, Pro bono sessions), acceptingClients (toggle)
  4. All labels in sentence case
- **Dependencies**: Task 3.2
- **Acceptance**: Each step renders correct fields, rate inputs react to participant selection

### ~~Task 3.4: Replace OnboardingProfileForm with OnboardingWizard~~ [x]

- **Files**: `src/features/onboarding/components/OnboardingProfileForm.tsx`, parent page/layout that renders it
- **What**:
  1. Replace `OnboardingProfileForm` usage with `OnboardingWizard`
  2. Keep the same tRPC mutation call on submit
  3. Remove or archive the old single-page form
- **Dependencies**: Tasks 3.2, 3.3, 2.1
- **Acceptance**: Onboarding flow uses wizard, creates profile successfully

---

## Milestone 4: Referral Form UI

### ~~Task 4.1: Reorder and rename referral form fields~~ [x]

- **Files**: `src/features/referrals/components/ReferralPostForm.tsx`
- **What**:
  1. Reorder JSX to: Presenting issue → Details → Participants → Age group → Modalities → City + Province → Rate
  2. Rename labels: "Additional notes" → "Details", "Preferred modality" → "Modalities", "Rate / Billing" → "Rate", "Language requirements" → "Languages", "Therapy types" → "Therapeutic approaches"
  3. Update form field registrations to use new names (modalities, city, province, details, rate, languages)
  4. Update default values to match new field names
- **Dependencies**: Task 2.2
- **Acceptance**: Form renders in correct order with correct labels

### ~~Task 4.2: Change referral form control types~~ [x]

- **Files**: `src/features/referrals/components/ReferralPostForm.tsx`
- **What**:
  1. **Modalities**: change from single `<select>` to checkboxes. Options: In-person (pre-selected), Virtual, Phone. Remove "Both".
  2. **Rate**: change from `<select>` to radio buttons. Options: Full fee, Sliding scale, Pro-bono. Remove "Direct billing". Make optional.
  3. **Province**: make optional (remove required indicator)
- **Dependencies**: Task 4.1
- **Acceptance**: Controls render correctly, form submits with new types

### ~~Task 4.3: Remove clientGender and clientAge from referral form~~ [x]

- **Files**: `src/features/referrals/components/ReferralPostForm.tsx`
- **What**:
  1. Remove `clientGender` select from additional details section
  2. Remove `clientAge` text input from additional details section
  3. Remove from form default values
- **Dependencies**: Task 4.1
- **Acceptance**: Additional details section shows only: therapist gender preference, therapeutic approaches, languages, additional context

---

## Milestone 5: Cross-cutting & Profile Form

### ~~Task 5.1: Sentence case all labels~~ [x]

- **Files**: All three form components + any shared label constants
- **What**:
  1. Audit every `<label>`, `<legend>`, section header, and button text
  2. Convert from Title Case to sentence case
  3. Only change rendered text — not variable names, constants, or component names
  4. Applies to: OnboardingWizard steps, ProfileForm, ReferralPostForm
- **Dependencies**: Tasks 3.3, 4.1
- **Acceptance**: No Title Case labels remain in any form

### ~~Task 5.2: Update ProfileForm — add middle name, remove gender, rename ages, update rates~~ [x]

- **Files**: `src/features/profile/components/ProfileForm.tsx`
- **What**:
  1. Add `middleName` text input between first name and last name
  2. Keep `therapistGender` field (reintroduced for identity context)
  3. Rename "Age groups" label → "Ages", update field registration from `ageGroups` to `ages`
  4. Replace single `hourlyRate` input with per-participant rate inputs (same dynamic pattern as onboarding step 3)
  5. Remove individual boolean fields (acceptsInsurance, directBilling, reducedFees, proBono) — replace with `paymentMethods` checkboxes
  6. Keep "About you" section header (not renamed)
  7. Sentence case all labels
- **Dependencies**: Tasks 2.1, 5.1
- **Acceptance**: Profile form saves correctly with new field structure

---

## Implementation order

```
Milestone 1 (Schema)         Milestone 2 (API)          Milestone 3 (Wizard)
─────────────────────        ──────────────────         ────────────────────
1.1 Profile schema ────────→ 2.1 Profile mutations ──→  3.1 WizardProgress
1.2 Referral schema ───────→ 2.2 Referral mutations      3.2 OnboardingWizard
1.3 Profile Zod              2.3 Matching logic           3.3 Step components
1.4 Referral Zod                                          3.4 Replace old form
1.5 Onboarding Zod

                             Milestone 4 (Referral)     Milestone 5 (Cross-cutting)
                             ──────────────────         ────────────────────────────
                             4.1 Reorder + rename        5.1 Sentence case labels
                             4.2 Control types            5.2 ProfileForm updates
                             4.3 Remove fields
```

Milestones 3 and 4 can run in parallel after Milestone 2. Milestone 5 runs last.
