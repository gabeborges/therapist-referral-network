# Screen Specification: Therapist Profile

---

## Screen Identity

**Screen name:** Therapist Profile

**Purpose:** View and edit the therapist's own profile — the information that drives match quality.

**Who:** Solo therapist maintaining their professional information. They update this when their circumstances change (new specialty, new insurance, going on leave).

**Task:** Review current profile info, edit fields as needed, toggle availability.

**Feel:** Organized and self-explanatory — like a well-structured professional profile card. Each field should make clear WHY it matters for matching.

---

## Visual Hierarchy

### Tool 1: Size
- **Largest:** Therapist name + credentials — Heading 1 level
- **Medium:** Section headings, field values — Body level
- **Smallest:** Helper text explaining matching relevance — Caption level

### Tool 2: Weight
- **Bold:** Name, section headings
- **Medium:** Field labels, availability toggle
- **Light:** Field values in view mode, helper text

### Tool 3: Color
- **Brand accent:** "Edit" button, availability toggle when on
- **Semantic success:** "Accepting referrals" status
- **Semantic warning:** "Not accepting referrals" status
- **Muted:** Helper text, completion indicator

### Tool 4: Spacing
- **Generous:** Between profile sections
- **Standard:** Between fields within sections
- **Compact:** Between label and value in view mode

### Tool 5: Position
- **Top:** Name, credentials, availability toggle (most actionable)
- **Middle:** Matching-critical fields (specialties, insurance, location)
- **Bottom:** Optional fields (bio, practice name)

### Tool 6: Contrast
- **Highest:** Availability toggle, name
- **Medium:** Field values, section headings
- **Low:** Labels, helper text

### 4 Hierarchy Levels

| Level | Role | Treatment | Elements |
|-------|------|-----------|----------|
| **Primary** | Availability status — the most actionable element | Prominent toggle, semantic color | Availability toggle + status text |
| **Secondary** | Matching-critical profile fields | Clear values, organized sections | Specialties, insurance, location, approaches |
| **Tertiary** | Supporting profile info | Smaller, less prominent | Bio, practice name, credentials, completion indicator |
| **Background** | Structure and actions | Quiet | Edit button, section dividers, save/cancel |

---

## Content Priority

| Priority | Content Element | Why This Position |
|----------|----------------|-------------------|
| 1 | Availability toggle | Most frequently changed, directly affects matching |
| 2 | Specialties | Primary matching dimension |
| 3 | Insurance accepted | Primary matching dimension |
| 4 | Location | Primary matching dimension |
| 5 | Therapeutic approaches | Secondary matching dimension |
| 6 | Name + credentials | Professional identity |
| 7 | Profile completeness | Motivates filling optional fields |
| 8 | Bio / About | Optional context for referring therapists |
| 9 | Practice name | Optional context |
| 10 | Contact email | Rarely changed |

---

## Layout Structure

**Grid:** Centered single-column, 720px max-width

```
┌─────────────────────────────────────────────────┐
│ [Top Navigation Bar]                              │
├─────────────────────────────────────────────────┤
│                                                   │
│   Your Profile                          [Edit]    │
│                                                   │
│   ┌─────────────────────────────────────────┐     │
│   │  Dr. Sarah Chen, LCSW                   │     │
│   │  sarah.chen@practice.com                │     │
│   │                                         │     │
│   │  [● Accepting referrals        ◉ ○]     │     │  ← Availability
│   └─────────────────────────────────────────┘     │
│                                                   │
│   Profile completeness: ████████░░ 80%            │  ← Completion bar
│   Add a bio to reach 100%                         │
│                                                   │
│   ─────────────────────────────────────────────   │
│                                                   │
│   Matching Information                            │
│                                                   │
│   Specialties                                     │
│   [Anxiety] [Trauma] [EMDR] [PTSD]                │  ← Chips
│                                                   │
│   Insurance accepted                              │
│   [Blue Cross] [Sun Life] [Manulife]              │  ← Chips
│                                                   │
│   Location                                        │
│   Toronto, ON · Virtual available                 │
│                                                   │
│   Therapeutic approaches                          │
│   [CBT] [EMDR] [Psychodynamic]                    │  ← Chips
│                                                   │
│   ─────────────────────────────────────────────   │
│                                                   │
│   About                                           │
│                                                   │
│   Practice name                                   │
│   Calm Horizons Therapy                           │
│                                                   │
│   Bio                                             │
│   Not yet added                                   │
│                                                   │
└─────────────────────────────────────────────────┘
```

**Responsive behavior:**
- **Mobile (0–639px):** Full-width. Availability toggle prominent at top. Chips wrap naturally.
- **Tablet/Desktop:** 720px centered. Same layout.

---

## States

### View Mode (Default)
- All fields displayed as read-only text and chips
- "Edit" button in page header
- Availability toggle is ALWAYS interactive (even in view mode — it's a quick action)

### Edit Mode
- Fields become editable inputs (same components as Create Referral / Onboarding)
- "Edit" button replaced by "Save" + "Cancel" buttons
- Availability toggle remains the same
- Unsaved changes tracked — cancel prompts confirmation if changes exist

### Loading State
- **Duration:** < 500ms
- **Visual:** Skeleton matching profile layout — name block, toggle, field blocks
- **Immediate:** Top nav renders immediately

### Saving State
- **Visual:** "Save" button shows spinner, text "Saving…", fields remain visible but disabled
- **Duration:** < 1 second
- **Success:** Toast "Profile updated" + return to view mode
- **Error:** Toast "Couldn't save. Try again." + stay in edit mode with data preserved

### Error State
- **Types:** Network failure loading profile, save failure
- **Load error:** "Couldn't load your profile. Try again." + retry button
- **Save error:** Inline error preserving form state

---

## Component Inventory

| # | Component | Purpose | System.md Pattern? |
|---|-----------|---------|-------------------|
| 1 | Profile Header | Name, credentials, email, edit action | New |
| 2 | Availability Toggle | Quick toggle for accepting/not accepting referrals | New |
| 3 | Completeness Indicator | Motivate profile completion | New |
| 4 | Field Display (View) | Read-only label-value pair | New |
| 5 | Chip List (View) | Display multi-value fields as read-only chips | Reuses chip style |
| 6 | Section Heading | Divide profile into logical groups | New |
| 7 | Form Fields (Edit) | Editable versions of all profile fields | Reuses from Create Referral |

### Availability Toggle

1. **Purpose:** Quickly toggle whether this therapist appears in match results — the most frequently changed setting
2. **Content:** Label "Accepting referrals" / "Not accepting referrals" + toggle switch
3. **Dimensions:** Toggle: 48px wide, 24px height, 24px knob. Container: full width, padding `--space-md` (16px), background `--bg-surface-1`, radius `--radius-md` (10px).
4. **Typography:** Status label — Body (15px/500). Helper — Body small (14px/400), `--fg-tertiary` ("When off, you won't appear in new referral matches")
5. **States:**
   - On: `--semantic-success` toggle background, "Accepting referrals" text in `--semantic-success`
   - Off: `--fg-muted` toggle background, "Not accepting referrals" in `--semantic-warning`
   - Saving: brief spinner on toggle after change
   - Focus: `--border-focus` ring around toggle
6. **Variants:** None
7. **Interactions:** Click/tap toggles immediately. Saves automatically (no need to enter edit mode). Visual feedback instant, server save in background.
8. **Responsive:** Unchanged — compact enough for mobile

### Completeness Indicator

1. **Purpose:** Motivate therapists to fill optional fields, improving match quality
2. **Content:** Progress bar + percentage + hint text ("Add a bio to reach 100%")
3. **Dimensions:** Full container width. Bar height: 6px. Radius: `--radius-full`. Margin: `--space-md` (16px) vertical.
4. **Typography:** Percentage — Body small (14px/600). Hint — Caption (12px/400), `--fg-tertiary`
5. **States:**
   - < 100%: bar partially filled in `--brand-primary`, hint shows next missing field
   - 100%: bar full in `--semantic-success`, hint "Your profile is complete!"
6. **Variants:** None
7. **Interactions:** Hint text field name is a link — clicking jumps to that field in edit mode
8. **Responsive:** Unchanged

### Field Display (View Mode)

1. **Purpose:** Show a single profile field as a read-only label-value pair
2. **Content:** Label (field name) + value (field content)
3. **Dimensions:** Full container width. Label margin-bottom: `--space-micro` (4px). Gap between fields: `--space-md` (16px).
4. **Typography:** Label — Label (13px/500), `--fg-tertiary`. Value — Body (15px/400), `--fg-primary`. Empty value — Body (15px/400), `--fg-muted`, italic "Not yet added"
5. **States:** Static in view mode
6. **Variants:** Single-value (text), multi-value (chip list), toggle (availability)
7. **Interactions:** None in view mode
8. **Responsive:** Unchanged — single column already

---

## Interaction Patterns

**Primary interaction:** Toggle availability (quick action). Edit profile (enter edit mode, modify, save).

**Keyboard navigation:**
- Tab order: availability toggle → edit button → (in edit mode: form fields → save → cancel)
- Toggle activates with Space
- Edit button activates with Enter

**Micro-interactions:**
- Availability toggle: knob slides with 150ms ease-out, color transition 150ms
- Edit mode transition: fields transform from display to inputs with 250ms fade
- Save: spinner appears 150ms, success toast fades in

**Form behavior (edit mode):**
- Validation on blur for required fields
- Save validates all fields
- Cancel with unsaved changes: "Discard changes?" confirmation

---

## Accessibility Notes

- **Landmark regions:** `<main>` for profile content
- **Heading hierarchy:** h1 "Your Profile". h2 = section headings ("Matching Information", "About")
- **ARIA requirements:** Availability toggle uses `role="switch"` with `aria-checked`. Completeness bar uses `role="progressbar"` with `aria-valuenow`. Edit/view mode announced via `aria-live` region.
- **Color independence:** Availability status has text label, not just toggle color. Completeness uses percentage text + bar.
- **Focus management:** Entering edit mode: focus moves to first editable field. Saving: focus moves to success message or back to edit button.

---

## Open Questions

None.
