# Flow: Create & Send Referral

**Goal:** Send a well-matched referral — describe client needs, system finds the right therapists.
**Trigger:** Therapist finishes a session and decides to refer the client out.
**Success state:** Referral sent, top 5 matched therapists emailed, referral appears in tracker with "Sent" status.

---

## Task Flow (Happy Path)

```
*Therapist opens app after a session*
  → [Referral Tracker]
  → Clicks "New Referral"
  → [Create Referral]
  → Fills in: specialty needed, therapeutic approach, insurance, location, urgency, context notes (no PHI)
  → Submits form
  → {System validates input}
  → {System matches top 5 therapists from profiles}
  → {System sends email notifications to matched therapists}
  → [Referral Tracker] — new referral appears with "Sent" status, success confirmation
  → **Exit: referral created and sent**
```

---

## User Flow (Expanded)

```
*Therapist opens app*
  → (Authenticated?)
    →? No: → [Sign In] → {Authenticate} → [Referral Tracker]
    →? Yes: → [Referral Tracker]
  → Clicks "New Referral"
  → [Create Referral]
  → Fills in referral criteria
  → (Form valid?)
    →? No: <Error: inline validation — missing required fields>
      → Therapist corrects
      →← [Create Referral]
    →? Yes: ↓
  → {System matches therapists against criteria}
  → (Matches found?)
    →? No matches: <Empty: "No therapists match these criteria. Try broadening specialty or location.">
      → Therapist adjusts criteria
      →← [Create Referral]
    →? Fewer than 5: {System sends to however many match} → [Referral Tracker] with note "X therapists matched"
    →? 5+ matches: {System sends to top 5} → [Referral Tracker]
  → Success confirmation shown
  → **Exit: referral sent**
```

### Edge Cases

- **First referral:** Referral Tracker shows empty state with prominent "Create your first referral" CTA
- **No matches:** Possible if criteria are very specific (rare specialty + specific insurance + narrow location). Show clear guidance on what to broaden.
- **Profile incomplete:** If referring therapist's own profile is incomplete, show gentle nudge but don't block — their profile doesn't affect outgoing referrals
- **Duplicate referral:** Allowed — therapist may legitimately re-refer with different criteria

### Form Fields

| Field | Required | Type | Notes |
|-------|----------|------|-------|
| Specialty needed | Yes | Multi-select | From defined list (anxiety, trauma, couples, etc.) |
| Therapeutic approach | No | Multi-select | CBT, EMDR, psychodynamic, etc. |
| Insurance accepted | Yes | Select | Client's insurance plan |
| Location preference | Yes | Location input | City/area or "virtual OK" |
| Urgency | No | Select | Routine / Soon / Urgent |
| Context notes | No | Textarea | Brief context for matched therapists — NO PHI |

**PHI guardrail:** Context notes field has a visible reminder: "Do not include client names, dates of birth, or identifying health details."
