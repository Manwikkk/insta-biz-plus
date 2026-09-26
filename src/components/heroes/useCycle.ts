'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Steps through `count` states every `ms` while the element is on screen and not held
 * (pointer over it, or a choice just made). For reduced motion it stays put, on `rest`
 * when given (the most telling state) and otherwise on the first.
 */
export function useCycle<T extends HTMLElement = HTMLDivElement>(count: number, ms: number, rest?: number) {
  const ref = useRef<T>(null)
  const [i, setI] = useState(0)
  const [held, setHeld] = useState(false)
  const [visible, setVisible] = useState(false)

  // settle on the resting state once, on mount
  useEffect(() => {
    if (rest != null && matchMedia('(prefers-reduced-motion: reduce)').matches) setI(rest)
  }, [rest])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.15 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (held || !visible || count < 2) return
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    // restarted on every change, so a chosen state always gets a full turn
    const id = window.setTimeout(() => {
      if (!document.hidden) setI((v) => (v + 1) % count)
    }, ms)
    return () => window.clearTimeout(id)
  }, [held, visible, count, ms, i])

  return { ref, i, setI, held, hold: setHeld, running: visible && !held }
}
