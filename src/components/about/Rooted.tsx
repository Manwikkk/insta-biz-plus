'use client'

import { useEffect, useState } from 'react'
import { CharRise } from '@/components/motion/CharRise'
import { Odometer } from '@/components/ui/Odometer'
import { about as a } from '@/content/about'
import { site } from '@/content/site'
import { cn } from '@/lib/cn'

/** Where the clients we build with are (site.areaServed), with the studio first. */
const CITIES = [
  { city: 'Ahmedabad', tz: 'Asia/Kolkata', hq: true },
  { city: 'New York', tz: 'America/New_York' },
  { city: 'London', tz: 'Europe/London' },
  { city: 'Dubai', tz: 'Asia/Dubai' },
  { city: 'Singapore', tz: 'Asia/Singapore' },
]

/** Local time in each city, refreshed every few seconds; blank until mounted so server and client agree. */
function useClocks() {
  const [times, setTimes] = useState<string[] | null>(null)
  useEffect(() => {
    const fmts = CITIES.map((c) => new Intl.DateTimeFormat('en-GB', { timeZone: c.tz, hour: '2-digit', minute: '2-digit', hour12: false }))
    const read = () => setTimes(fmts.map((f) => f.format(new Date())))
    read()
    const id = window.setInterval(read, 5000)
    return () => window.clearInterval(id)
  }, [])
  return times
}

/**
 * Where we are and who we build for, said twice and large: one statement flush left with
 * its note beside it, the other flush right with the clocks of the cities our clients work
 * from. The letters tumble into place as each statement arrives.
 */
export function Rooted() {
  const times = useClocks()
  const stats = [
    { value: a.glance.work.value, label: a.glance.work.label },
    { value: a.glance.clients.value, label: a.glance.clients.label },
    { value: a.glance.rating.value, label: a.glance.rating.label },
    { value: String(site.founded), label: 'Founded' },
  ]
  const global = a.way.items.find((w) => w.title === 'Global by default')!

  return (
    <section id="rooted" className="rails relative scroll-mt-10 overflow-hidden border-b border-line">
      <div className="shell py-[clamp(72px,13vh,160px)]">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <CharRise as="h2" className="rt-big lg:col-span-8">
            Rooted in
            <br />
            Ahmedabad.
          </CharRise>
          <p className="t-body max-w-sm lg:col-span-3 lg:col-start-10 lg:pb-3" data-reveal="rise">
            {a.intro}
          </p>
        </div>

        <div className="mt-[clamp(56px,12vh,150px)] grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="order-2 lg:order-1 lg:col-span-4 lg:pb-3" data-reveal="rise">
            <p className="t-body max-w-sm">{global.body}</p>
            <ul className="mt-6 border-t border-line" aria-label="Local time where our clients are">
              {CITIES.map((c, i) => (
                <li key={c.city} className="flex items-baseline justify-between gap-4 border-b border-line py-2.5">
                  <span className="flex items-center gap-2.5 text-[0.95rem] font-medium">
                    <span className={cn('size-1.5 rounded-full', c.hq ? 'bg-teal shadow-[0_0_0_4px_var(--teal-soft)]' : 'bg-line-2')} />
                    {c.city}
                    {c.hq ? <span className="t-label text-teal-ink">HQ</span> : null}
                  </span>
                  <span className="t-num text-[1.05rem] tabular-nums text-ink-2">{times ? times[i] : '--:--'}</span>
                </li>
              ))}
            </ul>
          </div>
          <CharRise as="h2" className="rt-big order-1 lg:order-2 lg:col-span-8 lg:text-right">
            Building for
            <br />
            the world.
          </CharRise>
        </div>

        <dl className="mt-[clamp(56px,10vh,120px)] grid grid-cols-2 border-t border-line lg:grid-cols-4">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className="flex flex-col-reverse gap-2 border-line py-6 pr-4 [&:nth-child(2n)]:border-l [&:nth-child(2n)]:pl-5 lg:border-l lg:pl-6 lg:first:border-l-0 lg:first:pl-0"
              data-reveal="rise"
              style={{ ['--d' as string]: `${i * 90}ms` }}
            >
              <dt className="t-label text-ink-3">{s.label}</dt>
              <dd className="t-num text-[clamp(2.4rem,4.4vw,4rem)]">
                <Odometer value={s.value} delay={i * 120} />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
