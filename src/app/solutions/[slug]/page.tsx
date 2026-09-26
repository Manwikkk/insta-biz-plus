import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { buildMetadata, pageJsonLd } from '@/lib/seo'
import { JsonLd } from '@/components/seo/JsonLd'
import { PageHero } from '@/components/sections/PageHero'
import { KeyButton } from '@/components/ui/KeyButton'
import { SectionHead, Eyebrow } from '@/components/ui/SectionHead'
import { SplitReveal } from '@/components/motion/SplitReveal'
import { SolutionVisual } from '@/components/heroes/SolutionVisual'
import { ModuleBoard } from '@/components/solutions/ModuleBoard'
import { Steps } from '@/components/sections/Steps'
import { Faq } from '@/components/sections/Faq'
import { ConsultCTA } from '@/components/sections/ConsultCTA'
import { Icon } from '@/components/ui/Icon'
import { solutionBySlug, solutions } from '@/content/data'

export const dynamicParams = false

export function generateStaticParams() {
  return solutions.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  return buildMetadata(`/solutions/${slug}`, { fileOgImage: true })
}

export default async function SolutionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const s = solutionBySlug(slug)
  if (!s) notFound()
  const related = s.related.map((r) => solutionBySlug(r)).filter(Boolean) as NonNullable<ReturnType<typeof solutionBySlug>>[]

  return (
    <>
      <JsonLd data={pageJsonLd(`/solutions/${slug}`)} />
      <PageHero
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Solutions', href: '/solutions' }, { label: s.crumb }]}
        tag={s.eyebrow}
        tagNote={s.group}
        title={s.h1}
        intro={s.intro}
        chips={s.heroBullets}
        actions={
          <>
            <KeyButton href="#contact-form">Get a Free Demo</KeyButton>
            <KeyButton href={s.whatsapp} variant="ghost" icon="whatsapp">
              Chat on WhatsApp
            </KeyButton>
          </>
        }
        figure={<SolutionVisual s={s} />}
        wide
        size="h2"
      />

      {/* the problem — on the dark stage, like the homepage's problem chapter */}
      <section className="relative overflow-hidden bg-stage py-[clamp(88px,10vw,150px)] text-stage-ink" data-nav-tone="dark">
        <div className="absolute inset-0 [mask-image:radial-gradient(70%_70%_at_50%_30%,#000,transparent)]" aria-hidden>
          <div className="iso-grid [--grid:var(--stage-line)]" />
        </div>
        <div className="shell relative">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <Eyebrow className="text-stage-ink-2">{s.challenges.eyebrow}</Eyebrow>
              <SplitReveal className="t-h2 mt-6">{s.challenges.title}</SplitReveal>
            </div>
            <p className="text-[1.1rem] leading-relaxed text-stage-ink-2 lg:col-span-4 lg:col-start-9" data-reveal="rise">
              {s.challenges.intro}
            </p>
          </div>
          <ul className="mt-14 grid gap-px overflow-hidden rounded-[18px] border border-stage-line bg-stage-line md:grid-cols-2 lg:grid-cols-4">
            {s.challenges.items.map((c, i) => (
              <li key={c.title} className="bg-stage p-7" data-reveal="rise" style={{ ['--d' as string]: `${i * 80}ms` }}>
                <span className="mb-6 flex items-center gap-2">
                  <span className="size-2.5 bg-ember [clip-path:polygon(50%_0,100%_25%,100%_75%,50%_100%,0_75%,0_25%)]" />
                  <span className="t-label text-stage-ink-2">{String(i + 1).padStart(2, '0')}</span>
                </span>
                <h3 className="t-h4">{c.title}</h3>
                <p className="mt-3 text-[0.96rem] leading-relaxed text-stage-ink-2">{c.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* overview */}
      <section className="rails section border-b border-line">
        <div className="shell grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Eyebrow>{s.overview.eyebrow}</Eyebrow>
            <SplitReveal className="t-h2 mt-6">{s.overview.title}</SplitReveal>
            <div className="mt-8 grid gap-5" data-reveal="rise">
              {s.overview.paragraphs.map((p, i) => (
                <p key={i} className={i === 0 ? 't-lede' : 't-body'}>
                  {p}
                </p>
              ))}
            </div>
          </div>
          <aside className="lg:col-span-4 lg:col-start-9">
            <div className="lg:sticky lg:top-28">
              <div className="rounded-[16px] border border-line bg-raise p-6" data-reveal="rise">
                <p className="t-label text-ink-3">Who it’s for</p>
                <ul className="mt-4 grid gap-2.5">
                  {s.overview.whoFor.map((w) => (
                    <li key={w} className="flex items-center gap-3 text-[0.96rem]">
                      <span className="size-[7px] shrink-0 bg-teal [clip-path:polygon(50%_0,100%_25%,100%_75%,50%_100%,0_75%,0_25%)]" />
                      {w}
                    </li>
                  ))}
                </ul>
                <p className="t-label mt-7 text-ink-3">Integrations</p>
                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {s.overview.integrations.map((w) => (
                    <li key={w} className="tag">
                      {w}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* features */}
      <section className="rails section border-b border-line">
        <div className="shell">
          <SectionHead eyebrow={s.features.eyebrow} title={s.features.title} intro={s.features.intro} align="split" />
          <ul className="cells mt-14 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {s.features.items.map((f, i) => (
              <li
                key={f.n}
                className="group relative p-7 transition-colors duration-500 hover:bg-raise"
                data-reveal="rise"
                style={{ ['--d' as string]: `${(i % 4) * 70}ms` }}
              >
                <p className="t-numeral text-[2.2rem] text-line-2 transition-colors duration-500 group-hover:text-teal-ink">
                  {f.n}
                </p>
                <h3 className="t-h4 mt-8">{f.title}</h3>
                <p className="t-small mt-2 text-ink-2">{f.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* modules */}
      <section className="rails section border-b border-line" id="modules">
        <div className="shell grid gap-12 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">
            <SectionHead eyebrow={s.modules.eyebrow} title={s.modules.title} intro={s.modules.intro} />
          </div>
          <div className="lg:col-span-7" data-reveal="rise">
            <ModuleBoard modules={s.modules.items} product={s.productName} />
          </div>
        </div>
      </section>

      {/* benefits */}
      <section className="rails section border-b border-line">
        <div className="shell">
          <SectionHead eyebrow={s.benefits.eyebrow} title={s.benefits.title} />
          <ul className="mt-12 border-t border-line">
            {s.benefits.items.map((b, i) => (
              <li
                key={b.title}
                className="group grid gap-3 border-b border-line py-7 transition-colors md:grid-cols-[64px_1fr_1.3fr] md:items-baseline md:gap-8"
                data-reveal="rise"
                style={{ ['--d' as string]: `${i * 70}ms` }}
              >
                <span className="t-label text-teal-ink">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="t-h3 transition-transform duration-500 ease-[var(--ease-out)] group-hover:translate-x-2">{b.title}</h3>
                <p className="t-body">{b.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* why + process */}
      <section className="rails section border-b border-line">
        <div className="shell">
          <SectionHead eyebrow={s.why.eyebrow} title={s.why.title} intro={s.why.intro} align="split" />
          <ul className="cells mt-14 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {s.why.items.map((w, i) => (
              <li key={w.title} className="p-7" data-reveal="rise" style={{ ['--d' as string]: `${i * 70}ms` }}>
                <Icon name="check" size={20} className="text-teal-ink" strokeWidth={2} />
                <h3 className="t-h4 mt-6">{w.title}</h3>
                <p className="t-small mt-2 text-ink-2">{w.body}</p>
              </li>
            ))}
          </ul>
          <h3 className="t-h3 mt-20">How we build your software</h3>
          <Steps
            steps={s.why.process.map((p) => ({ n: String(p.step).padStart(2, '0'), title: p.title, body: p.body }))}
            className="mt-8"
          />
        </div>
      </section>

      {/* FAQ */}
      <section className="rails section border-b border-line" id="faq">
        <div className="shell grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHead eyebrow={s.faq.eyebrow} title={s.faq.title} />
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <Faq items={s.faq.items} />
          </div>
        </div>
      </section>

      {/* related */}
      {related.length ? (
        <section className="rails section-tight">
          <div className="shell">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <Eyebrow>Explore more</Eyebrow>
                <h2 className="t-h3 mt-4">Related solutions</h2>
              </div>
              <Link href="/solutions" className="link-draw font-medium">
                View all solutions
              </Link>
            </div>
            <ul className="mt-10 grid gap-4 md:grid-cols-3">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link
                    href={`/solutions/${r.slug}`}
                    className="group flex h-full flex-col rounded-[16px] border border-line bg-raise p-6 transition-[border-color,transform] duration-500 hover:-translate-y-1 hover:border-ink"
                  >
                    <span className="t-label text-ink-3">{r.group}</span>
                    <span className="t-h4 mt-4">{r.label}</span>
                    <span className="t-small mt-2 flex-1 text-ink-2">{r.summary}</span>
                    <span className="mt-6 inline-flex items-center gap-2 text-[0.92rem] font-medium">
                      View solution <Icon name="arrow" size={15} className="transition-transform group-hover:translate-x-1" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <ConsultCTA />
    </>
  )
}
