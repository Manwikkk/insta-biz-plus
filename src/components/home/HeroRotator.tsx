'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'

const ease = [0.16, 1, 0.3, 1] as const
const easeIn = [0.55, 0, 0.75, 0.2] as const

/**
 * The hero's last word, cycling. Letters of the outgoing word lift away and blur out
 * while the next word rises into the same slot, one letter after another.
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
    <span ref={ref} className="hero-rotator relative inline-grid align-top text-teal-ink">
      <AnimatePresence initial={false}>
        <motion.span key={word} className="col-start-1 row-start-1 inline-flex whitespace-pre" initial="enter" animate="center" exit="exit">
          {split
            ? Array.from(word).map((ch, k) => (
                <motion.span
                  key={k}
                  className="inline-block"
                  initial={cycled ? undefined : false}
                  variants={{
                    enter: { y: '0.85em', opacity: 0, filter: 'blur(10px)' },
                    center: { y: 0, opacity: 1, filter: 'blur(0px)', transition: { delay: 0.12 + k * 0.03, duration: 0.8, ease } },
                    exit: { y: '-0.7em', opacity: 0, filter: 'blur(10px)', transition: { delay: k * 0.018, duration: 0.45, ease: easeIn } },
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
