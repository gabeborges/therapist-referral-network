# Web App

## Stack
- Next.js 15 (App Router, RSC, Server Actions)
- TypeScript strict mode
- Supabase (Postgres, Auth, RLS, Edge Functions)
- Prisma 7 ORM
- tRPC API layer
- Auth.js authentication
- Stripe payments
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

## Boundaries
- Full-stack web application — optimize for performance and security
- react-hook-form + Zod for forms (same patterns as Mobile App)
