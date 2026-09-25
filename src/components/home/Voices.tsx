'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { testimonials, brands } from '@/content/home'
import { ClientLogo } from '@/components/ui/ClientLogo'
import { useMarquee } from '@/lib/useMarquee'
import { Eyebrow, SectionHead } from '@/components/ui/SectionHead'
import { ArrowLink } from '@/components/ui/KeyButton'
import { Icon } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'

const DURATION = 8000
const ease = [0.16, 1, 0.3, 1] as const
const HEX = '[clip-path:polygon(50%_0,100%_25%,100%_75%,50%_100%,0_75%,0_25%)]'

/** Chapter 6 — trust: founders in their own words. */
export function Voices() {
  const items = testimonials.items
  const [i, setI] = useState(0)
  const [dir, setDir] = useState(1)
  const [paused, setPaused] = useState(false)
  const [visible, setVisible] = useState(false)
  const root = useRef<HTMLElement>(null)
  const bar = useRef<HTMLSpanElement>(null)
  const t = items[i]

  const go = useCallback(
    (next: number) => {
      const n = (next + items.length) % items.length
      setDir(n > i || (i === items.length - 1 && n === 0) ? 1 : -1)
      setI(n)
    },
    [i, items.length],
  )

  useEffect(() => {
    const el = root.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.3 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // Auto-advance with a visible timer; pauses on hover/focus or off-screen.
  useEffect(() => {
    if (bar.current) bar.current.style.transform = 'scaleX(0)'
    if (paused || !visible || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / DURATION)
      if (bar.current) bar.current.style.transform = `scaleX(${p})`
      if (p >= 1) go(i + 1)
      else raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [i, paused, visible, go])

  return (
    <section ref={root} className="rails section-tight relative" id="voices">
      <div className="shell">
        <SectionHead eyebrow={testimonials.eyebrow} index="06" title={testimonials.title} />

        <div
          className="mt-10 grid gap-6 lg:mt-[clamp(24px,5vh,56px)] lg:grid-cols-12 lg:gap-8"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight') go(i + 1)
            if (e.key === 'ArrowLeft') go(i - 1)
          }}
        >
          {/* the quote card fills its column: words on top, who and what changed at the foot */}
          <figure className="relative flex min-h-[340px] flex-col overflow-hidden rounded-[18px] border border-line bg-raise lg:col-span-8 lg:min-h-0">
            <div className="relative flex items-center justify-between px-6 pt-5 sm:px-8">
              <span className="t-label text-ink-3">
                <span className="text-teal-ink">{String(i + 1).padStart(2, '0')}</span> / {String(items.length).padStart(2, '0')}
              </span>
              <span className="flex gap-2">
                <button
                  type="button"
                  onClick={() => go(i - 1)}
                  aria-label="Previous story"
                  className="grid size-9 place-items-center rounded-[9px] border border-line-2 transition-colors hover:border-ink hover:bg-ink hover:text-bg"
                >
                  <Icon name="arrow" size={16} className="rotate-180" />
                </button>
                <button
                  type="button"
                  onClick={() => go(i + 1)}
                  aria-label="Next story"
                  className="grid size-9 place-items-center rounded-[9px] border border-line-2 transition-colors hover:border-ink hover:bg-ink hover:text-bg"
                >
                  <Icon name="arrow" size={16} />
                </button>
              </span>
            </div>

            <div className="relative grid flex-1 px-6 pb-6 pt-4 sm:px-8 sm:pb-7" aria-live="polite">
              <AnimatePresence initial={false} custom={dir}>
                <motion.div
                  key={t.name}
                  custom={dir}
                  variants={{
                    enter: (d: number) => ({ opacity: 0, x: d * 40, filter: 'blur(8px)' }),
                    center: { opacity: 1, x: 0, filter: 'blur(0px)' },
                    exit: (d: number) => ({ opacity: 0, x: d * -30, filter: 'blur(8px)' }),
                  }}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.75, ease }}
                  className="col-start-1 row-start-1 flex flex-col justify-between gap-6"
                >
                  <blockquote className="max-w-[26ch] font-display text-[clamp(1.5rem,min(2.8vw,5.2vh),2.7rem)] font-[640] leading-[1.12] tracking-[-0.03em]">
                    “{t.quote}”
                  </blockquote>
                  <figcaption className="flex flex-wrap items-end justify-between gap-5 border-t border-line pt-5">
                    <span className="flex items-center gap-4">
                      <span className={cn('grid size-12 place-items-center bg-ink text-[0.72rem] font-semibold text-bg', HEX)}>
                        {t.initials}
                      </span>
                      <span>
                        <span className="block font-semibold">{t.name}</span>
                        <span className="t-small block">{t.role}</span>
                      </span>
                    </span>
                    <span className="text-right">
                      <span className="t-label block text-ink-3">Result</span>
                      <span className="mt-1 block font-display text-[clamp(1.2rem,min(1.9vw,3.4vh),1.7rem)] font-[700] leading-tight tracking-[-0.02em] text-teal-ink">
                        {t.proof}
                      </span>
                    </span>
                  </figcaption>
                </motion.div>
              </AnimatePresence>
            </div>
            {/* timer */}
            <span className="absolute inset-x-0 bottom-0 h-[3px] bg-line">
              <span ref={bar} className="meter-fill block h-full bg-teal" />
            </span>
          </figure>

          {/* phones: a quiet position row instead of the full list */}
          <div className="flex items-center justify-center gap-2 lg:hidden" aria-hidden>
            {items.map((item, k) => (
              <span
                key={item.name}
                className={cn('h-1.5 rounded-full transition-all duration-500', k === i ? 'w-6 bg-teal' : 'w-1.5 bg-line-2')}
              />
            ))}
          </div>

          <ol className="hidden lg:col-span-4 lg:block" aria-label="Founders">
            {items.map((item, k) => (
              <li key={item.name} className="border-t border-line last:border-b">
                <button
                  type="button"
                  onClick={() => go(k)}
                  aria-current={k === i ? 'true' : undefined}
                  className={cn(
                    'group relative flex w-full items-center gap-4 px-3 py-[clamp(8px,1.7vh,15px)] text-left transition-colors duration-300',
                    k === i ? 'bg-raise' : 'hover:bg-raise/60',
                  )}
                >
                  <span
                    className={cn(
                      'absolute inset-y-0 left-0 w-[2px] origin-top bg-teal transition-transform duration-500',
                      k === i ? 'scale-y-100' : 'scale-y-0',
                    )}
                  />
                  <span className={cn('t-label w-6 transition-colors', k === i ? 'text-teal-ink' : 'text-ink-3')}>
                    {String(k + 1).padStart(2, '0')}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className={cn('block font-semibold transition-colors', k === i ? 'text-ink' : 'text-ink-2 group-hover:text-ink')}>
                      {item.name}
                    </span>
                    <span className="t-small block truncate">{item.role}</span>
                  </span>
                  <Icon
                    name="arrow"
                    size={15}
                    className={cn(
                      'shrink-0 transition-all duration-300',
                      k === i ? 'translate-x-0 opacity-100' : '-translate-x-1 opacity-0 group-hover:opacity-60',
                    )}
                  />
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

/**
 * Brands building with IBW. Every logo sits at the same optical size on its own plate,
 * resting in greyscale; the one under the pointer comes up in its original colours.
 * The rail glides to a stop under the pointer and picks up again when it leaves.
 * The About page reuses it with its own heading copy.
 */
export function Brands({
  eyebrow = brands.eyebrow,
  title = brands.title,
  intro = brands.intro,
  id = 'brands',
}: {
  eyebrow?: string
  title?: string
  intro?: string
  id?: string
} = {}) {
  const { trackRef, hold } = useMarquee<HTMLDivElement>({ speed: 38 })
  const touchTimer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(touchTimer.current), [])

  const row = (copy: boolean) =>
    brands.items.map((b) => (
      <li key={b.name} className="brand-tile logo-hover" tabIndex={copy ? -1 : 0}>
        <ClientLogo name={b.name} ratio={1.9} decorative={copy} sizes="(min-width: 1024px) 200px, 170px" />
        <span className="brand-caption">
          <span className="brand-name">{b.name}</span>
          <span className="t-label text-ink-3">{b.category}</span>
        </span>
      </li>
    ))

  return (
    <section className="rails relative border-y border-line" id={id} aria-labelledby={`${id}-title`}>
      <div className="shell grid gap-4 pb-6 pt-[clamp(32px,6vh,64px)] lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-7">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h2 id={`${id}-title`} className="t-h3 mt-3">
            {title}
          </h2>
        </div>
        <p className="t-small text-ink-2 lg:col-span-4 lg:col-start-9 lg:text-right">{intro}</p>
      </div>
      <div
        className="brand-marquee fade-edges-x overflow-hidden border-t border-line"
        onPointerEnter={(e) => e.pointerType === 'mouse' && hold(true)}
        onPointerLeave={(e) => e.pointerType === 'mouse' && hold(false)}
        onPointerDown={(e) => {
          // touch: a tap holds the rail for a moment so the tapped logo can be read
          if (e.pointerType === 'mouse') return
          hold(true)
          window.clearTimeout(touchTimer.current)
          touchTimer.current = window.setTimeout(() => hold(false), 2800)
        }}
        onFocusCapture={() => hold(true)}
        onBlurCapture={() => hold(false)}
      >
        <div ref={trackRef} className="flex w-max will-change-transform">
          <ul className="flex shrink-0">{row(false)}</ul>
          <ul className="flex shrink-0" aria-hidden>
            {row(true)}
          </ul>
        </div>
      </div>
      <div className="shell flex flex-col items-start gap-3 border-t border-line py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="t-label text-ink-3">
          <span className="hidden lg:inline">Hover</span>
          <span className="lg:hidden">Tap</span> a logo to see its colours
        </p>
        <ArrowLink href="/portfolio" tone="teal">
          {brands.cta}
        </ArrowLink>
      </div>
    </section>
  )
}
