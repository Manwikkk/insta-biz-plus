/**
 * Solution pages that show the seven-step workflow (Understand → Launch, as on the homepage)
 * in place of their audited process list, keyed by slug. Bodies reuse each page's own process
 * and integration lines where they fit.
 */
export const solutionWorkflows: Record<string, { n: string; title: string; body: string }[]> = {
  'erp-software-development': [
    {
      n: '01',
      title: 'Understand',
      body: 'A free discovery session to learn how each department works today, written up as your requirements.',
    },
    {
      n: '02',
      title: 'Map',
      body: 'Sales, purchase, inventory, production, accounts and HR mapped from your own invoices and registers.',
    },
    {
      n: '03',
      title: 'Design',
      body: 'Clickable screens and a module plan you approve before any code is written, built from your real documents.',
    },
    {
      n: '04',
      title: 'Build',
      body: 'Agile sprints with weekly demos, and every line reviewed and tested by our engineers.',
    },
    {
      n: '05',
      title: 'Automate',
      body: 'Approvals, reorder alerts, GST invoicing and reports run on their own, with stock planned from your sales history.',
    },
    {
      n: '06',
      title: 'Integrate',
      body: 'Tally, e-invoicing, Razorpay, WhatsApp and your online store on one database, with mismatches flagged for you.',
    },
    {
      n: '07',
      title: 'Launch',
      body: 'Data migration, a phased go-live and hands-on training - plus a support team your people can call anytime.',
    },
  ],
}
