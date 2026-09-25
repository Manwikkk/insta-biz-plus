#!/usr/bin/env node
/**
 * A still map of the office's neighbourhood, rendered once from OpenStreetMap tiles and
 * toned to the site's palette (a light and a dark version), so pages can show where we are
 * without loading a third-party map. The office sits at the exact centre of each image.
 * Map data © OpenStreetMap contributors — the attribution is shown wherever the map appears.
 *
 *   node scripts/office-map.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const ROOT = process.cwd()
const OUT = path.join(ROOT, 'public', 'maps')
// the office location from the site content (src/content/site.ts → geo)
const LAT = 23.0626
const LNG = 72.5575
const Z = 16
const W = 1200
const H = 720
const TILE = 256

// world pixel coordinates of the office at zoom Z
const n = 2 ** Z
const px = ((LNG + 180) / 360) * n * TILE
const lat = (LAT * Math.PI) / 180
const py = ((1 - Math.log(Math.tan(lat) + 1 / Math.cos(lat)) / Math.PI) / 2) * n * TILE
const left = Math.round(px - W / 2)
const top = Math.round(py - H / 2)
const tx0 = Math.floor(left / TILE)
const ty0 = Math.floor(top / TILE)
const tx1 = Math.floor((left + W - 1) / TILE)
const ty1 = Math.floor((top + H - 1) / TILE)

// tiles are cached locally, so re-running the script never asks the tile server twice
const CACHE = path.join(ROOT, 'node_modules', '.cache', 'office-map')
fs.mkdirSync(CACHE, { recursive: true })
const tiles = []
let fetched = 0
for (let ty = ty0; ty <= ty1; ty++)
  for (let tx = tx0; tx <= tx1; tx++) {
    const file = path.join(CACHE, `${Z}-${tx}-${ty}.png`)
    if (!fs.existsSync(file)) {
      const url = `https://tile.openstreetmap.org/${Z}/${tx}/${ty}.png`
      const res = await fetch(url, { headers: { 'user-agent': 'InstaBizWeb-site/1.0 (one-time static office map render)' } })
      if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`)
      fs.writeFileSync(file, Buffer.from(await res.arrayBuffer()))
      fetched++
      await new Promise((r) => setTimeout(r, 150)) // be gentle with the volunteer-run tile server
    }
    tiles.push({ input: fs.readFileSync(file), left: tx * TILE - left, top: ty * TILE - top })
  }
console.log(`${tiles.length} tiles at z${Z} (${fetched} fetched, the rest cached)`)

// stitch; tiles hanging over the edges are cropped by extracting after compositing on a larger canvas
const cw = (tx1 - tx0 + 1) * TILE
const ch = (ty1 - ty0 + 1) * TILE
const ox = tx0 * TILE - left
const oy = ty0 * TILE - top
const canvas = await sharp({ create: { width: cw, height: ch, channels: 3, background: '#f2efe9' } })
  .composite(tiles.map((t) => ({ input: t.input, left: t.left - ox, top: t.top - oy })))
  .png()
  .toBuffer()
const base = await sharp(canvas).extract({ left: -ox, top: -oy, width: W, height: H }).toColourspace('srgb').toBuffer()

/**
 * Re-inks the map between two colours of the site palette by each pixel's luminance.
 * Light: land takes the paper tone and everything darker than land (streets' edges,
 * buildings, labels) is drawn in graphite. Dark: land takes the steel tone, and both the
 * white streets and the dark labels come up pale, so streets read lighter than the ground.
 */
const LAND = 0.938 // luminance of OSM's land colour
async function tone(paper, ink, dark = false) {
  const { data } = await sharp(base).removeAlpha().raw().toBuffer({ resolveWithObject: true })
  const out = Buffer.alloc(data.length)
  for (let i = 0; i < data.length; i += 3) {
    const l = (0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]) / 255
    let t
    if (!dark) t = Math.pow(Math.min(1, Math.max(0, (LAND - l) / (LAND - 0.28))), 0.9) * 0.62
    else if (l >= LAND) t = Math.min(1, (l - LAND) / (1 - LAND)) * 0.3
    else t = Math.pow(Math.min(1, (LAND - l) / (LAND - 0.2)), 0.85) * 0.5
    for (let c = 0; c < 3; c++) out[i + c] = Math.round(paper[c] + (ink[c] - paper[c]) * t)
  }
  return sharp(out, { raw: { width: W, height: H, channels: 3 } })
}

const hex = (h) => [1, 3, 5].map((o) => parseInt(h.slice(o, o + 2), 16))
fs.mkdirSync(OUT, { recursive: true })
// light: bone paper with graphite streets; dark: engine-room steel with pale streets
await (await tone(hex('#efede6'), hex('#1b2230'))).webp({ quality: 84 }).toFile(path.join(OUT, 'office-light.webp'))
await (await tone(hex('#0c1016'), hex('#c9ced6'), true)).webp({ quality: 84 }).toFile(path.join(OUT, 'office-dark.webp'))
fs.writeFileSync(
  path.join(OUT, 'office.json'),
  JSON.stringify({ lat: LAT, lng: LNG, zoom: Z, width: W, height: H, attribution: '© OpenStreetMap contributors' }, null, 2) + '\n',
)
console.log('→ public/maps/office-light.webp, office-dark.webp')
