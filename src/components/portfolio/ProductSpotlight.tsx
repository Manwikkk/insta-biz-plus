'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { products, type Product } from '@/content/products'
import { ProductScreens } from '@/components/products/ProductScreens'
import { KeyButton, ArrowLink } from '@/components/ui/KeyButton'
import { Odometer } from '@/components/ui/Odometer'
import { Icon } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const ease = [0.16, 1, 0.3, 1] as const
const host = (href: string) => new URL(href).hostname

/** The product's name, set letter by letter as it takes the stage. */
function Name({ text }: { text: string }) {
  return (
    <span aria-label={text} className="inline-flex">
      {Array.from(text).map((ch, i) => (
        <motion.span
          key={i}
          aria-hidden
          className="inline-block"
          initial={{ y: '0.6em', opacity: 0, filter: 'blur(8px)' }}
          animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
          transition={{ delay: 0.08 + i * 0.035, duration: 0.7, ease }}
        >
          {ch}
        </motion.span>
      ))}
    </span>
  )
}

/** A product's story beside its window: what it is, what it has done, and the ways in. */
function Details({ p, k, animate }: { p: Product; k: number; animate: boolean }) {
  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <span className="product-logo" data-dark={p.id === 'echo' || undefined}>
          <Image src={p.logo} alt={`${p.fullName} logo`} width={160} height={60} className="h-6 w-auto" />
        </span>
        <span className="t-label text-ink-3">
          <span className="text-teal-ink">{String(k + 1).padStart(2, '0')}</span> / {String(products.length).padStart(2, '0')} · {p.short}
        </span>
      </div>
      <h3 className="mt-5 font-display text-[clamp(2.4rem,4vw,3.6rem)] font-[760] leading-[0.95] tracking-[-0.04em] [font-stretch:108%]">
        {animate ? <Name text={p.name} /> : p.name}
      </h3>
      <p className="t-lede mt-3">{p.headline}</p>
      <dl className="mt-6 grid grid-cols-2 gap-5 border-t border-line pt-5">
        {p.impact.slice(0, 2).map((s, i) => (
          <div key={s.label} className="flex flex-col-reverse">
            <dt className="mt-1.5 text-[0.84rem] leading-snug text-ink-3">{s.label}</dt>
            <dd className="t-num text-[clamp(1.8rem,2.6vw,2.4rem)] text-teal-ink">
              <Odometer value={s.value} delay={120 + i * 140} />
            </dd>
          </div>
        ))}
      </dl>
      <p className="t-body mt-5">{p.summary}</p>
      <ul className="mt-5 flex flex-wrap gap-1.5">
        {p.highlights.map((h) => (
          <li key={h} className="tag">
            {h}
          </li>
        ))}
      </ul>
      <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3">
        <KeyButton href={`/products#${p.id}`} size="sm">
          Explore {p.name}
        </KeyButton>
        <ArrowLink href={p.href}>Open {p.name}</ArrowLink>
      </div>
    </>
  )
}

/**
 * The four products as a scroll showcase. Wide screens: the story holds still beside the
 * windows and changes as each window crosses the middle of the view. Every window tips up
 * out of the page as it arrives, plays its product's screens while it is in the lead, and
 * carries two figures that drift at their own pace. Phones: each story sits under its window.
 */
export function ProductSpotlight() {
  const [active, setActive] = useState(0)
  const root = useRef<HTMLDivElement>(null)
  const items = useRef<(HTMLLIElement | null)[]>([])

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.k))
      },
      { rootMargin: '-45% 0px -45% 0px' },
    )
    items.current.forEach((el) => el && io.observe(el))
    return () => io.disconnect()
  }, [])

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const q = gsap.utils.selector(root)
        q('[data-spot-window]').forEach((el) => {
          gsap.fromTo(
            el,
            { rotateX: 18, yPercent: 8, scale: 0.88, opacity: 0.3, transformPerspective: 1400, transformOrigin: '50% 0%' },
            {
              rotateX: 0,
              yPercent: 0,
              scale: 1,
              opacity: 1,
              ease: 'none',
              scrollTrigger: { trigger: el, start: 'top 100%', end: 'top 42%', scrub: 0.6 },
            },
          )
        })
        q('[data-spot-chip]').forEach((el, i) => {
          gsap.fromTo(
            el,
            { yPercent: i % 2 ? 70 : 110 },
            {
              yPercent: i % 2 ? -70 : -110,
              ease: 'none',
              scrollTrigger: { trigger: el.closest('li'), start: 'top bottom', end: 'bottom top', scrub: true },
            },
          )
        })
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <div ref={root} className="grid gap-12 lg:grid-cols-12 lg:gap-12">
      <div className="hidden lg:col-span-5 lg:block">
        <div className="sticky top-[calc(var(--header-offset)+48px)] transition-[top] duration-500 ease-[var(--ease-out)]">
          <ol className="mb-8 flex gap-2" aria-hidden>
            {products.map((x, k) => (
              <li key={x.id} className="relative h-[3px] flex-1 overflow-hidden rounded-full bg-line-2">
                <span
                  className="absolute inset-0 origin-left bg-teal transition-transform duration-700 ease-[var(--ease-out)]"
                  style={{ transform: `scaleX(${k <= active ? 1 : 0})` }}
                />
              </li>
            ))}
          </ol>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12, filter: 'blur(4px)' }}
              transition={{ duration: 0.45, ease }}
              aria-live="polite"
            >
              <Details p={products[active]} k={active} animate />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <ol className="grid gap-16 lg:col-span-7 lg:gap-[18vh] lg:py-[10vh]">
        {products.map((p, k) => (
          <li
            key={p.id}
            data-k={k}
            ref={(el) => {
              items.current[k] = el
            }}
            className="relative"
          >
            <div className="relative">
              <figure data-spot-window className="spot-window overflow-hidden rounded-[20px] border border-line bg-raise" data-active={k === active || undefined}>
                <div className="flex h-10 items-center gap-2 border-b border-line bg-sink/60 px-4">
                  <span className="flex gap-1.5" aria-hidden>
                    <span className="size-2.5 rounded-full bg-line-2" />
                    <span className="size-2.5 rounded-full bg-line-2" />
                    <span className="size-2.5 rounded-full bg-line-2" />
                  </span>
                  <span className="t-label ml-2 truncate text-[0.62rem] text-ink-3">{host(p.href)}</span>
                  <span className="t-label ml-auto flex shrink-0 items-center gap-1.5 text-[0.62rem] text-teal-ink">
                    <Icon name={p.icon} size={13} />
                    {p.name}
                  </span>
                </div>
                <ProductScreens
                  product={p}
                  playing={k === active}
                  whenVisible
                  count={p.features.length}
                  interval={2800}
                  sizes="(min-width: 1024px) 760px, 92vw"
                  caption={false}
                />
              </figure>

              {/* two figures riding on the window, drifting at their own pace */}
              <span data-spot-chip className="spot-chip absolute -right-2 top-[18%] sm:-right-5">
                <Icon name={p.icon} size={16} className="text-teal-ink" />
                <span className="text-[0.82rem] font-semibold">{p.highlights[0]}</span>
              </span>
              <span data-spot-chip className="spot-chip absolute -left-2 bottom-[14%] flex-col !items-start !gap-0.5 sm:-left-5">
                <span className="t-num text-[1.35rem] leading-none">{p.impact[0].value}</span>
                <span className="max-w-[12rem] text-[0.74rem] leading-snug text-ink-2">{p.impact[0].label}</span>
              </span>
            </div>

            <div className={cn('mt-10 lg:hidden')}>
              <Details p={p} k={k} animate={false} />
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
