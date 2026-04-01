## ADDED Requirements

### Requirement: Referral form sections use FormGroup wrapping

The referral post form SHALL wrap all field groups in the `FormGroup` component with descriptive section titles, matching the profile edit form's section pattern.

#### Scenario: Core Details section

- **WHEN** the referral form renders
- **THEN** `presentingIssue`, `city`, `province`, and `details` fields are wrapped in a `FormGroup` titled "Core Details"

#### Scenario: Session Format section

- **WHEN** the referral form renders
- **THEN** `modalities` and `rate` fields are wrapped in a `FormGroup` titled "Session Format"

#### Scenario: Matching Preferences section

- **WHEN** the referral form renders
- **THEN** `participants` and `ageGroup` fields are in a collapsible "Matching Preferences" section

### Requirement: All checkboxes use CheckboxGroup component

The referral form SHALL render all multi-select checkbox fields using the shared `CheckboxGroup` component from `src/components/ui/CheckboxGroup.tsx`.

#### Scenario: Modalities renders as CheckboxGroup

- **WHEN** the referral form renders the modalities field
- **THEN** it uses the `CheckboxGroup` component with options ["in-person", "virtual", "phone"]

### Requirement: All radio buttons use shared styling pattern

The referral form SHALL render all radio button fields using the `.cb-box` / `accent-brand` styling pattern consistent with shared components.

#### Scenario: Rate renders with shared radio styling

- **WHEN** the referral form renders the rate field
- **THEN** radio buttons use `accent-brand` color and consistent sizing/spacing matching `CheckboxGroup` item layout

### Requirement: Modalities has no default selection

The referral form SHALL NOT pre-select any modality options. The user MUST explicitly choose at least one.

#### Scenario: Fresh form has no modalities selected

- **WHEN** the referral form loads with no prior data
- **THEN** all modality checkboxes are unchecked

#### Scenario: Validation requires at least one modality

- **WHEN** the user attempts to submit without selecting any modality
- **THEN** a validation error is displayed on the modalities field

### Requirement: Participants field is a dropdown select in Matching Preferences

The `participants` field SHALL remain a dropdown select (not converted to checkboxes) and SHALL be located in the "Matching Preferences" collapsible section.

#### Scenario: Participants renders as select dropdown

- **WHEN** the referral form renders
- **THEN** the `participants` field is a `<select>` dropdown using `selectClasses` from `form-styles.ts`

#### Scenario: Participants is in Matching Preferences section

- **WHEN** the referral form renders
- **THEN** the `participants` field is inside the "Matching Preferences" collapsible section, not in the main form body

### Requirement: Age Group label renamed to "Ages"

The `ageGroup` field's display label SHALL be "Ages" and the field SHALL be located in the "Matching Preferences" collapsible section.

#### Scenario: Label displays "Ages"

- **WHEN** the referral form renders the age group field
- **THEN** the label text reads "Ages" (not "Age Group")

#### Scenario: Ages field is in Matching Preferences section

- **WHEN** the referral form renders
- **THEN** the `ageGroup` field is inside the "Matching Preferences" collapsible section

### Requirement: Display labels align with schema naming

All form field labels SHALL be audited for consistency with Prisma schema field names. Labels MUST clearly correspond to their schema field without introducing confusing aliases.

#### Scenario: No label/schema mismatch

- **WHEN** all referral form fields are rendered
- **THEN** each field's label is a human-readable version of its schema name (e.g., `presentingIssue` → "Presenting Issue", `therapistGenderPref` → "Therapist Gender Preference")
