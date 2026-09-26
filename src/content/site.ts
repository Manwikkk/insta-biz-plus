/**
 * Site-wide facts. Every value is taken from website-content/global-content.md,
 * the contact page, llms.txt or the audited structured data.
 */

export const site = {
  name: 'Insta Biz Web',
  shortName: 'IBW',
  legalName: 'GISSION AI TECHNOLOGIES LLP',
  founded: 2020,
  description:
    'Insta Biz Web builds AI-powered websites, mobile apps, CRM systems and digital automation solutions. We help startups and businesses grow through modern design, fast development, and smart business automation.',
  footerBlurb:
    'Your AI-powered growth partner. We design and build digital products that turn ideas into revenue - from Ahmedabad to the world.',
  email: 'info@instabizweb.com',
  phone: '+91 98981 24987',
  phoneHref: 'tel:+919898124987',
  whatsapp: 'https://wa.me/919898124987',
  mapUrl: 'https://www.google.com/maps/search/?api=1&query=Swanik+Arcade+Naranpura+Ahmedabad+380013',
  mapEmbed: 'https://www.google.com/maps?q=Swanik+Arcade+Naranpura+Ahmedabad+380013&output=embed',
  address: {
    label: 'Headquarters · Naranpura',
    lines: ['219, Swanik Arcade, Opp. Vardan Tower', 'Pragati Nagar to KK Nagar Road, Naranpura', 'Ahmedabad, Gujarat · 380013'],
    full: '219, Swanik Arcade, Opp. Vardan Tower, Pragati Nagar to KK Nagar Road, Naranpura, Ahmedabad, Gujarat 380013',
  },
  /** From the audited ProfessionalService schema. */
  geo: { lat: 23.0626, lng: 72.5575 },
  areaServed: ['India', 'US', 'UK', 'Singapore', 'UAE'],
  hours: [
    { days: 'Mon - Fri', time: '9:00 AM - 6:00 PM' },
    { days: 'Saturday', time: '10:00 AM - 4:00 PM' },
    { days: 'Sunday', time: 'Closed' },
  ],
  timezoneNote: 'IST · GMT +5:30 · Async-friendly across timezones',
  social: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/company/insta-biz-web/' },
    { label: 'Instagram', href: 'https://www.instagram.com/insta_biz_web/' },
    { label: 'X', href: 'https://x.com/instabizweb' },
    { label: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61578562181866' },
  ],
} as const

/** Audited media URLs (website-content media references). */
export const MEDIA = 'https://www.instabizweb.com'
export const media = (p: string) => (/^https?:\/\//.test(p) ? p : `${MEDIA}${p.startsWith('/') ? p : `/${p}`}`)

export const primaryNav = [
  { label: 'Services', href: '/services', menu: 'services' as const },
  { label: 'Solutions', href: '/solutions', menu: 'solutions' as const },
  { label: 'About Us', href: '/about-us' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Blogs', href: '/blogs' },
  { label: 'Contact', href: '/contact-us' },
]

export const footerGroups = [
  {
    title: 'Services',
    links: [
      { label: 'Business Automation', href: '/services#automation' },
      { label: 'Mobile Apps', href: '/services#mobile' },
      { label: 'AI & Automation', href: '/services#ai' },
      { label: 'CRM & ERP Solutions', href: '/solutions' },
      { label: 'Web Development', href: '/services#web' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/about-us' },
      { label: 'Portfolio', href: '/portfolio' },
      { label: 'Blogs', href: '/blogs' },
      { label: 'Contact', href: '/contact-us' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Free Strategy Call', href: '/contact-us' },
      { label: 'Case Studies', href: '/portfolio' },
      { label: 'Privacy Policy', href: '/privacy-policy' },
      { label: 'Terms & Conditions', href: '/terms-and-conditions' },
      { label: 'Refund Policy', href: '/refund-policy' },
    ],
  },
]

/** Ahmedabad landing pages (linked from service content). */
export const locationLinks = [
  { label: 'Web Development Company in Ahmedabad', short: 'Web development', href: '/web-development-company-in-ahmedabad' },
  { label: 'Software Development Company in Ahmedabad', short: 'Software development', href: '/software-development-company-in-ahmedabad' },
  {
    label: 'Mobile App Development Company in Ahmedabad',
    short: 'Mobile app development',
    href: '/mobile-app-development-company-in-ahmedabad',
  },
  { label: 'Odoo Implementation Company in Ahmedabad', short: 'Odoo implementation', href: '/odoo-implementation-company-in-ahmedabad' },
]

/** Lead form options, in the order of the services (01–05). */
export const needOptions = ['Business Automation', 'Mobile App', 'AI / Automation', 'CRM / ERP', 'Website', 'Other'] as const
export const budgetOptions = ['< ₹50K', '₹50K - 1L', '₹1L - 3L', '₹3L - 10L', '10L+'] as const

/** Repeated consultation block ("Free consultation"). */
export const consultation = {
  eyebrow: 'Free consultation',
  title: "Let's build something people love.",
  body: "Tell us about your project. We'll get back within 2 hours with a custom proposal, timeline, and exact pricing - no fluff.",
  points: ['Reply within 2 hours', 'Free 30-min strategy call', 'No spam · NDA on request'],
  disclaimer: 'By submitting, you agree to be contacted by Insta Biz Web. We never share your data.',
  submit: 'Get my free proposal',
}
