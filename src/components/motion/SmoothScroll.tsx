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
 * Bring the element a `#hash` names to the top of the screen, clear of the header (Lenis, like
 * the browser, allows for the page's scroll padding and the element's scroll margin). `force`
 * so it works while a menu has the scroll paused.
 */
function toHash(lenis: Lenis | null, hash: string, immediate: boolean) {
  const id = decodeURIComponent(hash.replace(/^#/, ''))
  const el = id ? document.getElementById(id) : null
  if (!el) return
  if (lenis) lenis.scrollTo(el, { immediate, force: true })
  else el.scrollIntoView({ behavior: immediate ? 'auto' : 'smooth' })
}

/**
 * Lenis drives the scroll; GSAP's ticker drives Lenis so ScrollTrigger scrubs stay
 * frame-locked with the smoothed position. On touch devices it drives the touch scroll too, slowed.
 *
 * Links to a section (`/products#ping`, `#contact-form`) are taken here rather than left to
 * the browser: on this page they glide there; from another page they land on it, and land
 * again once the new page has measured itself (pinned scenes add height above the target).
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null)
  const pathname = usePathname()
  const first = useRef(true)

  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    // A heavier glide: lower lerp and a softer wheel step, so scroll-driven scenes unfold at a calmer pace.
    // Phones and tablets: Lenis takes the touch scroll as well, 40% slower than the finger, so every
    // scroll-driven scene there plays 40% slower; rows that scroll sideways keep their own swipe.
    const touch = matchMedia('(pointer: coarse)').matches
    const instance = new Lenis({
      lerp: 0.07,
      wheelMultiplier: 0.8,
      syncTouch: touch,
      touchMultiplier: touch ? 0.6 : 1,
      allowNestedScroll: true,
      smoothWheel: true,
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

  // A link to a section of this page: glide to it and keep the address in step.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const a = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null
      if (!a || (a.target && a.target !== '_self')) return
      const url = new URL(a.href, location.href)
      if (url.origin !== location.origin || url.pathname !== location.pathname || !url.hash) return
      if (!document.getElementById(decodeURIComponent(url.hash.slice(1)))) return
      e.preventDefault()
      if (url.hash !== location.hash) history.pushState(null, '', url.hash)
      // A menu may be closing over the page with the scroll paused; restarting the scroll would
      // cut a glide short, so wait until it has closed (or give up waiting after ~1.5s).
      const go = (tries: number) => {
        if (lenis?.isStopped && tries < 30) window.setTimeout(() => go(tries + 1), 50)
        else toHash(lenis, url.hash, false)
      }
      window.setTimeout(() => go(0), 40)
    }
    // capture: ahead of the link's own navigation
    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [lenis])

  // New route: start at the top, or at the section the address names (again once the page
  // has settled, unless the reader has started scrolling), and re-measure triggers.
  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    const hash = window.location.hash
    if (!hash) lenis?.scrollTo(0, { immediate: true, force: true })
    let moved = false
    const stop = () => {
      moved = true
    }
    window.addEventListener('wheel', stop, { passive: true, once: true })
    window.addEventListener('touchstart', stop, { passive: true, once: true })
    const land = () => {
      if (hash && !moved) toHash(lenis, hash, true)
    }
    land()
    const a = window.setTimeout(() => {
      ScrollTrigger.refresh()
      land()
    }, 120)
    const b = window.setTimeout(land, 700)
    return () => {
      window.clearTimeout(a)
      window.clearTimeout(b)
      window.removeEventListener('wheel', stop)
      window.removeEventListener('touchstart', stop)
    }
  }, [pathname, lenis])

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
}
