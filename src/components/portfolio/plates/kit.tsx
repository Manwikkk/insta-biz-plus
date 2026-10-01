'use client'

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { Icon, type IconName } from '@/components/ui/Icon'
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

/** A sidebar of an app: its mark, then its sections with one of them current. */
export function Side({
  mark,
  items,
  on,
  className,
  tone = 'light',
}: {
  mark: ReactNode
  items: { icon: IconName; label: string }[]
  on: number
  className?: string
  tone?: 'light' | 'dark'
}) {
  const dark = tone === 'dark'
  return (
    <aside className={cn('flex w-[150px] shrink-0 flex-col gap-1 px-3 py-4', className)}>
      <div className="mb-4 px-1">{mark}</div>
      {items.map((it, k) => (
        <span
          key={it.label}
          className={cn(
            'flex items-center gap-2 rounded-[7px] px-2 py-[6px] text-[11px] font-medium',
            k === on ? (dark ? 'bg-white/12 text-white' : 'bg-[var(--pl-accent)] text-white') : dark ? 'text-white/55' : 'text-[#5b6170]',
          )}
        >
          <Icon name={it.icon} size={13} />
          {it.label}
        </span>
      ))}
    </aside>
  )
}

/** A notification that slides in at the top right while `show` is on. */
export function Toast({ show, icon, title, note, tone = '#16a34a', className }: { show: boolean; icon: IconName; title: string; note?: string; tone?: string; className?: string }) {
  return (
    <div className={cn('pl-toast absolute right-4 top-4 z-20 flex w-[250px] items-center gap-2.5 rounded-[12px] bg-white p-2.5 shadow-[0_18px_40px_-16px_rgb(11_15_21/0.45),0_0_0_1px_rgb(11_15_21/0.06)]', show && 'is-on', className)}>
      <span className="grid size-8 shrink-0 place-items-center rounded-[9px] text-white" style={{ background: tone }}>
        <Icon name={icon} size={15} strokeWidth={2.2} />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-[11.5px] font-semibold text-[#0b0f15]">{title}</span>
        {note ? <span className="block truncate text-[10px] text-[#6b7280]">{note}</span> : null}
      </span>
    </div>
  )
}

/** A small status chip. */
export function Chip({ children, tone, className }: { children: ReactNode; tone: string; className?: string }) {
  return (
    <span
      className={cn('inline-flex h-[18px] items-center gap-1 whitespace-nowrap rounded-full px-2 text-[9.5px] font-semibold transition-colors duration-500', className)}
      style={{ color: tone, background: `color-mix(in oklab, ${tone} 13%, transparent)` }}
    >
      {children}
    </span>
  )
}

/** A pointer that glides to (x, y) on the canvas and presses when `press` is on. */
export function Pointer({ x, y, press }: { x: number; y: number; press?: boolean }) {
  return (
    <span className="pl-pointer absolute left-0 top-0 z-30" style={{ transform: `translate(${x}px, ${y}px)` }}>
      <svg className={cn('pl-pointer-in block', press && 'is-press')} width="18" height="22" viewBox="0 0 18 22">
        <path d="M1.5 1.5v15.6l4.1-3.7 2.8 6.6 3-1.3-2.7-6.4h5.7z" fill="#0b0f15" stroke="#fff" strokeWidth="1.4" strokeLinejoin="round" />
      </svg>
    </span>
  )
}
