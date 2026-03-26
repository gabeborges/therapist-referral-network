# Screen Specification: Sign In

---

## Screen Identity

**Screen name:** Sign In

**Purpose:** Authenticate a returning therapist to access the app.

**Who:** Solo therapist who already has an account, returning to check referrals or create a new one.

**Task:** Enter credentials, get into the app quickly.

**Feel:** Simple, trustworthy, and fast. No friction. The design should signal professionalism and warmth — first impression of the product.

---

## Visual Hierarchy

### Tool 1: Size
- **Largest:** App name/logo — sets identity
- **Medium:** Email and password fields, sign-in button
- **Smallest:** "Forgot password?", "Create account" link

### Tool 2: Weight
- **Bold:** App name, "Sign In" button
- **Medium:** Field labels
- **Light:** Links, helper text

### Tool 3: Color
- **Brand accent:** "Sign In" button
- **Muted:** Links, placeholder text

### Tool 4: Spacing
- **Generous:** Between logo and form, between form and secondary actions
- **Standard:** Between form fields
- **Compact:** Between label and input

### Tool 5: Position
- **Top-center:** App logo/name + tagline
- **Center:** Sign-in form (the focus)
- **Below form:** Secondary actions (forgot password, create account)

### Tool 6: Contrast
- **Highest:** "Sign In" button
- **Medium:** Form inputs, labels
- **Low:** Secondary links

### 4 Hierarchy Levels

| Level | Role | Treatment | Elements |
|-------|------|-----------|----------|
| **Primary** | Sign in | Brand button, prominent form | "Sign In" button + email/password fields |
| **Secondary** | App identity | Present but not competing | Logo/name + tagline |
| **Tertiary** | Alternative actions | Small, quiet links | "Forgot password?", "Create account" |
| **Background** | Page structure | Warm canvas | Background color, centering |

---

## Content Priority

| Priority | Content Element | Why This Position |
|----------|----------------|-------------------|
| 1 | Email field | First input — start the task |
| 2 | Password field | Second input |
| 3 | "Sign In" button | Complete the task |
| 4 | App logo + tagline | Identity context |
| 5 | "Forgot password?" | Recovery path |
| 6 | "Create account" | New user path |

---

## Layout Structure

**Grid:** Vertically centered, 400px max-width form card on warm canvas

```
┌─────────────────────────────────────────────────┐
│                                                   │
│                                                   │
│                                                   │
│              [App Logo]                           │
│              Smarter referrals for                │
│              therapists.                          │
│                                                   │
│              ┌─────────────────────┐              │
│              │ Email               │              │
│              │ [                  ]│              │
│              │                     │              │
│              │ Password            │              │
│              │ [                  ]│              │
│              │                     │              │
│              │ [    Sign In      ] │              │
│              │                     │              │
│              │ Forgot password?    │              │
│              └─────────────────────┘              │
│                                                   │
│              Don't have an account?               │
│              Create one                           │
│                                                   │
│                                                   │
└─────────────────────────────────────────────────┘
```

**Responsive behavior:**
- **Mobile (0–639px):** Full-width form with 16px padding. No card — form sits directly on canvas. Logo and form stack.
- **Tablet/Desktop:** 400px card centered vertically and horizontally. Card has `--bg-surface-1` background, subtle shadow (elevation 1), `--radius-md` border radius.

---

## States

### Default
- Empty form, email field focused on page load
- "Sign In" button disabled until both fields have content (or always enabled — validate on submit)

### Loading (Authenticating)
- "Sign In" button shows spinner, text "Signing in…"
- Fields disabled during authentication
- Duration: < 1 second

### Error (Invalid Credentials)
- Error message below form: "Invalid email or password. Please try again."
- Error uses `role="alert"`, `--semantic-error` color
- Fields remain enabled, password field cleared, focus on password field
- No indication of WHICH field is wrong (security — don't reveal if email exists)

### Error (Rate Limited)
- Error message: "Too many attempts. Please try again in 15 minutes."
- Form fields disabled, button disabled
- Timer countdown if appropriate (P1)

### Error (Network)
- Error message: "Couldn't connect. Check your internet and try again."
- Fields remain enabled, retry available

### Session Expired
- Info message above form: "Your session expired. Please sign in again."
- Uses `--semantic-info` styling, not error

---

## Component Inventory

| # | Component | Purpose | System.md Pattern? |
|---|-----------|---------|-------------------|
| 1 | Auth Logo Block | App identity — logo + tagline | New |
| 2 | Auth Card | Form container with elevation | New |
| 3 | Text Input (Email) | Email entry | Reuses input pattern |
| 4 | Text Input (Password) | Password entry with show/hide toggle | Reuses input pattern |
| 5 | Primary Button | "Sign In" CTA | Reuses button pattern |
| 6 | Text Link | "Forgot password?", "Create account" | New |
| 7 | Error Message | Authentication errors | Reuses error pattern |

### Auth Logo Block

1. **Purpose:** Establish product identity and set the visual tone
2. **Content:** App logo/icon (if exists, otherwise text logo) + tagline "Smarter referrals for therapists"
3. **Dimensions:** Centered. Logo ~40px height. Margin-bottom: `--space-xl` (32px) to form.
4. **Typography:** App name — Heading 1 (24px/600). Tagline — Body (15px/400), `--fg-secondary`.
5. **States:** Static
6. **Variants:** None
7. **Interactions:** None (not a link on auth pages)
8. **Responsive:** Centered on all breakpoints

### Auth Card

1. **Purpose:** Container for the sign-in form — creates a focused surface
2. **Content:** Form fields + button + links
3. **Dimensions:** 400px max-width. Padding: `--space-xl` (32px). Radius: `--radius-md` (10px). Shadow: elevation level 1.
4. **Typography:** N/A — container only
5. **States:** Static container
6. **Variants:** None
7. **Interactions:** None — container only
8. **Responsive:** Mobile — no card, form is full-width on canvas. Desktop — card with shadow.

### Text Input (Password variant)

1. **Purpose:** Secure password entry with show/hide toggle
2. **Content:** Label "Password", password input, show/hide icon button
3. **Dimensions:** Full card width. Height: 40px. Show/hide icon: 20px, positioned inside input right.
4. **Typography:** Label — Label (13px/500). Input — Body (15px/400).
5. **States:** Same as standard text input + masked/unmasked toggle
6. **Variants:** Show password (type="text"), hide password (type="password", default)
7. **Interactions:** Click eye icon toggles visibility. Keyboard: Tab to icon, Enter/Space to toggle.
8. **Responsive:** Unchanged

---

## Interaction Patterns

**Primary interaction:** Type credentials, submit form.

**Keyboard navigation:**
- Tab order: email → password → show/hide toggle → "Sign In" → "Forgot password?" → "Create account"
- Enter key submits form from any field

**Micro-interactions:**
- Field focus: border color transition 150ms
- Button hover: background shift 150ms
- Error message: fade in 150ms
- Loading spinner: appears 150ms

**Form behavior:**
- Validation on submit (not on blur — auth forms should be fast)
- Enter key submits from any field
- Password field clears on error, email preserved

---

## Accessibility Notes

- **Landmark regions:** `<main>` for auth content
- **Heading hierarchy:** h1 = App name
- **ARIA requirements:** Error message uses `role="alert"`. Form uses `aria-label="Sign in"`. Password toggle uses `aria-label="Show password"` / `aria-label="Hide password"`.
- **Color independence:** Error messages are text, not just color.
- **Focus management:** Page load: focus on email field. Error: focus on password field (or first empty field). Success: redirect to tracker.

---

## Open Questions

None.
