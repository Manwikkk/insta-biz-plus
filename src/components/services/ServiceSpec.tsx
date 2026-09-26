import Link from 'next/link'
import type { Service } from '@/content/services'
import { Vignette } from '@/components/vignettes/Vignettes'
import { Odometer } from '@/components/ui/Odometer'
import { KeyButton } from '@/components/ui/KeyButton'
import { SplitReveal } from '@/components/motion/SplitReveal'
import { cn } from '@/lib/cn'

/** One service as a spec sheet: part number, promise, deliverables, stack, measured result. */
export function ServiceSpec({ s, flip = false }: { s: Service; flip?: boolean }) {
  return (
    <section id={s.id} className="rails relative scroll-mt-[140px] border-b border-line">
      <div className="shell grid gap-12 py-[clamp(72px,9vw,128px)] lg:grid-cols-12 lg:gap-10">
        <div className={cn('min-w-0 lg:col-span-6', flip && 'lg:order-2 lg:col-start-7')}>
          <p className="t-label flex items-center gap-3 text-ink-3">
            <span className="text-teal-ink">Part {s.n}</span>
            <span className="h-px w-8 bg-line-2" />
            {s.label}
          </p>
          <SplitReveal as="h2" className="t-h2 mt-6 max-w-[16ch]">
            {s.headline}
          </SplitReveal>
          <p className="t-lede mt-6 max-w-xl" data-reveal="rise">
            {s.body}
          </p>
          <ul className="mt-9 grid gap-0 border-t border-line" data-reveal="rise" style={{ ['--d' as string]: '100ms' }}>
            {s.deliverables.map((d, i) => (
              <li key={d} className="flex items-center gap-4 border-b border-line py-3.5 text-[1rem] text-ink-2">
                <span className="t-label w-6 text-ink-3">{String(i + 1).padStart(2, '0')}</span>
                {d}
              </li>
            ))}
          </ul>
          <ul className="mt-7 flex flex-wrap gap-1.5" aria-label={`${s.label} stack`}>
            {s.tech.map((t) => (
              <li key={t} className="tag">
                {t}
              </li>
            ))}
          </ul>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <KeyButton href="#contact-form">
              {/* the full label needs about 340px; the smallest phones get the short one */}
              <span className="min-[380px]:hidden">Start a project</span>
              <span className="hidden min-[380px]:inline">{s.cta}</span>
            </KeyButton>
            <Link href="/portfolio" className="link-draw px-2 text-[0.95rem] font-medium">
              See case studies
            </Link>
          </div>
        </div>

        <div className={cn('min-w-0 lg:col-span-5', flip ? 'lg:order-1 lg:col-start-1' : 'lg:col-start-8')}>
          <div
            className="relative overflow-hidden rounded-[18px] border border-line bg-raise p-4 min-[360px]:p-6 sm:p-8"
            data-reveal="rise"
            style={{ ['--d' as string]: '120ms' }}
          >
            <span className="dot-grid opacity-60" aria-hidden />
            <div className="relative flex items-start justify-between gap-4">
              <span className="t-label shrink-0 text-ink-3">Fig. {s.n}</span>
              <span className="t-label text-right text-ink-3">{s.lineTech.join(' · ')}</span>
            </div>
            <div className="relative mt-8">
              <Vignette id={s.id} />
            </div>
            <div className="relative mt-8 flex items-end justify-between border-t border-line pt-5">
              <div>
                <p className="t-label text-ink-3">Avg. result</p>
                <p className="t-num mt-3 text-[clamp(2.6rem,4.4vw,4rem)]">
                  <Odometer value={s.avg.value} />
                </p>
              </div>
              <p className="max-w-[10rem] text-right text-[0.95rem] text-ink-2">{s.avg.label}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
