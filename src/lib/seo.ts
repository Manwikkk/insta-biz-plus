import type { Metadata } from 'next'
import seoData from '@/content/generated/seo.json'

/**
 * SEO foundation (read-only).
 *
 * Every value below comes from the audited site: seo.json is generated from the
 * recorded <head> of each live page and cross-checked against
 * website-content/seo-content-inventory.md, whose wording wins (it carries the site's
 * own edits, e.g. the retired Digital Marketing and UI/UX services). Pages call
 * buildMetadata(route) and never hand-write titles, descriptions, canonicals, robots,
 * OG or Twitter tags.
 */

export const SITE_URL = 'https://www.instabizweb.com'

type OgImage = { url: string; width?: number; height?: number; alt?: string; type?: string }
export type SeoEntry = {
  title: string
  description: string
  applicationName: string
  author: string
  authorUrl: string | null
  keywords: string | null
  creator: string
  publisher: string
  robots: string
  googlebot?: string
  category: string
  themeColor: string
  canonical: string
  icon: { href: string; sizes?: string; type?: string } | null
  og: {
    title: string
    description: string
    url: string
    siteName: string
    locale: string
    type: string
    images: OgImage[]
    publishedTime: string | null
    modifiedTime: string | null
    authors: string[]
    tags: string[]
  }
  twitter: {
    card: string
    site: string
    creator: string | null
    title: string
    description: string
    images: OgImage[]
  }
  h1: string | null
  jsonLd: Array<Record<string, unknown>>
}

const DATA = seoData as unknown as Record<string, SeoEntry>

export function seoFor(route: string): SeoEntry {
  const entry = DATA[route]
  if (!entry) throw new Error(`No audited SEO entry for route "${route}"`)
  return entry
}

export function allSeoRoutes(): string[] {
  return Object.keys(DATA)
}

/** "https://www.instabizweb.com/services" → "/services" (resolved against metadataBase). */
function rel(url: string): string {
  if (!url) return url
  if (url.startsWith(SITE_URL)) {
    const rest = url.slice(SITE_URL.length)
    return rest === '' ? '/' : rest
  }
  return url
}

function parseRobots(robots: string, googlebot?: string): Metadata['robots'] {
  const flags = (s: string) => s.split(',').map((x) => x.trim())
  const base = flags(robots)
  const out: NonNullable<Metadata['robots']> & Record<string, unknown> = {
    index: base.includes('index'),
    follow: base.includes('follow'),
  }
  if (googlebot) {
    const g = flags(googlebot)
    const gb: Record<string, unknown> = { index: g.includes('index'), follow: g.includes('follow') }
    for (const f of g) {
      const [k, v] = f.split(':')
      if (v === undefined) continue
      gb[k] = /^-?\d+$/.test(v) ? Number(v) : v
    }
    ;(out as Record<string, unknown>).googleBot = gb
  }
  return out
}

type BuildOptions = {
  /** The route provides an opengraph-image file; let the file convention emit og/twitter image tags. */
  fileOgImage?: boolean
}

export function buildMetadata(route: string, options: BuildOptions = {}): Metadata {
  const e = seoFor(route)
  const og = e.og
  const tw = e.twitter
  const isArticle = og.type === 'article'

  const openGraph: NonNullable<Metadata['openGraph']> & Record<string, unknown> = {
    title: og.title,
    description: og.description,
    url: rel(og.url),
    siteName: og.siteName,
    locale: og.locale,
    type: isArticle ? 'article' : 'website',
  }
  if (!options.fileOgImage && og.images.length) {
    openGraph.images = og.images.map((i) => ({
      url: i.url,
      ...(i.width ? { width: i.width } : {}),
      ...(i.height ? { height: i.height } : {}),
      ...(i.alt ? { alt: i.alt } : {}),
      ...(i.type ? { type: i.type } : {}),
    }))
  }
  if (isArticle) {
    Object.assign(openGraph, {
      ...(og.publishedTime ? { publishedTime: og.publishedTime } : {}),
      ...(og.modifiedTime ? { modifiedTime: og.modifiedTime } : {}),
      ...(og.authors.length ? { authors: og.authors } : {}),
      ...(og.tags.length ? { tags: og.tags } : {}),
    })
  }

  const twitter: NonNullable<Metadata['twitter']> & Record<string, unknown> = {
    card: tw.card as 'summary_large_image',
    site: tw.site,
    title: tw.title,
    description: tw.description,
  }
  if (tw.creator) twitter.creator = tw.creator
  if (!options.fileOgImage && tw.images.length) twitter.images = tw.images.map((i) => i.url)

  return {
    title: { absolute: e.title },
    description: e.description,
    applicationName: e.applicationName,
    authors: [{ name: e.author, ...(e.authorUrl ? { url: e.authorUrl } : {}) }],
    ...(e.keywords ? { keywords: e.keywords.split(',') } : {}),
    creator: e.creator,
    publisher: e.publisher,
    robots: parseRobots(e.robots, e.googlebot),
    category: e.category,
    alternates: { canonical: rel(e.canonical) },
    openGraph,
    twitter,
  }
}

/** The two site-wide JSON-LD objects (organisation + website) are emitted in the root layout <head>. */
export function siteJsonLd(): Array<Record<string, unknown>> {
  return seoFor('/').jsonLd.slice(0, 2)
}

/** Page-level JSON-LD (everything after the two site-wide objects), rendered in the page body. */
export function pageJsonLd(route: string): Array<Record<string, unknown>> {
  const all = seoFor(route).jsonLd
  const [org, site, ...rest] = all
  const shared = siteJsonLd()
  if (JSON.stringify(org) !== JSON.stringify(shared[0]) || JSON.stringify(site) !== JSON.stringify(shared[1])) {
    // Should never happen with the audited data; fall back to emitting everything for this page.
    return all
  }
  return rest
}
