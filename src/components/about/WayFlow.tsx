'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { KeyButton } from '@/components/ui/KeyButton'
import { Icon } from '@/components/ui/Icon'
import { useLenis } from '@/components/motion/SmoothScroll'
import { about } from '@/content/about'
import { process } from '@/content/home'
import { cn } from '@/lib/cn'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const HUB = ['WhatsApp', 'Payments', 'Tally', 'Email']

/** Each step in miniature, doing its job: it plays through once, the first time its card comes into hand, and then stays done. */
function Scene({ k }: { k: number }) {
  switch (k) {
    case 0:
      return (
        <div className="wy-sc wy-chat">
          <p className="wy-b is-them">We lose leads on WhatsApp.</p>
          <p className="wy-b is-us">Let’s map where they drop off.</p>
          <p className="wy-file">
            <Icon name="file" size={14} />
            <span>Brief.pdf</span>
            <em>Ready</em>
          </p>
        </div>
      )
    case 1:
      return (
        <ol className="wy-sc wy-map">
          {['Enquiry', 'Quote', 'Order', 'Invoice'].map((n, i) => (
            <li key={n} className={cn(i === 1 && 'is-flag')} style={{ ['--i' as string]: i }}>
              <span>{n}</span>
              {i === 1 ? (
                <em>
                  <Icon name="workflow" size={11} /> Automate
                </em>
              ) : null}
            </li>
          ))}
        </ol>
      )
    case 2:
      return (
        <div className="wy-sc wy-ui">
          <div className="wy-screen">
            <span className="wy-ui-bar" />
            <span className="wy-ui-hero" />
            <span className="wy-ui-row">
              <i />
              <i />
              <i />
            </span>
            <span className="wy-ui-btn">Book a demo</span>
          </div>
          <span className="wy-cursor" />
        </div>
      )
    case 3:
      return (
        <div className="wy-sc wy-code">
          {[64, 82, 48, 70, 36].map((w, i) => (
            <p key={i} style={{ ['--w' as string]: `${w}%`, ['--i' as string]: i, ['--in' as string]: i % 3 === 1 ? 1 : 0 }}>
              <i />
            </p>
          ))}
          <p className="wy-ok">
            <Icon name="check" size={13} strokeWidth={2.4} /> Deployed to staging
          </p>
        </div>
      )
    case 4:
      return (
        <ul className="wy-sc wy-auto">
          {['Follow-ups', 'Reminders', 'Weekly reports'].map((t, i) => (
            <li key={t} style={{ ['--i' as string]: i }}>
              <span>{t}</span>
              <b aria-hidden />
            </li>
          ))}
        </ul>
      )
    case 5:
      return (
        <div className="wy-sc wy-hub">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
            {[
              [16, 18],
              [84, 18],
              [16, 82],
              [84, 82],
            ].map(([x, y], i) => (
              <line key={i} x1={x} y1={y} x2="50" y2="50" style={{ ['--i' as string]: i }} />
            ))}
          </svg>
          {HUB.map((h, i) => (
            <span key={h} className="wy-sat" style={{ ['--i' as string]: i }}>
              {h}
            </span>
          ))}
          <span className="wy-core">CRM</span>
        </div>
      )
    default:
      return (
        <div className="wy-sc wy-live">
          <p className="wy-go">
            <span className="wy-go-btn">Go live</span>
            <span className="wy-go-on">
              <i /> Live
            </span>
          </p>
          <svg viewBox="0 0 200 50" className="wy-up" aria-hidden>
            <path d="M2 40 L30 34 L52 37 L78 22 L104 26 L130 14 L156 18 L198 6" pathLength={1} />
          </svg>
          <p className="wy-mon">
            <Icon name="pulse" size={13} /> Monitoring on
          </p>
        </div>
      )
  }
}

/**
 * "The IBW way": the seven steps of how we work, from the first message to launch day. The
 * section holds and the steps run sideways as you scroll, each card lit in its turn with its
 * scene playing; a rail underneath shows where you are and takes you to any step. For reduced
 * motion the cards stack, each playing as it comes into view.
 */
export function WayFlow() {
  const w = about.way
  const steps = process.steps
  const root = useRef<HTMLElement>(null)
  const st = useRef<ScrollTrigger | null>(null)
  const lenis = useLenis()

  useGSAP(
    () => {
      const section = root.current!
      const track = section.querySelector<HTMLElement>('[data-track]')!
      const panels = [...section.querySelectorAll<HTMLElement>('[data-step]')]
      const marks = [...section.querySelectorAll<HTMLElement>('[data-mark]')]
      const rail = section.querySelector<HTMLElement>('[data-rail]')!
      const end = section.querySelector<HTMLElement>('[data-end]')
      // a card's scene plays the first time the card is in hand, then stays done
      const light = (i: number) => {
        panels.forEach((p, k) => {
          p.classList.toggle('is-on', k === i)
          if (k === i) p.classList.add('is-seen')
        })
        // the closing card comes into hand with the last step, so the run ends on it lit, not dimmed
        end?.classList.toggle('is-on', i === panels.length - 1)
        marks.forEach((m, k) => m.classList.toggle('is-on', k <= i))
        rail.style.setProperty('--p', String(Math.max(0, i) / (panels.length - 1)))
      }
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        section.dataset.driven = ''
        const distance = () => Math.max(0, track.scrollWidth - section.clientWidth)
        let current = -1
        const tween = gsap.to(track, {
          x: () => -distance(),
          ease: 'none',
          // read on the tween's own frames, so the card in hand follows the track as the scrub settles:
          // the steps take equal shares of the way across, the first in hand at the start, the last at the end
          onUpdate() {
            const i = Math.round(this.progress() * (panels.length - 1))
            if (i !== current) light((current = i))
          },
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        })
        st.current = tween.scrollTrigger ?? null
        light((current = 0))
        return () => {
          st.current = null
          delete section.dataset.driven
          light(-1)
        }
      })
      // stacked (reduced motion): each card plays while it is in view
      mm.add('(prefers-reduced-motion: reduce)', () => {
        const io = new IntersectionObserver(
          (entries) =>
            entries.forEach((e) => {
              e.target.classList.toggle('is-on', e.isIntersecting)
              if (e.isIntersecting) e.target.classList.add('is-seen')
            }),
          { threshold: 0.6 },
        )
        panels.forEach((p) => io.observe(p))
        return () => io.disconnect()
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  // the rail takes you to a step: the point in the scroll where that step is in hand
  const go = (i: number) => {
    const t = st.current
    if (!t) return
    const y = t.start + (t.end - t.start) * (i / (process.steps.length - 1))
    if (lenis) lenis.scrollTo(y, { duration: 1.1 })
    else window.scrollTo({ top: y, behavior: 'smooth' })
  }

  return (
    <section ref={root} id="way" className="wy relative overflow-hidden bg-stage text-stage-ink" data-nav-tone="dark">
      <div aria-hidden className="absolute inset-0 [mask-image:radial-gradient(60%_50%_at_15%_0%,#000,transparent_75%)]">
        <div className="iso-grid [--grid:var(--stage-line)]" />
      </div>

      <div className="wy-frame relative">
        <div className="shell grid gap-5 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="eyebrow t-label text-stage-ink-2">
              <span className="eyebrow-dot" aria-hidden />
              <span>{w.eyebrow}</span>
            </p>
            <h2 className="t-h2 mt-[clamp(10px,2vh,16px)]">{w.title}</h2>
          </div>
          <p className="max-w-md text-[1rem] leading-relaxed text-stage-ink-2 lg:col-span-4 lg:col-start-9">{w.intro}</p>
        </div>

        <ol data-track className="wy-track">
          {steps.map((s, k) => (
            <li key={s.n} data-step className="wy-card">
              <div className="wy-scene">
                <Scene k={k} />
              </div>
              <div className="wy-copy">
                <p className="flex items-baseline justify-between gap-4">
                  <span className="wy-n">{s.n}</span>
                  <span className="t-label text-stage-ink-2">Step {k + 1} of {steps.length}</span>
                </p>
                <h3 className="wy-title">{s.title}</h3>
                <p className="wy-body">{s.body}</p>
                <p className="wy-get">
                  <span className="t-label text-stage-ink-2">You get</span>
                  <span>{s.get}</span>
                </p>
              </div>
            </li>
          ))}
          <li data-end className="wy-card wy-end">
            <p className="t-label text-teal">Your turn</p>
            <p className="wy-title">{w.aside.title}</p>
            <p className="wy-body">{w.aside.body}</p>
            <KeyButton href="/contact-us#contact-form" size="sm" variant="teal" className="mt-6 self-start">
              {w.aside.cta}
            </KeyButton>
          </li>
        </ol>

        {/* where you are in the seven, and a way to any of them */}
        <div data-rail className="wy-rail shell" aria-label="The seven steps">
          <span className="wy-rail-line" aria-hidden>
            <span />
          </span>
          {steps.map((s, k) => (
            <button key={s.n} type="button" data-mark className="wy-mark" onClick={() => go(k)}>
              <i aria-hidden />
              {s.title}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
