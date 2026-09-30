import { hero } from '@/content/home'
import { KeyButton } from '@/components/ui/KeyButton'
import { Odometer } from '@/components/ui/Odometer'
import { Icon } from '@/components/ui/Icon'
import { hexClip } from '@/lib/hex'
import { MobileEngineWindow } from './EngineStage'
import { HeroRotator } from './HeroRotator'

/**
 * Chapter 0 — Ignition. The brand statement on the left; the IBW mark, built as a
 * physical engine, idles on the right with each part called out by name (desktop).
 * Every size here is capped by the viewport height so the whole hero fits one screen.
 * On phones the engine sits in a window under the copy; as you scroll the hero is held,
 * the copy lifts away and the dark stage opens round the engine (EngineStage).
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
      {/* phones: the next chapter's dark stage, opening round the engine as the hero lets go */}
      <div aria-hidden data-hero-ground className="absolute inset-0 z-0 bg-stage lg:hidden motion-reduce:hidden" style={{ clipPath: hexClip('var(--r, 0vmax)') }}>
        <div className="absolute inset-0 [mask-image:radial-gradient(60%_60%_at_50%_50%,#000,transparent)]">
          <div className="iso-grid [--grid:var(--stage-line)]" />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(40%_40%_at_50%_52%,rgb(34_199_216/0.10),transparent_70%)]" />
      </div>

      <div className="shell relative z-[2] flex min-h-[inherit] flex-col pb-5 pt-[96px] sm:pb-10 sm:pt-[112px] lg:pb-[clamp(20px,4vh,48px)] lg:pt-[clamp(92px,15vh,140px)]">
        {/* phones: the column fills the screen and the engine's window takes whatever room is left */}
        <div data-hero-copy className="flex max-w-[760px] flex-1 flex-col lg:block lg:max-w-[58%] lg:flex-none">
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
            className="enter-fade mt-[clamp(1.25rem,3.8vh,2.25rem)] flex flex-wrap items-center gap-2.5 sm:gap-3 lg:mt-[clamp(1.75rem,min(3.4vw,6vh),3.5rem)]"
            style={{ ['--d' as string]: '520ms' }}
          >
            <KeyButton href="/contact-us" className="max-sm:pl-4 max-sm:text-[0.9rem]">
              {hero.primary}
            </KeyButton>
            <KeyButton href="/portfolio" variant="ghost" icon={null} className="max-sm:px-3.5 max-sm:text-[0.9rem]">
              {hero.secondary}
            </KeyButton>
          </div>

          <MobileEngineWindow />
        </div>

        {/* instrument cluster (three figures on phones, four from there up) */}
        <div data-hero-copy className="lg:mt-auto">
          <dl
            className="enter-fade mt-4 grid grid-cols-3 border-t border-line pt-4 sm:mt-8 sm:grid-cols-4 sm:gap-y-6 sm:pt-6 lg:mt-0 lg:max-w-[64%] lg:pt-[clamp(14px,2.6vh,24px)]"
            style={{ ['--d' as string]: '640ms' }}
          >
            {hero.facts.map((f, i) => (
              <div
                key={f.label}
                className="flex flex-col-reverse justify-end border-line pl-4 first:pl-0 [&:not(:first-child)]:border-l max-sm:[&:nth-child(4)]:hidden sm:pl-5"
              >
                <dt className="t-label mt-1.5 text-ink-3 sm:mt-2">{f.label}</dt>
                <dd className="t-num flex items-center gap-1 text-[1.55rem] sm:text-[clamp(1.9rem,min(3vw,5.4vh),2.8rem)]">
                  <Odometer value={f.value} delay={300 + i * 120} />
                  {f.star ? <Icon name="star" size={16} className="ml-0.5 text-ember sm:ml-1 sm:size-5" /> : null}
                </dd>
              </div>
            ))}
          </dl>
        </div>
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
