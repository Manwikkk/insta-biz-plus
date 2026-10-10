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
  /** Four of the biggest platforms in the work, each with a figure its own site states. */
  items: [
    { brand: 'Doclinks', value: '50K+', label: 'Patients' },
    { brand: 'Tender Source India', value: '60K+', label: 'Live tenders' },
    { brand: 'EstatRent', value: '50K+', label: 'Properties listed' },
    { brand: 'Best Sports Bars', value: '17K+', label: 'Bars listed' },
  ],
}

/**
 * "The problem": every fragment is a phrase the site itself uses to describe what
 * goes wrong without one accountable partner (source noted).
 */
export const problem = {
  eyebrow: 'The problem', // narrative
  title: 'You want growth. Not more vendors. Not more delays.', // narrative
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
  turn: 'One team. One plan. Real results.', // narrative
  resolve: 'One team, one accountable partner - for your website, app, AI workflows, CRM, and business automation.',
}

export const engineIntro = {
  eyebrow: 'What we do',
  title: 'Everything you need to grow online',
  kicker: 'Five services. One growth partner.', // services page
  intro: 'From your first landing page to a full AI-powered product suite - we engineer every layer of your digital stack.', // services page
}

/** The client logos in the folder the client handed over (10 Oct 2026), the best known first. */
export const brands = {
  eyebrow: 'Trusted by founders worldwide',
  title: 'Brands building with Insta Biz Web',
  intro: 'From Ahmedabad to Mumbai, France to Canada - these are some of the companies we’ve helped go digital, scale, and win.',
  cta: 'See all client stories',
  items: [
    { name: 'Doclinks', category: 'Healthcare' },
    { name: 'Grand Sud', category: 'Education' },
    { name: 'Tender Source India', category: 'Tenders' },
    { name: 'EstatRent', category: 'Real Estate' },
    { name: 'Best Sports Bars', category: 'Hospitality' },
    { name: 'Hindland', category: 'Infrastructure' },
    { name: 'Saarthium', category: 'Business Funding' },
    { name: 'Visiolux Studio', category: 'CGI Studio' },
    { name: 'Novel Centre', category: 'Publishing' },
    { name: 'Bajaj Solaar', category: 'Solar Energy' },
    { name: 'Orkay Tiles', category: 'Manufacturing' },
    { name: 'Splendid Tech', category: 'Career Services' },
    { name: 'ConvrsAI', category: 'AI Platform' },
    { name: 'MEX Engineering', category: 'Engineering' },
    { name: 'PropertyMilan', category: 'Real Estate' },
    { name: 'Krishna Clinic', category: 'Healthcare' },
    { name: 'MARC Group', category: 'Trading' },
    { name: 'Panache', category: 'Commodity Trading' },
    { name: 'AKP ArkUrja', category: 'Solar Energy' },
    { name: 'KreddyKing', category: 'Real Estate' },
    { name: 'Mudra Yoga', category: 'Wellness' },
    { name: 'Indivaan', category: 'Garments' },
    { name: 'NKS Apparel', category: 'Fashion' },
    { name: 'SetuBridge', category: 'MSME Advisory' },
    { name: 'StartupStambh', category: 'Startup Advisory' },
    { name: 'VentureLink', category: 'Funding Advisory' },
    { name: 'Saarthiom', category: 'Business Funding' },
    { name: 'SunPaz', category: 'Business Funding' },
    { name: 'CashFlex', category: 'Recommerce' },
    { name: 'Build With Chintan', category: 'Construction' },
    { name: 'Copper Social', category: 'Marketing' },
    { name: 'Ads Mark', category: 'Marketing' },
    { name: 'PMB', category: 'Home Services' },
    { name: 'CH Services', category: 'HVAC Services' },
    { name: 'Carefix', category: 'Home Services' },
    { name: 'MOS Immigration', category: 'Immigration' },
    { name: 'On Road Immigration', category: 'Immigration' },
    { name: 'World Access Tours', category: 'Travel & Visa' },
    { name: 'StudyBridge', category: 'Study Abroad' },
    { name: 'Prakash Gajra', category: 'Tax & Accounting' },
    { name: 'Sharukkhan Kureshi & Co.', category: 'Chartered Accountants' },
    { name: 'Brothers Film', category: 'Film Production' },
    { name: 'Rudra Glass', category: 'Glass & Hardware' },
    { name: 'Wood Paker', category: 'Packaging' },
    { name: 'INTICEDE', category: 'Apparel Sourcing' },
    { name: 'Reva Blisters', category: 'Packaging' },
    { name: 'Add-X Biotech', category: 'Biotech' },
    { name: 'SupplyRoots Exports', category: 'Exports' },
    { name: 'Sahjanand Engineering', category: 'Engineering' },
    { name: 'Sawariya', category: 'Manufacturing' },
    { name: 'Sri Suryakala', category: 'Manufacturing' },
    { name: 'VoiceAI', category: 'Voice AI' },
    { name: 'IVRMaster', category: 'Telephony' },
    { name: 'ReadyRoad', category: 'Automotive' },
    { name: 'Mumbai Property', category: 'Real Estate' },
    { name: 'Cottons by Rudheera', category: 'Fashion' },
    { name: '7 Planets', category: 'Gaming' },
    { name: 'Dr. Anubbha’s Homeopathy', category: 'Healthcare' },
    { name: 'Shubh Vivah', category: 'Wedding Fashion' },
    { name: 'Zaverat', category: 'Jewellery' },
    { name: 'Grow More', category: 'Finance' },
    { name: 'Satya Support', category: 'Business Services' },
    { name: 'Enego', category: 'Business Services' },
    { name: 'Bharat Edge', category: 'Business Services' },
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
  call: { label: 'Free 30-min strategy call', note: 'Zero pitch · reply within 2 hours', href: '/contact-us#contact-form' }, // contact page
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

/**
 * "How we work": the seven-step workflow from the client brief (Understand → Launch), told as the
 * work our team does at each step. Bodies reuse the site's own process lines where they fit.
 */
export const process = {
  eyebrow: 'How we work',
  title: 'From idea to live product',
  intro: 'Seven steps from the first call to launch - with the same senior team beside you at every one. Transparent, fast, and zero surprises.',
  steps: [
    {
      n: '01',
      title: 'Understand',
      body: 'A free 30-min call to learn your goals, your customers and how you run today - then we write it all up as your brief.',
      get: 'A written brief',
    },
    {
      n: '02',
      title: 'Map',
      body: 'We map your workflows, data and hand-offs, and mark the tasks worth automating.',
      get: 'Scope and a clear plan',
    },
    {
      n: '03',
      title: 'Design',
      body: 'A clickable, brand-led prototype you can try and approve before a single line of code.',
      get: 'A clickable prototype',
    },
    {
      n: '04',
      title: 'Build',
      body: 'Clean, documented code in weekly sprints, with every line reviewed and tested by our engineers.',
      get: 'Weekly demos on a staging link',
    },
    {
      n: '05',
      title: 'Automate',
      body: 'Workflows take over the follow-ups, reminders, reports and data entry your team does by hand.',
      get: 'Busywork that runs itself',
    },
    {
      n: '06',
      title: 'Integrate',
      body: 'CRM, WhatsApp, payments and accounting connected as one system, with your data in sync.',
      get: 'One connected system',
    },
    {
      n: '07',
      title: 'Launch',
      body: "Go live with full QA and team training, then we keep watch and support you. We don't disappear - we help you scale.",
      get: 'A live product and a trained team',
    },
  ],
}

/**
 * Clients in the folder (10 Oct 2026), in their own words: EstatRent's from the site's own
 * homepage, the rest verbatim from "What our clients say" on blutec.ai (10 Oct 2026).
 */
export const testimonials = {
  eyebrow: 'Real words · Real wins',
  title: 'Loved by 145+ founders',
  items: [
    {
      quote: 'Their team understood our real-estate workflow better than our internal team. Lead conversion jumped 320%.',
      name: 'Priya S.',
      role: 'CEO, EstatRent',
      initials: 'PS',
      proof: 'Lead conversion +320%',
    },
    {
      quote: 'Our new site and CRM workflow improved lead response time and conversion. The design is polished and the backend is solid.',
      name: 'Meera Nair',
      role: 'Doclinks',
      initials: 'MN',
      proof: 'Faster lead response',
    },
    {
      quote: 'The rollout exceeded expectations. Processes are simpler, reporting is clearer, and our team finally has one system they trust.',
      name: 'Rohit Desai',
      role: 'Grand Sud',
      initials: 'RD',
      proof: 'One system the team trusts',
    },
    {
      quote: 'Their support team guided us from discovery through launch. We always had clear answers and a partner who cared about outcomes, not just deliverables.',
      name: 'Vikram Patel',
      role: 'ConvrsAI',
      initials: 'VP',
      proof: 'Discovery through launch',
    },
  ],
}
