# Design Document

## Overview

The Lumeo Early Access Frontend is a revolutionary, immersive landing page built with Next.js App Router, TypeScript, and advanced GSAP animations. The design creates an awe-inspiring experience that positions Lumeo as the future of global payments through cutting-edge visual effects, interactive visualizations, and cinematic storytelling. The application showcases Lumeo's vision as the post-UPI global settlement layer through sophisticated particle systems, real-time payment flow animations, and immersive user interactions.

The application follows a performance-first approach with advanced animation optimization, utilizing GSAP, Three.js for 3D effects, and custom WebGL shaders for particle systems. The architecture prioritizes 60fps performance while delivering a visually stunning experience that makes visitors feel they're witnessing the future of money movement.

## Architecture

### Technology Stack
- **Framework**: Next.js 14+ with App Router and TypeScript
- **Styling**: Tailwind CSS with custom CSS for complex animations and glassmorphism effects
- **Animation**: GSAP (GreenSock Animation Platform) with ScrollTrigger, MotionPath, and Physics plugins
- **3D Graphics**: Three.js for 3D visualizations and WebGL particle systems
- **Interactive Visualizations**: D3.js for data-driven animations and world map interactions
- **Form Handling**: React state management with fetch API to `/api/subscribe`
- **Performance**: Web Workers for heavy computations and Intersection Observer for scroll optimization
- **Build System**: Next.js built-in bundling with custom webpack configuration for shaders

### Project Structure
```
app/
├── layout.tsx                 # Root layout with global styles
├── page.tsx                   # Main landing page
├── api/
│   └── subscribe/
│       └── route.ts           # Email subscription API endpoint
├── globals.css                # Global styles and Tailwind imports
components/
├── ui/                        # Reusable UI components
│   ├── header.tsx
│   ├── navigation.tsx
│   ├── email-form.tsx
│   └── countdown-timer.tsx
├── sections/                  # Page section components
│   ├── hero-section.tsx
│   ├── signals-section.tsx
│   ├── work-section.tsx
│   ├── principles-section.tsx
│   └── footer-section.tsx
├── animations/                # Animation-specific components
│   ├── animated-logo.tsx
│   ├── scroll-triggered-card.tsx
│   └── background-effects.tsx
lib/
├── gsap-config.ts            # GSAP configuration and utilities
├── animation-utils.ts        # Animation helper functions
└── types.ts                  # TypeScript type definitions
public/
├── images/                   # Optimized images and assets
└── icons/                    # SVG icons and graphics
```

### Responsive Breakpoints
- **Mobile**: 320px - 767px (base styles, mobile-first)
- **Tablet**: 768px - 1023px (md: prefix)
- **Desktop**: 1024px - 1439px (lg: prefix)
- **Large Desktop**: 1440px+ (xl: prefix)

## Components and Interfaces

### Core Layout Components

#### Header Component
```typescript
interface HeaderProps {
  isMenuOpen: boolean;
  onMenuToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ isMenuOpen, onMenuToggle }) => {
  // Fixed header with logo and mobile menu toggle
  // Responsive navigation that adapts to screen size
}
```

#### Navigation System
```typescript
interface NavigationProps {
  variant: 'desktop-side' | 'mobile-bottom';
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ variant, activeSection, onSectionChange }) => {
  // Vertical side navigation for desktop
  // Bottom navigation for mobile
  // Smooth scroll to sections
}
```

### Section Components

#### Hero Section
```typescript
interface HeroSectionProps {
  onEmailSubmit: (email: string) => Promise<void>;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onEmailSubmit }) => {
  // Animated LUMEO logo with text scramble effect
  // Tagline: "Early Access to Lumeo"
  // Subheading: "We are dismantling the slow rails of legacy banking. Lumeo is a non-custodial, wallet-first settlement layer. Money moves as fast as data. No intermediaries."
  // Alpha Badge: "v0.1 / Alpha"
  // Email collection form with "Enter the Protocol" button
  // Countdown timer to July 28, 2026
  // Beta release note: "Beta release in 6 months. Secure your spot now."
  // Left vertical label: "EARLY ACCESS" (rotated)
  // Animated background elements
}
```

#### Animated Logo Component
```typescript
interface AnimatedLogoProps {
  text: string;
  className?: string;
  animationDelay?: number;
}

const AnimatedLogo: React.FC<AnimatedLogoProps> = ({ text, className, animationDelay }) => {
  // Text scramble/flip animation using GSAP
  // Configurable timing and styling
}
```

#### Email Form Component
```typescript
interface EmailFormProps {
  onSubmit: (email: string) => Promise<void>;
  isLoading: boolean;
  message: string | null;
}

const EmailForm: React.FC<EmailFormProps> = ({ onSubmit, isLoading, message }) => {
  // Email validation and submission
  // Placeholder: "your@email.com"
  // Button text: "Enter the Protocol" (changes to "Joining..." when loading)
  // Success message: "✓ Welcome to the alpha. Check your email for next steps."
  // Loading states and feedback
}
```

#### Countdown Timer Component
```typescript
interface CountdownTimerProps {
  targetDate: Date;
  className?: string;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate, className }) => {
  // Real-time countdown to July 28, 2026
  // Responsive time unit display
  // Automatic updates every second
}
```

### Content Section Components

#### Signals Section
```typescript
interface SignalCard {
  id: string;
  title: string;
  description: string;
  icon?: string;
}

interface SignalsSectionProps {
  signals: SignalCard[];
}

const SignalsSection: React.FC<SignalsSectionProps> = ({ signals }) => {
  // Horizontal scrolling card container
  // Scroll-triggered animations
  // Touch-friendly mobile interactions
}
```

#### Work Section
```typescript
interface WorkCard {
  id: string;
  title: string;
  description: string;
  size: 'small' | 'medium' | 'large';
}

interface WorkSectionProps {
  workItems: WorkCard[];
}

const WorkSection: React.FC<WorkSectionProps> = ({ workItems }) => {
  // Asymmetric grid layout
  // Responsive card sizing
  // Staggered animation timing
}
```

#### Principles Section
```typescript
interface Principle {
  id: string;
  title: string;
  description: string;
  keywords: string[];
}

interface PrinciplesSectionProps {
  principles: Principle[];
}

const PrinciplesSection: React.FC<PrinciplesSectionProps> = ({ principles }) => {
  // Four core principles with specific content:
  // 1. INSTANT SETTLEMENT — Value transfers complete in milliseconds, not days. Quantum-speed verification eliminates waiting.
  // 2. ZERO FRICTION — No intermediaries, no gas fees, no hidden costs. Pure peer-to-peer value flow.
  // 3. CRYPTOGRAPHIC TRUST — Powered by zero-knowledge proofs, not trust in institutions. Math is your guarantee.
  // 4. INFINITE LIQUIDITY — Cross-chain pooling ensures deep liquidity for any trading pair, anywhere, anytime.
  // Alternating layout pattern
  // Animated keyword highlighting (INSTANT, ZERO, CRYPTOGRAPHIC, INFINITE)
  // Mobile-responsive stacking
}
```

### Animation Components

#### Scroll Triggered Card
```typescript
interface ScrollTriggeredCardProps {
  children: React.ReactNode;
  animationType: 'fadeUp' | 'slideLeft' | 'scaleIn';
  delay?: number;
  className?: string;
}

const ScrollTriggeredCard: React.FC<ScrollTriggeredCardProps> = ({ 
  children, 
  animationType, 
  delay, 
  className 
}) => {
  // GSAP ScrollTrigger integration
  // Multiple animation types
  // Configurable timing and easing
}
```

#### Background Effects
```typescript
interface BackgroundEffectsProps {
  variant: 'noise' | 'chevron' | 'gradient';
  intensity: number;
}

const BackgroundEffects: React.FC<BackgroundEffectsProps> = ({ variant, intensity }) => {
  // Animated background elements
  // Performance-optimized rendering
  // Configurable visual intensity
}
```

### Advanced Visual Components

#### Global Payment Visualization
```typescript
interface PaymentNode {
  id: string;
  country: string;
  coordinates: [number, number];
  volume: number;
  isActive: boolean;
}

interface PaymentFlow {
  from: string;
  to: string;
  amount: number;
  speed: 'instant' | 'traditional';
  timestamp: Date;
}

interface GlobalVisualizationProps {
  nodes: PaymentNode[];
  flows: PaymentFlow[];
  showComparison: boolean;
}

const GlobalVisualization: React.FC<GlobalVisualizationProps> = ({ 
  nodes, 
  flows, 
  showComparison 
}) => {
  // Interactive world map with payment nodes
  // Real-time payment flow animations
  // Traditional vs Lumeo speed comparisons
  // Live statistics display
  // Performance-optimized WebGL rendering
}
```

#### Architecture Diagram
```typescript
interface ArchitectureNode {
  id: string;
  type: 'wallet' | 'settlement' | 'compliance' | 'rails';
  position: { x: number; y: number };
  connections: string[];
  isHighlighted: boolean;
}

interface ArchitectureDiagramProps {
  nodes: ArchitectureNode[];
  activeFlow: string | null;
  onNodeInteraction: (nodeId: string) => void;
}

const ArchitectureDiagram: React.FC<ArchitectureDiagramProps> = ({ 
  nodes, 
  activeFlow, 
  onNodeInteraction 
}) => {
  // Interactive architecture visualization
  // Animated data flow between components
  // Principle explanations with visual demonstrations
  // Regulatory compliance integration display
}
```

#### Particle System
```typescript
interface ParticleConfig {
  count: number;
  size: { min: number; max: number };
  speed: { min: number; max: number };
  color: string | string[];
  physics: 'gravity' | 'magnetic' | 'flow';
}

interface ParticleSystemProps {
  config: ParticleConfig;
  trigger: 'scroll' | 'interaction' | 'continuous';
  bounds: { width: number; height: number };
}

const ParticleSystem: React.FC<ParticleSystemProps> = ({ 
  config, 
  trigger, 
  bounds 
}) => {
  // WebGL-based particle rendering
  // Physics-based movement and interactions
  // Performance optimization with object pooling
  // Responsive to user interactions
}
```

#### Cinematic Loader
```typescript
interface LoaderProps {
  stage: 'initial' | 'content' | 'complete';
  progress: number;
  onComplete: () => void;
}

const CinematicLoader: React.FC<LoaderProps> = ({ 
  stage, 
  progress, 
  onComplete 
}) => {
  // Branded loading sequence with logo assembly
  // Progress indication with smooth animations
  // Seamless transition to main content
  // Optimized for perceived performance
}
```

#### Premium Email Form
```typescript
interface PremiumEmailFormProps {
  onSubmit: (email: string, preferences: UserPreferences) => Promise<void>;
  isLoading: boolean;
  message: string | null;
  showOnboarding: boolean;
}

interface UserPreferences {
  interests: string[];
  role: 'developer' | 'business' | 'investor' | 'other';
  company?: string;
}

const PremiumEmailForm: React.FC<PremiumEmailFormProps> = ({ 
  onSubmit, 
  isLoading, 
  message, 
  showOnboarding 
}) => {
  // Glassmorphic design with animated focus states
  // Multi-step onboarding flow
  // Personalized welcome messages
  // Celebration animations on success
  // Exclusive perks reveal
}
```

## Data Models

### Email Subscription
```typescript
interface EmailSubmission {
  email: string;
  timestamp: Date;
  source: 'hero-form';
  userAgent?: string;
}

interface SubmissionResponse {
  success: boolean;
  message: string;
  error?: string;
}
```

### Animation Configuration
```typescript
interface AnimationConfig {
  duration: number;
  ease: string;
  delay?: number;
  stagger?: number;
}

interface ScrollTriggerConfig {
  trigger: string;
  start: string;
  end?: string;
  scrub?: boolean;
  markers?: boolean;
}
```

### Content Data Models
```typescript
interface SiteContent {
  hero: {
    title: string;
    subtitle: string;
    description: string;
    ctaText: string;
  };
  signals: SignalCard[];
  work: WorkCard[];
  principles: Principle[];
  footer: {
    copyright: string;
    links: Array<{ text: string; href: string; }>;
  };
}
```

### Responsive Layout Configuration
```typescript
interface ResponsiveConfig {
  breakpoints: {
    mobile: number;
    tablet: number;
    desktop: number;
    largeDesktop: number;
  };
  gridColumns: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
  spacing: {
    mobile: string;
    tablet: string;
    desktop: string;
  };
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Responsive Navigation Behavior
*For any* viewport size, the navigation system should display in the appropriate format (vertical side navigation for desktop viewports ≥1024px, bottom navigation for mobile viewports <768px) and maintain full functionality
**Validates: Requirements 1.2, 1.3**

### Property 2: Navigation Scroll Functionality
*For any* navigation element clicked, the system should smoothly scroll to the corresponding section with consistent timing and easing
**Validates: Requirements 1.5**

### Property 3: Email Form Validation and Submission
*For any* email input, the form should correctly validate the format, send valid emails to the /api/subscribe endpoint, display appropriate feedback for invalid emails, and show confirmation for successful submissions
**Validates: Requirements 3.3, 3.4, 3.5**

### Property 4: Scroll-Triggered Animation System
*For any* content element with scroll-triggered animations, the animation should trigger when the element enters the viewport with appropriate timing, staggered delays for multiple elements, and smooth transitions
**Validates: Requirements 4.1, 4.2, 4.4, 5.2, 6.3, 7.4**

### Property 5: Keyword Highlighting Animation
*For any* principle keyword marked for highlighting, the system should apply animated orange background effects with consistent styling and timing
**Validates: Requirements 4.3, 7.2**

### Property 6: Horizontal Scrolling Behavior
*For any* horizontally scrollable container, the scrolling should work smoothly on both desktop and touch devices with appropriate momentum and visual feedback
**Validates: Requirements 5.3, 8.5**

### Property 7: Responsive Layout Adaptation
*For any* screen size change, all sections should adapt their layout appropriately, maintain visual hierarchy, optimize typography and spacing, and provide touch-friendly interaction targets on mobile devices
**Validates: Requirements 6.2, 7.3, 8.1, 8.2, 8.3, 8.4**

### Property 8: Card Readability Across Viewports
*For any* viewport size, all cards (signal, work, principle) should maintain readability with appropriate sizing, spacing, and content visibility
**Validates: Requirements 5.4**

### Property 9: Keyboard Accessibility
*For any* interactive element, it should be accessible via keyboard navigation with visible focus indicators and support full site functionality without mouse interaction
**Validates: Requirements 6.5, 9.1, 9.2, 9.4**

### Property 10: Color Contrast Compliance
*For any* text element, the color contrast ratio should meet WCAG guidelines (minimum 4.5:1 for normal text, 3:1 for large text) to ensure readability
**Validates: Requirements 7.5, 9.3**

### Property 11: Screen Reader Compatibility
*For any* content element, it should be properly structured and labeled for screen reader accessibility with appropriate semantic markup and ARIA attributes
**Validates: Requirements 9.5**

### Property 12: Animation Performance
*For any* animation sequence, the system should maintain 60fps performance and respect user preferences for reduced motion when enabled
**Validates: Requirements 10.2, 10.4**

### Property 13: Asset Optimization
*For any* image or asset, it should be optimized for web delivery with appropriate formats, compression, and sizing for different viewport densities
**Validates: Requirements 10.3**

### Property 14: Scroll Event Performance
*For any* scroll event, the system should handle it efficiently without causing performance degradation or blocking the main thread
**Validates: Requirements 10.5**

### Property 15: Interactive Visualization Performance
*For any* interactive visualization element, it should maintain smooth 60fps performance while providing responsive feedback to user interactions
**Validates: Requirements 11.1, 11.2, 11.3, 11.4, 11.5, 11.6**

### Property 16: Storytelling Animation Consistency
*For any* storytelling section, animations should trigger consistently based on scroll position and maintain narrative flow without jarring transitions
**Validates: Requirements 13.1, 13.2, 13.3, 13.4, 13.5**

### Property 17: Particle System Performance
*For any* particle system, it should render efficiently using WebGL optimization and scale particle count based on device performance capabilities
**Validates: Requirements 14.1, 14.2, 14.3, 14.4, 14.5, 14.6**

### Property 18: Cinematic Transition Smoothness
*For any* page transition or loading sequence, it should maintain cinematic quality with smooth easing curves and respect user motion preferences
**Validates: Requirements 16.1, 16.2, 16.3, 16.4, 16.5, 16.6**

### Property 19: Premium Form Experience
*For any* form interaction, it should provide delightful feedback with glassmorphic effects and personalized responses based on user input
**Validates: Requirements 15.1, 15.2, 15.3, 15.4, 15.5, 15.6**

## Error Handling

### Form Validation Errors
- **Invalid Email Format**: Display inline validation message with specific format requirements
- **Network Errors**: Show retry option with exponential backoff for API failures
- **Server Errors**: Display user-friendly error message while logging technical details
- **Rate Limiting**: Implement client-side throttling with appropriate user feedback

### Animation Errors
- **GSAP Load Failures**: Gracefully degrade to CSS transitions with fallback animations
- **Performance Issues**: Automatically reduce animation complexity on low-performance devices
- **Scroll Event Errors**: Implement error boundaries to prevent animation failures from breaking the page

### Responsive Layout Errors
- **Viewport Detection Issues**: Use robust feature detection with sensible defaults
- **Touch Event Failures**: Provide mouse/keyboard alternatives for all touch interactions
- **CSS Grid/Flexbox Fallbacks**: Implement progressive enhancement for older browsers

### Accessibility Errors
- **Screen Reader Issues**: Provide alternative text and descriptions for all visual content
- **Keyboard Navigation Failures**: Ensure all functionality remains accessible via keyboard
- **Color Contrast Issues**: Implement high contrast mode as fallback option

### Performance Errors
- **Slow Network Conditions**: Implement progressive loading with skeleton screens
- **Memory Constraints**: Use efficient cleanup for animations and event listeners
- **JavaScript Disabled**: Provide basic functionality with server-side rendering

## Testing Strategy

### Dual Testing Approach
The testing strategy employs both unit testing and property-based testing to ensure comprehensive coverage:

- **Unit tests**: Verify specific examples, edge cases, and error conditions
- **Property tests**: Verify universal properties across all inputs
- Together they provide comprehensive coverage where unit tests catch concrete bugs and property tests verify general correctness

### Property-Based Testing Configuration
- **Library**: fast-check for TypeScript/JavaScript property-based testing
- **Iterations**: Minimum 100 iterations per property test due to randomization
- **Test Tagging**: Each property test must reference its design document property with format: **Feature: lumeo-early-access-frontend, Property {number}: {property_text}**

### Unit Testing Focus Areas
- Specific examples demonstrating correct behavior
- Integration points between components (GSAP integration, API calls)
- Edge cases and error conditions (network failures, invalid inputs)
- Component rendering and state management

### Property Testing Focus Areas
- Universal properties that hold for all inputs (responsive behavior, form validation)
- Comprehensive input coverage through randomization (email formats, viewport sizes)
- Animation timing and performance characteristics
- Accessibility compliance across all content

### Testing Tools and Framework
- **Testing Framework**: Jest with React Testing Library
- **Property Testing**: fast-check library
- **Animation Testing**: GSAP testing utilities and performance monitoring
- **Accessibility Testing**: axe-core for automated accessibility testing
- **Visual Regression**: Playwright for cross-browser visual testing

### Performance Testing
- **Animation Performance**: Monitor frame rates during animation sequences
- **Load Performance**: Measure initial page load times under various network conditions
- **Memory Usage**: Track memory consumption during scroll and animation events
- **Bundle Size**: Monitor JavaScript bundle size and implement code splitting

### Cross-Browser and Device Testing
- **Desktop Browsers**: Chrome, Firefox, Safari, Edge (latest 2 versions)
- **Mobile Devices**: iOS Safari, Chrome Mobile, Samsung Internet
- **Accessibility Tools**: Screen readers (NVDA, JAWS, VoiceOver)
- **Performance Testing**: Various device capabilities and network speeds