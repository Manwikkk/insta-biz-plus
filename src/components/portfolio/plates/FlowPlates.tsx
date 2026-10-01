'use client'

import type { ReactNode } from 'react'
import { Icon, type IconName } from '@/components/ui/Icon'
import { num, useTween } from '@/components/heroes/solutions/kit'
import { cn } from '@/lib/cn'
import { Chip, Toast, usePhase } from './kit'

/*
 * The automation projects, running: each shows the work arriving, being handled on its own,
 * and landing where the team needs it, with the counters a client watches.
 */

function Panel({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('rounded-[14px] bg-white shadow-[0_1px_2px_rgb(11_15_21/0.06),0_0_0_1px_rgb(11_15_21/0.06)]', className)}>{children}</div>
}

function Count({ value, className }: { value: number; className?: string }) {
  const v = useTween(value, 700)
  return <span className={cn('tabular-nums', className)}>{num(v)}</span>
}

/* ------------------------------------------------ LinkedIn: prospects visited, connected, handed to the CRM */

const LI_STAGES: { label: string; tone: string }[] = [
  { label: 'Visited', tone: '#6b7280' },
  { label: 'Invited', tone: '#0a66c2' },
  { label: 'Connected', tone: '#0e7490' },
  { label: 'Messaged', tone: '#7c3aed' },
  { label: 'In CRM', tone: '#16a34a' },
]
const LI_PEOPLE = [
  ['Nisha Mehta', 'Founder · Loom Studio', '#f59e0b'],
  ['Arjun Rao', 'COO · Rao Logistics', '#0ea5e9'],
  ['Priya Nair', 'Head of Sales · Fintrex', '#8b5cf6'],
  ['Dev Patel', 'Director · Patel Agro', '#10b981'],
  ['Sara Khan', 'CEO · Kraft Labs', '#ef4444'],
] as const
/** each prospect's stage at each step of the loop */
const LI_AT = [
  [2, 1, 0, 0, 0],
  [3, 2, 1, 0, 0],
  [4, 3, 2, 1, 0],
  [4, 4, 3, 2, 1],
  [4, 4, 4, 3, 2],
  [4, 4, 4, 4, 3],
] as const
const LI_MS = 1900

export function LinkedIn({ live }: { live: boolean }) {
  const ph = usePhase(6, LI_MS, live, 4)
  const at = LI_AT[ph]
  const sum = (min: number) => at.filter((s) => s >= min).length
  return (
    <div className="flex h-full gap-3 bg-[#f3f2ef] p-4">
      <Panel className="flex w-[250px] shrink-0 flex-col p-4">
        <span className="flex items-center gap-2">
          <span className="grid size-8 place-items-center rounded-[8px] bg-[#0a66c2] text-white">
            <Icon name="linkedin" size={16} />
          </span>
          <span>
            <span className="block text-[12px] font-semibold">Founders · Ahmedabad</span>
            <span className="flex items-center gap-1 text-[9.5px] text-[#16a34a]">
              <span className="size-1.5 rounded-full bg-[#16a34a]" /> Running
            </span>
          </span>
        </span>
        <div className="mt-4 grid gap-3">
          {[
            ['Profiles visited', 212 + ph * 6, 300],
            ['Invites sent', 118 + sum(1) * 2 + ph * 2, 300],
            ['Connected', 54 + sum(2) + ph, 300],
            ['Replies', 17 + sum(3), 300],
          ].map(([l, v, max]) => (
            <div key={l as string}>
              <p className="flex justify-between text-[10px]">
                <span className="text-[#6b7280]">{l}</span>
                <Count value={v as number} className="font-semibold" />
              </p>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-[#eef1f5]">
                <div className="h-full rounded-full bg-[#0a66c2] transition-[width] duration-700" style={{ width: `${((v as number) / (max as number)) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-[10px] font-semibold">The sequence</p>
        <ol className="mt-1.5 grid gap-1">
          {['Day 1 · visit the profile', 'Day 2 · connection invite', 'Day 4 · intro message', 'Day 7 · gentle follow-up'].map((d, k) => (
            <li key={d} className={cn('flex items-center gap-2 rounded-[7px] px-2 py-1 text-[9.5px] transition-colors duration-500', k === ph % 4 ? 'bg-[#e8f1fb] font-semibold text-[#0a66c2]' : 'text-[#6b7280]')}>
              <span className={cn('size-1.5 rounded-full', k === ph % 4 ? 'bg-[#0a66c2]' : 'bg-[#cbd5e1]')} />
              {d}
            </li>
          ))}
        </ol>
        <div className="mt-auto rounded-[10px] bg-[#f3f6f9] p-2.5">
          <p className="flex justify-between text-[9.5px] text-[#6b7280]">
            <span>Today, at a safe pace</span>
            <span className="font-semibold tabular-nums text-[#0b0f15]">{32 + ph * 3} / 80</span>
          </p>
          <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-[#e2e8f0]">
            <div className="h-full bg-[#16a34a] transition-[width] duration-700" style={{ width: `${((32 + ph * 3) / 80) * 100}%` }} />
          </div>
        </div>
      </Panel>
      <Panel className="relative min-w-0 flex-1 p-4">
        <p className="text-[13px] font-semibold">Prospects</p>
        <p className="text-[9.5px] text-[#6b7280]">Each one moves on by itself - replies land in your CRM</p>
        <ul className="mt-3 grid gap-2">
          {LI_PEOPLE.map(([n, t, c], k) => {
            const s = at[k]
            return (
              <li key={n} className={cn('flex items-center gap-3 rounded-[10px] border px-2.5 py-[11px] transition-colors duration-500', s === 4 ? 'border-[#bbf7d0] bg-[#f0fdf4]' : 'border-[#eef0f3]')}>
                <span className="grid size-8 shrink-0 place-items-center rounded-full text-[10px] font-bold text-white" style={{ background: c }}>
                  {n
                    .split(' ')
                    .map((w) => w[0])
                    .join('')}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[11px] font-semibold">{n}</span>
                  <span className="block truncate text-[9.5px] text-[#6b7280]">{t}</span>
                </span>
                <span className="flex gap-0.5">
                  {LI_STAGES.map((st, j) => (
                    <span key={st.label} className="h-1.5 w-5 rounded-full transition-colors duration-500" style={{ background: j <= s ? LI_STAGES[s].tone : '#e5e7eb' }} />
                  ))}
                </span>
                <Chip tone={LI_STAGES[s].tone} className="w-[74px] justify-center">
                  {s === 4 ? <Icon name="database" size={9} /> : null}
                  {LI_STAGES[s].label}
                </Chip>
              </li>
            )
          })}
        </ul>
        <Toast show={ph === 2} icon="send" tone="#0a66c2" title="Reply from Nisha Mehta" note="“Sure - let’s talk Thursday.”" />
        <Toast show={ph === 4} icon="database" tone="#16a34a" title="Arjun Rao added to your CRM" note="With the whole conversation attached" />
      </Panel>
    </div>
  )
}

/* ------------------------------------------------ IndiaMART: an enquiry answered in seconds */

const IM_LEADS = [
  { buyer: 'Rakesh Traders', city: 'Surat', item: 'SS pipes 2" · 500 m', rep: 'Karan' },
  { buyer: 'Mahadev Steel', city: 'Rajkot', item: 'MS angles · 8 tonnes', rep: 'Pooja' },
]
const IM_STEPS: { icon: IconName; label: string }[] = [
  { icon: 'bell', label: 'Captured' },
  { icon: 'scan', label: 'Checked' },
  { icon: 'workflow', label: 'Routed' },
  { icon: 'whatsapp', label: 'Replied' },
]
const IM_MS = [1500, 1300, 1300, 1400, 2400, 1500, 1300, 1300, 1400, 2400] as const

export function IndiaMart({ live }: { live: boolean }) {
  const ph = usePhase(10, IM_MS, live, 4)
  const lead = IM_LEADS[ph < 5 ? 0 : 1]
  const step = ph % 5 // 0 arrives … 4 all done
  const today = 44 + (ph >= 1 ? 1 : 0) + (ph >= 6 ? 1 : 0)
  return (
    <div className="flex h-full gap-3 bg-[#f4f5fb] p-4">
      {/* the enquiry */}
      <Panel className="w-[228px] shrink-0 overflow-hidden">
        <p className="flex items-center justify-between bg-[#2e3192] px-3 py-2 text-[11px] font-semibold text-white">
          IndiaMART · Buy leads <span className="rounded-full bg-white/20 px-1.5 text-[9.5px] tabular-nums">{today} today</span>
        </p>
        <div className="p-3">
          <div key={lead.buyer} className="pl-drop rounded-[10px] border border-[#c7c9f0] bg-[#f6f6fe] p-2.5">
            <p className="flex items-center justify-between text-[9.5px]">
              <Chip tone="#e11d48">New enquiry</Chip>
              <span className="text-[#6b7280]">just now</span>
            </p>
            <p className="mt-1.5 text-[12px] font-semibold">{lead.buyer}</p>
            <p className="text-[10px] text-[#6b7280]">{lead.city}, Gujarat</p>
            <p className="mt-1.5 text-[10.5px] font-medium">{lead.item}</p>
            <p className="mt-1 text-[9.5px] text-[#6b7280]">Mobile •••• 4521 · verified</p>
          </div>
          {[
            ['Shiv Hardware', 'GI sheets · 2 tonnes'],
            ['Om Fabricators', 'MS pipes · 300 m'],
            ['Jay Ambe Metals', 'Copper wire · 150 kg'],
          ].map(([b, i]) => (
            <div key={b} className="mt-2 rounded-[10px] border border-[#eceef6] p-2.5 opacity-70">
              <p className="text-[10.5px] font-semibold">{b}</p>
              <p className="text-[9.5px] text-[#6b7280]">{i}</p>
              <p className="mt-1 text-[9px] font-semibold text-[#16a34a]">Replied in 7 s</p>
            </div>
          ))}
        </div>
      </Panel>
      {/* what happens to it */}
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <Panel className="p-4">
          <p className="text-[12px] font-semibold">What happens next, on its own</p>
          <div className="relative mt-4 grid grid-cols-4">
            <span className="absolute left-[12.5%] right-[12.5%] top-[17px] h-[2px] bg-[#e7e8f3]" />
            <span className="absolute left-[12.5%] top-[17px] h-[2px] bg-[#2e3192] transition-[width] duration-700" style={{ width: `${(Math.min(step, 3) / 3) * 75}%` }} />
            {IM_STEPS.map((s, k) => (
              <span key={s.label} className="relative flex flex-col items-center gap-1.5">
                <span className={cn('grid size-9 place-items-center rounded-full border-2 transition-all duration-500', k <= step - 1 || step === 4 ? 'border-[#2e3192] bg-[#2e3192] text-white' : k === step ? 'pl-ring border-[#2e3192] bg-white text-[#2e3192]' : 'border-[#e2e4f0] bg-white text-[#a1a5c4]')}>
                  <Icon name={s.icon} size={15} />
                </span>
                <span className="text-[10px] font-medium">{s.label}</span>
              </span>
            ))}
          </div>
        </Panel>
        <div className="grid grid-cols-2 gap-3">
          <Outcome on={step >= 2} icon="database" tone="#0e7490" title="Lead in your CRM" note={`${lead.buyer} · ${lead.item}`} />
          <Outcome on={step >= 2} icon="users" tone="#7c3aed" title={`Assigned to ${lead.rep}`} note="Nearest rep for the city, by rule" />
          <Panel className={cn('col-span-2 p-3 transition-all duration-500', step >= 3 ? 'opacity-100' : 'translate-y-2 opacity-0')}>
            <p className="flex items-center gap-2 text-[11px] font-semibold">
              <span className="grid size-6 place-items-center rounded-full bg-[#16a34a] text-white">
                <Icon name="whatsapp" size={12} />
              </span>
              WhatsApp reply sent
              <span className="ml-auto flex items-center gap-1 rounded-full bg-[#ecfdf5] px-2 py-0.5 text-[10px] text-[#15803d]">
                <Icon name="clock" size={10} /> in 8 s
              </span>
            </p>
            <p className="mt-2 max-w-[340px] rounded-[10px] rounded-tl-[3px] bg-[#e7fbe9] px-2.5 py-1.5 text-[10.5px] text-[#14532d]">
              Hi {lead.buyer.split(' ')[0]} team, thanks for your enquiry on {lead.item.split(' · ')[0]}. Our price list is attached - {lead.rep} will call you in 10 minutes.
            </p>
          </Panel>
        </div>
        <Panel className="mt-auto grid grid-cols-3 divide-x divide-[#eef0f3] py-2.5 text-center">
          {[
            ['Enquiries this week', 312 + (ph >= 1 ? 1 : 0) + (ph >= 6 ? 1 : 0)],
            ['Average first reply', 8],
            ['Missed', 0],
          ].map(([l, v], k) => (
            <span key={l as string}>
              <span className="block text-[15px] font-semibold tabular-nums">{k === 1 ? `${v} s` : <Count value={v as number} />}</span>
              <span className="block text-[9px] text-[#6b7280]">{l}</span>
            </span>
          ))}
        </Panel>
      </div>
    </div>
  )
}

function Outcome({ on, icon, tone, title, note }: { on: boolean; icon: IconName; tone: string; title: string; note: string }) {
  return (
    <Panel className={cn('flex items-center gap-2.5 p-3 transition-all duration-500', on ? 'opacity-100' : 'translate-y-2 opacity-0')}>
      <span className="grid size-8 shrink-0 place-items-center rounded-[9px] text-white" style={{ background: tone }}>
        <Icon name={icon} size={15} />
      </span>
      <span className="min-w-0">
        <span className="block text-[11px] font-semibold">{title}</span>
        <span className="block truncate text-[9.5px] text-[#6b7280]">{note}</span>
      </span>
    </Panel>
  )
}

/* ------------------------------------------------ Ping: a WhatsApp campaign sent, read, answered */

const PING_MS = [1600, 1700, 1700, 1900, 1900, 2400, 1000] as const

export function Ping({ live }: { live: boolean }) {
  const ph = usePhase(7, PING_MS, live, 5)
  const sent = [0, 6200, 12480, 12480, 12480, 12480, 0][ph]
  const delivered = [0, 5900, 12102, 12102, 12102, 12102, 0][ph]
  const read = [0, 2100, 7400, 9874, 9874, 9874, 0][ph]
  const replied = [0, 120, 640, 1236, 1290, 1312, 0][ph]
  const rows: [string, number, string][] = [
    ['Sent', sent, '#0b0f15'],
    ['Delivered', delivered, '#0e7490'],
    ['Read', read, '#16a34a'],
    ['Replied', replied, '#7c3aed'],
  ]
  return (
    <div className="flex h-full gap-3 bg-[#eef4ef] p-4">
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <Panel className="p-4">
          <p className="flex items-center gap-2 text-[12px] font-semibold">
            <span className="grid size-7 place-items-center rounded-[8px] bg-[#25d366] text-white">
              <Icon name="whatsapp" size={14} />
            </span>
            Diwali offer · broadcast
            <Chip tone={ph === 0 || ph === 6 ? '#6b7280' : ph >= 2 ? '#16a34a' : '#d97706'} className="ml-auto">
              {ph === 0 || ph === 6 ? 'Scheduled' : ph === 1 ? 'Sending…' : 'Sent'}
            </Chip>
          </p>
          <div className="mt-3 grid grid-cols-[1fr_1.1fr] gap-3">
            <div className="rounded-[10px] bg-[#f6f8f6] p-2.5 text-[10px]">
              <p className="text-[#6b7280]">Template · approved by Meta</p>
              <p className="mt-1 font-medium">diwali_offer_2026</p>
              <p className="mt-2 text-[#6b7280]">Audience</p>
              <p className="mt-0.5 font-medium">All customers · 12,480</p>
            </div>
            <div className="rounded-[10px] rounded-tl-[3px] bg-[#dcf8c6] p-2.5 text-[10.5px] leading-snug text-[#1f3a1f]">
              Hi <b>Meera</b>, our Diwali sale is live - 20% off every cotton saree till Sunday. Reply YES to see the new range.
            </div>
          </div>
        </Panel>
        <Panel className="flex-1 p-4">
          <p className="text-[12px] font-semibold">Delivery</p>
          <div className="mt-3 grid gap-2.5">
            {rows.map(([l, v, c]) => (
              <div key={l} className="grid grid-cols-[70px_1fr_64px] items-center gap-3 text-[10.5px]">
                <span className="text-[#6b7280]">{l}</span>
                <span className="h-2 overflow-hidden rounded-full bg-[#eef1ee]">
                  <span className="block h-full rounded-full transition-[width] duration-[1200ms]" style={{ width: `${(v / 12480) * 100}%`, background: c }} />
                </span>
                <Count value={v} className="text-right font-semibold" />
              </div>
            ))}
          </div>
          <p className="mt-3 flex items-center justify-between border-t border-[#eef1ee] pt-2.5 text-[10.5px]">
            <span className="text-[#6b7280]">Orders from this campaign</span>
            <span className="font-semibold">
              <Count value={[0, 12, 64, 131, 168, 186, 0][ph]} /> · ₹ <Count value={[0, 22100, 117800, 241000, 309400, 342600, 0][ph]} />
            </span>
          </p>
        </Panel>
      </div>
      {/* a customer's phone */}
      <div className="relative w-[230px] shrink-0 overflow-hidden rounded-[30px] border-[6px] border-[#111] bg-[#ece5dd] shadow-[0_24px_50px_-24px_rgb(11_15_21/0.6)]">
        <p className="flex items-center gap-2 bg-[#075e54] px-3 pb-2 pt-3 text-white">
          <span className="grid size-6 place-items-center rounded-full bg-white/20 text-[9px] font-bold">SH</span>
          <span>
            <span className="block text-[10.5px] font-semibold">Saree House</span>
            <span className="block text-[8.5px] text-white/70">Business account</span>
          </span>
        </p>
        <div className="grid gap-1.5 p-2.5 text-[10px] leading-snug">
          <Bubble on={ph >= 1 && ph < 6} side="in">
            Hi Meera, our Diwali sale is live - 20% off every cotton saree till Sunday. Reply YES to see the new range.
          </Bubble>
          <Bubble on={ph >= 3 && ph < 6} side="out">
            YES! Do you have it in maroon?
          </Bubble>
          <Bubble on={ph >= 4 && ph < 6} side="in">
            We do - here are 6 maroon cotton sarees.
            <span className="mt-1.5 grid gap-1">
              <span className="rounded-[6px] bg-white py-1 text-center font-semibold text-[#0e7490] shadow-[0_0_0_1px_rgb(14_116_144/0.2)]">See the range</span>
              <span className="rounded-[6px] bg-white py-1 text-center font-semibold text-[#0e7490] shadow-[0_0_0_1px_rgb(14_116_144/0.2)]">Talk to the shop</span>
            </span>
          </Bubble>
          <Bubble on={ph === 5} side="note">
            Assigned to Priya · live inbox
          </Bubble>
        </div>
      </div>
    </div>
  )
}

function Bubble({ on, side, children }: { on: boolean; side: 'in' | 'out' | 'note'; children: ReactNode }) {
  return (
    <span
      className={cn(
        'max-w-[88%] px-2.5 py-1.5 shadow-[0_1px_1px_rgb(0_0_0/0.08)] transition-all duration-500',
        side === 'in' && 'justify-self-start rounded-[9px] rounded-tl-[2px] bg-white',
        side === 'out' && 'justify-self-end rounded-[9px] rounded-tr-[2px] bg-[#dcf8c6]',
        side === 'note' && 'justify-self-center rounded-full bg-[#fff6d6] text-[9px] font-semibold text-[#8a6d00]',
        on ? 'opacity-100' : 'translate-y-2 opacity-0',
      )}
    >
      {children}
    </span>
  )
}

/* ------------------------------------------------ Custom workflow: one run, from a new row to a paid invoice */

const WF_NODES: { icon: IconName; app: string; title: string; out: string; tone: string }[] = [
  { icon: 'database', app: 'Google Sheets', title: 'New order row', out: 'Row 214 · Om Traders', tone: '#16a34a' },
  { icon: 'whatsapp', app: 'WhatsApp', title: 'Manager approves', out: 'Approved by Raj · 1 tap', tone: '#22c55e' },
  { icon: 'calculator', app: 'Tally', title: 'Create invoice', out: 'INV-2291 · ₹ 18,400', tone: '#2563eb' },
  { icon: 'mail', app: 'Email + WhatsApp', title: 'Send to customer', out: 'Delivered · PDF attached', tone: '#7c3aed' },
  { icon: 'pulse', app: 'Dashboard', title: 'Update reports', out: 'Revenue +₹ 18,400', tone: '#ea580c' },
]
const WF_LOG = ['10:42:07  Row 214 picked up', '10:42:09  Approval sent to Raj', '10:42:41  Approved', '10:42:43  Tally voucher INV-2291', '10:42:44  Invoice sent · email + WhatsApp', '10:42:45  Dashboard updated · done in 38 s']
const WF_MS = [1500, 1700, 1600, 1600, 1600, 2400] as const

export function Workflow({ live }: { live: boolean }) {
  const ph = usePhase(6, WF_MS, live, 5)
  // 5 nodes; ph k: node k running (k < 5), everything done at ph 5
  const status = (k: number) => (k < ph ? 'done' : k === ph ? 'run' : 'idle')
  const X = [64, 224, 384, 544, 704]
  return (
    <div className="pl-dots relative h-full bg-[#f7f8fa] p-4">
      <div className="flex items-center gap-2">
        <span className="grid size-7 place-items-center rounded-[8px] bg-[#0b0f15] text-white">
          <Icon name="workflow" size={14} />
        </span>
        <span className="text-[13px] font-semibold">Order to invoice</span>
        <Chip tone="#16a34a">Live</Chip>
        <span className="ml-auto text-[10px] text-[#6b7280]">
          Runs today <Count value={1283 + (ph === 5 ? 1 : 0)} className="font-semibold text-[#0b0f15]" /> · hours saved this week <b className="text-[#0b0f15]">31</b>
        </span>
      </div>
      {/* the flow */}
      <div className="relative mt-4 h-[170px]">
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 768 170" fill="none" aria-hidden>
          {X.slice(0, -1).map((x, k) => (
            <path key={k} d={`M${x + 38} 32 L${X[k + 1] - 38} 32`} className={cn('pl-wire', k < ph && 'is-done', k === ph - 1 && 'is-hot')} />
          ))}
        </svg>
        {/* the packet riding the wire into the running step */}
        {ph > 0 && ph < 5 ? <span key={ph} className="pl-packet absolute left-0 top-[26px] size-3 rounded-full bg-[#0b0f15]" style={{ ['--x0' as string]: `${X[ph - 1] + 32}px`, ['--x1' as string]: `${X[ph] - 44}px` }} /> : null}
        {WF_NODES.map((n, k) => {
          const st = status(k)
          return (
            <div key={n.title} className="absolute top-0 w-[104px] -translate-x-1/2 text-center" style={{ left: X[k] }}>
              <div className={cn('mx-auto grid size-[64px] place-items-center rounded-[16px] bg-white transition-all duration-500', st === 'run' ? 'shadow-[0_0_0_3px_var(--t),0_16px_30px_-14px_var(--t)]' : 'shadow-[0_1px_2px_rgb(11_15_21/0.08),0_0_0_1px_rgb(11_15_21/0.08)]')} style={{ ['--t' as string]: n.tone }}>
                <span className="grid size-10 place-items-center rounded-[12px] text-white" style={{ background: n.tone }}>
                  <Icon name={n.icon} size={18} />
                </span>
              </div>
              <p className="mt-2 text-[9px] font-semibold uppercase tracking-[0.06em] text-[#9ca3af]">{n.app}</p>
              <p className="text-[11px] font-semibold">{n.title}</p>
              <p className={cn('mt-1 h-[30px] text-[9.5px] leading-tight transition-opacity duration-500', st === 'idle' ? 'opacity-0' : 'opacity-100', st === 'done' ? 'text-[#15803d]' : 'text-[#6b7280]')}>
                {st === 'run' ? 'Working…' : n.out}
              </p>
            </div>
          )
        })}
      </div>
      {/* the run log */}
      <Panel className="mt-2 overflow-hidden">
        <p className="flex items-center justify-between border-b border-[#eef0f3] px-3 py-2 text-[10.5px] font-semibold">
          Run #1,284
          <span className={cn('flex items-center gap-1 text-[9.5px]', ph === 5 ? 'text-[#15803d]' : 'text-[#6b7280]')}>
            <Icon name={ph === 5 ? 'check' : 'clock'} size={10} /> {ph === 5 ? 'Finished in 38 s' : 'Running'}
          </span>
        </p>
        <ul className="grid gap-0.5 px-3 py-2 font-mono text-[9.5px] text-[#4b5563]">
          {WF_LOG.map((l, k) => (
            <li key={l} className={cn('transition-opacity duration-500', k <= ph ? 'opacity-100' : 'opacity-0')}>
              {l}
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  )
}
