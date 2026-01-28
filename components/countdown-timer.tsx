"use client"

import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export function CountdownTimer() {
  const timerRef = useRef<HTMLDivElement>(null)
  const [timeLeft, setTimeLeft] = useState({
    days: 180,
    hours: 7,
    minutes: 48,
    seconds: 25,
  })
  const [progress] = useState(75) // Static progress for now

  useEffect(() => {
    const calculateTimeLeft = () => {
      const releaseDate = new Date('2026-07-28T00:00:00')
      const now = new Date()
      const difference = releaseDate.getTime() - now.getTime()

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        })
      }
    }

    // Set initial values immediately
    calculateTimeLeft()
    
    // Update every second
    const timer = setInterval(calculateTimeLeft, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (!timerRef.current) return

    const ctx = gsap.context(() => {
      // Simple scroll animation only
      gsap.to(timerRef.current, {
        y: -60,
        opacity: 0,
        scrollTrigger: {
          trigger: timerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      })
    }, timerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={timerRef} className="relative">
      {/* Main timer container */}
      <div className="relative border border-white/20 bg-black/60 backdrop-blur-md overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`,
            backgroundSize: '20px 20px'
          }} />
        </div>

        {/* Progress bar */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-white/10">
          <div 
            className="h-full bg-gradient-to-r from-accent via-accent/80 to-accent transition-all duration-1000"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Content */}
        <div className="relative px-8 py-6">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="text-[11px] text-accent mb-2 font-mono tracking-widest">UNTIL GENESIS BLOCK</div>
            <div className="text-[9px] text-white/40 font-mono tracking-wider">Q3 2026 • MAINNET LAUNCH</div>
          </div>

          {/* Timer display */}
          <div className="flex gap-6 items-center justify-center mb-4">
            <TimeUnit value={timeLeft.days} label="days" />
            <TimeSeparator />
            <TimeUnit value={timeLeft.hours} label="hrs" />
            <TimeSeparator />
            <TimeUnit value={timeLeft.minutes} label="min" />
            <TimeSeparator />
            <TimeUnit value={timeLeft.seconds} label="sec" />
          </div>

          {/* Progress indicator */}
          <div className="flex items-center justify-center gap-3 text-[9px] text-white/50 font-mono">
            <span>DEVELOPMENT</span>
            <div className="flex-1 max-w-24 h-px bg-white/20 relative">
              <div 
                className="absolute left-0 top-0 h-full bg-accent transition-all duration-1000"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span>{progress}%</span>
          </div>
        </div>

        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-accent/60" />
        <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-accent/60" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-accent/60" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-accent/60" />
      </div>

      {/* Floating status indicators */}
      <div className="absolute -top-3 -right-3 flex gap-2">
        <div className="w-2 h-2 rounded-full bg-green-400" title="System Online" />
        <div className="w-2 h-2 rounded-full bg-accent" title="Development Active" />
      </div>

      {/* Side labels */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full pr-4">
        <div className="text-[8px] text-white/30 font-mono tracking-widest -rotate-90 origin-center whitespace-nowrap">
          COUNTDOWN
        </div>
      </div>
    </div>
  )
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="text-center group">
      <div className="relative">
        <div className="text-3xl font-bold text-white tabular-nums group-hover:text-accent transition-colors duration-300">
          {label === 'days' ? value : String(value).padStart(2, "0")}
        </div>
        {/* Subtle glow effect */}
        <div className="absolute inset-0 text-3xl font-bold text-accent tabular-nums opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-sm">
          {label === 'days' ? value : String(value).padStart(2, "0")}
        </div>
      </div>
      <div className="text-[10px] text-white/50 mt-2 tracking-wider uppercase">
        {label}
      </div>
    </div>
  )
}

function TimeSeparator() {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-white/30 text-lg">•</span>
      <span className="text-white/30 text-lg">•</span>
    </div>
  )
}