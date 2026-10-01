'use client'

import { useRef, type ReactNode } from 'react'
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { cn } from '@/lib/cn'

gsap.registerPlugin(SplitText, ScrollTrigger, useGSAP)

/**
 * Letters that arrive from everywhere and settle into the word: each one tumbles in from its
 * own angle, depth and slant, out of focus, in a random order. Plays at first paint
 * (`on="load"`) or as the text scrolls into view. Without motion the text is simply there.
 */
export function CharRise({
  as,
  children,
  className,
  on = 'scroll',
  delay = 0,
  start = 'top 82%',
  id,
}: {
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div'
  children: ReactNode
  className?: string
  on?: 'load' | 'scroll'
  delay?: number
  start?: string
  id?: string
}) {
  const Tag = (as ?? 'h2') as 'h2'
  const ref = useRef<HTMLHeadingElement>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return
      if (document.documentElement.classList.contains('reveal-off')) {
        el.classList.add('split-ready')
        return
      }
      const split = SplitText.create(el, { type: 'words,chars', charsClass: 'rise-char' })
      el.classList.add('split-ready')
      const r = gsap.utils.random
      gsap.from(split.chars, {
        opacity: 0,
        yPercent: () => r(40, 150),
        xPercent: () => r(-60, 60),
        rotateX: () => r(-110, -30),
        rotateY: () => r(-40, 40),
        rotateZ: () => r(-14, 14),
        skewX: () => r(-20, 20),
        z: () => r(-260, 140),
        filter: 'blur(10px)',
        duration: 1.5,
        ease: 'expo.out',
        delay,
        stagger: { each: 0.028, from: 'random' },
        clearProps: 'filter',
        ...(on === 'scroll' ? { scrollTrigger: { trigger: el, start, once: true } } : {}),
      })
      return () => split.revert()
    },
    { scope: ref },
  )

  return (
    <Tag ref={ref} id={id} data-split className={cn('rise', className)}>
      {children}
    </Tag>
  )
}
