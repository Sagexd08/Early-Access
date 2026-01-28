"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import { cn } from "@/lib/utils"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const signals = [
  {
    date: "2026.01.15",
    title: "Quantum Settlement",
    note: "Sub-millisecond transaction finality through quantum-verified consensus.",
  },
  {
    date: "2026.01.08",
    title: "Zero-Knowledge Pools",
    note: "Privacy-preserving liquidity aggregation across multiple chains.",
  },
  {
    date: "2025.12.20",
    title: "Cross-Chain Bridge",
    note: "Seamless value transfer between Bitcoin, Ethereum, and Solana.",
  },
  {
    date: "2025.12.10",
    title: "Wallet Integration",
    note: "Native support for MetaMask, Phantom, and hardware wallets.",
  },
  {
    date: "2025.11.28",
    title: "Gas-Free Transactions",
    note: "Eliminate network fees through innovative settlement architecture.",
  },
]

export function SignalsSection() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)
  const cursorRef = useRef<HTMLDivElement>(null)
  const [isHovering, setIsHovering] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)

  // Touch momentum scrolling state
  const touchState = useRef({
    startX: 0,
    startY: 0,
    lastX: 0,
    lastTime: 0,
    velocityX: 0,
    isScrolling: false,
    momentumId: 0,
  })

  // Handle touch momentum scrolling
  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (!scrollRef.current) return
    
    const touch = e.touches[0]
    const now = Date.now()
    
    touchState.current = {
      ...touchState.current,
      startX: touch.clientX,
      startY: touch.clientY,
      lastX: touch.clientX,
      lastTime: now,
      velocityX: 0,
      isScrolling: false,
    }
    
    // Cancel any ongoing momentum
    if (touchState.current.momentumId) {
      cancelAnimationFrame(touchState.current.momentumId)
    }
    
    setIsDragging(true)
  }, [])

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!scrollRef.current || !touchState.current) return
    
    const touch = e.touches[0]
    const now = Date.now()
    const deltaX = touchState.current.lastX - touch.clientX
    const deltaY = Math.abs(touch.clientY - touchState.current.startY)
    const deltaTime = now - touchState.current.lastTime
    
    // Determine if this is horizontal scrolling
    if (!touchState.current.isScrolling) {
      const deltaXAbs = Math.abs(touch.clientX - touchState.current.startX)
      if (deltaXAbs > 10 || deltaY > 10) {
        touchState.current.isScrolling = true
        // If horizontal movement is dominant, prevent default to enable smooth scrolling
        if (deltaXAbs > deltaY) {
          e.preventDefault()
        }
      }
    }
    
    // Calculate velocity for momentum
    if (deltaTime > 0) {
      touchState.current.velocityX = deltaX / deltaTime
    }
    
    // Apply scroll if horizontal movement is dominant
    if (touchState.current.isScrolling && Math.abs(touch.clientX - touchState.current.startX) > Math.abs(touch.clientY - touchState.current.startY)) {
      scrollRef.current.scrollLeft += deltaX
      e.preventDefault()
    }
    
    touchState.current.lastX = touch.clientX
    touchState.current.lastTime = now
  }, [])

  const handleTouchEnd = useCallback(() => {
    if (!scrollRef.current) return
    
    setIsDragging(false)
    
    // Apply momentum scrolling
    const velocity = touchState.current.velocityX
    if (Math.abs(velocity) > 0.1) {
      let currentVelocity = velocity * 100 // Scale velocity
      const deceleration = 0.95
      const minVelocity = 0.1
      
      const momentum = () => {
        if (Math.abs(currentVelocity) < minVelocity) {
          touchState.current.momentumId = 0
          return
        }
        
        if (scrollRef.current) {
          scrollRef.current.scrollLeft += currentVelocity
        }
        
        currentVelocity *= deceleration
        touchState.current.momentumId = requestAnimationFrame(momentum)
      }
      
      momentum()
    }
  }, [])

  // Update scroll progress for visual feedback
  const updateScrollProgress = useCallback(() => {
    if (!scrollRef.current) return
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
    const maxScroll = scrollWidth - clientWidth
    const progress = maxScroll > 0 ? scrollLeft / maxScroll : 0
    setScrollProgress(Math.max(0, Math.min(1, progress)))
  }, [])

  // Enhanced scroll event handler with throttling
  const handleScroll = useCallback(() => {
    updateScrollProgress()
  }, [updateScrollProgress])

  // Keyboard navigation support
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!scrollRef.current) return
    
    const scrollAmount = 200 // Pixels to scroll per key press
    
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault()
        scrollRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
        break
      case 'ArrowRight':
        e.preventDefault()
        scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
        break
      case 'Home':
        e.preventDefault()
        scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' })
        break
      case 'End':
        e.preventDefault()
        scrollRef.current.scrollTo({ left: scrollRef.current.scrollWidth, behavior: 'smooth' })
        break
    }
  }, [])

  useEffect(() => {
    const scrollContainer = scrollRef.current
    if (!scrollContainer) return

    // Add touch event listeners
    scrollContainer.addEventListener('touchstart', handleTouchStart, { passive: false })
    scrollContainer.addEventListener('touchmove', handleTouchMove, { passive: false })
    scrollContainer.addEventListener('touchend', handleTouchEnd, { passive: true })
    
    // Add scroll listener for progress tracking
    scrollContainer.addEventListener('scroll', handleScroll, { passive: true })
    
    // Add keyboard navigation
    scrollContainer.addEventListener('keydown', handleKeyDown)
    
    // Make container focusable for keyboard navigation
    scrollContainer.setAttribute('tabindex', '0')
    scrollContainer.setAttribute('role', 'region')
    scrollContainer.setAttribute('aria-label', 'Horizontally scrollable signals')
    
    // Initial progress calculation
    updateScrollProgress()

    return () => {
      scrollContainer.removeEventListener('touchstart', handleTouchStart)
      scrollContainer.removeEventListener('touchmove', handleTouchMove)
      scrollContainer.removeEventListener('touchend', handleTouchEnd)
      scrollContainer.removeEventListener('scroll', handleScroll)
      scrollContainer.removeEventListener('keydown', handleKeyDown)
      
      // Cancel any ongoing momentum
      if (touchState.current.momentumId) {
        cancelAnimationFrame(touchState.current.momentumId)
      }
    }
  }, [handleTouchStart, handleTouchMove, handleTouchEnd, handleScroll, handleKeyDown, updateScrollProgress])

  useEffect(() => {
    if (!sectionRef.current || !cursorRef.current) return

    const section = sectionRef.current
    const cursor = cursorRef.current

    const handleMouseMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      gsap.to(cursor, {
        x: x,
        y: y,
        duration: 0.5,
        ease: "power3.out",
      })
    }

    const handleMouseEnter = () => setIsHovering(true)
    const handleMouseLeave = () => setIsHovering(false)

    section.addEventListener("mousemove", handleMouseMove)
    section.addEventListener("mouseenter", handleMouseEnter)
    section.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      section.removeEventListener("mousemove", handleMouseMove)
      section.removeEventListener("mouseenter", handleMouseEnter)
      section.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [])

  useEffect(() => {
    if (!sectionRef.current || !headerRef.current || !cardsRef.current) return

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
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        },
      )

      const cards = cardsRef.current?.querySelectorAll("article")
      if (cards) {
        gsap.fromTo(
          cards,
          { x: -100, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: cardsRef.current,
              start: "top 90%",
              toggleActions: "play none none reverse",
            },
          },
        )
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="signals" ref={sectionRef} className="relative py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:pl-28 md:pr-0">
      <div
        ref={cursorRef}
        className={cn(
          "pointer-events-none absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 z-50",
          "w-8 h-8 sm:w-12 sm:h-12 rounded-full border-2 border-accent bg-accent",
          "transition-opacity duration-300 hidden md:block",
          isHovering ? "opacity-100" : "opacity-0",
        )}
      />

      {/* Section header */}
      <div ref={headerRef} className="mb-8 sm:mb-12 md:mb-16 pr-4 sm:pr-6 md:pr-12">
        <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-accent">01 / USP</span>
        <h2 className="mt-3 sm:mt-4 font-[var(--font-bebas)] text-4xl sm:text-5xl md:text-7xl tracking-tight">LATEST UPDATES</h2>
      </div>

      {/* Horizontal scroll container - enhanced for touch devices */}
      <div
        ref={(el) => {
          scrollRef.current = el
          cardsRef.current = el
        }}
        className={cn(
          "flex gap-4 sm:gap-6 md:gap-8 overflow-x-auto pb-6 sm:pb-8 pr-4 sm:pr-8 md:pr-12",
          "scrollbar-hide touch-pan-x scroll-smooth",
          "transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-accent/50 focus:ring-offset-2 focus:ring-offset-background",
          isDragging && "cursor-grabbing select-none"
        )}
        style={{ 
          scrollbarWidth: "none", 
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch", // Enhanced touch scrolling on iOS
          scrollSnapType: "x proximity", // Subtle snap for better UX
        }}
      >
        {signals.map((signal, index) => (
          <SignalCard key={index} signal={signal} index={index} isDragging={isDragging} />
        ))}
      </div>

      {/* Enhanced scroll indicator with progress */}
      <div className="flex justify-center mt-6 sm:mt-8">
        <div className="flex items-center gap-2">
          {/* Progress bar */}
          <div className="w-16 sm:w-20 h-1 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-accent transition-all duration-300 ease-out rounded-full"
              style={{ width: `${scrollProgress * 100}%` }}
            />
          </div>
          
          {/* Scroll hint text */}
          <span className="font-mono text-[9px] sm:text-[10px] text-muted-foreground/60 ml-2">
            {scrollProgress < 0.1 ? "Swipe to explore" : scrollProgress > 0.9 ? "End reached" : "Keep scrolling"}
          </span>
          
          {/* Keyboard hint for desktop */}
          <span className="hidden md:inline font-mono text-[9px] text-muted-foreground/40 ml-2">
            Use ← → keys
          </span>
        </div>
      </div>
    </section>
  )
}

function SignalCard({
  signal,
  index,
  isDragging,
}: {
  signal: { date: string; title: string; note: string }
  index: number
  isDragging?: boolean
}) {
  const [isPressed, setIsPressed] = useState(false)

  const handleTouchStart = () => {
    setIsPressed(true)
  }

  const handleTouchEnd = () => {
    setIsPressed(false)
  }

  return (
    <article
      className={cn(
        "group relative flex-shrink-0 w-72 sm:w-80 touch-manipulation",
        "transition-all duration-300 ease-out",
        "hover:-translate-y-2 active:scale-95",
        isDragging && "pointer-events-none", // Disable interactions while dragging
        isPressed && "scale-95", // Touch feedback
      )}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      {/* Card with paper texture effect */}
      <div className="relative bg-card border border-border/50 md:border-t md:border-l md:border-r-0 md:border-b-0 p-6 sm:p-8">
        {/* Top torn edge effect */}
        <div className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/40 to-transparent" />

        {/* Issue number - editorial style */}
        <div className="flex items-baseline justify-between mb-6 sm:mb-8">
          <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            No. {String(index + 1).padStart(2, "0")}
          </span>
          <time className="font-mono text-[9px] sm:text-[10px] text-muted-foreground/60">{signal.date}</time>
        </div>

        {/* Title */}
        <h3 className="font-[var(--font-bebas)] text-3xl sm:text-4xl tracking-tight mb-3 sm:mb-4 group-hover:text-accent transition-colors duration-300 leading-tight">
          {signal.title}
        </h3>

        {/* Divider line */}
        <div className="w-10 sm:w-12 h-px bg-accent/60 mb-4 sm:mb-6 group-hover:w-full transition-all duration-500" />

        {/* Description */}
        <p className="font-mono text-xs text-muted-foreground leading-relaxed">{signal.note}</p>

        {/* Bottom right corner fold effect */}
        <div className="absolute bottom-0 right-0 w-4 h-4 sm:w-6 sm:h-6 overflow-hidden">
          <div className="absolute bottom-0 right-0 w-6 h-6 sm:w-8 sm:h-8 bg-background rotate-45 translate-x-3 translate-y-3 sm:translate-x-4 sm:translate-y-4 border-t border-l border-border/30" />
        </div>
      </div>

      {/* Shadow/depth layer */}
      <div className="absolute inset-0 -z-10 translate-x-1 translate-y-1 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </article>
  )
}
