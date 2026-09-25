import type { ReactNode } from 'react'
import type { ServiceId } from '@/content/services'
import { cn } from '@/lib/cn'

/**
 * Five small, self-running product scenes — one per service. Every label is taken
 * from that service's published deliverables and average result; nothing here is a
 * client claim. Animations are CSS keyframes that only run while `data-live` is on.
 */

function Chrome({ title, children, className }: { title: string; children: ReactNode; className?: string }) {
  return (
    <div className={cn('vg overflow-hidden rounded-[12px] border border-line bg-raise shadow-[var(--shadow-float)]', className)}>
      <div className="flex h-8 items-center gap-1.5 border-b border-line px-3">
        <span className="size-2 rounded-full bg-line-2" />
        <span className="size-2 rounded-full bg-line-2" />
        <span className="size-2 rounded-full bg-line-2" />
        <span className="t-label ml-2 truncate text-[0.6rem] text-ink-3">{title}</span>
      </div>
      <div className="relative p-4">{children}</div>
    </div>
  )
}

function Meter({ label, value, pct }: { label: string; value: string; pct: number }) {
  return (
    <div className="mt-3">
      <div className="flex items-baseline justify-between">
        <span className="t-label text-[0.6rem] text-ink-3">{label}</span>
        <span className="t-numeral text-[1.05rem]">{value}</span>
      </div>
      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-sink">
        <div className="vg-bar h-full rounded-full bg-teal" style={{ ['--w' as string]: `${pct}%` }} />
      </div>
    </div>
  )
}

function AutomationScene() {
  const flow = [
    { step: 'Trigger', item: 'New order' },
    { step: 'Approve', item: 'Auto-routed' },
    { step: 'Invoice', item: 'Generated' },
    { step: 'Notify', item: 'WhatsApp + email' },
  ]
  return (
    <Chrome title="workflow · order to invoice">
      <ol className="grid grid-cols-2 gap-2">
        {flow.map((f, i) => (
          <li
            key={f.step}
            className="vg-card relative rounded-[8px] border border-line bg-sink/60 px-2 py-1.5"
            style={{ ['--k' as string]: i }}
          >
            <p className="t-label text-[0.52rem] text-ink-3">
              {String(i + 1).padStart(2, '0')} · {f.step}
            </p>
            <p className="mt-0.5 text-[0.66rem] leading-tight text-ink">{f.item}</p>
            <span className="vg-done absolute right-2 top-1.5 text-[0.6rem] text-teal-ink">✓</span>
          </li>
        ))}
      </ol>
      <Meter label="Hours saved weekly · avg. result" value="30+" pct={75} />
    </Chrome>
  )
}

function WebScene() {
  return (
    <Chrome title="yourbrand.com · production">
      <div className="grid grid-cols-[1fr_auto] items-center gap-4">
        <div className="grid gap-2">
          <div className="vg-sk h-3 w-3/4 rounded bg-ink/80" style={{ ['--k' as string]: 0 }} />
          <div className="vg-sk h-2 w-full rounded bg-line-2" style={{ ['--k' as string]: 1 }} />
          <div className="vg-sk h-2 w-5/6 rounded bg-line-2" style={{ ['--k' as string]: 2 }} />
          <div className="vg-sk mt-1 h-5 w-24 rounded-[5px] bg-teal" style={{ ['--k' as string]: 3 }} />
        </div>
        <div className="relative size-[74px]">
          <svg viewBox="0 0 36 36" className="size-full -rotate-90">
            <circle cx="18" cy="18" r="15.5" fill="none" stroke="var(--line-2)" strokeWidth="3" />
            <circle
              className="vg-ring"
              cx="18"
              cy="18"
              r="15.5"
              fill="none"
              stroke="var(--teal)"
              strokeWidth="3"
              strokeLinecap="round"
              pathLength={100}
            />
          </svg>
          <span className="absolute inset-0 grid place-items-center t-numeral text-[1.25rem]">95+</span>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {['Server components', 'Edge rendering', 'SEO-ready'].map((t, i) => (
          <span key={t} className="vg-pop tag h-6 text-[0.58rem]" style={{ ['--k' as string]: 4 + i }}>
            {t}
          </span>
        ))}
      </div>
      <p className="t-label mt-3 text-[0.6rem] text-ink-3">Lighthouse score · avg. result</p>
    </Chrome>
  )
}

function MobileScene() {
  return (
    <div className="vg relative mx-auto h-[250px] w-[170px] rounded-[26px] border border-line-2 bg-raise p-2 shadow-[var(--shadow-float)]">
      <div className="absolute left-1/2 top-2 h-4 w-14 -translate-x-1/2 rounded-full bg-ink" />
      <div className="relative h-full overflow-hidden rounded-[20px] bg-bg px-3 pt-8">
        <div className="vg-push absolute inset-x-2 top-7 z-10 rounded-[10px] border border-line bg-raise/95 p-2 shadow-lg backdrop-blur">
          <p className="t-label text-[0.52rem] text-teal-ink">Push · OTA update</p>
          <p className="text-[0.68rem] leading-snug text-ink">Offline-first with smart sync</p>
        </div>
        <div className="mt-14 grid gap-2">
          <div className="h-16 rounded-[10px] bg-sink" />
          <div className="grid grid-cols-2 gap-2">
            <div className="h-10 rounded-[8px] bg-sink" />
            <div className="h-10 rounded-[8px] bg-teal/30" />
          </div>
        </div>
        <div className="absolute inset-x-3 bottom-4">
          <p className="t-label text-[0.55rem] text-ink-3">App downloads (avg)</p>
          <p className="t-numeral text-[1.6rem]">10K+</p>
          <div className="mt-2 h-1 overflow-hidden rounded-full bg-sink">
            <div className="vg-bar h-full bg-teal" style={{ ['--w' as string]: '100%' }} />
          </div>
        </div>
      </div>
    </div>
  )
}

function AIScene() {
  const steps = ['incoming · WhatsApp', 'retrieve · knowledge base (RAG)', 'qualify · lead', 'update · CRM']
  return (
    <Chrome title="agent · run trace">
      <ul className="grid gap-2 font-label text-[0.66rem]">
        {steps.map((s, i) => (
          <li key={s} className="vg-step flex items-center gap-2 text-ink-2" style={{ ['--k' as string]: i }}>
            <span className="grid size-4 place-items-center rounded-[4px] border border-line-2 text-[0.55rem] text-teal-ink">▸</span>
            {s}
            <span className="vg-done ml-auto text-teal-ink">done</span>
          </li>
        ))}
      </ul>
      <Meter label="Automation rate · avg. result" value="85%" pct={85} />
    </Chrome>
  )
}

function CRMScene() {
  const cols = [
    { name: 'Lead', cards: ['Enquiry · website', 'Enquiry · WhatsApp'] },
    { name: 'Quotation', cards: ['Proforma sent'] },
    { name: 'Won', cards: ['Order · dispatch'] },
  ]
  return (
    <Chrome title="pipeline · sales">
      <div className="grid grid-cols-3 gap-2">
        {cols.map((c, ci) => (
          <div key={c.name} className="rounded-[8px] bg-sink/70 p-1.5">
            <p className="t-label mb-1.5 px-0.5 text-[0.55rem] text-ink-3">{c.name}</p>
            <div className="grid gap-1.5">
              {c.cards.map((card, i) => (
                <div
                  key={card}
                  className={cn(
                    'vg-card rounded-[6px] border border-line bg-raise px-1.5 py-1.5 text-[0.6rem] leading-tight text-ink',
                    ci === 2 && 'border-teal/50',
                  )}
                  style={{ ['--k' as string]: ci * 2 + i }}
                >
                  {card}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <Meter label="Faster ops · avg. result" value="4×" pct={80} />
    </Chrome>
  )
}

const SCENES: Record<ServiceId, () => React.JSX.Element> = {
  automation: AutomationScene,
  mobile: MobileScene,
  ai: AIScene,
  crm: CRMScene,
  web: WebScene,
}

export function Vignette({ id, live = true, className }: { id: ServiceId; live?: boolean; className?: string }) {
  const Scene = SCENES[id]
  return (
    <div data-live={live ? 'true' : 'false'} className={cn('vignette', className)}>
      <Scene />
    </div>
  )
}
