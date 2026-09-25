import type { Metadata } from 'next'
import Image from 'next/image'
import { buildMetadata, pageJsonLd } from '@/lib/seo'
import { JsonLd } from '@/components/seo/JsonLd'
import { PageHero } from '@/components/sections/PageHero'
import { KeyButton } from '@/components/ui/KeyButton'
import { SectionHead } from '@/components/ui/SectionHead'
import { SplitReveal } from '@/components/motion/SplitReveal'
import { FeaturedStack } from '@/components/portfolio/FeaturedStack'
import { WorkGrid } from '@/components/portfolio/WorkGrid'
import { Icon } from '@/components/ui/Icon'
import { featured, portfolioPage as pp, projects } from '@/content/portfolio'
import { media, site } from '@/content/site'

export const metadata: Metadata = buildMetadata('/portfolio')

export default function PortfolioPage() {
  const lead = projects.find((p) => p.name === featured[0].name)!
  const rest = featured.slice(1).map((f) => ({ ...f, p: projects.find((p) => p.name === f.name)! }))
  return (
    <>
      <JsonLd data={pageJsonLd('/portfolio')} />
      <PageHero
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Portfolio' }]}
        tag={pp.tag}
        tagNote={pp.tagNote}
        title={pp.h1}
        intro={pp.intro}
        actions={
          <>
            <KeyButton href="#all-work" icon="arrow-down">
              {pp.primary}
            </KeyButton>
            <KeyButton href="/contact-us" variant="ghost" icon={null}>
              {pp.secondary}
            </KeyButton>
          </>
        }
        figure={<FeaturedStack />}
        stats={[
          { value: '100+', label: 'projects' },
          { value: '4.9★', label: 'avg rating' },
          { value: '5', label: 'countries' },
          { value: '16', label: 'product lines' },
        ]}
      />

      {/* spotlight */}
      <section className="rails section border-b border-line">
        <div className="shell">
          <SectionHead eyebrow={pp.spotlight.eyebrow} title={pp.spotlight.title} intro={pp.spotlight.intro} align="split" />
          <div className="mt-14 grid gap-6 lg:grid-cols-12">
            <a
              href={lead.href ?? '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden rounded-[20px] border border-line bg-stage lg:col-span-7"
              data-reveal="rise"
            >
              <div className="relative aspect-[16/11]">
                <Image
                  src={media(lead.image)}
                  alt={`${lead.name}`}
                  fill
                  sizes="(min-width: 1024px) 760px, 92vw"
                  quality={75}
                  className="object-cover object-top opacity-90 transition-transform duration-[1.4s] ease-[var(--ease-out)] group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stage via-stage/30 to-transparent" />
              </div>
              <div className="absolute inset-x-0 bottom-0 p-7 text-stage-ink sm:p-9">
                <p className="flex items-center gap-3">
                  <span className="inline-flex h-6 items-center rounded-[4px] bg-teal px-2 font-label text-[0.6rem] font-semibold uppercase tracking-[0.08em] text-[#04161a]">
                    Featured
                  </span>
                  <span className="t-label text-stage-ink-2">{lead.category}</span>
                </p>
                <h3 className="mt-4 font-display text-[clamp(2rem,3.6vw,3.2rem)] font-[760] leading-none tracking-[-0.04em] [font-stretch:108%]">
                  {lead.name}
                </h3>
                <p className="mt-3 max-w-md text-[1.05rem] text-stage-ink-2">{lead.tagline}</p>
                <span className="mt-6 inline-flex items-center gap-2 font-medium">
                  Visit {lead.name}{' '}
                  <Icon
                    name="arrow-up-right"
                    size={16}
                    className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </span>
              </div>
            </a>
            <ul className="grid gap-4 lg:col-span-5">
              {rest.map(({ p, note, category }, i) => (
                <li key={p.slug} data-reveal="rise" style={{ ['--d' as string]: `${(i + 1) * 90}ms` }}>
                  <a
                    href={p.href ?? '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group grid grid-cols-[120px_1fr] items-center gap-5 rounded-[16px] border border-line bg-raise p-3 pr-5 transition-colors hover:border-ink sm:grid-cols-[150px_1fr]"
                  >
                    <span className="relative aspect-[4/3] overflow-hidden rounded-[10px] bg-sink">
                      <Image
                        src={media(p.image)}
                        alt={p.name}
                        fill
                        sizes="150px"
                        quality={60}
                        className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                      />
                    </span>
                    <span>
                      <span className="t-label block text-ink-3">{category}</span>
                      <span className="t-h4 mt-1 block">{p.name}</span>
                      <span className="t-label mt-2 block text-teal-ink">{note}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* all work */}
      <section className="rails section border-b border-line" id="all-work">
        <div className="shell">
          <SectionHead eyebrow={pp.all.eyebrow} title={pp.all.title} intro={pp.all.intro} align="split" />
          <div className="mt-14">
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
