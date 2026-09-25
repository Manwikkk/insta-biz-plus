import type { Metadata } from 'next'
import Link from 'next/link'
import { buildMetadata, pageJsonLd } from '@/lib/seo'
import { JsonLd } from '@/components/seo/JsonLd'
import { PageHero } from '@/components/sections/PageHero'
import { KeyButton } from '@/components/ui/KeyButton'
import { SectionHead } from '@/components/ui/SectionHead'
import { IntegrationHub } from '@/components/solutions/IntegrationHub'
import { ConsultCTA } from '@/components/sections/ConsultCTA'
import { Icon } from '@/components/ui/Icon'
import { solutions, solutionsIndex } from '@/content/data'

export const metadata: Metadata = buildMetadata('/solutions')

export default function SolutionsPage() {
  let n = 0
  return (
    <>
      <JsonLd data={pageJsonLd('/solutions')} />
      <PageHero
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Solutions' }]}
        tag="Solutions"
        tagNote={solutionsIndex.eyebrow}
        title={solutionsIndex.h1}
        intro={solutionsIndex.intro}
        actions={<KeyButton href="#contact-form">{solutionsIndex.cta}</KeyButton>}
        figure={<IntegrationHub />}
      />

      {solutionsIndex.groups.map((g, gi) => (
        <section key={g.title} className="rails section border-b border-line" id={gi === 0 ? 'crm' : 'erp'}>
          <div className="shell">
            <SectionHead
              eyebrow={gi === 0 ? '8 industry CRMs' : '4 operations systems'}
              index={gi === 0 ? '01' : '02'}
              title={g.title}
              intro={g.intro}
              align="split"
            />
            <ul className="mt-14 border-t border-line">
              {g.items.map((it) => {
                const s = solutions.find((x) => x.label === it.label)
                if (!s) return null
                n++
                return (
                  <li key={s.slug} className="border-b border-line" data-reveal="rise">
                    <Link
                      href={`/solutions/${s.slug}`}
                      className="group relative grid items-center gap-x-8 gap-y-3 py-7 transition-colors md:grid-cols-[56px_minmax(0,1fr)_minmax(0,1.25fr)_44px] lg:grid-cols-[72px_minmax(0,1fr)_minmax(0,1.25fr)_44px]"
                    >
                      <span className="t-label text-teal-ink">{String(n).padStart(2, '0')}</span>
                      <span className="font-display text-[clamp(1.5rem,2.4vw,2.2rem)] font-[720] leading-[1.05] tracking-[-0.03em] transition-transform duration-500 ease-[var(--ease-out)] [font-stretch:104%] group-hover:translate-x-2">
                        {s.label}
                      </span>
                      <span>
                        <span className="t-body block">{it.summary}</span>
                        <span className="mt-3 hidden flex-wrap gap-1.5 md:flex">
                          {s.overview.integrations.slice(0, 3).map((i) => (
                            <span key={i} className="tag">
                              {i}
                            </span>
                          ))}
                        </span>
                      </span>
                      <span className="hidden size-11 place-items-center rounded-[10px] border border-line-2 transition-[background-color,border-color,color] duration-300 group-hover:border-ink group-hover:bg-ink group-hover:text-bg md:grid">
                        <Icon name="arrow" size={18} />
                      </span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        </section>
      ))}

      <ConsultCTA />
    </>
  )
}
