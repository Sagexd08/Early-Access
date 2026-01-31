"use client"

import { useEffect, useRef, useState } from "react"
import { CountdownTimer } from "@/components/countdown-timer"
import { useFocusAnnouncement } from "@/lib/use-keyboard-navigation"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { motion } from "framer-motion"

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
      gsap.fromTo(contentRef.current,
        {
          y: 20,
          opacity: 0
        },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: "power3.out"
        }
      )
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
      const errorMessage = "SYSTEM ERROR: Invalid email syntax."
      setMessage(errorMessage)
      announce(errorMessage)
      emailInputRef.current?.focus()
      return
    }

    setIsLoading(true)
    setMessage(null)
    announce("Initiating sequence...")

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          source: 'hero-form'
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        const successMessage = data.message || "✓ ACCESS REQUEST REGISTERED. STAND BY."
        setMessage(successMessage)
        setEmail("")
        announce(successMessage)
      } else {
        const errorMessage = data.error || "CONNECTION FAILURE. RETRY SEQUENCE."
        setMessage(errorMessage)
        announce(errorMessage)
        emailInputRef.current?.focus()
      }

    } catch (error) {
      console.error('Subscription error:', error)
      const errorMessage = "NETWORK ERROR. RETRY SEQUENCE."
      setMessage(errorMessage)
      announce(errorMessage)
      emailInputRef.current?.focus()
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
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
      className="relative min-h-screen flex items-center px-4 sm:px-6 md:pl-28 md:pr-12 py-20"
      tabIndex={-1}
      aria-label="Hero section - Early Access to Lumeo"
    >
      {/* Decorative vertical line */}
      <div className="absolute left-[6vw] top-0 bottom-0 w-px bg-white/5 hidden md:block" />

      {/* Main content */}
      <div ref={contentRef} className="flex-1 w-full max-w-5xl relative z-10">

        {/* Header Badge */}
        <div className="inline-flex items-center gap-2 mb-6 sm:mb-8">
          <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
          <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.2em] text-accent/80">
            System Initialization
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-mono text-white text-[clamp(2rem,6vw,4.5rem)] mb-6 sm:mb-8 tracking-tighter leading-[0.9] uppercase max-w-4xl">
          <span className="block text-white/40 text-[0.5em] mb-2 tracking-widest">Global Settlement Layer</span>
          Post-Legacy <br />
          <span className="text-accent/90">Infrastructure</span>
        </h1>

        {/* Subheading */}
        <p className="max-w-xl font-mono text-xs sm:text-sm text-muted-foreground leading-relaxed mb-10 border-l pl-6 border-white/10">
          Lumeo dismantles the friction of legacy banking. A wallet-native, non-custodial protocol where money moves at the speed of data.
          <br /><br />
          <span className="text-white/60">STATUS:</span> <span className="text-accent">PRE-ALPHA</span>
        </p>

        {/* Email signup form */}
        <form onSubmit={handleEmailSubmit} className="mb-12 max-w-lg" noValidate>
          <fieldset disabled={isLoading} className="border-0 p-0 m-0 relative">
            <legend className="sr-only">Access Request Terminal</legend>

            <div className="flex flex-col sm:flex-row gap-0">
              <div className="relative flex-1 group">
                <div className="absolute inset-0 bg-accent/5 opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 pointer-events-none" />
                <input
                  ref={emailInputRef}
                  id="email-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="ENTER_EMAIL_ADDRESS"
                  className="w-full input-advanced px-6 py-4 font-mono text-sm min-h-[56px] border-r-0 focus:z-10"
                  disabled={isLoading}
                  autoComplete="email"
                />
                {/* Corner Accents */}
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/30" />
                <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/30" />
              </div>

              <button
                ref={submitButtonRef}
                type="submit"
                disabled={isLoading || !email}
                className="px-8 py-4 bg-white/5 border border-white/10 border-l-0 text-accent font-mono text-xs uppercase tracking-widest hover:bg-accent hover:text-black hover:shadow-[0_0_30px_var(--accent)] focus:bg-accent focus:text-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed min-h-[56px] relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-accent/20 -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
                <span className="relative z-10 font-bold">{isLoading ? "PROCESSING..." : "REQUEST ACCESS"}</span>
              </button>
            </div>

            {message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-4 p-4 border transition-all duration-300 ${message.startsWith("✓")
                    ? "border-accent/30 bg-accent/5 text-accent"
                    : "border-destructive/30 bg-destructive/5 text-destructive"
                  }`}
                role="status"
              >
                <div className="font-mono text-xs uppercase tracking-wider">
                  {`> ${message}`}
                </div>
                {message.startsWith("✓") && (
                  <div className="mt-2 text-xs text-accent/80 font-mono normal-case tracking-normal">
                    Check your email for a confirmation link to secure your spot in the protocol queue.
                  </div>
                )}
              </motion.div>
            )}
          </fieldset>
        </form>

        {/* Countdown Timer Module */}
        <div className="mb-12">
          <CountdownTimer />
        </div>

        {/* Footer Meta */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8 sm:gap-12 border-t border-white/5 pt-8">
          <div>
            <div className="font-mono text-[10px] uppercase text-muted-foreground tracking-widest mb-2">Beta Access Window</div>
            <div className="font-mono text-white text-lg tracking-widest">Q3 2026</div>
          </div>
          <div>
            <div className="font-mono text-[10px] uppercase text-muted-foreground tracking-widest mb-2">System Status</div>
            <div className="flex items-center gap-2 font-mono text-xs text-accent">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
              </span>
              ONLINE
            </div>
          </div>
        </div>

      </div>

      {/* Decorative Elements - Architectural Marks */}
      <div className="absolute bottom-0 right-0 p-8 hidden md:block opacity-30 pointer-events-none">
        <div className="grid grid-cols-6 gap-2">
          {[...Array(24)].map((_, i) => (
            <div key={i} className={`w-0.5 h-0.5 ${Math.random() > 0.7 ? 'bg-accent' : 'bg-white/20'}`} />
          ))}
        </div>
      </div>
    </section>
  )
}