'use client'

import dynamic from 'next/dynamic'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { engine, firePulse } from '@/components/three/engineState'
import { MarkBlueprint } from '@/components/brand/MarkBlueprint'
import { MARK_PIECES } from '@/components/brand/markGeometry'
import { services } from '@/content/services'
import { DragHint, EngineHandle } from './EngineHandle'
import { StageContext, useStage, type StageMode } from './stageContext'
import { useMedia } from '@/lib/useMedia'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const EngineCanvas = dynamic(() => import('@/components/three/EngineCanvas'), { ssr: false })

/** Order of MARK_PIECES: bar-top(marketing) · bar-mid(web) · frame-left(ai) · core(crm) · bar-low(mobile) · outline(design) */
export const FOCUS_INDEX: Record<string, number> = { marketing: 0, web: 1, ai: 2, crm: 3, mobile: 4, design: 5 }

function webglAvailable() {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

/**
 * Wraps the hero, problem and capabilities sections. On desktop a sticky full-viewport
 * canvas sits behind them (z-1) — section grounds at z-0, copy at z-2 — so the engine
 * travels through all three chapters as one continuous object. On smaller screens the
 * engine lives in a window inside the hero instead.
 */
export function EngineStage({ hero, problem, capabilities }: { hero: ReactNode; problem: ReactNode; capabilities: ReactNode }) {
  const root = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const [mode, setMode] = useState<StageMode>(null)
  const [active, setActive] = useState(true)
  const desktop = useMedia('(min-width: 1024px)', true)

  useEffect(() => {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    setMode(!reduce && webglAvailable() ? '3d' : 'static')
  }, [])

  useEffect(() => {
    const el = track.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { rootMargin: '10% 0px' })
    io.observe(el)
    return () => io.disconnect()
    // the track element is swapped when the layout (desktop) or render mode changes
  }, [desktop, mode])

  // Cursor tracking: the engine leans toward the pointer (read each frame by the canvas).
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      engine.pointer.x = (e.clientX / window.innerWidth) * 2 - 1
      engine.pointer.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  useGSAP(
    () => {
      const q = (s: string) => root.current?.querySelector<HTMLElement>(s)
      const heroEl = q('[data-stage="hero"]')
      const problemEl = q('[data-stage="problem"]')
      const capEl = q('[data-stage="capabilities"]')
      if (!heroEl || !problemEl || !capEl) return

      // Hero pose: turned a little to the left of a three-quarter view, so the mark reads face-on
      // while keeping its depth. The pointer still leans it either way from here.
      const base = {
        rotX: -0.42,
        rotY: 0.42,
        rotZ: 0,
        explode: 0.06,
        scatter: 0,
        dim: 0,
        labels: 0,
        callouts: 0,
        focus: -1,
        outline: 0,
        rev: 1,
        opacity: 1,
      }
      const mm = gsap.matchMedia()

      mm.add(
        {
          desk: '(min-width: 1024px) and (prefers-reduced-motion: no-preference)',
          wide: '(min-width: 1280px)',
          short: '(max-height: 780px)',
        },
        (ctx) => {
          const { desk, wide, short } = ctx.conditions as { desk: boolean; wide: boolean; short: boolean }
          if (!desk) return
          // Where the exploded engine parks for the capabilities chapter. Narrow screens give the copy
          // more room; short screens pull it up and left, clear of the live scene in the corner.
          const bay = wide
            ? short
              ? { x: 0.33, y: 0.15, scale: 0.62 }
              : { x: 0.42, y: 0.1, scale: 0.72 }
            : short
              ? { x: 0.46, y: 0.15, scale: 0.54 }
              : { x: 0.5, y: 0.12, scale: 0.6 }
          Object.assign(engine, base, { x: 0.47, y: 0.02, scale: 1, callouts: 1 })

          // Hero callouts step aside first, before the engine starts to travel.
          gsap.to(engine, { callouts: 0, ease: 'none', scrollTrigger: { trigger: heroEl, start: 'top top', end: '28% top', scrub: true } })

          // 1 · Hero → problem: the engine drifts to centre and loosens.
          gsap.timeline({ scrollTrigger: { trigger: heroEl, start: 'top top', end: 'bottom top', scrub: true } }).to(engine, {
            x: 0.12,
            scale: 0.95,
            explode: 0.28,
            rotY: 0.95,
            ease: 'none',
          })

          // 2 · Problem: parts scatter, dim and drift — then snap back together, still in
          // shadow behind "No silos…", and light up (with a pulse) as the paper floods back.
          let last = 0
          gsap
            .timeline({
              scrollTrigger: {
                trigger: problemEl,
                start: 'top top',
                end: 'bottom bottom',
                scrub: true,
                onUpdate: (self) => {
                  if (last < 0.86 && self.progress >= 0.86) firePulse()
                  last = self.progress
                },
              },
            })
            .to(engine, { scatter: 1, dim: 1, explode: 0.3, x: 0.06, rotY: 0.7, duration: 0.3, ease: 'power1.inOut' }, 0)
            .to(engine, { rotY: 1.1, x: 0, duration: 0.34, ease: 'none' }, 0.3)
            .to(engine, { scatter: 0, dim: 0.72, explode: 0, rotY: 0.62, scale: 1.05, duration: 0.16, ease: 'power3.inOut' }, 0.64)
            .to(engine, { dim: 0, duration: 0.1, ease: 'power2.out' }, 0.84)
            .to(engine, { duration: 0.06 }, 0.94)

          // 3 · Into capabilities: slide right, explode into an ordered axonometric view.
          gsap
            .timeline({ scrollTrigger: { trigger: capEl, start: 'top bottom', end: 'top top', scrub: true } })
            .to(engine, { ...bay, explode: 0.85, labels: 1, rotX: -0.5, rotY: 0.5, ease: 'power1.inOut' })

          // Leaving the stage.
          gsap
            .timeline({ scrollTrigger: { trigger: capEl, start: 'bottom bottom', end: 'bottom 35%', scrub: true } })
            .to(engine, { explode: 0.1, labels: 0, outline: 0, opacity: 0, ease: 'none' })
        },
      )

      mm.add('(max-width: 1023px) and (prefers-reduced-motion: no-preference)', () => {
        Object.assign(engine, base, { x: 0, y: 0, scale: 1.45 })
        gsap.timeline({ scrollTrigger: { trigger: heroEl, start: '35% top', end: 'bottom top', scrub: true } }).to(engine, {
          explode: 0.7,
          rotY: 1.4,
          ease: 'none',
        })
      })

      return () => mm.revert()
    },
    { scope: root, dependencies: [desktop] },
  )

  return (
    <StageContext.Provider value={{ mode, desktop, active }}>
      <div ref={root} className="engine-stage relative isolate">
        {desktop && mode === 'static' ? (
          // Reduced motion / no WebGL: the mark is a still figure that belongs to the hero only.
          <div ref={track} aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-[100svh]">
            <div className="absolute inset-y-0 right-[6%] grid w-[42%] place-items-center">
              <MarkBlueprint filled className="w-[min(30vw,420px)] text-ink-3" exploded={0.4} />
            </div>
          </div>
        ) : desktop ? (
          <div ref={track} aria-hidden className="engine-track pointer-events-none absolute inset-0 z-[1]">
            <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
              {mode === '3d' ? <EngineCanvas active={active} callouts /> : null}
            </div>
          </div>
        ) : (
          <div ref={track} aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[100svh]" />
        )}
        {hero}
        {problem}
        {capabilities}
      </div>
    </StageContext.Provider>
  )
}

/** The five parts in the order of their numbers (01 Web … 05 Marketing). */
const PARTS = MARK_PIECES.map((p) => services.find((s) => s.part === p.id))
  .filter((s): s is (typeof services)[number] => !!s)
  .sort((a, b) => a.n.localeCompare(b.n))

/** The engine's window inside the hero on phones and tablets. */
export function MobileEngineWindow() {
  const { mode, desktop, active } = useStage()
  if (desktop) return null
  return (
    <div className="lg:hidden">
      <div aria-hidden className="relative -mx-[var(--gutter)] mt-6 h-[min(92vw,440px)]">
        {mode === '3d' ? <EngineCanvas active={active} /> : null}
        {mode === '3d' ? <EngineHandle /> : null}
        {mode === 'static' ? (
          <div className="absolute inset-0 grid place-items-center">
            <MarkBlueprint filled className="w-[62%] text-ink-3" exploded={0.35} />
          </div>
        ) : null}
        {mode === '3d' ? <DragHint className="bottom-2 right-[var(--gutter)]" label="Drag to spin" /> : null}
      </div>
      <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5" aria-label="What the engine is made of">
        {PARTS.map((p) => (
          <li key={p.id} className="t-label text-ink-3">
            <span className="text-teal-ink">{p.n}</span> {p.short}
          </li>
        ))}
      </ul>
    </div>
  )
}
