## ADDED Requirements

### Requirement: Referral form sections use FormGroup wrapping

The referral post form SHALL wrap all field groups in the `FormGroup` component with descriptive section titles, matching the profile edit form's section pattern.

#### Scenario: Client needs section

- **WHEN** the referral form renders
- **THEN** `presentingIssue` and `details` fields are wrapped in a `FormGroup` titled "Client needs"

#### Scenario: Service preferences section

- **WHEN** the referral form renders
- **THEN** `modalities`, `rate`, and `insuranceRequired` fields are wrapped in a `FormGroup` titled "Service preferences"

#### Scenario: Other preferences section

- **WHEN** the referral form renders
- **THEN** `city`, `province`, `participants`, and `ageGroup` fields are wrapped in a `FormGroup` titled "Other preferences"

#### Scenario: Additional details collapsible section

- **WHEN** the referral form renders
- **THEN** `therapistGenderPref`, `therapyTypes`, `languages`, and `additionalContext` fields are in a collapsible "Additional details" section

### Requirement: All checkboxes use CheckboxGroup component

The referral form SHALL render all multi-select checkbox fields using the shared `CheckboxGroup` component from `src/components/ui/CheckboxGroup.tsx`.

#### Scenario: Modalities renders as CheckboxGroup

- **WHEN** the referral form renders the modalities field
- **THEN** it uses the `CheckboxGroup` component with options ["in-person", "virtual", "phone"]

### Requirement: Radio buttons use native accent-brand styling

The referral form SHALL render radio button fields using native `accent-brand` styling with consistent sizing and label alignment.

#### Scenario: Rate renders with accent-brand radio styling

- **WHEN** the referral form renders the rate field
- **THEN** radio buttons use `w-4 h-4 accent-brand` with `cursor-pointer` and consistent label spacing

### Requirement: Modalities has no default selection

The referral form SHALL NOT pre-select any modality options. The user MUST explicitly choose at least one.

#### Scenario: Fresh form has no modalities selected

- **WHEN** the referral form loads with no prior data
- **THEN** all modality checkboxes are unchecked

#### Scenario: Validation requires at least one modality

- **WHEN** the user attempts to submit without selecting any modality
- **THEN** a validation error is displayed on the modalities field

### Requirement: Participants and ageGroup are single-select dropdowns

The `participants` and `ageGroup` fields SHALL be single-select `<select>` dropdowns using `selectClasses` from `form-styles.ts`. The Zod schema validates them as single strings; the tRPC router wraps them into arrays for Prisma storage.

#### Scenario: Participants renders as select dropdown

- **WHEN** the referral form renders
- **THEN** the `participants` field is a `<select>` dropdown in the "Other preferences" section

#### Scenario: ageGroup renders as select dropdown

- **WHEN** the referral form renders
- **THEN** the `ageGroup` field is a `<select>` dropdown in the "Other preferences" section

### Requirement: Age Group label renamed to "Ages"

The `ageGroup` field's display label SHALL be "Ages".

#### Scenario: Label displays "Ages"

- **WHEN** the referral form renders the age group field
- **THEN** the label text reads "Ages" (not "Age Group")

### Requirement: Display labels align with schema naming

All form field labels SHALL be audited for consistency with Prisma schema field names. Labels MUST clearly correspond to their schema field without introducing confusing aliases.

#### Scenario: No label/schema mismatch

- **WHEN** all referral form fields are rendered
- **THEN** each field's label is a human-readable version of its schema name (e.g., `presentingIssue` → "Presenting Issue", `therapistGenderPref` → "Therapist Gender Preference")
