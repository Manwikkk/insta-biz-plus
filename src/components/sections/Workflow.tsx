'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { cn } from '@/lib/cn'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export type FlowStep = { n: string; title: string; body: string }

/**
 * A workflow on one track: across the page on wide screens, down its side on narrower ones.
 * The track fills as you scroll and each step lights up as the fill reaches its node.
 */
export function Workflow({ steps, className }: { steps: FlowStep[]; className?: string }) {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const el = root.current!
      const track = el.querySelector<HTMLElement>('[data-track]')!
      const fill = el.querySelector<HTMLElement>('[data-track-fill]')!
      const items = [...el.querySelectorAll<HTMLElement>('[data-step]')]
      const mm = gsap.matchMedia()
      mm.add({ across: '(min-width: 1280px)', motion: '(prefers-reduced-motion: no-preference)' }, (ctx) => {
        const { across, motion } = ctx.conditions as { across: boolean; motion: boolean }
        if (!motion) return
        // where each node sits along the track (0…1), from layout offsets so reveal transforms don't skew it
        let at: number[] = []
        const measure = () => {
          at = items.map((s) => {
            const n = s.querySelector<HTMLElement>('[data-node]')!
            return across
              ? (s.offsetLeft + n.offsetLeft + n.offsetWidth / 2 - track.offsetLeft) / track.offsetWidth
              : (s.offsetTop + n.offsetTop + n.offsetHeight / 2 - track.offsetTop) / track.offsetHeight
          })
        }
        measure()
        const axis = across ? 'scaleX' : 'scaleY'
        gsap.fromTo(
          fill,
          { [axis]: 0 },
          {
            [axis]: 1,
            ease: 'none',
            scrollTrigger: { trigger: el, start: 'top 75%', end: 'bottom 60%', scrub: 0.5, onRefresh: measure },
            onUpdate() {
              const p = this.progress()
              items.forEach((s, i) => s.classList.toggle('is-lit', p >= at[i] - 0.005))
            },
          },
        )
        return () => items.forEach((s) => s.classList.remove('is-lit'))
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <div ref={root} className={cn('flow', className)} style={{ ['--n' as string]: steps.length }}>
      <div data-track className="flow-track" aria-hidden>
        <span data-track-fill className="flow-fill" />
      </div>
      <ol className="flow-steps">
        {steps.map((s, i) => (
          <li key={s.n} data-step className="flow-step" data-reveal="rise" style={{ ['--d' as string]: `${(i % 4) * 60}ms` }}>
            <span data-node className="flow-node" aria-hidden />
            <div>
              <p className="flow-num t-numeral">{s.n}</p>
              <h3 className="flow-title">{s.title}</h3>
            </div>
            <p className="flow-body">{s.body}</p>
          </li>
        ))}
      </ol>
    </div>
  )
}
