# Design: Profile Edit Checkbox Refinements

## Architecture overview

Four categories of changes, applied in order:

1. **Shared component** — New `<CheckboxGroup>` with 3 layout modes, react-hook-form integration, full accessibility
2. **Schema changes** — `faithOrientation` from `String?` → `String[]` across Prisma, Zod, tRPC
3. **ProfileForm UI** — Row pairing, ChipSelect→CheckboxGroup conversions, credential UX
4. **Onboarding refactor** — Replace inline checkbox markup in OnboardingStepCommunities with shared component

## New component: `<CheckboxGroup>`

**File**: `src/components/ui/CheckboxGroup.tsx`

### Props

```typescript
interface CheckboxGroupProps {
  name: string; // react-hook-form field name
  options: { value: string; label: string }[]; // checkbox options
  layout: "inline" | "column" | "grid-3"; // layout mode
  control: Control<any>; // react-hook-form control
  label: string; // group label for <legend>
  srOnlyLabel?: boolean; // visually hide legend (default: false)
  helpText?: string; // optional help text
  error?: string; // error message
}
```

### Layout CSS mapping

```
layout="inline"  → flex flex-wrap gap-x-6 gap-y-2
layout="column"  → space-y-2
layout="grid-3"  → grid grid-cols-1 sm:grid-cols-3 gap-2
```

### Accessibility structure

```html
<fieldset>
  <legend class="text-sm font-medium text-fg-1 {srOnlyLabel ? 'sr-only' : ''}">{label}</legend>
  {helpText &&
  <p id="{name}-help" class="text-sm text-fg-3">{helpText}</p>
  }
  <div
    class="{layoutClasses}"
    role="group"
    aria-labelledby="{name}-legend"
    aria-describedby="{helpText ? `${name}-help` : undefined} {error ? `${name}-error` : undefined}"
  >
    {options.map(opt => (
    <label
      key="{opt.value}"
      htmlFor="{name}-{opt.value}"
      class="flex items-center gap-2 cursor-pointer"
    >
      <input
        type="checkbox"
        id="{name}-{opt.value}"
        value="{opt.value}"
        class="w-4 h-4 rounded border-border text-brand focus:ring-brand focus:ring-offset-2"
        checked="{field.value?.includes(opt.value)}"
        onChange="{...toggle"
        logic...}
      />
      <span class="text-sm">{opt.label}</span>
    </label>
    ))}
  </div>
  {error &&
  <p id="{name}-error" class="text-sm text-err mt-1">{error}</p>
  }
</fieldset>
```

### react-hook-form integration

Use `Controller` from react-hook-form. The `onChange` handler toggles values in/out of the array:

```typescript
const handleChange = (value: string, checked: boolean) => {
  const current = field.value || [];
  field.onChange(checked ? [...current, value] : current.filter((v: string) => v !== value));
};
```

## Data model changes

### faithOrientation: String? → String[]

```prisma
// BEFORE
faithOrientation  String?

// AFTER
faithOrientation  String[]
```

No migration needed — local env, `prisma db push`.

## Zod schema changes

### therapist-profile.ts

```typescript
// BEFORE
faithOrientation: z.string().optional(),

// AFTER
faithOrientation: z.array(z.string()).default([]),
```

### onboarding.ts

No change — faithOrientation is not in onboarding schema.

## tRPC changes

### therapist.ts — createProfile and updateProfile

```typescript
// BEFORE
faithOrientation: input.faithOrientation,   // string | undefined

// AFTER
faithOrientation: input.faithOrientation,   // string[] (array now, same field name)
```

The tRPC mutations pass through the value directly — the type change flows from Zod.

## ProfileForm layout changes

### Row pairing

**Pronouns + Gender** — already in `grid grid-cols-1 sm:grid-cols-2 gap-4`. No change needed.

**Website URL + Psychology Today URL** — currently full-width stacked. Wrap in:

```html
<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
  {/* Website URL input */} {/* Psychology Today URL input */}
</div>
```

### Credential remove button — SVG icon

Replace `&times;` text with inline SVG:

```html
<!-- BEFORE -->
<button>×</button>

<!-- AFTER -->
<button class="cursor-pointer ...existing classes...">
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
    <path
      d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"
    />
  </svg>
</button>
```

Also add `cursor-pointer` to the "Add credential" button.

### Field conversions — ChipSelect → CheckboxGroup

| Field        | Current component | New component | Layout prop       |
| ------------ | ----------------- | ------------- | ----------------- |
| therapyStyle | ChipSelect        | CheckboxGroup | `layout="inline"` |
| participants | ChipSelect        | CheckboxGroup | `layout="inline"` |
| modalities   | ChipSelect        | CheckboxGroup | `layout="inline"` |
| ages         | ChipSelect        | CheckboxGroup | `layout="column"` |

Options source: use existing constant arrays from `therapist-profile.ts` (e.g., `PARTICIPANT_OPTIONS`, `AGE_OPTIONS`, `MODALITY_OPTIONS`). Map to `{ value, label }` format.

### Field conversions — select/autocomplete → CheckboxGroup

| Field            | Current component                | New component | Layout prop       |
| ---------------- | -------------------------------- | ------------- | ----------------- |
| faithOrientation | `<select>` dropdown              | CheckboxGroup | `layout="grid-3"` |
| insurers         | AutocompleteSelect (conditional) | CheckboxGroup | `layout="grid-3"` |

Insurance plans CheckboxGroup remains conditional on `acceptsInsurance` checkbox.

## OnboardingStepCommunities refactor

Replace the inline checkbox markup for participants, ages, and modalities with `<CheckboxGroup>`:

```typescript
// BEFORE: manual <label><input type="checkbox" .../></label> loops
// AFTER:
<CheckboxGroup
  name="participants"
  options={PARTICIPANT_OPTIONS.map(v => ({ value: v, label: v }))}
  layout="inline"
  control={control}
  label="Participants"
/>
```

Same pattern for ages (`layout="column"`) and modalities (`layout="inline"`).

## Key decisions

1. **Shared component first** — Build `<CheckboxGroup>` before touching any form. Single source of truth.
2. **Controller-based** — Use react-hook-form `Controller` for array fields, not manual `register`.
3. **faithOrientation → array** — Multi-select is the correct UX. Schema updated everywhere.
4. **No migration** — Local env, `prisma db push` directly.
5. **Pronouns + Gender already paired** — They're already in a 2-col grid. Only URLs need pairing.
6. **Inline SVG, not Heroicons import** — Avoids adding a dependency for one icon.
