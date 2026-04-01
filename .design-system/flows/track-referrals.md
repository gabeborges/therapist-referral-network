# Flow: Track Referrals

**Goal:** Know whether referrals were accepted and if clients connected with matched therapists.
**Trigger:** Therapist opens the app to check on referral status, or returns after receiving a notification.
**Success state:** Therapist understands current status of all their referrals (sent and received).

---

## Task Flow (Happy Path)

```
*Therapist opens app to check referral status*
  → [Referral Tracker]
  → Scans list of referrals with status indicators
  → Sees a referral has new responses
  → Clicks referral row
  → [Referral Detail]
  → Views: matched therapists, who responded, response details, timeline
  → **Exit: informed about referral status**
```

---

## User Flow (Expanded)

```
*Therapist opens app*
  → [Referral Tracker]
  → (Has referrals?)
    →? No: [Referral Tracker: Empty State]
      → "No referrals yet. Create your first referral."
      → CTA: "New Referral"
      → **Exit: prompted to create**
    →? Yes: [Referral Tracker: Populated]
  → (Filter?)
    →? By direction: toggles Sent / Received / All
    →? By status: filters to Sent / Responded / Connected / Closed
    →? No filter: shows all, sorted by most recent
  → Scans referral list
  → (Wants detail?)
    →? Yes: clicks referral row → [Referral Detail]
      → Views matched therapists, responses, timeline
      → (Action?)
        →? Close referral: confirms → {System marks closed} → [Referral Tracker]
        →? No action: ← back to tracker
    →? No: **Exit: scanned status**
  → **Exit: informed**
```

### Referral Statuses

| Status | Meaning | Visual |
|--------|---------|--------|
| Sent | Emails sent to matched therapists, awaiting responses | Neutral / pending |
| Responded | One or more therapists replied (accepted or declined) | Attention — new activity |
| Connected | Client connected with a matched therapist | Success |
| Closed | Referral resolved or expired | Muted / archived |

### Edge Cases

- **All referrals closed:** Show closed referrals in muted state, CTA to create new
- **Stale referrals:** Referrals with no response after X days — surface a "no responses yet" indicator
- **Many referrals:** Pagination or infinite scroll for therapists with high referral volume (P1 concern)
