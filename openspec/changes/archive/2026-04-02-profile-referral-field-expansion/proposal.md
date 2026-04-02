# Proposal: Profile & Referral Field Expansion

## What

Expand the therapist profile and referral posting forms to match Psychology Today's taxonomy, add new profile fields (credentials, image, pro bono, etc.), introduce an autocomplete UI component for large option sets, and move all taxonomy data from hardcoded constants into database tables.

## Why

Our current profile has 18 specialties, 13 therapy types, and 19 languages — Psychology Today has 85+, 68, and 35 respectively. This gap means:

1. **Matching fails** — referral postings mention issues (substance use, autism, suicidal ideation) and modalities (Relational, Trauma Focused) that don't exist in our system
2. **Missing entire dimensions** — we can't filter by participants (couples vs individual), allied groups, cultural fit, or faith orientation
3. **Profile credibility gap** — no credentials, photo, pronouns, or consultation availability makes profiles feel incomplete vs PT
4. **Referral form too limited** — 6 fields can't capture what real referral postings need (analyzed 9 real-world postings from the Facebook community)

## Scope

### In scope

1. **Taxonomy tables in DB** — Specialty, TherapyType, Language, AlliedGroup, FaithOrientation, Ethnicity, PaymentMethod, StyleDescriptor tables with seed data matching PT's taxonomy
2. **New profile fields** — image, websiteUrl, psychologyTodayUrl, proBono, professionalEmail, primaryCredential, credentials, freeConsultation, pronouns, participants, topSpecialties, alliedGroups, faithOrientation, clientEthnicity, paymentMethods, therapistGender, styleDescriptors, licensingLevel, otherTreatmentOrientation
3. **Autocomplete component** — replaces checkbox walls for fields with 8+ options; queries taxonomy tables
4. **Expand existing fields** — specialties 18→85+, therapeuticApproach 13→68, languages 19→35
5. **Referral form expansion** — add participants, rateBilling, clientGender, clientAge, therapistGenderPref, therapyType, language, additionalContext; expand presentingIssues to use full taxonomy
6. **tRPC updates** — taxonomy query endpoints, updated profile/referral mutations
7. **Matching algorithm update** — use new fields (participants, allied groups) for better matching

### Out of scope

- Psychology Today scraper (future — PT URL field enables it)
- Profile photo storage/CDN (use Supabase Storage, but upload UX is separate work)
- Insurance plan expansion (keep current 11 Canadian insurers)
- Must-have vs nice-to-have UX on referral form (future iteration)

## Success criteria

| Metric | Target |
|--------|--------|
| Profile fields match PT parity | All PT taxonomy options available |
| Autocomplete renders < 100ms | Taxonomy queries are fast |
| Existing profiles unaffected | All new fields nullable, no data loss |
| Both forms updated | ProfileForm + OnboardingProfileForm stay in sync |

## Risks

| Risk | Mitigation |
|------|------------|
| Large migration (19 new fields + taxonomy tables) | Phase into 3 milestones, each shippable independently |
| Autocomplete performance with 85+ items | Client-side filtering with debounced search; taxonomy tables are small enough to prefetch |
| Existing profile data breaks | All new fields are optional/nullable; existing String[] fields keep working during transition |
| Form becomes overwhelming | Autocomplete keeps UI clean; group fields into sections with progressive disclosure |
