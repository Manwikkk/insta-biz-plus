import type { Metadata } from 'next'
import { buildMetadata, pageJsonLd } from '@/lib/seo'
import { JsonLd } from '@/components/seo/JsonLd'
import { PageHero } from '@/components/sections/PageHero'
import { KeyButton } from '@/components/ui/KeyButton'
import { SectionHead } from '@/components/ui/SectionHead'
import { AuditReport } from '@/components/audit/AuditReport'
import { LeadForm } from '@/components/forms/LeadForm'
import { Faq } from '@/components/sections/Faq'
import { Icon } from '@/components/ui/Icon'
import { audit as a } from '@/content/audit'
import { site } from '@/content/site'

export const metadata: Metadata = buildMetadata('/audit')

export default function AuditPage() {
  return (
    <>
      <JsonLd data={pageJsonLd('/audit')} />
      <PageHero
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Free Website Audit' }]}
        tag="Free website audit"
        tagNote="No credit card"
        title={a.h1}
        intro={a.intro}
        chips={a.chips}
        actions={
          <>
            <KeyButton href="#audit-form">{a.primary}</KeyButton>
            <KeyButton href="#what-you-get" variant="ghost" icon={null}>
              {a.secondary}
            </KeyButton>
            <p className="t-label basis-full pt-3 text-ink-3">{a.trust}</p>
          </>
        }
        figure={<AuditReport />}
      />

      <section className="rails section border-b border-line scroll-mt-24" id="what-you-get">
        <div className="shell">
          <SectionHead eyebrow={a.checks.eyebrow} title={a.checks.title} intro={a.checks.intro} align="split" />
          <ol className="cells mt-14 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {a.checks.items.map((c, i) => (
              <li
                key={c.title}
                className={`group relative p-6 transition-colors duration-500 hover:bg-raise ${i === a.checks.items.length - 1 ? 'bg-ink text-bg hover:!bg-ink lg:col-span-2' : ''}`}
                data-reveal="rise"
                style={{ ['--d' as string]: `${(i % 4) * 60}ms` }}
              >
                <p className={`t-label ${i === a.checks.items.length - 1 ? 'text-teal' : 'text-teal-ink'}`}>
                  {String(i + 1).padStart(2, '0')}
                </p>
                <h3 className="t-h4 mt-6">{c.title}</h3>
                <p className={`mt-2 text-[0.92rem] leading-relaxed ${i === a.checks.items.length - 1 ? 'text-bg/75' : 'text-ink-2'}`}>
                  {c.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="rails section border-b border-line">
        <div className="shell">
          <SectionHead eyebrow={a.how.eyebrow} title={a.how.title} />
          <ol className="mt-14 grid gap-px overflow-hidden rounded-[18px] border border-line bg-line md:grid-cols-2 lg:grid-cols-4">
            {a.how.steps.map((s, i) => (
              <li key={s.n} className="relative bg-bg p-7" data-reveal="rise" style={{ ['--d' as string]: `${i * 80}ms` }}>
                <p className="t-numeral text-[3rem] text-teal-ink">
                  {s.n}
                </p>
                <h3 className="t-h4 mt-8">{s.title}</h3>
                <p className="t-small mt-2 text-ink-2">{s.body}</p>
                {i < a.how.steps.length - 1 ? (
                  <Icon name="arrow" size={18} className="absolute right-6 top-8 hidden text-ink-3 lg:block" />
                ) : null}
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="rails section border-b border-line scroll-mt-24" id="audit-form">
        <div className="shell grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="inline-flex h-6 items-center rounded-[4px] bg-teal px-2 font-label text-[0.62rem] font-semibold uppercase tracking-[0.08em] text-[#04161a]">
              {a.form.tag}
            </p>
            <SectionHead title={a.form.title} intro={a.form.intro} className="mt-6" />
            <ul className="mt-8 grid gap-3">
              {a.form.points.map((p) => (
                <li key={p} className="flex items-center gap-3">
                  <span className="grid size-6 place-items-center rounded-[6px] border border-line-2 text-teal-ink">
                    <Icon name="check" size={14} strokeWidth={2} />
                  </span>
                  {p}
                </li>
              ))}
            </ul>
            <div className="mt-10 border-t border-line pt-6">
              <p className="t-label text-ink-3">Or reach us directly</p>
              <div className="mt-4 grid gap-3">
                <a href={`mailto:${site.email}`} className="inline-flex items-center gap-2.5">
                  <Icon name="mail" size={18} className="text-teal-ink" />
                  <span className="link-draw">{site.email}</span>
                </a>
                <a href={site.phoneHref} className="inline-flex items-center gap-2.5">
                  <Icon name="phone" size={18} className="text-teal-ink" />
                  <span className="link-draw">{site.phone}</span>
                </a>
              </div>
            </div>
          </div>
          <div className="lg:col-span-7">
            <LeadForm
              id="audit-lead"
              variant="audit"
              submitLabel={a.form.submit}
              disclaimer={a.form.disclaimer}
              goalLabel={a.form.goalLabel}
              goals={a.form.goals}
            />
          </div>
        </div>
      </section>

      <section className="rails section">
        <div className="shell grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHead eyebrow={a.faq.eyebrow} title={a.faq.title} />
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <Faq items={a.faq.answered} asked={a.faq.asked} />
          </div>
        </div>
      </section>
    </>
  )
}
