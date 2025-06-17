/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  distDir: 'out',
  images: {
    unoptimized: true, // Only needed for static exports
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ext.same-assets.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'sk-equipments.netlify.app',
        pathname: '**',
      }
    ],
    domains: ['sk-equipments.netlify.app'], // Add your image domains here
  },
  typescript: {
    ignoreBuildErrors: true, // Use with caution
  },
  eslint: {
    ignoreDuringBuilds: true, // Use with caution
  },
  trailingSlash: true, // Add this line
  // Optional: Add security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload'
          },
        ],
      },
    ];
  },
}

export default nextConfig;