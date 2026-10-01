'use client'

import type { CSSProperties, ReactNode } from 'react'
import { Icon, type IconName } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'

/*
 * The /solutions hero: one idea per industry, drawn big and simple, in four beats. Each scene
 * is given the beat it is on (`ph`, 0-3) and moves between beats with CSS transitions; the
 * captions say each beat in a line. Drawn on a 600×300 canvas (Canvas scales it).
 */

export type Beat = { ph: number }
export type IndustryScene = { captions: readonly [string, string, string, string]; Scene: (p: Beat) => React.JSX.Element }

const ease = 'transition-all duration-700 ease-[var(--ease-out)]'

function Tag({ children, className, style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-raise px-2.5 py-1 text-[11px] font-semibold text-ink shadow-[0_6px_16px_-10px_rgb(11_15_21/0.5),0_0_0_1px_var(--line-2)]', className)} style={style}>
      {children}
    </span>
  )
}

function Tick({ on, className }: { on: boolean; className?: string }) {
  return (
    <span className={cn('grid size-4 place-items-center rounded-full transition-colors duration-500', on ? 'bg-teal text-[#04161a]' : 'bg-line-2 text-transparent', className)}>
      <Icon name="check" size={10} strokeWidth={3} />
    </span>
  )
}

/** A vertical run of steps, each lit once the scene reaches it. */
function Steps({ ph, items, className }: { ph: number; items: { icon: IconName; label: string }[]; className?: string }) {
  return (
    <ol className={cn('grid gap-3', className)}>
      <span className="absolute bottom-3 left-[13px] top-3 w-[2px] bg-line-2" />
      <span className="absolute left-[13px] top-3 w-[2px] bg-teal transition-[height] duration-700" style={{ height: `${(ph / (items.length - 1)) * 100 - 6}%` }} />
      {items.map((it, k) => (
        <li key={it.label} className="relative flex items-center gap-2.5">
          <span className={cn('grid size-7 place-items-center rounded-full border-2 transition-all duration-500', k < ph ? 'border-teal bg-teal text-[#04161a]' : k === ph ? 'is-ping border-teal bg-raise text-teal-ink' : 'border-line-2 bg-raise text-ink-3')}>
            <Icon name={k < ph ? 'check' : it.icon} size={13} strokeWidth={k < ph ? 3 : 2} />
          </span>
          <span className={cn('text-[12px] font-semibold transition-colors duration-500', k <= ph ? 'text-ink' : 'text-ink-3')}>{it.label}</span>
        </li>
      ))}
    </ol>
  )
}

/* ------------------------------------------------ Manufacturing: an enquiry becomes a quote, an order, a shipment */

function Manufacturing({ ph }: Beat) {
  return (
    <>
      <div className="absolute left-5 top-[62px] grid gap-2.5">
        {[
          ['IndiaMART', '#2e3192'],
          ['WhatsApp', '#16a34a'],
          ['Website', 'var(--navy)'],
        ].map(([s, c], k) => (
          <Tag key={s} className={cn(ease, k === 0 && ph === 0 ? 'translate-x-2 shadow-[0_0_0_2px_var(--teal)]' : '')}>
            <span className="size-2 rounded-full" style={{ background: c }} />
            {s}
          </Tag>
        ))}
      </div>
      {/* the one object that changes shape */}
      <div className="absolute left-[178px] top-[34px] h-[232px] w-[236px]">
        <div className={cn('absolute inset-x-0 top-6 rounded-[16px] rounded-tl-[4px] bg-raise p-4 shadow-[0_18px_40px_-22px_rgb(11_15_21/0.6),0_0_0_1px_var(--line)]', ease, ph === 0 ? 'opacity-100' : 'pointer-events-none -translate-y-3 scale-95 opacity-0')}>
          <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-3">Shreeji Engineering · via IndiaMART</p>
          <p className="mt-2 text-[15px] font-medium leading-snug">Need 2 hydraulic presses, 60 T. What’s your best price?</p>
          <p className="mt-2 text-right text-[10px] text-ink-3">10:02</p>
        </div>
        <div className={cn('absolute inset-0 rounded-[14px] bg-raise p-4 shadow-[0_18px_40px_-22px_rgb(11_15_21/0.6),0_0_0_1px_var(--line)]', ease, ph === 1 || ph === 2 ? 'opacity-100' : ph === 0 ? 'pointer-events-none translate-y-4 opacity-0' : 'pointer-events-none scale-90 opacity-0')}>
          <p className="flex items-center justify-between text-[13px] font-semibold">
            Quotation Q-1042 <Icon name="file" size={15} className="text-ink-3" />
          </p>
          {[
            ['Hydraulic press 60 T × 2', 72],
            ['Tooling & dies', 48],
            ['Installation', 36],
          ].map(([l, w], k) => (
            <div key={l as string} className="mt-3">
              <p className="text-[10.5px] text-ink-2">{l}</p>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-sink">
                <div className="h-full rounded-full bg-navy transition-[width] duration-700" style={{ width: ph >= 1 ? `${w}%` : '0%', transitionDelay: `${k * 120}ms` }} />
              </div>
            </div>
          ))}
          <p className="mt-4 flex items-baseline justify-between border-t border-line pt-2.5">
            <span className="text-[11px] text-ink-3">Total incl. GST</span>
            <span className="text-[17px] font-semibold tabular-nums">₹ 18,40,000</span>
          </p>
          <span className={cn('absolute right-3 top-14 rotate-[-12deg] rounded-[6px] border-[3px] border-teal px-2 py-0.5 text-[14px] font-black uppercase tracking-[0.1em] text-teal-ink', ease, ph === 2 ? 'scale-100 opacity-100' : 'scale-150 opacity-0')}>
            Approved
          </span>
        </div>
        {/* the box, sealed and driven off */}
        <div className={cn('absolute left-1/2 top-[44px] -translate-x-1/2', ease, ph === 3 ? 'opacity-100' : 'pointer-events-none translate-y-6 opacity-0')}>
          <div className="relative h-[118px] w-[150px] rounded-[10px] bg-[#c99a5b] shadow-[0_20px_36px_-18px_rgb(11_15_21/0.6)]">
            <span className="absolute inset-x-0 top-[44%] h-[16px] bg-[#b07f43]" />
            <span className="absolute left-1/2 top-0 h-full w-[18px] -translate-x-1/2 bg-[#e8d3b0]/70" />
            <span className="absolute bottom-3 left-3 rounded-[4px] bg-white px-1.5 py-0.5 text-[9px] font-bold text-[#0b0f15]">SO-881 · LR 55210</span>
          </div>
          <span className={cn('absolute -bottom-9 left-1/2 text-ink transition-transform duration-[1800ms] ease-in', ph === 3 ? 'translate-x-[140px]' : '-translate-x-1/2')}>
            <Icon name="truck" size={30} />
          </span>
        </div>
      </div>
      <Steps
        ph={ph}
        className="absolute right-6 top-[56px] w-[130px]"
        items={[
          { icon: 'bell', label: 'Enquiry' },
          { icon: 'file', label: 'Quotation' },
          { icon: 'check', label: 'Sales order' },
          { icon: 'truck', label: 'Dispatch' },
        ]}
      />
    </>
  )
}

/* ------------------------------------------------ CA practice: every client's filings, ticking over */

const CA_CLIENTS = ['Patel Exports', 'Shah & Co', 'Mehta Foods', 'Om Textiles', 'Kiran Pharma']
const CA_COLS = ['GSTR-1', 'GSTR-3B', 'TDS', 'Adv. tax']

function CaPractice({ ph }: Beat) {
  const pct = [52, 71, 89, 100][ph]
  return (
    <>
      <div className="absolute left-5 top-6 w-[372px]">
        <div className="grid grid-cols-[110px_repeat(4,minmax(0,1fr))] gap-y-2 text-[10.5px]">
          <span />
          {CA_COLS.map((c, k) => (
            <span key={c} className={cn('text-center font-semibold transition-colors duration-500', k === ph ? 'text-teal-ink' : 'text-ink-3')}>
              {c}
            </span>
          ))}
          {CA_CLIENTS.map((name, r) => (
            <Row key={name} name={name} r={r} ph={ph} />
          ))}
        </div>
      </div>
      {/* the reminder that unblocks the one late client */}
      <Tag className={cn('absolute left-[150px] top-[230px] z-10', ease, ph === 2 ? 'opacity-100' : 'pointer-events-none translate-y-2 opacity-0')}>
        <Icon name="whatsapp" size={12} className="text-[#16a34a]" /> Bills for Sept, please?
      </Tag>
      <div className="absolute right-6 top-[46px] grid w-[150px] justify-items-center">
        <svg viewBox="0 0 120 120" className="size-[132px] -rotate-90">
          <circle cx="60" cy="60" r="50" fill="none" stroke="var(--line-2)" strokeWidth="12" />
          <circle cx="60" cy="60" r="50" fill="none" stroke="var(--teal)" strokeWidth="12" strokeLinecap="round" pathLength={100} strokeDasharray={`${pct} 100`} className="transition-[stroke-dasharray] duration-700" />
        </svg>
        <span className="absolute top-[46px] grid justify-items-center">
          <span className="text-[26px] font-semibold tabular-nums leading-none">{pct}%</span>
          <span className="mt-1 text-[10px] text-ink-3">filed on time</span>
        </span>
        <Tag className="mt-3">
          <Icon name="shield" size={12} className="text-teal-ink" /> ₹ 0 in late fees
        </Tag>
      </div>
    </>
  )
}

function Row({ name, r, ph }: { name: string; r: number; ph: number }) {
  return (
    <>
      <span className="flex items-center gap-1.5 font-medium">
        <span className="grid size-5 place-items-center rounded-[5px] bg-sink text-[8.5px] font-bold text-ink-2">{name[0]}</span>
        {name}
      </span>
      {CA_COLS.map((c, k) => {
        const late = r === 2 && k === 1
        const done = late ? ph === 3 : k <= ph
        return (
          <span key={c} className="grid place-items-center">
            <span
              className={cn(
                'grid h-6 w-[52px] place-items-center rounded-[6px] text-[9px] font-bold transition-all duration-500',
                done ? 'bg-teal text-[#04161a]' : late && ph >= 1 ? 'bg-ember/15 text-ember' : 'bg-sink text-ink-3',
              )}
              style={{ transitionDelay: done && !late ? `${r * 70}ms` : '0ms' }}
            >
              {done ? <Icon name="check" size={11} strokeWidth={3} /> : late && ph >= 1 ? 'Docs?' : '·'}
            </span>
          </span>
        )
      })}
    </>
  )
}

/* ------------------------------------------------ Visa: the file complete, the stamp, the flight */

function Visa({ ph }: Beat) {
  const docs = ['Passport', 'Bank statement', 'IELTS 7.5', 'Biometrics']
  return (
    <>
      <ul className="absolute left-5 top-[52px] grid gap-2.5">
        {docs.map((d, k) => (
          <li key={d} className="flex items-center gap-2 text-[12px] font-medium">
            <Tick on={ph >= 1 || k < 2} />
            {d}
          </li>
        ))}
      </ul>
      {/* the passport, open */}
      <div className="absolute left-[170px] top-[50px] flex h-[190px] w-[290px] rotate-[-3deg] overflow-hidden rounded-[10px] shadow-[0_24px_44px_-24px_rgb(11_15_21/0.7),0_0_0_1px_var(--line-2)]">
        <div className="w-1/2 border-r border-dashed border-line-2 bg-raise p-3">
          <span className="block h-[62px] w-[50px] rounded-[4px] bg-[linear-gradient(160deg,var(--line-2),var(--sink))]" />
          <span className="mt-2 block h-1.5 w-[90%] rounded bg-line-2" />
          <span className="mt-1.5 block h-1.5 w-[70%] rounded bg-line-2" />
          <span className="mt-1.5 block h-1.5 w-[80%] rounded bg-line-2" />
          <span className="mt-3 block font-mono text-[7.5px] leading-tight text-ink-3">P&lt;IND&lt;&lt;MEHTA&lt;&lt;AARAV&lt;&lt;&lt;&lt;</span>
        </div>
        <div className="relative w-1/2 bg-[repeating-linear-gradient(135deg,var(--raise)_0_8px,var(--sink)_8px_9px)] p-3">
          <span className="text-[9px] font-bold tracking-[0.2em] text-ink-3">VISAS</span>
          <span className={cn('absolute left-1/2 top-1/2 grid -translate-x-1/2 -translate-y-1/2 rotate-[-14deg] place-items-center rounded-[10px] border-[3px] border-[#c2410c] px-3 py-2 text-center text-[#c2410c]', ease, ph >= 2 ? 'scale-100 opacity-100' : 'scale-[1.8] opacity-0')}>
            <span className="text-[15px] font-black tracking-[0.08em]">GRANTED</span>
            <span className="text-[8.5px] font-bold tracking-[0.2em]">CANADA · STUDY</span>
          </span>
        </div>
      </div>
      {/* the flight */}
      <svg viewBox="0 0 600 300" className="pointer-events-none absolute inset-0" fill="none">
        <path d="M430 92 C 480 40, 520 34, 560 46" stroke="var(--line-2)" strokeWidth="2" strokeDasharray="4 6" className={cn('transition-opacity duration-500', ph === 3 ? 'opacity-100' : 'opacity-0')} />
      </svg>
      <span className="absolute right-4 top-[22px]">
        <Tag className={cn(ease, ph === 3 ? 'opacity-100' : 'translate-y-2 opacity-0')}>
          <Icon name="pin" size={12} className="text-ember" /> Toronto
        </Tag>
      </span>
      <span className="iv-plane absolute left-0 top-0 text-ink" data-on={ph === 3 || undefined}>
        <Icon name="plane" size={22} />
      </span>
    </>
  )
}

/* ------------------------------------------------ Real estate: leads on the map, one flat booked */

const RE_PINS = [
  { x: 120, y: 92, p: '₹ 64 L' },
  { x: 236, y: 196, p: '₹ 1.2 Cr', main: true },
  { x: 318, y: 74, p: '₹ 88 L' },
  { x: 84, y: 212, p: '₹ 52 L' },
  { x: 330, y: 186, p: '₹ 96 L' },
]

function RealEstate({ ph }: Beat) {
  const status = ['New lead · 99acres', 'Site visit · Sat 11:00', 'Token ₹ 2,00,000', 'Booked · B-704'][ph]
  return (
    <>
      <div className="absolute left-4 top-4 h-[268px] w-[388px] overflow-hidden rounded-[16px] bg-sink">
        <svg viewBox="0 0 388 268" className="absolute inset-0" fill="none">
          <path d="M-10 190 C 90 150, 160 230, 400 120" stroke="color-mix(in oklab, var(--navy) 35%, transparent)" strokeWidth="16" strokeLinecap="round" />
          {[40, 100, 160, 220].map((y) => (
            <path key={y} d={`M0 ${y} H388`} stroke="var(--line-2)" strokeWidth="1.5" />
          ))}
          {[70, 150, 230, 310].map((x) => (
            <path key={x} d={`M${x} 0 V268`} stroke="var(--line-2)" strokeWidth="1.5" />
          ))}
          <path d="M0 268 L 260 0" stroke="var(--line-2)" strokeWidth="5" />
          <rect x="248" y="112" width="58" height="40" rx="10" fill="color-mix(in oklab, #16a34a 18%, transparent)" />
        </svg>
        {RE_PINS.map((pin) => (
          <span key={pin.p} className="absolute" style={{ left: pin.x, top: pin.y }}>
            <span
              className={cn(
                'relative flex -translate-x-1/2 -translate-y-full items-center gap-1 rounded-[8px] px-2 py-1 text-[10.5px] font-bold transition-all duration-500',
                pin.main && ph >= 2 ? 'bg-teal text-[#04161a]' : pin.main && ph >= 1 ? 'bg-ink text-bg' : 'bg-raise text-ink shadow-[0_0_0_1px_var(--line-2)]',
                pin.main && ph >= 1 && 'scale-110',
              )}
            >
              {pin.main && ph === 3 ? <Icon name="lock" size={10} /> : null}
              {pin.p}
              <span className="absolute -bottom-1 left-1/2 size-2 -translate-x-1/2 rotate-45 bg-inherit" />
            </span>
          </span>
        ))}
        {/* leads streaming in to the flat */}
        {[0, 1, 2].map((k) => (
          <span
            key={k}
            className={cn('re-lead absolute left-0 top-0 size-3 rounded-full bg-ember', ph === 0 && 'is-on')}
            style={{ ['--sx' as string]: ['8px', '372px', '120px'][k], ['--sy' as string]: ['24px', '30px', '256px'][k], animationDelay: `${k * 0.22}s` }}
          />
        ))}
      </div>
      <div className="absolute right-4 top-[42px] w-[170px] rounded-[14px] bg-raise p-3 shadow-[0_18px_36px_-22px_rgb(11_15_21/0.6),0_0_0_1px_var(--line)]">
        <p className="flex items-center gap-2">
          <span className="grid size-8 place-items-center rounded-full bg-sink text-[10px] font-bold">KS</span>
          <span>
            <span className="block text-[12px] font-semibold">Kunal Shah</span>
            <span className="block text-[10px] text-ink-3">3 BHK · Satellite</span>
          </span>
        </p>
        <p key={status} className="iv-in mt-3 rounded-[8px] bg-teal-soft px-2 py-1.5 text-[11px] font-semibold text-teal-ink">
          {status}
        </p>
        <ul className="mt-3 grid gap-1.5 text-[10.5px]">
          {['Call logged', 'Visit booked', 'Token paid', 'Agreement sent'].map((s, k) => (
            <li key={s} className={cn('flex items-center gap-2 transition-colors duration-500', k <= ph ? 'text-ink' : 'text-ink-3')}>
              <Tick on={k <= ph} />
              {s}
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

/* ------------------------------------------------ Education: enquiries filling a batch, seat by seat */

const ED_LEADS = ['Riya · Class 11 · JEE', 'Arjun · Dropper · NEET', 'Meera · Class 12 · JEE', 'Kabir · Class 11 · JEE']

function Education({ ph }: Beat) {
  const filled = [38, 46, 54, 60][ph]
  return (
    <>
      <div className="absolute left-5 top-6 w-[160px]">
        <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-3">New enquiries</p>
        <ul className="mt-2 grid gap-2">
          {ED_LEADS.slice(0, ph + 1)
            .reverse()
            .map((l, k) => (
              <li key={l} className={cn('rounded-[10px] bg-raise px-2.5 py-2 text-[11px] font-medium shadow-[0_0_0_1px_var(--line)]', k === 0 && 'iv-in shadow-[0_0_0_2px_var(--teal)]')}>
                {l}
                <span className="mt-0.5 block text-[9.5px] text-ink-3">{k === 0 ? 'Demo class booked' : 'Admitted · fee paid'}</span>
              </li>
            ))}
        </ul>
      </div>
      <div className="absolute right-5 top-6 w-[380px]">
        <p className="flex items-baseline justify-between">
          <span className="text-[13px] font-semibold">JEE 2027 · Batch A</span>
          <span className="text-[24px] font-semibold tabular-nums leading-none">
            {filled}
            <span className="text-[13px] text-ink-3">/60</span>
          </span>
        </p>
        <div className="mt-3 rounded-[14px] bg-sink p-3">
          <span className="mx-auto mb-3 block h-1.5 w-1/2 rounded-full bg-line-2" />
          <div className="grid grid-cols-10 gap-[7px]">
            {Array.from({ length: 60 }, (_, k) => (
              <span
                key={k}
                className={cn('h-[18px] rounded-t-[7px] rounded-b-[3px] transition-all duration-500', k < filled ? 'bg-teal' : 'bg-line-2')}
                style={{ transitionDelay: k < filled ? `${(k % 8) * 40}ms` : '0ms', transform: k < filled && k >= filled - 8 ? 'translateY(-1px)' : undefined }}
              />
            ))}
          </div>
        </div>
        <p className={cn('mt-3 flex gap-2', ease, ph === 3 ? 'opacity-100' : 'translate-y-2 opacity-0')}>
          <Tag>
            <Icon name="check" size={12} className="text-teal-ink" /> Batch full · waitlist on
          </Tag>
          <Tag>
            <Icon name="whatsapp" size={12} className="text-[#16a34a]" /> Receipts sent to parents
          </Tag>
        </p>
      </div>
    </>
  )
}

/* ------------------------------------------------ Travel: the trip drawn on the map, priced, sent */

function Travel({ ph }: Beat) {
  return (
    <>
      <div className="iv-dots absolute inset-3 rounded-[16px]" />
      <svg viewBox="0 0 600 300" className="absolute inset-0" fill="none">
        <path d="M96 222 C 150 120, 230 100, 296 122 S 430 210, 506 196" stroke="var(--line-2)" strokeWidth="2.5" strokeDasharray="5 7" />
        <path
          d="M96 222 C 150 120, 230 100, 296 122 S 430 210, 506 196"
          stroke="var(--teal)"
          strokeWidth="2.5"
          pathLength={100}
          strokeDasharray="100"
          className="transition-[stroke-dashoffset] duration-[1400ms] ease-[var(--ease-in-out)]"
          style={{ strokeDashoffset: [100, 50, 0, 0][ph] }}
        />
      </svg>
      {[
        { x: 96, y: 222, c: 'Ahmedabad', on: true },
        { x: 296, y: 122, c: 'Dubai', on: ph >= 1 },
        { x: 506, y: 196, c: 'Bali', on: ph >= 2 },
      ].map((p) => (
        <span key={p.c} className="absolute" style={{ left: p.x, top: p.y }}>
          <span className={cn('absolute size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-raise transition-colors duration-500', p.on ? 'bg-teal' : 'bg-line-2')} />
          <span className="absolute left-3 top-1 text-[11px] font-semibold">{p.c}</span>
        </span>
      ))}
      <span className="iv-trip absolute left-0 top-0 text-ink" style={{ offsetDistance: `${[0, 50, 100, 100][ph]}%` }}>
        <Icon name="plane" size={22} />
      </span>
      <Tag className={cn('absolute left-[232px] top-[54px]', ease, ph >= 1 ? 'opacity-100' : 'translate-y-2 opacity-0')}>Day 1-2 · Desert safari</Tag>
      <Tag className={cn('absolute left-[420px] top-[228px]', ease, ph >= 2 ? 'opacity-100' : 'translate-y-2 opacity-0')}>Day 3-7 · Ubud villa</Tag>
      <div className={cn('absolute left-6 top-6 w-[176px] rounded-[14px] bg-raise p-3 shadow-[0_18px_36px_-22px_rgb(11_15_21/0.6),0_0_0_1px_var(--line)]', ease, ph >= 2 ? 'opacity-100' : 'translate-y-2 opacity-0')}>
        <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-3">Honeymoon · 6N/7D</p>
        <p className="mt-1 text-[20px] font-semibold tabular-nums">₹ 1,84,000</p>
        <p className="text-[10px] text-ink-3">for two · flights, villas, transfers</p>
        <p className={cn('mt-2 flex items-center gap-1.5 text-[11px] font-semibold text-[#16a34a] transition-opacity duration-500', ph === 3 ? 'opacity-100' : 'opacity-0')}>
          <Icon name="whatsapp" size={12} /> Sent on WhatsApp
        </p>
      </div>
    </>
  )
}

/* ------------------------------------------------ Insurance: a policy running out, reminded, renewed */

function Insurance({ ph }: Beat) {
  const days = [30, 15, 7, 0][ph]
  const notes: [IconName, string, string][] = [
    ['whatsapp', 'WhatsApp · 30 days to go', '#16a34a'],
    ['send', 'SMS · payment link sent', 'var(--navy)'],
    ['phone', 'Call task for Ravi (advisor)', 'var(--ember)'],
  ]
  return (
    <>
      <div className="absolute left-6 top-[46px] h-[176px] w-[300px] [perspective:900px]">
        <div className={cn('relative size-full transition-transform duration-[900ms] ease-[var(--ease-in-out)] [transform-style:preserve-3d]', ph === 3 && '[transform:rotateY(180deg)]')}>
          <div className="absolute inset-0 rounded-[18px] bg-[linear-gradient(135deg,#1b2a4a,#0d1424)] p-5 text-white [backface-visibility:hidden]">
            <p className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.1em] text-white/60">
              Health · family floater <Icon name="shield" size={16} />
            </p>
            <p className="mt-3 text-[18px] font-semibold">Nisha Desai</p>
            <p className="text-[11px] text-white/60">4 members · cover ₹ 10 L</p>
            <p className="mt-5 flex items-baseline justify-between text-[11px]">
              <span className="text-white/60">Renews 14 Oct 2026</span>
              <span className="font-semibold tabular-nums">{days} days left</span>
            </p>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/15">
              <div className="h-full rounded-full bg-[#ff6a3a] transition-[width] duration-700" style={{ width: `${(days / 30) * 100}%` }} />
            </div>
          </div>
          <div className="absolute inset-0 grid place-items-center rounded-[18px] bg-[linear-gradient(135deg,#0aa2b5,#077a8a)] p-5 text-center text-white [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <span>
              <span className="mx-auto grid size-11 place-items-center rounded-full bg-white/20">
                <Icon name="check" size={22} strokeWidth={3} />
              </span>
              <span className="mt-3 block text-[18px] font-semibold">Renewed</span>
              <span className="block text-[11px] text-white/75">Valid till 14 Oct 2027 · ₹ 24,600 paid</span>
            </span>
          </div>
        </div>
      </div>
      <ul className="absolute right-6 top-[46px] grid w-[230px] gap-2.5">
        {notes.map(([ic, t, c], k) => (
          <li key={t} className={cn('flex items-center gap-2.5 rounded-[12px] bg-raise p-2.5 text-[11.5px] font-medium shadow-[0_0_0_1px_var(--line)]', ease, k <= ph ? 'opacity-100' : 'translate-x-3 opacity-0', ph === 3 && 'opacity-50')}>
            <span className="grid size-7 shrink-0 place-items-center rounded-[8px] text-white" style={{ background: c }}>
              <Icon name={ic} size={13} />
            </span>
            {t}
          </li>
        ))}
        <li className={cn('flex items-center gap-2.5 rounded-[12px] bg-teal p-2.5 text-[11.5px] font-semibold text-[#04161a]', ease, ph === 3 ? 'opacity-100' : 'translate-x-3 opacity-0')}>
          <Icon name="banknote" size={15} /> Premium received · ₹ 24,600
        </li>
      </ul>
    </>
  )
}

/* ------------------------------------------------ Loans: eligibility rising, offers in, the best one sanctioned */

const LN_OFFERS = [
  { l: 'Bank', r: '10.9%' },
  { l: 'NBFC', r: '11.4%' },
  { l: 'Co-op bank', r: '10.4%', best: true },
]

function Loans({ ph }: Beat) {
  const angle = [-70, -25, 25, 62][ph]
  const amt = ['₹ 8 L', '₹ 16 L', '₹ 22 L', '₹ 25 L'][ph]
  return (
    <>
      <div className="absolute left-5 top-6 w-[250px]">
        <svg viewBox="0 0 250 140" className="w-full" fill="none">
          <path d="M25 125 A100 100 0 0 1 225 125" stroke="var(--line-2)" strokeWidth="16" strokeLinecap="round" />
          <path d="M25 125 A100 100 0 0 1 225 125" stroke="var(--teal)" strokeWidth="16" strokeLinecap="round" pathLength={100} strokeDasharray={`${((angle + 90) / 180) * 100} 100`} className="transition-[stroke-dasharray] duration-700" />
          <g className="transition-transform duration-700 ease-[var(--ease-out)]" style={{ transform: `rotate(${angle}deg)`, transformOrigin: '125px 125px' }}>
            <path d="M125 125 L125 44" stroke="var(--ink)" strokeWidth="4" strokeLinecap="round" />
          </g>
          <circle cx="125" cy="125" r="8" fill="var(--ink)" />
        </svg>
        <p className="-mt-1 text-center">
          <span className="block text-[24px] font-semibold tabular-nums">{amt}</span>
          <span className="text-[10.5px] text-ink-3">eligible today</span>
        </p>
        <p className="mt-3 flex justify-center gap-1.5">
          {['PAN', 'ITR', 'Bank stmt'].map((d, k) => (
            <Tag key={d} className={cn('px-2 text-[10px]', k <= ph ? '' : 'opacity-40')}>
              <Tick on={k <= ph} className="size-3.5" /> {d}
            </Tag>
          ))}
        </p>
      </div>
      <ul className="absolute right-5 top-7 grid w-[270px] gap-2.5">
        {LN_OFFERS.map((o, k) => (
          <li
            key={o.l}
            className={cn(
              'flex items-center justify-between rounded-[12px] p-3 text-[12px] font-semibold',
              ease,
              ph >= 1 + (k === 2 ? 1 : 0) ? 'opacity-100' : 'translate-y-3 opacity-0',
              o.best && ph === 3 ? 'bg-teal text-[#04161a]' : 'bg-raise shadow-[0_0_0_1px_var(--line)]',
              ph === 3 && !o.best && 'opacity-45',
            )}
          >
            <span className="flex items-center gap-2">
              <Icon name="building" size={15} /> {o.l}
            </span>
            <span className="tabular-nums">{o.r} p.a.</span>
          </li>
        ))}
        <li className={cn('rounded-[12px] bg-ink p-3 text-bg', ease, ph === 3 ? 'opacity-100' : 'translate-y-3 opacity-0')}>
          <span className="block text-[10px] font-semibold uppercase tracking-[0.08em] opacity-60">Sanctioned</span>
          <span className="block text-[17px] font-semibold tabular-nums">₹ 25,00,000 · EMI ₹ 32,890</span>
        </li>
      </ul>
    </>
  )
}

/* ------------------------------------------------ ERP: the departments snap into one system */

const ERP_BLOCKS: { label: string; icon: IconName; c: string; from: string }[] = [
  { label: 'Sales', icon: 'banknote', c: '#0aa2b5', from: 'translate(-90px,-60px) rotate(-14deg)' },
  { label: 'Purchase', icon: 'file', c: '#3d74c2', from: 'translate(0,-90px) rotate(8deg)' },
  { label: 'Stock', icon: 'package', c: '#7c3aed', from: 'translate(90px,-60px) rotate(12deg)' },
  { label: 'Accounts', icon: 'calculator', c: '#16a34a', from: 'translate(-90px,60px) rotate(10deg)' },
  { label: 'HR', icon: 'users', c: '#ea580c', from: 'translate(0,90px) rotate(-10deg)' },
  { label: 'Production', icon: 'factory', c: '#db2777', from: 'translate(90px,60px) rotate(-12deg)' },
]

function Erp({ ph }: Beat) {
  return (
    <>
      <div className="absolute left-1/2 top-6 grid w-[432px] -translate-x-1/2 grid-cols-3 gap-3">
        {ERP_BLOCKS.map((b, k) => (
          <span
            key={b.label}
            className="flex h-[60px] items-center gap-2.5 rounded-[14px] bg-raise px-3 text-[13px] font-semibold shadow-[0_14px_30px_-20px_rgb(11_15_21/0.6),0_0_0_1px_var(--line)] transition-all duration-[900ms] ease-[var(--ease-out)]"
            style={{ transform: ph === 0 ? b.from : 'none', opacity: ph === 0 ? 0.35 : 1, transitionDelay: `${k * 70}ms` }}
          >
            <span className="grid size-8 place-items-center rounded-[9px] text-white" style={{ background: b.c }}>
              <Icon name={b.icon} size={15} />
            </span>
            {b.label}
            <span className={cn('ml-auto size-2 rounded-full transition-colors duration-500', ph >= 2 ? 'iv-blink bg-teal' : 'bg-line-2')} style={{ animationDelay: `${k * 0.25}s` }} />
          </span>
        ))}
      </div>
      {/* wires down into one database */}
      <svg viewBox="0 0 600 300" className="pointer-events-none absolute inset-0" fill="none">
        {[154, 300, 446].map((x) => (
          <path key={x} d={`M${x} 166 V206`} className={cn('iv-wire', ph >= 2 && 'is-on')} />
        ))}
      </svg>
      <div className={cn('absolute left-1/2 top-[206px] flex h-[58px] w-[432px] -translate-x-1/2 items-center justify-center gap-3 rounded-[16px] text-[14px] font-semibold', ease, ph >= 2 ? 'bg-ink text-bg' : 'bg-sink text-ink-3')}>
        <Icon name="database" size={18} />
        One database · one login
        <span className={cn('rounded-full px-2 py-0.5 text-[10.5px] transition-colors duration-500', ph === 3 ? 'bg-teal text-[#04161a]' : 'bg-transparent text-transparent')}>0 spreadsheets</span>
      </div>
    </>
  )
}

/* ------------------------------------------------ Hospital: the queue moving, the heart steady */

function Hospital({ ph }: Beat) {
  const token = ['A-21', 'A-22', 'A-23', 'A-24'][ph]
  const waiting = [8, 7, 6, 5][ph]
  return (
    <>
      <div className="absolute left-5 top-6 w-[250px] rounded-[16px] bg-[#0b0f15] p-4 text-white shadow-[0_24px_44px_-24px_rgb(11_15_21/0.8)]">
        <p className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.12em] text-white/50">
          Now serving <span className="live-dot" />
        </p>
        <p key={token} className="iv-flip mt-2 font-mono text-[46px] font-bold leading-none tracking-[0.04em] text-[#5eead4]">
          {token}
        </p>
        <p className="mt-2 text-[12px] text-white/70">Dr. Mehta · Room 3</p>
      </div>
      <div className="absolute right-5 top-6 w-[290px]">
        <p className="flex items-baseline justify-between text-[12px] font-semibold">
          Waiting room
          <span className="text-[11px] font-medium text-ink-3">
            <b className="tabular-nums text-ink">{waiting}</b> waiting · ~12 min
          </span>
        </p>
        <div className="mt-3 flex gap-2">
          {Array.from({ length: 8 }, (_, k) => (
            <span key={k} className="grid flex-1 justify-items-center gap-1">
              <span className={cn('size-6 rounded-full transition-all duration-500', k < waiting ? 'bg-navy' : 'scale-50 bg-transparent')} />
              <span className="h-2.5 w-full rounded-[3px] bg-line-2" />
            </span>
          ))}
        </div>
        <p className={cn('mt-4', ease, ph === 3 ? 'opacity-100' : 'translate-y-2 opacity-0')}>
          <Tag>
            <Icon name="send" size={12} className="text-teal-ink" /> Prescription sent to pharmacy
          </Tag>
        </p>
      </div>
      {/* the patient's heart, steady along the foot */}
      <svg viewBox="0 0 600 80" className="absolute bottom-4 left-0 h-[80px] w-full" fill="none">
        <path d="M0 40 H170 L186 40 L196 14 L210 66 L222 28 L232 40 H600" stroke="var(--line-2)" strokeWidth="2" />
        <path d="M0 40 H170 L186 40 L196 14 L210 66 L222 28 L232 40 H600" stroke="var(--ember)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="iv-ecg" pathLength={100} />
      </svg>
    </>
  )
}

/* ------------------------------------------------ HRMS: attendance in, salaries out, filings done */

const HR_TEAM = [
  ['AK', '9:02'],
  ['PS', '9:10'],
  ['RM', '8:56'],
  ['NJ', '9:04'],
  ['VD', '9:15'],
  ['SK', '9:01'],
] as const

function Hrms({ ph }: Beat) {
  return (
    <>
      <div className="absolute left-1/2 top-5 w-[230px] -translate-x-1/2 rounded-[14px] bg-ink p-3 text-bg shadow-[0_20px_40px_-24px_rgb(11_15_21/0.8)]">
        <p className="flex items-center justify-between text-[12px] font-semibold">
          Payroll · September <Icon name="calculator" size={15} />
        </p>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-bg/15">
          <div className="h-full rounded-full bg-teal transition-[width] duration-700" style={{ width: `${[18, 55, 100, 100][ph]}%` }} />
        </div>
        <p className="mt-1.5 text-[10px] opacity-60">{['Attendance synced from biometric', 'Payslips going out', 'Salaries credited', 'PF · ESI · PT · TDS filed'][ph]}</p>
      </div>
      <div className="absolute inset-x-6 top-[132px] grid grid-cols-6 gap-3">
        {HR_TEAM.map(([ini, t], k) => (
          <span key={ini} className="relative grid justify-items-center">
            <span className={cn('mb-2 rounded-full px-2 py-0.5 text-[10px] font-semibold tabular-nums transition-all duration-500', ph === 0 ? 'bg-sink text-ink-2 opacity-100' : 'opacity-0')}>{t}</span>
            {/* the payslip on its way down */}
            <span
              className={cn('absolute top-[-70px] grid h-7 w-9 place-items-center rounded-[5px] bg-raise text-teal-ink shadow-[0_8px_16px_-8px_rgb(11_15_21/0.6),0_0_0_1px_var(--line-2)] transition-all duration-700 ease-[var(--ease-in-out)]', ph === 1 ? 'translate-y-[66px] opacity-100' : ph === 0 ? 'opacity-0' : 'translate-y-[66px] opacity-0')}
              style={{ transitionDelay: `${k * 90}ms` }}
            >
              <Icon name="mail" size={13} />
            </span>
            <span className="grid size-14 place-items-center rounded-full bg-sink text-[13px] font-bold text-ink-2 shadow-[0_0_0_1px_var(--line-2)]">{ini}</span>
            <span className={cn('mt-2 rounded-full px-2 py-0.5 text-[10px] font-bold transition-all duration-500', ph >= 2 ? 'bg-teal text-[#04161a] opacity-100' : 'translate-y-1 opacity-0')} style={{ transitionDelay: `${k * 60}ms` }}>
              Credited
            </span>
          </span>
        ))}
      </div>
      <p className={cn('absolute inset-x-0 bottom-5 flex justify-center gap-2', ease, ph === 3 ? 'opacity-100' : 'translate-y-2 opacity-0')}>
        <Tag>₹ 18,42,600 paid to 46 people</Tag>
        <Tag>
          <Icon name="check" size={12} className="text-teal-ink" /> Filed on time
        </Tag>
      </p>
    </>
  )
}

/* ------------------------------------------------ Inventory: a shelf running low, refilled, sent out */

const INV_SKUS = [
  { n: 'Detergent 1 kg', base: 3, refill: 9, low: true },
  { n: 'Tea 500 g', base: 7, refill: 7 },
  { n: 'Rice 5 kg', base: 6, refill: 6 },
]

function Inventory({ ph }: Beat) {
  return (
    <>
      <div className="absolute left-5 top-5 w-[300px] rounded-[16px] bg-sink p-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-3">Warehouse · Rack B</p>
        {INV_SKUS.map((s) => {
          const n = s.low && ph >= 2 ? s.refill : s.base
          const alarm = s.low && ph < 2
          return (
            <div key={s.n} className="mt-2.5">
              <p className="flex justify-between text-[11px] font-semibold">
                {s.n}
                <span className={cn('tabular-nums', alarm ? 'text-ember' : 'text-ink-2')}>{alarm ? 'Low · 30 left' : `${n * 50} in stock`}</span>
              </p>
              <div className="mt-1.5 flex h-[26px] items-end gap-1 border-b-[3px] border-line-2 pb-[2px]">
                {Array.from({ length: 10 }, (_, k) => (
                  <span
                    key={k}
                    className={cn('h-full flex-1 rounded-[4px] transition-all duration-500', k < n ? (alarm ? 'iv-blink bg-ember' : 'bg-[#c99a5b]') : 'scale-y-0 bg-transparent')}
                    style={{ transformOrigin: 'bottom', transitionDelay: k < n ? `${k * 50}ms` : '0ms' }}
                  />
                ))}
              </div>
            </div>
          )
        })}
      </div>
      <div className="absolute right-5 top-5 grid w-[240px] gap-2.5">
        <Tag className={cn('justify-self-start', ease, ph >= 1 ? 'opacity-100' : 'translate-y-2 opacity-0')}>
          <Icon name="file" size={12} className="text-navy" /> PO-218 · 300 units raised itself
        </Tag>
        <Tag className={cn('justify-self-start', ease, ph >= 2 ? 'opacity-100' : 'translate-y-2 opacity-0')}>
          <Icon name="package" size={12} className="text-teal-ink" /> Received · shelf refilled
        </Tag>
        <div className="relative mt-1 h-[120px] rounded-[16px] bg-sink">
          <svg viewBox="0 0 240 120" className="absolute inset-0" fill="none">
            <path d="M20 96 C 70 96, 80 40, 130 44 S 200 90, 222 30" stroke="var(--line-2)" strokeWidth="2.5" strokeDasharray="5 6" />
          </svg>
          {[
            [130, 44],
            [180, 70],
            [222, 30],
          ].map(([x, y], k) => (
            <span key={k} className={cn('absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-raise transition-colors duration-500', ph === 3 ? 'bg-teal' : 'bg-line-2')} style={{ left: x, top: y, transitionDelay: `${k * 300 + 400}ms` }} />
          ))}
          <span className="iv-van absolute left-0 top-0 text-ink" data-on={ph === 3 || undefined}>
            <Icon name="truck" size={20} />
          </span>
          <span className={cn('absolute bottom-2 left-3 text-[10.5px] font-semibold transition-opacity duration-500', ph === 3 ? 'opacity-100' : 'opacity-0')}>3 shops restocked today</span>
        </div>
      </div>
    </>
  )
}

/** Each industry's scene, by solution slug. */
export const INDUSTRY_SCENES: Record<string, IndustryScene> = {
  'manufacturing-crm-software': {
    captions: ['An enquiry lands from IndiaMART', 'A quotation goes out in minutes', 'Approved - the sales order is raised', 'Packed, labelled and dispatched'],
    Scene: Manufacturing,
  },
  'ca-crm-software': {
    captions: ['Every client, every filing, one grid', 'Returns tick over as they’re filed', 'The one late client gets a nudge', 'All filed on time - no late fees'],
    Scene: CaPractice,
  },
  'visa-immigration-crm-software': {
    captions: ['The checklist fills itself in', 'Every document in, file complete', 'Visa granted', 'Off to Toronto'],
    Scene: Visa,
  },
  'real-estate-crm-software': {
    captions: ['Leads stream in to the listing', 'A site visit is booked', 'The token lands', 'Booked - nobody sells it twice'],
    Scene: RealEstate,
  },
  'education-crm-software': {
    captions: ['Enquiries become demo classes', 'Demos become admissions', 'The batch fills up', 'Full - receipts sent to parents'],
    Scene: Education,
  },
  'travel-agency-crm-software': {
    captions: ['A honeymoon enquiry from Ahmedabad', 'Dubai drops into the plan', 'Then Bali - and the trip is priced', 'The quote is on WhatsApp'],
    Scene: Travel,
  },
  'insurance-crm-software': {
    captions: ['30 days to renewal - a WhatsApp nudge', 'A payment link goes out', 'The advisor gets a call task', 'Renewed for another year'],
    Scene: Insurance,
  },
  'loan-management-software': {
    captions: ['Documents in, eligibility climbs', 'Offers arrive from lenders', 'Every rate side by side', 'The best one is sanctioned'],
    Scene: Loans,
  },
  'erp-software-development': {
    captions: ['Every department on its own sheet', 'Snapped into one system', 'One database underneath', 'Not a spreadsheet left'],
    Scene: Erp,
  },
  'hospital-management-software': {
    captions: ['Tokens called in order', 'The queue keeps moving', 'Wait times stay short', 'Prescription straight to the pharmacy'],
    Scene: Hospital,
  },
  'hrms-payroll-software': {
    captions: ['Attendance syncs from the biometric', 'Payslips go out to everyone', 'Salaries credited on the 1st', 'PF, ESI, PT and TDS filed'],
    Scene: Hrms,
  },
  'inventory-management-software': {
    captions: ['A shelf runs low', 'The reorder raises itself', 'Stock in, shelf refilled', 'Out to the shops on one route'],
    Scene: Inventory,
  },
}
