#!/usr/bin/env node
/**
 * The project and product screens and every logo, from the "all data" folder the client
 * handed over (10 Oct 2026), prepared for the site:
 *   - screens → public/work/<slug>.webp and public/products/<id>-site.webp (+ one-2): the whole
 *     screenshot (never cropped, never enlarged), capped at 2560px wide, WebP at quality 92
 *   - product logos → public/products/logos/<id>.webp, lossless
 *   - client logos → public/clients/<slug>.png + src/content/generated/logos.json: flat
 *     backgrounds cleared, empty padding trimmed, sized for 2x screens, with each logo's shape
 *     so every logo can be set at the same optical size, and the plate colour for logos drawn
 *     for a dark ground
 * Every path is new rather than an old file overwritten: optimised images are cached by URL
 * and never invalidated, so a reused name could keep showing the old picture.
 * EstatRent's screen in the folder is 640px wide; public/work/estatrent.webp is a 2000px
 * capture of the same page, so it stays.
 *
 *   node scripts/folder-media.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const ROOT = process.cwd()
const SRC = path.join(ROOT, 'all data')
const PUBLIC = path.join(ROOT, 'public')
const MANIFEST = path.join(ROOT, 'src', 'content', 'generated', 'logos.json')
// one of the screenshots is 16668px square
const open = (file) => sharp(path.join(SRC, file), { limitInputPixels: false })

/** published path (without extension) → screenshot in the folder, or { file, extract } to take part of it */
const SCREENS = {
  // products: <id>-site is the product's own site, <id>-2 onwards its app screens (scripts/blutec-media.mjs)
  'products/scout-site': 'Blutec/product/scout.png',
  // taller than the products' frames (1200:647): cut to that shape just above the chat bubble, the
  // side margins trimmed so the nav stays centred, so it fills its frame with no bars
  'products/ping-site': { file: 'Blutec/product/Ping.png', extract: { left: 40, top: 0, width: 2771, height: 1494 } },
  // echo-site is not taken from here: the folder's copy is the French page, so the English one
  // was captured from echoplus.blutec.ai (14 Oct 2026)
  'products/dialer-site': 'Blutec/Connect.png',
  'products/one-site': 'Blutec/product/BluTecONE All-in-One Workspace.png',
  'products/one-2': 'Blutec/Blutec one.png',
  // client work
  'work/marc-group': 'Instabizweb/MARC-Group-Inventory-10-10-2026_01_03_PM.png',
  'work/panache': 'Instabizweb/Panache Group Trade Dashboard.png',
  'work/reva-blisters': 'Instabizweb/Reva-Blisters-ERP-10-10-2026_01_04_PM.png',
  'work/propertymilan': 'Instabizweb/Screenshot 2026-10-10 at 1.41.37 PM.png',
  'work/novel-centre': 'Instabizweb/Screenshot 2026-10-10 at 12.32.52 PM.png',
  'work/achakan-rental': 'Instabizweb/achakan-wedding.png',
  'work/add-x-biotech': 'Instabizweb/adx.jpeg',
  'work/best-sports-bars': 'Instabizweb/best sports bar.png',
  'work/brothers-film': 'Instabizweb/brotherfilm_crm.png',
  'work/build-with-chintan': 'Instabizweb/build with chintan logo.png',
  'work/cashflex': 'Instabizweb/cashflex.jpeg',
  'work/copper-social': 'Instabizweb/copeer social.jpeg',
  'work/prudent-insurance': 'Instabizweb/cornfincap-policy.png',
  'work/hindland': 'Instabizweb/hindland.png',
  'work/odoo-import-export': 'Instabizweb/import_export.png',
  'work/inticede': 'Instabizweb/inticede_erp.png',
  'work/supplyroots-exports': 'Instabizweb/isupplyroot_erp.png',
  'work/ivrmaster': 'Instabizweb/ivrmaster.jpeg',
  'work/odoo-logistics': 'Instabizweb/logistic.png',
  'work/mos-immigration': 'Instabizweb/mos_crm.png',
  'work/nks-store': 'Instabizweb/nka-inventory -pos.png',
  'work/nks-apparel': 'Instabizweb/nks.png',
  'work/on-road-immigration': 'Instabizweb/onroad.jpeg',
  'work/readyroad': 'Instabizweb/ready road.jpeg',
  'work/rudra-glass': 'Instabizweb/rudra glass.png',
  'work/rug-theory': 'Instabizweb/rug theraphy.png',
  'work/saarthium': 'Instabizweb/saarthium.png',
  'work/sahjanand-engineering': 'Instabizweb/sahjanand_erp.png',
  'work/sharukkhan-kureshi': 'Instabizweb/sarukhan cacrm.png',
  'work/sawariya': 'Instabizweb/savariya.png',
  'work/setubridge': 'Instabizweb/setu website.png',
  'work/startupstambh': 'Instabizweb/startup stambh.png',
  'work/sunpaz': 'Instabizweb/sunpax.jpeg',
  'work/sri-suryakala': 'Instabizweb/suryakala-inventory.png',
  'work/tender-source-india': 'Instabizweb/tendor.png',
  'work/venturelink': 'Instabizweb/venture link.png',
  'work/visiolux-studio': 'Instabizweb/visulox-studio.png',
  'work/voiceai': 'Instabizweb/voiceai.jpeg',
  'work/wood-paker': 'Instabizweb/woodpaker_erp.png',
  'work/world-access-tours': 'Instabizweb/world tour visa.png',
  'work/ads-mark': 'Blutec/Ads marks.png',
  'work/blutec-os': 'Blutec/Blutec Os.png',
  'work/ch-services': 'Blutec/CHS.png',
  'work/saarthiom': 'Blutec/Saarthiom.png',
  'work/akp-arkurja': 'Blutec/akp.jpeg',
  'work/avn-mos': 'Blutec/avn.jpeg',
  'work/bajaj-solaar': 'Blutec/bajajsolar.png',
  'work/prakash-gajra': 'Blutec/ca-crm.png',
  'work/convrsai': 'Blutec/conversaiautomatioon.jpeg',
  'work/doclinks': 'Blutec/doclinks.png',
  'work/grand-sud': 'Blutec/grandsudwebsite.png',
  'work/indivaan': 'Blutec/indivaan.png',
  'work/kreddyking': 'Blutec/kreddyking.jpeg',
  'work/krishna-clinic': 'Blutec/krishna clinic.png',
  'work/mex-engineering': 'Blutec/mexengineering.png',
  'work/mudra-yoga': 'Blutec/mudra-das.jpeg',
  'work/mumbai-property': 'Blutec/mumbai property.png',
  'work/orkay-tiles': 'Blutec/orkaytile.jpeg',
  'work/pmb': 'Blutec/pmb.png',
  'work/grand-sud-crm': 'Blutec/southasiacrm.png',
  'work/splendid-tech': 'Blutec/splendid.png',
  'work/your-tech-buddy': 'Blutec/your tech buddy.jpeg',
}

/** product → its logo in the folder (the dark-ink version: product logos sit on a white pill) */
const PRODUCT_LOGOS = {
  scout: 'Blutec-customer/product/logo.png',
  ping: 'Blutec-customer/product/Ping New logo (1).png',
  echo: 'Blutec-customer/product/echowhite.png',
  dialer: 'Blutec-customer/product/logo-black.png',
  one: 'Blutec-customer/product/blutec_black.png',
}

/**
 * name    — the brand as src/content/home.ts names it
 * clear   — flood-fill a flat background away from the edges
 * plate   — the colour a logo drawn for a dark ground sits on ('auto': the colour that was cleared)
 * extract — keep only this box of the file (a stray fragment and a frame line sit outside it)
 * Logos that are a badge on their own ground (a photo, a texture) are kept whole.
 */
const LOGOS = [
  { slug: 'tender-source-india', name: 'Tender Source India', file: 'Instabizweb-logos/3.png' },
  { slug: 'voiceai', name: 'VoiceAI', file: 'Instabizweb-logos/4ab85c95-d132-4d66-bc20-79fd0f598d15.png', clear: true },
  { slug: 'ivrmaster', name: 'IVRMaster', file: 'Instabizweb-logos/5e5a9c1a-0405-4733-969a-4c4b32a883cc.png', clear: true },
  { slug: 'copper-social', name: 'Copper Social', file: 'Instabizweb-logos/Copper Social Logo-PNG.avif' },
  { slug: 'hindland', name: 'Hindland', file: 'Instabizweb-logos/Hindland_Logo_Transparent.webp' },
  { slug: 'inticede', name: 'INTICEDE', file: 'Instabizweb-logos/INTICEDE LOGO-01(3).png' },
  { slug: 'nks-apparel', name: 'NKS Apparel', file: 'Instabizweb-logos/NKS Apparel Luxury Monogram.png', clear: true, plate: 'auto' },
  { slug: 'novel-centre', name: 'Novel Centre', file: 'Instabizweb-logos/Novel_Center_Logo.png', clear: true },
  { slug: 'best-sports-bars', name: 'Best Sports Bars', file: 'Instabizweb-logos/Sports_Bar_Logo.avif' },
  { slug: 'visiolux-studio', name: 'Visiolux Studio', file: 'Instabizweb-logos/VISIOLUX STUDIO LOGO-01 (1).png' },
  { slug: 'add-x-biotech', name: 'Add-X Biotech', file: 'Instabizweb-logos/adx.png', clear: true },
  { slug: 'bharat-edge', name: 'Bharat Edge', file: 'Instabizweb-logos/bharatedge.png' },
  { slug: 'brothers-film', name: 'Brothers Film', file: 'Instabizweb-logos/brothers-film-logo.png', clear: true },
  { slug: 'build-with-chintan', name: 'Build With Chintan', file: 'Instabizweb-logos/build_with_chintan.webp' },
  { slug: 'cashflex', name: 'CashFlex', file: 'Instabizweb-logos/cashflex.png' },
  { slug: 'enego', name: 'Enego', file: 'Instabizweb-logos/enego.avif' },
  { slug: 'estatrent', name: 'EstatRent', file: 'Instabizweb-logos/estate-logo.png' },
  { slug: 'carefix', name: 'Carefix', file: 'Instabizweb-logos/gigwell logo.png', plate: '#111111' },
  { slug: 'grow-more', name: 'Grow More', file: 'Instabizweb-logos/growmore.png' },
  { slug: 'marc-group', name: 'MARC Group', file: 'Instabizweb-logos/marc.png' },
  { slug: 'mos-immigration', name: 'MOS Immigration', file: 'Instabizweb-logos/mos.png', clear: true },
  { slug: 'on-road-immigration', name: 'On Road Immigration', file: 'Instabizweb-logos/onroad.png' },
  // black bars above and below the green
  { slug: 'panache', name: 'Panache', file: 'Instabizweb-logos/panache_logo.jpeg', extract: { left: 0, top: 41, width: 1080, height: 1078 }, clear: true, plate: 'auto' },
  // its own header navy (propertymilan.com)
  { slug: 'propertymilan', name: 'PropertyMilan', file: 'Instabizweb-logos/property_milan.webp', plate: '#152b6f' },
  { slug: 'readyroad', name: 'ReadyRoad', file: 'Instabizweb-logos/readyroad.webp', clear: true },
  { slug: 'reva-blisters', name: 'Reva Blisters', file: 'Instabizweb-logos/reva-logo.png' },
  { slug: 'rudra-glass', name: 'Rudra Glass', file: 'Instabizweb-logos/rudra_logo.jpeg', clear: true },
  { slug: 'saarthium', name: 'Saarthium', file: 'Instabizweb-logos/saarthium logo.avif' },
  {
    slug: 'sahjanand-engineering',
    name: 'Sahjanand Engineering',
    file: 'Instabizweb-logos/sahjanand_logo.png',
    extract: { left: 0, top: 0, width: 1004, height: 690 },
    clear: true,
  },
  { slug: 'satya-support', name: 'Satya Support', file: 'Instabizweb-logos/satysupport.png' },
  { slug: 'sawariya', name: 'Sawariya', file: 'Instabizweb-logos/sawariya.png' },
  { slug: 'setubridge', name: 'SetuBridge', file: 'Instabizweb-logos/setu logo.webp' },
  { slug: 'sharukkhan-kureshi', name: 'Sharukkhan Kureshi & Co.', file: 'Instabizweb-logos/sharukhaan logo.jpeg', clear: true },
  // a 4px frame round the green
  { slug: 'shubh-vivah', name: 'Shubh Vivah', file: 'Instabizweb-logos/shubh vivah.jpeg', extract: { left: 6, top: 6, width: 1588, height: 788 }, clear: true, plate: 'auto' },
  { slug: 'startupstambh', name: 'StartupStambh', file: 'Instabizweb-logos/startupstambh.webp', clear: true },
  // a hairline frame round the black
  { slug: 'studybridge', name: 'StudyBridge', file: 'Instabizweb-logos/study bridge visa.jpeg', extract: { left: 2, top: 2, width: 1596, height: 1099 }, clear: true, plate: 'auto' },
  { slug: 'sunpaz', name: 'SunPaz', file: 'Instabizweb-logos/sunpaz.png' },
  { slug: 'supplyroots-exports', name: 'SupplyRoots Exports', file: 'Instabizweb-logos/supplyrootsexports_logo.jpg.jpeg', clear: true },
  { slug: 'sri-suryakala', name: 'Sri Suryakala', file: 'Instabizweb-logos/suryakala.png', plate: '#16181d' },
  { slug: 'venturelink', name: 'VentureLink', file: 'Instabizweb-logos/venturelink-symbol.avif' },
  { slug: 'wood-paker', name: 'Wood Paker', file: 'Instabizweb-logos/woodpacker_logo.jpeg', clear: true },
  { slug: 'world-access-tours', name: 'World Access Tours', file: 'Instabizweb-logos/world tour.png', plate: '#16181d' },
  { slug: 'zaverat', name: 'Zaverat', file: 'Instabizweb-logos/zaveratthejeweller_logo.jpeg' },
  { slug: '7-planets', name: '7 Planets', file: 'Blutec-customer/7plogo.webp' },
  { slug: 'akp-arkurja', name: 'AKP ArkUrja', file: 'Blutec-customer/AKP_Ventures.webp' },
  { slug: 'cottons', name: 'Cottons by Rudheera', file: 'Blutec-customer/Cottons_Logo.jpg.jpeg', clear: true },
  { slug: 'doclinks', name: 'Doclinks', file: 'Blutec-customer/Dock-logo.png' },
  { slug: 'anubbha', name: 'Dr. Anubbha’s Homeopathy', file: 'Blutec-customer/anubha.webp' },
  { slug: 'ch-services', name: 'CH Services', file: 'Blutec-customer/app-icon-512.png' },
  { slug: 'bajaj-solaar', name: 'Bajaj Solaar', file: 'Blutec-customer/bajaj-logo.jpeg', clear: true },
  { slug: 'convrsai', name: 'ConvrsAI', file: 'Blutec-customer/convrsai-logo.webp' },
  { slug: 'indivaan', name: 'Indivaan', file: 'Blutec-customer/indivaan-logo.png' },
  { slug: 'kreddyking', name: 'KreddyKing', file: 'Blutec-customer/kreddy_king.jpg', clear: true },
  { slug: 'krishna-clinic', name: 'Krishna Clinic', file: 'Blutec-customer/krishnalogo.png' },
  // a red badge edge to edge: it sits on its own red
  { slug: 'grand-sud', name: 'Grand Sud', file: 'Blutec-customer/logo.jpg', plate: '#db4a39' },
  { slug: 'ads-mark', name: 'Ads Mark', file: 'Blutec-customer/logo.webp' },
  { slug: 'mex-engineering', name: 'MEX Engineering', file: 'Blutec-customer/mex-mark.png' },
  { slug: 'mudra-yoga', name: 'Mudra Yoga', file: 'Blutec-customer/mudra-logo.png' },
  { slug: 'mumbai-property', name: 'Mumbai Property', file: 'Blutec-customer/mumbai poroperty.png' },
  { slug: 'saarthiom', name: 'Saarthiom', file: 'Blutec-customer/og-logo.png', plate: '#0d1b2a' },
  { slug: 'orkay-tiles', name: 'Orkay Tiles', file: 'Blutec-customer/orkaylogo.png' },
  { slug: 'pmb', name: 'PMB', file: 'Blutec-customer/pmb-logo.png' },
  { slug: 'prakash-gajra', name: 'Prakash Gajra', file: 'Blutec-customer/prakashgajra-logo-png.png' },
  { slug: 'splendid-tech', name: 'Splendid Tech', file: 'Blutec-customer/splendid_logo.png' },
]

const hex = (rgb) => '#' + rgb.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('')

async function raw(img) {
  const { data, info } = await img.ensureAlpha().raw().toBuffer({ resolveWithObject: true })
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

/** How much of the box the artwork covers. */
function ink({ data, W, H }) {
  let cover = 0
  for (let i = 3; i < data.length; i += 4) cover += data[i] / 255
  return cover / (W * H)
}

const kb = (n) => `${(n / 1024).toFixed(0)}K`

// screens
for (const [out, src] of Object.entries(SCREENS)) {
  const { file, extract } = typeof src === 'string' ? { file: src } : src
  const dest = path.join(PUBLIC, `${out}.webp`)
  fs.mkdirSync(path.dirname(dest), { recursive: true })
  let img = open(file).rotate()
  if (extract) img = img.extract(extract)
  const info = await img
    .resize({ width: 2560, withoutEnlargement: true })
    .webp({ quality: 92, effort: 6, smartSubsample: true })
    .toFile(dest)
  console.log(`${out.padEnd(34)} ${`${info.width}x${info.height}`.padEnd(10)} ${kb(info.size).padStart(5)}  ← ${file}`)
}

// product logos
fs.mkdirSync(path.join(PUBLIC, 'products', 'logos'), { recursive: true })
for (const [id, file] of Object.entries(PRODUCT_LOGOS)) {
  const info = await open(file)
    .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 10 })
    .resize({ height: 160, withoutEnlargement: true })
    .webp({ lossless: true, effort: 6 })
    .toFile(path.join(PUBLIC, 'products', 'logos', `${id}.webp`))
  console.log(`products/logos/${id}`.padEnd(34), `${info.width}x${info.height}`.padEnd(10), kb(info.size).padStart(5), ' ←', file)
}

// client logos
const OUT_DIR = path.join(PUBLIC, 'clients')
fs.rmSync(OUT_DIR, { recursive: true, force: true })
fs.mkdirSync(OUT_DIR, { recursive: true })
fs.mkdirSync(path.dirname(MANIFEST), { recursive: true })
const manifest = {}
for (const src of LOGOS) {
  let input = open(src.file)
  if (src.extract) input = input.extract(src.extract)
  // logos far larger than they are shown are brought down first, so the fill and trim stay quick
  const img = await raw(input.resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true }))
  let plate = src.plate && src.plate !== 'auto' ? src.plate : null
  if (src.clear) {
    const bg = clearBackground(img)
    if (src.plate === 'auto') plate = hex(bg)
  }
  const trimmed = await sharp(await png(img)).trim({ background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 10 }).toBuffer()
  const out = await sharp(trimmed)
    .resize({ width: 560, height: 240, fit: 'inside', withoutEnlargement: true })
    .png({ compressionLevel: 9 })
    .toBuffer()
  const final = await raw(sharp(out))
  fs.writeFileSync(path.join(OUT_DIR, `${src.slug}.png`), out)
  manifest[src.name] = {
    src: `/clients/${src.slug}.png`,
    width: final.W,
    height: final.H,
    ink: Number(ink(final).toFixed(3)),
    plate,
    source: src.file,
  }
  console.log(`${src.slug.padEnd(22)} ${`${final.W}x${final.H}`.padEnd(8)} ink ${ink(final).toFixed(2)}  plate ${plate ?? '-'}  ← ${src.file}`)
}
fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + '\n')
console.log('manifest →', path.relative(ROOT, MANIFEST))
