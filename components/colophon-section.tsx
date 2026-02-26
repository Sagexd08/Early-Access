"use client"

import { useRef, useEffect, useState } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export function ColophonSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const footerRef = useRef<HTMLDivElement>(null)
  const newsletterRef = useRef<HTMLDivElement>(null)
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      // Header slide in
      if (headerRef.current) {
        gsap.from(headerRef.current, {
          x: -60,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        })
      }

      // Newsletter section animation
      if (newsletterRef.current) {
        gsap.from(newsletterRef.current, {
          y: 30,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: newsletterRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        })
      }

      // Grid columns fade up with stagger
      if (gridRef.current) {
        const columns = gridRef.current.querySelectorAll(":scope > div")
        gsap.from(columns, {
          y: 40,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        })
      }

      // Footer fade in
      if (footerRef.current) {
        gsap.from(footerRef.current, {
          y: 20,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 95%",
            toggleActions: "play none none reverse",
          },
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    setIsLoading(true)
    setMessage(null)

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          source: 'footer-newsletter'
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage("✓ Subscribed! You'll receive updates about Lumeo's progress.")
        setEmail("")
      } else {
        setMessage(data.error || "Something went wrong. Please try again.")
      }
    } catch (error) {
      setMessage("Network error. Please check your connection and try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <footer
      ref={sectionRef}
      id="colophon"
      className="relative py-24 sm:py-32 md:py-40 px-6 sm:px-8 md:pl-28 md:pr-12 border-t border-border/30 mb-16 md:mb-0"
      role="contentinfo"
      aria-label="Site footer with company information and links"
    >
      {/* Section header */}
      <div ref={headerRef} className="mb-12 sm:mb-16">
        <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-accent/80">04 / Footer</span>
        <h2 className="mt-4 font-serif text-4xl sm:text-5xl md:text-7xl tracking-tight font-light">Lumeo</h2>
        <p className="mt-4 text-xs sm:text-sm font-mono text-muted-foreground/70 max-w-2xl leading-relaxed border-l border-accent/30 pl-4">
          The post-UPI global settlement layer. Rebuilding how value settles across borders with wallet-first,
          non-custodial architecture where payments are final by design.
        </p>
      </div>

      {/* Newsletter signup section */}
      <div ref={newsletterRef} className="mb-16 sm:mb-20">
        <div className="max-w-md">
          <h3 className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.3em] text-accent mb-4">
            Stay Updated
          </h3>
          <p className="text-xs font-mono text-muted-foreground/80 mb-6 leading-relaxed">
            Get notified about Lumeo’s progress, beta releases, and early access slots.
          </p>

          <form onSubmit={handleNewsletterSubmit} className="space-y-0">
            <div className="border border-white/15 bg-black/60 backdrop-blur-md p-2 flex flex-col sm:flex-row gap-0">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ENTER_EMAIL_ADDRESS"
                required
                disabled={isLoading}
                className="flex-1 px-4 py-3 bg-transparent border-b sm:border-b-0 sm:border-r border-white/15 font-mono text-sm
                         placeholder:text-white/25 text-white focus:outline-none focus:border-accent transition-all duration-300
                         disabled:opacity-50 tracking-wider"
                aria-label="Email address for newsletter subscription"
              />
              <button
                type="submit"
                disabled={isLoading || !email.trim()}
                className="px-6 py-3 bg-white text-black font-mono text-xs uppercase tracking-[0.25em] font-bold
                         relative overflow-hidden group
                         hover:text-black focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2
                         focus:ring-offset-background transition-all duration-200 disabled:opacity-40
                         disabled:cursor-not-allowed"
                aria-label={isLoading ? "Subscribing to newsletter" : "Subscribe to newsletter"}
              >
                <span className="relative z-10">{isLoading ? "..." : "Subscribe"}</span>
                <div className="absolute inset-0 bg-accent scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300 ease-out" />
              </button>
            </div>

            {message && (
              <div
                className={`mt-3 text-xs font-mono tracking-wider ${
                  message.startsWith('✓') ? 'text-accent' : 'text-red-400'
                }`}
                role="status"
                aria-live="polite"
              >
                {`> ${message}`}
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Multi-column layout - responsive grid */}
      <div ref={gridRef} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 sm:gap-8 md:gap-12 mb-16 sm:mb-20">
        {/* Company */}
        <div className="col-span-1">
          <h4 className="font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.3em] text-muted-foreground mb-3 sm:mb-4">Company</h4>
          <ul className="space-y-1.5 sm:space-y-2">
            <li>
              <a
                href="/about"
                className="font-mono text-xs text-foreground/80 hover:text-accent focus:text-accent transition-colors duration-200 touch-manipulation"
                aria-label="Learn about Lumeo"
              >
                About
              </a>
            </li>
            <li>
              <a
                href="/careers"
                className="font-mono text-xs text-foreground/80 hover:text-accent focus:text-accent transition-colors duration-200 touch-manipulation"
                aria-label="View career opportunities at Lumeo"
              >
                Careers
              </a>
            </li>
            <li>
              <a
                href="/press"
                className="font-mono text-xs text-foreground/80 hover:text-accent focus:text-accent transition-colors duration-200 touch-manipulation"
                aria-label="Press and media resources"
              >
                Press
              </a>
            </li>
          </ul>
        </div>

        {/* Product */}
        <div className="col-span-1">
          <h4 className="font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.3em] text-muted-foreground mb-3 sm:mb-4">Product</h4>
          <ul className="space-y-1.5 sm:space-y-2">
            <li>
              <a
                href="/docs"
                className="font-mono text-xs text-foreground/80 hover:text-accent focus:text-accent transition-colors duration-200 touch-manipulation"
                aria-label="Technical documentation"
              >
                Documentation
              </a>
            </li>
            <li>
              <a
                href="/api"
                className="font-mono text-xs text-foreground/80 hover:text-accent focus:text-accent transition-colors duration-200 touch-manipulation"
                aria-label="API reference"
              >
                API
              </a>
            </li>
            <li>
              <a
                href="/roadmap"
                className="font-mono text-xs text-foreground/80 hover:text-accent focus:text-accent transition-colors duration-200 touch-manipulation"
                aria-label="Product roadmap"
              >
                Roadmap
              </a>
            </li>
          </ul>
        </div>

        {/* Community */}
        <div className="col-span-1">
          <h4 className="font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.3em] text-muted-foreground mb-3 sm:mb-4">Community</h4>
          <ul className="space-y-1.5 sm:space-y-2">
            <li>
              <a
                href="https://discord.gg/lumeo"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs text-foreground/80 hover:text-accent focus:text-accent transition-colors duration-200 touch-manipulation"
                aria-label="Join Lumeo Discord community (opens in new tab)"
              >
                Discord
              </a>
            </li>
            <li>
              <a
                href="https://twitter.com/lumeonetwork"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs text-foreground/80 hover:text-accent focus:text-accent transition-colors duration-200 touch-manipulation"
                aria-label="Follow Lumeo on Twitter (opens in new tab)"
              >
                Twitter
              </a>
            </li>
            <li>
              <a
                href="https://github.com/lumeo-network"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs text-foreground/80 hover:text-accent focus:text-accent transition-colors duration-200 touch-manipulation"
                aria-label="View Lumeo on GitHub (opens in new tab)"
              >
                GitHub
              </a>
            </li>
          </ul>
        </div>

        {/* Legal */}
        <div className="col-span-1">
          <h4 className="font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.3em] text-muted-foreground mb-3 sm:mb-4">Legal</h4>
          <ul className="space-y-1.5 sm:space-y-2">
            <li>
              <a
                href="/privacy"
                className="font-mono text-xs text-foreground/80 hover:text-accent focus:text-accent transition-colors duration-200 touch-manipulation"
                aria-label="Privacy policy"
              >
                Privacy
              </a>
            </li>
            <li>
              <a
                href="/terms"
                className="font-mono text-xs text-foreground/80 hover:text-accent focus:text-accent transition-colors duration-200 touch-manipulation"
                aria-label="Terms of service"
              >
                Terms
              </a>
            </li>
            <li>
              <a
                href="/security"
                className="font-mono text-xs text-foreground/80 hover:text-accent focus:text-accent transition-colors duration-200 touch-manipulation"
                aria-label="Security information"
              >
                Security
              </a>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div className="col-span-1">
          <h4 className="font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.3em] text-muted-foreground mb-3 sm:mb-4">Contact</h4>
          <ul className="space-y-1.5 sm:space-y-2">
            <li>
              <a
                href="mailto:hello@lumeo.network"
                className="font-mono text-xs text-foreground/80 hover:text-accent focus:text-accent transition-colors duration-200 touch-manipulation"
                aria-label="Send email to hello@lumeo.network"
              >
                General
              </a>
            </li>
            <li>
              <a
                href="mailto:partnerships@lumeo.network"
                className="font-mono text-xs text-foreground/80 hover:text-accent focus:text-accent transition-colors duration-200 touch-manipulation"
                aria-label="Send email to partnerships@lumeo.network"
              >
                Partnerships
              </a>
            </li>
            <li>
              <a
                href="mailto:support@lumeo.network"
                className="font-mono text-xs text-foreground/80 hover:text-accent focus:text-accent transition-colors duration-200 touch-manipulation"
                aria-label="Send email to support@lumeo.network"
              >
                Support
              </a>
            </li>
          </ul>
        </div>

        {/* Technology */}
        <div className="col-span-1">
          <h4 className="font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.3em] text-muted-foreground mb-3 sm:mb-4">Technology</h4>
          <ul className="space-y-1.5 sm:space-y-2">
            <li className="font-mono text-xs text-foreground/80">Multi-Chain</li>
            <li className="font-mono text-xs text-foreground/80">Zero-Knowledge</li>
            <li className="font-mono text-xs text-foreground/80">Non-Custodial</li>
          </ul>
        </div>
      </div>

      {/* Bottom section with copyright and additional info */}
      <div
        ref={footerRef}
        className="pt-8 sm:pt-10 border-t border-border/20"
      >
        {/* Status and launch info */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-accent" aria-hidden="true" />
              <span className="font-mono text-[10px] text-accent uppercase tracking-wider">
                Alpha v0.1 — In Development
              </span>
            </div>
          </div>
          <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
            Beta Launch: Q2 2026 • Full Launch: Q3 2026
          </div>
        </div>

        {/* Copyright and tagline */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
            <p className="font-mono text-[9px] sm:text-[10px] text-muted-foreground uppercase tracking-widest">
              © 2026 Qore Labs. All rights reserved.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-mono text-[9px] sm:text-[10px] text-muted-foreground uppercase tracking-wider">
              Making borders irrelevant to how money moves
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
