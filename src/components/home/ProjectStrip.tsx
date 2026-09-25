'use client'

import Image from 'next/image'
import Link from 'next/link'
import { memo, useCallback, useEffect, useRef, useState, type MouseEvent, type PointerEvent, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { media } from '@/content/site'
import { Icon } from '@/components/ui/Icon'
import type { Project } from '@/content/portfolio'
import { useMarquee } from '@/lib/useMarquee'
import { cn } from '@/lib/cn'

const ease = [0.16, 1, 0.3, 1] as const
/** Drift of the strip at full speed, px per second. */
const SPEED = 64

type Pick = { i: number; copy: number } | null
const same = (a: Pick, b: Pick) => a?.i === b?.i && a?.copy === b?.copy

/** One sheared screen. Memoised: a hover only re-renders the screen that lights up and the one that dims. */
const Screen = memo(function Screen({ p, i, copy, active }: { p: Project; i: number; copy: number; active: boolean }) {
  const common = { className: cn('wf-card', active && 'is-active'), 'data-i': i, 'data-copy': copy }
  const face = (
    <span className="wf-card-face">
      <Image
        src={media(p.image)}
        alt={copy ? '' : `${p.name} - ${p.category}`}
        fill
        sizes="(min-width: 1024px) 420px, 60vw"
        quality={75}
        className="object-cover object-top"
      />
    </span>
  )
  if (!p.href) return <div {...common}>{face}</div>
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
export function ProjectStrip({ projects, idle }: { projects: Project[]; idle: ReactNode }) {
  // The run is rendered twice for a seamless loop; the pick remembers which copy, so only it lights up.
  const [sel, setSel] = useState<Pick>(null)
  const strip = useRef<HTMLDivElement>(null)
  const pointer = useRef<{ x: number; y: number } | null>(null)
  const lastPointer = useRef('mouse')

  // What is under the resting pointer, re-checked while the strip slides beneath it.
  const probe = useCallback(() => {
    const pt = pointer.current
    if (!pt) return
    const card = document.elementFromPoint(pt.x, pt.y)?.closest<HTMLElement>('.wf-card')
    const next = card && strip.current?.contains(card) ? { i: Number(card.dataset.i), copy: Number(card.dataset.copy) } : null
    setSel((s) => (same(s, next) ? s : next))
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
                <Screen key={proj.slug} p={proj} i={i} copy={copy} active={sel?.i === i && sel?.copy === copy} />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* what's under the pointer: the old line and the new one cross-fade in place */}
      <div className="relative mt-[clamp(8px,1.8vh,18px)] grid min-h-[60px]" aria-live="polite">
        <AnimatePresence initial={false}>
          {p ? (
            <motion.div
              key={p.slug}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4, transition: { duration: 0.16 } }}
              transition={{ duration: 0.3, ease }}
              className="shell col-start-1 row-start-1 flex flex-wrap items-end justify-between gap-x-8 gap-y-3"
            >
              <div className="min-w-0">
                <p className="t-label text-teal">
                  {p.category} · {p.tag}
                </p>
                <p className="mt-1.5 text-[1.12rem] font-semibold leading-tight tracking-[-0.015em] text-stage-ink">{p.name}</p>
                <p className="mt-0.5 text-[0.95rem] text-stage-ink-2">{p.tagline}</p>
              </div>
              {p.href ? (
                <a
                  href={p.href}
                  {...(/^https?:/.test(p.href) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="group mb-1 inline-flex items-center gap-2 text-[0.95rem] font-medium text-stage-ink"
                >
                  <span className="link-draw">{p.ctaLabel || 'Visit project'}</span>
                  <Icon
                    name="arrow-up-right"
                    size={15}
                    className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </a>
              ) : null}
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
