'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Logo } from './Logo'
import { ThemeToggle } from './ThemeToggle'
import { Icon } from '@/components/ui/Icon'
import { KeyButton } from '@/components/ui/KeyButton'
import { primaryNav, site } from '@/content/site'
import { services } from '@/content/services'
import { solutions } from '@/content/data'
import { socialIcon } from '@/content/nav'
import { cn } from '@/lib/cn'

const ease = [0.16, 1, 0.3, 1] as const

export function MobileMenu({ onClose }: { onClose: () => void }) {
  const [open, setOpen] = useState<string | null>(null)

  useEffect(() => {
    const lenis = (window as unknown as { __lenis?: { stop(): void; start(): void } }).__lenis
    lenis?.stop()
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      lenis?.start()
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  const items = [{ label: 'Home', href: '/' }, ...primaryNav]

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      className="mobile-sheet fixed inset-0 z-[60] flex flex-col lg:hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.3 } }}
      transition={{ duration: 0.45, ease }}
    >
      {/* the same glass bar as the header, so opening the menu keeps the bar in place */}
      <div className="px-2.5 pt-2.5 sm:px-4 sm:pt-3">
        <div className="nav-glass nav-bar" data-scrolled="true">
          <div className="flex h-14 items-center gap-2 pl-4 pr-2">
            <Logo height={28} />
            <div className="ml-auto flex items-center gap-1.5">
              <ThemeToggle />
              <button type="button" aria-label="Close menu" onClick={onClose} className="nav-icon-btn">
                <Icon name="close" size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <nav aria-label="Mobile" className="relative flex-1 overflow-y-auto px-[var(--gutter)] pb-8 pt-4" data-lenis-prevent>
        <ul className="border-t border-line">
          {items.map((item, i) => {
            const sub = 'menu' in item && item.menu ? item.menu : null
            const expanded = sub !== null && open === sub
            return (
              <motion.li
                key={item.href}
                className="border-b border-line"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18 + i * 0.05, duration: 0.7, ease }}
              >
                <div className="flex items-center">
                  <Link href={item.href} onClick={onClose} className="flex flex-1 items-baseline gap-4 py-4">
                    <span className="t-label text-teal-ink">{String(i + 1).padStart(2, '0')}</span>
                    <span className="font-display text-[2rem] font-bold leading-none tracking-[-0.035em] [font-stretch:108%]">
                      {item.label}
                    </span>
                  </Link>
                  {sub ? (
                    <button
                      type="button"
                      aria-expanded={expanded}
                      aria-label={`Show ${item.label}`}
                      onClick={() => setOpen(expanded ? null : sub)}
                      className="grid size-10 place-items-center rounded-full border border-line-2 bg-raise/50 transition-colors hover:bg-raise"
                    >
                      <Icon name={expanded ? 'minus' : 'plus'} size={16} />
                    </button>
                  ) : null}
                </div>
                <AnimatePresence initial={false}>
                  {expanded ? (
                    <motion.ul
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.45, ease }}
                      className="overflow-hidden pl-9"
                    >
                      {(sub === 'services'
                        ? [
                            ...services.map((s) => ({ label: s.label, href: `/services#${s.id}` })),
                            { label: 'AI Agent Development', href: '/services/ai-agent-development' },
                          ]
                        : [
                            ...solutions.map((s) => ({ label: s.label, href: `/solutions/${s.slug}` })),
                            { label: 'All solutions', href: '/solutions' },
                          ]
                      ).map((l) => (
                        <li key={l.href}>
                          <Link href={l.href} onClick={onClose} className={cn('block py-2 text-[1.02rem] text-ink-2')}>
                            {l.label}
                          </Link>
                        </li>
                      ))}
                      <li className="h-3" />
                    </motion.ul>
                  ) : null}
                </AnimatePresence>
              </motion.li>
            )
          })}
        </ul>

        <motion.div
          className="mt-8 grid gap-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55, duration: 0.6 }}
        >
          <KeyButton href="/contact-us#contact-form" className="w-full justify-between" icon="calendar">
            Book a demo
          </KeyButton>
          <ul className="-ml-2 flex items-center gap-1" aria-label="Insta Biz Web on social media">
            {site.social.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="nav-social">
                  <Icon name={socialIcon[s.label] ?? 'external'} size={17} />
                </a>
              </li>
            ))}
          </ul>
          <div className="grid gap-2 text-sm text-ink-2">
            <a href={`mailto:${site.email}`} className="flex items-center gap-2">
              <Icon name="mail" size={16} /> {site.email}
            </a>
            <a href={site.phoneHref} className="flex items-center gap-2">
              <Icon name="phone" size={16} /> {site.phone}
            </a>
            <p className="t-label mt-2 text-ink-3">Ahmedabad, IN · Mon-Sat · 9-6</p>
          </div>
        </motion.div>
      </nav>
    </motion.div>
  )
}
