import type React from "react"
import type { Metadata } from "next"
import { IBM_Plex_Sans, IBM_Plex_Mono, Bebas_Neue, Space_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { SmoothScroll } from "@/components/smooth-scroll"
import "./globals.css"

const ibmPlexSans = IBM_Plex_Sans({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-ibm-plex-sans",
})
const ibmPlexMono = IBM_Plex_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-ibm-plex-mono",
})
const bebasNeue = Bebas_Neue({ weight: "400", subsets: ["latin"], variable: "--font-bebas" })
const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
})

export const metadata: Metadata = {
  title: "Lumeo — Alpha v0.1 Early Access",
  description:
    "Get early access to Lumeo. Join the quantum revolution in instant payments. Limited alpha spots available. Sign up now for the full launch in 6 months.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark bg-background">
      <body
        className={`${ibmPlexSans.variable} ${bebasNeue.variable} ${ibmPlexMono.variable} ${spaceMono.variable} font-sans antialiased overflow-x-hidden`}
      >
        {/* Skip Links for Accessibility */}
        <div className="skip-links">
          <a href="#main-content" className="skip-link">
            Skip to main content
          </a>
          <a href="#navigation" className="skip-link">
            Skip to navigation
          </a>
        </div>

        <div className="noise-overlay" aria-hidden="true" />
        <SmoothScroll>
          <main id="main-content" tabIndex={-1}>
            {children}
          </main>
        </SmoothScroll>
        <Analytics />
      </body>
    </html>
  )
}
