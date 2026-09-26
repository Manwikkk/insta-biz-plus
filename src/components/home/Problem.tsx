'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { problem } from '@/content/home'
import { cn } from '@/lib/cn'

gsap.registerPlugin(ScrollTrigger, useGSAP)

/**
 * Positions around the edges of the stage (desktop), leaving the centre for the headline.
 * Left-hand symptoms are placed by their left edge, right-hand ones by their right edge,
 * so none can run off the screen whatever its width.
 */
const SPOTS: Array<{ l?: number; r?: number; t: number }> = [
  { l: 6, t: 17 },
  { r: 8, t: 13 },
  { r: 3, t: 27 },
  { l: 3, t: 38 },
  { r: 2, t: 45 },
  { l: 9, t: 62 },
  { r: 5, t: 64 },
  { l: 56, t: 83 },
  { l: 17, t: 83 },
  { l: 2, t: 81 },
]

/** On phones the symptoms arrive a few at a time, in a column under the headline. */
const GROUPS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8, 9],
]
const SLOT = GROUPS.flatMap((g) => g.map((_, k) => k))

const hex = (r: string) =>
  `polygon(50% calc(50% - ${r}), calc(50% + ${r} * 0.866) calc(50% - ${r} * 0.5), calc(50% + ${r} * 0.866) calc(50% + ${r} * 0.5), 50% calc(50% + ${r}), calc(50% - ${r} * 0.866) calc(50% + ${r} * 0.5), calc(50% - ${r} * 0.866) calc(50% - ${r} * 0.5))`

/**
 * Chapter 1 — the problem. The page falls into a dark stage through a hexagonal
 * aperture; the engine's parts drift apart while the symptoms of a fragmented build
 * float around them. Then everything snaps back into one engine.
 */
export function Problem() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const el = root.current!
      const q = gsap.utils.selector(el)
      const mm = gsap.matchMedia()
      const ground = q('[data-ground]')[0] as HTMLElement
      const paper = q('[data-paper]')[0] as HTMLElement

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.set(ground, { '--r': '0vmax' })
        gsap.set(paper, { '--r': '0vmax' })
        // Entry: the dark stage opens from the engine's silhouette.
        gsap.to(ground, {
          '--r': '120vmax',
          ease: 'power2.in',
          scrollTrigger: { trigger: el, start: 'top 90%', end: 'top 20%', scrub: true },
        })
      })

      mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: { trigger: el, start: 'top 35%', end: 'bottom bottom', scrub: 0.6 },
        })
        // Every entrance states both ends (fromTo), so rebuilding the timeline — after a resize or a
        // hot reload — always lands on the same frame, whatever state the elements were left in.
        tl.fromTo(q('[data-p="eyebrow"]'), { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.06 }, 0.02)
          .fromTo(
            q('[data-p="title"] .ln'),
            { yPercent: 110, autoAlpha: 0 },
            { yPercent: 0, autoAlpha: 1, stagger: 0.04, duration: 0.12 },
            0.04,
          )
          .fromTo(q('[data-p="body"]'), { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.08 }, 0.14)
          .fromTo(
            q('[data-frag]'),
            { autoAlpha: 0, scale: 0.86, filter: 'blur(8px)' },
            { autoAlpha: 1, scale: 1, filter: 'blur(0px)', stagger: 0.022, duration: 0.08 },
            0.12,
          )
          .to(q('[data-frag]'), { y: (i: number) => (i % 2 ? -46 : 38), duration: 0.42 }, 0.12)
          .to(
            q('[data-p="title"], [data-p="body"], [data-p="eyebrow"]'),
            { autoAlpha: 0, y: -40, filter: 'blur(6px)', duration: 0.1 },
            0.54,
          )
          .to(q('[data-frag]'), { autoAlpha: 0, scale: 0.9, filter: 'blur(10px)', stagger: 0.008, duration: 0.1 }, 0.54)
          .fromTo(
            q('[data-p="turn"] .ln'),
            { yPercent: 110, autoAlpha: 0 },
            { yPercent: 0, autoAlpha: 1, stagger: 0.035, duration: 0.1 },
            0.64,
          )
          .fromTo(q('[data-p="resolve"]'), { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.08 }, 0.74)
          .to(q('[data-p="turn"], [data-p="resolve"]'), { autoAlpha: 0, y: -30, duration: 0.07 }, 0.86)
          // Exit: paper opens back from the assembled engine.
          .to(paper, { '--r': '120vmax', duration: 0.12, ease: 'power2.in' }, 0.88)
      })

      // Phones and tablets: the same story in one column. The headline lands, then the symptoms
      // arrive three or four at a time instead of all at once, then the turn.
      mm.add('(max-width: 1023px) and (prefers-reduced-motion: no-preference)', () => {
        const frags = q('[data-frag]')
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: { trigger: el, start: 'top 35%', end: 'bottom bottom', scrub: 0.6, invalidateOnRefresh: true },
        })
        tl.fromTo(q('[data-p="eyebrow"]'), { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.05 }, 0.02)
          .fromTo(q('[data-p="title"] .ln'), { yPercent: 110, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, stagger: 0.03, duration: 0.1 }, 0.04)
          .fromTo(q('[data-p="body"]'), { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.06 }, 0.12)
          // the body steps aside and the headline rises to make room for the symptoms
          .to(q('[data-p="body"]'), { autoAlpha: 0, y: -16, filter: 'blur(6px)', duration: 0.05 }, 0.22)
          .fromTo(q('[data-p="head"]'), { y: 0 }, { y: () => -Math.min(110, window.innerHeight * 0.13), duration: 0.08, ease: 'power1.inOut' }, 0.22)
        GROUPS.forEach((g, gi) => {
          const items = g.map((i) => frags[i])
          const at = 0.27 + gi * 0.1
          tl.fromTo(
            items,
            { autoAlpha: 0, y: 22, scale: 0.94, filter: 'blur(8px)' },
            { autoAlpha: 1, y: 0, scale: 1, filter: 'blur(0px)', stagger: 0.012, duration: 0.05 },
            at,
          )
          if (gi < GROUPS.length - 1) tl.to(items, { autoAlpha: 0, y: -18, filter: 'blur(6px)', stagger: 0.008, duration: 0.04 }, at + 0.075)
        })
        tl.to(q('[data-p="title"], [data-p="eyebrow"]'), { autoAlpha: 0, y: -30, filter: 'blur(6px)', duration: 0.06 }, 0.56)
          .to(GROUPS[GROUPS.length - 1].map((i) => frags[i]), { autoAlpha: 0, scale: 0.94, filter: 'blur(8px)', stagger: 0.006, duration: 0.05 }, 0.56)
          .fromTo(q('[data-p="turn"] .ln'), { yPercent: 110, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, stagger: 0.03, duration: 0.09 }, 0.64)
          .fromTo(q('[data-p="resolve"]'), { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.07 }, 0.74)
          .to(q('[data-p="turn"], [data-p="resolve"]'), { autoAlpha: 0, y: -30, duration: 0.06 }, 0.86)
          .to(paper, { '--r': '120vmax', duration: 0.12, ease: 'power2.in' }, 0.88)
      })

      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section ref={root} id="problem" data-stage="problem" className="relative h-[400vh] motion-reduce:h-auto">
      {/* Where this chapter is dark under the navbar: until the returning paper has covered the top
          of the screen (about 1.1 screens before the end), or all of it for reduced motion. */}
      <div aria-hidden data-nav-tone="dark" className="pointer-events-none absolute inset-x-0 top-0 bottom-[112vh] motion-reduce:bottom-0" />
      {/* reduced-motion ground */}
      <div aria-hidden className="absolute inset-0 z-0 hidden bg-stage motion-reduce:block" />

      {/* the grounds live below the engine canvas (z-0); copy sits above it (z-2) */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0 motion-reduce:hidden">
        <div className="sticky top-0 h-[100svh] overflow-hidden">
          {/* dark stage: hexagonal aperture */}
          <div data-ground aria-hidden className="absolute inset-0 bg-stage" style={{ clipPath: hex('var(--r, 120vmax)') }}>
            <div className="absolute inset-0 [mask-image:radial-gradient(60%_60%_at_50%_50%,#000,transparent)]">
              <div className="iso-grid [--grid:var(--stage-line)]" />
            </div>
            <div className="absolute inset-0 bg-[radial-gradient(40%_40%_at_50%_52%,rgb(34_199_216/0.10),transparent_70%)]" />
          </div>
          {/* paper returns: opens from the reassembled engine */}
          <div data-paper aria-hidden className="absolute inset-0 bg-bg" style={{ clipPath: hex('var(--r, 0vmax)') }} />
        </div>
      </div>

      <div className="sticky top-0 z-[2] h-[100svh] overflow-hidden motion-reduce:static motion-reduce:h-auto">
        <div className="shell relative flex h-full flex-col justify-center text-stage-ink motion-reduce:py-24 motion-reduce:lg:py-32">
          <div data-p="head" className="relative mx-auto max-w-[980px] text-center">
            <p data-p="eyebrow" className="eyebrow t-label justify-center text-stage-ink-2" data-reveal="rise">
              <span className="eyebrow-n !text-teal">01</span>
              <span>{problem.eyebrow}</span>
            </p>
            <h2 data-p="title" className="t-display mt-6">
              {problem.title.split('. ').map((l, i, a) => (
                <span key={i} className="block overflow-hidden pb-[0.06em]">
                  <span className="ln block">{i < a.length - 1 ? `${l}.` : l}</span>
                </span>
              ))}
            </h2>
            <p data-p="body" className="mx-auto mt-7 max-w-[36rem] text-[1.1rem] leading-relaxed text-stage-ink-2" data-reveal="rise">
              {problem.body}
            </p>
          </div>

          {/* symptoms: a column under the headline on phones, scattered round the edges on desktop */}
          <ul className="absolute inset-x-0 top-[52%] lg:static motion-reduce:static motion-reduce:mt-12 motion-reduce:flex motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-2">
            {problem.fragments.map((f, i) => (
              <li
                key={f.text}
                data-frag
                className={cn(
                  'absolute left-1/2 top-[calc(var(--slot)*50px)] inline-flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-[6px] border border-stage-line bg-stage-2/85 px-3 py-2 text-[0.85rem] text-stage-ink backdrop-blur-sm',
                  'lg:left-[var(--l)] lg:right-[var(--r)] lg:top-[var(--t)] lg:translate-x-0',
                  'motion-reduce:static motion-reduce:translate-x-0',
                )}
                style={{
                  ['--l' as string]: SPOTS[i].l !== undefined ? `${SPOTS[i].l}%` : 'auto',
                  ['--r' as string]: SPOTS[i].r !== undefined ? `${SPOTS[i].r}%` : 'auto',
                  ['--t' as string]: `${SPOTS[i].t}%`,
                  ['--slot' as string]: SLOT[i],
                }}
              >
                <span className="size-2 shrink-0 bg-ember [clip-path:polygon(50%_0,100%_25%,100%_75%,50%_100%,0_75%,0_25%)]" />
                <span>{f.text}</span>
                <span className="t-label hidden text-[0.58rem] text-stage-ink-2 xl:inline">· {f.source}</span>
              </li>
            ))}
          </ul>

          {/* the turn */}
          <div className="absolute inset-x-0 top-1/2 mx-auto max-w-[1100px] -translate-y-1/2 text-center motion-reduce:relative motion-reduce:top-auto motion-reduce:mt-20 motion-reduce:translate-y-0">
            <h2 data-p="turn" className="t-display">
              {problem.turn.split('. ').map((l, i, a) => (
                <span key={i} className="block overflow-hidden pb-[0.06em]">
                  <span className={cn('ln block', i === a.length - 1 && 'text-teal')}>{i < a.length - 1 ? `${l}.` : l}</span>
                </span>
              ))}
            </h2>
            <p data-p="resolve" className="mx-auto mt-7 max-w-[34rem] text-[1.1rem] leading-relaxed text-stage-ink-2">
              {problem.resolve}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
