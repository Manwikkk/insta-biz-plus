'use client'

import { useSyncExternalStore } from 'react'

/** Subscribe to a media query. Returns `fallback` during SSR. */
export function useMedia(query: string, fallback = false): boolean {
  return useSyncExternalStore(
    (cb) => {
      const m = matchMedia(query)
      m.addEventListener('change', cb)
      return () => m.removeEventListener('change', cb)
    },
    () => matchMedia(query).matches,
    () => fallback,
  )
}
