"use client"

import { useEffect, useRef, useState } from "react"
import { SplitFlapText, SplitFlapMuteToggle, SplitFlapAudioProvider } from "@/components/split-flap-text"
import { AnimatedNoise } from "@/components/animated-noise"
import { useFocusAnnouncement } from "@/lib/use-keyboard-navigation"
import gsap from "gsap"

export function LumeoAnimation() {
  const containerRef = useRef<HTMLDivElement>(null)
  const orchestratorRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  const { announce } = useFocusAnnouncement()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!orchestratorRef.current || !mounted) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } })

      // Phase 1: Screen wipe — top/bottom curtains retract
      tl.fromTo(".curtain-top",
        { scaleY: 1 },
        { scaleY: 0, duration: 1.2, transformOrigin: "top center" },
        0
      )
      tl.fromTo(".curtain-bottom",
        { scaleY: 1 },
        { scaleY: 0, duration: 1.2, transformOrigin: "bottom center" },
        0
      )

      // Phase 2: Architectural grid lines etch in
      tl.fromTo(".grid-line-h",
        { scaleX: 0 },
        { scaleX: 1, duration: 1.0, stagger: 0.08, ease: "power4.inOut" },
        0.6
      )
      tl.fromTo(".grid-line-v",
        { scaleY: 0 },
        { scaleY: 1, duration: 1.0, stagger: 0.08, ease: "power4.inOut" },
        0.6
      )

      // Phase 3: Corner markers snap in from edges
      tl.fromTo(".corner-mark",
        { opacity: 0, scale: 0.5 },
        { opacity: 1, scale: 1, duration: 0.5, stagger: 0.05 },
        1.0
      )

      // Phase 4: LUMEO text container rises
      tl.fromTo(".lumeo-block",
        { opacity: 0, y: 60, rotateX: -15 },
        { opacity: 1, y: 0, rotateX: 0, duration: 1.4, ease: "expo.out" },
        1.2
      )

      // Phase 5: Subheading and metadata stagger in
      tl.fromTo(".meta-stagger",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: "power3.out" },
        1.8
      )

      // Phase 6: CTA hint fades up last
      tl.fromTo(".cta-hint",
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.6 },
        2.4
      )

      // Idle floating animation on the main block
      gsap.to(".lumeo-block", {
        y: -8,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 3.5
      })

    }, orchestratorRef)

    return () => ctx.revert()
  }, [mounted])

  const handleClick = () => {
    if (!orchestratorRef.current) return
    announce("Navigating to early access page")

    // Exit animation before navigating
    const tl = gsap.timeline({
      onComplete: () => { window.location.href = '/early-access' }
    })

    tl.to(".lumeo-block", {
      scale: 1.05,
      opacity: 0,
      y: -40,
      duration: 0.6,
      ease: "power3.in"
    })
    tl.to(".meta-stagger", {
      opacity: 0,
      y: -20,
      duration: 0.3,
      stagger: 0.05,
      ease: "power2.in"
    }, 0)
    tl.to(".grid-line-h, .grid-line-v, .corner-mark", {
      opacity: 0,
      duration: 0.4,
    }, 0.2)
    tl.to(orchestratorRef.current, {
      opacity: 0,
      duration: 0.3
    }, 0.5)
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleClick()
    }
  }

  if (!mounted) return null

  return (
    <div
      ref={orchestratorRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-transparent"
    >
      <AnimatedNoise opacity={0.04} />

      {/* Screen Wipe Curtains */}
      <div className="curtain-top absolute inset-x-0 top-0 h-1/2 bg-black z-50 pointer-events-none" />
      <div className="curtain-bottom absolute inset-x-0 bottom-0 h-1/2 bg-black z-50 pointer-events-none" />

      {/* Architectural Grid Lines */}
      <div className="absolute inset-0 pointer-events-none z-10" aria-hidden="true">
        {/* Horizontal etch lines */}
        <div className="grid-line-h absolute top-[20%] left-[8%] right-[8%] h-px bg-white/4 origin-left" />
        <div className="grid-line-h absolute top-[50%] left-[8%] right-[8%] h-px bg-white/10 origin-left" />
        <div className="grid-line-h absolute top-[80%] left-[8%] right-[8%] h-px bg-white/4 origin-left" />

        {/* Vertical etch lines */}
        <div className="grid-line-v absolute left-[20%] top-[8%] bottom-[8%] w-px bg-white/4 origin-top" />
        <div className="grid-line-v absolute left-[50%] top-[8%] bottom-[8%] w-px bg-white/10 origin-top" />
        <div className="grid-line-v absolute left-[80%] top-[8%] bottom-[8%] w-px bg-white/4 origin-top" />
      </div>

      {/* Corner Architectural Markers */}
      <div className="absolute inset-0 pointer-events-none z-20" aria-hidden="true">
        <div className="corner-mark absolute top-6 left-6 sm:top-8 sm:left-8">
          <div className="w-6 h-6 sm:w-10 sm:h-10 border-t-2 border-l-2 border-accent/30 animate-pulse-corner" />
          <span className="block mt-2 font-mono text-[8px] sm:text-[9px] text-accent/40 uppercase tracking-[0.3em]">SYS.01</span>
        </div>
        <div className="corner-mark absolute top-6 right-6 sm:top-8 sm:right-8">
          <div className="w-6 h-6 sm:w-10 sm:h-10 border-t-2 border-r-2 border-accent/30 animate-pulse-corner" />
          <span className="block mt-2 font-mono text-[8px] sm:text-[9px] text-accent/40 uppercase tracking-[0.3em] text-right">INIT</span>
        </div>
        <div className="corner-mark absolute bottom-6 left-6 sm:bottom-8 sm:left-8">
          <div className="w-6 h-6 sm:w-10 sm:h-10 border-b-2 border-l-2 border-white/15" />
        </div>
        <div className="corner-mark absolute bottom-6 right-6 sm:bottom-8 sm:right-8">
          <div className="w-6 h-6 sm:w-10 sm:h-10 border-b-2 border-r-2 border-white/15" />
        </div>
      </div>

      {/* Coordinate metadata top-left */}
      <div className="absolute top-6 left-20 sm:top-8 sm:left-24 z-20 corner-mark" aria-hidden="true">
        <div className="font-mono text-[8px] sm:text-[9px] text-white/15 uppercase tracking-[0.2em] space-y-1">
          <div>LAT 28.6139°N</div>
          <div>LON 77.2090°E</div>
        </div>
      </div>

      {/* Main Interactive Container */}
      <div
        ref={containerRef}
        className="relative z-30 text-center cursor-pointer group focus-card px-4"
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-label="LUMEO Payment Protocol — Press Enter or Space to continue to early access page"
        style={{ perspective: "1200px" }}
      >
        <SplitFlapAudioProvider>
          {/* LUMEO Animation Container */}
          <div className="lumeo-block mb-6 sm:mb-8 text-glow-gold" style={{ transformStyle: "preserve-3d" }}>
            <SplitFlapText text="LUMEO" speed={80} />
          </div>

          {/* Protocol Designation */}
          <div className="meta-stagger mb-3 sm:mb-4">
            <div className="inline-flex items-center gap-3 border border-white/10 px-5 sm:px-7 py-2 bg-white/[0.02]">
              <div className="w-1 h-1 bg-accent rounded-full" />
              <h1 className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.4em] text-white/70 font-normal">
                Payment Protocol
              </h1>
              <div className="w-1 h-1 bg-accent rounded-full" />
            </div>
          </div>

          {/* Sub-designation */}
          <div className="meta-stagger mb-8 sm:mb-10">
            <p className="font-mono text-[9px] sm:text-[10px] text-white/30 uppercase tracking-[0.3em]">
              Post-Legacy Settlement Infrastructure
            </p>
          </div>

          {/* Audio Toggle */}
          <div className="meta-stagger mb-8 sm:mb-12">
            <SplitFlapMuteToggle />
          </div>
        </SplitFlapAudioProvider>

        {/* CTA Hint — reveals on hover/focus */}
        <div className="cta-hint opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-500">
          <div className="inline-flex flex-col items-center gap-3">
            <p className="font-mono text-[10px] sm:text-xs text-accent uppercase tracking-[0.25em] flex items-center gap-1">
              Enter Protocol<span className="animate-blink">_</span>
            </p>
            <div className="flex items-center gap-1">
              <div className="w-6 h-px bg-accent/40" />
              <div className="w-2 h-2 border border-accent rotate-45 group-hover:bg-accent/30 transition-colors duration-300 border-glow-strong" />
              <div className="w-6 h-px bg-accent/40" />
            </div>
          </div>
        </div>

        {/* Keyboard hint for accessibility */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 keyboard-hint opacity-0 group-focus-visible:opacity-100 transition-opacity duration-300">
          <span className="text-[9px] text-white/25 font-mono uppercase tracking-widest whitespace-nowrap">
            Press Enter or Space
          </span>
        </div>
      </div>

      {/* Version Module — Bottom Right */}
      <div className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 z-20 meta-stagger" aria-hidden="true">
        <div className="border border-white/10 px-3 py-1.5 bg-black/50 backdrop-blur-sm">
          <span className="font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.25em] text-white/30">
            v0.1 alpha
          </span>
        </div>
      </div>

      {/* Status Module — Bottom Left */}
      <div className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8 z-20 meta-stagger" aria-hidden="true">
        <div className="flex items-center gap-2">
          <div className="w-1 h-1 bg-accent rounded-full animate-pulse-ring" />
          <span className="font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.25em] text-white/30">
            System Online
          </span>
        </div>
      </div>

      {/* Screen reader instructions */}
      <div className="sr-only" aria-live="polite">
        Welcome to Lumeo Payment Protocol. This is an interactive landing page.
        Press Enter or Space to continue to the early access page.
      </div>
    </div>
  )
}