'use client'

import { useEffect, useState, type PointerEvent } from 'react'
import { MarkBlueprint } from '@/components/brand/MarkBlueprint'
import { KeyButton } from '@/components/ui/KeyButton'
import { Icon, type IconName } from '@/components/ui/Icon'
import { about } from '@/content/about'
import { site } from '@/content/site'
import { cn } from '@/lib/cn'

/** The office week (IST), from the contact page's hours. */
const WEEK = [
  { d: 'Mon', open: 9, close: 18 },
  { d: 'Tue', open: 9, close: 18 },
  { d: 'Wed', open: 9, close: 18 },
  { d: 'Thu', open: 9, close: 18 },
  { d: 'Fri', open: 9, close: 18 },
  { d: 'Sat', open: 10, close: 16 },
  { d: 'Sun', open: null, close: null },
] as const

const pad = (n: number) => String(n).padStart(2, '0')
const clock = (h: number) => `${((h + 11) % 12) + 1}:00 ${h < 12 ? 'AM' : 'PM'}`

/** Ahmedabad time, ticking; `null` until mounted so server and client markup agree. */
function useIst() {
  const [now, setNow] = useState<{ day: number; h: number; m: number } | null>(null)
  useEffect(() => {
    const read = () => {
      const ist = new Date(Date.now() + new Date().getTimezoneOffset() * 60000 + 5.5 * 3600000)
      setNow({ day: (ist.getDay() + 6) % 7, h: ist.getHours(), m: ist.getMinutes() })
    }
    read()
    const id = window.setInterval(read, 1000)
    return () => window.clearInterval(id)
  }, [])
  return now
}

/** Whether the office is open, and when that changes. */
function status(now: { day: number; h: number; m: number }) {
  const t = now.h + now.m / 60
  const today = WEEK[now.day]
  if (today.open !== null && t >= today.open && t < today.close) return { open: true, note: `Open now · until ${clock(today.close)}` }
  for (let k = 0; k < 7; k++) {
    const d = (now.day + k) % 7
    const day = WEEK[d]
    if (day.open === null) continue
    if (k === 0 && t >= day.open) continue
    return { open: false, note: `Closed · opens ${k === 0 ? 'today' : k === 1 ? 'tomorrow' : day.d} ${clock(day.open)}` }
  }
  return { open: false, note: 'Closed' }
}

/**
 * Where to find us, as a visiting card: the address set large on the dark stage with the
 * mark drawing itself behind it (a light follows the pointer across it), and beside it the
 * time in Ahmedabad right now, the week's hours with today picked out, and the ways to reach us.
 */
export function OfficeCard() {
  const now = useIst()
  const s = now ? status(now) : null
  // "219, Swanik Arcade, Opp. Vardan Tower": the building is the headline, the landmark reads with the rest
  const [first, ...more] = site.address.lines
  const cut = first.lastIndexOf(', ')
  const building = first.slice(0, cut)
  const rest = [first.slice(cut + 2), ...more]

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
  }

  const reach: { icon: IconName; label: string; value: string; href: string }[] = [
    { icon: 'mail', label: 'Email', value: site.email, href: `mailto:${site.email}` },
    { icon: 'phone', label: 'Call', value: site.phone, href: site.phoneHref },
    { icon: 'whatsapp', label: 'WhatsApp', value: 'Chat with the team', href: site.whatsapp },
  ]

  return (
    <div className="office-card grid overflow-hidden rounded-[26px] border border-line lg:grid-cols-12" data-reveal="rise">
      {/* the address */}
      <div
        className="office-card-stage relative isolate flex flex-col justify-between gap-10 overflow-hidden bg-stage p-[clamp(22px,3.6vw,48px)] text-stage-ink lg:col-span-7"
        onPointerMove={onMove}
      >
        <div aria-hidden className="absolute inset-0 -z-10 [mask-image:radial-gradient(90%_80%_at_80%_10%,#000,transparent_75%)]">
          <div className="iso-grid [--grid:var(--stage-line)]" />
        </div>
        <MarkBlueprint
          className="pointer-events-none absolute -right-[12%] -top-[18%] -z-10 w-[min(70%,460px)] text-stage-ink-2 opacity-60"
          exploded={0.45}
          strokeWidth={0.8}
        />
        <div>
          <p className="t-label flex items-center gap-2 text-teal">
            <Icon name="building" size={14} />
            {about.office.label} · {about.office.name}
          </p>
          <address className="mt-[clamp(14px,2.6vh,24px)] not-italic">
            <span className="block max-w-[12ch] font-display text-[clamp(2.2rem,4.4vw,3.8rem)] font-[760] leading-[0.95] tracking-[-0.04em] [font-stretch:106%]">
              {building}
            </span>
            {rest.map((l) => (
              <span key={l} className="mt-2 block text-[clamp(1rem,1.3vw,1.12rem)] text-stage-ink-2">
                {l}
              </span>
            ))}
          </address>
        </div>
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div className="flex flex-wrap gap-2.5">
            <KeyButton href={site.mapUrl} variant="stage" size="sm" icon="arrow-up-right">
              {about.office.directions}
            </KeyButton>
            <KeyButton href="/contact-us#contact-form" variant="stage-ghost" size="sm" icon={null}>
              {about.office.visit}
            </KeyButton>
          </div>
          <p className="t-label tabular-nums text-stage-ink-2">
            {site.geo.lat.toFixed(4)}° N · {site.geo.lng.toFixed(4)}° E
          </p>
        </div>
      </div>

      {/* now, the week, and the ways to reach us */}
      <div className="flex flex-col gap-[clamp(18px,3vh,28px)] bg-raise p-[clamp(20px,3vw,36px)] lg:col-span-5">
        <div>
          <p className="t-label text-ink-3">Right now in Ahmedabad</p>
          <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
            <p className="t-num text-[clamp(2.6rem,4.4vw,3.6rem)]" aria-label={now ? `${pad(now.h)}:${pad(now.m)} IST` : undefined}>
              {now ? (
                <>
                  {pad(now.h)}
                  <span className="clock-colon">:</span>
                  {pad(now.m)}
                </>
              ) : (
                '--:--'
              )}
              <span className="t-label ml-2 align-middle text-ink-3">IST</span>
            </p>
            <span
              className={cn(
                'mb-2 inline-flex h-8 items-center gap-2 rounded-full px-3 text-[0.82rem] font-medium',
                s ? (s.open ? 'bg-teal-soft text-teal-ink' : 'bg-sink text-ink-2') : 'bg-sink text-ink-3',
              )}
            >
              <span className={cn('size-2 rounded-full', s ? (s.open ? 'bg-teal shadow-[0_0_0_4px_var(--teal-soft)]' : 'bg-ember') : 'bg-line-2')} />
              {s ? s.note : 'Office hours'}
            </span>
          </div>
        </div>

        <ol className="grid grid-cols-7 gap-1.5" aria-label="Office hours">
          {WEEK.map((w, i) => {
            const today = now?.day === i
            return (
              <li
                key={w.d}
                className={cn(
                  'office-day flex flex-col items-center gap-1 rounded-[10px] border px-1 py-2.5 text-center',
                  today ? 'border-ink bg-ink text-bg' : w.open === null ? 'border-dashed border-line-2 text-ink-3' : 'border-line bg-bg',
                )}
                style={{ ['--i' as string]: i }}
              >
                <span className={cn('t-label text-[0.6rem]', today ? 'text-teal' : 'text-ink-3')}>{w.d}</span>
                <span className="t-numeral text-[0.8rem]">{w.open === null ? 'Off' : `${w.open}–${w.close > 12 ? w.close - 12 : w.close}`}</span>
              </li>
            )
          })}
        </ol>
        <p className="-mt-3 text-[0.8rem] text-ink-3">{site.timezoneNote}</p>

        <ul className="mt-auto grid border-t border-line">
          {reach.map((r) => (
            <li key={r.label} className="border-b border-line last:border-b-0">
              <a
                href={r.href}
                {...(/^https?:/.test(r.href) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="group flex items-center gap-3 py-3"
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-[10px] border border-line-2 text-teal-ink transition-colors duration-300 group-hover:border-ink group-hover:bg-ink group-hover:text-bg">
                  <Icon name={r.icon} size={16} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="t-label block text-ink-3">{r.label}</span>
                  <span className="block truncate text-[0.95rem] font-medium">{r.value}</span>
                </span>
                <Icon name="arrow" size={15} className="shrink-0 text-ink-3 transition-transform duration-500 group-hover:translate-x-1 group-hover:text-ink" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
