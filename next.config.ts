import type { NextConfig } from 'next'
import widths from './src/lib/imageWidths.json'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // Logos, product and project screens live in public/ and are made ahead of time at these widths
    // (scripts/optimize-images.mjs) rather than on request; blog covers come from Unsplash's CDN.
    loader: 'custom',
    loaderFile: './src/lib/imageLoader.ts',
    deviceSizes: widths.deviceSizes,
    imageSizes: widths.imageSizes,
    remotePatterns: [{ protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' }],
    qualities: [60, 75, 90],
  },
  async headers() {
    return [
      // made-ahead pictures are named by their content: they never change, so they are kept for a year
      { source: '/_img/:path*', headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }] },
    ]
  },
  async redirects() {
    return [
      // Preserved from the live site: both answered with 301.
      { source: '/team', destination: '/about-us', statusCode: 301 },
      { source: '/blog', destination: '/blogs', statusCode: 301 },
      // Pages for services no longer offered (Digital Marketing, UI/UX Design): sent to the nearest page.
      { source: '/digital-marketing-agency-in-ahmedabad', destination: '/services', statusCode: 301 },
      { source: '/seo-company-in-ahmedabad', destination: '/services', statusCode: 301 },
      { source: '/audit', destination: '/contact-us', statusCode: 301 },
      { source: '/blogs/seo-fundamentals-for-founders-2026-edition', destination: '/blogs', statusCode: 301 },
      { source: '/blogs/aeo-geo-how-to-rank-in-google-ai-overviews-and-chatgpt', destination: '/blogs', statusCode: 301 },
      { source: '/blogs/aso-app-store-optimization-2026', destination: '/blogs', statusCode: 301 },
      { source: '/blogs/designing-mobile-apps-people-actually-keep', destination: '/blogs', statusCode: 301 },
    ]
  },
}

export default nextConfig
