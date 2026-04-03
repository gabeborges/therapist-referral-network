# System Design Specification

This file defines the design system for the Therapist Referral Network. Every visual decision traces back here. Created by `/dsg:foundation`.

---

## Direction

**Domain:** Warm handoff, clinical fit, consultation room, web of trust, matching (not searching), trust transfer, post-session reflection, the careful act of placing a client with the right person.

**Color world:** Honey-toned wood of bookshelves and desks. Sage green of office plants. Warm cream of linen upholstery and notepads. Deep teal of trust and depth — book spines, accent textiles. Muted terracotta of ceramics and grounding objects. Soft charcoal of pencil on paper.

**Signature:** The Match Ring — concentric rings visualizing multi-dimensional fit (specialty, insurance, approach, location). Each ring represents a fit dimension. Stronger matches fill more rings. Not a percentage bar, not a score — a visual language unique to clinical matching.

**Feel:** Calm, spacious, and trustworthy — like sitting in a well-appointed therapist's office after hours, making a thoughtful decision about a client's care. Reflective, not reactive. Professional without being corporate.

**Defaults rejected:**

1. ~~Blue/purple SaaS palette~~ → Warm wood/sage/teal palette from the therapist's actual office
2. ~~Card grid dashboard with metric boxes~~ → Focused single-flow interface centered on the referral action
3. ~~Sharp, dense data UI~~ → Spacious, calm layout with generous whitespace for reflective decision-making

---

## Grid

**Layout model:** Top navigation + centered content area. No sidebar. This is a focused tool with 3-4 sections, not a monitoring dashboard. The content area is the product.

**Why:** A sidebar implies always-visible navigation across many sections — enterprise software. This product has three screens and one primary action. Top navigation keeps the UI light and lets forms and lists breathe.

**Container:** max-width 720px for forms (create referral, profile), 960px for lists (tracker). Centered with auto margins.

**Why 720px forms:** Referral forms and profiles are single-column reading/writing tasks. Wider than 720px creates uncomfortable line lengths and scattered form fields. This width matches the focused, one-thing-at-a-time feel.

**Top navigation:** Full-width bar, content constrained to 1120px. App name left, nav links center-right, profile/avatar far right. Height 56px.

**Content area:** Padding 16px mobile, 24px tablet, 40px desktop.

---

## Typography

**Primary typeface:** Plus Jakarta Sans

**Why:** Humanist sans-serif with slightly rounded terminals — warm without being playful. It reads as "thoughtful professional" not "tech platform" or "medical system." The soft letter shapes echo the rounded, comfortable forms of a therapist's office furniture without crossing into childlike territory. It has excellent weight range for building hierarchy.

**Secondary typeface:** None — Plus Jakarta Sans handles all roles. Monospace for data: JetBrains Mono.

**Scale:**

| Level      | Size             | Weight | Tracking | Use                                                |
| ---------- | ---------------- | ------ | -------- | -------------------------------------------------- |
| Display    | 30px / 1.875rem  | 700    | -0.02em  | Page titles — "Create Referral," "Your Referrals"  |
| Heading 1  | 24px / 1.5rem    | 600    | -0.015em | Section headings within pages                      |
| Heading 2  | 20px / 1.25rem   | 600    | -0.01em  | Subsection headings, card group labels             |
| Heading 3  | 16px / 1rem      | 600    | -0.005em | Card titles, referral names                        |
| Body       | 15px / 0.9375rem | 400    | 0        | Default reading text, form descriptions            |
| Body small | 14px / 0.875rem  | 400    | 0        | Supporting text, secondary descriptions            |
| Label      | 13px / 0.8125rem | 500    | 0.01em   | Form labels, nav items, UI controls                |
| Caption    | 12px / 0.75rem   | 400    | 0.015em  | Metadata, timestamps, status labels                |
| Data       | 14px / 0.875rem  | 500    | 0        | Referral IDs, codes (JetBrains Mono, tabular-nums) |

**Why this scale:** 15px body (not 14 or 16) — slightly larger than dense tools for comfortable reading, but not so large it feels like a content site. Therapists are reading meaningful text (referral descriptions, colleague profiles), not scanning data tables. The generous body size respects that.

---

## Color

### Primitives

| Token                | Value (Light)            | Value (Dark)                | Role                                               |
| -------------------- | ------------------------ | --------------------------- | -------------------------------------------------- |
| `--fg-primary`       | `#3D3836`                | `#EDEBE8`                   | Default text — warm charcoal, like pencil on paper |
| `--fg-secondary`     | `#6B5E57`                | `#B5AFA8`                   | Supporting text — lighter warm brown               |
| `--fg-tertiary`      | `#8F8279`                | `#857D76`                   | Metadata, timestamps                               |
| `--fg-muted`         | `#B5A99E`                | `#5C5650`                   | Disabled, placeholder                              |
| `--bg-base`          | `#F7F4EF`                | `#1A1816`                   | App canvas — warm linen                            |
| `--bg-surface-1`     | `#FDFBF8`                | `#242120`                   | Cards, panels — barely lifted                      |
| `--bg-surface-2`     | `#FFFFFF`                | `#2E2A28`                   | Dropdowns, popovers                                |
| `--bg-surface-3`     | `#FFFFFF`                | `#383432`                   | Modals, dialogs                                    |
| `--bg-inset`         | `#EFE9E0`                | `#141210`                   | Inputs, code blocks — inset feel                   |
| `--border-default`   | `rgba(61, 56, 54, 0.12)` | `rgba(237, 235, 232, 0.10)` | Standard separation                                |
| `--border-subtle`    | `rgba(61, 56, 54, 0.06)` | `rgba(237, 235, 232, 0.05)` | Softer separation                                  |
| `--border-strong`    | `rgba(61, 56, 54, 0.22)` | `rgba(237, 235, 232, 0.18)` | Emphasis, hover                                    |
| `--border-focus`     | `#2A7C7C`                | `#3A9C9C`                   | Focus rings — brand teal                           |
| `--brand-primary`    | `#2A7C7C`                | `#3A9C9C`                   | Primary accent — deep teal                         |
| `--brand-hover`      | `#1F6363`                | `#2A8585`                   | Accent hover state                                 |
| `--brand-on`         | `#FFFFFF`                | `#FFFFFF`                   | Text on brand surfaces                             |
| `--semantic-success` | `#5A8A5A`                | `#6BA06B`                   | Success — sage green from office plants            |
| `--semantic-warning` | `#B8704F`                | `#D4886B`                   | Warning — muted terracotta                         |
| `--semantic-error`   | `#B85454`                | `#D46B6B`                   | Error — warm red, not harsh                        |
| `--semantic-info`    | `#2A7C7C`                | `#3A9C9C`                   | Info — same as brand teal                          |

### Token naming convention

Functional structure (`--fg-`, `--bg-`, `--border-`, `--brand-`, `--semantic-`) for developer ergonomics. Domain connection documented in the Role column. The warmth is in the values, not the variable names — a solo developer needs scannable, predictable tokens more than poetic ones.

**Why these specific values:**

- `--bg-base: #F7F4EF` is linen, not white. White is clinical/sterile. Linen is the warm cream of a therapist's office walls.
- `--fg-primary: #3D3836` is warm charcoal, not pure black. It's the color of graphite — softer on the eye, matches the reflective tone.
- `--brand-primary: #2A7C7C` is deep teal — the color of trust and depth without being corporate blue. It appears naturally in the therapy space (book covers, accent textiles).
- Borders use rgba with warm base colors so they blend with the linen canvas rather than cutting against it.
- Semantic colors draw from the office: sage for good outcomes, terracotta for caution, warm red for problems.

---

## Spacing

**Base unit:** 4px

**Why 4px:** Standard base that produces a scale comfortable for form-heavy interfaces. The generous end of the scale (32px, 48px) gets used frequently here — this is a spacious, calm UI, not a dense data tool.

| Token           | Value | Use                                                             |
| --------------- | ----- | --------------------------------------------------------------- |
| `--space-micro` | 4px   | Icon-to-label gaps, tight inline pairs                          |
| `--space-xs`    | 8px   | Within compact components, badge padding                        |
| `--space-sm`    | 12px  | Component internal padding, form field gaps                     |
| `--space-md`    | 16px  | Standard component gaps, card padding                           |
| `--space-lg`    | 24px  | Section internal spacing, form group gaps                       |
| `--space-xl`    | 32px  | Between sections on a page                                      |
| `--space-2xl`   | 48px  | Major separation — page header to content, between page regions |

---

## Depth

**Strategy:** Subtle shadows

**Why:** The therapist's office has soft, ambient lighting. Nothing casts harsh shadows — surfaces have a gentle, diffused lift. Borders-only would feel too technical (a developer tool). Layered shadows would feel too dramatic (a design portfolio). Surface-shifts alone wouldn't provide enough card presence for the referral tracker. Subtle shadows say: "this is a real surface in a softly-lit room."

| Level        | Treatment                                                                                                  |
| ------------ | ---------------------------------------------------------------------------------------------------------- |
| Base (0)     | `--bg-base` canvas, no shadow                                                                              |
| Elevated (1) | `0 1px 3px rgba(61, 56, 54, 0.06), 0 1px 2px rgba(61, 56, 54, 0.04)` — cards, panels. Barely there.        |
| Floating (2) | `0 4px 12px rgba(61, 56, 54, 0.08), 0 2px 4px rgba(61, 56, 54, 0.04)` — dropdowns, popovers. Gentle lift.  |
| Overlay (3)  | `0 8px 24px rgba(61, 56, 54, 0.12), 0 4px 8px rgba(61, 56, 54, 0.06)` — modals, dialogs. Present but soft. |

**Dark mode note:** Shadows are barely visible on dark backgrounds. Rely more on `--border-default` and surface color shifts for depth in dark mode. Shadow values can stay but will contribute less.

---

## Border Radius

**Character:** Soft and approachable — rounded enough to feel warm, not so round it feels playful. Matches the rounded edges of comfortable furniture, not the sharp corners of a clinical setting.

| Token           | Value  | Use                                                 |
| --------------- | ------ | --------------------------------------------------- |
| `--radius-sm`   | 6px    | Inputs, buttons, badges, small interactive elements |
| `--radius-md`   | 10px   | Cards, panels, form sections                        |
| `--radius-lg`   | 16px   | Modals, large containers, page-level regions        |
| `--radius-full` | 9999px | Avatars, pills, status indicators, match rings      |

**Why these values:** 6px for small elements is softer than the typical 4px (which reads as technical) but tighter than 8px (which starts to feel consumer/playful). 10px for cards gives them a gentle, welcoming shape. The match ring signature uses `radius-full` for its concentric circles.

---

## Components

### Toggle

A pill-shaped switch for binary on/off settings. File: `src/components/ui/Toggle.tsx`.

**Size:** 36×20px (w-9 h-5). Knob: 16×16px white circle.

**Colors:**

- On: `var(--brand)` background
- Off: `var(--border-e)` background
- Knob: white, both states

**States:**
| State | Appearance |
|-------|-----------|
| Off | `--border-e` bg, knob left (2px) |
| On | `--brand` bg, knob right (calc(100% - 18px)) |
| Disabled | Same as on/off but `opacity-70`, `cursor-not-allowed` |
| Focus | `outline-2 outline-border-f outline-offset-2` |

**Animation:** 150ms ease-out on background color and knob position.

**Props:** `checked`, `onChange`, `disabled?`, `ariaLabel`.

**Usage:** Pair with a label to the right. Use `gap-3` (12px) between toggle and label text.

---

## Responsive Breakpoints

| Name    | Width       | Behavior                                                                               |
| ------- | ----------- | -------------------------------------------------------------------------------------- |
| Mobile  | 0–639px     | Single column. Top nav collapses to hamburger. Forms full-width. 16px content padding. |
| Tablet  | 640–1023px  | Single column with more breathing room. Top nav visible. 24px content padding.         |
| Desktop | 1024–1279px | Full layout. Centered content containers. 40px content padding.                        |
| Large   | 1280px+     | Same as desktop, max-width constraints prevent over-stretching. Generous side margins. |

**Why these breakpoints:** Mobile-first since therapists use this on phones between sessions. Tablet captures iPad usage (common for therapists). Desktop is the primary after-hours workspace. No ultra-wide optimization needed — content is capped at 720/960px containers anyway.

---

## Animation

**Micro-interactions:** 150ms ease-out — button hovers, focus states, toggle switches. Fast and functional.

**Transitions:** 250ms ease-out — page transitions, panel reveals, dropdown opens. Smooth but not slow.

**Motion philosophy:** Calm and purposeful. No bounce, no spring, no overshoot. Movement should feel like a gentle gesture — natural deceleration, not mechanical. This matches the reflective pace of a post-session workflow. The therapist isn't in a rush; the UI isn't either.

**Easing:** `cubic-bezier(0.25, 0.1, 0.25, 1.0)` for most transitions. Standard deceleration that feels natural without being flashy.
