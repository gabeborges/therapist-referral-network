# Screen Specification: Onboarding

---

## Screen Identity

**Screen name:** Onboarding

**Purpose:** Walk a new therapist through a 4-step wizard to create their profile so the system can include them in referral matching.

**Who:** A licensed therapist (Canada or US) who just created an account via colleague invitation. Comfortable with web apps, not tech-savvy. Sitting at their desk between sessions or after hours. Motivated — a peer sent them here.

**Task:** Select their country, fill in matching-critical profile fields across 3 form steps, complete their profile.

**Feel:** Welcoming and purposeful — like a friendly colleague walking them through setup, not a bureaucratic form. Spacious and calm, matching the therapist's office aesthetic from system.md. Each step is focused and uncluttered.

---

## Visual Hierarchy

### Tool 1: Size

- **Largest:** Welcome heading (Display level) and country selection buttons (tall, wide, prominent)
- **Medium:** Step headings (Heading 2), form field labels (Label), "How it works" step titles
- **Smallest:** Helper text, wizard step labels, metadata (Caption)

### Tool 2: Weight

- **Bold:** Welcome heading (700), country button labels (600), step headings (600)
- **Medium:** Field labels (500), "How it works" step titles (500), nav button labels (600)
- **Light:** Description text (400), helper text (400)

### Tool 3: Color

- **Brand accent:** Wizard progress completed steps, "Next"/"Complete" CTA, "How it works" step numbers, selected country button border
- **Primary foreground:** Welcome heading, step headings, field labels
- **Muted:** Helper text, unselected country button text, inactive wizard steps

### Tool 4: Spacing

- **Generous:** Between welcome header and "How it works" (`--space-lg`), between "How it works" and wizard card (`--space-lg`), between form sections within a step (`--space-lg`)
- **Standard:** Between form fields (`--space-md`), between wizard progress and form content (`--space-lg`)
- **Compact:** Between label and input (`--space-micro`), between input and helper text (`--space-micro`)

### Tool 5: Position

- **Top:** Logo (centered), Welcome heading + subtitle
- **Upper middle:** "How it works" section (always visible)
- **Center:** Wizard card — progress indicator at top, step content below
- **Bottom of wizard card:** Back/Next navigation buttons

### Tool 6: Contrast

- **Highest:** Country selection buttons (large, bordered, interactive), "Next"/"Complete" CTA (brand bg)
- **Medium:** Welcome heading, form field inputs (inset bg), step headings
- **Low:** Helper text, wizard step labels on mobile, "How it works" description text

### 4 Hierarchy Levels

| Level          | Role                                   | Treatment                                        | Elements                                                                 |
| -------------- | -------------------------------------- | ------------------------------------------------ | ------------------------------------------------------------------------ |
| **Primary**    | The current step's interactive content | Largest, most prominent in the wizard card       | Country buttons (step 1), form fields (steps 2-4), "Next"/"Complete" CTA |
| **Secondary**  | Wizard navigation and step context     | Noticeable but doesn't compete with form content | Wizard progress bar, step headings, Back button                          |
| **Tertiary**   | Orientation and motivation             | Present but quiet — read once, then background   | Welcome heading, "How it works" section, helper text                     |
| **Background** | Page structure                         | Invisible until needed                           | Logo, page container, card border/shadow, form field borders             |

### The Squint Test

Blur: the country buttons (step 1) or the form fields (steps 2-4) dominate the center of the card. The brand-colored CTA anchors the bottom. The wizard progress bar is a thin, quiet line near the top of the card. The welcome text above is lighter, recedes. Hierarchy holds.

---

## Content Priority

| Priority | Content Element                                              | Why This Position                                             |
| -------- | ------------------------------------------------------------ | ------------------------------------------------------------- |
| 1        | Current step's form content (country buttons or form fields) | This is what the user is actively doing                       |
| 2        | "Next" / "Complete" CTA                                      | Advances the task — must be immediately findable              |
| 3        | Wizard progress indicator                                    | Orients user within the flow — "where am I, how much is left" |
| 4        | Step heading                                                 | Labels the current step's purpose                             |
| 5        | Welcome heading + subtitle                                   | Read once on arrival, then fades to background                |
| 6        | "How it works" section                                       | Motivation — read before starting, then background            |
| 7        | Helper text on form fields                                   | Scanned as needed, not actively read                          |

---

## Layout Structure

**Grid:** Centered single-column, 560px max-width (from existing spec — intimate, focused)

```
┌───────────────────────────────────────────────────┐
│                    [App Logo]                       │  ← Centered, minimal
├───────────────────────────────────────────────────┤
│                                                     │
│  Welcome to Therapist Referral Network              │  ← Heading 1 / 600
│  Complete your profile to start giving and          │  ← Body small / 400, fg-secondary
│  receiving referrals from trusted colleagues.       │
│                                                     │
├───────────────────────────────────────────────────┤
│                                                     │
│  HOW IT WORKS                                       │  ← Caption / uppercase / fg-tertiary
│                                                     │
│  ①  Set up your profile                            │  ← Brand circle + Body / 500
│      Add your specialties, insurance, and           │  ← Body small / fg-secondary
│      location so colleagues can find you.           │
│                                                     │
│  ②  Receive matched referrals                      │
│      Matched based on clinical fit.                 │
│                                                     │
│  ③  Connect with clients                           │
│      Accept referrals and coordinate care.          │
│                                                     │
├───────────────────────────────────────────────────┤
│                                                     │
│  ┌─ Wizard Card (surface-1, border, shadow-1) ──┐  │
│  │                                               │  │
│  │  ①─────②─────③─────④                         │  │  ← WizardProgress (4 steps)
│  │  Country Bio  Communities Services            │  │
│  │                                               │  │
│  │  ┌───────────────────────────────────────┐   │  │
│  │  │                                       │   │  │
│  │  │   [Current Step Content]              │   │  │  ← Step-specific content
│  │  │                                       │   │  │
│  │  └───────────────────────────────────────┘   │  │
│  │                                               │  │
│  │  ─────────────────────────────────────────   │  │  ← border-t (border-subtle)
│  │  [Back]                          [Next →]    │  │  ← Navigation
│  │                                               │  │
│  └───────────────────────────────────────────────┘  │
│                                                     │
└───────────────────────────────────────────────────┘
```

### Step 1: Country Selection (inside wizard card)

```
│  Where do you practice?                            │  ← Heading 2 / 600
│  We're currently available in Canada                │  ← Body small / fg-secondary
│  and the United States.                             │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │                                             │   │
│  │        🍁  Canada                           │   │  ← 72px tall, full width
│  │                                             │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │  ← --space-sm (12px) gap
│  ┌─────────────────────────────────────────────┐   │
│  │                                             │   │
│  │        🇺🇸  United States                   │   │  ← 72px tall, full width
│  │                                             │   │
│  └─────────────────────────────────────────────┘   │
```

### Steps 2-4: Form Steps (inside wizard card)

Same layout pattern — step heading at top, form fields below, back/next nav at bottom. Existing form field patterns from system.md preserved.

**Responsive behavior:**

- **Mobile (0–639px):** Full-width with 16px padding. Wizard card full-width. Country buttons full-width (already). Wizard step labels hidden — only step numbers visible.
- **Tablet (640–1023px):** 560px centered. 24px padding. Wizard step labels visible.
- **Desktop (1024px+):** Same as tablet. Generous side whitespace via auto margins.

---

## States

### Step 1: Country Selection

**Default (no selection):**

- Two large button-style options, neither selected
- "Next" button visible but disabled (50% opacity)
- Both buttons: `--bg-surface-1` background, `--border-default` border (1px)

**Canada selected:**

- Selected button: `--brand-primary` border (2px), faint teal background tint `rgba(42, 124, 124, 0.04)`, checkmark icon (16px, `--brand-primary`) right-aligned
- Unselected button: unchanged (default treatment)
- "Next" button: enabled, `--brand-primary` background

**US selected:**

- Selected button: same visual treatment as Canada (teal border, tint, checkmark)
- "Next" button hidden
- Waitlist message appears below the buttons:
  - Text: "We're launching in the United States soon. Join the waitlist to be notified."
  - CTA: "Join Waitlist" button (brand-colored, full-width, same position as where "Next" would be)
  - Clicking → redirect to `/onboarding/waitlist`

**Hover (country button):**

- Border shifts to `--border-strong`, background to `--bg-inset`
- Cursor pointer
- 150ms ease-out transition

**Focus (country button):**

- 2px `--border-focus` outline, 2px offset

### Step 2: Bio

- Form fields: imageUrl, firstName, middleName, lastName, pronouns, displayName, contactEmail, city, province
- Province select is filtered by country from step 1 (Canadian provinces or US states)
- Existing field patterns from system.md

### Step 3: Communities Served

- Checkbox/chip groups: specialties, participants, ages, modalities
- All use existing CheckboxGroup component patterns

### Step 4: Your Services

- Rate inputs: rateIndividual, rateGroup, rateFamily, rateCouples
- Toggles/checkboxes: acceptsInsurance, reducedFees, proBono, freeConsultation, acceptingClients
- "Complete" button replaces "Next"

### Validation Error (any form step)

- Per-step validation triggered on "Next"/"Complete" click
- Inline errors: icon + message below each invalid field in `--semantic-error`
- Scroll to first invalid field, focus it
- Server error: alert banner at top of wizard card with `role="alert"` (existing pattern)

### Submitting (Step 4)

- "Complete" button: text changes to "Creating profile...", disabled, spinner
- All form fields disabled during submission
- Duration: < 1 second

### Success

- Redirect to `/referrals` (Referral Tracker empty state)
- No success screen within onboarding

### Country Change Reset

- User on step 2/3/4 clicks a completed step 1 in wizard progress (or clicks Back repeatedly)
- Arrives at step 1, previously selected country is shown
- User clicks the OTHER country button
- **All form fields reset to defaults** — `form.reset()` clears steps 2-4
- If US selected: waitlist message appears, form data already cleared
- If Canada selected: user proceeds to step 2 with clean form, province options match new country

### Returning Incomplete User

- Signed up but didn't finish → redirected to `/onboarding` on next login
- **Starts completely fresh** — no data restoration, no "welcome back" variant
- Same experience as first visit (simplicity over convenience)

---

## Component Inventory

| #   | Component         | Purpose                                              | System.md Pattern?                                              |
| --- | ----------------- | ---------------------------------------------------- | --------------------------------------------------------------- |
| 1   | Onboarding Header | Logo + welcome heading + subtitle                    | Existing — simplified (no "welcome back" variant)               |
| 2   | How It Works      | 3-step explainer with numbered brand circles         | Existing — visual refresh                                       |
| 3   | Wizard Card       | Container for progress + step content + nav          | Existing — `--bg-surface-1`, `--border-default`, shadow level 1 |
| 4   | WizardProgress    | 4-step progress bar with labels and connecting lines | Existing — updated from 3 to 4 steps                            |
| 5   | CountryButton     | Large button for country selection                   | **New**                                                         |
| 6   | WaitlistMessage   | Contextual message + CTA when US is selected         | **New**                                                         |
| 7   | Form Fields       | Text inputs, selects, checkbox groups                | Existing — reused from profile form                             |
| 8   | NavigationBar     | Back + Next/Complete buttons at bottom of wizard     | Existing                                                        |

### Onboarding Header

1. **Purpose:** Welcome the therapist, set expectations
2. **Content:** App logo (concentric circles SVG, 26px), heading, subtitle
3. **Dimensions:** Full container width. Logo margin-bottom: `--space-xs`. Heading margin-bottom: `--space-xs`. Section margin-bottom: `--space-lg`.
4. **Typography:**
   - Heading: Heading 1 (24px / 600 / -0.015em), `--fg-primary`
   - Subtitle: Body small (14px / 400), `--fg-secondary`
5. **States:** Static — single variant (no "welcome back")
6. **Variants:** None
7. **Interactions:** None
8. **Responsive:** Logo + text centered on all breakpoints. Text reflows.

### How It Works

1. **Purpose:** Orient the therapist before the wizard — explain the platform's 3-step value
2. **Content:** "HOW IT WORKS" label, three numbered steps each with title + description
3. **Dimensions:** Full container width. Surface card: `--bg-surface-1`, `--border-default`, shadow level 1, `--radius-md`. Internal padding: `--space-md`. Step vertical gap: `--space-md`. Section margin-bottom: `--space-lg`.
4. **Typography:**
   - Section label: Caption (12px / 400 / 0.06em uppercase), `--fg-tertiary`
   - Step number circle: 28px diameter, `--brand-primary` fill, white text (Label / 13px / 700)
   - Step title: Body (15px / 500), `--fg-primary`
   - Step description: Body small (14px / 400), `--fg-secondary`
5. **States:** Static — always visible, does not collapse/hide when wizard starts
6. **Variants:** None
7. **Interactions:** None
8. **Responsive:** Steps always stack vertically. Padding reduces to `--space-sm` on mobile.

### WizardProgress (4 steps)

1. **Purpose:** Show position in the 4-step flow, allow jumping back to completed steps
2. **Content:** 4 step circles (numbered) connected by horizontal lines, with text labels
3. **Dimensions:** Full wizard card width. Circle: 28px diameter. Connecting line: 1px height, flex-1 width. Margin-bottom: `--space-lg`.
4. **Typography:**
   - Step number: Caption (12px / 600), centered in circle
   - Step label: Caption (12px / 400), `--fg-secondary` — hidden below 640px
5. **States:**
   - **Completed:** Circle `--brand-primary` fill, white checkmark glyph. Label `--brand-primary`. Connecting line `--brand-primary`. Clickable, pointer cursor, hover: underline label.
   - **Current:** Circle `--fg-primary` fill, white number. Label `--fg-primary`. Not clickable.
   - **Upcoming:** Circle transparent with `--border-default` border, `--fg-muted` number. Label `--fg-muted`. Not clickable.
6. **Variants:** Step labels: "Country", "Bio", "Communities", "Services"
7. **Interactions:** Click completed step → navigate to that step. Keyboard: completed steps in tab order. Focus: `--border-focus` ring on circle.
8. **Responsive:** Labels hidden on mobile (< 640px), only numbered circles + lines visible. Circle size stays 28px.

### CountryButton

1. **Purpose:** Large, prominent target for country selection — replaces the old dropdown. This is the first meaningful interaction in the app.
2. **Content:** Country flag (emoji, 24px) + country name text
3. **Dimensions:** Full wizard content width. Height: 72px. Padding: 0 `--space-md`. Border-radius: `--radius-md` (10px). Gap between the two buttons: `--space-sm` (12px).
4. **Typography:** Country name: Heading 3 (16px / 600 / -0.005em), `--fg-primary`. Flag: 24px, left of text with `--space-sm` gap.
5. **States:**
   - **Default:** `--bg-surface-1` background, `--border-default` border (1px), `--fg-primary` text
   - **Hover:** `--bg-inset` background, `--border-strong` border, pointer cursor. 150ms ease-out.
   - **Focus:** 2px `--border-focus` outline, 2px offset
   - **Selected:** 2px `--brand-primary` border, `rgba(42, 124, 124, 0.04)` background tint. 16px checkmark icon right-aligned in `--brand-primary`. Text unchanged.
6. **Variants:** Canada (🍁) and United States (🇺🇸) — identical structure, different content
7. **Interactions:** Click/Space/Enter → select. Arrow Up/Down to switch (radio group pattern). Selecting deselects the other.
8. **Responsive:** Full-width, 72px height on all breakpoints.

### WaitlistMessage

1. **Purpose:** Inform US users the platform isn't available there yet, offer waitlist
2. **Content:** One sentence of explanation + "Join Waitlist" CTA button
3. **Dimensions:** Full wizard content width. Margin-top: `--space-md`. Text padding: 0. Button: full-width, height 44px, `--radius-sm`.
4. **Typography:**
   - Message: Body small (14px / 400), `--fg-secondary`
   - CTA: Label (13px / 600 / 0.01em), `--brand-on` on `--brand-primary`
5. **States:**
   - **Hidden:** When no country selected or Canada selected
   - **Visible:** When US selected — fades in (150ms ease-out opacity)
6. **Variants:** None
7. **Interactions:** "Join Waitlist" click → redirect to `/onboarding/waitlist`. Hover: `--brand-hover`. Focus: `--border-focus` ring.
8. **Responsive:** Unchanged.

### NavigationBar (Back / Next / Complete)

1. **Purpose:** Move between wizard steps
2. **Content:** "Back" (left-aligned), "Next" or "Complete" (right-aligned)
3. **Dimensions:** Full wizard card width. Button height: 44px. Button padding: 0 `--space-lg`. Top border: `--border-subtle`. Padding-top: `--space-md`.
4. **Typography:** Label (13px / 600 / 0.01em)
5. **States:**
   - **Step 1, no selection:** Back hidden. Next disabled (50% opacity).
   - **Step 1, Canada selected:** Back hidden. Next enabled (`--brand-primary` bg).
   - **Step 1, US selected:** Back hidden. Next hidden. Waitlist CTA shown instead.
   - **Steps 2-3:** Back visible (ghost: transparent bg, `--fg-primary`, `--border-default` border). Next enabled.
   - **Step 4:** Back visible. "Complete" replaces Next.
   - **Step 4 submitting:** "Creating profile..." text, disabled, spinner.
   - **Hover:** Back → `--bg-inset`. Next/Complete → `--brand-hover`. 150ms.
   - **Focus:** `--border-focus` outline on both.
6. **Variants:** "Next" (steps 1-3) vs "Complete" (step 4)
7. **Interactions:** Click/Enter to trigger. Back on step 1 is absent (not hidden-but-present, actually not rendered).
8. **Responsive:** Buttons flex `justify-between`. Both maintain min-width. No full-width stretch on mobile.

---

## Interaction Patterns

**Primary interaction:** Select country (step 1), fill form fields (steps 2-4), advance with Next/Complete.

**Keyboard navigation:**

- Tab order per step:
  - Step 1: Canada button → US button (arrow keys within radio group) → Next (or Join Waitlist)
  - Step 2: imageUrl → firstName → middleName → lastName → pronouns → displayName → contactEmail → city → province → Back → Next
  - Step 3: specialties group → participants group → ages group → modalities group → Back → Next
  - Step 4: rateIndividual → rateGroup → rateFamily → rateCouples → acceptsInsurance → reducedFees → proBono → freeConsultation → acceptingClients → Back → Complete
- Country buttons use radio group pattern: Tab focuses the group, Arrow keys move selection
- Completed wizard steps are in the tab order (focusable, Enter to navigate)

**Micro-interactions:**

- Country button selection: 150ms ease-out border color + background tint
- Waitlist message appearance: 150ms ease-out opacity
- Step transition: instant content swap (no animation — clean cut between steps)
- Wizard progress line fill: 150ms ease-out when a step completes
- Button hover/focus: 150ms ease-out background shift

**Form behavior:**

- Per-step validation on "Next" click (batch validation, not on blur)
- Inline error messages appear below invalid fields after failed validation attempt
- Scroll to first error if content overflows viewport
- Country change on step 1 → `form.reset()` clears all steps 2-4 data

---

## Accessibility Notes

- **Landmark regions:** `<main>` wraps entire onboarding content
- **Heading hierarchy:**
  - h1: "Welcome to Therapist Referral Network" (page)
  - h2: "How it works" (section above wizard)
  - h2: Step heading inside wizard card — changes per step: "Where do you practice?", "Bio", "Communities served", "Your services"
- **ARIA requirements:**
  - WizardProgress: `<nav aria-label="Onboarding progress">` containing `<ol>`. Current step: `aria-current="step"`.
  - Country buttons: wrapper `role="radiogroup"` with `aria-label="Country selection"`. Each button: `role="radio"`, `aria-checked="true|false"`.
  - Form fields: `aria-required="true"` on required fields. `aria-describedby` linking to error/helper text IDs.
  - Server error banner: `role="alert"`, `tabIndex={-1}` for programmatic focus.
  - Step content region: focus management on step transition (move focus to step heading or first interactive element).
- **Color independence:**
  - Selected country: border change + checkmark icon (not color alone)
  - Completed wizard steps: checkmark glyph (not just color fill)
  - Errors: icon + text message (not just red color)
  - Disabled Next: 50% opacity + `aria-disabled` (not color change alone)
- **Focus management:**
  - Page load: focus on h1 or first interactive element
  - Step transition: focus moves to step heading
  - Validation error: focus moves to first invalid field
  - Server error: focus moves to error banner

---

## Open Questions

None — all decisions resolved in the design brief.
