# Screen Specification: Sign Up

---

## Screen Identity

**Screen name:** Sign Up

**Purpose:** Create a new account so the therapist can set up their profile and join the referral network.

**Who:** A therapist who heard about the platform (from a colleague, likely) and is trying it for the first time.

**Task:** Enter basic account info (name, email, password) and create an account.

**Feel:** Welcoming and low-friction. Mirrors Sign In but with one extra field. Should feel fast — the real work (profile setup) comes in Onboarding.

---

## Visual Hierarchy

### Tool 1: Size
- **Largest:** App name/logo
- **Medium:** Form fields, "Create Account" button
- **Smallest:** "Already have an account?" link

### Tool 2: Weight
- **Bold:** App name, "Create Account" button
- **Medium:** Field labels
- **Light:** Links, helper text

### Tool 3: Color
- **Brand accent:** "Create Account" button
- **Muted:** Links, placeholder text, password requirements

### Tool 4: Spacing
- **Generous:** Between logo and form, between form and secondary action
- **Standard:** Between form fields
- **Compact:** Between label and input

### Tool 5: Position
- **Top-center:** App logo + tagline
- **Center:** Sign-up form
- **Below form:** "Already have an account?" link

### Tool 6: Contrast
- **Highest:** "Create Account" button
- **Medium:** Form inputs
- **Low:** Secondary link, password requirements

### 4 Hierarchy Levels

| Level | Role | Treatment | Elements |
|-------|------|-----------|----------|
| **Primary** | Create the account | Brand button, prominent form | "Create Account" button + form fields |
| **Secondary** | App identity | Present but not competing | Logo + tagline |
| **Tertiary** | Guidance | Small, quiet | Password requirements, helper text |
| **Background** | Page structure + alternative path | Warm canvas, quiet link | Background, "Already have an account?" |

---

## Content Priority

| Priority | Content Element | Why This Position |
|----------|----------------|-------------------|
| 1 | Full name field | First input |
| 2 | Email field | Account identifier |
| 3 | Password field | Account security |
| 4 | "Create Account" button | Complete the task |
| 5 | Password requirements | Guidance — visible but not dominant |
| 6 | App logo + tagline | Context |
| 7 | "Already have an account?" | Alternative path |

---

## Layout Structure

**Grid:** Same as Sign In — vertically centered, 400px max-width card

```
┌─────────────────────────────────────────────────┐
│                                                   │
│              [App Logo]                           │
│              Smarter referrals for                │
│              therapists.                          │
│                                                   │
│              ┌─────────────────────┐              │
│              │ Full name           │              │
│              │ [                  ]│              │
│              │                     │              │
│              │ Email               │              │
│              │ [                  ]│              │
│              │                     │              │
│              │ Password            │              │
│              │ [                  ]│              │
│              │ Min. 8 characters   │              │
│              │                     │              │
│              │ [ Create Account  ] │              │
│              └─────────────────────┘              │
│                                                   │
│              Already have an account?             │
│              Sign in                              │
│                                                   │
└─────────────────────────────────────────────────┘
```

**Responsive behavior:** Same as Sign In — mobile full-width, desktop card centered.

---

## States

### Default
- Empty form, name field focused on page load
- "Create Account" button active (validates on submit)

### Loading (Creating Account)
- "Create Account" shows spinner, text "Creating account…"
- Fields disabled
- Duration: < 2 seconds

### Success
- Redirect to Onboarding
- No toast needed — onboarding welcome message handles the transition

### Error (Email Already Exists)
- Error below email field: "An account with this email already exists. Sign in instead?"
- "Sign in" is a link
- Focus moves to email field

### Error (Weak Password)
- Error below password field: "Password must be at least 8 characters"
- Password field highlighted, focus on password field

### Error (Validation)
- Inline errors below each invalid field
- Focus on first invalid field

### Error (Network)
- Error below form: "Couldn't create your account. Check your connection and try again."
- Fields remain enabled

---

## Component Inventory

| # | Component | Purpose | System.md Pattern? |
|---|-----------|---------|-------------------|
| 1 | Auth Logo Block | Same as Sign In | Reuses from Sign In |
| 2 | Auth Card | Same container as Sign In | Reuses from Sign In |
| 3 | Text Input (Name) | Full name entry | Reuses input pattern |
| 4 | Text Input (Email) | Email entry | Reuses from Sign In |
| 5 | Text Input (Password) | Password with show/hide + requirements | Reuses from Sign In |
| 6 | Primary Button | "Create Account" CTA | Reuses button pattern |
| 7 | Text Link | "Already have an account? Sign in" | Reuses from Sign In |
| 8 | Password Requirements | Inline guidance below password field | New |

### Password Requirements

1. **Purpose:** Show password criteria — guide the user before they hit an error
2. **Content:** "Min. 8 characters" (keep simple — don't over-constrain)
3. **Dimensions:** Below password field. Margin-top: `--space-micro` (4px).
4. **Typography:** Caption (12px/400), `--fg-tertiary`
5. **States:**
   - Default: shown as helper text in `--fg-tertiary`
   - Met: text turns `--semantic-success` with ✓ icon (once user starts typing)
   - Unmet on submit: text turns `--semantic-error`
6. **Variants:** None
7. **Interactions:** Updates in real time as user types password
8. **Responsive:** Unchanged

---

## Interaction Patterns

**Primary interaction:** Fill 3 fields, create account.

**Keyboard navigation:**
- Tab order: name → email → password → show/hide → "Create Account" → "Sign in" link
- Enter key submits from any field

**Micro-interactions:** Same as Sign In — field focus transitions, button hover, error fade-in.

**Form behavior:**
- Name and email: validate on blur (check format)
- Password: real-time requirement check as user types
- Submit: validate all, create account, redirect to onboarding

---

## Accessibility Notes

- **Landmark regions:** `<main>` for auth content
- **Heading hierarchy:** h1 = App name
- **ARIA requirements:** Same as Sign In. Password requirements linked via `aria-describedby`. "Sign in" link in error message has descriptive text.
- **Color independence:** Password requirement check uses ✓ icon + text, not just color.
- **Focus management:** Page load: focus on name field. Error: focus on first invalid field. Success: redirect to onboarding.

---

## Open Questions

None.
