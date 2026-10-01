'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Odometer } from '@/components/ui/Odometer'
import { Icon } from '@/components/ui/Icon'
import { brands, numbers, testimonials } from '@/content/home'
import { about } from '@/content/about'
import { categories, categoryLabel, projects } from '@/content/portfolio'

const pad = (n: number) => String(n).padStart(2, '0')

/** Where our clients are (site.areaServed), with the studio first. */
const PLACES = [
  { code: 'IN', city: 'Ahmedabad', tz: 'Asia/Kolkata' },
  { code: 'US', city: 'New York', tz: 'America/New_York' },
  { code: 'UK', city: 'London', tz: 'Europe/London' },
  { code: 'AE', city: 'Dubai', tz: 'Asia/Dubai' },
  { code: 'SG', city: 'Singapore', tz: 'Asia/Singapore' },
]

/** The time now, refreshed every 20s; null until mounted so server and client agree. */
function useNow() {
  const [now, setNow] = useState<Date | null>(null)
  useEffect(() => {
    setNow(new Date())
    const id = window.setInterval(() => setNow(new Date()), 20000)
    return () => window.clearInterval(id)
  }, [])
  return now
}
const clock = (d: Date, tz: string) => {
  const parts = new Intl.DateTimeFormat('en-GB', { timeZone: tz, hour: '2-digit', minute: '2-digit', weekday: 'short', hour12: false }).formatToParts(d)
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? ''
  return { time: `${get('hour')}:${get('minute')}`, hour: Number(get('hour')), day: get('weekday') }
}

/** A receipt line: the item, dotted leaders, the amount. */
function Line({ item, amount }: { item: ReactNode; amount: ReactNode }) {
  return (
    <li className="rc-line">
      <span>{item}</span>
      <i aria-hidden />
      <span>{amount}</span>
    </li>
  )
}

function Clients() {
  const shown = brands.items.filter((b) => ['Chennai Cabs', 'Estate Rent', 'Carefix', 'Cashflex'].includes(b.name))
  return (
    <>
      <ul>
        {shown.map((b) => (
          <Line key={b.name} item={b.name} amount={b.category} />
        ))}
        <Line item="And more" amount="Worldwide" />
      </ul>
      <p className="rc-total">
        <span>Total</span>
        <span>145+</span>
      </p>
    </>
  )
}

function Projects() {
  const rows = categories
    .map((c) => ({ label: categoryLabel[c], n: projects.filter((p) => p.category === c).length }))
    .filter((r) => r.n)
    .sort((a, b) => b.n - a.n)
  const top = rows.slice(0, 4)
  const rest = rows.slice(4).reduce((t, r) => t + r.n, 0)
  return (
    <>
      <ul>
        {top.map((r) => (
          <Line key={r.label} item={r.label} amount={r.n} />
        ))}
        {rest ? <Line item="Bots & extensions" amount={rest} /> : null}
      </ul>
      <p className="rc-total">
        <span>On this page · shipped</span>
        <span>
          {projects.length} · 100+
        </span>
      </p>
    </>
  )
}

function Rating() {
  const t = testimonials.items.find((x) => x.role.includes('Estate Rent')) ?? testimonials.items[0]
  return (
    <>
      <blockquote className="rc-quote">“{t.quote}”</blockquote>
      <p className="rc-by">
        {t.name} · {t.role}
      </p>
      <p className="rc-total">
        <span>Google rating</span>
        <span>4.9 ★</span>
      </p>
    </>
  )
}

function Founded() {
  const items = about.journey.items.filter((m) => ['2020', '2021', '2023', '2024'].includes(m.year))
  return (
    <>
      <ul>
        {items.map((m) => (
          <Line key={m.year} item={m.year} amount={m.title} />
        ))}
      </ul>
      <p className="rc-total">
        <span>Status</span>
        <span>Still bootstrapped</span>
      </p>
    </>
  )
}

function Countries() {
  const now = useNow()
  return (
    <>
      <ul>
        {PLACES.map((p) => (
          <Line
            key={p.code}
            item={
              <>
                <b>{p.code}</b> {p.city}
              </>
            }
            amount={now ? clock(now, p.tz).time : '--:--'}
          />
        ))}
      </ul>
      <p className="rc-total">
        <span>Local time, now</span>
        <span>5 countries</span>
      </p>
    </>
  )
}

function Reply() {
  const now = useNow()
  const ist = now ? clock(now, 'Asia/Kolkata') : null
  const open = ist ? ist.day !== 'Sun' && ist.hour >= 9 && ist.hour < 18 : null
  return (
    <>
      <ul>
        <Line item="Hours" amount="Mon-Sat, 9-6 IST" />
        <Line item="Right now" amount={ist ? `${open ? 'Open' : 'Closed'} · ${ist.time}` : '-'} />
        <Line item="Ways in" amount="Email · WhatsApp · Call" />
      </ul>
      <p className="rc-total">
        <span>Average reply</span>
        <span>2 hrs</span>
      </p>
    </>
  )
}

const PROOF: Record<string, () => ReactNode> = {
  'Global clients': Clients,
  'Projects shipped': Projects,
  'Positive rating': Rating,
  Founded,
  Countries,
  'Average reply time': Reply,
}

/** "145+" → "145" and "+"; "2 hrs" → "2" and " hrs". */
const split = (v: string) => {
  const m = v.match(/^([\d.,]+)(.*)$/)
  return m ? { n: m[1], unit: m[2] } : { n: v, unit: '' }
}

/**
 * "By the numbers", with the receipts attached. Six figures set large in a ruled grid, each
 * counting up as it arrives. Behind every figure is its receipt, the proof: the clients by
 * name, the work by kind, a client in their own words, the years, the clocks where our clients
 * are, the hours we keep. Point at a figure (or tap it) and its receipt slides up out of the
 * slot, like a till roll.
 */
export function Receipts() {
  const [open, setOpen] = useState<number | null>(null)
  const grid = useRef<HTMLOListElement>(null)
  // touch screens have no pointer to hover with: the receipt in the middle of the screen feeds out on its own
  useEffect(() => {
    const el = grid.current
    if (!el || !matchMedia('(hover: none), (max-width: 1023px)').matches) return
    const cells = [...el.children] as HTMLElement[]
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const i = cells.indexOf(e.target as HTMLElement)
          if (e.isIntersecting) setOpen(i)
          else setOpen((o) => (o === i ? null : o))
        }
      },
      { rootMargin: '-30% 0px -30% 0px' },
    )
    cells.forEach((c) => io.observe(c))
    return () => io.disconnect()
  }, [])
  return (
    <ol ref={grid} className="rc-grid">
      {numbers.items.map((it, i) => {
        const { n, unit } = split(it.value)
        const Proof = PROOF[it.label]
        const on = open === i
        return (
          // open is an attribute, not a class: the reveal's own class on this cell must survive the re-render
          <li
            key={it.label}
            className="rc-cell"
            data-open={on || undefined}
            data-reveal="rise"
            style={{ ['--d' as string]: `${(i % 3) * 90}ms` }}
            onPointerEnter={(e) => e.pointerType === 'mouse' && setOpen(i)}
            onPointerLeave={(e) => e.pointerType === 'mouse' && setOpen((o) => (o === i ? null : o))}
          >
            <p className="rc-head">
              <span className="text-teal-ink">{pad(i + 1)}</span>
              <span>{it.label}</span>
            </p>
            <p className="rc-figure t-num">
              <Odometer value={n} delay={200 + i * 120} />
              {unit ? <span className="rc-unit">{unit.trim()}</span> : null}
            </p>
            <p className="rc-note">{it.note}</p>
            <button
              type="button"
              className="rc-tab"
              aria-expanded={on}
              aria-controls={`rc-${i}`}
              onClick={() => setOpen(on ? null : i)}
            >
              Receipt №{pad(i + 1)}
              <Icon name="arrow-up-right" size={13} />
            </button>
            <div id={`rc-${i}`} className="rc-slip" role="region" aria-label={`${it.label}: the receipt`}>
              <p className="rc-slip-head">
                <span>Insta Biz Web</span>
                <span>№{pad(i + 1)}</span>
              </p>
              <p className="rc-slip-title">{it.label}</p>
              {Proof ? <Proof /> : null}
              <p className="rc-code" aria-hidden />
            </div>
          </li>
        )
      })}
    </ol>
  )
}
