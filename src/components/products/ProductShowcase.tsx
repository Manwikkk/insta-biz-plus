'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { products } from '@/content/products'
import { Icon } from '@/components/ui/Icon'
import { Odometer } from '@/components/ui/Odometer'
import { cn } from '@/lib/cn'

const ease = [0.16, 1, 0.3, 1] as const
const host = (href: string) => new URL(href).hostname

/**
 * Hero figure for /products: one browser window with a tab for each product. The tabs
 * take turns (each tab's rule fills while it is on) and wait while the pointer rests on
 * the window; picking a tab jumps to it. A figure from that product rides on the frame.
 */
export function ProductShowcase() {
  const [i, setI] = useState(0)
  const [dir, setDir] = useState(1)
  const [paused, setPaused] = useState(false)
  const p = products[i]
  const go = (k: number) => {
    setDir(k > i || (i === products.length - 1 && k === 0) ? 1 : -1)
    setI(k)
  }

  return (
    <div
      className="showcase relative"
      data-paused={paused || undefined}
      onPointerEnter={(e) => e.pointerType === 'mouse' && setPaused(true)}
      onPointerLeave={(e) => e.pointerType === 'mouse' && setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="showcase-window overflow-hidden rounded-[18px] border border-line bg-raise">
        <div className="flex items-center gap-3 border-b border-line bg-sink/60 pl-4 pr-2">
          <span className="hidden gap-1.5 sm:flex" aria-hidden>
            <span className="size-2.5 rounded-full bg-line-2" />
            <span className="size-2.5 rounded-full bg-line-2" />
            <span className="size-2.5 rounded-full bg-line-2" />
          </span>
          <div role="tablist" aria-label="Products" className="flex min-w-0 flex-1 overflow-x-auto [scrollbar-width:none]">
            {products.map((x, k) => (
              <button
                key={x.id}
                type="button"
                role="tab"
                aria-selected={k === i}
                onClick={() => go(k)}
                className={cn('showcase-tab', k === i && 'is-on')}
              >
                <Icon name={x.icon} size={15} />
                {x.name}
                <span
                  className="showcase-tab-bar"
                  aria-hidden
                  onAnimationEnd={() => {
                    if (k === i) go((i + 1) % products.length)
                  }}
                />
              </button>
            ))}
          </div>
        </div>
        <div className="relative aspect-[1200/647] overflow-hidden bg-stage">
          <AnimatePresence initial={false} custom={dir}>
            <motion.div
              key={p.id}
              custom={dir}
              className="absolute inset-0"
              variants={{
                enter: (d: number) => ({ opacity: 0, x: `${d * 6}%`, scale: 1.02 }),
                center: { opacity: 1, x: '0%', scale: 1 },
                exit: (d: number) => ({ opacity: 0, x: `${d * -4}%`, scale: 0.99 }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.8, ease }}
            >
              <Image
                src={`/products/${p.id}-1.webp`}
                alt={`${p.fullName} - ${p.short}`}
                fill
                sizes="(min-width: 1024px) 640px, 92vw"
                quality={75}
                // every tab's screen shows above the fold, so none waits for lazy loading
                loading="eager"
                fetchPriority={i === 0 ? 'high' : 'auto'}
                className="object-cover object-top"
              />
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3">
          <span className="t-label flex min-w-0 items-center gap-2 text-ink-3">
            <Icon name="lock" size={13} />
            <span className="truncate">{host(p.href)}</span>
          </span>
          <Link href="/contact-us#contact-form" className="t-label group inline-flex items-center gap-1.5 text-teal-ink">
            <span className="link-draw">Get a quote</span>
            <Icon name="arrow" size={13} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>

      {/* a figure from the product on show, riding on the frame */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={p.id}
          initial={{ opacity: 0, y: 14, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.98 }}
          transition={{ duration: 0.5, ease }}
          className="showcase-chip absolute -bottom-5 left-4 max-w-[min(260px,70%)] rounded-[14px] px-4 py-3 sm:-left-6 sm:bottom-14"
        >
          <p className="t-num text-[1.7rem] text-ink">
            <Odometer value={p.impact[0].value} />
          </p>
          <p className="mt-1 text-[0.8rem] leading-snug text-ink-2">{p.impact[0].label}</p>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
