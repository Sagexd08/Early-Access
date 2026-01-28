"use client"

import { useEffect, useRef, useState } from "react"
import { SplitFlapText, SplitFlapMuteToggle, SplitFlapAudioProvider } from "@/components/split-flap-text"
import { AnimatedNoise } from "@/components/animated-noise"
import { useFocusAnnouncement } from "@/lib/use-keyboard-navigation"
import gsap from "gsap"

export function LumeoAnimation() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  const { announce } = useFocusAnnouncement()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!containerRef.current || !mounted) return

    const ctx = gsap.context(() => {
      // Animate container on load
      gsap.fromTo(containerRef.current, 
        { 
          opacity: 0,
          scale: 0.8,
          y: 50
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 1.5,
          ease: "power3.out",
          delay: 0.5
        }
      )
    }, containerRef)

    return () => ctx.revert()
  }, [mounted])

  const handleClick = () => {
    // Navigate to early access page
    announce("Navigating to early access page")
    window.location.href = '/early-access'
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleClick()
    }
  }

  if (!mounted) return null

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <AnimatedNoise opacity={0.03} />
      
      <div 
        ref={containerRef} 
        className="text-center cursor-pointer group focus-card"
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-label="LUMEO Payment Protocol - Click to continue to early access page"
      >
        <SplitFlapAudioProvider>
          {/* Centered LUMEO animation */}
          <div className="mb-4">
            <SplitFlapText text="LUMEO" speed={80} />
          </div>
          
          {/* Subheading */}
          <div className="mb-8">
            <h1 className="font-mono text-xs uppercase tracking-[0.3em] text-accent">
              PAYMENT PROTOCOL
            </h1>
          </div>
          
          {/* Audio toggle */}
          <div className="mb-12">
            <SplitFlapMuteToggle />
          </div>
        </SplitFlapAudioProvider>

        {/* Subtle hint to continue */}
        <div className="opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-500">
          <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
            Click to Continue
          </p>
          <div className="mt-4 w-12 h-px bg-accent mx-auto animate-pulse" />
        </div>

        {/* Keyboard navigation hint */}
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 keyboard-hint opacity-0 group-focus-visible:opacity-100 transition-opacity duration-300">
          <span className="text-[10px] text-muted-foreground/60 whitespace-nowrap">Press Enter or Space</span>
        </div>

        {/* Floating version indicator */}
        <div className="absolute bottom-8 right-8" aria-hidden="true">
          <div className="border border-border px-3 py-1 font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
            v0.1
          </div>
        </div>
      </div>

      {/* Subtle background elements */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {/* Corner accents */}
        <div className="absolute top-8 left-8 w-8 h-8 border-t border-l border-white/10" />
        <div className="absolute top-8 right-8 w-8 h-8 border-t border-r border-white/10" />
        <div className="absolute bottom-8 left-8 w-8 h-8 border-b border-l border-white/10" />
        <div className="absolute bottom-8 right-8 w-8 h-8 border-b border-r border-white/10" />
      </div>
    </div>
  )
}