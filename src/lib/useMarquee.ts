'use client'

import { useCallback, useEffect, useRef } from 'react'

/**
 * A seamless marquee driven from JS so it can glide instead of snapping. The track holds
 * its run twice (two children) and moves by transform; the speed eases toward its target,
 * so `hold(true)` brings it smoothly to rest within a few frames and `hold(false)` brings
 * it back up to speed. It sleeps off-screen and in background tabs, and stays still for
 * reduced motion.
 *
 * `onFrame` (optional) runs after every frame the track moves, e.g. to re-check what sits
 * under a resting pointer while the content slides past it.
 */
export function useMarquee<T extends HTMLElement = HTMLDivElement>({
  speed,
  reverse = false,
  onFrame,
}: {
  /** px per second at full speed */
  speed: number
  reverse?: boolean
  onFrame?: () => void
}) {
  const trackRef = useRef<T>(null)
  const held = useRef(false)
  const wake = useRef<() => void>(() => {})
  const frameCb = useRef(onFrame)

  useEffect(() => {
    frameCb.current = onFrame
  })

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    const dir = reverse ? 1 : -1
    let x = 0
    let v = 0
    let span = 0
    let raf = 0
    let last = 0
    let onScreen = false

    // one run's length: where the second copy starts (robust to gaps and overhanging items)
    const measure = () => {
      const [a, b] = el.children as unknown as HTMLElement[]
      span = a && b ? b.offsetLeft - a.offsetLeft : el.scrollWidth / 2
    }
    const step = (t: number) => {
      raf = 0
      if (!onScreen || document.hidden) {
        last = 0
        return
      }
      const dt = last ? Math.min((t - last) / 1000, 1 / 24) : 0
      last = t
      const target = held.current || reduce.matches ? 0 : speed
      // settle quickly when asked to stop, pick up gently when released
      v += (target - v) * (1 - Math.exp(-(target < v ? 11 : 2.4) * dt))
      if (Math.abs(target - v) < 0.4) v = target
      if (v !== 0 && span > 0) {
        x += dir * v * dt
        x %= span
        if (x > 0) x -= span
        el.style.transform = `translate3d(${x.toFixed(2)}px,0,0)`
        frameCb.current?.()
      }
      if (v !== 0 || target !== 0) raf = requestAnimationFrame(step)
      else last = 0
    }
    const start = () => {
      if (!raf) raf = requestAnimationFrame(step)
    }
    wake.current = start

    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    if (el.firstElementChild) ro.observe(el.firstElementChild)
    const io = new IntersectionObserver(([e]) => {
      onScreen = e.isIntersecting
      start()
    })
    io.observe(el)
    document.addEventListener('visibilitychange', start)
    reduce.addEventListener('change', start)
    return () => {
      cancelAnimationFrame(raf)
      raf = 0
      wake.current = () => {}
      ro.disconnect()
      io.disconnect()
      document.removeEventListener('visibilitychange', start)
      reduce.removeEventListener('change', start)
    }
  }, [speed, reverse])

  const hold = useCallback((on: boolean) => {
    held.current = on
    wake.current()
  }, [])

  return { trackRef, hold }
}
