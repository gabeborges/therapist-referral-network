# Therapist Referral Network

A platform for therapists to refer clients to trusted colleagues in their professional network.

## Tech Stack

- **Framework:** Next.js 15 (App Router, React Server Components)
- **Language:** TypeScript (strict mode)
- **Database:** Supabase (Postgres) via Prisma 7
- **API:** tRPC
- **Auth:** Auth.js (Google OAuth)
- **Email:** Resend
- **Styling:** Tailwind CSS v4
- **Testing:** Vitest + Playwright

## Prerequisites

- Node.js 20+
- npm 10+
- A [Supabase](https://supabase.com) project
- A [Google OAuth](https://console.cloud.google.com) app (for authentication)
- A [Resend](https://resend.com) account (for transactional email)

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
   - **publishable key** — use for `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
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

| Command                                   | Description                        |
| ----------------------------------------- | ---------------------------------- |
| `npm run dev`                             | Start dev server (Turbopack)       |
| `npm run build`                           | Production build                   |
| `npm start`                               | Start production server            |
| `npm run lint`                            | Run ESLint                         |
| `npm run lint:fix`                        | Run ESLint with auto-fix           |
| `npm run format`                          | Format code with Prettier          |
| `npm run format:check`                    | Check formatting                   |
| `npm test`                                | Run unit tests (watch mode)        |
| `npm run test:run`                        | Run unit tests once                |
| `npm run test:coverage`                   | Run tests with coverage            |
| `npm run test:e2e`                        | Run Playwright E2E tests           |
| `npm run test:e2e:ui`                     | Run E2E tests with UI              |
| `npm run db:generate`                     | Regenerate Prisma client           |
| `npm run db:push`                         | Push schema to database            |
| `npm run db:migrate`                      | Run database migrations            |
| `npm run db:studio`                       | Open Prisma Studio                 |
| `npm run db:seed`                         | Seed the database                  |
| `npm run db:reset-user -- user@email.com` | Delete a local user and their data |

### Testing Locally

**Trigger the referral drip cron job:**

```bash
curl -X POST http://localhost:3000/api/cron/drip \
  -H "Authorization: Bearer CRON_SECRET"
```

Replace `CRON_SECRET` with the value from your `.env.local` file.

## Environments

The project uses two environments. Local development and Vercel preview deploys share the **dev** services. Production is fully separate.

|                  | Local                     | Staging (Vercel preview) | Production        |
| ---------------- | ------------------------- | ------------------------ | ----------------- |
| **Runs on**      | Your machine (`next dev`) | Vercel preview deploys   | Vercel production |
| **Supabase**     | Dev project               | Dev project              | Prod project      |
| **Google OAuth** | Dev credentials           | Dev credentials          | Prod credentials  |
| **Resend**       | Dev API key               | Dev API key              | Prod API key      |

### What you need to create

| Service       | Dev                                                 | Prod                                                               |
| ------------- | --------------------------------------------------- | ------------------------------------------------------------------ |
| Supabase      | 1 project (free tier)                               | 1 project                                                          |
| Google OAuth  | 1 client ID (redirect: `http://localhost:3000/...`) | 1 client ID (redirect: `https://therapistreferralnetwork.com/...`) |
| Resend        | 1 account — same key works for both                 | Same account                                                       |
| `AUTH_SECRET` | Generate one (`openssl rand -base64 32`)            | Generate a separate one                                            |

### Where secrets live

Secrets are **never** committed to the repo.

- **Locally** — in `.env.local` (gitignored)
- **Vercel (staging + production)** — in the Vercel dashboard under **Project Settings > Environment Variables**, scoped to Preview or Production

### Env file structure

Non-secret config that differs between environments is committed:

| File               | Purpose                                    | Committed? | Loaded when                   |
| ------------------ | ------------------------------------------ | ---------- | ----------------------------- |
| `.env.local`       | Your secrets                               | No         | Always (overrides everything) |
| `.env.development` | Non-secret defaults (app URL, drip config) | Yes        | `next dev`                    |
| `.env.production`  | Non-secret defaults for production         | Yes        | `next build` / `next start`   |
| `.env.example`     | Template listing all secret names          | Yes        | Never (reference only)        |

### Adding a new env variable

1. If it's a secret: add the name to `.env.example`, set the value in `.env.local` and in Vercel dashboard
2. If it's a non-secret default: add it to `.env.development` and/or `.env.production`
3. For client-side access, prefix with `NEXT_PUBLIC_`

### DNS & email setup (production)

Before going live, configure DNS records for the custom domain and email deliverability:

**Domain (Vercel)**

1. Add `therapistreferralnetwork.com` in Vercel Project Settings > Domains
2. Set a CNAME record: `www` → `cname.vercel-dns.com`
3. For apex domain, follow Vercel's A record instructions

**Email deliverability (Resend)**

1. In the Resend dashboard, add and verify `therapistreferralnetwork.com`
2. Add the DNS records Resend provides:
   - **SPF** — TXT record: `v=spf1 include:amazonses.com ~all`
   - **DKIM** — CNAME records (3 provided by Resend)
   - **DMARC** — TXT record: `v=DMARC1; p=quarantine; rua=mailto:dmarc@therapistreferralnetwork.com`
3. Wait for DNS propagation and verify in Resend dashboard

### Deployment

Vercel auto-deploys from `main` on every push. Preview deploys use variables scoped to "Preview" in the Vercel dashboard; production deploys use "Production" scoped variables.

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
