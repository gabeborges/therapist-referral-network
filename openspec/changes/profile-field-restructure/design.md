# Design: Profile Field Restructure

## Architecture overview

Three categories of changes applied across schema → validation → tRPC → UI:

1. **Column renames** — 4 fields get new DB column names
2. **Field additions/removals** — re-add 4 fields, remove 2 (field + unused relation)
3. **UI restructure** — profile form reorganized into 5 sections + availability, payment methods grid

## Data model changes

### TherapistProfile — column renames

```prisma
professionalEmail String?  →  contactEmail    String?
styleDescriptors  String[] →  therapyStyle    String[]
clientEthnicity   String[] →  ethnicity       String[]
```

### TherapistProfile — relation rename

```prisma
// Rename relation field + relation name
alliedGroupRecords AlliedGroup[] @relation("ProfileAlliedGroups")
→
groupRecords       AlliedGroup[] @relation("ProfileGroups")

// Zod/form field: alliedGroups → groups
```

### TherapistProfile — re-add fields

```prisma
therapistGender   String?
proBono           Boolean  @default(false)
reducedFees       Boolean  @default(false)
acceptsInsurance  Boolean  @default(false)
```

### TherapistProfile — remove fields

```prisma
otherTreatmentOrientation String?  // remove entirely
```

### TherapistProfile — remove unused relation

```prisma
// REMOVE: paymentMethodRecords PaymentMethod[] @relation("ProfilePaymentMethods")
// Reason: paymentMethods is now a String[] storing instrument names directly.
// The PaymentMethod taxonomy table is no longer used for profiles.
// Also remove from getProfile includes.
```

### TherapistProfile — paymentMethods semantic change

```prisma
// BEFORE: stored flags like "Insurance accepted", "Reduced fees / sliding scale", "Pro bono sessions"
// AFTER: stores payment instruments only
paymentMethods String[] // ["Visa", "Mastercard", "Cash", "Direct billing", ...]
```

Payment method options (hardcoded constant):

```
ACH Bank transfer, American Express, Cash, Cheque, Direct billing,
Discover, e-Transfer, Health Savings Account, Mastercard, Paypal, Visa, Wire
```

## Profile form layout

Follows the exact field order from the spec:

### Section 1: "Bio"

1. Profile photo (optional)
2. First name + Middle name + Last name
3. Pronouns (optional)
4. Gender (re-add, optional)
5. Display name (optional)
6. Bio
7. Contact email (rename from professional email)
8. Website URL
9. Psychology Today URL
10. City + Province

### Section 2: "Qualifications"

11. Primary credential
12. Additional credentials (add credential, max 3)
13. License level

### Section 3: "Your practice"

14. Therapeutic approaches (AutocompleteSelect)
15. Specialties (AutocompleteSelect)
16. Top specialties (0/3) (ranked AutocompleteSelect)
17. Therapy style (rename from style descriptors, ChipSelect)
18. I offer pro bono sessions (checkbox, `proBono` Boolean)
19. I offer a free initial consultation (checkbox, `freeConsultation` Boolean)

### Section 4: "Communities served" (subtitle: "your clients")

20. Participants (checkboxes)
21. Ages (checkboxes)
22. Modalities (checkboxes)
23. Faith orientation (searchable select)
24. Ethnicity (checkboxes, rename from client ethnicity)
25. Languages spoken (AutocompleteSelect, label rename only)
26. Groups (AutocompleteSelect, rename from allied groups)

### Section 5: "Finances"

27. Rate (dynamic per participant)
28. Payment methods (3-column checkbox grid, 12 options)
29. I offer reduced fees / sliding scale (checkbox, `reducedFees` Boolean)
30. I accept insurance (checkbox, `acceptsInsurance` Boolean — controls #31 visibility)
31. Insurance (searchable multi-select, conditional on #30)
32. Currently accepting clients (toggle)

## Zod schema changes

```typescript
// therapist-profile.ts

// RENAME fields:
contactEmail; // was: professionalEmail
therapyStyle; // was: styleDescriptors
ethnicity; // was: clientEthnicity
groups; // was: alliedGroups

// RE-ADD fields:
therapistGender: z.string().optional();
proBono: z.boolean();
reducedFees: z.boolean();
acceptsInsurance: z.boolean();

// REMOVE:
// otherTreatmentOrientation — delete

// UPDATE constant:
export const PAYMENT_METHOD_OPTIONS = [
  "ACH Bank transfer",
  "American Express",
  "Cash",
  "Cheque",
  "Direct billing",
  "Discover",
  "e-Transfer",
  "Health Savings Account",
  "Mastercard",
  "Paypal",
  "Visa",
  "Wire",
] as const;
```

## Onboarding changes

### Schema update (onboarding.ts)

Step 1 (Bio):

- Replace `professionalEmail` → `contactEmail`

Step 3 (Services):

- **Remove** `paymentMethods` from schema pick (payment instruments are profile-only)
- **Add** `freeConsultation` (checkbox)
- **Add** `proBono` (checkbox)

### StepServices component

Replace the current paymentMethods-based checkboxes with proper boolean checkboxes:

- "I offer pro bono sessions" → `proBono: boolean`
- "I offer a free initial consultation" → `freeConsultation: boolean`
- Remove "I accept insurance" and "I offer reduced fees" from onboarding (profile-only)

### Wizard submit defaults

`handleComplete` must include defaults for all profile-only fields:

- `therapistGender: ""`
- `reducedFees: false`
- `acceptsInsurance: false`
- `therapyStyle: []`
- `ethnicity: []`
- `groups: []`
- Remove: `otherTreatmentOrientation`
- Remove: `paymentMethods: []` from onboarding defaults (stays empty via schema default)
- Rename: `professionalEmail` → `contactEmail`

## tRPC changes

Both `createProfile` and `updateProfile`:

- Renamed field mappings: `contactEmail`, `therapyStyle`, `ethnicity`
- Relation rename: `alliedGroupRecords` → `groupRecords`
- New boolean fields: `therapistGender`, `proBono`, `reducedFees`, `acceptsInsurance`
- Remove: `otherTreatmentOrientation`
- Remove: `paymentMethodRecords` connect/set operations
- `getProfile` include: remove `paymentMethodRecords`

## Key decisions

1. **Column renames, not label-only** — DB columns match concepts for cleaner code.
2. **Boolean fields for flags** — `proBono`, `reducedFees`, `acceptsInsurance`, `freeConsultation` all Booleans. Consistent, queryable.
3. **Payment methods = instruments only** — Visa, Cash, etc. Not mixed with insurance flags.
4. **Remove paymentMethodRecords relation** — Dead code since paymentMethods is now a plain String[].
5. **Gender re-added to profile only** — Not in onboarding.
6. **Onboarding step 3 simplified** — Only `proBono` + `freeConsultation` checkboxes. No payment methods grid, no insurance.
