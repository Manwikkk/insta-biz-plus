'use client'

import Link from 'next/link'
import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { solutions, solutionsIndex } from '@/content/data'
import { specialisations } from '@/content/home'
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
 * honeycomb (the mark's hexagon, repeated); hovering a cell loads its brief.
 */
export function Industries() {
  const order = solutionsIndex.groups.flatMap((g) => g.items.map((it) => solutions.find((s) => s.label === it.label)!).filter(Boolean))
  const [active, setActive] = useState(0)
  const sol = order[active]

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

        <div className="mt-12 grid gap-12 lg:mt-[clamp(24px,6vh,80px)] lg:grid-cols-12 lg:items-center">
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

            {/* mobile list */}
            <ul className="grid gap-px overflow-hidden rounded-[14px] border border-line bg-line lg:hidden">
              {order.map((s, idx) => (
                <li key={s.slug} className="bg-raise">
                  <Link href={`/solutions/${s.slug}`} className="flex items-center gap-4 px-4 py-4">
                    <span className="t-label w-6 text-teal-ink">{String(idx + 1).padStart(2, '0')}</span>
                    <span className="flex-1">
                      <span className="block font-semibold">{s.label}</span>
                      <span className="t-small block line-clamp-1">{s.summary}</span>
                    </span>
                    <Icon name="arrow" size={16} className="text-ink-3" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* brief */}
          <div className="hidden lg:col-span-5 lg:block">
            <div className="relative min-h-[clamp(270px,46vh,360px)] rounded-[16px] border border-line bg-raise p-8">
              <span className="dot-grid opacity-50 [mask-image:linear-gradient(to_bottom,#000,transparent_70%)]" />
              <AnimatePresence initial={false}>
                <motion.div
                  key={sol.slug}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.45, ease }}
                  className="absolute inset-8 flex flex-col"
                >
                  <p className="t-label text-teal-ink">{sol.group}</p>
                  <h3 className="t-h3 mt-4">{sol.label}</h3>
                  <p className="t-body mt-3">{sol.summary}</p>
                  <ul className="mt-6 flex flex-wrap gap-1.5">
                    {sol.overview.integrations.slice(0, 5).map((i) => (
                      <li key={i} className="tag">
                        {i}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto flex items-center justify-between border-t border-line pt-5">
                    <span className="t-label text-ink-3">
                      {sol.features.items.length} key features · {sol.modules.items.length} modules
                    </span>
                    <Link href={`/solutions/${sol.slug}`} className="group inline-flex items-center gap-2 font-medium">
                      <span className="link-draw">View {sol.crumb}</span>
                      <Icon name="arrow" size={16} className="transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
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
