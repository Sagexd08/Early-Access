"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

interface PaymentNode {
  id: string
  city: string
  country: string
  coordinates: [number, number] // [longitude, latitude]
  volume: number
  isActive: boolean
}

interface PaymentFlow {
  id: string
  from: string
  to: string
  amount: number
  speed: 'instant' | 'traditional'
  timestamp: Date
}

interface LiveStats {
  transactionVolume: number
  countriesConnected: number
  averageSettlementSpeed: number // in milliseconds
}

interface GlobalVisualizationProps {
  className?: string
}

// Major financial centers with their coordinates
const PAYMENT_NODES: PaymentNode[] = [
  { id: 'nyc', city: 'New York', country: 'USA', coordinates: [-74.006, 40.7128], volume: 2500000, isActive: true },
  { id: 'london', city: 'London', country: 'UK', coordinates: [-0.1276, 51.5074], volume: 1800000, isActive: true },
  { id: 'tokyo', city: 'Tokyo', country: 'Japan', coordinates: [139.6917, 35.6895], volume: 2200000, isActive: true },
  { id: 'singapore', city: 'Singapore', country: 'Singapore', coordinates: [103.8198, 1.3521], volume: 1200000, isActive: true },
  { id: 'hongkong', city: 'Hong Kong', country: 'Hong Kong', coordinates: [114.1694, 22.3193], volume: 1500000, isActive: true },
  { id: 'frankfurt', city: 'Frankfurt', country: 'Germany', coordinates: [8.6821, 50.1109], volume: 900000, isActive: true },
  { id: 'zurich', city: 'Zurich', country: 'Switzerland', coordinates: [8.5417, 47.3769], volume: 800000, isActive: true },
  { id: 'sydney', city: 'Sydney', country: 'Australia', coordinates: [151.2093, -33.8688], volume: 600000, isActive: true },
  { id: 'toronto', city: 'Toronto', country: 'Canada', coordinates: [-79.3832, 43.6532], volume: 700000, isActive: true },
  { id: 'mumbai', city: 'Mumbai', country: 'India', coordinates: [72.8777, 19.0760], volume: 1100000, isActive: true },
]

export function GlobalVisualization({ className = "" }: GlobalVisualizationProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const [liveStats, setLiveStats] = useState<LiveStats>({
    transactionVolume: 0,
    countriesConnected: 0,
    averageSettlementSpeed: 0
  })
  const [activeFlows, setActiveFlows] = useState<PaymentFlow[]>([])
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const [focusedNode, setFocusedNode] = useState<string | null>(null)
  const animationRef = useRef<gsap.core.Timeline | null>(null)

  // Convert lat/lng to SVG coordinates
  const projectCoordinates = useCallback((lng: number, lat: number, width: number, height: number) => {
    // Simple equirectangular projection
    const x = ((lng + 180) / 360) * width
    const y = ((90 - lat) / 180) * height
    return [x, y]
  }, [])

  // Generate random payment flows
  const generatePaymentFlow = useCallback((): PaymentFlow => {
    const fromNode = PAYMENT_NODES[Math.floor(Math.random() * PAYMENT_NODES.length)]
    let toNode = PAYMENT_NODES[Math.floor(Math.random() * PAYMENT_NODES.length)]
    
    // Ensure different nodes
    while (toNode.id === fromNode.id) {
      toNode = PAYMENT_NODES[Math.floor(Math.random() * PAYMENT_NODES.length)]
    }

    return {
      id: `flow-${Date.now()}-${Math.floor(Math.random() * 1000000)}`,
      from: fromNode.id,
      to: toNode.id,
      amount: Math.floor(Math.random() * 1000000) + 10000,
      speed: Math.random() > 0.7 ? 'traditional' : 'instant',
      timestamp: new Date()
    }
  }, [])

  // Handle node interaction
  const handleNodeInteraction = (nodeId: string | null, type: 'hover' | 'focus') => {
    if (type === 'hover') {
      setHoveredNode(nodeId)
    } else {
      setFocusedNode(nodeId)
    }
  }

  // Keyboard navigation for payment nodes
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!svgRef.current) return

    const nodes = PAYMENT_NODES
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

  // Update live statistics
  useEffect(() => {
    const updateStats = () => {
      setLiveStats(prev => ({
        transactionVolume: prev.transactionVolume + Math.floor(Math.random() * 50000) + 10000,
        countriesConnected: PAYMENT_NODES.length,
        averageSettlementSpeed: Math.floor(Math.random() * 100) + 50 // 50-150ms
      }))
    }

    const interval = setInterval(updateStats, 2000)
    updateStats() // Initial update

    return () => clearInterval(interval)
  }, [])

  // Generate payment flows
  useEffect(() => {
    const generateFlow = () => {
      const newFlow = generatePaymentFlow()
      setActiveFlows(prev => {
        const updated = [...prev, newFlow]
        // Keep only recent flows (last 10)
        return updated.slice(-10)
      })

      // Remove flow after animation completes
      setTimeout(() => {
        setActiveFlows(prev => prev.filter(flow => flow.id !== newFlow.id))
      }, 3000)
    }

    const interval = setInterval(generateFlow, 1500)
    return () => clearInterval(interval)
  }, [generatePaymentFlow])

  // Initialize animations
  useEffect(() => {
    if (!containerRef.current || !svgRef.current) return

    const ctx = gsap.context(() => {
      // Animate container on scroll
      gsap.fromTo(containerRef.current, 
        { 
          opacity: 0,
          y: 100
        },
        {
          opacity: 1,
          y: 0,
          duration: 1.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      )

      // Animate payment nodes with pulsing effect
      const nodes = svgRef.current?.querySelectorAll('.payment-node')
      if (nodes) {
        nodes.forEach((node, index) => {
          gsap.set(node, { scale: 0 })
          gsap.to(node, {
            scale: 1,
            duration: 0.8,
            ease: "back.out(1.7)",
            delay: index * 0.1,
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 70%",
              toggleActions: "play none none reverse"
            }
          })

          // Continuous pulsing animation
          gsap.to(node, {
            scale: 1.2,
            duration: 2,
            ease: "power2.inOut",
            yoyo: true,
            repeat: -1,
            delay: index * 0.2
          })
        })
      }
    }, containerRef)

    return () => ctx.revert()
  }, [])

  // Animate payment flows
  useEffect(() => {
    if (!svgRef.current) return

    activeFlows.forEach(flow => {
      // Use data attribute selector instead of ID selector
      const flowElement = svgRef.current?.querySelector(`[data-flow-id="${flow.id}"]`)
      if (flowElement) {
        const pathLength = (flowElement as SVGPathElement).getTotalLength()
        
        gsap.set(flowElement, {
          strokeDasharray: pathLength,
          strokeDashoffset: pathLength
        })

        gsap.to(flowElement, {
          strokeDashoffset: 0,
          duration: flow.speed === 'instant' ? 0.8 : 2.5,
          ease: flow.speed === 'instant' ? "power2.out" : "power1.inOut"
        })
      }
    })
  }, [activeFlows])

  // Set up keyboard navigation
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.addEventListener('keydown', handleKeyDown)
    return () => container.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  const handleNodeHover = (nodeId: string | null) => {
    setHoveredNode(nodeId)
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(1)}M`
    }
    if (num >= 1000) {
      return `$${(num / 1000).toFixed(1)}K`
    }
    return `$${num}`
  }

  return (
    <section 
      ref={containerRef}
      id="global-network"
      className={`relative py-16 md:py-24 px-4 sm:px-6 md:px-8 ${className}`}
      aria-label="Global Payment Network Visualization"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-[var(--font-bebas)] text-white text-4xl md:text-6xl mb-4 tracking-wide">
            Global Payment Network
          </h2>
          <p className="font-mono text-sm text-muted-foreground max-w-2xl mx-auto">
            Real-time visualization of Lumeo's instant settlement network across major financial centers
          </p>
        </div>

        {/* Live Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="text-center p-6 border border-white/10 bg-black/20 backdrop-blur-sm">
            <div className="font-[var(--font-bebas)] text-3xl text-accent mb-2">
              {formatNumber(liveStats.transactionVolume)}
            </div>
            <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              Transaction Volume
            </div>
          </div>
          <div className="text-center p-6 border border-white/10 bg-black/20 backdrop-blur-sm">
            <div className="font-[var(--font-bebas)] text-3xl text-accent mb-2">
              {liveStats.countriesConnected}
            </div>
            <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              Countries Connected
            </div>
          </div>
          <div className="text-center p-6 border border-white/10 bg-black/20 backdrop-blur-sm">
            <div className="font-[var(--font-bebas)] text-3xl text-accent mb-2">
              {liveStats.averageSettlementSpeed}ms
            </div>
            <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              Settlement Speed
            </div>
          </div>
        </div>

        {/* World Map Visualization */}
        <div 
          className="relative bg-black/30 border border-white/10 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-accent/50"
          tabIndex={-1}
          role="application"
          aria-label="Interactive world map showing payment nodes and flows. Use arrow keys to navigate between nodes."
        >
          <svg
            ref={svgRef}
            viewBox="0 0 1000 500"
            className="w-full h-[400px] md:h-[500px]"
            aria-label="Interactive world map showing payment nodes and flows"
          >
            {/* World map outline (simplified) */}
            <defs>
              <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
              </pattern>
            </defs>
            
            {/* Grid background */}
            <rect width="100%" height="100%" fill="url(#grid)" />
            
            {/* Simplified world continents */}
            <g className="continents" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.2)" strokeWidth="1">
              {/* North America */}
              <path d="M 100 150 Q 200 120 300 150 L 280 250 Q 200 280 120 250 Z" />
              {/* Europe */}
              <path d="M 450 120 Q 520 110 580 130 L 570 200 Q 520 210 460 190 Z" />
              {/* Asia */}
              <path d="M 600 100 Q 750 80 900 120 L 880 250 Q 750 270 620 240 Z" />
              {/* Africa */}
              <path d="M 480 200 Q 550 190 600 220 L 580 350 Q 520 370 490 340 Z" />
              {/* Australia */}
              <path d="M 750 350 Q 850 340 900 360 L 880 400 Q 820 410 760 390 Z" />
              {/* South America */}
              <path d="M 250 280 Q 320 270 350 300 L 330 420 Q 280 440 260 410 Z" />
            </g>

            {/* Payment Nodes */}
            {PAYMENT_NODES.map(node => {
              const [x, y] = projectCoordinates(node.coordinates[0], node.coordinates[1], 1000, 500)
              const isHovered = hoveredNode === node.id
              const isFocused = focusedNode === node.id
              const isActive = isHovered || isFocused
              
              return (
                <g key={node.id}>
                  {/* Node glow effect */}
                  <circle
                    cx={x}
                    cy={y}
                    r={isActive ? 20 : 15}
                    fill="rgba(249, 115, 22, 0.2)"
                    className="transition-all duration-300"
                  />
                  
                  {/* Main node */}
                  <circle
                    cx={x}
                    cy={y}
                    r={isActive ? 8 : 6}
                    fill="#f97316"
                    className="payment-node cursor-pointer transition-all duration-300"
                    data-node-id={node.id}
                    tabIndex={0}
                    role="button"
                    aria-label={`Payment node: ${node.city}, ${node.country}. Volume: ${formatNumber(node.volume)}. Press Enter for details.`}
                    onMouseEnter={() => handleNodeInteraction(node.id, 'hover')}
                    onMouseLeave={() => handleNodeInteraction(null, 'hover')}
                    onFocus={() => handleNodeInteraction(node.id, 'focus')}
                    onBlur={() => handleNodeInteraction(null, 'focus')}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        // Announce node details
                        const announcement = `${node.city}, ${node.country}. Transaction volume: ${formatNumber(node.volume)}`
                        const announcer = document.createElement('div')
                        announcer.setAttribute('aria-live', 'polite')
                        announcer.className = 'sr-only'
                        announcer.textContent = announcement
                        document.body.appendChild(announcer)
                        setTimeout(() => document.body.removeChild(announcer), 1000)
                      }
                    }}
                  />
                  
                  {/* Node label */}
                  <text
                    x={x}
                    y={y - 25}
                    textAnchor="middle"
                    className="fill-white font-mono text-xs pointer-events-none"
                    style={{ fontSize: '10px' }}
                  >
                    {node.city}
                  </text>
                  
                  {/* Volume indicator */}
                  {isActive && (
                    <text
                      x={x}
                      y={y + 35}
                      textAnchor="middle"
                      className="fill-accent font-mono text-xs pointer-events-none"
                      style={{ fontSize: '8px' }}
                    >
                      {formatNumber(node.volume)}
                    </text>
                  )}
                </g>
              )
            })}

            {/* Payment Flows */}
            {activeFlows.map(flow => {
              const fromNode = PAYMENT_NODES.find(n => n.id === flow.from)
              const toNode = PAYMENT_NODES.find(n => n.id === flow.to)
              
              if (!fromNode || !toNode) return null
              
              const [x1, y1] = projectCoordinates(fromNode.coordinates[0], fromNode.coordinates[1], 1000, 500)
              const [x2, y2] = projectCoordinates(toNode.coordinates[0], toNode.coordinates[1], 1000, 500)
              
              // Create curved path
              const midX = (x1 + x2) / 2
              const midY = Math.min(y1, y2) - 50
              const pathData = `M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`
              
              return (
                <path
                  key={flow.id}
                  data-flow-id={flow.id}
                  d={pathData}
                  fill="none"
                  stroke={flow.speed === 'instant' ? '#f97316' : '#6b7280'}
                  strokeWidth={flow.speed === 'instant' ? 2 : 1}
                  opacity={0.8}
                  className="payment-flow"
                />
              )
            })}
          </svg>
          
          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm border border-white/20 p-4 rounded">
            <div className="font-mono text-xs text-white mb-2 uppercase tracking-wider">Legend</div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-accent"></div>
                <span className="font-mono text-xs text-muted-foreground">Payment Nodes</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-0.5 bg-accent"></div>
                <span className="font-mono text-xs text-muted-foreground">Instant Settlement</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-0.5 bg-gray-500"></div>
                <span className="font-mono text-xs text-muted-foreground">Traditional Rails</span>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Comparison */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-6 border border-red-500/30 bg-red-500/5 rounded-lg">
            <h3 className="font-mono text-sm uppercase tracking-widest text-red-400 mb-4">
              Traditional Banking
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-mono text-xs text-muted-foreground">Settlement Time</span>
                <span className="font-mono text-xs text-red-400">3-5 Days</span>
              </div>
              <div className="flex justify-between">
                <span className="font-mono text-xs text-muted-foreground">Intermediaries</span>
                <span className="font-mono text-xs text-red-400">5-7 Banks</span>
              </div>
              <div className="flex justify-between">
                <span className="font-mono text-xs text-muted-foreground">Fees</span>
                <span className="font-mono text-xs text-red-400">3-8%</span>
              </div>
            </div>
          </div>
          
          <div className="p-6 border border-accent/30 bg-accent/5 rounded-lg">
            <h3 className="font-mono text-sm uppercase tracking-widest text-accent mb-4">
              Lumeo Network
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-mono text-xs text-muted-foreground">Settlement Time</span>
                <span className="font-mono text-xs text-accent">&lt;100ms</span>
              </div>
              <div className="flex justify-between">
                <span className="font-mono text-xs text-muted-foreground">Intermediaries</span>
                <span className="font-mono text-xs text-accent">0</span>
              </div>
              <div className="flex justify-between">
                <span className="font-mono text-xs text-muted-foreground">Fees</span>
                <span className="font-mono text-xs text-accent">~0%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}