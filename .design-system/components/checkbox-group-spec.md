# CheckboxGroup Component -- UX Architecture Specification

**Date:** 2026-03-31
**Source:** system.md tokens + existing usage audit
**Status:** Spec only -- no React implementation

---

## 1. Usage Inventory

Before specifying the component, here is every checkbox usage in the app:

| Field               | Options                                                                         | Current Layout          | Label Length Range          |
| ------------------- | ------------------------------------------------------------------------------- | ----------------------- | --------------------------- |
| Participants        | 4 (Individual, Couples, Family, Group)                                          | inline                  | Short (5--10 chars)         |
| Ages                | 4 (Children, Adolescents, Adults, Elders 65+)                                   | column                  | Short--Medium (6--13 chars) |
| Modalities          | 3 (In-Person, Virtual, Phone)                                                   | inline                  | Short (5--9 chars)          |
| Therapy style       | 7 (Structured, Direct, Relational, Anti-oppressive, Skills-based, Warm, Gentle) | inline                  | Short--Medium (4--16 chars) |
| Faith orientation   | 10                                                                              | grid-3                  | Short--Long (3--49 chars)   |
| Ethnicity           | 6                                                                               | grid-3                  | Medium--Long (5--36 chars)  |
| Insurance providers | 11                                                                              | grid-3                  | Medium (8--18 chars)        |
| Payment methods     | ~7                                                                              | inline (in ProfileForm) | Medium (4--18 chars)        |
| Pro bono            | 1 (boolean)                                                                     | standalone              | N/A                         |
| Free consultation   | 1 (boolean)                                                                     | standalone              | N/A                         |
| Reduced fees        | 1 (boolean)                                                                     | standalone              | N/A                         |
| Accepts insurance   | 1 (boolean)                                                                     | standalone              | N/A                         |

---

## 2. Layout Strategy

### Adaptive Layout Model

Replace the three fixed modes (`inline`, `column`, `grid-3`) with a single responsive CSS Grid that adapts based on the item's natural width. This eliminates the caller needing to pick a layout mode.

**Primary layout: CSS Grid with `auto-fill`**

```css
.checkbox-group {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(var(--checkbox-item-min), 1fr));
  gap: var(--space-2) var(--space-4); /* 8px row gap, 16px column gap */
}
```

**Item minimum widths by usage tier:**

| Tier     | `--checkbox-item-min` | When to use                                       | Result at 720px container |
| -------- | --------------------- | ------------------------------------------------- | ------------------------- |
| Compact  | `140px`               | Short labels (Participants, Ages, Modalities)     | 4--5 columns              |
| Standard | `180px`               | Medium labels (Therapy style, Payment, Insurance) | 3--4 columns              |
| Wide     | `240px`               | Long labels (Faith orientation, Ethnicity)        | 2--3 columns              |

The component should accept an optional `itemMinWidth` prop (default: `180px`) that maps to the grid's `minmax` first value. Three named presets -- `compact`, `standard`, `wide` -- cover all current usage without requiring pixel knowledge from the caller.

### Why not keep three fixed modes?

- `inline` with `flex-wrap` produces ragged trailing rows and inconsistent column alignment across groups on the same page.
- `column` wastes horizontal space for short-label groups (4 items stacked vertically when they could sit in a row).
- `grid-3` is rigid -- it forces 3 columns regardless of label length, causing text truncation on narrow viewports and wasted space on wide ones.
- `auto-fill` + `minmax` naturally collapses to 1 column on mobile, 2 on tablet, and 3--5 on desktop with zero media queries.

### Responsive behavior

| Viewport             | Container width        | Compact (140px min) | Standard (180px min) | Wide (240px min) |
| -------------------- | ---------------------- | ------------------- | -------------------- | ---------------- |
| Mobile (0--639px)    | ~100% - 32px           | 2 cols              | 1--2 cols            | 1 col            |
| Tablet (640--1023px) | ~720px                 | 4--5 cols           | 3--4 cols            | 2--3 cols        |
| Desktop (1024px+)    | 720px (form container) | 5 cols              | 3--4 cols            | 2--3 cols        |

No media queries needed -- the grid's intrinsic sizing handles all breakpoints. The 720px form container (from system.md) constrains the maximum columns naturally.

### Standalone boolean checkboxes

These remain outside CheckboxGroup. They use a simple `label > input + span` pattern with no grid wrapper. Spec for the individual checkbox visual treatment (Section 4) applies equally to these.

---

## 3. Spacing Recommendations

All values from the existing spacing scale in `globals.css`.

### Between the field label and the checkbox grid

```
margin-bottom on <legend>: var(--space-2)  /* 8px */
```

Current: `mb-2` (8px). No change needed. This is correct -- the label sits close to its options, maintaining a clear group relationship.

### Gap between checkbox items

```
row-gap:    var(--space-2)   /* 8px */
column-gap: var(--space-4)   /* 16px */
```

**Why 8px/16px and not 12px/12px:**

- Row gap is tighter because vertical rhythm should feel continuous -- options in the same group are visually one unit.
- Column gap is wider to create clear vertical scan lines. Therapists scan these lists to select familiar terms; wider column gaps make each column easier to read independently.
- Current `inline` layout uses `gap-x-6` (24px) and `gap-y-2` (8px). The 24px column gap is too wide -- it creates visual holes in the grid. 16px is sufficient separation within a 720px container.

### Padding within each checkbox item (the clickable hit area)

```
padding: var(--space-1) var(--space-2)  /* 4px 8px */
border-radius: var(--radius-sm)         /* 6px */
```

Each item gets a subtle padded hit zone. This serves three purposes:

1. Larger touch target (well above the 44px minimum height when combined with the label's line-height).
2. Visible hover/focus background area (see Section 5).
3. Consistent item rhythm in the grid.

### Gap between checkbox indicator and label text

```
gap: var(--space-2)  /* 8px */
```

Current: `gap-2` (8px). Correct. Do not reduce to 4px -- the label needs breathing room from the indicator at 15px body text size.

### Help text below label

```
margin-bottom on help text: var(--space-2)  /* 8px */
font: 12px/1.5 caption style
color: var(--fg-3)
```

Current implementation is correct for this.

### Error text below group

```
margin-top: var(--space-1)  /* 4px */
font: 12px caption style
color: var(--err)
```

---

## 4. Checkbox Indicator Visual Treatment

### Decision: Custom-styled checkbox via hidden input + CSS pseudo-element

Browser-default checkboxes must be replaced. Reasons:

- They render differently across Chrome, Safari, and Firefox (particularly on macOS vs Windows).
- The `accent-color` CSS property does not control border color, unchecked state, focus ring, or hover state.
- The warm linen background (`#F7F4EF`) and teal brand color (`#2A7C7C`) cannot be expressed through browser defaults.
- Current `w-4 h-4` (16px) is too small for a form used on mobile between sessions.

### Technique: Visually-hidden `<input>` + styled `<span>` sibling

The `<input type="checkbox">` remains in the DOM for form semantics, keyboard navigation, and screen reader support. It is positioned offscreen with `sr-only`. A sibling `<span>` renders the visual indicator.

### Indicator dimensions

```
width:  20px  (var(--space-5))
height: 20px  (var(--space-5))
border-radius: var(--radius-sm)  /* 6px -- matches inputs/buttons in system.md */
border-width: 1.5px
flex-shrink: 0
```

**Why 20px, not 16px or 24px:**

- 16px (current) is too small for comfortable mobile tapping and looks cramped next to 15px body text.
- 24px competes with the text visually and feels oversized for inline form elements.
- 20px is the sweet spot: large enough for easy targeting, proportional to the 15px body text (4:3 ratio), and matches the `--space-5` token.

### Checkmark icon

SVG checkmark rendered inside the indicator span (via CSS `background-image` or an inline SVG).

```
Checkmark stroke: 2px
Checkmark color: var(--brand-on) (#FFFFFF)
Viewbox: 0 0 14 14
Path: Polyline from (3,7) to (6,10) to (11,4) -- a gentle, slightly rounded check
```

The check should not be a sharp angular "V" -- the rounded terminals of Plus Jakarta Sans call for a softer mark.

### States

#### Unchecked (resting)

```css
background: var(--bg); /* #F7F4EF light, #1A1816 dark */
border-color: var(--border-e); /* rgba(61,56,54,0.22) -- the "strong" border */
```

**Why `--border-e` and not `--border`:**
The default border (`0.12` opacity) is too faint against the linen background. An unchecked checkbox must be clearly visible as an interactive element. The strong border (`0.22` opacity) reads as a deliberate form input boundary without being harsh.

#### Unchecked + Hover

```css
background: var(--inset); /* #EFE9E0 -- subtle fill, like pressing into the surface */
border-color: var(--border-e);
transition:
  background 150ms ease-out,
  border-color 150ms ease-out;
```

The hover fill uses the inset color -- the same background as text inputs. This creates a visual "I am an input element" affordance on hover.

#### Checked

```css
background: var(--brand); /* #2A7C7C */
border-color: var(--brand); /* border matches fill for clean appearance */
```

The checkmark SVG becomes visible (opacity 1, or rendered via background-image).

#### Checked + Hover

```css
background: var(--brand-h); /* #1F6363 -- brand hover, slightly darker */
border-color: var(--brand-h);
```

#### Focus-visible (keyboard navigation)

```css
outline: 2px solid var(--border-f); /* #2A7C7C teal focus ring */
outline-offset: 2px;
```

Applied to the visual indicator when the hidden `<input>` receives `:focus-visible`. This matches the existing focus pattern used on text inputs throughout the app (`focus:outline-2 focus:outline-border-f focus:outline-offset-2`).

**Do NOT use `focus:ring`** (Tailwind's box-shadow-based focus ring). Use native `outline` for consistency with the existing input focus treatment.

#### Disabled

```css
background: var(--inset);
border-color: var(--border); /* back to subtle border */
opacity: 0.5;
cursor: not-allowed;
```

The label text also receives `color: var(--fg-4)` in disabled state.

#### Error state (group-level)

The error is communicated via the error text below the group (existing pattern). Do NOT add a red border to individual checkboxes -- that creates visual noise and is redundant with the error message. The fieldset pattern with `aria-describedby` pointing to the error message is sufficient.

### Dark mode behavior

All states use CSS custom properties that already switch via the `@media (prefers-color-scheme: dark)` block in globals.css. No additional dark mode rules are needed for the checkbox indicator -- the tokens handle it.

Verify that `--brand` in dark mode (`#3A9C9C`) has sufficient contrast against `--bg` dark (`#1A1816`). Ratio: approximately 5.2:1 -- passes WCAG AA.

Verify that `--brand-on` (white) against `--brand` dark (`#3A9C9C`) is approximately 3.9:1 -- passes AA for large text and UI components but is borderline for small text. Since the checkmark is a UI component (not text), this passes.

---

## 5. Interaction Patterns

### Hover state on the entire item row

In addition to the checkbox indicator hover (Section 4), the entire label row should have a subtle background hover:

```css
.checkbox-item:hover {
  background: var(--brand-l); /* rgba(42,124,124,0.08) -- very faint teal wash */
  border-radius: var(--radius-sm); /* 6px */
}
```

**Why a row-level hover:**

- It increases the perceived click target -- the user sees the entire row respond, not just a 20px square.
- It provides immediate feedback that the element is interactive.
- The `--brand-l` tint is intentionally faint (8% opacity) -- enough to register without competing with the checked state.

### Focus management

- Tab key moves focus to the next checkbox item (standard browser behavior).
- Space key toggles the focused checkbox (standard browser behavior).
- No custom `role="group"` keyboard navigation (arrow keys) is needed. Checkbox groups are not radio groups -- each item is independently togglable, so standard tab navigation is correct.
- The current `role="group"` with `aria-labelledby` on the container div is correct and should be preserved.

### Touch targets

With the item padding (4px vertical, 8px horizontal) and the 20px indicator + 15px line-height text, each item's touch target is approximately:

```
Height: 4 + 20 + 4 = 28px (indicator path)
     or 4 + ~24px + 4 = 32px (text line-height path)
Width:  Full grid column width (well above 44px minimum)
```

The 32px height is below the 44px iOS minimum. To address this without bloating vertical spacing:

```css
.checkbox-item {
  min-height: 44px;
  display: flex;
  align-items: center;
}
```

This adds implicit vertical padding to reach 44px without changing the visual gap between items (the grid's `row-gap: 8px` still governs visual spacing).

### Animation

Per system.md micro-interactions: **150ms ease-out** for all checkbox state transitions.

```css
.checkbox-indicator {
  transition:
    background-color 150ms ease-out,
    border-color 150ms ease-out,
    box-shadow 150ms ease-out;
}
```

The checkmark itself should fade in (opacity 0 to 1) over 150ms. No scale, bounce, or transform animations -- system.md specifies "calm and purposeful, no bounce, no spring."

---

## 6. Complete CSS Specification

All values use existing tokens from `globals.css`. No new CSS custom properties are introduced except the component-scoped `--checkbox-item-min`.

### Checkbox group container

```css
/* Tailwind classes */
.checkbox-group {
  /* grid grid-cols-[repeat(auto-fill,minmax(var(--checkbox-item-min,180px),1fr))] */
  /* gap-y-2 gap-x-4 */
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(var(--checkbox-item-min, 180px), 1fr));
  gap: var(--space-2) var(--space-4);
}

/* Preset overrides via CSS variable or Tailwind arbitrary value */
.checkbox-group--compact {
  --checkbox-item-min: 140px;
}
.checkbox-group--standard {
  --checkbox-item-min: 180px;
}
.checkbox-group--wide {
  --checkbox-item-min: 240px;
}
```

### Checkbox item (label wrapper)

```css
/* Tailwind: flex items-center gap-2 px-2 py-1 rounded-sm min-h-[44px] cursor-pointer
   transition-colors duration-150 ease-out hover:bg-brand-l */
.checkbox-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-sm);
  min-height: 44px;
  cursor: pointer;
  transition: background-color 150ms ease-out;
}

.checkbox-item:hover {
  background-color: var(--brand-l);
}
```

### Checkbox indicator (visual replacement)

```css
/* Tailwind: w-5 h-5 shrink-0 rounded-sm border-[1.5px] border-border-e bg-bg
   transition-all duration-150 ease-out */
.checkbox-indicator {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  border-radius: var(--radius-sm);
  border: 1.5px solid var(--border-e);
  background-color: var(--bg);
  display: flex;
  align-items: center;
  justify-content: center;
  transition:
    background-color 150ms ease-out,
    border-color 150ms ease-out;
}

/* Hover (via parent) */
.checkbox-item:hover .checkbox-indicator {
  background-color: var(--inset);
}

/* Checked */
input:checked + .checkbox-indicator {
  background-color: var(--brand);
  border-color: var(--brand);
}

/* Checked + hover */
.checkbox-item:hover input:checked + .checkbox-indicator {
  background-color: var(--brand-h);
  border-color: var(--brand-h);
}

/* Focus-visible */
input:focus-visible + .checkbox-indicator {
  outline: 2px solid var(--border-f);
  outline-offset: 2px;
}

/* Checkmark SVG inside indicator */
.checkbox-indicator svg {
  width: 14px;
  height: 14px;
  stroke: var(--brand-on);
  stroke-width: 2;
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
  opacity: 0;
  transition: opacity 150ms ease-out;
}

input:checked + .checkbox-indicator svg {
  opacity: 1;
}
```

### Label text

```css
/* Tailwind: text-[0.9375rem] text-fg select-none */
.checkbox-label-text {
  font-size: 0.9375rem; /* 15px body from system.md */
  color: var(--fg);
  user-select: none;
}
```

---

## 7. Mapping Current Usages to New Spec

| Field                           | Current           | New Spec                                                                                        |
| ------------------------------- | ----------------- | ----------------------------------------------------------------------------------------------- |
| Participants (4, short)         | `layout="inline"` | `itemMinWidth="compact"` (140px) -- fits 4 across at 720px                                      |
| Ages (4, short-medium)          | `layout="column"` | `itemMinWidth="compact"` (140px) -- fits 4 across instead of stacking                           |
| Modalities (3, short)           | `layout="inline"` | `itemMinWidth="compact"` (140px) -- fits 3+ across                                              |
| Therapy style (7, medium)       | `layout="inline"` | `itemMinWidth="standard"` (180px) -- wraps naturally to 2 rows                                  |
| Faith orientation (10, long)    | `layout="grid-3"` | `itemMinWidth="wide"` (240px) -- accommodates "The Church of Jesus Christ of Latter-day Saints" |
| Ethnicity (6, long)             | `layout="grid-3"` | `itemMinWidth="wide"` (240px) -- accommodates "Other Racial or Ethnic Background"               |
| Insurance (11, medium)          | `layout="grid-3"` | `itemMinWidth="standard"` (180px) -- 3--4 columns, comfortable                                  |
| Payment methods (~7, medium)    | `inline` (raw)    | `itemMinWidth="standard"` (180px)                                                               |
| Boolean checkboxes (standalone) | Raw `<input>`     | Same visual indicator spec (Section 4), no grid wrapper                                         |

---

## 8. Accessibility Checklist

- [x] Hidden `<input>` remains in DOM for screen reader and form semantics
- [x] `<fieldset>` + `<legend>` wraps each group (existing pattern, preserved)
- [x] `aria-labelledby` on group container references the legend (existing, preserved)
- [x] `aria-describedby` links to help text and error messages (existing, preserved)
- [x] Focus-visible outline on indicator matches system-wide focus treatment
- [x] Minimum 44px touch target height via `min-height`
- [x] Color contrast: checked indicator `--brand` on `--bg` exceeds 4.5:1
- [x] Color contrast: checkmark `--brand-on` on `--brand` exceeds 3:1 (UI component threshold)
- [x] No information conveyed by color alone -- checked state has both color fill AND checkmark icon
- [x] Space key toggles (native browser behavior, preserved by keeping real `<input>`)
- [x] Tab key navigates between items (native behavior, no custom key handling needed)

---

## 9. What This Spec Does NOT Cover

- React component API or TypeScript interface (implementation decision)
- Indeterminate checkbox state (not used in this app)
- Checkbox trees / nested groups (not used in this app)
- Search/filter within large checkbox groups (could be relevant for Insurance at 11 items but not critical yet)
- Animation of the checkmark path draw (too playful for this design system's "calm and purposeful" motion philosophy)
