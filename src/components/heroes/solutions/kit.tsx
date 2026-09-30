'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Icon, type IconName } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'

export const ease = [0.16, 1, 0.3, 1] as const

const IN = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 })
/** Indian grouping: 736250 → "7,36,250". */
export const num = (n: number) => IN.format(Math.round(n))
export const inr = (n: number) => `₹ ${num(n)}`
/** Lakh / crore shorthand for property prices: 8341500 → "₹ 83.4 L", 11152000 → "₹ 1.12 Cr". */
export const lakh = (n: number) => (n >= 1e7 ? `₹ ${(n / 1e7).toFixed(2)} Cr` : `₹ ${(n / 1e5).toFixed(1)} L`)

/** A number that glides to each new value instead of jumping (and jumps for reduced motion). */
export function useTween(target: number, ms = 800) {
  const [v, setV] = useState(target)
  const from = useRef(target)
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      from.current = target
      setV(target)
      return
    }
    const a = from.current
    const t0 = performance.now()
    let raf = 0
    const step = (t: number) => {
      const k = Math.min(1, (t - t0) / ms)
      const cur = a + (target - a) * (1 - Math.pow(1 - k, 3))
      from.current = cur
      setV(cur)
      if (k < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [target, ms])
  return v
}

/** A row of choices over a figure (countries, courses, destinations…). */
export function Choices<T extends string>({
  items,
  value,
  onPick,
  label,
  className,
}: {
  items: { id: T; label: ReactNode; note?: ReactNode }[]
  value: T
  onPick: (id: T) => void
  label: string
  className?: string
}) {
  return (
    <div role="group" aria-label={label} className={cn('flex gap-1 rounded-[11px] border border-line bg-bg p-1', className)}>
      {items.map((it) => {
        const on = it.id === value
        return (
          <button
            key={it.id}
            type="button"
            aria-pressed={on}
            onClick={() => onPick(it.id)}
            className={cn(
              'flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-[8px] px-2 py-1.5 text-[0.76rem] font-medium transition-[background-color,color,box-shadow] duration-300',
              on ? 'bg-ink text-bg shadow-[0_6px_14px_-8px_rgb(0_0_0/0.5)]' : 'text-ink-2 hover:bg-raise hover:text-ink',
            )}
          >
            <span className="truncate">{it.label}</span>
            {it.note ? <span className={cn('t-label hidden text-[0.56rem] sm:inline', on ? 'text-teal' : 'text-ink-3')}>{it.note}</span> : null}
          </button>
        )
      })}
    </div>
  )
}

/** A small status pill. */
export function Pill({ tone = 'line', icon, children, className }: { tone?: 'line' | 'teal' | 'ink' | 'ember'; icon?: IconName; children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        't-label inline-flex h-6 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-[6px] px-2 text-[0.58rem] transition-colors duration-500',
        tone === 'teal' && 'bg-teal-soft text-teal-ink',
        tone === 'ink' && 'bg-ink text-bg',
        tone === 'ember' && 'bg-ember/12 text-ember',
        tone === 'line' && 'border border-line-2 text-ink-3',
        className,
      )}
    >
      {icon ? <Icon name={icon} size={11} strokeWidth={2.2} /> : null}
      {children}
    </span>
  )
}

/** The line under each figure: the systems this software plugs into. */
export function Works({ ints, note }: { ints: string[]; note?: string }) {
  return (
    <div className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5 px-1">
      <p className="t-label flex min-w-0 items-center gap-1.5 text-ink-2">
        <Icon name="workflow" size={13} className="shrink-0 text-teal-ink" />
        <span>Connects with {ints.slice(0, 3).join(' · ')}</span>
      </p>
      {note ? <p className="t-label ml-auto text-ink-3">{note}</p> : null}
    </div>
  )
}
