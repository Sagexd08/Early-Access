/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  experimental: {
    optimizePackageImports: ["@radix-ui/react-icons", "lucide-react", "framer-motion"],
  },
  turbopack: {
    root: ".",
  },
}

export default nextConfig
