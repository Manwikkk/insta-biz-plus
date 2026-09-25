/** Contact page — verbatim from website-content/contact/contact-us.md. */

export const contact = {
  chips: ['Reply in 2 hrs', 'Mon-Sat · 9-6', 'Ahmedabad, IN', 'WhatsApp ready'],
  tag: 'Contact',
  tagNote: 'Free 30-min strategy call · zero pitch',
  h1: 'Let’s build something great. Together.',
  intro:
    'Tell us about your project below and we’ll get back within 2 hours with timeline, scope, and an honest price. Or if you’re old-school -',
  introLink: 'give us a ring',
  jump: [
    { label: 'Jump to form', href: '#contact-form' },
    { label: 'All ways to reach us', href: '#reach-us' },
    { label: 'Visit office', href: '#visit-us' },
    { label: 'FAQs', href: '#contact-faq' },
  ],
  status: 'Currently accepting new projects',
  form: {
    title: 'Tell us about your big idea.',
    intro: 'The more you share, the sharper our reply. Don’t worry about polish - bullet points are perfect.',
    points: ['Reply within 2 hours, 6 days a week', 'Free 30-min strategy call · zero pitch', 'NDAs on request · your data stays safe'],
    submit: 'Send my message',
    disclaimer: 'By submitting, you agree to be contacted by Insta Biz Web. We never share your data - and you’ll never get spam from us.',
    budgetExtra: 'Not sure yet',
  },
  channels: {
    eyebrow: 'Reach us your way',
    title: 'Pick a channel - we’re on all of them',
    intro: 'Email for the long stuff. Phone for the urgent. WhatsApp for the casual. Calendar for the deep dive. Whatever works for you.',
    items: [
      {
        kind: 'Email',
        value: 'info@instabizweb.com',
        body: 'We answer every email within 2 hours during business hours.',
        cta: 'Send email',
        href: 'mailto:info@instabizweb.com',
      },
      {
        kind: 'Phone',
        value: '+91 98981 24987',
        body: 'Best for quick questions or scheduling a strategy call.',
        cta: 'Call now',
        href: 'tel:+919898124987',
      },
      {
        kind: 'WhatsApp',
        value: 'Chat with the team',
        body: 'Drop a quick message - voice notes, screenshots, anything.',
        cta: 'Open WhatsApp',
        href: 'https://wa.me/919898124987',
      },
      {
        kind: 'Strategy Call',
        value: 'Free 30-min call',
        body: 'We’ll review your project and map a clear path forward.',
        cta: 'Book a call',
        href: '#contact-form',
      },
    ],
  },
  visit: {
    eyebrow: 'Visit our office',
    title: 'Find us in Ahmedabad',
    intro: 'Drop in for a coffee. Schedule a visit and we’ll have your favourite drink ready.',
    visitCta: { title: 'Schedule a visit', body: 'Let us know when you’re coming - coffee’s on us. →' },
  },
  next: {
    eyebrow: 'What happens next',
    title: 'From your message to project kickoff',
    intro: 'Most of our clients are kicked off within a week of their first email. Here’s exactly what that looks like.',
    steps: [
      {
        n: '01',
        when: 'Right now',
        title: 'You send your message',
        body: 'Tell us about your project - even rough bullet points work. Hit submit and we’ll get notified instantly.',
      },
      {
        n: '02',
        when: 'Within 2 hours',
        title: 'We reply with a reality check',
        body: 'A real human (not a bot) reads your message and replies with honest first thoughts, smart questions, and a calendar link.',
      },
      {
        n: '03',
        when: 'Day 1 - 2',
        title: '30-min discovery call',
        body: 'We jump on a call to understand your goals, audience, constraints and timeline. Zero pitch - just useful, candid advice.',
      },
      {
        n: '04',
        when: 'Day 2 - 3',
        title: 'Custom proposal & price',
        body: 'You get a clear scope, milestone-based timeline, and an honest fixed price. No surprises, no “starting from” nonsense.',
      },
      {
        n: '05',
        when: 'Week 1 onwards',
        title: 'Kickoff & build',
        body: 'Once you say go, we line up your team, set up Slack & Linear, and start sprinting. Daily updates, weekly demos.',
      },
    ],
  },
  faq: {
    eyebrow: 'Before you ask',
    title: 'Quick answers, instantly.',
    intro: 'The most common questions founders ask before reaching out. Don’t see yours?',
    introLink: 'Send it our way',
    introTail: '- we’ll reply within 2 hours.',
    aside: {
      title: 'Still on the fence?',
      body: 'Book the free 30-min call. No sales pitch, no obligation - just useful advice.',
      cta: 'Book a free call →',
    },
    answered: [
      {
        q: 'How fast will I hear back?',
        a: 'We reply to every message within 2 hours during business hours (Mon-Sat, 9 AM - 6 PM IST). Outside those hours, you’ll have a reply waiting in your inbox the next morning.',
      },
    ],
    asked: [
      'Do I need everything figured out before reaching out?',
      'Is the strategy call really free?',
      'Can we sign an NDA before sharing details?',
      'Do you work with founders outside India?',
      'What if I just have a quick question, not a project?',
    ],
  },
}
