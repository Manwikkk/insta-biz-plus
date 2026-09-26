'use client'

import { useId } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { HeroWindow, LiveTag } from '../HeroWindow'
import { useCycle } from '../useCycle'
import { Icon, type IconName } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'
import { ease, inr, Pill, Works } from './kit'

const C = 100
/** Days-to-renewal rings, outermost first. */
const RINGS = [
  { r: 80, label: '30 days' },
  { r: 56, label: '15 days' },
  { r: 32, label: '7 days' },
]
const IDLE = 90
const FOCUS = [
  { angle: -40, holder: 'Nisha Desai', type: 'Health · family floater', cover: '₹ 10 L cover · 4 members', premium: 24600, commission: 3690 },
  { angle: 200, holder: 'Rohan Shah', type: 'Motor · comprehensive', cover: 'Hyundai Creta · IDV ₹ 11.2 L', premium: 11240, commission: 1686 },
  { angle: 110, holder: 'Vikram Iyer', type: 'Term life', cover: '₹ 1 Cr cover · 30 years', premium: 18900, commission: 945 },
]
const OTHERS: [number, number][] = [
  [18, 70],
  [62, 86],
  [146, 44],
  [165, 76],
  [248, 66],
  [292, 84],
  [328, 50],
  [80, 38],
]
const REMINDERS: { at: string; how: string; icon: IconName }[] = [
  { at: '30 days', how: 'Renewal quote on WhatsApp', icon: 'whatsapp' },
  { at: '15 days', how: 'Payment link by WhatsApp & SMS', icon: 'send' },
  { at: '7 days', how: 'Call task for the advisor', icon: 'phone' },
]
const at = (angle: number, r: number) => {
  const a = (angle * Math.PI) / 180
  return { x: C + r * Math.cos(a), y: C + r * Math.sin(a) }
}

/**
 * Insurance CRM: the renewal radar. Policies close in on their renewal date and a reminder
 * goes out as each one crosses the 30, 15 and 7-day rings, until it renews and the
 * commission is booked. Point at the radar to hold it.
 */
export function RenewalRadar({ ints }: { ints: string[] }) {
  const { ref, i, hold } = useCycle<HTMLDivElement>(FOCUS.length * 4, 1700, 3)
  // a safe id for the SVG gradient reference
  const gid = `rr${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`
  const p = Math.floor(i / 4)
  const s = i % 4
  const f = FOCUS[p]
  return (
    <div ref={ref} onMouseEnter={() => hold(true)} onMouseLeave={() => hold(false)}>
      <HeroWindow title="Renewals · next 30 days" right={<LiveTag />}>
        <div className="grid items-center gap-4 p-4 sm:grid-cols-[minmax(0,210px)_minmax(0,1fr)] sm:p-5">
          <svg viewBox="0 0 200 200" className="mx-auto w-full max-w-[230px]" role="img" aria-label="Policies approaching renewal">
            <defs>
              <linearGradient id={`${gid}-sweep`} x1="0" y1="1" x2="0" y2="0">
                <stop offset="0" stopColor="var(--teal)" stopOpacity="0.28" />
                <stop offset="1" stopColor="var(--teal)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <circle cx={C} cy={C} r={96} fill="var(--bg)" stroke="var(--line-2)" />
            {RINGS.map((g) => (
              <g key={g.r}>
                <circle cx={C} cy={C} r={g.r} fill="none" stroke="var(--line-2)" strokeDasharray="2 3" />
                <text x={C} y={C - g.r + 8} textAnchor="middle" className="fill-[var(--ink-3)] font-label text-[6px] uppercase tracking-[0.1em]">
                  {g.label}
                </text>
              </g>
            ))}
            <path d="M100 4v192M4 100h192" stroke="var(--line)" />
            <g className="sv-sweep">
              <path d="M100 100 L196 100 A96 96 0 0 0 173.5 38.3 Z" fill={`url(#${gid}-sweep)`} />
              <path d="M100 100 L196 100" stroke="var(--teal)" strokeOpacity="0.55" />
            </g>
            {OTHERS.map(([a, r], k) => {
              const q = at(a, r)
              return <circle key={k} cx={q.x} cy={q.y} r={2.6} fill="var(--ink-3)" opacity={0.55} />
            })}
            {FOCUS.map((x, j) => {
              const active = j === p
              const renewed = j < p || (active && s === 3)
              const q = at(x.angle, active ? [80, 56, 32, 0][s] : IDLE)
              return (
                <g key={x.holder} style={{ transform: `translate(${q.x}px, ${q.y}px)`, transition: 'transform 1.1s var(--ease-out)' }}>
                  {active ? <circle r={9} fill="var(--teal-soft)" className="reach-ping" style={{ ['--i' as string]: 0 }} /> : null}
                  <circle r={active ? 5.2 : 4} fill={renewed ? 'var(--teal)' : active ? 'var(--ember)' : 'var(--ink)'} stroke="var(--bg)" strokeWidth={1.6} />
                </g>
              )
            })}
            <circle cx={C} cy={C} r={3} fill="var(--ink)" />
            <text x={C} y={C + 13} textAnchor="middle" className="fill-[var(--ink-2)] font-label text-[6px] uppercase tracking-[0.1em]">
              Today
            </text>
          </svg>

          <div className="min-w-0">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={p} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.35, ease }}>
                <div className="flex items-center justify-between gap-2">
                  <p className="t-label truncate text-ink-3">{f.type}</p>
                  <Pill tone={s === 3 ? 'teal' : 'ember'} icon={s === 3 ? 'check' : 'clock'}>
                    {s === 3 ? 'Renewed' : `${RINGS[s].label} left`}
                  </Pill>
                </div>
                <p className="mt-1.5 text-[1.02rem] font-semibold tracking-[-0.01em]">{f.holder}</p>
                <p className="t-small text-[0.78rem]">
                  {f.cover} · {inr(f.premium)}/yr
                </p>
              </motion.div>
            </AnimatePresence>
            <ol className="mt-3.5 grid gap-1.5">
              {REMINDERS.map((r, k) => {
                const sent = s >= k
                return (
                  <li
                    key={r.at}
                    className={cn(
                      'flex items-center gap-2.5 rounded-[9px] border px-2.5 py-2 transition-[background-color,border-color,opacity] duration-500',
                      sent ? 'border-line bg-bg' : 'border-dashed border-line-2 opacity-55',
                    )}
                  >
                    <span className={cn('grid size-6 shrink-0 place-items-center rounded-[7px] transition-colors duration-500', sent ? 'bg-teal-soft text-teal-ink' : 'text-ink-3')}>
                      <Icon name={r.icon} size={13} />
                    </span>
                    <span className="min-w-0 flex-1 truncate text-[0.78rem]">{r.how}</span>
                    <span className="t-label shrink-0 text-[0.54rem] text-ink-3">{r.at}</span>
                  </li>
                )
              })}
            </ol>
            <div
              className={cn(
                'mt-2 flex items-center gap-2.5 rounded-[9px] px-2.5 py-2 transition-[background-color,color,opacity,transform] duration-500',
                s === 3 ? 'translate-y-0 bg-ink text-bg opacity-100' : 'translate-y-1 bg-transparent opacity-0',
              )}
              aria-hidden={s !== 3}
            >
              <Icon name="banknote" size={15} className="shrink-0" />
              <span className="min-w-0 flex-1 truncate text-[0.78rem] font-medium">Commission booked</span>
              <span className="t-numeral shrink-0 text-[0.9rem] tabular-nums">{inr(f.commission)}</span>
            </div>
          </div>
        </div>
      </HeroWindow>
      <Works ints={ints} note="Policies, renewals, claims" />
    </div>
  )
}
