'use client'

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
 * with the live product scene it produces and its average result. Hover or tap one to
 * stay on it.
 */
export function ServiceShowcase() {
  const { ref, i, setI, hold, running } = useCycle<HTMLDivElement>(services.length, TURN)
  const s = services[i]
  return (
    <div
      ref={ref}
      className="grid gap-3 sm:grid-cols-[minmax(0,210px)_minmax(0,1fr)]"
      onMouseEnter={() => hold(true)}
      onMouseLeave={() => hold(false)}
      data-running={running || undefined}
    >
      <ol className="grid content-start gap-1.5" aria-label="Our services">
        {services.map((svc, k) => (
          <li key={svc.id}>
            <button
              type="button"
              onClick={() => setI(k)}
              onMouseEnter={() => setI(k)}
              onFocus={() => {
                setI(k)
                hold(true)
              }}
              onBlur={() => hold(false)}
              aria-pressed={k === i}
              className={cn(
                'relative flex w-full items-center gap-3 overflow-hidden rounded-[12px] border px-3 py-2.5 text-left transition-[background-color,border-color,color] duration-500 ease-[var(--ease-out)]',
                k === i ? 'border-ink bg-ink text-bg' : 'border-line bg-raise text-ink hover:border-line-2',
              )}
            >
              <span className={cn('t-label w-5 shrink-0', k === i ? 'text-teal' : 'text-ink-3')}>{svc.n}</span>
              <Icon name={serviceIcon[svc.id]} size={16} className="shrink-0" />
              <span className="min-w-0 truncate text-[0.88rem] font-medium tracking-[-0.01em]">{svc.label}</span>
              {k === i ? (
                <span
                  key={`${k}-${running}`}
                  className="showcase-progress absolute inset-x-0 bottom-0 h-[2px] origin-left bg-teal"
                  style={{ animationDuration: `${TURN}ms` }}
                  aria-hidden
                />
              ) : null}
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
        <div className="relative mt-4 flex-1">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 14, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.99 }}
              transition={{ duration: 0.5, ease }}
            >
              <Vignette id={s.id} />
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="relative mt-4 flex items-end justify-between gap-4 border-t border-line pt-3">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={s.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4, ease }}>
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
