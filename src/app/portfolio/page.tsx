import type { Metadata } from 'next'
import { buildMetadata, pageJsonLd } from '@/lib/seo'
import { JsonLd } from '@/components/seo/JsonLd'
import { KeyButton } from '@/components/ui/KeyButton'
import { SectionHead } from '@/components/ui/SectionHead'
import { SplitReveal } from '@/components/motion/SplitReveal'
import { Marquee } from '@/components/ui/Marquee'
import { PortfolioHero } from '@/components/portfolio/PortfolioHero'
import { CaseStudies } from '@/components/portfolio/CaseStudies'
import { WorkGrid } from '@/components/portfolio/WorkGrid'
import { Icon } from '@/components/ui/Icon'
import { portfolioPage as pp, projects } from '@/content/portfolio'
import { site } from '@/content/site'

export const metadata: Metadata = buildMetadata('/portfolio')

/**
 * The work, told in four beats: a wall of live products, the builds we keep talking about,
 * every product line to filter, and the invitation to be next.
 */
export default function PortfolioPage() {
  return (
    <>
      <JsonLd data={pageJsonLd('/portfolio')} />
      <PortfolioHero />

      {/* the builds we keep talking about */}
      <section className="rails section border-b border-line" id="spotlight">
        <div className="shell">
          <SectionHead eyebrow={pp.spotlight.eyebrow} title={pp.spotlight.title} intro={pp.spotlight.intro} align="split" />
          <div className="mt-14">
            <CaseStudies />
          </div>
        </div>
      </section>

      {/* every product line, drifting past */}
      <Marquee speed={42} className="border-b border-line py-7" trackClassName="items-center">
        {projects.map((p) => (
          <span key={p.slug} className="mx-7 inline-flex items-baseline gap-3 whitespace-nowrap">
            <span className="font-display text-[clamp(1.6rem,2.8vw,2.4rem)] font-[720] tracking-[-0.03em] text-ink">{p.name}</span>
            <span className="t-label text-teal-ink">{p.category}</span>
            <span className="ml-4 font-display text-[clamp(1.6rem,2.8vw,2.4rem)] text-teal" aria-hidden>
              /
            </span>
          </span>
        ))}
      </Marquee>

      {/* all work */}
      <section className="rails section border-b border-line scroll-mt-24" id="all-work">
        <div className="shell">
          <SectionHead eyebrow={pp.all.eyebrow} title={pp.all.title} intro={pp.all.intro} align="split" />
          <div className="mt-12">
            <WorkGrid />
          </div>
        </div>
      </section>

      {/* close */}
      <section className="relative overflow-hidden bg-stage py-[clamp(88px,11vw,160px)] text-stage-ink" data-nav-tone="dark">
        <div className="absolute inset-0 [mask-image:radial-gradient(70%_70%_at_50%_40%,#000,transparent)]" aria-hidden>
          <div className="iso-grid [--grid:var(--stage-line)]" />
        </div>
        <div className="shell relative">
          <p className="flex items-center gap-3">
            <span className="live-dot" />
            <span className="t-label text-stage-ink-2">{pp.close.status}</span>
          </p>
          <SplitReveal className="t-display mt-7 max-w-[14ch]">{pp.close.title}</SplitReveal>
          <p className="mt-7 max-w-xl text-[1.12rem] leading-relaxed text-stage-ink-2" data-reveal="rise">
            {pp.close.body}
          </p>
          <div className="mt-10 flex flex-wrap gap-3" data-reveal="rise">
            <KeyButton href="/contact-us" variant="stage">
              {pp.close.primary}
            </KeyButton>
            <KeyButton href="/services" variant="stage-ghost" icon={null}>
              {pp.close.secondary}
            </KeyButton>
          </div>
          <ul className="mt-16 grid gap-px overflow-hidden rounded-[18px] border border-stage-line bg-stage-line sm:grid-cols-3">
            {[
              { t: pp.close.call.title, n: pp.close.call.note, href: '/contact-us#contact-form', icon: 'calendar' as const },
              { t: pp.close.email.title, n: pp.close.email.note, href: `mailto:${site.email}`, icon: 'mail' as const },
              { t: pp.close.whatsapp.title, n: pp.close.whatsapp.note, href: site.whatsapp, icon: 'whatsapp' as const },
            ].map((c) => (
              <li key={c.t} className="bg-stage">
                <a
                  href={c.href}
                  {...(/^https?:/.test(c.href) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="group flex items-center gap-4 p-6 transition-colors hover:bg-stage-2"
                >
                  <span className="grid size-11 place-items-center rounded-[10px] border border-stage-line text-teal">
                    <Icon name={c.icon} size={19} />
                  </span>
                  <span className="flex-1">
                    <span className="block font-semibold">{c.t}</span>
                    <span className="t-label text-stage-ink-2">{c.n}</span>
                  </span>
                  <Icon
                    name="arrow"
                    size={16}
                    className="text-stage-ink-2 transition-transform group-hover:translate-x-1 group-hover:text-stage-ink"
                  />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
