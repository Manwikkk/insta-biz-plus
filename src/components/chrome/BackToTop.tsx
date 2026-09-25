'use client'

import { useLenis } from '@/components/motion/SmoothScroll'
import { Icon } from '@/components/ui/Icon'

export function BackToTop() {
  const lenis = useLenis()
  return (
    <button
      type="button"
      onClick={() => (lenis ? lenis.scrollTo(0, { duration: 1.6 }) : window.scrollTo({ top: 0, behavior: 'smooth' }))}
      className="group inline-flex items-center gap-2 text-ink-2 hover:text-ink"
    >
      <span className="t-label">Back to top</span>
      <span className="grid size-8 place-items-center rounded-[8px] border border-line-2 transition-colors group-hover:border-ink">
        <Icon name="arrow-down" size={14} className="rotate-180 transition-transform duration-500 group-hover:-translate-y-0.5" />
      </span>
    </button>
  )
}
