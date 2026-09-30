import { NextResponse } from 'next/server'

/**
 * Lead intake. The live site's form endpoint was not part of the audit (/api/ is
 * disallowed), so delivery is configurable:
 *   CONTACT_WEBHOOK_URL — POST the lead as JSON (CRM, n8n, Zapier, email relay…)
 * Without it, development logs the lead and reports success; production reports an
 * honest error so visitors are pointed to email/WhatsApp instead of a silent drop.
 */
export async function POST(req: Request) {
  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request.' }, { status: 400 })
  }
  const str = (k: string, max = 5000) =>
    String(body[k] ?? '')
      .trim()
      .slice(0, max)
  const lead = {
    form: str('form', 20),
    name: str('name', 200),
    email: str('email', 200),
    phone: str('phone', 60),
    subject: str('subject', 300),
    website: str('website', 500),
    message: str('message'),
    needs: Array.isArray(body.needs) ? (body.needs as unknown[]).map(String).slice(0, 10) : [],
    timeline: str('timeline', 40),
    goal: str('goal', 60),
    page: str('page', 300),
    receivedAt: new Date().toISOString(),
  }
  if (!lead.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) {
    return NextResponse.json({ ok: false, error: 'Please provide a valid email address.' }, { status: 422 })
  }
  if (lead.form !== 'newsletter' && !lead.name) {
    return NextResponse.json({ ok: false, error: 'Please tell us your name.' }, { status: 422 })
  }

  const hook = process.env.CONTACT_WEBHOOK_URL
  if (hook) {
    try {
      const r = await fetch(hook, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(lead) })
      if (!r.ok) throw new Error(`Webhook responded ${r.status}`)
      return NextResponse.json({ ok: true })
    } catch (e) {
      console.error('[contact] delivery failed', e)
      return NextResponse.json({ ok: false, error: 'We couldn’t send that just now.' }, { status: 502 })
    }
  }

  if (process.env.NODE_ENV !== 'production') {
    console.info('[contact] lead (no CONTACT_WEBHOOK_URL configured):', lead)
    return NextResponse.json({ ok: true, delivered: false })
  }
  return NextResponse.json({ ok: false, error: 'Our form is being connected right now.' }, { status: 503 })
}
