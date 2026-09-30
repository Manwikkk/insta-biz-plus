'use client'

import Image from 'next/image'
import Link from 'next/link'
import { memo, useCallback, useEffect, useRef, useState, type MouseEvent, type PointerEvent, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Icon } from '@/components/ui/Icon'
import type { Showcase } from '@/content/portfolio'
import { useMarquee } from '@/lib/useMarquee'
import { cn } from '@/lib/cn'

const ease = [0.16, 1, 0.3, 1] as const
/** Drift of the strip at full speed, px per second. */
const SPEED = 64
/** The screens' shear, tan(28deg), and how far a picked screen lifts (both as in .wf-card). */
const TAN = 0.5317
const LIFT = 12

type Pick = { i: number; copy: number } | null
const same = (a: Pick, b: Pick) => a?.i === b?.i && a?.copy === b?.copy

/** One sheared screen. Memoised: a hover only re-renders the screen that lights up and the one that dims. */
const Screen = memo(function Screen({ p, i, copy, active }: { p: Showcase; i: number; copy: number; active: boolean }) {
  const common = { className: cn('wf-card', active && 'is-active'), 'data-i': i, 'data-copy': copy }
  const face = (
    <span className="wf-card-face">
      <Image
        src={p.image}
        alt={copy ? '' : `${p.name} - ${p.label}`}
        fill
        sizes="(min-width: 1024px) 420px, 60vw"
        quality={75}
        className="object-cover object-top"
      />
    </span>
  )
  const nav = { ...common, tabIndex: copy ? -1 : undefined }
  return /^https?:/.test(p.href) ? (
    <a href={p.href} target="_blank" rel="noopener noreferrer" {...nav}>
      {face}
    </a>
  ) : (
    <Link href={p.href} {...nav}>
      {face}
    </Link>
  )
})

/**
 * The work as a run of sheared website screens, each overlapping the one before it.
 * The run glides to a stop under the pointer; the screen beneath it lifts out with a
 * white edge, the rest dim, and the project is named underneath. On touch screens the
 * first tap picks a screen and the details line carries the link.
 */
export function ProjectStrip({ items: projects, idle }: { items: Showcase[]; idle: ReactNode }) {
  // The run is rendered twice for a seamless loop; the pick remembers which copy, so only it lights up.
  const [sel, setSel] = useState<Pick>(null)
  const strip = useRef<HTMLDivElement>(null)
  const pointer = useRef<{ x: number; y: number } | null>(null)
  const lastPointer = useRef('mouse')

  // What is under the resting pointer, re-checked while the strip slides beneath it. Screens are
  // hit-tested as the sheared shapes they are at rest, not by whatever is drawn on top: a picked
  // screen lifts and comes forward, which would otherwise slip it out from under the pointer at
  // its edges and set it flickering between picked and not.
  const probe = useCallback(() => {
    const pt = pointer.current
    const root = strip.current
    if (!pt || !root) return
    const inside = (el: HTMLElement, dy = 0) => {
      const r = el.getBoundingClientRect()
      const u = pt.x - r.left
      if (u < 0 || u > el.offsetWidth) return false
      const v = pt.y - (r.top + dy) - u * TAN
      return v >= 0 && v <= el.offsetHeight
    }
    setSel((s) => {
      // the picked screen stays picked while the pointer is on it, lifted or at rest
      if (s) {
        const cur = root.querySelector<HTMLElement>(`.wf-card[data-i="${s.i}"][data-copy="${s.copy}"]`)
        if (cur && (inside(cur) || inside(cur, LIFT))) return s
      }
      // otherwise the top-most screen under the pointer (each screen sits on the one before it)
      const cards = root.querySelectorAll<HTMLElement>('.wf-card')
      for (let k = cards.length - 1; k >= 0; k--) {
        if (!inside(cards[k])) continue
        const next = { i: Number(cards[k].dataset.i), copy: Number(cards[k].dataset.copy) }
        return same(s, next) ? s : next
      }
      return null
    })
  }, [])

  const { trackRef, hold } = useMarquee<HTMLDivElement>({ speed: SPEED, onFrame: probe })

  // Held while anything is picked, so the details line below stays reachable.
  useEffect(() => {
    hold(sel !== null)
  }, [sel, hold])

  const onMove = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse') return
    pointer.current = { x: e.clientX, y: e.clientY }
    probe()
  }

  const pickFrom = (target: EventTarget | null) => {
    const card = (target as HTMLElement | null)?.closest<HTMLElement>('.wf-card')
    return card ? { i: Number(card.dataset.i), copy: Number(card.dataset.copy) } : null
  }

  const onClickCapture = (e: MouseEvent) => {
    // touch: the first tap on a screen picks it instead of following its link
    if (lastPointer.current === 'mouse') return
    const next = pickFrom(e.target)
    if (next && !same(sel, next)) {
      e.preventDefault()
      setSel(next)
    }
  }

  const p = sel === null ? null : projects[sel.i]

  return (
    // Leaving the strip for its details line keeps the pick, so the link stays reachable.
    <div
      onPointerLeave={(e) => {
        if (e.pointerType !== 'mouse') return
        pointer.current = null
        setSel(null)
      }}
    >
      <div
        ref={strip}
        className={cn('wf-strip', sel !== null && 'is-holding')}
        aria-label="Selected projects"
        onPointerMove={onMove}
        onPointerEnter={onMove}
        onPointerLeave={() => (pointer.current = null)}
        onPointerDown={(e) => (lastPointer.current = e.pointerType)}
        onClickCapture={onClickCapture}
        onFocus={(e) => setSel(pickFrom(e.target))}
        onBlur={(e) => {
          if (!strip.current?.contains(e.relatedTarget as Node | null)) setSel(null)
        }}
      >
        <div ref={trackRef} className="wf-track">
          {[0, 1].map((copy) => (
            <div key={copy} className="wf-run" aria-hidden={copy === 1 || undefined}>
              {projects.map((proj, i) => (
                <Screen key={proj.key} p={proj} i={i} copy={copy} active={sel?.i === i && sel?.copy === copy} />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* what's under the pointer: the old line and the new one cross-fade in place */}
      {/* a fixed height, so naming a screen never changes the height of the section */}
      <div className="relative mt-[clamp(8px,1.8vh,18px)] grid h-[clamp(68px,8.6vh,80px)] items-center overflow-hidden" aria-live="polite">
        <AnimatePresence initial={false}>
          {p ? (
            <motion.div
              key={p.key}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4, transition: { duration: 0.16 } }}
              transition={{ duration: 0.3, ease }}
              className="shell col-start-1 row-start-1 flex flex-wrap items-end justify-between gap-x-8 gap-y-3"
            >
              <div className="min-w-0 max-w-2xl">
                <p className="t-label text-teal">{p.label}</p>
                <p className="mt-1 text-[1.05rem] font-semibold leading-tight tracking-[-0.015em] text-stage-ink">{p.name}</p>
                <p className="mt-0.5 line-clamp-1 text-[0.92rem] text-stage-ink-2">{p.summary}</p>
              </div>
              <a
                href={p.href}
                {...(/^https?:/.test(p.href) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="group mb-1 inline-flex items-center gap-2 text-[0.95rem] font-medium text-stage-ink"
              >
                <span className="link-draw">{p.cta}</span>
                <Icon
                  name={/^https?:/.test(p.href) ? 'arrow-up-right' : 'arrow'}
                  size={15}
                  className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </a>
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.12 } }}
              transition={{ duration: 0.3 }}
              className="col-start-1 row-start-1"
            >
              {idle}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
