'use client'

import { useEffect, useRef, useState, type RefObject } from 'react'
import { Icon } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'

/**
 * Small arrow buttons on a row that scrolls sideways, so nobody misses what is past the edge:
 * one on the right while there is more that way (it nudges to say so), one on the left once
 * the row has moved. They take the row a screen-width at a time and only show when the row
 * actually overflows. Put it beside the row, inside a `relative` box.
 */
export function ScrollCue({ target, tone = 'light', className }: { target: RefObject<HTMLElement | null>; tone?: 'light' | 'stage'; className?: string }) {
  const [edge, setEdge] = useState({ left: false, right: false, top: 0 })
  useEffect(() => {
    const el = target.current
    if (!el) return
    const read = () =>
      setEdge({
        left: el.scrollLeft > 6,
        right: el.scrollLeft + el.clientWidth < el.scrollWidth - 6,
        top: el.offsetTop + el.offsetHeight / 2,
      })
    read()
    el.addEventListener('scroll', read, { passive: true })
    const ro = new ResizeObserver(read)
    ro.observe(el)
    for (const c of el.children) ro.observe(c)
    return () => {
      el.removeEventListener('scroll', read)
      ro.disconnect()
    }
  }, [target])
  const go = (d: number) => {
    const el = target.current
    if (el) el.scrollBy({ left: d * Math.max(160, el.clientWidth * 0.7), behavior: 'smooth' })
  }
  return (
    <>
      {(['left', 'right'] as const).map((side) => (
        <button
          key={side}
          type="button"
          tabIndex={-1}
          aria-label={side === 'right' ? 'Scroll right' : 'Scroll left'}
          onClick={() => go(side === 'right' ? 1 : -1)}
          className={cn('scroll-cue', side === 'right' ? 'is-right' : 'is-left', tone === 'stage' && 'is-stage', edge[side] && 'is-on', className)}
          style={{ top: edge.top }}
        >
          <Icon name="chevron" size={16} strokeWidth={2.2} className={side === 'right' ? '-rotate-90' : 'rotate-90'} />
        </button>
      ))}
    </>
  )
}

/** A sideways-scrolling box with its cue, for server-rendered pages. */
export function ScrollRow({ className, children, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  const ref = useRef<HTMLDivElement>(null)
  return (
    <div className="relative">
      <div ref={ref} className={className} {...rest}>
        {children}
      </div>
      <ScrollCue target={ref} />
    </div>
  )
}
