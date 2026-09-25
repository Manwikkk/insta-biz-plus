'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, LayoutGroup, MotionConfig, motion } from 'motion/react'
import { Logo } from './Logo'
import { ThemeToggle } from './ThemeToggle'
import { Icon, type IconName } from '@/components/ui/Icon'
import { MobileMenu } from './MobileMenu'
import { primaryNav, locationLinks, site } from '@/content/site'
import { services } from '@/content/services'
import { solutionsIndex, solutions } from '@/content/data'
import { locationIcon, serviceIcon, socialIcon, solutionIcon } from '@/content/nav'
import { cn } from '@/lib/cn'

type MenuId = 'services' | 'solutions'

const ease = [0.16, 1, 0.3, 1] as const
const easeIn = [0.55, 0, 0.75, 0.2] as const
const lensSpring = { type: 'spring', stiffness: 520, damping: 42, mass: 0.7 } as const
/** Vertical middle of the bar, where the section underneath is sampled. */
const PROBE_Y = 40
/** The menus open in this order; switching slides the content the way the pointer travelled. */
const ORDER: MenuId[] = ['services', 'solutions']

/** On the bar: everything but Contact, which the "Book a demo" button already is. */
const LINKS = primaryNav.filter((n) => n.href !== '/contact-us')
const AHMEDABAD = new Set(locationLinks.map((l) => l.href))

/**
 * A floating bar of frosted glass: the pages on the left, the logo at the centre, the
 * socials, theme switch and "Book a demo" on the right. Services and Solutions open a
 * second glass panel with titles only, and the page behind softens while it is open.
 * Over dark sections the bar (and its panel) take the dark palette so the glass always
 * reads as glass.
 */
export function Header() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [menu, setMenu] = useState<MenuId | null>(null)
  const [dir, setDir] = useState(1)
  const [lens, setLens] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [overDark, setOverDark] = useState(false)
  const closeTimer = useRef<number | null>(null)
  const lastY = useRef(0)
  const headerRef = useRef<HTMLElement>(null)

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
    setMenu((m) => {
      if (m && m !== id) setDir(ORDER.indexOf(id) > ORDER.indexOf(m) ? 1 : -1)
      return id
    })
  }
  const scheduleClose = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current)
    closeTimer.current = window.setTimeout(() => setMenu(null), 160)
  }

  const isActive = (href: string) => {
    if (href === '/services') return pathname.startsWith('/services') || AHMEDABAD.has(pathname)
    return pathname.startsWith(href)
  }
  // The lens follows the pointer; with a panel open it rests on the item that opened it,
  // otherwise on the current page.
  const lensOn = lens ?? (menu ? LINKS.find((i) => i.menu === menu)?.href : LINKS.find((i) => isActive(i.href))?.href) ?? null

  return (
    <MotionConfig reducedMotion="user">
      {/* the page softens behind an open menu */}
      <AnimatePresence>
        {menu ? (
          <motion.div
            key="scrim"
            aria-hidden
            className="nav-scrim fixed inset-0 z-40 hidden lg:block"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
            transition={{ duration: 0.45, ease }}
            onClick={() => setMenu(null)}
          />
        ) : null}
      </AnimatePresence>

      <header
        ref={headerRef}
        className={cn(
          'fixed inset-x-0 top-0 z-50 px-2.5 pt-2.5 transition-transform duration-500 ease-[var(--ease-out)] sm:px-4 sm:pt-3 lg:px-8',
          concealed ? '-translate-y-[140%]' : 'translate-y-0',
        )}
        onMouseLeave={scheduleClose}
        onBlur={(e) => {
          // keyboard: leaving the header (bar and panel) closes the menu
          if (menu && !headerRef.current?.contains(e.relatedTarget as Node | null)) setMenu(null)
        }}
      >
        <div className="relative mx-auto max-w-[1200px]" data-theme={overDark ? 'dark' : undefined}>
          <div className="nav-glass nav-bar" data-scrolled={scrolled || !!menu}>
            <div className="flex h-14 items-center gap-2 pl-4 pr-2 lg:grid lg:h-[58px] lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:gap-4 lg:px-3">
              {/* left: the pages */}
              <nav aria-label="Primary" className="hidden min-w-0 items-center lg:flex" onMouseLeave={() => setLens(null)}>
                {LINKS.map((item) => {
                  const active = isActive(item.href)
                  const expanded = !!item.menu && menu === item.menu
                  const cls = cn(
                    'nav-link relative z-[1] flex h-9 items-center gap-1 whitespace-nowrap rounded-full px-2 text-[0.875rem] font-medium tracking-[-0.01em] transition-colors duration-300 xl:px-3.5',
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
                          onClick={() => (expanded ? setMenu(null) : open(item.menu!))}
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

              {/* centre: the logo */}
              <div className="shrink-0 lg:justify-self-center">
                <Logo height={28} preload />
              </div>

              {/* right: socials, theme, the call to action */}
              <div className="ml-auto flex items-center gap-1 lg:ml-0 lg:justify-self-end">
                <ul className="hidden items-center lg:flex" aria-label="Insta Biz Web on social media">
                  {site.social.map((s) => (
                    <li key={s.label}>
                      <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="nav-social">
                        <Icon name={socialIcon[s.label] ?? 'external'} size={16} />
                      </a>
                    </li>
                  ))}
                </ul>
                <span className="mx-1 hidden h-5 w-px bg-line-2 lg:block" aria-hidden />
                <ThemeToggle />
                <Link href="/contact-us#contact-form" className="nav-cta ml-1 hidden sm:inline-flex">
                  <Icon name="calendar" size={16} strokeWidth={1.8} />
                  <span>Book a demo</span>
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
                initial={{ opacity: 0, y: -10, scale: 0.985 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.99, transition: { duration: 0.24, ease: easeIn } }}
                transition={{ duration: 0.55, ease }}
                className="absolute inset-x-0 top-full hidden origin-top pt-2 lg:block"
                onMouseEnter={() => open(menu)}
              >
                <div id="nav-panel" className="nav-glass nav-panel">
                  <AutoHeight>
                    <AnimatePresence mode="popLayout" initial={false} custom={dir}>
                      <motion.div
                        key={menu}
                        custom={dir}
                        variants={{
                          enter: (d: number) => ({ opacity: 0, x: d * 28 }),
                          center: { opacity: 1, x: 0 },
                          exit: (d: number) => ({ opacity: 0, x: d * -28 }),
                        }}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.42, ease }}
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
    </MotionConfig>
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
      <div ref={inner} className="relative">
        {children}
      </div>
    </div>
  )
}

type Entry = { href: string; label: string; icon: IconName }

/** A titled group of menu links; a soft highlight glides to whichever one is under the pointer. */
function MenuGroup({ id, title, entries, cols, className }: { id: string; title: string; entries: Entry[]; cols: 1 | 2; className?: string }) {
  const [hover, setHover] = useState<string | null>(null)
  return (
    <div className={className}>
      <p className="t-label px-3 text-ink-3">{title}</p>
      <LayoutGroup id={id}>
        <ul className={cn('mt-3 grid gap-x-3 gap-y-0.5', cols === 2 ? 'grid-cols-2' : 'grid-cols-1')} onMouseLeave={() => setHover(null)}>
          {entries.map((e, i) => (
            <motion.li
              key={e.href}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 + i * 0.022, duration: 0.45, ease }}
              className="relative"
              onMouseEnter={() => setHover(e.href)}
            >
              {hover === e.href ? <motion.span layoutId="menu-hover" className="menu-hover" transition={lensSpring} /> : null}
              <Link href={e.href} className="menu-item group" onFocus={() => setHover(e.href)}>
                <span className="menu-icon">
                  <Icon name={e.icon} size={17} />
                </span>
                <span className="min-w-0 truncate">{e.label}</span>
                <Icon name="arrow" size={14} className="menu-arrow" />
              </Link>
            </motion.li>
          ))}
        </ul>
      </LayoutGroup>
    </div>
  )
}

function PanelFoot({ href, label }: { href: string; label: string }) {
  return (
    <div className="col-span-12 mt-5 flex items-center justify-between border-t border-line px-3 pt-4">
      <Link href={href} className="group inline-flex items-center gap-2 text-[0.875rem] font-medium text-ink">
        <span className="link-draw">{label}</span>
        <Icon name="arrow" size={14} className="transition-transform duration-500 ease-[var(--ease-out)] group-hover:translate-x-1" />
      </Link>
      <Link href="/contact-us#contact-form" className="t-label text-ink-3 transition-colors hover:text-ink">
        Free 30-min strategy call
      </Link>
    </div>
  )
}

function ServicesPanel() {
  const what: Entry[] = [
    ...services.map((s) => ({ href: `/services#${s.id}`, label: s.label, icon: serviceIcon[s.id] })),
    { href: '/services/ai-agent-development', label: 'AI Agent Development', icon: 'bot' },
  ]
  const local: Entry[] = locationLinks.map((l) => ({ href: l.href, label: l.short, icon: locationIcon[l.href] ?? 'pin' }))
  return (
    <div className="grid grid-cols-12 gap-x-8 p-6 xl:gap-x-10">
      <MenuGroup id="menu-services" title="Services" entries={what} cols={2} className="col-span-7" />
      <MenuGroup id="menu-local" title="In Ahmedabad" entries={local} cols={1} className="col-span-5 border-l border-line pl-8 xl:pl-10" />
      <PanelFoot href="/services" label="View all services" />
    </div>
  )
}

function SolutionsPanel() {
  const [crm, erp] = solutionsIndex.groups
  const toEntries = (g: typeof crm): Entry[] =>
    g.items.flatMap((it) => {
      const sol = solutions.find((s) => s.label === it.label)
      return sol ? [{ href: `/solutions/${sol.slug}`, label: it.label, icon: solutionIcon[sol.slug] ?? 'layers' }] : []
    })
  return (
    <div className="grid grid-cols-12 gap-x-8 p-6 xl:gap-x-10">
      <MenuGroup id="menu-crm" title={crm.title} entries={toEntries(crm)} cols={2} className="col-span-8" />
      <MenuGroup id="menu-erp" title={erp.title} entries={toEntries(erp)} cols={1} className="col-span-4 border-l border-line pl-8 xl:pl-10" />
      <PanelFoot href="/solutions" label="Explore all solutions" />
    </div>
  )
}
