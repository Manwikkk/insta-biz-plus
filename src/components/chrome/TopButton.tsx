'use client'

import { useEffect, useState } from 'react'
import { useLenis } from '@/components/motion/SmoothScroll'
import { Icon } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'

/**
 * Phones and tablets: a small "back to the top" button in the bottom right. It fades in as you
 * scroll back up (well down a page) and fades away again as soon as you scroll down.
 */
export function TopButton() {
  const lenis = useLenis()
  const [on, setOn] = useState(false)
  useEffect(() => {
    let last = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      const dy = y - last
      if (Math.abs(dy) < 6) return
      setOn(dy < 0 && y > 600)
      last = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <button
      type="button"
      aria-label="Back to the top of the page"
      tabIndex={on ? 0 : -1}
      onClick={() => (lenis ? lenis.scrollTo(0, { duration: 1.4 }) : window.scrollTo({ top: 0, behavior: 'smooth' }))}
      className={cn('top-btn lg:hidden', on && 'is-on')}
    >
      <Icon name="arrow-down" size={18} strokeWidth={2} className="rotate-180" />
    </button>
  )
}
