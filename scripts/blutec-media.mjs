#!/usr/bin/env node
/**
 * Product and portfolio images, taken from blutec.ai (its product pages and its portfolio,
 * 30 Sept 2026) and saved as WebP under public/products and public/portfolio.
 * Originals narrower than 960px are enlarged with a Lanczos filter so they hold up on 2x
 * screens; wider ones are capped at 1600px. Client work with a sharper source is no longer
 * taken from here: websites were captured from the live sites at 2x or taken from the
 * originals on instabizweb.com/portfolio, and apps show their Play Store screens (1 Oct 2026).
 *
 *   node scripts/blutec-media.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const SRC = 'https://www.blutec.ai/_next/static/media/'
const OUT = path.join(process.cwd(), 'public')

/** published path (without extension) → file on blutec.ai */
const FILES = {
  // products: each screen matches the feature of the same number on the product page
  'products/scout-logo': 'Scout_Logo.a43a026c.webp',
  'products/scout-1': 'scout_1.084c73a7.webp',
  'products/scout-2': 'scout_2.c42e300c.webp',
  'products/scout-3': 'scout_3.9e812288.webp',
  'products/scout-4': 'scout_4.8809e931.webp',
  'products/ping-logo': 'Ping_Logo.9e3b65ca.webp',
  'products/ping-1': 'Ping_1.c57869e2.webp',
  'products/ping-2': 'Ping_2.600d1917.webp',
  'products/ping-3': 'Ping_3.b2a1efb8.webp',
  'products/ping-4': 'Ping_4.fc3c3fec.webp',
  'products/ping-5': 'Ping_5.841ac7c4.webp',
  'products/ping-6': 'Ping_6.68770783.webp',
  'products/ping-7': 'Ping_7.5f0b083d.webp',
  'products/echo-logo': 'Echo_Logo.86ee0401.webp',
  'products/echo-1': 'Echo_1.a5c84418.webp',
  'products/echo-2': 'Echo_2.631231f9.webp',
  'products/echo-3': 'Echo_3.5a62cb50.webp',
  'products/echo-4': 'Echo_4.087c3d68.webp',
  'products/echo-5': 'Echo_5.012cff60.webp',
  'products/echo-6': 'Echo_6.94c6a016.webp',
  'products/dialer-logo': 'Connect_Logo.bfdd5a32.webp',
  'products/dialer-1': 'Connect_1.8731c6da.webp',
  'products/dialer-2': 'Connect_2.d812c38f.webp',
  'products/dialer-3': 'Connect_3.236f4fd4.webp',
  'products/dialer-4': 'Connect_4.304c71cf.webp',
  'products/dialer-5': 'Connect_5.d3778bd6.webp',
  'products/dialer-6': 'Connect_6.35605fad.webp',
  'products/dialer-7': 'Connect_7.37fa02ce.webp',
  // client work
  'portfolio/dhn': 'DHN.a50c65b2.webp',
  'portfolio/cashflex': 'Cashflex_new.53b41016.webp',
  'portfolio/carefix': 'Carefix_new.54e37dca.webp',
  'portfolio/egniol': 'Egniol_App.0c338e6d.webp',
  'portfolio/linkedin-lead-automation': 'Automation_1.237e9512.webp',
  'portfolio/indiamart-automation': 'Automation_2.d1eb475d.webp',
  'portfolio/whatsapp-automation': 'Automation_3.8e1ee0c7.webp',
  'portfolio/custom-workflow-automation': 'Automation_4.55d09ccb.webp',
  'portfolio/cottons-by-ridheera': 'Cottons.c083c9bb.webp',
  'portfolio/doclinks-crm': 'Doclinks_Crm.f1c339ae.webp',
  'portfolio/grand-sud': 'grandsud_CRM.1807036d.webp',
  'portfolio/krishna-clinic-crm': 'krishna.43aaed9e.webp',
  'portfolio/mudra-yoga': 'Mudra_New.d907874d.webp',
  'portfolio/wedding-rental-management': 'rental-management.149377e9.avif',
  'portfolio/orkay-tiles': 'Orkay.cbfcffcb.webp',
  'portfolio/odoo-crm-erp': 'odoo-crm.32d23d9f.avif',
  'portfolio/hindland-infrastructure': 'Hindland.6ddc031f.webp',
  'portfolio/7-planets': '7_planets.44fe51e3.webp',
}

for (const [out, file] of Object.entries(FILES)) {
  const res = await fetch(SRC + file, { headers: { 'user-agent': 'Mozilla/5.0 (media import)' } })
  if (!res.ok) throw new Error(`${file}: HTTP ${res.status}`)
  const input = Buffer.from(await res.arrayBuffer())
  const { width } = await sharp(input).metadata()
  let img = sharp(input)
  if (!out.endsWith('-logo')) {
    // ponytail: enlarging adds no detail, it only beats the browser's bilinear scaling; swap in 2x originals if they appear
    if (width < 960) img = img.resize({ width: Math.min(960, width * 2), kernel: 'lanczos3' }).sharpen({ sigma: 0.6 })
    else if (width > 1600) img = img.resize({ width: 1600 })
  }
  const dest = path.join(OUT, `${out}.webp`)
  fs.mkdirSync(path.dirname(dest), { recursive: true })
  const info = await img.webp({ quality: 82, effort: 5 }).toFile(dest)
  console.log(`${out.padEnd(38)} ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)}K  ← ${file}`)
}
