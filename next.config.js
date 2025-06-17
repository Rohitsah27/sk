/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Change from 'standalone' to 'export' for static generation
  trailingSlash: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*', // Allow all domains for images
        pathname: '**',
      }
    ]
  },
  // Add generation configuration
  experimental: {
    staticPageGenerationTimeout: 300, // Increase timeout for static generation
  }
};

export default nextConfig;