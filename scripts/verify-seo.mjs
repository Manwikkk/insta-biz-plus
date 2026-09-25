#!/usr/bin/env node
/**
 * SEO safety check. Compares the rendered <head> of every audited route on a
 * running build (default http://localhost:3000) with the head recorded from the
 * live site (.firecrawl/html). Also checks JSON-LD, sitemap.xml, robots.txt,
 * llms.txt and the preserved redirects.
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
function jsonLd(html) {
  return [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((m) => JSON.stringify(JSON.parse(m[1])))
}

let failures = 0
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
  const expected = headTags(fs.readFileSync(rawFile, 'utf8'))
  const actual = headTags(html)
  // Text fields are compared after entity decoding; the audited inventory wins where the
  // live site double-escaped apostrophes (e.g. "&amp;rsquo;"), so normalise those too.
  const norm = (s) => decode(s)
  const e = expected.map(norm)
  const a = actual.map(norm)
  const missing = e.filter((x) => !a.includes(x))
  const extra = a.filter((x) => !e.includes(x))
  const ldE = jsonLd(fs.readFileSync(rawFile, 'utf8')).sort()
  const ldA = jsonLd(html).sort()
  const ldOk = JSON.stringify(ldE) === JSON.stringify(ldA)
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
    report.push(`✓ ${route}`)
  }
}

// sitemap.xml
{
  const live = fs.readFileSync(path.join(ROOT, '.firecrawl', 'sitemap.xml'), 'utf8')
  const mine = await (await fetch(BASE + '/sitemap.xml')).text()
  const rows = (s) => [...s.matchAll(/<url>\s*<loc>([^<]+)<\/loc>[\s\S]*?<changefreq>([^<]+)<\/changefreq>\s*<priority>([^<]+)<\/priority>/g)].map((m) => `${m[1]}|${m[2]}|${m[3]}`)
  const a = rows(live)
  const b = rows(mine)
  const ok = JSON.stringify(a) === JSON.stringify(b)
  if (!ok) failures++
  report.push(`${ok ? '✓' : '✗'} sitemap.xml (${b.length} urls, same order/changefreq/priority: ${ok})`)
  const blogDates = [...live.matchAll(/<loc>(https:\/\/www\.instabizweb\.com\/blogs\/[^<]+)<\/loc>\s*<lastmod>([^<]+)</g)].map((m) => `${m[1]}|${m[2]}`)
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
  const live = fs.readFileSync(path.join(RAW, 'llms.txt.html'), 'utf8')
  const mine = await (await fetch(BASE + '/llms.txt')).text()
  const ok = live === mine
  if (!ok) failures++
  report.push(`${ok ? '✓' : '✗'} llms.txt identical`)
}
// redirects
for (const [from, to] of [['/team', '/about-us'], ['/blog', '/blogs']]) {
  const r = await fetch(BASE + from, { redirect: 'manual' })
  const loc = r.headers.get('location') || ''
  const ok = r.status === 301 && (loc === to || loc.endsWith(to))
  if (!ok) failures++
  report.push(`${ok ? '✓' : '✗'} ${from} → ${to} (${r.status} ${loc})`)
}

console.log(report.join('\n'))
console.log(failures ? `\n${failures} check(s) failed` : '\nAll SEO checks passed')
process.exit(failures ? 1 : 0)
