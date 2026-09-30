import type { Metadata } from 'next'
import Image from 'next/image'
import { buildMetadata, pageJsonLd } from '@/lib/seo'
import { JsonLd } from '@/components/seo/JsonLd'
import { PageHero } from '@/components/sections/PageHero'
import { SectionIndexNav } from '@/components/sections/SectionIndexNav'
import { ConsultCTA } from '@/components/sections/ConsultCTA'
import { KeyButton } from '@/components/ui/KeyButton'
import { SectionHead } from '@/components/ui/SectionHead'
import { Odometer } from '@/components/ui/Odometer'
import { Icon } from '@/components/ui/Icon'
import { SplitReveal } from '@/components/motion/SplitReveal'
import { ProductShowcase } from '@/components/products/ProductShowcase'
import { StackFlow } from '@/components/products/StackFlow'
import { FeatureExplorer } from '@/components/products/FeatureExplorer'
import { ProductFaq } from '@/components/products/ProductFaq'
import { productPage as pp, products, type Product } from '@/content/products'

export const metadata: Metadata = buildMetadata('/products')

const INDEX = [...products.map((p, i) => ({ id: p.id, n: String(i + 1).padStart(2, '0'), label: p.name })), { id: 'faq', n: '05', label: 'FAQs' }]

/**
 * The four products: the stack at a glance, how they hand a lead from one to the next,
 * then each product in depth (its features beside its own screens, and its numbers).
 */
export default function ProductsPage() {
  const [scout, ping, echo, dialer] = products
  return (
    <>
      <JsonLd data={pageJsonLd('/products')} />
      <PageHero
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Products' }]}
        tag={pp.tag}
        tagNote={pp.tagNote}
        title={pp.h1}
        intro={pp.intro}
        actions={
          <>
            <KeyButton href="#stack" icon="arrow-down">
              See how they connect
            </KeyButton>
            <KeyButton href="#contact-form" variant="ghost" icon={null}>
              Book a demo
            </KeyButton>
          </>
        }
        figure={<ProductShowcase />}
        stats={[
          { value: scout.impact[0].value, label: 'leads extracted · Scout' },
          { value: ping.impact[0].value, label: 'messages a day · Ping' },
          { value: echo.impact[0].value, label: 'AI calls handled · Echo' },
          { value: dialer.impact[0].value, label: 'calls a day · Dialer' },
        ]}
      />

      <SectionIndexNav label="Products" items={INDEX} />

      <section className="rails section border-b border-line scroll-mt-24" id="stack">
        <div className="shell">
          <SectionHead eyebrow={pp.flow.eyebrow} title={pp.flow.title} intro={pp.flow.intro} align="split" />
          <div className="mt-[clamp(32px,6vh,64px)]">
            <StackFlow />
          </div>
        </div>
      </section>

      {products.map((p, i) => (
        <ProductSection key={p.id} p={p} i={i} />
      ))}

      <section className="rails section border-b border-line scroll-mt-24" id="faq">
        <div className="shell grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHead eyebrow="FAQs" title="Questions, answered." intro="Everything teams ask before they switch on Scout, Ping, Echo or Dialer." />
            <div className="mt-10 rounded-[16px] border border-line bg-raise p-6">
              <p className="t-h4">See them on your own data</p>
              <p className="t-small mt-2 text-ink-2">Book a free walkthrough and we’ll set a product up around your workflow.</p>
              <KeyButton href="#contact-form" size="sm" className="mt-5">
                Book a demo
              </KeyButton>
            </div>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <ProductFaq />
          </div>
        </div>
      </section>

      <ConsultCTA />
    </>
  )
}

/** One product in depth. */
function ProductSection({ p, i }: { p: Product; i: number }) {
  return (
    <section id={p.id} className="rails section relative scroll-mt-[120px] border-b border-line">
      <div className="shell">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <div className="flex flex-wrap items-center gap-3">
              <span className="product-logo" data-dark={p.id === 'echo' || undefined}>
                <Image src={p.logo} alt={`${p.fullName} logo`} width={160} height={60} className="h-6 w-auto" />
              </span>
              <span className="t-label text-ink-3">
                <span className="text-teal-ink">{String(i + 1).padStart(2, '0')}</span> / 04 · {p.short}
              </span>
            </div>
            <SplitReveal as="h2" className="t-h2 mt-6 max-w-[18ch]">
              {p.headline}
            </SplitReveal>
          </div>
          <div className="lg:col-span-4 lg:col-start-9" data-reveal="rise">
            <p className="t-lede">{p.intro}</p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <KeyButton href={p.href} size="sm" icon="arrow-up-right">
                Open {p.name}
              </KeyButton>
              <KeyButton href="/contact-us#contact-form" variant="ghost" size="sm">
                Get a quote
              </KeyButton>
            </div>
          </div>
        </div>

        <FeatureExplorer product={p} flip={i % 2 === 1} />

        <dl className="mt-[clamp(32px,6vh,64px)] grid grid-cols-2 gap-y-6 border-t border-line pt-6 sm:grid-cols-4">
          {p.impact.map((s, k) => (
            <div
              key={s.label}
              className="flex flex-col-reverse justify-end border-line [&:nth-child(2n)]:border-l [&:nth-child(2n)]:pl-5 sm:border-l sm:pl-5 sm:first:border-l-0 sm:first:pl-0"
            >
              <dt className="mt-2 max-w-[16rem] text-[0.86rem] leading-snug text-ink-2">{s.label}</dt>
              <dd className="t-num text-[clamp(1.9rem,3vw,2.8rem)]">
                <Odometer value={s.value} delay={k * 110} />
              </dd>
            </div>
          ))}
        </dl>
        <p className="t-label mt-8 flex items-center gap-2 text-ink-3">
          <Icon name={p.icon} size={14} className="text-teal-ink" />
          {p.step.verb} · {p.step.line}
        </p>
      </div>
    </section>
  )
}
