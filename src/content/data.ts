/**
 * Typed access to the content generated from website-content/ by
 * scripts/build-content.mjs (blog, solutions, locations, legal, sitemap).
 */
import blogJson from './generated/blog.json'
import solutionsJson from './generated/solutions.json'
import locationsJson from './generated/locations.json'
import legalJson from './generated/legal.json'
import sitemapJson from './generated/sitemap.json'

/* ---------------------------------------------------------------- blog */

export type Post = {
  slug: string
  title: string
  description: string
  dek: string
  category: string
  tags: string[]
  published: string
  updated: string
  displayDate: string
  author: string
  readTime: number
  wordCount: number
  cover: { alt: string; src: string } | null
  toc: { id: string; label: string }[]
  lede: string
  sections: { id: string; heading: string; markdown: string }[]
  faqHeading?: string
  faqs: { q: string; a: string }[]
  furtherHeading?: string
  furtherReading?: {
    journal: { label: string; href: string }[]
    sources: { label: string; domain?: string; href: string }[]
  }
  related: string[]
}

export const blogIndex = blogJson.index as {
  eyebrow: string
  h1: string
  intro: string
  chips: string[]
  featured: string
  order: string[]
  filters: { label: string; count: number }[]
  digest: { eyebrow: string; title: string; body: string; points: string[]; note: string }
}

export const posts = blogJson.posts as unknown as Post[]
export const postBySlug = (slug: string) => posts.find((p) => p.slug === slug)

/** Posts in the audited listing order (featured first). */
export const orderedPosts = (): Post[] => {
  const order = [blogIndex.featured, ...blogIndex.order]
  return order.map((s) => postBySlug(s)).filter(Boolean) as Post[]
}

/** Blog filter chips map onto post categories. */
export const BLOG_FILTERS: { label: string; categories: string[] }[] = [
  { label: 'All posts', categories: [] },
  { label: 'AI & Automation', categories: ['AI & Automation'] },
  { label: 'Web Dev', categories: ['Web Development'] },
  { label: 'Mobile', categories: ['Mobile Apps', 'Mobile'] },
  { label: 'CRM & ERP', categories: ['CRM & ERP'] },
  { label: 'Founder Notes', categories: ['Founder Notes'] },
  { label: 'Compare & Alternatives', categories: ['Compare & Alternatives'] },
]

/* ----------------------------------------------------------- solutions */

export type Solution = {
  slug: string
  crumb: string
  eyebrow: string
  h1: string
  productName: string
  promise: string
  intro: string
  whatsapp: string
  heroBullets: string[]
  label: string
  summary: string
  group: string
  challenges: { eyebrow: string; title: string; intro: string; items: { title: string; body: string }[] }
  overview: { eyebrow: string; title: string; paragraphs: string[]; whoFor: string[]; integrations: string[] }
  features: { eyebrow: string; title: string; intro: string; items: { n: string; title: string; body: string }[] }
  modules: { eyebrow: string; title: string; intro: string; items: string[] }
  benefits: { eyebrow: string; title: string; items: { title: string; body: string }[] }
  why: {
    eyebrow: string
    title: string
    intro: string
    items: { title: string; body: string }[]
    process: { step: number; title: string; body: string }[]
  }
  faq: { eyebrow: string; title: string; items: { q: string; a: string }[] }
  related: string[]
}

export const solutionsIndex = solutionsJson.index as {
  eyebrow: string
  h1: string
  intro: string
  cta: string
  groups: { title: string; intro: string; items: { label: string; summary: string; slug?: string; href?: string }[] }[]
}

export const solutions = solutionsJson.solutions as unknown as Solution[]
export const solutionBySlug = (slug: string) => solutions.find((s) => s.slug === slug)

/* ----------------------------------------------------------- locations */

export type LocationPage = {
  slug: string
  eyebrow: string
  h1: string
  intro: string
  primaryCta: string
  stats: { value: string; label: string }[]
  story: { eyebrow: string | null; title: string; paragraphs: string[] }
  reasons: { eyebrow: string; title: string; items: { title: string; body: string }[] }
  reviews: { eyebrow: string; title: string; items: { quote: string; name: string; localGuide: boolean }[] }
  comparison: { eyebrow: string; title: string; intro: string | null; table: { head: string[]; rows: string[][] } | null }
  services: { eyebrow: string; title: string; intro: string | null; items: { title: string; body: string; price: string }[] }
  industries: { eyebrow: string; title: string; intro: string | null; items: string[]; coverage: string }
  process: { eyebrow: string; title: string; intro: string | null; steps: { n: string; title: string; body: string }[] }
  stack: { eyebrow: string; title: string; items: { label: string; href: string | null }[] } | null
  office: { eyebrow: string; title: string; intro: string; lines: string[] }
  faq: { eyebrow: string; title: string; items: { q: string; a: string }[]; still: { title: string; body: string; cta: string } | null }
  more: { eyebrow: string; title: string; links: { label: string; href: string | null }[] }
  resources: { eyebrow: string; title: string; links: { label: string; href: string | null }[] } | null
}

/** A section "intro" is only prose — drop values that are actually a table, list or step block. */
const prose = (s: string | null | undefined) => (s && !/^(\||- |\d+\. )/.test(s.trim()) ? s : null)

/** Story eyebrows (the short line above each page's story heading, verbatim). */
const STORY_EYEBROW: Record<string, string> = {
  'mobile-app-development-company-in-ahmedabad': 'Built in Ahmedabad. Shipped worldwide.',
  'odoo-implementation-company-in-ahmedabad': 'Built in Ahmedabad. Trusted across Gujarat.',
  'software-development-company-in-ahmedabad': 'Built in Ahmedabad. Trusted across Gujarat.',
  'web-development-company-in-ahmedabad': 'Built in Ahmedabad. Trusted across Gujarat.',
}

export const locations: LocationPage[] = (locationsJson as unknown as LocationPage[]).map((l) => ({
  ...l,
  story: { ...l.story, eyebrow: l.story.eyebrow ?? STORY_EYEBROW[l.slug] ?? null },
  comparison: { ...l.comparison, intro: prose(l.comparison.intro) },
  services: { ...l.services, intro: prose(l.services.intro) },
  industries: { ...l.industries, intro: prose(l.industries.intro) },
  process: { ...l.process, intro: prose(l.process.intro) },
}))
export const locationBySlug = (slug: string) => locations.find((l) => l.slug === slug)

/* --------------------------------------------------------------- legal */

export type LegalBlock =
  | { type: 'p' | 'h3'; text: string }
  | { type: 'list' | 'checks'; items: string[] }
  | { type: 'numbered'; items: { n: string; title: string; body: string }[] }
  | { type: 'terms' | 'kv'; items: { term: string; def: string }[] }

export type LegalPage = {
  eyebrow: string
  h1: string
  intro: string
  updated?: string
  sections: { n: string; title: string; blocks: LegalBlock[] }[]
  links: { label: string; href: string }[]
}

export const legal = legalJson as unknown as Record<'privacy-policy' | 'terms-and-conditions' | 'refund-policy', LegalPage>

/* ------------------------------------------------------------- sitemap */

export const sitemapEntries = sitemapJson as {
  route: string
  lastModified: string | null
  changeFrequency: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'always' | 'hourly' | 'never'
  priority: number
}[]
