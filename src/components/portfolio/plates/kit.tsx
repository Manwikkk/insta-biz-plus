'use client'

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

/** Every plate is drawn on a fixed W×H canvas and scaled to the plate's width. */
export const W = 800
export const H = 435

/** On screen (with a margin), so a plate only runs while it can be seen. */
export function useLive<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [live, setLive] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setLive(e.isIntersecting), { rootMargin: '80px 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return { ref, live }
}

/**
 * The step a scene is on: 0…n-1, each held for its own time (`ms`, one value or one per step),
 * then round again. It only moves while the plate is live and the tab is visible; for reduced
 * motion it rests on `rest` (by default the last, most complete step).
 */
export function usePhase(n: number, ms: number | readonly number[], live: boolean, rest = n - 1) {
  const [ph, setPh] = useState(0)
  const [still, setStill] = useState(false)
  const hold = typeof ms === 'number' ? ms : ms[ph % ms.length]
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) setStill(true)
  }, [])
  useEffect(() => {
    if (still || !live) return
    const id = window.setTimeout(() => !document.hidden && setPh((v) => (v + 1) % n), hold)
    return () => window.clearTimeout(id)
  }, [still, live, ph, n, hold])
  return still ? rest : ph
}

/** A fixed w×h canvas, scaled to its frame's width (hidden until measured, so it never flashes at full size). */
export function Canvas({
  children,
  live,
  className,
  style,
  w = W,
  h = H,
}: {
  children: ReactNode
  live: boolean
  className?: string
  style?: CSSProperties
  w?: number
  h?: number
}) {
  const box = useRef<HTMLDivElement>(null)
  const [k, setK] = useState(0)
  useEffect(() => {
    const el = box.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => setK(e.contentRect.width / w))
    ro.observe(el)
    return () => ro.disconnect()
  }, [w])
  return (
    <div ref={box} className="absolute inset-0 overflow-hidden" aria-hidden>
      <div
        className={cn('pl-canvas relative origin-top-left overflow-hidden', className)}
        data-live={live || undefined}
        style={{ width: w, height: h, transform: `scale(${k})`, visibility: k ? undefined : 'hidden', ...style }}
      >
        {children}
      </div>
    </div>
  )
}
