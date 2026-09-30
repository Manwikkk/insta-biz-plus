'use client'

import { useEffect } from 'react'
import { setTheme, useTheme } from '@/lib/theme'
import { cn } from '@/lib/cn'

/**
 * The switch is a small IBW hexagon: its two halves are the two themes. Toggling
 * spins the hexagon a third of a turn (one isometric face) and opens the new theme
 * through a hexagonal aperture.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const theme = useTheme()
  const dark = theme === 'dark'

  // The browser chrome (address bar, status bar) follows the chosen theme.
  useEffect(() => {
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#07090d' : '#f2f0ea')
  }, [dark])

  return (
    <button
      type="button"
      aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={dark ? 'Light theme' : 'Dark theme'}
      onClick={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        setTheme(dark ? 'light' : 'dark', { x: r.left + r.width / 2, y: r.top + r.height / 2 })
      }}
      className={cn('nav-icon-btn group relative', className)}
    >
      <svg
        viewBox="-12 -12 24 24"
        width="20"
        height="20"
        aria-hidden
        className="transition-transform duration-700 ease-[var(--ease-out)]"
        style={{ transform: `rotate(${dark ? 120 : 0}deg)` }}
      >
        {/* hexagon outline */}
        <path
          d="M0 -10 L8.66 -5 L8.66 5 L0 10 L-8.66 5 L-8.66 -5 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        {/* filled isometric face: "night" half */}
        <path d="M0 0 L8.66 -5 L8.66 5 L0 10 Z" fill="currentColor" />
        <path d="M0 0 L0 10 L-8.66 5 L-8.66 -5 Z" fill="var(--teal)" opacity={dark ? 1 : 0.9} />
        <circle cx="0" cy="0" r="1.6" fill="var(--bg)" />
      </svg>
    </button>
  )
}
