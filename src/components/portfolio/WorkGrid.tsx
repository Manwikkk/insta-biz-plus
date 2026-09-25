'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { AnimatePresence, LayoutGroup, motion } from 'motion/react'
import { filters, projects, type Project } from '@/content/portfolio'
import { media } from '@/content/site'
import { Icon } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'

const ease = [0.16, 1, 0.3, 1] as const

function Card({ p, n, big }: { p: Project; n: number; big: boolean }) {
  const external = !!p.href && /^https?:/.test(p.href)
  const inner = (
    <>
      <Image
        src={media(p.image)}
        alt={`${p.name} - ${p.category}`}
        fill
        sizes={big ? '(min-width: 1024px) 860px, 92vw' : '(min-width: 1024px) 420px, (min-width: 640px) 45vw, 92vw'}
        quality={75}
        className="object-cover object-top"
      />
      <span aria-hidden className="absolute inset-0 bg-[linear-gradient(to_top,rgb(3_4_5/0.92),rgb(3_4_5/0.4)_42%,transparent_72%)]" />
      <span className="absolute left-4 top-4 inline-flex h-6 items-center rounded-[5px] bg-bg/90 px-2 font-label text-[0.6rem] uppercase tracking-[0.07em] text-ink backdrop-blur">
        {p.category}
      </span>
      {p.href ? (
        <span className="absolute right-4 top-4 grid size-9 place-items-center rounded-full bg-bg/90 text-ink backdrop-blur transition-transform duration-500 ease-[var(--ease-out)] group-hover:rotate-45">
          <Icon name={external ? 'arrow-up-right' : 'arrow'} size={15} />
        </span>
      ) : null}
      <span className="absolute inset-x-0 bottom-0 p-5 text-stage-ink">
        <span className="t-label block text-teal">
          {String(n).padStart(2, '0')} · {p.tag}
        </span>
        <span className={cn('mt-1.5 block font-display font-[720] leading-tight tracking-[-0.025em]', big ? 'text-[clamp(1.6rem,2.6vw,2.4rem)]' : 'text-[1.3rem]')}>
          {p.name}
        </span>
        <span className="work-reveal">
          <span className="min-h-0 overflow-hidden">
            <span className="block pt-1.5 text-[0.92rem] text-stage-ink-2">{p.tagline}</span>
            {big ? <span className="mt-1 block max-w-xl text-[0.86rem] leading-relaxed text-stage-ink-2">{p.description}</span> : null}
          </span>
        </span>
      </span>
    </>
  )
  const cls = cn(
    'work-card group relative block overflow-hidden rounded-[18px] border border-line bg-stage',
    big ? 'min-h-[340px] sm:h-full sm:min-h-[380px]' : 'aspect-[4/3]',
  )
  if (!p.href) return <div className={cls}>{inner}</div>
  return external ? (
    <a href={p.href} target="_blank" rel="noopener noreferrer" className={cls} aria-label={`${p.name}: ${p.ctaLabel}`}>
      {inner}
    </a>
  ) : (
    <Link href={p.href} className={cls}>
      {inner}
    </Link>
  )
}

/** "Filter by what you're building" — a bento of the work that reflows as you filter. */
export function WorkGrid() {
  const [f, setF] = useState<string>('All Work')
  const list = useMemo(() => (f === 'All Work' ? projects : projects.filter((p) => p.filter === f)), [f])
  return (
    <div>
      <LayoutGroup>
        <div role="tablist" aria-label="Filter projects" className="flex flex-wrap gap-2">
          {filters.map((x) => (
            <button
              key={x.label}
              role="tab"
              aria-selected={f === x.label}
              onClick={() => setF(x.label)}
              className={cn(
                'relative inline-flex h-10 items-center gap-2 rounded-full border px-4 text-[0.92rem] font-medium transition-colors duration-300',
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
      <motion.ul layout className="mt-10 grid grid-flow-dense gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
