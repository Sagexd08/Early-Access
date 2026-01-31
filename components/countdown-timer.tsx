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
    <div ref={timerRef} className="relative w-full py-8 border-y border-white/10 my-12">
      {/* Accent Decoration - UK Futuristic */}
      <div className="absolute top-0 left-0 w-1/3 h-px bg-accent" />
      <div className="absolute top-0 right-0 w-[5%] h-px bg-accent" />
      <div className="absolute top-0 right-[6%] w-[1%] h-px bg-accent" />
      <div className="absolute bottom-0 right-0 w-1/3 h-px bg-white/20" />

      {/* Decorative vertical markers */}
      <div className="absolute top-0 left-0 h-2 w-px bg-accent" />
      <div className="absolute top-0 right-0 h-2 w-px bg-accent" />
      <div className="absolute bottom-0 right-0 h-2 w-px bg-white/20" />
      <div className="absolute bottom-0 left-0 h-2 w-px bg-white/20" />

      {/* Header Info */}
      <div className="flex flex-col items-center justify-center mb-10 text-center">
        <h3 className="font-mono text-accent text-xs tracking-[0.3em] uppercase mb-2 animate-pulse">
          Until Genesis Block
        </h3>
        <div className="text-[10px] text-white/40 font-mono tracking-widest uppercase">
          Q3 2026 • Mainnet Launch
        </div>
      </div>

      {/* Digits Container */}
      <div className="flex items-center justify-center gap-4 sm:gap-12 md:gap-16 mb-10">
        <TimeUnit value={timeLeft.days} label="DAYS" />
        <Separator />
        <TimeUnit value={timeLeft.hours} label="HRS" />
        <Separator />
        <TimeUnit value={timeLeft.minutes} label="MIN" />
        <Separator />
        <TimeUnit value={timeLeft.seconds} label="SEC" />
      </div>

      {/* Progress Bar - HUD Style */}
      <div className="flex items-center justify-center gap-4 w-full max-w-md mx-auto">
        <span className="font-mono text-[10px] text-white/40 tracking-widest min-w-[80px] text-right">DEVELOPMENT</span>
        <div className="flex-1 h-0.5 bg-white/10 relative">
          <div
            className="absolute top-0 left-0 h-full bg-accent transition-all duration-1000 ease-out"
            style={{ width: `${progress}%` }}
          />
          {/* Progress blip */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-1 h-3 bg-accent shadow-[0_0_10px_rgba(45,212,191,0.8)]"
            style={{ left: `${progress}%` }}
          />
        </div>
        <span className="font-mono text-[10px] text-accent min-w-[40px]">{progress}%</span>
      </div>
    </div>
  )
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center text-center shrink-0 w-16 sm:w-20 md:w-24">
      <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-[-0.05em] tabular-nums font-sans leading-none">
        {label === 'DAYS' ? value : String(value).padStart(2, "0")}
      </div>
      <div className="text-[9px] text-white/30 font-mono mt-3 tracking-[0.2em] uppercase border-t border-white/10 pt-1 w-full">
        {label}
      </div>
    </div>
  )
}

function Separator() {
  return (
    <div className="flex flex-col gap-1.5 pb-8 opacity-40">
      <div className="w-0.5 h-0.5 bg-accent" />
      <div className="w-0.5 h-0.5 bg-accent" />
    </div>
  )
}