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

### Requirement: Data persists regardless of consent state

The form SHALL save faith orientation and ethnicity values to the database when the user submits, regardless of whether `consentCommunitiesServed` is checked.

#### Scenario: Save without consent

- **WHEN** user fills faith orientation and ethnicity fields but leaves consent unchecked and saves
- **THEN** the values are persisted to the database with `consentCommunitiesServed = false`

#### Scenario: Revoke consent preserves data

- **WHEN** user has consent checked, fills fields, then unchecks consent and saves
- **THEN** the faith and ethnicity values remain in the database, only `consentCommunitiesServed` changes to false

### Requirement: Consent gates public display and matching, not data entry

When `consentCommunitiesServed` is false, faith orientation and ethnicity values MUST NOT be displayed on the public profile or used in referral matching. When true, they SHALL be displayed and used.

#### Scenario: Public profile without consent

- **WHEN** a therapist profile has `consentCommunitiesServed = false` and faith/ethnicity data
- **THEN** the public profile does not display faith orientation or ethnicity

#### Scenario: Public profile with consent

- **WHEN** a therapist profile has `consentCommunitiesServed = true` and faith/ethnicity data
- **THEN** the public profile displays faith orientation and ethnicity

#### Scenario: Referral matching without consent

- **WHEN** a referral matching query considers faith/ethnicity criteria
- **THEN** profiles with `consentCommunitiesServed = false` are excluded from faith/ethnicity-based matching
