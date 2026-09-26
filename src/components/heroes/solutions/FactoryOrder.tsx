'use client'

import { AnimatePresence, motion } from 'motion/react'
import { HeroWindow, LiveTag } from '../HeroWindow'
import { useCycle } from '../useCycle'
import { Icon, type IconName } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'
import { ease, inr, Pill, useTween, Works } from './kit'

const STATIONS: { name: string; icon: IconName }[] = [
  { name: 'Enquiry', icon: 'mail' },
  { name: 'Quotation', icon: 'file' },
  { name: 'Sales order', icon: 'check' },
  { name: 'Dispatch', icon: 'truck' },
]
const CHANNELS = ['IndiaMART', 'TradeIndia', 'WhatsApp', 'Website']
const LINES = [
  { item: 'Hydraulic press · 60T', qty: '2 × ₹ 3,70,000', amt: 740000 },
  { item: 'Installation & training', qty: 'On site', amt: 35000 },
  { item: 'Dealer scheme', qty: '5% off', amt: -38750 },
]
const TOTAL = LINES.reduce((a, l) => a + l.amt, 0)
const ADVANCE = Math.round(TOTAL * 0.3)

function Stat({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="rounded-[10px] border border-line bg-raise px-3 py-2.5">
      <p className="t-label text-[0.56rem] text-ink-3">{label}</p>
      <p className="t-numeral mt-1.5 text-[1.05rem]">{value}</p>
      <p className="t-small mt-0.5 truncate text-[0.72rem]">{note}</p>
    </div>
  )
}

/** The record each station creates. */
function Station({ k, total }: { k: number; total: number }) {
  if (k === 0)
    return (
      <>
        <div className="flex items-center justify-between gap-2">
          <Pill tone="ember" icon="bell">
            New enquiry
          </Pill>
          <span className="t-label text-ink-3">2 min ago</span>
        </div>
        <p className="mt-3 text-[1rem] font-semibold tracking-[-0.01em]">Hydraulic press · 60T × 2</p>
        <p className="t-small mt-0.5">Shreeji Engineering, Rajkot</p>
        <p className="t-label mt-4 text-ink-3">Captured from every channel</p>
        <ul className="mt-2 flex flex-wrap gap-1.5">
          {CHANNELS.map((c, j) => (
            <li key={c} className={cn('sync-chip tag h-7', j === 0 && 'is-live')}>
              {c}
            </li>
          ))}
        </ul>
        <p className="mt-4 flex items-center gap-2 border-t border-line pt-3 text-[0.82rem] text-ink-2">
          <span className="grid size-6 shrink-0 place-items-center rounded-full bg-ink text-[0.56rem] font-bold text-bg">KP</span>
          Auto-assigned to Karan · first reply in 42 s
        </p>
      </>
    )
  if (k === 1)
    return (
      <>
        <div className="flex items-center justify-between gap-2">
          <p className="t-label text-ink-3">Quotation · QT-2291</p>
          <Pill tone="teal" icon="send">
            Sent on WhatsApp
          </Pill>
        </div>
        <ul className="mt-2 divide-y divide-line">
          {LINES.map((l, j) => (
            <motion.li
              key={l.item}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + j * 0.12, duration: 0.45, ease }}
              className="flex items-baseline gap-3 py-2 text-[0.84rem]"
            >
              <span className="min-w-0 flex-1 truncate font-medium">{l.item}</span>
              <span className="t-label hidden text-[0.58rem] text-ink-3 sm:inline">{l.qty}</span>
              <span className={cn('tabular-nums', l.amt < 0 && 'text-teal-ink')}>
                {l.amt < 0 ? '− ' : ''}
                {inr(Math.abs(l.amt))}
              </span>
            </motion.li>
          ))}
        </ul>
        <div className="mt-1 flex items-baseline justify-between border-t border-ink/70 pt-3">
          <span className="t-label text-ink-3">Total · price list applied</span>
          <span className="t-numeral text-[1.35rem] tabular-nums">{inr(total)}</span>
        </div>
      </>
    )
  if (k === 2)
    return (
      <>
        <div className="flex items-center justify-between gap-2">
          <p className="t-label text-ink-3">Sales order · SO-1187</p>
          <Pill tone="teal" icon="check">
            Confirmed
          </Pill>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <Stat label="Advance · 30%" value={inr(ADVANCE)} note="Paid by Razorpay link" />
          <Stat label="Production slot" value="Week 41" note="Line 2 · 2 units" />
        </div>
        <div className="mt-3.5">
          <div className="t-label flex justify-between text-ink-3">
            <span>Payment received</span>
            <span className="text-teal-ink">30%</span>
          </div>
          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-sink">
            <div className="sv-grow h-full w-[30%] origin-left rounded-full bg-teal" />
          </div>
        </div>
        <p className="mt-3.5 flex items-center gap-2 text-[0.82rem] text-ink-2">
          <Icon name="database" size={15} className="text-teal-ink" />
          Synced to Tally · invoice ready to raise
        </p>
      </>
    )
  return (
    <>
      <div className="flex items-center justify-between gap-2">
        <p className="t-label text-ink-3">Dispatch · LR 58213</p>
        <Pill tone="ink" icon="truck">
          On the road
        </Pill>
      </div>
      <div className="mt-5 px-1">
        <div className="t-label flex justify-between text-ink-3">
          <span>Ahmedabad plant</span>
          <span>Rajkot · ETA Thu</span>
        </div>
        <div className="relative mt-3 h-[2px] bg-[repeating-linear-gradient(90deg,var(--line-2)_0_6px,transparent_6px_11px)]">
          <span className="absolute left-0 top-1/2 size-2 -translate-y-1/2 rounded-full bg-ink" />
          <span className="absolute right-0 top-1/2 size-2.5 -translate-y-1/2 rounded-full bg-teal shadow-[0_0_0_5px_var(--teal-soft)]" />
          <span className="sv-drive absolute -top-[19px] text-ink">
            <Icon name="truck" size={24} strokeWidth={1.7} />
          </span>
        </div>
      </div>
      <ul className="mt-6 grid gap-2 text-[0.82rem] text-ink-2">
        <li className="flex items-center gap-2">
          <Icon name="whatsapp" size={15} className="text-teal-ink" />
          Customer sent the tracking link
        </li>
        <li className="flex items-center gap-2">
          <Icon name="calendar" size={15} className="text-teal-ink" />
          Service & AMC visits planned for 12 months
        </li>
      </ul>
    </>
  )
}

/**
 * Manufacturing CRM: one order riding the line, from an IndiaMART enquiry to a quotation,
 * a confirmed sales order and a truck on the road. Pick a station to stop there.
 */
export function FactoryOrder({ ints }: { ints: string[] }) {
  const { ref, i, setI, hold } = useCycle<HTMLDivElement>(STATIONS.length, 3000, 1)
  const total = useTween(i >= 1 ? TOTAL : 0, 1000)
  return (
    <div ref={ref} onMouseEnter={() => hold(true)} onMouseLeave={() => hold(false)}>
      <HeroWindow title="Order desk · manufacturing CRM" right={<LiveTag />}>
        <div className="p-4 sm:p-5">
          {/* the line: a belt that carries the order from station to station */}
          <div className="relative h-[30px]" aria-hidden>
            <div className="sv-belt absolute inset-x-0 bottom-0 h-[9px] rounded-full border border-line" />
            <span
              className="absolute bottom-[9px] -translate-x-1/2 transition-[left] duration-1000 ease-[var(--ease-machine)]"
              style={{ left: `${12.5 + i * 25}%` }}
            >
              <span className="grid size-[21px] place-items-center bg-ink [clip-path:polygon(50%_0,100%_25%,100%_75%,50%_100%,0_75%,0_25%)]">
                <span className="size-[7px] bg-teal [clip-path:polygon(50%_0,100%_25%,100%_75%,50%_100%,0_75%,0_25%)]" />
              </span>
            </span>
          </div>
          <ol className="mt-2.5 grid grid-cols-4">
            {STATIONS.map((st, k) => (
              <li key={st.name} className="flex justify-center">
                <button type="button" onClick={() => setI(k)} aria-pressed={k === i} className="group flex min-w-0 flex-col items-center gap-1.5">
                  <span
                    className={cn(
                      'grid size-9 place-items-center rounded-[10px] border transition-[background-color,border-color,color] duration-500',
                      k === i ? 'border-ink bg-ink text-bg' : k < i ? 'border-transparent bg-teal-soft text-teal-ink' : 'border-line text-ink-3 group-hover:border-line-2',
                    )}
                  >
                    <Icon name={k < i ? 'check' : st.icon} size={16} strokeWidth={k < i ? 2.2 : 1.7} />
                  </span>
                  <span className={cn('max-w-full truncate text-[0.72rem] font-medium transition-colors duration-500', k === i ? 'text-ink' : 'text-ink-3')}>
                    {st.name}
                  </span>
                </button>
              </li>
            ))}
          </ol>

          <div className="mt-4 min-h-[196px] overflow-hidden rounded-[12px] border border-line bg-bg">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4, ease }}
                className="p-3.5 sm:p-4"
              >
                <Station k={i} total={total} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </HeroWindow>
      <Works ints={ints} note="Enquiry → dispatch, one record" />
    </div>
  )
}
