import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/** A resting point: where it sits in the scroll (0…1 of the trigger) and on the timeline. */
export type Stop = { at: number; time: number }

/** Phones, tablets and touch screens: scroll scenes play in whole steps rather than following the finger. */
export const STEPPED = '(max-width: 1023px), (pointer: coarse)'

/** Stops that sit on the scroll exactly where the timeline would have been scrubbed to them. */
export const stopsAt = (tl: gsap.core.Animation, times: number[]): Stop[] => times.map((time) => ({ at: time / tl.duration(), time }))

/**
 * Plays a scroll-driven timeline in whole steps. The playhead never follows the finger, so a line
 * is never left half risen or half blurred: once the scroll is a third of the way to the next stop,
 * in whichever direction it is going, the timeline plays on to that stop at its own pace (`speed`
 * seconds per unit of timeline, eased by `ease`). `onStep` hears which stop it is heading for.
 * `invalidate` re-reads measured (function) values whenever the page is re-measured.
 */
export function scrollSteps(
  tl: gsap.core.Animation,
  stops: Stop[] | (() => Stop[]),
  vars: ScrollTrigger.Vars,
  {
    speed = 4.5,
    ease = 'power2.out',
    invalidate = false,
    onStep,
  }: { speed?: number; ease?: string; invalidate?: boolean; onStep?: (i: number) => void } = {},
) {
  tl.pause()
  // stops given as a function are measured from the layout, again on every refresh
  const measure = () => (typeof stops === 'function' ? stops() : stops)
  let list = measure()
  let at = -1
  let play: gsap.core.Tween | null = null
  const go = (i: number, instant: boolean) => {
    if (i === at && !instant) return
    at = i
    onStep?.(i)
    play?.kill()
    const time = list[i].time
    if (instant) {
      // back to the start first, so values re-read on the way forward are taken from the start
      tl.time(0)
      if (invalidate) tl.invalidate()
      tl.time(time)
      return
    }
    const duration = gsap.utils.clamp(0.4, 1.2, Math.abs(time - tl.time()) * speed)
    play = gsap.to(tl, { time, duration, ease, lazy: false, overwrite: true })
  }
  const reached = (p: number, lean: number) => {
    let i = 0
    while (i < list.length - 1 && p > list[i].at + (list[i + 1].at - list[i].at) * lean) i++
    return i
  }
  const st = ScrollTrigger.create({
    ...vars,
    onRefresh: (self) => {
      vars.onRefresh?.(self)
      list = measure()
      go(reached(self.progress, 0.5), true)
    },
    onUpdate: (self) => {
      vars.onUpdate?.(self)
      go(reached(self.progress, self.direction > 0 ? 1 / 3 : 2 / 3), false)
    },
  })
  return {
    st,
    /** Cleanup: stops a step mid-play as well as the trigger. */
    kill: () => {
      play?.kill()
      st.kill()
    },
  }
}
