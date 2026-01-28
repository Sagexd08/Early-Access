"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { useKeyboardNavigation, useFocusAnnouncement } from "@/lib/use-keyboard-navigation"

const navItems = [
  { id: "hero", label: "Index", description: "Navigate to hero section" },
  { id: "signals", label: "Signals", description: "Navigate to latest updates" },
  { id: "work", label: "Experiments", description: "Navigate to key features" },
  { id: "principles", label: "Principles", description: "Navigate to core principles" },
  { id: "global-network", label: "Network", description: "Navigate to global network visualization" },
  { id: "architecture", label: "Architecture", description: "Navigate to architecture diagram" },
  { id: "colophon", label: "Colophon", description: "Navigate to footer section" },
]

export function SideNav() {
  const [activeSection, setActiveSection] = useState("hero")
  const { announce } = useFocusAnnouncement()
  
  const { containerRef } = useKeyboardNavigation({
    enableArrowKeys: true,
    customKeyHandlers: {
      'Enter': (event) => {
        const target = event.target as HTMLElement
        if (target.getAttribute('data-section-id')) {
          event.preventDefault()
          const sectionId = target.getAttribute('data-section-id')!
          scrollToSection(sectionId)
        }
      },
      ' ': (event) => {
        const target = event.target as HTMLElement
        if (target.getAttribute('data-section-id')) {
          event.preventDefault()
          const sectionId = target.getAttribute('data-section-id')!
          scrollToSection(sectionId)
        }
      }
    }
  })

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { threshold: 0.3 },
    )

    navItems.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
      
      // Announce navigation for screen readers
      const navItem = navItems.find(item => item.id === id)
      if (navItem) {
        announce(`Navigated to ${navItem.label} section`)
      }
      
      // Focus the target section for keyboard users
      setTimeout(() => {
        element.focus()
      }, 500)
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent, id: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      scrollToSection(id)
    }
  }

  return (
    <>
      {/* Desktop Side Navigation */}
      <nav 
        ref={containerRef as React.RefObject<HTMLElement>}
        className="fixed left-0 top-0 z-50 h-screen w-16 md:w-20 hidden md:flex flex-col justify-center border-r border-border/30 bg-background/80 backdrop-blur-sm"
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Logo at top */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2">
          <img 
            src="/lumenpaylogo.png" 
            alt="Lumeo" 
            className="w-8 h-8 object-contain opacity-60 hover:opacity-100 transition-opacity"
          />
        </div>
        
        <div className="flex flex-col gap-6 px-4">
          {navItems.map(({ id, label, description }) => (
            <button 
              key={id} 
              onClick={() => scrollToSection(id)}
              onKeyDown={(e) => handleKeyDown(e, id)}
              data-section-id={id}
              className="nav-item group relative flex items-center gap-3 touch-manipulation"
              aria-label={`${label} - ${description}`}
              aria-current={activeSection === id ? 'page' : undefined}
            >
              <span
                className={cn(
                  "h-1.5 w-1.5 rounded-full transition-all duration-300",
                  activeSection === id ? "bg-accent scale-125" : "bg-muted-foreground/40 group-hover:bg-foreground/60 group-focus-visible:bg-accent",
                )}
              />
              <span
                className={cn(
                  "absolute left-6 font-mono text-[10px] uppercase tracking-widest opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:left-8 group-focus-visible:opacity-100 group-focus-visible:left-8 whitespace-nowrap",
                  activeSection === id ? "text-accent" : "text-muted-foreground",
                )}
              >
                {label}
              </span>
            </button>
          ))}
        </div>
        
        {/* Keyboard navigation hint */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 keyboard-hint visible">
          <span className="text-[8px] text-muted-foreground/60 whitespace-nowrap">↑↓ Navigate</span>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav 
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background/90 backdrop-blur-md border-t border-border/30"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="flex items-center justify-around px-4 py-3">
          {navItems.map(({ id, label, description }) => (
            <button 
              key={id} 
              onClick={() => scrollToSection(id)}
              onKeyDown={(e) => handleKeyDown(e, id)}
              data-section-id={id}
              className="nav-item flex flex-col items-center gap-1 touch-manipulation min-h-[44px] justify-center px-2"
              aria-label={`${label} - ${description}`}
              aria-current={activeSection === id ? 'page' : undefined}
            >
              <span
                className={cn(
                  "h-1.5 w-1.5 rounded-full transition-all duration-300",
                  activeSection === id ? "bg-accent scale-125" : "bg-muted-foreground/40 group-hover:bg-foreground/60 group-focus-visible:bg-accent",
                )}
              />
              <span
                className={cn(
                  "font-mono text-[8px] uppercase tracking-widest transition-colors duration-200",
                  activeSection === id ? "text-accent" : "text-muted-foreground",
                )}
              >
                {label}
              </span>
            </button>
          ))}
        </div>
      </nav>
    </>
  )
}
