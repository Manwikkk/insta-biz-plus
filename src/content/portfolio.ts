import { products } from './products'

/**
 * Portfolio — the client work on blutec.ai/portfolio (30 Sept 2026), verbatim apart from
 * "we" for "BluTec", with its categories. Images in public/portfolio (scripts/blutec-media.mjs).
 */

export const categories = [
  'App Development',
  'Website Development',
  'CRM Development',
  'Automation',
  'Telegram Development',
  'Extension Development',
] as const
export type WorkCategory = (typeof categories)[number]

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

const p = (
  name: string,
  slug: string,
  category: WorkCategory,
  summary: string,
  points: string[],
  cta: string,
  href: string,
  image = slug,
): Project => ({ name, slug, category, summary, points, image: `/portfolio/${image}.webp`, href, cta })

export const projects: Project[] = [
  p(
    'Chennai Cabs',
    'chennai-cabs',
    'App Development',
    'Ride-hailing app widely used in Chennai — similar to Rapido, Ola, and Uber with separate rider and user apps.',
    ['15K+ user app downloads', '12K+ rider app downloads', '3.5K+ live users'],
    'View on Play Store',
    'https://play.google.com/store/apps/details?id=com.cabs.chennaicabs&hl=en',
  ),
  p(
    'DHN',
    'dhn',
    'App Development',
    'Digital health news app backed by the Government of UP — latest HealthTech news, trends, and policy updates.',
    ['17K+ downloads', '13K+ live users', 'India’s dedicated digital health platform'],
    'View on Play Store',
    'https://play.google.com/store/apps/details?id=com.dhn&hl=en',
  ),
  p(
    'CashFlex',
    'cashflex',
    'App Development',
    'Marketplace to buy and sell used electronics — mobiles, laptops, tablets, and accessories with verified listings.',
    ['Buy & sell used devices', 'Location-based listings', 'In-app chat & negotiation'],
    'View on Play Store',
    'https://play.google.com/store/apps/details?id=com.cashflex_user&hl=en',
  ),
  p(
    'Carefix',
    'carefix',
    'App Development',
    'On-demand home services app — book technicians for AC, appliance repair, plumbing, and more, similar to Urban Company.',
    ['Technician onboarding', 'Job requests & scheduling', 'Earnings tracking'],
    'View on Play Store',
    'https://play.google.com/store/apps/details?id=com.carefix_technician&hl=en',
  ),
  p(
    'Egniol',
    'egniol',
    'App Development',
    'MSME consultancy app — browse government schemes, apply, track status, and access business development services.',
    ['11K+ downloads', '1.5K+ live users', 'Grants, loans & registrations'],
    'View on Play Store',
    'https://play.google.com/store/apps/details?id=com.egniolapp&hl=en',
  ),
  p(
    'LinkedIn Lead Automation',
    'linkedin-lead-automation',
    'Automation',
    'Automated LinkedIn outreach and lead capture workflows — profile visits, connection requests, and CRM sync.',
    ['Lead list enrichment', 'Automated follow-ups', 'CRM handoff'],
    'Explore automation',
    '/services#automation',
  ),
  p(
    'IndiaMART Automation',
    'indiamart-automation',
    'Automation',
    'Capture and respond to IndiaMART inquiries automatically — route leads to CRM, WhatsApp, or sales dialer in real time.',
    ['Inquiry auto-capture', 'Instant lead routing', 'Zero manual copy-paste'],
    'Explore automation',
    '/services#automation',
  ),
  p(
    'WhatsApp Automation (Ping)',
    'whatsapp-automation',
    'Automation',
    'Bulk broadcasts, AI chatbot flows, template campaigns, and live inbox — our Ping platform powers WhatsApp automation end to end.',
    ['Meta-approved templates', 'AI chatbot builder', 'Agent inbox & analytics'],
    'View Ping',
    '/products#ping',
  ),
  p(
    'Custom Workflow Automation',
    'custom-workflow-automation',
    'Automation',
    'Automate approvals, data sync, notifications, and internal ops across spreadsheets, CRMs, ERPs, and SaaS tools.',
    ['Multi-tool integrations', 'AI-assisted triage', 'Admin panels & alerts'],
    'Explore automation',
    '/services#automation',
  ),
  p(
    'Cottons By Ridheera',
    'cottons-by-ridheera',
    'CRM Development',
    'Garment CRM for lead management, Meta ad sync, DTC order tracking, and WhatsApp broadcast — zero manual lead entry from campaigns.',
    ['Meta lead sync', 'DTC order tracking', 'WhatsApp message shooting'],
    'CRM services',
    '/services#crm',
  ),
  p(
    'Best Sports Bar',
    'best-sports-bar',
    'CRM Development',
    'UK & Canada sports bar web panel with CRM — seat booking, venue management, and fan-favorite bar discovery.',
    ['Seat booking flow', 'Bar management CRM', 'Multi-city directories'],
    'Visit website',
    'https://bestsportsbars.net/',
  ),
  p(
    'ConvrsAI',
    'convrsai',
    'CRM Development',
    'CRM + automation for lead qualification — validates business, buyer, and purchase intent before sales engages.',
    ['Deep web validation', 'AI email & voice qualification', 'Intent scoring'],
    'Visit website',
    'https://convrsai.com/',
  ),
  p(
    'Doclinks CRM',
    'doclinks-crm',
    'CRM Development',
    'Healthcare CRM for hospitals, clinics, labs, doctors, and patients — appointments, records, and operations in one stack.',
    ['Doctor & patient management', 'Hospital & lab modules', 'Appointment workflows'],
    'Visit website',
    'https://doclinks.in/',
  ),
  p(
    'Grand Sud',
    'grand-sud',
    'CRM Development',
    'Full university management system for France and India — student pipelines, interviews, mail, meetings, and multi-language support.',
    ['Student pipeline CRM', 'Interview & validation flows', 'Multi-language (FR/EN)'],
    'Visit website',
    'https://grand-sud.fr/',
  ),
  p(
    'Krishna Clinic CRM',
    'krishna-clinic-crm',
    'CRM Development',
    'Pediatric rehabilitation clinic CRM — patient management, attendance mapping, billing, invoicing, and therapy plans.',
    ['Patient & attendance tracking', 'Billing & invoicing', 'Doctor assignment'],
    'Visit CRM',
    'https://krishnaclinic.blutec.ai',
  ),
  p(
    'Mudra Yoga',
    'mudra-yoga',
    'CRM Development',
    'Yoga studio CRM — leads, members, packages, attendance, and auto WhatsApp follow-ups and renewal reminders.',
    ['Lead & member CRM', 'Auto WhatsApp follow-ups', 'Renewal reminders'],
    'Visit CRM',
    'https://yoga.blutec.ai/',
  ),
  p(
    'PropertyMilan',
    'propertymilan',
    'CRM Development',
    'Gujarat real estate platform with CRM — sellers list properties, buyers browse verified listings, and teams manage leads and inventory.',
    ['Verified property listings', 'Lead & inventory CRM', 'KYC-verified owners'],
    'Visit website',
    'https://www.propertymilan.com/',
  ),
  p(
    'Wedding Rental Management',
    'wedding-rental-management',
    'CRM Development',
    'Wedding clothing rental system with inventory management, order tracking, and AI-assisted operations.',
    ['Rental inventory', 'Order & booking flows', 'AI-powered ops'],
    'CRM services',
    '/services#crm',
  ),
  p(
    'Sarvam Art',
    'sarvam-art',
    'CRM Development',
    'Class management system — students, teachers, attendance, inventory, and scheduling in one admin panel.',
    ['Student & teacher CRM', 'Attendance tracking', 'Inventory management'],
    'Visit panel',
    'https://sarvam-art.instabizweb.com/login',
  ),
  p(
    'Tender Source India',
    'tender-source-india',
    'CRM Development',
    'Tender discovery and application panel — browse government and private tenders and apply from one dashboard.',
    ['Tender search & filters', 'Application tracking', 'Document management'],
    'Visit panel',
    'https://www.tendersource.co.in/l',
  ),
  p(
    'Orkay Tiles',
    'orkay-tiles',
    'CRM Development',
    'Manufacturing company CRM — inventory, orders, production tracking, and sales operations for tile manufacturing.',
    ['Inventory management', 'Order tracking', 'Sales & ops dashboard'],
    'Visit CRM',
    'https://live.orkaytiles.com/',
  ),
  p(
    'Odoo CRM & ERP',
    'odoo-crm-erp',
    'CRM Development',
    'We’re an Odoo partner — we implement and customize Odoo CRM, ERP, inventory, accounting, and HR modules for growing businesses.',
    ['Official Odoo partner', 'CRM + ERP modules', 'Custom workflows & integrations'],
    'CRM services',
    '/odoo-implementation-company-in-ahmedabad',
  ),
  p(
    'Acolyte Living',
    'acolyte-living',
    'Website Development',
    'Student accommodation platform widely used in the UK — find PGs, flats, and verified homes near universities.',
    ['UK student housing', 'Verified listings', 'Booking workflow'],
    'Visit website',
    'https://acolyteliving.com/',
  ),
  p(
    'AGI Money',
    'agi-money',
    'Website Development',
    'India’s first free HRMS with geo-tagged attendance and salary on demand — attendance, payroll, and employee requests in one app.',
    ['Free HRMS platform', 'Geo-tagged attendance', 'Salary on demand'],
    'Visit website',
    'https://www.agimoneey.com/',
  ),
  p(
    'AKP Ventures',
    'akp-ventures',
    'Website Development',
    'Solar EPC and clean energy website — rooftop solar, ground-mounted plants, O&M, and project consultation.',
    ['Solar EPC showcase', 'Project portfolio', 'Lead capture & quotes'],
    'Visit website',
    'https://akpventures.com/',
  ),
  p(
    'Build With Chintan',
    'build-with-chintan',
    'Website Development',
    'Premium renovation and construction website for the GTA — commercial, hospitality, and residential projects in Canada.',
    ['Project showcase', 'Service pages', 'Estimate requests'],
    'Visit website',
    'https://buildwithchintan.ca/',
  ),
  p(
    'ConvrsAI Website',
    'convrsai-website',
    'Website Development',
    'Marketing site for a revenue validation platform — lead trust scoring, AI qualification, and pipeline certainty.',
    ['Product marketing site', 'Demo booking flow', 'Case study layout'],
    'Visit website',
    'https://convrsai.com/',
    'convrsai',
  ),
  p(
    'Doclinks Website',
    'doclinks-website',
    'Website Development',
    'Healthcare discovery platform — find doctors, hospitals, clinics, and lab tests with verified listings across India.',
    ['Doctor & hospital search', '50K+ patients trust', 'Instant booking UX'],
    'Visit website',
    'https://doclinks.in/',
  ),
  p(
    'EstatRent',
    'estatrent',
    'Website Development',
    'Real estate marketplace to buy, sell, and rent properties with verified listings and zero brokerage positioning.',
    ['Buy, rent & commercial', 'Verified properties', 'Agent & owner flows'],
    'Visit website',
    'https://www.estatrent.com/',
  ),
  p(
    'Grand Sud Website',
    'grand-sud-website',
    'Website Development',
    'Management & tourism school website since 1991 — programs, campus life, international courses, and admissions.',
    ['Multi-program catalog', 'Admissions & events', 'FR/EN content'],
    'Visit website',
    'https://grand-sud.fr/',
  ),
  p(
    'Hindland Infrastructure',
    'hindland-infrastructure',
    'Website Development',
    'EPC and industrial infrastructure website — CHP systems, fabrication, piping, solar EPC, and O&M services across India.',
    ['EPC & infrastructure', 'Project showcase', 'Quote & contact flows'],
    'Visit website',
    'https://hindland.in/',
  ),
  p(
    'PropertyMilan Website',
    'propertymilan-website',
    'Website Development',
    'Gujarat-focused real estate platform — verified listings across Gandhinagar, Mehsana, Himatnagar, Modasa, and Palanpur.',
    ['Hyper-local Gujarat focus', 'Free listing for owners', 'KYC-verified sellers'],
    'Visit website',
    'https://www.propertymilan.com/',
    'propertymilan',
  ),
  p(
    'Saarthium',
    'saarthium',
    'Website Development',
    'MSME consultancy website — business funding, loan eligibility, and pan-India advisor support for growing companies.',
    ['Funding roadmap UX', 'Scheme discovery', 'Advisor-led consults'],
    'Visit website',
    'https://www.saarthium.com/',
  ),
  p(
    'Setu Bridge Solutions',
    'setu-bridge-solutions',
    'Website Development',
    'MSME funding guidance website — free consultancy, success stories, and loan scheme navigation for Indian businesses.',
    ['700+ businesses helped', 'Funding guidance', 'Consultancy booking'],
    'Visit website',
    'https://www.setubridgesolutions.co.in/',
  ),
  p(
    'Splendid Tech',
    'splendid-tech',
    'Website Development',
    'Career support for international students in the U.S. — end-to-end job search from role clarity to signed offer.',
    ['350+ students placed', 'Founder-led coaching', 'E-Verified company'],
    'Visit website',
    'https://splendid.blutec.ai/',
  ),
  p(
    'StartupStambh',
    'startupstambh',
    'Website Development',
    'MSME & startup consultancy website — registrations, DPIIT, GST, funding schemes, and digital services for Indian businesses.',
    ['500+ startups served', 'Scheme & funding hub', 'Pan-India support'],
    'Visit website',
    'https://startupstambh.com/',
  ),
  p(
    '7 Planets',
    '7-planets',
    'Telegram Development',
    'Telegram mining game bot — coin mining, wallet, leaderboard, invites, and real-time game slots with a space theme.',
    ['Telegram mini-game', 'Mining & wallet system', 'Leaderboard & referrals'],
    'Launch bot',
    'https://t.me/Planets_7_Bot',
  ),
  p(
    'Scout Chrome Extension',
    'scout-chrome-extension',
    'Extension Development',
    'BluTec Scout browser extension — extract business leads, emails, phones, and social profiles directly from Google Maps and websites.',
    ['One-click lead extraction', 'Website validation', 'Export to CSV'],
    'View Scout',
    '/products#scout',
  ),
]

export const projectBySlug = (slug: string) => projects.find((x) => x.slug === slug)!

/** A screen of the work, for the moving walls (portfolio hero, homepage): the products, then high-resolution client work. */
export type Showcase = { key: string; name: string; label: string; summary: string; image: string; href: string; cta: string }

export const showcase: Showcase[] = [
  ...products.map((x) => ({
    key: x.id,
    name: x.name,
    label: x.short,
    summary: x.summary,
    image: `/products/${x.id}-1.webp`,
    href: `/products#${x.id}`,
    cta: `Explore ${x.name}`,
  })),
  ...[
    'chennai-cabs',
    'propertymilan',
    'tender-source-india',
    'best-sports-bar',
    'acolyte-living',
    'convrsai',
    'estatrent',
    'sarvam-art',
    'wedding-rental-management',
    'linkedin-lead-automation',
    'scout-chrome-extension',
  ].map((slug) => {
    const x = projectBySlug(slug)
    return { key: slug, name: x.name, label: x.category, summary: x.summary, image: x.image, href: x.href, cta: x.cta }
  }),
]

/** Everything we have shipped: the four products and the client work. */
export const productLines = products.length + projects.length

export const portfolioPage = {
  tag: 'Portfolio',
  tagNote: 'Real products. Real founders. Real outcomes.',
  h1: 'Work we’re proud to show. Results that speak.',
  intro:
    'Six years. 100+ products shipped. From homegrown ride-hailing apps to AI calling agents - every project below was built end-to-end by our team, with the founders we still work with today.',
  primary: 'Browse all work',
  secondary: 'Start your project',
  products: {
    eyebrow: 'Our products',
    title: 'The work we keep talking about',
    intro: 'Our AI product stack — Scout, Ping, Echo, and Dialer — built for lead gen, WhatsApp automation, voice AI, and high-volume calling.',
    cta: 'Explore the products',
  },
  /** The homepage's results. */
  spotlight: {
    title: 'The work we keep talking about',
    intro:
      'Highlights from apps, platforms, and CRMs where we delivered measurable impact — from downloads and live users to operational scale.',
  },
  all: {
    eyebrow: 'Client work',
    title: 'Filter by what you’re building',
    intro: 'Apps, CRMs, websites, automations, Telegram bots, and browser extensions we’ve shipped for clients across India, Europe, UK, Canada, and the U.S.',
  },
  close: {
    status: 'Currently taking 2 new projects this month',
    title: 'Your project, next on this page.',
    body: 'Every product you scrolled past started with a single founder and a single message. Send us yours - we’ll come back within 2 hours with timeline, scope, and a clear quote.',
    primary: 'Start your project',
    secondary: 'Explore services',
    call: { title: 'Free strategy call', note: '30 minutes · zero pitch' },
    email: { title: 'info@instabizweb.com', note: 'Reply within 2 hours' },
    whatsapp: { title: 'WhatsApp us', note: '+91 98981 24987' },
  },
}
