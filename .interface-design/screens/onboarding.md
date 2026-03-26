# Screen Specification: Onboarding

---

## Screen Identity

**Screen name:** Onboarding

**Purpose:** Get a new therapist's profile filled out so the system can include them in matching. Every required field directly enables better matches.

**Who:** A therapist who just created an account. They don't know how the platform works yet. They need to understand the value proposition and be motivated to complete their profile.

**Task:** Understand what this platform does, fill in matching-critical profile fields, get ready to use the app.

**Feel:** Welcoming and purposeful — like a friendly colleague explaining how this works, not a bureaucratic form. Each field has context explaining why it matters.

---

## Visual Hierarchy

### Tool 1: Size
- **Largest:** Welcome heading — Display level
- **Medium:** Form fields, explanation text — Body level
- **Smallest:** Field helper text — Caption level

### Tool 2: Weight
- **Bold:** Welcome heading, "Complete Setup" CTA
- **Medium:** Field labels, value proposition points
- **Light:** Helper text, explanations

### Tool 3: Color
- **Brand accent:** "Complete Setup" CTA, progress/step indicator
- **Muted:** Helper text explaining why each field matters

### Tool 4: Spacing
- **Generous:** Between welcome message and form, between the form and CTA
- **Standard:** Between form fields
- **Compact:** Between label and input, between label and helper

### Tool 5: Position
- **Top:** Welcome message — "Welcome to [App Name]"
- **Middle:** How it works (brief), profile form
- **Bottom:** Complete setup CTA

### Tool 6: Contrast
- **Highest:** "Complete Setup" button
- **Medium:** Welcome text, field labels
- **Low:** Helper text, "how it works" explanation

### 4 Hierarchy Levels

| Level | Role | Treatment | Elements |
|-------|------|-----------|----------|
| **Primary** | Complete the profile setup | Brand CTA at bottom, clear form | "Complete Setup" button |
| **Secondary** | Fill in matching fields | Clear labels, accessible inputs | Form fields with why-context |
| **Tertiary** | Understand the platform | Readable but not dominating | Welcome message, "how it works" explanation |
| **Background** | Structure | Minimal — no nav distraction | App logo only, form container |

---

## Content Priority

| Priority | Content Element | Why This Position |
|----------|----------------|-------------------|
| 1 | Welcome + value proposition | Motivation before action |
| 2 | "How it works" summary | Set expectations (3 bullet points) |
| 3 | Profile form fields | The actual task |
| 4 | Why-helpers on each field | Motivation to fill accurately |
| 5 | "Complete Setup" button | Final action |

---

## Layout Structure

**Grid:** Centered single-column, 560px max-width (narrower than standard forms — more intimate)

```
┌─────────────────────────────────────────────────┐
│                   [App Logo]                      │  ← Minimal header
├─────────────────────────────────────────────────┤
│                                                   │
│          Welcome to [App Name]                    │
│                                                   │
│          You're building a smarter referral       │
│          network. Here's how it works:            │
│                                                   │
│          1. You create a referral by describing   │
│             what your client needs                │
│          2. The system matches the top 5          │
│             therapists and emails them            │
│          3. They reply by email — you track       │
│             everything here                       │
│                                                   │
│          Let's set up your profile so the         │
│          system can match you with referrals.     │
│                                                   │
│          ─────────────────────────────────────    │
│                                                   │
│          Credentials *                            │
│          [e.g., LCSW, PhD, PsyD]                 │
│          Shown to therapists who refer to you     │
│                                                   │
│          Specialties *                            │
│          [multi-select chips]                     │
│          Referrals are matched by specialty       │
│                                                   │
│          Insurance accepted *                     │
│          [multi-select chips]                     │
│          Clients need coverage — this drives      │
│          match quality                            │
│                                                   │
│          Location *                               │
│          [text input] [□ Virtual available]        │
│          Geographic proximity matters for         │
│          in-person clients                        │
│                                                   │
│          Therapeutic approaches                   │
│          [multi-select chips]                     │
│          Optional — improves match accuracy       │
│                                                   │
│          Contact email                            │
│          [pre-filled from sign-up]                │
│          Where referral notifications are sent    │
│                                                   │
│                                                   │
│          [Complete Setup]                         │
│                                                   │
└─────────────────────────────────────────────────┘
```

**Responsive behavior:**
- **Mobile (0–639px):** Full-width with 16px padding. Same single-column layout. CTA full-width.
- **Tablet/Desktop:** 560px centered. Generous side whitespace.

---

## States

### Welcome View (Initial)
- **Content:** Welcome message + how it works + empty form
- **Behavior:** Single scrollable page, not multi-step. Form fields visible below the welcome content.

### Filling
- **Inline validation:** Required fields validate on blur
- **Progress indication:** Not a progress bar (single page). Required field count: "4 of 5 required fields complete" shown subtly near CTA.

### Submitting
- **Visual:** "Complete Setup" shows spinner, text "Setting up…", form fields disable
- **Duration:** < 1 second (simple profile save)

### Success
- **Redirect:** To Referral Tracker (empty state) with welcome toast: "You're all set! You'll receive referral matches by email."
- **Focus:** Lands on tracker with CTA to create first referral

### Validation Error
- **Inline errors:** Below each invalid required field
- **Scroll:** To first invalid field on submit attempt
- **Focus:** First invalid field receives focus

### Returning Incomplete
- **Trigger:** User signed up but didn't complete onboarding (closed browser, etc.)
- **Behavior:** Next login redirects here. Previously entered data is pre-filled from partial save.
- **Message:** "Welcome back! Let's finish setting up your profile."

---

## Component Inventory

| # | Component | Purpose | System.md Pattern? |
|---|-----------|---------|-------------------|
| 1 | Onboarding Header | Logo + welcome message + how it works | New |
| 2 | Form Fields | Same components as Create Referral — multi-select, text input, select | Reuses from Create Referral |
| 3 | Why-Helper Text | Context text below each field explaining its matching purpose | New |
| 4 | Complete Setup Button | Primary CTA to save and proceed | Reuses Form Actions pattern |

### Onboarding Header

1. **Purpose:** Welcome the therapist, explain the platform, motivate profile completion
2. **Content:** App logo, welcome heading, value proposition, "how it works" 3-step list
3. **Dimensions:** Full container width. Logo: 32px height. Margin-bottom after list: `--space-xl` (32px).
4. **Typography:**
   - Welcome heading — Display (30px/700)
   - Subtitle — Body (15px/400), `--fg-secondary`
   - How-it-works steps — Body (15px/400) with step numbers in `--brand-primary`
5. **States:** Static — "Welcome back!" variant for returning incomplete users
6. **Variants:** First visit vs. returning incomplete
7. **Interactions:** None
8. **Responsive:** Text reflows. Logo centered on mobile.

### Why-Helper Text

1. **Purpose:** Explain why each field matters for matching — motivates accurate input
2. **Content:** One line per field: "Referrals are matched by specialty", "Clients need coverage — this drives match quality", etc.
3. **Dimensions:** Below each form field, above the next field. Margin-top: `--space-micro` (4px).
4. **Typography:** Caption (12px/400), `--fg-tertiary`, italic
5. **States:** Static
6. **Variants:** Per-field text
7. **Interactions:** None
8. **Responsive:** Unchanged

---

## Interaction Patterns

**Primary interaction:** Fill form fields, complete setup.

**Keyboard navigation:**
- Tab order follows field order: credentials → specialties → insurance → location → virtual toggle → approaches → email → complete setup
- No escape hatch (skip) — profile completion is required

**Micro-interactions:**
- Same as Create Referral form (field focus, chip add/remove, validation)
- Complete Setup loading: spinner + text change

**Form behavior:**
- Validation on blur for required fields
- All-fields validation on submit
- Scroll to first error on submit failure
- Partial data auto-saved on field blur (so returning users see their progress)

---

## Accessibility Notes

- **Landmark regions:** `<main>` for entire onboarding content
- **Heading hierarchy:** h1 "Welcome to [App Name]". h2 = not needed (single-page form).
- **ARIA requirements:** Same as Create Referral form — `aria-required`, `aria-describedby` for helpers, `role="listbox"` for multi-selects.
- **Color independence:** Required indicators use "*" text. Validation errors have text messages.
- **Focus management:** Page load: focus on heading or first field. Submit error: focus on first invalid field. Success: focus on tracker.

---

## Open Questions

None.
