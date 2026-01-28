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

// Major financial centers with their accurate coordinates
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
  { id: 'dubai', city: 'Dubai', country: 'UAE', coordinates: [55.2708, 25.2048], volume: 950000, isActive: true },
  { id: 'saopaulo', city: 'São Paulo', country: 'Brazil', coordinates: [-46.6333, -23.5505], volume: 650000, isActive: true },
  { id: 'seoul', city: 'Seoul', country: 'South Korea', coordinates: [126.9780, 37.5665], volume: 850000, isActive: true },
  { id: 'shanghai', city: 'Shanghai', country: 'China', coordinates: [121.4737, 31.2304], volume: 1300000, isActive: true },
  { id: 'paris', city: 'Paris', country: 'France', coordinates: [2.3522, 48.8566], volume: 750000, isActive: true },
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
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent bg-accent/10 px-3 py-1 rounded-full">
              Global Network
            </span>
          </div>
          <h2 className="font-[var(--font-bebas)] text-white text-5xl md:text-7xl mb-6 tracking-wide">
            INSTANT GLOBAL SETTLEMENT
          </h2>
          <p className="font-mono text-sm text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Watch real-time payment flows across Lumeo's quantum-speed settlement network. 
            Every pulse represents value moving at the speed of light across borders.
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
            
            {/* Detailed World Map with accurate country boundaries */}
            <g className="world-map" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5">
              {/* North America */}
              <path d="M 158 180 Q 180 160 220 170 L 240 180 Q 260 175 280 185 L 290 200 Q 285 220 275 240 L 260 260 Q 240 270 220 265 L 200 255 Q 180 245 170 225 L 165 205 Q 160 190 158 180 Z" />
              <path d="M 200 140 Q 230 130 250 145 L 270 160 Q 275 170 270 180 L 250 175 Q 230 165 210 155 L 200 140 Z" />
              
              {/* South America */}
              <path d="M 280 280 Q 300 275 320 290 L 330 310 Q 335 340 330 370 L 325 400 Q 320 420 310 430 L 295 425 Q 285 415 280 395 L 275 365 Q 270 335 275 305 L 280 280 Z" />
              
              {/* Europe */}
              <path d="M 480 140 Q 500 135 520 145 L 540 155 Q 560 160 575 170 L 580 185 Q 575 200 565 210 L 545 215 Q 525 210 505 200 L 485 185 Q 475 170 480 140 Z" />
              
              {/* Africa */}
              <path d="M 500 220 Q 520 215 540 225 L 560 240 Q 575 260 580 285 L 585 315 Q 580 345 570 370 L 555 390 Q 535 400 515 395 L 495 385 Q 485 365 490 340 L 495 310 Q 500 280 505 250 L 500 220 Z" />
              
              {/* Asia */}
              <path d="M 600 120 Q 650 110 700 125 L 750 140 Q 800 155 850 175 L 880 195 Q 885 220 875 245 L 860 270 Q 840 285 815 290 L 785 285 Q 755 275 730 260 L 705 240 Q 680 220 660 195 L 640 170 Q 620 145 600 120 Z" />
              
              {/* Russia/Northern Asia */}
              <path d="M 580 80 Q 630 70 680 80 L 730 90 Q 780 100 830 115 L 870 130 Q 880 140 875 155 L 850 160 Q 800 150 750 140 L 700 130 Q 650 120 600 125 L 580 115 Q 575 100 580 80 Z" />
              
              {/* India */}
              <path d="M 680 240 Q 700 235 720 245 L 735 260 Q 740 280 735 300 L 725 315 Q 710 320 695 315 L 680 305 Q 675 285 680 265 L 680 240 Z" />
              
              {/* China */}
              <path d="M 720 180 Q 750 175 780 185 L 810 200 Q 820 220 815 240 L 800 255 Q 780 260 760 255 L 740 245 Q 725 225 720 200 L 720 180 Z" />
              
              {/* Australia */}
              <path d="M 780 350 Q 820 345 860 355 L 890 370 Q 900 385 895 400 L 880 410 Q 850 415 820 410 L 790 400 Q 775 385 780 365 L 780 350 Z" />
              
              {/* Japan */}
              <path d="M 860 200 Q 870 195 880 205 L 885 220 Q 880 235 870 240 L 860 235 Q 855 220 860 205 L 860 200 Z" />
              
              {/* UK */}
              <path d="M 470 155 Q 475 150 485 155 L 490 165 Q 485 175 475 170 L 470 160 Q 468 155 470 155 Z" />
              
              {/* Scandinavia */}
              <path d="M 520 100 Q 535 95 550 105 L 560 120 Q 555 135 545 140 L 530 135 Q 520 120 520 105 L 520 100 Z" />
              
              {/* Middle East */}
              <path d="M 580 200 Q 600 195 620 205 L 635 220 Q 630 235 620 240 L 600 235 Q 585 220 580 205 L 580 200 Z" />
              
              {/* Southeast Asia */}
              <path d="M 750 280 Q 770 275 790 285 L 810 300 Q 815 315 810 330 L 795 335 Q 775 330 760 320 L 750 305 Q 745 290 750 280 Z" />
              
              {/* Indonesia */}
              <path d="M 760 320 Q 780 315 800 325 L 820 340 Q 825 355 820 365 L 800 360 Q 780 350 765 340 L 760 325 Q 758 320 760 320 Z" />
              
              {/* Madagascar */}
              <path d="M 590 380 Q 595 375 605 380 L 610 395 Q 605 410 595 405 L 590 390 Q 588 380 590 380 Z" />
              
              {/* Greenland */}
              <path d="M 350 80 Q 370 75 390 85 L 400 100 Q 395 115 385 120 L 365 115 Q 350 100 350 85 L 350 80 Z" />
              
              {/* Caribbean */}
              <path d="M 260 240 Q 270 235 280 240 L 285 250 Q 280 260 270 255 L 260 245 Q 258 240 260 240 Z" />
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