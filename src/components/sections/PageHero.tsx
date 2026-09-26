import Link from 'next/link'
import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { Odometer } from '@/components/ui/Odometer'

export type Crumb = { label: string; href?: string }

export function Breadcrumbs({ items, className }: { items: Crumb[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={cn('t-label text-ink-3', className)}>
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((c, i) => (
          <li key={c.label} className="flex items-center gap-2">
            {i > 0 ? (
              <span aria-hidden className="text-line-2">
                /
              </span>
            ) : null}
            {c.href ? (
              <Link href={c.href} className="transition-colors hover:text-ink">
                {c.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-ink-2">
                {c.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

/**
 * Inner-page opener. Title lines rise at first paint (CSS only), a figure slot on the
 * right carries each page's signature visual, and an optional instrument row of stats.
 */
export function PageHero({
  crumbs,
  tag,
  tagNote,
  title,
  intro,
  actions,
  figure,
  stats,
  chips,
  className,
  size = 'display',
  wide = false,
}: {
  crumbs?: Crumb[]
  tag?: string
  tagNote?: ReactNode
  title: string
  intro?: ReactNode
  actions?: ReactNode
  figure?: ReactNode
  stats?: { value: string; label: string }[]
  chips?: string[]
  className?: string
  size?: 'display' | 'h2'
  /** Give the figure half the width (for figures that show the page's subject working). */
  wide?: boolean
}) {
  const lines = title.split(/(?<=[.:]) (?=[A-Z])/)
  return (
    <section className={cn('rails relative overflow-hidden border-b border-line', className)}>
      <div aria-hidden className="absolute inset-0 [mask-image:radial-gradient(80%_80%_at_85%_20%,#000,transparent_70%)]">
        <div className="iso-grid" />
      </div>
      <div className="shell relative grid gap-12 pb-16 pt-[120px] lg:grid-cols-12 lg:items-center lg:gap-10 lg:pb-[clamp(36px,7vh,80px)] lg:pt-[clamp(100px,17vh,152px)]">
        <div className={cn('min-w-0', figure ? (wide ? 'lg:col-span-6' : 'lg:col-span-7') : 'lg:col-span-10')}>
          {crumbs ? <Breadcrumbs items={crumbs} className="enter-fade mb-[clamp(16px,3.4vh,32px)]" /> : null}
          {tag ? (
            <p className="enter-fade flex flex-wrap items-center gap-3" style={{ ['--d' as string]: '60ms' }}>
              <span className="inline-flex h-6 items-center rounded-[4px] bg-ink px-2 font-label text-[0.62rem] font-medium uppercase tracking-[0.08em] text-bg">
                {tag}
              </span>
              {tagNote ? <span className="t-label text-ink-2">{tagNote}</span> : null}
            </p>
          ) : null}
          <h1
            className={cn(
              'mt-[clamp(14px,2.6vh,24px)]',
              size === 'display'
                ? cn(
                    'font-display font-[760] leading-[0.95] tracking-[-0.042em] [font-stretch:108%]',
                    wide ? 'text-[clamp(2.2rem,min(4.6vw,8.4vh),4.6rem)]' : 'text-[clamp(2.3rem,min(5.4vw,9vh),5.4rem)]',
                  )
                : 't-h2',
            )}
          >
            {lines.map((l, i) => (
              <span key={i} className="enter-line">
                <span style={{ ['--d' as string]: `${120 + i * 90}ms` }}>{l}</span>
              </span>
            ))}
          </h1>
          {intro ? (
            <div className="enter-fade t-lede mt-[clamp(14px,3vh,28px)] max-w-[40rem]" style={{ ['--d' as string]: '380ms' }}>
              {intro}
            </div>
          ) : null}
          {chips?.length ? (
            <ul className="enter-fade mt-[clamp(14px,3vh,28px)] flex flex-wrap gap-2" style={{ ['--d' as string]: '440ms' }}>
              {chips.map((c) => (
                <li key={c} className="tag">
                  {c}
                </li>
              ))}
            </ul>
          ) : null}
          {actions ? (
            <div className="enter-fade mt-[clamp(18px,4vh,36px)] flex flex-wrap items-center gap-3" style={{ ['--d' as string]: '500ms' }}>
              {actions}
            </div>
          ) : null}
        </div>
        {figure ? (
          <div className={cn('enter-fade relative min-w-0', wide ? 'lg:col-span-6' : 'lg:col-span-5')} style={{ ['--d' as string]: '300ms' }}>
            {figure}
          </div>
        ) : null}
        {stats?.length ? (
          <dl
            className="enter-fade grid grid-cols-2 gap-y-6 border-t border-line pt-6 sm:grid-cols-4 lg:col-span-12"
            style={{ ['--d' as string]: '560ms' }}
          >
            {stats.map((s, i) => (
              <div
                key={s.label}
                className="flex flex-col-reverse border-line [&:nth-child(2n)]:border-l [&:nth-child(2n)]:pl-5 sm:border-l sm:pl-5 sm:first:border-l-0 sm:first:pl-0"
              >
                <dt className="t-label mt-2 text-ink-3">{s.label}</dt>
                <dd className="t-num text-[clamp(1.9rem,3vw,2.8rem)]">
                  <Odometer value={s.value} delay={200 + i * 110} />
                </dd>
              </div>
            ))}
          </dl>
        ) : null}
      </div>
    </section>
  )
}
