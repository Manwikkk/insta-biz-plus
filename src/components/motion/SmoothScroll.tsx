'use client'

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const LenisContext = createContext<Lenis | null>(null)
export const useLenis = () => useContext(LenisContext)

/**
 * Lenis drives the scroll; GSAP's ticker drives Lenis so ScrollTrigger scrubs stay
 * frame-locked with the smoothed position. Touch devices keep native inertia.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null)
  const pathname = usePathname()
  const first = useRef(true)

  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    // A heavier glide: lower lerp and a softer wheel step, so scroll-driven scenes unfold at a calmer pace.
    const instance = new Lenis({
      lerp: 0.07,
      wheelMultiplier: 0.8,
      touchMultiplier: 1.2,
      smoothWheel: true,
      anchors: { offset: -96 },
      stopInertiaOnNavigate: true,
    })
    instance.on('scroll', ScrollTrigger.update)
    const tick = (time: number) => instance.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    setLenis(instance)
    ;(window as unknown as { __lenis?: Lenis }).__lenis = instance
    return () => {
      gsap.ticker.remove(tick)
      instance.destroy()
      setLenis(null)
    }
  }, [])

  // New route: start at the top (or at the hash target) and re-measure triggers.
  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    const hash = window.location.hash
    if (!hash) lenis?.scrollTo(0, { immediate: true, force: true })
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 120)
    return () => window.clearTimeout(id)
  }, [pathname, lenis])

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
}
