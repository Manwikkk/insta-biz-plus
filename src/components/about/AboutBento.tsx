'use client'

import Image from 'next/image'
import Link from 'next/link'
import type { PointerEvent } from 'react'
import { ClientLogo } from '@/components/ui/ClientLogo'
import { Odometer } from '@/components/ui/Odometer'
import { Icon } from '@/components/ui/Icon'
import { HeroRotator } from '@/components/home/HeroRotator'
import { about } from '@/content/about'
import { services } from '@/content/services'
import { showcase } from '@/content/portfolio'
import { cn } from '@/lib/cn'

const CLIENTS = ['BluTec', 'Carefix', 'Cashflex', 'Chennai Cabs']
const REEL = showcase.slice(0, 8)

/**
 * The studio in four tiles: the work (a reel of shipped products), who we work with, how
 * they rate us, and what we build. Each tile tilts toward the pointer under a soft light.
 */
export function AboutBento({ className }: { className?: string }) {
  const g = about.glance
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return
    const tile = (e.target as HTMLElement).closest<HTMLElement>('.glance-tile')
    if (!tile) return
    const r = tile.getBoundingClientRect()
    const x = e.clientX - r.left
    const y = e.clientY - r.top
    tile.style.setProperty('--mx', `${x}px`)
    tile.style.setProperty('--my', `${y}px`)
    tile.style.setProperty('--ry', `${((x / r.width - 0.5) * 6).toFixed(2)}deg`)
    tile.style.setProperty('--rx', `${((0.5 - y / r.height) * 6).toFixed(2)}deg`)
  }
  const onLeave = (e: PointerEvent<HTMLDivElement>) => {
    const tile = (e.target as HTMLElement).closest<HTMLElement>('.glance-tile')
    tile?.style.removeProperty('--rx')
    tile?.style.removeProperty('--ry')
  }

  return (
    <div className={cn('grid grid-cols-6 gap-3', className)} onPointerMove={onMove} onPointerOut={onLeave}>
      {/* the work: shipped products rolling past */}
      <Link
        href="/portfolio"
        className="glance-tile is-dark enter-fade group col-span-6 flex min-h-[300px] flex-col overflow-hidden sm:col-span-3 sm:row-span-2"
        style={{ ['--d' as string]: '260ms' }}
      >
        <div className="relative z-[1] p-5 pb-0">
          <p className="t-label text-stage-ink-2">{g.work.note}</p>
          <p className="t-num mt-2 text-[clamp(2.2rem,3.4vw,3rem)] text-stage-ink">
            <Odometer value={g.work.value} delay={260} />
          </p>
          <p className="mt-1 text-[0.95rem] text-stage-ink-2">{g.work.label}</p>
        </div>
        <div className="work-reel relative mt-4 flex-1 overflow-hidden" aria-hidden>
          <div className="work-reel-track grid gap-3 px-5">
            {[...REEL, ...REEL].map((s, i) => (
              <span key={`${s.key}-${i}`} className="relative block aspect-[16/10] overflow-hidden rounded-[10px] border border-stage-line bg-stage-2">
                <Image src={s.image} alt="" fill sizes="(min-width: 1024px) 280px, 80vw" quality={60} className="object-cover object-top" />
              </span>
            ))}
          </div>
        </div>
        <span className="absolute bottom-4 left-5 z-[2] inline-flex items-center gap-2 rounded-full bg-stage/80 px-3 py-1.5 text-[0.85rem] font-medium text-stage-ink backdrop-blur">
          {g.work.cta}
          <Icon name="arrow" size={14} className="transition-transform duration-500 group-hover:translate-x-1" />
        </span>
      </Link>

      {/* who we work with */}
      <div className="glance-tile enter-fade col-span-3 flex flex-col justify-between p-5" style={{ ['--d' as string]: '340ms' }}>
        <p className="t-label text-ink-3">{g.clients.label}</p>
        <p className="t-num mt-2 text-[clamp(2rem,3.2vw,2.8rem)]">
          <Odometer value={g.clients.value} delay={340} />
        </p>
        <div className="mt-3 grid grid-cols-4 gap-1.5">
          {CLIENTS.map((n) => (
            <ClientLogo key={n} name={n} ratio={1.5} area={0.3} sizes="60px" decorative className="rounded-[8px]" />
          ))}
        </div>
      </div>

      {/* how they rate us */}
      <div className="glance-tile enter-fade col-span-3 flex flex-col justify-between p-5" style={{ ['--d' as string]: '420ms' }}>
        <p className="t-label text-ink-3">{g.rating.label}</p>
        <p className="t-num mt-2 text-[clamp(2rem,3.2vw,2.8rem)]">
          <Odometer value={g.rating.value} delay={420} />
        </p>
        <p className="mt-3 flex flex-wrap items-center gap-2">
          <span className="rating-stars flex gap-0.5 text-ember" aria-hidden>
            {Array.from({ length: 5 }).map((_, k) => (
              <Icon key={k} name="star" size={15} style={{ ['--k' as string]: k }} />
            ))}
          </span>
          <span className="t-label text-ink-3">{g.rating.note}</span>
        </p>
      </div>

      {/* what we build */}
      <Link
        href="/services"
        className="glance-tile enter-fade group col-span-6 flex flex-wrap items-end justify-between gap-4 p-5"
        style={{ ['--d' as string]: '500ms' }}
      >
        <span>
          <span className="t-label block text-ink-3">{g.build.label}</span>
          <span className="mt-2 block font-display text-[clamp(1.6rem,2.6vw,2.3rem)] font-[740] leading-none tracking-[-0.035em]">
            <HeroRotator words={services.map((s) => s.label)} interval={2200} />
          </span>
        </span>
        <span className="inline-flex items-center gap-2 text-[0.92rem] font-medium">
          <span className="link-draw">{g.build.cta}</span>
          <Icon name="arrow" size={15} className="transition-transform duration-500 group-hover:translate-x-1" />
        </span>
      </Link>
    </div>
  )
}
