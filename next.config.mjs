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
  async redirects() {
    return [
      // Intake forms live at /intake-forms; /forms is a common shorthand.
      { source: '/forms', destination: '/intake-forms', permanent: false },
      { source: '/forms/:path*', destination: '/intake-forms/:path*', permanent: false },
    ]
  },
}

export default nextConfig
