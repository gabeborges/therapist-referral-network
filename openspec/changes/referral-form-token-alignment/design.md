## Context

The referral post form (`ReferralPostForm.tsx`) and profile edit form already share core styling via `src/lib/form-styles.ts` (inputClasses, selectClasses, selectStyle) and CSS custom properties in `globals.css`. Shared components exist: `FormGroup`, `CheckboxGroup`, `BooleanCheckbox`.

However, the referral form does not consistently use these shared components for all its fields — some checkboxes and radio buttons use inline markup instead of the shared components. Additionally, the form's field layout needs restructuring: `participants` and `ageGroup` belong in a "Matching Preferences" section, and `modalities` should not default to "in-person".

## Goals / Non-Goals

**Goals:**

- Ensure the referral form uses `FormGroup` to wrap all sections (matching profile edit pattern)
- Ensure all checkboxes use `CheckboxGroup` component and all radio buttons use the `.cb-box` / `accent-brand` pattern
- Move `participants` (dropdown) and `ageGroup` (select, relabeled "Ages") into a collapsible "Matching Preferences" section
- Remove `modalities` default value while keeping required validation
- Audit labels for schema naming consistency

**Non-Goals:**

- Changing the Prisma schema, migrations, or backend logic
- Changing `participants` from a select dropdown to a checkbox group
- Modifying the profile edit form (read-only reference)
- Introducing a new design token file — `form-styles.ts` and `globals.css` already serve this role
- Adding new form fields or validation rules

## Decisions

### 1. No new token layer needed — leverage existing `form-styles.ts`

**Decision**: Use the existing `src/lib/form-styles.ts` utilities and shared components rather than creating a new CSS variable / token file.

**Rationale**: The audit revealed that `inputClasses()`, `selectClasses()`, `selectStyle`, and label classes are already centralized. Creating an additional abstraction layer would be redundant. The gap is not missing tokens but inconsistent usage — some referral form fields bypass the shared components.

**Alternative considered**: Creating a `form-tokens.css` file with CSS custom properties. Rejected because `form-styles.ts` already provides this with TypeScript type safety and the existing CSS custom properties in `globals.css` cover color/spacing tokens.

### 2. Wrap referral form sections with `FormGroup`

**Decision**: Group related fields under `FormGroup` components with descriptive titles, matching the profile edit's section pattern (`border-t border-border-s pt-6` + `space-y-6`).

**Sections**:

- Core Details (presentingIssue, city, province, details)
- Session Format (modalities, rate)
- Matching Preferences (participants, ageGroup) — collapsible
- Additional Details (therapistGenderPref, therapyTypes, languages, additionalContext) — collapsible, already exists

### 3. Radio buttons: use shared `.cb-box` pattern from `CheckboxGroup`

**Decision**: Extract the checkbox styling pattern from `CheckboxGroup` into a reusable radio variant, or apply the same `accent-brand` + sizing pattern inline.

**Rationale**: Radio buttons currently use `w-4 h-4 accent-brand` which is close but not wrapped in a component. For consistency, apply the same visual treatment (sizing, spacing, label alignment) as `CheckboxGroup` items.

### 4. Collapsible "Matching Preferences" section

**Decision**: Reuse the existing `<details>/<summary>` or disclosure pattern already used for "Additional Details" in the referral form. Move `participants` and `ageGroup` into this section.

**Rationale**: Keeps the main form focused on the most essential fields while still making matching preferences easily accessible.

## Risks / Trade-offs

- **[Risk] Moving fields to collapsible section may reduce completion rates** → Mitigation: Section is open by default on first render, or clearly labeled so users know to expand it.
- **[Risk] Removing modalities default may increase validation errors on submit** → Mitigation: Clear visual indication that at least one modality must be selected (required marker on label).
- **[Risk] Label rename "Age Group" → "Ages" may confuse users familiar with current form** → Mitigation: Minor change, low risk. Schema field name `ageGroup` is unchanged.
