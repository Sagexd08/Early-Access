# Testing Patterns

**Analysis Date:** 2026-02-27

## Test Framework

**Runner:**
- Jest (v29+)
- Implementation: Found in `.next/dev/package.json`
- Config: Not explicitly configured at project root

**Assertion Library:**
- React Testing Library (@testing-library/react)
- jsdom environment for DOM testing

**Run Commands:**
```bash
npm run test              # Run tests (not defined in package.json yet)
npm run test:watch       # Watch mode (not defined in package.json yet)
npm run test:coverage    # Coverage report (not defined in package.json yet)
```

**Note:** Testing scripts not yet added to `package.json`. Only one test file exists in codebase.

## Test File Organization

**Location:**
- Co-located with components in `__tests__/` subdirectory
- Path: `components/__tests__/colophon-section.test.tsx`

**Naming:**
- Follows pattern: `[ComponentName].test.tsx`
- Uses `.test.tsx` extension for TSX test files

**Structure:**
```
components/
├── colophon-section.tsx
├── __tests__/
│   └── colophon-section.test.tsx
└── ...other components
```

## Test Structure

**Suite Organization:**
```typescript
describe('ColophonSection', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    })
  })

  it('renders footer with proper semantic markup', () => {
    // test implementation
  })
})
```

**Patterns:**
- `describe()` wraps all tests for a component
- `beforeEach()` resets mocks before each test
- `it()` for individual test cases with descriptive names
- Clear arrange-act-assert structure in each test

**Typical test flow:**
1. Render component: `render(<ColophonSection />)`
2. Query elements: `screen.getByRole()`, `screen.getByText()`, `screen.getByPlaceholderText()`
3. Assert presence/attributes: `expect(element).toBeInTheDocument()`
4. Simulate user actions: `fireEvent.change()`, `fireEvent.click()`
5. Wait for async: `await waitFor(() => { ... })`

## Mocking

**Framework:** Jest mocks (`jest.mock()`)

**Patterns:**

Module mocking:
```typescript
jest.mock('gsap', () => ({
  __esModule: true,
  default: {
    registerPlugin: jest.fn(),
    context: jest.fn(() => ({
      revert: jest.fn(),
    })),
    from: jest.fn(),
  },
}))

jest.mock('gsap/ScrollTrigger', () => ({
  ScrollTrigger: {},
}))
```

Global object mocking:
```typescript
global.fetch = jest.fn()

// Setup in beforeEach
;(global.fetch as jest.Mock).mockResolvedValue({
  ok: true,
  json: async () => ({ success: true }),
})

// Verify calls
expect(global.fetch).toHaveBeenCalledWith('/api/subscribe', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'test@example.com', source: 'footer-newsletter' }),
})
```

**What to Mock:**
- External libraries with side effects: GSAP animations, ScrollTrigger
- Global APIs: `fetch`, `window.fetch`
- Animation frames and timers: `requestAnimationFrame` (via jest.useFakeTimers())

**What NOT to Mock:**
- React and React Testing Library functionality
- Component props and rendering behavior
- Standard browser APIs unless testing error cases

## Fixtures and Factories

**Test Data:**
- Inline mock data creation using `jest.fn()` and `mockResolvedValue()`
- Simple object literals for test cases:
  ```typescript
  {
    ok: true,
    json: async () => ({ success: true }),
  }
  ```

**Location:**
- Fixtures inline in test file or in `beforeEach()` setup
- No separate fixtures directory detected
- Growth path: Extract to `__fixtures__/` or `test-utils/` if tests expand

## Coverage

**Requirements:** Not enforced

**View Coverage:**
```bash
npm run test -- --coverage    # Would generate coverage report
```

**Expected coverage areas:**
- Component rendering (verified in current tests)
- User interactions (form submission, clicks)
- Error handling
- Async operations (fetch responses)

## Test Types

**Unit Tests:**
- Scope: Individual components and their behavior
- Approach: Render component, simulate interactions, assert output
- Example: `ColophonSection` tests verify form submission, error handling, success messages
- Located in: `components/__tests__/`

**Integration Tests:**
- Not yet implemented
- Growth area: Test API routes with database interactions
- Would test: `/api/subscribe` endpoint with actual Supabase calls (or mocked)

**E2E Tests:**
- Not implemented
- Recommended tools: Playwright, Cypress
- Would test: Full user flows like signup → email verification → confirmation

## Common Patterns

**Async Testing:**
```typescript
it('handles newsletter subscription successfully', async () => {
  render(<ColophonSection />)

  const emailInput = screen.getByPlaceholderText('your@email.com')
  const subscribeButton = screen.getByRole('button', { name: /Subscribe to newsletter/ })

  fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
  fireEvent.click(subscribeButton)

  // Wait for async fetch and state updates
  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalled()
  })
})
```

**Error Testing:**
```typescript
it('handles subscription errors gracefully', async () => {
  ;(global.fetch as jest.Mock).mockResolvedValue({
    ok: false,
    json: async () => ({ error: 'Invalid email address' }),
  })

  render(<ColophonSection />)

  const emailInput = screen.getByPlaceholderText('your@email.com')
  const subscribeButton = screen.getByRole('button', { name: /Subscribe to newsletter/ })

  fireEvent.change(emailInput, { target: { value: 'invalid-email' } })
  fireEvent.click(subscribeButton)

  await waitFor(() => {
    expect(screen.getByText('Invalid email address')).toBeInTheDocument()
  })
})
```

**Accessibility Testing:**
```typescript
it('has proper accessibility attributes for form elements', () => {
  render(<ColophonSection />)

  const emailInput = screen.getByPlaceholderText('your@email.com')
  expect(emailInput).toHaveAttribute('aria-label', 'Email address for newsletter subscription')
  expect(emailInput).toHaveAttribute('type', 'email')
  expect(emailInput).toHaveAttribute('required')

  const subscribeButton = screen.getByRole('button', { name: /Subscribe to newsletter/ })
  expect(subscribeButton).toHaveAttribute('type', 'submit')
})
```

**Query Patterns Used:**
- `screen.getByRole(role, { name: /regex/ })` - preferred for buttons/headings
- `screen.getByText(text)` - for text content
- `screen.getByPlaceholderText(placeholder)` - for form inputs
- `screen.getByLabelText(label)` - for labeled inputs

## Test Data and Mocking Strategy

**Component Behavior Testing:**
- Mock only external side effects (API calls, animations)
- Test actual React behavior (state changes, event handlers)
- Assert against screen queries (what user sees) not implementation details

**API Testing:**
- Mock `fetch` for component tests
- Would mock `@supabase/supabase-js` for integration tests
- Use actual service functions but mock database layer

---

*Testing analysis: 2026-02-27*
