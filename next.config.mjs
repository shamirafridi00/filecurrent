/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias.canvas = false
    return config
  },
  // Tell Next.js to treat @react-pdf/renderer as an external (Node.js handles it)
  experimental: {
    serverComponentsExternalPackages: ['@react-pdf/renderer'],
  },
}

export default nextConfig
