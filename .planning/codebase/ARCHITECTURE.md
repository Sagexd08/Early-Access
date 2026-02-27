# Architecture

**Analysis Date:** 2026-02-27

## Pattern Overview

**Overall:** Next.js App Router with client-side interactivity, server-side API routes, and external service integrations

**Key Characteristics:**
- Server-side rendering (SSR) for initial page load with dynamic imports for client-heavy components
- Client-side form handling with real-time validation and feedback
- Email-based early access signup workflow with token-based confirmation
- WebGL-based animation and graphics rendering for visual effects
- Accessibility-first design with keyboard navigation and screen reader support

## Layers

**Presentation Layer:**
- Purpose: Render UI components with interactive elements and animations
- Location: `components/`, `app/` (page components)
- Contains: React components (both server and client), UI primitives, animated elements, sections
- Depends on: framer-motion, gsap, Next.js dynamic imports, utility functions
- Used by: Page routes in `app/`

**API Layer:**
- Purpose: Handle HTTP requests for subscription and confirmation workflows
- Location: `app/api/subscribe/route.ts`, `app/api/confirm/route.ts`
- Contains: Next.js API routes with request validation and external service integration
- Depends on: Supabase client, email service, crypto utilities
- Used by: Client-side forms and email confirmation links

**Service Layer:**
- Purpose: Manage external integrations and business logic
- Location: `lib/email-service.ts`, `lib/supabase.ts`
- Contains: Service classes and utilities for email delivery and database operations
- Depends on: nodemailer, Supabase SDK
- Used by: API routes and client-side hooks

**Data Layer:**
- Purpose: Define database schema and types
- Location: `prisma/schema.prisma`, `lib/database.types.ts`
- Contains: Prisma schema and generated TypeScript types
- Depends on: PostgreSQL database via Supabase
- Used by: API routes for data persistence

**Utilities & Hooks:**
- Purpose: Provide reusable logic for accessibility, keyboard navigation, form handling
- Location: `lib/` (utilities, hooks), `hooks/` (component hooks)
- Contains: Custom React hooks, utility functions, type definitions
- Depends on: React APIs, DOM APIs
- Used by: Components and pages throughout the application

## Data Flow

**Email Signup Flow:**

1. User enters email in HeroSection component (`components/hero-section.tsx`)
2. Form submission calls `POST /api/subscribe` with email and source metadata
3. API route validates email format, checks for duplicates in database
4. If new signup, generates confirmation token and stores in Supabase `early_access_signups` table
5. Sends welcome email via nodemailer with confirmation link containing token
6. Client receives success message and announces via screen reader
7. User clicks confirmation link in email (points to `/api/confirm?token=X&email=Y`)
8. Confirmation route updates database to mark email as confirmed
9. Sends confirmation success email
10. Redirects user to `/confirmed` page showing success state

**Page Navigation Flow:**

1. User navigates to `/early-access` or `/` (home page)
2. Next.js serves root layout (`app/layout.tsx`) with global fonts and providers
3. Plasma background component loads via dynamic import (client-side only)
4. Page component dynamically imports sections (HeroSection, SignalsSection, WorkSection, PrinciplesSection, ColophonSection)
5. SideNav component provides navigation between sections
6. Client-side JavaScript sets up keyboard shortcuts (Alt + 1-5 for section navigation, Esc to return to top)
7. GSAP animations trigger on scroll using ScrollTrigger plugin
8. Accessibility hooks announce section transitions to screen readers

**State Management:**

- Form state (email input, loading, messages) managed at component level with `useState`
- Keyboard navigation state managed via custom hooks (`useKeyboardNavigation`, `useRovingTabIndex`)
- Focus announcements managed via `useFocusAnnouncement` hook
- No global state management library (Context API not used)

## Key Abstractions

**Section Components:**
- Purpose: Modular page sections with independent styling, animations, and interactivity
- Examples: `components/hero-section.tsx`, `components/signals-section.tsx`, `components/work-section.tsx`, `components/principles-section.tsx`, `components/colophon-section.tsx`
- Pattern: Each section is a client component with useEffect-based GSAP animations, useRef for DOM references, responsive grid layouts

**Service Layer Pattern:**
- Purpose: Abstract external dependencies (email, database)
- Examples: `lib/email-service.ts` (emailService singleton), `lib/supabase.ts` (supabase client)
- Pattern: Exported objects/functions that encapsulate service initialization and provide typed interfaces

**Custom Hooks for Accessibility:**
- Purpose: Centralize keyboard navigation and focus management logic
- Examples: `lib/use-keyboard-navigation.ts` (useKeyboardNavigation, useFocusAnnouncement, useSkipLinks, useFocusTrap, useRovingTabIndex)
- Pattern: Hook-based utilities that manage event listeners, DOM manipulation, and focus state

**UI Component Library:**
- Purpose: Provide base components built on Radix UI primitives
- Location: `components/ui/`
- Pattern: Radix UI wrapped with custom styling, exported as composable primitives (Button, Card, Dialog, Alert, etc.)

**Dynamic Imports:**
- Purpose: Reduce initial bundle size by lazy-loading heavy components
- Examples: Plasma background (marked with `ssr: false`), Section components (marked with `ssr: true`)
- Pattern: `dynamic(() => import(...).then(m => m.ComponentName), { ssr: boolean })`

## Entry Points

**Root Layout:**
- Location: `app/layout.tsx`
- Triggers: Every page request
- Responsibilities: Font loading, global metadata, accessibility skip links, SmoothScroll wrapper, Analytics

**Home Page:**
- Location: `app/page.tsx`
- Triggers: `/` route
- Responsibilities: Render Plasma background with LumeoAnimation overlay

**Early Access Page:**
- Location: `app/early-access/page.tsx`
- Triggers: `/early-access` route
- Responsibilities: Render full early access landing page with all sections, set up keyboard shortcuts, manage accessibility announcements

**API Subscribe:**
- Location: `app/api/subscribe/route.ts`
- Triggers: `POST /api/subscribe` request
- Responsibilities: Validate email, check for duplicates, generate token, store signup in database, send welcome email

**API Confirm:**
- Location: `app/api/confirm/route.ts`
- Triggers: `GET /api/confirm?token=X&email=Y` (from email link)
- Responsibilities: Validate token against database, mark email as confirmed, send confirmation email, redirect to success page

**Confirm Page:**
- Location: `app/confirm/page.tsx`
- Triggers: `/confirm` route
- Responsibilities: Display loading/success/error states while confirming email via API call

**Confirmed Page:**
- Location: `app/confirmed/page.tsx`
- Triggers: Redirect from `/api/confirm` after successful confirmation
- Responsibilities: Display confirmation success message

## Error Handling

**Strategy:** Multi-layer validation with user-friendly messages and console logging for debugging

**Patterns:**

- **Client-side form validation:** Email format check before API call, disabled submit button if email invalid
- **API validation:** Email format regex check, required field validation, error response with descriptive messages
- **Database errors:** Duplicate key errors handled gracefully (return 200 with "already signed up" message instead of 409)
- **Email service errors:** Try-catch blocks log errors to console, return 500 with generic error message to client
- **Confirmation flow:** Token/email mismatch returns 404-style redirect to error page, invalid link shows error page
- **Focus announcements:** Use screen reader announcement system (`useFocusAnnouncement`) to announce errors to accessible users

**Response Format:**
```json
{
  "success": true|false,
  "message": "Human-readable message",
  "error": "Only on failure"
}
```

## Cross-Cutting Concerns

**Logging:** Uses console methods (console.error, console.log) for debugging. Production builds remove console statements via Next.js config.

**Validation:**
- Email format: Regex pattern `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- Required fields: Checked at API layer before database operations
- Token validation: Checked against stored confirmation token in database

**Authentication:**
- No user authentication system
- Uses anonymous Supabase client for public database access
- Service role key used server-side for administrative operations (inserts, updates)
- API routes rely on database constraints (unique email) rather than auth middleware

**Keyboard Navigation:**
- Alt + 1-5: Jump to sections (hero, signals, work, principles, colophon)
- Alt + Escape: Return to top (alt + esc handled by hero section focus)
- Tab: Standard tab navigation through interactive elements
- Screen reader announcements on state changes

**Theme:**
- Dark mode hardcoded (`dark` class on html element)
- Color scheme: Gold accent (#c8921a), white foreground, black background
- Font stack: Montserrat (body), IBM Plex Sans (sans), IBM Plex Mono (monospace), Bebas Neue (display), Cormorant Garamond (serif), Space Mono (monospace)

---

*Architecture analysis: 2026-02-27*
