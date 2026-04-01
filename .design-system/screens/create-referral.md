# Screen Specification: Create Referral

---

## Screen Identity

**Screen name:** Create Referral

**Purpose:** The therapist describes what their client needs so the system can match the top 5 therapists.

**Who:** Solo therapist after a session, in a reflective state. They know what their client needs — a specific specialty, approach, insurance compatibility.

**Task:** Fill in client needs (without PHI), submit, and trust the system to find good matches.

**Feel:** Focused and guided — like filling in a thoughtful consultation form, not a data entry screen. Each field has clear purpose. The form should feel brief, not burdensome.

---

## Visual Hierarchy

### Tool 1: Size
- **Largest:** Page title "Create Referral" — Display level
- **Medium:** Form field labels and inputs — Label and Body levels
- **Smallest:** Helper text, PHI reminder — Caption level

### Tool 2: Weight
- **Bold:** Page title, section headings ("What does your client need?")
- **Medium:** Field labels
- **Light:** Helper text, placeholder text

### Tool 3: Color
- **Brand accent:** Submit button ("Send Referral"), required field indicators
- **Semantic warning:** PHI reminder notice (terracotta tint)
- **Muted:** Helper text, optional field indicators

### Tool 4: Spacing
- **Generous:** Between form sections, above/below the submit button
- **Standard:** Between form fields within a section
- **Compact:** Between label and input

### Tool 5: Position
- **Top:** Page title + brief instruction
- **Middle:** Form fields in logical order (most important first)
- **Bottom:** PHI reminder + submit button

### Tool 6: Contrast
- **Highest:** Submit button (brand background + white text)
- **High:** Form field labels
- **Medium:** Input text
- **Low:** Helper text, placeholder text

### 4 Hierarchy Levels

| Level | Role | Treatment | Elements |
|-------|------|-----------|----------|
| **Primary** | Submit the referral | Brand-colored submit button, prominent at bottom | "Send Referral" button |
| **Secondary** | Fill in the matching criteria | Clear labels, visible inputs | Form fields — specialty, insurance, location, approach, urgency |
| **Tertiary** | Guidance and context | Muted, smaller text | Helper text, PHI reminder, optional indicators |
| **Background** | Structure | Quiet | Top nav, form container border, cancel link |

**Squint test:** The submit button should be the only brand-colored element. Form fields should read as a clean vertical stack. Nothing competes with the CTA.

---

## Content Priority

| Priority | Content Element | Why This Position |
|----------|----------------|-------------------|
| 1 | Specialty needed (field) | Primary matching dimension — the most critical input |
| 2 | Insurance accepted (field) | Second most common matching filter for clients |
| 3 | Location preference (field) | Geographic constraint |
| 4 | Therapeutic approach (field) | Improves match quality, secondary |
| 5 | Urgency (field) | Affects how matches are prioritized |
| 6 | Context notes (field) | Optional — additional info for matched therapists |
| 7 | PHI reminder | Safety guardrail — visible but not dominating |
| 8 | "Send Referral" button | Action comes after all fields are considered |
| 9 | Cancel link | Escape hatch |

---

## Layout Structure

**Grid:** Centered single-column form, 720px max-width

```
┌─────────────────────────────────────────────────┐
│ [Top Navigation Bar]                              │
├─────────────────────────────────────────────────┤
│                                                   │
│          Create Referral                          │
│          Describe what your client needs.         │
│          The system will match the top 5          │
│          therapists and notify them by email.     │
│                                                   │
│          ┌─────────────────────────────┐          │
│          │ Specialty needed *          │          │
│          │ [multi-select chips]        │          │
│          └─────────────────────────────┘          │
│                                                   │
│          ┌─────────────────────────────┐          │
│          │ Client's insurance *        │          │
│          │ [select dropdown]           │          │
│          └─────────────────────────────┘          │
│                                                   │
│          ┌─────────────────────────────┐          │
│          │ Location preference *       │          │
│          │ [text input + virtual toggle]│          │
│          └─────────────────────────────┘          │
│                                                   │
│          ┌─────────────────────────────┐          │
│          │ Therapeutic approach        │          │
│          │ [multi-select chips]        │          │
│          └─────────────────────────────┘          │
│                                                   │
│          ┌─────────────────────────────┐          │
│          │ Urgency                     │          │
│          │ [○ Routine  ○ Soon  ○ Urgent]│          │
│          └─────────────────────────────┘          │
│                                                   │
│          ┌─────────────────────────────┐          │
│          │ Context for matched         │          │
│          │ therapists (optional)       │          │
│          │ [textarea]                  │          │
│          │                             │          │
│          └─────────────────────────────┘          │
│                                                   │
│          ┌─ PHI Reminder ──────────────┐          │
│          │ ⚠ Do not include client     │          │
│          │ names, DOB, or identifying  │          │
│          │ health details.             │          │
│          └─────────────────────────────┘          │
│                                                   │
│          [Cancel]        [Send Referral]           │
│                                                   │
└─────────────────────────────────────────────────┘
```

**Responsive behavior:**
- **Mobile (0–639px):** Full-width form with 16px padding. Fields stack naturally. Submit button full-width. Cancel becomes a text link above submit.
- **Tablet (640–1023px):** Form centered, slight side margins. Same single-column layout.
- **Desktop (1024px+):** 720px max-width centered. Generous whitespace on sides.

---

## States

### Loading State
- **Duration expectation:** Instant — this is a form, no data to load
- **Visual treatment:** None needed — form renders immediately
- **Content available during load:** Everything — static form

### Empty State (Default)
- **This IS the default state:** Empty form ready to fill
- **Pre-filled elements:** None
- **Placeholder text:** Inputs have light placeholder guidance ("e.g., Anxiety, Trauma, PTSD")

### Populated State (Filling)
- **Inline validation:** Required fields validate on blur. Valid fields get subtle checkmark. Invalid fields get `--semantic-error` border + message.
- **Multi-select chips:** Selected specialties/approaches appear as removable chips below the input
- **Character count:** Context notes shows character count when approaching limit (500 chars)

### Submitting State
- **Visual treatment:** Submit button shows loading spinner, text changes to "Matching…", form fields disable
- **Duration expectation:** 1–3 seconds (matching algorithm + email sending)
- **User feedback:** Button stays in loading state until complete

### Success State
- **Behavior:** Redirect to Referral Tracker with success toast: "Referral sent! 5 therapists have been notified."
- **New referral:** Appears at top of tracker list with "Sent" status

### No Matches State
- **Message:** "No therapists match these criteria. Try broadening the specialty or location."
- **Placement:** Inline, replaces the submit button area temporarily
- **Recovery:** Form stays filled — user adjusts fields and resubmits
- **Visual:** `--semantic-warning` border on message, `--semantic-warning` tint background

### Validation Error State
- **Inline errors:** Below each invalid field in `--semantic-error`, Body small (14px)
- **Scroll behavior:** On submit attempt, scroll to first invalid field
- **Error messages:** Specific — "Select at least one specialty" not "Required field"
- **Focus:** First invalid field receives focus

---

## Component Inventory

| # | Component | Purpose | System.md Pattern? |
|---|-----------|---------|-------------------|
| 1 | Form Header | Title + instruction text | New |
| 2 | Multi-Select Field | Specialty and approach selection with chips | New |
| 3 | Select Dropdown | Insurance selection | New |
| 4 | Text Input with Toggle | Location + "Virtual OK" toggle | New |
| 5 | Radio Group | Urgency selection | New |
| 6 | Textarea | Context notes with character count | New |
| 7 | PHI Reminder Notice | Safety guardrail | New |
| 8 | Form Actions | Cancel + Submit buttons | New |

### Form Header

1. **Purpose:** Orient the therapist — what this form does and what happens after submission
2. **Content:** Title: "Create Referral". Subtitle: "Describe what your client needs. The system will match the top 5 therapists and notify them by email."
3. **Dimensions:** Full form width. Margin-bottom: `--space-xl` (32px)
4. **Typography:** Title — Display (30px/700). Subtitle — Body (15px/400), `--fg-secondary`
5. **States:** Static
6. **Variants:** None
7. **Interactions:** None
8. **Responsive:** Unchanged — text reflows naturally

### Multi-Select Field (Specialty / Approach)

1. **Purpose:** Select one or more specialties or therapeutic approaches from a predefined list
2. **Content:** Label, searchable dropdown with checkboxes, selected items as removable chips
3. **Dimensions:** Full form width. Input height: 40px. Padding: `--space-sm` (12px). Dropdown max-height: 240px with scroll. Chips: 28px height, `--space-micro` (4px) gap.
4. **Typography:** Label — Label (13px/500). Input/dropdown items — Body (15px/400). Chips — Caption (12px/500). Helper — Body small (14px/400), `--fg-tertiary`
5. **States:**
   - Default: `--bg-inset` background, `--border-default` border
   - Focus: `--border-focus` ring (2px), dropdown opens
   - Filled: chips visible below input
   - Error: `--semantic-error` border, error message below
   - Disabled: `--bg-inset` muted, `--fg-muted` text
6. **Variants:** Specialty field (required, pre-populated list of ~20 specialties). Approach field (optional, shorter list of ~10 approaches).
7. **Interactions:** Click opens dropdown. Type to filter. Click item toggles selection. Click chip "×" removes. Keyboard: arrow keys in dropdown, Enter to select, Escape to close.
8. **Responsive:** Dropdown overlays content on mobile. Chips wrap to multiple lines.

### Select Dropdown (Insurance)

1. **Purpose:** Select the client's insurance plan
2. **Content:** Label "Client's insurance", searchable single-select dropdown
3. **Dimensions:** Full form width. Trigger height: 40px. Dropdown max-height: 240px.
4. **Typography:** Label — Label (13px/500). Selected value — Body (15px/400). Dropdown items — Body (15px/400).
5. **States:**
   - Default: `--bg-inset`, `--border-default`, placeholder "Select insurance plan"
   - Open: dropdown visible, elevated (shadow level 2)
   - Selected: selected value displayed in trigger
   - Error: `--semantic-error` border + message
6. **Variants:** None — single-select only
7. **Interactions:** Click opens dropdown. Type to filter/search. Click item selects. Keyboard: arrow keys, Enter, Escape.
8. **Responsive:** Dropdown full-width on mobile.

### Text Input with Toggle (Location)

1. **Purpose:** Specify geographic preference for the referral match, with option for virtual/telehealth
2. **Content:** Label "Location preference", text input for city/area, "Virtual OK" toggle
3. **Dimensions:** Full form width. Input height: 40px. Toggle inline after input or on next line.
4. **Typography:** Label — Label (13px/500). Input — Body (15px/400). Toggle label — Body small (14px/400).
5. **States:**
   - Default: `--bg-inset`, `--border-default`
   - Focus: `--border-focus` ring
   - Filled: text visible
   - Virtual toggle on: toggle shows `--brand-primary`, location input becomes optional with helper "Virtual sessions — location is flexible"
   - Error: `--semantic-error` border + message
6. **Variants:** None
7. **Interactions:** Type location. Toggle "Virtual OK" — when on, location input becomes optional. Keyboard: tab between input and toggle, space to toggle.
8. **Responsive:** Toggle moves below input on mobile.

### Radio Group (Urgency)

1. **Purpose:** Indicate how soon the client needs to connect with a new therapist
2. **Content:** Label "Urgency", three radio options: Routine, Soon, Urgent
3. **Dimensions:** Full form width. Radio items arranged horizontally with `--space-md` (16px) gap. Each radio: 20px indicator + label.
4. **Typography:** Label — Label (13px/500). Option labels — Body (15px/400). Helper text — Body small (14px/400), `--fg-tertiary` ("Routine: within a few weeks" etc.)
5. **States:**
   - Default: "Routine" pre-selected (most common)
   - Hover: radio circle shows `--border-strong`
   - Selected: `--brand-primary` fill
   - Focus: `--border-focus` ring around radio
6. **Variants:** None
7. **Interactions:** Click selects. Keyboard: arrow keys between options.
8. **Responsive:** Stack vertically on mobile with description text visible for each option.

### Textarea (Context Notes)

1. **Purpose:** Optional free-text context for matched therapists — NOT for PHI
2. **Content:** Label "Context for matched therapists (optional)", textarea, character counter
3. **Dimensions:** Full form width. Min-height: 100px. Max: 200px (resizable). Padding: `--space-sm` (12px).
4. **Typography:** Label — Label (13px/500). Input — Body (15px/400). Character count — Caption (12px/400), `--fg-tertiary`. "Optional" — Caption, `--fg-tertiary`.
5. **States:**
   - Default: `--bg-inset`, `--border-default`, placeholder "e.g., Client is looking for evening availability, prefers female therapist"
   - Focus: `--border-focus` ring
   - Approaching limit: character count turns `--semantic-warning` at 80%+
   - Over limit: `--semantic-error` border, character count in error color
6. **Variants:** None
7. **Interactions:** Type freely. Character counter updates in real time.
8. **Responsive:** Same — textarea reflows naturally.

### PHI Reminder Notice

1. **Purpose:** Safety guardrail — remind therapists not to include identifying patient info
2. **Content:** "Do not include client names, dates of birth, or identifying health details in this form."
3. **Dimensions:** Full form width. Padding: `--space-sm` (12px). Border-left: 3px solid `--semantic-warning`. Background: `--semantic-warning` at 6% opacity. Border-radius: `--radius-sm` (6px).
4. **Typography:** Body small (14px/400), `--fg-secondary`
5. **States:** Static — always visible above the context notes field
6. **Variants:** None
7. **Interactions:** None — display only
8. **Responsive:** Unchanged

### Form Actions

1. **Purpose:** Submit or cancel the referral form
2. **Content:** "Cancel" text link + "Send Referral" primary button
3. **Dimensions:** Full form width, right-aligned on desktop. Button: height 40px, padding `--space-sm` (12px) vertical, `--space-lg` (24px) horizontal. Cancel: text link, no padding.
4. **Typography:** Button — Label (13px/600). Cancel — Label (13px/500), `--fg-secondary`.
5. **States:**
   - Default: Button `--brand-primary` bg, `--brand-on` text. Cancel `--fg-secondary`.
   - Hover: Button `--brand-hover` bg. Cancel `--fg-primary`.
   - Loading: Button shows spinner, text "Matching…", disabled
   - Disabled: Button `--fg-muted` bg when form invalid
   - Focus: `--border-focus` ring on both
6. **Variants:** None
7. **Interactions:** Cancel → confirm if form has data, then navigate to Tracker. Submit → validate, match, send.
8. **Responsive:** Mobile — button full-width, cancel as text link above.

---

## Interaction Patterns

**Primary interaction:** Fill form fields, submit.

**Keyboard navigation:**
- Tab order follows visual order: specialty → insurance → location → virtual toggle → urgency radios → context notes → cancel → submit
- All form controls accessible via keyboard
- Submit via Enter when focused on submit button (not from textareas)

**Micro-interactions:**
- Field focus: border color transitions 150ms ease-out
- Chip add/remove: subtle scale animation 150ms
- Validation error appear: fade in 150ms
- Submit loading: spinner replaces button text, 250ms transition

**Form behavior:**
- Validation on blur for required fields
- Validation on submit for all fields
- Scroll to first error on submit failure
- Confirmation dialog on cancel if form has data ("Discard this referral?")

---

## Accessibility Notes

- **Landmark regions:** `<main>` for form content, `<form>` with accessible name "Create referral"
- **Heading hierarchy:** h1 "Create Referral"
- **ARIA requirements:** Multi-select uses `role="listbox"` with `aria-multiselectable="true"`. Radio group uses `role="radiogroup"`. Required fields use `aria-required="true"`. Error messages linked via `aria-describedby`. PHI reminder linked to context textarea via `aria-describedby`.
- **Color independence:** Required indicator uses "*" text + color. Error fields have text messages, not just red borders. Urgency selection relies on text labels, not color.
- **Focus management:** On submit error, focus moves to first invalid field. On success, focus moves to the success toast or new referral row in tracker.

---

## Open Questions

None.
