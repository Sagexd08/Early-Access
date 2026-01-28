"use client"

import { useEffect, useRef, useState } from "react"
import { CountdownTimer } from "@/components/countdown-timer"
import { AnimatedNoise } from "@/components/animated-noise"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

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

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes("@")) {
      setMessage("Please enter a valid email address")
      return
    }

    setIsLoading(true)
    setMessage(null)

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
        setMessage("✓ Welcome to the alpha. Check your email for next steps.")
        setEmail("")
      } else {
        setMessage(data.error || "Something went wrong. Please try again.")
      }
    } catch (error) {
      setMessage("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section ref={sectionRef} id="hero" className="relative min-h-screen flex items-center pl-6 md:pl-28 pr-6 md:pr-12">
      <AnimatedNoise opacity={0.03} />

      {/* Left vertical label */}
      <div className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground -rotate-90 origin-left block whitespace-nowrap">
          EARLY ACCESS
        </span>
      </div>

      {/* Main content */}
      <div ref={contentRef} className="flex-1 w-full">
        {/* Tagline */}
        <h2 className="font-[var(--font-bebas)] text-white text-[clamp(1.5rem,4vw,3rem)] mb-6 tracking-wide">
          Early Access to Lumeo
        </h2>

        {/* Subheading */}
        <p className="max-w-2xl font-mono text-sm text-muted-foreground leading-relaxed mb-8">
          We are dismantling the slow rails of legacy banking. Lumeo is a non-custodial, wallet-first settlement layer. Money moves as fast as data. No intermediaries.
        </p>

        {/* Alpha Badge */}
        <div className="inline-block border border-accent px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-accent mb-8">
          v0.1 / Alpha
        </div>

        {/* Email signup form */}
        <form onSubmit={handleEmailSubmit} className="mb-8 max-w-md">
          <div className="flex gap-4 mb-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="flex-1 bg-transparent border border-white/20 px-4 py-3 font-mono text-sm text-white placeholder:text-white/50 focus:border-accent focus:outline-none"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-accent text-black font-mono text-xs uppercase tracking-widest hover:bg-accent/90 transition-colors disabled:opacity-50"
            >
              {isLoading ? "Joining..." : "Enter the Protocol"}
            </button>
          </div>
          {message && (
            <p className={`font-mono text-xs ${message.startsWith("✓") ? "text-green-400" : "text-red-400"}`}>
              {message}
            </p>
          )}
        </form>

        {/* Beta release note */}
        <p className="font-mono text-xs text-muted-foreground mb-12">
          Beta release in 6 months. Secure your spot now.
        </p>

        {/* Countdown Timer */}
        <div className="mb-16">
          <CountdownTimer />
        </div>
      </div>

      {/* Alpha Badge (floating) */}
      <div className="absolute bottom-8 right-8 md:bottom-12 md:right-12">
        <div className="border border-border px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          v0.1 / Alpha
        </div>
      </div>
    </section>
  )
}