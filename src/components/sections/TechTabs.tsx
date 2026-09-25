'use client'

import { useState } from 'react'
import { LayoutGroup, motion, AnimatePresence } from 'motion/react'
import { cn } from '@/lib/cn'

const ease = [0.16, 1, 0.3, 1] as const

/** Stack explorer: pick a layer, its tools settle into place. */
export function TechTabs({ groups }: { groups: { label: string; items: string[] }[] }) {
  const [active, setActive] = useState(0)
  const g = groups[active]
  return (
    <div>
      <LayoutGroup>
        <div role="tablist" aria-label="Technology" className="flex flex-wrap gap-1 border-b border-line">
          {groups.map((t, i) => (
            <button
              key={t.label}
              role="tab"
              aria-selected={i === active}
              onClick={() => setActive(i)}
              className={cn(
                'relative px-4 pb-3 pt-2 text-[0.95rem] font-medium transition-colors',
                i === active ? 'text-ink' : 'text-ink-3 hover:text-ink-2',
              )}
            >
              {t.label}
              <span className="t-label ml-2 text-ink-3">{t.items.length}</span>
              {i === active ? (
                <motion.span
                  layoutId="tech-underline"
                  className="absolute inset-x-2 -bottom-px h-[2px] bg-teal"
                  transition={{ duration: 0.5, ease }}
                />
              ) : null}
            </button>
          ))}
        </div>
      </LayoutGroup>
      <div role="tabpanel" className="relative min-h-[180px] pt-8">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.ul key={g.label} className="flex flex-wrap gap-3" initial="hide" animate="show" exit="hide">
            {g.items.map((it, i) => (
              <motion.li
                key={it}
                variants={{
                  hide: { opacity: 0, y: 14, filter: 'blur(6px)' },
                  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { delay: i * 0.04, duration: 0.5, ease } },
                }}
                className="group flex items-center gap-3 rounded-[12px] border border-line bg-raise px-5 py-4"
              >
                <span className="size-2.5 bg-teal transition-transform duration-500 [clip-path:polygon(50%_0,100%_25%,100%_75%,50%_100%,0_75%,0_25%)] group-hover:rotate-90" />
                <span className="font-display text-[1.25rem] font-[680] tracking-[-0.02em]">{it}</span>
              </motion.li>
            ))}
          </motion.ul>
        </AnimatePresence>
      </div>
    </div>
  )
}
