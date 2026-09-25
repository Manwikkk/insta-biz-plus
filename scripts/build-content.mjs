#!/usr/bin/env node
/**
 * Content pipeline.
 *
 * Reads the audited content repository in ./website-content (source of truth for
 * words, facts, links and structured data) and — when present — the recorded page
 * heads in ./.firecrawl/html (source of truth for the exact <meta>/<link> tags the
 * live site emits). Writes typed JSON into src/content/generated/.
 *
 * Nothing here fetches the network. Re-run with `npm run content`.
 */
import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const CONTENT = path.join(ROOT, 'website-content')
const RAW = path.join(ROOT, '.firecrawl', 'html')
const OUT = path.join(ROOT, 'src', 'content', 'generated')
const ORIGIN = 'https://www.instabizweb.com'

fs.mkdirSync(OUT, { recursive: true })

const read = (rel) => fs.readFileSync(path.join(CONTENT, rel), 'utf8').replace(/\r\n/g, '\n')
const write = (name, data) => {
  fs.writeFileSync(path.join(OUT, name), JSON.stringify(data, null, 2) + '\n')
}
const warnings = []
const warn = (msg) => warnings.push(msg)

/* ------------------------------------------------------------------ */
/* Entities                                                            */
/* ------------------------------------------------------------------ */
const NAMED = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', rsquo: '’', lsquo: '‘',
  rdquo: '”', ldquo: '“', hellip: '…', mdash: '—', ndash: '–', middot: '·', rarr: '→', larr: '←',
  times: '×', trade: '™', copy: '©', reg: '®', deg: '°', bull: '•', minus: '−', laquo: '«',
  raquo: '»', eacute: 'é', egrave: 'è', uuml: 'ü', ouml: 'ö', auml: 'ä', star: '★',
}
function decode(input) {
  if (typeof input !== 'string') return input
  let s = input
  let prev
  do {
    prev = s
    s = s.replace(/&(#x[0-9a-f]+|#\d+|[a-z][a-z0-9]*);/gi, (m, e) => {
      if (e[0] === '#') {
        const cp = e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10)
        return Number.isFinite(cp) ? String.fromCodePoint(cp) : m
      }
      return NAMED[e] ?? NAMED[e.toLowerCase()] ?? m
    })
  } while (s !== prev)
  return s
}

/* ------------------------------------------------------------------ */
/* Markdown file anatomy                                               */
/* ------------------------------------------------------------------ */
const TOP_SECTIONS = [
  'Page Information', 'Main Content', 'FAQs', 'Calls to Action', 'Forms', 'Media Content',
  'Internal Links', 'External Links', 'Shared site chrome', 'Additional Metadata', 'Structured Data',
]

/** Split a content file into its audited top-level sections. */
function anatomy(md) {
  const lines = md.split('\n')
  const out = { title: (lines[0] || '').replace(/^#\s+/, '') }
  // Locate top-level markers. "## FAQs" only counts when it comes after Main Content and
  // is followed by "### " questions (the audited FAQ appendix), otherwise it is page copy.
  const marks = []
  let inMain = false
  lines.forEach((line, i) => {
    const m = line.match(/^## (.+)$/)
    if (!m) return
    const name = m[1].trim()
    if (!TOP_SECTIONS.includes(name)) return
    if (name === 'Main Content') inMain = true
    if (name === 'FAQs') {
      const next = lines.slice(i + 1).find((l) => l.trim())
      if (!inMain || !next || !next.startsWith('### ')) return
    }
    if (name === 'Page Information' && inMain) return
    marks.push({ name, i })
  })
  marks.forEach((mk, idx) => {
    const end = idx + 1 < marks.length ? marks[idx + 1].i : lines.length
    out[mk.name] = lines.slice(mk.i + 1, end).join('\n').trim()
  })
  return out
}

function pageInfo(text = '') {
  const info = {}
  for (const line of text.split('\n')) {
    const m = line.match(/^- ([^:]+):\s?(.*)$/)
    if (m) info[m[1].trim()] = m[2].trim()
  }
  return info
}

function structuredData(text = '') {
  const m = text.match(/```json\n([\s\S]*?)\n```/)
  if (!m) return []
  try {
    return JSON.parse(m[1])
  } catch (e) {
    warn('Structured data JSON failed to parse: ' + e.message)
    return []
  }
}

function additionalMeta(text = '') {
  const meta = {}
  for (const line of text.split('\n')) {
    const m = line.match(/^- ([^:]+):\s?(.*)$/)
    if (m) meta[m[1].trim()] = m[2].trim()
  }
  return meta
}

/* ------------------------------------------------------------------ */
/* Generic block parsing (page copy → blocks)                          */
/* ------------------------------------------------------------------ */
const IMG_RE = /^\[Image: ([^\]]*)\]\(([^)]+)\)$/

/** Turn absolute same-site URLs into root-relative paths. Keeps hashes. */
function localHref(url) {
  if (!url) return url
  if (url.startsWith(ORIGIN)) {
    const rest = url.slice(ORIGIN.length)
    return rest === '' ? '/' : rest
  }
  return url
}
function localizeMarkdown(md) {
  return md.replace(/\]\((https:\/\/www\.instabizweb\.com)([^)\s]*)\)/g, (_, _o, rest) => `](${rest || '/'})`)
}

/** Split main copy into sections at "## " headings; the short line right above a heading is its eyebrow. */
function sections(main) {
  const lines = main.split('\n')
  const secs = []
  let current = { eyebrow: null, title: null, lines: [] }
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const h = line.match(/^## (.+)$/)
    if (h) {
      // pull eyebrow from the tail of the current section
      let j = current.lines.length - 1
      while (j >= 0 && !current.lines[j].trim()) j--
      let eyebrow = null
      if (j >= 0) {
        const cand = current.lines[j].trim()
        const isStructural = /^(- |\d+\. |\||#|\[|!\[)/.test(cand)
        if (!isStructural && cand.length <= 90 && !/[.:]$/.test(cand)) {
          eyebrow = cand
          current.lines.splice(j, 1)
        }
      }
      secs.push(current)
      current = { eyebrow, title: h[1].trim(), lines: [] }
      continue
    }
    current.lines.push(line)
  }
  secs.push(current)
  return secs.map((s) => ({ eyebrow: s.eyebrow, title: s.title, body: s.lines.join('\n').trim() }))
}

/** Paragraph groups separated by blank lines. */
function paras(body) {
  return body
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
}

/** Items introduced by "### Title" followed by text until the next "###". */
function h3Items(body) {
  const items = []
  let cur = null
  for (const line of body.split('\n')) {
    const m = line.match(/^#{3,4} (.+)$/)
    if (m) {
      if (cur) items.push(cur)
      cur = { title: m[1].replace(/\*\*/g, '').trim(), lines: [] }
      continue
    }
    if (cur) cur.lines.push(line)
  }
  if (cur) items.push(cur)
  return items.map((it) => ({ title: it.title, body: it.lines.join('\n').trim() }))
}

function bullets(body) {
  return body
    .split('\n')
    .filter((l) => /^- /.test(l))
    .map((l) => l.replace(/^- /, '').trim())
}

function linkList(body) {
  return bullets(body).map((b) => {
    const m = b.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
    return m ? { label: m[1], href: localHref(m[2]) } : { label: b, href: null }
  })
}

function table(body) {
  const rows = body.split('\n').filter((l) => /^\|/.test(l.trim()))
  if (rows.length < 2) return null
  const cells = (r) => r.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim())
  const head = cells(rows[0])
  const bodyRows = rows.slice(2).map(cells)
  return { head, rows: bodyRows }
}

/* ------------------------------------------------------------------ */
/* SEO: exact head tags from recorded HTML                             */
/* ------------------------------------------------------------------ */
function attrs(tag) {
  const out = {}
  for (const m of tag.matchAll(/([a-zA-Z_:][-a-zA-Z0-9_:.]*)="([^"]*)"/g)) out[m[1]] = m[2]
  return out
}

function rawFileFor(route) {
  if (route === '/') return path.join(RAW, 'index.html')
  return path.join(RAW, route.replace(/^\//, '') + '.html')
}

function headFromRaw(route) {
  const file = rawFileFor(route)
  if (!fs.existsSync(file)) return null
  const html = fs.readFileSync(file, 'utf8')
  const head = html.slice(0, html.indexOf('</head>'))
  const title = decode((head.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || '')
  const metas = [...head.matchAll(/<meta\s[^>]*>/g)].map((m) => attrs(m[0]))
  const links = [...head.matchAll(/<link\s[^>]*>/g)].map((m) => attrs(m[0]))
  const get = (key, attr = 'name') => metas.filter((m) => m[attr] === key).map((m) => decode(m.content))
  const one = (key, attr = 'name') => get(key, attr)[0]

  const ogImages = []
  let curImg = null
  for (const m of metas) {
    const p = m.property
    if (!p || !p.startsWith('og:image')) continue
    if (p === 'og:image' || p === 'og:image:url') {
      curImg = { url: decode(m.content) }
      ogImages.push(curImg)
    } else if (curImg) {
      const k = p.replace('og:image:', '')
      curImg[k] = /^(width|height)$/.test(k) ? Number(m.content) : decode(m.content)
    }
  }
  const twImages = []
  let curTw = null
  for (const m of metas) {
    const n = m.name
    if (!n || !n.startsWith('twitter:image')) continue
    if (n === 'twitter:image') {
      curTw = { url: decode(m.content) }
      twImages.push(curTw)
    } else if (curTw) {
      const k = n.replace('twitter:image:', '')
      curTw[k] = /^(width|height)$/.test(k) ? Number(m.content) : decode(m.content)
    }
  }
  const canonical = links.find((l) => l.rel === 'canonical')?.href
  const authorLink = links.find((l) => l.rel === 'author')?.href
  const icon = links.find((l) => l.rel === 'icon')

  return {
    title,
    description: one('description'),
    applicationName: one('application-name'),
    author: one('author'),
    authorUrl: authorLink || null,
    keywords: one('keywords') || null,
    creator: one('creator'),
    publisher: one('publisher'),
    robots: one('robots'),
    googlebot: one('googlebot'),
    category: one('category'),
    themeColor: one('theme-color'),
    canonical,
    icon: icon ? { href: icon.href.replace(/\?.*$/, ''), sizes: icon.sizes, type: icon.type } : null,
    og: {
      title: one('og:title', 'property'),
      description: one('og:description', 'property'),
      url: one('og:url', 'property'),
      siteName: one('og:site_name', 'property'),
      locale: one('og:locale', 'property'),
      type: one('og:type', 'property'),
      images: ogImages,
      publishedTime: one('article:published_time', 'property') || null,
      modifiedTime: one('article:modified_time', 'property') || null,
      authors: get('article:author', 'property'),
      tags: get('article:tag', 'property'),
    },
    twitter: {
      card: one('twitter:card'),
      site: one('twitter:site'),
      creator: one('twitter:creator') || null,
      title: one('twitter:title'),
      description: one('twitter:description'),
      images: twImages,
    },
  }
}

/**
 * Heading dictionary for a route, taken from the recorded HTML. The audited markdown
 * flattens some "### Title Body" pairs onto one line; the recorded headings tell us
 * exactly where each title ends. Only used to find boundaries — never as copy.
 */
const headingCache = {}
function headingDict(route) {
  if (headingCache[route]) return headingCache[route]
  const file = rawFileFor(route)
  const set = new Set()
  if (fs.existsSync(file)) {
    const html = fs.readFileSync(file, 'utf8')
    for (const m of html.matchAll(/<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/g)) {
      const text = decode(m[1].replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim()
      if (text) set.add(text)
    }
  }
  return (headingCache[route] = [...set].sort((a, b) => b.length - a.length))
}
/** Split "Title Body…" using the heading dictionary; falls back to the first capitalised word. */
function splitTitle(route, text) {
  const t = text.trim()
  const hit = headingDict(route).find((h) => t === h || t.startsWith(h + ' '))
  if (hit) return { title: hit, body: t.slice(hit.length).trim() }
  const m = t.match(/^(.+?) ([A-Z].*)$/)
  if (m) warn(`splitTitle fallback on ${route}: "${t.slice(0, 60)}…"`)
  return m ? { title: m[1], body: m[2] } : { title: t, body: '' }
}

/* ------------------------------------------------------------------ */
/* Inventory (audited SEO table) — used to verify / override text      */
/* ------------------------------------------------------------------ */
function seoInventory() {
  const md = read('seo-content-inventory.md')
  const rows = md.split('\n').filter((l) => l.startsWith('| https://'))
  const map = {}
  for (const r of rows) {
    const c = r
      .replace(/\\\|/g, '\u0000')
      .split('|')
      .slice(1, -1)
      .map((x) => x.replace(/\u0000/g, '|').trim())
    const [url, metaTitle, metaDescription, h1, canonical, robots, ogTitle, ogDescription, twitterTitle] = c
    const route = localHref(url)
    map[route] = { metaTitle, metaDescription, h1, canonical, robots, ogTitle, ogDescription, twitterTitle }
  }
  return map
}

/* ------------------------------------------------------------------ */
/* Route inventory (sitemap order, priorities)                         */
/* ------------------------------------------------------------------ */
function sitemapEntries() {
  const file = path.join(ROOT, '.firecrawl', 'sitemap.xml')
  const out = []
  if (!fs.existsSync(file)) return out
  const s = fs.readFileSync(file, 'utf8')
  const re = /<url>\s*<loc>([^<]+)<\/loc>\s*<lastmod>([^<]+)<\/lastmod>\s*<changefreq>([^<]+)<\/changefreq>\s*<priority>([^<]+)<\/priority>\s*<\/url>/g
  let m
  while ((m = re.exec(s))) {
    const route = localHref(m[1])
    if (!served(route)) continue
    const isBlogPost = route.startsWith('/blogs/')
    out.push({
      route,
      // Static pages were stamped with the generation time on the live site; blog posts use their publish date.
      lastModified: isBlogPost ? m[2] : null,
      changeFrequency: m[3],
      priority: Number(m[4]),
    })
  }
  return out
}

/* ------------------------------------------------------------------ */
/* Pages → files                                                       */
/* ------------------------------------------------------------------ */
const FILES = {
  '/': 'homepage.md',
  '/services': 'services/index.md',
  '/services/ai-agent-development': 'services/ai-agent-development.md',
  '/solutions': 'solutions/index.md',
  '/portfolio': 'portfolio/portfolio.md',
  '/about-us': 'about/about-us.md',
  '/contact-us': 'contact/contact-us.md',
  '/blogs': 'blog/index.md',
  '/privacy-policy': 'legal/privacy-policy.md',
  '/terms-and-conditions': 'legal/terms-and-conditions.md',
  '/refund-policy': 'legal/refund-policy.md',
}
for (const f of fs.readdirSync(path.join(CONTENT, 'locations'))) {
  FILES['/' + f.replace(/\.md$/, '')] = 'locations/' + f
}
for (const f of fs.readdirSync(path.join(CONTENT, 'solutions'))) {
  if (f === 'index.md') continue
  FILES['/solutions/' + f.replace(/\.md$/, '')] = 'solutions/' + f
}
for (const f of fs.readdirSync(path.join(CONTENT, 'blog'))) {
  if (f === 'index.md') continue
  FILES['/blogs/' + f.replace(/\.md$/, '')] = 'blog/' + f
}

const anatomyCache = {}
const docFor = (route) => (anatomyCache[route] ??= anatomy(read(FILES[route])))

/**
 * Whether an internal link still leads to a page. Pages for services that are no longer
 * offered (Digital Marketing, UI/UX Design) were removed and redirect (next.config.ts);
 * link lists drop them rather than point visitors at a redirect.
 */
const served = (href) => !href || !href.startsWith('/') || (href.split(/[?#]/)[0] || '/') in FILES

/* ------------------------------------------------------------------ */
/* 1. SEO map                                                          */
/* ------------------------------------------------------------------ */
const inventory = seoInventory()
const seo = {}
for (const route of Object.keys(FILES)) {
  const doc = docFor(route)
  const info = pageInfo(doc['Page Information'])
  const extra = additionalMeta(doc['Additional Metadata'])
  const jsonLd = structuredData(doc['Structured Data'])
  const head = headFromRaw(route)
  const inv = inventory[route]
  if (!inv) warn(`No inventory row for ${route}`)

  let entry
  if (head) {
    entry = head
  } else {
    // Fallback to the audited markdown when the recorded HTML is unavailable.
    entry = {
      title: info['Meta Title'],
      description: info['Meta Description'],
      applicationName: 'Insta Biz Web',
      author: info['Author meta'] || 'Insta Biz Web',
      authorUrl: route.startsWith('/blogs/') ? null : ORIGIN,
      keywords: null,
      creator: 'Insta Biz Web',
      publisher: 'Insta Biz Web',
      robots: info['Robots'],
      googlebot: extra['Googlebot'],
      category: 'technology',
      themeColor: '#182234',
      canonical: info['Canonical URL'],
      icon: { href: '/favicon.ico', sizes: '256x256', type: 'image/x-icon' },
      og: {
        title: extra['Open Graph title'],
        description: extra['Open Graph description'],
        url: extra['Open Graph URL'],
        siteName: extra['Open Graph site name'],
        locale: extra['Open Graph locale'],
        type: extra['Open Graph type'],
        images: extra['Open Graph image'] ? [{ url: extra['Open Graph image'], alt: extra['Open Graph image alt'] }] : [],
        publishedTime: info['Published'] || null,
        modifiedTime: info['Updated'] || null,
        authors: info['Article author'] ? [info['Article author']] : [],
        tags: info['Tags'] ? info['Tags'].split(',').map((t) => t.trim()) : [],
      },
      twitter: {
        card: extra['Twitter card'],
        site: extra['Twitter site'],
        creator: extra['Twitter creator'] || null,
        title: extra['Twitter title'],
        description: extra['Twitter description'],
        images: extra['Twitter image'] ? [{ url: extra['Twitter image'] }] : [],
      },
    }
    warn(`Recorded HTML head missing for ${route}; using markdown metadata`)
  }

  // Cross-check with the audited inventory; the inventory wins on text so that no
  // double-escaped entity (e.g. "&rsquo;") leaks into a title or description.
  if (inv) {
    const pairs = [
      ['title', 'metaTitle'],
      ['description', 'metaDescription'],
    ]
    for (const [k, ik] of pairs) {
      if (inv[ik] && entry[k] !== inv[ik]) {
        warn(`SEO ${route} ${k} differs from inventory → using inventory\n   html: ${entry[k]}\n   inv:  ${inv[ik]}`)
        entry[k] = inv[ik]
      }
    }
    if (inv.ogTitle && entry.og.title !== inv.ogTitle) {
      warn(`SEO ${route} og:title differs from inventory → using inventory`)
      entry.og.title = inv.ogTitle
    }
    if (inv.ogDescription && entry.og.description !== inv.ogDescription) {
      warn(`SEO ${route} og:description differs → using inventory`)
      entry.og.description = inv.ogDescription
    }
    if (inv.twitterTitle && entry.twitter.title !== inv.twitterTitle) {
      warn(`SEO ${route} twitter:title differs → using inventory`)
      entry.twitter.title = inv.twitterTitle
    }
  }
  // twitter:description is not in the inventory table; the markdown metadata is decoded text.
  if (extra['Twitter description'] && entry.twitter.description !== extra['Twitter description']) {
    entry.twitter.description = extra['Twitter description']
  }
  entry.h1 = inv?.h1 ?? null
  entry.jsonLd = jsonLd
  seo[route] = entry
}
write('seo.json', seo)
write('sitemap.json', sitemapEntries())

/* ------------------------------------------------------------------ */
/* 2. Blog                                                             */
/* ------------------------------------------------------------------ */
const MONTHS = { January: 1, February: 2, March: 3, April: 4, May: 5, June: 6, July: 7, August: 8, September: 9, October: 10, November: 11, December: 12 }

function parsePost(route) {
  const slug = route.replace('/blogs/', '')
  const doc = docFor(route)
  const info = pageInfo(doc['Page Information'])
  const ld = structuredData(doc['Structured Data'])
  const main = doc['Main Content']
  const lines = main.split('\n')

  const h1Idx = lines.findIndex((l) => l.startsWith('# '))
  const title = lines[h1Idx].replace(/^# /, '').trim()
  const after = lines.slice(h1Idx + 1)
  const nonEmpty = after.filter((l) => l.trim())
  const dek = nonEmpty[0].trim()
  const byline = nonEmpty[1].trim()
  const readTime = (byline.match(/(\d+) min read/) || [])[1]
  const displayDate = (byline.match(/([A-Z][a-z]+ \d{1,2}, \d{4})/) || [])[1]
  const coverLine = nonEmpty.find((l) => IMG_RE.test(l.trim()))
  const cover = coverLine ? { alt: coverLine.match(IMG_RE)[1], src: coverLine.match(IMG_RE)[2] } : null

  const tocStart = main.indexOf('\nOn this page\n')
  const tocEndMatch = main.match(/\nOn this page \((\d+)\)\n/)
  const tocBlock = main.slice(tocStart, tocEndMatch.index)
  const toc = [...tocBlock.matchAll(/- \[([^\]]+)\]\([^#)]+#([^)]+)\)/g)].map((m) => ({ id: m[2], label: m[1] }))

  const bodyStart = tocEndMatch.index + tocEndMatch[0].length
  const faqIdx = main.indexOf('\nFAQs\n', bodyStart)
  const bodyRaw = main.slice(bodyStart, faqIdx).trim()

  // Split body into lede + sections using TOC ids in order.
  const bodyLines = bodyRaw.split('\n')
  const bodySections = []
  let lede = []
  let cur = null
  let h2Count = 0
  for (const line of bodyLines) {
    const m = line.match(/^## (.+)$/)
    if (m) {
      if (cur) bodySections.push(cur)
      const id = toc[h2Count]?.id || `section-${h2Count + 1}`
      h2Count++
      cur = { id, heading: m[1].trim(), lines: [] }
      continue
    }
    if (cur) cur.lines.push(line)
    else lede.push(line)
  }
  if (cur) bodySections.push(cur)
  const sectionsOut = bodySections.map((s) => ({ id: s.id, heading: s.heading, markdown: localizeMarkdown(s.lines.join('\n').trim()) }))

  // FAQs: full answers live in the FAQPage structured data.
  const faqLd = ld.find((x) => x['@type'] === 'FAQPage')
  const faqs = faqLd ? faqLd.mainEntity.map((q) => ({ q: decode(q.name), a: decode(q.acceptedAnswer.text) })) : []
  const faqHeading = (main.slice(faqIdx).match(/\n## (.+)\n/) || [])[1] || 'Frequently asked questions'

  // Further reading
  const frIdx = main.indexOf('\nFurther reading\n')
  const taggedIdx = main.indexOf('\nTagged\n')
  const fr = main.slice(frIdx, taggedIdx)
  const grab = (label) => {
    const i = fr.indexOf('\n' + label + '\n')
    if (i < 0) return []
    const rest = fr.slice(i + label.length + 2)
    const stop = rest.search(/\n(From the IBW journal|Authoritative sources|Mentioned in)\n/)
    const chunk = stop >= 0 ? rest.slice(0, stop) : rest
    return linkList(chunk)
      .filter((l) => served(l.href))
      .map((l) => ({ ...l, label: l.label.replace(/^↩\s*/, '') }))
  }
  const journal = grab('From the IBW journal')
  const sources = grab('Authoritative sources').map((l) => {
    // "Odoo official site odoo.com" → name + domain
    const m = l.label.match(/^(.*)\s(\S+\.\S+)$/)
    return m ? { label: m[1], domain: m[2], href: l.href } : { label: l.label, domain: null, href: l.href }
  })
  const mentionedIn = grab('Mentioned in')
  const furtherHeading = (fr.match(/\n## (.+)\n/) || [])[1] || 'Keep going deeper'

  const tagLine = main.slice(taggedIdx).split('\n').find((l) => l.startsWith('# '))
  const tags = tagLine ? tagLine.replace(/^# /, '').split(/\s*#\s*/).map((t) => t.trim()).filter(Boolean) : []

  // Related "Read article" cards from internal links.
  const related = [...(doc['Internal Links'] || '').matchAll(/Read article: https:\/\/www\.instabizweb\.com\/blogs\/([a-z0-9-]+)/g)]
    .map((m) => m[1])
    .filter((s) => served(`/blogs/${s}`))

  const posting = ld.find((x) => x['@type'] === 'BlogPosting') || {}
  const [y, mo, d] = (info['Published'] || '').split('-').map(Number)
  const dateCheck = displayDate ? `${displayDate.split(' ')[2]}-${String(MONTHS[displayDate.split(' ')[0]]).padStart(2, '0')}-${displayDate.split(' ')[1].replace(',', '').padStart(2, '0')}` : null
  if (dateCheck && dateCheck !== info['Published']) warn(`Blog ${slug}: displayed date ${displayDate} ≠ published ${info['Published']}`)
  if (!y || !mo || !d) warn(`Blog ${slug}: missing published date`)

  return {
    slug,
    title,
    description: seo[route]?.description ?? info['Meta Description'],
    dek,
    category: info['Category'],
    tags: tags.length ? tags : (info['Tags'] || '').split(',').map((t) => t.trim()).filter(Boolean),
    published: info['Published'],
    updated: info['Updated'],
    displayDate,
    author: info['Article author'] || info['Author meta'] || 'IBW Team',
    readTime: readTime ? Number(readTime) : null,
    wordCount: posting.wordCount ?? null,
    cover,
    toc,
    lede: localizeMarkdown(lede.join('\n').trim()),
    sections: sectionsOut,
    faqHeading,
    faqs,
    furtherHeading,
    furtherReading: { journal, sources, mentionedIn },
    related,
  }
}

const postRoutes = Object.keys(FILES).filter((r) => r.startsWith('/blogs/'))
const posts = postRoutes.map(parsePost)

// Blog index: featured post, list order, categories.
const blogIndex = (() => {
  const doc = docFor('/blogs')
  const main = doc['Main Content']
  const featured = (main.match(/Featured this month[\s\S]*?\]\(https:\/\/www\.instabizweb\.com\/blogs\/([a-z0-9-]+)\)/) || [])[1]
  const listPart = main.slice(main.indexOf('Showing '))
  const order = [...listPart.matchAll(/\]\(https:\/\/www\.instabizweb\.com\/blogs\/([a-z0-9-]+)\)/g)]
    .map((m) => m[1])
    .filter((s) => served(`/blogs/${s}`))
  const filterLine = main.split('\n').find((l) => l.startsWith('All posts '))
  const filters = []
  if (filterLine) {
    for (const m of filterLine.matchAll(/([A-Za-z&][A-Za-z& ]*?)\s(\d+)(?=\s|$)/g)) filters.push({ label: m[1].trim(), count: Number(m[2]) })
  }
  const listReadTimes = {}
  for (const m of listPart.matchAll(/\s(\d+) min ### [^\n]*?\]\(https:\/\/www\.instabizweb\.com\/blogs\/([a-z0-9-]+)\)/g)) listReadTimes[m[2]] = Number(m[1])
  const featuredRead = (main.match(/(\d+) min read Read the full article/) || [])[1]
  if (featured && featuredRead) listReadTimes[featured] = Number(featuredRead)
  const chips = ['New posts monthly', '5-10 min reads', 'Real-world wins', 'Founder-friendly'].filter((c) => main.includes(c))
  const lines = main.split('\n').map((l) => l.trim()).filter(Boolean)
  const h1 = lines.find((l) => l.startsWith('# '))?.replace(/^# /, '')
  const intro = lines[lines.findIndex((l) => l.startsWith('# ')) + 1]
  const eyebrow = lines[lines.findIndex((l) => l.startsWith('# ')) - 1]
  const digestIdx = lines.findIndex((l) => l === 'Monthly digest')
  const digest = {
    eyebrow: 'Monthly digest',
    title: lines[digestIdx + 1]?.replace(/^## /, ''),
    body: lines[digestIdx + 2],
    points: lines.slice(digestIdx + 3, digestIdx + 6).map((l) => l.replace(/^- /, '')),
    note: lines.find((l) => l.startsWith('We’ll never share your email')),
  }
  return { eyebrow, h1, intro, chips, featured, order, filters, listReadTimes, digest }
})()

for (const p of posts) {
  const listRead = blogIndex.listReadTimes[p.slug]
  if (listRead && p.readTime && listRead !== p.readTime) warn(`Blog ${p.slug}: list read time ${listRead} ≠ article ${p.readTime}`)
}
// Keep the live listing order (featured first).
const orderedSlugs = [blogIndex.featured, ...blogIndex.order.filter((s) => s !== blogIndex.featured)]
posts.sort((a, b) => orderedSlugs.indexOf(a.slug) - orderedSlugs.indexOf(b.slug))
write('blog.json', { index: blogIndex, posts })

/* ------------------------------------------------------------------ */
/* 3. Solutions                                                        */
/* ------------------------------------------------------------------ */
const solutionsIndex = (() => {
  const doc = docFor('/solutions')
  const main = doc['Main Content']
  const groups = []
  for (const sec of sections(main)) {
    if (!sec.title || !/Software$/.test(sec.title)) continue
    const intro = paras(sec.body)[0]
    // Card text is "Label Summary." flattened; labels are the known short names used across the site.
    const LABELS = [
      'Manufacturing CRM', 'CA Practice CRM', 'Visa & Immigration CRM', 'Custom ERP Software', 'Real Estate CRM',
      'Education & Coaching CRM', 'Hospital & Clinic Software', 'Travel Agency CRM', 'Insurance Agency CRM',
      'Loan & DSA CRM', 'HRMS & Payroll', 'Inventory & Distribution',
    ]
    const items = [...sec.body.matchAll(/\[### ([^\]]+?)\]\(https:\/\/www\.instabizweb\.com\/solutions\/([a-z0-9-]+)\)/g)].map((m) => {
      const text = m[1].trim()
      const label = LABELS.find((l) => text.startsWith(l + ' '))
      if (!label) warn(`Solutions index: unknown label in "${text}"`)
      return { label: label ?? text, summary: label ? text.slice(label.length).trim() : '', slug: m[2] }
    })
    groups.push({ title: sec.title, intro, items })
  }
  const lines = main.split('\n').map((l) => l.trim()).filter(Boolean)
  const h1i = lines.findIndex((l) => l.startsWith('# '))
  return {
    eyebrow: lines[h1i - 1],
    h1: lines[h1i].replace(/^# /, ''),
    intro: lines[h1i + 1],
    cta: lines[h1i + 2],
    groups,
  }
})()

function parseSolution(route) {
  const slug = route.replace('/solutions/', '')
  const doc = docFor(route)
  const main = doc['Main Content']
  const secs = sections(main)
  const hero = secs[0]
  const heroLines = hero.body.split('\n').map((l) => l.trim()).filter(Boolean)
  const h1Line = heroLines.find((l) => l.startsWith('# ')).replace(/^# /, '')
  const h1i = heroLines.findIndex((l) => l.startsWith('# '))
  const eyebrow = heroLines[h1i - 1]
  const intro = heroLines[h1i + 1]
  const whatsapp = (heroLines[h1i + 2].match(/\((https:\/\/wa\.me[^)]+)\)/) || [])[1]
  const heroBullets = heroLines.slice(h1i + 3).filter((l) => l.startsWith('- ')).map((l) => l.replace(/^- /, ''))
  const crumb = (heroLines.find((l) => /^5\. /.test(l)) || '').replace(/^5\. /, '')

  // Split H1 into product name + promise using the SEO inventory H1 and the known product title.
  const byTitle = (t) => secs.find((s) => s.title && s.title.startsWith(t))
  const challengesSec = secs.find((s) => /^Challenges our/.test(s.title || ''))
  const overviewSec = secs.find((s) => / that fits your business$/.test(s.title || ''))
  const featuresSec = secs.find((s) => /^Key features of our/.test(s.title || ''))
  const modulesSec = byTitle('Pick the modules you need')
  const benefitsSec = byTitle('What changes after you switch')
  const whySec = secs.find((s) => /partner in India$/.test(s.title || ''))
  const faqSec = secs.find((s) => /your questions answered$/.test(s.title || ''))
  const relatedSec = byTitle('Related solutions')

  const productName = overviewSec.title.replace(/ that fits your business$/, '')
  const promise = h1Line.startsWith(productName) ? h1Line.slice(productName.length).trim() : ''
  if (!promise) warn(`Solution ${slug}: could not split H1 "${h1Line}"`)

  const challenges = h3Items(challengesSec.body).map((i) => ({ title: i.title, body: i.body }))
  const challengeIntro = paras(challengesSec.body)[0]

  const ov = overviewSec.body
  const ovParas = paras(ov.split(/\n### /)[0])
  const whoFor = bullets((ov.match(/### Who it's for\n([\s\S]*?)(\n### |$)/) || [])[1] || '')
  const integrations = bullets((ov.match(/### Integrations\n([\s\S]*?)(\n### |$)/) || [])[1] || '')

  const features = h3Items(featuresSec.body).map((i, idx) => ({ n: String(idx + 1).padStart(2, '0'), title: i.title, body: i.body.replace(/^\d{2}\s*$/m, '').trim() }))
  // Remove trailing number lines that belong to the next feature.
  features.forEach((f) => (f.body = f.body.split('\n').filter((l) => !/^\d{2}$/.test(l.trim())).join(' ').trim()))
  const featuresIntro = paras(featuresSec.body)[0]

  const modulesIntro = paras(modulesSec.body)[0]
  const modules = bullets(modulesSec.body)

  const benefits = h3Items(benefitsSec.body).map((i) => ({ title: i.title, body: i.body }))

  const whyIntro = paras(whySec.body)[0]
  const whyItems = h3Items(whySec.body.split('### How we build your software')[0]).map((i) => ({ title: i.title, body: i.body }))
  const processLines = (whySec.body.split('### How we build your software')[1] || '').split('\n').filter((l) => /^\d+\. /.test(l))
  const process = processLines.map((l) => {
    const m = l.match(/^\d+\. Step (\d+) #### (.+)$/)
    if (!m) return { step: null, title: l, body: '' }
    const { title, body } = splitTitle(route, m[2])
    return { step: Number(m[1]), title, body }
  })

  const faqs = []
  const faqBody = faqSec.body
  for (const m of faqBody.matchAll(/\*\*### (.+?)\*\*\n\n([\s\S]*?)(?=\n\n\*\*###|$)/g)) faqs.push({ q: m[1].trim(), a: m[2].trim() })

  const related = [...relatedSec.body.matchAll(/solutions\/([a-z0-9-]+)\)/g)].map((m) => m[1])

  const group = solutionsIndex.groups.find((g) => g.items.some((i) => i.slug === slug))
  const indexItem = group?.items.find((i) => i.slug === slug)

  return {
    slug,
    crumb,
    eyebrow,
    h1: h1Line,
    productName,
    promise,
    intro,
    whatsapp,
    heroBullets,
    label: indexItem?.label ?? crumb,
    summary: indexItem?.summary ?? '',
    group: group?.title ?? null,
    challenges: { eyebrow: challengesSec.eyebrow, title: challengesSec.title, intro: challengeIntro, items: challenges },
    overview: { eyebrow: overviewSec.eyebrow, title: overviewSec.title, paragraphs: ovParas, whoFor, integrations },
    features: { eyebrow: featuresSec.eyebrow, title: featuresSec.title, intro: featuresIntro, items: features },
    modules: { eyebrow: modulesSec.eyebrow, title: modulesSec.title, intro: modulesIntro, items: modules },
    benefits: { eyebrow: benefitsSec.eyebrow, title: benefitsSec.title, items: benefits },
    why: { eyebrow: whySec.eyebrow, title: whySec.title, intro: whyIntro, items: whyItems, process },
    faq: { eyebrow: faqSec.eyebrow, title: faqSec.title, items: faqs },
    related,
  }
}
const solutions = Object.keys(FILES)
  .filter((r) => r.startsWith('/solutions/'))
  .map(parseSolution)
// Keep the index order.
const solOrder = solutionsIndex.groups.flatMap((g) => g.items.map((i) => i.slug))
const footerOrder = [
  'manufacturing-crm-software', 'ca-crm-software', 'visa-immigration-crm-software', 'erp-software-development',
  'real-estate-crm-software', 'education-crm-software', 'hospital-management-software', 'travel-agency-crm-software',
  'insurance-crm-software', 'loan-management-software', 'hrms-payroll-software', 'inventory-management-software',
]
solutions.sort((a, b) => footerOrder.indexOf(a.slug) - footerOrder.indexOf(b.slug))
for (const s of solutions) {
  if (s.faq.items.length !== 6) warn(`Solution ${s.slug}: ${s.faq.items.length} FAQs`)
  if (s.features.items.length !== 8) warn(`Solution ${s.slug}: ${s.features.items.length} features`)
  if (s.modules.items.length !== 12) warn(`Solution ${s.slug}: ${s.modules.items.length} modules`)
  if (!solOrder.includes(s.slug)) warn(`Solution ${s.slug} not in index`)
}
write('solutions.json', { index: solutionsIndex, solutions })

/* ------------------------------------------------------------------ */
/* 4. Location pages (Ahmedabad)                                       */
/* ------------------------------------------------------------------ */
function qaPairs(body) {
  const out = []
  for (const m of body.matchAll(/\*\*(.+?)\*\*\n\n([\s\S]*?)(?=\n\n\*\*|\n\n### |$)/g)) out.push({ q: m[1].trim(), a: localizeMarkdown(m[2].trim()) })
  return out
}

function parseLocation(route) {
  const slug = route.slice(1)
  const doc = docFor(route)
  const main = doc['Main Content']
  const secs = sections(main)
  const hero = secs[0]
  const hl = hero.body.split('\n').map((l) => l.trim()).filter(Boolean)
  const h1i = hl.findIndex((l) => l.startsWith('# '))
  const eyebrowLine = hl[h1i - 1]
  const h1 = hl[h1i].replace(/^# /, '')
  const intro = localizeMarkdown(hl[h1i + 1])
  const ctaLine = hl[h1i + 2]
  const primaryCta = ctaLine.replace(/\s*\[.*$/, '').trim()
  const stats = []
  for (let i = h1i + 3; i + 1 < hl.length; i += 2) stats.push({ value: hl[i], label: hl[i + 1] })

  const find = (re) => secs.find((s) => re.test(s.title || ''))
  const story = secs[1]
  const reasons = find(/^Six reasons/)
  const reviews = find(/^Rated /)
  const compare = find(/vs a freelancer vs a big agency/)
  const services = find(/services we offer in Ahmedabad/i)
  const industries = find(/^Trusted by Gujarat/)
  const process = find(/process built for clarity and speed/)
  const stack = find(/^Built with the same tech/)
  const office = find(/^Meet us in Naranpura/)
  const faq = find(/questions,? answered\.?$/)
  const more = find(/^More from our Ahmedabad team/)
  const resources = find(/^Learn more about/)

  const reviewItems = []
  const rl = reviews.body.split('\n').map((l) => l.trim()).filter(Boolean)
  for (let i = 0; i < rl.length; i++) {
    if (rl[i].startsWith('“')) {
      const quote = rl[i].replace(/^“\s*/, '').replace(/\s*”$/, '')
      const who = rl[i + 1] || ''
      const m = who.match(/^(.*?)\s(Local Guide · )?Verified Google Review$/)
      reviewItems.push({ quote, name: m ? m[1] : who, localGuide: !!(m && m[2]) })
    }
  }

  const serviceItems = h3Items(services.body).map((i) => {
    const lines = i.body.split('\n').map((l) => l.trim()).filter(Boolean)
    const priceLine = lines.find((l) => /^From ₹/.test(l)) || ''
    return {
      title: i.title,
      body: lines.filter((l) => l !== priceLine).join(' '),
      price: priceLine.replace(/\s*Get quote$/, ''),
    }
  })

  const indParas = paras(industries.body)
  const processSteps = process.body
    .split('\n')
    .filter((l) => /^\d+\. /.test(l))
    .map((l) => {
      const m = l.match(/^\d+\. (\d{2}) ### (.+)$/)
      if (!m) return { n: '', title: l, body: '' }
      const { title, body } = splitTitle(route, m[2])
      return { n: m[1], title, body }
    })
  const officeLines = office.body.split('\n').map((l) => l.trim()).filter(Boolean)

  const faqBody = faq.body.split('\n### Still have questions')[0]
  const faqItems = qaPairs(faqBody)
  const stillMatch = faq.body.match(/### (Still have questions[^\n]+)\n\n([^\n]+)\n\n([^\n]+)/)

  return {
    slug,
    eyebrow: eyebrowLine,
    h1,
    intro,
    primaryCta,
    stats,
    story: { eyebrow: story.eyebrow, title: story.title, paragraphs: paras(story.body).map(localizeMarkdown) },
    reasons: { eyebrow: reasons.eyebrow, title: reasons.title, items: h3Items(reasons.body) },
    reviews: { eyebrow: reviews.eyebrow, title: reviews.title, items: reviewItems },
    comparison: { eyebrow: compare.eyebrow, title: compare.title, intro: paras(compare.body)[0], table: table(compare.body) },
    services: { eyebrow: services.eyebrow, title: services.title, intro: paras(services.body)[0], items: serviceItems },
    industries: {
      eyebrow: industries.eyebrow,
      title: industries.title,
      intro: indParas[0],
      items: bullets(industries.body),
      coverage: localizeMarkdown(indParas[indParas.length - 1]),
    },
    process: { eyebrow: process.eyebrow, title: process.title, intro: paras(process.body)[0], steps: processSteps },
    stack: stack ? { eyebrow: stack.eyebrow, title: stack.title, items: linkList(stack.body) } : null,
    office: {
      eyebrow: office.eyebrow,
      title: office.title,
      intro: officeLines[0],
      lines: officeLines.filter((l) => l.startsWith('- ')).map((l) => l.replace(/^- /, '')),
    },
    faq: {
      eyebrow: faq.eyebrow,
      title: faq.title,
      items: faqItems,
      still: stillMatch ? { title: stillMatch[1], body: stillMatch[2], cta: stillMatch[3] } : null,
    },
    more: { eyebrow: more.eyebrow, title: more.title, links: linkList(more.body).filter((l) => served(l.href)) },
    resources: resources
      ? { eyebrow: resources.eyebrow, title: resources.title, links: linkList(resources.body).filter((l) => served(l.href)) }
      : null,
  }
}
const locations = Object.keys(FILES)
  .filter((r) => /-in-ahmedabad$/.test(r))
  .map(parseLocation)
for (const l of locations) {
  if (l.reviews.items.length !== 3) warn(`Location ${l.slug}: ${l.reviews.items.length} reviews`)
  if (l.services.items.length !== 6) warn(`Location ${l.slug}: ${l.services.items.length} services`)
  if (l.process.steps.length !== 6) warn(`Location ${l.slug}: ${l.process.steps.length} process steps`)
  if (!l.faq.items.length) warn(`Location ${l.slug}: no FAQs parsed`)
}
write('locations.json', locations)

/* ------------------------------------------------------------------ */
/* 5. Legal                                                            */
/* ------------------------------------------------------------------ */
function parseLegal(route) {
  const doc = docFor(route)
  const main = doc['Main Content']
  const lines = main.split('\n')
  const h1i = lines.findIndex((l) => l.startsWith('# '))
  const head = lines.slice(0, h1i).map((l) => l.trim()).filter(Boolean)
  const rest = lines.slice(h1i + 1)
  const nonEmpty = rest.map((l) => l.trim()).filter(Boolean)
  const intro = nonEmpty[0]
  const updated = nonEmpty.find((l) => l.startsWith('Last updated:'))
  const secs = []
  let cur = null
  let pendingNum = null
  const tail = []
  for (const raw of rest) {
    const line = raw.trim()
    if (/^\d{2}$/.test(line)) {
      pendingNum = line
      continue
    }
    const h = line.match(/^## (.+)$/)
    if (h) {
      if (cur) secs.push(cur)
      cur = { n: pendingNum, title: h[1], lines: [] }
      pendingNum = null
      continue
    }
    if (cur) cur.lines.push(raw)
  }
  if (cur) secs.push(cur)
  // The last section carries the trailing cross-links line; split it off.
  const out = secs.map((s) => {
    let body = s.lines.join('\n').trim()
    const linkLine = body.split('\n').find((l) => /^\[.*\]\(https:\/\/www\.instabizweb\.com\/.*\) \[/.test(l.trim()))
    if (linkLine) {
      tail.push(...[...linkLine.matchAll(/\[([^\]]+)\]\(([^)]+)\)/g)].map((m) => ({ label: m[1], href: localHref(m[2]) })))
      body = body.replace(linkLine, '').trim()
    }
    return { n: s.n, title: s.title, blocks: legalBlocks(localizeMarkdown(body)) }
  })
  return { eyebrow: head[head.length - 1] || 'Legal', h1: lines[h1i].replace(/^# /, ''), intro, updated, sections: out, links: tail }
}

/** Turn legal copy into typed blocks: paragraphs, lists, checks, term/definition pairs, numbered cards, subheads. */
function legalBlocks(body) {
  const groups = body.split(/\n\s*\n/).map((g) => g.trim()).filter(Boolean)
  const blocks = []
  let i = 0
  const oneLine = (g) => !!g && !g.includes('\n')
  const structural = (g) => /^(- |#|✓|\[)/.test(g) || /^\d+$/.test(g)
  // "Project Data", "Essential Cookies", "Access": a Title Case label of up to 4 words.
  const isLabel = (g) =>
    oneLine(g) && !structural(g) && !/[.:;,]$/.test(g) && g.split(' ').length <= 4 &&
    g.split(' ').every((w) => /^[A-Z0-9(&/–-]/.test(w))
  const isKv = (g) => oneLine(g) && /^[A-Z][A-Za-z ]{1,28}: \S/.test(g)
  const isLine = (g) => oneLine(g) && !structural(g) && !/[.:]$/.test(g) && g.length <= 160 && !isKv(g)
  while (i < groups.length) {
    const g = groups[i]
    if (g.startsWith('### ')) {
      blocks.push({ type: 'h3', text: g.replace(/^### /, '') })
      i++
    } else if (/^- /.test(g)) {
      blocks.push({ type: 'list', items: g.split('\n').map((l) => l.replace(/^- /, '').trim()) })
      i++
    } else if (g.startsWith('✓')) {
      const items = []
      while (i < groups.length && groups[i].startsWith('✓')) {
        items.push(groups[i].replace(/^✓\s*/, ''))
        i++
      }
      blocks.push({ type: 'checks', items })
    } else if (/^\d+$/.test(g) && i + 2 < groups.length) {
      // numbered card: "1" / "Title" / "Body"
      const items = []
      while (i + 2 < groups.length + 1 && /^\d+$/.test(groups[i] || '')) {
        items.push({ n: groups[i], title: groups[i + 1], body: groups[i + 2] })
        i += 3
      }
      blocks.push({ type: 'numbered', items })
    } else if (isKv(g)) {
      const items = []
      while (i < groups.length && isKv(groups[i])) {
        const m = groups[i].match(/^([^:]+):\s(.*)$/)
        items.push({ term: m[1], def: m[2] })
        i++
      }
      blocks.push({ type: 'kv', items })
    } else if (isLabel(g) && i + 1 < groups.length && !isLabel(groups[i + 1]) && !structural(groups[i + 1]) && !isKv(groups[i + 1])) {
      const items = []
      while (i + 1 < groups.length && isLabel(groups[i]) && !isLabel(groups[i + 1]) && !structural(groups[i + 1]) && !isKv(groups[i + 1])) {
        items.push({ term: groups[i], def: groups[i + 1] })
        i += 2
      }
      blocks.push({ type: 'terms', items })
    } else if (isLine(g) && isLine(groups[i + 1])) {
      const items = []
      while (i < groups.length && isLine(groups[i])) {
        items.push(groups[i])
        i++
      }
      blocks.push({ type: 'list', items })
    } else {
      blocks.push({ type: 'p', text: g })
      i++
    }
  }
  return blocks
}
const legal = {}
for (const r of ['/privacy-policy', '/terms-and-conditions', '/refund-policy']) legal[r.slice(1)] = parseLegal(r)
write('legal.json', legal)

/* ------------------------------------------------------------------ */
/* 6. Portfolio                                                        */
/* ------------------------------------------------------------------ */
const portfolio = (() => {
  const doc = docFor('/portfolio')
  const main = doc['Main Content']
  const allIdx = main.indexOf('## Filter by what you’re building')
  const all = main.slice(allIdx)
  const projects = []
  // The ItemList schema carries each project's long description; the card copy is
  // "Name Tagline Description" flattened, so the tagline is what sits between them.
  const itemList = (seo['/portfolio'].jsonLd.find((x) => x['@type'] === 'ItemList') || { itemListElement: [] }).itemListElement
  const descFor = (name) => itemList.find((x) => x.name === name)?.description
  // Linked projects on one line.
  const re = /\[\[Image: ([^\]]+?) - ([^\]]+?)\]\((https:\/\/www\.instabizweb\.com\/portfolio\/[^)]+)\) \2 (.+?) ### (.+?) (Visit project|Learn more)\]\(([^)]+)\)/g
  let m
  while ((m = re.exec(all))) {
    const name = m[1]
    let rest = m[5].trim()
    if (rest.startsWith(name + ' ')) rest = rest.slice(name.length + 1)
    else warn(`Portfolio: card text for ${name} does not start with its name`)
    const description = descFor(name)
    let tagline = rest
    if (description && rest.endsWith(description)) tagline = rest.slice(0, rest.length - description.length).trim()
    else warn(`Portfolio: could not isolate tagline for ${name}`)
    projects.push({
      name,
      category: m[2],
      image: localHref(m[3]),
      tag: m[4].trim(),
      tagline,
      description: description ?? rest,
      ctaLabel: m[6],
      href: localHref(m[7]),
    })
  }
  // Unlinked project (Rental Management) spans several lines.
  const rm = all.match(/\[Image: ([^\]]+?) - ([^\]]+?)\]\((https:\/\/www\.instabizweb\.com\/portfolio\/[^)]+)\) \2 ([^\n]+)\n\n### ([^\n]+)\n\n([^\n]+)\n\n([^\n]+)/)
  if (rm) {
    const insertAfter = projects.findIndex((p) => p.name === 'Odoo CRM')
    projects.splice(insertAfter + 1, 0, {
      name: rm[1], category: rm[2], image: localHref(rm[3]), tag: rm[4].trim(), tagline: rm[6].trim(), description: rm[7].trim(), ctaLabel: null, href: null,
    })
  }
  // Keep the schema order (matches the live grid order).
  projects.sort((a, b) => itemList.findIndex((x) => x.name === a.name) - itemList.findIndex((x) => x.name === b.name))
  const lines = main.split('\n').map((l) => l.trim()).filter(Boolean)
  const filterLine = lines.find((l) => l.startsWith('All Work '))
  const filters = [...filterLine.matchAll(/([A-Za-z&][A-Za-z& ]*?)\s(\d+)(?=\s|$)/g)].map((x) => ({ label: x[1].trim(), count: Number(x[2]) }))
  const spot = main.slice(main.indexOf('Featured spotlight'), allIdx)
  const featured = [...spot.matchAll(/^- \[Image: ([^\]]+)\]\([^)]+\) (.+?) \1 (.+)$/gm)].map((x) => ({ name: x[1], category: x[2], note: x[3] }))
  if (projects.length !== 15) warn(`Portfolio: parsed ${projects.length} projects (expected 15)`)
  return { projects, filters, featured }
})()
write('portfolio.json', portfolio)

/* ------------------------------------------------------------------ */
/* 7. Generic page sections for one-off pages (used by typed selectors) */
/* ------------------------------------------------------------------ */
const pages = {}
for (const route of ['/', '/services', '/services/ai-agent-development', '/about-us', '/contact-us', '/portfolio']) {
  const doc = docFor(route)
  const main = doc['Main Content']
  pages[route] = {
    sections: sections(main).map((s) => ({ ...s, body: localizeMarkdown(s.body) })),
    faqAppendix: doc['FAQs'] ? qaPairsFromAppendix(doc['FAQs']) : [],
    forms: doc['Forms'] || '',
  }
}
function qaPairsFromAppendix(text) {
  const out = []
  for (const m of text.matchAll(/### (.+?)\n\n([\s\S]*?)(?=\n\n### |$)/g)) out.push({ q: m[1].trim(), a: localizeMarkdown(m[2].trim()) })
  return out
}
write('pages.json', pages)

/* ------------------------------------------------------------------ */
/* 8. llms.txt                                                         */
/* ------------------------------------------------------------------ */
// The audited copy in other/llms.md was byte-identical to the recorded live file; it is the
// source now so that the site's own edits (retired services) reach llms.txt too.
fs.writeFileSync(path.join(OUT, 'llms.txt'), read('other/llms.md').split('## Main Content')[1].trim() + '\n')

/* ------------------------------------------------------------------ */
console.log(`content: ${Object.keys(seo).length} routes · ${posts.length} posts · ${solutions.length} solutions · ${locations.length} locations · ${portfolio.projects.length} projects`)
if (warnings.length) {
  console.log(`content: ${warnings.length} note(s)`)
  for (const w of warnings) console.log('  - ' + w)
}
