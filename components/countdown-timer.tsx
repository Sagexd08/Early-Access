"use client"

import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export function CountdownTimer() {
  const timerRef = useRef<HTMLDivElement>(null)
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    const calculateTimeLeft = () => {
      // Fixed release date: July 28, 2026 (Q3 2026)
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
      } else {
        // Timer has reached zero
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (!timerRef.current || !mounted) return

    const ctx = gsap.context(() => {
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
  }, [mounted])

  if (!mounted) return null

  return (
    <div ref={timerRef} className="border border-white/20 px-8 py-6 font-mono text-xs uppercase tracking-widest text-white bg-black/40 backdrop-blur-sm">
      <div className="text-[11px] text-accent mb-4 font-mono tracking-widest text-center">UNTIL GENESIS BLOCK</div>
      <div className="flex gap-6 items-center justify-center">
        <div className="text-center">
          <div className="text-3xl font-bold text-white tabular-nums">{timeLeft.days}</div>
          <div className="text-[10px] text-white/50 mt-2 tracking-wider">days</div>
        </div>
        <span className="text-white/30 text-xl">·</span>
        <div className="text-center">
          <div className="text-3xl font-bold text-white tabular-nums">{String(timeLeft.hours).padStart(2, "0")}</div>
          <div className="text-[10px] text-white/50 mt-2 tracking-wider">hrs</div>
        </div>
        <span className="text-white/30 text-xl">·</span>
        <div className="text-center">
          <div className="text-3xl font-bold text-white tabular-nums">{String(timeLeft.minutes).padStart(2, "0")}</div>
          <div className="text-[10px] text-white/50 mt-2 tracking-wider">min</div>
        </div>
        <span className="text-white/30 text-xl">·</span>
        <div className="text-center">
          <div className="text-3xl font-bold text-white tabular-nums">{String(timeLeft.seconds).padStart(2, "0")}</div>
          <div className="text-[10px] text-white/50 mt-2 tracking-wider">sec</div>
        </div>
      </div>
    </div>
  )
}