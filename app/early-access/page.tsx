"use client"

import { useEffect } from "react"
import { HeroSection } from "@/components/hero-section"
import { SignalsSection } from "@/components/signals-section"
import { WorkSection } from "@/components/work-section"
import { PrinciplesSection } from "@/components/principles-section"
import { GlobalVisualization } from "@/components/global-visualization"
import { ArchitectureDiagram } from "@/components/architecture-diagram"
import { ParticleSystem } from "@/components/particle-system"
import { ColophonSection } from "@/components/colophon-section"
import { SideNav } from "@/components/side-nav"
import { useSkipLinks } from "@/lib/use-keyboard-navigation"

export default function EarlyAccessPage() {
  const { addSkipLink } = useSkipLinks()

  useEffect(() => {
    // Add skip links for keyboard navigation
    addSkipLink("hero", "Skip to main content")
    addSkipLink("signals", "Skip to latest updates")
    addSkipLink("work", "Skip to key features")
    addSkipLink("principles", "Skip to core principles")
    addSkipLink("global-network", "Skip to global network visualization")
    addSkipLink("architecture", "Skip to architecture diagram")
    addSkipLink("colophon", "Skip to footer")

    // Ensure all sections are focusable for keyboard navigation
    const sections = ['hero', 'signals', 'work', 'principles', 'global-network', 'architecture', 'colophon']
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
          '5': 'global-network',
          '6': 'architecture',
          '7': 'colophon'
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
      {/* Screen reader announcement for page structure */}
      <div className="sr-only" aria-live="polite">
        Lumeo Early Access page loaded. Use Alt + 1-5 to navigate sections, or Tab to navigate interactive elements.
      </div>
      
      <main className="relative min-h-screen">
        <SideNav />
        <div className="grid-bg fixed inset-0 opacity-30" aria-hidden="true" />

        <div className="relative z-10">
          <HeroSection />
          <SignalsSection />
          <WorkSection />
          <PrinciplesSection />
          <GlobalVisualization />
          <ArchitectureDiagram />
          <ColophonSection />
        </div>

        {/* Keyboard navigation help - visible on focus */}
        <div className="fixed bottom-4 left-4 z-50 opacity-0 focus-within:opacity-100 hover:opacity-100 transition-opacity duration-300">
          <div className="bg-background/90 backdrop-blur-sm border border-border/50 p-3 rounded font-mono text-xs">
            <div className="text-accent mb-2 uppercase tracking-wider">Keyboard Shortcuts</div>
            <div className="space-y-1 text-muted-foreground">
              <div>Alt + 1-7: Navigate sections</div>
              <div>Tab: Navigate elements</div>
              <div>Escape: Return to top</div>
              <div>Arrow keys: Navigate interactive elements</div>
              <div>Enter/Space: Activate buttons</div>
            </div>
          </div>
        </div>

        {/* Focus indicator for screen readers */}
        <div id="focus-announcer" className="sr-only" aria-live="polite" aria-atomic="true"></div>
      </main>
    </>
  )
}