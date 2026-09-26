'use client'

import { AnimatePresence, motion } from 'motion/react'
import { HeroWindow, LiveTag } from '../HeroWindow'
import { useCycle } from '../useCycle'
import { Icon } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'
import { Choices, ease, num, useTween, Works } from './kit'

const COURSES = [
  { id: 'jee', label: 'JEE', stages: [1240, 860, 540, 312], batch: 'JEE-A · morning', seats: [42, 45], note: 'Fee instalment 2 of 4 paid · ₹ 18,500' },
  { id: 'neet', label: 'NEET', stages: [980, 690, 410, 236], batch: 'NEET-B · evening', seats: [38, 45], note: 'Aarav marked present · 8:02 am' },
  { id: 'found', label: 'Foundation', stages: [640, 470, 300, 188], batch: 'F-9 · weekend', seats: [30, 36], note: 'Unit test results shared with parents' },
] as const
type Id = (typeof COURSES)[number]['id']
const STAGES = ['Enquiries', 'Counselled', 'Demo class', 'Admitted']
const SHADE = ['bg-teal/30', 'bg-teal/50', 'bg-teal/75', 'bg-teal']

function Bar({ k, value, top }: { k: number; value: number; top: number }) {
  const n = useTween(value, 1000)
  return (
    <li className="grid grid-cols-[76px_minmax(0,1fr)_44px] items-center gap-2.5 sm:grid-cols-[88px_minmax(0,1fr)_48px]">
      <span className={cn('truncate text-[0.76rem]', k === 3 ? 'font-semibold text-ink' : 'text-ink-2')}>{STAGES[k]}</span>
      <span className="flex h-[26px] justify-center">
        <span
          className={cn('sv-shine relative h-full overflow-hidden rounded-[6px] transition-[width] duration-1000 ease-[var(--ease-out)]', SHADE[k])}
          style={{ width: `${Math.max(8, (value / top) * 100)}%`, ['--d' as string]: `${k * 260}ms` }}
        />
      </span>
      <span className="t-numeral text-right text-[0.9rem] tabular-nums">{num(n)}</span>
    </li>
  )
}

/**
 * Education CRM: an admissions season as a funnel, from enquiries to admitted students,
 * course by course, with the batch filling and parents kept in the loop. Switch courses to
 * compare them.
 */
export function AdmissionFunnel({ ints }: { ints: string[] }) {
  const { ref, i, setI, hold } = useCycle<HTMLDivElement>(COURSES.length, 4000)
  const c = COURSES[i]
  const conv = (c.stages[3] / c.stages[0]) * 100
  const rate = useTween(conv, 1000)
  const seats = useTween(c.seats[0], 1000)
  return (
    <div ref={ref} onMouseEnter={() => hold(true)} onMouseLeave={() => hold(false)}>
      <HeroWindow title="Admissions · this season" right={<LiveTag />}>
        <div className="p-4 sm:p-5">
          <Choices<Id> label="Course" items={COURSES.map((x) => ({ id: x.id, label: x.label }))} value={c.id} onPick={(id) => setI(COURSES.findIndex((x) => x.id === id))} />

          <div className="mt-3 rounded-[12px] border border-line bg-bg p-3.5 sm:p-4">
            <div className="flex items-baseline justify-between gap-2">
              <p className="t-label text-ink-3">Enquiry → admission</p>
              <p className="t-numeral text-[1.25rem] tabular-nums text-teal-ink">{rate.toFixed(1)}%</p>
            </div>
            <ol className="mt-3 grid gap-2">
              {c.stages.map((v, k) => (
                <Bar key={k} k={k} value={v} top={c.stages[0]} />
              ))}
            </ol>
            <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 border-t border-line pt-3">
              {[1, 2, 3].map((k) => (
                <li key={k} className="t-label text-[0.56rem] text-ink-3">
                  {STAGES[k]} <span className="text-ink">{Math.round((c.stages[k] / c.stages[k - 1]) * 100)}%</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <div className="rounded-[12px] border border-line bg-bg px-3 py-2.5">
              <div className="flex items-baseline justify-between gap-2">
                <p className="min-w-0 truncate text-[0.8rem] font-semibold">Batch {c.batch}</p>
                <p className="t-label shrink-0 text-ink-3">
                  {Math.round(seats)}/{c.seats[1]} seats
                </p>
              </div>
              <div className="mt-2 flex gap-[2px]">
                {Array.from({ length: c.seats[1] }, (_, k) => (
                  <span key={k} className={cn('h-2 flex-1 rounded-[1px] transition-colors duration-500', k < Math.round(seats) ? 'bg-ink' : 'bg-sink')} />
                ))}
              </div>
            </div>
            <div className="relative h-[62px] overflow-hidden rounded-[12px] border border-line bg-bg">
              <AnimatePresence initial={false}>
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.45, ease }}
                  className="absolute inset-0 flex items-center gap-2.5 px-3"
                >
                  <span className="grid size-7 shrink-0 place-items-center rounded-[8px] bg-teal-soft text-teal-ink">
                    <Icon name="bell" size={14} />
                  </span>
                  <span className="min-w-0">
                    <span className="t-label block text-[0.52rem] text-ink-3">Parent app · just now</span>
                    <span className="line-clamp-2 text-[0.76rem] font-medium leading-snug">{c.note}</span>
                  </span>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </HeroWindow>
      <Works ints={ints} note="Enquiry → admission → fees" />
    </div>
  )
}
