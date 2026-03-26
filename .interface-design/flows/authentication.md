# Flow: Authentication

**Goal:** Get the therapist into the app securely.
**Trigger:** Therapist visits the app (new or returning).
**Success state:** Authenticated and on the Referral Tracker (returning) or entering Onboarding (new).

---

## Task Flow (Happy Path — Returning User)

```
*Returning therapist opens app*
  → [Sign In]
  → Enters email + password
  → {System authenticates}
  → [Referral Tracker]
  → **Exit: authenticated**
```

## Task Flow (Happy Path — New User)

```
*New therapist visits app*
  → [Sign Up]
  → Enters name, email, password
  → {System creates account}
  → [Onboarding]
  → **Exit: account created, entering onboarding**
```

---

## User Flow (Expanded)

```
*User arrives at app*
  → (Has session?)
    →? Yes: → [Referral Tracker] (skip auth)
    →? No: → [Sign In]
  → (Has account?)
    →? Yes: enters email + password
      → {Authenticate}
      → (Valid?)
        →? Yes: → [Referral Tracker]
        →? No: <Error: "Invalid email or password">
          →← [Sign In]
    →? No: clicks "Create account" → [Sign Up]
      → Enters name, email, password
      → {Validate}
      → (Valid?)
        →? Yes: {Create account} → [Onboarding]
        →? No: <Error: inline validation (email taken, weak password)>
          →← [Sign Up]
  → (Forgot password?)
    →? Yes: clicks "Forgot password?" → [Forgot Password]
      → Enters email
      → {Send reset link}
      → [Check Your Email] — confirmation message
      → Clicks link in email
      → [Reset Password]
      → Enters new password
      → {Reset password}
      → (Valid?)
        →? Yes: → [Sign In] with success message
        →? No: <Error: password requirements> →← [Reset Password]
  → **Exit: authenticated**
```

### Edge Cases

- **Session expiry:** If session expires mid-use, redirect to Sign In with "Session expired, please sign in again"
- **Email verification:** Consider requiring email verification before full access (P1)
- **OAuth:** Social sign-in (Google) could reduce friction (P1)
- **Rate limiting:** Lock account after 5 failed attempts with "Try again in 15 minutes"
