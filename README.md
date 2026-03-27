# Therapist Referral Network

A platform for therapists to refer clients to trusted colleagues in their professional network.

## Tech Stack

- **Framework:** Next.js 15 (App Router, React Server Components)
- **Language:** TypeScript (strict mode)
- **Database:** Supabase (Postgres) via Prisma 7
- **API:** tRPC
- **Auth:** Auth.js (Google OAuth)
- **Payments:** Stripe
- **Email:** Resend
- **Styling:** Tailwind CSS v4
- **Testing:** Vitest + Playwright

## Prerequisites

- Node.js 20+
- npm 10+
- A [Supabase](https://supabase.com) project
- A [Google OAuth](https://console.cloud.google.com) app (for authentication)
- A [Resend](https://resend.com) account (for transactional email)
- A [Stripe](https://stripe.com) account (optional, for payments)

## Getting Started

### 1. Clone and install dependencies

```bash
git clone <repo-url>
cd therapist-referral-network
npm install
```

### 2. Set up external services

#### Supabase (Database & Auth)

1. Go to [supabase.com](https://supabase.com) and create an account
2. Click **New Project**, choose an organization, name, and database password
3. Wait for the project to finish provisioning
4. Go to **Project Settings > API** to find:
   - **Project URL** — use for `SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** — use for `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** — use for `SUPABASE_SERVICE_ROLE_KEY` (keep this secret)
5. Go to **Project Settings > Database** to find:
   - **Connection string (URI)** — use for `DATABASE_URL` (use the pooled/Transaction connection string on port `6543`)
   - **Direct connection string** — use for `DIRECT_URL` (on port `5432`, used by Prisma migrations)
   - Replace `[YOUR-PASSWORD]` in both strings with the database password you set in step 2

#### Google OAuth (Authentication)

1. Go to the [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project (or select an existing one)
3. Navigate to **APIs & Services > OAuth consent screen**
   - Choose **External** user type
   - Fill in the app name, support email, and developer contact
   - Add the scope `email` and `profile`
4. Navigate to **APIs & Services > Credentials**
   - Click **Create Credentials > OAuth client ID**
   - Application type: **Web application**
   - Add **Authorized redirect URIs**: `http://localhost:3000/api/auth/callback/google`
   - Copy the **Client ID** — use for `AUTH_GOOGLE_ID`
   - Copy the **Client Secret** — use for `AUTH_GOOGLE_SECRET`

#### Resend (Transactional Email)

1. Go to [resend.com](https://resend.com) and create an account
2. Navigate to **API Keys** and create a new key
   - Copy the key — use for `RESEND_API_KEY`
3. Navigate to **Domains** and add your sending domain (or use Resend's test domain for development)
4. Set `RESEND_FROM_EMAIL` to an address on your verified domain (e.g., `referrals@yourdomain.com`)

#### Stripe (Payments — optional)

1. Go to [stripe.com](https://stripe.com) and create an account
2. In the dashboard, make sure you're in **Test mode** (toggle in the top right)
3. Go to **Developers > API keys**
   - Copy the **Publishable key** — use for `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - Copy the **Secret key** — use for `STRIPE_SECRET_KEY`

### 3. Set up environment variables

Copy the example env file and fill in the values from the services above:

```bash
cp .env.example .env.local
```

Generate your Auth.js secret:

```bash
openssl rand -base64 32
```

Paste the output as `AUTH_SECRET` in `.env.local`.

> See [Environment Configuration](#environment-configuration) below for how env files are structured across environments.

### 4. Set up the database

Push the Prisma schema to your Supabase database:

```bash
npm run db:push
```

You can inspect the database with Prisma Studio:

```bash
npm run db:studio
```

### 5. Run the development server

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server (Turbopack) |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Run ESLint with auto-fix |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check formatting |
| `npm test` | Run unit tests (watch mode) |
| `npm run test:run` | Run unit tests once |
| `npm run test:coverage` | Run tests with coverage |
| `npm run test:e2e` | Run Playwright E2E tests |
| `npm run test:e2e:ui` | Run E2E tests with UI |
| `npm run db:generate` | Regenerate Prisma client |
| `npm run db:push` | Push schema to database |
| `npm run db:migrate` | Run database migrations |
| `npm run db:studio` | Open Prisma Studio |

## Environment Configuration

The project uses Next.js's built-in env file loading. Files are loaded in order of precedence (highest first):

| File | Purpose | Committed? | Loaded when |
|---|---|---|---|
| `.env.local` | **Secrets** (API keys, DB passwords, auth secrets) | No | Always (overrides everything) |
| `.env.development` | Non-secret defaults for local dev | Yes | `next dev` |
| `.env.production` | Non-secret defaults for production | Yes | `next build` / `next start` |
| `.env.example` | Template listing all required variables | Yes | Never (reference only) |

### How it works

- **`.env.development`** and **`.env.production`** contain non-secret, environment-specific defaults (app URL, sender email, feature flags). These are committed to the repo so every developer and deployment gets the right defaults.
- **`.env.local`** contains secrets that should never be committed (database passwords, API keys, OAuth credentials). This file is gitignored. Each developer creates their own from `.env.example`.
- **Vercel (staging/production)**: Secrets are set in the Vercel dashboard under **Project Settings > Environment Variables**. Vercel ignores `.env.local` — it uses `.env.production` for defaults and dashboard variables for secrets. You can scope variables to Preview, Production, or Development environments.

### Adding a new env variable

1. Add it to `.env.example` with an empty value and a comment
2. If it's a non-secret default, add it to `.env.development` and/or `.env.production`
3. If it's a secret, add it to your `.env.local` and to Vercel's environment variables
4. For client-side access, prefix with `NEXT_PUBLIC_`

### Deployment

Vercel auto-deploys from `main` on every push. Secrets are set in the Vercel dashboard under **Project Settings > Environment Variables** — Vercel ignores `.env.local` and uses `.env.production` for non-secret defaults.

Before pushing, run lint and tests locally:

```bash
npm run lint && npm run test:run
```

## Project Structure

```
src/
  app/            # Next.js App Router pages and layouts
  features/       # Feature modules (components, hooks, tests co-located)
  lib/            # Shared utilities (trpc, email, validations)
  generated/      # Prisma generated client
prisma/
  schema.prisma   # Database schema
```
