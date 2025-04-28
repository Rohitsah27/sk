/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',   // ✅ this will create static HTML/CSS/JS in 'out/' folder
  distDir: 'out',     // ✅ output directory
  images: {
    unoptimized: true, // ✅ needed because Netlify doesn't optimize Next.js images by default
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ext.same-assets.com',
        pathname: '**',
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

export default nextConfig;
