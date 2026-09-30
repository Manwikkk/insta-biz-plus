'use client'

import { AnimatePresence, motion } from 'motion/react'
import { solutions, solutionsIndex, type Solution } from '@/content/data'
import { solutionIcon } from '@/content/nav'
import { SolutionFlow } from './SolutionFlow'
import { useCycle } from './useCycle'
import { Icon } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'

const ease = [0.16, 1, 0.3, 1] as const
const LIST = solutionsIndex.groups
  .flatMap((g) => g.items)
  .map((it) => solutions.find((s) => s.label === it.label))
  .filter((s): s is Solution => !!s)

/**
 * Hero figure for /solutions: one system per industry. The industries take turns, each
 * showing its own workflow running; hover one to stay on it.
 */
export function IndustrySwitcher() {
  const { ref, i, setI, hold } = useCycle<HTMLDivElement>(LIST.length, 4600)
  const s = LIST[i]
  return (
    <div ref={ref} onMouseEnter={() => hold(true)} onMouseLeave={() => hold(false)}>
      <ul className="grid grid-cols-2 gap-1.5 sm:grid-cols-3" aria-label="Industries">
        {LIST.map((x, k) => (
          <li key={x.slug}>
            <button
              type="button"
              onMouseEnter={() => setI(k)}
              onClick={() => setI(k)}
              aria-pressed={k === i}
              className={cn(
                'flex h-full w-full items-center gap-2 rounded-[10px] border px-2.5 py-2 text-left text-[0.76rem] font-medium leading-tight transition-[background-color,border-color,color] duration-300',
                k === i ? 'border-ink bg-ink text-bg' : 'border-line bg-raise text-ink-2 hover:border-line-2 hover:text-ink',
              )}
            >
              <Icon name={solutionIcon[x.slug] ?? 'layers'} size={14} className="shrink-0" />
              <span className="min-w-0">{x.label}</span>
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-3">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={s.slug} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.45, ease }}>
            <SolutionFlow s={s} compact turn={1300} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
