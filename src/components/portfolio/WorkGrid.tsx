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

function Card({ p, i }: { p: Project; i: number }) {
  const external = !!p.href && /^https?:/.test(p.href)
  const body = (
    <>
      <div className="relative aspect-[16/10] overflow-hidden rounded-[12px] border border-line bg-sink">
        <Image
          src={media(p.image)}
          alt={`${p.name} - ${p.category}`}
          fill
          sizes="(min-width: 1024px) 420px, (min-width: 640px) 45vw, 92vw"
          quality={75}
          className="object-cover object-top transition-transform duration-[1.2s] ease-[var(--ease-out)] group-hover:scale-[1.04]"
        />
        <span className="absolute left-3 top-3 inline-flex h-6 items-center rounded-[5px] bg-bg/90 px-2 font-label text-[0.6rem] uppercase tracking-[0.07em] text-ink backdrop-blur">
          {p.category}
        </span>
      </div>
      <div className="mt-5 flex items-start justify-between gap-4">
        <div>
          <p className="t-label text-teal-ink">
            {String(i + 1).padStart(2, '0')} · {p.tag}
          </p>
          <h3 className="t-h3 mt-2">{p.name}</h3>
        </div>
        {p.href ? (
          <span className="mt-1 grid size-10 shrink-0 place-items-center rounded-[10px] border border-line-2 transition-[background-color,color,border-color] duration-300 group-hover:border-ink group-hover:bg-ink group-hover:text-bg">
            <Icon name={external ? 'arrow-up-right' : 'arrow'} size={16} />
          </span>
        ) : null}
      </div>
      <p className="mt-2 text-[1.02rem] font-medium text-ink">{p.tagline}</p>
      <p className="t-small mt-2 text-ink-2">{p.description}</p>
    </>
  )
  if (!p.href) return <div className="group block">{body}</div>
  return external ? (
    <a href={p.href} target="_blank" rel="noopener noreferrer" className="group block" aria-label={`${p.name}: ${p.ctaLabel}`}>
      {body}
    </a>
  ) : (
    <Link href={p.href} className="group block">
      {body}
    </Link>
  )
}

/** "Filter by what you're building" — the grid reflows with a layout animation. */
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
                'relative inline-flex h-10 items-center gap-2 rounded-[10px] border px-4 text-[0.92rem] font-medium transition-colors duration-300',
                f === x.label ? 'border-ink text-bg' : 'border-line-2 text-ink-2 hover:border-ink hover:text-ink',
              )}
            >
              {f === x.label ? (
                <motion.span
                  layoutId="work-filter"
                  className="absolute inset-0 rounded-[9px] bg-ink"
                  transition={{ duration: 0.45, ease }}
                />
              ) : null}
              <span className="relative">{x.label}</span>
              <span className={cn('t-label relative', f === x.label ? 'text-teal' : 'text-ink-3')}>{x.count}</span>
            </button>
          ))}
        </div>
      </LayoutGroup>
      <motion.ul layout className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout" initial={false}>
          {list.map((p, i) => (
            <motion.li
              key={p.slug}
              layout
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.55, ease, delay: Math.min(i, 6) * 0.03 }}
            >
              <Card p={p} i={projects.indexOf(p)} />
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
    </div>
  )
}
