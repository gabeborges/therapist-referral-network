# Web App

## Stack

- Next.js 15 (App Router, RSC, Server Actions)
- TypeScript strict mode
- Supabase (Postgres, Auth, RLS, Edge Functions)
- Prisma 7 ORM
- tRPC API layer
- Auth.js authentication
- Tailwind CSS v4
- react-hook-form + Zod for forms
- Vitest for unit/integration tests
- Playwright for E2E tests
- Vercel deployment

## Code Style

- ESLint + Prettier
- Feature-based folder structure (see rules/feature-folder-structure.md)
- No barrel files (see rules/no-barrel-files.md)
- Prefer const; no var; no any
- Named exports (except page/layout components)
- Explicit return types on public functions
- RSC by default; 'use client' only when needed

## Testing

- Vitest for unit/integration
- Playwright for E2E
- Test behavior, not implementation
- Co-locate tests in feature folders
- OpenSpec enforces SDD workflow

## Component Library

- Use components from `src/components/ui/` for all UI elements (Input, Select, Textarea, Button, Card, Badge, Chip, etc.)
- Never use raw `<input>`, `<select>`, `<textarea>`, or `<button>` with inline Tailwind — use the design system components
- Form fields use: `<Label>` + `<Input>` (or Select/Textarea) + `<FieldError>` together
- For new components, follow existing pattern: named exports, forwardRef for form elements, "use client" only when interactive
- The visual source of truth is `.design-system/mocks/components.html`

## Patterns

- Next.js App Router conventions (page.tsx, layout.tsx, loading.tsx, error.tsx)
- Server Components by default; Client Components only for interactivity
- Supabase RLS for row-level security
- tRPC for type-safe API layer
- Prisma for database access
- Auth.js for authentication flows

## Health Data (when applicable)

- See rules/health-data-compliance.md
- No PHI in logs or third-party analytics

## Workflow Rules

- When debugging, read actual code and config before proposing a fix — trace the execution path first.
- After any feature, verify completeness: DB migrations, API types, navigation entries, settings, tests.
- Run preflight (lint, typecheck, tests) before reporting a task complete. Fix failures before declaring done.
- When reviewing code or bugs, do a deep first pass — verify each finding before reporting it.
- Do not make autonomous UI/design changes beyond what was requested (column counts, font sizes, etc.).
- Match intent: answer questions without acting; save plans as files without implementing them.
- Change ONLY what was requested. List planned edits before touching files and wait for approval.

## Boundaries

- Full-stack web application — optimize for performance and security
- react-hook-form + Zod for forms (same patterns as Mobile App)
