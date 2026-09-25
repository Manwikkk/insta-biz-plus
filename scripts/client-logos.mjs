#!/usr/bin/env node
/**
 * Client logos, prepared for the site (public/logos + src/content/generated/logos.json):
 *   - original colours from each client's own channels (their website, or their app listing);
 *     where no colour original could be found, the logo file from the site content is used as is
 *   - flat backgrounds cleared, empty padding trimmed, sized for 2x screens
 *   - a manifest with each logo's shape, so every logo can be set at the same optical size,
 *     plus the plate colour for logos drawn for a dark background
 *
 *   node scripts/client-logos.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const ROOT = process.cwd()
const OUT_DIR = path.join(ROOT, 'public', 'logos')
const MANIFEST = path.join(ROOT, 'src', 'content', 'generated', 'logos.json')
/** the site content's media host (what media() in src/content/site.ts resolves to) */
const CONTENT_MEDIA = 'https://www.instabizweb.com'

/**
 * name   — must match the brand / client names used in src/content/home.ts
 * clear  — flood-fill a flat background away from the edges
 * keep   — 'top': keep only the first block of artwork (the emblem above an app icon's wordmark)
 * tint   — recolour every pixel, keeping its alpha
 * plate  — the colour a white-on-dark logo sits on ('auto': the colour that was cleared)
 */
const SOURCES = [
  { slug: 'blutec', name: 'BluTec', url: 'https://www.blutec.ai/_next/static/media/logo-wbg.68cde067.webp', from: 'blutec.ai' },
  {
    slug: 'carefix',
    name: 'Carefix',
    url: `${CONTENT_MEDIA}/brand/carefix.png`,
    // Carefix's own app icon (Google Play, com.carefix_technician) sets the mark in black
    tint: '#111111',
    from: 'site content, in the black of its Google Play app icon',
  },
  { slug: 'cashflex', name: 'Cashflex', url: 'https://cashflex.in/logo2.png', plate: '#164e63', from: 'cashflex.in (plate: its theme colour)' },
  {
    slug: 'chennai-cabs',
    name: 'Chennai Cabs',
    url: 'https://play-lh.googleusercontent.com/W1Agl2Xbs_vWg7U7NeSg31u7NqjUR3uqKJokPpCBGjDejzpOqjXbeEbvIGw0xdm5UeLQAysewbwyPyOOb1Naxw=s512',
    clear: true,
    keep: 'top',
    from: 'Google Play app icon',
  },
  { slug: 'estate-rent', name: 'Estate Rent', url: 'https://www.blutec.ai/_next/static/media/estate-logo.0ca5d3fc.webp', from: 'blutec.ai' },
  { slug: 'kabadi-king', name: 'Kabadi King', url: `${CONTENT_MEDIA}/brand/kabaddi-king.png`, from: 'site content (colour original not reachable)' },
  {
    slug: 'sarvam-art',
    name: 'Sarvam Art',
    url: 'https://www.blutec.ai/_next/static/media/arttttttt.2d64128d.webp',
    clear: true,
    plate: 'auto',
    from: 'blutec.ai',
  },
]

const hex = (rgb) => '#' + rgb.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('')

async function raw(buf) {
  const { data, info } = await sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  return { data, W: info.width, H: info.height }
}
const png = ({ data, W, H }) => sharp(data, { raw: { width: W, height: H, channels: 4 } }).png().toBuffer()

/** Flood-fills the flat background in from the edges; returns the cleared colour. */
function clearBackground(img) {
  const { data, W, H } = img
  // the background colour: the median of the outermost ring of pixels
  const ring = []
  for (let x = 0; x < W; x++) ring.push((0 * W + x) * 4, ((H - 1) * W + x) * 4)
  for (let y = 0; y < H; y++) ring.push((y * W + 0) * 4, (y * W + W - 1) * 4)
  const med = (c) => ring.map((i) => data[i + c]).sort((a, b) => a - b)[ring.length >> 1]
  const bg = [med(0), med(1), med(2)]
  const dist = (i) => Math.hypot(data[i] - bg[0], data[i + 1] - bg[1], data[i + 2] - bg[2])
  const seen = new Uint8Array(W * H)
  const stack = []
  for (let x = 0; x < W; x++) stack.push(x, (H - 1) * W + x)
  for (let y = 0; y < H; y++) stack.push(y * W, y * W + W - 1)
  while (stack.length) {
    const k = stack.pop()
    if (seen[k]) continue
    seen[k] = 1
    const i = k * 4
    if (dist(i) > 40) continue
    data[i + 3] = 0
    const x = k % W
    const y = (k / W) | 0
    if (x > 0) stack.push(k - 1)
    if (x < W - 1) stack.push(k + 1)
    if (y > 0) stack.push(k - W)
    if (y < H - 1) stack.push(k + W)
  }
  // anti-aliased rim: pixels touching the cleared area fade by how close they are to the background
  const alpha = new Uint8Array(W * H)
  for (let k = 0; k < W * H; k++) alpha[k] = data[k * 4 + 3]
  for (let y = 1; y < H - 1; y++)
    for (let x = 1; x < W - 1; x++) {
      const k = y * W + x
      if (!alpha[k]) continue
      if (alpha[k - 1] && alpha[k + 1] && alpha[k - W] && alpha[k + W]) continue
      const d = dist(k * 4)
      if (d < 110) data[k * 4 + 3] = Math.round(255 * Math.max(0.15, (d - 40) / 70))
    }
  return bg
}

/** Keeps the first block of artwork from the top, up to the first clear horizontal gap. */
function keepTop(img, gap = 6) {
  const { data, W, H } = img
  const filled = (y) => {
    for (let x = 0; x < W; x++) if (data[(y * W + x) * 4 + 3] > 40) return true
    return false
  }
  let y0 = 0
  while (y0 < H && !filled(y0)) y0++
  let y1 = y0
  let empty = 0
  for (let y = y0; y < H; y++) {
    if (filled(y)) {
      y1 = y
      empty = 0
    } else if (++empty >= gap) break
  }
  for (let y = y1 + 1; y < H; y++) for (let x = 0; x < W; x++) data[(y * W + x) * 4 + 3] = 0
}

function tint(img, colour) {
  const c = [1, 3, 5].map((o) => parseInt(colour.slice(o, o + 2), 16))
  for (let i = 0; i < img.data.length; i += 4) [img.data[i], img.data[i + 1], img.data[i + 2]] = c
}

/** Mean chroma of the visible pixels, and how much of the box the artwork covers. */
function measure({ data, W, H }) {
  let n = 0
  let s = 0
  let cover = 0
  for (let i = 0; i < data.length; i += 4) {
    const a = data[i + 3] / 255
    cover += a
    if (a < 0.16) continue
    const mx = Math.max(data[i], data[i + 1], data[i + 2])
    const mn = Math.min(data[i], data[i + 1], data[i + 2])
    n++
    s += (mx - mn) / 255
  }
  return { chroma: n ? s / n : 0, ink: cover / (W * H) }
}

fs.mkdirSync(OUT_DIR, { recursive: true })
fs.mkdirSync(path.dirname(MANIFEST), { recursive: true })
const manifest = {}
for (const src of SOURCES) {
  const res = await fetch(src.url, { headers: { 'user-agent': 'Mozilla/5.0 (logo prep)' } })
  if (!res.ok) throw new Error(`${src.slug}: HTTP ${res.status}`)
  const img = await raw(Buffer.from(await res.arrayBuffer()))
  let plate = src.plate && src.plate !== 'auto' ? src.plate : null
  if (src.clear) {
    const bg = clearBackground(img)
    if (src.plate === 'auto') plate = hex(bg)
  }
  if (src.keep === 'top') keepTop(img)
  if (src.tint) tint(img, src.tint)
  const trimmed = await sharp(await png(img)).trim({ background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 10 }).toBuffer()
  const out = await sharp(trimmed)
    .resize({ width: 560, height: 240, fit: 'inside', withoutEnlargement: true })
    .png({ compressionLevel: 9 })
    .toBuffer()
  const final = await raw(out)
  const { chroma, ink } = measure(final)
  fs.writeFileSync(path.join(OUT_DIR, `${src.slug}.png`), out)
  manifest[src.name] = {
    src: `/logos/${src.slug}.png`,
    width: final.W,
    height: final.H,
    ink: Number(ink.toFixed(3)),
    plate,
    colour: chroma > 0.06,
    source: src.from,
  }
  console.log(
    `${src.slug.padEnd(13)} ${`${final.W}x${final.H}`.padEnd(8)} ink ${ink.toFixed(2)}  colour ${String(chroma > 0.06).padEnd(5)} plate ${plate ?? '-'}  ← ${src.from}`,
  )
}
fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + '\n')
console.log('manifest →', path.relative(ROOT, MANIFEST))
