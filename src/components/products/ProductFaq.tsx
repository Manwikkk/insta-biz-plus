'use client'

import { useState } from 'react'
import { LayoutGroup, motion } from 'motion/react'
import { products } from '@/content/products'
import { Faq } from '@/components/sections/Faq'
import { Icon } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'

/** Each product's questions, one product at a time. */
export function ProductFaq() {
  const [i, setI] = useState(0)
  const p = products[i]
  return (
    <div>
      <LayoutGroup id="product-faq">
        <div role="tablist" aria-label="Product" className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
          {products.map((x, k) => (
            <button
              key={x.id}
              type="button"
              role="tab"
              aria-selected={k === i}
              onClick={() => setI(k)}
              className={cn(
                'relative inline-flex h-10 shrink-0 items-center gap-2 rounded-full border px-4 text-[0.92rem] font-medium transition-colors duration-300',
                k === i ? 'border-ink text-bg' : 'border-line-2 text-ink-2 hover:border-ink hover:text-ink',
              )}
            >
              {k === i ? (
                <motion.span layoutId="product-faq-tab" className="absolute inset-0 rounded-full bg-ink" transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }} />
              ) : null}
              <Icon name={x.icon} size={15} className="relative" />
              <span className="relative">{x.name}</span>
            </button>
          ))}
        </div>
      </LayoutGroup>
      <div className="mt-8">
        <Faq key={p.id} items={p.faqs} />
      </div>
    </div>
  )
}
