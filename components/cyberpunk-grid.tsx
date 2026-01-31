"use client"

import { useEffect, useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

export function CyberpunkGrid() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const { scrollY } = useScroll()
    const opacity = useTransform(scrollY, [0, 300], [1, 0.2])

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        let width = window.innerWidth
        let height = window.innerHeight

        const resize = () => {
            width = window.innerWidth
            height = window.innerHeight
            canvas.width = width
            canvas.height = height
        }

        window.addEventListener("resize", resize)
        resize()

        // Particles
        const particles: { x: number; y: number; speed: number; size: number }[] = []
        const particleCount = window.innerWidth < 768 ? 20 : 60 // Reduce on mobile

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                speed: 0.2 + Math.random() * 0.5,
                size: Math.random() * 1.5
            })
        }

        let animationFrameId: number

        const draw = () => {
            ctx.clearRect(0, 0, width, height)

            // Draw Particles
            ctx.fillStyle = "rgba(45, 212, 191, 0.3)" // Cyan tint
            particles.forEach(p => {
                p.y -= p.speed
                if (p.y < 0) {
                    p.y = height
                    p.x = Math.random() * width
                }

                ctx.beginPath()
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
                ctx.fill()
            })

            // Draw Grid Lines (moving)
            const time = Date.now() / 1000
            const gridOffset = (time * 10) % 40

            ctx.strokeStyle = "rgba(255, 255, 255, 0.03)"
            ctx.lineWidth = 1

            // Vertical lines
            for (let x = 0; x <= width; x += 40) {
                ctx.beginPath()
                ctx.moveTo(x, 0)
                ctx.lineTo(x, height)
                ctx.stroke()
            }

            // Horizontal lines (moving up)
            for (let y = gridOffset; y <= height; y += 40) {
                ctx.beginPath()
                ctx.moveTo(0, y)
                ctx.lineTo(width, y)
                ctx.stroke()
            }

            animationFrameId = requestAnimationFrame(draw)
        }

        draw()

        return () => {
            window.removeEventListener("resize", resize)
            cancelAnimationFrame(animationFrameId)
        }
    }, [])

    return (
        <motion.div
            className="fixed inset-0 pointer-events-none z-0"
            style={{ opacity }}
            aria-hidden="true"
        >
            <canvas ref={canvasRef} className="w-full h-full" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50" />
        </motion.div>
    )
}
