# Flow: Review Incoming Referral

**Goal:** See referrals where the system matched you, understand what's needed.
**Trigger:** Therapist receives an email saying they've been matched, or checks the tracker for incoming referrals.
**Success state:** Therapist understands the referral and has responded (via email).

---

## Task Flow (Happy Path)

```
*Therapist receives email: "You've been matched for a referral"*
  → Reads email: specialty needed, insurance, location, urgency, context, referring therapist name
  → Replies to email: "I can take this" or "Not available"
  → {System records response, updates referral status}
  → **Exit: response recorded**
```

**In-app alternative:**
```
*Therapist opens app, checks incoming referrals*
  → [Referral Tracker] → filters to "Received"
  → Sees incoming referrals with status
  → Clicks referral
  → [Referral Detail]
  → Views referral info — what's needed, who referred
  → **Exit: informed (response still happens via email)**
```

---

## User Flow (Expanded)

### Email Path (Primary)
```
*Email arrives*
  → (Therapist reads email?)
    →? Yes: reads referral details
      → (Available and good fit?)
        →? Accept: replies "accept" → {System marks accepted}
        →? Decline: replies "decline" → {System marks declined}
        →? Questions: replies with question → {System forwards to referring therapist? Or marks as "in discussion"?}
      → **Exit: responded**
    →? No response: status stays "Pending"
      → (After X days?) → {System marks as "No response"} → **Exit: timed out**
```

### In-App Path (Secondary)
```
*Therapist opens tracker*
  → [Referral Tracker] → "Received" tab/filter
  → (Has incoming referrals?)
    →? No: "No incoming referrals — your profile helps the system match you. Keep it updated."
    →? Yes: sees list with status per referral
  → Clicks referral
  → [Referral Detail]
  → Views details (read-only — response is via email)
  → **Exit: informed**
```

### Edge Cases

- **Email reply parsing:** System needs to understand accept/decline from natural language email replies. May need structured reply options (accept/decline links in email body).
- **Multiple matches:** Therapist may be matched for several referrals — email should be clear about which referral this is.
- **Already at capacity:** Therapist may want to temporarily mark themselves unavailable — links to profile availability toggle.

### Design Decision

The email is the primary response mechanism. The in-app tracker shows incoming referrals for awareness and record-keeping, but doesn't duplicate the response action. This keeps the flow simple: email for action, app for tracking.
