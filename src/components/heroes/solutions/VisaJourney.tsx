'use client'

import { HeroWindow, LiveTag } from '../HeroWindow'
import { useCycle } from '../useCycle'
import { Icon } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'
import { Choices, Works } from './kit'

const FILES = [
  {
    id: 'ca',
    country: 'Canada',
    to: 'YYZ',
    who: 'Riya Shah',
    initials: 'RS',
    visa: 'Study permit · MS Data Science',
    docs: ['Passport', 'Letter of acceptance', 'GIC certificate', 'IELTS · 7.5 bands', 'Statement of purpose'],
  },
  {
    id: 'uk',
    country: 'UK',
    to: 'LHR',
    who: 'Aarav Patel',
    initials: 'AP',
    visa: 'Skilled Worker visa',
    docs: ['Passport', 'Certificate of sponsorship', 'English test', 'Salary evidence', 'TB test certificate'],
  },
  {
    id: 'au',
    country: 'Australia',
    to: 'SYD',
    who: 'Meera Joshi',
    initials: 'MJ',
    visa: 'Student visa · subclass 500',
    docs: ['Passport', 'Confirmation of enrolment', 'Genuine student answers', 'OSHC health cover', 'PTE · 65'],
  },
  {
    id: 'de',
    country: 'Germany',
    to: 'FRA',
    who: 'Kabir Mehta',
    initials: 'KM',
    visa: 'EU Blue Card',
    docs: ['Passport', 'Employment contract', 'Degree recognition', 'Health insurance', 'Salary proof'],
  },
] as const
type Id = (typeof FILES)[number]['id']
const STAGES = ['Enquiry', 'Counselling', 'Documents', 'Filed', 'Approved']
/** When each part of a file completes, in ms from the moment it opens. */
const TICK = (k: number) => 350 + k * 360
const FILED = TICK(5) + 150
const APPROVED = FILED + 650

/**
 * Visa & immigration CRM: an applicant's file for the country they chose. The checklist for
 * that country ticks itself off, the file is lodged and the approval stamp lands. Switch
 * countries to see how each checklist differs.
 */
export function VisaJourney({ ints }: { ints: string[] }) {
  const { ref, i, setI, hold } = useCycle<HTMLDivElement>(FILES.length, 5600)
  const f = FILES[i]
  return (
    <div ref={ref} onMouseEnter={() => hold(true)} onMouseLeave={() => hold(false)}>
      <HeroWindow title="Applicant files · country checklists" right={<LiveTag />}>
        <div className="p-4 sm:p-5">
          <Choices<Id>
            label="Destination country"
            items={FILES.map((x) => ({ id: x.id, label: x.country }))}
            value={f.id}
            onPick={(id) => setI(FILES.findIndex((x) => x.id === id))}
          />

          {/* keyed by country, so the whole file plays again from the top */}
          <div key={f.id} className="mt-3 rounded-[12px] border border-line bg-bg p-3.5 sm:p-4">
            <div className="flex items-center gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-ink text-[0.7rem] font-bold text-bg">{f.initials}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[0.95rem] font-semibold tracking-[-0.01em]">{f.who}</p>
                <p className="t-small truncate text-[0.76rem]">{f.visa}</p>
              </div>
              {/* the route, drawn as the file moves */}
              <svg viewBox="0 0 120 46" className="hidden h-[46px] w-[120px] shrink-0 sm:block" aria-hidden>
                <path d="M10 34 Q60 -6 110 34" fill="none" stroke="var(--line-2)" strokeWidth="1.5" strokeDasharray="3 4" />
                <path d="M10 34 Q60 -6 110 34" fill="none" stroke="var(--teal)" strokeWidth="1.8" strokeLinecap="round" pathLength={100} className="sv-draw" style={{ ['--dur' as string]: `${APPROVED}ms` }} />
                <circle cx="10" cy="34" r="3" fill="var(--ink)" />
                <circle cx="110" cy="34" r="3.5" fill="var(--teal)" className="sv-in" style={{ ['--d' as string]: `${APPROVED}ms` }} />
                <text x="10" y="45" textAnchor="middle" className="fill-[var(--ink-3)] font-label text-[7px] tracking-[0.08em]">
                  AMD
                </text>
                <text x="110" y="45" textAnchor="middle" className="fill-[var(--ink-3)] font-label text-[7px] tracking-[0.08em]">
                  {f.to}
                </text>
              </svg>
            </div>

            <p className="t-label mt-4 text-ink-3">{f.country} checklist</p>
            <ul className="mt-2 grid gap-1.5">
              {f.docs.map((d, k) => (
                <li key={d} className="flex items-center gap-2.5 text-[0.84rem]">
                  <span className="relative grid size-[18px] shrink-0 place-items-center rounded-full border border-line-2">
                    <span className="sv-pop absolute inset-[-1px] grid place-items-center rounded-full bg-teal text-[#04161a]" style={{ ['--d' as string]: `${TICK(k)}ms` }}>
                      <Icon name="check" size={11} strokeWidth={2.8} />
                    </span>
                  </span>
                  <span className="min-w-0 flex-1 truncate">{d}</span>
                  <span className="sv-in t-label text-[0.56rem] text-teal-ink" style={{ ['--d' as string]: `${TICK(k)}ms` }}>
                    Verified
                  </span>
                </li>
              ))}
            </ul>

            {/* lodged, then the stamp lands */}
            <div className="mt-3 flex items-center justify-between gap-3 border-t border-line pt-3">
              <span className="sv-in t-label min-w-0 truncate text-[0.56rem] text-ink-3" style={{ ['--d' as string]: `${FILED}ms` }}>
                File lodged · applicant updated on WhatsApp
              </span>
              <span
                className="sv-stamp shrink-0 rounded-[6px] border-2 border-double border-teal-ink px-2.5 py-0.5 font-label text-[0.66rem] font-bold uppercase tracking-[0.14em] text-teal-ink"
                style={{ ['--d' as string]: `${APPROVED}ms` }}
              >
                Visa approved
              </span>
            </div>
          </div>

          {/* where the file is */}
          <ol key={`${f.id}-stages`} className="mt-4 grid grid-cols-5 gap-1.5" aria-label="Application stages">
            {STAGES.map((st, k) => {
              const at = k < 2 ? 0 : k === 2 ? TICK(4) : k === 3 ? FILED : APPROVED
              return (
                <li key={st} className="min-w-0">
                  <span className="block h-1 overflow-hidden rounded-full bg-sink">
                    <span className={cn('block h-full origin-left rounded-full bg-teal', k >= 2 && 'sv-grow')} style={{ ['--d' as string]: `${at}ms` }} />
                  </span>
                  <span className="t-label mt-1.5 block truncate text-[0.54rem] text-ink-3">{st}</span>
                </li>
              )
            })}
          </ol>
        </div>
      </HeroWindow>
      <Works ints={ints} note="Enquiry → visa approval" />
    </div>
  )
}
