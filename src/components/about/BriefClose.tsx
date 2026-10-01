'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { Icon } from '@/components/ui/Icon'
import { products, screensOf } from '@/content/products'

gsap.registerPlugin(ScrollTrigger, useGSAP)

/** Two screens from each product, alternating products. */
const REEL = [1, 2].flatMap((k) => products.map((p) => ({ key: `${p.id}-${k}`, image: screensOf(p)[k] })))

/**
 * The hand-off to the form: one line split across the screen, the two halves sliding in from
 * either edge with a window between them where the things we have built play one after
 * another. A single link carries on down to the form.
 */
export function BriefClose() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
        const st = { trigger: root.current, start: 'top 85%', end: 'center 55%', scrub: 0.6 }
        gsap.fromTo('[data-side="l"]', { xPercent: -45, opacity: 0 }, { xPercent: 0, opacity: 1, ease: 'power2.out', scrollTrigger: st })
        gsap.fromTo('[data-side="r"]', { xPercent: 45, opacity: 0 }, { xPercent: 0, opacity: 1, ease: 'power2.out', scrollTrigger: { ...st } })
        gsap.fromTo('[data-reel]', { scale: 0.55, rotate: -4 }, { scale: 1, rotate: 0, ease: 'power2.out', scrollTrigger: { ...st } })
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section ref={root} className="relative overflow-hidden bg-stage text-stage-ink" data-nav-tone="dark">
      <div className="shell flex flex-col items-center pb-[clamp(40px,8vh,96px)] pt-[clamp(80px,14vh,170px)]">
        <h2 className="bc-row">
          <span data-side="l" className="bc-half">
            You bring
            <br />
            the idea.
          </span>
          <span data-reel className="bc-reel" aria-hidden>
            {REEL.map((s, i) => (
              <Image
                key={s.key}
                src={s.image}
                alt=""
                fill
                sizes="(min-width: 768px) 30vw, 80vw"
                quality={60}
                className="bc-frame object-cover object-top"
                style={{ animationDelay: `${i * 2.2}s` }}
              />
            ))}
          </span>
          <span data-side="r" className="bc-half md:text-right">
            We build
            <br />
            the engine.
          </span>
        </h2>
        <Link
          href="#contact-form"
          className="group mt-[clamp(28px,5vh,52px)] inline-flex h-11 items-center gap-2.5 rounded-full bg-teal pl-5 pr-2 text-[0.95rem] font-semibold text-[#04161a] transition-transform duration-500 hover:-translate-y-0.5"
        >
          Start the conversation
          <span className="grid size-7 place-items-center rounded-full bg-[#04161a]/12 transition-transform duration-500 group-hover:rotate-90">
            <Icon name="arrow-down" size={15} />
          </span>
        </Link>
      </div>
    </section>
  )
}
