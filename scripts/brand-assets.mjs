#!/usr/bin/env node
/**
 * Derives theme-aware brand assets from the original logo (public/brand/logo.png).
 * The mark and wordmark are never redrawn — only cropped, re-laid-out as a compact
 * header lockup, and recoloured for dark surfaces.
 *
 *   node scripts/brand-assets.mjs
 */
import sharp from 'sharp'
import path from 'node:path'

const ROOT = process.cwd()
const SRC = path.join(ROOT, 'public/brand/logo.png')
const OUT = path.join(ROOT, 'public/brand')
const APP = path.join(ROOT, 'src/app')

// Measured regions of the original 979×320 artwork.
const MARK = { left: 28, top: 18, width: 241, height: 281 }
const WORD = { left: 305, top: 85, width: 633, height: 74 }

const INK_DARK = [236, 234, 228] // warm white for text on dark surfaces

async function raw(input) {
  return sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
}

/** Recolour opaque pixels: text → warm white; navy → lifted navy (keeps teal as-is). */
async function darkVariant(buf, { textOnly = false } = {}) {
  const { data, info } = await raw(buf)
  for (let i = 0; i < data.length; i += 4) {
    const a = data[i + 3]
    if (!a) continue
    const r = data[i],
      g = data[i + 1],
      b = data[i + 2]
    const isTeal = g > 120 && b > 150 && r < 60
    if (textOnly || (!isTeal && r < 80 && b > 90 && g < 110)) {
      if (textOnly) {
        data[i] = INK_DARK[0]
        data[i + 1] = INK_DARK[1]
        data[i + 2] = INK_DARK[2]
      } else {
        // lift navy so it reads on near-black
        data[i] = Math.min(255, r + 26)
        data[i + 1] = Math.min(255, g + 44)
        data[i + 2] = Math.min(255, b + 70)
      }
    }
  }
  return sharp(data, { raw: info }).png().toBuffer()
}

const extract = (r) => sharp(SRC).extract(r).png().toBuffer()

async function main() {
  const mark = await extract(MARK)
  const word = await extract(WORD)
  const tagline = await extract({ left: 302, top: 175, width: 657, height: 54 })

  // Full logo (original artwork, trimmed).
  const full = await sharp(SRC).extract({ left: 20, top: 10, width: 950, height: 298 }).png().toBuffer()
  await sharp(full).toFile(path.join(OUT, 'logo-full-light.png'))
  {
    // dark: mark navy lifted, words to warm white
    const m = await darkVariant(mark)
    const w = await darkVariant(word, { textOnly: true })
    const t = await darkVariant(tagline, { textOnly: true })
    await sharp({ create: { width: 950, height: 298, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
      .composite([
        { input: m, left: MARK.left - 20, top: MARK.top - 10 },
        { input: w, left: WORD.left - 20, top: WORD.top - 10 },
        { input: t, left: 302 - 20, top: 175 - 10 },
      ])
      .png()
      .toFile(path.join(OUT, 'logo-full-dark.png'))
  }

  // Header lockup: mark scaled so the wordmark sits at ~45% of its height, centred.
  const markH = 164
  const markW = Math.round((MARK.width / MARK.height) * markH)
  const gap = 24
  const lockW = markW + gap + WORD.width
  const small = await sharp(mark).resize({ height: markH }).png().toBuffer()
  const lockup = (m, w) =>
    sharp({ create: { width: lockW, height: markH, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
      .composite([
        { input: m, left: 0, top: 0 },
        { input: w, left: markW + gap, top: Math.round((markH - WORD.height) / 2) + 2 },
      ])
      .png()
  await lockup(small, word).toFile(path.join(OUT, 'lockup-light.png'))
  await lockup(await darkVariant(small), await darkVariant(word, { textOnly: true })).toFile(path.join(OUT, 'lockup-dark.png'))

  // Mark only.
  await sharp(mark).toFile(path.join(OUT, 'mark.png'))
  await sharp(await darkVariant(mark)).toFile(path.join(OUT, 'mark-dark.png'))

  // App icons (Next file conventions).
  const square = async (size, bg, pad) => {
    const inner = Math.round(size * (1 - pad * 2))
    const m = await sharp(mark).resize({ height: inner, width: inner, fit: 'inside' }).png().toBuffer()
    const meta = await sharp(m).metadata()
    return sharp({ create: { width: size, height: size, channels: 4, background: bg } })
      .composite([{ input: m, left: Math.round((size - meta.width) / 2), top: Math.round((size - meta.height) / 2) }])
      .png()
  }
  await (await square(512, { r: 0, g: 0, b: 0, alpha: 0 }, 0.04)).toFile(path.join(APP, 'icon.png'))
  await (await square(180, { r: 242, g: 240, b: 234, alpha: 1 }, 0.16)).toFile(path.join(APP, 'apple-icon.png'))

  console.log('brand assets written:', { lockup: `${lockW}×${markH}` })
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
