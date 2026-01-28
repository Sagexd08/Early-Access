"use client"

import { useEffect, useRef, useState } from "react"
import { CountdownTimer } from "@/components/countdown-timer"
import { AnimatedNoise } from "@/components/animated-noise"
import { useFocusAnnouncement } from "@/lib/use-keyboard-navigation"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const emailInputRef = useRef<HTMLInputElement>(null)
  const submitButtonRef = useRef<HTMLButtonElement>(null)
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const { announce } = useFocusAnnouncement()

  useEffect(() => {
    if (!sectionRef.current || !contentRef.current) return

    const ctx = gsap.context(() => {
      gsap.to(contentRef.current, {
        y: -100,
        opacity: 0,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  // Focus management for form
  useEffect(() => {
    if (message) {
      announce(message)
    }
  }, [message, announce])

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes("@")) {
      const errorMessage = "Please enter a valid email address"
      setMessage(errorMessage)
      announce(errorMessage)
      emailInputRef.current?.focus()
      return
    }

    setIsLoading(true)
    setMessage(null)
    announce("Submitting email...")

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        const successMessage = "✓ Welcome to the alpha. Check your email for next steps."
        setMessage(successMessage)
        setEmail("")
        announce(successMessage)
      } else {
        const errorMessage = data.error || "Something went wrong. Please try again."
        setMessage(errorMessage)
        announce(errorMessage)
        emailInputRef.current?.focus()
      }
    } catch (error) {
      const errorMessage = "Network error. Please try again."
      setMessage(errorMessage)
      announce(errorMessage)
      emailInputRef.current?.focus()
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Enhanced keyboard navigation for form
    if (e.key === 'Enter' && e.target === emailInputRef.current) {
      e.preventDefault()
      if (email && email.includes("@")) {
        submitButtonRef.current?.click()
      }
    }
  }

  return (
    <section 
      ref={sectionRef} 
      id="hero" 
      className="relative min-h-screen flex items-center px-4 sm:px-6 md:pl-28 md:pr-12"
      tabIndex={-1}
      aria-label="Hero section - Early Access to Lumeo"
    >
      <AnimatedNoise opacity={0.03} />

      {/* Left vertical label - hidden on mobile for better space usage */}
      <div className="absolute left-2 sm:left-4 md:left-6 top-1/2 -translate-y-1/2 hidden sm:block" aria-hidden="true">
        <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-muted-foreground -rotate-90 origin-left block whitespace-nowrap">
          EARLY ACCESS
        </span>
      </div>

      {/* Main content */}
      <div ref={contentRef} className="flex-1 w-full max-w-4xl">
        {/* Mobile-only section indicator */}
        <div className="sm:hidden mb-4" aria-hidden="true">
          <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-accent">EARLY ACCESS</span>
        </div>

        {/* Tagline - improved mobile scaling */}
        <h1 className="font-[var(--font-bebas)] text-white text-[clamp(2rem,8vw,4rem)] sm:text-[clamp(2.5rem,6vw,3.5rem)] mb-4 sm:mb-6 tracking-wide leading-tight">
          Early Access to Lumeo
        </h1>

        {/* Subheading - better mobile typography */}
        <p className="max-w-2xl font-mono text-xs sm:text-sm text-muted-foreground leading-relaxed mb-6 sm:mb-8">
          We are dismantling the slow rails of legacy banking. Lumeo is a non-custodial, wallet-first settlement layer. Money moves as fast as data. No intermediaries.
        </p>

        {/* Alpha Badge */}
        <div className="inline-block border border-accent px-3 py-1.5 sm:px-4 sm:py-2 font-mono text-[9px] sm:text-[10px] uppercase tracking-widest text-accent mb-6 sm:mb-8" role="status" aria-label="Version 0.1 Alpha">
          v0.1 / Alpha
        </div>

        {/* Email signup form - mobile-optimized with enhanced accessibility */}
        <form onSubmit={handleEmailSubmit} className="mb-6 sm:mb-8 max-w-md" noValidate>
          <fieldset disabled={isLoading} className="border-0 p-0 m-0">
            <legend className="sr-only">Email subscription form</legend>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4">
              <div className="flex-1">
                <label htmlFor="email-input" className="sr-only">
                  Email address for early access
                </label>
                <input
                  ref={emailInputRef}
                  id="email-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="your@email.com"
                  className="w-full bg-transparent border border-white/20 px-4 py-3 sm:py-3 font-mono text-sm text-white placeholder:text-white/50 focus:border-accent focus:outline-none min-h-[44px] touch-manipulation transition-colors duration-200"
                  disabled={isLoading}
                  aria-describedby={message ? "form-message" : undefined}
                  aria-invalid={message && !message.startsWith("✓") ? "true" : "false"}
                  autoComplete="email"
                />
              </div>
              <button
                ref={submitButtonRef}
                type="submit"
                disabled={isLoading || !email}
                className="px-6 py-3 bg-accent text-black font-mono text-xs uppercase tracking-widest hover:bg-accent/90 focus:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] touch-manipulation whitespace-nowrap"
                aria-describedby={message ? "form-message" : undefined}
              >
                {isLoading ? "Joining..." : "Enter the Protocol"}
              </button>
            </div>
            
            {message && (
              <div 
                id="form-message"
                className={`font-mono text-xs ${message.startsWith("✓") ? "text-green-400" : "text-red-400"}`}
                role={message.startsWith("✓") ? "status" : "alert"}
                aria-live="polite"
              >
                {message}
              </div>
            )}
          </fieldset>
        </form>

        {/* Beta release note */}
        <p className="font-mono text-xs text-muted-foreground mb-8 sm:mb-12">
          Beta release in 6 months. Secure your spot now.
        </p>

        {/* Countdown Timer */}
        <div className="mb-8 sm:mb-16">
          <CountdownTimer />
        </div>
      </div>

      {/* Alpha Badge (floating) - repositioned for mobile */}
      <div className="absolute bottom-4 right-4 sm:bottom-8 sm:right-8 md:bottom-12 md:right-12" aria-hidden="true">
        <div className="border border-border px-3 py-1.5 sm:px-4 sm:py-2 font-mono text-[9px] sm:text-[10px] uppercase tracking-widest text-muted-foreground">
          v0.1 / Alpha
        </div>
      </div>
    </section>
  )
}