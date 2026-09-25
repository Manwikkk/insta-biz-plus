import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // Client logos, project screenshots and team portraits are referenced at the
    // audited media URLs recorded in website-content/; blog covers come from Unsplash.
    remotePatterns: [
      { protocol: 'https', hostname: 'www.instabizweb.com', pathname: '/**' },
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
    ],
    qualities: [60, 75, 90],
    formats: ['image/avif', 'image/webp'],
  },
  async redirects() {
    // Preserved from the live site: both answered with 301.
    return [
      { source: '/team', destination: '/about-us', statusCode: 301 },
      { source: '/blog', destination: '/blogs', statusCode: 301 },
    ]
  },
}

export default nextConfig
