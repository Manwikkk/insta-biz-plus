#!/usr/bin/env node
/**
 * Every local picture the site shows through next/image, made ahead of time: each one at every
 * width a srcset can ask for (src/lib/imageWidths.json, never wider than the original), as WebP,
 * in public/_img/<path>.<hash>.<width>.webp. The hash is the original's content, so the files can
 * be cached forever and a changed picture gets new names. Writes the manifest the image loader
 * reads (src/content/generated/images.json: path → hash and original width).
 *
 * Served as plain static files, pictures never wait on the server to resize them, and the CDN in
 * front of the site keeps them. Files already made are kept; files no longer needed are removed.
 *
 *   node scripts/optimize-images.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import os from 'node:os'
import sharp from 'sharp'

const ROOT = process.cwd()
const PUBLIC = path.join(ROOT, 'public')
const OUT = path.join(PUBLIC, '_img')
const MANIFEST = path.join(ROOT, 'src', 'content', 'generated', 'images.json')
const DIRS = ['work', 'products', 'clients', 'brand']
const { deviceSizes, imageSizes } = JSON.parse(fs.readFileSync(path.join(ROOT, 'src', 'lib', 'imageWidths.json'), 'utf8'))
const WIDTHS = [...imageSizes, ...deviceSizes].sort((a, b) => a - b)

const walk = (dir) =>
  fs.existsSync(dir)
    ? fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
        const p = path.join(dir, e.name)
        return e.isDirectory() ? walk(p) : /\.(png|jpe?g|webp)$/i.test(e.name) ? [p] : []
      })
    : []

const files = DIRS.flatMap((d) => walk(path.join(PUBLIC, d)))
const manifest = {}
const keep = new Set()
const jobs = []

for (const file of files) {
  const src = '/' + path.relative(PUBLIC, file).split(path.sep).join('/')
  const hash = crypto.createHash('sha1').update(fs.readFileSync(file)).digest('hex').slice(0, 10)
  const { width } = await sharp(file).metadata()
  manifest[src] = { h: hash, w: width }
  const base = src.replace(/\.[a-z]+$/i, '')
  for (const w of new Set(WIDTHS.map((x) => Math.min(x, width)))) {
    const out = path.join(OUT, `${base}.${hash}.${w}.webp`)
    keep.add(out)
    if (!fs.existsSync(out)) jobs.push({ file, out, w, logo: /\.png$/i.test(file) })
  }
}

// a few at a time: sharp is itself multi-threaded
let done = 0
const run = async () => {
  for (let job = jobs.shift(); job; job = jobs.shift()) {
    fs.mkdirSync(path.dirname(job.out), { recursive: true })
    const tmp = `${job.out}.tmp`
    await sharp(job.file)
      .resize({ width: job.w, withoutEnlargement: true })
      // logos keep crisp edges and a clean alpha; screens are photographic enough for 84
      .webp(job.logo ? { quality: 90, alphaQuality: 100, effort: 5 } : { quality: 84, effort: 4 })
      .toFile(tmp)
    fs.renameSync(tmp, job.out)
    done++
  }
}
const total = jobs.length
await Promise.all(Array.from({ length: Math.max(2, Math.min(6, os.cpus().length)) }, run))

// drop pictures (or old versions of them) the site no longer uses
let removed = 0
for (const f of walk(OUT)) if (!keep.has(f)) fs.rmSync(f), removed++

fs.mkdirSync(path.dirname(MANIFEST), { recursive: true })
const sorted = Object.fromEntries(Object.keys(manifest).sort().map((k) => [k, manifest[k]]))
const json = JSON.stringify(sorted, null, 2) + '\n'
if (!fs.existsSync(MANIFEST) || fs.readFileSync(MANIFEST, 'utf8') !== json) fs.writeFileSync(MANIFEST, json)
console.log(`images: ${files.length} pictures, ${done}/${total} files made, ${removed} removed`)
