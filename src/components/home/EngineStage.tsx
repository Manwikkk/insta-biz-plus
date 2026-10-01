'use client'

import dynamic from 'next/dynamic'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { engine, firePulse } from '@/components/three/engineState'
import { MarkBlueprint } from '@/components/brand/MarkBlueprint'
import { EngineHandle } from './EngineHandle'
import { StageContext, useStage, type StageMode } from './stageContext'
import { useMedia } from '@/lib/useMedia'
import { hexClipAt } from '@/lib/hex'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const EngineCanvas = dynamic(() => import('@/components/three/EngineCanvas'), { ssr: false })

/** Order of MARK_PIECES: bar-top(web) · bar-mid(automation) · frame-left(ai) · core(crm) · bar-low(mobile) */
export const FOCUS_INDEX: Record<string, number> = { web: 0, automation: 1, ai: 2, crm: 3, mobile: 4 }

function webglAvailable() {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

/**
 * Wraps the hero, problem and capabilities sections. A sticky full-viewport canvas sits
 * behind them (z-1) — section grounds at z-0, copy at z-2 — so the engine travels through
 * all three chapters as one continuous object. On phones and tablets the engine starts in
 * its window at the foot of the hero; as the page goes up it floats on down, low on the
 * screen, and the dark stage of the next chapter opens round it as a hexagon.
 */
export function EngineStage({ hero, problem, capabilities }: { hero: ReactNode; problem: ReactNode; capabilities: ReactNode }) {
  const root = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const screen = useRef<HTMLDivElement>(null)
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
            .to(engine, { explode: 0.1, labels: 0, opacity: 0, ease: 'none' })
        },
      )

      mm.add('(max-width: 1023px) and (prefers-reduced-motion: no-preference)', () => {
        const H = () => screen.current?.offsetHeight || window.innerHeight
        const slot = heroEl.querySelector<HTMLElement>('[data-engine-slot]')
        const curtain = screen.current?.querySelector<HTMLElement>('[data-curtain]') ?? null
        // The engine in its window at the top of the page: placed on the window's centre and sized to
        // fill it (the mark is 2 × min(26% of the height, 20% of the width) px at scale 1).
        const inWindow = () => {
          const h = H()
          if (!slot) return { y: -0.4, scale: 1.2 }
          let top = 0
          for (let el: HTMLElement | null = slot; el && el !== heroEl; el = el.offsetParent as HTMLElement | null) top += el.offsetTop
          const centre = top + slot.offsetHeight / 2
          const unit = 2 * Math.min(0.26 * h, 0.2 * window.innerWidth)
          return { y: 1 - (2 * centre) / h, scale: gsap.utils.clamp(0.85, 1.45, (slot.offsetHeight * 0.8) / unit) }
        }
        // Where it rides once it has left its window: low on the screen, under the headlines to come.
        const LOW = -0.44
        Object.assign(engine, base, { x: 0, ...inWindow() })
        curtain?.style.setProperty('--cy', `${((1 - LOW) / 2) * 100}%`)
        // Where it sits for "what we do": centred in the room above the part card, in its hero pose and
        // size (only made smaller if that room is short), the part being read lifting out of it.
        const bay = () => {
          const card = capEl.querySelector<HTMLElement>('[data-cap-card]')
          const h = H()
          const cardH = card?.offsetHeight ?? h * 0.45
          const free = Math.max(160, h - cardH - 96)
          const centre = 76 + free / 2
          const unit = 2 * Math.min(0.26 * h, 0.2 * window.innerWidth)
          return { y: 1 - (2 * centre) / h, scale: Math.min(inWindow().scale, (free * 0.85) / unit) }
        }
        // Each phase states where it starts (the previous phase's end) so scrubbing back and forth
        // through the boundaries never jumps; none renders until its own scroll range is reached.
        const later = { immediateRender: false }

        // 1 · Hero: nothing is held. The copy goes up with the page while the engine leaves its window
        // and floats on down the page, low on the screen, turning to face you; the dark stage opens
        // round it as a hexagon, and the bar turns dark once that has the top of the screen.
        const fall = gsap
          .timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: heroEl,
              start: 'top top',
              end: 'bottom top',
              scrub: true,
              invalidateOnRefresh: true,
              onUpdate: () => {
                if (!curtain) return
                const r = parseFloat(curtain.style.getPropertyValue('--r')) || 0
                if (r >= 80) curtain.dataset.navTone = 'dark'
                else delete curtain.dataset.navTone
              },
            },
          })
          .fromTo(
            engine,
            { y: () => inWindow().y, scale: () => inWindow().scale, explode: 0.06, rotY: 0.42 },
            { y: LOW, scale: 1.12, explode: 0.22, rotY: 0.95, duration: 1, ease: 'power1.inOut', ...later },
            0,
          )
        if (curtain) fall.fromTo(curtain, { '--r': '0vmax', opacity: 0 }, { '--r': '125vmax', opacity: 1, duration: 0.9, ease: 'power2.inOut' }, 0.1)

        // The problem chapter's own dark ground has the screen once it reaches the top: the curtain steps aside.
        ScrollTrigger.create({
          trigger: problemEl,
          start: 'top top',
          onToggle: (self) => {
            if (!curtain) return
            curtain.style.visibility = self.isActive ? 'hidden' : ''
            if (self.isActive) delete curtain.dataset.navTone
          },
        })

        // 2 · Problem: the parts scatter to the edges of the screen, dim, and drift — then snap back
        // together low on the screen, under "One team. One plan.", into the very pose and size the
        // logo had in the hero, and light up with a pulse as the paper returns.
        let last = 0
        gsap
          .timeline({
            scrollTrigger: {
              trigger: problemEl,
              start: 'top top',
              end: 'bottom bottom',
              scrub: true,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                if (last < 0.86 && self.progress >= 0.86) firePulse()
                last = self.progress
              },
            },
          })
          .fromTo(
            engine,
            { y: LOW, scatter: 0, dim: 0, explode: 0.22, rotY: 0.95, scale: 1.12, opacity: 1 },
            { scatter: 1, dim: 1, explode: 0.3, rotY: 0.7, scale: 1, duration: 0.3, ease: 'power1.inOut', ...later },
            0,
          )
          .to(engine, { rotY: 1.1, duration: 0.34, ease: 'none' }, 0.3)
          .to(
            engine,
            { scatter: 0, dim: 0.72, explode: base.explode, rotX: base.rotX, rotY: base.rotY, y: -0.5, scale: () => inWindow().scale, duration: 0.16, ease: 'power3.inOut' },
            0.64,
          )
          .to(engine, { dim: 0, duration: 0.1, ease: 'power2.out' }, 0.84)
          .to(engine, { duration: 0.06 }, 0.94)

        // 3 · What we do: it rises above the part card, keeping the pose it had in the hero.
        gsap
          .timeline({ scrollTrigger: { trigger: capEl, start: 'top bottom', end: 'top top', scrub: true, invalidateOnRefresh: true } })
          .fromTo(
            engine,
            { x: 0, y: -0.5, scale: () => inWindow().scale, explode: base.explode, rotX: base.rotX, rotY: base.rotY, dim: 0, scatter: 0 },
            { x: 0, y: () => bay().y, scale: () => bay().scale, explode: base.explode, labels: 0, rotX: base.rotX, rotY: base.rotY, ease: 'power1.inOut', ...later },
          )

        // Leaving the stage.
        gsap
          .timeline({ scrollTrigger: { trigger: capEl, start: 'bottom bottom', end: 'bottom 45%', scrub: true } })
          .fromTo(engine, { explode: base.explode, opacity: 1 }, { explode: base.explode, opacity: 0, ease: 'none', ...later })

        return () => {
          if (!curtain) return
          curtain.style.visibility = ''
          delete curtain.dataset.navTone
        }
      })

      return () => mm.revert()
    },
    { scope: root, dependencies: [desktop], revertOnUpdate: true },
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
        ) : desktop || mode === '3d' ? (
          <div
            ref={track}
            aria-hidden
            className="engine-track pointer-events-none absolute inset-0 z-[1] select-none"
          >
            <div ref={screen} className="sticky top-0 h-[100svh] w-full overflow-hidden">
              {/* phones: the next chapter's dark stage, opening round the engine as it floats down */}
              {!desktop ? (
                <div aria-hidden data-curtain className="engine-curtain" style={{ clipPath: hexClipAt('var(--r, 0vmax)', '50%', 'var(--cy, 72%)') }}>
                  <div className="absolute inset-0 [mask-image:radial-gradient(60%_60%_at_50%_70%,#000,transparent)]">
                    <div className="iso-grid [--grid:var(--stage-line)]" />
                  </div>
                </div>
              ) : null}
              {mode === '3d' ? <EngineCanvas active={active} callouts={desktop} /> : null}
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

/**
 * The engine's place in the hero on phones and tablets: whatever room the copy leaves. The
 * live engine is drawn by the stage's canvas, placed on this window; here it can be dragged
 * to spin.
 */
export function MobileEngineWindow() {
  const { mode, desktop } = useStage()
  if (desktop) return null
  return (
    <div className="flex flex-1 flex-col lg:hidden">
      <div aria-hidden data-engine-slot className="relative -mx-[var(--gutter)] mt-3 min-h-[190px] flex-1">
        {mode === '3d' ? <EngineHandle /> : null}
        {mode === 'static' ? (
          <div className="absolute inset-0 grid place-items-center">
            <MarkBlueprint filled className="w-[62%] text-ink-3" exploded={0.35} />
          </div>
        ) : null}
      </div>
    </div>
  )
}
