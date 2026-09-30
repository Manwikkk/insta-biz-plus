import type { Metadata } from 'next'
import { buildMetadata, pageJsonLd } from '@/lib/seo'
import { JsonLd } from '@/components/seo/JsonLd'
import { PageHero } from '@/components/sections/PageHero'
import { SectionHead } from '@/components/ui/SectionHead'
import { KeyButton } from '@/components/ui/KeyButton'
import { LeadForm } from '@/components/forms/LeadForm'
import { HoursBoard } from '@/components/contact/HoursBoard'
import { MapEmbed } from '@/components/contact/MapEmbed'
import { Steps } from '@/components/sections/Steps'
import { Faq } from '@/components/sections/Faq'
import { Icon } from '@/components/ui/Icon'
import { contact as c } from '@/content/contact'
import { site } from '@/content/site'

export const metadata: Metadata = buildMetadata('/contact-us')

const CHANNEL_ICON = { Email: 'mail', Phone: 'phone', WhatsApp: 'whatsapp', 'Strategy Call': 'calendar' } as const

export default function ContactPage() {
  return (
    <>
      <JsonLd data={pageJsonLd('/contact-us')} />
      <PageHero
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Contact' }]}
        tag={c.tag}
        tagNote={c.tagNote}
        title={c.h1}
        chips={c.chips}
        intro={
          <p>
            {c.intro}{' '}
            <a href={site.phoneHref} className="link-under text-ink">
              {c.introLink}
            </a>
            .
          </p>
        }
        actions={
          <nav aria-label="On this page" className="flex flex-wrap gap-2">
            {c.jump.map((j, i) => (
              <KeyButton key={j.href} href={j.href} size="sm" variant={i === 0 ? 'key' : 'ghost'} icon={i === 0 ? 'arrow-down' : null}>
                {j.label}
              </KeyButton>
            ))}
          </nav>
        }
        figure={<HoursBoard />}
      />

      {/* form */}
      <section className="rails section border-b border-line">
        <div className="shell grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="flex items-center gap-3">
              <span className="live-dot" />
              <span className="t-label text-ink-2">{c.status}</span>
            </p>
            <SectionHead title={c.form.title} intro={c.form.intro} className="mt-8" />
            <ul className="mt-8 grid gap-3" data-reveal="rise">
              {c.form.points.map((p) => (
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
              variant="contact"
              submitLabel={c.form.submit}
              disclaimer={c.form.disclaimer}
            />
          </div>
        </div>
      </section>

      {/* channels */}
      <section className="rails section border-b border-line scroll-mt-24" id="reach-us">
        <div className="shell">
          <SectionHead eyebrow={c.channels.eyebrow} title={c.channels.title} intro={c.channels.intro} align="split" />
          <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {c.channels.items.map((ch, i) => (
              <li key={ch.kind} data-reveal="rise" style={{ ['--d' as string]: `${i * 80}ms` }}>
                <a
                  href={ch.href}
                  {...(/^https?:/.test(ch.href) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="group flex h-full flex-col rounded-[18px] border border-line bg-raise p-7 transition-[border-color,transform] duration-500 hover:-translate-y-1 hover:border-ink"
                >
                  <span className="grid size-12 place-items-center rounded-[12px] bg-ink text-bg transition-colors duration-300 group-hover:bg-teal group-hover:text-[#04161a]">
                    <Icon name={CHANNEL_ICON[ch.kind as keyof typeof CHANNEL_ICON]} size={20} />
                  </span>
                  <span className="t-label mt-8 text-ink-3">{ch.kind}</span>
                  <span className="mt-2 text-[1.08rem] font-semibold">{ch.value}</span>
                  <span className="t-small mt-2 flex-1 text-ink-2">{ch.body}</span>
                  <span className="mt-6 inline-flex items-center gap-2 text-[0.92rem] font-medium">
                    {ch.cta} <Icon name="arrow" size={15} className="transition-transform group-hover:translate-x-1" />
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* visit */}
      <section className="rails section border-b border-line scroll-mt-24" id="visit-us">
        <div className="shell grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHead eyebrow={c.visit.eyebrow} title={c.visit.title} intro={c.visit.intro} />
            <div className="mt-10 rounded-[18px] border border-line bg-raise p-7" data-reveal="rise">
              <p className="t-label text-teal-ink">Headquarters</p>
              <h3 className="t-h3 mt-3">Naranpura</h3>
              <p className="t-body mt-3">
                {site.address.lines.map((l) => (
                  <span key={l} className="block">
                    {l}
                  </span>
                ))}
              </p>
              <KeyButton href={site.mapUrl} size="sm" icon="arrow-up-right" className="mt-6">
                Get directions
              </KeyButton>
              <div className="mt-8 border-t border-line pt-6">
                <p className="t-label text-ink-3">Office hours</p>
                <ul className="mt-3 grid gap-2">
                  {site.hours.map((h) => (
                    <li key={h.days} className="flex justify-between border-b border-line pb-2 text-[0.95rem] last:border-b-0">
                      <span className="text-ink-2">{h.days}</span>
                      <span className="font-medium">{h.time}</span>
                    </li>
                  ))}
                </ul>
                <p className="t-label mt-4 text-ink-3">{site.timezoneNote}</p>
              </div>
              <a href="#contact-form" className="group mt-6 flex items-center justify-between rounded-[12px] bg-ink px-5 py-4 text-bg">
                <span>
                  <span className="block font-semibold">{c.visit.visitCta.title}</span>
                  <span className="text-[0.9rem] text-bg/70">{c.visit.visitCta.body}</span>
                </span>
              </a>
            </div>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <MapEmbed />
          </div>
        </div>
      </section>

      {/* next steps */}
      <section className="rails section border-b border-line">
        <div className="shell">
          <SectionHead eyebrow={c.next.eyebrow} title={c.next.title} intro={c.next.intro} align="split" />
          <Steps steps={c.next.steps} className="mt-14" />
        </div>
      </section>

      {/* FAQ */}
      <section className="rails section scroll-mt-24" id="contact-faq">
        <div className="shell grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHead
              eyebrow={c.faq.eyebrow}
              title={c.faq.title}
              intro={
                <>
                  {c.faq.intro}{' '}
                  <a href="#contact-form" className="link-under text-ink">
                    {c.faq.introLink}
                  </a>{' '}
                  {c.faq.introTail}
                </>
              }
            />
            <div className="mt-10 rounded-[16px] border border-line bg-raise p-6">
              <p className="t-h4">{c.faq.aside.title}</p>
              <p className="t-small mt-2 text-ink-2">{c.faq.aside.body}</p>
              <KeyButton href="#contact-form" size="sm" className="mt-5">
                Book a free call
              </KeyButton>
            </div>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <Faq items={c.faq.answered} asked={c.faq.asked} />
          </div>
        </div>
      </section>
    </>
  )
}
