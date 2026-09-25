'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Logo } from './Logo'
import { ThemeToggle } from './ThemeToggle'
import { Icon } from '@/components/ui/Icon'
import { MobileMenu } from './MobileMenu'
import { primaryNav, locationLinks } from '@/content/site'
import { services } from '@/content/services'
import { solutionsIndex, solutions } from '@/content/data'
import { cn } from '@/lib/cn'

type MenuId = 'services' | 'solutions'

const ease = [0.16, 1, 0.3, 1] as const
const lensSpring = { type: 'spring', stiffness: 520, damping: 42, mass: 0.7 } as const
/** Vertical middle of the bar, where the section underneath is sampled. */
const PROBE_Y = 40

/**
 * A floating bar of frosted glass. A soft lens rests behind the current page and slides
 * to whichever link is under the pointer, returning when the pointer leaves. Services and
 * Solutions open as a second glass panel. Over dark sections the bar (and its panel)
 * switch to the dark palette so the glass always reads as glass rather than a grey film.
 */
export function Header() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [menu, setMenu] = useState<MenuId | null>(null)
  const [lens, setLens] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [overDark, setOverDark] = useState(false)
  const closeTimer = useRef<number | null>(null)
  const lastY = useRef(0)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 24)
      const dy = y - lastY.current
      if (Math.abs(dy) > 6) {
        setHidden(dy > 0 && y > 480)
        lastY.current = y
      }
      // Adaptive glass: over a dark section the bar takes the dark palette.
      let dark = false
      for (const el of document.querySelectorAll<HTMLElement>('[data-nav-tone="dark"]')) {
        const r = el.getBoundingClientRect()
        if (r.height > 0 && r.top <= PROBE_Y && r.bottom >= PROBE_Y) {
          dark = true
          break
        }
      }
      setOverDark(dark)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    // a new page may start under a dark section
    const t = window.setTimeout(onScroll, 60)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      window.clearTimeout(t)
    }
  }, [pathname])

  // Publish visibility so sticky sub-navs can sit flush under (or in place of) the header.
  const concealed = hidden && !menu && !mobileOpen
  useEffect(() => {
    document.documentElement.dataset.header = concealed ? 'hidden' : 'shown'
  }, [concealed])

  // Close everything on navigation.
  useEffect(() => {
    setMenu(null)
    setLens(null)
    setMobileOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!menu) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenu(null)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menu])

  const open = (id: MenuId) => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current)
    setMenu(id)
  }
  const scheduleClose = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current)
    closeTimer.current = window.setTimeout(() => setMenu(null), 160)
  }

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href))
  const items = [{ label: 'Home', href: '/' as string, menu: undefined as MenuId | undefined }, ...primaryNav]
  // The lens follows the pointer; with a panel open it rests on the item that opened it,
  // otherwise on the current page.
  const lensOn = lens ?? (menu ? items.find((i) => i.menu === menu)?.href : items.find((i) => isActive(i.href))?.href) ?? null

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 px-2.5 pt-2.5 transition-transform duration-500 ease-[var(--ease-out)] sm:px-4 sm:pt-3',
          concealed ? '-translate-y-[140%]' : 'translate-y-0',
        )}
        onMouseLeave={scheduleClose}
      >
        <div
          className={cn(
            'relative mx-auto transition-[max-width] duration-700 ease-[var(--ease-out)]',
            scrolled ? 'max-w-[1180px]' : 'max-w-[var(--shell-max)]',
          )}
          data-theme={overDark ? 'dark' : undefined}
        >
          <div className="nav-glass" data-scrolled={scrolled || !!menu}>
            <div className="flex h-14 items-center gap-2 pl-5 pr-2 lg:h-[60px] lg:gap-4 lg:pl-6 lg:pr-2.5">
              <Logo height={30} preload />

              <nav aria-label="Primary" className="mx-auto hidden items-center lg:flex" onMouseLeave={() => setLens(null)}>
                {items.map((item) => {
                  const active = isActive(item.href)
                  const expanded = !!item.menu && menu === item.menu
                  const cls = cn(
                    'nav-link relative z-[1] flex h-9 items-center gap-1 whitespace-nowrap rounded-full px-3 text-[0.9rem] font-medium tracking-[-0.005em] transition-colors duration-300 xl:px-4',
                    active || expanded || lensOn === item.href ? 'text-ink' : 'text-ink-2',
                  )
                  return (
                    <div
                      key={item.href}
                      className="relative"
                      onMouseEnter={() => {
                        setLens(item.href)
                        if (item.menu) open(item.menu)
                        else scheduleClose()
                      }}
                    >
                      {lensOn === item.href ? <motion.span layoutId="nav-lens" className="nav-lens" transition={lensSpring} /> : null}
                      {item.menu ? (
                        <button
                          type="button"
                          aria-expanded={expanded}
                          aria-controls="nav-panel"
                          onClick={() => setMenu((m) => (m === item.menu ? null : item.menu!))}
                          onFocus={() => setLens(item.href)}
                          className={cls}
                        >
                          {item.label}
                          <Icon
                            name="chevron"
                            size={13}
                            strokeWidth={2}
                            className={cn(
                              'text-ink-3 transition-transform duration-500 ease-[var(--ease-out)]',
                              expanded && 'rotate-180 text-ink',
                            )}
                          />
                        </button>
                      ) : (
                        <Link
                          href={item.href}
                          onFocus={() => setLens(item.href)}
                          className={cls}
                          aria-current={active ? 'page' : undefined}
                        >
                          {item.label}
                        </Link>
                      )}
                    </div>
                  )
                })}
              </nav>

              <div className="ml-auto flex items-center gap-1.5 lg:ml-0">
                <ThemeToggle />
                <Link href="/contact-us" className="nav-cta group ml-1 hidden sm:inline-flex">
                  <span>Contact Us</span>
                  <span className="nav-cta-arrow" aria-hidden>
                    <Icon name="arrow" size={15} strokeWidth={2} />
                  </span>
                </Link>
                <button
                  type="button"
                  aria-label="Open menu"
                  aria-expanded={mobileOpen}
                  onClick={() => setMobileOpen(true)}
                  className="nav-icon-btn lg:hidden"
                >
                  <span className="nav-burger" aria-hidden>
                    <span />
                    <span />
                  </span>
                </button>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {menu ? (
              <motion.div
                key="panel"
                initial={{ opacity: 0, y: -8, scale: 0.985 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.99, transition: { duration: 0.22 } }}
                transition={{ duration: 0.45, ease }}
                className="absolute inset-x-0 top-full hidden origin-top pt-2 lg:block"
                onMouseEnter={() => open(menu)}
              >
                <div id="nav-panel" className="nav-glass nav-panel">
                  <AutoHeight>
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.div
                        key={menu}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.22, ease }}
                      >
                        {menu === 'services' ? <ServicesPanel /> : <SolutionsPanel />}
                      </motion.div>
                    </AnimatePresence>
                  </AutoHeight>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </header>

      <AnimatePresence>{mobileOpen ? <MobileMenu onClose={() => setMobileOpen(false)} /> : null}</AnimatePresence>
    </>
  )
}

/** Eases the panel's height between Services and Solutions instead of jumping. */
function AutoHeight({ children }: { children: ReactNode }) {
  const inner = useRef<HTMLDivElement>(null)
  const [h, setH] = useState<number | null>(null)
  useLayoutEffect(() => {
    const el = inner.current
    if (!el) return
    const ro = new ResizeObserver(() => setH(el.offsetHeight))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return (
    <div className="overflow-hidden transition-[height] duration-500 ease-[var(--ease-out)]" style={{ height: h ?? 'auto' }}>
      <div ref={inner}>{children}</div>
    </div>
  )
}

function ServicesPanel() {
  return (
    <div className="grid grid-cols-12 gap-4 p-3">
      <div className="col-span-8">
        <p className="t-label mb-2 px-3 pt-2 text-ink-3">Six services · one growth partner</p>
        <ul className="grid grid-cols-2 gap-1">
          {services.map((s, i) => (
            <motion.li
              key={s.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.035 * i, duration: 0.5, ease }}
            >
              <Link href={`/services#${s.id}`} className="nav-item group flex gap-4 rounded-[16px] p-3">
                <span className="t-label mt-1 text-teal-ink">{s.n}</span>
                <span>
                  <span className="t-h4 block text-ink">{s.label}</span>
                  <span className="t-small mt-0.5 block">{s.line}</span>
                </span>
              </Link>
            </motion.li>
          ))}
        </ul>
      </div>
      <div className="col-span-4 flex flex-col gap-2">
        <Link href="/services/ai-agent-development" className="group relative overflow-hidden rounded-[16px] bg-stage p-5 text-stage-ink">
          <span className="iso-grid opacity-60 [--grid:var(--stage-line)]" />
          <span className="relative">
            <span className="t-label text-teal">Agentic AI</span>
            <span className="t-h3 mt-3 block">AI Agent Development</span>
            <span className="mt-2 block text-sm text-stage-ink-2">
              RAG chatbots, voice agents and multi-agent systems. From prototype in 7 days.
            </span>
            <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium">
              Explore <Icon name="arrow" size={15} className="transition-transform group-hover:translate-x-1" />
            </span>
          </span>
        </Link>
        <div className="rounded-[16px] border border-line p-4">
          <p className="t-label mb-2 text-ink-3">In Ahmedabad</p>
          <ul className="grid gap-1">
            {locationLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="link-draw text-sm text-ink-2 hover:text-ink">
                  {l.short}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

function SolutionsPanel() {
  const groups = solutionsIndex.groups
  return (
    <div className="grid grid-cols-12 gap-4 p-3">
      {groups.map((g, gi) => (
        <div key={g.title} className={gi === 0 ? 'col-span-8' : 'col-span-4'}>
          <p className="t-label mb-2 px-3 pt-2 text-ink-3">{g.title}</p>
          <ul className={cn('grid gap-1', gi === 0 ? 'grid-cols-2' : 'grid-cols-1')}>
            {g.items.map((it, i) => {
              const sol = solutions.find((s) => s.label === it.label)
              return (
                <motion.li
                  key={it.label}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.03 * i, duration: 0.5, ease }}
                >
                  <Link href={`/solutions/${sol?.slug ?? ''}`} className="nav-item block rounded-[16px] px-3 py-2.5">
                    <span className="block text-[0.95rem] font-semibold text-ink">{it.label}</span>
                    <span className="t-small block line-clamp-1">{it.summary}</span>
                  </Link>
                </motion.li>
              )
            })}
          </ul>
          {gi === 1 ? (
            <Link href="/solutions" className="mt-2 inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-teal-ink">
              Explore all solutions <Icon name="arrow" size={15} />
            </Link>
          ) : null}
        </div>
      ))}
    </div>
  )
}
