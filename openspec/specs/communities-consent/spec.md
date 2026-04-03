# Spec: Communities Consent

## ADDED Requirements

### Requirement: Faith and ethnicity fields are always visible

The profile edit form SHALL always render the faith orientation and ethnicity fields in the Communities Served section, regardless of the consent checkbox state.

#### Scenario: Fields visible without consent

- **WHEN** user opens the profile edit form with `consentCommunitiesServed` unchecked
- **THEN** faith orientation and ethnicity fields are visible and editable

#### Scenario: Fields visible with consent

- **WHEN** user opens the profile edit form with `consentCommunitiesServed` checked
- **THEN** faith orientation and ethnicity fields are visible and editable

### Requirement: Consent checkbox positioned at bottom of Communities section

The consent checkbox SHALL appear as the last element in the Communities Served form group, after the Languages and Groups fields and before the form's save/cancel buttons.

#### Scenario: Checkbox placement

- **WHEN** user views the Communities Served section of the profile edit form
- **THEN** the consent checkbox appears after all other fields in the section

### Requirement: Consent checkbox matches CheckboxGroup visual style

The consent checkbox SHALL use the same visual treatment as the `CheckboxGroup` component: sr-only native input, styled `.cb-box` span with brand colors, and checkmark SVG.

#### Scenario: Visual consistency

- **WHEN** the consent checkbox is rendered
- **THEN** it uses the same checkbox styling (18px box, rounded-[4px], brand color when checked, checkmark SVG) as other checkboxes in the form

### Requirement: Consent text reflects collection and display purpose

The consent checkbox label SHALL read: "I consent to collecting and displaying my cultural background and faith orientation on my public profile and using it for referral matching. I can withdraw this consent at any time from my profile settings."

#### Scenario: Consent text content

- **WHEN** the consent checkbox is rendered
- **THEN** the label text matches the specified consent language

### Requirement: Consent withdrawal deletes sensitive data

When `consentCommunitiesServed` is set to false, the server MUST clear `faithOrientation` and `ethnicity` arrays to `[]` in the same database operation. This is a PIPEDA Principle 4.5 compliance requirement — sensitive personal data (ethnic/racial origins, religious/philosophical beliefs) cannot be retained without consent.

> **Supersedes** the previous "Data persists regardless of consent state" requirement. The original design decoupled data entry from consent to improve UX. PIPEDA compliance requires that consent withdrawal triggers data deletion for sensitive fields.

#### Scenario: Consent withdrawal clears data

- **WHEN** user unchecks `consentCommunitiesServed` and saves the form
- **THEN** `faithOrientation` and `ethnicity` are set to `[]` in the database, regardless of what values the form submitted

#### Scenario: Save without consent

- **WHEN** user fills faith orientation and ethnicity fields but leaves consent unchecked and saves
- **THEN** `consentCommunitiesServed = false` is stored and `faithOrientation` and `ethnicity` are stored as `[]`

#### Scenario: Server-side enforcement

- **WHEN** a profile update is submitted with `consentCommunitiesServed = false` and non-empty `faithOrientation` or `ethnicity` values
- **THEN** the server forces both arrays to `[]` before writing to the database (client input is overridden)

### Requirement: Consent gates public display and matching

When `consentCommunitiesServed` is false, faith orientation and ethnicity values MUST NOT be displayed on the public profile or used in referral matching. When true, they SHALL be displayed and used.

#### Scenario: Public profile without consent

- **WHEN** a therapist profile has `consentCommunitiesServed = false`
- **THEN** the public profile does not display faith orientation or ethnicity (fields are empty in the database)

#### Scenario: Public profile with consent

- **WHEN** a therapist profile has `consentCommunitiesServed = true` and faith/ethnicity data
- **THEN** the public profile displays faith orientation and ethnicity

#### Scenario: Referral matching without consent

- **WHEN** a referral matching query considers faith/ethnicity criteria
- **THEN** profiles with `consentCommunitiesServed = false` are excluded from faith/ethnicity-based matching

### Requirement: Consent changes are audit-logged

Every change to `consentCommunitiesServed` MUST create a `ConsentLog` entry recording the action (`granted` or `withdrawn`), timestamp, and policy version. Initial consent grant during profile creation is also logged.

#### Scenario: Consent granted

- **WHEN** user checks `consentCommunitiesServed` and saves (or creates a profile with it checked)
- **THEN** a `ConsentLog` entry is created with `consentType: "communities_served"`, `action: "granted"`, and the current policy version

#### Scenario: Consent withdrawn

- **WHEN** user unchecks `consentCommunitiesServed` and saves
- **THEN** a `ConsentLog` entry is created with `consentType: "communities_served"`, `action: "withdrawn"`, the current policy version, and metadata noting which fields were cleared
