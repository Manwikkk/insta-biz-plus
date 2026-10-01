import type { Metadata } from 'next'
import { buildMetadata, pageJsonLd } from '@/lib/seo'
import { JsonLd } from '@/components/seo/JsonLd'
import { Breadcrumbs } from '@/components/sections/PageHero'
import { SectionHead } from '@/components/ui/SectionHead'
import { Faq } from '@/components/sections/Faq'
import { ContactConsole } from '@/components/contact/ContactConsole'
import { ContactKeys } from '@/components/contact/ContactKeys'
import { contact as c } from '@/content/contact'

export const metadata: Metadata = buildMetadata('/contact-us')

/**
 * Contact: the headline and every way in on the left, the conversation itself on the right
 * (one question at a time), then what happens after you hit send, and the quick answers.
 */
export default function ContactPage() {
  const lines = c.h1.split(/(?<=\.) /)
  return (
    <>
      <JsonLd data={pageJsonLd('/contact-us')} />
      <section className="ct-hero rails relative overflow-clip border-b border-line">
        <div aria-hidden className="ct-aurora">
          <span />
          <span />
          <span />
        </div>
        <div aria-hidden className="absolute inset-0 [mask-image:radial-gradient(70%_70%_at_30%_30%,#000,transparent_75%)]">
          <div className="iso-grid" />
        </div>
        <div className="shell relative grid gap-10 pb-[clamp(48px,9vh,96px)] pt-[clamp(104px,15vh,150px)] lg:grid-cols-12 lg:gap-10">
          <div className="min-w-0 lg:col-span-5">
            <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Contact' }]} className="enter-fade" />
            <p className="enter-fade mt-6 flex items-center gap-3" style={{ ['--d' as string]: '60ms' }}>
              <span className="live-dot" />
              <span className="t-label text-ink-2">{c.status} · reply in 2 hrs</span>
            </p>
            <h1 className="ct-title mt-5">
              {lines.map((l, i) => (
                <span key={l} className="enter-line">
                  <span className={i === lines.length - 1 ? 'text-teal-ink' : undefined} style={{ ['--d' as string]: `${120 + i * 90}ms` }}>
                    {l}
                  </span>
                </span>
              ))}
            </h1>
            <p className="enter-fade t-lede mt-5 max-w-[30rem]" style={{ ['--d' as string]: '320ms' }}>
              Tell us what you’re building. We’ll come back with a timeline, scope and a clear quote.
            </p>
            <div className="enter-fade mt-[clamp(24px,4vh,40px)]" style={{ ['--d' as string]: '420ms' }}>
              <ContactKeys />
            </div>
          </div>
          <div className="enter-fade min-w-0 lg:col-span-7" style={{ ['--d' as string]: '260ms' }}>
            <ContactConsole />
          </div>
        </div>
      </section>

      {/* after you hit send */}
      <section className="rails section-tight border-b border-line">
        <div className="shell">
          <SectionHead eyebrow={c.next.eyebrow} title="From hello to kickoff in a week" align="split" intro="No forms to chase, no sales loop - just these five steps." />
          <ol className="ct-next mt-12">
            {c.next.steps.map((s, i) => (
              <li key={s.n} className="ct-next-step" data-reveal="rise" style={{ ['--d' as string]: `${i * 80}ms` }}>
                <span className="ct-next-dot" aria-hidden>
                  {s.n}
                </span>
                <span className="t-label text-teal-ink">{s.when}</span>
                <span className="mt-1.5 block text-[1.02rem] font-semibold leading-snug tracking-[-0.012em]">{s.title}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* FAQ */}
      <section className="rails section scroll-mt-24" id="contact-faq">
        <div className="shell grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHead eyebrow={c.faq.eyebrow} title={c.faq.title} intro={c.faq.intro} />
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <Faq items={c.faq.answered} asked={c.faq.asked} />
          </div>
        </div>
      </section>
    </>
  )
}
