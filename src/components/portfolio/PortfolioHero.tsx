import { Breadcrumbs } from '@/components/sections/PageHero'
import { KeyButton } from '@/components/ui/KeyButton'
import { Odometer } from '@/components/ui/Odometer'
import { WorkArc } from './WorkArc'
import { HeroMark } from './HeroMark'
import { portfolioPage as pp } from '@/content/portfolio'

/**
 * Portfolio opener. The promise is set across the full width, one line flush left and the
 * next flush right with a drawn rule beneath, and under it the work itself turns past on a
 * curved wall. The counts that matter sit in the corners.
 */
export function PortfolioHero() {
  const stats = [
    { value: '100+', label: 'Projects shipped' },
    { value: '4.9★', label: 'Average rating' },
    { value: '5', label: 'Countries' },
  ]
  return (
    <section className="relative overflow-hidden border-b border-line">
      <div aria-hidden className="absolute inset-0 [mask-image:radial-gradient(90%_70%_at_50%_0%,#000,transparent_72%)]">
        <div className="iso-grid" />
      </div>
      <HeroMark />

      <div className="shell relative z-[2] pt-[clamp(100px,14vh,140px)]">
        <div className="enter-fade flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Portfolio' }]} />
          <p className="t-label text-ink-3">
            {pp.figures.map((f, i) => (
              <span key={f.label}>
                {i ? ' · ' : null}
                <span className="text-teal-ink">{f.value}</span> {f.label}
              </span>
            ))}
          </p>
        </div>

        <h1 className="pf-title mt-[clamp(18px,4.5vh,44px)]">
          <span className="enter-line">
            <span style={{ ['--d' as string]: '80ms' }}>Work we’re</span>
          </span>{' '}
          <span className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
            <span className="enter-line sm:order-last sm:ml-auto">
              <span style={{ ['--d' as string]: '190ms' }}>proud to show.</span>
            </span>{' '}
            {/* the parentheses are drawn by CSS, so the heading reads as one sentence */}
            <span className="pf-paren enter-fade" style={{ ['--d' as string]: '520ms' }}>
              <span className="text-teal-ink">Results that speak.</span>
            </span>
          </span>
        </h1>
        <div aria-hidden className="pf-rule mt-[clamp(14px,3vh,30px)]" data-reveal style={{ ['--d' as string]: '300ms' }} />
      </div>

      <div className="enter-fade relative z-[1] mt-[clamp(8px,2vh,24px)]" style={{ ['--d' as string]: '360ms' }}>
        <WorkArc />
      </div>

      <div className="shell relative z-[2] grid gap-8 pb-[clamp(28px,5vh,60px)] pt-[clamp(10px,2.4vh,28px)] lg:grid-cols-12 lg:items-end">
        <div className="enter-fade lg:col-span-6" style={{ ['--d' as string]: '460ms' }}>
          <p className="t-lede max-w-[36rem]">{pp.intro}</p>
          <div className="mt-[clamp(16px,3vh,28px)] flex flex-wrap items-center gap-3">
            <KeyButton href="#all-work" icon="arrow-down">
              {pp.primary}
            </KeyButton>
            <KeyButton href="/contact-us" variant="ghost" icon={null}>
              {pp.secondary}
            </KeyButton>
          </div>
        </div>
        <dl className="enter-fade grid grid-cols-3 border-t border-line lg:col-span-5 lg:col-start-8" style={{ ['--d' as string]: '560ms' }}>
          {stats.map((s, i) => (
            <div key={s.label} className="flex flex-col-reverse border-line pt-4 [&:not(:first-child)]:border-l [&:not(:first-child)]:pl-4">
              <dt className="t-label mt-2 text-ink-3">{s.label}</dt>
              <dd className="t-num text-[clamp(1.7rem,2.8vw,2.6rem)]">
                <Odometer value={s.value} delay={300 + i * 110} />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
