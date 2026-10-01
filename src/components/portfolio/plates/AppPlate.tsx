'use client'

import Image from 'next/image'
import type { Project, ProjectVisual } from '@/content/portfolio'
import { Icon } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'
import { usePhase } from './kit'

type AppVisual = Extract<ProjectVisual, { kind: 'app' }>

/** Where each phone sits, by its place relative to the one in front. */
const SLOT = {
  front: 'translate(0, 0) scale(1)',
  right: 'translate(132px, 14px) scale(0.8) rotate(4deg)',
  left: 'translate(-132px, 14px) scale(0.8) rotate(-4deg)',
  back: 'translate(0, 24px) scale(0.68)',
}

/**
 * An app, shown by its own screens: the phones turn like a carousel, each screen taking the
 * front in turn, beside the app's name and its numbers from the store.
 */
export function AppPlate({ p, v, live }: { p: Project; v: AppVisual; live: boolean }) {
  const n = v.screens.length
  const i = usePhase(Math.max(n, 2), 2600, live, 0) % n
  const store = p.category === 'Telegram Development' ? 'Telegram mini app' : 'Android app · Google Play'
  return (
    <div className="relative h-full overflow-hidden" style={{ background: `radial-gradient(80% 120% at 78% 30%, #ffffff 0%, ${v.tint} 62%)` }}>
      <div className="pl-dots absolute inset-0 opacity-60" />
      {/* the app */}
      <div className="absolute left-12 top-1/2 w-[290px] -translate-y-1/2">
        {v.icon ? (
          <Image src={v.icon} alt="" width={64} height={64} className="size-16 rounded-[18px] shadow-[0_12px_26px_-12px_rgb(11_15_21/0.45)]" />
        ) : (
          <span className="grid size-16 place-items-center rounded-[18px] text-white shadow-[0_12px_26px_-12px_rgb(11_15_21/0.45)]" style={{ background: v.ink }}>
            <Icon name="send" size={26} />
          </span>
        )}
        <p className="mt-5 text-[32px] font-bold leading-none tracking-[-0.035em] text-[#0b0f15]">{p.name}</p>
        <p className="mt-2 text-[12.5px] font-semibold" style={{ color: v.ink }}>
          {store}
        </p>
        <ul className="mt-5 grid gap-2.5">
          {p.points.map((x) => (
            <li key={x} className="flex items-center gap-2.5 text-[13px] font-medium text-[#1f2937]">
              <span className="grid size-5 shrink-0 place-items-center rounded-full text-white" style={{ background: v.ink }}>
                <Icon name="check" size={11} strokeWidth={3} />
              </span>
              {x}
            </li>
          ))}
        </ul>
      </div>
      {/* the phones */}
      <div className="absolute right-[140px] top-1/2 h-[372px] w-[176px] -translate-y-1/2">
        {v.screens.map((src, k) => {
          const rel = (k - i + n) % n
          const slot = n === 1 || rel === 0 ? 'front' : rel === 1 ? 'right' : rel === n - 1 ? 'left' : 'back'
          return (
            <span
              key={src}
              className={cn('pl-phone absolute inset-0 block overflow-hidden rounded-[30px] border-[7px] border-[#0b0f15] bg-[#0b0f15]', slot === 'back' && 'opacity-0')}
              style={{ transform: SLOT[slot], zIndex: slot === 'front' ? 3 : slot === 'back' ? 0 : 1, boxShadow: slot === 'front' ? '0 40px 70px -30px rgb(11 15 21 / 0.65)' : '0 24px 40px -26px rgb(11 15 21 / 0.5)' }}
            >
              <Image src={src} alt="" fill sizes="200px" quality={80} className="rounded-[23px] object-cover object-top" />
              <span className={cn('absolute inset-0 rounded-[23px] bg-white transition-opacity duration-700', slot === 'front' ? 'opacity-0' : 'opacity-25')} />
            </span>
          )
        })}
      </div>
    </div>
  )
}
