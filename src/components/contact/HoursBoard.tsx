'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/cn'

/** Office hours from the contact page, as a week on a 24-hour rail (IST). */
const WEEK = [
  { d: 'Mon', open: 9, close: 18 },
  { d: 'Tue', open: 9, close: 18 },
  { d: 'Wed', open: 9, close: 18 },
  { d: 'Thu', open: 9, close: 18 },
  { d: 'Fri', open: 9, close: 18 },
  { d: 'Sat', open: 10, close: 16 },
  { d: 'Sun', open: null, close: null },
] as const

function istNow() {
  const now = new Date()
  const utc = now.getTime() + now.getTimezoneOffset() * 60000
  const ist = new Date(utc + 5.5 * 3600000)
  const day = (ist.getDay() + 6) % 7 // Mon = 0
  return { day, hour: ist.getHours() + ist.getMinutes() / 60, label: ist.toTimeString().slice(0, 5) }
}

/**
 * Hero figure for /contact-us. The "now" marker and open/closed state are computed in
 * the browser (never on the server), so the board always reflects the visitor's moment.
 */
export function HoursBoard() {
  const [now, setNow] = useState<ReturnType<typeof istNow> | null>(null)
  useEffect(() => {
    setNow(istNow())
    const id = window.setInterval(() => setNow(istNow()), 30000)
    return () => window.clearInterval(id)
  }, [])
  const today = now ? WEEK[now.day] : null
  const open = !!(now && today && today.open !== null && now.hour >= today.open && now.hour < (today.close ?? 0))

  return (
    <div className="rounded-[18px] border border-line bg-raise">
      <div className="flex items-center justify-between border-b border-line px-5 py-3">
        <span className="flex items-center gap-2.5">
          <span className={cn('size-2 rounded-full', now ? (open ? 'bg-teal' : 'bg-ember') : 'bg-line-2')} />
          <span className="t-label text-ink-2">{now ? (open ? 'Open now' : 'Closed now · we reply first thing') : 'Office hours'}</span>
        </span>
        <span className="t-label text-ink-3">{now ? `${now.label} IST` : 'IST · GMT +5:30'}</span>
      </div>
      <div className="px-5 pb-4 pt-5">
        <div className="relative ml-12">
          <div className="t-label flex justify-between text-[0.58rem] text-ink-3">
            {[0, 6, 12, 18, 24].map((h) => (
              <span key={h}>{String(h).padStart(2, '0')}</span>
            ))}
          </div>
        </div>
        <ul className="mt-2 grid gap-1.5">
          {WEEK.map((w, i) => (
            <li key={w.d} className="flex items-center gap-3">
              <span className={cn('t-label w-9 text-[0.62rem]', now?.day === i ? 'text-ink' : 'text-ink-3')}>{w.d}</span>
              <span className="relative h-5 flex-1 overflow-hidden rounded-[4px] bg-sink">
                {w.open !== null ? (
                  <span
                    className={cn('absolute inset-y-0 rounded-[4px]', now?.day === i ? 'bg-teal' : 'bg-navy/50')}
                    style={{ left: `${(w.open / 24) * 100}%`, width: `${(((w.close ?? 0) - w.open) / 24) * 100}%` }}
                  />
                ) : (
                  <span className="t-label absolute inset-0 grid place-items-center text-[0.55rem] text-ink-3">Closed</span>
                )}
                {now?.day === i ? (
                  <span className="absolute inset-y-[-2px] w-[2px] bg-ember" style={{ left: `${(now.hour / 24) * 100}%` }} />
                ) : null}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className="grid grid-cols-2 border-t border-line">
        <div className="border-r border-line px-5 py-4">
          <p className="t-label text-ink-3">First reply</p>
          <p className="mt-1 t-numeral text-[1.6rem]">2 hrs</p>
        </div>
        <div className="px-5 py-4">
          <p className="t-label text-ink-3">Async-friendly</p>
          <p className="mt-1 text-[0.95rem] font-semibold">across timezones</p>
        </div>
      </div>
    </div>
  )
}
