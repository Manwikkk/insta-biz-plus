import { results } from '@/content/home'
import { projects, portfolioPage } from '@/content/portfolio'
import { ClientLogo } from '@/components/ui/ClientLogo'
import { Odometer } from '@/components/ui/Odometer'
import { Eyebrow } from '@/components/ui/SectionHead'
import { SplitReveal } from '@/components/motion/SplitReveal'
import { KeyButton } from '@/components/ui/KeyButton'
import { ProjectStrip } from './ProjectStrip'

/**
 * Chapter 5 — proof. The title beside four client results, then the work itself:
 * a run of shipped products you can stop and read.
 */
export function Proof() {
  return (
    <section className="relative overflow-hidden bg-stage text-stage-ink" id="work" data-nav-tone="dark">
      <div className="absolute inset-0 [mask-image:linear-gradient(to_bottom,#000,transparent_60%)]" aria-hidden>
        <div className="iso-grid [--grid:var(--stage-line)]" />
      </div>

      <div className="shell relative pt-[clamp(48px,8vh,112px)]">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-8">
          <div className="lg:col-span-5">
            <Eyebrow index="05" className="text-stage-ink-2 [&_.eyebrow-n]:text-teal">
              {results.eyebrow}
            </Eyebrow>
            <SplitReveal className="t-h2 mt-[clamp(10px,2vh,18px)] max-w-[14ch]">{portfolioPage.spotlight.title}</SplitReveal>
          </div>

          {/* results: a 2 × 2 instrument panel */}
          <ul className="grid grid-cols-2 border-l border-t border-stage-line lg:col-span-7">
            {results.items.map((r, i) => (
              <li
                key={r.brand}
                className="logo-hover flex flex-col items-start gap-2 border-b border-r border-stage-line px-3 py-3 sm:flex-row sm:items-center sm:gap-3 sm:px-4 lg:py-[clamp(10px,1.9vh,16px)]"
                data-reveal="rise"
                style={{ ['--d' as string]: `${i * 90}ms` }}
              >
                <ClientLogo name={r.brand} ratio={2.1} area={0.24} sizes="80px" className="w-[78px] shrink-0 rounded-[9px]" />
                <span className="t-num shrink-0 text-[clamp(1.5rem,min(2.4vw,4.6vh),2.2rem)] text-stage-ink">
                  <Odometer value={r.value} delay={i * 120} />
                </span>
                <span className="min-w-0 max-w-full text-[0.82rem] leading-tight">
                  <span className="block truncate text-stage-ink">{r.label}</span>
                  <span className="block truncate text-stage-ink-2">{r.brand}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* the work */}
      <div className="relative mt-[clamp(14px,3vh,40px)]">
        <ProjectStrip
          projects={projects}
          idle={
            <div className="shell flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <p className="t-label text-stage-ink-2">
                {projects.length} product lines · every one built end-to-end by our team
                <span className="hidden lg:inline"> · hover a screen to read it</span>
                <span className="lg:hidden"> · tap a screen to read it</span>
              </p>
              <KeyButton href="/portfolio" variant="stage" size="sm">
                {results.cta}
              </KeyButton>
            </div>
          }
        />
      </div>
      <div className="h-[clamp(20px,4vh,96px)]" aria-hidden />
    </section>
  )
}
