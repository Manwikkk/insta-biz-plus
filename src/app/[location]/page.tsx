import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { buildMetadata, pageJsonLd } from '@/lib/seo'
import { JsonLd } from '@/components/seo/JsonLd'
import { PageHero } from '@/components/sections/PageHero'
import { KeyButton, ArrowLink } from '@/components/ui/KeyButton'
import { SectionHead, Eyebrow } from '@/components/ui/SectionHead'
import { SplitReveal } from '@/components/motion/SplitReveal'
import { LocationVisual } from '@/components/heroes/LocationVisual'
import { Steps } from '@/components/sections/Steps'
import { Faq } from '@/components/sections/Faq'
import { ConsultCTA } from '@/components/sections/ConsultCTA'
import { Markdownish } from '@/components/ui/Markdownish'
import { Icon } from '@/components/ui/Icon'
import { ScrollRow } from '@/components/ui/ScrollCue'
import { locationBySlug, locations } from '@/content/data'
import { site } from '@/content/site'
import { cn } from '@/lib/cn'

export const dynamicParams = false

export function generateStaticParams() {
  return locations.map((l) => ({ location: l.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ location: string }> }): Promise<Metadata> {
  const { location } = await params
  return buildMetadata(`/${location}`)
}

export default async function LocationPage({ params }: { params: Promise<{ location: string }> }) {
  const { location } = await params
  const l = locationBySlug(location)
  if (!l) notFound()
  const [tag, ...noteParts] = l.eyebrow.split(/(?<=Gujarat)\s/)
  const table = l.comparison.table

  return (
    <>
      <JsonLd data={pageJsonLd(`/${location}`)} />
      <PageHero
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Services', href: '/services' }, { label: l.h1 }]}
        tag={tag}
        tagNote={noteParts.join(' ')}
        title={l.h1}
        intro={<Markdownish text={l.intro} />}
        actions={
          <>
            <KeyButton href="#contact-form">{l.primaryCta}</KeyButton>
            <KeyButton href={site.whatsapp} variant="ghost" icon="whatsapp">
              WhatsApp Us
            </KeyButton>
          </>
        }
        figure={<LocationVisual slug={l.slug} />}
        wide
        stats={l.stats}
      />

      {/* story */}
      <section className="rails section border-b border-line">
        <div className="shell grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            {l.story.eyebrow ? <Eyebrow>{l.story.eyebrow}</Eyebrow> : null}
            <SplitReveal className="t-h2 mt-6">{l.story.title}</SplitReveal>
          </div>
          <div className="grid gap-5 lg:col-span-6 lg:col-start-7" data-reveal="rise">
            {l.story.paragraphs.map((p, i) => (
              <p key={i} className={i === 0 ? 't-lede' : 't-body'}>
                <Markdownish text={p} />
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* reasons */}
      <section className="rails section border-b border-line">
        <div className="shell">
          <SectionHead eyebrow={l.reasons.eyebrow} title={l.reasons.title} align="split" />
          <ul className="cells mt-14 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {l.reasons.items.map((r, i) => (
              <li
                key={r.title}
                className="group p-7 transition-colors duration-500 hover:bg-raise"
                data-reveal="rise"
                style={{ ['--d' as string]: `${(i % 3) * 70}ms` }}
              >
                <p className="t-numeral text-[2.2rem] text-line-2 transition-colors duration-500 group-hover:text-teal-ink">
                  {String(i + 1).padStart(2, '0')}
                </p>
                <h3 className="t-h4 mt-7">{r.title}</h3>
                <p className="t-small mt-2 text-ink-2">{r.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* reviews */}
      <section className="rails section border-b border-line">
        <div className="shell">
          <SectionHead eyebrow={l.reviews.eyebrow} title={l.reviews.title} />
          <ul className="mt-14 grid gap-4 lg:grid-cols-3">
            {l.reviews.items.map((r, i) => (
              <li
                key={r.name}
                className="flex flex-col rounded-[18px] border border-line bg-raise p-7"
                data-reveal="rise"
                style={{ ['--d' as string]: `${i * 90}ms` }}
              >
                <span className="flex gap-0.5 text-ember" aria-label="5 stars">
                  {Array.from({ length: 5 }).map((_, k) => (
                    <Icon key={k} name="star" size={15} />
                  ))}
                </span>
                <blockquote className="mt-5 flex-1 text-[1.08rem] leading-relaxed text-ink">“{r.quote}”</blockquote>
                <p className="mt-6 flex items-center justify-between border-t border-line pt-4">
                  <span className="font-semibold">{r.name}</span>
                  <span className="t-label text-ink-3">{r.localGuide ? 'Local Guide · ' : ''}Verified Google Review</span>
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* comparison */}
      {table ? (
        <section className="rails section border-b border-line">
          <div className="shell">
            <SectionHead eyebrow={l.comparison.eyebrow} title={l.comparison.title} intro={l.comparison.intro ?? undefined} align="split" />
            <ScrollRow className="mt-14 overflow-x-auto rounded-[18px] border border-line" data-reveal="rise">
              <table className="w-full min-w-[720px] border-collapse text-left text-[0.95rem]">
                <thead>
                  <tr>
                    {table.head.map((h, i) => (
                      <th
                        key={h}
                        scope="col"
                        className={cn(
                          'px-5 py-4 font-label text-[0.68rem] font-medium uppercase tracking-[0.07em]',
                          i === 1 ? 'bg-ink text-teal' : 'bg-raise text-ink-3',
                        )}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {table.rows.map((row) => (
                    <tr key={row[0]} className="border-t border-line">
                      {row.map((cell, i) => (
                        <td
                          key={i}
                          className={cn(
                            'px-5 py-4 align-top',
                            i === 0 && 'font-semibold text-ink',
                            i === 1 && 'bg-ink font-medium text-bg',
                            i > 1 && 'text-ink-2',
                          )}
                        >
                          {i === 1 ? (
                            <span className="flex items-start gap-2">
                              <Icon name="check" size={15} strokeWidth={2.2} className="mt-[3px] shrink-0 text-teal" />
                              {cell}
                            </span>
                          ) : (
                            cell
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </ScrollRow>
          </div>
        </section>
      ) : null}

      {/* services, each quoted on request */}
      <section className="rails section border-b border-line">
        <div className="shell">
          <SectionHead eyebrow={l.services.eyebrow} title={l.services.title} intro={l.services.intro ?? undefined} align="split" />
          <ul className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {l.services.items.map((s, i) => (
              <li
                key={s.title}
                className="group flex flex-col rounded-[18px] border border-line bg-raise p-7 transition-[border-color,transform] duration-500 hover:-translate-y-1 hover:border-ink"
                data-reveal="rise"
                style={{ ['--d' as string]: `${(i % 3) * 80}ms` }}
              >
                <h3 className="t-h4">{s.title}</h3>
                <p className="t-small mt-3 flex-1 text-ink-2">{s.body}</p>
                <div className="mt-7 flex items-center justify-between border-t border-line pt-5">
                  <span className="t-label text-ink-3">Fixed quote in 24 hours</span>
                  <a href="#contact-form" className="inline-flex items-center gap-1.5 text-[0.9rem] font-medium text-teal-ink">
                    Get quote <Icon name="arrow" size={14} className="transition-transform group-hover:translate-x-1" />
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* industries */}
      <section className="rails section border-b border-line">
        <div className="shell grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHead eyebrow={l.industries.eyebrow} title={l.industries.title} intro={l.industries.intro ?? undefined} />
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <ul className="grid grid-cols-1 border-t border-line sm:grid-cols-2 sm:gap-x-8" data-reveal="rise">
              {l.industries.items.map((it, i) => (
                <li key={it} className="flex items-center gap-4 border-b border-line py-3.5 text-[1rem]">
                  <span className="t-label w-6 text-teal-ink">{String(i + 1).padStart(2, '0')}</span>
                  {it}
                </li>
              ))}
            </ul>
            {l.industries.coverage ? (
              <p className="t-small mt-8 leading-relaxed text-ink-2">
                <Markdownish text={l.industries.coverage} />
              </p>
            ) : null}
          </div>
        </div>
      </section>

      {/* process */}
      <section className="rails section border-b border-line">
        <div className="shell">
          <SectionHead eyebrow={l.process.eyebrow} title={l.process.title} intro={l.process.intro ?? undefined} align="split" />
          <Steps steps={l.process.steps} className="mt-14" />
        </div>
      </section>

      {/* stack */}
      {l.stack ? (
        <section className="rails section-tight border-b border-line">
          <div className="shell">
            <SectionHead eyebrow={l.stack.eyebrow} title={l.stack.title} />
            <ul className="mt-10 flex flex-wrap gap-2">
              {l.stack.items.map((s) => (
                <li key={s.label}>
                  {s.href ? (
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-2 rounded-[10px] border border-line bg-raise px-4 py-3 font-display text-[1.05rem] font-[680] tracking-[-0.015em] transition-colors hover:border-ink"
                    >
                      {s.label}
                      <Icon name="arrow-up-right" size={14} className="text-ink-3" />
                    </a>
                  ) : (
                    <span className="inline-flex rounded-[10px] border border-line bg-raise px-4 py-3 font-display text-[1.05rem] font-[680]">
                      {s.label}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {/* office */}
      <section className="rails section-tight border-b border-line">
        <div className="shell grid gap-10 rounded-[20px] lg:grid-cols-12">
          <div className="lg:col-span-6">
            <SectionHead eyebrow={l.office.eyebrow} title={l.office.title} intro={l.office.intro} />
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <ul className="grid gap-4 rounded-[18px] border border-line bg-raise p-7 text-[0.98rem] text-ink-2" data-reveal="rise">
              {l.office.lines.map((line, i) => (
                <li key={i} className="flex gap-3">
                  <Icon name={i === 0 ? 'pin' : i === 1 ? 'phone' : 'clock'} size={18} className="mt-0.5 shrink-0 text-teal-ink" />
                  <span>
                    <Markdownish text={line} />
                  </span>
                </li>
              ))}
              <li className="mt-2 flex flex-wrap gap-3 border-t border-line pt-5">
                <KeyButton href={site.mapUrl} size="sm" icon="arrow-up-right">
                  Get directions
                </KeyButton>
                <KeyButton href="#contact-form" size="sm" variant="ghost" icon={null}>
                  Book a free call
                </KeyButton>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="rails section border-b border-line" id="faq">
        <div className="shell grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHead eyebrow={l.faq.eyebrow} title={l.faq.title} />
            {l.faq.still ? (
              <div className="mt-10 rounded-[16px] border border-line bg-raise p-6">
                <p className="t-h4">{l.faq.still.title}</p>
                <p className="t-small mt-2 text-ink-2">{l.faq.still.body}</p>
                <KeyButton href="#contact-form" size="sm" className="mt-5">
                  {l.faq.still.cta}
                </KeyButton>
              </div>
            ) : null}
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <Faq items={l.faq.items} />
          </div>
        </div>
      </section>

      {/* more + resources */}
      <section className="rails section-tight">
        <div className="shell grid gap-12 lg:grid-cols-2">
          {[l.more, l.resources].filter(Boolean).map((blk) => (
            <div key={blk!.title}>
              <Eyebrow>{blk!.eyebrow}</Eyebrow>
              <h2 className="t-h3 mt-5">{blk!.title}</h2>
              <ul className="mt-6 border-t border-line">
                {blk!.links
                  .filter((x) => x.href)
                  .map((x) => (
                    <li key={x.label} className="border-b border-line py-3.5">
                      <ArrowLink href={x.href!}>{x.label}</ArrowLink>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <ConsultCTA />
    </>
  )
}
