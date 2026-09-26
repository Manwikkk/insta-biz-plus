'use client'

import { AnimatePresence, motion } from 'motion/react'
import { HeroWindow, LiveTag } from '../HeroWindow'
import { useCycle } from '../useCycle'
import { Icon, type IconName } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'
import { ease, useTween, Works } from './kit'

const STEPS: { name: string; icon: IconName; detail: string; note: string }[] = [
  { name: 'Booked', icon: 'calendar', detail: 'Booked online · 10:30 am with Dr. Mehta', note: 'Confirmation sent on WhatsApp' },
  { name: 'Check-in', icon: 'users', detail: 'Token 24 · Cardiology OPD', note: 'Estimated wait: 12 minutes' },
  { name: 'Consult', icon: 'medical', detail: 'Vitals and notes saved to the EMR', note: 'e-Prescription issued' },
  { name: 'Lab', icon: 'pulse', detail: 'CBC and lipid profile ordered', note: 'Report on the patient portal by 4 pm' },
  { name: 'Pharmacy', icon: 'package', detail: '3 medicines dispensed', note: 'Stock updated automatically' },
  { name: 'Billing', icon: 'banknote', detail: 'Bill ₹ 2,340 paid by UPI', note: 'Follow-up reminder set for 30 days' },
]
const SERVING = [22, 23, 24, 24, 25, 26]
const WAITING = [9, 8, 7, 7, 6, 6]
const BEDS = 60
const OCCUPIED = 46

/**
 * Hospital & clinic software: one patient's visit end to end, booked online, checked in,
 * seen, tested, dispensed and billed, while the OPD queue and the ward stay in view. Pick a
 * step to open it.
 */
export function PatientJourney({ ints }: { ints: string[] }) {
  const { ref, i, setI, hold } = useCycle<HTMLDivElement>(STEPS.length, 2300, 2)
  const st = STEPS[i]
  const waiting = useTween(WAITING[i], 700)
  return (
    <div ref={ref} onMouseEnter={() => hold(true)} onMouseLeave={() => hold(false)}>
      <HeroWindow title="OPD · Cardiology" right={<LiveTag />}>
        <div className="p-4 sm:p-5">
          {/* the patient, and a steady pulse */}
          <div className="flex items-center gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-ink text-[0.7rem] font-bold text-bg">KR</span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[0.95rem] font-semibold tracking-[-0.01em]">Kiran Rao, 46</p>
              <p className="t-label truncate text-[0.56rem] text-ink-3">UHID 20417 · follow-up visit</p>
            </div>
            <svg viewBox="0 0 120 32" className="h-8 w-[104px] shrink-0 sm:w-[132px]" aria-hidden>
              <path d="M0 16h30l6-10 7 20 6-26 7 26 5-10h59" fill="none" stroke="var(--line-2)" strokeWidth="1.5" strokeLinejoin="round" />
              <path d="M0 16h30l6-10 7 20 6-26 7 26 5-10h59" fill="none" stroke="var(--teal)" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" pathLength={100} className="sv-ecg" />
            </svg>
          </div>

          {/* the visit */}
          <ol className="relative mt-4 grid grid-cols-6">
            <span className="absolute left-[8.33%] right-[8.33%] top-[17px] h-[2px] rounded-full bg-sink" aria-hidden>
              <span className="block h-full rounded-full bg-teal transition-[width] duration-700 ease-[var(--ease-out)]" style={{ width: `${(i / (STEPS.length - 1)) * 100}%` }} />
            </span>
            {STEPS.map((s, k) => (
              <li key={s.name} className="relative flex min-w-0 justify-center">
                <button type="button" onClick={() => setI(k)} aria-pressed={k === i} className="flex min-w-0 flex-col items-center gap-1.5">
                  <span
                    className={cn(
                      'grid size-9 place-items-center rounded-full border-2 transition-[background-color,border-color,color,box-shadow] duration-500',
                      k === i
                        ? 'border-teal bg-bg text-teal-ink shadow-[0_0_0_5px_var(--teal-soft)]'
                        : k < i
                          ? 'border-teal bg-teal text-[#04161a]'
                          : 'border-line-2 bg-bg text-ink-3',
                    )}
                  >
                    <Icon name={k < i ? 'check' : s.icon} size={15} strokeWidth={k < i ? 2.4 : 1.7} />
                  </span>
                  <span className={cn('max-w-full truncate text-[0.62rem] sm:text-[0.68rem]', k === i ? 'font-semibold text-ink' : 'text-ink-3')}>{s.name}</span>
                </button>
              </li>
            ))}
          </ol>

          <div className="relative mt-3.5 h-[64px] overflow-hidden rounded-[12px] border border-line bg-bg">
            <AnimatePresence initial={false}>
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 18 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -14 }}
                transition={{ duration: 0.45, ease }}
                className="absolute inset-0 flex items-center gap-3 px-3.5"
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-[10px] bg-teal-soft text-teal-ink">
                  <Icon name={st.icon} size={17} />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-[0.86rem] font-semibold">{st.detail}</span>
                  <span className="t-small block truncate text-[0.76rem]">{st.note}</span>
                </span>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* the floor, at a glance */}
          <div className="mt-3 grid grid-cols-[1fr_1fr_1.5fr] gap-2">
            <div className="rounded-[12px] border border-line bg-bg px-3 py-2.5">
              <p className="t-label text-[0.52rem] text-ink-3">Now serving</p>
              <p className="t-numeral mt-1 text-[1.3rem] tabular-nums">{SERVING[i]}</p>
            </div>
            <div className="rounded-[12px] border border-line bg-bg px-3 py-2.5">
              <p className="t-label text-[0.52rem] text-ink-3">Waiting</p>
              <p className="t-numeral mt-1 text-[1.3rem] tabular-nums">{Math.round(waiting)}</p>
            </div>
            <div className="rounded-[12px] border border-line bg-bg px-3 py-2.5">
              <p className="t-label flex justify-between text-[0.52rem] text-ink-3">
                <span>IPD beds</span>
                <span className="text-ink">
                  {OCCUPIED}/{BEDS}
                </span>
              </p>
              <div className="mt-2 grid grid-cols-[repeat(15,minmax(0,1fr))] gap-[2px]" aria-hidden>
                {Array.from({ length: BEDS }, (_, k) => (
                  <span key={k} className={cn('aspect-square rounded-[1.5px]', k < OCCUPIED ? 'bg-ink/80' : 'bg-teal/45')} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </HeroWindow>
      <Works ints={ints} note="Appointment → billing" />
    </div>
  )
}
