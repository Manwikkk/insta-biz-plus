'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

/**
 * Adds `.is-in` to [data-reveal] elements as they enter the viewport. Elements are
 * only hidden when <html> carries `.js` (set before paint), so content never depends
 * on this script to be readable.
 */
export function RevealObserver() {
  const pathname = usePathname()

  useEffect(() => {
    const root = document.documentElement
    root.classList.add('io-ready')
    if (root.classList.contains('reveal-off')) return

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('is-in')
            io.unobserve(e.target)
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
    )
    const scan = () => document.querySelectorAll('[data-reveal]:not(.is-in)').forEach((el) => io.observe(el))
    scan()
    // Content streamed or toggled in later (filters, tabs) gets observed too.
    const mo = new MutationObserver(() => scan())
    mo.observe(document.body, { childList: true, subtree: true })
    return () => {
      io.disconnect()
      mo.disconnect()
    }
  }, [pathname])

  return null
}
