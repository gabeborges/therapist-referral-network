# Proposal: Onboarding & Referral Form Restructure

## What

Three coordinated changes:

1. **Onboarding wizard** — Replace the single-page onboarding form with a 3-step wizard (Bio, Communities served, Your services). Onboarding becomes a strict subset of profile fields.
2. **Referral form overhaul** — Rename fields, change control types, reorder, remove unused fields, align field names with profile schema.
3. **Cross-cutting cleanup** — Sentence case all labels site-wide, remove gender field, add middle name, rename sections and fields for consistency.

## Why

1. **Onboarding is overwhelming** — 30+ fields on one page causes drop-off. A wizard with only the essential 13 fields gets therapists onboarded faster. Remaining fields live on the profile page.
2. **Referral form has UX issues** — field order doesn't match workflow, "Rate / Billing" is confusingly named, modality is single-select when therapists often offer multiple, "Direct billing" doesn't belong in rate options (it's a payment method).
3. **Inconsistent naming** — referral field names (`locationCity`, `rateBilling`, `additionalNotes`) don't match profile (`city`, `rate`, `details`). Label casing is inconsistent (Title Case vs sentence case).

## Scope

### In scope

1. **Onboarding wizard** — 3-step form with progress indicator, per-step validation
   - Step 1 "Bio": photo, first/middle/last name, pronouns, display name, email, city, province
   - Step 2 "Communities served": specialties, participants (mandatory), ages, modalities
   - Step 3 "Your services": dynamic rate inputs per participant type, payment methods, accepting clients
2. **Referral form** — field renames, reorder, control type changes, field removals
3. **Profile form** — add middle name field, remove gender field, rename sections, sentence case labels
4. **Prisma schema** — rename referral fields, add middleName, remove gender, restructure rate to per-participant
5. **Zod schemas** — update both profile and referral validation
6. **tRPC routers** — update mutations to handle renamed fields and new rate structure
7. **Label casing** — sentence case all field labels across onboarding, profile, and referral forms

### Out of scope

- Profile page redesign (just field additions/removals, not layout overhaul)
- Matching algorithm changes (field renames propagate, but no new matching logic)
- Data migration (no users have onboarded yet)

## Success criteria

| Metric               | Target                                                                             |
| -------------------- | ---------------------------------------------------------------------------------- |
| Onboarding fields    | Exactly 13 fields across 3 wizard steps                                            |
| Profile fields       | All current fields + middle name, minus gender                                     |
| Referral field names | Aligned with profile naming (city, province, modalities, details, rate, languages) |
| Label casing         | All labels in sentence case across all 3 forms                                     |
| Rate inputs          | Dynamic per participant type selected                                              |
| Wizard validation    | Each step validates before advancing                                               |

## Risks

| Risk                                                  | Mitigation                                                                    |
| ----------------------------------------------------- | ----------------------------------------------------------------------------- |
| Rate restructure (single value → per-participant map) | No existing users — clean schema change, no migration                         |
| Referral field renames break matching                 | Update matching logic field references in same change                         |
| Wizard state management complexity                    | Use react-hook-form with a single form across steps — just show/hide sections |
