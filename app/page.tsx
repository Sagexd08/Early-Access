import { LumeoAnimation } from "@/components/lumeo-animation"

export default function Page() {
  return (
    <main className="relative min-h-screen">
      <div className="grid-bg fixed inset-0 opacity-30" aria-hidden="true" />
      <LumeoAnimation />
    </main>
  )
}
