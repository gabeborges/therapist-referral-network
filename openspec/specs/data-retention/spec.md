# Spec: Data Retention

Cross-cutting compliance spec for PIPEDA data retention, account deletion, automated purge, and consent audit logging. Governs the lifecycle of all personal data in the system.

**Regulatory basis:** PIPEDA Principle 4.5 (Limiting Retention), OPC operational guidance, Loblaw precedent (PIPEDA-2026-001), and CPPA readiness.

## ADDED Requirements

### Requirement: Account deletion workflow

Therapists MUST be able to delete their account from the application. Deletion follows a soft-delete → hard-delete pattern with immediate action on sensitive data.

#### Scenario: Deletion request

- **WHEN** a therapist confirms account deletion at `/account/delete`
- **THEN** in a single database transaction:
  - `User.deletedAt` is set to the current timestamp
  - `User.deleteReason` is set to `"user_request"`
  - `faithOrientation` and `ethnicity` are cleared to `[]` (sensitive data — immediate deletion)
  - `consentCommunitiesServed` is set to `false`
  - All OPEN referrals authored by the therapist are set to CANCELLED with `cancelledAt` timestamp
  - All `Session` and `Account` rows for the user are deleted (auth revocation)
  - A `ConsentLog` entry is created with `consentType: "account_deletion"`, `action: "withdrawn"`
  - The user is signed out via JWT cookie clearance

#### Scenario: Soft-deleted user is blocked

- **WHEN** a user with a non-null `deletedAt` attempts to access any protected route or tRPC procedure
- **THEN** the request is rejected with UNAUTHORIZED

#### Scenario: Hard-delete after retention period

- **WHEN** a daily purge job runs and finds users where `deletedAt` is older than 30 days
- **THEN** the `User` row is hard-deleted (cascading to `TherapistProfile`, `ReferralPost`, `ReferralNotification`, `FulfillmentCheck`)
- **AND** `ConsentLog` entries for that user are NOT deleted (they have no FK to User and follow a separate 24-month retention)

#### Scenario: Deletion confirmation UI

- **WHEN** a therapist navigates to `/account/delete`
- **THEN** they see a two-step confirmation: a checkbox acknowledging permanence, plus a destructive-styled button
- **AND** the page explains: sensitive data deleted immediately, remaining data within 30 days, consent records retained 24 months

### Requirement: Retention schedule

All personal data MUST follow documented retention periods. No data category may accumulate indefinitely.

| Data Category                        | Retention Period                          | Trigger                                                       |
| ------------------------------------ | ----------------------------------------- | ------------------------------------------------------------- |
| Therapist profile                    | Active account lifetime                   | Hard-deleted 30 days after account closure                    |
| Sensitive data (faith, ethnicity)    | Until consent withdrawn or account closed | Deleted immediately on consent withdrawal or deletion request |
| Referral requests + matches          | 90 days after terminal status             | Automated daily purge                                         |
| Consent audit logs                   | 25 months after user hard-deleted         | Automated monthly purge (orphaned logs only)                  |
| Login credentials (Session, Account) | Active account lifetime                   | Deleted immediately on deletion request                       |
| Encrypted backups                    | Up to 7 days                              | Supabase-managed rotation (not application-controlled)        |

#### Scenario: Referral retention — fulfilled

- **WHEN** a referral has status FULFILLED and `fulfilledAt` is more than 90 days ago
- **THEN** the daily purge job hard-deletes the referral and its associated notifications and fulfillment checks (via cascade)

#### Scenario: Referral retention — cancelled

- **WHEN** a referral has status CANCELLED and `cancelledAt` is more than 90 days ago
- **THEN** the daily purge job hard-deletes the referral

#### Scenario: Referral retention — expired

- **WHEN** a referral has status EXPIRED and `updatedAt` is more than 90 days ago
- **THEN** the daily purge job hard-deletes the referral

#### Scenario: OPEN referrals are never purged

- **WHEN** the referral purge job runs
- **THEN** referrals with status OPEN are never touched, regardless of age

#### Scenario: Consent log retention

- **WHEN** the monthly consent log purge runs
- **THEN** it deletes `ConsentLog` entries only where: no `User` record exists for that `userId` AND the most recent log entry for that `userId` is older than 25 months

### Requirement: Automated purge jobs

Data lifecycle enforcement MUST be automated via scheduled cron jobs registered in `vercel.json`. Each job uses the same pattern: POST endpoint authenticated with `CRON_SECRET` bearer token.

| Job               | Schedule                  | Endpoint                       |
| ----------------- | ------------------------- | ------------------------------ |
| Account purge     | Daily at 03:00 UTC        | `/api/cron/purge-accounts`     |
| Referral purge    | Daily at 02:00 UTC        | `/api/cron/purge-referrals`    |
| Consent log purge | Monthly, 1st at 04:00 UTC | `/api/cron/purge-consent-logs` |

#### Scenario: Cron authentication

- **WHEN** a request hits any purge endpoint without a valid `Authorization: Bearer <CRON_SECRET>` header
- **THEN** the endpoint returns 401 Unauthorized

#### Scenario: Cron returns summary

- **WHEN** a purge job completes successfully
- **THEN** the response includes `{ ok: true, summary: { ... }, timestamp }` with counts of purged records

### Requirement: Consent audit logging

Every consent-related action MUST create a `ConsentLog` record for compliance proof. The `ConsentLog` model intentionally has NO foreign key to `User` so records survive account hard-deletion.

#### Scenario: Terms acceptance logged

- **WHEN** a new user accepts Terms of Service during the consent flow
- **THEN** a `ConsentLog` entry is created with `consentType: "terms"`, `action: "granted"`, and `policyVersion` matching the current terms version

#### Scenario: Communities consent change logged

- **WHEN** a therapist changes `consentCommunitiesServed` via profile update
- **THEN** a `ConsentLog` entry is created with `consentType: "communities_served"`, the appropriate `action` (`"granted"` or `"withdrawn"`), and the current consent policy version
- Cross-reference: see `communities-consent` spec for full consent withdrawal behavior

#### Scenario: Account deletion logged

- **WHEN** a therapist requests account deletion
- **THEN** a `ConsentLog` entry is created with `consentType: "account_deletion"`, `action: "withdrawn"`

### Requirement: Privacy policy discloses retention practices

The privacy policy page MUST include structured sections covering PIPEDA Principle 4.8 disclosure requirements.

#### Scenario: Required sections

- **WHEN** a user visits `/privacy`
- **THEN** the page includes sections for: information collected, how it is used, data retention schedule (with per-category periods), third-party processors (Supabase, Vercel, Resend — US-based), user rights (access, correct, withdraw consent, delete account), and contact information

#### Scenario: Retention schedule visible

- **WHEN** a user views the Data Retention section of the privacy policy
- **THEN** a table shows retention periods for: profile data (30 days after closure), sensitive data (immediate on withdrawal), referrals (90 days after terminal), consent logs (24 months after closure), encrypted backups (up to 7 days)

#### Scenario: Contact for privacy requests

- **WHEN** a user wants to exercise their privacy rights
- **THEN** the privacy policy provides the contact email `hi@therapistreferralnetwork.com` and states a 30-day response commitment per PIPEDA

### Requirement: Cascade integrity on deletion

Database cascade deletes MUST be configured so that deleting a `User` cleanly removes all dependent records without FK constraint errors.

#### Scenario: Full cascade chain

- **WHEN** a `User` is hard-deleted
- **THEN** the following cascade occurs: `User` → `TherapistProfile` (onDelete: Cascade) → `ReferralPost` (onDelete: Cascade) → `ReferralNotification` + `FulfillmentCheck` (onDelete: Cascade)
- **AND** `ReferralNotification.recipient` (where this profile received notifications for OTHER therapists' referrals) also cascades (onDelete: Cascade on the recipient relation)

### Requirement: Backup retention acknowledged

The privacy policy and internal documentation MUST acknowledge that Supabase daily backups retain deleted data for up to 7 days (Pro plan). This is acceptable under PIPEDA — the OPC has not required real-time purging of encrypted backups.

#### Scenario: No restoration of deleted data

- **WHEN** a user's data has been deleted per the retention schedule
- **THEN** the application MUST NOT restore that data from backups unless legally compelled
