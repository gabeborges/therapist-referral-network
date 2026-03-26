# Flow: Update Profile

**Goal:** Keep specialties, availability, insurance, and practice details current so the system matches accurately.
**Trigger:** Therapist's circumstances change (new specialty, new insurance accepted, going on leave) or they receive a nudge.
**Success state:** Profile updated, future matches reflect new information.

---

## Task Flow (Happy Path)

```
*Therapist navigates to profile*
  → [Top Nav] → clicks "Profile"
  → [Therapist Profile]
  → Views current profile info
  → Clicks "Edit"
  → [Therapist Profile: Edit Mode]
  → Updates fields
  → Clicks "Save"
  → {System validates and saves}
  → [Therapist Profile] — shows updated info with success confirmation
  → **Exit: profile updated**
```

---

## User Flow (Expanded)

```
*Therapist clicks "Profile" in nav*
  → [Therapist Profile: View Mode]
  → (Wants to edit?)
    →? No: reviews info → **Exit: viewed**
    →? Yes: clicks "Edit" → [Therapist Profile: Edit Mode]
  → Makes changes to fields
  → (Save?)
    →? Save:
      → {Validate fields}
      → (Valid?)
        →? Yes: {Save to database} → [Profile: View Mode] + success toast
        →? No: <Error: inline validation messages> →← [Profile: Edit Mode]
    →? Cancel:
      → (Has unsaved changes?)
        →? Yes: "Discard changes?" confirmation
          →? Discard: → [Profile: View Mode]
          →? Keep editing: →← [Profile: Edit Mode]
        →? No: → [Profile: View Mode]
  → **Exit: profile updated or unchanged**
```

### Profile Fields

| Field | Required | Type | Notes |
|-------|----------|------|-------|
| Full name | Yes | Text | Display name for referral matches |
| Credentials | Yes | Text | E.g., LCSW, PhD, PsyD, LPC |
| Specialties | Yes | Multi-select | From defined list — drives matching |
| Therapeutic approaches | No | Multi-select | CBT, EMDR, DBT, psychodynamic, etc. |
| Insurance accepted | Yes | Multi-select | From defined list — drives matching |
| Location | Yes | Location | City/area + virtual availability |
| Availability status | Yes | Toggle | Accepting referrals / Not accepting |
| Practice name | No | Text | For display purposes |
| Bio / About | No | Textarea | Brief professional description |
| Contact email | Yes | Email | For referral notification delivery |

### Edge Cases

- **Availability toggle:** Prominent — turning off should be fast (one click, not buried in a form). When off, therapist won't receive new matches.
- **Profile completeness:** Show a completion indicator if key matching fields are empty. "Your profile is 70% complete — add insurance to receive more relevant matches."
- **Specialties list:** Must be extensible. Start with common specialties but allow "Other" with free text.
