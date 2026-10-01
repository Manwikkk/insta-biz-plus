'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { services } from '@/content/services'
import { serviceIcon } from '@/content/nav'
import { Vignette } from '@/components/vignettes/Vignettes'
import { Icon } from '@/components/ui/Icon'
import { useCycle } from './useCycle'
import { cn } from '@/lib/cn'

const TURN = 3800
const ease = [0.16, 1, 0.3, 1] as const

/**
 * Hero figure for /services: the five services in order, each taking the stage in turn
 * with the live product scene it produces and its average result. Point at one (or reach
 * it with the keyboard) to stay on it.
 *
 * The pointer and the keyboard hold the turn separately, so a click never lets go of a hold
 * the pointer still has. Each button's hit area runs through the gap to its neighbours, so
 * the pointer is never between two of them and the stage never flickers on an edge.
 */
export function ServiceShowcase() {
  const { ref, i, setI, hold, running } = useCycle<HTMLDivElement>(services.length, TURN)
  const [pointer, setPointer] = useState(false)
  const [keyboard, setKeyboard] = useState(false)
  useEffect(() => hold(pointer || keyboard), [pointer, keyboard, hold])
  const s = services[i]
  return (
    <div
      ref={ref}
      className="grid gap-3 sm:grid-cols-[minmax(0,232px)_minmax(0,1fr)]"
      onPointerEnter={(e) => e.pointerType === 'mouse' && setPointer(true)}
      onPointerLeave={() => setPointer(false)}
      onFocus={(e) => e.target.matches(':focus-visible') && setKeyboard(true)}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget as Node | null) && setKeyboard(false)}
      data-running={running || undefined}
    >
      <ol className="grid content-start" aria-label="Our services">
        {services.map((svc, k) => (
          <li key={svc.id}>
            <button
              type="button"
              onClick={() => setI(k)}
              onPointerEnter={(e) => e.pointerType === 'mouse' && setI(k)}
              onFocus={() => setI(k)}
              aria-pressed={k === i}
              className="group block w-full py-[3px] text-left"
            >
              <span
                className={cn(
                  'relative flex items-center gap-2.5 overflow-hidden rounded-[12px] border px-3 py-2.5 transition-[background-color,border-color,color] duration-500 ease-[var(--ease-out)]',
                  k === i ? 'border-ink bg-ink text-bg' : 'border-line bg-raise text-ink group-hover:border-line-2',
                )}
              >
                <span className={cn('t-label w-5 shrink-0', k === i ? 'text-teal' : 'text-ink-3')}>{svc.n}</span>
                <Icon name={serviceIcon[svc.id]} size={16} className="shrink-0" />
                <span className="min-w-0 truncate text-[0.88rem] font-medium leading-snug tracking-[-0.01em]">{svc.label}</span>
                {k === i ? (
                  <span
                    key={`${k}-${running}`}
                    className="showcase-progress absolute inset-x-0 bottom-0 h-[2px] origin-left bg-teal"
                    style={{ animationDuration: `${TURN}ms` }}
                    aria-hidden
                  />
                ) : null}
              </span>
            </button>
          </li>
        ))}
      </ol>

      <div className="relative flex min-h-[340px] flex-col overflow-hidden rounded-[18px] border border-line bg-sink/60 p-4 sm:p-5">
        <span className="dot-grid opacity-50" aria-hidden />
        <div className="relative flex items-center justify-between gap-3">
          <p className="t-label text-ink-3">
            Part {s.n} · {s.short}
          </p>
          <p className="t-label truncate text-ink-3">{s.lineTech.join(' · ')}</p>
        </div>
        {/* the next scene comes straight in while the last one lifts away over it */}
        <div className="relative mt-4 flex-1">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 12, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease } }}
              exit={{ opacity: 0, y: -8, scale: 0.99, transition: { duration: 0.25, ease } }}
            >
              <Vignette id={s.id} />
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="relative mt-4 flex items-end justify-between gap-4 border-t border-line pt-3">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.4, ease } }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
            >
              <p className="t-num text-[1.9rem] leading-none">{s.avg.value}</p>
              <p className="t-label mt-1.5 text-ink-3">{s.avg.label} · avg. result</p>
            </motion.div>
          </AnimatePresence>
          <a href={`#${s.id}`} className="group mb-0.5 inline-flex items-center gap-1.5 text-[0.9rem] font-medium">
            <span className="link-draw">Explore</span>
            <Icon name="arrow-down" size={15} className="transition-transform group-hover:translate-y-0.5" />
          </a>
        </div>
      </div>
    </div>
  )
}
