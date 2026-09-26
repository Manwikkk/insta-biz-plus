'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { HeroWindow, LiveTag } from '../HeroWindow'
import { useCycle } from '../useCycle'
import { Icon, type IconName } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'
import { ease, inr, lakh, Pill, useTween, Works } from './kit'

type St = 'free' | 'hold' | 'sold'
const FLOORS = 8
const PER = 4
const START: St[] = (() => {
  const a: St[] = Array(FLOORS * PER).fill('free')
  for (const k of [0, 1, 3, 5, 6, 8, 10, 11, 14, 17, 19, 20, 24, 27, 30]) a[k] = 'sold'
  for (const k of [9, 25]) a[k] = 'hold'
  return a
})()
const STEPS: { unit: number; to: St; note: string; icon: IconName }[] = [
  { unit: 22, to: 'hold', note: 'Site visit done · unit held for 48 h', icon: 'lock' },
  { unit: 22, to: 'sold', note: 'Booked · token ₹ 2,00,000 received', icon: 'check' },
  { unit: 13, to: 'hold', note: 'Channel partner hold · Mehta Realty', icon: 'users' },
  { unit: 13, to: 'sold', note: 'Booked · agreement drafted', icon: 'file' },
  { unit: 29, to: 'hold', note: 'Site visit booked · Sat, 11 am', icon: 'calendar' },
  { unit: 29, to: 'sold', note: 'Booked · demand letter sent', icon: 'send' },
]
const statusAt = (i: number) => {
  const a = [...START]
  for (let k = 0; k <= i; k++) a[STEPS[k].unit] = STEPS[k].to
  return a
}
const unit = (k: number) => {
  const floor = FLOORS - Math.floor(k / PER)
  const u = (k % PER) + 1
  const big = u === 1 || u === 4
  const area = big ? 1640 : 1245
  const value = area * (6500 + floor * 50)
  return { code: `B-${floor}0${u}`, floor, type: big ? '3 BHK' : '2 BHK', area, facing: u <= 2 ? 'East' : 'West', value }
}
const LABEL: Record<St, string> = { free: 'Available', hold: 'On hold', sold: 'Booked' }

/**
 * Real estate CRM: a tower's live unit inventory. Units go on hold after a site visit and
 * turn booked when the token lands, so nobody sells the same flat twice. Point at any unit
 * for its cost sheet.
 */
export function UnitInventory({ ints }: { ints: string[] }) {
  const { ref, i, hold } = useCycle<HTMLDivElement>(STEPS.length, 2400, 1)
  const [pick, setPick] = useState<number | null>(null)
  const st = statusAt(i)
  const step = STEPS[i]
  const shown = pick ?? step.unit
  const u = unit(shown)
  const count = (s: St) => st.filter((x) => x === s).length
  const free = useTween(count('free'), 600)
  const held = useTween(count('hold'), 600)
  const sold = useTween(count('sold'), 600)
  const value = useTween(u.value, 700)
  return (
    <div
      ref={ref}
      onMouseEnter={() => hold(true)}
      onMouseLeave={() => {
        hold(false)
        setPick(null)
      }}
    >
      <HeroWindow title="Inventory · Tower B" right={<LiveTag />}>
        <div className="grid gap-3 p-4 sm:grid-cols-[1fr_1.05fr] sm:gap-4 sm:p-5">
          {/* the tower */}
          <div className="rounded-[12px] border border-line bg-bg p-3">
            <div className="flex items-baseline justify-between">
              <p className="text-[0.88rem] font-semibold tracking-[-0.01em]">Tower B</p>
              <p className="t-label text-[0.56rem] text-ink-3">8 floors · 32 units</p>
            </div>
            <div className="mt-3 grid grid-cols-[18px_repeat(4,minmax(0,1fr))] gap-[4px]" onMouseLeave={() => setPick(null)}>
              {st.map((s, k) => {
                const floor = FLOORS - Math.floor(k / PER)
                const live = k === step.unit
                const cell = (
                  <button
                    key={k}
                    type="button"
                    aria-label={`${unit(k).code}: ${LABEL[s]}`}
                    onMouseEnter={() => setPick(k)}
                    onFocus={() => setPick(k)}
                    onClick={() => setPick(k)}
                    className={cn(
                      'relative grid h-[21px] place-items-center rounded-[4px] border transition-[background-color,border-color,box-shadow] duration-500',
                      s === 'free' && 'border-teal/40 bg-teal-soft',
                      s === 'hold' && 'border-ember/55 bg-ember/15 text-ember',
                      s === 'sold' && 'border-transparent bg-ink/85 text-bg',
                      live && 'shadow-[0_0_0_2px_var(--bg),0_0_0_4px_var(--teal)]',
                      shown === k && !live && 'shadow-[0_0_0_2px_var(--bg),0_0_0_3.5px_var(--ink)]',
                    )}
                  >
                    {s === 'hold' ? <Icon name="lock" size={10} strokeWidth={2.2} /> : null}
                  </button>
                )
                return k % PER === 0
                  ? [
                      <span key={`f${k}`} className="t-label grid place-items-center text-[0.5rem] text-ink-3">
                        {floor}
                      </span>,
                      cell,
                    ]
                  : cell
              })}
            </div>
            <div className="ml-[22px] mt-[5px] h-[5px] rounded-b-[3px] bg-line-2" aria-hidden />
            <ul className="mt-3 grid grid-cols-3 gap-1 text-center">
              {[
                ['Available', free, 'bg-teal-soft border-teal/40'],
                ['On hold', held, 'bg-ember/15 border-ember/55'],
                ['Booked', sold, 'bg-ink/85 border-transparent'],
              ].map(([label, n, sw]) => (
                <li key={label as string}>
                  <p className="t-numeral text-[1rem] tabular-nums">{Math.round(n as number)}</p>
                  <p className="t-label mt-0.5 flex items-center justify-center gap-1 text-[0.5rem] text-ink-3">
                    <span className={cn('size-2 rounded-[2px] border', sw as string)} />
                    {label as string}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {/* the unit under the pointer (or the one just moving) */}
          <div className="flex min-w-0 flex-col">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={u.code} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.3, ease }}>
                <div className="flex items-center justify-between gap-2">
                  <p className="t-label text-ink-3">Unit {u.code}</p>
                  <Pill tone={st[shown] === 'free' ? 'teal' : st[shown] === 'hold' ? 'ember' : 'ink'}>{LABEL[st[shown]]}</Pill>
                </div>
                <p className="mt-1.5 text-[1.02rem] font-semibold tracking-[-0.01em]">
                  {u.type} · {u.area.toLocaleString('en-IN')} sq ft
                </p>
                <p className="t-small text-[0.78rem]">
                  {u.facing} facing · floor {u.floor}
                </p>
              </motion.div>
            </AnimatePresence>
            <dl className="mt-3 grid gap-1.5 border-t border-line pt-3 text-[0.8rem] sm:mt-3.5">
              <div className="hidden justify-between gap-2 sm:flex">
                <dt className="text-ink-3">Agreement value</dt>
                <dd className="tabular-nums">{lakh(value)}</dd>
              </div>
              <div className="hidden justify-between gap-2 sm:flex">
                <dt className="text-ink-3">GST · 5%</dt>
                <dd className="tabular-nums">{inr(value * 0.05)}</dd>
              </div>
              <div className="flex justify-between gap-2 font-semibold sm:border-t sm:border-line sm:pt-1.5">
                <dt>Total cost sheet</dt>
                <dd className="tabular-nums">{lakh(value * 1.05)}</dd>
              </div>
            </dl>
            <div className="mt-auto pt-3 sm:pt-3.5">
              <p className="t-label hidden text-ink-3 sm:block">Live from the sales floor</p>
              <div className="relative h-[42px] sm:mt-2 overflow-hidden rounded-[10px] border border-line bg-bg">
                <AnimatePresence initial={false}>
                  <motion.p
                    key={i}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -18 }}
                    transition={{ duration: 0.45, ease }}
                    className="absolute inset-0 flex items-center gap-2 px-2.5 text-[0.76rem] leading-tight"
                  >
                    <span className={cn('grid size-6 shrink-0 place-items-center rounded-[7px]', step.to === 'sold' ? 'bg-ink text-bg' : 'bg-ember/15 text-ember')}>
                      <Icon name={step.icon} size={13} strokeWidth={2} />
                    </span>
                    <span className="min-w-0">
                      <span className="font-semibold">{unit(step.unit).code}</span> · {step.note}
                    </span>
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </HeroWindow>
      <Works ints={ints} note="Site visit → booking" />
    </div>
  )
}
