import type { Metadata } from 'next'
import { buildMetadata, pageJsonLd } from '@/lib/seo'
import { JsonLd } from '@/components/seo/JsonLd'
import { KeyButton } from '@/components/ui/KeyButton'
import { Eyebrow, SectionHead } from '@/components/ui/SectionHead'
import { AboutHero } from '@/components/about/AboutHero'
import { StoryHighlight } from '@/components/about/StoryHighlight'
import { Manifesto } from '@/components/about/Manifesto'
import { Journey } from '@/components/about/Journey'
import { TeamList } from '@/components/about/TeamList'
import { OfficeTime } from '@/components/about/OfficeTime'
import { OfficeMap } from '@/components/locations/OfficeMap'
import { Brands } from '@/components/home/Voices'
import { ConsultCTA } from '@/components/sections/ConsultCTA'
import { about as a } from '@/content/about'
import { site } from '@/content/site'

export const metadata: Metadata = buildMetadata('/about-us')

export default function AboutPage() {
  return (
    <>
      <JsonLd data={pageJsonLd('/about-us')} />

      <AboutHero />

      <StoryHighlight eyebrow={a.story.eyebrow} title={a.story.title} body={a.story.body} cta={a.story.cta} />

      <Manifesto eyebrow={a.drives.eyebrow} title={a.drives.title} items={a.drives.items} principles={a.drives.principles} />

      <Journey />

      <TeamList
        eyebrow={a.team.eyebrow}
        title={a.team.title}
        intro={a.team.intro}
        founder={a.team.founder}
        groupLabel={a.team.groupLabel}
        members={a.team.members}
        join={a.team.join}
      />

      {/* the IBW way: six promises on the dark stage */}
      <section className="relative overflow-hidden bg-stage text-stage-ink" id="way" data-nav-tone="dark">
        <div aria-hidden className="absolute inset-0 [mask-image:radial-gradient(70%_60%_at_20%_10%,#000,transparent_75%)]">
          <div className="iso-grid [--grid:var(--stage-line)]" />
        </div>
        <div className="shell relative py-[clamp(44px,8vh,128px)]">
          <SectionHead
            eyebrow={a.way.eyebrow}
            title={a.way.title}
            intro={a.way.intro}
            align="split"
            className="[&_.eyebrow]:text-stage-ink-2 [&_.t-lede]:text-stage-ink-2"
          />
          <ol className="mt-[clamp(22px,4.4vh,52px)] grid gap-px overflow-hidden rounded-[22px] border border-stage-line bg-stage-line sm:grid-cols-2 lg:grid-cols-3">
            {a.way.items.map((w, i) => (
              <li
                key={w.title}
                className="way-cell group relative bg-stage-2 p-[clamp(14px,2.4vh,28px)]"
                data-reveal="rise"
                style={{ ['--d' as string]: `${(i % 3) * 80}ms` }}
              >
                <span className="way-num" aria-hidden>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-[clamp(8px,1.6vh,14px)] text-[1.08rem] font-semibold tracking-[-0.012em] text-stage-ink">{w.title}</h3>
                <p className="mt-1.5 text-[0.9rem] leading-[1.5] text-stage-ink-2">{w.body}</p>
              </li>
            ))}
          </ol>
          <div className="mt-[clamp(14px,3vh,28px)] flex flex-col gap-4 rounded-[18px] border border-stage-line bg-stage-2/70 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[1.05rem] font-semibold text-stage-ink">{a.way.aside.title}</p>
              <p className="mt-1 text-[0.92rem] text-stage-ink-2">{a.way.aside.body}</p>
            </div>
            <KeyButton href="/contact-us#contact-form" size="sm" variant="teal" className="shrink-0">
              {a.way.aside.cta}
            </KeyButton>
          </div>
        </div>
      </section>

      <Brands eyebrow={a.networks.eyebrow} title={a.networks.title} intro={a.networks.intro} id="networks" />

      {/* the office: where we are on the map, the address and the time there, and the ways to come by */}
      <section className="rails relative border-b border-line py-[clamp(40px,7.4vh,110px)]" id="office">
        <div className="shell">
          <div className="grid gap-4 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <Eyebrow>{a.office.eyebrow}</Eyebrow>
              <h2 className="t-h2 mt-[clamp(10px,2vh,18px)]">{a.office.title}</h2>
            </div>
            <p className="t-lede lg:col-span-4 lg:col-start-9">{a.office.intro}</p>
          </div>

          <div className="mt-[clamp(20px,4vh,44px)] grid overflow-hidden rounded-[22px] border border-line bg-raise lg:grid-cols-12">
            <OfficeMap className="h-[clamp(240px,42vh,400px)] lg:col-span-8 lg:h-auto lg:min-h-[clamp(260px,44vh,420px)]" />
            <div className="flex flex-col gap-5 border-t border-line p-[clamp(18px,3vh,28px)] lg:col-span-4 lg:border-l lg:border-t-0">
              <div>
                <p className="t-label text-ink-3">{a.office.label}</p>
                <p className="mt-1.5 font-display text-[clamp(1.5rem,min(2.2vw,4.2vh),2rem)] font-[700] leading-none tracking-[-0.03em]">
                  {a.office.name}
                </p>
                <address className="t-small mt-3 not-italic text-ink-2">
                  {site.address.lines.map((l) => (
                    <span key={l} className="block">
                      {l}
                    </span>
                  ))}
                </address>
              </div>
              <OfficeTime />
              <div className="mt-auto flex flex-wrap gap-2.5">
                <KeyButton href={site.mapUrl} size="sm" icon="arrow-up-right">
                  {a.office.directions}
                </KeyButton>
                <KeyButton href="/contact-us#contact-form" size="sm" variant="ghost" icon={null}>
                  {a.office.visit}
                </KeyButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ConsultCTA />
    </>
  )
}
