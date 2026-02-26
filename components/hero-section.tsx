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

      gsap.to(".parallax-fast", {
        yPercent: -50,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      })

      // Advanced 3D Mouse Parallax effect
      const heroText = document.querySelector('.hero-text-3d');
      if (heroText && sectionRef.current) {
        sectionRef.current.addEventListener('mousemove', (e) => {
          const { clientX, clientY } = e;
          const { innerWidth, innerHeight } = window;

          // Calculate normalized coordinates (-1 to 1)
          const xPos = (clientX / innerWidth - 0.5) * 2;
          const yPos = (clientY / innerHeight - 0.5) * 2;

          gsap.to(heroText, {
            rotationY: xPos * 15, // Max rotation 15deg
            rotationX: -yPos * 15, // Max rotation 15deg
            transformPerspective: 900,
            transformOrigin: "center center",
            ease: "power2.out",
            duration: 0.5
          });
        });

        sectionRef.current.addEventListener('mouseleave', () => {
          gsap.to(heroText, {
            rotationY: 0,
            rotationX: 0,
            ease: "power3.out",
            duration: 1
          });
        });
      }
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
      {/* Decorative vertical lines for asymmetric grid */}
      <div className="absolute left-[10vw] top-0 bottom-0 w-px bg-white/5 hidden md:block parallax-bg" />
      <div className="absolute right-[25vw] top-0 bottom-0 w-px bg-white/5 hidden md:block parallax-bg" />

      {/* Main content - Brutalist/Staggered */}
      <div ref={contentRef} className="flex-1 w-full relative z-10 pt-20">

        <div className="flex flex-col md:flex-row justify-between items-start gap-12">
          {/* Left Column - Meta & Subheading */}
          <div className="md:w-[25vw] mt-12 md:mt-32 stagger-element order-2 md:order-1 relative z-20">
            <div className="inline-flex items-center gap-2 mb-12 border border-white/10 px-3 py-1 bg-black">
              <div className="w-1.5 h-1.5 bg-accent rounded-none animate-pulse" />
              <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.2em] text-white">
                SYSTEM INIT
              </span>
            </div>

            <p className="font-mono text-xs sm:text-sm text-muted-foreground leading-relaxed border-l-2 pl-4 border-accent">
              Lumeo dismantles the friction of legacy banking. A wallet-native, non-custodial protocol where money moves at the speed of data.
            </p>
            <div className="mt-8 font-mono text-[10px] sm:text-xs text-white uppercase tracking-widest border border-white/10 p-4 bg-white/5 inline-block">
              STATUS: <span className="text-accent ml-2">PRE-ALPHA</span>
            </div>

            {/* Countdown Timer Module */}
            <div className="mt-12 scale-90 origin-left object-left">
              <CountdownTimer />
            </div>
          </div>

          {/* Right Column - Massive Typography & Form */}
          <div className="md:w-[65vw] stagger-element order-1 md:order-2 parallax-fast relative z-10" style={{ perspective: "1000px" }}>
            {/* Massive, Grid-Breaking Headline styled for 3D */}
            <h1 className="hero-text-3d font-display text-white text-[clamp(4rem,12vw,12rem)] tracking-tighter leading-[0.8] uppercase mb-12 mix-blend-difference" style={{ transformStyle: "preserve-3d" }}>
              <span className="block text-white/30 font-mono text-[1rem] md:text-[2rem] transform -translate-y-4 md:-translate-y-8 tracking-[1em] md:tracking-[2em] uppercase origin-left translate-z-[50px]">Settlement</span>
              POST-<br />
              <span className="ml-[10vw] text-accent translate-z-[80px] inline-block">LEGACY</span><br />
              <span className="ml-[5vw] translate-z-[120px] inline-block">INFRA</span>
            </h1>

            {/* Email signup form - Placed asymmetrically */}
            <form onSubmit={handleEmailSubmit} className="max-w-120 ml-[5vw] stagger-element relative z-30" noValidate>
              <fieldset disabled={isLoading} className="border-0 p-0 m-0 relative">
                <legend className="sr-only">Access Request Terminal</legend>

                <div className="flex flex-col gap-0 border border-white/20 p-2 bg-black/50 backdrop-blur-md">
                  <div className="relative w-full group mb-2">
                    <input
                      ref={emailInputRef}
                      id="email-input"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="ENTER_EMAIL_ADDRESS"
                      className="w-full bg-transparent border-b border-white/20 px-4 py-4 font-mono text-sm min-h-[56px] focus:outline-none focus:border-accent text-white placeholder:text-white/30 transition-colors rounded-none"
                      disabled={isLoading}
                      autoComplete="email"
                    />
                  </div>

                  <button
                    ref={submitButtonRef}
                    type="submit"
                    disabled={isLoading || !email}
                    className="w-full px-8 py-4 bg-white text-black font-mono text-xs uppercase tracking-[0.2em] font-bold hover:bg-accent hover:text-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
                  >
                    <span className="relative z-10 block mix-blend-difference text-white group-hover:text-black transition-colors">{isLoading ? "PROCESSING..." : "REQUEST ACCESS"}</span>
                    <div className="absolute inset-0 bg-accent translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
                  </button>
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

        {/* Footer Meta - Pushed to bottom right */}
        <div className="absolute bottom-[-10vh] md:bottom-[-20vh] right-[5vw] flex flex-col items-end gap-6 stagger-element opacity-60">
          <div className="text-right border-r-2 border-accent pr-4">
            <div className="font-mono text-[10px] uppercase text-white/50 tracking-[0.2em] mb-1">Beta Access</div>
            <div className="font-mono text-white text-sm tracking-[0.2em]">Q3 2026</div>
          </div>
          <div className="text-right border-r-2 border-accent pr-4">
            <div className="font-mono text-[10px] uppercase text-white/50 tracking-[0.2em] mb-1">Status</div>
            <div className="flex items-center justify-end gap-2 font-mono text-xs text-accent">
              <span className="w-1.5 h-1.5 bg-accent rounded-none animate-pulse"></span>
              ONLINE
            </div>
          </div>
        </div>

      </div>

      {/* Decorative Elements - Asymmetric Marks */}
      <div className="absolute top-[20vh] right-[10vw] hidden xl:block opacity-20 pointer-events-none parallax-fast">
        <div className="grid grid-cols-4 gap-4">
          {[...Array(16)].map((_, i) => (
            <div key={i} className={`w-1 h-1 ${Math.random() > 0.8 ? 'bg-accent' : 'bg-white'}`} />
          ))}
        </div>
      </div>
    </section>
  )
}