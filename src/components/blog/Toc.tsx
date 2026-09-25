'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/cn'

/**
 * "On this page": sticky index with scroll-spy. The rail beside the list fills with
 * reading progress; the fixed hairline under the header mirrors it.
 */
export function Toc({ items, articleId }: { items: { id: string; label: string }[]; articleId: string }) {
  const [active, setActive] = useState(items[0]?.id)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter(Boolean) as HTMLElement[]
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (vis[0]) setActive(vis[0].target.id)
      },
      { rootMargin: '-20% 0px -65% 0px' },
    )
    els.forEach((e) => io.observe(e))
    const article = document.getElementById(articleId)
    const onScroll = () => {
      if (!article) return
      const r = article.getBoundingClientRect()
      const p = Math.min(1, Math.max(0, (window.innerHeight * 0.3 - r.top) / (r.height - window.innerHeight * 0.5)))
      setProgress(p)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      io.disconnect()
      window.removeEventListener('scroll', onScroll)
    }
  }, [items, articleId])

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-[55] h-[2px] origin-left bg-teal" style={{ transform: `scaleX(${progress})` }} aria-hidden />
      <nav aria-label="On this page" className="relative pl-5">
        <p className="t-label text-ink-3">On this page ({items.length})</p>
        <span className="absolute bottom-0 left-0 top-7 w-px bg-line-2" aria-hidden>
          <span className="block w-full origin-top bg-teal" style={{ height: '100%', transform: `scaleY(${progress})` }} />
        </span>
        <ol className="mt-4 grid gap-1">
          {items.map((it, i) => (
            <li key={it.id}>
              <a
                href={`#${it.id}`}
                className={cn(
                  'flex gap-3 rounded-[8px] py-1.5 text-[0.9rem] leading-snug transition-colors',
                  active === it.id ? 'font-medium text-ink' : 'text-ink-3 hover:text-ink-2',
                )}
              >
                <span className="t-label w-5 shrink-0 pt-[2px] text-[0.62rem]">{String(i + 1).padStart(2, '0')}</span>
                {it.label}
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </>
  )
}
