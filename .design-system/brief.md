# Design Brief — FormGroup Component

---

## 1. Overview

**Project name:** FormGroup

**One-sentence description:** A reusable component that visually groups related form fields under a section title, making long forms scannable.

**Type:** Component (reusable across forms)

**Scope:** New component

---

## 2. Problem

**What problem does this solve?** Forms in the app (Profile, Onboarding) have logical sections but no visual hierarchy separating them — fields run together and it's hard to tell where one section ends and another begins.

**What happens today without this?** Therapists filling out their profile scan a flat wall of fields. Finding the right field to edit requires reading top-to-bottom instead of jumping to the relevant section.

**What does success look like?** A therapist opens their profile form and immediately sees distinct, labeled sections. They jump straight to the section they need.

**What's the hypothesis?** We believe that adding clear visual grouping to form sections will reduce the cognitive load of editing a profile, making therapists more likely to complete and maintain accurate profiles.

---

## 3. Audience

**Who is the primary user?** Licensed therapists managing their profile and referral preferences on the platform.

**Where are they when they use this?** Desktop or mobile, between sessions or after hours. Context varies — not a fixed scenario.

**What did they do 5 minutes before?** Received a referral notification, or decided to update their availability/specialties.

**What will they do 5 minutes after?** Save changes and return to referral tracking or close the app.

**What's their relationship with the domain?** Domain experts (therapy) but not necessarily tech-savvy. They expect forms to be clear and self-explanatory.

---

## 4. Goals

**Primary goal:** Quickly find and edit the right field in a multi-section form.

**Secondary goals:**

1. Communicate form structure at a glance (what sections exist)
2. Maintain visual consistency across all forms in the app
3. Support accessible form grouping semantics

**Non-goals:**

- Does not handle validation or field state (react-hook-form owns that)
- Does not dictate form layout (single-column vs multi-column is the parent's job)
- Not a stepper or wizard — purely visual grouping within a single form view

---

## 5. Scope

**Screens/views needed:**

1. `FormGroup` component — section wrapper with title, optional description, and children slot

**Key user flows:**

1. Therapist opens Profile Edit → sees grouped sections → jumps to relevant group → edits fields
2. Developer wraps a set of fields in `<FormGroup title="...">` to create a visual section

**Data sources:** None — purely presentational.

**Integration points:** react-hook-form (children are form fields), Tailwind CSS v4 tokens from `.interface-design/system.md`.

---

## 6. Constraints

**Technical constraints:**

- React + TypeScript (strict mode)
- Tailwind CSS v4 for styling, using existing design tokens
- `<fieldset>` + `<legend>` for accessible section semantics
- Must work within 720px form containers
- WCAG AA minimum

**Business constraints:**

- Solo developer, ship fast
- Must be drop-in for existing Profile and Onboarding forms

**Design constraints:**

- Follow `.interface-design/system.md` — spacing (`--space-lg`, `--space-xl`), typography (Heading 2 for section titles, Body small for descriptions), colors (`--fg-primary`, `--border-default`), radius (`--radius-md`)
- Calm, spacious feel — generous whitespace between groups

---

## 7. Deliverables

**What gets built:** Production-ready React component with Tailwind styling.

**Fidelity:** Production code — no intermediate mocks needed.

**Handoff:** Self (solo developer). Component is used directly in Profile and Onboarding forms.

**Success criteria:**

- Form sections are visually distinct at a glance
- Component uses semantic HTML (`fieldset`/`legend`) for accessibility
- Component is reusable — works with any children content (text inputs, checkboxes, selects, etc.)
- Uses only existing design system tokens (no ad-hoc values)

---

## Sign-off

All sections filled. Ready for implementation.
