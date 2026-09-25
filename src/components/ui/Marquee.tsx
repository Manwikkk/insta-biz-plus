'use client'

import type { ReactNode } from 'react'
import { useMarquee } from '@/lib/useMarquee'
import { cn } from '@/lib/cn'

/**
 * Continuous drift with masked edges that glides to a stop under the pointer. Content is
 * doubled so the loop is seamless; the copy is hidden from assistive tech.
 */
export function Marquee({
  children,
  speed = 48,
  reverse = false,
  className,
  trackClassName,
}: {
  children: ReactNode
  /** px per second */
  speed?: number
  reverse?: boolean
  className?: string
  trackClassName?: string
}) {
  const { trackRef, hold } = useMarquee<HTMLDivElement>({ speed, reverse })
  return (
    <div
      className={cn('fade-edges-x overflow-hidden motion-reduce:overflow-x-auto', className)}
      onPointerEnter={(e) => e.pointerType === 'mouse' && hold(true)}
      onPointerLeave={(e) => e.pointerType === 'mouse' && hold(false)}
    >
      <div ref={trackRef} className={cn('flex w-max will-change-transform', trackClassName)}>
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden inert>
          {children}
        </div>
      </div>
    </div>
  )
}
