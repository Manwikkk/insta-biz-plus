'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/cn'

export type IndexItem = { id: string; n: string; label: string }

/**
 * A sticky index of a page's sections, just under the header. The section in view is
 * highlighted (the highlight glides between items) and scrolled into the row on phones.
 */
export function SectionIndexNav({ id, label, items }: { id?: string; label: string; items: IndexItem[] }) {
  const [active, setActive] = useState(items[0].id)
  const row = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const els = items.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[]
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id)
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [items])

  // keep the active item visible in the (sideways-scrolling) row
  useEffect(() => {
    const r = row.current
    const a = r?.querySelector<HTMLElement>(`[data-id="${active}"]`)
    if (!r || !a || r.scrollWidth <= r.clientWidth) return
    r.scrollTo({ left: a.offsetLeft - (r.clientWidth - a.offsetWidth) / 2, behavior: 'smooth' })
  }, [active])

  return (
    <nav
      aria-label={label}
      className="sticky top-[var(--header-offset)] z-30 border-b border-line bg-bg/85 backdrop-blur-xl transition-[top] duration-500 ease-[var(--ease-out)]"
      id={id}
    >
      <div ref={row} className="shell flex gap-1 overflow-x-auto py-2 [scrollbar-width:none]">
        {items.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            data-id={s.id}
            aria-current={active === s.id ? 'true' : undefined}
            className={cn(
              'relative flex shrink-0 items-center gap-2 rounded-[9px] px-3.5 py-2 text-[0.9rem] font-medium transition-colors duration-300',
              active === s.id ? 'text-bg' : 'text-ink-2 hover:bg-raise hover:text-ink',
            )}
          >
            {active === s.id ? (
              <motion.span
                layoutId={`${label}-index`}
                className="absolute inset-0 rounded-[9px] bg-ink"
                transition={{ type: 'spring', stiffness: 480, damping: 40, mass: 0.7 }}
              />
            ) : null}
            <span className={cn('t-label relative', active === s.id ? 'text-teal' : 'text-ink-3')}>{s.n}</span>
            <span className="relative">{s.label}</span>
          </a>
        ))}
      </div>
    </nav>
  )
}
