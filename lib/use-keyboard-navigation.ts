"use client"

import { useEffect, useCallback, useRef } from 'react'

interface KeyboardNavigationOptions {
  enableArrowKeys?: boolean
  enableTabTrapping?: boolean
  enableEscapeKey?: boolean
  onEscape?: () => void
  customKeyHandlers?: Record<string, (event: KeyboardEvent) => void>
}

export function useKeyboardNavigation(options: KeyboardNavigationOptions = {}) {
  const {
    enableArrowKeys = false,
    enableTabTrapping = false,
    enableEscapeKey = false,
    onEscape,
    customKeyHandlers = {}
  } = options

  const containerRef = useRef<HTMLElement>(null)
  const focusableElementsRef = useRef<HTMLElement[]>([])

  // Get all focusable elements within the container
  const getFocusableElements = useCallback(() => {
    if (!containerRef.current) return []

    const focusableSelectors = [
      'button:not([disabled])',
      'a[href]',
      'input:not([disabled])',
      'textarea:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '[role="button"]:not([disabled])',
      '[role="link"]',
      '[contenteditable="true"]'
    ].join(', ')

    const elements = Array.from(
      containerRef.current.querySelectorAll(focusableSelectors)
    ) as HTMLElement[]

    return elements.filter(element => {
      // Filter out hidden elements
      const style = window.getComputedStyle(element)
      return style.display !== 'none' && 
             style.visibility !== 'hidden' && 
             element.offsetParent !== null
    })
  }, [])

  // Update focusable elements list
  const updateFocusableElements = useCallback(() => {
    focusableElementsRef.current = getFocusableElements()
  }, [getFocusableElements])

  // Handle arrow key navigation
  const handleArrowKeys = useCallback((event: KeyboardEvent) => {
    if (!enableArrowKeys) return

    const elements = focusableElementsRef.current
    if (elements.length === 0) return

    const currentIndex = elements.findIndex(el => el === document.activeElement)
    let nextIndex = currentIndex

    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        event.preventDefault()
        nextIndex = currentIndex < elements.length - 1 ? currentIndex + 1 : 0
        break
      case 'ArrowUp':
      case 'ArrowLeft':
        event.preventDefault()
        nextIndex = currentIndex > 0 ? currentIndex - 1 : elements.length - 1
        break
      default:
        return
    }

    elements[nextIndex]?.focus()
  }, [enableArrowKeys])

  // Handle tab trapping
  const handleTabTrapping = useCallback((event: KeyboardEvent) => {
    if (!enableTabTrapping || event.key !== 'Tab') return

    const elements = focusableElementsRef.current
    if (elements.length === 0) return

    const firstElement = elements[0]
    const lastElement = elements[elements.length - 1]

    if (event.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstElement) {
        event.preventDefault()
        lastElement.focus()
      }
    } else {
      // Tab
      if (document.activeElement === lastElement) {
        event.preventDefault()
        firstElement.focus()
      }
    }
  }, [enableTabTrapping])

  // Handle escape key
  const handleEscapeKey = useCallback((event: KeyboardEvent) => {
    if (!enableEscapeKey || event.key !== 'Escape') return
    
    event.preventDefault()
    onEscape?.()
  }, [enableEscapeKey, onEscape])

  // Main keyboard event handler
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Update focusable elements on each interaction
    updateFocusableElements()

    // Handle custom key handlers first
    const customHandler = customKeyHandlers[event.key]
    if (customHandler) {
      customHandler(event)
      return
    }

    // Handle built-in navigation
    handleArrowKeys(event)
    handleTabTrapping(event)
    handleEscapeKey(event)
  }, [updateFocusableElements, customKeyHandlers, handleArrowKeys, handleTabTrapping, handleEscapeKey])

  // Focus management utilities
  const focusFirst = useCallback(() => {
    const elements = getFocusableElements()
    elements[0]?.focus()
  }, [getFocusableElements])

  const focusLast = useCallback(() => {
    const elements = getFocusableElements()
    elements[elements.length - 1]?.focus()
  }, [getFocusableElements])

  const focusNext = useCallback(() => {
    const elements = getFocusableElements()
    const currentIndex = elements.findIndex(el => el === document.activeElement)
    const nextIndex = currentIndex < elements.length - 1 ? currentIndex + 1 : 0
    elements[nextIndex]?.focus()
  }, [getFocusableElements])

  const focusPrevious = useCallback(() => {
    const elements = getFocusableElements()
    const currentIndex = elements.findIndex(el => el === document.activeElement)
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : elements.length - 1
    elements[prevIndex]?.focus()
  }, [getFocusableElements])

  // Set up event listeners
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.addEventListener('keydown', handleKeyDown)
    
    // Update focusable elements when DOM changes
    const observer = new MutationObserver(updateFocusableElements)
    observer.observe(container, { 
      childList: true, 
      subtree: true, 
      attributes: true,
      attributeFilter: ['disabled', 'tabindex', 'hidden']
    })

    // Initial update
    updateFocusableElements()

    return () => {
      container.removeEventListener('keydown', handleKeyDown)
      observer.disconnect()
    }
  }, [handleKeyDown, updateFocusableElements])

  return {
    containerRef,
    focusFirst,
    focusLast,
    focusNext,
    focusPrevious,
    getFocusableElements,
    updateFocusableElements
  }
}

// Hook for managing focus announcements for screen readers
export function useFocusAnnouncement() {
  const announce = useCallback((message: string) => {
    const announcement = document.createElement('div')
    announcement.setAttribute('aria-live', 'polite')
    announcement.setAttribute('aria-atomic', 'true')
    announcement.className = 'sr-only'
    announcement.textContent = message
    
    document.body.appendChild(announcement)
    
    setTimeout(() => {
      document.body.removeChild(announcement)
    }, 1000)
  }, [])

  return { announce }
}

// Hook for managing skip links
export function useSkipLinks() {
  const addSkipLink = useCallback((targetId: string, label: string) => {
    const existingSkipLink = document.querySelector(`[href="#${targetId}"]`)
    if (existingSkipLink) return

    const skipLink = document.createElement('a')
    skipLink.href = `#${targetId}`
    skipLink.className = 'skip-link'
    skipLink.textContent = label
    skipLink.addEventListener('click', (e) => {
      e.preventDefault()
      const target = document.getElementById(targetId)
      if (target) {
        target.focus()
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    })

    document.body.insertBefore(skipLink, document.body.firstChild)
  }, [])

  const removeSkipLink = useCallback((targetId: string) => {
    const skipLink = document.querySelector(`[href="#${targetId}"]`)
    if (skipLink) {
      skipLink.remove()
    }
  }, [])

  return { addSkipLink, removeSkipLink }
}