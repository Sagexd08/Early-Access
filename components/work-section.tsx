"use client"

import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { motion } from "framer-motion"
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
    <section ref={sectionRef} id="work" className="relative py-24 sm:py-32 md:py-40 px-6 sm:px-8 md:pl-28 md:pr-12">
      {/* Section header */}
      <div ref={headerRef} className="mb-8 sm:mb-12 md:mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-accent">02 / Features</span>
          <h2 className="mt-3 sm:mt-4 font-serif text-4xl sm:text-5xl md:text-7xl tracking-tight font-light text-balance">Key <span className="italic">Features</span></h2>
        </div>
        <p className="max-w-xs font-mono text-xs text-muted-foreground leading-relaxed md:text-right border-r border-accent/30 pr-4 text-balance">
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

  const isActive = isHovered || isFocused

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
    }
  }

  return (
    <motion.article
      ref={cardRef}
      whileHover={{ scale: 1.02, zIndex: 10 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={cn(
        "focus-card group relative border border-white/10 bg-black/50 backdrop-blur-md p-6 flex flex-col justify-between transition-colors duration-500 cursor-pointer overflow-hidden rounded-none clip-corner-md",
        isActive ? "border-accent" : ""
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

      {/* Crosshair corner dots (Brutalist) */}
      <div className="absolute top-2 left-2 w-1 h-1 bg-white/20 transition-colors duration-300 group-hover:bg-accent/60" />
      <div className="absolute top-2 right-2 w-1 h-1 bg-white/20 transition-colors duration-300 group-hover:bg-accent/60" />
      <div className="absolute bottom-2 left-2 w-1 h-1 bg-white/20 transition-colors duration-300 group-hover:bg-accent/60" />
      <div className="absolute bottom-2 right-2 w-1 h-1 bg-white/20 transition-colors duration-300 group-hover:bg-accent/60" />

      <div className="relative z-10">
        <span className="font-mono text-[10px] uppercase tracking-widest text-white/40 border border-white/10 px-2 py-1 bg-white/3 inline-block group-hover:border-accent/50 group-hover:text-accent group-hover:bg-accent/5 transition-all duration-300">
          {experiment.medium}
        </span>
        <h3
          className={cn(
            "mt-6 font-display text-3xl sm:text-4xl md:text-5xl tracking-tighter uppercase transition-colors duration-300 leading-[0.9]",
            isActive ? "text-white" : "text-white"
          )}
        >
          {experiment.title}
        </h3>
      </div>

      {/* Description */}
      <div className="relative z-10 mt-8">
        <p
          className={cn(
            "font-mono text-xs text-white/70 leading-relaxed transition-all duration-500 max-w-[280px]",
            isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
        >
          {experiment.description}
        </p>
      </div>

      {/* Index marker */}
      <span
        className={cn(
          "absolute bottom-6 right-6 font-mono text-xs transition-colors duration-300",
          isActive ? "text-accent" : "text-white/20"
        )}
        aria-hidden="true"
      >
        {String(index + 1).padStart(2, "0")} /
      </span>

      {/* Interactive geometric reveal line — top + left edges */}
      <div
        className={cn(
          "absolute top-0 right-0 w-[50%] h-[2px] transform origin-right transition-transform duration-500",
          isActive ? "scale-x-100" : "scale-x-0"
        )}
        style={{ background: "linear-gradient(to left, var(--accent), transparent)" }}
        aria-hidden="true"
      />
      <div
        className={cn(
          "absolute top-0 left-0 w-[2px] h-[40%] transform origin-top transition-transform duration-700 delay-100",
          isActive ? "scale-y-100" : "scale-y-0"
        )}
        style={{ background: "linear-gradient(to bottom, var(--accent), transparent)" }}
        aria-hidden="true"
      />
    </motion.article>
  )
}

