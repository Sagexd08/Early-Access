import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ColophonSection } from '../colophon-section'

// Mock GSAP and ScrollTrigger
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

// Mock fetch for newsletter subscription
global.fetch = jest.fn()

describe('ColophonSection', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    })
  })

  it('renders footer with proper semantic markup', () => {
    render(<ColophonSection />)
    
    const footer = screen.getByRole('contentinfo')
    expect(footer).toBeInTheDocument()
    expect(footer).toHaveAttribute('aria-label', 'Site footer with company information and links')
  })

  it('displays company branding and description', () => {
    render(<ColophonSection />)
    
    expect(screen.getByText('LUMEO')).toBeInTheDocument()
    expect(screen.getByText(/The post-UPI global settlement layer/)).toBeInTheDocument()
    expect(screen.getByText(/Making borders irrelevant to how money moves/)).toBeInTheDocument()
  })

  it('renders newsletter signup form', () => {
    render(<ColophonSection />)
    
    expect(screen.getByText('Stay Updated')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('your@email.com')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Subscribe to newsletter/ })).toBeInTheDocument()
  })

  it('handles newsletter subscription successfully', async () => {
    render(<ColophonSection />)
    
    const emailInput = screen.getByPlaceholderText('your@email.com')
    const subscribeButton = screen.getByRole('button', { name: /Subscribe to newsletter/ })
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.click(subscribeButton)
    
    expect(subscribeButton).toHaveTextContent('Subscribing...')
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@example.com',
          source: 'footer-newsletter',
        }),
      })
    })
  })

  it('displays success message after successful subscription', async () => {
    render(<ColophonSection />)
    
    const emailInput = screen.getByPlaceholderText('your@email.com')
    const subscribeButton = screen.getByRole('button', { name: /Subscribe to newsletter/ })
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.click(subscribeButton)
    
    await waitFor(() => {
      expect(screen.getByText(/✓ Subscribed! You'll receive updates/)).toBeInTheDocument()
    })
    
    // Email input should be cleared
    expect(emailInput).toHaveValue('')
  })

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

  it('renders all footer navigation sections', () => {
    render(<ColophonSection />)
    
    // Check for main navigation sections
    expect(screen.getByText('Company')).toBeInTheDocument()
    expect(screen.getByText('Product')).toBeInTheDocument()
    expect(screen.getByText('Community')).toBeInTheDocument()
    expect(screen.getByText('Legal')).toBeInTheDocument()
    expect(screen.getByText('Contact')).toBeInTheDocument()
    expect(screen.getByText('Technology')).toBeInTheDocument()
  })

  it('renders contact information with proper links', () => {
    render(<ColophonSection />)
    
    // Check email links
    expect(screen.getByLabelText('Send email to hello@lumeo.network')).toHaveAttribute(
      'href',
      'mailto:hello@lumeo.network'
    )
    expect(screen.getByLabelText('Send email to partnerships@lumeo.network')).toHaveAttribute(
      'href',
      'mailto:partnerships@lumeo.network'
    )
    expect(screen.getByLabelText('Send email to support@lumeo.network')).toHaveAttribute(
      'href',
      'mailto:support@lumeo.network'
    )
  })

  it('renders social media links with proper attributes', () => {
    render(<ColophonSection />)
    
    const discordLink = screen.getByLabelText('Join Lumeo Discord community (opens in new tab)')
    expect(discordLink).toHaveAttribute('href', 'https://discord.gg/lumeo')
    expect(discordLink).toHaveAttribute('target', '_blank')
    expect(discordLink).toHaveAttribute('rel', 'noopener noreferrer')
    
    const twitterLink = screen.getByLabelText('Follow Lumeo on Twitter (opens in new tab)')
    expect(twitterLink).toHaveAttribute('href', 'https://twitter.com/lumeonetwork')
    expect(twitterLink).toHaveAttribute('target', '_blank')
    
    const githubLink = screen.getByLabelText('View Lumeo on GitHub (opens in new tab)')
    expect(githubLink).toHaveAttribute('href', 'https://github.com/lumeo-network')
    expect(githubLink).toHaveAttribute('target', '_blank')
  })

  it('renders legal and policy links', () => {
    render(<ColophonSection />)
    
    expect(screen.getByLabelText('Privacy policy')).toHaveAttribute('href', '/privacy')
    expect(screen.getByLabelText('Terms of service')).toHaveAttribute('href', '/terms')
    expect(screen.getByLabelText('Security information')).toHaveAttribute('href', '/security')
  })

  it('displays launch timeline and status information', () => {
    render(<ColophonSection />)
    
    expect(screen.getByText('Alpha v0.1 - In Development')).toBeInTheDocument()
    expect(screen.getByText('Beta Launch: Q2 2026 • Full Launch: Q3 2026')).toBeInTheDocument()
  })

  it('displays copyright information', () => {
    render(<ColophonSection />)
    
    expect(screen.getByText('© 2026 Qore Labs. All rights reserved.')).toBeInTheDocument()
  })

  it('prevents form submission with empty email', () => {
    render(<ColophonSection />)
    
    const subscribeButton = screen.getByRole('button', { name: /Subscribe to newsletter/ })
    
    // Button should be disabled when email is empty
    expect(subscribeButton).toBeDisabled()
  })

  it('enables form submission with valid email', () => {
    render(<ColophonSection />)
    
    const emailInput = screen.getByPlaceholderText('your@email.com')
    const subscribeButton = screen.getByRole('button', { name: /Subscribe to newsletter/ })
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    
    expect(subscribeButton).not.toBeDisabled()
  })

  it('has proper accessibility attributes for form elements', () => {
    render(<ColophonSection />)
    
    const emailInput = screen.getByPlaceholderText('your@email.com')
    expect(emailInput).toHaveAttribute('aria-label', 'Email address for newsletter subscription')
    expect(emailInput).toHaveAttribute('type', 'email')
    expect(emailInput).toHaveAttribute('required')
    
    const subscribeButton = screen.getByRole('button', { name: /Subscribe to newsletter/ })
    expect(subscribeButton).toHaveAttribute('type', 'submit')
  })

  it('displays technology stack information', () => {
    render(<ColophonSection />)
    
    expect(screen.getByText('Multi-Chain')).toBeInTheDocument()
    expect(screen.getByText('Zero-Knowledge')).toBeInTheDocument()
    expect(screen.getByText('Non-Custodial')).toBeInTheDocument()
  })
})