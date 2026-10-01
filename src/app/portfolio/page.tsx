import type { Metadata } from 'next'
import Link from 'next/link'
import { buildMetadata, pageJsonLd } from '@/lib/seo'
import { JsonLd } from '@/components/seo/JsonLd'
import { KeyButton } from '@/components/ui/KeyButton'
import { Eyebrow } from '@/components/ui/SectionHead'
import { SplitReveal } from '@/components/motion/SplitReveal'
import { Icon } from '@/components/ui/Icon'
import { PortfolioHero } from '@/components/portfolio/PortfolioHero'
import { ProductDeck } from '@/components/portfolio/ProductDeck'
import { CategoryBand } from '@/components/portfolio/CategoryBand'
import { WorkIndex } from '@/components/portfolio/WorkIndex'
import { Receipts } from '@/components/portfolio/Receipts'
import { portfolioPage as pp } from '@/content/portfolio'
import { numbers } from '@/content/home'
import { site } from '@/content/site'

export const metadata: Metadata = buildMetadata('/portfolio')

/**
 * The work, told in five beats: the wall of it turning past, the four products we build and
 * run (one screen each), every client project to filter, the receipts, and an empty plate
 * for whoever is next.
 */
export default function PortfolioPage() {
  const [first, second] = pp.close.title.split(/(?<=,) /)
  return (
    <>
      <JsonLd data={pageJsonLd('/portfolio')} />
      <PortfolioHero />

      <ProductDeck />

      {/* all the client work */}
      <section className="rails relative scroll-mt-24 border-b border-line pb-[clamp(72px,12vh,150px)]" id="all-work">
        <CategoryBand />
        <div className="shell">
          <div className="grid gap-6 border-t border-line pt-[clamp(28px,5vh,56px)] lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <Eyebrow>{pp.all.eyebrow}</Eyebrow>
              <SplitReveal className="t-h2 mt-[clamp(10px,2vh,18px)]">{pp.all.title}</SplitReveal>
            </div>
            <p className="t-lede lg:col-span-4 lg:col-start-9" data-reveal="rise">
              {pp.all.intro}
            </p>
          </div>
          <div className="mt-[clamp(32px,6vh,64px)]">
            <WorkIndex />
          </div>
        </div>
      </section>

      {/* the receipts, on the page's own light ground */}
      <section className="rails relative overflow-hidden">
        <div aria-hidden className="absolute inset-0 [mask-image:radial-gradient(70%_60%_at_80%_0%,#000,transparent_75%)]">
          <div className="iso-grid" />
        </div>
        <div className="shell relative pb-[clamp(56px,9vh,110px)] pt-[clamp(80px,13vh,150px)]">
          <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <Eyebrow>{numbers.eyebrow}</Eyebrow>
              <SplitReveal className="t-display mt-[clamp(12px,2.4vh,22px)] max-w-[14ch]">{numbers.title}</SplitReveal>
            </div>
            <p className="t-lede max-w-md lg:col-span-4 lg:col-start-9" data-reveal="rise">
              {numbers.intro}
            </p>
          </div>
          <div className="mt-[clamp(36px,7vh,80px)]">
            <Receipts />
          </div>
        </div>
      </section>

      {/* next on this page */}
      <section className="relative overflow-hidden border-t border-stage-line bg-stage text-stage-ink" data-nav-tone="dark">
        <div className="shell relative py-[clamp(72px,12vh,150px)]">
          <p className="flex items-center gap-3" data-reveal="rise">
            <span className="live-dot" />
            <span className="t-label text-stage-ink-2">{pp.close.status}</span>
          </p>
          <h2 className="pf-split mt-[clamp(16px,3.4vh,32px)]" data-reveal="lines">
            <span className="mask-line">
              <span>{first}</span>
            </span>
            <span className="mask-line text-teal sm:ml-auto">
              <span style={{ ['--d' as string]: '140ms' }}>{second}</span>
            </span>
          </h2>
          <div aria-hidden className="pf-rule is-stage mt-[clamp(16px,3vh,30px)]" data-reveal style={{ ['--d' as string]: '200ms' }} />

          <div className="mt-[clamp(32px,6vh,64px)] grid gap-10 lg:grid-cols-12 lg:items-stretch">
            <Link href="/contact-us#contact-form" className="pf-slot group lg:col-span-5" data-reveal="rise">
              <svg aria-hidden className="pf-slot-line">
                <rect x="0" y="0" width="100%" height="100%" rx="22" />
              </svg>
              <span className="flex items-center justify-between">
                <span className="t-label text-stage-ink-2">( Next )</span>
                <span className="t-label text-stage-ink-2">Reserved</span>
              </span>
              <span className="pf-slot-plus" aria-hidden>
                <Icon name="plus" size={30} strokeWidth={1.4} />
              </span>
              <span>
                <span className="block font-display text-[clamp(1.6rem,2.6vw,2.3rem)] font-[720] leading-[1.02] tracking-[-0.03em]">Your product, here.</span>
                <span className="mt-2 inline-flex items-center gap-2 text-[0.95rem] text-stage-ink-2 transition-colors group-hover:text-stage-ink">
                  <span className="link-draw">{pp.close.primary}</span>
                  <Icon name="arrow" size={15} className="transition-transform duration-500 group-hover:translate-x-1" />
                </span>
              </span>
            </Link>

            <div className="flex flex-col justify-between gap-10 lg:col-span-6 lg:col-start-7">
              <div data-reveal="rise" style={{ ['--d' as string]: '120ms' }}>
                <p className="max-w-xl text-[clamp(1.05rem,1.4vw,1.2rem)] leading-relaxed text-stage-ink-2">{pp.close.body}</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <KeyButton href="/contact-us" variant="stage">
                    {pp.close.primary}
                  </KeyButton>
                  <KeyButton href="/services" variant="stage-ghost" icon={null}>
                    {pp.close.secondary}
                  </KeyButton>
                </div>
              </div>
              <ul className="border-t border-stage-line" data-reveal="rise" style={{ ['--d' as string]: '200ms' }}>
                {[
                  { t: pp.close.call.title, n: pp.close.call.note, href: '/contact-us#contact-form', icon: 'calendar' as const },
                  { t: pp.close.email.title, n: pp.close.email.note, href: `mailto:${site.email}`, icon: 'mail' as const },
                  { t: pp.close.whatsapp.title, n: pp.close.whatsapp.note, href: site.whatsapp, icon: 'whatsapp' as const },
                ].map((c) => (
                  <li key={c.t} className="border-b border-stage-line">
                    <a
                      href={c.href}
                      {...(/^https?:/.test(c.href) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      className="group flex items-center gap-4 py-4"
                    >
                      <span className="grid size-10 place-items-center rounded-[10px] border border-stage-line text-teal transition-colors duration-300 group-hover:border-teal">
                        <Icon name={c.icon} size={18} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-semibold">{c.t}</span>
                        <span className="t-label text-stage-ink-2">{c.n}</span>
                      </span>
                      <Icon name="arrow" size={16} className="text-stage-ink-2 transition-transform duration-500 group-hover:translate-x-1 group-hover:text-stage-ink" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
