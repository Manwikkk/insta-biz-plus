#!/usr/bin/env node
/**
 * SEO safety check. Compares the rendered <head> of every audited route on a
 * running build (default http://localhost:3000) with the head recorded from the
 * live site (.firecrawl/html). Titles and descriptions are compared with the site's
 * own wording in seo.json (the audited inventory, which carries deliberate edits such
 * as the retired Digital Marketing and UI/UX services); every other tag must match the
 * recording exactly. Also checks JSON-LD (against seo.json), sitemap.xml (the live URLs
 * the site still serves), robots.txt, llms.txt and the redirects.
 *
 *   npm run build && npm run start   (in one terminal)
 *   npm run seo:verify               (in another)
 */
import fs from 'node:fs'
import path from 'node:path'

const BASE = process.env.SEO_BASE || 'http://localhost:3000'
const ROOT = process.cwd()
const RAW = path.join(ROOT, '.firecrawl', 'html')
const seo = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/content/generated/seo.json'), 'utf8'))

const NAMED = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', rsquo: '’', lsquo: '‘', rdquo: '”', ldquo: '“', hellip: '…', mdash: '—', ndash: '–', middot: '·' }
const decode = (s) => {
  let prev
  do {
    prev = s
    s = s.replace(/&(#x[0-9a-f]+|#\d+|[a-z][a-z0-9]*);/gi, (m, e) => {
      if (e[0] === '#') return String.fromCodePoint(e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10))
      return NAMED[e] ?? m
    })
  } while (s !== prev)
  return s
}
const attrs = (tag) => Object.fromEntries([...tag.matchAll(/([a-zA-Z_:][-a-zA-Z0-9_:.]*)="([^"]*)"/g)].map((m) => [m[1], decode(m[2])]))

function headTags(html) {
  const head = html.slice(0, html.indexOf('</head>'))
  const title = decode((head.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || '')
  const metas = [...head.matchAll(/<meta\s[^>]*>/g)].map((m) => attrs(m[0]))
  const links = [...head.matchAll(/<link\s[^>]*>/g)].map((m) => attrs(m[0]))
  const out = [`title=${title}`]
  for (const m of metas) {
    const key = m.name || m.property
    // theme-color / color-scheme style the browser chrome; they follow the redesign's light and dark palette, not the old site's.
    if (!key || ['viewport', 'next-size-adjust', 'theme-color', 'color-scheme'].includes(key)) continue
    let v = m.content ?? ''
    // Generated OG image URLs carry a content hash that changes with the image; compare without it.
    if (/opengraph-image\?/.test(v)) v = v.replace(/\?.*$/, '?<hash>')
    out.push(`${key}=${v}`)
  }
  for (const l of links) {
    if (l.rel === 'canonical' || l.rel === 'author') out.push(`link:${l.rel}=${l.href}`)
  }
  return out
}
/** Tags whose text the site states itself; they come from seo.json rather than the recording. */
const TEXT_TAGS = {
  title: (e) => e.title,
  description: (e) => e.description,
  'og:title': (e) => e.og.title,
  'og:description': (e) => e.og.description,
  'twitter:title': (e) => e.twitter.title,
  'twitter:description': (e) => e.twitter.description,
}
/** The recorded head with its text tags swapped for the site's wording; counts the deliberate differences. */
function expectedTags(rawHtml, entry) {
  let edited = 0
  const tags = headTags(rawHtml).map((tag) => {
    const key = tag.slice(0, tag.indexOf('='))
    if (!(key in TEXT_TAGS)) return tag
    const want = `${key}=${TEXT_TAGS[key](entry)}`
    if (decode(want) !== decode(tag)) edited++
    return want
  })
  return { tags, edited }
}
function jsonLd(html) {
  return [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((m) => JSON.stringify(JSON.parse(m[1])))
}

let failures = 0
let reworded = 0
let ldReworded = 0
const report = []
for (const route of Object.keys(seo)) {
  const rawFile = route === '/' ? path.join(RAW, 'index.html') : path.join(RAW, route.slice(1) + '.html')
  if (!fs.existsSync(rawFile)) {
    report.push(`? ${route}: no recorded head to compare`)
    continue
  }
  const res = await fetch(BASE + route)
  const html = await res.text()
  if (res.status !== 200) {
    failures++
    report.push(`✗ ${route}: HTTP ${res.status}`)
    continue
  }
  const rawHtml = fs.readFileSync(rawFile, 'utf8')
  const { tags: expected, edited } = expectedTags(rawHtml, seo[route])
  const actual = headTags(html)
  // Text fields are compared after entity decoding; the audited inventory wins where the
  // live site double-escaped apostrophes (e.g. "&amp;rsquo;"), so normalise those too.
  const norm = (s) => decode(s)
  const e = expected.map(norm)
  const a = actual.map(norm)
  const missing = e.filter((x) => !a.includes(x))
  const extra = a.filter((x) => !e.includes(x))
  const ldE = seo[route].jsonLd.map((d) => JSON.stringify(d)).sort()
  const ldA = jsonLd(html).sort()
  const ldOk = JSON.stringify(ldE) === JSON.stringify(ldA)
  if (JSON.stringify(jsonLd(rawHtml).sort()) !== JSON.stringify(ldE)) ldReworded++
  const h1 = (html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/) || [])[1]
  const h1Text = h1 ? decode(h1.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim() : null
  const h1Ok = !seo[route].h1 || h1Text === seo[route].h1
  if (missing.length || extra.length || !ldOk || !h1Ok) {
    failures++
    report.push(`✗ ${route}`)
    for (const m of missing) report.push(`    missing  ${m}`)
    for (const x of extra) report.push(`    extra    ${x}`)
    if (!ldOk) report.push(`    json-ld differs (${ldE.length} expected, ${ldA.length} rendered)`)
    if (!h1Ok) report.push(`    h1 "${h1Text}" ≠ "${seo[route].h1}"`)
  } else {
    if (edited) reworded++
    report.push(`✓ ${route}${edited ? `  (${edited} text tag${edited > 1 ? 's' : ''} reworded by the site)` : ''}`)
  }
}
report.push(`  ${reworded} routes with reworded titles/descriptions; JSON-LD reworded on ${ldReworded} of ${Object.keys(seo).length} routes`)

// sitemap.xml
{
  const live = fs.readFileSync(path.join(ROOT, '.firecrawl', 'sitemap.xml'), 'utf8')
  const mine = await (await fetch(BASE + '/sitemap.xml')).text()
  const rows = (s) => [...s.matchAll(/<url>\s*<loc>([^<]+)<\/loc>[\s\S]*?<changefreq>([^<]+)<\/changefreq>\s*<priority>([^<]+)<\/priority>/g)].map((m) => `${m[1]}|${m[2]}|${m[3]}`)
  // Live URLs the site still serves (retired pages redirect instead).
  const served = (row) => Object.hasOwn(seo, row.split('|')[0].replace('https://www.instabizweb.com', '') || '/')
  const a = rows(live).filter(served)
  // Pages added since the audit (e.g. /products) are listed too; the live URLs keep their order and values.
  const liveUrls = new Set(rows(live).map((r) => r.split('|')[0]))
  const b = rows(mine).filter((r) => liveUrls.has(r.split('|')[0]))
  const added = rows(mine).length - b.length
  const ok = JSON.stringify(a) === JSON.stringify(b)
  if (!ok) failures++
  report.push(
    `${ok ? '✓' : '✗'} sitemap.xml (${b.length} urls, same order/changefreq/priority as live minus ${rows(live).length - a.length} retired: ${ok}; ${added} added)`,
  )
  const blogDates = [...live.matchAll(/<loc>(https:\/\/www\.instabizweb\.com\/blogs\/[^<]+)<\/loc>\s*<lastmod>([^<]+)</g)]
    .map((m) => `${m[1]}|${m[2]}`)
    .filter(served)
  const myBlogDates = [...mine.matchAll(/<loc>(https:\/\/www\.instabizweb\.com\/blogs\/[^<]+)<\/loc>\s*<lastmod>([^<]+)</g)].map((m) => `${m[1]}|${m[2]}`)
  const datesOk = JSON.stringify(blogDates) === JSON.stringify(myBlogDates)
  if (!datesOk) failures++
  report.push(`${datesOk ? '✓' : '✗'} sitemap blog lastmod dates preserved`)
}
// robots.txt
{
  const txt = await (await fetch(BASE + '/robots.txt')).text()
  const ok = /User-Agent: \*/i.test(txt) && /Allow: \//.test(txt) && /Disallow: \/api\//.test(txt) && /Disallow: \/_next\//.test(txt) && /Sitemap: https:\/\/www\.instabizweb\.com\/sitemap\.xml/.test(txt)
  if (!ok) failures++
  report.push(`${ok ? '✓' : '✗'} robots.txt`)
}
// llms.txt
{
  const source = fs.readFileSync(path.join(ROOT, 'src/content/generated/llms.txt'), 'utf8')
  const mine = await (await fetch(BASE + '/llms.txt')).text()
  const ok = source === mine
  if (!ok) failures++
  report.push(`${ok ? '✓' : '✗'} llms.txt identical to website-content/other/llms.md`)
}
// redirects
for (const [from, to] of [
  ['/team', '/about-us'],
  ['/blog', '/blogs'],
  // retired with Digital Marketing and UI/UX Design
  ['/digital-marketing-agency-in-ahmedabad', '/services'],
  ['/seo-company-in-ahmedabad', '/services'],
  ['/audit', '/contact-us'],
  ['/blogs/seo-fundamentals-for-founders-2026-edition', '/blogs'],
  ['/blogs/aeo-geo-how-to-rank-in-google-ai-overviews-and-chatgpt', '/blogs'],
  ['/blogs/aso-app-store-optimization-2026', '/blogs'],
  ['/blogs/designing-mobile-apps-people-actually-keep', '/blogs'],
]) {
  const r = await fetch(BASE + from, { redirect: 'manual' })
  const loc = r.headers.get('location') || ''
  const ok = r.status === 301 && (loc === to || loc.endsWith(to))
  if (!ok) failures++
  report.push(`${ok ? '✓' : '✗'} ${from} → ${to} (${r.status} ${loc})`)
}

console.log(report.join('\n'))
console.log(failures ? `\n${failures} check(s) failed` : '\nAll SEO checks passed')
process.exit(failures ? 1 : 0)
