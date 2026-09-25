'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import { askInForm } from '@/components/forms/LeadForm'
import { KeyAction } from '@/components/ui/KeyButton'
import { cn } from '@/lib/cn'

/**
 * "Pick the modules you need today, add more tomorrow." Toggle modules like switches
 * on a panel; "Plan my modules" drops the selection into the enquiry form.
 */
export function ModuleBoard({ modules, product }: { modules: string[]; product: string }) {
  const [on, setOn] = useState<string[]>(modules.slice(0, 3))
  const toggle = (m: string) => setOn((v) => (v.includes(m) ? v.filter((x) => x !== m) : [...v, m]))
  return (
    <div className="rounded-[18px] border border-line bg-raise">
      <div className="flex items-center justify-between border-b border-line px-5 py-3">
        <span className="t-label text-ink-3">Module planner · {product}</span>
        <span className="t-label text-ink-2">
          <motion.span
            key={on.length}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block text-teal-ink"
          >
            {String(on.length).padStart(2, '0')}
          </motion.span>{' '}
          / {String(modules.length).padStart(2, '0')} selected
        </span>
      </div>
      <ul className="grid grid-cols-2 gap-px bg-line sm:grid-cols-3">
        {modules.map((m) => {
          const active = on.includes(m)
          return (
            <li key={m} className="bg-raise">
              <button
                type="button"
                aria-pressed={active}
                onClick={() => toggle(m)}
                className={cn(
                  'group flex h-full w-full items-center gap-3 px-4 py-4 text-left transition-colors duration-300',
                  active ? 'bg-ink text-bg' : 'hover:bg-bg',
                )}
              >
                <span
                  className={cn(
                    'relative h-5 w-9 shrink-0 rounded-full border transition-colors duration-300',
                    active ? 'border-teal bg-teal' : 'border-line-2 bg-sink',
                  )}
                >
                  <span
                    className={cn(
                      'absolute top-1/2 size-3.5 -translate-y-1/2 rounded-full transition-[left,background-color] duration-300 ease-[var(--ease-out)]',
                      active ? 'left-[18px] bg-[#04161a]' : 'left-[2px] bg-ink-3',
                    )}
                  />
                </span>
                <span className="text-[0.92rem] font-medium leading-tight">{m}</span>
              </button>
            </li>
          )
        })}
      </ul>
      <div className="flex flex-col gap-4 border-t border-line px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="t-small">
          Start with the modules that solve your biggest problems first. The system is modular, so new features plug in without disrupting
          what your team already uses.
        </p>
        <KeyAction
          type="button"
          size="sm"
          disabled={!on.length}
          onClick={() => askInForm(`Modules I'm interested in for ${product}: ${on.join(', ')}.`)}
          className="shrink-0 disabled:opacity-60"
        >
          Plan my modules
        </KeyAction>
      </div>
    </div>
  )
}
