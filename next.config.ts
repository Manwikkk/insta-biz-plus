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
