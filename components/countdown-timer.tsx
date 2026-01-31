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
    <div ref={timerRef} className="relative max-w-full">
      {/* Main timer container */}
      <div
        className="relative border border-white/20 bg-black/60 backdrop-blur-md overflow-hidden"
        role="timer"
        aria-label={`Countdown to Lumeo mainnet launch: ${timeLeft.days} days, ${timeLeft.hours} hours, ${timeLeft.minutes} minutes, ${timeLeft.seconds} seconds remaining`}
        aria-live="polite"
        aria-atomic="true"
      >
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5" aria-hidden="true">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`,
            backgroundSize: '20px 20px'
          }} />
        </div>

        {/* Progress bar */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-white/10" aria-hidden="true">
          <div
            className="h-full bg-gradient-to-r from-accent via-accent/80 to-accent transition-all duration-1000"
            style={{ width: `${progress}%` }}
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Development progress: ${progress} percent complete`}
          />
        </div>

        {/* Content */}
        <div className="relative px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6">
          {/* Header */}
          <header className="text-center mb-4 sm:mb-6">
            <h3 className="text-[10px] sm:text-[11px] text-accent mb-2 font-mono tracking-widest">
              UNTIL GENESIS BLOCK
            </h3>
            <p className="text-[8px] sm:text-[9px] text-white/40 font-mono tracking-wider">
              Q3 2026 • MAINNET LAUNCH
            </p>
          </header>

          {/* Timer display - responsive layout */}
          <div
            className="flex gap-3 sm:gap-4 md:gap-6 items-center justify-center mb-3 sm:mb-4 overflow-x-auto"
            role="group"
            aria-label="Countdown timer display"
          >
            <TimeUnit value={timeLeft.days} label="days" />
            <TimeSeparator />
            <TimeUnit value={timeLeft.hours} label="hrs" />
            <TimeSeparator />
            <TimeUnit value={timeLeft.minutes} label="min" />
            <TimeSeparator />
            <TimeUnit value={timeLeft.seconds} label="sec" />
          </div>

          {/* Progress indicator */}
          <div
            className="flex items-center justify-center gap-2 sm:gap-3 text-[8px] sm:text-[9px] text-white/50 font-mono"
            role="group"
            aria-label="Development progress indicator"
          >
            <span className="hidden sm:inline">DEVELOPMENT</span>
            <span className="sm:hidden">DEV</span>
            <div className="flex-1 max-w-16 sm:max-w-24 h-px bg-white/20 relative" aria-hidden="true">
              <div
                className="absolute left-0 top-0 h-full bg-accent transition-all duration-1000"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span aria-label={`${progress} percent complete`}>{progress}%</span>
          </div>
        </div>

        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-2 h-2 sm:w-3 sm:h-3 border-t border-l border-accent/60" aria-hidden="true" />
        <div className="absolute top-0 right-0 w-2 h-2 sm:w-3 sm:h-3 border-t border-r border-accent/60" aria-hidden="true" />
        <div className="absolute bottom-0 left-0 w-2 h-2 sm:w-3 sm:h-3 border-b border-l border-accent/60" aria-hidden="true" />
        <div className="absolute bottom-0 right-0 w-2 h-2 sm:w-3 sm:h-3 border-b border-r border-accent/60" aria-hidden="true" />
      </div>

      {/* Floating status indicators */}
      <div className="absolute -top-2 sm:-top-3 -right-2 sm:-right-3 flex gap-1 sm:gap-2" role="group" aria-label="System status indicators">
        <div
          className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-400"
          role="status"
          aria-label="System online"
          title="System Online"
        />
        <div
          className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-accent"
          role="status"
          aria-label="Development active"
          title="Development Active"
        />
      </div>

      {/* Side labels - hidden on mobile for space */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full pr-4 hidden md:block" aria-hidden="true">
        <div className="text-[8px] text-white/30 font-mono tracking-widest -rotate-90 origin-center whitespace-nowrap">
          COUNTDOWN
        </div>
      </div>
    </div>
  )
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="text-center group min-w-0 flex-shrink-0" role="group" aria-label={`${value} ${label}`}>
      <div className="relative">
        <div
          className="text-xl sm:text-2xl md:text-3xl font-bold font-mono text-white tabular-nums group-hover:text-accent transition-colors duration-300"
          aria-label={`${label === 'days' ? value : String(value).padStart(2, "0")} ${label}`}
        >
          {label === 'days' ? value : String(value).padStart(2, "0")}
        </div>
        {/* Subtle glow effect */}
        <div className="absolute inset-0 text-xl sm:text-2xl md:text-3xl font-bold text-accent tabular-nums opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-sm" aria-hidden="true">
          {label === 'days' ? value : String(value).padStart(2, "0")}
        </div>
      </div>
      <div className="text-[9px] sm:text-[10px] text-white/50 mt-1 sm:mt-2 tracking-wider uppercase">
        {label}
      </div>
    </div>
  )
}

function TimeSeparator() {
  return (
    <div className="flex flex-col gap-1" aria-hidden="true">
      <span className="text-accent/50 text-xl font-mono animate-pulse">:</span>
    </div>
  )
}