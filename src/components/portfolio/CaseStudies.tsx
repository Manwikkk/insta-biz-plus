'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { featured, projects } from '@/content/portfolio'
import { media } from '@/content/site'
import { Icon } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'

const ease = [0.16, 1, 0.3, 1] as const
const ITEMS = featured.map((f) => ({ ...f, p: projects.find((p) => p.name === f.name)! })).filter((x) => x.p)
type Item = (typeof ITEMS)[number]

const host = (href: string | null) => {
  if (!href || !/^https?:/.test(href)) return 'instabizweb.com'
  return new URL(href).hostname.replace(/^www\./, '')
}

/** A featured build's story: what it is, the result it is known for, and where to see it live. */
function Details({ it, k }: { it: Item; k: number }) {
  const { p } = it
  const external = !!p.href && /^https?:/.test(p.href)
  const [value, label] = it.note.split(' · ')
  return (
    <>
      <p className="t-label text-ink-3">
        <span className="text-teal-ink">{String(k + 1).padStart(2, '0')}</span> / {String(ITEMS.length).padStart(2, '0')} · {p.category}
      </p>
      <h3 className="mt-4 font-display text-[clamp(2rem,3.4vw,3.2rem)] font-[760] leading-[0.98] tracking-[-0.04em] [font-stretch:108%]">{p.name}</h3>
      <p className="t-lede mt-3">{p.tagline}</p>
      <p className="mt-6 flex items-baseline gap-3 border-t border-line pt-5">
        <span className="t-num text-[clamp(1.8rem,2.6vw,2.4rem)] text-teal-ink">{value}</span>
        <span className="t-label text-ink-3">{label}</span>
      </p>
      <p className="t-body mt-4">{p.description}</p>
      {p.href ? (
        <a
          href={p.href}
          {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          className="group mt-6 inline-flex items-center gap-2 font-medium"
        >
          <span className="link-draw">Visit {p.name}</span>
          <Icon
            name={external ? 'arrow-up-right' : 'arrow'}
            size={16}
            className="transition-transform duration-500 ease-[var(--ease-out)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </a>
      ) : null}
    </>
  )
}

/**
 * The featured builds as a scroll showcase. On desktop the details hold still beside the
 * screens and change as each screen crosses the middle of the view; on phones each build's
 * story sits under its screen.
 */
export function CaseStudies() {
  const [active, setActive] = useState(0)
  const shots = useRef<(HTMLLIElement | null)[]>([])

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.k))
      },
      { rootMargin: '-45% 0px -45% 0px' },
    )
    shots.current.forEach((el) => el && io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
      <div className="hidden lg:col-span-5 lg:block">
        <div className="sticky top-[calc(var(--header-offset)+48px)] transition-[top] duration-500 ease-[var(--ease-out)]">
          <ol className="mb-8 flex gap-2" aria-hidden>
            {ITEMS.map((x, k) => (
              <li key={x.name} className={cn('h-[3px] flex-1 rounded-full transition-colors duration-500', k <= active ? 'bg-teal' : 'bg-line-2')} />
            ))}
          </ol>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.5, ease }}
              aria-live="polite"
            >
              <Details it={ITEMS[active]} k={active} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <ol className="grid gap-14 lg:col-span-7 lg:gap-[16vh] lg:py-[8vh]">
        {ITEMS.map((it, k) => (
          <li
            key={it.name}
            data-k={k}
            ref={(el) => {
              shots.current[k] = el
            }}
          >
            <figure className="case-shot overflow-hidden rounded-[18px] border border-line bg-raise" data-active={k === active || undefined} data-reveal="rise">
              <div className="flex h-9 items-center gap-1.5 border-b border-line px-4">
                <span className="size-2 rounded-full bg-line-2" />
                <span className="size-2 rounded-full bg-line-2" />
                <span className="size-2 rounded-full bg-line-2" />
                <span className="t-label ml-3 truncate text-[0.62rem] text-ink-3">{host(it.p.href)}</span>
              </div>
              <div className="relative aspect-[16/10] overflow-hidden bg-sink">
                <Image
                  src={media(it.p.image)}
                  alt={`${it.p.name} - ${it.p.category}`}
                  fill
                  sizes="(min-width: 1024px) 720px, 92vw"
                  quality={75}
                  className="object-cover object-top"
                />
              </div>
            </figure>
            <div className="mt-6 lg:hidden" data-reveal="rise">
              <Details it={it} k={k} />
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
