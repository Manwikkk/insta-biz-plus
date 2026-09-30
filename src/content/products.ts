import type { IconName } from '@/components/ui/Icon'

/**
 * The four products — verbatim from blutec.ai (the products menu, each product page and its
 * FAQ, and the portfolio's product cards), 30 Sept 2026. Each feature's screen is the one
 * shown beside it on the product page (public/products, via scripts/blutec-media.mjs).
 */

export type ProductId = 'scout' | 'ping' | 'echo' | 'dialer'

export type Feature = { kicker: string; title: string; body: string; points: string[]; best?: boolean }

export type Product = {
  id: ProductId
  name: string
  /** The product's full name on blutec.ai. */
  fullName: string
  short: string
  /** Menu description. */
  description: string
  /** Portfolio card: one line and three highlights. */
  summary: string
  highlights: string[]
  headline: string
  intro: string
  /** The live product. */
  href: string
  icon: IconName
  logo: string
  /** Its step in the stack, from find to close (see the product FAQs). */
  step: { verb: string; line: string }
  features: Feature[]
  impact: { value: string; label: string }[]
  faqs: { q: string; a: string }[]
}

const shots = (id: ProductId, n: number) => Array.from({ length: n }, (_, i) => `/products/${id}-${i + 1}.webp`)

export const products: Product[] = [
  {
    id: 'scout',
    name: 'Scout',
    fullName: 'BluTec Scout',
    short: 'Business data scraping',
    description:
      'A powerful data scraping tool to find business owners, emails, phones, and social profiles in seconds — built for lead gen and outbound teams.',
    summary: 'AI-powered lead extraction from Google Maps and websites — emails, phones, social links, and validated business data for outbound teams.',
    highlights: ['Emails, phones & socials in seconds', 'Browser extension + scraping tasks', 'Export leads anytime'],
    headline: 'Extract business data from Google in seconds',
    intro:
      'Scout is a powerful data scraping tool that helps you find business owners, emails, phones, and social profiles in seconds — built for lead generation and outbound teams.',
    href: 'https://scout.blutec.ai/',
    icon: 'pin',
    logo: '/products/scout-logo.webp',
    step: { verb: 'Find', line: 'Verified business leads from Google Maps and the web' },
    features: [
      {
        kicker: 'Browser extension',
        title: 'Find high-intent business leads in one click',
        body: 'AI-powered browser extension that surfaces business owners with names, multiple emails, alternate phone numbers, social links, websites, reviews, and automatic website validation for accuracy.',
        points: [],
      },
      {
        kicker: 'Keyword generator',
        title: 'Generate thousands of local search keywords instantly',
        body: 'Build massive keyword lists by category — doctors, plumbers, restaurants, and 1,000+ more niches — across every country and state you want to target.',
        points: ['Pick categories and locations in seconds', 'Covers countries, states, and cities at scale', 'Export keywords ready for scraping tasks'],
      },
      {
        kicker: 'Data extraction',
        title: 'Scrape Google Maps and enrich from websites',
        body: 'Turn keywords into live extraction tasks with flexible data options — including deep website scraping to pull emails, phone numbers, and social profiles directly from business sites.',
        points: [
          'Extract email addresses from listings and websites',
          'Extract phone numbers from websites automatically',
          'Extract social media links in the same run',
        ],
      },
      {
        kicker: 'Task history',
        title: 'Manage, pause, and download leads anytime',
        body: 'Track every scraping job in one place. Pause, resume, or stop tasks on demand and download your leads whenever you need them — your data stays saved in Scout.',
        points: ['Full task history with progress and lead counts', 'Pause, resume, and stop running extractions', 'Download completed leads from any device'],
      },
    ],
    impact: [
      { value: '2M+', label: 'business leads extracted for outbound teams' },
      { value: '95%', label: 'contact details validated through website checks' },
      { value: '1,000+', label: 'categories and niches supported globally' },
      { value: '10x', label: 'faster lead research vs manual prospecting' },
    ],
    faqs: [
      {
        q: 'What is BluTec Scout?',
        a: 'BluTec Scout is an AI-powered lead-generation tool that extracts verified business data — owner names, emails, alternate phone numbers, websites, and social profiles — from Google Maps and the web, then exports clean lists to your CRM and outreach tools.',
      },
      {
        q: 'How does Scout verify emails and phone numbers?',
        a: 'Scout performs AI verification during extraction, validating business emails and surfacing multiple phone numbers per business to improve deliverability and connect rates compared with raw scraped lists.',
      },
      {
        q: 'Can I export Scout leads to my CRM?',
        a: 'Yes. Scout offers one-click export to CRMs and connects directly to BluTec Ping (WhatsApp) and Echo (AI calling) so leads flow straight into outreach.',
      },
      {
        q: 'Is BluTec Scout a good Outscraper or Apify alternative?',
        a: 'Yes. For sales and agency teams, Scout is a strong Outscraper and Apify alternative because it adds verification, social discovery, and built-in WhatsApp and AI-calling outreach — no code required.',
      },
    ],
  },
  {
    id: 'ping',
    name: 'Ping',
    fullName: 'BluTec Ping',
    short: 'WhatsApp automation',
    description:
      'Automate WhatsApp at scale — bulk broadcasting, AI chatbots, template campaigns, and two-way flows that boost sales and support 24/7.',
    summary: 'WhatsApp automation at scale — bulk broadcasts, Meta-approved templates, AI chatbot flows, live chats, and agent management.',
    highlights: ['Verified Meta Business Partner', 'Bulk broadcasts + templates', '24/7 AI chatbot flows'],
    headline: 'WhatsApp automation made simple',
    intro:
      'Automate WhatsApp at scale with bulk broadcasting, AI chatbots, template campaigns, and two-way flows that boost sales and customer support around the clock.',
    href: 'https://ping.blutec.ai/',
    icon: 'whatsapp',
    logo: '/products/ping-logo.webp',
    step: { verb: 'Engage', line: 'Broadcasts and AI chatbots that qualify on WhatsApp' },
    features: [
      {
        kicker: 'WhatsApp automation',
        title: 'Broadcast at scale, convert with AI',
        body: 'Send bulk WhatsApp messages and let AI chatbots handle your leads 24/7. Automate conversations, boost engagement, and close deals while you sleep.',
        points: ['Verified Meta Business Partner'],
      },
      {
        kicker: 'Message analytics',
        title: 'See delivery, replies, and performance clearly',
        body: 'Track sent, delivered, read, and replied messages with month-wise breakdowns so you always know how campaigns and conversations are performing.',
        points: ['Sent, delivered, read, and reply metrics', 'Month-wise performance bifurcation', 'Campaign-level insights at a glance'],
      },
      {
        kicker: 'Template manager',
        title: 'Create, sync, and manage Meta-approved templates',
        body: 'View every template with status and quality scores, submit new templates for Meta approval, and sync templates from other platforms so nothing is lost.',
        points: ['Template status and quality tracking', 'Direct submission to Meta for approval', 'Meta sync to import templates from other tools'],
      },
      {
        kicker: 'Broadcasting',
        title: 'Launch campaigns with preview, schedule, and test sends',
        body: 'Create multiple campaigns, schedule broadcasts, preview templates before sending, test messages, upload bulk numbers, and launch at scale with confidence.',
        points: ['Schedule broadcasts for the right time', 'WhatsApp preview before you send', 'Test broadcasts and bulk number uploads'],
      },
      {
        kicker: 'AI chatbot flows',
        title: 'Build no-code WhatsApp bots that sell for you',
        body: 'Turn your number into a smart chatbot — perfect for shop owners and support teams. AI answers customers, shows products, takes orders, and sends you chat summaries without manual intervention.',
        points: ['Visual flow builder for sales and support', 'AI handles FAQs, products, and order capture', 'Full conversation summaries for your team'],
        best: true,
      },
      {
        kicker: 'Live chats',
        title: 'Reply, share brochures, and manage conversations in one inbox',
        body: 'Use Ping as your team inbox — send brochures, handle live chats, assign conversations, and reply to customers without switching tools.',
        points: ['Unified inbox for all WhatsApp chats', 'Send media, brochures, and quick replies', 'Assign and track conversations with your team'],
      },
      {
        kicker: 'Agent management',
        title: 'Create agents and control portal access at scale',
        body: 'When lead volume grows, add agents and assign chats with role-based access. Each agent sees only what they need while you monitor performance and analytics centrally.',
        points: ['Create unlimited agents for high-volume teams', 'Restrict access to specific portal sections', 'Agent-level analytics and activity tracking'],
        best: true,
      },
    ],
    impact: [
      { value: '50K+', label: 'WhatsApp messages sent daily across campaigns' },
      { value: '92%', label: 'average delivery rate on approved broadcasts' },
      { value: '40%', label: 'higher reply rates with AI chatbot flows' },
      { value: '24/7', label: 'automated coverage without manual follow-ups' },
    ],
    faqs: [
      {
        q: 'What is BluTec Ping?',
        a: 'BluTec Ping is a WhatsApp automation platform on the official WhatsApp Business API. It handles bulk broadcasting, AI chatbots, template campaigns, two-way flows, and automatic lead qualification and scoring.',
      },
      {
        q: 'Does BluTec Ping use the official WhatsApp Business API?',
        a: 'Yes. Ping runs on the official WhatsApp Business API, supporting compliant broadcasts, approved message templates, and conversations at scale.',
      },
      {
        q: 'Can Ping qualify and score leads automatically?',
        a: 'Yes. Ping’s AI agent engages contacts, asks qualifying questions, scores leads, and routes hot leads to your team or to BluTec Echo for an AI call.',
      },
      {
        q: 'Is BluTec Ping a good Wati or AiSensy alternative?',
        a: 'Yes. Ping is a strong Wati and AiSensy alternative, adding AI lead qualification and scoring plus native integration with lead scraping (Scout) and AI calling (Echo).',
      },
    ],
  },
  {
    id: 'echo',
    name: 'Echo',
    fullName: 'BluTec Echo',
    short: 'AI voice calling',
    description:
      'An AI bulk calling platform that runs natural voice conversations — follow-ups, reminders, and qualification calls that help close sales faster.',
    summary: 'AI voice agents for qualification, support, reception, and dispatch — with transcripts, analytics, and multi-provider voices.',
    highlights: ['Natural AI voice calls', 'Agent studio + CDR', 'Buy or import numbers'],
    headline: 'AI bulk calling that closes more sales',
    intro:
      'Run natural AI voice conversations at scale — follow-ups, reminders, and qualification calls that help your team convert leads faster with less manual effort.',
    href: 'https://echo.blutec.ai/',
    icon: 'waveform',
    logo: '/products/echo-logo.webp',
    step: { verb: 'Qualify', line: 'AI voice agents that call, qualify and route' },
    features: [
      {
        kicker: 'AI voice agents',
        title: 'Real conversations. Automated at scale.',
        body: 'Deploy always-on AI voice agents for lead qualification, customer support, reception, and dispatch — with transcripts, analytics, and escalation built in.',
        points: [
          'Lead qualification — 10K+ leads handled, score intent and route automatically',
          'Customer support — 60% ticket deflection with instant FAQ and escalation',
          'AI receptionists — zero missed calls with routing, messages, and scheduling',
          'Dispatch service — 2–5x faster coordination with real-time status updates',
        ],
      },
      {
        kicker: 'Agent studio',
        title: 'Create agents in minutes — AI builds the rest',
        body: 'See every agent in one dashboard, configure models and voices, and simply describe what the agent should do — Echo’s AI handles setup and optimization for you.',
        points: [
          'Central view of all voice and chat agents',
          'Write prompts in plain language — AI configures flows',
          'Track cost, model, and voice settings per agent',
        ],
      },
      {
        kicker: 'Voice library',
        title: 'Choose and preview voices from top providers',
        body: 'Pick the perfect voice from ElevenLabs, Google, Cartesia, Sarvam, and more. Filter by language, accent, and gender — then preview before you deploy.',
        points: ['Multi-provider voice catalog with live preview', 'Language, accent, and gender filters', 'Fine-tune speed and speaking style'],
      },
      {
        kicker: 'Call details',
        title: 'Listen, transcribe, and audit every conversation',
        body: 'Full CDR with playback, transcripts, call ratings, latency profiles, and token usage — so you know exactly what was said and how the AI performed.',
        points: [
          'Audio playback and downloadable recordings',
          'Full transcription with turn-by-turn breakdown',
          'Latency, token, and quality analytics per call',
        ],
      },
      {
        kicker: 'Performance analytics',
        title: 'Track how every agent performs over time',
        body: 'Dashboard-level analytics for total calls, duration, cost, tokens, direction, status, and top-performing agents — all in one place.',
        points: [
          'Calls, duration, cost, and token summaries',
          'Outbound vs inbound and status breakdowns',
          'Top agents ranked by volume and outcomes',
        ],
      },
      {
        kicker: 'Phone numbers',
        title: 'Buy, import, and connect numbers your way',
        body: 'Purchase numbers, import from Twilio or Exotel, add SIP trunks, and assign agents — Indian (+91) and US (+1) numbers supported.',
        points: ['Buy numbers instantly on-platform', 'Import from Twilio, Exotel, or SIP trunk', 'Assign numbers to agents in one click'],
      },
    ],
    impact: [
      { value: '500K+', label: 'AI voice calls handled across industries' },
      { value: '60%', label: 'support tickets deflected with AI reception' },
      { value: '2.5s', label: 'typical first-response latency on live calls' },
      { value: '99.9%', label: 'consistent call handling and uptime' },
    ],
    faqs: [
      {
        q: 'What is BluTec Echo?',
        a: 'BluTec Echo is an AI bulk-calling product that runs natural AI voice conversations at scale for follow-ups, reminders, and lead-qualification calls, routing hot prospects to your team and logging outcomes automatically.',
      },
      {
        q: 'Does BluTec Echo sound natural on calls?',
        a: 'Yes. Echo uses natural-sounding AI voice with low latency, designed for outbound follow-ups, reminders, and qualification conversations.',
      },
      {
        q: 'Is BluTec Echo a good Bland AI or Retell AI alternative?',
        a: 'Yes for sales teams. Echo is ready to use without engineering and integrates with BluTec Scout (leads) and Ping (WhatsApp), whereas Bland AI and Retell AI are developer-first platforms.',
      },
    ],
  },
  {
    id: 'dialer',
    name: 'Dialer',
    fullName: 'BluTec Connect',
    short: 'BluTec Connect platform',
    description:
      'A complete platform for BPO and sales teams — call from desktop or laptop with AI call audit, IVR support, ratio dialling, multi-DID options, and live monitoring.',
    summary: 'Inbound & outbound dialer for BPO and sales — campaigns, live monitoring, whisper/barge, AI call audit, IVR, and analytics.',
    highlights: ['AI call audit + IVR', 'Listen, whisper, and barge', 'Full disposition analytics'],
    headline: 'Dialer & BPO platform built for scale',
    intro:
      'A complete calling platform for BPO and sales teams — desktop dialer, AI call audit, IVR support, ratio dialling, multi-DID options, and live monitoring in one stack.',
    href: 'https://dialer.blutec.ai/login',
    icon: 'headset',
    logo: '/products/dialer-logo.webp',
    step: { verb: 'Close', line: 'A dialer for the human-led calls that close' },
    features: [
      {
        kicker: 'Unified dialer',
        title: 'Inbound & outbound calling built for scale',
        body: 'Handle every call — incoming and outgoing — from one platform. Power your sales, support, and BPO teams with intelligent campaign management, real-time analytics, and seamless calling at scale.',
        points: [],
      },
      {
        kicker: 'Operations dashboard',
        title: 'Full analytics for campaigns, agents, and dispositions',
        body: 'See which teams and campaigns perform best with disposition breakdowns, connect rates, agent-wise stats, and live call volume charts.',
        points: [
          'Disposition reports with donut and bar charts',
          'Agent-wise performance and call outcomes',
          'Campaign comparison and daily call trends',
        ],
      },
      {
        kicker: 'Agent dialer',
        title: 'Call, disposition, merge, and transfer from one screen',
        body: 'Give agents a fast desktop dialer with live timers, contact details, disposition tagging, call merge, and warm transfer to teammates.',
        points: ['One-click dial with contact and attempt history', 'Add dispositions after every call', 'Merge and transfer calls to other agents'],
      },
      {
        kicker: 'Live monitoring',
        title: 'Listen, whisper, and barge into live calls',
        body: 'See which agents are available, on call, or offline in real time. Admins can listen silently, whisper coaching tips to the agent only, or barge in so both agent and customer hear you.',
        points: [
          'Listen — monitor calls without being heard',
          'Whisper — coach agents privately mid-call',
          'Barge — join the call for both parties',
        ],
        best: true,
      },
      {
        kicker: 'AI call audit',
        title: 'Audit dispositions with AI summaries and transcripts',
        body: 'Compare what agents logged vs what customers actually said. AI generates summaries, transcripts, quality scores, and disposition match reports automatically.',
        points: ['AI transcription and call summaries', 'Disposition accuracy and mismatch detection', 'Token usage and cost tracking per audit'],
        best: true,
      },
      {
        kicker: 'Advanced analytics',
        title: 'Campaign, team, and lead analytics in depth',
        body: 'Filter by date, campaign, and team to see total calls, interested vs not interested, conversion rates, daily trends, and lead distribution.',
        points: ['Conversion and interest rate tracking', 'Daily call volume line charts', 'Lead status distribution across campaigns'],
      },
      {
        kicker: 'IVR builder',
        title: 'Build IVR menus, greetings, and call routing',
        body: 'Configure IVR flows with custom greetings, keypad routing, DID mapping, lead-list context, and per-menu call caps — then broadcast to callers at scale.',
        points: ['Upload greetings and map keypad routes', 'Assign DIDs and set blast caps', 'IVR analytics and duplicate-ready configs'],
      },
    ],
    impact: [
      { value: '6,000+', label: 'calls processed daily on active campaigns' },
      { value: '45', label: 'agents monitored from a single live dashboard' },
      { value: '3x', label: 'faster coaching with listen, whisper, and barge' },
      { value: '14%', label: 'disposition accuracy lift with AI call audit' },
    ],
    faqs: [
      {
        q: 'What is BluTec Connect?',
        a: 'BluTec Connect is a complete calling platform for BPO and sales teams — desktop dialer, AI call audit, IVR support, ratio dialling, multi-DID options, and live monitoring in one stack.',
      },
      {
        q: 'Who is BluTec Connect for?',
        a: 'Connect is built for BPOs, call centers, and sales teams that need to scale outbound and inbound calling with monitoring, auditing, and flexible DID management.',
      },
      {
        q: 'How is Connect different from Echo?',
        a: 'Echo is AI voice calling for automated conversations, while Connect is a human-agent dialer platform for teams. Many teams use AI calling (Echo) for top-of-funnel and Connect for human-led closing.',
      },
    ],
  },
]

/** A product's screens, in the order of its features. */
export const screensOf = (p: Product) => shots(p.id, p.features.length)

export const productPage = {
  tag: 'Products',
  tagNote: 'Built and run by our team',
  h1: 'Four AI products. One growth engine.',
  intro:
    'Scout, Ping, Echo, and Dialer — built for lead gen, WhatsApp automation, voice AI, and high-volume calling. Use one, or run them together from first lead to closed deal.',
  flow: {
    eyebrow: 'One stack',
    title: 'From first lead to closed deal.',
    intro: 'Scout finds the leads, Ping engages them on WhatsApp, Echo qualifies them with AI calls, and Dialer puts your team on the calls that close.',
  },
  close: {
    title: 'Want to build something like these?',
    body: 'We design, build and run products like Scout, Ping, Echo and Dialer — and we can build yours. Tell us what you need.',
  },
}
