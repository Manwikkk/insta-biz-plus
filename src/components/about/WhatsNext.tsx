'use client'

import Link from 'next/link'
import { useEffect, useRef, useState, type MutableRefObject, type PointerEvent, type ReactNode } from 'react'
import { Icon } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'

type Plan = 'agents' | 'saas' | 'office'

/** The three plans named in the statement. */
const PLANS: { key: Plan; phrase: string }[] = [
  { key: 'agents', phrase: 'AI agents' },
  { key: 'saas', phrase: 'vertical SaaS for SMBs' },
  { key: 'office', phrase: 'first international office' },
]

/** The work floating round the statement: which plan each card belongs to, how deep it sits, how slowly it floats. */
const CARDS: { id: 'chat' | 'voice' | 'flow' | 'saas' | 'office'; plan: Plan; z: number; dur: number }[] = [
  { id: 'chat', plan: 'agents', z: 16, dur: 6.2 },
  { id: 'voice', plan: 'agents', z: 24, dur: 7.4 },
  { id: 'flow', plan: 'agents', z: 12, dur: 6.8 },
  { id: 'saas', plan: 'saas', z: 20, dur: 7.9 },
  { id: 'office', plan: 'office', z: 10, dur: 6.6 },
]

const PROMPTS = ['Build an AI agent for my clinic', 'Automate our sales follow-ups', 'Launch a SaaS for salons', 'Connect WhatsApp to our CRM']

/** A prompt typed out, held, erased and replaced by the next; only while `run`. */
function useTyped(list: string[], run: boolean) {
  const [text, setText] = useState(list[0])
  useEffect(() => {
    if (!run) return
    let i = 0
    let n = list[0].length
    let erase = false
    let t = 0
    const step = () => {
      if (!erase && ++n > list[i].length) {
        erase = true
        t = window.setTimeout(step, 1700)
        return
      }
      if (erase && --n < 0) {
        erase = false
        i = (i + 1) % list.length
        n = 0
      }
      setText(list[i].slice(0, Math.max(0, n)))
      t = window.setTimeout(step, erase ? 26 : 55)
    }
    t = window.setTimeout(step, 1700)
    return () => window.clearTimeout(t)
  }, [list, run])
  return text
}

/**
 * Behind the statement, a field of nodes that drift and link up when close, with signals
 * running along the links. Near the pointer the nodes light and reach for it. Drawn only
 * while on screen; still for reduced motion.
 */
function NeuralField({ pointer, run }: { pointer: MutableRefObject<{ x: number; y: number } | null>; run: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const live = useRef(run)
  const wake = useRef(() => {})

  useEffect(() => {
    live.current = run
    if (run) wake.current()
  }, [run])

  useEffect(() => {
    const cv = ref.current
    const ctx = cv?.getContext('2d')
    if (!cv || !ctx) return
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches
    const pts = Array.from({ length: 70 }, (_, i) => {
      const a = Math.sin(i * 91.7) * 43758.5453
      const b = Math.sin(i * 47.3) * 12543.123
      return { x: a - Math.floor(a), y: b - Math.floor(b), vx: Math.cos(i) * 0.00006, vy: Math.sin(i * 1.7) * 0.00006 }
    })
    const signals: { a: number; b: number; t: number }[] = []
    let ink = '#0b0f15'
    let teal = '#0aa2b5'
    let w = 0
    let h = 0
    let raf = 0
    let last = 0
    let spawn = 0
    const paint = () => {
      const s = getComputedStyle(cv)
      ink = s.getPropertyValue('--ink').trim() || ink
      teal = s.getPropertyValue('--teal').trim() || teal
    }
    const fit = () => {
      const r = cv.getBoundingClientRect()
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      w = r.width
      h = r.height
      cv.width = Math.round(w * dpr)
      cv.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    const LINK = 150
    const draw = (now: number) => {
      const dt = last ? Math.min(50, now - last) : 16
      last = now
      ctx.clearRect(0, 0, w, h)
      const p = pointer.current
      for (const q of pts) {
        if (!still) {
          q.x += q.vx * dt
          q.y += q.vy * dt
          if (q.x < 0 || q.x > 1) q.vx *= -1
          if (q.y < 0 || q.y > 1) q.vy *= -1
        }
      }
      ctx.lineWidth = 1
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i]
        const ax = a.x * w
        const ay = a.y * h
        for (let j = i + 1; j < pts.length; j++) {
          const b = pts[j]
          const d = Math.hypot(ax - b.x * w, ay - b.y * h)
          if (d > LINK) continue
          ctx.globalAlpha = (1 - d / LINK) * 0.16
          ctx.strokeStyle = ink
          ctx.beginPath()
          ctx.moveTo(ax, ay)
          ctx.lineTo(b.x * w, b.y * h)
          ctx.stroke()
        }
        // the pointer: nearby nodes reach for it
        const pd = p ? Math.hypot(ax - p.x, ay - p.y) : Infinity
        if (p && pd < 170) {
          ctx.globalAlpha = (1 - pd / 170) * 0.55
          ctx.strokeStyle = teal
          ctx.beginPath()
          ctx.moveTo(ax, ay)
          ctx.lineTo(p.x, p.y)
          ctx.stroke()
        }
        ctx.globalAlpha = pd < 170 ? 0.9 : 0.32
        ctx.fillStyle = pd < 170 ? teal : ink
        ctx.beginPath()
        ctx.arc(ax, ay, pd < 170 ? 2.2 : 1.6, 0, Math.PI * 2)
        ctx.fill()
      }
      // signals run along the links
      if (!still && now > spawn && signals.length < 7) {
        spawn = now + 380
        const i = Math.floor(Math.random() * pts.length)
        const a = pts[i]
        let best = -1
        let bd = LINK
        pts.forEach((b, j) => {
          const d = Math.hypot((a.x - b.x) * w, (a.y - b.y) * h)
          if (j !== i && d < bd && Math.random() > 0.35) {
            bd = d
            best = j
          }
        })
        if (best >= 0) signals.push({ a: i, b: best, t: 0 })
      }
      for (let k = signals.length - 1; k >= 0; k--) {
        const s = signals[k]
        s.t += dt / 1300
        if (s.t >= 1) {
          signals.splice(k, 1)
          continue
        }
        const a = pts[s.a]
        const b = pts[s.b]
        const x = (a.x + (b.x - a.x) * s.t) * w
        const y = (a.y + (b.y - a.y) * s.t) * h
        ctx.globalAlpha = Math.sin(s.t * Math.PI) * 0.9
        ctx.fillStyle = teal
        ctx.shadowColor = teal
        ctx.shadowBlur = 10
        ctx.beginPath()
        ctx.arc(x, y, 2.4, 0, Math.PI * 2)
        ctx.fill()
        ctx.shadowBlur = 0
      }
      ctx.globalAlpha = 1
      raf = live.current && !still ? requestAnimationFrame(draw) : 0
    }
    wake.current = () => {
      if (raf) return
      last = 0
      raf = requestAnimationFrame(draw)
    }
    paint()
    fit()
    wake.current()
    const ro = new ResizeObserver(() => {
      fit()
      wake.current()
    })
    ro.observe(cv)
    // the theme switch recolours it
    const mo = new MutationObserver(() => {
      paint()
      wake.current()
    })
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      mo.disconnect()
    }
  }, [pointer])

  return <canvas ref={ref} className="wn-field" aria-hidden />
}

function Head({ icon, title, tag }: { icon: Parameters<typeof Icon>[0]['name']; title: string; tag?: ReactNode }) {
  return (
    <p className="wn-head">
      <span className="wn-icon">
        <Icon name={icon} size={14} />
      </span>
      <span className="wn-name">{title}</span>
      {tag}
    </p>
  )
}

/** What each card shows: a small piece of the work, running. */
function CardBody({ id, still }: { id: (typeof CARDS)[number]['id']; still: boolean }) {
  switch (id) {
    case 'chat':
      return (
        <>
          <Head icon="bot" title="Sales agent" tag={<span className="wn-live">Live</span>} />
          <div className="wn-chat">
            <p className="wn-msg is-in">Is the 2BHK still available?</p>
            <p className="wn-msg is-out is-typing">
              <i />
              <i />
              <i />
            </p>
            <p className="wn-msg is-out is-reply">Yes! Shall I book a visit for Saturday?</p>
          </div>
        </>
      )
    case 'voice':
      return (
        <>
          <Head icon="headset" title="Voice agent" tag={<span className="wn-live">On a call</span>} />
          <div className="wn-wave">
            {Array.from({ length: 22 }, (_, k) => (
              <i key={k} style={{ ['--k' as string]: k }} />
            ))}
          </div>
          <p className="wn-note">
            <Icon name="check" size={13} strokeWidth={2} /> Demo booked for Friday
          </p>
        </>
      )
    case 'flow':
      return (
        <>
          <Head icon="workflow" title="Workflow agent" />
          <div className="wn-flow">
            <span>Lead</span>
            <i />
            <span className="is-ai">
              <Icon name="sparkles" size={12} /> AI
            </span>
            <i />
            <span>CRM</span>
          </div>
          <p className="wn-note">Follow-up sent automatically</p>
        </>
      )
    case 'saas':
      return (
        <>
          <Head icon="modules" title="Vertical SaaS" tag={<span className="wn-tag">for SMBs</span>} />
          <svg viewBox="0 0 200 46" className="wn-spark" aria-hidden>
            <path d="M2 40 C 22 38, 30 30, 52 31 S 84 20, 104 22 S 140 9, 160 12 S 186 5, 198 3" pathLength={1} />
          </svg>
          <p className="wn-chips">
            <span>Bookings</span>
            <span>Billing</span>
            <span>CRM</span>
          </p>
        </>
      )
    case 'office':
      return (
        <>
          <Head icon="globe" title="International office" />
          <div className="wn-route">
            <span>AMD</span>
            <svg viewBox="0 0 120 30" aria-hidden>
              <path d="M4 26 Q 60 -8 116 26" />
              {still ? null : (
                <circle r="3">
                  <animateMotion dur="3.2s" repeatCount="indefinite" path="M4 26 Q 60 -8 116 26" />
                </circle>
              )}
            </svg>
            <span className="is-next">Next</span>
          </div>
          <p className="wn-note">Our first one is in the works</p>
        </>
      )
  }
}

/**
 * "What's next", set among the work it names. As it comes into view the AI at work arrives one
 * window at a time, every second and a half, each wired to the plan in the statement it
 * belongs to; then the focus keeps moving from window to window. Point at a plan to light all
 * of its windows, or at a window to hold it. The windows float at their own depths and drift
 * against the pointer; behind them a field of nodes trades signals. Under it all, a prompt
 * types out what we could build next and leads to the form.
 */
export function WhatsNext({ body, eyebrow }: { body: string; eyebrow: string }) {
  const root = useRef<HTMLDivElement>(null)
  const pointer = useRef<{ x: number; y: number } | null>(null)
  const cards = useRef<(HTMLDivElement | null)[]>([])
  const wires = useRef<(SVGPathElement | null)[]>([])
  const holes = useRef<(SVGRectElement | null)[]>([])
  const [seen, setSeen] = useState(false)
  const [still, setStill] = useState(false)
  /** a plan pointed at in the statement, or a window pointed at */
  const [hover, setHover] = useState<Plan | null>(null)
  const [pick, setPick] = useState<number | null>(null)
  /** how many windows have arrived, and which one has the focus while left alone */
  const [shown, setShown] = useState(0)
  const [focus, setFocus] = useState(0)
  const lit = pick != null ? [pick] : hover ? CARDS.flatMap((c, i) => (c.plan === hover && i < shown ? [i] : [])) : seen && !still && shown ? [focus] : []
  const active = lit.length ? CARDS[lit[0]].plan : null
  const typed = useTyped(PROMPTS, seen && !still)

  useEffect(() => {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    setStill(reduce)
    if (reduce) setShown(CARDS.length)
    const el = root.current!
    const io = new IntersectionObserver(([e]) => setSeen(e.isIntersecting), { threshold: 0.25 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // the windows arrive one at a time; each newcomer takes the focus
  useEffect(() => {
    if (!seen || still || shown >= CARDS.length) return
    const id = window.setTimeout(() => {
      setFocus(shown)
      setShown(shown + 1)
    }, shown ? 1500 : 450)
    return () => window.clearTimeout(id)
  }, [seen, still, shown])

  // then, left alone, the focus keeps moving from window to window
  useEffect(() => {
    if (!seen || still || shown < CARDS.length || hover || pick != null) return
    const id = window.setInterval(() => setFocus((f) => (f + 1) % CARDS.length), 1800)
    return () => window.clearInterval(id)
  }, [seen, still, shown, hover, pick])

  // wire each lit window to its plan, following it as it floats (wide screens, where the
  // windows stand round the statement)
  const litKey = lit.join(',')
  useEffect(() => {
    const el = root.current
    if (!el || !active || !matchMedia('(min-width: 1200px)').matches) return
    const mine = litKey.split(',').map(Number)
    // the wires never cross the words or the prompt: they surface from the edge of the text
    const blocks = [el.querySelector<HTMLElement>('.wn-stage > :first-child')!, el.querySelector<HTMLElement>('.wn-statement')!, el.querySelector<HTMLElement>('.wn-prompt')!]
    let raf = 0
    const tick = () => {
      const box = el.getBoundingClientRect()
      const [eyebrow, text, prompt] = blocks.map((b) => b.getBoundingClientRect())
      const cut = (rect: SVGRectElement | null, x0: number, y0: number, x1: number, y1: number) => {
        rect?.setAttribute('x', (x0 - box.left).toFixed(1))
        rect?.setAttribute('y', (y0 - box.top).toFixed(1))
        rect?.setAttribute('width', (x1 - x0).toFixed(1))
        rect?.setAttribute('height', (y1 - y0).toFixed(1))
      }
      cut(holes.current[0], Math.min(eyebrow.left, text.left) - 10, eyebrow.top - 10, Math.max(eyebrow.right, text.right) + 10, text.bottom + 8)
      cut(holes.current[1], prompt.left - 8, prompt.top - 8, prompt.right + 8, prompt.bottom + 8)
      const phrase = el.querySelector<HTMLElement>(`[data-plan="${active}"]`)!.getBoundingClientRect()
      mine.forEach((ci, k) => {
        const card = cards.current[ci]!.getBoundingClientRect()
        const above = card.bottom < phrase.top
        const ax = phrase.left + phrase.width / 2 - box.left
        const ay = (above ? phrase.top - 4 : phrase.bottom + 6) - box.top
        const tx = Math.min(Math.max(phrase.left + phrase.width / 2, card.left + 28), card.right - 28) - box.left
        const ty = (above ? card.bottom + 3 : card.top - 3) - box.top
        const my = (ay + ty) / 2
        wires.current[k]?.setAttribute('d', `M${ax.toFixed(1)} ${ay.toFixed(1)} C ${ax.toFixed(1)} ${my.toFixed(1)}, ${tx.toFixed(1)} ${my.toFixed(1)}, ${tx.toFixed(1)} ${ty.toFixed(1)}`)
      })
      raf = requestAnimationFrame(tick)
    }
    tick()
    return () => cancelAnimationFrame(raf)
  }, [active, litKey])

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    pointer.current = { x: e.clientX - r.left, y: e.clientY - r.top }
    e.currentTarget.style.setProperty('--px', ((e.clientX - r.left) / r.width - 0.5).toFixed(3))
    e.currentTarget.style.setProperty('--py', ((e.clientY - r.top) / r.height - 0.5).toFixed(3))
  }

  const parts = body.split(new RegExp(`(${PLANS.map((p) => p.phrase).join('|')})`))

  return (
    <div
      ref={root}
      className={cn('wn', active && 'has-on')}
      onPointerMove={onMove}
      onPointerLeave={() => {
        pointer.current = null
      }}
    >
      <NeuralField pointer={pointer} run={seen} />

      <div className="wn-stage">
        <p className="t-label text-ink-3" data-reveal="rise">
          {eyebrow}
        </p>
        <p className="wn-statement" data-reveal="rise" style={{ ['--d' as string]: '80ms' }}>
          {parts.map((part, i) => {
            const plan = PLANS.find((p) => p.phrase === part)
            return plan ? (
              <span
                key={i}
                data-plan={plan.key}
                className={cn('wn-key', active === plan.key && 'is-on')}
                onPointerEnter={() => setHover(plan.key)}
                onPointerLeave={() => setHover(null)}
              >
                {part}
              </span>
            ) : (
              part
            )
          })}
        </p>

        <Link href="/contact-us#contact-form" className="wn-prompt" data-reveal="rise" style={{ ['--d' as string]: '160ms' }} aria-label="Start a project with us">
          <Icon name="sparkles" size={17} className="shrink-0 text-teal-ink" />
          <span className="wn-prompt-text" aria-hidden>
            {typed}
            <span className="wn-cursor" />
          </span>
          <span className="wn-send" aria-hidden>
            <Icon name="arrow" size={16} />
          </span>
        </Link>
      </div>

      <div className="wn-cards" aria-hidden>
        {CARDS.map((c, i) => (
          <div
            key={c.id}
            ref={(el) => {
              cards.current[i] = el
            }}
            className={cn('wn-card', `is-${c.id}`, lit.includes(i) && 'is-on', i >= shown && 'is-out')}
            style={{ ['--z' as string]: c.z, ['--dur' as string]: `${c.dur}s` }}
            onPointerEnter={(e) => e.pointerType === 'mouse' && i < shown && setPick(i)}
            onPointerLeave={() => setPick(null)}
          >
            <div className="wn-float">
              <div className="wn-panel">
                <CardBody id={c.id} still={still} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <svg className="wn-links" aria-hidden>
        <defs>
          <mask id="wn-cut" maskUnits="userSpaceOnUse" x="0" y="0" width="100%" height="100%">
            <rect width="100%" height="100%" fill="#fff" />
            {[18, 30].map((rx, k) => (
              <rect
                key={k}
                rx={rx}
                fill="#000"
                ref={(el) => {
                  holes.current[k] = el
                }}
              />
            ))}
          </mask>
        </defs>
        {/* remounted for each new lighting, so each wiring draws itself in afresh */}
        <g key={litKey || 'none'} mask="url(#wn-cut)">
          {lit.map((ci, k) => (
            <path
              key={ci}
              ref={(el) => {
                wires.current[k] = el
              }}
            />
          ))}
        </g>
      </svg>
    </div>
  )
}
