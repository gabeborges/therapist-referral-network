# Tasks: Profile & Referral Field Expansion

## Milestone 1: Schema & Data Layer

Everything in this milestone is backend — no UI changes. App stays working throughout.

### ~~Task 1.1: Create taxonomy tables in Prisma schema~~ [x]
- **Files**: `prisma/schema.prisma`
- **What**: Add `Specialty`, `TherapyType`, `Language`, `AlliedGroup`, `PaymentMethod` models with `id`, `name`, `category?`, `sortOrder` fields
- **What**: Add many-to-many implicit relations to `TherapistProfile` (`specialtyRecords`, `therapyTypeRecords`, `languageRecords`, `alliedGroupRecords`, `paymentMethodRecords`)
- **Migration safety**: Additive only — no existing tables or columns modified
- **Dependencies**: None
- **Acceptance**: `npx prisma migrate dev` succeeds, new tables exist in DB

### ~~Task 1.2: Add new scalar fields to TherapistProfile~~ [x]
- **Files**: `prisma/schema.prisma`
- **What**: Add all new fields: `imageUrl`, `websiteUrl`, `psychologyTodayUrl`, `proBono`, `professionalEmail`, `primaryCredential`, `credentials`, `freeConsultation`, `pronouns`, `therapistGender`, `licensingLevel`, `otherTreatmentOrientation`, `participants`, `topSpecialties`, `faithOrientation`, `clientEthnicity`, `styleDescriptors`
- **Migration safety**: All nullable or have defaults (`Boolean @default(false)`, `String[]` defaults to `[]`). No existing data affected.
- **Dependencies**: None (can run in same migration as 1.1)
- **Acceptance**: Migration succeeds, existing profiles still load correctly

### ~~Task 1.3: Add new fields to ReferralPost~~ [x]
- **Files**: `prisma/schema.prisma`
- **What**: Add `participants`, `rateBilling`, `clientGender`, `clientAge`, `therapistGenderPref`, `therapyTypes`, `languageRequirements`, `additionalContext`
- **Migration safety**: All nullable or String[] (empty default). Existing referral posts unaffected.
- **Dependencies**: None (can run in same migration as 1.1, 1.2)
- **Acceptance**: Migration succeeds, existing referral posts still load

### ~~Task 1.4: Create seed script for taxonomy data~~ [x]
- **Files**: `prisma/seed.ts` (new or extend existing)
- **What**: Seed all taxonomy tables with data from `.ops/onboarding-fields.md`:
  - Specialty: 85+ items (main list + Mental Health + Sexuality sub-categories)
  - TherapyType: 68 items
  - Language: 35 items
  - AlliedGroup: 15 items
  - PaymentMethod: 11 items
- **What**: Use `upsert` (by name) so seed is idempotent
- **Dependencies**: Task 1.1
- **Acceptance**: `npx prisma db seed` populates all tables, re-running doesn't duplicate

### Task 1.5: Migrate existing String[] data to relations [SKIPPED — no production data yet]
- **Files**: `prisma/migrations/*/migration.sql` or a seed/migration script
- **What**: For each existing TherapistProfile:
  1. Read `specialties[]` → find matching `Specialty` records by name → connect
  2. Read `therapeuticApproach[]` → find matching `TherapyType` records → connect
  3. Read `languages[]` → find matching `Language` records → connect
- **What**: Handle name mismatches (e.g., "Trauma / PTSD" vs "Trauma and PTSD") with a mapping table
- **Migration safety**: Keep old String[] columns — don't delete. Read from relations going forward, fall back to String[] if relation is empty.
- **Dependencies**: Task 1.4 (seed must run first so taxonomy records exist)
- **Acceptance**: All existing profiles have relation data matching their String[] data

---

## Milestone 2: API & Validation Layer

### ~~Task 2.1: Create taxonomy tRPC router~~ [x]
- **Files**: `src/server/routers/taxonomy.ts` (new), `src/server/routers/_app.ts`
- **What**: Add `taxonomyRouter` with public queries: `getSpecialties`, `getTherapyTypes`, `getLanguages`, `getAlliedGroups`, `getPaymentMethods`
- **What**: Each returns `{ id: string; name: string; category?: string }[]` sorted by `sortOrder`
- **Dependencies**: Task 1.4
- **Acceptance**: All 5 endpoints return correct data, no auth required

### ~~Task 2.2: Update therapist profile Zod schema~~ [x]
- **Files**: `src/lib/validations/therapist-profile.ts`
- **What**: Add all new fields to `therapistProfileSchema`:
  - `imageUrl`: optional url
  - `websiteUrl`: optional url
  - `psychologyTodayUrl`: optional url
  - `proBono`: boolean
  - `professionalEmail`: optional email
  - `primaryCredential`: optional string
  - `credentials`: optional string array, max 3
  - `freeConsultation`: boolean
  - `pronouns`: optional string
  - `therapistGender`: optional enum
  - `licensingLevel`: optional enum
  - `participants`: optional string array
  - `topSpecialties`: optional string array, max 3
  - `faithOrientation`: optional string
  - `clientEthnicity`: optional string array
  - `styleDescriptors`: optional string array
  - `otherTreatmentOrientation`: optional string
  - `alliedGroups`: optional array of ids
  - `paymentMethods`: optional array of ids
  - Update `specialties`, `therapeuticApproach`, `languages` to accept arrays of ids (from taxonomy tables)
- **Dependencies**: Task 1.2
- **Acceptance**: Schema validates correctly for both old and new fields

### ~~Task 2.3: Update referral post Zod schema~~ [x]
- **Files**: `src/lib/validations/referral-post.ts`
- **What**: Add new fields:
  - `participants`: optional string enum
  - `rateBilling`: optional string enum
  - `clientGender`: optional string
  - `clientAge`: optional string
  - `therapistGenderPref`: optional string
  - `therapyTypes`: optional string array
  - `languageRequirements`: optional string array
  - `additionalContext`: optional string, max 2000 chars
- **Dependencies**: Task 1.3
- **Acceptance**: Schema validates new and existing referral post shapes

### ~~Task 2.4: Update therapist tRPC mutations~~ [x]
- **Files**: `src/server/routers/therapist.ts`
- **What**: Update `createProfile` and `updateProfile` to:
  - Accept new scalar fields and persist them
  - Accept specialties/therapyTypes/languages as ID arrays, create relation connects
  - Handle `topSpecialties` as ordered string array
- **Dependencies**: Tasks 2.1, 2.2
- **Acceptance**: Creating/updating a profile with new fields works end-to-end

### ~~Task 2.5: Update referral tRPC mutations~~ [x]
- **Files**: `src/server/routers/referral.ts`
- **What**: Update `createReferral` to accept and persist new fields
- **Dependencies**: Task 2.3
- **Acceptance**: Creating a referral with new fields works end-to-end

---

## Milestone 3: UI Components & Forms

### ~~Task 3.1: Build AutocompleteSelect component~~ [x]
- **Files**: `src/features/onboarding/components/AutocompleteSelect.tsx` (new)
- **What**: Multi-select autocomplete with:
  - Text input with client-side filtering (debounced)
  - Dropdown showing filtered matches (max 10 visible)
  - Selected items as removable chips
  - Optional `ranked` mode (numbered chips, drag-to-reorder via `@dnd-kit/sortable` or native drag)
  - Optional `maxItems` limit
  - Keyboard navigation (arrows, enter, escape, backspace)
  - `loading` state for when taxonomy data is fetching
  - ARIA attributes (combobox role, listbox, option)
- **Props**: `{ label, options: {id, name}[], selected: {id, name}[], onChange, placeholder?, error?, helperText?, maxItems?, ranked?, loading? }`
- **Dependencies**: None
- **Acceptance**: Component works standalone with mock data, keyboard accessible, ranked mode reorders

### ~~Task 3.2: Update ProfileForm with new fields and AutocompleteSelect~~ [x]
- **Files**: `src/features/profile/components/ProfileForm.tsx`
- **What**:
  1. Remove hardcoded `SPECIALTIES`, `THERAPEUTIC_APPROACHES`, `LANGUAGES` constants
  2. Fetch taxonomy data via tRPC (`trpc.taxonomy.getSpecialties` etc.)
  3. Replace `ChipSelect` with `AutocompleteSelect` for: specialties, therapeuticApproach, languages, alliedGroups, paymentMethods
  4. Keep `ChipSelect` for: modalities (3), ageGroups (5-6), participants (4), styleDescriptors (7)
  5. Add new field sections grouped logically:
     - **Identity**: pronouns (select), therapistGender (select), primaryCredential (text), credentials (text inputs, max 3)
     - **Practice**: websiteUrl (url), psychologyTodayUrl (url), professionalEmail (email), licensingLevel (select), freeConsultation (checkbox)
     - **Availability & Pricing**: proBono (checkbox) alongside existing reducedFees
     - **Communities**: participants (chips), alliedGroups (autocomplete), faithOrientation (dropdown), clientEthnicity (chips)
     - **Top Specialties**: ranked autocomplete (max 3), sourced from selected specialties
  6. Use progressive disclosure — "Identity", "Practice", "Communities" sections collapsed by default on edit form
- **Dependencies**: Tasks 2.4, 3.1
- **Acceptance**: Form renders all fields, saves successfully, existing profiles load without error

### ~~Task 3.3: Update OnboardingProfileForm to match ProfileForm~~ [x]
- **Files**: `src/features/onboarding/components/OnboardingProfileForm.tsx`
- **What**: Mirror the ProfileForm changes. Both forms should render the same fields.
- **What**: Onboarding may show fewer sections initially (Identity + core fields) with "complete your profile later" for Communities/Practice sections
- **Dependencies**: Task 3.2
- **Acceptance**: Onboarding form creates profiles with all new fields, stays in sync with ProfileForm

### ~~Task 3.4: Update ReferralPostForm with new fields~~ [x]
- **Files**: `src/features/referrals/components/ReferralPostForm.tsx`
- **What**:
  1. Replace `presentingIssue` text input with `AutocompleteSelect` using specialties taxonomy (allow multiple)
  2. Add `participants` radio group (Individual / Couples / Family / Group)
  3. Add `rateBilling` select (Full fee / Sliding scale / Pro-bono / Direct billing)
  4. Add collapsible "Additional details" section:
     - `clientGender` select
     - `clientAge` text input
     - `therapistGenderPref` select (Any / Female / Male / Non-binary)
     - `therapyTypes` autocomplete (from taxonomy)
     - `languageRequirements` autocomplete (from taxonomy)
     - `additionalContext` textarea (2000 char max)
  5. Keep existing: ageGroup, locationCity, locationProvince, modality
- **Dependencies**: Tasks 2.5, 3.1
- **Acceptance**: Referral form submits with all new fields, existing flow unbroken

### ~~Task 3.5: Update matching algorithm for new fields~~ [x]
- **Files**: `src/features/matching/` (matching logic)
- **What**: Update `matchReferralToProfiles` to use new fields:
  - Filter by `participants` if specified in referral
  - Filter by `languageRequirements` if specified
  - Filter by `therapyTypes` if specified
  - Boost score for `alliedGroups` overlap with referral cultural context
  - Use relation-based specialty matching instead of String[] overlap
- **Dependencies**: Tasks 1.5, 2.5
- **Acceptance**: Matching uses new dimensions, existing matching still works for old referrals

---

## Implementation order

```
Milestone 1 (Schema)     Milestone 2 (API)        Milestone 3 (UI)
─────────────────────    ──────────────────────    ────────────────────
1.1 Taxonomy tables ──→  2.1 Taxonomy router ──→  3.1 AutocompleteSelect
1.2 Profile fields        2.2 Profile schema        3.2 ProfileForm
1.3 Referral fields       2.3 Referral schema       3.3 OnboardingForm
1.4 Seed data ─────────→ 2.4 Profile mutations ──→ 3.4 ReferralForm
1.5 Data migration        2.5 Referral mutations    3.5 Matching update
```

Each milestone is independently deployable. After Milestone 1, the app works exactly as before (new columns are unused). After Milestone 2, the API accepts new fields but forms don't send them yet. After Milestone 3, everything is connected.
