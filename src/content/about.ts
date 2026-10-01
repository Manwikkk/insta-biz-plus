/**
 * About page — from website-content/about/about-us.md, told about the company and its clients
 * rather than founders (client brief): no founder-led, founder or co-founder lines anywhere on the
 * page, and the story says what we do (from the site description).
 */

export const about = {
  tag: 'About',
  tagNote: 'The story behind Insta Biz Web',
  h1: 'A team of makers, builders & doers.',
  intro:
    "We're a tight-knit team of senior engineers and designers based in Ahmedabad, India - building digital products for businesses across India, the US, UK and Singapore. Five years in, and still obsessed with the craft.",
  primary: 'Work with us',
  secondary: 'See our work',
  /** The hero's board; every figure is stated elsewhere on the site. */
  glance: {
    work: { value: '100+', label: 'Projects shipped', note: 'Apps · sites · CRMs · AI', cta: 'See the work' },
    clients: { value: '145+', label: 'Global clients' },
    rating: { value: '98%', label: 'Positive rating', note: '4.9★ on Google' },
    build: { label: 'What we build', cta: 'Explore services' },
  },
  story: {
    eyebrow: 'What we do',
    title: 'We build digital engines for growth.',
    body: 'AI-powered websites, mobile apps, CRM systems and business automation - designed, built and run by one team.',
    cta: "See what we've built",
  },
  drives: {
    eyebrow: 'What drives us',
    title: 'Mission, vision & the principles we live by',
    items: [
      {
        label: 'Mission',
        title: 'Make great tech accessible to every business.',
        body: 'We believe small businesses deserve the same engineering rigor and design polish as well-funded startups. Our mission is to make that bar reachable for everyone.',
      },
      {
        label: 'Vision',
        title: 'Be the partner businesses trust for the long haul.',
        body: 'Not just an agency for one project - but the team our clients call when they’re launching, scaling, pivoting, and re-imagining what’s next.',
      },
      {
        label: 'Values',
        title: 'Honest. Owner-minded. Quality first.',
        body: 'We tell the truth, even when it’s inconvenient. We treat every project like our own. And we never ship something we wouldn’t use ourselves.',
      },
    ],
    principles: ['Craft over shortcuts', 'Outcomes over outputs', 'Clarity over cleverness', 'People over process'],
  },
  journey: {
    eyebrow: 'Our journey',
    title: 'From 2020 to today',
    intro: 'Six years of relentless building, learning, and shipping. Scroll through the milestones that shaped us.',
    items: [
      {
        year: '2020',
        tag: 'Founded',
        title: 'The beginning',
        body: 'Insta Biz Web opens in Ahmedabad. First office: a single laptop and a lot of caffeine.',
      },
      {
        year: '2021',
        tag: null,
        title: 'First 10 clients',
        body: 'Shipped 10 production websites and 2 mobile apps. Set the bar high.',
      },
      {
        year: '2022',
        tag: 'Team scaled',
        title: 'Full stack, one roof',
        body: 'Capabilities grow to cover web, mobile, CRM, AI and business automation - under one roof.',
      },
      {
        year: '2023',
        tag: null,
        title: 'Going global',
        body: 'Started serving clients in the US, UK and Singapore. Crossed 30+ shipped projects with a 4.9★ average rating.',
      },
      {
        year: '2024',
        tag: 'AI launched',
        title: 'AI-first transformation',
        body: 'Launched Blutec AI products: Ping, Connect, Echo, Scout. Became one of the first Odoo + AI partners in Gujarat.',
      },
      {
        year: '2025',
        tag: null,
        title: '60+ clients & counting',
        body: 'Crossed 60 active clients globally. 98% positive rating. Two operating branches.',
      },
      {
        year: '2026',
        tag: 'Now',
        title: 'What’s next',
        body: 'Doubling down on AI agents, vertical SaaS for SMBs, and our first international office. The best is yet to come.',
      },
    ],
  },
  office: {
    eyebrow: 'Where to find us',
    title: 'Our office. Always open to a visit.',
    intro: 'We’re in Naranpura, Ahmedabad - good coffee guaranteed. Schedule a visit and say hello.',
    label: 'Headquarters',
    name: 'Naranpura',
    directions: 'Get directions',
    visit: 'Schedule a visit',
  },
  networks: {
    eyebrow: 'Our networks',
    title: 'Trusted by brands across industries',
    intro: 'From AI platforms to real estate marketplaces - we partner with teams building category-defining products.',
  },
  way: {
    eyebrow: 'The IBW way',
    title: 'How we work with you',
    intro: 'Seven steps from your first message to launch day - the same way every time, with the same senior team at each one.',
    aside: {
      title: 'Want to chat?',
      body: 'Free 30-min strategy call. No sales pitch, no obligation - just useful advice on your project.',
      cta: 'Book a call',
    },
    items: [
      { title: 'Honest, even when it stings', body: 'We say no to bad scope. We push back on shortcuts. Truth ships better products.' },
      { title: 'Owner-minded', body: 'We treat your project like our own - same care, same urgency, same pride.' },
      { title: 'Senior craft, always', body: 'No bait-and-switch. The senior engineer on your call ships the code.' },
      { title: 'Real humans, real chats', body: 'Slack, calls, daily updates. Async-friendly but never invisible.' },
      { title: 'Global by default', body: 'We work with clients from Ahmedabad to NYC, London to Singapore.' },
      { title: 'Built to last', body: 'Clean code, clear docs, full handover. No vendor lock-in, ever.' },
    ],
  },
}
