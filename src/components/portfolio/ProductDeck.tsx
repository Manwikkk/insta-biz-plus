'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { products, type Product, type ProductId } from '@/content/products'
import { portfolioPage as pp } from '@/content/portfolio'
import { ProductScreens } from '@/components/products/ProductScreens'
import { KeyButton } from '@/components/ui/KeyButton'
import { Icon } from '@/components/ui/Icon'
import { useLenis } from '@/components/motion/SmoothScroll'

gsap.registerPlugin(ScrollTrigger, useGSAP)

/** Each product brings its own light: a ground tinted from its screens, and the accent of its logo. */
const TONE: Record<ProductId, { ground: string; accent: string }> = {
  scout: { ground: '#06131d', accent: '#3ab7f5' },
  ping: { ground: '#09150b', accent: '#a6e65a' },
  echo: { ground: '#0c0d19', accent: '#8f9bff' },
  dialer: { ground: '#16120a', accent: '#f3c623' },
}

const N = products.length
/** How long each product rests on screen, in units of one change-over. */
const HOLD = 0.7
const LENGTH = HOLD + (N - 1) * (1 + HOLD)
/** Scroll per unit of the timeline, in viewport heights. */
const UNIT = 62
/** The middle of product k's rest, on the timeline. */
const restAt = (k: number) => (k === 0 ? HOLD / 2 : HOLD + (k - 1) * (1 + HOLD) + 1 + HOLD / 2)
const pad = (n: number) => String(n).padStart(2, '0')

function Slide({ p, k, playing }: { p: Product; k: number; playing: boolean | null }) {
  const tone = TONE[p.id]
  return (
    <article
      data-slide
      className="deck-slide"
      aria-labelledby={`deck-${p.id}`}
      style={{ ['--accent' as string]: tone.accent, ['--ground' as string]: tone.ground }}
    >
      <header className="deck-head">
        <div className="deck-mask">
          <h3 id={`deck-${p.id}`} data-name className="deck-name">
            {p.name}
          </h3>
        </div>
        <p data-meta className="deck-meta t-label">
          <span className="text-[var(--accent)]">{pad(k + 1)}</span>
          <span className="deck-sep" />
          {p.short}
          <span className="deck-sep" />
          {p.step.verb}
          <span className="deck-sep hidden sm:inline-block" />
          <span className="hidden sm:inline">{p.fullName}</span>
        </p>
      </header>

      <div className="deck-stage">
        <div data-card className="deck-card-wrap">
          <span aria-hidden className="deck-glow" />
          <figure className="deck-card">
            <div className="deck-bar">
              <span className="flex gap-1.5" aria-hidden>
                <span className="size-2.5 rounded-full bg-white/15" />
                <span className="size-2.5 rounded-full bg-white/15" />
                <span className="size-2.5 rounded-full bg-white/15" />
              </span>
              <span className="t-label ml-2 truncate text-[0.6rem] text-stage-ink-2">{new URL(p.href).hostname}</span>
              <span className="product-logo ml-auto !h-7 !px-2" data-dark={p.id === 'echo' || undefined}>
                <Image src={p.logo} alt={`${p.fullName} logo`} width={160} height={60} className="h-[18px] w-auto" />
              </span>
            </div>
            <ProductScreens
              product={p}
              playing={playing ?? false}
              whenVisible={playing === null}
              count={p.features.length}
              interval={2600}
              sizes="(min-width: 1280px) 1040px, (min-width: 768px) 84vw, 94vw"
              caption={false}
              className="[&_.product-preview]:rounded-none"
            />
            <span data-shade aria-hidden className="deck-shade" />
          </figure>
        </div>
      </div>

      <footer data-meta className="deck-foot">
        <dl className="flex gap-[clamp(18px,3vw,40px)]">
          {p.impact.slice(0, 2).map((s) => (
            <div key={s.label} className="flex max-w-[13rem] flex-col-reverse">
              <dt className="mt-1 text-[0.78rem] leading-snug text-stage-ink-2">{s.label}</dt>
              <dd className="t-num text-[clamp(1.5rem,min(2.6vw,4.4vh),2.3rem)] text-stage-ink">{s.value}</dd>
            </div>
          ))}
        </dl>
        <p className="deck-line">{p.headline}</p>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 lg:justify-end">
          <KeyButton href={`/products#${p.id}`} variant="stage" size="sm">
            Explore {p.name}
          </KeyButton>
          <a
            href={p.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-1.5 text-[0.92rem] font-medium text-stage-ink"
          >
            <span className="link-draw">Open {p.name}</span>
            <Icon name="arrow-up-right" size={15} className="transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </div>
      </footer>
    </article>
  )
}

/**
 * The four products, one screen each. The frame holds still while you scroll: the next
 * product's window rises over the last, which sinks back and dims; its name lifts out as
 * the next one rises into the same place, and the ground takes on the new product's tint.
 * The rail on the left marks where you are and jumps to any product. With reduced motion
 * (or before the script runs) the four simply stack.
 */
export function ProductDeck() {
  const root = useRef<HTMLElement>(null)
  const frame = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const [driven, setDriven] = useState(false)
  const lenis = useLenis()
  const lenisRef = useRef(lenis)
  useEffect(() => {
    lenisRef.current = lenis
  }, [lenis])

  useGSAP(
    () => {
      const section = root.current!
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // set before the trigger measures: the frame pins and the scroll runs the timeline
        section.dataset.driven = ''
        section.style.height = `${100 + LENGTH * UNIT}vh`
        setDriven(true)

        const slides = gsap.utils.toArray<HTMLElement>('[data-slide]', section)
        const one = (sel: string) => slides.map((s) => s.querySelector<HTMLElement>(sel)!)
        const cards = one('[data-card]')
        const shades = one('[data-shade]')
        const names = one('[data-name]')
        const metas = slides.map((s) => gsap.utils.toArray<HTMLElement>('[data-meta]', s))

        // Arrivals are fromTo, so a refresh (resize) re-reads their start rather than wherever the
        // scroll left them; departures pick up from the arrival before them, in timeline order.
        const tl = gsap.timeline({ defaults: { ease: 'none' } })
        tl.to({}, { duration: HOLD })
        for (let k = 1; k < N; k++) {
          const at = tl.duration()
          tl.fromTo(
            cards[k],
            { y: () => window.innerHeight, scale: 1.16, rotateX: 10, transformPerspective: 1600 },
            { y: 0, scale: 1, rotateX: 0, duration: 1, ease: 'power2.inOut' },
            at,
          )
            .to(cards[k - 1], { yPercent: -5, scale: 0.86, duration: 1, ease: 'power2.inOut' }, at)
            .to(shades[k - 1], { opacity: 0.62, duration: 1 }, at)
            .to(names[k - 1], { yPercent: -108, duration: 0.42, ease: 'power3.in' }, at + 0.08)
            .fromTo(names[k], { yPercent: 108 }, { yPercent: 0, duration: 0.5, ease: 'power3.out' }, at + 0.5)
            .to(metas[k - 1], { autoAlpha: 0, y: -14, duration: 0.32 }, at + 0.06)
            .fromTo(metas[k], { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.4 }, at + 0.62)
            .to(frame.current, { backgroundColor: TONE[products[k].id].ground, duration: 1 }, at)
            .to({}, { duration: HOLD }, at + 1)
        }

        // Left mid change-over, the deck glides on to whichever product is nearer, so every
        // scroll lands on one (through Lenis, so it never fights the smooth scroll).
        let settle = 0
        const settleFrom = (self: ScrollTrigger) => {
          const t = self.progress * LENGTH
          const k = Math.floor((t - HOLD) / (1 + HOLD)) + 1
          const at = HOLD + (k - 1) * (1 + HOLD)
          if (k < 1 || k >= N || t <= at || t >= at + 1) return
          const to = t - at > 0.5 ? at + 1.1 : at - 0.1
          const y = self.start + (to / LENGTH) * (self.end - self.start)
          const l = lenisRef.current
          if (l) l.scrollTo(y, { duration: 0.9 })
          else window.scrollTo({ top: y, behavior: 'smooth' })
        }

        let current = 0
        ScrollTrigger.create({
          trigger: section,
          start: 'top top',
          end: 'bottom bottom',
          animation: tl,
          scrub: 0.7,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            // a product takes over halfway through its arrival
            const t = self.progress * LENGTH
            const k = t < HOLD + 0.5 ? 0 : Math.min(N - 1, Math.floor((t - HOLD - 0.5) / (1 + HOLD)) + 1)
            if (k !== current) {
              current = k
              setActive(k)
            }
            window.clearTimeout(settle)
            settle = window.setTimeout(() => self.isActive && settleFrom(self), 180)
          },
        })

        // the section just changed height: everything measured below it moves
        ScrollTrigger.refresh()

        return () => {
          window.clearTimeout(settle)
          delete section.dataset.driven
          section.style.height = ''
          setDriven(false)
          setActive(0)
        }
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  const go = (k: number) => {
    const el = root.current
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY
    const target = top + (restAt(k) / LENGTH) * (el.offsetHeight - window.innerHeight)
    if (lenis) lenis.scrollTo(target, { duration: 1.4 })
    else window.scrollTo({ top: target, behavior: 'smooth' })
  }

  return (
    <section ref={root} id="products" aria-labelledby="deck-title" className="deck relative bg-stage text-stage-ink" data-nav-tone="dark">
      <div ref={frame} className="deck-frame" style={{ backgroundColor: TONE[products[0].id].ground }}>
        <div aria-hidden className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(75%_60%_at_50%_45%,#000,transparent_80%)]">
          <div className="iso-grid [--grid:rgb(236_234_228/0.05)]" />
        </div>

        <div className="deck-top">
          <h2 id="deck-title" className="t-label flex items-center gap-2.5 text-stage-ink-2">
            <span className="eyebrow-dot" aria-hidden />
            {pp.products.eyebrow}
            <span className="hidden text-stage-ink-2/70 md:inline">· built and run by our team</span>
          </h2>
          <p className="t-label flex items-center gap-3 text-stage-ink-2" aria-hidden>
            <span className="hidden sm:inline">Scroll</span>
            <span className="tabular-nums text-stage-ink">
              {pad(active + 1)} <span className="text-stage-ink-2">/ {pad(N)}</span>
            </span>
          </p>
        </div>

        <ol className="deck-ticks" aria-label="Jump to a product">
          {products.map((p, k) => (
            <li key={p.id}>
              <button
                type="button"
                onClick={() => go(k)}
                aria-current={k === active || undefined}
                className="deck-tick"
                style={{ ['--accent' as string]: TONE[p.id].accent }}
              >
                <span className="deck-tick-bar" />
                <span className="deck-tick-label">
                  {pad(k + 1)} {p.name}
                </span>
              </button>
            </li>
          ))}
        </ol>

        <div className="deck-slides">
          {products.map((p, k) => (
            <Slide key={p.id} p={p} k={k} playing={driven ? k === active : null} />
          ))}
        </div>
      </div>
      <p className="sr-only" aria-live="polite">
        {driven ? `${products[active].fullName}: ${products[active].headline}` : ''}
      </p>
    </section>
  )
}
