'use client'

import Link from 'next/link'
import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { solutions, solutionsIndex } from '@/content/data'
import { specialisations } from '@/content/home'
import { solutionIcon } from '@/content/nav'
import { SectionHead } from '@/components/ui/SectionHead'
import { Icon } from '@/components/ui/Icon'
import { KeyButton } from '@/components/ui/KeyButton'
import { cn } from '@/lib/cn'

const HEX = 'polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%)'
const ease = [0.16, 1, 0.3, 1] as const

/** Rows of the honeycomb (desktop): 4 · 4 · 4, alternate rows offset by half a cell. */
const ROWS = [
  [0, 1, 2, 3],
  [4, 5, 6, 7],
  [8, 9, 10, 11],
]

/**
 * Chapter 3 — how the engine meets an industry. Twelve specialisations as a
 * honeycomb (the mark's hexagon, repeated); hovering a cell loads its brief. Phones get
 * the same brief from a rail of industries you tap.
 */
export function Industries() {
  const order = solutionsIndex.groups.flatMap((g) => g.items.map((it) => solutions.find((s) => s.label === it.label)!).filter(Boolean))
  const [active, setActive] = useState(0)
  const rail = useRef<HTMLUListElement>(null)
  const sol = order[active]
  // the picked chip slides to the middle of the rail (the rail scrolls, never the page)
  const pick = (idx: number, chip: HTMLElement) => {
    setActive(idx)
    const r = rail.current
    const li = chip.parentElement
    if (r && li) r.scrollTo({ left: li.offsetLeft - (r.clientWidth - li.offsetWidth) / 2, behavior: 'smooth' })
  }

  return (
    <section className="rails section-tight relative overflow-hidden" id="industries">
      <div className="shell relative z-[2]">
        <SectionHead
          eyebrow={specialisations.eyebrow}
          index="03"
          title={specialisations.title}
          intro={specialisations.intro}
          align="split"
        />

        <div className="mt-12 grid grid-cols-1 gap-12 lg:mt-[clamp(24px,6vh,80px)] lg:grid-cols-12 lg:items-center">
          {/* honeycomb */}
          <div className="lg:col-span-7" data-reveal="rise">
            <div
              className="hidden select-none [--cell-h:clamp(116px,20vh,170px)] [--cell-w:calc(var(--cell-h)*0.8647)] lg:block"
              role="list"
              aria-label="Industry solutions"
            >
              {ROWS.map((row, r) => (
                <div
                  key={r}
                  className={cn(
                    'flex gap-[10px]',
                    r > 0 && 'mt-[calc(var(--cell-h)*-0.2)]',
                    r % 2 === 1 && 'pl-[calc(var(--cell-w)/2+5px)]',
                  )}
                >
                  {row.map((idx) => {
                    const s = order[idx]
                    const isErp = s.group !== 'Industry CRM Software'
                    const on = idx === active
                    return (
                      <Link
                        role="listitem"
                        key={s.slug}
                        href={`/solutions/${s.slug}`}
                        onMouseEnter={() => setActive(idx)}
                        onFocus={() => setActive(idx)}
                        className="group relative block h-[var(--cell-h)] w-[var(--cell-w)] shrink-0 transition-transform duration-500 ease-[var(--ease-out)] hover:-translate-y-1.5 focus-visible:-translate-y-1.5 focus-visible:outline-none"
                        style={{ clipPath: HEX }}
                      >
                        <span
                          className={cn(
                            'absolute inset-0 transition-colors duration-300',
                            on ? 'bg-teal' : isErp ? 'bg-navy/40' : 'bg-line-2',
                          )}
                        />
                        <span
                          className={cn(
                            'absolute inset-[1.5px] flex flex-col items-center justify-center px-[clamp(10px,2.6vh,20px)] text-center transition-colors duration-300',
                            on ? 'bg-ink text-bg' : 'bg-raise text-ink',
                          )}
                          style={{ clipPath: HEX }}
                        >
                          <span className={cn('t-label text-[0.58rem]', on ? 'text-teal' : 'text-ink-3')}>
                            {String(idx + 1).padStart(2, '0')}
                          </span>
                          <span className="mt-1.5 text-[clamp(0.74rem,1.9vh,0.86rem)] font-semibold leading-tight tracking-[-0.01em]">
                            {s.label}
                          </span>
                        </span>
                      </Link>
                    )
                  })}
                </div>
              ))}
              <div className="mt-[clamp(14px,3vh,32px)] flex flex-wrap items-center gap-5 pl-1">
                <span className="t-label flex items-center gap-2 text-ink-3">
                  <span className="size-2.5 bg-line-2 [clip-path:polygon(50%_0,100%_25%,100%_75%,50%_100%,0_75%,0_25%)]" />
                  {solutionsIndex.groups[0].title}
                </span>
                <span className="t-label flex items-center gap-2 text-ink-3">
                  <span className="size-2.5 bg-navy/60 [clip-path:polygon(50%_0,100%_25%,100%_75%,50%_100%,0_75%,0_25%)]" />
                  {solutionsIndex.groups[1].title}
                </span>
              </div>
            </div>

            {/* phones & tablets: tap an industry to read its brief (the honeycomb's hover, by touch) */}
            <div className="lg:hidden">
              <ul
                ref={rail}
                className="relative -mx-[var(--gutter)] flex gap-2 overflow-x-auto px-[var(--gutter)] pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                aria-label="Industry solutions"
              >
                {order.map((s, idx) => {
                  const on = idx === active
                  const isErp = s.group !== 'Industry CRM Software'
                  return (
                    <li key={s.slug} className="shrink-0">
                      <button
                        type="button"
                        aria-pressed={on}
                        onClick={(e) => pick(idx, e.currentTarget)}
                        className={cn(
                          'flex h-11 items-center gap-2 whitespace-nowrap rounded-full border py-1 pl-1 pr-4 text-[0.88rem] font-medium tracking-[-0.01em] transition-[background-color,border-color,color] duration-300',
                          on ? 'border-ink bg-ink text-bg' : 'border-line-2 bg-raise text-ink-2',
                        )}
                      >
                        <span
                          className={cn(
                            'grid size-8 place-items-center transition-colors duration-300',
                            on ? 'bg-teal text-[#04161a]' : isErp ? 'bg-navy/15 text-navy dark:text-[#7ea8e6]' : 'bg-teal-soft text-teal-ink',
                          )}
                          style={{ clipPath: HEX }}
                        >
                          <Icon name={solutionIcon[s.slug] ?? 'layers'} size={15} />
                        </span>
                        {s.label}
                      </button>
                    </li>
                  )
                })}
              </ul>
              <Brief sol={sol} n={active + 1} className="mt-4" />
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-between gap-x-5 gap-y-4 lg:hidden">
              <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                <span className="t-label flex items-center gap-2 text-ink-3">
                  <span className="size-2.5 bg-teal-soft ring-1 ring-teal/40 [clip-path:polygon(50%_0,100%_25%,100%_75%,50%_100%,0_75%,0_25%)]" />
                  {solutionsIndex.groups[0].title}
                </span>
                <span className="t-label flex items-center gap-2 text-ink-3">
                  <span className="size-2.5 bg-navy/60 [clip-path:polygon(50%_0,100%_25%,100%_75%,50%_100%,0_75%,0_25%)]" />
                  {solutionsIndex.groups[1].title}
                </span>
              </div>
              <KeyButton href="/solutions" variant="ghost" icon="arrow">
                {specialisations.cta}
              </KeyButton>
            </div>
          </div>

          {/* brief */}
          <div className="hidden lg:col-span-5 lg:block">
            <Brief sol={sol} n={active + 1} className="min-h-[clamp(270px,46vh,360px)] lg:p-8" />
            <div className="mt-[clamp(14px,3vh,24px)]">
              <KeyButton href="/solutions" variant="ghost" icon="arrow">
                {specialisations.cta}
              </KeyButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/** An industry's brief. The old one and the new one cross-fade in the same cell. */
function Brief({ sol, n, className }: { sol: (typeof solutions)[number]; n: number; className?: string }) {
  return (
    <div className={cn('relative grid overflow-hidden rounded-[16px] border border-line bg-raise p-5 sm:p-7', className)}>
      <span className="dot-grid opacity-50 [mask-image:linear-gradient(to_bottom,#000,transparent_70%)]" />
      <AnimatePresence initial={false}>
        <motion.div
          key={sol.slug}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.45, ease }}
          className="relative col-start-1 row-start-1 flex flex-col"
        >
          <p className="t-label text-teal-ink">
            <span className="lg:hidden">{String(n).padStart(2, '0')} · </span>
            {sol.group}
          </p>
          <h3 className="t-h3 mt-3 lg:mt-4">{sol.label}</h3>
          <p className="t-body mt-3 max-lg:line-clamp-4">{sol.summary}</p>
          <ul className="mt-5 flex flex-wrap gap-1.5 lg:mt-6">
            {sol.overview.integrations.slice(0, 5).map((i, k) => (
              <li key={i} className={cn('tag', k > 2 && 'max-sm:hidden')}>
                {i}
              </li>
            ))}
          </ul>
          <div className="mt-auto flex items-center justify-between gap-4 border-t border-line pt-4 max-lg:mt-5 lg:pt-5">
            <span className="t-label text-ink-3">
              {sol.features.items.length} key features · {sol.modules.items.length} modules
            </span>
            <Link href={`/solutions/${sol.slug}`} className="group inline-flex shrink-0 items-center gap-2 font-medium">
              <span className="link-draw">View {sol.crumb}</span>
              <Icon name="arrow" size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
