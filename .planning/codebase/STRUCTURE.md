# Codebase Structure

**Analysis Date:** 2026-02-27

## Directory Layout

```
project-root/
├── app/                    # Next.js App Router pages and API routes
│   ├── api/               # Server API endpoints
│   │   ├── subscribe/     # Email signup endpoint
│   │   └── confirm/       # Email confirmation endpoint
│   ├── early-access/      # Early access landing page
│   ├── confirm/           # Confirmation status page
│   ├── confirmed/         # Success confirmation page
│   ├── page.tsx           # Home page (/)
│   ├── layout.tsx         # Root layout with global setup
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # Base UI components (Radix UI wrapped)
│   ├── *.tsx             # Feature/section components
│   └── __tests__/        # Component tests
├── hooks/                # React hooks (reusable hooks directory)
├── lib/                  # Utility functions, services, hooks
│   ├── email-service.ts         # Email delivery service
│   ├── email-templates.ts       # HTML email templates
│   ├── supabase.ts              # Supabase client initialization
│   ├── database.ts              # Database utilities (if any)
│   ├── database.types.ts        # Supabase-generated types
│   ├── use-keyboard-navigation.ts  # Accessibility hooks
│   ├── utils.ts                 # Helper functions (cn for classname merging)
├── prisma/              # Database schema and migrations
├── public/              # Static assets (images, favicon, etc.)
├── styles/              # Global and component styles
├── .planning/           # GSD planning documents (created by orchestrator)
├── .agent/              # Agent configuration and skills (external)
├── .next/               # Next.js build output (gitignored)
├── node_modules/        # Dependencies (gitignored)
├── package.json         # Dependencies and scripts
├── pnpm-lock.yaml       # Lockfile for pnpm
├── tsconfig.json        # TypeScript configuration
├── next.config.mjs      # Next.js configuration
├── postcss.config.mjs   # PostCSS configuration
└── components.json      # Shadcn UI configuration
```

## Directory Purposes

**app:**
- Purpose: Next.js App Router pages, layouts, and API routes
- Contains: Page components (`.tsx`), API route handlers (`route.ts`), layout files
- Key files: `app/page.tsx` (home), `app/layout.tsx` (root), `app/early-access/page.tsx` (main landing), `app/api/subscribe/route.ts` (signup API), `app/api/confirm/route.ts` (confirmation API)

**components:**
- Purpose: All React components, both feature-specific and reusable
- Contains: Feature components (sections, animations), UI primitives, test files
- Key files: `hero-section.tsx`, `signals-section.tsx`, `work-section.tsx`, `plasma.tsx` (WebGL background), `smooth-scroll.tsx` (scroll handler)

**components/ui:**
- Purpose: Base UI components built on Radix UI
- Contains: 56+ wrapped Radix UI components and custom UI primitives
- Examples: `button.tsx`, `card.tsx`, `dialog.tsx`, `form.tsx`, `input.tsx`, `select.tsx`
- Pattern: Each file exports a component that wraps Radix UI with Tailwind styling

**lib:**
- Purpose: Services, utilities, hooks, and helper functions
- Contains: Email service, Supabase client, custom hooks, type definitions, utility functions
- Key files: `email-service.ts` (nodemailer wrapper), `supabase.ts` (client), `use-keyboard-navigation.ts` (accessibility), `utils.ts` (cn function)

**hooks:**
- Purpose: Additional React hooks (separate from lib hooks)
- Contains: `use-mobile.ts` (responsive hook), `use-toast.ts` (toast notifications)

**prisma:**
- Purpose: Database schema definition
- Contains: `schema.prisma` (Prisma schema), migrations (in `.prisma/migrations/`)
- Database: PostgreSQL via Supabase

**public:**
- Purpose: Static assets served directly by Next.js
- Contains: Images, favicon, SEO assets
- Key files: `favicon.ico`

**styles:**
- Purpose: Global stylesheet
- Contains: `globals.css` with Tailwind directives, CSS variables for theme

## Key File Locations

**Entry Points:**
- `app/layout.tsx`: Root HTML wrapper, font loading, global providers
- `app/page.tsx`: Home page at `/`
- `app/early-access/page.tsx`: Main landing page at `/early-access`
- `next.config.mjs`: Next.js build configuration

**Configuration:**
- `tsconfig.json`: TypeScript compiler options and path aliases (` @/*` → root)
- `postcss.config.mjs`: PostCSS + Tailwind configuration
- `components.json`: Shadcn UI component registry
- `package.json`: Dependencies and npm scripts

**Core Logic:**
- `lib/supabase.ts`: Supabase client initialization
- `lib/email-service.ts`: Email sending via nodemailer
- `app/api/subscribe/route.ts`: Signup workflow (validate, check duplicates, generate token, send email)
- `app/api/confirm/route.ts`: Confirmation workflow (validate token, mark confirmed, send success email)

**Testing:**
- `components/__tests__/`: Component test files (if present)

## Naming Conventions

**Files:**
- Components: `PascalCase.tsx` (e.g., `HeroSection.tsx`, `CountdownTimer.tsx`)
- Pages: `page.tsx` (Next.js convention, lowercase)
- API routes: `route.ts` (Next.js convention, lowercase)
- Utilities/services: `kebab-case.ts` (e.g., `email-service.ts`, `use-keyboard-navigation.ts`)
- Hooks: `use-*` pattern (e.g., `use-mobile.ts`, `use-keyboard-navigation.ts`)

**Directories:**
- Feature directories: `kebab-case` (e.g., `components/ui`, `app/api`)
- Component names: `PascalCase` (e.g., `HeroSection`, not `hero-section`)

**TypeScript/JavaScript:**
- Types: `PascalCase` (e.g., `PlasmaProps`, `SendEmailOptions`)
- Variables/functions: `camelCase` (e.g., `emailInputRef`, `handleEmailSubmit`)
- Constants: `UPPER_SNAKE_CASE` (e.g., `GRID_DOT_ACCENT`)
- CSS classes: `kebab-case` (Tailwind defaults)

## Where to Add New Code

**New Feature (Multi-section):**
- Primary code: `components/[feature-name].tsx` (or split into `components/[feature]/index.tsx` + subcomponents)
- Page route: `app/[feature]/page.tsx`
- Tests: `components/__tests__/[feature].test.tsx`
- Styles: Inline Tailwind classes in components; extract to `styles/` if shared globally

**New Component/Module:**
- Implementation: `components/[component-name].tsx`
- UI primitive: `components/ui/[component-name].tsx` (if reusable base component)
- Custom hook: `lib/use-[hook-name].ts` or `hooks/use-[hook-name].ts`

**API Endpoint:**
- Location: `app/api/[endpoint-name]/route.ts`
- Services: Extract shared logic to `lib/` (e.g., email service, database service)

**Utilities:**
- Shared helpers: `lib/utils.ts`
- Service classes: `lib/[service-name].ts` (e.g., `lib/email-service.ts`)
- Custom hooks: `lib/use-[feature].ts`

**Database Model:**
- Schema: Add model to `prisma/schema.prisma`
- Types: Generated in `lib/database.types.ts` by Supabase (auto-generated, don't edit)
- Migrations: Run `prisma migrate dev --name [name]` to create migration

**Styling:**
- Component styles: Tailwind classes in JSX (prefer inline over CSS files)
- Global styles: Add to `styles/globals.css`
- CSS variables: Define in `styles/globals.css` or component-level style tags

## Special Directories

**node_modules:**
- Purpose: Package dependencies
- Generated: Yes (via pnpm install)
- Committed: No (.gitignore)

**.next:**
- Purpose: Next.js build output and dev server cache
- Generated: Yes (during build and dev)
- Committed: No (.gitignore)

**.agent:**
- Purpose: Agent configuration and skill templates (external tool directory)
- Generated: No (version controlled)
- Committed: Yes

**.planning:**
- Purpose: GSD planning documents generated by orchestrator
- Generated: Yes (by /gsd:map-codebase and /gsd:plan-phase)
- Committed: No (.gitignore)

**prisma/.prisma:**
- Purpose: Prisma migrations and generated artifacts
- Generated: Yes (auto-generated on migrate)
- Committed: Yes (migrations are versioned)

## Path Aliases

TypeScript path alias defined in `tsconfig.json`:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

**Usage:**
- Import from root: `import { Button } from "@/components/ui/button"`
- Import from lib: `import { emailService } from "@/lib/email-service"`
- Import from hooks: `import { useFocusAnnouncement } from "@/lib/use-keyboard-navigation"`

## Project Conventions

**Dynamic Imports:**
- Heavy client components marked with `ssr: false`: Plasma, SignalsSection, WorkSection, PrinciplesSection, ColophonSection
- Server-safe components marked with `ssr: true`: HeroSection
- Pattern: `const Component = dynamic(() => import('@/path').then(m => m.ComponentName), { ssr: boolean })`

**Client vs Server Components:**
- `"use client"` directive at top of components requiring React hooks, event handlers, browser APIs
- Server components used for layout and static content
- Streaming/Suspense used for async components in confirm page

**Environment Variables:**
- `.env.local`: Local development secrets (ignored in git)
- Required vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `DATABASE_URL`

---

*Structure analysis: 2026-02-27*
