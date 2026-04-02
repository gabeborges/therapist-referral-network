## Context

The referral post form (`ReferralPostForm.tsx`) and profile edit form already share core styling via `src/lib/form-styles.ts` (inputClasses, selectClasses, selectStyle) and CSS custom properties in `globals.css`. Shared components exist: `FormGroup`, `CheckboxGroup`, `BooleanCheckbox`.

However, the referral form does not consistently use these shared components for all its fields — some checkboxes and radio buttons use inline markup instead of the shared components. Additionally, the form's field layout needs restructuring: `participants` and `ageGroup` belong in a "Matching Preferences" section, and `modalities` should not default to "in-person".

## Goals / Non-Goals

**Goals:**

- Ensure the referral form uses `FormGroup` to wrap all sections (matching profile edit pattern)
- Ensure all checkboxes use `CheckboxGroup` component and radio buttons use native `accent-brand` styling
- Group fields into logical sections: Client needs, Service preferences, Other preferences, Additional details (collapsible)
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

**Sections** (as implemented):

- Client needs (presentingIssue, details)
- Service preferences (modalities, rate, insuranceRequired)
- Other preferences (city, province, participants, ageGroup)
- Additional details (therapistGenderPref, therapyTypes, languages, additionalContext) — collapsible

### 3. Radio buttons: use native `accent-brand` styling

**Decision**: Radio buttons use native browser styling with `w-4 h-4 accent-brand cursor-pointer`, matching label alignment and spacing with CheckboxGroup items.

**Rationale**: Native radio styling is visually consistent enough and avoids the complexity of a custom radio component. The `.cb-box` pattern was considered but not needed — native `accent-brand` provides sufficient visual alignment.

### 4. "Other preferences" section (non-collapsible)

**Decision**: Group city, province, participants, and ageGroup in a regular `FormGroup` titled "Other preferences" rather than a collapsible section.

**Rationale**: These fields are common enough that hiding them behind a collapsible reduces discoverability. Only "Additional details" (therapistGenderPref, therapyTypes, languages, additionalContext) uses the collapsible pattern.

## Risks / Trade-offs

- **[Risk] Moving fields to collapsible section may reduce completion rates** → Mitigation: Section is open by default on first render, or clearly labeled so users know to expand it.
- **[Risk] Removing modalities default may increase validation errors on submit** → Mitigation: Clear visual indication that at least one modality must be selected (required marker on label).
- **[Risk] Label rename "Age Group" → "Ages" may confuse users familiar with current form** → Mitigation: Minor change, low risk. Schema field name `ageGroup` is unchanged.
