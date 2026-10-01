'use client'

import Image from 'next/image'
import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { categories, categoryLabel, projects } from '@/content/portfolio'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const pad = (n: number) => String(n).padStart(2, '0')
const KINDS = categories.map((c) => {
  const of = projects.filter((p) => p.category === c)
  return { label: categoryLabel[c], count: of.length, image: of[0].image }
})
const NAMES = projects.filter((_, i) => i % 3 === 0).map((p) => p.name)

/**
 * What we build, set enormous: the kinds of work run one way with a screen of each set into
 * the line, the names of the work run the other way in outline beneath. Both travel with the
 * scroll rather than on a clock. Decorative; the filter below carries the same list.
 */
export function CategoryBand() {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const [a, b] = gsap.utils.toArray<HTMLElement>('[data-band]', root.current)
        const st = { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: 0.6 }
        gsap.fromTo(a, { xPercent: 0 }, { xPercent: -32, ease: 'none', scrollTrigger: st })
        gsap.fromTo(b, { xPercent: -32 }, { xPercent: 0, ease: 'none', scrollTrigger: { ...st } })
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <div ref={root} aria-hidden className="pf-band overflow-hidden py-[clamp(36px,7vh,88px)]">
      <div data-band className="flex w-max items-center whitespace-nowrap will-change-transform">
        {[...KINDS, ...KINDS, ...KINDS].map((k, i) => (
          <span key={i} className="pf-band-item">
            <span className="pf-band-word">{k.label}</span>
            <sup className="pf-band-count">{pad(k.count)}</sup>
            <span className="pf-band-pill">
              <Image src={k.image} alt="" fill sizes="220px" quality={60} className="object-cover object-top" />
            </span>
          </span>
        ))}
      </div>
      <div data-band className="mt-[clamp(4px,1vh,12px)] flex w-max items-center whitespace-nowrap will-change-transform">
        {[...NAMES, ...NAMES].map((n, i) => (
          <span key={i} className="pf-band-outline">
            {n}
            <span className="pf-band-star">✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}
