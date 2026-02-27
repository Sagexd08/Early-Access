"use client"
import { useEffect, useRef } from "react"

interface AnimatedNoiseProps {
  opacity?: number
  className?: string
}

export function AnimatedNoise({ opacity = 0.05, className = "" }: AnimatedNoiseProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Use alpha: false for better performance since we don't need transparency in the noise itself
    const ctx = canvas.getContext("2d", { alpha: false })
    if (!ctx) return

    // Fixed small resolution for noise generation (drastically improves performance)
    const noiseSize = 256
    canvas.width = noiseSize
    canvas.height = noiseSize

    // Reuse ImageData to prevent garbage collection pauses
    const imageData = ctx.createImageData(noiseSize, noiseSize)
    const data = imageData.data

    let animationId: number
    let frame = 0

    const generateNoise = () => {
      for (let i = 0; i < data.length; i += 4) {
        const value = Math.random() * 255
        data[i] = value // R
        data[i + 1] = value // G
        data[i + 2] = value // B
        data[i + 3] = 255 // A
      }
      ctx.putImageData(imageData, 0, 0)
    }

    const animate = () => {
      frame++
      // Update noise every 4 frames for performance while still looking animated
      if (frame % 4 === 0) {
        generateNoise()
      }
      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        opacity,
        mixBlendMode: "overlay",
        // Let the GPU scale the small noise texture up
        imageRendering: "pixelated",
      }}
    />
  )
}
