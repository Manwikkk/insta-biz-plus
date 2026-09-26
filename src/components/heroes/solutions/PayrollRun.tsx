'use client'

import { useState } from 'react'
import { HeroWindow, LiveTag } from '../HeroWindow'
import { useCycle } from '../useCycle'
import { Icon, type IconName } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'
import { inr, num, useTween, Works } from './kit'

const STEPS: { name: string; icon: IconName }[] = [
  { name: 'Attendance', icon: 'users' },
  { name: 'Leave', icon: 'calendar' },
  { name: 'Salaries', icon: 'calculator' },
  { name: 'Statutory', icon: 'shield' },
  { name: 'Payout', icon: 'banknote' },
]
const PEOPLE = [
  { name: 'Priya Nair', dept: 'Design', days: '26/26', gross: 48000, pf: 1800, esi: 0, pt: 200, tds: 2150 },
  { name: 'Arjun Mehta', dept: 'Sales · 1 leave', days: '25/26', gross: 36500, pf: 1800, esi: 0, pt: 200, tds: 450 },
  { name: 'Sneha Patel', dept: 'Operations', days: '24/26', gross: 19800, pf: 1188, esi: 149, pt: 200, tds: 0 },
  { name: 'Imran Shaikh', dept: 'Plant · 14 h OT', days: '26/26', gross: 22400, pf: 1344, esi: 0, pt: 200, tds: 0 },
]
const net = (p: (typeof PEOPLE)[number]) => p.gross - p.pf - p.esi - p.pt - p.tds
const TOTAL = 3842600

function Money({ value, on }: { value: number; on: boolean }) {
  const v = useTween(on ? value : 0, 900)
  return <span className={cn('tabular-nums transition-opacity duration-500', on ? 'opacity-100' : 'opacity-30')}>{on ? num(v) : '—'}</span>
}

/**
 * HRMS & payroll: the month-end run as it happens. Biometric attendance syncs, leave is
 * applied, salaries and PF / ESI / PT / TDS are worked out and the bank file and payslips go
 * out. Point at anyone to read their payslip.
 */
export function PayrollRun({ ints }: { ints: string[] }) {
  const { ref, i, setI, hold } = useCycle<HTMLDivElement>(STEPS.length, 2000, 4)
  const [pick, setPick] = useState(0)
  const total = useTween(i >= 4 ? TOTAL : 0, 1100)
  const p = PEOPLE[pick]
  const slip: [string, number][] = [
    ['Gross', p.gross],
    ['PF', -p.pf],
    ...(p.esi ? ([['ESI', -p.esi]] as [string, number][]) : []),
    ['PT', -p.pt],
    ...(p.tds ? ([['TDS', -p.tds]] as [string, number][]) : []),
  ]
  return (
    <div ref={ref} onMouseEnter={() => hold(true)} onMouseLeave={() => hold(false)}>
      <HeroWindow title="Payroll · September" right={<LiveTag label={i === 4 ? 'Paid' : 'Running'} />}>
        <div className="p-4 sm:p-5">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="t-label text-ink-3">142 employees · 3 locations</p>
              <p className="t-numeral mt-1.5 text-[1.5rem] tabular-nums">{i >= 4 ? inr(total) : 'Processing…'}</p>
            </div>
            <p className={cn('t-label flex items-center gap-1.5 transition-colors duration-500', i >= 4 ? 'text-teal-ink' : 'text-ink-3')}>
              <Icon name={i >= 4 ? 'check' : 'clock'} size={12} strokeWidth={2.2} />
              {i >= 4 ? 'Bank file ready' : `Step ${i + 1} of 5`}
            </p>
          </div>

          <ol className="mt-3.5 grid grid-cols-5 gap-1.5">
            {STEPS.map((s, k) => (
              <li key={s.name} className="min-w-0">
                <button type="button" onClick={() => setI(k)} aria-pressed={k === i} className="flex w-full min-w-0 flex-col items-center gap-1.5">
                  <span
                    className={cn(
                      'grid h-9 w-full place-items-center rounded-[9px] border transition-[background-color,border-color,color] duration-500',
                      k === i ? 'border-ink bg-ink text-bg' : k < i ? 'border-transparent bg-teal-soft text-teal-ink' : 'border-line text-ink-3',
                    )}
                  >
                    <Icon name={k < i ? 'check' : s.icon} size={15} strokeWidth={k < i ? 2.3 : 1.7} />
                  </span>
                  <span className={cn('max-w-full truncate text-[0.6rem] sm:text-[0.66rem]', k === i ? 'font-semibold text-ink' : 'text-ink-3')}>{s.name}</span>
                </button>
              </li>
            ))}
          </ol>

          <div className="mt-3 overflow-hidden rounded-[12px] border border-line bg-bg">
            <div className="t-label grid grid-cols-[minmax(0,1fr)_64px_72px] gap-2 border-b border-line px-3 py-2 text-[0.52rem] text-ink-3 sm:grid-cols-[minmax(0,1fr)_52px_72px_72px]">
              <span>Employee</span>
              <span className="hidden sm:block">Days</span>
              <span className="text-right">Gross</span>
              <span className="text-right">Net pay</span>
            </div>
            <ul onMouseLeave={() => setPick(0)}>
              {PEOPLE.map((x, k) => (
                <li key={x.name}>
                  <button
                    type="button"
                    onMouseEnter={() => setPick(k)}
                    onFocus={() => setPick(k)}
                    onClick={() => setPick(k)}
                    className={cn(
                      'grid w-full grid-cols-[minmax(0,1fr)_64px_72px] items-center gap-2 border-b border-line px-3 py-2 text-left text-[0.8rem] transition-colors duration-300 last:border-b-0 sm:grid-cols-[minmax(0,1fr)_52px_72px_72px]',
                      pick === k ? 'bg-teal-soft' : 'hover:bg-raise',
                    )}
                  >
                    <span className="min-w-0">
                      <span className="block truncate font-medium">{x.name}</span>
                      <span className="t-label block truncate text-[0.5rem] text-ink-3">{x.dept}</span>
                    </span>
                    <span className="hidden tabular-nums text-ink-2 sm:block">{x.days}</span>
                    <span className="text-right">
                      <Money value={x.gross} on={i >= 2} />
                    </span>
                    <span className="text-right font-semibold">
                      <Money value={net(x)} on={i >= 3} />
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* the payslip of whoever is under the pointer */}
          <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-[10px] border border-dashed border-line-2 px-3 py-2">
            <span className="t-label text-[0.54rem] text-ink-3">Payslip · {p.name.split(' ')[0]}</span>
            {slip.map(([k, v]) => (
              <span key={k} className="text-[0.74rem] tabular-nums text-ink-2">
                {k} <span className={cn(v < 0 ? 'text-ink-3' : 'text-ink')}>{v < 0 ? `− ${num(-v)}` : num(v)}</span>
              </span>
            ))}
            <span className="ml-auto text-[0.76rem] font-semibold tabular-nums">= {inr(net(p))}</span>
          </div>
        </div>
      </HeroWindow>
      <Works ints={ints} note="PF · ESI · PT · TDS built in" />
    </div>
  )
}
