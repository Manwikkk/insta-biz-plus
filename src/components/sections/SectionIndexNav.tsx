'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { ScrollCue } from '@/components/ui/ScrollCue'
import { cn } from '@/lib/cn'

export type IndexItem = { id: string; n: string; label: string }

/**
 * A sticky index of a page's sections, hung from the navbar. It is the bar's own width and
 * glass; once it reaches the top it docks just under the bar, its glass reaching up behind
 * the bar so the two read as one piece it slid out of. While the bar is away (scrolling
 * down) it takes the bar's place, and it follows the bar's palette over dark sections.
 * The section in view is highlighted (the highlight glides between items) and scrolled into
 * the row on phones.
 */
export function SectionIndexNav({ id, label, items }: { id?: string; label: string; items: IndexItem[] }) {
  const [active, setActive] = useState(items[0].id)
  const [docked, setDocked] = useState(false)
  const [dark, setDark] = useState(false)
  const nav = useRef<HTMLElement>(null)
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

  // docked once it has scrolled up to its sticky place (and only then does its glass reach behind the bar)
  useEffect(() => {
    const el = nav.current
    if (!el) return
    let raf = 0
    const check = () => {
      raf = 0
      setDocked(el.getBoundingClientRect().top <= parseFloat(getComputedStyle(el).top) + 1)
    }
    const queue = () => {
      if (!raf) raf = requestAnimationFrame(check)
    }
    check()
    window.addEventListener('scroll', queue, { passive: true })
    window.addEventListener('resize', queue)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', queue)
      window.removeEventListener('resize', queue)
    }
  }, [])

  // the bar's palette (it turns dark over dark sections), published by the Header
  useEffect(() => {
    const html = document.documentElement
    const read = () => setDark(html.dataset.navTone === 'dark')
    read()
    const mo = new MutationObserver(read)
    mo.observe(html, { attributes: true, attributeFilter: ['data-nav-tone'] })
    return () => mo.disconnect()
  }, [])

  // keep the active item visible in the (sideways-scrolling) row
  useEffect(() => {
    const r = row.current
    const a = r?.querySelector<HTMLElement>(`[data-id="${active}"]`)
    if (!r || !a || r.scrollWidth <= r.clientWidth) return
    r.scrollTo({ left: a.offsetLeft - (r.clientWidth - a.offsetWidth) / 2, behavior: 'smooth' })
  }, [active])

  return (
    <nav ref={nav} aria-label={label} className="subnav" id={id} data-docked={docked || undefined} data-theme={dark ? 'dark' : undefined}>
      <span className="subnav-glass nav-glass" data-scrolled="true" aria-hidden />
      <div ref={row} className="relative flex gap-1 overflow-x-auto p-1.5 [scrollbar-width:none]">
        {items.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            data-id={s.id}
            aria-current={active === s.id ? 'true' : undefined}
            className={cn(
              'relative flex shrink-0 items-center gap-2 rounded-[10px] px-3.5 py-2 text-[0.9rem] font-medium transition-colors duration-300 lg:rounded-[12px]',
              active === s.id ? 'text-bg' : 'text-ink-2 hover:bg-ink/[0.055] hover:text-ink',
            )}
          >
            {active === s.id ? (
              <motion.span
                layoutId={`${label}-index`}
                className="absolute inset-0 rounded-[inherit] bg-ink"
                transition={{ type: 'spring', stiffness: 480, damping: 40, mass: 0.7 }}
              />
            ) : null}
            <span className={cn('t-label relative', active === s.id ? 'text-teal' : 'text-ink-3')}>{s.n}</span>
            <span className="relative">{s.label}</span>
          </a>
        ))}
      </div>
      <ScrollCue target={row} />
    </nav>
  )
}
