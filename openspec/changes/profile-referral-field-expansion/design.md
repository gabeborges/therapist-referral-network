# Design: Profile & Referral Field Expansion

## Architecture overview

Move taxonomy data (specialties, therapy types, languages, etc.) from hardcoded constant arrays in form components into normalized DB tables. Replace the existing `ChipSelect` (dropdown-based multi-select) with an `AutocompleteSelect` component for fields with 8+ options. Add new profile fields and expand the referral form.

```
Current:
  ProfileForm.tsx → const SPECIALTIES = ["Anxiety", ...]  → ChipSelect

After:
  DB (Taxonomy tables) → tRPC query → AutocompleteSelect
  ProfileForm.tsx → uses shared taxonomy queries
  OnboardingProfileForm.tsx → uses same queries
  ReferralPostForm.tsx → reuses same taxonomy data
```

## Data model changes

### New taxonomy tables

```prisma
model Specialty {
  id        String   @id @default(cuid())
  name      String   @unique
  category  String?  // "Mental Health", "Sexuality", or null for main list
  sortOrder Int      @default(0)
  profiles  TherapistProfile[] @relation("ProfileSpecialties")
  createdAt DateTime @default(now())
}

model TherapyType {
  id        String   @id @default(cuid())
  name      String   @unique
  sortOrder Int      @default(0)
  profiles  TherapistProfile[] @relation("ProfileTherapyTypes")
  createdAt DateTime @default(now())
}

model Language {
  id        String   @id @default(cuid())
  name      String   @unique
  sortOrder Int      @default(0)
  profiles  TherapistProfile[] @relation("ProfileLanguages")
  createdAt DateTime @default(now())
}

model AlliedGroup {
  id        String   @id @default(cuid())
  name      String   @unique
  sortOrder Int      @default(0)
  profiles  TherapistProfile[] @relation("ProfileAlliedGroups")
  createdAt DateTime @default(now())
}

model PaymentMethod {
  id        String   @id @default(cuid())
  name      String   @unique
  sortOrder Int      @default(0)
  profiles  TherapistProfile[] @relation("ProfilePaymentMethods")
  createdAt DateTime @default(now())
}
```

### TherapistProfile changes

```prisma
model TherapistProfile {
  // --- Existing fields (unchanged) ---
  id                String   @id @default(cuid())
  userId            String   @unique
  user              User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  firstName         String
  lastName          String
  displayName       String
  bio               String?
  city              String
  province          String
  country           String   @default("CA")
  // specialties     String[]    ← REMOVE (migrated to relation)
  modalities        String[]    // Keep as String[] — only 3 options
  // therapeuticApproach String[] ← REMOVE (migrated to relation)
  // languages       String[]    ← REMOVE (migrated to relation)
  ageGroups         String[]    // Keep as String[] — only 5-6 options
  acceptsInsurance  Boolean  @default(false)
  directBilling     Boolean  @default(false)
  insurers          String[]
  hourlyRate        Float?
  reducedFees       Boolean  @default(false)
  acceptingClients  Boolean  @default(true)
  lastActiveAt      DateTime @default(now())
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  // --- New relation fields (replacing String[]) ---
  specialtyRecords     Specialty[]     @relation("ProfileSpecialties")
  therapyTypeRecords   TherapyType[]   @relation("ProfileTherapyTypes")
  languageRecords      Language[]      @relation("ProfileLanguages")
  alliedGroupRecords   AlliedGroup[]   @relation("ProfileAlliedGroups")
  paymentMethodRecords PaymentMethod[] @relation("ProfilePaymentMethods")

  // --- New scalar fields ---
  imageUrl              String?
  websiteUrl            String?
  psychologyTodayUrl    String?
  proBono               Boolean  @default(false)
  professionalEmail     String?
  primaryCredential     String?
  credentials           String[] // max 3, enforced in Zod
  freeConsultation      Boolean  @default(false)
  pronouns              String?
  therapistGender       String?
  licensingLevel        String?  // "Fully Licensed" | "Supervised Practice" | "Practicum Student"
  otherTreatmentOrientation String?

  // --- New enum-like fields (small option sets, keep as String/String[]) ---
  participants          String[] // ["Individuals", "Couples", "Family", "Group"]
  topSpecialties        String[] // max 3, ordered — stores specialty names
  faithOrientation      String?  // dropdown, single value
  clientEthnicity       String[] // max 6 options
  styleDescriptors      String[] // ["Structured", "Direct", "Relational", etc.]

  // --- Existing relations ---
  postedReferrals       ReferralPost[]          @relation("PostedReferrals")
  receivedNotifications ReferralNotification[]  @relation("ReceivedNotifications")
}
```

### ReferralPost changes

```prisma
model ReferralPost {
  // --- Existing fields (unchanged) ---
  id               String   @id @default(cuid())
  authorId         String
  author           TherapistProfile @relation("PostedReferrals", fields: [authorId], references: [id], onDelete: Cascade)
  presentingIssue  String   // Keep as free text — maps to specialties but allows custom input
  ageGroup         String
  locationCity     String?
  locationProvince String
  modality         String
  additionalNotes  String?
  status           ReferralStatus @default(OPEN)
  currentBatch     Int      @default(0)
  lastDrippedAt    DateTime?
  slug             String   @unique @default(cuid())
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt

  // --- New fields ---
  participants          String?  // "Individual" | "Couples" | "Family" | "Group"
  rateBilling           String?  // "Full fee" | "Sliding scale" | "Pro-bono" | "Direct billing"
  clientGender          String?
  clientAge             String?  // Free text: "27" or "30s" or "40-50"
  therapistGenderPref   String?  // "Any" | "Female" | "Male" | "Non-binary"
  therapyTypes          String[] // Stores therapy type names from taxonomy
  languageRequirements  String[] // Stores language names from taxonomy
  additionalContext     String?  // Longer free text for nuance

  // --- Existing relations ---
  notifications    ReferralNotification[]
  fulfillmentChecks FulfillmentCheck[]
}
```

### Migration strategy

**Phase 1 — Add new fields (non-breaking):**
All new fields are nullable or have defaults. Existing data untouched.

**Phase 2 — Create taxonomy tables + seed:**
Create Specialty, TherapyType, Language, AlliedGroup, PaymentMethod tables.
Run seed script to populate from `.ops/onboarding-fields.md` values.

**Phase 3 — Migrate existing String[] data to relations:**
Write a migration script that:
1. For each TherapistProfile, look up `specialties[]` string values in Specialty table
2. Create the many-to-many relation records
3. Repeat for therapeuticApproach → TherapyType, languages → Language

Keep old String[] columns during transition. Remove in a later cleanup migration.

## UI component: AutocompleteSelect

Replaces `ChipSelect` for large option sets. Keeps `ChipSelect` for small sets (<8 options).

```typescript
interface AutocompleteSelectProps {
  label: string;
  options: { id: string; name: string }[];
  selected: { id: string; name: string }[];
  onChange: (selected: { id: string; name: string }[]) => void;
  placeholder?: string;
  error?: string;
  helperText?: string;
  maxItems?: number;          // e.g., 3 for topSpecialties
  ranked?: boolean;           // enables drag-to-reorder
  loading?: boolean;          // shows spinner while fetching
}
```

**Behavior:**
- Text input with debounced client-side filtering
- Dropdown shows filtered matches (max 10 visible, scroll for more)
- Selected items appear as removable chips below the input
- If `ranked: true`, chips are numbered and draggable
- Keyboard accessible (arrow keys, enter, escape, backspace to remove last)
- Click outside closes dropdown

**Data flow:**
- Taxonomy data fetched once via tRPC query on form mount (`trpc.taxonomy.getSpecialties`, etc.)
- Cached client-side (React Query / tRPC cache) — taxonomy data rarely changes
- Filtering is client-side (datasets are small: max ~85 items)

## tRPC changes

### New router: `taxonomyRouter`

```typescript
taxonomyRouter = router({
  getSpecialties: publicProcedure.query(/* returns all specialties */),
  getTherapyTypes: publicProcedure.query(/* returns all therapy types */),
  getLanguages: publicProcedure.query(/* returns all languages */),
  getAlliedGroups: publicProcedure.query(/* returns all allied groups */),
  getPaymentMethods: publicProcedure.query(/* returns all payment methods */),
});
```

All queries return `{ id: string; name: string; category?: string }[]` sorted by `sortOrder`.
These are public (no auth needed) — taxonomy is not sensitive data.

### Updated `therapistRouter`

- `createProfile` / `updateProfile` — accept new fields, handle relation connects for specialties/therapyTypes/languages
- Input schema updated to include all new fields

### Updated `referralRouter`

- `createReferral` — accept new fields (participants, rateBilling, clientGender, etc.)

## Form updates

### ProfileForm + OnboardingProfileForm

Both forms share the same field set. Changes:

1. Remove hardcoded `SPECIALTIES`, `THERAPEUTIC_APPROACHES`, `LANGUAGES` constants
2. Fetch taxonomy data via tRPC queries
3. Replace `ChipSelect` with `AutocompleteSelect` for specialties, therapyTypes, languages, alliedGroups, paymentMethods
4. Keep `ChipSelect` for modalities (3 options), ageGroups (5-6 options), participants (4 options), styleDescriptors (7 options)
5. Add new field sections:
   - Identity: image, pronouns, therapistGender, primaryCredential, credentials
   - Practice: websiteUrl, psychologyTodayUrl, professionalEmail, freeConsultation, licensingLevel
   - Availability: proBono (alongside existing reducedFees)
   - Communities: participants, alliedGroups, faithOrientation, clientEthnicity
   - Top Specialties: ranked autocomplete (max 3)
6. Group fields into collapsible sections for progressive disclosure

### ReferralPostForm

1. Replace `presentingIssue` text input with `AutocompleteSelect` using specialties taxonomy
2. Add `participants` radio group
3. Add `rateBilling` select
4. Add expandable "Additional details" section with clientGender, clientAge, therapistGenderPref, therapyTypes (autocomplete), languageRequirements (autocomplete), additionalContext (textarea)
5. Keep existing fields: ageGroup, locationCity, locationProvince, modality

## Key decisions

1. **Relations for large taxonomies, String[] for small sets** — Specialties (85+), TherapyTypes (68), Languages (35) get proper tables. Participants (4), modalities (3), ageGroups (6), styleDescriptors (7) stay as String[] — not worth the join overhead.
2. **Keep old String[] columns during migration** — No data loss risk. Clean up in a separate future migration after verifying relation data is correct.
3. **Client-side filtering, not server-side search** — Max dataset is ~85 items. No need for server-side search or fuzzy matching. Prefetch all taxonomy data on form mount.
4. **AutocompleteSelect is a new component, not a ChipSelect refactor** — Different enough in behavior (text input, filtering, ranking) to warrant a separate component. ChipSelect stays for small option sets.
5. **presentingIssue stays as String on ReferralPost** — Referral postings may describe issues not in the taxonomy. The autocomplete suggests from taxonomy but allows free text too.
