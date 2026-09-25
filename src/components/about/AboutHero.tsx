import { Breadcrumbs } from '@/components/sections/PageHero'
import { KeyButton } from '@/components/ui/KeyButton'
import { Odometer } from '@/components/ui/Odometer'
import { WorldClock } from './WorldClock'
import { about as a } from '@/content/about'

/**
 * About opener: the statement on the left, the team's working day across four
 * countries on the right (live), and the numbers underneath.
 */
export function AboutHero() {
  // "A team of makers, builders & doers." set on two lines at the comma
  const [first, second] = a.h1.split(/(?<=,) /)
  return (
    <section className="rails relative overflow-hidden border-b border-line">
      <div aria-hidden className="absolute inset-0 [mask-image:radial-gradient(75%_75%_at_80%_30%,#000,transparent_72%)]">
        <div className="iso-grid" />
      </div>
      <div
        aria-hidden
        className="absolute -right-[10%] top-[8%] hidden aspect-square w-[46vw] max-w-[720px] rounded-full bg-[radial-gradient(closest-side,var(--teal-soft),transparent)] lg:block"
      />

      <div className="shell relative pb-[clamp(24px,4.6vh,56px)] pt-[clamp(96px,15.5vh,150px)]">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-12">
          <div className="lg:col-span-7">
            <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'About Us' }]} className="enter-fade" />
            <p className="enter-fade mt-[clamp(14px,2.6vh,24px)] flex flex-wrap items-center gap-3" style={{ ['--d' as string]: '60ms' }}>
              <span className="inline-flex h-6 items-center rounded-full bg-ink px-2.5 font-label text-[0.62rem] font-semibold uppercase tracking-[0.08em] text-bg">
                {a.tag}
              </span>
              <span className="t-label text-ink-2">{a.tagNote}</span>
            </p>
            <h1 className="mt-[clamp(12px,2.4vh,22px)] font-display text-[clamp(2.4rem,min(5.4vw,9.2vh),5.6rem)] font-[760] leading-[0.95] tracking-[-0.045em] [font-stretch:108%]">
              <span className="enter-line">
                <span style={{ ['--d' as string]: '120ms' }}>{first}</span>
              </span>{' '}
              <span className="enter-line">
                <span style={{ ['--d' as string]: '210ms' }}>
                  <span className="text-teal-ink">{second}</span>
                </span>
              </span>
            </h1>
            <p className="enter-fade t-lede mt-[clamp(14px,2.8vh,26px)] max-w-[38rem]" style={{ ['--d' as string]: '360ms' }}>
              {a.intro}
            </p>
            <div
              className="enter-fade mt-[clamp(18px,3.6vh,34px)] flex flex-wrap items-center gap-3"
              style={{ ['--d' as string]: '460ms' }}
            >
              <KeyButton href="/contact-us">{a.primary}</KeyButton>
              <KeyButton href="/portfolio" variant="ghost" icon={null}>
                {a.secondary}
              </KeyButton>
            </div>
          </div>

          <div className="enter-fade lg:col-span-5" style={{ ['--d' as string]: '300ms' }}>
            <WorldClock />
          </div>
        </div>

        {/* the numbers, and the three facts that frame them */}
        <div
          className="enter-fade mt-[clamp(24px,4.6vh,48px)] grid gap-6 border-t border-line pt-[clamp(14px,2.6vh,24px)] lg:grid-cols-12 lg:items-center"
          style={{ ['--d' as string]: '560ms' }}
        >
          <dl className="grid grid-cols-2 gap-y-5 sm:grid-cols-4 lg:col-span-9">
            {a.stats.map((s, i) => (
              <div
                key={s.label}
                className="flex flex-col-reverse justify-end border-line [&:nth-child(2n)]:border-l [&:nth-child(2n)]:pl-5 sm:border-l sm:pl-5 sm:first:border-l-0 sm:first:pl-0"
              >
                <dt className="t-label mt-2 text-ink-3">{s.label}</dt>
                <dd className="t-num text-[clamp(1.8rem,min(3vw,5.2vh),2.8rem)]">
                  <Odometer value={s.value} delay={240 + i * 110} />
                </dd>
              </div>
            ))}
          </dl>
          <ul className="flex flex-wrap gap-2 lg:col-span-3 lg:justify-end">
            {a.chips.map((c) => (
              <li
                key={c}
                className="inline-flex h-8 items-center gap-2 rounded-full border border-line-2 bg-raise/60 px-3 text-[0.82rem] font-medium text-ink-2"
              >
                <span className="size-1.5 rounded-full bg-teal" aria-hidden />
                {c}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
