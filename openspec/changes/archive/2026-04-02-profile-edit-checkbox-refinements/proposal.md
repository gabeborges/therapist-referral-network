# Proposal: Profile Edit Checkbox Refinements

## What

Create a shared `<CheckboxGroup>` component with three layout modes (inline, column, grid-3), then use it to replace ChipSelect and select inputs across ProfileForm and OnboardingStepCommunities. Also pair fields side-by-side, polish the credential remove button, convert `faithOrientation` from single string to multi-select array, and ensure schema consistency across all layers.

## Why

1. **Duplicated checkbox markup** — OnboardingStepCommunities has inline checkbox patterns that ProfileForm should match, but there's no shared component. Both forms will drift.
2. **Wrong input types** — Therapy style, participants, ages, modalities, faith orientation, and insurance plans use ChipSelect or select dropdowns when checkboxes are more appropriate (finite, small option sets).
3. **Layout inefficiency** — Pronouns + gender and website + Psychology Today URL occupy separate rows when they can pair side-by-side.
4. **Credential button UX** — "Add credential" lacks `cursor-pointer`; remove button uses text `×` instead of an SVG icon.
5. **Faith orientation is single-select** — It should be multi-select (therapists can serve multiple faith communities). Currently `String?` in Prisma and `z.string().optional()` in Zod.
6. **Accessibility gaps** — Current checkbox markup in onboarding lacks `<fieldset>` + `<legend>` grouping.

## Scope

### In scope

1. **New shared component**: `src/components/ui/CheckboxGroup.tsx` with `layout="inline" | "column" | "grid-3"`, accessible (`<fieldset>` + `<legend>`), integrated with react-hook-form
2. **ProfileForm changes**: row-pair pronouns/gender and URLs, convert 6 fields to CheckboxGroup, credential button polish
3. **OnboardingStepCommunities refactor**: replace inline checkbox markup with `<CheckboxGroup>`
4. **Schema changes**: `faithOrientation` from `String?` → `String[]` across Prisma, Zod, tRPC, onboarding validation
5. **Accessibility**: `<fieldset>` + `<legend>`, `htmlFor` labels, `aria-describedby`, visible focus rings

### Out of scope

- Specialties, Therapeutic Approach, Languages, Ethnicity, Groups (keep current components)
- Matching algorithm changes
- New taxonomy tables
- Referral form changes

## Success criteria

| Metric           | Target                                                                      |
| ---------------- | --------------------------------------------------------------------------- |
| Shared component | `<CheckboxGroup>` used in both ProfileForm and OnboardingStepCommunities    |
| Converted fields | therapyStyle, participants, ages, modalities → CheckboxGroup in ProfileForm |
| Grid fields      | faithOrientation, insurance plans → 3-column CheckboxGroup                  |
| Row pairing      | Pronouns+Gender and WebsiteURL+PsychologyTodayURL side-by-side              |
| Credential UX    | SVG icon for remove, cursor-pointer on add                                  |
| Schema           | faithOrientation is `String[]` in Prisma, `z.array()` in Zod, array in tRPC |
| Accessibility    | All checkbox groups use `<fieldset>` + `<legend>`, associated labels        |

## Risks

| Risk                                                           | Mitigation                                                       |
| -------------------------------------------------------------- | ---------------------------------------------------------------- |
| Form state regression when swapping ChipSelect → CheckboxGroup | Test setValue/watch still work; verify form submission roundtrip |
| Onboarding regression after refactoring to shared component    | Verify existing behavior preserved before/after                  |
| faithOrientation type change                                   | Local env, no real users — `prisma db push` directly             |
