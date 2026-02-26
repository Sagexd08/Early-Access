"use client"

import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { motion, useMotionTemplate, useMotionValue, useTransform } from "framer-motion"

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
          <h2 className="mt-3 sm:mt-4 font-(--font-bebas) text-4xl sm:text-5xl md:text-7xl tracking-tight">KEY FEATURES</h2>
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

  // Mouse tracking for glow and 3D effect
  const mouseX = useMotionValue(0.5); // Initialize in middle
  const mouseY = useMotionValue(0.5);

  let bounds: DOMRect | null = null;

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    if (!bounds) bounds = currentTarget.getBoundingClientRect();
    const xPct = (clientX - bounds.left) / bounds.width;
    const yPct = (clientY - bounds.top) / bounds.height;

    mouseX.set(xPct);
    mouseY.set(yPct);
  }

  function handleMouseLeave() {
    setIsHovered(false);
    bounds = null;
    // Reset to center smoothly
    mouseX.set(0.5);
    mouseY.set(0.5);
  }

  // Bind values for 3D tilt (rotateX inverted from yPct)
  const rotateX = useTransform(mouseY, [0, 1], [15, -15]);
  const rotateY = useTransform(mouseX, [0, 1], [-15, 15]);
  const maxGlowX = useTransform(mouseX, [0, 1], [0, 100]);
  const maxGlowY = useTransform(mouseY, [0, 1], [0, 100]);

  const isActive = isHovered || isFocused

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
    }
  }

  return (
    <div style={{ perspective: "1000px" }} className={cn(experiment.span, "h-full")}>
      <motion.article
        ref={cardRef}
        whileHover={{ zIndex: 10 }}
        whileTap={{ scale: 0.98 }}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        onMouseMove={handleMouseMove}
        className={cn(
          "focus-card group relative border border-white/10 bg-black p-6 flex flex-col justify-between transition-colors duration-500 cursor-pointer overflow-hidden rounded-none h-full",
          isActive ? "border-accent" : ""
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onTouchStart={() => setIsHovered(true)}
        onTouchEnd={() => setIsHovered(false)}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="article"
        aria-label={`${experiment.title} - ${experiment.description}`}
      >
        {/* Magnetic Glow Effect */}
        <motion.div
          className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100"
          style={{
            background: useMotionTemplate`
            radial-gradient(
              400px circle at ${maxGlowX}% ${maxGlowY}%,
              var(--accent) 0%,
              transparent 80%
            )
          `,
            opacity: 0.15
          }}
        />

        {/* Crosshair corner dots (Brutalist) */}
        <div className="absolute top-2 left-2 w-1 h-1 bg-white/20" />
        <div className="absolute top-2 right-2 w-1 h-1 bg-white/20" />
        <div className="absolute bottom-2 left-2 w-1 h-1 bg-white/20" />
        <div className="absolute bottom-2 right-2 w-1 h-1 bg-white/20" />

        {/* Content */}
        <div className="relative z-10">
          <span className="font-mono text-[10px] uppercase tracking-widest text-white/50 border border-white/10 px-2 py-1 bg-white/5 inline-block">
            {experiment.medium}
          </span>
          <h3
            className={cn(
              "mt-6 font-display text-3xl sm:text-4xl md:text-5xl tracking-tighter uppercase transition-colors duration-300 leading-[0.9]",
              isActive ? "text-white mix-blend-difference" : "text-white"
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

        {/* Interactive geometric reveal line */}
        <div
          className={cn(
            "absolute top-0 right-0 w-[50%] h-[2px] bg-accent transform origin-right transition-transform duration-500",
            isActive ? "scale-x-100" : "scale-x-0"
          )}
          aria-hidden="true"
        />
      </motion.article>
    </div>
  )
}
