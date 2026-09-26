/**
 * The five services, numbered 01–05 in the order the site lists them. Mobile, AI, CRM and
 * Web are verbatim from website-content/services/index.md (detail) and homepage.md
 * (one-liners); Business Automation was written for the redesign (client brief) and has no
 * audited source. Digital Marketing and UI/UX Design are no longer offered. `part` maps each
 * service onto a piece of the IBW mark, which the site uses as its "growth engine" illustration.
 */

export type ServiceId = 'automation' | 'mobile' | 'ai' | 'crm' | 'web'
/** Pieces of the hexagon mark: three teal "flow" bars and two navy "structure" pieces. */
export type PartId = 'bar-top' | 'bar-mid' | 'bar-low' | 'frame-left' | 'core'

export type Service = {
  id: ServiceId
  n: string
  part: PartId
  label: string
  short: string
  /** Homepage "What we do" line. */
  line: string
  lineTech: string[]
  headline: string
  body: string
  deliverables: string[]
  tech: string[]
  cta: string
  avg: { value: string; label: string }
}

export const services: Service[] = [
  {
    id: 'automation',
    n: '01',
    part: 'bar-mid',
    label: 'Business Automation',
    short: 'Automation',
    line: 'Workflows and integrations that connect your tools and take repetitive work off your team.',
    lineTech: ['n8n', 'Make', 'Zapier'],
    headline: 'Business workflows that run themselves',
    body: 'Approvals, follow-ups, invoices and reports - automated across the tools you already use, so work moves without copy-paste.',
    deliverables: [
      'Process audit & automation roadmap',
      'Approvals, reminders & follow-ups on autopilot',
      'CRM, ERP, accounting & WhatsApp integrations',
      'Auto-generated invoices, documents & reports',
      'Live dashboards with alerts',
    ],
    tech: ['n8n', 'Make', 'Zapier', 'WhatsApp API', 'Webhooks'],
    cta: 'Start a business automation project',
    avg: { value: '30+', label: 'Hours saved weekly' },
  },
  {
    id: 'mobile',
    n: '02',
    part: 'bar-low',
    label: 'Mobile Apps',
    short: 'Mobile',
    line: 'iOS, Android & cross-platform apps that users love. From MVP to App Store launch.',
    lineTech: ['Flutter', 'React Native', 'Swift'],
    headline: 'iOS & Android apps users actually love',
    body: 'Cross-platform and native apps from MVP to App Store launch. Crash-free, beautifully animated, and built to scale to millions.',
    deliverables: [
      'Flutter, React Native & Swift',
      'Push, payments, deep linking, OTA updates',
      'Offline-first with smart sync',
      'Play Store + App Store launch support',
      'Analytics, crash reporting, A/B flags',
    ],
    tech: ['Flutter', 'React Native', 'Swift', 'Firebase', 'Expo'],
    cta: 'Start a mobile apps project',
    avg: { value: '10K+', label: 'App downloads (avg)' },
  },
  {
    id: 'ai',
    n: '03',
    part: 'frame-left',
    label: 'AI & Automation',
    short: 'AI',
    line: 'Custom chatbots, workflow automation & AI agents that save hours every day.',
    lineTech: ['GPT', 'n8n', 'LangChain'],
    headline: 'AI agents that save you 30+ hours a week',
    body: 'Custom chatbots, voice agents, and workflow automation that plug into your stack. Built on GPT, Claude, and open-source LLMs.',
    deliverables: [
      'Custom GPT / Claude / Llama agents',
      'n8n, Make, Zapier workflow automation',
      'WhatsApp, voice & email bots',
      'RAG over your private knowledge base',
      'Vector search with pgvector / Pinecone',
    ],
    tech: ['GPT-4', 'Claude', 'LangChain', 'n8n', 'Pinecone'],
    cta: 'Start an AI & automation project',
    avg: { value: '85%', label: 'Automation rate' },
  },
  {
    id: 'crm',
    n: '04',
    part: 'core',
    label: 'CRM & ERP',
    short: 'CRM',
    line: 'Odoo, Zoho, and custom-built systems that organize your business and unlock data.',
    lineTech: ['Odoo', 'Zoho', 'Custom'],
    headline: 'Custom CRM that fits your business',
    body: 'Odoo, Zoho and ground-up custom systems that organize sales, ops, and finance - and finally give you the data you need.',
    deliverables: [
      'Odoo modules + custom workflows',
      'Sales pipeline, inventory & invoicing',
      'Role-based access & approvals',
      'WhatsApp / Email / SMS integrations',
      'Real-time dashboards & exports',
    ],
    tech: ['Odoo', 'Zoho', 'PostgreSQL', 'Python', 'REST APIs'],
    cta: 'Start a CRM & ERP project',
    avg: { value: '4×', label: 'Faster ops' },
  },
  {
    id: 'web',
    n: '05',
    part: 'bar-top',
    label: 'Web Development',
    short: 'Web',
    line: 'Lightning-fast Next.js sites with conversion-focused UX. Built for SEO, speed, and scale.',
    lineTech: ['Next.js', 'React', 'Tailwind'],
    headline: 'Lightning-fast websites that convert',
    body: 'Marketing sites, SaaS dashboards, and storefronts built with modern stacks. Lighthouse 95+, SEO-ready, and hand-crafted UX.',
    deliverables: [
      'Next.js 16 / React 19 / Tailwind',
      'Server components & edge rendering',
      'Headless CMS (Sanity, Strapi, Contentful)',
      'Conversion-tuned UX with A/B tests',
      'Lighthouse 95+ on first deploy',
    ],
    tech: ['Next.js', 'React', 'Tailwind', 'TypeScript', 'Vercel'],
    cta: 'Start a web development project',
    avg: { value: '95+', label: 'Lighthouse score' },
  },
]

export const serviceById = (id: ServiceId) => services.find((s) => s.id === id)!

/** Services page hero + section intros. */
export const servicesPage = {
  tag: 'Our Services',
  tagNote: 'Full-stack digital partner',
  h1: 'Services that ship. Outcomes that scale.',
  intro:
    'Websites, mobile apps, AI agents, CRM/ERP, and business automation - designed and engineered by one accountable team. No silos. No hand-offs. Just outcomes.',
  gridEyebrow: 'What we build',
  gridTitle: 'Five services. One growth partner.',
  gridIntro: 'From your first landing page to a full AI-powered product suite - we engineer every layer of your digital stack.',
  stackEyebrow: 'Built on the modern stack',
  stackTitle: 'Tech we love & ship daily',
  stackIntro: "We pick the right tool for the job - never trendy for trendy's sake. Always production-ready.",
}

/**
 * "Tech we love & ship daily". Frontend is the audited marquee; the other groups
 * collect the stacks named on each service (services page) and deployment targets
 * named on the AI agent and web development pages.
 */
export const techGroups = [
  {
    label: 'Frontend',
    items: ['Next.js', 'React', 'TypeScript', 'Tailwind', 'Framer Motion', 'Vue', 'Nuxt', 'Svelte', 'GSAP', 'Three.js'],
  },
  { label: 'Backend', items: ['PostgreSQL', 'Python', 'REST APIs', 'Odoo', 'Zoho', 'Node.js', 'Prisma'] },
  { label: 'Mobile', items: ['Flutter', 'React Native', 'Swift', 'Firebase', 'Expo'] },
  { label: 'AI', items: ['GPT-4', 'Claude', 'LangChain', 'n8n', 'Pinecone', 'CrewAI', 'LangGraph'] },
  { label: 'Cloud', items: ['Vercel', 'AWS', 'Google Cloud', 'Azure'] },
]

/** Services page: "From kickoff to growth, in 5 steps". */
export const fiveSteps = {
  eyebrow: 'How we work',
  title: 'From kickoff to growth, in 5 steps',
  intro: 'Transparent. Predictable. Zero surprises. Every project follows the same battle-tested playbook.',
  steps: [
    {
      n: '01',
      when: 'Day 1-3',
      title: 'Discovery & strategy',
      body: 'Free 30-min call. We map your goals, audience, competitors and constraints - then deliver a clear scope, timeline and quote.',
      outputs: ['Scope doc', 'Timeline', 'Fixed quote', 'Success metrics'],
    },
    {
      n: '02',
      when: 'Week 1-2',
      title: 'Design & prototype',
      body: 'Brand-led wireframes, then interactive Figma prototypes you can click through. You sign off before a single line of code.',
      outputs: ['Wireframes', 'Hi-fi mockups', 'Clickable prototype', 'Design tokens'],
    },
    {
      n: '03',
      when: 'Week 2-6',
      title: 'Build & integrate',
      body: 'Sprint-based development with daily updates and a live staging URL. Clean, typed, tested code - built to scale and hand over.',
      outputs: ['Staging env', 'Daily standups', 'Code reviews', 'Test coverage'],
    },
    {
      n: '04',
      when: 'Week 5-7',
      title: 'QA & launch',
      body: 'End-to-end QA across devices, performance audit, security checks, and a smooth go-live with zero-downtime deployment.',
      outputs: ['Cross-device QA', 'Lighthouse audit', 'Security scan', 'Launch checklist'],
    },
    {
      n: '05',
      when: 'Ongoing',
      title: 'Grow & optimize',
      body: 'Post-launch we don’t disappear. A/B tests, analytics, and feature iterations keep the product compounding.',
      outputs: ['Analytics', 'A/B testing', 'Monthly reports', 'Feature sprints'],
    },
  ],
}

/** Services page: "Pick the way we work together". */
export const engagement = {
  eyebrow: 'Engagement models',
  title: 'Pick the way we work together',
  intro: "Whether it's a one-time launch or a long-term partnership - we have a model that fits. Transparent pricing, no surprises.",
  footnote: 'All prices in INR · GST extra · Custom enterprise plans available.',
  footnoteCta: 'Talk to us →',
  models: [
    {
      name: 'Project',
      tagline: 'Fixed-scope build',
      bestFor: 'Best for: a single website, app, or product launch.',
      price: 'From ₹49,000',
      unit: 'one-time, fixed price',
      points: [
        'Defined scope & timeline',
        'Senior dev + designer',
        'Daily updates, weekly demos',
        'Source code + handover',
        '30 days post-launch support',
      ],
      popular: false,
    },
    {
      name: 'Retainer',
      tagline: 'Dedicated growth team',
      bestFor: 'Best for: ongoing product & ops support.',
      price: 'From ₹85,000',
      unit: 'per month, cancel anytime',
      points: [
        'Dedicated PM, devs & designer',
        'Sprint-based delivery',
        'Slack & Linear access',
        'Weekly strategy + roadmap',
        'Priority bug fixes & features',
        'Quarterly business review',
      ],
      popular: true,
    },
    {
      name: 'Staff Aug',
      tagline: 'Embed our experts',
      bestFor: 'Best for: scaling your existing in-house team fast.',
      price: 'From ₹1,80,000',
      unit: 'per developer / month',
      points: [
        'Senior engineers, vetted',
        'Full-time or part-time',
        'Works in your stack & tools',
        'Daily standups with your team',
        'No long-term lock-in',
      ],
      popular: false,
    },
  ],
}

/** Services page FAQs. Only the first answer is published; the rest are questions founders ask. */
export const servicesFaq = {
  eyebrow: 'FAQs',
  title: 'Questions, answered.',
  intro: "Everything founders ask before working with us. Don't see your question? Drop us a line - we reply within 2 hours.",
  aside: {
    title: 'Still on the fence?',
    body: "Book a free 30-minute strategy call. We'll review your project and map a clear path forward - no obligation.",
    cta: 'Book a free call →',
  },
  answered: [
    {
      q: 'How long does a typical project take?',
      a: 'Marketing sites: 2-4 weeks. Mobile apps: 6-10 weeks. Custom CRM/ERP: 8-14 weeks. We share a precise, fixed timeline before kickoff - and stick to it.',
    },
  ],
  asked: [
    'Do you sign NDAs and protect our IP?',
    'Can you work with our existing team and tools?',
    'What if we need changes after launch?',
    'Do you handle hosting, domains and DevOps?',
    'How do you price AI / automation projects?',
    'Where are you based, and do you work globally?',
    'What makes you different from other agencies?',
  ],
}
