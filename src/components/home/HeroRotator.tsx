'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'

const ease = [0.16, 1, 0.3, 1] as const
const easeIn = [0.55, 0, 0.75, 0.2] as const

/**
 * The hero's last word, cycling. Letters of the outgoing word lift a little and blur out, and
 * a beat later the next word rises into the same slot, one letter after another, so the two
 * words never pile up on each other. Once it starts turning, its line stops clipping (the clip
 * is only there for the opening rise), so no letter or blur is ever cut off.
 * The first word renders as plain text so the server-rendered h1 reads as one sentence.
 */
export function HeroRotator({ words, interval = 2800 }: { words: string[]; interval?: number }) {
  const [i, setI] = useState(0)
  const [split, setSplit] = useState(false)
  // Until the first swap, the opening word is already on screen: splitting it must not replay its entrance.
  const [cycled, setCycled] = useState(false)
  const reduce = useReducedMotion()
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (reduce || words.length < 2) return
    setSplit(true)
    let visible = true
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting))
    if (ref.current) io.observe(ref.current)
    const id = window.setInterval(() => {
      if (!visible || document.hidden) return
      setCycled(true)
      setI((v) => (v + 1) % words.length)
    }, interval)
    return () => {
      window.clearInterval(id)
      io.disconnect()
    }
  }, [reduce, words.length, interval])

  const word = words[i]
  return (
    // On the narrowest phones the longest word ("AI-First Brands.", ~7.1em) is capped to the column, never cut off.
    <span
      ref={ref}
      data-cycled={cycled || undefined}
      className="hero-rotator relative inline-grid align-top text-[length:min(1em,calc((100vw_-_2*var(--gutter))/7.2))] text-teal-ink"
    >
      <AnimatePresence initial={false}>
        <motion.span key={word} className="col-start-1 row-start-1 inline-flex whitespace-pre" initial="enter" animate="center" exit="exit">
          {split
            ? Array.from(word).map((ch, k) => (
                <motion.span
                  key={k}
                  // Each letter is its own layer, and a layer paints nothing past its box: with the h1's
                  // tight tracking (and tall caps on a 0.92 line) the ink overhangs the box, so the box
                  // reaches past the ink on every side (padding, cancelled by margin) and no edge is cut.
                  className="-mx-[0.1em] -my-[0.14em] inline-block px-[0.1em] py-[0.14em]"
                  // Each letter keeps its own layer for its whole life: no layer is dropped (and no glyph
                  // re-snapped to the pixel grid) as its blur ends, so the word settles without a shiver.
                  style={{ willChange: 'transform, opacity, filter' }}
                  initial={cycled ? undefined : false}
                  variants={{
                    enter: { y: '0.3em', opacity: 0, filter: 'blur(8px)' },
                    center: { y: 0, opacity: 1, filter: 'blur(0px)', transition: { delay: 0.24 + k * 0.026, duration: 0.7, ease } },
                    exit: { y: '-0.22em', opacity: 0, filter: 'blur(8px)', transition: { delay: k * 0.014, duration: 0.32, ease: easeIn } },
                  }}
                >
                  {ch === ' ' ? ' ' : ch}
                </motion.span>
              ))
            : word}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}
