# Screen Specification: Referral Detail

---

## Screen Identity

**Screen name:** Referral Detail

**Purpose:** The therapist sees the full picture of a single referral — what was needed, who was matched, who responded, and the current status.

**Who:** Solo therapist checking on a referral they sent, or reviewing an incoming referral they were matched to.

**Task:** Understand the referral's status and outcome — did the matched therapists respond? Did the client connect?

**Feel:** Clear and informative — like reading a well-organized case note. Not a data dashboard, but a narrative of what happened with this referral.

---

## Visual Hierarchy

### Tool 1: Size
- **Largest:** Referral specialty/need as title — Heading 1 level
- **Medium:** Match cards, status timeline — Body level
- **Smallest:** Timestamps, metadata — Caption level

### Tool 2: Weight
- **Bold:** Specialty title, matched therapist names, status badge
- **Medium:** Section headings ("Matched Therapists", "Details")
- **Light:** Timestamps, helper text

### Tool 3: Color
- **Brand accent:** Match ring visualization
- **Semantic colors:** Status badge, response indicators (accepted=success, declined=error, pending=neutral)
- **Muted:** Timestamps, secondary details

### Tool 4: Spacing
- **Generous:** Between sections (criteria, matches, timeline)
- **Standard:** Between match cards
- **Compact:** Within match cards

### Tool 5: Position
- **Top:** Back link + referral title (specialty/need)
- **Upper area:** Referral criteria summary and status
- **Main area:** Matched therapists with response status
- **Bottom:** Timeline / activity log

### Tool 6: Contrast
- **Highest:** Status badge, match ring fills
- **Medium:** Therapist names, specialty labels
- **Low:** Timestamps, section dividers

### 4 Hierarchy Levels

| Level | Role | Treatment | Elements |
|-------|------|-----------|----------|
| **Primary** | Current status and match responses | Status badge prominent, match cards with clear response indicators | Status badge, match response states |
| **Secondary** | What was needed and who was matched | Clear text, therapist names and specialties | Referral criteria, matched therapist info |
| **Tertiary** | Timeline and metadata | Muted, smaller text | Timestamps, activity log entries, referral ID |
| **Background** | Navigation and structure | Quiet | Back link, section dividers, card borders |

---

## Content Priority

| Priority | Content Element | Why This Position |
|----------|----------------|-------------------|
| 1 | Overall status badge | First question: "What's the status?" |
| 2 | Matched therapists + their responses | Second question: "Who responded?" |
| 3 | Match quality (match rings) | "How well do they fit?" |
| 4 | Referral criteria summary | "What did I ask for?" — context for matches |
| 5 | Response details | Accepted/declined messages from therapists |
| 6 | Timeline / activity log | Historical record — when things happened |
| 7 | Referral metadata | ID, created date — for record-keeping |

---

## Layout Structure

**Grid:** Centered single-column, 720px max-width (same as form)

```
┌─────────────────────────────────────────────────┐
│ [Top Navigation Bar]                              │
├─────────────────────────────────────────────────┤
│                                                   │
│   ← Back to Referrals                             │
│                                                   │
│   Anxiety, EMDR, Trauma Processing    [Responded] │  ← Title + Status
│   Sent 3 days ago · Ref #R-2024-042               │  ← Metadata
│                                                   │
│   ─────────────────────────────────────────────   │
│                                                   │
│   What was needed                                 │  ← Criteria Section
│   Specialty: Anxiety, EMDR                        │
│   Insurance: Blue Cross                           │
│   Location: Toronto · Virtual OK                  │
│   Urgency: Soon                                   │
│   Context: "Looking for evening availability..."  │
│                                                   │
│   ─────────────────────────────────────────────   │
│                                                   │
│   Matched Therapists (2 of 5 responded)           │  ← Matches Section
│                                                   │
│   ┌─────────────────────────────────────────┐     │
│   │ ◉◉◉○  Dr. Sarah Chen, LCSW              │     │  ← Match Card
│   │        Anxiety, CBT, EMDR · Toronto      │     │
│   │        Blue Cross · Accepting clients    │     │
│   │        ✓ Accepted · 2 days ago           │     │
│   └─────────────────────────────────────────┘     │
│                                                   │
│   ┌─────────────────────────────────────────┐     │
│   │ ◉◉○○  Dr. Marcus Lee, PhD               │     │  ← Match Card
│   │        Trauma, EMDR · North York         │     │
│   │        Blue Cross · Accepting clients    │     │
│   │        ✗ Declined · 1 day ago            │     │
│   └─────────────────────────────────────────┘     │
│                                                   │
│   ┌─────────────────────────────────────────┐     │
│   │ ◉◉◉○  Dr. Aisha Patel, PsyD             │     │  ← Match Card
│   │        Anxiety, EMDR · Scarborough       │     │
│   │        Blue Cross · Accepting clients    │     │
│   │        ⏳ Pending                         │     │
│   └─────────────────────────────────────────┘     │
│                                                   │
│   (+ 2 more pending)                              │
│                                                   │
│   ─────────────────────────────────────────────   │
│                                                   │
│   Activity                                        │  ← Timeline
│   · Dr. Chen accepted — 2 days ago                │
│   · Dr. Lee declined — 1 day ago                  │
│   · Referral sent to 5 therapists — 3 days ago    │
│                                                   │
│   [Close Referral]                                │  ← Action
│                                                   │
└─────────────────────────────────────────────────┘
```

**Responsive behavior:**
- **Mobile (0–639px):** Full-width. Match cards stack. Match rings display smaller. Criteria section uses label-value stacking.
- **Tablet (640–1023px):** Same as desktop, narrower margins.
- **Desktop (1024px+):** 720px centered container.

---

## States

### Loading State
- **Duration expectation:** < 500ms
- **Visual treatment:** Skeleton matching the layout — title block, criteria block, 3 match card skeletons, timeline skeleton
- **Content available during load:** Top nav, back link render immediately

### Populated State (Outgoing Referral — Sent by this therapist)
- **Data density:** All criteria shown, all matched therapists shown (up to 5), activity timeline
- **Content examples:** As shown in layout diagram above
- **Overflow handling:** Context notes truncate at 3 lines with "Show more" toggle

### Populated State (Incoming Referral — Received by this therapist)
- **Differences from outgoing:** Shows "From: [referring therapist]" instead of match list. Shows the referral criteria and your match quality. Shows "You responded: Accepted" or status.
- **Match ring:** Shows only YOUR match quality, not other matches

### Error State
- **Error types:** Network failure, referral not found (deleted/expired)
- **Recovery:** "Couldn't load this referral. Go back to your referrals." + back link
- **Placement:** Full content area replacement

---

## Component Inventory

| # | Component | Purpose | System.md Pattern? |
|---|-----------|---------|-------------------|
| 1 | Back Link | Navigate to Referral Tracker | New |
| 2 | Referral Header | Title (specialties) + status badge + metadata | Reuses Status Badge |
| 3 | Criteria Summary | Display referral criteria as label-value pairs | New |
| 4 | Match Card | Display one matched therapist with match quality and response | New — **signature component** |
| 5 | Match Ring | Concentric ring visualization of match quality | New — **signature element** |
| 6 | Activity Timeline | Chronological log of referral events | New |
| 7 | Close Referral Button | Mark referral as closed | New |

### Back Link

1. **Purpose:** Return to Referral Tracker
2. **Content:** "← Back to Referrals"
3. **Dimensions:** Padding: `--space-xs` (8px) vertical. Margin-bottom: `--space-md` (16px).
4. **Typography:** Body small (14px/500), `--fg-secondary`
5. **States:** Default `--fg-secondary`, hover `--fg-primary`, focus `--border-focus` ring
6. **Variants:** None
7. **Interactions:** Click → navigate to Tracker preserving filter state
8. **Responsive:** Unchanged

### Match Card

1. **Purpose:** Display one matched therapist — who they are, how well they match, and whether they responded
2. **Content:** Match ring, therapist name + credentials, specialties, location, insurance, availability status, response status + timestamp
3. **Dimensions:** Full container width. Padding: `--space-md` (16px). Border: `--border-default`. Radius: `--radius-md` (10px). Gap between cards: `--space-sm` (12px). Shadow: elevation level 1.
4. **Typography:**
   - Name — Heading 3 (16px/600)
   - Specialties, location — Body small (14px/400), `--fg-secondary`
   - Response status — Body small (14px/500) with semantic color
   - Response timestamp — Caption (12px/400), `--fg-tertiary`
5. **States:**
   - Accepted: `--semantic-success` accent on response text, subtle success tint on left border
   - Declined: `--semantic-error` accent on response text, muted appearance
   - Pending: neutral, `--fg-tertiary` "Pending" text
6. **Variants:** Outgoing view (shows full therapist detail). Incoming view (shows match quality for current user only).
7. **Interactions:** Non-interactive in V1 — display only. Future: click to view full therapist profile.
8. **Responsive:** Full-width on mobile. Match ring scales down. Content stacks more vertically.

### Match Ring (Signature Element)

1. **Purpose:** Visualize multi-dimensional match quality — the product's signature
2. **Content:** 4 concentric rings representing: specialty fit, insurance match, location proximity, approach alignment. Filled rings = matched dimensions.
3. **Dimensions:** 48px × 48px on desktop, 36px × 36px on mobile. Positioned left of therapist name in match card.
4. **Typography:** None — purely visual. Tooltip on hover shows dimension names.
5. **States:**
   - 4/4 filled: all rings in `--brand-primary` — excellent match
   - 3/4 filled: three rings filled, one outline — strong match
   - 2/4 filled: two filled, two outline — moderate match
   - 1/4 filled: one filled, three outline — weak match
   - Ring colors: filled = `--brand-primary`, unfilled = `--border-subtle`
6. **Variants:** Size: compact (36px) for mobile/lists, standard (48px) for detail view
7. **Interactions:** Hover shows tooltip: "Matched: Specialty, Insurance, Location. Missing: Approach"
8. **Responsive:** Compact size on mobile
9. **Accessibility:** `aria-label="Match quality: 3 of 4 dimensions matched — specialty, insurance, location"`. Color is supplemented by filled/unfilled shape distinction.

### Activity Timeline

1. **Purpose:** Chronological record of referral events
2. **Content:** List of events with timestamp: "Referral sent to 5 therapists", "Dr. Chen accepted", "Dr. Lee declined"
3. **Dimensions:** Full container width. Each entry: padding `--space-xs` (8px) vertical. Left border or dot indicator.
4. **Typography:** Event text — Body small (14px/400). Timestamp — Caption (12px/400), `--fg-tertiary`. Newest first.
5. **States:** Static — grows as events happen
6. **Variants:** None
7. **Interactions:** None — display only
8. **Responsive:** Unchanged

---

## Interaction Patterns

**Primary interaction:** Read and scan — this is primarily an information display screen.

**Keyboard navigation:** Tab order: back link → close referral button. Match cards and timeline are static content.

**Micro-interactions:**
- Match ring tooltip: fade in 150ms on hover
- "Show more" on context notes: content expands with 250ms ease-out

---

## Accessibility Notes

- **Landmark regions:** `<main>` for content, `<nav>` for back link area
- **Heading hierarchy:** h1 = specialty/need title. h2 = section headings ("What was needed", "Matched Therapists", "Activity"). h3 = therapist names in match cards.
- **ARIA requirements:** Match rings have descriptive `aria-label`. Status badge has visible text. Timeline uses `<ol>` with reversed order.
- **Color independence:** Match ring filled/unfilled distinction is shape-based (filled circle vs. outline), not just color. Response status uses text labels + icons (✓ ✗ ⏳), not just color.
- **Focus management:** On load, focus stays at top of page (back link or heading).

---

## Open Questions

None.
