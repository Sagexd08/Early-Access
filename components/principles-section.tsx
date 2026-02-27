"use client"

import { useRef, useEffect } from "react"
import { HighlightText } from "@/components/highlight-text"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export function PrinciplesSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const principlesRef = useRef<HTMLDivElement>(null)

  const principles = [
    {
      number: "01",
      titleParts: [
        { text: "INSTANT", highlight: true },
        { text: " SETTLEMENT", highlight: false },
      ],
      description: "Value transfers complete in milliseconds, not days. Quantum-speed verification eliminates waiting.",
      align: "left",
    },
    {
      number: "02",
      titleParts: [
        { text: "ZERO", highlight: true },
        { text: " FRICTION", highlight: false },
      ],
      description: "No intermediaries, no gas fees, no hidden costs. Pure peer-to-peer value flow.",
      align: "right",
    },
    {
      number: "03",
      titleParts: [
        { text: "CRYPTOGRAPHIC ", highlight: false },
        { text: "TRUST", highlight: true },
      ],
      description: "Powered by zero-knowledge proofs, not trust in institutions. Math is your guarantee.",
      align: "left",
    },
    {
      number: "04",
      titleParts: [
        { text: "INFINITE ", highlight: false },
        { text: "LIQUIDITY", highlight: true },
      ],
      description: "Cross-chain pooling ensures deep liquidity for any trading pair, anywhere, anytime.",
      align: "right",
    },
  ]

  useEffect(() => {
    if (!sectionRef.current || !headerRef.current || !principlesRef.current) return

    const ctx = gsap.context(() => {
      // Header slide in
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

      // Each principle slides in from its aligned side
      const articles = principlesRef.current?.querySelectorAll("article")
      articles?.forEach((article, index) => {
        const isRight = principles[index].align === "right"
        gsap.from(article, {
          x: isRight ? 80 : -80,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: article,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="principles" className="relative py-24 sm:py-32 md:py-40 px-6 sm:px-8 md:pl-28 md:pr-12">
      {/* Section header */}
      <div ref={headerRef} className="mb-16 sm:mb-20 md:mb-24">
        <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-accent text-glow-gold">03 / Principles</span>
        <h2 className="mt-4 font-serif text-4xl sm:text-5xl md:text-7xl tracking-tight font-light text-balance">How We <span className="italic">Work</span></h2>
      </div>

      {/* Staggered principles */}
      <div ref={principlesRef} className="space-y-16 sm:space-y-20 md:space-y-24 lg:space-y-32">
        {principles.map((principle, index) => (
          <article
            key={index}
            className={`flex flex-col ${principle.align === "right" ? "sm:items-end sm:text-right" : "items-start text-left"
              }`}
          >
            {/* Annotation label */}
            <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-accent/80 mb-3 sm:mb-4 border-l-2 border-accent/60 pl-2">
              {principle.number} / {principle.titleParts[0].text.split(" ")[0]}
            </span>

            <h3 className="font-serif text-3xl sm:text-4xl md:text-6xl lg:text-8xl tracking-tight leading-none font-light">
              {principle.titleParts.map((part, i) =>
                part.highlight ? (
                  <HighlightText key={i} parallaxSpeed={0.6}>
                    {part.text}
                  </HighlightText>
                ) : (
                  <span key={i}>{part.text}</span>
                ),
              )}
            </h3>

            {/* Description */}
            <p className="mt-4 sm:mt-6 max-w-md font-mono text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {principle.description}
            </p>

            {/* Decorative line with gradient */}
            <div
              className={`mt-6 sm:mt-8 h-px w-24 sm:w-40 md:w-64 ${
                principle.align === "right" ? "sm:mr-0" : "ml-0"
              }`}
              style={{
                background: principle.align === "right"
                  ? "linear-gradient(to left, var(--accent), transparent)"
                  : "linear-gradient(to right, var(--accent), transparent)",
                boxShadow: principle.align === "right"
                  ? "0 0 12px color-mix(in oklch, var(--accent), transparent 50%)"
                  : "0 0 12px color-mix(in oklch, var(--accent), transparent 50%)"
              }}
            />
          </article>
        ))}
      </div>
    </section>
  )
}
