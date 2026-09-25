import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/seo'

// Preserved rules: all public pages allowed; /api/ and /_next/ disallowed; points to sitemap.xml.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/_next/'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
