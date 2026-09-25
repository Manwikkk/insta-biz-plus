'use client'

import { useEffect, useRef, useState, type PointerEvent } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { about } from '@/content/about'
import { Eyebrow } from '@/components/ui/SectionHead'
import { Icon } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'

gsap.registerPlugin(ScrollTrigger, useGSAP)

/**
 * "From 2020 to today" as a run of milestone cards. On desktop the section holds still
 * while you scroll and the years travel sideways past you, the timeline underneath filling
 * as they go. On phones and tablets (and with reduced motion) the run is a rail you swipe,
 * drag or step through with the arrows.
 */
export function Journey() {
  const j = about.journey
  const last = j.items.length - 1
  const root = useRef<HTMLElement>(null)
  const viewport = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLOListElement>(null)
  const fill = useRef<HTMLSpanElement>(null)
  const drag = useRef<{ x: number; left: number } | null>(null)
  const [driven, setDriven] = useState(false)
  const [at, setAt] = useState(0)
  const [edges, setEdges] = useState({ start: true, end: false })

  // Desktop: vertical scroll drives the run sideways.
  useGSAP(
    () => {
      const section = root.current
      const view = viewport.current
      const run = track.current
      if (!section || !view || !run) return
      const mm = gsap.matchMedia()
      mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
        setDriven(true)
        let travel = 0
        // the section is as tall as one screen plus the sideways distance, so the scroll maps 1:1
        const measure = () => {
          travel = Math.max(0, run.scrollWidth - view.clientWidth)
          section.style.height = `calc(100svh + ${travel}px)`
        }
        measure()
        ScrollTrigger.addEventListener('refreshInit', measure)
        let cur = -1
        gsap.to(run, {
          x: () => -travel,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.5,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (fill.current) fill.current.style.transform = `scaleX(${self.progress})`
              const k = Math.round(self.progress * last)
              if (k !== cur) {
                cur = k
                setAt(k)
              }
            },
          },
        })
        ScrollTrigger.refresh()
        return () => {
          ScrollTrigger.removeEventListener('refreshInit', measure)
          section.style.height = ''
          gsap.set(run, { clearProps: 'transform' })
          if (fill.current) fill.current.style.transform = ''
          setDriven(false)
        }
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  // Rail mode: position of the native sideways scroll.
  useEffect(() => {
    const el = viewport.current
    if (!el || driven) return
    const update = () => {
      const max = el.scrollWidth - el.clientWidth
      const p = max > 0 ? el.scrollLeft / max : 0
      if (fill.current) fill.current.style.transform = `scaleX(${p})`
      setAt(Math.round(p * last))
      const start = el.scrollLeft < 4
      const end = el.scrollLeft > max - 4
      setEdges((e) => (e.start === start && e.end === end ? e : { start, end }))
    }
    update()
    el.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      el.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [driven, last])

  const step = (dir: 1 | -1) => {
    const el = viewport.current
    const card = track.current?.querySelector<HTMLElement>('li')
    el?.scrollBy({ left: dir * ((card?.offsetWidth ?? 320) + 16), behavior: 'smooth' })
  }

  // Rail mode: a mouse can drag the rail (touch and trackpads scroll natively).
  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    if (driven || e.pointerType !== 'mouse' || !viewport.current) return
    drag.current = { x: e.clientX, left: viewport.current.scrollLeft }
    viewport.current.dataset.dragging = 'true'
  }
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current
    if (!d || !viewport.current) return
    viewport.current.scrollLeft = d.left - (e.clientX - d.x)
  }
  const onUp = () => {
    if (!viewport.current) return
    drag.current = null
    delete viewport.current.dataset.dragging
  }

  return (
    <section ref={root} className="journey relative border-b border-line" id="journey" data-driven={driven || undefined}>
      <div className="journey-frame flex flex-col justify-center py-[clamp(48px,9vh,120px)]">
        <div className="shell grid gap-5 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-6">
            <Eyebrow>{j.eyebrow}</Eyebrow>
            <h2 className="t-h2 mt-[clamp(10px,2vh,18px)]">{j.title}</h2>
          </div>
          <div className="flex flex-col gap-4 lg:col-span-5 lg:col-start-8">
            <p className="t-lede">{j.intro}</p>
            {!driven ? (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => step(-1)}
                  disabled={edges.start}
                  aria-label="Earlier milestones"
                  className="grid size-11 place-items-center rounded-full border border-line-2 transition-[background-color,color,opacity] hover:bg-ink hover:text-bg disabled:pointer-events-none disabled:opacity-35"
                >
                  <Icon name="arrow" size={17} className="rotate-180" />
                </button>
                <button
                  type="button"
                  onClick={() => step(1)}
                  disabled={edges.end}
                  aria-label="Later milestones"
                  className="grid size-11 place-items-center rounded-full border border-line-2 transition-[background-color,color,opacity] hover:bg-ink hover:text-bg disabled:pointer-events-none disabled:opacity-35"
                >
                  <Icon name="arrow" size={17} />
                </button>
              </div>
            ) : null}
          </div>
        </div>

        <div
          ref={viewport}
          className="journey-viewport mt-[clamp(22px,4.4vh,48px)]"
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          onPointerLeave={onUp}
        >
          <ol ref={track} className="journey-track flex w-max gap-4" aria-label="Milestones">
            {j.items.map((m, i) => {
              const now = i === last
              return (
                <li
                  key={m.year}
                  className={cn(
                    'journey-card flex w-[clamp(270px,24vw,340px)] shrink-0 flex-col rounded-[22px] border p-[clamp(18px,3vh,26px)]',
                    now ? 'border-ink bg-ink text-bg' : 'border-line bg-raise',
                    i === at && !now && 'is-at',
                  )}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span
                      className={cn(
                        't-label inline-flex h-7 items-center rounded-full px-3',
                        now ? 'bg-ember text-white' : m.tag ? 'bg-teal-soft text-teal-ink' : 'border border-line-2 text-ink-3',
                      )}
                    >
                      {m.tag ?? 'Milestone'}
                    </span>
                    <span className={cn('t-label', now ? 'text-bg/60' : 'text-ink-3')}>
                      {String(i + 1).padStart(2, '0')} / {String(j.items.length).padStart(2, '0')}
                    </span>
                  </div>
                  <p className="journey-year t-numeral mt-[clamp(14px,3.2vh,30px)] text-[clamp(2.5rem,min(4vw,7.6vh),4rem)]">{m.year}</p>
                  <h3
                    className={cn(
                      'mt-[clamp(10px,2vh,16px)] text-[1.15rem] font-semibold leading-tight tracking-[-0.015em]',
                      now ? 'text-bg' : 'text-ink',
                    )}
                  >
                    {m.title}
                  </h3>
                  <p className={cn('mt-2 text-[0.93rem] leading-[1.55]', now ? 'text-bg/75' : 'text-ink-2')}>{m.body}</p>
                </li>
              )
            })}
          </ol>
        </div>

        {/* the timeline: each year marked, the line filling as the years go by */}
        <div className="shell mt-[clamp(16px,3.2vh,30px)]" aria-hidden>
          <div className="relative">
            <span className="absolute inset-x-0 top-[5px] h-px bg-line-2">
              <span ref={fill} className="meter-fill block h-full bg-teal" />
            </span>
            <ol className="relative flex justify-between">
              {j.items.map((m, i) => (
                <li key={m.year} className="flex flex-col items-center gap-2 first:items-start last:items-end">
                  <span
                    className={cn(
                      'size-[11px] rounded-full border-2 transition-colors duration-300',
                      i <= at ? 'border-teal bg-teal' : 'border-line-2 bg-bg',
                    )}
                  />
                  <span className={cn('t-label transition-colors duration-300', i === at ? 'text-ink' : 'text-ink-3')}>{m.year}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}
