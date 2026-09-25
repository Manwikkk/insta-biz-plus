import type { Metadata } from 'next'
import { buildMetadata, pageJsonLd } from '@/lib/seo'
import { JsonLd } from '@/components/seo/JsonLd'
import { PageHero } from '@/components/sections/PageHero'
import { KeyButton } from '@/components/ui/KeyButton'
import { SectionHead } from '@/components/ui/SectionHead'
import { ServiceIndexNav } from '@/components/services/ServiceIndexNav'
import { ServiceSpec } from '@/components/services/ServiceSpec'
import { ServiceShowcase } from '@/components/heroes/ServiceShowcase'
import { TechTabs } from '@/components/sections/TechTabs'
import { Steps } from '@/components/sections/Steps'
import { PriceCards } from '@/components/sections/PriceCards'
import { Faq } from '@/components/sections/Faq'
import { ConsultCTA } from '@/components/sections/ConsultCTA'
import { Marquee } from '@/components/ui/Marquee'
import { engagement, fiveSteps, services, servicesFaq, servicesPage, techGroups } from '@/content/services'
import { locationLinks } from '@/content/site'
import Link from 'next/link'
import { Icon } from '@/components/ui/Icon'

export const metadata: Metadata = buildMetadata('/services')

export default function ServicesPage() {
  return (
    <>
      <JsonLd data={pageJsonLd('/services')} />
      <PageHero
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Services' }]}
        tag={servicesPage.tag}
        tagNote={servicesPage.tagNote}
        title={servicesPage.h1}
        intro={servicesPage.intro}
        actions={
          <>
            <KeyButton href="#services-grid" icon="arrow-down">
              Explore Services
            </KeyButton>
            <KeyButton href="#contact-form" variant="ghost" icon={null}>
              Book a Free Call
            </KeyButton>
          </>
        }
        figure={<ServiceShowcase />}
        wide
      />

      <ServiceIndexNav />

      <div className="rails border-b border-line">
        <div className="shell py-16 lg:py-20">
          <SectionHead eyebrow={servicesPage.gridEyebrow} title={servicesPage.gridTitle} intro={servicesPage.gridIntro} align="split" />
        </div>
      </div>

      {services.map((s, i) => (
        <ServiceSpec key={s.id} s={s} flip={i % 2 === 1} />
      ))}

      {/* AI agents + Ahmedabad pages: deeper reads for specific needs */}
      <section className="rails border-b border-line">
        <div className="shell grid gap-4 py-12 lg:grid-cols-2">
          <Link href="/services/ai-agent-development" className="group relative overflow-hidden rounded-[18px] bg-stage p-8 text-stage-ink">
            <span className="absolute inset-0" aria-hidden>
              <span className="iso-grid [--grid:var(--stage-line)]" />
            </span>
            <span className="relative block">
              <span className="t-label text-teal">Agentic AI · Production-grade AI agents, shipped fast</span>
              <span className="t-h3 mt-4 block">AI Agent Development Company in India</span>
              <span className="mt-3 block max-w-md text-stage-ink-2">
                RAG chatbots, voice agents, workflow automation and multi-agent systems. From prototype in 7 days to production in 7 weeks.
              </span>
              <span className="mt-6 inline-flex items-center gap-2 font-medium">
                Explore AI agent development <Icon name="arrow" size={16} className="transition-transform group-hover:translate-x-1" />
              </span>
            </span>
          </Link>
          <div className="rounded-[18px] border border-line bg-raise p-8">
            <p className="t-label text-ink-3">Working in Ahmedabad?</p>
            <ul className="mt-5 grid gap-x-6 gap-y-3 sm:grid-cols-2">
              {locationLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="group flex items-center justify-between gap-3 border-b border-line pb-3 text-[0.98rem] font-medium"
                  >
                    {l.label}
                    <Icon
                      name="arrow"
                      size={15}
                      className="shrink-0 text-ink-3 transition-transform group-hover:translate-x-1 group-hover:text-ink"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="rails section border-b border-line" id="stack">
        <div className="shell">
          <SectionHead eyebrow={servicesPage.stackEyebrow} title={servicesPage.stackTitle} intro={servicesPage.stackIntro} align="split" />
          <div className="mt-14">
            <TechTabs groups={techGroups} />
          </div>
        </div>
        <Marquee speed={46} className="mt-16 border-y border-line py-6">
          {techGroups[0].items.map((t) => (
            <span
              key={t}
              className="mx-6 font-display text-[clamp(1.8rem,3vw,2.6rem)] font-[740] tracking-[-0.03em] text-ink-3 [font-stretch:112%]"
            >
              {t}
              <span className="mx-6 text-teal">/</span>
            </span>
          ))}
        </Marquee>
      </section>

      <section className="rails section border-b border-line" id="process">
        <div className="shell">
          <SectionHead eyebrow={fiveSteps.eyebrow} title={fiveSteps.title} intro={fiveSteps.intro} align="split" />
          <Steps steps={fiveSteps.steps} className="mt-14" />
        </div>
      </section>

      <section className="rails section border-b border-line" id="pricing">
        <div className="shell">
          <SectionHead eyebrow={engagement.eyebrow} title={engagement.title} intro={engagement.intro} align="split" />
          <div className="mt-14">
            <PriceCards cards={engagement.models} cta="Discuss this option" />
          </div>
          <p className="t-small mt-8">
            {engagement.footnote}{' '}
            <Link href="#contact-form" className="link-under text-ink">
              {engagement.footnoteCta}
            </Link>
          </p>
        </div>
      </section>

      <section className="rails section" id="faq">
        <div className="shell grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHead eyebrow={servicesFaq.eyebrow} title={servicesFaq.title} intro={servicesFaq.intro} />
            <div className="mt-10 rounded-[16px] border border-line bg-raise p-6">
              <p className="t-h4">{servicesFaq.aside.title}</p>
              <p className="t-small mt-2 text-ink-2">{servicesFaq.aside.body}</p>
              <KeyButton href="#contact-form" size="sm" className="mt-5">
                Book a free call
              </KeyButton>
            </div>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <Faq items={servicesFaq.answered} asked={servicesFaq.asked} />
          </div>
        </div>
      </section>

      <ConsultCTA />
    </>
  )
}
