import { results } from '@/content/home'
import { portfolioPage, productLines, showcase } from '@/content/portfolio'
import { ClientLogo } from '@/components/ui/ClientLogo'
import { Odometer } from '@/components/ui/Odometer'
import { Eyebrow } from '@/components/ui/SectionHead'
import { SplitReveal } from '@/components/motion/SplitReveal'
import { KeyButton } from '@/components/ui/KeyButton'
import { ProjectStrip } from './ProjectStrip'

/**
 * Chapter 5 — proof. The title, then four client results across the full width of the
 * page, then the work itself: a run of shipped products you can stop and read. On wide
 * screens the chapter is exactly one screen tall, whatever is picked in the run.
 */
export function Proof() {
  return (
    <section className="relative flex flex-col overflow-hidden bg-stage pb-[clamp(18px,3.4vh,48px)] text-stage-ink lg:min-h-[100svh]" id="work" data-nav-tone="dark">
      <div className="absolute inset-0 [mask-image:linear-gradient(to_bottom,#000,transparent_60%)]" aria-hidden>
        <div className="iso-grid [--grid:var(--stage-line)]" />
      </div>

      <div className="shell relative shrink-0 pt-[clamp(40px,7vh,104px)]">
        <div className="grid gap-4 lg:grid-cols-12 lg:items-end lg:gap-8">
          <div className="lg:col-span-8">
            <Eyebrow index="05" className="text-stage-ink-2 [&_.eyebrow-n]:text-teal">
              {results.eyebrow}
            </Eyebrow>
            <SplitReveal className="t-h2 mt-[clamp(10px,1.8vh,16px)]">{portfolioPage.spotlight.title}</SplitReveal>
          </div>
          <p className="max-w-md text-[0.98rem] leading-relaxed text-stage-ink-2 lg:col-span-4" data-reveal="rise">
            {portfolioPage.spotlight.intro}
          </p>
        </div>

        {/* four results across the page, one per column */}
        <ul className="mt-[clamp(18px,3.4vh,40px)] grid grid-cols-2 overflow-hidden rounded-[18px] border border-stage-line lg:grid-cols-4">
          {results.items.map((r, i) => (
            <li
              key={r.brand}
              className="result-cell group relative flex flex-col items-start gap-2.5 border-stage-line p-[clamp(12px,2vh,22px)] sm:flex-row sm:items-center sm:gap-4 [&:nth-child(-n+2)]:border-b lg:[&:nth-child(-n+2)]:border-b-0 [&:nth-child(odd)]:border-r lg:[&:not(:last-child)]:border-r"
              data-reveal="rise"
              style={{ ['--d' as string]: `${i * 90}ms` }}
            >
              <ClientLogo name={r.brand} ratio={2.1} area={0.26} sizes="120px" className="w-[clamp(86px,8vw,118px)] shrink-0 rounded-[10px]" />
              <div className="min-w-0">
                <p className="t-num text-[clamp(1.7rem,min(2.6vw,4.8vh),2.6rem)] text-stage-ink">
                  <Odometer value={r.value} delay={i * 120} />
                </p>
                <p className="mt-1.5 text-[0.84rem] leading-tight">
                  <span className="text-stage-ink">{r.label}</span>
                  <span className="text-stage-ink-2"> · {r.brand}</span>
                </p>
              </div>
              <span aria-hidden className="absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 bg-teal transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-x-100 pointer-coarse:delay-300 pointer-coarse:group-[.is-in]:scale-x-100" />
            </li>
          ))}
        </ul>
      </div>

      {/* the work */}
      <div className="relative mt-[clamp(18px,3.4vh,40px)] flex flex-1 flex-col justify-center">
        <ProjectStrip
          items={showcase}
          idle={
            <div className="shell flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <p className="t-label text-stage-ink-2">
                {productLines} products & projects · every one built end-to-end by our team
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
    </section>
  )
}
