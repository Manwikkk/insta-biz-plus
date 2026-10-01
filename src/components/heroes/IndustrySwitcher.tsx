'use client'

import { AnimatePresence, motion } from 'motion/react'
import { solutions, solutionsIndex, type Solution } from '@/content/data'
import { solutionIcon } from '@/content/nav'
import { INDUSTRY_SCENES } from './IndustryScenes'
import { useCycle } from './useCycle'
import { Canvas, useLive, usePhase } from '@/components/portfolio/plates/kit'
import { Icon } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'

const ease = [0.16, 1, 0.3, 1] as const
const LIST = solutionsIndex.groups
  .flatMap((g) => g.items)
  .map((it) => solutions.find((s) => s.label === it.label))
  .filter((s): s is Solution => !!s)
/** The four beats of every scene; an industry holds the stage for all four. */
const BEATS = [1500, 1700, 1800, 2300] as const
const TURN = 7400

/**
 * Hero figure for /solutions: one system per industry. The industries take turns, each
 * with its own scene, drawn big and simple, playing its four beats with a line for each;
 * hover one to stay on it.
 */
export function IndustrySwitcher() {
  const { ref, i, setI, hold } = useCycle<HTMLDivElement>(LIST.length, TURN)
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
      <div className="relative mt-3">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={s.slug}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.45, ease } }}
            exit={{ opacity: 0, transition: { duration: 0.25 } }}
          >
            <Stage slug={s.slug} label={s.label} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

function Stage({ slug, label }: { slug: string; label: string }) {
  const { ref, live } = useLive<HTMLDivElement>()
  const ph = usePhase(4, BEATS, live, 3)
  const sc = INDUSTRY_SCENES[slug]
  if (!sc) return null
  return (
    <div ref={ref} className="overflow-hidden rounded-[18px] border border-line bg-raise shadow-[var(--shadow-float)]">
      <div className="relative aspect-[2/1] bg-[radial-gradient(90%_90%_at_50%_0%,var(--teal-soft),transparent_70%)]" role="img" aria-label={`${label}: ${sc.captions.join(', ')}`}>
        <Canvas live={live} w={600} h={300} className="text-ink">
          <sc.Scene ph={ph} />
        </Canvas>
      </div>
      <div className="flex items-center gap-3 border-t border-line px-4 py-3">
        <span className="flex shrink-0 gap-1" aria-hidden>
          {[0, 1, 2, 3].map((k) => (
            <span key={k} className={cn('h-1 w-4 rounded-full transition-colors duration-500', k <= ph ? 'bg-teal' : 'bg-line-2')} />
          ))}
        </span>
        <p key={ph} className="iv-in min-w-0 truncate text-[0.86rem] font-medium">
          {sc.captions[ph]}
        </p>
      </div>
    </div>
  )
}
