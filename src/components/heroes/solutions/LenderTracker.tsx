'use client'

import { AnimatePresence, motion } from 'motion/react'
import { HeroWindow, LiveTag } from '../HeroWindow'
import { useCycle } from '../useCycle'
import { Icon } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'
import { Choices, ease, inr, Pill, useTween, Works } from './kit'

const LENDERS = ['Private bank', 'PSU bank', 'Housing finance', 'NBFC']
/** Each lender's stage (0 logged in … 3 disbursed, -1 query raised) and rate, day by day. */
type Row = { st: -1 | 0 | 1 | 2 | 3; roi?: number }
const DAYS: { label: string; rows: Row[] }[] = [
  { label: 'Day 1', rows: [{ st: 0 }, { st: 0 }, { st: 0 }, { st: 0 }] },
  { label: 'Day 3', rows: [{ st: 1 }, { st: 1 }, { st: 0 }, { st: 1 }] },
  { label: 'Day 6', rows: [{ st: 2, roi: 8.6 }, { st: 1 }, { st: 2, roi: 8.95 }, { st: -1 }] },
  { label: 'Day 9', rows: [{ st: 2, roi: 8.6 }, { st: 2, roi: 8.4 }, { st: 2, roi: 8.95 }, { st: -1 }] },
  { label: 'Day 12', rows: [{ st: 2, roi: 8.6 }, { st: 3, roi: 8.4 }, { st: 2, roi: 8.95 }, { st: -1 }] },
]
const STAGE = ['Logged in', 'Under review', 'Sanctioned', 'Disbursed']
const AMOUNT = 4500000
const PAYOUT = AMOUNT * 0.005

/**
 * Loan & DSA CRM: one complete file logged with four lenders at once, every login tracked
 * to sanction, the best rate picked and the connector's payout worked out on disbursal.
 * Step through the days to follow the file.
 */
export function LenderTracker({ ints }: { ints: string[] }) {
  const { ref, i, setI, hold } = useCycle<HTMLDivElement>(DAYS.length, 2400, 4)
  const day = DAYS[i]
  const rates = day.rows.filter((r) => r.st >= 2 && r.roi).map((r) => r.roi!)
  const best = rates.length ? Math.min(...rates) : null
  const disbursed = day.rows.some((r) => r.st === 3)
  const payout = useTween(disbursed ? PAYOUT : 0, 900)
  return (
    <div ref={ref} onMouseEnter={() => hold(true)} onMouseLeave={() => hold(false)}>
      <HeroWindow title="Loan file · LF-2087" right={<LiveTag />}>
        <div className="p-4 sm:p-5">
          <div className="flex items-center gap-3">
            <span className="relative grid size-11 shrink-0 place-items-center">
              <svg viewBox="0 0 36 36" className="absolute inset-0 -rotate-90" aria-hidden>
                <circle cx="18" cy="18" r="15.5" fill="none" stroke="var(--line-2)" strokeWidth="3" />
                <circle cx="18" cy="18" r="15.5" fill="none" stroke="var(--teal)" strokeWidth="3" strokeLinecap="round" pathLength={100} strokeDasharray="100 100" />
              </svg>
              <span className="t-label text-[0.56rem] text-ink">9/9</span>
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[0.95rem] font-semibold tracking-[-0.01em]">Home loan · {inr(AMOUNT)}</p>
              <p className="t-small truncate text-[0.76rem]">Amit Trivedi · salaried · documents complete</p>
            </div>
          </div>

          <Choices className="mt-4" label="Day" items={DAYS.map((d, k) => ({ id: String(k), label: d.label }))} value={String(i)} onPick={(k) => setI(Number(k))} />

          <ul className="mt-3 grid gap-1.5">
            {LENDERS.map((name, k) => {
              const r = day.rows[k]
              const isBest = best != null && r.roi === best && r.st >= 2
              return (
                <li
                  key={name}
                  className={cn(
                    'rounded-[10px] border px-3 py-2.5 transition-[background-color,border-color] duration-500',
                    isBest ? 'border-teal/50 bg-teal-soft' : 'border-line bg-bg',
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Icon name="building" size={15} className="shrink-0 text-ink-3" />
                    <span className="min-w-0 flex-1 truncate text-[0.82rem] font-medium">{name}</span>
                    {isBest ? (
                      <Pill tone="teal" icon="star" className="hidden sm:inline-flex">
                        Best rate
                      </Pill>
                    ) : null}
                    <span className="t-numeral w-12 shrink-0 text-right text-[0.84rem] tabular-nums">{r.roi ? `${r.roi.toFixed(2)}%` : '—'}</span>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="flex flex-1 gap-[3px]">
                      {STAGE.map((_, j) => (
                        <span
                          key={j}
                          className={cn(
                            'h-1 flex-1 rounded-full transition-colors duration-500',
                            r.st === -1 ? (j === 0 ? 'bg-ember' : 'bg-sink') : j <= r.st ? (r.st === 3 ? 'bg-ink' : 'bg-teal') : 'bg-sink',
                          )}
                        />
                      ))}
                    </span>
                    <span className={cn('t-label w-[86px] shrink-0 text-right text-[0.54rem]', r.st === -1 ? 'text-ember' : r.st === 3 ? 'text-ink' : 'text-ink-3')}>
                      {r.st === -1 ? 'Query raised' : STAGE[r.st]}
                    </span>
                  </div>
                </li>
              )
            })}
          </ul>

          <div className="relative mt-3 h-[46px] overflow-hidden rounded-[10px] bg-ink text-bg">
            <AnimatePresence initial={false}>
              <motion.div
                key={disbursed ? 'paid' : 'track'}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.4, ease }}
                className="absolute inset-0 flex items-center gap-2.5 px-3"
              >
                <Icon name={disbursed ? 'check' : 'clock'} size={15} className="shrink-0" strokeWidth={2} />
                {disbursed ? (
                  <>
                    <span className="min-w-0 flex-1 truncate text-[0.78rem] font-medium">Disbursed · connector payout 0.5%</span>
                    <span className="t-numeral shrink-0 text-[0.95rem] tabular-nums">{inr(payout)}</span>
                  </>
                ) : (
                  <span className="min-w-0 flex-1 truncate text-[0.78rem] font-medium">
                    Tracking {LENDERS.length} logins · {rates.length ? `${rates.length} sanctioned so far` : 'status synced daily'}
                  </span>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </HeroWindow>
      <Works ints={ints} note="Lead → sanction → disbursal" />
    </div>
  )
}
