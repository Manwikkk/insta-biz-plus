'use client'

import { useId, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Icon } from '@/components/ui/Icon'
import { askInForm } from '@/components/forms/LeadForm'
import { cn } from '@/lib/cn'
import { Markdownish } from '@/components/ui/Markdownish'

const ease = [0.16, 1, 0.3, 1] as const

function Item({ q, a, open, onToggle, n }: { q: string; a: string; open: boolean; onToggle: () => void; n: number }) {
  const id = useId()
  return (
    <li className="border-b border-line">
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={onToggle}
          className="group flex w-full items-start gap-5 py-6 text-left"
        >
          <span className="t-label mt-1.5 w-7 shrink-0 text-ink-3">{String(n).padStart(2, '0')}</span>
          <span
            className={cn(
              'flex-1 text-[1.12rem] font-semibold leading-snug tracking-[-0.01em] transition-colors',
              open ? 'text-ink' : 'text-ink-2 group-hover:text-ink',
            )}
          >
            {q}
          </span>
          <span
            className={cn(
              'grid size-9 shrink-0 place-items-center rounded-[9px] border transition-[background-color,border-color,color] duration-500 ease-[var(--ease-out)]',
              open ? 'border-ink bg-ink text-bg' : 'border-line-2 text-ink group-hover:border-ink',
            )}
          >
            <Icon
              name="plus"
              size={16}
              className={cn('transition-transform duration-500 ease-[var(--ease-out)]', open ? 'rotate-[135deg]' : 'group-hover:rotate-90')}
            />
          </span>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            id={id}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease }}
            className="overflow-hidden"
          >
            <div className="pb-7 pl-12 pr-14 text-[1rem] leading-relaxed text-ink-2">
              <Markdownish text={a} />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </li>
  )
}

/**
 * FAQ list. Answered questions expand in place. Questions the site lists without a
 * published answer become prompts that drop the question into the contact form.
 */
export function Faq({
  items,
  asked = [],
  askedLabel = 'More questions founders ask. Tap one to send it to us.',
  firstOpen = true,
}: {
  items: { q: string; a: string }[]
  asked?: string[]
  askedLabel?: string
  firstOpen?: boolean
}) {
  const [open, setOpen] = useState<number | null>(firstOpen ? 0 : null)
  return (
    <div>
      <ul className="border-t border-line">
        {items.map((it, i) => (
          <Item key={it.q} n={i + 1} q={it.q} a={it.a} open={open === i} onToggle={() => setOpen(open === i ? null : i)} />
        ))}
      </ul>
      {asked.length ? (
        <div className="mt-10">
          <p className="t-label text-ink-3">{askedLabel}</p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {asked.map((q) => (
              <li key={q}>
                <button
                  type="button"
                  onClick={() => askInForm(q)}
                  className="group inline-flex items-center gap-2 rounded-[9px] border border-line-2 px-3.5 py-2 text-left text-[0.92rem] text-ink-2 transition-colors hover:border-ink hover:text-ink"
                >
                  {q}
                  <Icon
                    name="arrow-up-right"
                    size={14}
                    className="shrink-0 text-teal-ink transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  )
}
