"use client"

import { useEffect } from "react"
import { HeroSection } from "@/components/hero-section"
import { SignalsSection } from "@/components/signals-section"
import { WorkSection } from "@/components/work-section"
import { PrinciplesSection } from "@/components/principles-section"
import { ColophonSection } from "@/components/colophon-section"
import { SideNav } from "@/components/side-nav"
import { useSkipLinks } from "@/lib/use-keyboard-navigation"
import { CyberpunkGrid } from "@/components/cyberpunk-grid"
import { ScanlineOverlay } from "@/components/scanline-overlay"

export default function EarlyAccessPage() {
  const { addSkipLink } = useSkipLinks()

  useEffect(() => {
    // Add skip links for keyboard navigation
    addSkipLink("hero", "Skip to main content")
    addSkipLink("signals", "Skip to latest updates")
    addSkipLink("work", "Skip to key features")
    addSkipLink("principles", "Skip to core principles")
    addSkipLink("colophon", "Skip to footer")

    // Ensure all sections are focusable for keyboard navigation
    const sections = ['hero', 'signals', 'work', 'principles', 'colophon']
    sections.forEach(sectionId => {
      const section = document.getElementById(sectionId)
      if (section) {
        // Make sections focusable but not in tab order by default
        section.setAttribute('tabindex', '-1')
        // Add proper ARIA labels
        const sectionName = sectionId.charAt(0).toUpperCase() + sectionId.slice(1)
        section.setAttribute('aria-label', `${sectionName} section`)
      }
    })

    // Add global keyboard shortcuts
    const handleGlobalKeyDown = (event: KeyboardEvent) => {
      // Alt + number keys for quick section navigation
      if (event.altKey && !event.ctrlKey && !event.shiftKey) {
        const keyMap: Record<string, string> = {
          '1': 'hero',
          '2': 'signals',
          '3': 'work',
          '4': 'principles',
          '5': 'colophon'
        }

        const sectionId = keyMap[event.key]
        if (sectionId) {
          event.preventDefault()
          const section = document.getElementById(sectionId)
          if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' })
            section.focus()
          }
        }
      }

      // Escape key to return to top
      if (event.key === 'Escape') {
        event.preventDefault()
        const heroSection = document.getElementById('hero')
        if (heroSection) {
          heroSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
          heroSection.focus()
        }
      }
    }

    document.addEventListener('keydown', handleGlobalKeyDown)

    return () => {
      document.removeEventListener('keydown', handleGlobalKeyDown)
    }
  }, [addSkipLink])

  return (
    <>
      <div className="sr-only" aria-live="polite">
        Lumeo Early Access page loaded. Use Alt + 1-5 to navigate sections, or Tab to navigate interactive elements.
      </div>

      <main className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
        {/* Cyberpunk Environment Layers */}
        <CyberpunkGrid />
        <ScanlineOverlay />

        <SideNav />

        <div className="relative z-10">
          <HeroSection />
          <SignalsSection />
          <WorkSection />
          <PrinciplesSection />
          <ColophonSection />
        </div>

        {/* Keyboard navigation help - visible on focus */}
        <div className="fixed bottom-4 left-4 z-50 opacity-0 focus-within:opacity-100 hover:opacity-100 transition-opacity duration-300">
          <div className="bg-black/90 backdrop-blur-md border border-white/10 p-4 rounded-none font-mono text-xs shadow-[0_0_20px_rgba(0,0,0,0.5)]">
            <div className="text-accent mb-2 uppercase tracking-wider flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
              Keyboard Shortcuts
            </div>
            <div className="space-y-1 text-muted-foreground">
              <div><span className="text-white">Alt + 1-5</span> : Navigate sections</div>
              <div><span className="text-white">Tab</span> : Navigate elements</div>
              <div><span className="text-white">Esc</span> : Return to top</div>
            </div>
          </div>
        </div>

        <div id="focus-announcer" className="sr-only" aria-live="polite" aria-atomic="true"></div>
      </main>
    </>
  )
}