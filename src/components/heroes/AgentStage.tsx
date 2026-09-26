'use client'

import { useEffect, useRef, useState } from 'react'
import { HeroWindow, LiveTag } from './HeroWindow'
import { Icon } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'

type Line = { who: 'user' | 'agent'; text: string } | { who: 'tool'; text: string; ok: string; stage: number }

/** One agent run, as the customer sees it on WhatsApp and as the agent works it behind the scenes. */
const SCRIPT: Line[] = [
  { who: 'user', text: 'Hi! Do you have 2BHK flats near SG Highway under ₹80L?' },
  { who: 'tool', text: 'retrieve · property inventory (RAG)', ok: '3 matches', stage: 1 },
  { who: 'agent', text: 'Yes - 3 homes fit your budget. Would you like to visit one this Saturday?' },
  { who: 'user', text: 'Saturday 11 AM works for me.' },
  { who: 'tool', text: 'act · book the site visit', ok: 'booked', stage: 2 },
  { who: 'tool', text: 'update · CRM lead → hot', ok: 'synced', stage: 3 },
  { who: 'agent', text: 'Done! Saturday, 11:00 AM. I have shared the location with you here.' },
]
const STAGES = ['Understand', 'Retrieve', 'Act', 'Update CRM']
const PAUSE: Record<Line['who'], number> = { user: 1300, tool: 950, agent: 1500 }

/**
 * Hero figure for AI agent development: a WhatsApp sales agent qualifying a lead, its tool
 * calls shown between the messages and its run stages along the foot. Loops while on screen.
 */
export function AgentStage() {
  const ref = useRef<HTMLDivElement>(null)
  const [n, setN] = useState(0)
  const [typing, setTyping] = useState(false)
  const [visible, setVisible] = useState(false)
  const [still, setStill] = useState(false)

  useEffect(() => {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    setStill(reduce)
    if (reduce) setN(SCRIPT.length)
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.2 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!visible || still) return
    let t: number
    if (n >= SCRIPT.length) {
      t = window.setTimeout(() => setN(0), 3600)
    } else if (SCRIPT[n].who === 'agent' && !typing) {
      t = window.setTimeout(() => setTyping(true), 300)
    } else if (typing) {
      t = window.setTimeout(() => {
        setTyping(false)
        setN((v) => v + 1)
      }, 1000)
    } else {
      t = window.setTimeout(() => setN((v) => v + 1), n === 0 ? 500 : PAUSE[SCRIPT[n - 1].who])
    }
    return () => window.clearTimeout(t)
  }, [n, typing, visible, still])

  const shown = SCRIPT.slice(0, n)
  const stage = shown.reduce((acc, l) => (l.who === 'tool' ? l.stage : acc), shown.length ? 0 : -1)

  return (
    <div ref={ref}>
      <HeroWindow tone="dark" title="WhatsApp · AI sales agent" right={<LiveTag dark label="In production" />}>
        <div className="relative h-[330px] overflow-hidden px-4 [mask-image:linear-gradient(to_bottom,transparent,#000_18%)] sm:px-5">
          <ol className="absolute inset-x-4 bottom-3 flex flex-col gap-2 sm:inset-x-5" aria-live="polite">
            {shown.map((l, k) =>
              l.who === 'tool' ? (
                <li key={`${k}-${l.text}`} className="agent-bubble flex items-center gap-2 self-center rounded-full border border-stage-line bg-stage-2 px-3 py-1.5 font-label text-[0.68rem] text-stage-ink-2">
                  <span className="size-1.5 rounded-full bg-teal" aria-hidden />
                  {l.text}
                  <span className="flex items-center gap-1 text-teal">
                    <Icon name="check" size={12} strokeWidth={2.4} />
                    {l.ok}
                  </span>
                </li>
              ) : (
                <li
                  key={`${k}-${l.text}`}
                  className={cn(
                    'agent-bubble max-w-[82%] rounded-[16px] px-3.5 py-2.5 text-[0.86rem] leading-snug',
                    l.who === 'user' ? 'self-start rounded-bl-[6px] bg-stage-2 text-stage-ink' : 'self-end rounded-br-[6px] bg-teal text-[#04161a]',
                  )}
                >
                  {l.text}
                </li>
              ),
            )}
            {typing ? (
              <li className="agent-bubble agent-typing flex gap-1 self-end rounded-[16px] rounded-br-[6px] bg-teal/85 px-3.5 py-3" aria-label="Agent is typing">
                <span className="size-1.5 rounded-full bg-[#04161a]" />
                <span className="size-1.5 rounded-full bg-[#04161a]" />
                <span className="size-1.5 rounded-full bg-[#04161a]" />
              </li>
            ) : null}
          </ol>
        </div>
        <ol className="grid grid-cols-4 border-t border-stage-line" aria-label="Agent run">
          {STAGES.map((st, k) => (
            <li
              key={st}
              className={cn(
                'flex items-center justify-center gap-1.5 border-r border-stage-line px-1 py-3 text-center font-label text-[0.62rem] uppercase tracking-[0.06em] transition-colors duration-500 last:border-r-0',
                k < stage ? 'text-teal' : k === stage ? 'bg-stage-2 text-stage-ink' : 'text-stage-ink-2',
              )}
            >
              {k < stage ? <Icon name="check" size={11} strokeWidth={2.4} /> : null}
              {st}
            </li>
          ))}
        </ol>
      </HeroWindow>
      <div className="mt-3 grid grid-cols-3 overflow-hidden rounded-[14px] border border-line bg-raise">
        {[
          ['Prototype', '7 days'],
          ['Production', '7 weeks'],
          ['You own', 'code · prompts'],
        ].map(([a, b]) => (
          <div key={a} className="border-r border-line px-4 py-3 last:border-r-0">
            <p className="t-label text-ink-3">{a}</p>
            <p className="mt-1 text-[0.92rem] font-semibold">{b}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
