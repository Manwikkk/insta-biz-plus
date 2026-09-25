import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/seo'
import { sitemapEntries } from '@/content/data'

/** Same 60 URLs, order, change frequencies and priorities as the audited sitemap. */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  return sitemapEntries.map((e) => ({
    url: e.route === '/' ? `${SITE_URL}/` : `${SITE_URL}${e.route}`,
    lastModified: e.lastModified ? new Date(e.lastModified) : now,
    changeFrequency: e.changeFrequency,
    priority: e.priority,
  }))
}
