import { products, screensOf } from './products'

/**
 * Portfolio — the client work in the folder the client handed over (10 Oct 2026): the Insta Biz
 * Web and BluTec projects, each told from its own screen (figures are the ones those screens
 * state). Images in public/work, made from the folder by scripts/folder-media.mjs. Work
 * without a public address links to the service or solution it was built under.
 */

export const categories = ['Website Development', 'CRM Development', 'ERP Development', 'Automation'] as const
export type WorkCategory = (typeof categories)[number]

/** Short names for the categories, for the filter and the type band on the portfolio page. */
export const categoryLabel: Record<WorkCategory, string> = {
  'Website Development': 'Websites',
  'CRM Development': 'CRMs',
  'ERP Development': 'ERP & inventory',
  Automation: 'AI & automation',
}

export type Project = {
  name: string
  slug: string
  category: WorkCategory
  summary: string
  points: string[]
  image: string
  href: string
  cta: string
}

const p = (name: string, slug: string, category: WorkCategory, summary: string, points: string[], cta: string, href: string): Project => ({
  name,
  slug,
  category,
  summary,
  points,
  image: `/work/${slug}.webp`,
  href,
  cta,
})

const WEB = 'Website Development'
const CRM = 'CRM Development'
const ERP = 'ERP Development'
const AUTO = 'Automation'

const site = 'Visit website'
const crm = ['CRM services', '/services#crm'] as const
const odoo = ['Odoo services', '/odoo-implementation-company-in-ahmedabad'] as const
const solution = (slug: string) => ['See the solution', `/solutions/${slug}`] as const

export const projects: Project[] = [
  /* websites */
  p(
    'Doclinks',
    'doclinks',
    WEB,
    'Healthcare platform to find the right doctors near you and book appointments online — verified specialists, real reviews and instant confirmations.',
    ['Trusted by 50,000+ patients', 'Verified doctors', 'Instant booking'],
    site,
    'https://doclinks.in/',
  ),
  p(
    'Grand Sud',
    'grand-sud',
    WEB,
    'Website for a management & tourism school in France since 1991 — school, courses, student life and businesses, with applications and brochures.',
    ['School since 1991', 'Courses & student life', 'Apply & brochure flows'],
    site,
    'https://grand-sud.fr/',
  ),
  p(
    'Best Sports Bars',
    'best-sports-bars',
    WEB,
    'Sports bar discovery platform — find fan-favourite game-day venues near you or wherever you go, with city directories and blogs.',
    ['17,943+ bars', '5,238+ cities', 'Location-aware search'],
    site,
    'https://bestsportsbars.net/',
  ),
  p(
    'Tender Source India',
    'tender-source-india',
    WEB,
    'India’s #1 tender consultancy platform — search live tenders and GeM results with smart filters, and get support to win more of them.',
    ['60K+ live tenders', 'AI-powered search', 'GeM services'],
    site,
    'https://www.tendersource.co.in/',
  ),
  p(
    'EstatRent',
    'estatrent',
    WEB,
    'Real estate marketplace to buy, sell or rent with confidence — over 50,000 verified properties, zero brokerage and support around the clock.',
    ['50K+ properties listed', '10K+ happy customers', 'Zero brokerage'],
    site,
    'https://www.estatrent.com/',
  ),
  p(
    'Visiolux Studio',
    'visiolux-studio',
    WEB,
    'Site for a hyper-realistic CGI studio — product visuals rendered once at full resolution, then reframed for every placement from marketplace to banner.',
    ['Hyper-realistic CGI', 'One visual, every format', 'Selected work'],
    site,
    'https://visioluxstudio.com/',
  ),
  p(
    'Novel Centre',
    'novel-centre',
    WEB,
    'Reading platform for original fiction — weekly picks, a personal library, rankings, reader profiles with badges, and a clean chapter reader.',
    ['Library & rankings', 'Reader profiles & badges', 'Chapter reader'],
    site,
    'https://novelcentre.com/',
  ),
  p(
    'Hindland Infrastructure',
    'hindland',
    WEB,
    'EPC and industrial infrastructure website — CHP systems, structural fabrication, piping works and solar EPC projects for India’s growth.',
    ['EPC & infrastructure', 'Projects & machinery', 'Quote requests'],
    site,
    'https://hindland.in/',
  ),
  p(
    'Saarthium',
    'saarthium',
    WEB,
    'Business funding partner from Ahmedabad — company setup, compliance, MSME loans, startup funding and investor connect, with a same-day eligibility check.',
    ['₹100Cr+ funds raised', '5,000+ happy clients', '70% approval rate'],
    site,
    'https://www.saarthium.com/',
  ),
  p(
    'PropertyMilan',
    'propertymilan',
    WEB,
    'Property platform to buy, rent and find new launches — verified property visits and rent agreement support across four Gujarat cities.',
    ['Verified property visits', 'Free property posting', 'Four Gujarat cities'],
    site,
    'https://www.propertymilan.com/',
  ),
  p(
    'NKS Apparel',
    'nks-apparel',
    WEB,
    'Fashion storefront with an editorial look — new-season collections, shop by category, wishlist and cart.',
    ['New-season collections', 'Wishlist & cart', 'Editorial design'],
    site,
    'https://nks-apparel.vercel.app/',
  ),
  p(
    'Build With Chintan',
    'build-with-chintan',
    WEB,
    'Renovation and construction website for Ontario — residential, commercial and hospitality work, project galleries and estimate requests.',
    ['Project galleries', 'Ontario coverage', 'Estimate requests'],
    site,
    'https://buildwithchintan.ca/',
  ),
  p(
    'Splendid Tech',
    'splendid-tech',
    WEB,
    'Career support for international students in the U.S. — end-to-end job search, from role clarity to a signed offer.',
    ['350+ students placed', '4.9/5 student rating', 'Free strategy call'],
    site,
    'https://splendid.blutec.ai/',
  ),
  p(
    'AKP ArkUrja',
    'akp-arkurja',
    WEB,
    'Solar EPC website — innovative solar energy solutions that help homes and businesses generate clean energy and cut electricity costs.',
    ['150+ solar installations', 'Up to 90% energy saved', 'Lead capture'],
    site,
    'https://akpventures.com/',
  ),
  p(
    'SetuBridge Solutions',
    'setubridge',
    WEB,
    'MSME startup advisory website — compliance guidance and funding solutions across 28+ states, with zero hidden fees.',
    ['700+ businesses helped', '85% success rate', 'Free consultancy'],
    site,
    'https://www.setubridgesolutions.co.in/',
  ),
  p(
    'StartupStambh',
    'startupstambh',
    WEB,
    'MSME & startup consultancy website — see your funding roadmap before you apply, from scheme discovery to bank-ready documents.',
    ['Startup India & DPIIT', 'CGTMSE & MUDRA schemes', '24–48 hr response'],
    site,
    'https://startupstambh.com/',
  ),
  p(
    'VentureLink Advisory',
    'venturelink',
    WEB,
    'Government funding & MSME loan advisory — CGTMSE, PMEGP, Mudra, NAIFF and startup grants, assessed honestly before you apply.',
    ['4,000+ businesses supported', 'Eligibility check', 'Pan-India coverage'],
    site,
    'https://www.venturelinkadvisory.com/',
  ),
  p(
    'Saarthiom',
    'saarthiom',
    WEB,
    'Business funding consultancy — MSME loans, scheme-linked grants and investor capital, with the file built and the signatures chased for you.',
    ['19+ funding services', 'Bank-ready documentation', 'Free first consultation'],
    site,
    'https://www.saarthiom.com/',
  ),
  p(
    'SunPaz Consulting',
    'sunpaz',
    WEB,
    'Pan-India MSME consulting website — fast business funding in 48 hours, government grants, registrations and compliance.',
    ['Funding up to ₹50 lakh', '₹10Cr+ funded', '98% success rate'],
    site,
    'https://www.sunpazsupport.com/',
  ),
  p(
    'CashFlex',
    'cashflex',
    WEB,
    'Store to buy premium mobiles and tablets and sell your old device — latest models, best prices and fast delivery.',
    ['Sell your old device', 'Official warranty', 'Secure payment'],
    site,
    'https://cashflex.in/',
  ),
  p(
    'ReadyRoad',
    'readyroad',
    WEB,
    'Digital vehicle services platform — FASTag, QR safety tags and GPS trackers, bought online with secure Paytm checkout.',
    ['FASTag & QR tags', 'GPS trackers', '500+ vendors'],
    site,
    'https://www.readyroadassist247.com/',
  ),
  p(
    'Copper Social',
    'copper-social',
    WEB,
    'Marketing agency website — services, blog and the founder’s story behind The Unclogged Model, a framework built for real business outcomes.',
    ['10+ years in paid ads', 'Google, Meta & LinkedIn', 'Get-started funnel'],
    site,
    'https://coppersocial.ca/',
  ),
  p(
    'Mumbai Property',
    'mumbai-property',
    WEB,
    'Mumbai property portal — buy, rent or explore verified homes and commercial listings, connect with owners, brokers and developers.',
    ['Verified listings', 'Owners, brokers & developers', 'RERA info'],
    site,
    'https://mumbaiproperty.co.in/',
  ),

  /* CRMs */
  p(
    'Grand Sud South Asia CRM',
    'grand-sud-crm',
    CRM,
    'Admissions CRM for Grand Sud’s South Asia team — B2B agencies, students, interviews, agreements, payments and daily workspace reports.',
    ['B2B agency pipeline', 'Interviews & agreements', 'Fees & visa tracking'],
    ...solution('education-crm-software'),
  ),
  p(
    'Krishna Clinic',
    'krishna-clinic',
    CRM,
    'Pediatric rehabilitation clinic CRM — patients, assessments, attendance, invoices, progress reports and patient protocols.',
    ['Patient assessments', 'Attendance & billing', 'Progress reports'],
    'Visit CRM',
    'https://krishnaclinic.blutec.ai/',
  ),
  p(
    'BluTec OS',
    'blutec-os',
    CRM,
    'BluTec’s own operating desk — today’s work queues, service calendar, projects, pipeline, sales orders, invoices and collections.',
    ['My Desk work queues', 'Pipeline & follow-ups', 'Invoices & collections'],
    'Visit CRM',
    'https://os.blutec.ai/',
  ),
  p(
    'KreddyKing',
    'kreddyking',
    CRM,
    'Lead follow-up CRM for real estate — leads, callbacks, site visits and a property ERP, with automated redials through BluTec Echo.',
    ['Callbacks & site visits', 'Property ERP', 'Echo AI dialling'],
    ...solution('real-estate-crm-software'),
  ),
  p(
    'Bajaj Solaar',
    'bajaj-solaar',
    CRM,
    'Solar installer CRM — leads, surveys, dispatch, installations, inspections and tickets, with pipeline, stage and funnel analytics.',
    ['Survey to installation', 'Pipeline by phase', 'Service tickets'],
    ...crm,
  ),
  p(
    'PMB Home Service Hub',
    'pmb',
    CRM,
    'Home services CRM — bookings, jobs, technicians on a live map, complaints and payouts, with a list of what to do next.',
    ['Live technician map', 'Jobs & bookings', 'Payouts & complaints'],
    ...crm,
  ),
  p(
    'CH Services',
    'ch-services',
    CRM,
    'Cooling & heating CRM — boiler services, chemicals and spare parts, from enquiry to quotation, invoice and payment.',
    ['Three business lines', 'Quotations & invoices', 'Enquiry analytics'],
    ...crm,
  ),
  p(
    'Your Tech Buddy',
    'your-tech-buddy',
    CRM,
    'Service business CRM — leads, service jobs, support tickets, AMC contracts, reminders and WhatsApp follow-ups.',
    ['Leads to service jobs', 'AMC contracts', 'WhatsApp & reminders'],
    'Visit CRM',
    'https://crm.yourtechbuddy.co.in/',
  ),
  p(
    'Ads Mark',
    'ads-mark',
    CRM,
    'Lead CRM for a marketing agency — pipeline, follow-ups, meetings and calls, with leads arriving from Meta Ads, Google Ads and webhooks.',
    ['Meta & Google Ads leads', 'Follow-ups & meetings', 'Call analytics'],
    ...crm,
  ),
  p(
    'MOS Immigration',
    'mos-immigration',
    CRM,
    'Visa & coaching CRM — leads, walk-ins, pipeline and registrations across branches, with leads by source and follow-ups due.',
    ['Visa & coaching leads', 'Walk-ins & registrations', 'Multi-branch'],
    'Visit CRM',
    'https://mos.instabizweb.com/',
  ),
  p(
    'On Road Immigration',
    'on-road-immigration',
    CRM,
    'Immigration leads CRM — B2C and B2B leads, statuses, counsellors and campaigns, with CSV import and export.',
    ['B2C & B2B leads', 'Counsellor assignment', 'CSV import & export'],
    ...solution('visa-immigration-crm-software'),
  ),
  p(
    'World Access Tours',
    'world-access-tours',
    CRM,
    'Visa consultancy CRM — leads, recovery, documents, payments and visa submissions, with conversions and counsellor activity each day.',
    ['Visa submissions', 'Payment recovery', 'Counsellor dashboards'],
    ...solution('visa-immigration-crm-software'),
  ),
  p(
    'Prakash Gajra CA CRM',
    'prakash-gajra',
    CRM,
    'CA practice CRM — clients, work orders, documents, visitors, attendance and finance, with monthly revenue and invoice status.',
    ['Clients & work orders', 'Document registry', 'Revenue & invoices'],
    ...solution('ca-crm-software'),
  ),
  p(
    'Sharukkhan Kureshi & Co.',
    'sharukkhan-kureshi',
    CRM,
    'CA firm CRM — clients and their portal, work orders, timesheets, finance and HRMS, with billed against collected at a glance.',
    ['Client portal', 'Timesheets', 'Billed vs collected'],
    ...solution('ca-crm-software'),
  ),
  p(
    'Prudent Insurance',
    'prudent-insurance',
    CRM,
    'Insurance distribution CRM — policies, premiums, renewals, partners, agencies and commissions across branches.',
    ['Policies & renewals', 'Partner & agency masters', 'Commission tracking'],
    ...solution('insurance-crm-software'),
  ),
  p(
    'Brothers Film',
    'brothers-film',
    CRM,
    'Production house CRM — clients, shoot calendar, bookings, quotations and expenses, with revenue against profit by month.',
    ['Shoot bookings', 'Quotes & expenses', 'Revenue vs profit'],
    ...crm,
  ),
  p(
    'Rudra Glass & Hardware',
    'rudra-glass',
    CRM,
    'Project CRM for a glass & hardware firm — every job tracked from measurement to installation, in Gujarati, with customers and payments.',
    ['Measurement to installation', 'Gujarati-first', 'Payments'],
    ...crm,
  ),
  p(
    'Wood Paker',
    'wood-paker',
    CRM,
    'Odoo lead management for a packaging firm — salesperson performance, pipelines, follow-ups and leads from IndiaMART.',
    ['Salesperson performance', 'IndiaMART leads', 'Built on Odoo'],
    ...odoo,
  ),
  p(
    'INTICEDE',
    'inticede',
    CRM,
    'Sourcing CRM for an intimate-apparel buying house — leads, pipeline, follow-ups, samples, suppliers & factories and price lists.',
    ['Inquiry to sample to quote', 'Suppliers & factories', 'Price lists & templates'],
    ...crm,
  ),

  /* ERPs */
  p(
    'MARC Group',
    'marc-group',
    ERP,
    'Trading ERP — catalogue, sales, purchases, finance, accounting, HR and reports, with every daily task one tap from the dashboard.',
    ['Invoices to goods receipts', 'Finance & accounting', 'HR & reports'],
    ...solution('erp-software-development'),
  ),
  p(
    'Panache Trade Land',
    'panache',
    ERP,
    'Commodity trading ERP — stock by warehouse, grade mix, commodity signals, mandi-to-feed-mill P&L, loading and dispatch.',
    ['Stock by warehouse', 'Commodity signals', 'Feed mill P&L'],
    ...solution('erp-software-development'),
  ),
  p(
    'Reva Blisters',
    'reva-blisters',
    ERP,
    'Quotation ERP for a blister-packaging maker — cost calculator, moulds & dies, sheet materials, rate cards and approvals.',
    ['Cost calculator', 'Moulds & dies', 'Rate cards'],
    ...solution('manufacturing-crm-software'),
  ),
  p(
    'Orkay Tiles',
    'orkay-tiles',
    ERP,
    'Operations analytics for a tile maker — ordered against dispatched by factory, customer, sales team and order manager.',
    ['Factory analytics', 'Sales team reports', 'CSV export'],
    'Visit ERP',
    'https://live.orkaytiles.com/',
  ),
  p(
    'AVN MOS',
    'avn-mos',
    ERP,
    'Manufacturing operations system for AVN Commodities — incoming shipments, coils, inventory, transfers, production, job work and dispatch.',
    ['Incoming to dispatch', 'Coil inventory', 'Job work & production'],
    ...solution('manufacturing-crm-software'),
  ),
  p(
    'Indivaan',
    'indivaan',
    ERP,
    'Garment manufacturing ERP — procurement, job work, cutting, stitching, stage orders, made-to-order and quality control.',
    ['Cutting to stitching', 'Made-to-order', 'Quality control'],
    ...solution('manufacturing-crm-software'),
  ),
  p(
    'MEX Engineering',
    'mex-engineering',
    ERP,
    'HRMS & payroll for an engineering manufacturer — attendance, shifts, overtime, leave, payroll runs and statutory compliance.',
    ['Payroll runs', 'Attendance & shifts', 'Compliance calendar'],
    ...solution('hrms-payroll-software'),
  ),
  p(
    'Add-X Biotech',
    'add-x-biotech',
    ERP,
    'ERP for a biotech manufacturer — CRM, recipes & BOM, production orders, stock, sales and purchase in one system.',
    ['Recipes & BOM', 'Production orders', 'Sales & purchase'],
    ...solution('manufacturing-crm-software'),
  ),
  p(
    'SupplyRoots Exports',
    'supplyroots-exports',
    ERP,
    'Odoo ERP for an exporter — CRM, sales, repacking, warehouse & export, purchase, invoicing and inventory.',
    ['Repacking & loadings', 'Warehouse & export', 'Built on Odoo'],
    ...odoo,
  ),
  p(
    'Sahjanand Engineering',
    'sahjanand-engineering',
    ERP,
    'Odoo ERP for an engineering company — CRM, sales, invoicing, email marketing and employees, with sales analytics.',
    ['Sales analytics', 'Invoicing', 'Built on Odoo'],
    ...odoo,
  ),
  p(
    'Sawariya',
    'sawariya',
    ERP,
    'Manufacturing ERP — catalogue, sales, order and warehouse dispatch, purchases, manufacturing, finance, accounting and HR.',
    ['Order to dispatch', 'Manufacturing', 'Finance & HR'],
    ...solution('manufacturing-crm-software'),
  ),
  p(
    'Sri Suryakala Inventory',
    'sri-suryakala',
    ERP,
    'Inventory system for a safety-match manufacturer — GRN, material issue, finished goods, transfers and physical stock counts.',
    ['Raw to finished goods', 'Multi-warehouse', 'Physical stock count'],
    ...solution('inventory-management-software'),
  ),
  p(
    'NKS Store',
    'nks-store',
    ERP,
    'Point of sale and inventory for a fashion store — billing, size-wise stock, barcodes, bills and customers.',
    ['Billing (POS)', 'Size-wise stock', 'Barcodes'],
    ...solution('inventory-management-software'),
  ),
  p(
    'Achakan Rental ERP',
    'achakan-rental',
    ERP,
    'Retail ERP for a wedding-wear rental — designs available between delivery and return dates, bookings, tailors and measurements.',
    ['Availability by date', 'Bookings & history', 'Tailors & measurements'],
    ...solution('erp-software-development'),
  ),
  p(
    'The Rug Theory',
    'rug-theory',
    ERP,
    'ERP suite for a rug maker — sales orders, invoices, purchase, stock, warehouses, manufacturing orders and bills of materials.',
    ['Orders to invoices', 'Manufacturing & BOM', 'Multi-warehouse'],
    ...solution('erp-software-development'),
  ),
  p(
    'Odoo Import & Export',
    'odoo-import-export',
    ERP,
    'Odoo module for import and export operations — shipments, customs, documents, approvals and costs in one control centre.',
    ['Shipments & customs', 'Documents & approvals', 'Cost tracking'],
    ...odoo,
  ),
  p(
    'Odoo Logistics',
    'odoo-logistics',
    ERP,
    'Odoo logistics control tower — shipments, deliveries, on-time rate, revenue against cost and live shipment tracking.',
    ['Shipment tracking', 'On-time performance', 'Revenue vs cost'],
    ...odoo,
  ),

  /* AI & automation */
  p(
    'ConvrsAI',
    'convrsai',
    AUTO,
    'Lead validation automation — scrapes LinkedIn and company sites, runs deep research and applies your own rules before sales engages.',
    ['8-step validation', 'Perplexity AI research', 'Custom rule files'],
    site,
    'https://convrsai.com/',
  ),
  p(
    'VoiceAI',
    'voiceai',
    AUTO,
    'Enterprise AI calling platform — campaigns, leads, calls and analytics, phone numbers and outcome tracking at scale.',
    ['Bulk call campaigns', 'Call analytics', 'Outcome tracking'],
    'AI agents',
    '/services/ai-agent-development',
  ),
  p(
    'IVRMaster',
    'ivrmaster',
    AUTO,
    'IVR platform — campaigns, live monitor, lead lists, call logs and press-1 analytics for outbound IVR at scale.',
    ['IVR campaigns', 'Live monitor', 'Press-1 analytics'],
    'Explore automation',
    '/services#automation',
  ),
  p(
    'Mudra Yoga',
    'mudra-yoga',
    AUTO,
    'WhatsApp automation for a yoga studio — trial and payment reminders and scheduled templates, with every message on record.',
    ['Trial & payment reminders', 'Template schedule', 'Message history'],
    'Visit CRM',
    'https://yoga.blutec.ai/',
  ),
]

export const projectBySlug = (slug: string) => projects.find((x) => x.slug === slug)!

/** A screen of the work, for the moving walls (portfolio hero, homepage): the products, then sharp, full-size client screens. */
export type Showcase = { key: string; name: string; label: string; summary: string; image: string; href: string; cta: string }

export const showcase: Showcase[] = [
  ...products.map((x) => ({
    key: x.id,
    name: x.name,
    label: x.short,
    summary: x.summary,
    image: screensOf(x)[0],
    href: `/products#${x.id}`,
    cta: `Explore ${x.name}`,
  })),
  ...[
    'visiolux-studio',
    'doclinks',
    'grand-sud',
    'best-sports-bars',
    'novel-centre',
    'hindland',
    'panache',
    'tender-source-india',
    'saarthium',
    'nks-apparel',
    'krishna-clinic',
  ].map((slug) => {
    const x = projectBySlug(slug)
    return { key: slug, name: x.name, label: x.category, summary: x.summary, image: x.image, href: x.href, cta: x.cta }
  }),
]

/** Everything we have shipped: the products and the client work. */
export const productLines = products.length + projects.length

export const portfolioPage = {
  tag: 'Portfolio',
  tagNote: 'Real products. Real founders. Real outcomes.',
  h1: 'Work we’re proud to show. Results that speak.',
  intro:
    'Six years. 100+ products shipped. From clinic CRMs and factory ERPs to AI calling agents - every project below was built end-to-end by our team, with the founders we still work with today.',
  primary: 'Browse all work',
  secondary: 'Start your project',
  /** The hero's counts, rounded the way the site states its numbers. */
  figures: [
    { value: `${Math.floor(projects.length / 10) * 10}+`, label: 'projects' },
    { value: String(products.length), label: 'products' },
    { value: String(categories.length), label: 'categories' },
  ],
  products: {
    eyebrow: 'Our products',
  },
  /** The homepage's results. */
  spotlight: {
    title: 'The work we keep talking about',
    intro:
      'Highlights from platforms, websites and CRMs where we delivered measurable impact — from patients and properties to live tenders and game-day venues.',
  },
  all: {
    eyebrow: 'Client work',
    title: 'Filter by what you’re building',
    intro: 'Websites, CRMs, ERPs and AI automations we’ve shipped for clients across India, Europe, the UK, Canada and the U.S.',
  },
  close: {
    status: 'Start your project now',
    title: 'Your project, next on this page.',
    body: 'Every product you scrolled past started with a single founder and a single message. Send us yours - we’ll come back within 2 hours with timeline, scope, and a clear quote.',
    primary: 'Start your project',
    secondary: 'Explore services',
    call: { title: 'Free strategy call', note: '30 minutes · zero pitch' },
    email: { title: 'info@instabizweb.com', note: 'Reply within 2 hours' },
    whatsapp: { title: 'WhatsApp us', note: '+91 98981 24987' },
  },
}
