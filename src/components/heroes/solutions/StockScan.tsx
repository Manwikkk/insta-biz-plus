'use client'

import { AnimatePresence, motion } from 'motion/react'
import { HeroWindow, LiveTag } from '../HeroWindow'
import { useCycle } from '../useCycle'
import { Icon, type IconName } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'
import { ease, num, useTween, Works } from './kit'

const WAREHOUSES = ['Ahmedabad', 'Surat', 'Vadodara']
const CAP = 1000
const REORDER = 150
const FRAMES: { stock: number[]; hl: number[]; icon: IconName; event: string; delta?: string }[] = [
  { stock: [820, 270, 340], hl: [0], icon: 'scan', event: 'GRN-4410 scanned in · batch B-0925', delta: '+240' },
  { stock: [820, 90, 340], hl: [1], icon: 'smartphone', event: 'Salesman app order · Surat', delta: '−180' },
  { stock: [620, 290, 340], hl: [0, 1], icon: 'truck', event: 'Below reorder level · 200 moved to Surat', delta: '⇄ 200' },
  { stock: [620, 290, 280], hl: [2], icon: 'check', event: 'Delivered · Shree Electricals, Vadodara', delta: '−60' },
  { stock: [620, 290, 280], hl: [], icon: 'file', event: 'GST invoice INV-7732 and e-way bill generated' },
]
/** Bar widths for the barcode (in px). */
const BARS = [2, 1, 1, 3, 1, 2, 1, 1, 2, 3, 1, 1, 2, 1, 3, 1, 2, 1, 1, 2, 1, 3, 1, 1, 2, 1, 2, 3, 1, 1]

function Level({ name, value, lit }: { name: string; value: number; lit: boolean }) {
  const v = useTween(value, 900)
  const low = value < REORDER
  return (
    <li className={cn('rounded-[10px] border px-3 py-2.5 transition-[background-color,border-color] duration-500', lit ? 'border-teal/45 bg-teal-soft' : 'border-line bg-bg')}>
      <div className="flex items-baseline justify-between gap-2">
        <span className="flex min-w-0 items-center gap-2 text-[0.8rem] font-medium">
          <Icon name="building" size={14} className="shrink-0 text-ink-3" />
          <span className="truncate">{name}</span>
          {low ? (
            <span className="t-label shrink-0 rounded-[4px] bg-ember/15 px-1.5 py-0.5 text-[0.5rem] text-ember">Reorder</span>
          ) : null}
        </span>
        <span className="t-numeral shrink-0 text-[0.9rem] tabular-nums">
          {num(v)} <span className="t-label text-[0.5rem] text-ink-3">pcs</span>
        </span>
      </div>
      <div className="relative mt-2 h-1.5 rounded-full bg-sink">
        <div
          className={cn('h-full rounded-full transition-[width,background-color] duration-900 ease-[var(--ease-out)]', low ? 'bg-ember' : 'bg-teal')}
          style={{ width: `${(value / CAP) * 100}%` }}
        />
        <span className="absolute -top-1 bottom-[-4px] w-px bg-ink/60" style={{ left: `${(REORDER / CAP) * 100}%` }} aria-hidden />
      </div>
    </li>
  )
}

/**
 * Inventory & distribution: one SKU across three warehouses. A GRN is scanned in, a
 * salesman books an order, a branch dips under its reorder level and stock moves to it,
 * the delivery lands and the GST invoice and e-way bill are raised. Pick a step to replay it.
 */
export function StockScan({ ints }: { ints: string[] }) {
  const { ref, i, setI, hold } = useCycle<HTMLDivElement>(FRAMES.length, 2300, 2)
  const f = FRAMES[i]
  const total = useTween(f.stock.reduce((a, b) => a + b, 0), 900)
  return (
    <div ref={ref} onMouseEnter={() => hold(true)} onMouseLeave={() => hold(false)}>
      <HeroWindow title="Stock · LED panel 18W" right={<LiveTag />}>
        <div className="p-4 sm:p-5">
          {/* the item, being scanned */}
          <div className="flex items-center gap-3 rounded-[12px] border border-line bg-bg p-3">
            <div className="relative h-[52px] w-[112px] shrink-0 overflow-hidden rounded-[6px] bg-raise px-2 py-1.5" aria-hidden>
              <div className="flex h-full items-stretch gap-[2px]">
                {BARS.map((w, k) => (
                  <span key={k} className="bg-ink" style={{ width: w }} />
                ))}
              </div>
              <span className={cn('sv-laser absolute inset-x-1 h-[2px] rounded-full bg-ember shadow-[0_0_10px_2px_var(--ember)]', i !== 0 && 'opacity-40')} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[0.9rem] font-semibold leading-tight tracking-[-0.01em]">LED panel 18W · warm white</p>
              <p className="t-label mt-0.5 truncate text-[0.54rem] text-ink-3">SKU LP-18-WW · batch B-0925</p>
              <p className="mt-1.5 text-[0.76rem] text-ink-2">
                On hand <span className="t-numeral tabular-nums text-ink">{num(total)}</span> across 3 warehouses
              </p>
            </div>
          </div>

          <ul className="mt-3 grid gap-1.5">
            {WAREHOUSES.map((w, k) => (
              <Level key={w} name={w} value={f.stock[k]} lit={f.hl.includes(k)} />
            ))}
          </ul>

          {/* what just happened */}
          <div className="relative mt-3 h-[46px] overflow-hidden rounded-[10px] border border-stage-line bg-stage text-stage-ink">
            <AnimatePresence initial={false}>
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.4, ease }}
                className="absolute inset-0 flex items-center gap-2.5 px-3"
              >
                <Icon name={f.icon} size={15} className="shrink-0" />
                <span className="min-w-0 flex-1 truncate text-[0.78rem] font-medium">{f.event}</span>
                {f.delta ? <span className="t-numeral shrink-0 text-[0.86rem] tabular-nums text-teal">{f.delta}</span> : null}
              </motion.div>
            </AnimatePresence>
          </div>
          <ol className="mt-2.5 flex justify-center gap-1.5" aria-label="Steps">
            {FRAMES.map((x, k) => (
              <li key={k}>
                <button
                  type="button"
                  onClick={() => setI(k)}
                  aria-label={x.event}
                  aria-pressed={k === i}
                  className={cn('block h-1.5 rounded-full transition-[width,background-color] duration-500', k === i ? 'w-6 bg-ink' : 'w-1.5 bg-line-2 hover:bg-ink-3')}
                />
              </li>
            ))}
          </ol>
        </div>
      </HeroWindow>
      <Works ints={ints} note="Purchase → stock → delivery → billing" />
    </div>
  )
}
