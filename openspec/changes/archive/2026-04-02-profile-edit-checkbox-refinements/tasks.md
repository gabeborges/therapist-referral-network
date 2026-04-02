# Tasks: Profile Edit Checkbox Refinements

## Milestone 1: Shared Component

### ~~Task 1.1: Create `<CheckboxGroup>` component~~ [x]

- **Files**: `src/components/ui/CheckboxGroup.tsx`
- **What**:
  1. Create component with props: `name`, `options: { value, label }[]`, `layout: "inline" | "column" | "grid-3"`, `control`, `label`, `srOnlyLabel?`, `helpText?`, `error?`
  2. Layout CSS: `inline` → `flex flex-wrap gap-x-6 gap-y-2`, `column` → `space-y-2`, `grid-3` → `grid grid-cols-1 sm:grid-cols-3 gap-2`
  3. Use react-hook-form `Controller` with array toggle logic (add/remove value on change)
  4. Accessibility: `<fieldset>` + `<legend>`, `htmlFor` on each label, `aria-describedby` for help/error text, `focus:ring-brand focus:ring-offset-2`
  5. Checkbox styling: `w-4 h-4 rounded border-border text-brand focus:ring-brand focus:ring-offset-2`
  6. Handle `options={[]}` gracefully (render nothing)
- **Acceptance**: Component renders all 3 layouts, integrates with react-hook-form Controller, passes a11y structure check

---

## Milestone 2: Schema Consistency

### ~~Task 2.1: Update faithOrientation to array in Prisma~~ [x]

- **Files**: `prisma/schema.prisma`
- **What**: Change `faithOrientation String?` → `faithOrientation String[]`
- **Acceptance**: `npx prisma db push` succeeds

### ~~Task 2.2: Update faithOrientation in Zod schema~~ [x]

- **Files**: `src/lib/validations/therapist-profile.ts`
- **What**: Change `faithOrientation: z.string().optional()` → `faithOrientation: z.array(z.string()).default([])`
- **Acceptance**: Schema validates arrays correctly

### ~~Task 2.3: Update faithOrientation in tRPC~~ [x]

- **Files**: `src/lib/trpc/routers/therapist.ts`
- **What**: Verify createProfile and updateProfile pass faithOrientation through correctly (array type flows from Zod, but check any explicit handling)
- **Acceptance**: No type errors in tRPC router

---

## Milestone 3: ProfileForm UI Changes

### ~~Task 3.1: Row-pair Website URL + Psychology Today URL~~ [x]

- **Files**: `src/features/profile/components/ProfileForm.tsx`
- **What**: Wrap website URL and Psychology Today URL inputs in `grid grid-cols-1 sm:grid-cols-2 gap-4`
- **Note**: Pronouns + Gender are already in a 2-col grid — no change needed for those
- **Acceptance**: URLs render side-by-side on desktop, stack on mobile

### ~~Task 3.2: Credential button UX polish~~ [x]

- **Files**: `src/features/profile/components/ProfileForm.tsx`
- **What**:
  1. Replace `×` (`&times;`) text in remove button with inline SVG X icon (Heroicons XMark path)
  2. Add `cursor-pointer` to remove button classes
  3. Add `cursor-pointer` to "Add credential" button
  4. Keep existing `hover:text-err hover:border-err` behavior
- **Acceptance**: Remove button shows SVG icon, both buttons show pointer cursor on hover

### ~~Task 3.3: Convert ChipSelect fields → CheckboxGroup~~ [x]

- **Files**: `src/features/profile/components/ProfileForm.tsx`
- **What**: Replace `<ChipSelect>` with `<CheckboxGroup>` for:
  1. `therapyStyle` — `layout="inline"`, options from `THERAPY_STYLE_OPTIONS`
  2. `participants` — `layout="inline"`, options from `PARTICIPANT_OPTIONS`
  3. `modalities` — `layout="inline"`, options from `MODALITY_OPTIONS`
  4. `ages` — `layout="column"`, options from `AGE_OPTIONS`
  5. Map option constants to `{ value, label }` format
- **Acceptance**: All 4 fields render as checkbox groups with correct layouts, values persist through form submission

### ~~Task 3.4: Convert faithOrientation to multi-select~~ [x]

- **Files**: `src/features/profile/components/ProfileSectionCommunities.tsx`
- **What**:
  1. ~~Originally planned CheckboxGroup~~ — kept as `<AutocompleteSelect>` for searchability
  2. Field now accepts multiple selections (array) via AutocompleteSelect multi-select
  3. Schema updated to `String[]` across Prisma, Zod, tRPC
- **Acceptance**: Faith orientation supports multi-select array values

### ~~Task 3.5: Convert insurance plans AutocompleteSelect → CheckboxGroup~~ [x]

- **Files**: `src/features/profile/components/ProfileForm.tsx`
- **What**:
  1. Replace `<AutocompleteSelect>` for `insurers` with `<CheckboxGroup layout="grid-3">`
  2. Keep conditional rendering on `acceptsInsurance` checkbox
  3. Use insurance options mapped to `{ value, label }` format
- **Acceptance**: Insurance plans render as 3-column checkbox grid, only visible when acceptsInsurance is checked

---

## Milestone 4: Onboarding Refactor

### ~~Task 4.1: Replace inline checkboxes in OnboardingStepCommunities~~ [x]

- **Files**: `src/features/onboarding/components/OnboardingStepCommunities.tsx`
- **What**:
  1. Import `<CheckboxGroup>` from shared component
  2. Replace inline checkbox markup for `participants` with `<CheckboxGroup layout="inline">`
  3. Replace inline checkbox markup for `ages` with `<CheckboxGroup layout="column">`
  4. Replace inline checkbox markup for `modalities` with `<CheckboxGroup layout="inline">`
  5. Remove manual onChange/toggle logic that the Controller now handles
- **Acceptance**: Onboarding step 2 renders identically, uses shared component, form values persist correctly

---

## Milestone 5: Verification

### ~~Task 5.1: Update tests for faithOrientation type change~~ [x]

- **Files**: `src/lib/validations/__tests__/therapist-profile.test.ts`
- **What**:
  1. Update test fixtures: `faithOrientation` from string to array
  2. Add test for faithOrientation accepting empty array
  3. Add test for faithOrientation accepting multiple values
- **Acceptance**: All validation tests pass

### ~~Task 5.2: Verify all references consistent~~ [x]

- **Files**: Grep `src/` for `faithOrientation`
- **What**: Ensure every reference treats faithOrientation as an array (ProfileView, email templates, referral pages, slug page)
- **Acceptance**: Zero references treating faithOrientation as a single string

---

## Implementation order

```
Milestone 1 (Component)     Milestone 2 (Schema)       Milestone 3 (ProfileForm)
────────────────────────     ────────────────────       ─────────────────────────
1.1 CheckboxGroup ─────────→ 2.1 Prisma push ─────────→ 3.1 URL row pairing
                              2.2 Zod schema              3.2 Credential UX
                              2.3 tRPC check              3.3 ChipSelect → CheckboxGroup
                                                          3.4 faithOrientation → CheckboxGroup
                                                          3.5 Insurance → CheckboxGroup

                             Milestone 4 (Onboarding)   Milestone 5 (Verify)
                             ────────────────────────    ────────────────────
                             4.1 Refactor communities    5.1 Update tests
                                                         5.2 Grep all refs
```
