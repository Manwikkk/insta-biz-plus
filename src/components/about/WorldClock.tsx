'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/cn'

export type ClockCity = { city: string; country: string; tz: string; hq?: boolean }

/**
 * Where the About page says we build: Ahmedabad (HQ), and founders "across India, the
 * US, UK and Singapore" / "from Ahmedabad to NYC, London to Singapore".
 */
export const FOUNDER_CITIES: ClockCity[] = [
  { city: 'Ahmedabad', country: 'India', tz: 'Asia/Kolkata', hq: true },
  { city: 'London', country: 'United Kingdom', tz: 'Europe/London' },
  { city: 'New York', country: 'United States', tz: 'America/New_York' },
  { city: 'Singapore', country: 'Singapore', tz: 'Asia/Singapore' },
]

const pad = (n: number) => String(n).padStart(2, '0')

function timeIn(tz: string, d: Date) {
  const [h, m] = new Intl.DateTimeFormat('en-GB', { timeZone: tz, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
    .format(d)
    .split(':')
    .map(Number)
  return { h, m }
}

/** The current time, ticking; `null` until mounted so server and client markup agree. */
export function useNow(intervalMs = 1000) {
  const [now, setNow] = useState<Date | null>(null)
  useEffect(() => {
    setNow(new Date())
    const id = window.setInterval(() => setNow(new Date()), intervalMs)
    return () => window.clearInterval(id)
  }, [intervalMs])
  return now
}

function Glyph({ day }: { day: boolean }) {
  return day ? (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden className="text-ember">
      <circle cx="8" cy="8" r="3.2" fill="currentColor" />
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i * Math.PI) / 4
        return (
          <line
            key={i}
            x1={8 + Math.cos(a) * 5.2}
            y1={8 + Math.sin(a) * 5.2}
            x2={8 + Math.cos(a) * 6.9}
            y2={8 + Math.sin(a) * 6.9}
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
        )
      })}
    </svg>
  ) : (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden className="text-navy">
      <path d="M10.8 2.2a6 6 0 1 0 3 9.9A5 5 0 0 1 10.8 2.2Z" fill="currentColor" />
    </svg>
  )
}

/** One city's time: a large clock, the city, and its day drawn as a 24-hour track. */
export function CityTime({ c, now, compact = false }: { c: ClockCity; now: Date | null; compact?: boolean }) {
  const t = now ? timeIn(c.tz, now) : null
  const day = t ? t.h >= 6 && t.h < 18 : true
  const at = t ? ((t.h * 60 + t.m) / 1440) * 100 : null
  return (
    <div className={cn('grid grid-cols-[1fr_auto] items-center gap-x-4', compact ? 'gap-y-2' : 'gap-y-2.5')}>
      <div className="min-w-0">
        <p className="flex items-center gap-2 font-semibold tracking-[-0.01em]">
          {c.city}
          {c.hq ? <span className="eyebrow-n t-label !h-[1.6em] !min-w-0 !text-[0.62rem]">HQ</span> : null}
        </p>
        <p className="t-label mt-0.5 flex items-center gap-1.5 text-ink-3">
          <Glyph day={day} />
          {c.country}
        </p>
      </div>
      <p className="t-num text-[clamp(1.6rem,min(2.4vw,4.6vh),2.2rem)]" aria-label={t ? `${pad(t.h)}:${pad(t.m)} in ${c.city}` : undefined}>
        {t ? (
          <>
            {pad(t.h)}
            <span className="clock-colon">:</span>
            {pad(t.m)}
          </>
        ) : (
          '--:--'
        )}
      </p>
      {/* the day: daylight shaded, a dot for now */}
      <div className="relative col-span-2 h-1.5 rounded-full bg-sink" aria-hidden>
        <span className="absolute inset-y-0 left-1/4 right-1/4 rounded-full bg-teal-soft" />
        {at !== null ? (
          <span
            className="absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal shadow-[0_0_0_3px_var(--raise)]"
            style={{ left: `${at}%` }}
          />
        ) : null}
      </div>
    </div>
  )
}
