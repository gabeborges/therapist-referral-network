# Flow: Onboarding

**Goal:** Get a new therapist's profile complete so the system can include them in matching.
**Trigger:** Therapist just created an account (arrives from Sign Up).
**Success state:** Profile filled with matching-critical fields, therapist lands on Referral Tracker ready to use the app.

---

## Task Flow (Happy Path)

```
*New therapist after sign-up*
  → [Onboarding: Welcome]
  → Reads brief explanation of how the platform works
  → Clicks "Set up your profile"
  → [Onboarding: Profile Setup]
  → Fills in: credentials, specialties, therapeutic approaches, insurance, location, availability
  → Clicks "Complete setup"
  → {System validates and saves profile}
  → [Referral Tracker: Empty State]
  → **Exit: onboarded, ready to create first referral or receive matches**
```

---

## User Flow (Expanded)

```
*Arrives from Sign Up*
  → [Onboarding: Welcome]
  → Brief message: what this platform does, how matching works, what they need to fill out
  → CTA: "Set up your profile"
  → [Onboarding: Profile Setup]
  → Form with matching-critical fields
  → (All required fields filled?)
    →? No: <Error: highlights missing fields with explanation of why each matters for matching>
      →← [Onboarding: Profile Setup]
    →? Yes: ↓
  → {Save profile}
  → [Referral Tracker: Empty State]
  → Welcome message: "You're all set! You'll receive referral matches by email when a client's needs match your profile."
  → Two CTAs: "Create your first referral" | "Explore your profile"
  → **Exit: onboarded**
```

### Onboarding Fields

Same as profile fields, but presented in a focused, guided context:

| Field | Required | Why it matters for matching |
|-------|----------|---------------------------|
| Credentials | Yes | Displayed to referring therapists |
| Specialties | Yes | Primary matching dimension |
| Therapeutic approaches | No | Secondary matching — improves fit |
| Insurance accepted | Yes | Primary matching dimension — clients need coverage |
| Location | Yes | Geographic matching |
| Availability | Yes | Must be "accepting" to receive matches |
| Contact email | Pre-filled | From sign-up — confirm or change |

### Design Decisions

- **Single page, not multi-step:** The form is short enough (6-7 fields) that a wizard would add friction without adding clarity. One scrollable form with clear sections.
- **Skip option:** No skip. If we let therapists skip, they can't be matched, making the platform useless for them. Every required field directly enables matching.
- **Progress indicator:** Not needed for a single page. If it were multi-step, yes.
- **Why-framing:** Each field has a brief note explaining how it affects matching. "Your specialties help us match you with clients who need your expertise." This motivates completion.

### Edge Cases

- **Returning to onboarding:** If therapist signs up but doesn't finish, next login should return them to onboarding (profile incomplete → redirect)
- **Changing answers later:** All fields editable from Profile screen. Onboarding is just the first fill.
