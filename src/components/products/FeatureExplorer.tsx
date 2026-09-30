'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { screensOf, type Product } from '@/content/products'
import { Icon } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'

const ease = [0.16, 1, 0.3, 1] as const
const host = (href: string) => new URL(href).hostname

/**
 * A product's features beside its own screens. Wide screens: the list on one side, the
 * window on the other; the features take turns while the section is in view (the rule
 * under the open one fills) until you pick one. Phones: the window on top and the
 * features as cards you swipe; the card in the middle picks the screen.
 */
export function FeatureExplorer({ product: p, flip = false }: { product: Product; flip?: boolean }) {
  const shots = screensOf(p)
  const [k, setK] = useState(0)
  const [auto, setAuto] = useState(true)
  const [inView, setInView] = useState(false)
  const [hover, setHover] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const rail = useRef<HTMLOListElement>(null)
  const f = p.features[k]

  useEffect(() => {
    const el = root.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.35 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // phones: the card closest to the middle of the rail is the one on show
  useEffect(() => {
    const r = rail.current
    if (!r) return
    let t = 0
    const onScroll = () => {
      window.clearTimeout(t)
      t = window.setTimeout(() => {
        const mid = r.scrollLeft + r.clientWidth / 2
        let best = 0
        let dist = Infinity
        Array.from(r.children).forEach((c, i) => {
          const el = c as HTMLElement
          const d = Math.abs(el.offsetLeft + el.offsetWidth / 2 - mid)
          if (d < dist) [dist, best] = [d, i]
        })
        setK(best)
      }, 60)
    }
    r.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      r.removeEventListener('scroll', onScroll)
      window.clearTimeout(t)
    }
  }, [])

  const pick = (i: number) => {
    setAuto(false)
    setK(i)
  }
  const tapCard = (i: number) => {
    const r = rail.current
    const c = r?.children[i] as HTMLElement | undefined
    if (r && c) r.scrollTo({ left: c.offsetLeft - (r.clientWidth - c.offsetWidth) / 2, behavior: 'smooth' })
    pick(i)
  }
  const running = auto && inView && !hover

  return (
    <div ref={root} className="mt-[clamp(32px,6vh,72px)] grid gap-6 lg:grid-cols-12 lg:gap-10">
      {/* the features (wide screens) */}
      <ol
        className={cn('hidden self-start lg:col-span-5 lg:block', flip && 'lg:order-2 lg:col-start-8')}
        onPointerEnter={(e) => e.pointerType === 'mouse' && setHover(true)}
        onPointerLeave={(e) => e.pointerType === 'mouse' && setHover(false)}
      >
        {p.features.map((x, i) => {
          const on = i === k
          const bodyId = `${p.id}-feature-${i}`
          return (
            <li key={x.kicker} className="relative border-b border-line first:border-t">
              <button
                type="button"
                onClick={() => pick(i)}
                aria-expanded={on}
                aria-controls={bodyId}
                className="group flex w-full items-center gap-4 py-4 text-left"
              >
                <span className={cn('t-label w-6 shrink-0 transition-colors duration-300', on ? 'text-teal-ink' : 'text-ink-3')}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="min-w-0 flex-1">
                  <span className={cn('t-label block transition-colors duration-300', on ? 'text-teal-ink' : 'text-ink-3 group-hover:text-ink-2')}>
                    {x.kicker}
                    {x.best ? <span className="ml-2 rounded-[4px] bg-ember px-1.5 py-0.5 text-[0.55rem] text-white">Best feature</span> : null}
                  </span>
                  <span
                    className={cn(
                      'mt-1 block text-[1.06rem] font-semibold leading-snug tracking-[-0.012em] transition-colors duration-300',
                      on ? 'text-ink' : 'text-ink-2 group-hover:text-ink',
                    )}
                  >
                    {x.title}
                  </span>
                </span>
                <Icon name="plus" size={16} className={cn('shrink-0 text-ink-3 transition-transform duration-500 ease-[var(--ease-out)]', on && 'rotate-45 text-ink')} />
              </button>
              {/* always mounted: opening and closing are one smooth height change, never a jump */}
              <div id={bodyId} className="feature-body" data-open={on || undefined} aria-hidden={!on}>
                <div className="min-h-0 overflow-hidden">
                  <div className="pb-5 pl-10">
                    <p className="text-[0.95rem] leading-relaxed text-ink-2">{x.body}</p>
                    {x.points.length ? (
                      <ul className="mt-3 grid gap-1.5">
                        {x.points.map((pt) => (
                          <li key={pt} className="flex items-start gap-2.5 text-[0.9rem] text-ink-2">
                            <Icon name="check" size={15} strokeWidth={2} className="mt-[3px] shrink-0 text-teal-ink" />
                            {pt}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                </div>
              </div>
              {/* the rule fills while this feature has the stage */}
              {on && auto ? (
                <span
                  aria-hidden
                  className="feature-timer absolute inset-x-0 -bottom-px h-[2px] origin-left bg-teal"
                  data-running={running || undefined}
                  onAnimationEnd={() => setK((v) => (v + 1) % p.features.length)}
                />
              ) : null}
            </li>
          )
        })}
      </ol>

      {/* the window */}
      <div className={cn('lg:col-span-7', flip && 'lg:order-1 lg:col-start-1')}>
        <div className="lg:sticky lg:top-[calc(var(--header-offset)+72px)]">
          <figure className="feature-window overflow-hidden rounded-[18px] border border-line bg-raise">
            <div className="flex h-10 items-center gap-2 border-b border-line bg-sink/60 px-4">
              <span className="flex gap-1.5" aria-hidden>
                <span className="size-2.5 rounded-full bg-line-2" />
                <span className="size-2.5 rounded-full bg-line-2" />
                <span className="size-2.5 rounded-full bg-line-2" />
              </span>
              <span className="t-label ml-2 min-w-0 text-[0.62rem] leading-tight text-ink-3">
                {host(p.href)} · {f.kicker}
              </span>
              <span className="t-label ml-auto shrink-0 text-[0.62rem] tabular-nums text-ink-3">
                {String(k + 1).padStart(2, '0')} / {String(p.features.length).padStart(2, '0')}
              </span>
            </div>
            <div className="relative aspect-[1200/647] overflow-hidden bg-stage">
              <AnimatePresence initial={false}>
                <motion.div
                  key={shots[k]}
                  className="absolute inset-0"
                  initial={{ opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.75, ease }}
                >
                  <Image
                    src={shots[k]}
                    alt={`${p.fullName} - ${f.kicker}`}
                    fill
                    sizes="(min-width: 1024px) 760px, 92vw"
                    quality={75}
                    className="object-cover object-top"
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </figure>
          {/* phones: which screen, and a way to step through them */}
          <div className="mt-3 flex items-center justify-center gap-1.5 lg:hidden" aria-hidden>
            {p.features.map((x, i) => (
              <span key={x.kicker} className={cn('h-1.5 rounded-full transition-all duration-500', i === k ? 'w-5 bg-teal' : 'w-1.5 bg-line-2')} />
            ))}
          </div>
        </div>
      </div>

      {/* the features (phones): cards to swipe */}
      <ol
        ref={rail}
        className="-mx-[var(--gutter)] flex snap-x snap-mandatory gap-3 overflow-x-auto px-[var(--gutter)] pb-2 [scroll-padding-inline:var(--gutter)] [scrollbar-width:none] lg:hidden"
        aria-label={`${p.name} features`}
      >
        {p.features.map((x, i) => (
          <li key={x.kicker} className="w-[82vw] max-w-[380px] shrink-0 snap-center">
            <button
              type="button"
              onClick={() => tapCard(i)}
              className={cn(
                'flex h-full w-full flex-col rounded-[16px] border p-5 text-left transition-[border-color,background-color] duration-300',
                i === k ? 'border-ink bg-raise' : 'border-line bg-raise/60',
              )}
            >
              <span className="t-label text-teal-ink">
                {String(i + 1).padStart(2, '0')} · {x.kicker}
              </span>
              <span className="mt-2 text-[1.06rem] font-semibold leading-snug tracking-[-0.012em]">{x.title}</span>
              <span className="mt-2 text-[0.9rem] leading-relaxed text-ink-2">{x.body}</span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  )
}
