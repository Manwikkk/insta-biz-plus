'use client'

import { AnimatePresence, motion } from 'motion/react'
import { HeroWindow, LiveTag } from '../HeroWindow'
import { useCycle } from '../useCycle'
import { Icon } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'
import { ease, Pill, useTween, Works } from './kit'

const DUES = [
  { d: 7, code: 'TDS', name: 'TDS deposit', note: 'Tax deducted in August', done: 31, total: 34 },
  { d: 11, code: 'GSTR-1', name: 'GSTR-1', note: 'Outward supplies for August', done: 44, total: 48 },
  { d: 15, code: 'Adv. tax', name: 'Advance tax · 2nd instalment', note: '45% of the year’s tax by today', done: 18, total: 26 },
  { d: 20, code: 'GSTR-3B', name: 'GSTR-3B', note: 'Summary return and tax payment', done: 42, total: 48 },
  { d: 30, code: 'Audit', name: 'Tax audit report', note: 'Form 3CA / 3CB with 3CD', done: 9, total: 15 },
]
const CLIENTS = ['Mehta Textiles', 'Patel & Sons', 'Sai Pharma', 'Shah Exports', 'Nirma Traders', 'Om Logistics', 'Vora Foods']
const STATES = [
  { label: 'Documents in', tone: 'teal' as const },
  { label: 'Reminder sent', tone: 'ember' as const },
  { label: 'Ready to file', tone: 'line' as const },
]
/** September, laid out Monday first (the 1st falls on a Tuesday). */
const OFFSET = 1
const DAYS = Array.from({ length: 30 }, (_, k) => k + 1)

/**
 * CA practice CRM: the compliance calendar. Each due date lights up in turn with how many
 * clients are filed, who is still pending and the reminders already on their way. Pick any
 * date to look at it.
 */
export function ComplianceCalendar({ ints }: { ints: string[] }) {
  const { ref, i, setI, hold } = useCycle<HTMLDivElement>(DUES.length, 3200, 3)
  const due = DUES[i]
  const done = useTween(due.done, 900)
  const pct = (due.done / due.total) * 100
  return (
    <div ref={ref} onMouseEnter={() => hold(true)} onMouseLeave={() => hold(false)}>
      <HeroWindow title="Compliance calendar · all clients" right={<LiveTag />}>
        <div className="grid gap-3 p-4 sm:grid-cols-[1.08fr_1fr] sm:gap-4 sm:p-5">
          {/* the month */}
          <div className="rounded-[12px] border border-line bg-bg p-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[0.9rem] font-semibold tracking-[-0.01em]">September</p>
              <Pill tone="ember" icon="bell">
                DSC expiring · 3
              </Pill>
            </div>
            <div className="mt-3 grid grid-cols-7 gap-[3px] text-center">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, k) => (
                <span key={k} className="t-label pb-1 text-[0.54rem] text-ink-3">
                  {d}
                </span>
              ))}
              {Array.from({ length: OFFSET }, (_, k) => (
                <span key={`b${k}`} />
              ))}
              {DAYS.map((d) => {
                const at = DUES.findIndex((x) => x.d === d)
                const sunday = (d + OFFSET) % 7 === 0
                if (at < 0)
                  return (
                    <span key={d} className={cn('grid h-[30px] place-items-center rounded-[6px] text-[0.7rem] tabular-nums', sunday ? 'text-ink-3/60' : 'text-ink-3')}>
                      {d}
                    </span>
                  )
                const on = at === i
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setI(at)}
                    aria-pressed={on}
                    aria-label={`${d} September: ${DUES[at].name}`}
                    className={cn(
                      'relative grid h-[30px] place-items-center rounded-[6px] text-[0.7rem] font-semibold tabular-nums transition-[background-color,color,box-shadow] duration-500',
                      on ? 'bg-ink text-bg shadow-[0_0_0_3px_var(--teal-soft)]' : 'bg-teal-soft text-teal-ink hover:bg-teal/25',
                    )}
                  >
                    {d}
                    <span className={cn('absolute bottom-[3px] size-[3px] rounded-full', on ? 'bg-teal' : 'bg-teal-ink')} />
                  </button>
                )
              })}
            </div>
            <ul className="mt-3 hidden flex-wrap gap-1 sm:flex">
              {DUES.map((x, k) => (
                <li key={x.code}>
                  <button
                    type="button"
                    onClick={() => setI(k)}
                    className={cn('t-label rounded-[5px] px-1.5 py-1 text-[0.54rem] transition-colors duration-300', k === i ? 'bg-ink text-bg' : 'text-ink-3 hover:text-ink')}
                  >
                    {x.code}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* the filing that is due */}
          <div className="flex min-w-0 flex-col">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.4, ease }}>
                <p className="t-label text-teal-ink">Due {due.d} Sep</p>
                <p className="mt-1 text-[1.02rem] font-semibold leading-snug tracking-[-0.01em]">{due.name}</p>
                <p className="t-small mt-0.5 text-[0.78rem]">{due.note}</p>
              </motion.div>
            </AnimatePresence>
            <div className="mt-4 flex items-baseline justify-between">
              <p className="t-numeral text-[1.7rem] tabular-nums">
                {Math.round(done)}
                <span className="text-[0.95rem] text-ink-3">/{due.total}</span>
              </p>
              <p className="t-label text-ink-3">clients filed</p>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-sink">
              <div className="h-full rounded-full bg-teal transition-[width] duration-1000 ease-[var(--ease-out)]" style={{ width: `${pct}%` }} />
            </div>
            <AnimatePresence mode="wait" initial={false}>
              <motion.ul key={i} className="mt-3.5 grid gap-1.5" initial="a" animate="b" exit="a">
                {STATES.map((st, k) => (
                  <motion.li
                    key={st.label}
                    variants={{ a: { opacity: 0, x: 8 }, b: { opacity: 1, x: 0 } }}
                    transition={{ delay: 0.08 + k * 0.08, duration: 0.4, ease }}
                    className="flex items-center justify-between gap-2 rounded-[9px] border border-line bg-bg px-2.5 py-2"
                  >
                    <span className="min-w-0 truncate text-[0.8rem] font-medium">{CLIENTS[(i * 2 + k) % CLIENTS.length]}</span>
                    <Pill tone={st.tone}>{st.label}</Pill>
                  </motion.li>
                ))}
              </motion.ul>
            </AnimatePresence>
            <p className="t-label mt-auto flex items-center gap-1.5 pt-3 text-teal-ink">
              <Icon name="whatsapp" size={13} />
              Auto-reminders to {due.total - due.done} pending clients
            </p>
          </div>
        </div>
      </HeroWindow>
      <Works ints={ints} note="GST · TDS · ITR · ROC" />
    </div>
  )
}
