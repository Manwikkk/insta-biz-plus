'use client'

import { HeroWindow, LiveTag } from '../HeroWindow'
import { useCycle } from '../useCycle'
import { Icon, type IconName } from '@/components/ui/Icon'
import { Choices, inr, useTween, Works } from './kit'

type Day = { icon: IconName; t: string; stay?: string }
const TRIPS: { id: 'bali' | 'dubai' | 'kashmir'; label: string; nights: string; pp: number; margin: number; days: Day[]; more: number }[] = [
  {
    id: 'bali',
    label: 'Bali',
    nights: '6N / 7D',
    pp: 58900,
    margin: 14,
    more: 3,
    days: [
      { icon: 'plane', t: 'Fly AMD → DPS · transfer to Seminyak', stay: 'Villa · 4★' },
      { icon: 'sparkles', t: 'Ubud swing & Tegallalang terraces' },
      { icon: 'globe', t: 'Nusa Penida island day trip' },
      { icon: 'pin', t: 'Kintamani sunrise · coffee trail' },
    ],
  },
  {
    id: 'dubai',
    label: 'Dubai',
    nights: '4N / 5D',
    pp: 64500,
    margin: 12,
    more: 1,
    days: [
      { icon: 'plane', t: 'Arrive DXB · Marina dhow dinner', stay: 'Hotel · 4★' },
      { icon: 'building', t: 'Burj Khalifa · Dubai Mall' },
      { icon: 'sparkles', t: 'Desert safari & BBQ camp' },
      { icon: 'pin', t: 'Abu Dhabi city tour' },
    ],
  },
  {
    id: 'kashmir',
    label: 'Kashmir',
    nights: '5N / 6D',
    pp: 32800,
    margin: 16,
    more: 2,
    days: [
      { icon: 'plane', t: 'Arrive Srinagar · shikara ride', stay: 'Houseboat' },
      { icon: 'sparkles', t: 'Gulmarg gondola' },
      { icon: 'pin', t: 'Pahalgam · Betaab valley' },
      { icon: 'globe', t: 'Sonamarg · Thajiwas glacier' },
    ],
  },
]
/** Each day drops into the plan in turn; the quote goes out once the plan is whole. */
const AT = (k: number) => 200 + k * 260
const SENT = AT(4) + 500

/**
 * Travel agency CRM: a trip planned day by day while the customer waits, priced with the
 * margin protected and sent on WhatsApp in minutes. Pick a destination to build another.
 */
export function ItineraryBuilder({ ints }: { ints: string[] }) {
  const { ref, i, setI, hold } = useCycle<HTMLDivElement>(TRIPS.length, 4400)
  const t = TRIPS[i]
  const pp = useTween(t.pp, 1100)
  return (
    <div ref={ref} onMouseEnter={() => hold(true)} onMouseLeave={() => hold(false)}>
      <HeroWindow title="Itinerary builder · new enquiry" right={<LiveTag />}>
        <div className="p-4 sm:p-5">
          <Choices
            label="Destination"
            items={TRIPS.map((x) => ({ id: x.id, label: x.label, note: x.nights }))}
            value={t.id}
            onPick={(id) => setI(TRIPS.findIndex((x) => x.id === id))}
          />

          <div key={t.id} className="mt-3 rounded-[12px] border border-line bg-bg p-3.5 sm:p-4">
            <div className="flex items-baseline justify-between gap-2">
              <p className="text-[0.92rem] font-semibold tracking-[-0.01em]">
                {t.label} · {t.nights}
              </p>
              <p className="t-label text-ink-3">2 adults · twin sharing</p>
            </div>
            <ol className="relative mt-3 grid gap-2 before:absolute before:bottom-3 before:left-[15px] before:top-3 before:w-px before:bg-line-2">
              {t.days.map((d, k) => (
                <li key={d.t} className="sv-drop relative flex items-center gap-3" style={{ ['--d' as string]: `${AT(k)}ms` }}>
                  <span className="relative grid size-[31px] shrink-0 place-items-center rounded-[9px] border border-line bg-raise text-teal-ink">
                    <Icon name={d.icon} size={15} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="t-label block text-[0.54rem] text-ink-3">Day {k + 1}</span>
                    <span className="block truncate text-[0.82rem] font-medium">{d.t}</span>
                  </span>
                  {d.stay ? <span className="tag hidden h-6 shrink-0 text-[0.56rem] sm:inline-flex">{d.stay}</span> : null}
                </li>
              ))}
            </ol>
            <p className="sv-drop t-label mt-2.5 pl-[43px] text-[0.56rem] text-ink-3" style={{ ['--d' as string]: `${AT(4)}ms` }}>
              + {t.more} more {t.more === 1 ? 'day' : 'days'} · transfers, visa help, insurance
            </p>
          </div>

          {/* the quote */}
          <div className="mt-3 flex items-center gap-3 rounded-[12px] border border-stage-line bg-stage px-3.5 py-3 text-stage-ink">
            <div className="min-w-0 flex-1">
              <p className="t-label text-[0.56rem] text-stage-ink-2">Per person · all inclusive</p>
              <p className="t-numeral mt-1 text-[1.4rem] tabular-nums">{inr(pp)}</p>
            </div>
            <div className="flex flex-col items-end gap-1.5">
              <span className="t-label rounded-[6px] bg-teal px-2 py-1 text-[0.56rem] text-[#04161a]">Margin {t.margin}%</span>
              <span key={t.id} className="sv-in t-label flex items-center gap-1 text-[0.56rem] text-teal" style={{ ['--d' as string]: `${SENT}ms` }}>
                <Icon name="whatsapp" size={12} />
                Quote sent · 4 min
              </span>
            </div>
          </div>
        </div>
      </HeroWindow>
      <Works ints={ints} note="Enquiry → quote → booking" />
    </div>
  )
}
