'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, type ReactNode, type Ref } from 'react'
import { showcase } from '@/content/portfolio'

const N = showcase.length
/** Tiles per second while nothing else is going on, and the most a scroll can add. */
const PACE = 0.24
const BOOST = 0.45
/** Beyond this angle a tile is never drawn, so it can never swing close to the eye. */
const MAX_ANGLE = 1.05
/** A little vertical drift per tile, so the wall reads as a hung collage rather than a strip. */
const LIFT = showcase.map((_, i) => (((i * 37) % 7) - 3) * 7)

function TileLink({ href, children, linkRef, onHold }: { href: string; children: ReactNode; linkRef: Ref<HTMLAnchorElement>; onHold: (on: boolean) => void }) {
  const props = {
    ref: linkRef,
    className: 'pf-tile',
    tabIndex: -1,
    onPointerEnter: (e: React.PointerEvent) => e.pointerType === 'mouse' && onHold(true),
    onPointerLeave: () => onHold(false),
  }
  return /^https?:/.test(href) ? (
    <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
      {children}
    </a>
  ) : (
    <Link href={href} {...props}>
      {children}
    </Link>
  )
}

/**
 * The work on the inside of a slowly turning drum: the screen in front sits flat, the ones
 * to either side swing in toward you. It turns one way only, a little faster while the
 * page scrolls, tips back as you leave it, and glides to a stop under the pointer. Every
 * tile's fade is worked out in the same frame as its position, so nothing lags behind the
 * turn. Still for reduced motion; asleep off screen.
 */
export function WorkArc() {
  const stage = useRef<HTMLDivElement>(null)
  const drum = useRef<HTMLDivElement>(null)
  const tiles = useRef<(HTMLAnchorElement | null)[]>([])
  const held = useRef(false)

  useEffect(() => {
    const el = stage.current
    const ring = drum.current
    if (!el || !ring) return
    const reduce = matchMedia('(prefers-reduced-motion: reduce)')
    let half = 0
    let w = 0
    let persp = 0
    let r = 0
    let depth = 0
    let step = 0
    let offset = 0
    let speed = PACE
    let boost = 0
    let tilt = 0
    let raf = 0
    let last = 0
    let onScreen = false
    let lastY = window.scrollY

    const measure = () => {
      half = el.clientWidth / 2
      w = Math.round(Math.min(340, Math.max(168, half * 0.4)))
      persp = w * 2.6
      r = w * 3.4
      depth = w * 0.25
      step = (w * 1.07) / r
      el.style.setProperty('--tile-w', `${w}px`)
      el.style.perspective = `${persp}px`
    }

    const place = (dt: number) => {
      // tip back as the hero leaves the top of the view, eased so a jumpy scroll stays smooth
      const box = el.getBoundingClientRect()
      const gone = Math.min(1, Math.max(0, -box.top / Math.max(1, box.height + 200)))
      tilt += (gone * 12 - tilt) * (dt ? 1 - Math.exp(-8 * dt) : 1)
      ring.style.transform = `rotateX(${tilt.toFixed(2)}deg)`
      for (let i = 0; i < N; i++) {
        const t = tiles.current[i]
        if (!t) continue
        let u = (((i - offset) % N) + N) % N
        if (u > N / 2) u -= N
        const a = u * step
        if (Math.abs(a) > MAX_ANGLE) {
          t.style.visibility = 'hidden'
          continue
        }
        const x = r * Math.sin(a)
        const z = r * (1 - Math.cos(a)) - depth
        const s = persp / (persp - z)
        // fade out as the tile's near edge reaches the side of the stage, in step with the turn
        const near = Math.abs(x * s) - (w / 2) * s * Math.cos(a)
        const o = Math.min(1, Math.max(0, (half + w * 0.4 - near) / (w * 0.5)))
        t.style.visibility = o > 0.01 ? '' : 'hidden'
        t.style.opacity = o.toFixed(3)
        t.style.pointerEvents = o > 0.5 ? '' : 'none'
        t.style.transform = `translate3d(${x.toFixed(1)}px,${LIFT[i]}px,${z.toFixed(1)}px) rotateY(${(-a).toFixed(4)}rad)`
      }
    }

    const frame = (now: number) => {
      raf = 0
      if (!onScreen || document.hidden || reduce.matches) {
        last = 0
        return
      }
      const dt = last ? Math.min((now - last) / 1000, 1 / 20) : 0
      last = now
      boost *= Math.exp(-1.6 * dt)
      const target = held.current ? 0 : PACE + boost
      // settle quickly under the pointer, pick up gently after
      speed += (target - speed) * (1 - Math.exp(-(held.current ? 8 : 2) * dt))
      offset += speed * dt
      place(dt)
      raf = requestAnimationFrame(frame)
    }
    const wake = () => {
      if (!raf) raf = requestAnimationFrame(frame)
    }

    // a scroll in either direction only ever speeds the turn a little; it never reverses it
    const onScroll = () => {
      const y = window.scrollY
      boost = Math.min(BOOST, boost + Math.abs(y - lastY) * 0.0008)
      lastY = y
    }
    const onResize = () => {
      measure()
      place(0)
    }

    measure()
    place(0)
    el.classList.add('is-ready')
    const io = new IntersectionObserver(([e]) => {
      onScreen = e.isIntersecting
      wake()
    })
    io.observe(el)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    document.addEventListener('visibilitychange', wake)
    reduce.addEventListener('change', wake)
    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', wake)
      reduce.removeEventListener('change', wake)
    }
  }, [])

  return (
    <div ref={stage} className="pf-arc" aria-hidden>
      <div ref={drum} className="pf-drum">
        {showcase.map((s, i) => (
          <TileLink
            key={s.key}
            href={s.href}
            onHold={(on) => (held.current = on)}
            linkRef={(el) => {
              tiles.current[i] = el
            }}
          >
            <span className="pf-tile-in">
              <span className="pf-shot">
                {/* all fifteen load up front: a tile that turns into view is already painted */}
                <Image
                  src={s.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 340px, 42vw"
                  quality={60}
                  loading="eager"
                  fetchPriority={i === 0 ? 'high' : undefined}
                  className="object-cover object-top"
                />
              </span>
              <span className="pf-cap">
                <span className="truncate">{s.name}</span>
                <span className="t-label shrink-0 text-ink-3">{s.label}</span>
              </span>
            </span>
          </TileLink>
        ))}
      </div>
    </div>
  )
}
