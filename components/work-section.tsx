"use client"

import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const experiments = [
  {
    title: "Instant Settlement",
    medium: "Core Technology",
    description: "Quantum-speed transaction processing with sub-millisecond finality.",
    span: "col-span-1 sm:col-span-2 row-span-2",
  },
  {
    title: "Zero Gas Fees",
    medium: "User Experience",
    description: "Eliminate transaction costs through innovative settlement architecture.",
    span: "col-span-1 row-span-1",
  },
  {
    title: "Cross-Chain Flow",
    medium: "Infrastructure",
    description: "Seamless value transfer across Bitcoin, Ethereum, and Solana networks.",
    span: "col-span-1 row-span-2",
  },
  {
    title: "Wallet Integration",
    medium: "Connectivity",
    description: "Native support for MetaMask, Phantom, and hardware wallets.",
    span: "col-span-1 row-span-1",
  },
  {
    title: "Privacy Layer",
    medium: "Security",
    description: "Zero-knowledge proofs ensure transaction privacy and verification.",
    span: "col-span-1 sm:col-span-2 row-span-1",
  },
  {
    title: "Liquidity Pools",
    medium: "DeFi Integration",
    description: "Deep liquidity aggregation for optimal trading execution.",
    span: "col-span-1 row-span-1",
  },
]

export function WorkSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current || !headerRef.current || !gridRef.current) return

    const ctx = gsap.context(() => {
      // Header slide in from left
      gsap.fromTo(
        headerRef.current,
        { x: -60, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
        },
      )

      const cards = gridRef.current?.querySelectorAll("article")
      if (cards && cards.length > 0) {
        gsap.set(cards, { y: 60, opacity: 0 })
        gsap.to(cards, {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="work" className="relative py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:pl-28 md:pr-12">
      {/* Section header */}
      <div ref={headerRef} className="mb-8 sm:mb-12 md:mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-accent">02 / Features</span>
          <h2 className="mt-3 sm:mt-4 font-[var(--font-bebas)] text-4xl sm:text-5xl md:text-7xl tracking-tight">KEY FEATURES</h2>
        </div>
        <p className="max-w-xs font-mono text-xs text-muted-foreground leading-relaxed md:text-right">
          Revolutionary payment infrastructure built for the future of finance.
        </p>
      </div>

      {/* Asymmetric grid - responsive layout */}
      <div
        ref={gridRef}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 auto-rows-[160px] sm:auto-rows-[180px] md:auto-rows-[200px]"
      >
        {experiments.map((experiment, index) => (
          <WorkCard key={index} experiment={experiment} index={index} persistHover={index === 0} />
        ))}
      </div>
    </section>
  )
}

function WorkCard({
  experiment,
  index,
  persistHover = false,
}: {
  experiment: {
    title: string
    medium: string
    description: string
    span: string
  }
  index: number
  persistHover?: boolean
}) {
  const [isHovered, setIsHovered] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const cardRef = useRef<HTMLElement>(null)
  const [isScrollActive, setIsScrollActive] = useState(false)

  useEffect(() => {
    if (!persistHover || !cardRef.current) return

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: cardRef.current,
        start: "top 80%",
        onEnter: () => setIsScrollActive(true),
      })
    }, cardRef)

    return () => ctx.revert()
  }, [persistHover])

  const isActive = isHovered || isFocused || isScrollActive

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      // Could trigger additional interactions here
    }
  }

  return (
    <article
      ref={cardRef}
      className={cn(
        "focus-card group relative border border-border/40 p-4 sm:p-5 flex flex-col justify-between transition-all duration-500 cursor-pointer overflow-hidden touch-manipulation",
        experiment.span,
        isActive && "border-accent/60",
        "active:scale-95", // Touch feedback
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setIsHovered(false)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="article"
      aria-label={`${experiment.title} - ${experiment.description}`}
    >
      {/* Background layer */}
      <div
        className={cn(
          "absolute inset-0 bg-accent/5 transition-opacity duration-500",
          isActive ? "opacity-100" : "opacity-0",
        )}
      />

      {/* Content */}
      <div className="relative z-10">
        <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-widest text-muted-foreground">
          {experiment.medium}
        </span>
        <h3
          className={cn(
            "mt-2 sm:mt-3 font-[var(--font-bebas)] text-xl sm:text-2xl md:text-4xl tracking-tight transition-colors duration-300 leading-tight",
            isActive ? "text-accent" : "text-foreground",
          )}
        >
          {experiment.title}
        </h3>
      </div>

      {/* Description - reveals on hover/touch/focus */}
      <div className="relative z-10">
        <p
          className={cn(
            "font-mono text-xs text-muted-foreground leading-relaxed transition-all duration-500 max-w-[280px]",
            isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
          )}
        >
          {experiment.description}
        </p>
      </div>

      {/* Index marker */}
      <span
        className={cn(
          "absolute bottom-3 right-3 sm:bottom-4 sm:right-4 font-mono text-[9px] sm:text-[10px] transition-colors duration-300",
          isActive ? "text-accent" : "text-muted-foreground/40",
        )}
        aria-hidden="true"
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      {/* Corner line */}
      <div
        className={cn(
          "absolute top-0 right-0 w-8 h-8 sm:w-12 sm:h-12 transition-all duration-500",
          isActive ? "opacity-100" : "opacity-0",
        )}
        aria-hidden="true"
      >
        <div className="absolute top-0 right-0 w-full h-[1px] bg-accent" />
        <div className="absolute top-0 right-0 w-[1px] h-full bg-accent" />
      </div>
    </article>
  )
}
