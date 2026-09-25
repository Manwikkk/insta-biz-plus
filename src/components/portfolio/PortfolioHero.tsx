import Image from 'next/image'
import { Breadcrumbs } from '@/components/sections/PageHero'
import { KeyButton } from '@/components/ui/KeyButton'
import { Odometer } from '@/components/ui/Odometer'
import { portfolioPage as pp, projects, type Project } from '@/content/portfolio'
import { media } from '@/content/site'
import { cn } from '@/lib/cn'

/** Three columns of the work, each drifting at its own pace (alternate columns run the other way). */
const COLUMNS = [0, 1, 2].map((c) => projects.filter((_, i) => i % 3 === c))
const PACE = ['64s', '78s', '58s']

function Shot({ p }: { p: Project }) {
  return (
    <figure className="pf-card mb-4 overflow-hidden rounded-[14px] border border-stage-line bg-stage-2">
      <div className="relative aspect-[16/11] overflow-hidden">
        <Image src={media(p.image)} alt="" fill sizes="(min-width: 1024px) 300px, 45vw" quality={60} className="object-cover object-top" />
      </div>
      <figcaption className="flex items-center justify-between gap-3 px-3 py-2.5">
        <span className="truncate text-[0.82rem] font-semibold text-stage-ink">{p.name}</span>
        <span className="t-label shrink-0 text-[0.56rem] text-stage-ink-2">{p.tag}</span>
      </figcaption>
    </figure>
  )
}

/**
 * Portfolio opener on the dark stage: the promise and the numbers on the left, and the work
 * itself as a tilted wall of live products drifting past on the right.
 */
export function PortfolioHero() {
  const stats = [
    { value: '100+', label: 'projects' },
    { value: '4.9★', label: 'avg rating' },
    { value: '5', label: 'countries' },
    { value: String(projects.length), label: 'product lines' },
  ]
  return (
    <section className="relative overflow-hidden bg-stage text-stage-ink" data-nav-tone="dark">
      <div aria-hidden className="absolute inset-0 [mask-image:radial-gradient(70%_80%_at_20%_30%,#000,transparent_75%)]">
        <div className="iso-grid [--grid:var(--stage-line)]" />
      </div>

      <div className="shell relative z-[1] pb-[clamp(40px,7vh,88px)] pt-[112px] lg:min-h-[min(100svh,860px)] lg:pt-[clamp(110px,17vh,160px)]">
        <div className="relative max-w-[640px] lg:max-w-[46%]">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Portfolio' }]} className="enter-fade text-stage-ink-2 [&_a:hover]:text-stage-ink [&_[aria-current]]:text-stage-ink" />
          <p className="enter-fade mt-[clamp(16px,3vh,28px)] flex flex-wrap items-center gap-3" style={{ ['--d' as string]: '60ms' }}>
            <span className="inline-flex h-6 items-center rounded-[4px] bg-teal px-2 font-label text-[0.62rem] font-semibold uppercase tracking-[0.08em] text-[#04161a]">
              {pp.tag}
            </span>
            <span className="t-label text-stage-ink-2">{pp.tagNote}</span>
          </p>
          <h1 className="mt-[clamp(14px,2.6vh,24px)] font-display text-[clamp(2.5rem,min(5.2vw,9vh),5.4rem)] font-[760] leading-[0.95] tracking-[-0.045em] [font-stretch:108%]">
            <span className="enter-line">
              <span style={{ ['--d' as string]: '120ms' }}>Work we’re proud to show.</span>
            </span>{' '}
            <span className="enter-line">
              <span style={{ ['--d' as string]: '220ms' }} className="text-teal">
                Results that speak.
              </span>
            </span>
          </h1>
          <p className="enter-fade mt-[clamp(14px,3vh,28px)] max-w-[34rem] text-[1.08rem] leading-relaxed text-stage-ink-2" style={{ ['--d' as string]: '360ms' }}>
            {pp.intro}
          </p>
          <div className="enter-fade mt-[clamp(18px,4vh,36px)] flex flex-wrap items-center gap-3" style={{ ['--d' as string]: '460ms' }}>
            <KeyButton href="#all-work" variant="stage" icon="arrow-down">
              {pp.primary}
            </KeyButton>
            <KeyButton href="/contact-us" variant="stage-ghost" icon={null}>
              {pp.secondary}
            </KeyButton>
          </div>
          <dl
            className="enter-fade mt-[clamp(28px,6vh,64px)] grid grid-cols-2 gap-y-5 border-t border-stage-line pt-5 sm:grid-cols-4"
            style={{ ['--d' as string]: '560ms' }}
          >
            {stats.map((s, i) => (
              <div
                key={s.label}
                className="flex flex-col-reverse border-stage-line [&:nth-child(2n)]:border-l [&:nth-child(2n)]:pl-5 sm:border-l sm:pl-5 sm:first:border-l-0 sm:first:pl-0"
              >
                <dt className="t-label mt-2 text-stage-ink-2">{s.label}</dt>
                <dd className="t-num text-[clamp(1.7rem,2.6vw,2.4rem)]">
                  <Odometer value={s.value} delay={220 + i * 110} />
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
      {/* the wall */}
      <div
        aria-hidden
        className="pf-wall pointer-events-auto relative mt-0 h-[440px] overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,#000_14%,#000_86%,transparent)] lg:absolute lg:inset-y-0 lg:right-0 lg:h-auto lg:w-[58%] lg:[mask-image:linear-gradient(to_right,transparent,#000_22%),linear-gradient(to_bottom,transparent,#000_12%,#000_88%,transparent)] lg:[mask-composite:intersect] lg:[-webkit-mask-composite:source-in]"
      >
        <div className="pf-wall-inner absolute inset-x-[-6%] -top-[20%] grid h-[140%] grid-cols-2 gap-4 sm:grid-cols-3 lg:inset-x-[-4%]">
          {COLUMNS.map((col, c) => (
            <div key={c} className={cn('relative overflow-hidden', c === 2 && 'hidden sm:block')}>
              <div className={cn('pf-col', c % 2 === 1 && 'is-down')} style={{ ['--dur' as string]: PACE[c] }}>
                {[0, 1].map((copy) => (
                  <div key={copy}>
                    {col.map((p) => (
                      <Shot key={`${copy}-${p.slug}`} p={p} />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  )
}
