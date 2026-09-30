'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { screensOf, type Product } from '@/content/products'
import { cn } from '@/lib/cn'

const ease = [0.16, 1, 0.3, 1] as const

/**
 * A product's own screens, cross-fading one after another while `playing` (or, with
 * `whenVisible`, while on screen — how touch screens get the hover preview). The caption
 * names the feature on show.
 */
export function ProductScreens({
  product,
  playing = true,
  whenVisible = false,
  count = 4,
  interval = 2400,
  sizes = '360px',
  className,
  caption = true,
  priority = false,
}: {
  product: Product
  playing?: boolean
  whenVisible?: boolean
  count?: number
  interval?: number
  sizes?: string
  className?: string
  caption?: boolean
  priority?: boolean
}) {
  const frames = screensOf(product).slice(0, count)
  const [k, setK] = useState(0)
  const [seen, setSeen] = useState(false)
  const reduce = useReducedMotion()
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => setK(0), [product.id])

  useEffect(() => {
    if (!whenVisible || !root.current) return
    const io = new IntersectionObserver(([e]) => setSeen(e.isIntersecting), { threshold: 0.5 })
    io.observe(root.current)
    return () => io.disconnect()
  }, [whenVisible])

  const on = !reduce && (playing || (whenVisible && seen))
  useEffect(() => {
    if (!on) return
    const id = window.setInterval(() => setK((v) => (v + 1) % frames.length), interval)
    return () => window.clearInterval(id)
  }, [on, frames.length, interval, product.id])

  return (
    <div ref={root} className={className}>
      <div className="product-preview relative aspect-[1200/647] overflow-hidden rounded-[12px]">
        <AnimatePresence initial={false}>
          <motion.div
            key={frames[k]}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.035 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease }}
          >
            <Image
              src={frames[k]}
              alt={`${product.name} - ${product.features[k]?.kicker ?? product.short}`}
              fill
              sizes={sizes}
              quality={75}
              preload={priority && k === 0}
              className="object-cover object-top"
            />
          </motion.div>
        </AnimatePresence>
      </div>
      {caption ? (
        <div className="mt-3 flex items-center justify-between gap-3">
          <span className="t-label truncate text-ink-3">{product.features[k]?.kicker}</span>
          <span className="flex shrink-0 gap-1.5" aria-hidden>
            {frames.map((f, i) => (
              <span key={f} className={cn('h-1.5 rounded-full transition-all duration-500', i === k ? 'w-5 bg-teal' : 'w-1.5 bg-line-2')} />
            ))}
          </span>
        </div>
      ) : null}
    </div>
  )
}
