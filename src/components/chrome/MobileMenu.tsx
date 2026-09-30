'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState, type MouseEvent } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Icon } from '@/components/ui/Icon'
import { KeyButton } from '@/components/ui/KeyButton'
import { primaryNav, site } from '@/content/site'
import { services } from '@/content/services'
import { solutions } from '@/content/data'
import { products } from '@/content/products'
import { socialIcon } from '@/content/nav'

const ease = [0.16, 1, 0.3, 1] as const

type Sub = 'services' | 'solutions' | 'products'

const SUBLINKS: Record<Sub, { label: string; note?: string; href: string }[]> = {
  services: [...services.map((s) => ({ label: s.label, href: `/services#${s.id}` })), { label: 'All services', href: '/services' }],
  solutions: [...solutions.map((s) => ({ label: s.label, href: `/solutions/${s.slug}` })), { label: 'All solutions', href: '/solutions' }],
  products: [...products.map((p) => ({ label: p.name, note: p.short, href: `/products#${p.id}` })), { label: 'All products', href: '/products' }],
}

/**
 * The phone menu: a sheet of frosted glass that opens beneath the header bar, so the bar
 * (logo, theme switch, and the burger that is now its close button) never moves.
 */
export function MobileMenu({ onClose }: { onClose: () => void }) {
  const [open, setOpen] = useState<Sub | null>(null)
  const pathname = usePathname()

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
  // A link to the page you are already on closes the menu onto the top of that page.
  const go = (e: MouseEvent, href: string) => {
    if (href === pathname) {
      e.preventDefault()
      if (window.location.hash) history.replaceState(null, '', href)
      const lenis = (window as unknown as { __lenis?: { scrollTo(y: number, o?: object): void } }).__lenis
      if (lenis) lenis.scrollTo(0, { immediate: true, force: true })
      else window.scrollTo(0, 0)
    }
    onClose()
  }

  return (
    <motion.div
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      className="mobile-sheet fixed inset-0 z-[45] flex flex-col lg:hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.28, delay: 0.05 } }}
      transition={{ duration: 0.35, ease }}
    >
      <nav aria-label="Mobile" className="relative flex-1 overflow-y-auto px-[var(--gutter)] pb-10 pt-[88px]" data-lenis-prevent>
        <ul className="border-t border-line">
          {items.map((item, i) => {
            const sub = 'menu' in item && item.menu ? item.menu : null
            const expanded = sub !== null && open === sub
            const current = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
            return (
              <motion.li
                key={item.href}
                className="border-b border-line"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8, transition: { duration: 0.2 } }}
                transition={{ delay: 0.06 + i * 0.04, duration: 0.6, ease }}
              >
                <div className="flex items-center">
                  <Link
                    href={item.href}
                    onClick={(e) => go(e, item.href)}
                    aria-current={current ? 'page' : undefined}
                    className="group flex flex-1 items-baseline gap-4 py-[clamp(12px,2.1vh,16px)]"
                  >
                    <span className="t-label w-6 text-teal-ink">{String(i + 1).padStart(2, '0')}</span>
                    <span className="font-display text-[clamp(1.6rem,7.4vw,2rem)] font-bold leading-none tracking-[-0.035em] [font-stretch:108%]">
                      {item.label}
                    </span>
                    {current ? <span className="size-1.5 self-center rounded-full bg-teal" aria-hidden /> : null}
                  </Link>
                  {sub ? (
                    <button
                      type="button"
                      aria-expanded={expanded}
                      aria-label={`${expanded ? 'Hide' : 'Show'} ${item.label}`}
                      onClick={() => setOpen(expanded ? null : sub)}
                      className="grid size-10 place-items-center rounded-full border border-line-2 bg-raise/60 transition-[background-color,transform] duration-300 active:scale-95"
                    >
                      <Icon name="plus" size={16} className={expanded ? 'rotate-45 transition-transform duration-300' : 'transition-transform duration-300'} />
                    </button>
                  ) : null}
                </div>
                <AnimatePresence initial={false}>
                  {expanded && sub ? (
                    <motion.ul
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease }}
                      className="overflow-hidden pl-10"
                    >
                      {SUBLINKS[sub].map((l) => (
                        <li key={l.href}>
                          <Link href={l.href} onClick={onClose} className="flex items-baseline justify-between gap-3 py-2.5 text-[1.02rem] text-ink-2 active:text-ink">
                            <span>{l.label}</span>
                            {l.note ? <span className="t-label shrink-0 text-ink-3">{l.note}</span> : null}
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
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6, ease }}
        >
          <KeyButton href="/contact-us#contact-form" className="w-full justify-between" icon="calendar" onClick={onClose}>
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
