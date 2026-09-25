'use client'

import { useEffect, useState } from 'react'
import { services } from '@/content/services'
import { cn } from '@/lib/cn'

/** Sticky part index for the services page; highlights the section in view. */
export function ServiceIndexNav() {
  const [active, setActive] = useState<string>(services[0].id)

  useEffect(() => {
    const els = services.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[]
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id)
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <nav
      aria-label="Services"
      className="sticky top-[var(--header-offset)] z-30 border-b border-line bg-bg/85 backdrop-blur-xl transition-[top] duration-500 ease-[var(--ease-out)]"
      id="services-grid"
    >
      <div className="shell flex gap-1 overflow-x-auto py-2 [scrollbar-width:none]">
        {services.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            aria-current={active === s.id ? 'true' : undefined}
            className={cn(
              'relative flex shrink-0 items-center gap-2 rounded-[9px] px-3.5 py-2 text-[0.9rem] font-medium transition-colors',
              active === s.id ? 'bg-ink text-bg' : 'text-ink-2 hover:bg-raise hover:text-ink',
            )}
          >
            <span className={cn('t-label', active === s.id ? 'text-teal' : 'text-ink-3')}>{s.n}</span>
            {s.label}
          </a>
        ))}
      </div>
    </nav>
  )
}
