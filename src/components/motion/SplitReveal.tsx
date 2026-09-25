'use client'

import { useRef, type ReactNode } from 'react'
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { cn } from '@/lib/cn'

gsap.registerPlugin(SplitText, ScrollTrigger, useGSAP)

/**
 * Headline reveal: each rendered line rises out of its own mask, like type being
 * set on a press. Lines are re-measured when fonts load or the width changes.
 */
export function SplitReveal({
  as,
  children,
  className,
  delay = 0,
  stagger = 0.1,
  start = 'top 86%',
  id,
}: {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'div'
  children: ReactNode
  className?: string
  delay?: number
  stagger?: number
  start?: string
  id?: string
}) {
  // All allowed tags share HTMLElement props; one concrete tag type keeps JSX typing simple.
  const Tag = (as ?? 'h2') as 'h2'
  const ref = useRef<HTMLHeadingElement>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return
      const root = document.documentElement
      if (root.classList.contains('reveal-off')) {
        el.classList.add('split-ready')
        return
      }
      const split = SplitText.create(el, {
        type: 'lines',
        mask: 'lines',
        linesClass: 'split-line',
        autoSplit: true,
        onSplit(self) {
          el.classList.add('split-ready')
          return gsap.from(self.lines, {
            yPercent: 112,
            rotate: 1.5,
            transformOrigin: '0% 100%',
            duration: 1.35,
            ease: 'expo.out',
            stagger,
            delay,
            scrollTrigger: { trigger: el, start, once: true },
          })
        },
      })
      return () => split.revert()
    },
    { scope: ref },
  )

  return (
    <Tag ref={ref} id={id} data-split className={cn(className)}>
      {children}
    </Tag>
  )
}
