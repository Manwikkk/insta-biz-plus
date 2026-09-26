'use client'

import type { PointerEvent } from 'react'
import { HEX, MARK_PIECES, svgPath } from '@/components/brand/markGeometry'
import { ClientLogo } from '@/components/ui/ClientLogo'
import { Odometer } from '@/components/ui/Odometer'
import { Icon } from '@/components/ui/Icon'
import { about } from '@/content/about'
import { cn } from '@/lib/cn'

/** Rough positions on a wide map strip (x 0–600, y 0–200), nudged apart where cities crowd. */
const HQ = { x: 432, y: 104 }
const CITIES = [
  { label: 'US', x: 72, y: 60, anchor: 'start' },
  { label: 'UK', x: 252, y: 36, anchor: 'start' },
  { label: 'UAE', x: 350, y: 132, anchor: 'end' },
  { label: 'SINGAPORE', x: 508, y: 164, anchor: 'start' },
] as const
const CLIENTS = ['BluTec', 'Carefix', 'Cashflex', 'Chennai Cabs']

/** A route out of Ahmedabad, bowed upward like a flight path. */
function route(to: { x: number; y: number }) {
  const lift = Math.hypot(to.x - HQ.x, to.y - HQ.y) * 0.3
  return `M ${HQ.x} ${HQ.y} Q ${(HQ.x + to.x) / 2} ${(HQ.y + to.y) / 2 - lift} ${to.x} ${to.y}`
}

const label = { fontFamily: 'var(--font-label)', fontSize: 11.5, fontWeight: 600, letterSpacing: '0.06em' } as const

/**
 * The studio at a glance: who we are (the mark, founder-led since 2020), who we work with,
 * how they rate us and where they are. A soft light follows the pointer across the tiles.
 */
export function AboutGlance({ className }: { className?: string }) {
  const g = about.glance
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const tile = (e.target as HTMLElement).closest<HTMLElement>('.glance-tile')
    if (!tile) return
    const r = tile.getBoundingClientRect()
    tile.style.setProperty('--mx', `${e.clientX - r.left}px`)
    tile.style.setProperty('--my', `${e.clientY - r.top}px`)
  }

  return (
    <div className={cn('grid grid-cols-6 gap-3', className)} onPointerMove={onMove}>
      {/* the studio */}
      <div className="glance-tile is-dark col-span-6 flex min-h-[240px] flex-col justify-between p-5 sm:col-span-3 sm:row-span-2">
        <p className="t-label flex items-center gap-2 text-stage-ink-2">
          <span className="live-dot" aria-hidden />
          {g.studio.label}
        </p>
        <svg viewBox="-150 -150 300 300" className="mx-auto my-2 w-[min(64%,200px)] overflow-visible" aria-hidden>
          <g className="glance-orbit">
            <path d={svgPath(HEX, 132)} fill="none" stroke="var(--stage-ink-2)" strokeOpacity="0.35" strokeWidth="1.4" strokeDasharray="3 9" />
          </g>
          {MARK_PIECES.map((p, i) => (
            <g
              key={p.id}
              className="glance-piece"
              style={{ ['--i' as string]: i, ['--dx' as string]: `${p.explode[0] * 14}px`, ['--dy' as string]: `${-p.explode[1] * 14}px` }}
            >
              <path d={svgPath(p.pts, 100)} fill={p.color} />
            </g>
          ))}
        </svg>
        <div>
          <p className="font-display text-[1.3rem] font-[700] leading-tight tracking-[-0.02em]">{g.studio.title}</p>
          <p className="mt-1 text-[0.9rem] leading-snug text-stage-ink-2">{g.studio.body}</p>
        </div>
      </div>

      {/* who we work with */}
      <div className="glance-tile logo-hover col-span-3 flex flex-col justify-between p-5">
        <p className="t-label text-ink-3">{g.clients.label}</p>
        <p className="t-num mt-2 text-[clamp(2rem,3.2vw,2.8rem)]">
          <Odometer value={g.clients.value} delay={300} />
        </p>
        <div className="mt-3 grid grid-cols-4 gap-1.5">
          {CLIENTS.map((n) => (
            <ClientLogo key={n} name={n} ratio={1.5} area={0.3} sizes="60px" decorative className="rounded-[8px]" />
          ))}
        </div>
      </div>

      {/* how they rate us */}
      <div className="glance-tile col-span-3 flex flex-col justify-between p-5">
        <p className="t-label text-ink-3">{g.rating.label}</p>
        <p className="t-num mt-2 text-[clamp(2rem,3.2vw,2.8rem)]">
          <Odometer value={g.rating.value} delay={420} />
        </p>
        <p className="mt-3 flex flex-wrap items-center gap-2">
          <span className="flex gap-0.5 text-ember" aria-hidden>
            {Array.from({ length: 5 }).map((_, k) => (
              <Icon key={k} name="star" size={14} />
            ))}
          </span>
          <span className="t-label text-ink-3">{g.rating.note}</span>
        </p>
      </div>

      {/* where they are */}
      <div className="glance-tile col-span-6 px-5 pb-3 pt-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="t-label text-ink-3">{g.reach.label}</p>
          <p className="t-label text-ink-3">{g.reach.note}</p>
        </div>
        <svg viewBox="0 0 600 196" className="mt-1 w-full" role="img" aria-label="Clients in India, the US, the UK, the UAE and Singapore">
          <defs>
            <pattern id="glance-dots" width="12" height="12" patternUnits="userSpaceOnUse">
              <circle cx="1.5" cy="1.5" r="1.1" fill="var(--line-2)" />
            </pattern>
          </defs>
          <rect width="600" height="196" fill="url(#glance-dots)" />
          {CITIES.map((c, i) => (
            <path
              key={c.label}
              d={route(c)}
              className="reach-route"
              fill="none"
              stroke="var(--teal)"
              strokeWidth="1.6"
              strokeLinecap="round"
              style={{ animationDelay: `${i * -0.4}s` }}
            />
          ))}
          {CITIES.map((c, i) => (
            <g key={c.label}>
              <circle className="reach-ping" cx={c.x} cy={c.y} r="5" fill="var(--teal)" style={{ ['--i' as string]: i }} />
              <circle cx={c.x} cy={c.y} r="4" fill="var(--teal)" />
              <text x={c.anchor === 'end' ? c.x - 10 : c.x + 10} y={c.y + 4} textAnchor={c.anchor} fill="var(--ink-2)" style={label}>
                {c.label}
              </text>
            </g>
          ))}
          <circle cx={HQ.x} cy={HQ.y} r="11" fill="var(--teal-soft)" />
          <circle cx={HQ.x} cy={HQ.y} r="6" fill="var(--ink)" />
          <text x={HQ.x + 16} y={HQ.y + 4} fill="var(--ink)" style={label}>
            AHMEDABAD · HQ
          </text>
        </svg>
      </div>
    </div>
  )
}
