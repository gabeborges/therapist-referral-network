# Design: Onboarding & Referral Form Restructure

## Architecture overview

Three parallel workstreams converging on shared schema/label changes:

```
1. Onboarding wizard     → New multi-step component replacing single-page form
2. Referral form changes → Field renames, reorder, control type changes in existing form
3. Cross-cutting         → Schema changes, label casing, field additions/removals
```

## Data model changes

### TherapistProfile — new/changed fields

```prisma
model TherapistProfile {
  // ADD
  middleName        String?

  // REMOVE
  // therapistGender  — delete entirely

  // CHANGE: rate restructure
  // hourlyRate Float?  — REMOVE (single rate)
  // ADD: per-participant rates (nullable — rates are optional)
  rateIndividual    Float?
  rateGroup         Float?
  rateFamily        Float?
  rateCouples       Float?

  // RENAME for consistency
  // ageGroups String[] → ages String[]
  ages              String[]   // was: ageGroups

  // Everything else stays as-is
}
```

### ReferralPost — field renames and removals

```prisma
model ReferralPost {
  // RENAME
  // modality String          → modalities String[]  (single→array, add "Phone")
  // locationCity String?     → city String?
  // locationProvince String  → province String?     (also make optional)
  // additionalNotes String?  → details String?
  // rateBilling String?      → rate String?
  // languageRequirements String[] → languages String[]

  // REMOVE
  // clientGender String?  — delete
  // clientAge String?     — delete

  // KEEP AS-IS
  // presentingIssue, ageGroup, participants, therapistGenderPref,
  // therapyTypes, additionalContext, status, currentBatch, etc.
}
```

### Pronouns — enum values

Store as string. Options presented in UI:

- `she/her`, `he/him`, `they/them`, `ze/hir`, `ze/zir`, `ey/em`, `other`
- When "other" is selected, a free-text input appears (max 20 characters)
- Stored value: the selected option string, or the free-text value if "other"

### Ages — rename and values

Rename field `ageGroups` → `ages` everywhere. Options:

- `Toddler`, `Children (6-10)`, `Preteen`, `Teen`, `Adults`, `Elders (65+)`

### Rate — per-participant structure

Current: single `hourlyRate: Float?` on profile, `rateBilling: String?` on referral.

New on profile:

- `rateIndividual`, `rateGroup`, `rateFamily`, `rateCouples` — all `Float?` (cents)
- Only the rates matching selected `participants[]` are shown in the form
- Deselecting a participant type clears its rate value

New on referral:

- `rate: String?` — unchanged concept (radio: "Full fee", "Sliding scale", "Pro-bono"), just renamed from `rateBilling` and "Direct billing" removed from options

### Payment methods on profile

Current: `acceptsInsurance` (boolean), `directBilling` (boolean), `reducedFees` (boolean), `proBono` (boolean) as separate fields.

New: consolidate into `paymentMethods String[]` multi-select with options:

- `Insurance accepted`, `Direct billing`, `Reduced fees / sliding scale`, `Pro bono sessions`

Remove the individual boolean fields: `acceptsInsurance`, `directBilling`, `reducedFees`, `proBono`.

## Onboarding wizard

### Component structure

```
OnboardingWizard.tsx          — orchestrator, owns form state + step navigation
  WizardProgress.tsx          — step indicator (1/3, 2/3, 3/3) with labels
  OnboardingStepBio.tsx       — step 1 fields
  OnboardingStepCommunities.tsx — step 2 fields
  OnboardingStepServices.tsx  — step 3 fields
```

### State management

Single `react-hook-form` instance in `OnboardingWizard` with the full schema. Each step component receives the form via props (or `useFormContext`). Step navigation triggers validation of only that step's fields before advancing.

```typescript
// Zod schemas split per step for partial validation
const stepBioSchema = onboardingSchema.pick({
  profileImageUrl: true,
  firstName: true,
  middleName: true,
  lastName: true,
  pronouns: true,
  displayName: true,
  professionalEmail: true,
  city: true,
  province: true,
});

const stepCommunitiesSchema = onboardingSchema.pick({
  specialties: true,
  participants: true,
  ages: true,
  modalities: true,
});

const stepServicesSchema = onboardingSchema.pick({
  rateIndividual: true,
  rateGroup: true,
  rateFamily: true,
  rateCouples: true,
  paymentMethods: true,
  acceptingClients: true,
});
```

### Step validation flow

1. User fills step 1 → clicks "Next"
2. Validate step 1 fields only → show errors or advance
3. User fills step 2 → clicks "Next"
4. Validate step 2 fields only → show errors or advance
5. User fills step 3 → clicks "Complete"
6. Validate step 3 + submit full form

"Back" button navigates without validation (preserve entered data).

### Onboarding fields (subset of profile)

| #   | Field                  | Step        | Required | Control                                 |
| --- | ---------------------- | ----------- | -------- | --------------------------------------- |
| 1   | Profile photo          | Bio         | No       | ProfileImageUpload                      |
| 2   | First name             | Bio         | Yes      | text input                              |
| 3   | Middle name            | Bio         | No       | text input                              |
| 4   | Last name              | Bio         | Yes      | text input                              |
| 5   | Pronouns               | Bio         | No       | select + conditional text (20 char max) |
| 6   | Display name           | Bio         | No       | text input                              |
| 7   | Professional email     | Bio         | Yes      | email input                             |
| 8   | City                   | Bio         | Yes      | text input                              |
| 9   | Province               | Bio         | Yes      | select                                  |
| 10  | Specialties            | Communities | Yes      | AutocompleteSelect                      |
| 11  | Participants           | Communities | Yes      | ChipSelect                              |
| 12  | Ages                   | Communities | Yes      | ChipSelect                              |
| 13  | Modalities             | Communities | Yes      | ChipSelect                              |
| 14  | Rate (per participant) | Services    | No       | dynamic currency inputs                 |
| 15  | Payment methods        | Services    | No       | checkboxes                              |
| 16  | Accepting clients      | Services    | Yes      | toggle                                  |

## Referral form changes

### Field order (new)

| #   | Field            | Control               | Required | Changes                                                                                                                  |
| --- | ---------------- | --------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------ |
| 1   | Presenting issue | text input            | Yes      | No change                                                                                                                |
| 2   | Details          | textarea (1000 chars) | No       | Renamed from "Additional notes"                                                                                          |
| 3   | Participants     | select dropdown       | No       | Was optional select, no change to control                                                                                |
| 4   | Age group        | select dropdown       | Yes      | No change                                                                                                                |
| 5   | Modalities       | checkboxes            | Yes      | Renamed from "Preferred modality", was single select. Options: In-person (pre-selected), Virtual, Phone. Removed "Both". |
| 6   | City             | text input            | No       | Renamed from locationCity, was optional                                                                                  |
| 7   | Province         | select                | No       | Renamed from locationProvince, now optional                                                                              |
| 8   | Rate             | radio buttons         | No       | Renamed from "Rate / Billing", removed "Direct billing". Options: Full fee, Sliding scale, Pro-bono                      |

### Additional details section (collapsible)

| Field                       | Control               | Changes                              |
| --------------------------- | --------------------- | ------------------------------------ |
| Therapist gender preference | select                | No change                            |
| Therapeutic approaches      | AutocompleteSelect    | Renamed label from "Therapy types"   |
| Languages                   | AutocompleteSelect    | Renamed from "Language requirements" |
| Additional context          | textarea (2000 chars) | No change                            |

Removed from this section: `clientGender`, `clientAge`.

### Referral field rename map

| Current field          | New field               | Schema layers to update           |
| ---------------------- | ----------------------- | --------------------------------- |
| `modality` (String)    | `modalities` (String[]) | Prisma, Zod, tRPC, form, matching |
| `locationCity`         | `city`                  | Prisma, Zod, tRPC, form           |
| `locationProvince`     | `province`              | Prisma, Zod, tRPC, form           |
| `additionalNotes`      | `details`               | Prisma, Zod, tRPC, form           |
| `rateBilling`          | `rate`                  | Prisma, Zod, tRPC, form           |
| `languageRequirements` | `languages`             | Prisma, Zod, tRPC, form, matching |

## Cross-cutting: label casing

All `<label>`, `<legend>`, section headers, and placeholder text across all three forms must use sentence case:

- "Presenting issue" not "Presenting Issue"
- "Age group" not "Age Group"
- "Professional email" not "Professional Email"

Scope: only rendered text in form labels. Do not change variable names, constants, or component names.

## Cross-cutting: section rename

"About you" → "Bio" in onboarding wizard step title and profile form section header.

## Key decisions

1. **Single react-hook-form across wizard steps** — avoids syncing state between forms. Each step is a view into the same form instance.
2. **Onboarding is a strict subset** — profile has all fields, onboarding has 16 (13 field groups). Fields not in onboarding remain profile-only.
3. **Per-participant rate fields** — four nullable Float columns rather than a JSON field. Simpler to query and validate.
4. **Payment methods as String[]** — consolidates 4 boolean fields into one array. Cleaner schema, easier to extend.
5. **No data migration** — no users have onboarded. Clean schema changes, drop old columns.
6. **Modalities on referral becomes array** — matches profile's `modalities String[]`. Removes need for "Both" option.
