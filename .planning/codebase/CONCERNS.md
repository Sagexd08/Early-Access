# Codebase Concerns

**Analysis Date:** 2026-02-27

## Tech Debt

**TypeScript Compiler Errors Ignored:**
- Issue: `tsconfig.json` has `skipLibCheck: true` and `next.config.mjs` has `typescript: { ignoreBuildErrors: true }` - errors are silently ignored during builds
- Files: `tsconfig.json`, `next.config.mjs`, `app/`, `components/`, `lib/`
- Impact: Type errors in production code are hidden, increasing risk of runtime failures
- Fix approach: Enable strict type checking, fix underlying issues, remove error ignore flags

**Unsafe `any` Type Usage:**
- Issue: `lib/database.ts` line 18 uses `data?: any` return type
- Files: `lib/database.ts`
- Impact: Loss of type safety in database operations; consumers don't know what data shape to expect
- Fix approach: Replace `any` with specific type definitions matching EarlyAccessSignup model

**Loose Error Handling:**
- Issue: Database operations catch errors broadly but return generic error messages
- Files: `lib/database.ts` (lines 40-42, 60-62, 88-90, 122-123)
- Impact: Difficult to debug issues; errors swallowed silently
- Fix approach: Log detailed error context before returning to client

## Known Issues

**Email Confirmation Token Not Verified:**
- Symptoms: Invalid tokens could theoretically bypass confirmation if timing exploited
- Files: `app/api/subscribe/route.ts`, `app/api/confirm/route.ts`
- Trigger: Client-side validation only; database constraint missing
- Workaround: Database unique constraint on confirmation_token would prevent duplicates

**Plasma Component Performance Risk:**
- Symptoms: Complex GLSL fragment shader with 40 iterations, aggressive WebGL 2 rendering
- Files: `components/plasma.tsx`
- Trigger: Large viewports, low-end devices, high pixel density (dpr capped at 1.5)
- Cause: Shader complexity (line 61: `for (vec2 r = iResolution.xy, Q; ++i < 40.; ...)`) with no adaptive LOD
- Improvement path: Add device capability detection, reduce iterations on mobile, implement shader LOD

**Unchecked Responsive Behavior in Signals Section:**
- Symptoms: Touch momentum scrolling logic complex with state mutations
- Files: `components/signals-section.tsx` (lines 49-180)
- Trigger: Touch events on momentum-enabled device with rapid gesture changes
- Cause: Manual momentum calculation with requestAnimationFrame; potential race conditions
- Risk: Smooth scrolling jank or stuck scroll state if momentum ID not properly cancelled

## Security Considerations

**Email Service SMTP Credentials Exposure Risk:**
- Risk: SMTP credentials passed as environment variables but no validation of secure transport
- Files: `lib/email-service.ts` (lines 4-12)
- Current mitigation: Uses secure: true for SMTP (line 7), but no TLS certificate verification
- Recommendations:
  - Validate SMTP_HOST against whitelist
  - Add certificate pinning for Gmail SMTP
  - Rotate credentials regularly (not visible in .env files, but process should enforce this)

**Email Confirmation Link Includes Query Parameters:**
- Risk: Token and email exposed in URL (can be logged, shared)
- Files: `lib/email-templates.ts` (link generation), `app/api/confirm/route.ts`
- Current mitigation: Single-use token, time could be added
- Recommendations:
  - Add token expiration (e.g., 24 hours)
  - Consider POST-based confirmation with encrypted payload
  - Rate limit confirmation attempts per email

**Missing CSRF Protection on Email Signup:**
- Risk: POST endpoint `/api/subscribe` has no CSRF token validation
- Files: `app/api/subscribe/route.ts`
- Current mitigation: None (JSON body required, but not sufficient for form submissions)
- Recommendations: Implement SameSite cookie policy, consider CSRF tokens for state-changing operations

**No Input Sanitization on Email Field:**
- Risk: Email stored as-is after regex validation (no HTML entity escaping)
- Files: `app/api/subscribe/route.ts` (line 16: simple email regex)
- Current mitigation: Email regex is basic; Unicode domains pass through
- Recommendations: Use well-tested email validation library (e.g., email-validator), sanitize before template rendering

## Performance Bottlenecks

**Multiple Plasma Instances:**
- Problem: Both `app/page.tsx` and `app/early-access/page.tsx` render Plasma background; no reuse
- Files: `app/page.tsx`, `app/early-access/page.tsx`
- Cause: Separate WebGL contexts, each with full shader compilation
- Improvement path: Implement SharedPlasmaProvider or centralize Plasma to layout if needed on both pages

**Email Templates Not Memoized:**
- Problem: `lib/email-templates.ts` (691 lines) generates HTML strings on every email send
- Files: `lib/email-templates.ts`, `app/api/subscribe/route.ts` (line 71)
- Cause: Template functions called without caching
- Improvement path: Cache compiled template or use template literals with CSS-in-JS

**GSAp Timelines Not Cleaned Up Properly:**
- Problem: `components/lumeo-animation.tsx` and `components/signals-section.tsx` use multiple gsap.timeline() calls
- Files: `components/lumeo-animation.tsx` (lines 23, 97), `components/signals-section.tsx`
- Cause: Timeline memory not explicitly freed
- Improvement path: Add explicit `tl.kill()` in cleanup functions, audit animation count on long pages

**15 Console Statements in Production Code:**
- Problem: console.log/error calls left in source files (caught by removeConsole in prod, but wasteful)
- Files: `app/api/subscribe/route.ts` (2), `app/api/confirm/route.ts` (1), `lib/email-service.ts` (2), `lib/database.ts` (5)
- Cause: Debug logging not removed before commit
- Improvement path: Use structured logging library (e.g., pino, winston), enforce pre-commit hooks

## Fragile Areas

**Database Signup Flow:**
- Files: `app/api/subscribe/route.ts`, `lib/database.ts`, `prisma/schema.prisma`
- Why fragile:
  - Race condition possible if same email submitted twice rapidly (no deduplication at API layer)
  - Confirmation token not indexed (slow queries on large tables)
  - No cascade delete if user record is removed
- Safe modification:
  - Add unique constraint on (email, confirmation_token) in database
  - Index confirmation_token column
  - Add created_at TTL index for expired tokens
- Test coverage: No test files found for API routes or database logic

**Sidebar State Management:**
- Files: `components/ui/sidebar.tsx` (726 lines)
- Why fragile:
  - Cookie-based state sync (line 86: `document.cookie = ...`) with no validation
  - localStorage/cookie desync possible on multi-tab sessions
  - Mobile sidebar state separate from desktop (openMobile vs open state)
- Safe modification: Add state serialization tests, validate cookie format before parsing
- Test coverage: No tests for sidebar state persistence

**Touch Event Handlers in Signals:**
- Files: `components/signals-section.tsx`
- Why fragile:
  - Manual touch event handling with momentum calculation prone to edge cases
  - touchState ref mutation without validation
  - No passive event listener flags (may cause scroll jank)
- Safe modification: Add `{ passive: true }` to touch listeners, add unit tests for momentum calculations
- Test coverage: Component test exists (`components/__tests__/colophon-section.test.tsx`) but signals-section not tested

## Scaling Limits

**Supabase Connection Pooling:**
- Current capacity: Default client created per request in API routes
- Limit: Single Supabase client instance shared globally could exhaust connection pool on high traffic
- Files: `lib/database.ts` (line 11: global supabase instance)
- Scaling path: Implement connection pooling, use Supabase Realtime auth, consider Prisma as ORM layer

**WebGL Context Limit:**
- Current capacity: Each Plasma instance creates new WebGL 2 context
- Limit: Browsers limit 8-16 WebGL contexts per tab
- Files: `components/plasma.tsx` (line 118: new Renderer)
- Scaling path: Implement context sharing or offscreen canvas pooling

**Email Service Rate Limiting:**
- Current capacity: No rate limit enforcement
- Limit: SMTP provider (Gmail) will throttle after ~100 emails/min
- Files: `app/api/subscribe/route.ts`, `lib/email-service.ts`
- Scaling path: Add Redis-based rate limiting, queue emails with job processor (Bull, RabbitMQ)

## Dependencies at Risk

**Prisma Configuration Mismatch:**
- Risk: `prisma/schema.prisma` uses PostgreSQL but app also uses Supabase SDK directly
- Impact: Two different database clients; data consistency issues, duplicate migrations
- Files: `prisma/schema.prisma`, `lib/database.ts`, `lib/supabase.ts`, API routes
- Migration plan: Consolidate to single ORM (Prisma + PrismaClientJS OR Supabase SDK only, not both)

**Next.js Latest Version Pinning:**
- Risk: `package.json` specifies `"next": "latest"` - unpredictable updates
- Impact: Breaking changes on deployment, untested versions in production
- Files: `package.json` (line 56)
- Migration plan: Pin to specific minor version (e.g., `^14.2.0`)

**Unversioned Dependencies:**
- Risk: `@emotion/is-prop-valid`, `@nuxt/kit` pinned to `latest` instead of specific versions
- Impact: Transitive dependency version mismatches, yarn lockfile conflicts
- Files: `package.json` (lines 12, 14)
- Migration plan: Run `npm update` with lock flag, pin all to caret ranges

## Missing Critical Features

**No Error Boundary Component:**
- Problem: Missing error handling for component render failures
- Blocks: Can't gracefully handle client-side component crashes (e.g., Plasma WebGL failure)
- Impact: Entire page goes white on error
- Solution: Implement React Error Boundary, add fallback UI

**No Analytics or Monitoring:**
- Problem: No tracking of early access signups, confirmation rates, or errors
- Blocks: Can't measure feature success or debug production issues
- Impact: Blind to user problems
- Solution: Add Sentry for error tracking, Mixpanel/Plausible for signup analytics

**No Email Delivery Verification:**
- Problem: Email sent status not checked, bounces not handled
- Blocks: Bounced emails not retried, undeliverable addresses not marked
- Impact: Users may not receive confirmation links
- Solution: Implement webhook handler for email delivery notifications, add bounce tracking

**No Rate Limiting on API Endpoints:**
- Problem: `/api/subscribe` and `/api/confirm` have no rate limit
- Blocks: Vulnerable to email enumeration, brute force confirmation attacks
- Impact: Spam signups, account takeover risk
- Solution: Add Redis-based rate limiting per IP, per email

## Test Coverage Gaps

**API Route Testing:**
- What's not tested: `/api/subscribe` and `/api/confirm` endpoints
- Files: `app/api/subscribe/route.ts`, `app/api/confirm/route.ts`
- Risk: Regression bugs in signup flow, database error handling untested
- Priority: High

**Email Service Testing:**
- What's not tested: Email template generation, SMTP transporter, sendEmail function
- Files: `lib/email-service.ts`, `lib/email-templates.ts`
- Risk: Malformed HTML in emails, SMTP failures not caught early
- Priority: High

**Database Service Methods:**
- What's not tested: All DatabaseService methods (createSignup, findSignupByEmail, confirmSignup, getSignupStats)
- Files: `lib/database.ts`
- Risk: Silent failures, wrong data returned, edge cases unhandled
- Priority: High

**Complex Component Interactions:**
- What's not tested: Signals momentum scrolling, touch events, Lumeo animation sequencing
- Files: `components/signals-section.tsx`, `components/lumeo-animation.tsx`, `components/plasma.tsx`
- Risk: Mobile user experience broken without detection
- Priority: Medium

**Keyboard Navigation Hook:**
- What's not tested: useKeyboardNavigation focus management, tab trapping, escape handling
- Files: `lib/use-keyboard-navigation.ts`
- Risk: Accessibility regressions, keyboard users locked in components
- Priority: Medium

---

*Concerns audit: 2026-02-27*
