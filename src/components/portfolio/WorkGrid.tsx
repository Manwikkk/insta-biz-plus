'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { AnimatePresence, LayoutGroup, motion } from 'motion/react'
import { categories, projects, type Project } from '@/content/portfolio'
import { Icon } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'

const ease = [0.16, 1, 0.3, 1] as const
const ALL = 'All'
const FILTERS = [
  { label: ALL, count: projects.length },
  ...categories.map((c) => ({ label: c, count: projects.filter((p) => p.category === c).length })),
]

function Card({ p, n, big }: { p: Project; n: number; big: boolean }) {
  const external = /^https?:/.test(p.href)
  const inner = (
    <>
      <Image
        src={p.image}
        alt={`${p.name} - ${p.category}`}
        fill
        sizes={big ? '(min-width: 1024px) 860px, 92vw' : '(min-width: 1024px) 420px, (min-width: 640px) 45vw, 92vw'}
        quality={75}
        className="work-img object-cover object-top"
      />
      <span aria-hidden className="absolute inset-0 bg-[linear-gradient(to_top,rgb(3_4_5/0.94),rgb(3_4_5/0.45)_45%,transparent_74%)]" />
      <span className="absolute left-4 top-4 inline-flex h-6 items-center rounded-[5px] bg-bg/90 px-2 font-label text-[0.6rem] uppercase tracking-[0.07em] text-ink backdrop-blur">
        {p.category}
      </span>
      <span className="absolute right-4 top-4 grid size-9 place-items-center rounded-full bg-bg/90 text-ink backdrop-blur transition-transform duration-500 ease-[var(--ease-out)] group-hover:rotate-45">
        <Icon name={external ? 'arrow-up-right' : 'arrow'} size={15} />
      </span>
      <span className="absolute inset-x-0 bottom-0 p-5 text-stage-ink">
        <span className="t-label block text-teal">
          {String(n).padStart(2, '0')} · {p.cta}
        </span>
        <span className={cn('mt-1.5 block font-display font-[720] leading-tight tracking-[-0.025em]', big ? 'text-[clamp(1.6rem,2.6vw,2.4rem)]' : 'text-[1.3rem]')}>
          {p.name}
        </span>
        <span className="work-reveal">
          <span className="min-h-0 overflow-hidden">
            <span className={cn('block pt-1.5 text-[0.9rem] leading-snug text-stage-ink-2', !big && 'line-clamp-2')}>{p.summary}</span>
            <span className="mt-3 hidden flex-wrap gap-1.5 sm:flex">
              {p.points.map((x) => (
                <span key={x} className="tag border-stage-line text-stage-ink-2">
                  {x}
                </span>
              ))}
            </span>
          </span>
        </span>
      </span>
    </>
  )
  const cls = cn(
    'work-card group relative block overflow-hidden rounded-[18px] border border-line bg-stage',
    big ? 'min-h-[360px] sm:h-full sm:min-h-[400px]' : 'aspect-[4/3]',
  )
  return external ? (
    <a href={p.href} target="_blank" rel="noopener noreferrer" className={cls} aria-label={`${p.name}: ${p.cta}`}>
      {inner}
    </a>
  ) : (
    <Link href={p.href} className={cls} aria-label={`${p.name}: ${p.cta}`}>
      {inner}
    </Link>
  )
}

/** "Filter by what you're building" — a bento of the client work that reflows as you filter. */
export function WorkGrid() {
  const [f, setF] = useState<string>(ALL)
  const list = useMemo(() => (f === ALL ? projects : projects.filter((p) => p.category === f)), [f])
  return (
    <div>
      <LayoutGroup>
        {/* phones: the filters scroll sideways instead of stacking three rows deep */}
        <div
          role="tablist"
          aria-label="Filter projects"
          className="-mx-[var(--gutter)] flex gap-2 overflow-x-auto px-[var(--gutter)] pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
        >
          {FILTERS.map((x) => (
            <button
              key={x.label}
              role="tab"
              aria-selected={f === x.label}
              onClick={() => setF(x.label)}
              className={cn(
                'relative inline-flex h-10 shrink-0 items-center gap-2 rounded-full border px-4 text-[0.92rem] font-medium transition-colors duration-300',
                f === x.label ? 'border-ink text-bg' : 'border-line-2 text-ink-2 hover:border-ink hover:text-ink',
              )}
            >
              {f === x.label ? (
                <motion.span layoutId="work-filter" className="absolute inset-0 rounded-full bg-ink" transition={{ duration: 0.45, ease }} />
              ) : null}
              <span className="relative">{x.label}</span>
              <span className={cn('t-label relative', f === x.label ? 'text-teal' : 'text-ink-3')}>{x.count}</span>
            </button>
          ))}
        </div>
      </LayoutGroup>
      <p className="t-label mt-6 text-ink-3" aria-live="polite">
        Showing {list.length} of {projects.length} projects
      </p>
      <motion.ul layout className="mt-6 grid grid-flow-dense gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout" initial={false}>
          {list.map((p, i) => {
            const big = i === 0 && list.length > 2
            return (
              <motion.li
                key={p.slug}
                layout
                initial={{ opacity: 0, y: 24, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.55, ease, delay: Math.min(i, 6) * 0.03 }}
                className={cn(big && 'sm:col-span-2 lg:row-span-2')}
              >
                <Card p={p} n={projects.indexOf(p) + 1} big={big} />
              </motion.li>
            )
          })}
        </AnimatePresence>
      </motion.ul>
    </div>
  )
}
