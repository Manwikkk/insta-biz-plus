import generated from './generated/portfolio.json'

/** Portfolio — verbatim from website-content/portfolio/portfolio.md (projects parsed into generated/portfolio.json). */

export type Filter = 'Web' | 'Mobile' | 'AI & Automation' | 'CRM & ERP' | 'Marketing' | 'Extensions'

export type Project = {
  name: string
  category: string
  image: string
  tag: string
  tagline: string
  description: string
  ctaLabel: string
  href: string | null
  filter: Filter
  slug: string
}

/**
 * Filter membership. The live filter counts (Web 7, Mobile 1, AI & Automation 4,
 * CRM & ERP 2, Marketing 1, Extensions 1) follow each project's published category.
 */
const FILTER_BY_CATEGORY: Record<string, Filter> = {
  'Ecommerce Platform': 'Web',
  'Mobile Application': 'Mobile',
  'Automation Tool': 'AI & Automation',
  'Dialer Platform': 'AI & Automation',
  'AI Calling Agent': 'AI & Automation',
  'AI Platform': 'AI & Automation',
  'Real Estate Platform': 'Web',
  'Property Marketplace': 'Web',
  'Tender Platform': 'Web',
  'Directory Platform': 'Web',
  'Web Application': 'Web',
  'CRM Solution': 'CRM & ERP',
  'Desktop Application': 'CRM & ERP',
  'Browser Extension': 'Extensions',
  'Marketing Service': 'Marketing',
}

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

export const projects: Project[] = (generated.projects as Omit<Project, 'filter' | 'slug'>[]).map((p) => ({
  ...p,
  href: p.href ? p.href.replace('https://www.instabizweb.com', '') : null,
  filter: FILTER_BY_CATEGORY[p.category] ?? 'Web',
  slug: slugify(p.name),
}))

export const filters: { label: 'All Work' | Filter; count: number }[] = generated.filters as never

export const featured = generated.featured as { name: string; category: string; note: string }[]

export const portfolioPage = {
  chips: ['100+ projects', '4.9★ avg rating', '5 countries', '16 product lines'],
  tag: 'Portfolio',
  tagNote: 'Real products. Real founders. Real outcomes.',
  h1: 'Work we’re proud to show. Results that speak.',
  intro:
    'Six years. 100+ products shipped. From homegrown ride-hailing apps to AI calling agents - every project below was built end-to-end by our team, with the founders we still work with today.',
  primary: 'Browse all work',
  secondary: 'Start your project',
  spotlight: {
    eyebrow: 'Featured spotlight',
    title: 'The work we keep talking about',
    intro: 'A few standout builds - the ones that reshaped a market, hit unusual scale, or simply made us proud.',
  },
  all: {
    eyebrow: 'All work',
    title: 'Filter by what you’re building',
    intro: 'Click through anything below - each project links to the live product or store listing.',
  },
  close: {
    status: 'Currently taking 2 new projects this month',
    title: 'Your project, next on this page.',
    body: 'Every product you scrolled past started with a single founder and a single message. Send us yours - we’ll come back within 2 hours with timeline, scope, and an honest price.',
    primary: 'Start your project',
    secondary: 'Explore services',
    call: { title: 'Free strategy call', note: '30 minutes · zero pitch' },
    email: { title: 'info@instabizweb.com', note: 'Reply within 2 hours' },
    whatsapp: { title: 'WhatsApp us', note: '+91 98981 24987' },
  },
}
