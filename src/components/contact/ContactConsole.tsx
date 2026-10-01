'use client'

import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { needOptions, site, timelineOptions } from '@/content/site'
import { ASK_EVENT } from '@/components/forms/LeadForm'
import { KeyAction } from '@/components/ui/KeyButton'
import { Icon, type IconName } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'

const ease = [0.16, 1, 0.3, 1] as const
const NEED_ICON: Record<string, IconName> = {
  'Business Automation': 'workflow',
  'Mobile App': 'smartphone',
  'AI / Automation': 'sparkles',
  'CRM / ERP': 'database',
  Website: 'browser',
  Other: 'plus',
}
const STEPS = ['What are we building?', 'When do you want to start?', 'Who should we reply to?', 'Anything we should know?'] as const

/**
 * The contact page's form, one question at a time: what, when, who, and anything else.
 * Enter moves on; a step that needs an answer says so in place. It posts the same lead the
 * site's other forms do, and FAQ prompts ("ask us this") land in its last step.
 */
export function ContactConsole() {
  const [step, setStep] = useState(0)
  const [dir, setDir] = useState(1)
  const [needs, setNeeds] = useState<string[]>([])
  const [timeline, setTimeline] = useState('')
  const [f, setF] = useState({ name: '', email: '', phone: '', message: '' })
  const [err, setErr] = useState('')
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')
  const [serverError, setServerError] = useState('')
  const box = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()

  // "Ask us this" from an FAQ (or a module list) lands in the last step, already written
  useEffect(() => {
    const onAsk = (e: Event) => {
      const q = (e as CustomEvent<string>).detail
      setF((v) => ({ ...v, message: v.message ? `${v.message}\n\n${q}` : q }))
      setState('idle')
      setDir(1)
      setStep(3)
      box.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
    window.addEventListener(ASK_EVENT, onAsk)
    return () => window.removeEventListener(ASK_EVENT, onAsk)
  }, [])

  // focus the step's first field as it arrives
  useEffect(() => {
    if (state !== 'idle' || step < 2) return
    const id = window.setTimeout(() => box.current?.querySelector<HTMLInputElement | HTMLTextAreaElement>('input, textarea')?.focus({ preventScroll: true }), 450)
    return () => window.clearTimeout(id)
  }, [step, state])

  const check = (k: number) => {
    if (k === 0 && !needs.length) return 'Pick at least one - or “Other”.'
    if (k === 2) {
      if (!f.name.trim()) return 'Please tell us your name.'
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) return 'Please enter a valid email address.'
    }
    return ''
  }
  const go = (to: number) => {
    if (to > step) {
      const e = check(step)
      setErr(e)
      if (e) return
    } else setErr('')
    setDir(to > step ? 1 : -1)
    setStep(to)
  }

  async function submit(e?: FormEvent) {
    e?.preventDefault()
    for (const k of [0, 2]) {
      const m = check(k)
      if (m) {
        setErr(m)
        setDir(-1)
        setStep(k)
        return
      }
    }
    setState('sending')
    setServerError('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          form: 'contact',
          ...f,
          subject: `New project: ${needs.join(', ')}`,
          needs,
          timeline,
          page: window.location.pathname,
        }),
      })
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string }
      if (!res.ok || !data.ok) throw new Error(data.error || 'Something went wrong.')
      setState('done')
    } catch (error) {
      setServerError(error instanceof Error ? error.message : 'Something went wrong.')
      setState('error')
    }
  }

  // Enter moves on - from a field, or from a chosen option (Space still toggles one); real buttons keep their own Enter
  const onKey = (e: KeyboardEvent) => {
    const t = e.target as HTMLElement
    if (e.key !== 'Enter' || e.shiftKey || t.tagName === 'TEXTAREA') return
    if (t.tagName === 'BUTTON' && !(t.classList.contains('ct-opt') && step === 0)) return
    e.preventDefault()
    if (step < 3) go(step + 1)
    else submit()
  }

  const slide = {
    enter: (d: number) => ({ opacity: 0, x: reduce ? 0 : d * 40, filter: 'blur(6px)' }),
    center: { opacity: 1, x: 0, filter: 'blur(0px)', transition: { duration: 0.55, ease } },
    exit: (d: number) => ({ opacity: 0, x: reduce ? 0 : d * -40, filter: 'blur(6px)', transition: { duration: 0.3, ease } }),
  }

  return (
    <div id="contact-form" ref={box} className="ct-console relative scroll-mt-28" onKeyDown={onKey}>
      <AnimatePresence mode="wait" initial={false}>
        {state === 'done' ? (
          <motion.div key="done" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }} className="grid min-h-[440px] content-center justify-items-start gap-5 p-[clamp(22px,3vw,40px)]" role="status">
            <svg viewBox="0 0 64 64" className="ct-done size-16" aria-hidden>
              <circle cx="32" cy="32" r="29" fill="none" stroke="var(--teal)" strokeWidth="3" pathLength={1} />
              <path d="M19 33l9 9 17-19" fill="none" stroke="var(--teal)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" pathLength={1} />
            </svg>
            <h2 className="t-h2">Got it, {f.name.split(' ')[0] || 'thanks'}.</h2>
            <p className="t-lede max-w-md">A real person reads every message. Expect our reply within 2 hours (Mon-Sat, 9-6 IST).</p>
            <p className="flex flex-wrap gap-2">
              {[...needs, timeline].filter(Boolean).map((x) => (
                <span key={x} className="tag">
                  {x}
                </span>
              ))}
            </p>
            <button
              type="button"
              onClick={() => {
                setState('idle')
                setStep(0)
              }}
              className="t-label text-ink-3 underline underline-offset-4"
            >
              Send another message
            </button>
          </motion.div>
        ) : (
          <motion.form key="form" onSubmit={submit} noValidate initial={false} exit={{ opacity: 0 }} className="flex min-h-[440px] flex-col p-[clamp(22px,3vw,40px)]">
            {/* where you are */}
            <div className="flex items-center gap-4">
              <span className="t-label text-ink-3">
                <span className="text-ink">{String(step + 1).padStart(2, '0')}</span> / 04
              </span>
              <span className="grid flex-1 grid-cols-4 gap-1.5" aria-hidden>
                {STEPS.map((_, k) => (
                  <span key={k} className="h-1 overflow-hidden rounded-full bg-line-2">
                    <span className="block h-full rounded-full bg-teal transition-transform duration-700 ease-[var(--ease-out)]" style={{ transform: `scaleX(${k <= step ? 1 : 0})`, transformOrigin: 'left' }} />
                  </span>
                ))}
              </span>
              <button type="button" onClick={() => go(step - 1)} disabled={step === 0} className="t-label inline-flex items-center gap-1 text-ink-3 transition-opacity hover:text-ink disabled:pointer-events-none disabled:opacity-0">
                <Icon name="arrow" size={13} className="rotate-180" /> Back
              </button>
            </div>

            <div className="relative mt-[clamp(22px,4vh,40px)] flex-1">
              <AnimatePresence mode="wait" initial={false} custom={dir}>
                <motion.fieldset key={step} custom={dir} variants={slide} initial="enter" animate="center" exit="exit" className="min-w-0">
                  <legend className="ct-q">{STEPS[step]}</legend>
                  {step === 0 ? (
                    <div className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                      {needOptions.map((n) => {
                        const on = needs.includes(n)
                        return (
                          <button
                            key={n}
                            type="button"
                            aria-pressed={on}
                            onClick={() => {
                              setErr('')
                              setNeeds((v) => (v.includes(n) ? v.filter((x) => x !== n) : [...v, n]))
                            }}
                            className={cn('ct-opt', on && 'is-on')}
                          >
                            <span className="ct-opt-icon">
                              <Icon name={NEED_ICON[n] ?? 'plus'} size={17} />
                            </span>
                            <span className="text-left leading-tight">{n}</span>
                            <span className="ct-opt-tick" aria-hidden>
                              <Icon name="check" size={11} strokeWidth={3} />
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  ) : step === 1 ? (
                    <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
                      {timelineOptions.map((t, k) => (
                        <button
                          key={t}
                          type="button"
                          aria-pressed={timeline === t}
                          onClick={() => {
                            setTimeline(t)
                            setDir(1)
                            window.setTimeout(() => setStep(2), 260)
                          }}
                          className={cn('ct-opt', timeline === t && 'is-on')}
                        >
                          <span className="ct-opt-icon">
                            <Icon name={(['spark', 'calendar', 'clock', 'globe'] as IconName[])[k]} size={17} />
                          </span>
                          <span>{t}</span>
                          <span className="ct-opt-tick" aria-hidden>
                            <Icon name="check" size={11} strokeWidth={3} />
                          </span>
                        </button>
                      ))}
                    </div>
                  ) : step === 2 ? (
                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                      <Line label="Your name" value={f.name} onChange={(v) => setF((s) => ({ ...s, name: v }))} autoComplete="name" required />
                      <Line label="Email" type="email" value={f.email} onChange={(v) => setF((s) => ({ ...s, email: v }))} autoComplete="email" required />
                      <Line label="Phone · WhatsApp ok" type="tel" value={f.phone} onChange={(v) => setF((s) => ({ ...s, phone: v }))} autoComplete="tel" className="sm:col-span-2" />
                    </div>
                  ) : (
                    <div className="mt-6">
                      <label className="ct-field block">
                        <span className="sr-only">Tell us about your project</span>
                        <textarea
                          rows={5}
                          value={f.message}
                          onChange={(e) => setF((s) => ({ ...s, message: e.target.value }))}
                          placeholder="Goals, a deadline, a site you like - bullet points are perfect."
                          className="ct-input min-h-[150px] resize-none py-4 leading-relaxed"
                        />
                      </label>
                    </div>
                  )}
                </motion.fieldset>
              </AnimatePresence>
            </div>

            {err ? (
              <p className="mt-4 flex items-center gap-2 text-[0.9rem] text-ember" role="alert">
                <Icon name="close" size={14} /> {err}
              </p>
            ) : null}
            {state === 'error' ? (
              <p className="mt-4 rounded-[10px] bg-ember/10 px-4 py-3 text-[0.9rem]" role="alert">
                {serverError} You can also write to{' '}
                <a className="underline" href={`mailto:${site.email}`}>
                  {site.email}
                </a>{' '}
                or{' '}
                <a className="underline" href={site.whatsapp} target="_blank" rel="noopener noreferrer">
                  WhatsApp us
                </a>
                .
              </p>
            ) : null}

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-5">
              <p className="t-label hidden items-center gap-2 text-ink-3 sm:flex">
                Press <kbd className="ct-kbd">Enter ↵</kbd>
              </p>
              {step < 3 ? (
                <KeyAction type="button" onClick={() => go(step + 1)} className="ml-auto">
                  {step === 1 && !timeline ? 'Skip' : 'Next'}
                </KeyAction>
              ) : (
                <KeyAction type="submit" disabled={state === 'sending'} className="ml-auto disabled:opacity-70" icon="send">
                  {state === 'sending' ? 'Sending…' : 'Send my message'}
                </KeyAction>
              )}
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}

function Line({
  label,
  value,
  onChange,
  type = 'text',
  autoComplete,
  required,
  className,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  autoComplete?: string
  required?: boolean
  className?: string
}) {
  return (
    <label className={cn('ct-field relative block', className)}>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} autoComplete={autoComplete} required={required} placeholder=" " className="ct-input peer h-[60px] pt-5" />
      <span className="ct-label">
        {label}
        {required ? <span className="text-ember"> *</span> : null}
      </span>
    </label>
  )
}
