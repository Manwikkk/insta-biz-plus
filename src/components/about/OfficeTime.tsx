'use client'

import { CityTime, FOUNDER_CITIES, useNow } from './WorldClock'

/** Local time at the Naranpura office, live. */
export function OfficeTime() {
  const now = useNow(1000)
  return (
    <div className="border-t border-line pt-4">
      <p className="t-label mb-3 flex items-center gap-2 text-ink-3">
        <span className="live-dot" aria-hidden />
        Right now in Ahmedabad
      </p>
      <CityTime c={FOUNDER_CITIES[0]} now={now} compact />
    </div>
  )
}
