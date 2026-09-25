import { hero } from '@/content/home'
import { KeyButton } from '@/components/ui/KeyButton'
import { Odometer } from '@/components/ui/Odometer'
import { Icon } from '@/components/ui/Icon'
import { MobileEngineWindow } from './EngineStage'
import { HeroRotator } from './HeroRotator'

/**
 * Chapter 0 — Ignition. The brand statement on the left; the IBW mark, built as a
 * physical engine, idles on the right with each part called out by name (desktop).
 * Every size here is capped by the viewport height so the whole hero fits one screen.
 */
export function Hero() {
  return (
    <section data-stage="hero" className="relative min-h-[100svh] overflow-hidden">
      {/* ground: blueprint lattice fading toward the edges */}
      <div aria-hidden className="absolute inset-0 z-0">
        <div className="absolute inset-0 [mask-image:radial-gradient(70%_65%_at_70%_45%,#000_15%,transparent_72%)]">
          <div className="iso-grid" />
        </div>
        <div className="absolute right-[-8%] top-1/2 hidden aspect-square w-[62vw] max-w-[980px] -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,var(--teal-soft),transparent)] opacity-70 lg:block" />
      </div>

      <div className="shell relative z-[2] flex min-h-[inherit] flex-col pb-10 pt-[112px] lg:pb-[clamp(20px,4vh,48px)] lg:pt-[clamp(92px,15vh,140px)]">
        <div className="max-w-[760px] lg:max-w-[58%]">
          <p className="enter-fade inline-flex items-center gap-3" style={{ ['--d' as string]: '80ms' }}>
            <span className="inline-flex h-6 items-center rounded-[4px] bg-ember px-2 font-label text-[0.62rem] font-semibold uppercase tracking-[0.08em] text-white">
              {hero.badge.tag}
            </span>
            <span className="t-label text-ink-2">{hero.badge.text}</span>
          </p>

          <h1 className="mt-[clamp(1.25rem,3.4vh,1.75rem)] font-display text-[clamp(2.7rem,min(6.3vw,11vh),7.1rem)] font-[780] leading-[0.92] tracking-[-0.045em] [font-stretch:100%] sm:[font-stretch:108%]">
            <span className="enter-line">
              <span style={{ ['--d' as string]: '120ms' }}>We Build Digital</span>
            </span>{' '}
            <span className="enter-line">
              <span style={{ ['--d' as string]: '220ms' }}>Engines for</span>
            </span>{' '}
            <span className="enter-line">
              <span style={{ ['--d' as string]: '320ms' }}>
                <HeroRotator words={hero.rotating} />
              </span>
            </span>
          </h1>

          <div
            className="enter-fade mt-[clamp(1.25rem,3.8vh,2.25rem)] flex flex-wrap items-center gap-3 lg:mt-[clamp(1.75rem,min(3.4vw,6vh),3.5rem)]"
            style={{ ['--d' as string]: '520ms' }}
          >
            <KeyButton href="/contact-us">{hero.primary}</KeyButton>
            <KeyButton href="/portfolio" variant="ghost" icon={null}>
              {hero.secondary}
            </KeyButton>
          </div>

          <MobileEngineWindow />
        </div>

        {/* instrument cluster */}
        <dl
          className="enter-fade mt-8 grid grid-cols-2 gap-y-6 border-t border-line pt-6 sm:grid-cols-4 lg:mt-auto lg:max-w-[64%] lg:pt-[clamp(14px,2.6vh,24px)]"
          style={{ ['--d' as string]: '640ms' }}
        >
          {hero.facts.map((f, i) => (
            <div
              key={f.label}
              className="flex flex-col-reverse justify-end border-line [&:nth-child(2n)]:border-l [&:nth-child(2n)]:pl-5 sm:border-l sm:pl-5 sm:first:border-l-0 sm:first:pl-0"
            >
              <dt className="t-label mt-2 text-ink-3">{f.label}</dt>
              <dd className="t-num flex items-center gap-1 text-[clamp(1.9rem,min(3vw,5.4vh),2.8rem)]">
                <Odometer value={f.value} delay={300 + i * 120} />
                {f.star ? <Icon name="star" size={20} className="ml-1 text-ember" /> : null}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <a
        href="#problem"
        className="t-label absolute bottom-6 left-1/2 z-[2] hidden -translate-x-1/2 items-center gap-2 text-ink-3 transition-colors hover:text-ink lg:hidden"
      >
        Scroll <Icon name="arrow-down" size={14} />
      </a>
    </section>
  )
}
