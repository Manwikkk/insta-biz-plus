'use client'

import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { Breadcrumbs } from '@/components/sections/PageHero'
import { KeyButton } from '@/components/ui/KeyButton'
import { CharRise } from '@/components/motion/CharRise'
import { HEX, MARK_PIECES, centroid, svgPath } from '@/components/brand/markGeometry'
import { engine } from '@/components/three/engineState'
import { useMedia } from '@/lib/useMedia'
import { about as a } from '@/content/about'
import { services } from '@/content/services'
import { site } from '@/content/site'

gsap.registerPlugin(ScrollTrigger, useGSAP)

/** The homepage's 3D mark: three.js loads only here, in the browser. */
const EngineCanvas = dynamic(() => import('@/components/three/EngineCanvas'), { ssr: false })

const S = 100
const pad = (n: number) => String(n).padStart(2, '0')

function webglAvailable() {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

/** Ahmedabad's time, ticking; empty until mounted so server and client markup agree. */
function useIstClock() {
  const [t, setT] = useState('')
  useEffect(() => {
    const f = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
    const read = () => setT(f.format(new Date()))
    read()
    const id = window.setInterval(read, 1000)
    return () => window.clearInterval(id)
  }, [])
  return t
}

/** Without WebGL: the mark drawn flat, piece by piece, each with the service it stands for. */
function FlatMark() {
  return (
    <svg viewBox="-150 -150 300 300" className="ah-mark" aria-hidden>
      <defs>
        {MARK_PIECES.map((p) => (
          <linearGradient key={p.id} id={`ah-${p.id}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={p.color} />
            <stop offset="1" stopColor={p.color2} />
          </linearGradient>
        ))}
      </defs>
      <g className="ah-con" stroke="currentColor" strokeWidth="0.5" fill="none">
        <path d={`M -150 ${150 * 0.577} L 150 ${-150 * 0.577}`} />
        <path d={`M -150 ${-150 * 0.577} L 150 ${150 * 0.577}`} />
        <path d="M 0 -150 L 0 150" />
        <path d={svgPath(HEX, S * 1.16)} />
      </g>
      {MARK_PIECES.map((p) => {
        const svc = services.find((x) => x.part === p.id)!
        const [cx, cy] = p.anchor ?? centroid(p.pts)
        const [ex, ey] = p.explode
        return (
          <g key={p.id} data-piece data-ex={(ex * 46).toFixed(1)} data-ey={(-ey * 46).toFixed(1)}>
            <path d={svgPath(p.pts, S)} fill={`url(#ah-${p.id})`} />
            <g data-piece-label transform={`translate(${(cx * S + ex * 62).toFixed(1)} ${(-cy * S - ey * 62).toFixed(1)})`}>
              <circle r="2.2" fill="var(--teal)" />
              <text x={ex < 0 ? -7 : 7} y="3" textAnchor={ex < 0 ? 'end' : 'start'} className="ah-mark-label">
                {svc.n} {svc.short}
              </text>
            </g>
          </g>
        )
      })}
    </svg>
  )
}

/**
 * About opener. The line assembles itself letter by letter; between "makers," and
 * "builders" a caret blinks. Scroll, and the caret opens into a window on the studio,
 * pushing the words apart: the 3D logo turns inside it, then makes one full turn as the
 * window fills the screen and settles centre stage, its five parts named by leader lines,
 * leaning toward the pointer. The studio's coordinates and local time read out at the
 * corners. That dark screen is where the story begins. The caret holds steady while the
 * page moves and blinks when it rests, in either direction. Reduced motion: the line, as is.
 */
export function AboutHero() {
  const root = useRef<HTMLElement>(null)
  const frame = useRef<HTMLDivElement>(null)
  const time = useIstClock()
  const [mode, setMode] = useState<'3d' | 'flat' | null>(null)
  const [live, setLive] = useState(false)
  // the leader lines need the width of a desktop screen
  const wide = useMedia('(min-width: 1024px)', true)

  useEffect(() => setMode(webglAvailable() ? '3d' : 'flat'), [])

  // The 3D mark renders only while the hero is on screen, and leans toward the pointer.
  useEffect(() => {
    if (mode !== '3d') return
    const el = root.current!
    const io = new IntersectionObserver(([e]) => setLive(e.isIntersecting))
    io.observe(el)
    const onMove = (e: PointerEvent) => {
      engine.pointer.x = (e.clientX / window.innerWidth) * 2 - 1
      engine.pointer.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      io.disconnect()
      window.removeEventListener('pointermove', onMove)
    }
  }, [mode])

  useGSAP(
    () => {
      if (!mode) return
      const section = root.current!
      const stage = frame.current!
      // the engine's state is shared with the homepage: keep it as found, put it back on the way out
      const saved = { ...engine, pointer: { ...engine.pointer } }
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        section.dataset.driven = ''
        const q = gsap.utils.selector(section)
        const gap = q('[data-gap]')[0] as HTMLElement
        const win = q('[data-window]')[0] as HTMLElement

        // where the caret sits in the frame, re-read on every refresh
        const geo = () => {
          const f = stage.getBoundingClientRect()
          const g = gap.getBoundingClientRect()
          const cx = g.left + g.width / 2 - f.left
          const top = g.top - f.top
          const bottom = f.height - (g.bottom - f.top)
          const open = g.height * 1.5
          return { f, g, cx, top, bottom, open, cy: g.top + g.height / 2 - f.top }
        }
        const px = (n: number) => `${n.toFixed(1)}px`

        const tl = gsap.timeline({ defaults: { ease: 'none' } })
        tl.fromTo(
          win,
          {
            '--t': () => px(geo().top),
            '--b': () => px(geo().bottom),
            '--l': () => px(geo().cx),
            '--r': () => px(geo().f.width - geo().cx),
            '--rad': '6px',
          },
          {
            '--l': () => px(geo().cx - geo().open / 2),
            '--r': () => px(geo().f.width - geo().cx - geo().open / 2),
            duration: 0.3,
            ease: 'power2.out',
          },
        )
          .fromTo(q('[data-left]'), { x: 0 }, { x: () => -geo().open / 2, duration: 0.3, ease: 'power2.out' }, 0)
          .fromTo(q('[data-right]'), { x: 0 }, { x: () => geo().open / 2, duration: 0.3, ease: 'power2.out' }, 0)
          // the window draws its own caret over the slit while it is only a slit (under ~24px), so the
          // caret is never hidden under it on the way back, and never stands in front of the logo
          .fromTo(q('[data-wcaret]'), { opacity: 1 }, { opacity: 0, duration: 0.02 }, 0.004)
          .to(win, { '--t': '0px', '--b': '0px', '--l': '0px', '--r': '0px', '--rad': '0px', duration: 0.62, ease: 'power2.inOut' }, 0.3)
          .fromTo(q('[data-fade]'), { autoAlpha: 1, y: 0 }, { autoAlpha: 0, y: -24, duration: 0.3 }, 0.3)
          .fromTo(q('[data-readout]'), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.2, stagger: 0.04 }, 0.8)

        if (mode === '3d') {
          // the 3D logo: already turned to show its depth in the caret's window, then one full turn
          // as it grows to centre stage, where leader lines name its parts
          const view = () => {
            const g = geo()
            const base = Math.min(0.26 * g.f.height, 0.2 * g.f.width)
            return { x: (g.cx / g.f.width) * 2 - 1, y: 1 - (g.cy / g.f.height) * 2, scale: (g.g.height * 0.7) / (2 * base) }
          }
          Object.assign(engine, { rotZ: 0, scatter: 0, focus: -1, dim: 0, rev: 0.8, labels: 0, opacity: 1 })
          tl.fromTo(
            engine,
            { x: () => view().x, y: () => view().y, scale: () => view().scale, rotX: -0.3, rotY: 0.42 - Math.PI * 2, explode: 0.04, callouts: 0 },
            // phones size the logo by their narrow width, so it ends larger there
            // phones: the parts open a little so each can carry its own name tag (the callouts need a wide screen)
            {
              x: 0,
              y: 0,
              scale: () => (geo().f.width < 768 ? 1.05 : 0.86),
              rotX: -0.42,
              rotY: 0.42,
              explode: () => (geo().f.width < 1024 ? 0.5 : 0.08),
              duration: 0.62,
              ease: 'power2.inOut',
            },
            0.3,
          ).to(engine, { callouts: 1, labels: () => (geo().f.width < 1024 ? 1 : 0), duration: 0.16 }, 0.84)
        } else {
          const mark = q('[data-mark]')[0] as HTMLElement
          tl.fromTo(
            mark,
            {
              x: () => geo().cx - geo().f.width / 2,
              y: () => geo().cy - geo().f.height / 2,
              scale: () => (geo().g.height * 0.82) / mark.offsetHeight,
            },
            { x: 0, y: 0, scale: 1, duration: 0.62, ease: 'power2.inOut' },
            0.3,
          )
            .fromTo(
              q('[data-piece]'),
              { x: 0, y: 0 },
              { x: (_, el) => Number(el.dataset.ex), y: (_, el) => Number(el.dataset.ey), duration: 0.3, ease: 'power2.out', stagger: 0.02 },
              0.72,
            )
            .fromTo(q('[data-piece-label]'), { opacity: 0 }, { opacity: 1, duration: 0.2, stagger: 0.03 }, 0.82)
        }

        // a text caret holds steady while it moves and blinks when it rests
        let rest = 0
        const moving = () => {
          section.dataset.moving = ''
          window.clearTimeout(rest)
          rest = window.setTimeout(() => delete section.dataset.moving, 450)
        }
        const caret = q('.ah-gap .ah-caret')[0] as HTMLElement
        ScrollTrigger.create({
          trigger: section,
          start: 'top top',
          end: 'bottom bottom',
          animation: tl,
          scrub: 0.6,
          invalidateOnRefresh: true,
          // the window's caret matches the line's, whatever the type size
          onRefresh: () => win.style.setProperty('--cw', `${caret.offsetWidth}px`),
          // the bar takes the dark palette once the window has the top of the screen
          onUpdate: (self) => {
            moving()
            if (self.progress > 0.55) stage.dataset.navTone = 'dark'
            else delete stage.dataset.navTone
          },
        })
        // the hero just took its scroll length: re-measure everything after it
        ScrollTrigger.refresh()

        return () => {
          window.clearTimeout(rest)
          delete section.dataset.driven
          delete section.dataset.moving
          delete stage.dataset.navTone
        }
      })
      return () => {
        mm.revert()
        Object.assign(engine, saved)
      }
    },
    { scope: root, dependencies: [mode], revertOnUpdate: true },
  )

  return (
    <section ref={root} className="ah relative" aria-labelledby="about-title">
      <div ref={frame} className="ah-frame">
        <div aria-hidden className="absolute inset-0 [mask-image:radial-gradient(80%_70%_at_50%_45%,#000,transparent_75%)]">
          <div className="iso-grid" />
        </div>

        <div className="shell relative z-[2] flex h-full flex-col">
          <div data-fade>
            <div className="enter-fade flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
              <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'About Us' }]} />
              <p className="t-label text-ink-3">
                Est. {site.founded} <span className="text-teal-ink">·</span> Ahmedabad, India
              </p>
            </div>
          </div>

          <div className="flex flex-1 flex-col items-center justify-center py-[clamp(24px,5vh,56px)] text-center">
            <div data-fade>
              <p className="enter-fade t-label flex items-center gap-3 text-ink-2" style={{ ['--d' as string]: '120ms' }}>
                <span className="inline-flex h-6 items-center rounded-full bg-ink px-2.5 text-[0.62rem] font-semibold tracking-[0.08em] text-bg">
                  {a.tag}
                </span>
                {a.tagNote}
              </p>
            </div>
            <CharRise as="h1" id="about-title" on="load" delay={0.15} className="ah-title mt-[clamp(14px,3vh,30px)]">
              <span className="ah-lead">A team of </span>
              <span className="ah-line">
                <span data-left className="inline-block">
                  makers,
                </span>{' '}
                <span data-gap className="ah-gap" aria-hidden>
                  <span className="ah-caret" />
                </span>{' '}
                <span data-right className="inline-block">
                  builders
                </span>
              </span>{' '}
              <span className="ah-line">&amp; doers.</span>
            </CharRise>
          </div>

          <div className="grid gap-6 pb-[clamp(20px,4vh,44px)] lg:grid-cols-12 lg:items-end" data-fade>
            <p className="enter-fade t-lede max-w-[36rem] lg:col-span-6" style={{ ['--d' as string]: '700ms' }}>
              {a.intro}
            </p>
            <div className="enter-fade flex flex-wrap items-center gap-3 lg:col-span-5 lg:col-start-8 lg:justify-end" style={{ ['--d' as string]: '820ms' }}>
              <KeyButton href="/contact-us">{a.primary}</KeyButton>
              <KeyButton href="/portfolio" variant="ghost" icon={null}>
                {a.secondary}
              </KeyButton>
            </div>
          </div>
        </div>

        {/* the window on the studio: clipped to the caret, opened by the scroll */}
        <div data-window className="ah-window" aria-hidden>
          <div className="absolute inset-0 [mask-image:linear-gradient(to_bottom,#000_55%,transparent)]">
            <div className="iso-grid [--grid:var(--stage-line)]" />
          </div>
          {mode === '3d' ? (
            <EngineCanvas active={live} theme="dark" callouts={wide} />
          ) : mode === 'flat' ? (
            <div data-mark className="ah-mark-wrap">
              <FlatMark />
            </div>
          ) : null}
          <span data-readout className="ah-readout left-[var(--gutter)] top-[calc(var(--header-h)+16px)]">
            {site.name} — Est. {site.founded}
          </span>
          <span data-readout className="ah-readout right-[var(--gutter)] top-[calc(var(--header-h)+16px)] text-right tabular-nums">
            {time ? `${time} IST` : 'IST'}
          </span>
          <span data-readout className="ah-readout bottom-[clamp(20px,4vh,40px)] left-[var(--gutter)] tabular-nums">
            {site.geo.lat.toFixed(4)}° N · {site.geo.lng.toFixed(4)}° E
          </span>
          <span data-readout className="ah-readout bottom-[clamp(20px,4vh,40px)] right-[var(--gutter)] text-right">
            {pad(services.length)} disciplines · one team
          </span>
          <span data-wcaret className="ah-wcaret">
            <span className="ah-caret" />
          </span>
        </div>
      </div>
    </section>
  )
}
