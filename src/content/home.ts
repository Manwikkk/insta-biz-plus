/**
 * Homepage copy. Quoted strings are verbatim from website-content/homepage.md or
 * the page noted in the trailing comment. Short connective lines written for the
 * new narrative are marked `// narrative` and make no factual claims.
 */

export const hero = {
  badge: { tag: 'New', text: 'Introducing AI-Powered Automation' },
  h1: 'We Build Digital Engines for Growth.',
  /** Rotating last word of the h1 (client brief). The first entry completes the h1 as written on the site. */
  rotating: ['Growth.', 'Real Results.', 'Revenue.', 'AI-First Brands.', 'Bold Brands.'],
  primary: 'Start Your Project',
  secondary: 'See Our Work',
  facts: [
    { value: '150+', label: 'projects live' }, // client brief
    { value: '145+', label: 'happy clients' },
    { value: '4.9/5', label: 'Google rating', star: true },
    { value: '4+', label: 'years experience' },
  ],
}

export const results = {
  eyebrow: 'Real Results · Real Brands',
  cta: 'See Other Projects',
  items: [
    { brand: 'Chennai Cabs', logo: '/clients/chennai-cabs.png', value: '10K+', label: 'Downloads' },
    { brand: 'Estate Rent', logo: '/clients/estate-rent.png', value: '320%', label: 'Lead Growth' },
    { brand: 'Cashflex', logo: '/clients/cashflex.png', value: '4×', label: 'Faster Launch' },
    { brand: 'Carefix', logo: '/clients/carefix.png', value: '85%', label: 'Automation' },
  ],
}

/**
 * "The problem": every fragment is a phrase the site itself uses to describe what
 * goes wrong without one accountable partner (source noted).
 */
export const problem = {
  eyebrow: 'The problem', // narrative
  title: 'Five projects. Five vendors. Five hand-offs.', // narrative
  body: 'Your website, app, AI workflows, CRM, and business automation usually get built by different people who never talk to each other.', // narrative (lists the five services)
  fragments: [
    { text: 'Enquiries lost across channels', source: 'Manufacturing CRM' },
    { text: 'Slow, error-prone quotations', source: 'Manufacturing CRM' },
    { text: 'Order status by phone call', source: 'Manufacturing CRM' },
    { text: 'Cheap but scope-creeps', source: 'Freelancer' },
    { text: 'Solo, single point of failure', source: 'Freelancer' },
    { text: 'Juniors do the work', source: 'Big agency' },
    { text: 'Code locked / undocumented', source: 'Freelancer' },
    { text: 'Disappears after payment', source: 'Freelancer' },
    { text: 'Layers of account managers', source: 'Big agency' },
    { text: 'Outgrown spreadsheets', source: 'Solutions' },
  ],
  turn: 'No silos. No hand-offs. Just outcomes.', // services page
  resolve: 'One team, one accountable partner - for your website, app, AI workflows, CRM, and business automation.',
}

export const engineIntro = {
  eyebrow: 'What we do',
  title: 'Everything you need to grow online',
  kicker: 'Five services. One growth partner.', // services page
  intro: 'From your first landing page to a full AI-powered product suite - we engineer every layer of your digital stack.', // services page
}

export const brands = {
  eyebrow: 'Trusted by founders worldwide',
  title: 'Brands building with Insta Biz Web',
  intro: 'From Ahmedabad to Chennai to London - these are some of the companies we’ve helped go digital, scale, and win.',
  cta: 'See all client stories',
  items: [
    { name: 'BluTec', category: 'AI Platform', logo: '/brand/blutec.png' },
    { name: 'Carefix', category: 'Healthcare', logo: '/brand/carefix.png' },
    { name: 'Cashflex', category: 'Fintech', logo: '/brand/cashflex.png' },
    { name: 'Chennai Cabs', category: 'Transportation', logo: '/brand/chennai-cabs.png' },
    { name: 'Estate Rent', category: 'Real Estate', logo: '/brand/estate-rent.png' },
    { name: 'Kabadi King', category: 'B2B', logo: '/brand/kabaddi-king.png' },
    { name: 'Sarvam Art', category: 'Education', logo: '/brand/serverm-art.png' },
  ],
}

export const specialisations = {
  eyebrow: 'Our specialisations',
  title: 'CRM & ERP software made for your industry',
  intro:
    'From manufacturing and CA firms to visa consultants and hospitals, we build software around the way your industry actually works.',
  cta: 'Explore all solutions',
}

export const why = {
  eyebrow: 'Why Insta Biz Web',
  title: 'Not another agency. A growth partner.',
  intro:
    "We don't just hand off code. We sit with you, understand your business, and build digital products that actually move the needle.",
  team: { label: 'Meet your team', note: 'Senior devs · Designers · Strategists' },
  pillars: [
    {
      value: '4×',
      label: 'Faster delivery',
      title: 'Ship in weeks, not months',
      body: 'We use modern stacks, reusable systems & AI tooling to launch faster - without cutting corners.',
    },
    {
      value: '145+',
      label: 'Happy clients',
      title: 'Trusted by founders & SMBs',
      body: "From early-stage startups to established brands - we've helped 145+ businesses go digital and grow.",
    },
    {
      value: '4.9★',
      label: 'Google rating',
      title: 'Award-winning quality',
      body: "Pixel-perfect design, clean code, and obsession with detail - that's why our clients refer us.",
    },
    {
      value: '100%',
      label: 'Code ownership',
      title: 'Your code, your brand',
      body: 'No vendor lock-in. Full source code, transparent process, and post-launch support that actually shows up.',
    },
  ],
}

/**
 * "By the numbers". The live counters animate client-side, so their targets are not
 * in the audited content. Each figure below is stated elsewhere on the site (noted).
 */
export const numbers = {
  eyebrow: 'By the numbers',
  title: 'Six years of building. Receipts attached.',
  intro: 'We don’t do vanity metrics. These are the numbers our clients see - and the ones we’re proudest of.',
  items: [
    { value: '145+', label: 'Global clients', note: 'From Ahmedabad to London' }, // hero · llms.txt
    { value: '100+', label: 'Projects shipped', note: 'Apps · Sites · CRMs · AI' }, // portfolio hero
    { value: '98%', label: 'Positive rating', note: 'Across 145+ reviews' }, // about · journey 2025
    { value: '2020', label: 'Founded', note: 'Founded 2020 · still bootstrapped' }, // homepage
    { value: '5', label: 'Countries', note: 'India · US · UK · Singapore · UAE' }, // portfolio · llms.txt
    { value: '2 hrs', label: 'Average reply time', note: 'Mon-Sat, 9 AM - 6 PM IST' }, // contact
  ],
}

export const process = {
  eyebrow: 'How we work',
  title: 'From idea to live product',
  intro: 'A proven 4-step process. Transparent, fast, and zero surprises.',
  steps: [
    {
      n: '01',
      when: 'Day 1-3',
      title: 'Discover & Strategy',
      body: 'We start with a free 30-min call to understand your goals, audience & competition - then map a clear plan.',
    },
    {
      n: '02',
      when: 'Week 1-2',
      title: 'Design & Prototype',
      body: 'Wireframes, brand-led UI, and an interactive prototype you can click through before a single line of code.',
    },
    {
      n: '03',
      when: 'Week 2-6',
      title: 'Build & Launch',
      body: 'Clean code, daily updates, staging environment, and a smooth go-live with full QA on every device.',
    },
    {
      n: '04',
      when: 'Ongoing',
      title: 'Grow & Support',
      body: "Post-launch analytics, A/B tests & optimizations. We don't disappear - we help you scale.",
    },
  ],
}

export const testimonials = {
  eyebrow: 'Real words · Real wins',
  title: 'Loved by 145+ founders',
  items: [
    {
      quote: 'IBW rebuilt our booking app from scratch. Crashes dropped 90%, and we hit 10K downloads in 4 months.',
      name: 'Karthik R.',
      role: 'Founder, Chennai Cabs',
      initials: 'KR',
      proof: '10K downloads in 4 months',
    },
    {
      quote: 'Their team understood our real-estate workflow better than our internal team. Lead conversion jumped 320%.',
      name: 'Priya S.',
      role: 'CEO, Estate Rent',
      initials: 'PS',
      proof: 'Lead conversion +320%',
    },
    {
      quote: 'The AI automation they built saves our ops team ~30 hours every week. Insane ROI.',
      name: 'Rahul P.',
      role: 'COO, Carefix',
      initials: 'RP',
      proof: '~30 hours saved weekly',
    },
    {
      quote: "We've tried 3 agencies before. IBW is the only one that delivered on time AND on budget.",
      name: 'Sneha T.',
      role: 'Marketing Head',
      initials: 'ST',
      proof: 'On time & on budget',
    },
  ],
}
