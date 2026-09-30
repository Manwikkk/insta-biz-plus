'use client'

import { useState, type CSSProperties, type ReactNode } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import type { ServiceId } from '@/content/services'
import { Icon, type IconName } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'

const ease = [0.16, 1, 0.3, 1] as const
/** How long each slide holds, in ms; its segment below the stage fills over it (see .svc-seg). */
const HOLD = 4200

/** Stagger for the scene's parts (read by the .sv-* animations as --d). */
const d = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties

/**
 * The services menu's preview: a short film for each service, three slides that each
 * play one step of the work on a dark stage (drawn in SVG, animated in CSS). The slides
 * take turns while the service is picked; the segments under the stage jump between them.
 */
export function ServiceReel({ id }: { id: ServiceId }) {
  const slides = REELS[id]
  // the slide belongs to a service, so picking another service starts its film from the top
  const [at, setAt] = useState({ id, k: 0 })
  const k = at.id === id ? at.k : 0
  const reduce = useReducedMotion()
  const go = (i: number) => setAt({ id, k: i })

  return (
    <div>
      <div className="svc-stage relative aspect-[16/10] overflow-hidden rounded-[12px]">
        <AnimatePresence initial={false}>
          <motion.div
            key={`${id}-${k}`}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.04, filter: 'blur(6px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.98, filter: 'blur(4px)' }}
            transition={{ duration: 0.6, ease }}
          >
            <svg viewBox="0 0 288 180" className="sv" aria-hidden>
              {slides[k].scene}
            </svg>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="mt-3 flex items-center justify-between gap-3">
        <p className="t-label min-w-0 truncate text-ink-3">
          <span className="text-teal-ink">{String(k + 1).padStart(2, '0')}</span> · {slides[k].caption}
        </p>
        <div className="flex shrink-0 gap-1.5">
          {slides.map((s, i) => (
            <button key={s.caption} type="button" onClick={() => go(i)} className="svc-seg" aria-label={s.caption} aria-current={i === k || undefined}>
              {i < k ? <span className="svc-seg-fill is-done" /> : null}
              {/* the running segment moves the film on when it fills (never under reduced motion) */}
              {i === k && !reduce ? (
                <span key={`${id}-${k}`} className="svc-seg-fill" style={{ animationDuration: `${HOLD}ms` }} onAnimationEnd={() => go((k + 1) % slides.length)} />
              ) : null}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------------------------------ */
/* Parts every scene is built from (viewBox 288 × 180)                                         */

function Glyph({ name, x, y, size = 12, tone = 'dim' }: { name: IconName; x: number; y: number; size?: number; tone?: 'dim' | 'ink' | 'teal' | 'dark' }) {
  return <Icon name={name} x={x} y={y} size={size} strokeWidth={1.8} className={`sv-ico-${tone}`} />
}

/** A step on the stage: a card with an icon and a word. */
function Node({ x, y, icon, label, teal, delay }: { x: number; y: number; icon: IconName; label: string; teal?: boolean; delay: number }) {
  return (
    <g className="sv-pop" style={d(delay)}>
      <rect x={x} y={y} width={64} height={34} rx={9} className={teal ? 'sv-card-teal' : 'sv-card'} />
      <Glyph name={icon} x={x + 8} y={y + 11} tone={teal ? 'teal' : 'ink'} />
      <text x={x + 24} y={y + 20.5} className="sv-t">
        {label}
      </text>
    </g>
  )
}

/** Done: a teal tick that pops in. */
function Tick({ x, y, delay }: { x: number; y: number; delay: number }) {
  return (
    <g className="sv-pop" style={d(delay)}>
      <circle cx={x} cy={y} r={7} className="sv-teal" />
      <Icon name="check" x={x - 4.5} y={y - 4.5} size={9} strokeWidth={2.8} className="sv-ico-dark" />
    </g>
  )
}

/** Data on the move: a glowing dot riding a path, over and over. */
function Packet({ path, dur, begin }: { path: string; dur: number; begin: number }) {
  return (
    <circle r={2.6} className="sv-packet" opacity={0}>
      <set attributeName="opacity" to="1" begin={`${begin}s`} fill="freeze" />
      <animateMotion
        path={path}
        dur={`${dur}s`}
        begin={`${begin}s`}
        repeatCount="indefinite"
        calcMode="spline"
        keyTimes="0;1"
        keySplines="0.45 0 0.25 1"
      />
    </circle>
  )
}

function Phone({ x, y, w = 84, h = 160, delay = 0, children }: { x: number; y: number; w?: number; h?: number; delay?: number; children?: ReactNode }) {
  const small = w < 60
  return (
    <g className="sv-in" style={d(delay)}>
      <rect x={x} y={y} width={w} height={h} rx={small ? 10 : 14} className="sv-phone" />
      <rect x={x + 3.5} y={y + 3.5} width={w - 7} height={h - 7} rx={small ? 7.5 : 11} className="sv-screen" />
      <rect x={x + w / 2 - (small ? 7 : 12)} y={y + (small ? 6.5 : 8)} width={small ? 14 : 24} height={small ? 3.5 : 5} rx={2.5} className="sv-phone" />
      {children}
    </g>
  )
}

/** A skeleton line that draws itself left to right. */
function Line({ x, y, w, h = 4, tone = 'bar', delay }: { x: number; y: number; w: number; h?: number; tone?: 'bar' | 'ink' | 'teal' | 'navy'; delay: number }) {
  return <rect x={x} y={y} width={w} height={h} rx={h / 2} className={cn('sv-grow-x', `sv-${tone}`)} style={d(delay)} />
}

/* ------------------------------------------------------------------------------------------ */
/* 01 · Business automation                                                                    */

function AutoFlow() {
  const up = 'M72 90 C92 90 92 45 112 45'
  const down = 'M72 90 C92 90 92 135 112 135'
  const upOut = 'M176 45 C196 45 196 90 216 90'
  const downOut = 'M176 135 C196 135 196 90 216 90'
  return (
    <>
      {[up, down].map((p) => (
        <path key={p} d={p} pathLength={1} className="sv-line sv-draw" style={d(250)} />
      ))}
      {[upOut, downOut].map((p) => (
        <path key={p} d={p} pathLength={1} className="sv-line sv-draw" style={d(850)} />
      ))}
      <Packet path={`${up} L176 45 C196 45 196 90 216 90`} dur={1.8} begin={1.3} />
      <Packet path={`${down} L176 135 C196 135 196 90 216 90`} dur={1.8} begin={2} />
      <text x={9} y={65} className="sv-lbl sv-in">
        When
      </text>
      <text x={217} y={65} className="sv-lbl sv-in" style={d(1100)}>
        Then
      </text>
      <rect x={8} y={73} width={64} height={34} rx={9} className="sv-ring-line sv-ring" style={d(400)} />
      <Node x={8} y={73} icon="bell" label="Order" teal delay={0} />
      <Node x={112} y={28} icon="check" label="Approve" delay={450} />
      <Node x={112} y={118} icon="file" label="Invoice" delay={600} />
      <Node x={216} y={73} icon="whatsapp" label="Notify" delay={1100} />
      <Tick x={278} y={75} delay={1800} />
    </>
  )
}

const TOOLS: { icon: IconName; x: number; y: number }[] = [
  { icon: 'whatsapp', x: 144, y: 26 },
  { icon: 'mail', x: 240, y: 68 },
  { icon: 'database', x: 206, y: 148 },
  { icon: 'calendar', x: 82, y: 148 },
  { icon: 'file', x: 48, y: 68 },
]

function AutoHub() {
  return (
    <>
      <ellipse cx={144} cy={90} rx={98} ry={60} className="sv-orbit sv-in" />
      {TOOLS.map((t, i) => (
        <path key={t.icon} d={`M${t.x} ${t.y} L144 90`} pathLength={1} className="sv-line sv-draw" style={d(300 + i * 110)} />
      ))}
      {TOOLS.map((t, i) => (
        <Packet key={t.icon} path={`M${t.x} ${t.y} L144 90`} dur={1.1} begin={1.1 + i * 0.28} />
      ))}
      <circle cx={144} cy={90} r={24} className="sv-ring-line sv-ring" style={d(700)} />
      <g className="sv-pop">
        <circle cx={144} cy={90} r={24} className="sv-card-teal" />
        <Glyph name="workflow" x={134} y={80} size={20} tone="teal" />
      </g>
      {TOOLS.map((t, i) => (
        <g key={t.icon} className="sv-pop" style={d(120 + i * 110)}>
          <rect x={t.x - 16} y={t.y - 16} width={32} height={32} rx={10} className="sv-card" />
          <Glyph name={t.icon} x={t.x - 7.5} y={t.y - 7.5} size={15} tone="ink" />
        </g>
      ))}
    </>
  )
}

const TASKS = ['Send invoices', 'Chase follow-ups', 'Update stock', 'Weekly report']

function AutoPilot() {
  return (
    <>
      <rect x={14} y={16} width={170} height={148} rx={12} className="sv-card sv-in" />
      <text x={28} y={36} className="sv-lbl sv-in" style={d(80)}>
        Today · on autopilot
      </text>
      {TASKS.map((t, i) => {
        const y = 60 + i * 27
        const done = 700 + i * 520
        return (
          <g key={t} className="sv-in" style={d(150 + i * 80)}>
            <circle cx={34} cy={y} r={7} className="sv-line" />
            <Tick x={34} y={y} delay={done} />
            <text x={50} y={y + 3.4} className="sv-t sv-dim-later" style={d(done)}>
              {t}
            </text>
          </g>
        )
      })}
      <rect x={196} y={36} width={80} height={108} rx={12} className="sv-card sv-in" style={d(250)} />
      <text x={207} y={56} className="sv-lbl sv-in" style={d(300)}>
        Hours saved
      </text>
      <text x={206} y={90} className="sv-num sv-pop" style={d(900)}>
        30+
      </text>
      <text x={207} y={104} className="sv-lbl sv-in" style={d(1000)}>
        Every week
      </text>
      <path d="M207 136 L219 132 L231 134 L243 125 L255 123 L266 114" pathLength={1} className="sv-line-teal sv-draw" style={d(700)} />
      <circle cx={266} cy={114} r={3} className="sv-teal sv-pop" style={d(1500)} />
    </>
  )
}

/* ------------------------------------------------------------------------------------------ */
/* 02 · Mobile apps                                                                            */

function MobileDesign() {
  const a = { x: 34, y: 10 }
  const b = { x: 170, y: 10 }
  return (
    <>
      <Phone x={a.x} y={a.y}>
        <circle cx={a.x + 16} cy={a.y + 26} r={5} className="sv-bar sv-pop" style={d(150)} />
        <Line x={a.x + 25} y={a.y + 23.5} w={34} h={5} delay={200} />
        <rect x={a.x + 11} y={a.y + 37} width={62} height={34} rx={8} className="sv-hero sv-in" style={d(350)} />
        {[0, 1, 2].map((i) => (
          <g key={i} className="sv-in" style={d(500 + i * 110)}>
            <rect x={a.x + 11} y={a.y + 81 + i * 22} width={14} height={14} rx={4} className="sv-bar" />
            <rect x={a.x + 30} y={a.y + 83 + i * 22} width={i === 1 ? 30 : 40} height={4} rx={2} className="sv-ink" />
            <rect x={a.x + 30} y={a.y + 90 + i * 22} width={24} height={3} rx={1.5} className="sv-bar" />
          </g>
        ))}
        {[0, 1, 2, 3].map((i) => (
          <circle key={i} cx={a.x + 20 + i * 15} cy={a.y + 148} r={2.4} className={cn('sv-pop', i ? 'sv-bar' : 'sv-teal')} style={d(850 + i * 50)} />
        ))}
      </Phone>
      <circle cx={a.x + 42} cy={a.y + 54} r={9} className="sv-ring-line sv-ring-once" style={d(1000)} />
      <path d="M109 64 C134 64 140 56 165 56" pathLength={1} className="sv-line-teal sv-draw" style={d(1100)} />
      <path d="M160 51.5 L165.5 56 L160 60.5" className="sv-line-teal sv-pop" style={d(1500)} />
      <Phone x={b.x} y={b.y} delay={1200}>
        <g className="sv-in" style={d(1350)}>
          <rect x={b.x + 11} y={b.y + 20} width={62} height={52} rx={8} className="sv-hero-2" />
          <circle cx={b.x + 30} cy={b.y + 40} r={9} className="sv-glass" />
          <rect x={b.x + 44} y={b.y + 50} width={22} height={14} rx={4} className="sv-glass" />
        </g>
        <Line x={b.x + 11} y={b.y + 82} w={46} h={6} tone="ink" delay={1500} />
        {[62, 56, 40].map((w, i) => (
          <Line key={w} x={b.x + 11} y={b.y + 96 + i * 8} w={w} h={3.5} delay={1600 + i * 70} />
        ))}
        <g className="sv-pop" style={d(1950)}>
          <rect x={b.x + 11} y={b.y + 128} width={62} height={18} rx={9} className="sv-teal" />
          <text x={b.x + 42} y={b.y + 140} textAnchor="middle" className="sv-t sv-t-xs sv-t-dark">
            Book now
          </text>
        </g>
      </Phone>
    </>
  )
}

const CODE: { x: number; w: number; tone?: 'teal' | 'navy' }[] = [
  { x: 0, w: 46, tone: 'teal' },
  { x: 8, w: 58 },
  { x: 8, w: 40, tone: 'navy' },
  { x: 16, w: 34 },
  { x: 8, w: 52, tone: 'teal' },
  { x: 0, w: 28 },
  { x: 0, w: 42, tone: 'navy' },
]

function MiniApp({ x, y, delay }: { x: number; y: number; delay: number }) {
  return (
    <Phone x={x} y={y} w={50} h={96} delay={delay}>
      <rect x={x + 8} y={y + 16} width={34} height={20} rx={5} className="sv-hero sv-in" style={d(delay + 500)} />
      {[34, 24, 34].map((w, i) => (
        <Line key={i} x={x + 8} y={y + 44 + i * 10} w={w} delay={delay + 600 + i * 80} />
      ))}
      <rect x={x + 8} y={y + 76} width={34} height={10} rx={5} className="sv-teal sv-pop" style={d(delay + 900)} />
    </Phone>
  )
}

function MobileBuild() {
  const toA = 'M118 90 C140 90 140 54 160 54'
  const toB = 'M118 90 C152 90 152 146 220 146'
  return (
    <>
      <g className="sv-in">
        <rect x={14} y={38} width={104} height={104} rx={10} className="sv-card" />
        {[0, 1, 2].map((i) => (
          <circle key={i} cx={24 + i * 7} cy={49} r={2} className="sv-bar" />
        ))}
        <text x={48} y={51.5} className="sv-lbl">
          app.dart
        </text>
      </g>
      {CODE.map((l, i) => (
        <Line key={i} x={24 + l.x} y={62 + i * 10} w={l.w} h={4.5} tone={l.tone ?? 'ink'} delay={150 + i * 90} />
      ))}
      <path d={toA} pathLength={1} className="sv-line sv-draw" style={d(800)} />
      <path d={toB} pathLength={1} className="sv-line sv-draw" style={d(800)} />
      <Packet path={toA} dur={1} begin={1.2} />
      <Packet path={toB} dur={1.2} begin={1.5} />
      <MiniApp x={160} y={10} delay={1000} />
      <MiniApp x={220} y={74} delay={1200} />
      <text x={185} y={122} textAnchor="middle" className="sv-t sv-t-xs sv-t-dim sv-in" style={d(1300)}>
        iOS
      </text>
      <text x={212} y={166} textAnchor="end" className="sv-t sv-t-xs sv-t-dim sv-in" style={d(1500)}>
        Android
      </text>
    </>
  )
}

function MobileLaunch() {
  const p = { x: 22, y: 10 }
  const line = 'M134 140 C152 138 162 132 178 126 S208 112 222 102 S248 80 262 72'
  return (
    <>
      <Phone x={p.x} y={p.y}>
        {Array.from({ length: 12 }, (_, i) => (
          <rect
            key={i}
            x={p.x + 13 + (i % 4) * 15}
            y={p.y + 58 + Math.floor(i / 4) * 17}
            width={11}
            height={11}
            rx={3.5}
            className={cn('sv-pop', i === 5 ? 'sv-teal' : 'sv-bar')}
            style={d(100 + i * 30)}
          />
        ))}
        <g className="sv-in" style={d(500)}>
          <rect x={p.x + 9} y={p.y + 130} width={66} height={22} rx={8} className="sv-col" />
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} x={p.x + 15 + i * 15} y={p.y + 135.5} width={11} height={11} rx={3.5} className="sv-bar" />
          ))}
        </g>
        <g className="sv-drop" style={d(700)}>
          <rect x={p.x + 8} y={p.y + 18} width={68} height={28} rx={8} className="sv-toast" />
          <rect x={p.x + 13} y={p.y + 26} width={12} height={12} rx={3.5} className="sv-teal" />
          <text x={p.x + 30} y={p.y + 30.5} className="sv-t sv-t-xs sv-t-dark">
            New order
          </text>
          <text x={p.x + 30} y={p.y + 40} className="sv-t sv-t-xxs sv-t-dark-2">
            just now
          </text>
        </g>
      </Phone>
      <rect x={120} y={20} width={154} height={140} rx={12} className="sv-card sv-in" style={d(150)} />
      <text x={134} y={40} className="sv-lbl sv-in" style={d(200)}>
        Downloads
      </text>
      <text x={133} y={70} className="sv-num sv-in" style={d(300)}>
        10K+
      </text>
      <g className="sv-pop" style={d(1700)}>
        <rect x={218} y={29} width={44} height={17} rx={8.5} className="sv-chip" />
        <Icon name="star" x={224} y={33} size={9} className="sv-ico-teal" />
        <text x={236} y={40.5} className="sv-t sv-t-xs">
          4.8
        </text>
      </g>
      <path d={`${line} L262 146 L134 146 Z`} className="sv-area sv-fade" style={d(1000)} />
      <path d={line} pathLength={1} className="sv-line-teal sv-draw" style={d(450)} />
      <circle cx={262} cy={72} r={3.2} className="sv-teal sv-pop" style={d(1300)} />
      <circle cx={262} cy={72} r={3.2} className="sv-ring-line sv-ring" style={d(1400)} />
    </>
  )
}

/* ------------------------------------------------------------------------------------------ */
/* 03 · AI & automation                                                                        */

function AiChat() {
  return (
    <>
      <g className="sv-in">
        <circle cx={30} cy={27} r={10} className="sv-card-teal" />
        <Glyph name="sparkles" x={24} y={21} size={12} tone="teal" />
        <text x={46} y={25} className="sv-t sv-t-sm">
          AI assistant
        </text>
        <text x={46} y={35} className="sv-lbl">
          Replies in seconds
        </text>
      </g>
      <g className="sv-in" style={d(300)}>
        <rect x={124} y={48} width={140} height={25} rx={12.5} className="sv-teal" />
        <text x={136} y={64} className="sv-t sv-t-dark">
          Do you deliver to Pune?
        </text>
      </g>
      <g className="sv-typing" style={d(800)}>
        <rect x={24} y={84} width={42} height={24} rx={12} className="sv-card" />
        {[0, 1, 2].map((i) => (
          <circle key={i} cx={36 + i * 9} cy={96} r={2.3} className="sv-dot sv-blink" style={d(i * 160)} />
        ))}
      </g>
      <g className="sv-in" style={d(2100)}>
        <rect x={24} y={84} width={178} height={40} rx={12} className="sv-card" />
        <text x={36} y={100} className="sv-t">
          Yes, in 2 days. Want me to
        </text>
        <text x={36} y={114} className="sv-t">
          place the order for you?
        </text>
      </g>
      <g className="sv-in" style={d(2700)}>
        <rect x={24} y={134} width={70} height={22} rx={11} className="sv-chip-teal" />
        <text x={59} y={148.5} textAnchor="middle" className="sv-t sv-t-sm sv-t-teal">
          Yes, please
        </text>
      </g>
      <g className="sv-in" style={d(2850)}>
        <rect x={100} y={134} width={88} height={22} rx={11} className="sv-chip" />
        <text x={144} y={148.5} textAnchor="middle" className="sv-t sv-t-sm">
          Talk to a human
        </text>
      </g>
    </>
  )
}

function AiKnowledge() {
  return (
    <>
      {[-10, -4].map((r, i) => (
        <g key={r} className="sv-in" style={d(i * 120)}>
          <rect x={30} y={58} width={52} height={68} rx={7} className="sv-card" transform={`rotate(${r} 56 92)`} />
        </g>
      ))}
      <g className="sv-in" style={d(240)}>
        <g transform="rotate(3 56 92)">
          <rect x={30} y={58} width={52} height={68} rx={7} className="sv-card" />
          <Glyph name="file" x={37} y={65} size={12} tone="teal" />
          {[34, 38, 28, 36, 22].map((w, i) => (
            <rect key={i} x={38} y={85 + i * 7.5} width={w} height={3} rx={1.5} className="sv-bar" />
          ))}
          <rect x={32} y={62} width={48} height={2} rx={1} className="sv-beam" />
        </g>
      </g>
      <path d="M88 92 L106 92" className="sv-flow" style={d(400)} />
      {Array.from({ length: 12 }, (_, i) => {
        const c = i % 4
        const r = Math.floor(i / 4)
        return <circle key={i} cx={114 + c * 12} cy={78 + r * 14} r={2.6} className="sv-vec" style={d(500 + (c * 3 + r) * 90)} />
      })}
      {[
        [126, 78],
        [138, 92],
        [114, 106],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r={2.6} className="sv-teal sv-pop sv-glow" style={d(1300 + i * 120)} />
      ))}
      <path d="M156 92 L170 92" className="sv-flow" style={d(1000)} />
      <rect x={172} y={34} width={104} height={110} rx={10} className="sv-card sv-in" style={d(900)} />
      <text x={183} y={52} className="sv-lbl sv-in" style={d(950)}>
        Answer
      </text>
      {[84, 76, 80, 52].map((w, i) => (
        <Line key={i} x={183} y={62 + i * 10} w={w} delay={1100 + i * 80} />
      ))}
      <Line x={183} y={72} w={76} tone="teal" delay={1700} />
      <g className="sv-pop" style={d(2000)}>
        <rect x={183} y={112} width={84} height={20} rx={10} className="sv-chip-teal" />
        <Icon name="file" x={190} y={117} size={10} strokeWidth={1.8} className="sv-ico-teal" />
        <text x={204} y={125.5} className="sv-t sv-t-xxs sv-t-teal">
          Policy.pdf · p.4
        </text>
      </g>
    </>
  )
}

const ACTIONS: { icon: IconName; label: string; y: number }[] = [
  { icon: 'database', label: 'Checks the CRM', y: 22 },
  { icon: 'calendar', label: 'Books a slot', y: 72 },
  { icon: 'whatsapp', label: 'Sends on WhatsApp', y: 122 },
]

function AiAgent() {
  const wires = ['M86 90 C105 90 105 40 124 40', 'M86 90 L124 90', 'M86 90 C105 90 105 140 124 140']
  return (
    <>
      <circle cx={60} cy={90} r={36} className="sv-orbit sv-in" />
      {wires.map((w, i) => (
        <path key={w} d={w} pathLength={1} className="sv-line sv-draw" style={d(250 + i * 750)} />
      ))}
      {wires.map((w, i) => (
        <Packet key={w} path={w} dur={0.9} begin={0.7 + i * 0.75} />
      ))}
      <circle cx={60} cy={90} r={26} className="sv-ring-line sv-ring" style={d(300)} />
      <g className="sv-pop">
        <circle cx={60} cy={90} r={26} className="sv-card-teal" />
        <Glyph name="bot" x={49} y={79} size={22} tone="teal" />
      </g>
      <text x={60} y={140} textAnchor="middle" className="sv-lbl sv-in" style={d(200)}>
        AI agent
      </text>
      {ACTIONS.map((a, i) => (
        <g key={a.label}>
          <g className="sv-in" style={d(400 + i * 750)}>
            <rect x={124} y={a.y} width={150} height={36} rx={10} className="sv-card" />
            <rect x={132} y={a.y + 8} width={20} height={20} rx={6} className="sv-bar" />
            <Glyph name={a.icon} x={136} y={a.y + 12} tone="ink" />
            <text x={160} y={a.y + 21.5} className="sv-t">
              {a.label}
            </text>
          </g>
          <Tick x={263} y={a.y + 18} delay={950 + i * 750} />
        </g>
      ))}
    </>
  )
}

/* ------------------------------------------------------------------------------------------ */
/* 04 · CRM & ERP                                                                              */

function Deal({ x, y, delay }: { x: number; y: number; delay: number }) {
  return (
    <g className="sv-in" style={d(delay)}>
      <rect x={x} y={y} width={64} height={30} rx={7} className="sv-card" />
      <circle cx={x + 10} cy={y + 11} r={3.5} className="sv-bar" />
      <rect x={x + 17} y={y + 9} width={34} height={4} rx={2} className="sv-ink" />
      <rect x={x + 8} y={y + 19} width={26} height={3} rx={1.5} className="sv-bar" />
    </g>
  )
}

function CrmPipeline() {
  return (
    <>
      {['Lead', 'Proposal', 'Won'].map((c, i) => {
        const x = 12 + i * 92
        return (
          <g key={c}>
            <g className="sv-in" style={d(i * 100)}>
              <rect x={x} y={14} width={80} height={152} rx={10} className="sv-col" />
              <text x={x + 10} y={31} className="sv-lbl">
                {c}
              </text>
            </g>
            <Deal x={x + 8} y={40} delay={150 + i * 100} />
          </g>
        )
      })}
      <Deal x={20} y={112} delay={250} />
      <g className="sv-move" style={d(500)}>
        <rect x={20} y={76} width={64} height={30} rx={7} className="sv-card-teal" />
        <text x={28} y={89} className="sv-t sv-t-xs">
          Mehta &amp; Co
        </text>
        <rect x={28} y={95} width={30} height={3} rx={1.5} className="sv-teal" />
        <Tick x={82} y={78} delay={3100} />
      </g>
    </>
  )
}

const MODULES: { icon: IconName; title: string; x: number; y: number }[] = [
  { icon: 'users', title: 'Sales', x: 14, y: 18 },
  { icon: 'package', title: 'Stock', x: 178, y: 18 },
  { icon: 'file', title: 'Accounts', x: 96, y: 110 },
]

function CrmSync() {
  const wires = ['M110 44 L178 44', 'M212 70 L174 110', 'M114 110 L76 70']
  return (
    <>
      {wires.map((w) => (
        <path key={w} d={w} pathLength={1} className="sv-line sv-draw" style={d(200)} />
      ))}
      {wires.map((w) => (
        <path key={w} d={w} className="sv-flow" style={d(2700)} />
      ))}
      <circle cx={110} cy={44} r={3} className="sv-packet sv-shot" style={{ ...d(700), '--dx': '68px', '--dy': '0px' } as CSSProperties} />
      <circle cx={212} cy={70} r={3} className="sv-packet sv-shot" style={{ ...d(1650), '--dx': '-38px', '--dy': '40px' } as CSSProperties} />
      {MODULES.map((m, i) => (
        <g key={m.title} className="sv-in" style={d(i * 120)}>
          <rect x={m.x} y={m.y} width={96} height={52} rx={11} className="sv-card" />
          <rect x={m.x + 9} y={m.y + 9} width={22} height={22} rx={7} className="sv-bar" />
          <Glyph name={m.icon} x={m.x + 14} y={m.y + 14} tone="ink" />
          <text x={m.x + 38} y={m.y + 23} className="sv-t">
            {m.title}
          </text>
        </g>
      ))}
      {/* what each module says as the order goes through */}
      <text x={52} y={62} className="sv-t sv-t-xxs sv-t-teal sv-in" style={d(450)}>
        Order #1042
      </text>
      <text x={216} y={62} className="sv-t sv-t-xxs sv-t-dim sv-out" style={d(1450)}>
        48 in stock
      </text>
      <text x={216} y={62} className="sv-t sv-t-xxs sv-t-teal sv-in" style={d(1500)}>
        46 in stock
      </text>
      <text x={134} y={154} className="sv-t sv-t-xxs sv-t-dim sv-out" style={d(2350)}>
        Invoice ready
      </text>
      <text x={134} y={154} className="sv-t sv-t-xxs sv-t-teal sv-in" style={d(2400)}>
        Invoice sent
      </text>
      <Tick x={186} y={112} delay={2500} />
    </>
  )
}

const BARS = [30, 42, 36, 52, 48, 62, 58, 72, 80]

function CrmDashboard() {
  const line = BARS.map((h, i) => `${i ? 'L' : 'M'}${33 + i * 27} ${150 - h}`).join(' ')
  return (
    <>
      <rect x={12} y={12} width={264} height={156} rx={12} className="sv-card sv-in" />
      {[
        ['Orders', '1,284'],
        ['On time', '98%'],
        ['Ops speed', '4×'],
      ].map(([label, value], i) => (
        <g key={label} className="sv-in" style={d(150 + i * 100)}>
          <text x={26 + i * 84} y={33} className="sv-lbl">
            {label}
          </text>
          <text x={25 + i * 84} y={55} className="sv-num sv-num-sm">
            {value}
          </text>
        </g>
      ))}
      {BARS.map((h, i) => (
        <rect key={i} x={26 + i * 27} y={156 - h} width={14} height={h} rx={3} className="sv-col-bar sv-grow-y" style={d(350 + i * 60)} />
      ))}
      <path d={line} pathLength={1} className="sv-line-teal sv-draw" style={d(1000)} />
      <circle cx={249} cy={70} r={3.2} className="sv-teal sv-pop" style={d(1700)} />
      <circle cx={249} cy={70} r={3.2} className="sv-ring-line sv-ring" style={d(1800)} />
    </>
  )
}

/* ------------------------------------------------------------------------------------------ */
/* 05 · Web development                                                                        */

function Browser({ children }: { children: ReactNode }) {
  return (
    <>
      <g className="sv-in">
        <rect x={12} y={12} width={264} height={156} rx={12} className="sv-card" />
        {[0, 1, 2].map((i) => (
          <circle key={i} cx={25 + i * 8} cy={24} r={2.4} className="sv-bar" />
        ))}
        <rect x={96} y={17} width={96} height={14} rx={7} className="sv-col" />
        <Icon name="lock" x={104} y={20} size={8} strokeWidth={2} className="sv-ico-dim" />
        <text x={115} y={27} className="sv-t sv-t-xxs sv-t-dim">
          yourbrand.com
        </text>
        <path d="M12 36 H276" className="sv-line" />
      </g>
      {children}
    </>
  )
}

function WebConvert() {
  return (
    <Browser>
      <rect x={26} y={44} width={10} height={10} rx={3} className="sv-teal sv-pop" style={d(150)} />
      {[0, 1, 2].map((i) => (
        <Line key={i} x={196 + i * 22} y={47.5} w={16} h={3} delay={200 + i * 60} />
      ))}
      <Line x={26} y={68} w={118} h={9} tone="ink" delay={300} />
      <Line x={26} y={82} w={92} h={9} tone="ink" delay={400} />
      <Line x={26} y={100} w={110} delay={550} />
      <Line x={26} y={109} w={84} delay={600} />
      <g className="sv-pop" style={d(750)}>
        <g className="sv-press" style={d(2050)}>
          <rect x={26} y={124} width={72} height={20} rx={10} className="sv-teal" />
          <text x={58} y={137} textAnchor="middle" className="sv-t sv-t-xs sv-t-dark">
            Get started
          </text>
        </g>
      </g>
      <g className="sv-in" style={d(500)}>
        <g className="sv-float">
          <rect x={160} y={62} width={102} height={84} rx={10} className="sv-hero-2" />
          <circle cx={190} cy={94} r={14} className="sv-glass" />
          <rect x={206} y={104} width={44} height={26} rx={6} className="sv-glass" />
        </g>
      </g>
      <circle cx={88} cy={134} r={10} className="sv-ring-line sv-ring-once" style={d(2050)} />
      <path d="M88 132 l0 13 l3.6 -3.4 l2.6 5.6 l2.4 -1.1 l-2.6 -5.5 l5 0 z" className="sv-cursor" style={d(1200)} />
      <g className="sv-pop" style={d(2350)}>
        <rect x={172} y={44} width={90} height={22} rx={11} className="sv-toast" />
        <Icon name="check" x={180} y={49.5} size={11} strokeWidth={2.6} className="sv-ico-teal" />
        <text x={195} y={58.5} className="sv-t sv-t-xs sv-t-dark">
          New lead
        </text>
      </g>
    </Browser>
  )
}

function WebSpeed() {
  return (
    <>
      <circle cx={84} cy={88} r={50} className="sv-track" />
      <circle cx={84} cy={88} r={50} pathLength={100} className="sv-gauge" style={{ ...d(200), strokeDashoffset: 2 }} transform="rotate(-90 84 88)" />
      <text x={84} y={98} textAnchor="middle" className="sv-num sv-num-lg sv-pop" style={d(900)}>
        98
      </text>
      <text x={84} y={160} textAnchor="middle" className="sv-lbl sv-in" style={d(1000)}>
        Performance
      </text>
      {['Accessibility', 'Best practices', 'SEO'].map((label, i) => {
        const cy = 42 + i * 48
        return (
          <g key={label}>
            <circle cx={176} cy={cy} r={14} className="sv-track sv-track-sm sv-in" style={d(300 + i * 150)} />
            <circle
              cx={176}
              cy={cy}
              r={14}
              pathLength={100}
              className="sv-gauge sv-gauge-sm"
              style={{ ...d(450 + i * 200), strokeDashoffset: 0 }}
              transform={`rotate(-90 176 ${cy})`}
            />
            <text x={176} y={cy + 3} textAnchor="middle" className="sv-t sv-t-xxs sv-pop" style={d(900 + i * 200)}>
              100
            </text>
            <text x={198} y={cy + 3.5} className="sv-t sv-in" style={d(350 + i * 150)}>
              {label}
            </text>
          </g>
        )
      })}
    </>
  )
}

function WebSearch() {
  const other = (y: number, delay: number) => (
    <g className="sv-rank-down" style={d(delay)}>
      <rect x={20} y={y} width={248} height={32} rx={9} className="sv-col" />
      <rect x={32} y={y + 9} width={50} height={3} rx={1.5} className="sv-bar" />
      <rect x={32} y={y + 18} width={140} height={5} rx={2.5} className="sv-bar" />
    </g>
  )
  return (
    <>
      <g className="sv-in">
        <rect x={20} y={12} width={248} height={28} rx={14} className="sv-card" />
        <circle cx={37} cy={25} r={5} className="sv-line" />
        <path d="M40.8 28.8 L44.5 32.5" className="sv-line" />
        <text x={54} y={29.5} className="sv-t sv-type-in" style={d(250)}>
          custom web development
        </text>
      </g>
      {other(92, 1300)}
      {other(130, 1300)}
      <g className="sv-rank-up" style={d(1300)}>
        <rect x={20} y={54} width={248} height={32} rx={9} className="sv-card-teal" />
        <text x={32} y={66} className="sv-t sv-t-xxs sv-t-teal">
          yourbrand.com
        </text>
        <text x={32} y={79} className="sv-t">
          Custom Web Development
        </text>
      </g>
      <g className="sv-pop" style={d(2300)}>
        <circle cx={250} cy={70} r={11} className="sv-teal" />
        <text x={250} y={73.5} textAnchor="middle" className="sv-t sv-t-sm sv-t-dark">
          #1
        </text>
      </g>
    </>
  )
}

/* ------------------------------------------------------------------------------------------ */

const REELS: Record<ServiceId, { caption: string; scene: ReactNode }[]> = {
  automation: [
    { caption: 'Map the workflow', scene: <AutoFlow /> },
    { caption: 'Connect every tool', scene: <AutoHub /> },
    { caption: 'Runs on autopilot', scene: <AutoPilot /> },
  ],
  mobile: [
    { caption: 'Design every screen', scene: <MobileDesign /> },
    { caption: 'One codebase, both stores', scene: <MobileBuild /> },
    { caption: 'Launch and grow', scene: <MobileLaunch /> },
  ],
  ai: [
    { caption: 'Understands your customers', scene: <AiChat /> },
    { caption: 'Answers from your data', scene: <AiKnowledge /> },
    { caption: 'Acts on its own', scene: <AiAgent /> },
  ],
  crm: [
    { caption: 'One pipeline for every deal', scene: <CrmPipeline /> },
    { caption: 'Every team in sync', scene: <CrmSync /> },
    { caption: 'Live dashboards', scene: <CrmDashboard /> },
  ],
  web: [
    { caption: 'Designed to convert', scene: <WebConvert /> },
    { caption: 'Built for speed', scene: <WebSpeed /> },
    { caption: 'Found on Google', scene: <WebSearch /> },
  ],
}
