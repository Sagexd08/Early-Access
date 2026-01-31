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
      // Simulate API call for now (or replace with real one)
      await new Promise(resolve => setTimeout(resolve, 1500))

      const successMessage = "✓ ACCESS REQUEST REGISTERED. STAND BY."
      setMessage(successMessage)
      setEmail("")
      announce(successMessage)

    } catch (error) {
      const errorMessage = "CONNECTION FAILURE. RETRY LEASE."
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
        <p className="max-w-xl font-mono text-xs sm:text-sm text-muted-foreground leading-relaxed mb-10 border-l mb-10 pl-6 border-white/10">
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
                  className="w-full bg-black/40 backdrop-blur-sm border border-white/10 border-r-0 px-6 py-4 font-mono text-sm text-white placeholder:text-white/20 focus:border-accent focus:outline-none min-h-[56px] transition-all duration-300"
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
                className="px-8 py-4 bg-white/5 border border-white/10 border-l-0 text-accent font-mono text-xs uppercase tracking-widest hover:bg-accent hover:text-black focus:bg-accent focus:text-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed min-h-[56px] relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-accent/20 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300" />
                <span className="relative z-10">{isLoading ? "PROCESSING..." : "REQUEST ACCESS"}</span>
              </button>
            </div>

            {message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`absolute -bottom-8 left-0 font-mono text-[10px] uppercase tracking-wider ${message.startsWith("✓") ? "text-accent" : "text-destructive"}`}
                role="status"
              >
                {`> ${message}`}
              </motion.div>
            )}
          </fieldset>
        </form>

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

      {/* Decorative Elements */}
      <div className="absolute bottom-0 right-0 p-8 hidden md:block opacity-20 pointer-events-none">
        <div className="grid grid-cols-4 gap-1">
          {[...Array(16)].map((_, i) => (
            <div key={i} className={`w-1 h-1 ${Math.random() > 0.5 ? 'bg-accent' : 'bg-transparent'}`} />
          ))}
        </div>
      </div>
    </section>
  )
}