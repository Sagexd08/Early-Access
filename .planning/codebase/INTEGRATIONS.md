# External Integrations

**Analysis Date:** 2026-02-27

## APIs & External Services

**Database Backend:**
- Supabase - Postgres-based backend-as-a-service
  - SDK/Client: `@supabase/supabase-js` v2.93.2
  - Client library: `lib/supabase.ts`
  - Service: `lib/database.ts`
  - Auth: Public key (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) for client-side
  - Auth: Service key (`SUPABASE_SERVICE_ROLE_KEY`) for server-side operations

**Analytics:**
- Vercel Analytics - Web performance and vitals tracking
  - Package: `@vercel/analytics` v1.3.1
  - Integration: `app/layout.tsx` line 4, 74
  - Tracks: Page views, Web Core Vitals, performance metrics

## Data Storage

**Databases:**
- PostgreSQL (via Supabase)
  - Connection: `DATABASE_URL` (implicit via Supabase)
  - ORM: Prisma 5.22.0
  - Schema: `prisma/schema.prisma`
  - Table: `early_access_signups` - stores email signup data
    - Fields: id (UUID), email (unique), confirmation_token, confirmed (boolean), created_at, confirmed_at, source, user_agent, ip_address, updated_at
    - Client: `@prisma/client` v5.22.0

**File Storage:**
- Not detected - Local filesystem only or external service not yet integrated

**Caching:**
- Not detected - No caching layer configured

## Authentication & Identity

**Auth Provider:**
- Custom implementation via Supabase
  - Approach: Email-based confirmation flow with tokens
  - Confirmation tokens: Generated via `crypto.randomBytes(32).toString('hex')` in `app/api/subscribe/route.ts` line 47
  - Implementation files: `app/api/subscribe/route.ts`, `app/api/confirm/route.ts`
  - Service role key required for server-side authentication operations

## Monitoring & Observability

**Error Tracking:**
- Not detected - No error tracking service (Sentry, Rollbar, etc.)

**Logs:**
- Console logging only - `console.log()` and `console.error()` statements
- Production console removal enabled via Next.js config (`removeConsole: true` for NODE_ENV=production)

## CI/CD & Deployment

**Hosting:**
- Vercel - Inferred from `@vercel/analytics` dependency and Next.js best practices

**CI Pipeline:**
- Not detected - No CI configuration files found

## Environment Configuration

**Required env vars:**
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL (public)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key (public)
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (secret, server-only)
- `SMTP_HOST` - SMTP server hostname (default: smtp.gmail.com)
- `SMTP_PORT` - SMTP port (default: 465)
- `SMTP_USER` - SMTP username/email address
- `SMTP_PASSWORD` - SMTP password (secret)
- `NEXT_PUBLIC_BASE_URL` - Application base URL for confirmation links (default: http://localhost:3000)

**Optional env vars:**
- `NODE_ENV` - Controls console removal and build behavior

**Secrets location:**
- `.env` and `.env.local` files (not committed to version control)
- Server-only secrets: `SUPABASE_SERVICE_ROLE_KEY`, `SMTP_PASSWORD`

## Email Service

**Provider:**
- Nodemailer 7.0.13 - SMTP-based email client
- Configuration: `lib/email-service.ts`
- Default provider: Gmail SMTP (smtp.gmail.com:465)
- Supported providers: Any SMTP server via environment configuration

**Email Sending:**
- Implementation: `lib/email-service.ts`
  - Function: `emailService.sendEmail({ to, subject, html })`
  - Transporter configured in `lib/email-service.ts` lines 4-12

**Email Templates:**
- Location: `lib/email-templates.ts`
- Template types:
  - Welcome email - Sent on signup with confirmation link
  - Confirmation email - Sent after email confirmation
- Confirmation link format: `{NEXT_PUBLIC_BASE_URL}/confirm?token={token}&email={email}`

## Webhooks & Callbacks

**Incoming:**
- `/api/subscribe` (POST) - Email signup endpoint (`app/api/subscribe/route.ts`)
  - Accepts: `{ email, source? }`
  - Returns: Success message or error
- `/api/confirm` (GET) - Email confirmation link (`app/api/confirm/route.ts`)
  - Query params: `token`, `email`
  - Redirects to: `/confirmed` or `/early-access?error=...`

**Outgoing:**
- None detected - No external webhook calls

## Data Flow Architecture

**Signup Flow:**
1. User submits email via frontend form
2. POST to `/api/subscribe`
3. Validation: Email format check
4. Duplicate check: Query Supabase `early_access_signups` table
5. Token generation: `crypto.randomBytes(32).toString('hex')`
6. Insert to database: `early_access_signups` with `confirmation_token`
7. Send welcome email via Nodemailer SMTP with confirmation link
8. Return success response

**Confirmation Flow:**
1. User clicks confirmation link from email
2. GET `/api/confirm?token={token}&email={email}`
3. Update database: Set `confirmed=true`, `confirmed_at=now()`
4. Send confirmation success email
5. Redirect to `/confirmed` page

**Database Queries:**
- Supabase client: `lib/supabase.ts` - Uses public key (client-side)
- Supabase service: `lib/database.ts` - Uses service key for privileged operations
- API routes: Direct Supabase client creation with service key for security

---

*Integration audit: 2026-02-27*
