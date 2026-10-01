'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { about } from '@/content/about'
import { WhatsNext } from './WhatsNext'
import { cn } from '@/lib/cn'

gsap.registerPlugin(ScrollTrigger, useGSAP)

/** Points in the ink trail that follows the head down the line. */
const TRAIL = 80
/** Where the head rides, as a fraction of the screen's height. */
const HEAD_AT = 0.68

/**
 * "From 2020 to today", told down a single line. A bright head travels the line as you
 * scroll, weaving a little either side of it, and behind it a ribbon of ink in the brand's
 * teal-to-blue streams out and settles back onto the line when you stop. Each year lights
 * up as the head reaches it and its story slides in from its side. The line runs on into
 * the last screen and ends in a node; the head rides into it, the node lights, and a circle
 * opens from it to fill the screen, the year counting on to today. On the other side, what
 * comes next, among the AI work it names (WhatsNext).
 */
export function Journey() {
  const j = about.journey
  const events = j.items.slice(0, -1)
  const now = j.items[j.items.length - 1]
  const from = Number(j.items[0].year)
  const to = Number(now.year)

  const root = useRef<HTMLElement>(null)
  const line = useRef<HTMLDivElement>(null)
  const fill = useRef<HTMLSpanElement>(null)
  const head = useRef<HTMLSpanElement>(null)
  const segs = useRef<(SVGPathElement | null)[]>([])
  const expand = useRef<HTMLDivElement>(null)
  const stem = useRef<HTMLSpanElement>(null)
  const stemFill = useRef<HTMLSpanElement>(null)
  const dot = useRef<HTMLSpanElement>(null)
  const disc = useRef<HTMLDivElement>(null)
  const year = useRef<HTMLSpanElement>(null)

  // The line: the head, the fill, the years lighting up and the ink trail, read every frame on screen.
  useEffect(() => {
    const box = line.current
    if (!box) return
    const reduce = matchMedia('(prefers-reduced-motion: reduce)')
    const nodes = [...box.querySelectorAll<HTMLElement>('[data-event]')]
    const pts = Array.from({ length: TRAIL }, () => ({ x: 0, y: 0 }))
    const half = TRAIL / 2
    let raf = 0
    let onScreen = false
    let seeded = false

    const frame = () => {
      raf = 0
      const r = box.getBoundingClientRect()
      // Where the line ends: the node on the last screen while that screen is driven, or the foot of the list.
      const driven = expand.current?.hasAttribute('data-driven')
      const d = driven ? dot.current!.getBoundingClientRect() : null
      const end = d ? d.top + d.height / 2 - r.top : r.height
      const y = reduce.matches ? end : Math.min(end, Math.max(0, window.innerHeight * HEAD_AT - r.top))
      // p runs 0…1 down the list; past it, the head is on the stem
      const p = Math.min(1, y / r.height)
      fill.current!.style.transform = `scaleY(${p.toFixed(4)})`
      if (d) {
        const s = stem.current!.getBoundingClientRect()
        const sp = Math.min(1, Math.max(0, (r.top + y - s.top) / s.height))
        stemFill.current!.style.transform = `scaleY(${sp.toFixed(4)})`
        dot.current!.classList.toggle('is-on', y >= end - 1.5)
      }
      head.current!.style.transform = `translate(-50%, ${y.toFixed(1)}px)`
      head.current!.style.opacity = y > 1 && y < end - 1.5 ? '1' : '0'
      for (const n of nodes) n.classList.toggle('is-on', n.offsetTop + 10 <= y + 1)

      if (!reduce.matches) {
        // the head weaves either side of the line; each point of the trail eases toward the one ahead
        const narrow = box.clientWidth < 768
        const cx = narrow ? 20 : box.clientWidth / 2
        const hx = cx + Math.sin(p * Math.PI * 10) * (narrow ? 20 : 56)
        if (!seeded) {
          for (const q of pts) {
            q.x = hx
            q.y = y
          }
          seeded = true
        }
        let ax = hx
        let ay = y
        for (let k = 0; k < TRAIL; k++) {
          const q = pts[k]
          q.x += (ax - q.x) / 4
          // the ink only ever lies on the line already travelled: scrolling back, it gathers into
          // the head rather than streaming on below it, past the end
          q.y = Math.min(q.y + (ay - q.y) / 4, y)
          if (k > 0) {
            const seg = segs.current[k]
            const len = Math.hypot(ax - q.x, ay - q.y)
            // thickest mid-ribbon, and nothing at all once the trail has caught up with the head
            const width = (1 + ((k <= half ? k : TRAIL - k) * 5) / half) * Math.min(1, len / 8)
            seg?.setAttribute('d', `M${ax.toFixed(1)},${ay.toFixed(1)}L${q.x.toFixed(1)},${q.y.toFixed(1)}`)
            seg?.setAttribute('stroke-width', width.toFixed(2))
          }
          ax = q.x
          ay = q.y
        }
      }
      if (onScreen && !reduce.matches) raf = requestAnimationFrame(frame)
    }
    const wake = () => {
      if (!raf) raf = requestAnimationFrame(frame)
    }
    const io = new IntersectionObserver(([e]) => {
      onScreen = e.isIntersecting
      wake()
    })
    io.observe(box)
    window.addEventListener('scroll', wake, { passive: true })
    reduce.addEventListener('change', wake)
    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      window.removeEventListener('scroll', wake)
      reduce.removeEventListener('change', wake)
    }
  }, [])

  // The end of the line: a circle opens from it and fills the screen while the year counts on.
  useGSAP(
    () => {
      const wrap = expand.current!
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        wrap.dataset.driven = ''
        const frameEl = wrap.firstElementChild as HTMLElement
        let shown = from
        ScrollTrigger.create({
          trigger: wrap,
          start: 'top top',
          end: 'bottom bottom',
          onUpdate: (self) => {
            const n = Math.min(1, self.progress / 0.6)
            const c = n < 0.5 ? 2 * n * n : 1 - (-2 * n + 2) ** 2 / 2
            // the circle opens from the line's end node, wherever the layout puts it
            const f = frameEl.getBoundingClientRect()
            const d = dot.current!.getBoundingClientRect()
            const cx = d.left + d.width / 2 - f.left
            const cy = d.top + d.height / 2 - f.top
            const r = c * Math.hypot(Math.max(cx, f.width - cx), Math.max(cy, f.height - cy))
            disc.current!.style.clipPath = `circle(${r.toFixed(1)}px at ${cx.toFixed(1)}px ${cy.toFixed(1)}px)`
            wrap.classList.toggle('is-full', n >= 1)
            if (c > 0.5) delete frameEl.dataset.navTone
            else frameEl.dataset.navTone = 'dark'
            const yr = Math.min(to, Math.round(from + c * (to - from)))
            if (yr !== shown && year.current) {
              shown = yr
              year.current.textContent = String(yr)
            }
          },
        })
        ScrollTrigger.refresh()
        return () => {
          delete wrap.dataset.driven
          wrap.classList.remove('is-full')
          if (disc.current) disc.current.style.clipPath = ''
          if (year.current) year.current.textContent = String(to)
        }
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section ref={root} id="journey" className="jt relative" aria-labelledby="journey-title">
      <div className="relative bg-stage text-stage-ink" data-nav-tone="dark">
        <div aria-hidden className="absolute inset-0 [mask-image:radial-gradient(60%_40%_at_50%_0%,#000,transparent_80%)]">
          <div className="iso-grid [--grid:var(--stage-line)]" />
        </div>
        <div className="shell relative pt-[clamp(80px,14vh,170px)] text-center">
          <p className="t-label inline-flex items-center gap-2 text-stage-ink-2">
            <svg viewBox="0 0 10 12" className="h-3 w-2.5 fill-teal" aria-hidden>
              <polygon points="0,0 10,6 0,12" />
            </svg>
            {j.eyebrow}
          </p>
          <h2 id="journey-title" className="t-h2 mt-4">
            {j.title}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[1.05rem] leading-relaxed text-stage-ink-2">{j.intro}</p>
        </div>

        <div ref={line} className="jt-line shell relative mt-[clamp(48px,9vh,96px)] pb-[clamp(40px,8vh,80px)]">
          <svg aria-hidden className="jt-ink" fill="none" strokeLinecap="round">
            {Array.from({ length: TRAIL }, (_, k) => (
              <path
                key={k}
                ref={(el) => {
                  segs.current[k] = el
                }}
                stroke={`hsl(${(186 + k * 0.62).toFixed(1)} 82% 60% / 0.62)`}
              />
            ))}
          </svg>
          <span aria-hidden className="jt-track">
            <span ref={fill} className="jt-fill" />
          </span>
          <span ref={head} aria-hidden className="jt-head" />
          <ol className="relative">
            {events.map((m, i) => (
              <li key={m.year} data-event className={cn('jt-event', i % 2 ? 'is-right' : 'is-left')}>
                <div className="jt-body">
                  <p className={cn('flex items-center gap-2.5', i % 2 ? '' : 'md:justify-end')}>
                    <span className="jt-year">{m.year}</span>
                    {m.tag ? <span className="jt-tag">{m.tag}</span> : null}
                  </p>
                  <h3 className="mt-2 text-[1.12rem] font-semibold leading-tight tracking-[-0.012em] text-stage-ink">{m.title}</h3>
                  <p className={cn('mt-2 max-w-[22rem] text-[0.93rem] leading-[1.6] text-stage-ink-2', i % 2 ? '' : 'md:ml-auto')}>{m.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* the end of the line opens into today */}
      <div ref={expand} className="jt-expand">
        <div className="jt-expand-frame">
          {/* the line runs on to its end node, where the circle opens */}
          <div aria-hidden className="jt-stem-wrap shell">
            <span ref={stem} className="jt-stem">
              <span ref={stemFill} className="jt-fill" />
            </span>
            <span ref={dot} className="jt-end" />
          </div>
          <div ref={disc} className="jt-disc">
            <div className="flex flex-col items-center gap-[clamp(10px,2vh,20px)] text-center">
              <span ref={year} className="jt-big">
                {to}
              </span>
              <span className="t-label text-ink-3">
                {now.tag} · {now.title}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="jt-now">
        <div className="shell pb-[clamp(56px,10vh,120px)]">
          <WhatsNext body={now.body} eyebrow={`Today · ${j.items.length - 1} years in → ${now.title}`} />
        </div>
      </div>
    </section>
  )
}
