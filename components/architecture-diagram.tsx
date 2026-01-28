"use client"

import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

interface ArchitectureNode {
  id: string
  type: 'wallet' | 'settlement' | 'compliance' | 'rails' | 'traditional'
  label: string
  position: { x: number; y: number }
  connections: string[]
  description: string
  isHighlighted: boolean
}

interface ArchitectureDiagramProps {
  className?: string
}

const ARCHITECTURE_NODES: ArchitectureNode[] = [
  {
    id: 'wallet',
    type: 'wallet',
    label: 'Wallet = Identity',
    position: { x: 200, y: 150 },
    connections: ['settlement'],
    description: 'Cryptographic keys serve as both identity and authorization',
    isHighlighted: false
  },
  {
    id: 'settlement',
    type: 'settlement',
    label: 'Instant Settlement',
    position: { x: 500, y: 150 },
    connections: ['compliance', 'rails'],
    description: 'Sub-millisecond finality, not messaging',
    isHighlighted: false
  },
  {
    id: 'compliance',
    type: 'compliance',
    label: 'Regulatory Layer',
    position: { x: 350, y: 300 },
    connections: ['settlement'],
    description: 'Built-in compliance without friction',
    isHighlighted: false
  },
  {
    id: 'rails',
    type: 'rails',
    label: 'Unified Rails',
    position: { x: 650, y: 300 },
    connections: ['settlement'],
    description: 'Single layer across all chains',
    isHighlighted: false
  },
  {
    id: 'traditional-1',
    type: 'traditional',
    label: 'Bank A',
    position: { x: 100, y: 400 },
    connections: ['traditional-2'],
    description: 'Traditional correspondent banking',
    isHighlighted: false
  },
  {
    id: 'traditional-2',
    type: 'traditional',
    label: 'Intermediary',
    position: { x: 300, y: 450 },
    connections: ['traditional-3'],
    description: 'Multiple intermediaries required',
    isHighlighted: false
  },
  {
    id: 'traditional-3',
    type: 'traditional',
    label: 'Bank B',
    position: { x: 500, y: 400 },
    connections: [],
    description: 'Slow settlement process',
    isHighlighted: false
  }
]

export function ArchitectureDiagram({ className = "" }: ArchitectureDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const [activeNode, setActiveNode] = useState<string | null>(null)
  const [focusedNode, setFocusedNode] = useState<string | null>(null)
  const [showComparison, setShowComparison] = useState(false)
  const [animationPhase, setAnimationPhase] = useState<'intro' | 'lumeo' | 'comparison'>('intro')

  // Handle node interaction
  const handleNodeClick = (nodeId: string) => {
    setActiveNode(activeNode === nodeId ? null : nodeId)
  }

  // Handle node focus
  const handleNodeFocus = (nodeId: string | null) => {
    setFocusedNode(nodeId)
    if (nodeId) {
      setActiveNode(nodeId)
    }
  }

  // Keyboard navigation for architecture nodes
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!svgRef.current) return

    const nodes = ARCHITECTURE_NODES
    const currentIndex = focusedNode ? nodes.findIndex(n => n.id === focusedNode) : -1

    let nextIndex = currentIndex

    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault()
        nextIndex = currentIndex < nodes.length - 1 ? currentIndex + 1 : 0
        break
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault()
        nextIndex = currentIndex > 0 ? currentIndex - 1 : nodes.length - 1
        break
      case 'Home':
        event.preventDefault()
        nextIndex = 0
        break
      case 'End':
        event.preventDefault()
        nextIndex = nodes.length - 1
        break
      case 'Enter':
      case ' ':
        if (focusedNode) {
          event.preventDefault()
          handleNodeClick(focusedNode)
        }
        return
      default:
        return
    }

    const nextNode = nodes[nextIndex]
    if (nextNode) {
      setFocusedNode(nextNode.id)
      
      // Focus the corresponding SVG element
      const nodeElement = svgRef.current?.querySelector(`[data-node-id="${nextNode.id}"]`) as SVGElement
      if (nodeElement) {
        nodeElement.focus()
      }
    }
  }, [focusedNode])

  // Initialize animations
  useEffect(() => {
    if (!containerRef.current || !svgRef.current) return

    const ctx = gsap.context(() => {
      // Initial setup - hide all elements
      gsap.set('.architecture-node', { scale: 0, opacity: 0 })
      gsap.set('.connection-line', { strokeDasharray: '5,5', strokeDashoffset: 10, opacity: 0 })
      gsap.set('.traditional-nodes', { opacity: 0, y: 50 })

      // Phase 1: Intro animation
      const introTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 70%",
          end: "bottom 30%",
          toggleActions: "play none none reverse"
        }
      })

      introTl
        .to('.lumeo-nodes .architecture-node', {
          scale: 1,
          opacity: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: "back.out(1.7)"
        })
        .to('.lumeo-connections .connection-line', {
          opacity: 1,
          strokeDashoffset: 0,
          duration: 1,
          stagger: 0.1,
          ease: "power2.out"
        }, "-=0.4")
        .call(() => setAnimationPhase('lumeo'))

      // Phase 2: Show traditional system for comparison
      const comparisonTl = gsap.timeline({
        delay: 2
      })

      comparisonTl
        .to('.traditional-nodes', {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out"
        })
        .to('.traditional-connections .connection-line', {
          opacity: 0.6,
          strokeDashoffset: 0,
          duration: 1.5,
          stagger: 0.3,
          ease: "power1.inOut"
        }, "-=0.5")
        .call(() => setAnimationPhase('comparison'))

      // Continuous pulse animation for active nodes
      gsap.to('.lumeo-nodes .architecture-node', {
        scale: 1.05,
        duration: 2,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1,
        stagger: 0.3
      })

    }, containerRef)

    return () => ctx.revert()
  }, [])

  // Set up keyboard navigation
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.addEventListener('keydown', handleKeyDown)
    return () => container.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // Data flow animation
  useEffect(() => {
    if (!svgRef.current || animationPhase !== 'lumeo') return

    const animateDataFlow = () => {
      const flowParticles = svgRef.current?.querySelectorAll('.flow-particle')
      if (flowParticles) {
        gsap.fromTo(flowParticles, 
          { 
            opacity: 0,
            scale: 0
          },
          {
            opacity: 1,
            scale: 1,
            duration: 0.5,
            stagger: 0.1,
            ease: "power2.out",
            onComplete: () => {
              gsap.to(flowParticles, {
                opacity: 0,
                scale: 0,
                duration: 0.5,
                delay: 1,
                stagger: 0.1
              })
            }
          }
        )
      }
    }

    const interval = setInterval(animateDataFlow, 3000)
    return () => clearInterval(interval)
  }, [animationPhase])

  const getNodeColor = (type: string) => {
    switch (type) {
      case 'wallet': return '#f97316'
      case 'settlement': return '#10b981'
      case 'compliance': return '#3b82f6'
      case 'rails': return '#8b5cf6'
      case 'traditional': return '#6b7280'
      default: return '#ffffff'
    }
  }

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'wallet': return '🔐'
      case 'settlement': return '⚡'
      case 'compliance': return '✓'
      case 'rails': return '🌐'
      case 'traditional': return '🏦'
      default: return '●'
    }
  }

  return (
    <section 
      ref={containerRef}
      id="architecture"
      className={`relative py-16 md:py-24 px-4 sm:px-6 md:px-8 ${className}`}
      aria-label="Lumeo Architecture Diagram"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-[var(--font-bebas)] text-white text-4xl md:text-6xl mb-4 tracking-wide">
            Revolutionary Architecture
          </h2>
          <p className="font-mono text-sm text-muted-foreground max-w-2xl mx-auto">
            From fragmented traditional rails to unified settlement layer
          </p>
        </div>

        {/* Architecture Visualization */}
        <div 
          className="relative bg-black/30 border border-white/10 rounded-lg overflow-hidden min-h-[600px] focus-within:ring-2 focus-within:ring-accent/50"
          tabIndex={-1}
          role="application"
          aria-label="Interactive architecture diagram. Use arrow keys to navigate between nodes, Enter to select."
        >
          <svg
            ref={svgRef}
            viewBox="0 0 800 600"
            className="w-full h-full"
            aria-label="Interactive architecture diagram"
          >
            {/* Background grid */}
            <defs>
              <pattern id="arch-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
              </pattern>
              
              {/* Glow filters */}
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            <rect width="100%" height="100%" fill="url(#arch-grid)" />

            {/* Section Labels */}
            <text x="400" y="30" textAnchor="middle" className="fill-accent font-mono text-sm font-bold">
              LUMEO UNIFIED LAYER
            </text>
            <text x="300" y="380" textAnchor="middle" className="fill-red-400 font-mono text-sm font-bold">
              TRADITIONAL BANKING RAILS
            </text>

            {/* Lumeo Architecture Connections */}
            <g className="lumeo-connections">
              {ARCHITECTURE_NODES
                .filter(node => node.type !== 'traditional')
                .map(node => 
                  node.connections
                    .filter(connId => !connId.startsWith('traditional'))
                    .map(connId => {
                      const targetNode = ARCHITECTURE_NODES.find(n => n.id === connId)
                      if (!targetNode) return null
                      
                      return (
                        <line
                          key={`${node.id}-${connId}`}
                          x1={node.position.x}
                          y1={node.position.y}
                          x2={targetNode.position.x}
                          y2={targetNode.position.y}
                          stroke="#f97316"
                          strokeWidth="2"
                          className="connection-line"
                          opacity="0.6"
                        />
                      )
                    })
                )}
            </g>

            {/* Traditional Banking Connections */}
            <g className="traditional-connections">
              {ARCHITECTURE_NODES
                .filter(node => node.type === 'traditional')
                .map(node => 
                  node.connections.map(connId => {
                    const targetNode = ARCHITECTURE_NODES.find(n => n.id === connId)
                    if (!targetNode) return null
                    
                    return (
                      <line
                        key={`${node.id}-${connId}`}
                        x1={node.position.x}
                        y1={node.position.y}
                        x2={targetNode.position.x}
                        y2={targetNode.position.y}
                        stroke="#6b7280"
                        strokeWidth="2"
                        className="connection-line"
                        opacity="0.4"
                        strokeDasharray="5,5"
                      />
                    )
                  })
                )}
            </g>

            {/* Flow Particles */}
            <g className="flow-particles">
              {[...Array(8)].map((_, i) => (
                <circle
                  key={i}
                  cx={200 + i * 50}
                  cy={150}
                  r="3"
                  fill="#f97316"
                  className="flow-particle"
                  opacity="0"
                  filter="url(#glow)"
                />
              ))}
            </g>

            {/* Lumeo Architecture Nodes */}
            <g className="lumeo-nodes">
              {ARCHITECTURE_NODES
                .filter(node => node.type !== 'traditional')
                .map(node => {
                  const isActive = activeNode === node.id
                  const isFocused = focusedNode === node.id
                  const isHighlighted = isActive || isFocused
                  
                  return (
                    <g key={node.id}>
                      {/* Node glow */}
                      <circle
                        cx={node.position.x}
                        cy={node.position.y}
                        r={isHighlighted ? 35 : 25}
                        fill={getNodeColor(node.type)}
                        opacity="0.2"
                        className="transition-all duration-300"
                      />
                      
                      {/* Main node */}
                      <circle
                        cx={node.position.x}
                        cy={node.position.y}
                        r={isHighlighted ? 20 : 15}
                        fill={getNodeColor(node.type)}
                        className="architecture-node cursor-pointer transition-all duration-300"
                        data-node-id={node.id}
                        tabIndex={0}
                        role="button"
                        aria-label={`${node.label}: ${node.description}. Press Enter to toggle details.`}
                        onClick={() => handleNodeClick(node.id)}
                        onFocus={() => handleNodeFocus(node.id)}
                        onBlur={() => handleNodeFocus(null)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            handleNodeClick(node.id)
                          }
                        }}
                        filter="url(#glow)"
                      />
                      
                      {/* Node icon */}
                      <text
                        x={node.position.x}
                        y={node.position.y + 5}
                        textAnchor="middle"
                        className="fill-black font-bold pointer-events-none"
                        style={{ fontSize: '12px' }}
                      >
                        {getNodeIcon(node.type)}
                      </text>
                      
                      {/* Node label */}
                      <text
                        x={node.position.x}
                        y={node.position.y - 35}
                        textAnchor="middle"
                        className="fill-white font-mono text-xs font-bold pointer-events-none"
                      >
                        {node.label}
                      </text>
                      
                      {/* Description on hover/focus */}
                      {isHighlighted && (
                        <g>
                          <rect
                            x={node.position.x - 80}
                            y={node.position.y + 30}
                            width="160"
                            height="40"
                            fill="rgba(0,0,0,0.8)"
                            stroke={getNodeColor(node.type)}
                            strokeWidth="1"
                            rx="4"
                          />
                          <text
                            x={node.position.x}
                            y={node.position.y + 50}
                            textAnchor="middle"
                            className="fill-white font-mono text-xs pointer-events-none"
                          >
                            {node.description}
                          </text>
                        </g>
                      )}
                    </g>
                  )
                })}
            </g>

            {/* Traditional Banking Nodes */}
            <g className="traditional-nodes">
              {ARCHITECTURE_NODES
                .filter(node => node.type === 'traditional')
                .map(node => (
                  <g key={node.id}>
                    {/* Node */}
                    <rect
                      x={node.position.x - 15}
                      y={node.position.y - 15}
                      width="30"
                      height="30"
                      fill={getNodeColor(node.type)}
                      className="architecture-node cursor-pointer"
                      onClick={() => handleNodeClick(node.id)}
                    />
                    
                    {/* Node icon */}
                    <text
                      x={node.position.x}
                      y={node.position.y + 5}
                      textAnchor="middle"
                      className="fill-white font-bold pointer-events-none"
                      style={{ fontSize: '10px' }}
                    >
                      {getNodeIcon(node.type)}
                    </text>
                    
                    {/* Node label */}
                    <text
                      x={node.position.x}
                      y={node.position.y - 25}
                      textAnchor="middle"
                      className="fill-gray-400 font-mono text-xs"
                    >
                      {node.label}
                    </text>
                  </g>
                ))}
            </g>
          </svg>

          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm border border-white/20 p-4 rounded">
            <div className="font-mono text-xs text-white mb-3 uppercase tracking-wider">Architecture Legend</div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                <span className="font-mono text-xs text-muted-foreground">Wallet Layer</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="font-mono text-xs text-muted-foreground">Settlement</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="font-mono text-xs text-muted-foreground">Compliance</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                <span className="font-mono text-xs text-muted-foreground">Unified Rails</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-500"></div>
                <span className="font-mono text-xs text-muted-foreground">Traditional</span>
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm border border-white/20 p-4 rounded">
            <div className="font-mono text-xs text-white mb-3 uppercase tracking-wider">Performance</div>
            <div className="space-y-2">
              <div className="flex justify-between gap-4">
                <span className="font-mono text-xs text-muted-foreground">Lumeo:</span>
                <span className="font-mono text-xs text-green-400">&lt;100ms</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="font-mono text-xs text-muted-foreground">Traditional:</span>
                <span className="font-mono text-xs text-red-400">3-5 days</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="font-mono text-xs text-muted-foreground">Intermediaries:</span>
                <span className="font-mono text-xs text-green-400">0 vs 5-7</span>
              </div>
            </div>
          </div>
        </div>

        {/* Foundational Principles */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 border border-orange-500/30 bg-orange-500/5 rounded-lg">
            <div className="text-2xl mb-3">🔐</div>
            <h3 className="font-mono text-sm uppercase tracking-widest text-orange-400 mb-3">
              Wallet = Identity
            </h3>
            <p className="font-mono text-xs text-muted-foreground leading-relaxed">
              Cryptographic keys serve as both identity and authorization, eliminating the need for traditional account systems.
            </p>
          </div>
          
          <div className="p-6 border border-green-500/30 bg-green-500/5 rounded-lg">
            <div className="text-2xl mb-3">⚡</div>
            <h3 className="font-mono text-sm uppercase tracking-widest text-green-400 mb-3">
              Settlement, Not Messaging
            </h3>
            <p className="font-mono text-xs text-muted-foreground leading-relaxed">
              Instant finality means transactions are settled, not just messaged between intermediaries.
            </p>
          </div>
          
          <div className="p-6 border border-purple-500/30 bg-purple-500/5 rounded-lg">
            <div className="text-2xl mb-3">🎯</div>
            <h3 className="font-mono text-sm uppercase tracking-widest text-purple-400 mb-3">
              Intent-Based Payments
            </h3>
            <p className="font-mono text-xs text-muted-foreground leading-relaxed">
              Smart routing finds the optimal path for any payment, automatically handling complexity.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}