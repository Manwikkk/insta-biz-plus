'use client'

import { useSyncExternalStore } from 'react'

export type Theme = 'light' | 'dark'
const KEY = 'ibw-theme'

function read(): Theme {
  return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'
}

function subscribe(cb: () => void) {
  const mo = new MutationObserver(cb)
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
  return () => mo.disconnect()
}

/** Current theme; `light` during SSR (the inline head script corrects the DOM before paint). */
export function useTheme(): Theme {
  return useSyncExternalStore(subscribe, read, () => 'light')
}

/**
 * Switch theme. Where View Transitions exist, the new theme is revealed through a
 * hexagonal aperture (the IBW mark's silhouette) that opens from `origin`.
 */
export function setTheme(next: Theme, origin?: { x: number; y: number }) {
  const root = document.documentElement
  const apply = () => {
    root.setAttribute('data-theme', next)
    try {
      localStorage.setItem(KEY, next)
    } catch {}
  }
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
  const doc = document as Document & { startViewTransition?: (cb: () => void) => { finished: Promise<void> } }

  if (!doc.startViewTransition || reduce) {
    root.classList.add('theme-anim')
    apply()
    window.setTimeout(() => root.classList.remove('theme-anim'), 600)
    return
  }
  const x = origin?.x ?? window.innerWidth - 60
  const y = origin?.y ?? 40
  const r = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y)) * 1.25
  root.style.setProperty('--vt-x', `${x}px`)
  root.style.setProperty('--vt-y', `${y}px`)
  root.style.setProperty('--vt-r', `${r}px`)
  doc.startViewTransition(apply)
}
