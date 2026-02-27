# Coding Conventions

**Analysis Date:** 2026-02-27

## Naming Patterns

**Files:**
- Components: PascalCase with `.tsx` extension (e.g., `hero-section.tsx`, `colophon-section.tsx`, `CountdownTimer.tsx`)
- Utilities/hooks: kebab-case with `.ts` extension (e.g., `use-keyboard-navigation.ts`, `email-service.ts`, `email-templates.ts`)
- UI components: lowercase with `.tsx` extension (e.g., `button.tsx`, `card.tsx`, `dialog.tsx`)
- Test files: match component name with `.test.tsx` suffix (e.g., `colophon-section.test.tsx`)

**Functions:**
- React components: PascalCase (e.g., `HeroSection`, `ColophonSection`, `AnimatedNoise`, `CountdownTimer`)
- Regular functions and utilities: camelCase (e.g., `handleEmailSubmit`, `calculateTimeLeft`, `runScrambleAnimation`)
- Exported objects/namespaces: camelCase (e.g., `emailService`)

**Variables:**
- Local state: camelCase (e.g., `email`, `isLoading`, `message`, `displayText`, `timeLeft`)
- Constants/configs: UPPER_SNAKE_CASE (e.g., `GRID_DOT_ACCENT`, `GLYPHS`)
- Boolean flags: prefixed with `is` or `has` (e.g., `isLoading`, `isAnimating`, `hasAnimated`)

**Types:**
- Interfaces: PascalCase prefixed with `I` or descriptive name (e.g., `AnimatedNoiseProps`, `ScrambleTextProps`, `SendEmailOptions`, `KeyboardNavigationOptions`)
- Type definitions: PascalCase (e.g., `ClassValue`, `VariantProps`)

## Code Style

**Formatting:**
- TypeScript strict mode enabled in `tsconfig.json`
- No explicit linter/formatter config detected (no ESLint, Prettier, or Biome configs)
- Consistent 2-space indentation observed
- Semicolons used throughout
- Double quotes for strings

**Imports:**
- Absolute imports using `@/` path alias (configured in `tsconfig.json`)
- React hooks imported from `react` (e.g., `useEffect`, `useRef`, `useState`, `useCallback`)
- External libraries organized at top

## Import Organization

**Order:**
1. React and core hooks (`import { useEffect, useRef, useState } from "react"`)
2. Third-party libraries (`import gsap from "gsap"`, `import { ScrollTrigger } from "gsap/ScrollTrigger"`, `import nodemailer from 'nodemailer'`)
3. Local components and utilities (`import { CountdownTimer } from "@/components/countdown-timer"`, `import { emailService } from "@/lib/email-service"`)
4. Types/interfaces (inline or separate imports)

**Path Aliases:**
- `@/*` → maps to root directory (e.g., `@/components`, `@/lib`, `@/styles`)

## Error Handling

**Patterns:**
- Try-catch blocks wrapping async operations: See `app/api/subscribe/route.ts` (lines 90-95)
- Error logging to console: `console.error()` used for critical errors
- User-facing error messages returned via NextResponse.json with error field
- Validation via regex patterns for email: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` in `app/api/subscribe/route.ts` (line 16)
- Null/undefined checks at component start: `if (!sectionRef.current || !contentRef.current) return`
- Optional chaining for DOM refs: `emailInputRef.current?.focus()`

## Logging

**Framework:** Console methods (console.log, console.error)

**Patterns:**
- Development logging: `console.log()` for informational messages (e.g., "Email sent: ...")
- Error logging: `console.error()` with context (e.g., "Subscription error:", error)
- No structured logging or external logging service detected
- Logging used in API routes and service functions, not typically in components

## Comments

**When to Comment:**
- Complex animation logic: See `hero-section.tsx` lines 12-13 explaining why static patterns are defined at module scope
- Algorithm explanations: See `scramble-text.tsx` lines 28-30 for scramble animation logic
- JSDoc comments for exported functions and components

**JSDoc/TSDoc:**
- Function documentation with parameter descriptions: See `use-keyboard-navigation.ts` line 5 with options documentation
- Props interfaces documented inline: `interface ScrambleTextProps { ... }` with property comments (lines 7-12 in `scramble-text.tsx`)
- Returns documented for hooks: See `useKeyboardNavigation` return object documentation

## Function Design

**Size:**
- Small, focused functions (most 20-50 lines)
- Larger components split into sub-components (e.g., `TimeUnit` and `Separator` in `countdown-timer.tsx`)

**Parameters:**
- Object destructuring for options/props: `{ opacity = 0.05, className }: AnimatedNoiseProps`
- Default parameters used: `duration = 0.9`, `delayMs = 0`
- Discriminated unions for component variants: `as?: "span" | "button" | "div"` in ScrambleText

**Return Values:**
- React components return JSX
- Hooks return objects with methods: `{ trapRef, activate, deactivate }`
- Service functions return booleans for success/failure: `emailService.sendEmail()` returns `Promise<boolean>`
- Async handlers return Promise implicitly

## Module Design

**Exports:**
- Named exports preferred for components: `export function HeroSection() { ... }`
- Named exports for utilities: `export const emailService = { ... }`
- Multiple exports from single file: `export { Button, buttonVariants }` in `ui/button.tsx`

**Barrel Files:**
- Not explicitly used (no index.ts files aggregating exports)
- Direct imports from component files preferred

## Client vs Server Components

**Pattern:** Use client directive at top of file for interactive components
```typescript
"use client"
```
- Applied to all animation and form-heavy components
- API routes use server-only context (NextRequest, NextResponse)
- Applied consistently in `hero-section.tsx`, `colophon-section.tsx`, `countdown-timer.tsx`

## TypeScript Patterns

**Strict Mode:** Enabled (no `any` types observed)

**React Types:**
- `React.FormEvent` for form handlers
- `React.ComponentProps<'button'>` for component prop extension
- `React.KeyboardEvent` for keyboard events
- Type inference preferred where possible

**Generics:**
- `useRef<HTMLDivElement>(null)` - typed refs
- `useRef<gsap.core.Tween | null>(null)` - animation refs
- `VariantProps<typeof buttonVariants>` - CVA variant extraction

---

*Convention analysis: 2026-02-27*
