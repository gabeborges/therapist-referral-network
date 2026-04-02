# Screen Specification: Referral Tracker

---

## Screen Identity

**Screen name:** Referral Tracker

**Purpose:** Home screen — the therapist sees all their referrals (sent and received) at a glance and understands their current status.

**Who:** Solo therapist in private practice, checking in after sessions or during admin time. Reflective, not rushed.

**Task:** Scan referral statuses, identify referrals that need attention, initiate a new referral.

**Feel:** Calm and organized — like a well-kept notebook of referral notes. Not a data dashboard. The therapist should feel oriented and in control.

---

## Visual Hierarchy

### Tool 1: Size

- **Largest:** Page title "Your Referrals" — Display level
- **Medium:** Referral row content — Body level
- **Smallest:** Status badges, timestamps — Caption level

### Tool 2: Weight

- **Bold:** Page title, referral specialty labels (what was needed)
- **Medium:** Status badges, tab labels
- **Light:** Timestamps, secondary details

### Tool 3: Color

- **Brand accent:** "New Referral" CTA button, active tab indicator
- **Semantic colors:** Status badges (sent=neutral, responded=info, connected=success, closed=muted)
- **Muted:** Timestamps, secondary metadata

### Tool 4: Spacing

- **Generous:** Between the page header and list, between referral rows
- **Compact:** Within referral rows (label-value pairs)

### Tool 5: Position

- **Top-left:** Page title "Your Referrals"
- **Top-right:** "New Referral" CTA
- **Below header:** Direction tabs (All / Sent / Received)
- **Main area:** Referral list

### Tool 6: Contrast

- **Highest:** "New Referral" button (brand on white), status badges with semantic colors
- **Medium:** Referral specialty text (fg-primary)
- **Lowest:** Timestamps, row borders

### 4 Hierarchy Levels

| Level          | Role                                                            | Treatment                                 | Elements                                                             |
| -------------- | --------------------------------------------------------------- | ----------------------------------------- | -------------------------------------------------------------------- |
| **Primary**    | Create a new referral or find the referral that needs attention | Brand-colored CTA, status badges that pop | "New Referral" button, status indicators                             |
| **Secondary**  | Understand each referral's context                              | Body text, clear labels                   | Specialty needed, referral direction (sent/received), therapist name |
| **Tertiary**   | Context and metadata                                            | Muted text, smaller size                  | Timestamps ("3 days ago"), location, insurance                       |
| **Background** | Structure and navigation                                        | Quiet borders, navigation                 | Top nav, direction tabs, row separators                              |

**Squint test:** The "New Referral" button and status badges should be the only things visible when blurred. The rest should read as organized rows of quiet content.

---

## Content Priority

| Priority | Content Element                    | Why This Position                                    |
| -------- | ---------------------------------- | ---------------------------------------------------- |
| 1        | "New Referral" CTA                 | Primary action — always visible, always accessible   |
| 2        | Status badges on referral rows     | The therapist came here to check "what happened?"    |
| 3        | Specialty/need description         | Identifies which referral this is ("Anxiety + EMDR") |
| 4        | Direction indicator                | Sent vs. received — orients the therapist            |
| 5        | Referring/matched therapist name   | Who's involved                                       |
| 6        | Timestamp                          | When this happened                                   |
| 7        | Direction tabs (All/Sent/Received) | Filtering — secondary navigation                     |
| 8        | Page title                         | Orientation — read once                              |

---

## Layout Structure

**Grid:** Top nav (full width, 1120px content max) + centered content area (960px max)

```
┌─────────────────────────────────────────────────┐
│ [Logo]    [Referrals] [Profile]   [+ New] [Avatar]│  ← Top Nav (56px)
├─────────────────────────────────────────────────┤
│                                                   │
│   Your Referrals                    + New Referral │  ← Page Header
│                                                   │
│   [All]  [Sent]  [Received]                       │  ← Direction Tabs
│                                                   │
│   ┌───────────────────────────────────────────┐   │
│   │ ● Sent  │ Anxiety, EMDR │ Dr. Smith  │ 2d │   │  ← Referral Row
│   ├───────────────────────────────────────────┤   │
│   │ ● Resp  │ Couples, CBT  │ Dr. Jones  │ 5d │   │  ← Referral Row
│   ├───────────────────────────────────────────┤   │
│   │ ● Recv  │ Trauma, EMDR  │ Dr. Lee    │ 1w │   │  ← Referral Row
│   └───────────────────────────────────────────┘   │
│                                                   │
└─────────────────────────────────────────────────┘
```

**Responsive behavior:**

- **Mobile (0–639px):** Full-width rows. Page title and CTA stack vertically. Tabs scroll horizontally. Row content stacks: status + specialty on top, therapist + time below.
- **Tablet (640–1023px):** Same layout as desktop but narrower. Rows compress slightly.
- **Desktop (1024px+):** Full layout as drawn. 960px centered container.

---

## States

### Loading State

- **Duration expectation:** < 500ms (data from Supabase, small dataset for solo practitioners)
- **Visual treatment:** Skeleton rows — 5 rows with pulsing rectangles matching row layout (status dot, two text blocks, timestamp)
- **Content available during load:** Top nav, page title, direction tabs, "New Referral" button — all render immediately. Only the referral list loads.
- **Accessibility:** Container has `aria-busy="true"` during load

### Empty State

- **Message:** "No referrals yet. When you create a referral, the system will match your client's needs with therapists in the network."
- **Action:** Large "Create your first referral" CTA (brand-colored, same style as "New Referral")
- **Visual:** Simple illustration or icon — a subtle connection/handoff graphic. Minimal, not cute.
- **Accessibility:** Empty message is in document flow, CTA is focusable

### Populated State

- **Data density:** Flat list, no pagination needed for V1 (solo practitioners won't have hundreds). Sorted by most recent. Each row shows: status badge, specialty/need, direction, therapist name, relative timestamp.
- **Content examples:**
  - "Sent · Anxiety, EMDR · Accepting: 2 of 5 responded · 3 days ago"
  - "Received · Couples therapy, CBT · From: Dr. Sarah Chen · 1 week ago"
  - "Connected · Trauma processing · With: Dr. Marcus Lee · 2 weeks ago"
  - "Cancelled · Depression, CBT · Cancelled · 1 week ago"
- **Overflow handling:** Long specialty lists truncate with "…" and expand on click. Therapist names truncate at 24 characters.

### Error State

- **Error types:** Network failure (most likely), auth expired
- **Recovery path:** "Couldn't load your referrals. Check your connection and try again." + Retry button
- **Error placement:** Banner at top of content area, above where the list would be. Previous data retained if available.
- **Accessibility:** Error banner uses `role="alert"`

---

## Component Inventory

| #   | Component          | Purpose                                       | System.md Pattern?      |
| --- | ------------------ | --------------------------------------------- | ----------------------- |
| 1   | Top Navigation Bar | App-wide navigation and primary CTA           | New — defines the shell |
| 2   | Page Header        | Title + primary action                        | New                     |
| 3   | Direction Tabs     | Filter referrals by All/Sent/Received         | New                     |
| 4   | Referral Row       | Display one referral with status and key info | New                     |
| 5   | Status Badge       | Visual status indicator                       | New                     |
| 6   | Empty State        | First-use guidance                            | New                     |
| 7   | Error Banner       | Error display with retry                      | New                     |
| 8   | Skeleton Row       | Loading placeholder                           | New                     |

### Top Navigation Bar

1. **Purpose:** Persistent app navigation — logo, section links, primary action, user context
2. **Content:** App logo/name, "Referrals" link, "Profile" link, "New Referral" button, user avatar + name
3. **Dimensions:** Full width, 56px height. Content constrained to 1120px. Horizontal padding: `--space-lg` (24px)
4. **Typography:** Logo — Heading 3 (16px/600). Nav links — Label (13px/500). Button — Label (13px/500)
5. **States:**
   - Default: nav links in `--fg-secondary`, active link in `--fg-primary` with `--brand-primary` underline (2px)
   - Hover: nav links shift to `--fg-primary`
   - Mobile: hamburger menu icon replaces links, "New Referral" remains visible
6. **Variants:** Authenticated (full nav) vs. unauthenticated (logo only — for auth screens)
7. **Interactions:** Nav links navigate. "New Referral" opens Create Referral. Avatar opens dropdown (sign out).
8. **Responsive:** Mobile — logo left, "New Referral" right, hamburger menu. Tablet+ — full nav visible.

### Page Header

1. **Purpose:** Page title and primary action in one row
2. **Content:** "Your Referrals" title + "New Referral" button
3. **Dimensions:** Full container width. Padding-top: `--space-2xl` (48px) from nav, padding-bottom: `--space-lg` (24px)
4. **Typography:** Title — Display (30px/700). Button — Label (13px/500)
5. **States:** Static — no interactive states on the title itself
6. **Variants:** None
7. **Interactions:** "New Referral" button is the primary CTA (if also in nav, both work — the header CTA is more prominent on desktop)
8. **Responsive:** Mobile — title and button stack vertically, button full-width. Desktop — side by side.

### Direction Tabs

1. **Purpose:** Filter referrals by direction — All, Sent, Received
2. **Content:** Three text tabs with counts: "All (12)" "Sent (8)" "Received (4)"
3. **Dimensions:** Tab height 36px. Padding: `--space-sm` (12px) horizontal, `--space-xs` (8px) vertical. Gap between tabs: `--space-xs` (8px). Bottom border on container: `--border-subtle`
4. **Typography:** Label (13px/500). Active tab — 600 weight.
5. **States:**
   - Default: `--fg-tertiary` text
   - Hover: `--fg-secondary` text
   - Active: `--fg-primary` text, `--brand-primary` bottom border (2px)
   - Focus: `--border-focus` ring
6. **Variants:** None
7. **Interactions:** Click switches filter. URL updates for deep-linking. Count updates with filter.
8. **Responsive:** Unchanged across breakpoints — tabs are compact enough.

### Referral Row

1. **Purpose:** Display one referral's key information — scannable at a glance
2. **Content:** Status badge, specialty/need labels, direction + therapist name, relative timestamp
3. **Dimensions:** Full container width. Padding: `--space-md` (16px) vertical, `--space-md` (16px) horizontal. Separated by `--border-subtle` bottom border.
4. **Typography:**
   - Specialty labels — Body (15px/400)
   - Direction + therapist name — Body small (14px/400), `--fg-secondary`
   - Timestamp — Caption (12px/400), `--fg-tertiary`
5. **States:**
   - Default: `--bg-surface-1` background (or transparent on base)
   - Hover: `--bg-surface-1` background, `--border-default` bottom border
   - Active: slight press effect (1px translate)
   - Focus: `--border-focus` outline
   - New activity: subtle left border accent or dot indicator
6. **Variants:** Sent row (shows "To: [therapist]" or "X of 5 responded"), Received row (shows "From: [therapist]")
7. **Interactions:** Click → navigates to Referral Detail. Entire row is clickable.
8. **Responsive:** Mobile — content stacks: status + specialty on line 1, direction + therapist + time on line 2. Desktop — single row with columns.

### Status Badge

1. **Purpose:** Quickly communicate referral status with color + text
2. **Content:** Status text: "Sent" "Responded" "Connected" "Closed"
3. **Dimensions:** Inline pill. Padding: `--space-micro` (4px) vertical, `--space-xs` (8px) horizontal. Height ~24px.
4. **Typography:** Caption (12px/500), uppercase tracking 0.03em
5. **States:** Static per status — color communicates state
6. **Variants:**
   - Sent: `--fg-tertiary` text, `--bg-inset` background (neutral)
   - Responded: `--semantic-info` text, light teal background (10% opacity)
   - Connected: `--semantic-success` text, light sage background (10% opacity)
   - Closed: `--fg-muted` text, `--bg-inset` background (very muted)
   - Cancelled: `--err` text, `--err-l` background (warm red tint) — referral was abandoned
7. **Interactions:** None — display only
8. **Responsive:** Unchanged — always compact

### Empty State

1. **Purpose:** Guide first-time users to create their first referral
2. **Content:** Heading: "No referrals yet". Body: "When you create a referral, the system will match your client's needs with therapists in the network." CTA: "Create your first referral"
3. **Dimensions:** Centered within container. Max-width 400px. Padding: `--space-2xl` (48px) vertical.
4. **Typography:** Heading — Heading 2 (20px/600). Body — Body (15px/400), `--fg-secondary`. CTA — Label (13px/500) in brand button.
5. **States:** Static
6. **Variants:** None
7. **Interactions:** CTA navigates to Create Referral
8. **Responsive:** Unchanged — already narrow and centered

---

## Interaction Patterns

**Primary interaction:** Click referral row to view detail. Click "New Referral" to create.

**Keyboard navigation:**

- Tab order: nav links → "New Referral" button → direction tabs → referral rows → pagination (if exists)
- Each referral row is focusable (role="link" or anchor)
- Enter on row → navigates to detail
- Arrow keys within tab group for direction tabs

**Micro-interactions:**

- Row hover: background shift to `--bg-surface-1`, 150ms ease-out
- Tab switch: underline slides to active tab, 150ms ease-out
- New referral appears: subtle fade-in from top of list

**Form behavior:** N/A — this is a list view

---

## Accessibility Notes

- **Landmark regions:** `<nav>` for top navigation, `<main>` for content area, tab list uses `role="tablist"`
- **Heading hierarchy:** h1 "Your Referrals"
- **ARIA requirements:** Direction tabs use `role="tablist"` / `role="tab"` / `role="tabpanel"`. Referral rows use `role="link"` with descriptive `aria-label` ("Referral for anxiety and EMDR, sent 3 days ago, status: responded")
- **Color independence:** Status badges have text labels in addition to color. Direction (sent/received) is stated in text.
- **Focus management:** After creating a referral and returning here, focus goes to the new referral row. After deleting/closing, focus goes to the next row.

---

## Open Questions

None — this screen is well-defined by the flows and brief.
