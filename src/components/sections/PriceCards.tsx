import { KeyButton } from '@/components/ui/KeyButton'
import { Icon } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'

export type PriceCard = {
  name: string
  tagline: string
  bestFor?: string
  price: string
  unit?: string
  timeline?: string
  points: string[]
  popular?: boolean
}

/** Engagement / pricing tiers. The most popular tier is cast in ink with a teal plinth. */
export function PriceCards({ cards, cta, href = '#contact-form' }: { cards: PriceCard[]; cta: string; href?: string }) {
  return (
    <ul className="grid gap-4 lg:grid-cols-3">
      {cards.map((c, i) => (
        <li
          key={c.name}
          data-reveal="rise"
          style={{ ['--d' as string]: `${i * 90}ms` }}
          className={cn(
            'relative flex flex-col rounded-[18px] border p-7 transition-transform duration-500 ease-[var(--ease-out)] hover:-translate-y-1 sm:p-8',
            c.popular ? 'border-ink bg-ink text-bg shadow-[0_6px_0_var(--teal)]' : 'border-line bg-raise',
          )}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="t-h3">{c.name}</h3>
              <p className={cn('mt-1 text-[0.95rem]', c.popular ? 'text-bg/70' : 'text-ink-3')}>{c.tagline}</p>
            </div>
            {c.popular ? (
              <span className="inline-flex h-6 shrink-0 items-center rounded-[4px] bg-teal px-2 font-label text-[0.6rem] font-semibold uppercase tracking-[0.08em] text-[#04161a]">
                Most popular
              </span>
            ) : null}
          </div>
          {c.bestFor ? <p className={cn('mt-5 text-[0.95rem]', c.popular ? 'text-bg/80' : 'text-ink-2')}>{c.bestFor}</p> : null}
          <div className={cn('mt-7 border-t pt-6', c.popular ? 'border-bg/15' : 'border-line')}>
            <p className="t-numeral text-[clamp(1.8rem,2.6vw,2.4rem)]">
              {c.price}
            </p>
            {c.unit ? <p className={cn('t-label mt-3', c.popular ? 'text-bg/60' : 'text-ink-3')}>{c.unit}</p> : null}
            {c.timeline ? <p className={cn('t-label mt-3', c.popular ? 'text-teal' : 'text-teal-ink')}>{c.timeline}</p> : null}
          </div>
          <ul className="mt-7 grid gap-3">
            {c.points.map((p) => (
              <li key={p} className="flex items-start gap-3 text-[0.95rem]">
                <Icon
                  name="check"
                  size={16}
                  strokeWidth={2}
                  className={cn('mt-[3px] shrink-0', c.popular ? 'text-teal' : 'text-teal-ink')}
                />
                <span className={c.popular ? 'text-bg/90' : 'text-ink-2'}>{p}</span>
              </li>
            ))}
          </ul>
          <div className="mt-auto pt-9">
            <KeyButton href={href} variant={c.popular ? 'teal' : 'ghost'} className="w-full justify-between" icon="arrow">
              {cta}
            </KeyButton>
          </div>
        </li>
      ))}
    </ul>
  )
}
