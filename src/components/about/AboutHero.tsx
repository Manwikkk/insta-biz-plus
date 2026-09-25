import { Breadcrumbs } from '@/components/sections/PageHero'
import { KeyButton } from '@/components/ui/KeyButton'
import { AboutGlance } from './AboutGlance'
import { about as a } from '@/content/about'

/** About opener: the statement on the left, the studio at a glance on the right. */
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

      <div className="shell relative pb-[clamp(36px,6vh,72px)] pt-[clamp(100px,15.5vh,150px)]">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-12">
          <div className="lg:col-span-6">
            <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'About Us' }]} className="enter-fade" />
            <p className="enter-fade mt-[clamp(14px,2.6vh,24px)] flex flex-wrap items-center gap-3" style={{ ['--d' as string]: '60ms' }}>
              <span className="inline-flex h-6 items-center rounded-full bg-ink px-2.5 font-label text-[0.62rem] font-semibold uppercase tracking-[0.08em] text-bg">
                {a.tag}
              </span>
              <span className="t-label text-ink-2">{a.tagNote}</span>
            </p>
            <h1 className="mt-[clamp(12px,2.4vh,22px)] font-display text-[clamp(2.4rem,min(5vw,9vh),5.2rem)] font-[760] leading-[0.95] tracking-[-0.045em] [font-stretch:108%]">
              <span className="enter-line">
                <span style={{ ['--d' as string]: '120ms' }}>{first}</span>
              </span>{' '}
              <span className="enter-line">
                <span style={{ ['--d' as string]: '210ms' }}>
                  <span className="text-teal-ink">{second}</span>
                </span>
              </span>
            </h1>
            <p className="enter-fade t-lede mt-[clamp(14px,2.8vh,26px)] max-w-[36rem]" style={{ ['--d' as string]: '360ms' }}>
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

          <div className="enter-fade lg:col-span-6" style={{ ['--d' as string]: '300ms' }}>
            <AboutGlance />
          </div>
        </div>
      </div>
    </section>
  )
}
