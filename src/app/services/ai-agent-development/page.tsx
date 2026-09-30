import type { Metadata } from 'next'
import Link from 'next/link'
import { buildMetadata, pageJsonLd } from '@/lib/seo'
import { JsonLd } from '@/components/seo/JsonLd'
import { PageHero } from '@/components/sections/PageHero'
import { KeyButton, ArrowLink } from '@/components/ui/KeyButton'
import { SectionHead, Eyebrow } from '@/components/ui/SectionHead'
import { AgentStage } from '@/components/heroes/AgentStage'
import { PriceCards } from '@/components/sections/PriceCards'
import { Steps } from '@/components/sections/Steps'
import { Faq } from '@/components/sections/Faq'
import { ConsultCTA } from '@/components/sections/ConsultCTA'
import { SplitReveal } from '@/components/motion/SplitReveal'
import { Icon } from '@/components/ui/Icon'
import { aiAgentFaqs, aiAgents as a } from '@/content/ai-agents'
import { site } from '@/content/site'

export const metadata: Metadata = buildMetadata('/services/ai-agent-development')

export default function AIAgentsPage() {
  return (
    <>
      <JsonLd data={pageJsonLd('/services/ai-agent-development')} />
      <PageHero
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Services', href: '/services' }, { label: 'AI Agent Development' }]}
        tag={a.tag}
        tagNote={a.tagNote}
        title={a.h1}
        intro={
          <p>
            Insta Biz Web is an AI agent development company in India building custom{' '}
            <a href={a.introLink.href} target="_blank" rel="noopener noreferrer" className="link-under text-ink">
              {a.introLink.label}
            </a>
            , RAG chatbots, voice agents and multi-agent systems for startups, SMBs and enterprises across India and overseas. From
            prototype in 7 days to production in 7 weeks.
          </p>
        }
        actions={
          <>
            <KeyButton href="#contact-form">{a.primary}</KeyButton>
            <KeyButton href={site.whatsapp} variant="ghost" icon="whatsapp">
              {a.secondary}
            </KeyButton>
          </>
        }
        figure={<AgentStage />}
        wide
        stats={a.stats}
      />

      {/* the shift */}
      <section className="rails section border-b border-line">
        <div className="shell grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Eyebrow>{a.shift.eyebrow}</Eyebrow>
            <SplitReveal className="t-display mt-6">{a.shift.title}</SplitReveal>
          </div>
          <div className="grid gap-6 lg:col-span-6 lg:col-start-7 lg:pt-4" data-reveal="rise">
            <p className="t-lede">
              The global AI agent market is projected to grow from{' '}
              <a href={a.shift.paragraphs[0].link.href} target="_blank" rel="noopener noreferrer" className="mark-bar font-medium text-ink">
                {a.shift.paragraphs[0].link.label}
              </a>
              . In India, businesses from real estate to e-commerce to healthcare are racing to deploy autonomous AI agents that qualify
              leads, answer customer queries, automate operations and unlock 24/7 productivity.
            </p>
            <p className="t-body">
              But most agencies still ship demo-grade chatbots that hallucinate in production. We don&apos;t. We build production-grade AI
              agents with proper{' '}
              <a href={a.shift.paragraphs[1].link.href} target="_blank" rel="noopener noreferrer" className="link-under text-ink">
                evaluations
              </a>
              , guardrails, observability, cost monitoring and human-in-the-loop fallbacks. The difference shows in week 4, when your agent
              is handling real customers without breaking.
            </p>
            <p className="t-body">
              Read our deep-dive on{' '}
              <Link href={a.shift.deepDive.href} className="link-under text-ink">
                {a.shift.deepDive.label}
              </Link>{' '}
              or jump to{' '}
              <a href="#pricing" className="link-under text-ink">
                the engagement tiers
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      {/* six types */}
      <section className="rails section border-b border-line">
        <div className="shell">
          <SectionHead eyebrow={a.types.eyebrow} title={a.types.title} intro={a.types.intro} align="split" />
          <ul className="cells mt-14 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {a.types.items.map((t, i) => (
              <li
                key={t.title}
                className="group flex flex-col p-7 transition-colors duration-500 hover:bg-raise"
                data-reveal="rise"
                style={{ ['--d' as string]: `${(i % 3) * 80}ms` }}
              >
                <p className="t-label text-teal-ink">{String(i + 1).padStart(2, '0')}</p>
                <h3 className="t-h3 mt-5">{t.title}</h3>
                <p className="t-body mt-3">{t.body}</p>
                <ul className="mb-7 mt-5 flex flex-wrap gap-1.5">
                  {t.tech.map((x) => (
                    <li key={x} className="tag">
                      {x}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto flex items-center justify-between border-t border-line pt-5">
                  <span className="t-label text-ink-3">Fixed quote in 24 hours</span>
                  <Link href="#contact-form" className="group/q inline-flex items-center gap-1.5 text-[0.9rem] font-medium text-teal-ink">
                    Get quote <Icon name="arrow" size={14} className="transition-transform group-hover/q:translate-x-1" />
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* use cases — dark stage */}
      <section className="relative overflow-hidden bg-stage py-[clamp(88px,11vw,160px)] text-stage-ink" data-nav-tone="dark">
        <div className="absolute inset-0 [mask-image:linear-gradient(to_bottom,#000,transparent)]" aria-hidden>
          <div className="iso-grid [--grid:var(--stage-line)]" />
        </div>
        <div className="shell relative">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <Eyebrow className="text-stage-ink-2">{a.useCases.eyebrow}</Eyebrow>
              <SplitReveal className="t-h2 mt-6">{a.useCases.title}</SplitReveal>
            </div>
            <p className="text-[1.1rem] leading-relaxed text-stage-ink-2 lg:col-span-4 lg:col-start-9" data-reveal="rise">
              {a.useCases.intro}
            </p>
          </div>
          <ul className="mt-14 grid gap-px overflow-hidden rounded-[18px] border border-stage-line bg-stage-line md:grid-cols-2 lg:grid-cols-3">
            {a.useCases.items.map((u, i) => (
              <li key={u.title} className="bg-stage p-7" data-reveal="rise" style={{ ['--d' as string]: `${(i % 3) * 80}ms` }}>
                <p className="t-label text-teal">{String(i + 1).padStart(2, '0')}</p>
                <h3 className="t-h3 mt-4">{u.title}</h3>
                <ul className="mt-5 grid gap-2.5">
                  {u.points.map((p) => (
                    <li key={p} className="flex items-start gap-3 text-[0.96rem] text-stage-ink-2">
                      <span className="mt-[0.5em] size-[7px] shrink-0 bg-teal [clip-path:polygon(50%_0,100%_25%,100%_75%,50%_100%,0_75%,0_25%)]" />
                      {p}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* why */}
      <section className="rails section border-b border-line">
        <div className="shell">
          <SectionHead eyebrow={a.why.eyebrow} title={a.why.title} align="split" />
          <ol className="mt-14 grid gap-x-10 md:grid-cols-2 lg:grid-cols-3">
            {a.why.items.map((w, i) => (
              <li key={w.title} className="border-t border-line py-7" data-reveal="rise" style={{ ['--d' as string]: `${(i % 3) * 80}ms` }}>
                <p className="t-numeral text-[2.4rem] text-teal-ink">
                  {String(i + 1).padStart(2, '0')}
                </p>
                <h3 className="t-h4 mt-5">{w.title}</h3>
                <p className="t-small mt-2 text-ink-2">{w.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* engagement tiers */}
      <section className="rails section border-b border-line" id="pricing">
        <div className="shell">
          <SectionHead eyebrow={a.pricing.eyebrow} title={a.pricing.title} intro={a.pricing.intro} align="split" />
          <div className="mt-14">
            <PriceCards cards={a.pricing.tiers} cta={a.pricing.cta} />
          </div>
          <p className="t-small mt-8 max-w-3xl">
            Need something custom? We also offer{' '}
            <Link href="/services" className="link-under text-ink">
              bundled engagements
            </Link>{' '}
            with web development, mobile apps and CRM integration. OpenAI / Anthropic API token costs are billed at-cost with full token
            dashboards.
          </p>
        </div>
      </section>

      {/* process */}
      <section className="rails section border-b border-line">
        <div className="shell">
          <SectionHead eyebrow={a.process.eyebrow} title={a.process.title} intro={a.process.intro} align="split" />
          <Steps steps={a.process.steps} className="mt-14" />
        </div>
      </section>

      {/* stack */}
      <section className="rails section-tight border-b border-line">
        <div className="shell">
          <SectionHead eyebrow={a.stack.eyebrow} title={a.stack.title} />
          <ul className="mt-12 flex flex-wrap gap-2">
            {a.stack.items.map((s, i) => (
              <li key={s.label} data-reveal="scale" style={{ ['--d' as string]: `${i * 30}ms` }}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 rounded-[10px] border border-line bg-raise px-4 py-3 font-display text-[1.05rem] font-[680] tracking-[-0.015em] transition-colors hover:border-ink"
                >
                  {s.label}
                  <Icon
                    name="arrow-up-right"
                    size={14}
                    className="text-ink-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink"
                  />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section className="rails section border-b border-line" id="faq">
        <div className="shell grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHead eyebrow={a.faqEyebrow} title={a.faqTitle} />
            <div className="mt-10 rounded-[16px] border border-line bg-raise p-6">
              <p className="t-h4">{a.ready.title}</p>
              <p className="t-small mt-2 text-ink-2">{a.ready.body}</p>
              <KeyButton href="#contact-form" size="sm" className="mt-5">
                {a.ready.cta}
              </KeyButton>
            </div>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <Faq items={aiAgentFaqs} />
          </div>
        </div>
      </section>

      {/* HQ + idea */}
      <section className="rails section-tight border-b border-line">
        <div className="shell grid gap-4 lg:grid-cols-2">
          <div className="rounded-[18px] border border-line bg-raise p-8">
            <Eyebrow>{a.hq.eyebrow}</Eyebrow>
            <h2 className="t-h3 mt-5">{a.hq.title}</h2>
            <p className="t-body mt-3">{a.hq.intro}</p>
            <ul className="mt-6 grid gap-2 text-[0.95rem] text-ink-2">
              <li className="flex gap-3">
                <Icon name="pin" size={17} className="mt-0.5 shrink-0 text-teal-ink" />
                {site.address.full}
              </li>
              <li>
                <a href={site.phoneHref} className="flex gap-3 hover:text-ink">
                  <Icon name="phone" size={17} className="mt-0.5 shrink-0 text-teal-ink" />
                  {site.phone}
                </a>
              </li>
              <li>
                <Link href={a.hq.also.href} className="link-under ml-8 text-ink">
                  {a.hq.also.label}
                </Link>
              </li>
            </ul>
            <div className="mt-7 flex flex-wrap gap-3">
              <KeyButton href="#contact-form" size="sm">
                {a.hq.primary}
              </KeyButton>
              <KeyButton href="/contact-us" size="sm" variant="ghost" icon={null}>
                {a.hq.secondary}
              </KeyButton>
            </div>
          </div>
          <div className="rounded-[18px] bg-ink p-8 text-bg">
            <p className="t-label text-teal">{a.idea.title}</p>
            <p className="t-h3 mt-5">{a.idea.body}</p>
            <ul className="mt-6 grid gap-2">
              {a.idea.points.map((p) => (
                <li key={p} className="flex items-center gap-3 text-bg/80">
                  <Icon name="check" size={16} className="text-teal" /> {p}
                </li>
              ))}
            </ul>
            <KeyButton href="#contact-form" size="sm" variant="teal" className="mt-7">
              {a.idea.cta}
            </KeyButton>
          </div>
        </div>
      </section>

      {/* more + resources */}
      <section className="rails section-tight">
        <div className="shell grid gap-12 lg:grid-cols-2">
          {[a.more, a.resources].map((blk) => (
            <div key={blk.title}>
              <Eyebrow>{blk.eyebrow}</Eyebrow>
              <h2 className="t-h3 mt-5">{blk.title}</h2>
              <ul className="mt-6 border-t border-line">
                {blk.links.map((l) => (
                  <li key={l.href} className="border-b border-line py-3.5">
                    <ArrowLink href={l.href}>{l.label}</ArrowLink>
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
