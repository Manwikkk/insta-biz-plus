'use client'

import { AnimatePresence, motion } from 'motion/react'
import type { Solution } from '@/content/data'
import { solutionIcon } from '@/content/nav'
import { HeroWindow, LiveTag } from './HeroWindow'
import { useCycle } from './useCycle'
import { Icon } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'

const ease = [0.16, 1, 0.3, 1] as const

/**
 * Hero figure for a solution: the software's own workflow (its first modules, in the order
 * the page lists them) with a record moving through it, the systems it connects to lighting
 * up in turn, and the outcomes the page promises. Hover a step to stay on it.
 */
export function SolutionFlow({ s, compact = false, turn = 1900 }: { s: Solution; compact?: boolean; turn?: number }) {
  const steps = s.modules.items.slice(0, 5)
  const ints = s.overview.integrations.slice(0, compact ? 4 : 6)
  const { ref, i, setI, hold } = useCycle<HTMLDivElement>(steps.length, turn)
  const progress = steps.length > 1 ? i / (steps.length - 1) : 1
  return (
    <div ref={ref} onMouseEnter={() => hold(true)} onMouseLeave={() => hold(false)}>
      <HeroWindow title={s.productName} right={<LiveTag />}>
        <div className={cn('p-4 sm:p-5', compact && 'sm:py-4')}>
          <div className="flex items-center gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-[11px] bg-ink text-bg">
              <Icon name={solutionIcon[s.slug] ?? 'layers'} size={19} />
            </span>
            <div className="min-w-0">
              <p className="truncate text-[0.95rem] font-semibold tracking-[-0.01em]">{s.label}</p>
              <p className="t-label truncate text-ink-3">{s.group}</p>
            </div>
          </div>

          {/* the workflow */}
          <ol
            className="relative mt-5 grid"
            style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}
            aria-label={`${s.label} workflow`}
          >
            <span
              className="absolute top-[13px] h-[2px] rounded-full bg-line"
              style={{ left: `${50 / steps.length}%`, right: `${50 / steps.length}%` }}
              aria-hidden
            >
              <span
                className="block h-full rounded-full bg-teal transition-[width] duration-700 ease-[var(--ease-out)]"
                style={{ width: `${progress * 100}%` }}
              />
            </span>
            {steps.map((m, k) => (
              <li key={m} className="relative flex flex-col items-center gap-2 px-0.5 text-center" onMouseEnter={() => setI(k)}>
                <span
                  className={cn(
                    'relative grid size-[28px] place-items-center rounded-full border-2 text-[0.64rem] font-bold transition-all duration-500',
                    k < i
                      ? 'border-teal bg-teal text-[#04161a]'
                      : k === i
                        ? 'border-teal bg-bg text-teal-ink shadow-[0_0_0_5px_var(--teal-soft)]'
                        : 'border-line-2 bg-bg text-ink-3',
                  )}
                >
                  {k < i ? <Icon name="check" size={13} strokeWidth={2.6} /> : k + 1}
                </span>
                <span className={cn('line-clamp-2 text-[0.68rem] leading-tight transition-colors duration-500', k === i ? 'font-semibold text-ink' : 'text-ink-3')}>
                  {m}
                </span>
              </li>
            ))}
          </ol>

          {/* the record in flight */}
          <div className="mt-4 overflow-hidden rounded-[12px] border border-line bg-bg">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.4, ease }}
                className="flex items-center gap-3 px-3.5 py-3"
              >
                <span className="t-label shrink-0 rounded-[6px] bg-teal-soft px-2 py-1 text-teal-ink">
                  Step {i + 1}/{steps.length}
                </span>
                <span className="min-w-0 flex-1 truncate text-[0.88rem] font-medium">{steps[i]}</span>
                <span className="t-label hidden shrink-0 text-ink-3 sm:inline">Updated · now</span>
              </motion.div>
            </AnimatePresence>
            <div className="h-[2px] bg-sink">
              <div className="h-full bg-teal transition-[width] duration-700 ease-[var(--ease-out)]" style={{ width: `${((i + 1) / steps.length) * 100}%` }} />
            </div>
          </div>

          {/* the systems it talks to */}
          <p className="t-label mt-4 text-ink-3">Connected</p>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {ints.map((it, k) => (
              <li key={it} className={cn('sync-chip tag h-7', k === i % ints.length && 'is-live')}>
                {it}
              </li>
            ))}
          </ul>

          {!compact ? (
            <ul className="mt-4 grid gap-1.5 border-t border-line pt-4 sm:grid-cols-2">
              {s.benefits.items.slice(0, 4).map((b) => (
                <li key={b.title} className="flex items-center gap-2 text-[0.84rem] text-ink-2">
                  <Icon name="check" size={14} strokeWidth={2.2} className="shrink-0 text-teal-ink" />
                  {b.title}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </HeroWindow>
    </div>
  )
}
