'use client'

import { AnimatePresence, motion } from 'motion/react'
import { HeroWindow, LiveTag } from '../HeroWindow'
import { useCycle } from '../useCycle'
import { Icon, type IconName } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'
import { ease, Works } from './kit'

const NODES: { name: string; icon: IconName; log: string }[] = [
  { name: 'Sales', icon: 'banknote', log: 'Sales order SO-1042 · 500 units confirmed' },
  { name: 'Inventory', icon: 'package', log: 'Stock reserved · 180 short, flagged to purchase' },
  { name: 'Purchase', icon: 'file', log: 'Purchase order raised · steel coil 4.2 t' },
  { name: 'Manufacturing', icon: 'factory', log: 'Work order WO-88 released to line 2' },
  { name: 'Accounting', icon: 'calculator', log: 'E-invoice generated · GST posted' },
  { name: 'Reports', icon: 'layers', log: 'Dashboards refreshed · order margin 23.4%' },
]
/** Node centres, as percentages of the board (clockwise from the top). */
const POS = NODES.map((_, k) => {
  const a = ((-90 + k * 60) * Math.PI) / 180
  return { x: 50 + 36 * Math.cos(a), y: 50 + 37 * Math.sin(a) }
})
const AGO = ['now', '1 min', '3 min']

/**
 * Custom ERP: one system, every department. A single sales order ripples through inventory,
 * purchase, the shop floor and accounts to the dashboards, with no one keying it in twice.
 * Point at a department to follow the order from there.
 */
export function ErpHub({ ints }: { ints: string[] }) {
  const { ref, i, setI, hold } = useCycle<HTMLDivElement>(NODES.length, 1900, 5)
  const log = [0, 1, 2].map((b) => i - b).filter((k) => k >= 0)
  return (
    <div ref={ref} onMouseEnter={() => hold(true)} onMouseLeave={() => hold(false)}>
      <HeroWindow title="ERP · one source of truth" right={<LiveTag />}>
        <div className="p-4 sm:p-5">
          <div className="relative mx-auto aspect-[4/3] max-w-[440px]">
            <span className="dot-grid rounded-[14px] opacity-60 [mask-image:radial-gradient(closest-side,#000,transparent)]" aria-hidden />
            {/* spokes */}
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 size-full" aria-hidden>
              {POS.map((p, k) => {
                const lit = k === i || k === i - 1
                return (
                  <line
                    key={k}
                    x1="50"
                    y1="50"
                    x2={p.x}
                    y2={p.y}
                    vectorEffect="non-scaling-stroke"
                    stroke={lit ? 'var(--teal)' : k < i ? 'var(--line-2)' : 'var(--line)'}
                    strokeWidth={lit ? 1.8 : 1.2}
                    className={cn('transition-[stroke] duration-500', lit && 'reach-route')}
                  />
                )
              })}
            </svg>
            {/* the core */}
            <div className="absolute left-1/2 top-1/2 grid -translate-x-1/2 -translate-y-1/2 place-items-center">
              <span className="relative grid size-[76px] place-items-center bg-teal/70 [clip-path:polygon(50%_0,100%_25%,100%_75%,50%_100%,0_75%,0_25%)] sm:size-[88px]">
                <span className="absolute inset-[2px] grid place-items-center bg-stage text-stage-ink [clip-path:polygon(50%_0,100%_25%,100%_75%,50%_100%,0_75%,0_25%)]">
                  <span className="text-center">
                    <span className="block font-display text-[0.95rem] font-bold tracking-[-0.02em]">ERP</span>
                    <span className="t-label block text-[0.48rem] text-teal">SO-1042</span>
                  </span>
                </span>
              </span>
            </div>
            {/* departments */}
            {NODES.map((n, k) => {
              const on = k === i
              return (
                <button
                  key={n.name}
                  type="button"
                  onMouseEnter={() => setI(k)}
                  onFocus={() => setI(k)}
                  onClick={() => setI(k)}
                  aria-pressed={on}
                  className="absolute flex w-[84px] -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1 sm:w-[96px]"
                  style={{ left: `${POS[k].x}%`, top: `${POS[k].y}%` }}
                >
                  <span
                    className={cn(
                      'grid size-9 place-items-center rounded-[11px] border transition-[background-color,border-color,color,box-shadow,transform] duration-500 sm:size-10',
                      on
                        ? 'scale-110 border-teal bg-teal text-[#04161a] shadow-[0_0_0_6px_var(--teal-soft)]'
                        : k < i
                          ? 'border-line-2 bg-raise text-teal-ink'
                          : 'border-line bg-raise text-ink-3',
                    )}
                  >
                    <Icon name={k < i ? 'check' : n.icon} size={16} strokeWidth={k < i ? 2.2 : 1.7} />
                  </span>
                  <span className={cn('max-w-full truncate rounded-[5px] bg-raise/80 px-1 text-[0.66rem] font-medium backdrop-blur-sm sm:text-[0.7rem]', on ? 'text-ink' : 'text-ink-3')}>
                    {n.name}
                  </span>
                </button>
              )
            })}
          </div>

          {/* the audit trail */}
          <ul className="mt-3 grid min-h-[112px] content-start gap-1.5" aria-live="polite">
            <AnimatePresence initial={false} mode="popLayout">
              {log.map((k, row) => (
                <motion.li
                  key={k}
                  layout
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: row === 0 ? 1 : row === 1 ? 0.7 : 0.45, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.45, ease }}
                  className="flex items-center gap-2.5 rounded-[9px] border border-line bg-bg px-2.5 py-2"
                >
                  <span className={cn('size-1.5 shrink-0 rounded-full', row === 0 ? 'bg-teal' : 'bg-line-2')} />
                  <span className="t-label w-[74px] shrink-0 truncate text-[0.54rem] text-ink-3">{NODES[k].name}</span>
                  <span className="min-w-0 flex-1 truncate text-[0.78rem]">{NODES[k].log}</span>
                  <span className="t-label hidden shrink-0 text-[0.52rem] text-ink-3 sm:inline">{AGO[row]}</span>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </div>
      </HeroWindow>
      <Works ints={ints} note="Sales to accounts, one record" />
    </div>
  )
}
