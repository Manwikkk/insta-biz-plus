'use client'

import Link from 'next/link'
import { useRef } from 'react'
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { Icon } from '@/components/ui/Icon'
import { useLenis } from '@/components/motion/SmoothScroll'
import { about } from '@/content/about'

gsap.registerPlugin(SplitText, ScrollTrigger, useGSAP)

/** What we build; these fill in teal. */
const KEY = ['AI-powered websites', 'mobile apps', 'CRM systems', 'business automation']

function marked(body: string) {
  const re = new RegExp(`(${KEY.join('|')})`, 'g')
  return body.split(re).map((part, i) =>
    KEY.includes(part) ? (
      <span key={i} className="sf-key">
        {part}
      </span>
    ) : (
      part
    ),
  )
}

/**
 * What we do, in one statement on the dark ground the hero opened onto. Its words start as
 * ghosts and fill in, one after another, as you read down the page; the things we build fill
 * in teal.
 */
export function StoryFill() {
  const root = useRef<HTMLElement>(null)
  const lenis = useLenis()
  const s = about.story

  useGSAP(
    () => {
      const text = root.current?.querySelector<HTMLElement>('[data-fill]')
      if (!text || document.documentElement.classList.contains('reveal-off')) return
      const split = SplitText.create(text, { type: 'words', wordsClass: 'sf-word' })
      gsap.fromTo(
        split.words,
        { opacity: 0.16 },
        { opacity: 1, ease: 'none', stagger: 0.1, scrollTrigger: { trigger: text, start: 'top 78%', end: 'bottom 52%', scrub: 0.4 } },
      )
      return () => split.revert()
    },
    { scope: root },
  )

  const next = () => {
    const el = document.getElementById('rooted')
    if (!el) return
    if (lenis) lenis.scrollTo(el, { offset: -40, duration: 1.2 })
    else el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section ref={root} id="story" className="relative overflow-hidden bg-stage text-stage-ink" data-nav-tone="dark">
      <div aria-hidden className="absolute inset-0 [mask-image:radial-gradient(70%_60%_at_80%_100%,#000,transparent_75%)]">
        <div className="iso-grid [--grid:var(--stage-line)]" />
      </div>
      <div className="shell relative pb-[clamp(80px,14vh,170px)] pt-[clamp(56px,10vh,120px)]">
        <div className="flex items-center gap-4 border-b border-stage-line pb-4">
          <span className="t-label text-teal">01</span>
          <span className="t-label text-stage-ink-2">{s.eyebrow}</span>
          <span className="t-label ml-auto hidden text-stage-ink-2 sm:inline">Est. 2020 · Ahmedabad</span>
          <button
            type="button"
            onClick={next}
            aria-label="Next section"
            className="grid size-10 place-items-center rounded-full border border-stage-line text-stage-ink-2 transition-colors hover:border-teal hover:text-teal max-sm:ml-auto"
          >
            <Icon name="arrow-down" size={16} />
          </button>
        </div>

        <div data-fill className="sf-text mt-[clamp(40px,8vh,96px)] lg:ml-[16.66%]">
          <h2 className="inline">{s.title}</h2> <p className="inline">{marked(s.body)}</p>
        </div>

        <div className="mt-[clamp(32px,6vh,64px)] flex flex-wrap items-center justify-between gap-6 lg:ml-[16.66%]">
          <Link href="/portfolio" className="group inline-flex items-center gap-2 text-[1rem] font-medium text-stage-ink">
            <span className="link-draw">{s.cta}</span>
            <Icon name="arrow" size={16} className="transition-transform duration-500 group-hover:translate-x-1" />
          </Link>
          <p className="t-label text-stage-ink-2">India · US · UK · Singapore</p>
        </div>
      </div>
    </section>
  )
}
