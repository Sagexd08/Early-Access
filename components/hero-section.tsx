"use client"

import { useEffect, useRef, useState } from "react"
import { CountdownTimer } from "@/components/countdown-timer"
import { AtomicCore } from "@/components/atomic-core"
import { Canvas } from "@react-three/fiber"
import { MagneticButton } from "@/components/magnetic-button"
import { useFocusAnnouncement } from "@/lib/use-keyboard-navigation"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { motion } from "framer-motion"

gsap.registerPlugin(ScrollTrigger)

// Static pattern — must be defined outside the component (module scope)
// so the server and client always produce the exact same class list.
const GRID_DOT_ACCENT: boolean[] = Array.from({ length: 16 }, (_, i) => i % 5 === 0)

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const emailInputRef = useRef<HTMLInputElement>(null)
  const submitButtonRef = useRef<HTMLButtonElement>(null)
  const progressRef = useRef({ value: 0 })
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const { announce } = useFocusAnnouncement()

  useEffect(() => {
    if (!sectionRef.current || !contentRef.current) return

    const ctx = gsap.context(() => {
      // Main content reveal
      gsap.fromTo(".stagger-element",
        {
          y: 40,
          opacity: 0,
          rotateX: 10
        },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 1.5,
          stagger: 0.15,
          ease: "expo.out"
        }
      )

      // Parallax effect on scroll
      gsap.to(".parallax-bg", {
        yPercent: 30,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      })

      // 3D Scroll Progress
      gsap.to(progressRef.current, {
        value: 1,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        }
      })

      // Fade out content as user scrolls down
      gsap.to(contentRef.current, {
        opacity: 0,
        y: -50,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "center top",
          scrub: true
        }
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
      className="relative h-[300vh] w-full"
      tabIndex={-1}
      aria-label="Hero section - Early Access to Lumeo"
    >
      {/* Sticky Container for Canvas and Content */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center px-6 sm:px-8 md:pl-28 md:pr-12 py-24">
        
        {/* 3D Canvas Background */}
        <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
          <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
            <AtomicCore progressRef={progressRef} />
          </Canvas>
        </div>

        {/* Decorative vertical lines for asymmetric grid */}
        <div className="absolute left-[10vw] top-0 bottom-0 w-px bg-white/8 hidden md:block parallax-bg" />
        <div className="absolute right-[25vw] top-0 bottom-0 w-px bg-white/8 hidden md:block parallax-bg" />

        {/* Main content - Brutalist/Staggered */}
        <div ref={contentRef} className="flex-1 w-full relative z-10 pt-20">

        <div className="flex flex-col md:flex-row justify-between items-start gap-12">
          {/* Left Column - Meta & Subheading */}
          <div className="md:w-[25vw] mt-12 md:mt-32 stagger-element order-2 md:order-1 relative z-20">
            <div className="inline-flex items-center gap-2 mb-10 border border-accent/25 px-3 py-1.5 bg-accent/4">
              <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse-ring" />
              <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-white/70">
                System Online
              </span>
            </div>

            <p className="font-mono text-xs sm:text-sm text-muted-foreground leading-relaxed border-l border-accent/40 pl-4">
              Lumeo dismantles the friction of legacy banking. A wallet-native, non-custodial protocol where money moves at the speed of data.
            </p>
            <div className="mt-8 font-mono text-[10px] sm:text-xs text-white/50 uppercase tracking-widest border border-white/8 px-4 py-3 bg-white/2 inline-block">
              Status <span className="text-accent font-medium">→ Pre-Alpha</span>
            </div>

            {/* Countdown Timer Module */}
            <div className="mt-12 scale-90 origin-left object-left">
              <CountdownTimer />
            </div>
          </div>

          {/* Right Column - Massive Typography & Form */}
          <div className="md:w-[65vw] stagger-element order-1 md:order-2 parallax-fast relative z-10">
            {/* Headline */}
            <h1 className="font-serif text-white text-[clamp(3.8rem,10vw,10.5rem)] tracking-[-0.02em] leading-[0.85] mb-14 text-balance text-scanline">
              <span className="block text-white/30 font-mono text-[0.7rem] md:text-[0.85rem] tracking-[0.45em] uppercase mb-2 font-normal not-italic">Settlement Infrastructure</span>
              POST&#8209;<br />
              <span className="ml-[4vw] text-accent inline-block italic">LEGACY</span><br />
              <span className="ml-[2vw] inline-block">INFRA</span>
            </h1>

            {/* Email signup form */}
            <form onSubmit={handleEmailSubmit} className="max-w-md ml-[2vw] stagger-element relative z-30 group" noValidate>
              <fieldset disabled={isLoading} className="border-0 p-0 m-0 relative">
                <legend className="sr-only">Access Request Terminal</legend>

                <div className="border border-white/12 bg-black/70 backdrop-blur-sm group-focus-within:border-accent/50 transition-all duration-500">
                  <div className="relative">
                    <label htmlFor="email-input" className="sr-only">Email address</label>
                    <input
                      ref={emailInputRef}
                      id="email-input"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="you@domain.com"
                      className="w-full bg-transparent px-5 py-4 font-mono text-sm text-white placeholder:text-white/25 focus:outline-none transition-colors duration-300 tracking-wide"
                      disabled={isLoading}
                      autoComplete="email"
                    />
                    <div className="absolute bottom-0 left-0 h-px w-0 bg-accent transition-all duration-500 group-focus-within:w-full" />
                  </div>
                  <div className="border-t border-white/12">
                    <MagneticButton className="w-full block">
                      <button
                        ref={submitButtonRef}
                        type="submit"
                        disabled={isLoading || !email}
                        className="w-full px-5 py-4 font-mono text-xs uppercase tracking-[0.28em] font-medium transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed relative overflow-hidden group bg-white/4 hover:bg-accent text-white/60 hover:text-black disabled:hover:bg-transparent disabled:hover:text-white/30"
                      >
                        {isLoading ? (
                          <span className="flex items-center justify-center gap-2 text-white/40">
                            <span className="w-3.5 h-px bg-current animate-pulse" />
                            Processing
                            <span className="w-3.5 h-px bg-current animate-pulse" />
                          </span>
                        ) : "Request Access"}
                      </button>
                    </MagneticButton>
                  </div>
                </div>

                {message && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mt-4 p-4 border transition-all duration-300 ${message.startsWith("✓")
                      ? "border-accent bg-accent/10 text-accent"
                      : "border-destructive bg-destructive/10 text-destructive"
                      }`}
                    role="status"
                  >
                    <div className="font-mono text-xs uppercase tracking-wider">
                      {`> ${message}`}
                    </div>
                  </motion.div>
                )}
              </fieldset>
            </form>
          </div>
        </div>

        {/* Footer Meta */}
        <div className="absolute bottom-[-10vh] md:bottom-[-20vh] right-[5vw] flex flex-col items-end gap-5 stagger-element">
          <div className="text-right border-r border-white/10 pr-4">
            <div className="font-mono text-[9px] uppercase text-white/30 tracking-[0.25em] mb-1">Beta Access</div>
            <div className="font-mono text-white/60 text-xs tracking-[0.15em]">Q3 2026</div>
          </div>
          <div className="text-right border-r border-white/10 pr-4">
            <div className="font-mono text-[9px] uppercase text-white/30 tracking-[0.25em] mb-1">Protocol</div>
            <div className="font-mono text-white/60 text-xs tracking-[0.15em]">v0.1 — Alpha</div>
          </div>
          <div className="text-right border-r border-accent/70 pr-4">
            <div className="font-mono text-[9px] uppercase text-white/30 tracking-[0.25em] mb-1">Status</div>
            <div className="flex items-center justify-end gap-2 font-mono text-xs text-accent">
              <span className="w-1 h-1 bg-accent rounded-full" />
              Online
            </div>
          </div>
        </div>

      </div>

      {/* Decorative Elements - Asymmetric Marks */}
      <div className="absolute top-[20vh] right-[10vw] hidden xl:block opacity-20 pointer-events-none parallax-fast">
        <div className="grid grid-cols-4 gap-4">
          {GRID_DOT_ACCENT.map((isAccent, i) => (
            <div key={i} className={`w-1 h-1 ${isAccent ? 'bg-accent' : 'bg-white'}`} />
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
        <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-white">Scroll to Converge</span>
        <div className="w-px h-12 bg-gradient-to-b from-white/50 to-transparent" />
      </div>

      </div>
    </section>
  )
}