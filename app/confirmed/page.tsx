"use client"

import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import gsap from "gsap"

export default function ConfirmedPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    if (!containerRef.current) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline()
      
      tl.from(".scanline", {
        scaleX: 0,
        duration: 1,
        ease: "power2.out"
      })
      .from(".badge", {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: "back.out(1.7)"
      }, "-=0.5")
      .from("h1", {
        y: 30,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
      }, "-=0.3")
      .from("p", {
        y: 20,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out"
      }, "-=0.5")
      .from(".data-grid", {
        y: 30,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
      }, "-=0.3")
      .from(".cta-button", {
        scale: 0,
        duration: 0.8,
        ease: "back.out(1.7)"
      }, "-=0.2")

    }, containerRef)

    // Auto redirect after 10 seconds
    const redirectTimer = setTimeout(() => {
      router.push('/early-access')
    }, 10000)

    return () => {
      ctx.revert()
      clearTimeout(redirectTimer)
    }
  }, [router])

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div ref={containerRef} className="max-w-2xl w-full">
        {/* Scanline effect */}
        <div className="scanline h-0.5 w-full bg-gradient-to-r from-transparent via-green-400 to-transparent mb-8 opacity-60"></div>
        
        {/* Status badge */}
        <div className="badge inline-block bg-green-400/10 border border-green-400/20 text-green-400 px-4 py-2 font-mono text-xs uppercase tracking-widest mb-6">
          Verification :: Complete
        </div>
        
        {/* Main heading */}
        <h1 className="font-[var(--font-bebas)] text-5xl md:text-7xl mb-6 tracking-wide">
          Node Authenticated
        </h1>
        
        {/* Description */}
        <p className="text-lg text-gray-300 mb-4 leading-relaxed">
          Your position in the protocol queue has been <span className="text-green-400 font-semibold">confirmed and secured</span>.
        </p>
        
        <p className="text-gray-400 mb-8 leading-relaxed">
          You will receive priority access to Lumeo's revolutionary settlement layer when we launch in Q3 2026. 
          Stay tuned for exclusive updates, beta access opportunities, and technical previews as we approach the Genesis Block.
        </p>
        
        {/* Data grid */}
        <div className="data-grid bg-gray-900/30 border border-gray-800 p-6 mb-8 font-mono">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500 uppercase tracking-wider">Status</span>
              <span className="text-green-400">CONFIRMED</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 uppercase tracking-wider">Queue Position</span>
              <span className="text-orange-400">PRIORITY</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 uppercase tracking-wider">Access Level</span>
              <span className="text-blue-400">EARLY_ALPHA</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 uppercase tracking-wider">Est. Launch</span>
              <span className="text-purple-400">Q3 2026</span>
            </div>
          </div>
        </div>
        
        {/* Call to action */}
        <div className="text-center">
          <button
            onClick={() => router.push('/early-access')}
            className="cta-button bg-orange-500 hover:bg-orange-600 text-black px-8 py-4 font-mono text-sm uppercase tracking-widest transition-all duration-300 hover:scale-105"
          >
            Return to Protocol
          </button>
          
          <p className="text-xs text-gray-500 mt-4 font-mono">
            Redirecting automatically in 10 seconds...
          </p>
        </div>
        
        {/* Decorative elements */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 text-xs text-gray-600 font-mono uppercase tracking-wider">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>System Online</span>
            <div className="w-8 h-px bg-gray-700 mx-2"></div>
            <span>Qore Labs</span>
          </div>
        </div>
      </div>
    </main>
  )
}