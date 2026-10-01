'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, LayoutGroup, motion } from 'motion/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { categories, categoryLabel, projects, type Project, type WorkCategory } from '@/content/portfolio'
import { Icon } from '@/components/ui/Icon'
import { ProjectVisual } from './plates/ProjectVisual'
import { ScrollCue } from '@/components/ui/ScrollCue'
import { useLenis } from '@/components/motion/SmoothScroll'
import { cn } from '@/lib/cn'

const ease = [0.16, 1, 0.3, 1] as const
type Filter = 'all' | WorkCategory
type View = 'grid' | 'list'

const FILTERS: { key: Filter; label: string; count: number }[] = [
  { key: 'all', label: 'All work', count: projects.length },
  ...categories.map((c) => ({ key: c, label: categoryLabel[c], count: projects.filter((p) => p.category === c).length })),
]
const pad = (n: number) => String(n).padStart(2, '0')
const numberOf = (p: Project) => pad(projects.indexOf(p) + 1)
const external = (href: string) => /^https?:/.test(href)

function Go({ p, className, children }: { p: Project; className: string; children: ReactNode }) {
  const label = `${p.name}: ${p.cta}`
  return external(p.href) ? (
    <a href={p.href} target="_blank" rel="noopener noreferrer" className={className} aria-label={label}>
      {children}
    </a>
  ) : (
    <Link href={p.href} className={className} aria-label={label}>
      {children}
    </Link>
  )
}

/** A project as an editorial plate: its line of facts above, the screen below, the details on hover. */
function Card({ p, i, wide }: { p: Project; i: number; wide: boolean }) {
  return (
    <Go p={p} className="wi-card group block">
      <span className="wi-meta">
        <span className="flex min-w-0 items-baseline gap-3">
          <span className="t-label text-ink-3">{numberOf(p)}</span>
          <span className="truncate text-[1.02rem] font-semibold tracking-[-0.012em]">{p.name}</span>
        </span>
        <span className="wi-paren" aria-hidden>
          (
          <span className="wi-paren-in">
            <span>
              {p.cta}
              <Icon name={external(p.href) ? 'arrow-up-right' : 'arrow'} size={12} className="ml-1 inline" />
            </span>
          </span>
          )
        </span>
        <span className="t-label shrink-0 text-ink-3">{categoryLabel[p.category]}</span>
      </span>
      {/* the observer watches the unclipped frame; the plate inside is drawn up from its foot */}
      <span className="block" data-reveal="clip" style={{ ['--d' as string]: `${(i % 3) * 90}ms` }}>
        <span className="wi-shot aspect-[16/8.7]">
          <ProjectVisual p={p} sizes={wide ? '(min-width: 1024px) 900px, 92vw' : '(min-width: 1024px) 440px, (min-width: 640px) 46vw, 92vw'} />
          <span className="wi-tag" aria-hidden>
            <span className="block text-[0.9rem] leading-snug">{p.summary}</span>
            <span className="mt-3 flex flex-wrap gap-1.5">
              {p.points.map((x) => (
                <span key={x} className="wi-chip">
                  {x}
                </span>
              ))}
            </span>
          </span>
        </span>
      </span>
    </Go>
  )
}

/** Wide, then a pair with the second set lower: the rhythm of a printed portfolio. */
function Grid({ list }: { list: Project[] }) {
  return (
    <ul className="grid gap-x-[clamp(16px,2vw,28px)] gap-y-[clamp(40px,7vh,80px)] sm:grid-cols-2">
      {list.map((p, i) => {
        const wide = i % 3 === 0 && !(list.length === 2)
        return (
          <li key={p.slug} className={cn(wide ? 'sm:col-span-2' : i % 3 === 2 && 'sm:mt-[clamp(48px,9vw,140px)]')}>
            <Card p={p} i={i} wide={wide} />
          </li>
        )
      })}
    </ul>
  )
}

/** The same work as an index: one line each, the screen sliding open under the pointer. */
function List({ list }: { list: Project[] }) {
  return (
    <ol className="border-b border-line">
      {list.map((p, i) => (
        <li key={p.slug} data-reveal="rise" style={{ ['--d' as string]: `${Math.min(i, 10) * 40}ms` }}>
          <Go p={p} className="wi-row group">
            <span className="t-label text-ink-3">{numberOf(p)}</span>
            <span className="min-w-0">
              <span className="wi-row-name">{p.name}</span>
              <span className="mt-1 block truncate text-[0.9rem] text-ink-3">{p.summary}</span>
            </span>
            <span className="wi-row-thumb" aria-hidden>
              <Image src={p.image} alt="" fill sizes="176px" quality={60} className="object-cover object-top" />
            </span>
            <span className="t-label hidden w-[7.5rem] text-right text-ink-3 md:block">{categoryLabel[p.category]}</span>
            <span className="wi-row-go" aria-hidden>
              <Icon name={external(p.href) ? 'arrow-up-right' : 'arrow'} size={16} />
            </span>
          </Go>
        </li>
      ))}
    </ol>
  )
}

/**
 * All the client work, filtered from a numbered list that holds its place on the left while
 * the work scrolls past (a row of chips on phones). Changing the filter washes the current
 * set out before the next one draws in; the work reads as editorial plates or as an index.
 */
export function WorkIndex() {
  const [filter, setFilter] = useState<Filter>('all')
  const [view, setView] = useState<View>('grid')
  const list = useMemo(() => (filter === 'all' ? projects : projects.filter((p) => p.category === filter)), [filter])
  const results = useRef<HTMLDivElement>(null)
  const chips = useRef<HTMLUListElement>(null)
  const lenis = useLenis()

  // A new set changes the page's height: re-measure the scroll scenes below once it has drawn in.
  const first = useRef(true)
  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 700)
    return () => window.clearTimeout(id)
  }, [filter, view])

  // Choosing from far down the list brings the new set into view from its first item.
  const choose = (next: { filter?: Filter; view?: View }) => {
    if (next.filter) setFilter(next.filter)
    if (next.view) setView(next.view)
    const el = results.current
    if (!el || el.getBoundingClientRect().top > 0) return
    const y = el.getBoundingClientRect().top + window.scrollY - 120
    if (lenis) lenis.scrollTo(y, { duration: 1 })
    else window.scrollTo({ top: y, behavior: 'smooth' })
  }

  return (
    // one column on phones, never wider than the screen (the chip row scrolls inside it)
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
      <aside className="min-w-0 lg:col-span-3">
        <div className="lg:sticky lg:top-[calc(var(--header-offset)+28px)] lg:transition-[top] lg:duration-500">
          <p className="t-label mb-5 hidden text-ink-3 lg:block">
            <span aria-hidden>( </span>Filter by category<span aria-hidden> )</span>
          </p>
          <LayoutGroup>
            <div className="relative">
            <ul ref={chips} className="wi-filters" aria-label="Filter projects by category">
              {FILTERS.map((f, i) => {
                const on = f.key === filter
                return (
                  <li key={f.key} className="shrink-0">
                    <button type="button" aria-pressed={on} onClick={() => choose({ filter: f.key })} className={cn('wi-filter', on && 'is-on')}>
                      {on ? <motion.span layoutId="wi-mark" className="wi-filter-mark" transition={{ duration: 0.5, ease }} /> : null}
                      <span className="wi-filter-n">{pad(i)}</span>
                      <span>{f.label}</span>
                      <sup className="wi-filter-count">{pad(f.count)}</sup>
                    </button>
                  </li>
                )
              })}
            </ul>
            <ScrollCue target={chips} />
            </div>
          </LayoutGroup>

          <div className="mt-5 flex items-center justify-between gap-4 lg:mt-8 lg:flex-col lg:items-start lg:border-t lg:border-line lg:pt-6">
            <div role="group" aria-label="Layout" className="wi-toggle">
              {(['grid', 'list'] as const).map((v) => (
                <button key={v} type="button" aria-pressed={view === v} onClick={() => choose({ view: v })}>
                  {view === v ? <motion.span layoutId="wi-view" className="wi-toggle-lens" transition={{ duration: 0.45, ease }} /> : null}
                  <span className="relative">{v === 'grid' ? 'Plates' : 'Index'}</span>
                </button>
              ))}
            </div>
            <p className="t-label text-ink-3" aria-live="polite">
              <span className="text-ink">{pad(list.length)}</span> / {pad(projects.length)} shown
            </p>
          </div>
        </div>
      </aside>

      <div ref={results} className="min-w-0 scroll-mt-32 lg:col-span-9">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`${filter}-${view}`}
            exit={{ opacity: 0, y: -16, filter: 'blur(6px)' }}
            transition={{ duration: 0.32, ease }}
          >
            {view === 'grid' ? <Grid list={list} /> : <List list={list} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
