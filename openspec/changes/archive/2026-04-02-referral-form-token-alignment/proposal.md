## Why

The referral post form uses ad-hoc inline styles that diverge from the profile edit form's established patterns. This makes the two forms visually inconsistent, increases maintenance cost, and causes style drift as new fields are added. Additionally, the `participants` and `ageGroup` fields belong in a "Matching Preferences" section rather than the main form, `modalities` incorrectly defaults to "in-person", and the "Age Group" label doesn't match the intended "Ages" naming.

## What Changes

- Extract shared form design tokens (input heights, label typography, spacing, border radii, colors, error states) from the profile edit form into reusable CSS variables / Tailwind utility classes
- Refactor `FormGroup`, `CheckboxGroup`, and radio button styling to consume these shared tokens
- Apply shared tokens to `ReferralPostForm.tsx` so it visually matches the profile edit form
- Wrap all referral form sections with the `FormGroup` component
- Replace inline checkbox/radio markup with `CheckboxGroup` component and `.cb-box` / `accent-brand` radio pattern
- Move `participants` (dropdown select) and `ageGroup` (select) into a "Matching Preferences" collapsible section
- Rename "Age Group" label to "Ages"
- Remove default "in-person" selection from `modalities` (keep required validation)
- Audit display labels for consistency with Prisma schema field names

## Capabilities

### New Capabilities

- `form-design-tokens`: Shared CSS variables and Tailwind utility classes for form styling (inputs, labels, spacing, errors) consumed by both profile edit and referral forms

### Modified Capabilities

- None (no spec-level behavior changes — this is a UI alignment and restructuring change)

## Impact

- **Components**: `ReferralPostForm.tsx`, `FormGroup.tsx`, `CheckboxGroup.tsx`, profile section components (read-only reference)
- **Styling**: New shared form token layer (CSS variables or Tailwind classes) that both forms consume
- **Validation**: `modalities` default value removal — Zod schema unchanged but `defaultValues` updated
- **UX**: Field relocation (participants, ages → Matching Preferences section), label rename
- **No backend changes**: Prisma schema, tRPC routers, and server actions are untouched
