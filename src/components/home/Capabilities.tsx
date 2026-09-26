'use client'

import Link from 'next/link'
import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { services } from '@/content/services'
import { engineIntro } from '@/content/home'
import { engine } from '@/components/three/engineState'
import { FOCUS_INDEX } from './EngineStage'
import { Vignette } from '@/components/vignettes/Vignettes'
import { Icon } from '@/components/ui/Icon'
import { Odometer } from '@/components/ui/Odometer'
import { Eyebrow } from '@/components/ui/SectionHead'
import { useLenis } from '@/components/motion/SmoothScroll'
import { cn } from '@/lib/cn'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const INTRO = 0.07
const SPAN = 0.87 / services.length
const ease = [0.16, 1, 0.3, 1] as const

/** "03 · AI & Automation" as a numbered chip, used on the desktop chapters and the phone cards. */
function PartLabel({ n, label }: { n: string; label: string }) {
  return (
    <p className="eyebrow t-label">
      <span className="eyebrow-n">{n}</span>
      <span className="text-teal-ink">{label}</span>
    </p>
  )
}

/**
 * Chapter 2 — capabilities. The engine holds an exploded, labelled view while each
 * service takes the focus in turn: its part lifts out, the copy swaps, and a small
 * live scene shows what that part produces.
 */
export function Capabilities() {
  const root = useRef<HTMLElement>(null)
  const [chapter, setChapter] = useState(0)
  const [intro, setIntro] = useState(true)
  const fills = useRef<(HTMLSpanElement | null)[]>([])
  const fillsM = useRef<(HTMLSpanElement | null)[]>([])
  const lenis = useLenis()

  useGSAP(
    () => {
      const el = root.current!
      const mm = gsap.matchMedia()
      // Desktop and phones share one reading of the scroll: which part is in focus, and how far
      // through it we are (each layout has its own rail).
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        let current = -1
        let wasIntro = true
        ScrollTrigger.create({
          trigger: el,
          start: 'top top',
          end: 'bottom bottom',
          onUpdate: (self) => {
            const p = self.progress
            const i = Math.max(0, Math.min(services.length - 1, Math.floor((p - INTRO) / SPAN)))
            const within = Math.max(0, Math.min(1, (p - INTRO - i * SPAN) / SPAN))
            const fill = `${Math.max(4, (p < INTRO ? 0 : within) * 100)}%`
            for (const rail of [fills.current, fillsM.current])
              rail.forEach((f, k) => {
                if (f) f.style.width = k < i ? '100%' : k === i ? fill : '0%'
              })
            engine.focus = p < INTRO * 0.6 ? -1 : FOCUS_INDEX[services[i].id]
            if (i !== current) {
              current = i
              setChapter(i)
            }
            const isIntro = p < INTRO
            if (isIntro !== wasIntro) {
              wasIntro = isIntro
              setIntro(isIntro)
            }
          },
          onLeaveBack: () => {
            engine.focus = -1
          },
          onLeave: () => {
            engine.focus = -1
          },
        })
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  const goTo = (i: number) => {
    const el = root.current
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY
    const range = el.offsetHeight - window.innerHeight
    const target = top + range * (INTRO + SPAN * i + SPAN * 0.2)
    if (lenis) lenis.scrollTo(target, { duration: 1.2 })
    else window.scrollTo({ top: target, behavior: 'smooth' })
  }

  const s = services[chapter]

  return (
    <section ref={root} id="capabilities" data-stage="capabilities" className="relative h-[520vh] lg:h-[667vh] motion-reduce:h-auto">
      {/* ---------- desktop: sticky exploded view ---------- */}
      <div className="relative z-[2] hidden lg:sticky lg:top-0 lg:block lg:h-[100svh] motion-reduce:lg:hidden">
        <div className="shell grid h-full grid-cols-12 gap-8 pb-[clamp(16px,3vh,32px)] pt-[clamp(80px,12.5vh,108px)]">
          {/* one column, read top to bottom, centred in the space under the navbar */}
          <div className="col-span-5 flex min-h-0 flex-col justify-center">
            <Eyebrow index="02">{engineIntro.eyebrow}</Eyebrow>
            <h2 className="mt-[clamp(10px,2vh,18px)] max-w-[16ch] font-display text-[clamp(1.8rem,min(3.5vw,6vh),3.4rem)] font-[700] leading-none tracking-[-0.034em] [font-stretch:104%]">
              {engineIntro.title}
            </h2>

            {/* chapter rail */}
            <ol className="mt-[clamp(14px,2.8vh,28px)] flex gap-3" aria-label="Services">
              {services.map((svc, i) => (
                <li key={svc.id} className="flex-auto">
                  <button
                    type="button"
                    onClick={() => goTo(i)}
                    aria-current={i === chapter ? 'step' : undefined}
                    className="group w-full text-left"
                  >
                    <span className="block h-[3px] overflow-hidden rounded-full bg-line-2">
                      <span
                        ref={(el) => {
                          fills.current[i] = el
                        }}
                        className="block h-full w-0 rounded-full bg-teal"
                      />
                    </span>
                    <span
                      className={cn(
                        't-label mt-2 block whitespace-nowrap transition-colors',
                        i === chapter ? 'text-ink' : 'text-ink-3 group-hover:text-ink-2',
                      )}
                    >
                      {svc.n}
                      <span className="hidden xl:inline"> · {svc.short}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ol>

            {/* All the chapters share one grid cell: the cell is as tall as the longest, so
                nothing below it jumps, and the outgoing copy lifts away as the next rises in. */}
            <div className="mt-[clamp(18px,4vh,40px)] grid">
              {services.map((svc, i) => (
                <article
                  key={svc.id}
                  className={cn('cap-chapter col-start-1 row-start-1', i === chapter ? 'is-on' : i < chapter ? 'is-past' : 'is-next')}
                  aria-hidden={i !== chapter}
                  inert={i !== chapter}
                >
                  <PartLabel n={svc.n} label={svc.label} />
                  <h3 className="mt-[clamp(8px,1.6vh,14px)] font-display text-[clamp(1.55rem,min(3vw,5vh),3rem)] font-[720] leading-[0.98] tracking-[-0.035em] [font-stretch:104%]">
                    {svc.headline}
                  </h3>
                  <p className="t-body mt-[clamp(8px,1.8vh,16px)] max-w-[32rem] text-[clamp(0.95rem,2.3vh,1.04rem)]">{svc.body}</p>
                  <ul className="mt-4 grid gap-2 [@media(max-height:820px)]:hidden">
                    {svc.deliverables.slice(0, 3).map((d) => (
                      <li key={d} className="flex items-start gap-3 text-[0.95rem] text-ink-2">
                        <span className="mt-[0.5em] size-[6px] shrink-0 rounded-full bg-teal" />
                        {d}
                      </li>
                    ))}
                  </ul>
                  <ul className="mt-[clamp(10px,2.2vh,20px)] flex flex-wrap gap-1.5" aria-label="Tools and stack">
                    {svc.tech.map((t) => (
                      <li key={t} className="tag">
                        {t}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-[clamp(12px,2.6vh,26px)] flex items-end justify-between gap-6 border-t border-line pt-[clamp(10px,2vh,18px)]">
                    <div>
                      <p className="t-num text-[clamp(1.9rem,min(3.4vw,5.6vh),3.2rem)]">{svc.avg.value}</p>
                      <p className="t-label mt-2 text-ink-3">{svc.avg.label} · avg. result</p>
                    </div>
                    <Link href={`/services#${svc.id}`} className="group mb-1 inline-flex items-center gap-2 text-[0.95rem] font-medium">
                      <span className="link-draw">Explore {svc.label}</span>
                      <Icon name="arrow" size={16} className="transition-transform duration-500 group-hover:translate-x-1" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* right: the engine lives behind this column; the live scene sits in its corner */}
          <div className="relative col-span-7">
            <AnimatePresence initial={false}>
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 24, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.98 }}
                transition={{ duration: 0.6, ease }}
                className="absolute bottom-2 right-0 w-[min(100%,320px)] origin-bottom-right [@media(max-height:780px)]:scale-[0.82]"
              >
                <Vignette id={s.id} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ---------- phones & tablets: the engine above, one part at a time on a card below ---------- */}
      <div className="sticky top-0 z-[2] flex h-[100svh] flex-col justify-end lg:hidden motion-reduce:hidden">
        <div className="shell pb-[max(14px,env(safe-area-inset-bottom))]">
          <div data-cap-card className="rounded-[20px] border border-line bg-raise/85 p-5 shadow-[var(--shadow-float)] backdrop-blur-xl">
            <div className="flex items-center justify-between gap-3">
              <Eyebrow index="02">{engineIntro.eyebrow}</Eyebrow>
              <span className="t-label tabular-nums text-ink-3">
                {intro ? `${services.length} parts` : `${services[chapter].n} / ${String(services.length).padStart(2, '0')}`}
              </span>
            </div>
            <ol className="mt-3 flex gap-1.5" aria-label="Services">
              {services.map((svc, i) => (
                <li key={svc.id} className="flex-1">
                  <button
                    type="button"
                    onClick={() => goTo(i)}
                    aria-current={!intro && i === chapter ? 'step' : undefined}
                    aria-label={`${svc.n} ${svc.label}`}
                    className="block w-full py-2"
                  >
                    <span className="block h-[3px] overflow-hidden rounded-full bg-line-2">
                      <span
                        ref={(el) => {
                          fillsM.current[i] = el
                        }}
                        className="block h-full w-0 rounded-full bg-teal"
                      />
                    </span>
                  </button>
                </li>
              ))}
            </ol>
            <div className="mt-2 grid">
              <article className={cn('cap-chapter col-start-1 row-start-1', intro ? 'is-on' : 'is-past')} aria-hidden={!intro} inert={!intro}>
                <h2 className="font-display text-[clamp(1.7rem,7.4vw,2.4rem)] font-[720] leading-none tracking-[-0.035em] [font-stretch:104%]">
                  {engineIntro.title}
                </h2>
                <p className="t-small mt-3 text-ink-2">{engineIntro.intro}</p>
                <p className="t-label mt-4 flex items-center gap-2 text-teal-ink">
                  <Icon name="arrow-down" size={13} />
                  Five parts, one engine
                </p>
              </article>
              {services.map((svc, i) => {
                const on = !intro && i === chapter
                return (
                  <article
                    key={svc.id}
                    className={cn('cap-chapter col-start-1 row-start-1', on ? 'is-on' : !intro && i < chapter ? 'is-past' : 'is-next')}
                    aria-hidden={!on}
                    inert={!on}
                  >
                    <PartLabel n={svc.n} label={svc.label} />
                    <h3 className="mt-2.5 font-display text-[clamp(1.45rem,6.2vw,2.1rem)] font-[720] leading-[1.02] tracking-[-0.03em] [font-stretch:104%]">
                      {svc.headline}
                    </h3>
                    <p className="t-small mt-2.5 line-clamp-3 text-ink-2">{svc.body}</p>
                    <div className="mt-4 flex items-end justify-between gap-4 border-t border-line pt-3.5">
                      <div>
                        <p className="t-num text-[1.9rem]">{svc.avg.value}</p>
                        <p className="t-label mt-1.5 text-ink-3">{svc.avg.label}</p>
                      </div>
                      <Link
                        href={`/services#${svc.id}`}
                        aria-label={`Explore ${svc.label}`}
                        className="grid size-11 shrink-0 place-items-center rounded-full border border-line-2 transition-colors hover:bg-ink hover:text-bg"
                      >
                        <Icon name="arrow" size={18} />
                      </Link>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ---------- reduced motion: spec cards ---------- */}
      <div className="relative z-[2] hidden py-24 motion-reduce:block">
        <div className="shell">
          <Eyebrow index="02">{engineIntro.eyebrow}</Eyebrow>
          <h2 className="t-h2 mt-5">{engineIntro.title}</h2>
          <p className="t-lede mt-5 max-w-xl">{engineIntro.intro}</p>
        </div>
        <ul className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-[var(--gutter)] pb-4 [scrollbar-width:none] motion-reduce:lg:grid motion-reduce:lg:grid-cols-3 motion-reduce:lg:overflow-visible">
          {services.map((svc) => (
            <li
              key={svc.id}
              className="w-[84vw] max-w-[420px] shrink-0 snap-center rounded-[16px] border border-line bg-raise p-5 motion-reduce:lg:w-auto"
            >
              <PartLabel n={svc.n} label={svc.label} />
              <h3 className="t-h3 mt-3">{svc.headline}</h3>
              <p className="t-small mt-3">{svc.body}</p>
              <div className="my-6">
                <Vignette id={svc.id} />
              </div>
              <div className="flex items-end justify-between gap-4 border-t border-line pt-4">
                <div>
                  <Odometer value={svc.avg.value} className="t-num text-[2.2rem]" />
                  <p className="t-label mt-2 text-ink-3">{svc.avg.label}</p>
                </div>
                <Link
                  href={`/services#${svc.id}`}
                  aria-label={`Explore ${svc.label}`}
                  className="grid size-11 place-items-center rounded-full border border-line-2"
                >
                  <Icon name="arrow" size={18} />
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
