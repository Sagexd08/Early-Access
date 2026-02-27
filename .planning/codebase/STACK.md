# Technology Stack

**Analysis Date:** 2026-02-27

## Languages

**Primary:**
- TypeScript 5.x - All source code and configurations
- JavaScript - Configuration files (ESM modules)

**Secondary:**
- CSS - Styling via Tailwind CSS
- HTML - Template markup in React components

## Runtime

**Environment:**
- Node.js 22.17.1

**Package Manager:**
- pnpm - Workspace-based monorepo management
- Lockfile: `pnpm-lock.yaml` (present)
- Workspace config: `pnpm-workspace.yaml`

## Frameworks

**Core:**
- Next.js (latest) - Full-stack React framework for SSR/SSG and API routes
- React 19.2.0 - UI component library
- React DOM 19.2.0 - DOM rendering

**UI Components:**
- Radix UI (14 packages @ v1.1-2.2) - Unstyled, accessible component primitives
  - Includes: dialog, dropdown, select, tabs, popover, tooltip, accordion, slider, and more
- Lucide React 0.454.0 - Icon library

**Animation & Motion:**
- Framer Motion 12.23.26 - Declarative animations
- GSAP 3.14.1 - Advanced animation library
- Tailwind CSS Animate 1.0.7 - Animation utilities

**Styling:**
- Tailwind CSS 4.1.9 - Utility-first CSS framework
- PostCSS 8.5 - CSS transformation with autoprefixer
- Class Variance Authority 0.7.1 - Type-safe component variant management
- Tailwind Merge 3.3.1 - Merge conflicting Tailwind classes
- clsx 2.1.1 - Conditional classname builder

**Forms & Validation:**
- React Hook Form 7.60.0 - Performant form state management
- Zod 3.25.76 - TypeScript-first schema validation
- @hookform/resolvers 3.10.0 - Validation resolver adapters

**Utilities:**
- Date-fns 4.1.0 - Date manipulation
- Lenis 1.3.15 - Smooth scrolling library
- OGL 1.0.11 - WebGL rendering library
- Embla Carousel React 8.5.1 - Carousel/slider component
- React Resizable Panels 2.1.7 - Draggable panel layout
- Recharts 2.15.4 - Charting library
- Sonner 1.7.4 - Toast notifications
- Vaul 1.1.2 - Drawer component
- React Day Picker 9.8.0 - Calendar date picker
- Input OTP 1.4.1 - OTP input component
- Next Themes 0.4.6 - Theme switching

**Email:**
- Nodemailer 7.0.13 - SMTP email sending

## Key Dependencies

**Critical:**
- @prisma/client 5.22.0 - ORM for PostgreSQL database operations
- @supabase/supabase-js 2.93.2 - Supabase client SDK for database and auth
- prisma 5.22.0 (dev) - ORM code generation and migrations

**Infrastructure:**
- @vercel/analytics 1.3.1 - Web vitals and performance tracking
- @emotion/is-prop-valid (latest) - Emotion CSS-in-JS helper
- @nuxt/kit (latest) - Nuxt utilities (likely unused in Next.js project)

## Configuration

**Environment:**
- Configuration via `.env` and `.env.local` files (secrets not included)
- Required vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `NEXT_PUBLIC_BASE_URL`

**Build:**
- Next.js config: `next.config.mjs`
  - TypeScript build errors ignored
  - Image optimization disabled
  - Console removal in production
  - TurboPack enabled with package import optimization for `@radix-ui`, `lucide-react`, `framer-motion`
- PostCSS config: `postcss.config.mjs`
  - Uses `@tailwindcss/postcss` plugin v4
- TypeScript config: `tsconfig.json`
  - Target: ES6
  - Module resolution: bundler
  - JSX: react-jsx
  - Path alias: `@/*` maps to root directory

## Platform Requirements

**Development:**
- Node.js 22.17.1+
- pnpm 8.0+

**Production:**
- Vercel (via `@vercel/analytics` dependency suggests deployment target)
- PostgreSQL database (via Prisma/Supabase)
- SMTP server for email (Gmail default with `smtp.gmail.com`)

---

*Stack analysis: 2026-02-27*
