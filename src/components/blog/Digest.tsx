'use client'

import { useState, type FormEvent } from 'react'
import { blogIndex } from '@/content/data'
import { KeyAction } from '@/components/ui/KeyButton'
import { Icon } from '@/components/ui/Icon'
import { MarkBlueprint } from '@/components/brand/MarkBlueprint'

/** Monthly digest sign-up (posts to the same lead endpoint as the forms). */
export function Digest() {
  const d = blogIndex.digest
  const [email, setEmail] = useState('')
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')
  const [msg, setMsg] = useState('')

  async function submit(e: FormEvent) {
    e.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setMsg('Please enter a valid email address.')
      setState('error')
      return
    }
    setState('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ form: 'newsletter', email, page: window.location.pathname }),
      })
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string }
      if (!res.ok || !data.ok) throw new Error(data.error || 'Something went wrong.')
      setState('done')
    } catch (err) {
      setMsg(err instanceof Error ? err.message : 'Something went wrong.')
      setState('error')
    }
  }

  return (
    <section id="newsletter" className="relative overflow-hidden bg-stage py-[clamp(80px,10vw,140px)] text-stage-ink" data-nav-tone="dark">
      <MarkBlueprint
        className="pointer-events-none absolute -right-24 top-1/2 hidden w-[560px] -translate-y-1/2 text-stage-ink-2 opacity-50 lg:block"
        exploded={0.4}
        strokeWidth={0.7}
      />
      <div className="shell relative grid gap-10 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-6">
          <p className="eyebrow t-label text-stage-ink-2">
            <span className="eyebrow-dot" aria-hidden />
            <span>{d.eyebrow}</span>
          </p>
          <h2 className="t-h2 mt-6">{d.title}</h2>
          <p className="mt-6 max-w-lg text-[1.08rem] leading-relaxed text-stage-ink-2">{d.body}</p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {d.points.map((p) => (
              <li key={p} className="tag border-stage-line text-stage-ink-2">
                {p}
              </li>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          {state === 'done' ? (
            <p className="flex items-center gap-3 rounded-[14px] border border-stage-line p-5 text-[1.05rem]" role="status">
              <Icon name="check" size={20} className="text-teal" /> You’re on the list. See you next month.
            </p>
          ) : (
            <form onSubmit={submit} noValidate className="grid gap-3">
              <label htmlFor="digest-email" className="t-label text-stage-ink-2">
                Email address
              </label>
              <div className="flex flex-col gap-3 xl:flex-row">
                <input
                  id="digest-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="h-[60px] min-w-0 flex-1 rounded-[12px] border border-stage-line bg-white/[0.04] px-5 text-[1.05rem] text-stage-ink outline-none transition-[border-color,box-shadow] placeholder:text-stage-ink-2/60 focus:border-teal focus:shadow-[0_0_0_4px_rgb(34_199_216/0.15)]"
                  aria-invalid={state === 'error'}
                />
                <KeyAction type="submit" variant="stage" disabled={state === 'sending'} className="h-[60px] justify-between xl:shrink-0">
                  {state === 'sending' ? 'Subscribing…' : 'Subscribe'}
                </KeyAction>
              </div>
              {state === 'error' ? <p className="text-[0.85rem] text-ember">{msg}</p> : null}
              <p className="text-[0.82rem] text-stage-ink-2">{d.note}</p>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
