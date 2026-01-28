"use client"

import { useEffect, useRef, useState } from "react"
import gsap from "gsap"

interface Particle {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  color: string
  life: number
  maxLife: number
}

interface ParticleSystemProps {
  particleCount?: number
  className?: string
  interactive?: boolean
  type?: 'ambient' | 'cursor' | 'flow'
}

export function ParticleSystem({ 
  particleCount = 50, 
  className = "",
  interactive = false,
  type = 'ambient'
}: ParticleSystemProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | null>(null)
  const particlesRef = useRef<Particle[]>([])
  const mouseRef = useRef({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)

  // Initialize particles
  const initializeParticles = (width: number, height: number) => {
    const particles: Particle[] = []
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        id: i,
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.1,
        color: type === 'flow' ? '#f97316' : '#ffffff',
        life: Math.random() * 100,
        maxLife: 100 + Math.random() * 100
      })
    }
    
    particlesRef.current = particles
  }

  // Update particle physics
  const updateParticles = (width: number, height: number, deltaTime: number) => {
    particlesRef.current.forEach(particle => {
      // Update position
      particle.x += particle.vx * deltaTime
      particle.y += particle.vy * deltaTime
      
      // Interactive mode - attract to mouse
      if (interactive && type === 'cursor') {
        const dx = mouseRef.current.x - particle.x
        const dy = mouseRef.current.y - particle.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        if (distance < 100) {
          const force = (100 - distance) / 100
          particle.vx += (dx / distance) * force * 0.01
          particle.vy += (dy / distance) * force * 0.01
        }
      }
      
      // Boundary wrapping
      if (particle.x < 0) particle.x = width
      if (particle.x > width) particle.x = 0
      if (particle.y < 0) particle.y = height
      if (particle.y > height) particle.y = 0
      
      // Update life
      particle.life += deltaTime
      if (particle.life > particle.maxLife) {
        particle.life = 0
        particle.x = Math.random() * width
        particle.y = Math.random() * height
        particle.vx = (Math.random() - 0.5) * 0.5
        particle.vy = (Math.random() - 0.5) * 0.5
      }
      
      // Update opacity based on life
      const lifeRatio = particle.life / particle.maxLife
      particle.opacity = Math.sin(lifeRatio * Math.PI) * 0.5 + 0.1
    })
  }

  // Render particles
  const renderParticles = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.clearRect(0, 0, width, height)
    
    particlesRef.current.forEach(particle => {
      ctx.save()
      ctx.globalAlpha = particle.opacity
      ctx.fillStyle = particle.color
      
      // Draw particle with glow effect
      if (type === 'flow') {
        // Glowing effect for flow particles
        ctx.shadowColor = particle.color
        ctx.shadowBlur = particle.size * 2
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()
      } else {
        // Simple dot for ambient particles
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()
      }
      
      ctx.restore()
    })
    
    // Draw connections for flow type
    if (type === 'flow') {
      ctx.strokeStyle = 'rgba(249, 115, 22, 0.1)'
      ctx.lineWidth = 0.5
      
      for (let i = 0; i < particlesRef.current.length; i++) {
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const p1 = particlesRef.current[i]
          const p2 = particlesRef.current[j]
          const distance = Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2)
          
          if (distance < 80) {
            ctx.globalAlpha = (80 - distance) / 80 * 0.3
            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.stroke()
          }
        }
      }
    }
  }

  // Animation loop
  const animate = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    const rect = canvas.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    
    // Set canvas size
    canvas.width = width * window.devicePixelRatio
    canvas.height = height * window.devicePixelRatio
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    
    updateParticles(width, height, 1)
    renderParticles(ctx, width, height)
    
    animationRef.current = requestAnimationFrame(animate)
  }

  // Handle mouse movement
  const handleMouseMove = (e: MouseEvent) => {
    if (!canvasRef.current) return
    
    const rect = canvasRef.current.getBoundingClientRect()
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    }
  }

  // Initialize and start animation
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const rect = canvas.getBoundingClientRect()
    initializeParticles(rect.width, rect.height)
    
    // Start animation when visible
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          animate()
        } else {
          setIsVisible(false)
          if (animationRef.current) {
            cancelAnimationFrame(animationRef.current)
          }
        }
      },
      { threshold: 0.1 }
    )
    
    observer.observe(canvas)
    
    // Add mouse listener for interactive mode
    if (interactive) {
      canvas.addEventListener('mousemove', handleMouseMove)
    }
    
    return () => {
      observer.disconnect()
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      if (interactive) {
        canvas.removeEventListener('mousemove', handleMouseMove)
      }
    }
  }, [particleCount, interactive, type])

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (!canvasRef.current) return
      const rect = canvasRef.current.getBoundingClientRect()
      initializeParticles(rect.width, rect.height)
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 ${className}`}
      style={{
        width: '100%',
        height: '100%',
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.5s ease-in-out'
      }}
      aria-hidden="true"
      role="presentation"
    />
  )
}