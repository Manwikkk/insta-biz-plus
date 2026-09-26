'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { process } from '@/content/home'
import { SectionHead } from '@/components/ui/SectionHead'

gsap.registerPlugin(ScrollTrigger, useGSAP)

/** A dimension line — |←— label —→| — the way a drawing states a length. */
function Dimension({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 text-ink-3" aria-hidden>
      <span className="h-3 w-px bg-current" />
      <span className="h-px flex-1 bg-current opacity-60" />
      <span className="t-label whitespace-nowrap text-ink-2">{label}</span>
      <span className="h-px flex-1 bg-current opacity-60" />
      <span className="h-3 w-px bg-current" />
    </div>
  )
}

/** Chapter 4 — the four strokes from first call to growth. */
export function Process() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const el = root.current!
      const fill = el.querySelector<HTMLElement>('[data-track-fill]')
      const steps = el.querySelectorAll<HTMLElement>('[data-step]')
      if (!fill) return
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const vertical = window.matchMedia('(max-width: 1023px)').matches
        gsap.fromTo(fill, vertical ? { scaleY: 0 } : { scaleX: 0 }, {
          ...(vertical ? { scaleY: 1 } : { scaleX: 1 }),
          ease: 'none',
          scrollTrigger: { trigger: el.querySelector('[data-steps]'), start: 'top 75%', end: 'bottom 55%', scrub: 0.5 },
        })
        steps.forEach((s, i) => {
          ScrollTrigger.create({
            trigger: s,
            start: vertical ? 'top 70%' : `top+=${i * 40} 75%`,
            onEnter: () => s.classList.add('is-lit'),
            onLeaveBack: () => s.classList.remove('is-lit'),
          })
        })
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section ref={root} className="rails section relative border-t border-line" id="process">
      <div className="shell">
        <SectionHead eyebrow={process.eyebrow} index="04" title={process.title} intro={process.intro} align="split" />

        <div data-steps className="relative mt-16 lg:mt-[clamp(32px,8vh,96px)]">
          {/* track */}
          <div className="absolute bottom-0 left-[15px] top-0 w-px bg-line-2 lg:bottom-auto lg:left-0 lg:right-0 lg:top-0 lg:h-[3px] lg:w-auto lg:rounded-full">
            <div data-track-fill className="h-full w-full origin-top bg-teal lg:origin-left lg:rounded-full" />
          </div>

          <ol className="grid gap-10 pl-12 lg:grid-cols-4 lg:gap-0 lg:pl-0">
            {process.steps.map((s) => (
              <li
                key={s.n}
                data-step
                data-reveal="rise"
                className="process-step relative lg:border-r lg:border-line lg:px-7 lg:pt-[clamp(20px,4vh,40px)] lg:last:border-r-0 lg:first:pl-0"
              >
                <span className="process-node absolute -left-[41px] top-1 grid size-[19px] place-items-center rounded-[5px] border border-line-2 bg-bg lg:-top-[8px] lg:left-auto lg:right-auto" />
                <div className="lg:mt-2">
                  <Dimension label={s.when} />
                </div>
                <p className="process-num t-numeral mt-5 text-[2.9rem] lg:mt-[clamp(16px,3.4vh,32px)] lg:text-[clamp(3.4rem,min(5vw,9vh),5rem)]">
                  {s.n}
                </p>
                <h3 className="t-h3 mt-3 lg:mt-[clamp(12px,2.6vh,24px)]">{s.title}</h3>
                <p className="t-body mt-3">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
