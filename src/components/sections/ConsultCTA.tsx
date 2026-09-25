import { consultation, site } from '@/content/site'
import { LeadForm } from '@/components/forms/LeadForm'
import { MarkBlueprint } from '@/components/brand/MarkBlueprint'
import { SplitReveal } from '@/components/motion/SplitReveal'
import { Icon } from '@/components/ui/Icon'

/**
 * The closing chapter used across the site: a dark stage, the offer, and the form.
 * The mark's blueprint draws itself in the background — the engine, ready to build.
 */
export function ConsultCTA({ index, id = 'contact-form' }: { index?: string; id?: string }) {
  return (
    <section className="relative overflow-hidden bg-stage text-stage-ink" id="consult" data-nav-tone="dark">
      <div className="absolute inset-0 [mask-image:radial-gradient(80%_70%_at_20%_40%,#000,transparent)]" aria-hidden>
        <div className="iso-grid [--grid:var(--stage-line)]" />
      </div>
      <MarkBlueprint
        className="pointer-events-none absolute -left-[12%] top-[15%] hidden w-[760px] text-stage-ink-2 opacity-50 lg:block"
        exploded={0.5}
        strokeWidth={0.7}
      />

      <div className="shell relative grid gap-14 py-[clamp(72px,11vw,160px)] lg:grid-cols-12 lg:items-center lg:gap-10 lg:py-[clamp(36px,7vh,150px)]">
        <div className="lg:col-span-5">
          <p className="eyebrow t-label text-stage-ink-2">
            {index ? <span className="eyebrow-n !text-teal">{index}</span> : <span className="eyebrow-dot" aria-hidden />}
            <span>{consultation.eyebrow}</span>
          </p>
          <SplitReveal className="t-display mt-[clamp(12px,2.6vh,24px)] lg:text-[clamp(2.2rem,min(5vw,8.4vh),5rem)]">
            {consultation.title}
          </SplitReveal>
          <p
            className="mt-[clamp(14px,3vh,28px)] max-w-md text-[clamp(1rem,2.6vh,1.1rem)] leading-relaxed text-stage-ink-2"
            data-reveal="rise"
          >
            {consultation.body}
          </p>
          <ul
            className="mt-[clamp(16px,3.4vh,32px)] grid gap-[clamp(6px,1.4vh,12px)]"
            data-reveal="rise"
            style={{ ['--d' as string]: '120ms' }}
          >
            {consultation.points.map((p) => (
              <li key={p} className="flex items-center gap-3 text-stage-ink">
                <span className="grid size-6 place-items-center rounded-[6px] border border-stage-line text-teal">
                  <Icon name="check" size={14} strokeWidth={2} />
                </span>
                {p}
              </li>
            ))}
          </ul>
          <div
            className="mt-[clamp(18px,4vh,40px)] border-t border-stage-line pt-[clamp(14px,2.6vh,24px)]"
            data-reveal="rise"
            style={{ ['--d' as string]: '200ms' }}
          >
            <p className="t-label text-stage-ink-2">Or reach us directly</p>
            <div className="mt-[clamp(10px,2vh,16px)] flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-x-6">
              <a href={`mailto:${site.email}`} className="group inline-flex items-center gap-2.5 text-stage-ink">
                <Icon name="mail" size={18} className="text-teal" />
                <span className="link-draw">{site.email}</span>
              </a>
              <a href={site.phoneHref} className="group inline-flex items-center gap-2.5 whitespace-nowrap text-stage-ink">
                <Icon name="phone" size={18} className="text-teal" />
                <span className="link-draw">{site.phone}</span>
              </a>
              <a
                href={site.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2.5 whitespace-nowrap text-stage-ink"
              >
                <Icon name="whatsapp" size={18} className="text-teal" />
                <span className="link-draw">WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 lg:pl-6" data-reveal="rise" style={{ ['--d' as string]: '160ms' }}>
          <LeadForm id={id} tone="stage" submitLabel={consultation.submit} disclaimer={consultation.disclaimer} />
        </div>
      </div>
    </section>
  )
}
