"use client"

import { LumeoAnimation } from "@/components/lumeo-animation"
import dynamic from "next/dynamic"

const Plasma = dynamic(() => import("@/components/plasma").then(m => m.Plasma), { ssr: false })

export default function Page() {
  return (
    <main className="relative min-h-screen">
      {/* Full-screen Plasma background */}
      <div className="fixed inset-0 z-0" aria-hidden="true">
        <Plasma
          color="#d4a020"
          speed={0.35}
          direction="forward"
          scale={1.25}
          opacity={0.85}
          mouseInteractive={true}
        />
      </div>
      <LumeoAnimation />
    </main>
  )
}
