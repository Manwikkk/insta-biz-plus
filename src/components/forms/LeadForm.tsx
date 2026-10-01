'use client'

import { useEffect, useId, useLayoutEffect, useRef, useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { needOptions, site, timelineOptions } from '@/content/site'
import { KeyAction } from '@/components/ui/KeyButton'
import { Icon } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'

type Variant = 'proposal' | 'contact'

export const ASK_EVENT = 'ibw:ask'
/** Other components can prefill the message field (e.g. "Ask us this" FAQ prompts). */
export function askInForm(question: string) {
  window.dispatchEvent(new CustomEvent(ASK_EVENT, { detail: question }))
}

const HEX = '[clip-path:polygon(50%_0,100%_25%,100%_75%,50%_100%,0_75%,0_25%)]'

function Chip({ on, children, onClick, tone }: { on: boolean; children: string; onClick: () => void; tone: 'light' | 'stage' }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={cn(
        'relative inline-flex h-9 items-center rounded-[7px] border px-4 text-[0.86rem] font-medium transition-[background-color,border-color,color,transform] duration-300 active:translate-y-px',
        tone === 'stage'
          ? on
            ? 'border-teal bg-teal text-[#04161a]'
            : 'border-stage-line text-stage-ink hover:border-stage-ink-2'
          : on
            ? 'border-ink bg-ink text-bg'
            : 'border-line-2 text-ink-2 hover:border-ink hover:text-ink',
      )}
    >
      <span
        aria-hidden
        className={cn(
          'absolute left-[5px] top-1/2 size-1.5 -translate-y-1/2 bg-current transition-transform duration-300',
          HEX,
          on ? 'scale-100' : 'scale-0',
        )}
      />
      {children}
    </button>
  )
}

function Field({
  label,
  name,
  type = 'text',
  required,
  textarea,
  tone,
  value,
  onChange,
  error,
  autoComplete,
  placeholder,
}: {
  label: string
  name: string
  type?: string
  required?: boolean
  textarea?: boolean
  tone: 'light' | 'stage'
  value: string
  onChange: (v: string) => void
  error?: string
  autoComplete?: string
  placeholder?: string
}) {
  const id = useId()
  const rows = 3
  const area = useRef<HTMLTextAreaElement>(null)
  // The message box grows with what is written (a long prefilled brief included), up to 40% of
  // the screen, so its text never has to scroll up behind the label.
  useLayoutEffect(() => {
    const el = area.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, Math.round(window.innerHeight * 0.4))}px`
  }, [value])
  // the writing, shared by both kinds of field
  const text = cn(
    'peer w-full bg-transparent px-4 text-[0.98rem] outline-none placeholder:text-transparent',
    tone === 'stage' ? 'text-stage-ink' : 'text-ink',
    // the label floats up on focus; a hint, when there is one, shows in its place
    placeholder && (tone === 'stage' ? 'focus:placeholder:text-stage-ink-2/70' : 'focus:placeholder:text-ink-3/70'),
  )
  // the box round it: on an input itself, on the frame round the message box
  const box = cn(
    'rounded-[10px] border transition-[border-color,box-shadow] duration-300',
    error ? 'border-ember' : tone === 'stage' ? 'border-stage-line' : 'border-line-2',
  )
  const inputFocus = tone === 'stage' ? 'focus:border-teal focus:shadow-[0_0_0_3px_rgb(34_199_216/0.15)]' : 'focus:border-ink focus:shadow-[0_0_0_3px_var(--teal-soft)]'
  const frameFocus =
    tone === 'stage'
      ? 'focus-within:border-teal focus-within:shadow-[0_0_0_3px_rgb(34_199_216/0.15)]'
      : 'focus-within:border-ink focus-within:shadow-[0_0_0_3px_var(--teal-soft)]'
  const labelCls = cn(
    'pointer-events-none absolute left-4 right-4 origin-left truncate transition-all duration-300 ease-[var(--ease-out)]',
    tone === 'stage' ? 'text-stage-ink-2' : 'text-ink-3',
    textarea ? 'top-4' : 'top-1/2 -translate-y-1/2',
    'peer-focus:top-2.5 peer-focus:translate-y-0 peer-focus:text-[0.66rem] peer-focus:font-label peer-focus:uppercase peer-focus:tracking-[0.07em]',
    'peer-[:not(:placeholder-shown)]:top-2.5 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-[0.66rem] peer-[:not(:placeholder-shown)]:font-label peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:tracking-[0.07em]',
  )
  return (
    // the message box: its frame holds the label above the writing, so text scrolled inside it
    // never passes behind the label
    <div className={cn('relative', textarea && box, textarea && frameFocus)}>
      {textarea ? (
        <textarea
          ref={area}
          id={id}
          name={name}
          rows={rows}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder ?? label}
          aria-invalid={!!error}
          className={cn(text, 'mt-7 block min-h-[clamp(68px,12vh,104px)] resize-none pb-3 leading-relaxed')}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder ?? label}
          autoComplete={autoComplete}
          aria-invalid={!!error}
          className={cn(text, box, inputFocus, 'h-[clamp(50px,8.4vh,58px)] pb-1 pt-5')}
        />
      )}
      <label htmlFor={id} className={labelCls}>
        {label}
        {required ? <span className="text-ember"> *</span> : null}
      </label>
      {error ? <p className="mt-1.5 text-[0.8rem] text-ember">{error}</p> : null}
    </div>
  )
}

export function LeadForm({
  variant = 'proposal',
  tone = 'light',
  id = 'contact-form',
  submitLabel,
  disclaimer,
  needLabel = 'I need help with',
  timelineLabel = 'When do you want to start?',
}: {
  variant?: Variant
  tone?: 'light' | 'stage'
  id?: string
  submitLabel: string
  disclaimer: string
  needLabel?: string
  timelineLabel?: string
}) {
  const [needs, setNeeds] = useState<string[]>([])
  const [timeline, setTimeline] = useState('')
  const [f, setF] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')
  const [serverError, setServerError] = useState('')
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    const onAsk = (e: Event) => {
      const q = (e as CustomEvent<string>).detail
      setF((v) => ({ ...v, message: v.message ? `${v.message}\n\n${q}` : q }))
      setState('idle')
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      window.setTimeout(() => formRef.current?.querySelector<HTMLTextAreaElement>('textarea')?.focus({ preventScroll: true }), 700)
    }
    window.addEventListener(ASK_EVENT, onAsk)
    return () => window.removeEventListener(ASK_EVENT, onAsk)
  }, [])

  const set = (k: keyof typeof f) => (v: string) => setF((s) => ({ ...s, [k]: v }))

  async function submit(e: FormEvent) {
    e.preventDefault()
    const errs: Record<string, string> = {}
    if (!f.name.trim()) errs.name = 'Please tell us your name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) errs.email = 'Please enter a valid email address.'
    if (variant === 'contact' && !f.subject.trim()) errs.subject = 'A short subject helps us route your message.'
    setErrors(errs)
    if (Object.keys(errs).length) return
    setState('sending')
    setServerError('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ form: variant, ...f, needs, timeline, page: window.location.pathname }),
      })
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string }
      if (!res.ok || !data.ok) throw new Error(data.error || 'Something went wrong.')
      setState('done')
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Something went wrong.')
      setState('error')
    }
  }

  const stage = tone === 'stage'
  const labelCls = cn('t-label mb-3 block', stage ? 'text-stage-ink-2' : 'text-ink-3')

  return (
    <div
      id={id}
      className={cn(
        'relative scroll-mt-28 rounded-[18px] border p-5 sm:px-8 sm:py-[clamp(18px,3.4vh,32px)]',
        stage ? 'border-stage-line bg-stage-2/70' : 'border-line bg-raise',
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        {state === 'done' ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex min-h-[420px] flex-col items-start justify-center gap-5"
            role="status"
          >
            <span className={cn('grid size-14 place-items-center bg-teal text-[#04161a]', HEX)}>
              <Icon name="check" size={24} strokeWidth={2.2} />
            </span>
            <h3 className={cn('t-h3', stage && 'text-stage-ink')}>Received. Thank you.</h3>
            <p className={cn('max-w-md', stage ? 'text-stage-ink-2' : 'text-ink-2')}>
              A real person on our team reads every message. We reply within 2 hours during business hours (Mon-Sat, 9 AM - 6 PM IST).
            </p>
            <button
              type="button"
              onClick={() => setState('idle')}
              className={cn('t-label underline underline-offset-4', stage ? 'text-stage-ink-2' : 'text-ink-3')}
            >
              Send another message
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            ref={formRef}
            onSubmit={submit}
            noValidate
            initial={false}
            exit={{ opacity: 0 }}
            className="grid gap-[clamp(14px,2.6vh,24px)]"
          >
            <fieldset>
              <legend className={labelCls}>{needLabel}</legend>
              <div className="flex flex-wrap gap-2">
                {needOptions.map((n) => (
                  <Chip
                    key={n}
                    tone={tone}
                    on={needs.includes(n)}
                    onClick={() => setNeeds((v) => (v.includes(n) ? v.filter((x) => x !== n) : [...v, n]))}
                  >
                    {n}
                  </Chip>
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend className={labelCls}>{timelineLabel}</legend>
              <div className="flex flex-wrap gap-2">
                {timelineOptions.map((t) => (
                  <Chip key={t} tone={tone} on={timeline === t} onClick={() => setTimeline(timeline === t ? '' : t)}>
                    {t}
                  </Chip>
                ))}
              </div>
            </fieldset>

            <div className={cn('grid gap-3 sm:grid-cols-2', variant === 'proposal' && 'xl:grid-cols-3')}>
              <Field
                tone={tone}
                label="Your full name"
                name="name"
                required
                value={f.name}
                onChange={set('name')}
                error={errors.name}
                autoComplete="name"
              />
              <Field
                tone={tone}
                label="Email address"
                name="email"
                type="email"
                required
                value={f.email}
                onChange={set('email')}
                error={errors.email}
                autoComplete="email"
              />
              <Field
                tone={tone}
                label="Phone (WhatsApp ok)"
                name="phone"
                type="tel"
                value={f.phone}
                onChange={set('phone')}
                autoComplete="tel"
              />
              {variant === 'contact' ? (
                <Field
                  tone={tone}
                  label="Subject"
                  placeholder="e.g. New ecommerce site for my brand"
                  name="subject"
                  required
                  value={f.subject}
                  onChange={set('subject')}
                  error={errors.subject}
                />
              ) : null}
            </div>
            <Field
              tone={tone}
              textarea
              label="Tell us about your project"
              placeholder={
                variant === 'contact' ? "Goals, deadlines, examples you like, or anything you're stuck on…" : 'Goals, deadline, anything…'
              }
              name="message"
              value={f.message}
              onChange={set('message')}
            />

            {state === 'error' ? (
              <div className="rounded-[10px] border border-ember/50 bg-ember/10 px-4 py-3 text-[0.9rem]" role="alert">
                <p className={stage ? 'text-stage-ink' : 'text-ink'}>{serverError}</p>
                <p className={cn('mt-1', stage ? 'text-stage-ink-2' : 'text-ink-2')}>
                  You can also reach us directly at{' '}
                  <a className="underline" href={`mailto:${site.email}`}>
                    {site.email}
                  </a>{' '}
                  or on{' '}
                  <a className="underline" href={site.whatsapp} target="_blank" rel="noopener noreferrer">
                    WhatsApp
                  </a>
                  .
                </p>
              </div>
            ) : null}

            <div className="flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className={cn('max-w-sm text-[0.8rem] leading-relaxed', stage ? 'text-stage-ink-2' : 'text-ink-3')}>{disclaimer}</p>
              <KeyAction
                type="submit"
                variant={stage ? 'stage' : 'key'}
                disabled={state === 'sending'}
                className="shrink-0 disabled:opacity-70"
              >
                {state === 'sending' ? 'Sending…' : submitLabel}
              </KeyAction>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}
