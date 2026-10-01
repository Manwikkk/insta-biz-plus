'use client'

import type { CSSProperties, ReactNode } from 'react'
import { Icon, type IconName } from '@/components/ui/Icon'
import { inr, num, useTween } from '@/components/heroes/solutions/kit'
import { cn } from '@/lib/cn'
import { Chip, Pointer, Side, Toast, usePhase } from './kit'

/*
 * The CRM and ERP projects, re-built from their own screens and running: each one walks
 * through the job it does best, over and over, while it is on screen.
 */

const accent = (c: string) => ({ ['--pl-accent' as string]: c }) as CSSProperties

function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('rounded-[12px] bg-white shadow-[0_1px_2px_rgb(11_15_21/0.06),0_0_0_1px_rgb(11_15_21/0.06)]', className)}>{children}</div>
}

function Kpi({ label, value, icon, tone = '#0b0f15', lit, format = num }: { label: string; value: number; icon: IconName; tone?: string; lit?: boolean; format?: (n: number) => string }) {
  const v = useTween(value, 700)
  return (
    <Card className={cn('relative p-3 transition-shadow duration-500', lit && 'shadow-[0_0_0_2px_var(--pl-accent),0_10px_24px_-12px_var(--pl-accent)]')}>
      <span className="flex items-start justify-between">
        <span className="text-[10px] font-medium text-[#6b7280]">{label}</span>
        <span className="grid size-6 place-items-center rounded-[7px] bg-[#f3f4f6] text-[#6b7280]">
          <Icon name={icon} size={12} />
        </span>
      </span>
      <span className="mt-1 block text-[19px] font-semibold tabular-nums tracking-[-0.02em]" style={{ color: tone }}>
        {format(v)}
      </span>
    </Card>
  )
}

/* ------------------------------------------------ Cottons By Ridheera: an order from ad to door */

const COT_STAGES = ['Fabric booking', 'Cutting', 'Stitching', 'Finishing', 'Ready to dispatch']
const COT_LOG = ['Fabric booked · Super Admin · 10:12', 'Cutting done · Meena · 13:40', 'Stitching done · Imran · Day 2', 'Finishing & press · Day 3', 'Packed · ready to dispatch']
const COT_MS = [2000, 1500, 1500, 1500, 1500, 1700, 2000, 2600] as const

export function Cottons({ live }: { live: boolean }) {
  const ph = usePhase(8, COT_MS, live)
  const done = Math.min(ph, 5)
  const balance = useTween(ph >= 6 ? 0 : 3000)
  return (
    <div className="flex h-full bg-[#f7f4fa]" style={accent('#7b2d8e')}>
      <Side
        tone="dark"
        className="bg-[linear-gradient(180deg,#2c1239,#1d0b27)]"
        on={2}
        mark={
          <span className="flex items-center gap-2 text-white">
            <span className="grid size-7 place-items-center rounded-[8px] bg-[#7b2d8e] text-[13px] font-bold">R</span>
            <span className="text-[12px] font-semibold">Ridheera</span>
          </span>
        }
        items={[
          { icon: 'layers', label: 'Dashboard' },
          { icon: 'users', label: 'Leads' },
          { icon: 'package', label: 'Orders' },
          { icon: 'users', label: 'Customers' },
          { icon: 'banknote', label: 'Payments' },
          { icon: 'modules', label: 'Inventory' },
          { icon: 'file', label: 'Reports' },
        ]}
      />
      <div className="relative min-w-0 flex-1 p-4">
        <p className="text-[10px] text-[#8a8297]">Orders / RD-2148</p>
        <div className="mt-1 flex items-center gap-2">
          <p className="text-[17px] font-semibold tracking-[-0.02em]">Order RD-2148</p>
          <Chip tone="#7b2d8e">{done >= 5 ? 'Ready to dispatch' : COT_STAGES[done]}</Chip>
          <Chip tone="#d62976" className="ml-auto">
            <Icon name="instagram" size={10} /> From an Instagram ad
          </Chip>
        </div>

        {/* production stages */}
        <Card className="mt-3 px-4 py-3">
          <div className="relative grid grid-cols-5">
            <span className="absolute left-[10%] right-[10%] top-[10px] h-[2px] bg-[#ece7f1]" />
            <span className="absolute left-[10%] top-[10px] h-[2px] bg-[#7b2d8e] transition-[width] duration-700" style={{ width: `${(Math.max(0, done - 1) / 4) * 80}%` }} />
            {COT_STAGES.map((s, k) => (
              <span key={s} className="relative flex flex-col items-center gap-1.5">
                <span
                  className={cn(
                    'grid size-[22px] place-items-center rounded-full border-2 text-white transition-all duration-500',
                    k < done ? 'border-[#7b2d8e] bg-[#7b2d8e]' : k === done ? 'pl-ring border-[#7b2d8e] bg-white' : 'border-[#ddd5e5] bg-white',
                  )}
                >
                  {k < done ? <Icon name="check" size={11} strokeWidth={3} /> : null}
                </span>
                <span className={cn('text-[9.5px] font-medium', k <= done ? 'text-[#2c1239]' : 'text-[#a59cb0]')}>{s}</span>
              </span>
            ))}
          </div>
        </Card>

        <div className="mt-3 grid grid-cols-[1.25fr_1fr] gap-3">
          <Card className="p-3">
            <p className="text-[10.5px] font-semibold">Order items</p>
            <div className="mt-2 flex items-center gap-3">
              <span className="size-11 shrink-0 rounded-[9px] bg-[repeating-linear-gradient(45deg,#2f3e8f_0_4px,#3b4fb0_4px_8px)]" />
              <span className="min-w-0 flex-1">
                <span className="block text-[11.5px] font-semibold">Jaipur cotton kurti × 2</span>
                <span className="block text-[9.5px] text-[#6b7280]">Indigo block print · size M</span>
              </span>
              <span className="text-[12px] font-semibold tabular-nums">₹ 6,000</span>
            </div>
            <div className="mt-2 flex flex-wrap gap-1">
              {['Bust 34', 'Waist 30', 'Length 42', 'Sleeve 18'].map((m) => (
                <span key={m} className="rounded-[5px] bg-[#f3eef7] px-1.5 py-0.5 text-[9px] text-[#5b4a6b]">
                  {m}
                </span>
              ))}
            </div>
            <p className="mt-3 text-[10.5px] font-semibold">Stage history</p>
            <ul className="mt-1.5 grid gap-1">
              {COT_LOG.map((l, k) => (
                <li key={l} className={cn('flex items-center gap-2 text-[9.5px] text-[#4b5563] transition-all duration-500', k < done ? 'opacity-100' : 'translate-x-2 opacity-0')}>
                  <span className="size-1.5 rounded-full bg-[#7b2d8e]" />
                  {l}
                </li>
              ))}
            </ul>
          </Card>
          <div className="grid grid-rows-[auto_1fr] gap-3">
            <Card className="p-3">
              <p className="text-[10.5px] font-semibold">Customer</p>
              <p className="mt-1.5 text-[11.5px] font-medium">Ananya Shah</p>
              <p className="text-[9.5px] text-[#6b7280]">+91 98•• •• 4521 · lead synced from Meta</p>
              <div className="mt-2 flex justify-between border-t border-[#f0edf3] pt-2 text-[10px]">
                <span className="text-[#6b7280]">Paid ₹ 3,000</span>
                <span className="font-semibold tabular-nums">Balance {inr(balance)}</span>
              </div>
            </Card>
            <Card className="p-3">
              <p className="text-[10.5px] font-semibold">Dispatch</p>
              <div className={cn('mt-2 flex items-center gap-2 transition-all duration-500', ph >= 6 ? 'opacity-100' : 'opacity-35')}>
                <span className="grid size-7 place-items-center rounded-[8px] bg-[#f3eef7] text-[#7b2d8e]">
                  <Icon name="truck" size={14} />
                </span>
                <span>
                  <span className="block text-[10.5px] font-semibold">DTDC · {ph >= 6 ? 'D7492 1336' : 'awaiting pickup'}</span>
                  <span className="block text-[9.5px] text-[#6b7280]">{ph >= 6 ? 'In transit · Ahmedabad hub' : 'Generated when ready'}</span>
                </span>
              </div>
              <div className="mt-4 flex items-center justify-between text-[9px] font-medium text-[#6b7280]">
                <span>Jaipur studio</span>
                <span>Pune · ETA 2 days</span>
              </div>
              <div className="relative mt-1.5 h-1.5 rounded-full bg-[#f1ecf5]">
                <div className="h-full rounded-full bg-[#7b2d8e] transition-[width] duration-[1600ms] ease-[var(--ease-in-out)]" style={{ width: ph >= 7 ? '58%' : ph >= 6 ? '22%' : '0%' }} />
              </div>
            </Card>
          </div>
        </div>

        <Toast show={ph === 0} icon="instagram" tone="#d62976" title="New lead from an Instagram ad" note="Ananya Shah · added to Leads, no typing" />
        <Toast show={ph === 6} icon="truck" tone="#7b2d8e" title="Handed to DTDC" note="Tracking D7492 1336 · label printed" />
        <Toast show={ph === 7} icon="whatsapp" tone="#16a34a" title="WhatsApp sent to Ananya" note="Your kurtis are on their way" />
      </div>
    </div>
  )
}

/* ------------------------------------------------ Doclinks CRM: a doctor listed, verified, booked */

const DOC_ROWS = [
  ['Dr. Mayank Singh', 'Plastic Surgery', 'Ahmedabad', 'MS'],
  ['Dr. Juhi Nanavati', 'Urologist', 'Vadodara', 'JN'],
  ['Dr. Pulkit Gupta', 'Dentist', 'Surat', 'PG'],
  ['Dr. Hiral Patel', 'Dermatologist', 'Ahmedabad', 'HP'],
  ['Dr. Chirag Shah', 'Orthopaedics', 'Rajkot', 'CS'],
] as const
const DOC_MS = [1800, 1900, 2000, 2300, 1900, 900] as const

export function Doclinks({ live }: { live: boolean }) {
  const ph = usePhase(6, DOC_MS, live, 3)
  const added = ph >= 1 && ph <= 4
  const verified = ph >= 2 && ph <= 4
  return (
    <div className="flex h-full bg-[#f3f9f8]" style={accent('#0e9f8b')}>
      <Side
        className="border-r border-[#e3efed] bg-white"
        on={3}
        mark={
          <span className="text-[17px] font-bold tracking-[-0.03em] text-[#0e9f8b]">
            Doc<span className="text-[#0b5f55]">links</span>
          </span>
        }
        items={[
          { icon: 'layers', label: 'Dashboard' },
          { icon: 'building', label: 'Hospitals' },
          { icon: 'medical', label: 'Clinics' },
          { icon: 'users', label: 'Doctors' },
          { icon: 'users', label: 'Patients' },
          { icon: 'scan', label: 'Lab tests' },
          { icon: 'calendar', label: 'Appointments' },
        ]}
      />
      <div className="relative min-w-0 flex-1 p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[17px] font-semibold tracking-[-0.02em]">Doctors</p>
            <p className="text-[10px] text-[#6b7280]">Manage all registered doctors on the platform</p>
          </div>
          <span className={cn('flex items-center gap-1.5 rounded-[8px] bg-[#0e9f8b] px-3 py-1.5 text-[10.5px] font-semibold text-white transition-transform duration-150', ph === 0 && 'pl-press')}>
            <Icon name="plus" size={12} strokeWidth={2.4} /> Add doctor
          </span>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-3">
          <Kpi label="Doctors listed" value={added ? 1249 : 1248} icon="users" lit={ph === 1} />
          <Kpi label="Appointments today" value={ph >= 3 && ph <= 4 ? 487 : 486} icon="calendar" lit={ph === 3} />
          <Kpi label="Avg. rating" value={4.8} icon="star" format={(n) => `${n.toFixed(1)} ★`} />
        </div>
        <Card className="mt-3 overflow-hidden">
          <div className="grid grid-cols-[1.6fr_1fr_0.8fr_0.8fr] bg-[#f7fbfa] px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.06em] text-[#6b7280]">
            <span>Doctor</span>
            <span>Specialisation</span>
            <span>Status</span>
            <span>City</span>
          </div>
          <div className={cn('grid transition-[grid-template-rows] duration-700', added ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]')}>
            <div className="overflow-hidden">
              <DocRow name="Dr. Kavya Iyer" spec="Cardiology" city="Ahmedabad" ini="KI" fresh status={verified ? 'Active' : 'Pending'} />
            </div>
          </div>
          {DOC_ROWS.map(([n, s, c, i]) => (
            <DocRow key={n} name={n} spec={s} city={c} ini={i} status="Active" />
          ))}
        </Card>
        <Pointer x={ph === 0 ? 736 : 690} y={ph === 0 ? 26 : 132} press={ph === 0} />
        <Toast show={ph === 1} icon="file" tone="#0e9f8b" title="Profile created · Dr. Kavya Iyer" note="Documents uploaded for verification" />
        <Toast show={ph === 2} icon="shield" tone="#0e9f8b" title="Verified · now live on doclinks.in" note="Patients can find and book her" />
        <Toast show={ph === 3} icon="calendar" tone="#2563eb" title="New booking · Tue, 10:30" note="Rahul Mehta with Dr. Kavya Iyer" />
      </div>
    </div>
  )
}

function DocRow({ name, spec, city, ini, status, fresh }: { name: string; spec: string; city: string; ini: string; status: 'Active' | 'Pending'; fresh?: boolean }) {
  return (
    <div className={cn('grid grid-cols-[1.6fr_1fr_0.8fr_0.8fr] items-center border-t border-[#eef3f2] px-3 py-[7px] text-[10.5px]', fresh && 'bg-[#effaf7]')}>
      <span className="flex items-center gap-2">
        <span className="grid size-6 place-items-center rounded-full bg-[#dff3ef] text-[9px] font-semibold text-[#0b5f55]">{ini}</span>
        <span className="font-medium">{name}</span>
      </span>
      <span className="text-[#4b5563]">{spec}</span>
      <span>
        <Chip tone={status === 'Active' ? '#0e9f8b' : '#d97706'}>{status}</Chip>
      </span>
      <span className="text-[#4b5563]">{city}</span>
    </div>
  )
}

/* ------------------------------------------------ Grand Sud: a student from prospect to enrolled, in two languages */

const GS_COLS = {
  en: ['Prospect', 'Interview', 'Validated', 'Enrolled'],
  fr: ['Prospect', 'Entretien', 'Validé', 'Inscrit'],
}
const GS_CARDS = [
  [0, 'Léa Martin', 'BTS Tourisme', 'FR'],
  [0, 'Rohan Desai', 'Bachelor Hôtellerie', 'IN'],
  [1, 'Sofia Rossi', 'MBA Tourism', 'IT'],
  [2, 'Yuki Tanaka', 'BTS MCO', 'JP'],
  [3, 'Emma Dubois', 'Bachelor Hôtellerie', 'FR'],
  [3, 'Kabir Shah', 'MBA Hospitality', 'IN'],
] as const
const GS_MS = [1800, 1900, 1900, 2200, 2200, 2200, 1000] as const

export function GrandSud({ live }: { live: boolean }) {
  const ph = usePhase(7, GS_MS, live, 3)
  const fr = ph >= 4 && ph <= 5
  const L = fr ? GS_COLS.fr : GS_COLS.en
  const col = Math.min(ph, 3)
  const counts = [2, 1, 1, 2].map((c, k) => c + (k === col && ph < 6 ? 1 : 0))
  return (
    <div className="flex h-full bg-[#f4f5f8]" style={accent('#e2483d')}>
      <Side
        tone="dark"
        className="bg-[#141b2d]"
        on={1}
        mark={
          <span className="flex items-center gap-2 text-white">
            <span className="grid size-7 place-items-center rounded-[6px] bg-[#e2483d] text-[11px] font-bold">GS</span>
            <span className="text-[12px] font-semibold">Grand Sud</span>
          </span>
        }
        items={[
          { icon: 'layers', label: fr ? 'Tableau de bord' : 'Dashboard' },
          { icon: 'graduation', label: fr ? 'Étudiants' : 'Students' },
          { icon: 'users', label: 'Prospects' },
          { icon: 'calendar', label: fr ? 'Entretiens' : 'Interviews' },
          { icon: 'building', label: fr ? 'Agences B2B' : 'B2B agencies' },
          { icon: 'factory', label: fr ? 'Entreprises' : 'Companies' },
          { icon: 'mail', label: fr ? 'Courriel' : 'Mail' },
        ]}
      />
      <div className="relative min-w-0 flex-1 p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[17px] font-semibold tracking-[-0.02em]">{fr ? 'Bon retour, Ronak !' : 'Welcome back, Ronak!'}</p>
            <p className="text-[10px] text-[#6b7280]">{fr ? 'Admissions 2026 · campus de Toulouse' : 'Admissions 2026 · Toulouse campus'}</p>
          </div>
          <span className="flex rounded-full bg-white p-0.5 text-[9.5px] font-semibold shadow-[0_0_0_1px_rgb(11_15_21/0.08)]">
            <span className={cn('rounded-full px-2 py-0.5 transition-colors duration-500', !fr && 'bg-[#141b2d] text-white')}>EN</span>
            <span className={cn('rounded-full px-2 py-0.5 transition-colors duration-500', fr && 'bg-[#141b2d] text-white')}>FR</span>
          </span>
        </div>
        <div className="mt-2.5 flex gap-2">
          {(fr ? ['Nouvel étudiant', 'Nouvelle agence B2B', 'Planifier un entretien'] : ['New student (direct)', 'New B2B agency', 'Schedule interview']).map((a, k) => (
            <span key={k} className={cn('flex items-center gap-1 rounded-[7px] px-2.5 py-1.5 text-[10px] font-semibold', k === 0 ? 'bg-[#4f46e5] text-white' : 'bg-white text-[#374151] shadow-[0_0_0_1px_rgb(11_15_21/0.08)]')}>
              <Icon name="plus" size={11} strokeWidth={2.4} />
              {a}
            </span>
          ))}
        </div>
        {/* the pipeline */}
        <div className="relative mt-3 grid grid-cols-4 gap-2.5">
          {L.map((c, k) => (
            <div key={k} className="h-[262px] rounded-[11px] bg-[#e9ebf1] p-2">
              <p className="flex items-center justify-between px-1 text-[10px] font-semibold text-[#374151]">
                {c}
                <span className="rounded-full bg-white px-1.5 text-[9px] tabular-nums text-[#6b7280]">{counts[k]}</span>
              </p>
              <div className="mt-2 grid gap-1.5">
                {GS_CARDS.filter((g) => g[0] === k).map((g) => (
                  <StudentCard key={g[1]} name={g[1]} program={g[2]} country={g[3]} />
                ))}
              </div>
            </div>
          ))}
          {/* the student moving through */}
          <div
            className={cn('absolute top-[30px] w-[calc((100%-30px)/4-16px)] transition-[transform,opacity] duration-700 ease-[var(--ease-in-out)]', ph === 6 ? 'opacity-0' : 'opacity-100')}
            style={{ left: 8, transform: `translate(calc(${col} * (100% + 26px)), ${col === 0 || col === 3 ? 98 : 49}px)` }}
          >
            <StudentCard name="Aarav Mehta" program="MBA Hospitality" country="IN" moving>
              {ph === 1 ? <Chip tone="#4f46e5">{fr ? 'Entretien · 14 oct' : 'Interview · 14 Oct'}</Chip> : null}
              {ph === 2 ? <Chip tone="#16a34a">{fr ? 'Dossier validé' : 'File validated'}</Chip> : null}
              {ph >= 3 && ph <= 5 ? <Chip tone="#e2483d">{fr ? 'Inscrit ✓' : 'Enrolled ✓'}</Chip> : null}
            </StudentCard>
          </div>
        </div>
        <Toast show={ph === 3} icon="mail" tone="#e2483d" title="Aarav enrolled · welcome mail sent" note="In English and French, from the same record" />
      </div>
    </div>
  )
}

function StudentCard({ name, program, country, moving, children }: { name: string; program: string; country: string; moving?: boolean; children?: ReactNode }) {
  return (
    <div className={cn('rounded-[9px] bg-white p-2 shadow-[0_1px_2px_rgb(11_15_21/0.08)]', moving && 'shadow-[0_0_0_2px_#e2483d,0_14px_26px_-14px_rgb(226_72_61/0.7)]')}>
      <p className="flex items-center justify-between text-[10.5px] font-semibold">
        {name}
        <span className="rounded-[4px] bg-[#f3f4f6] px-1 text-[8.5px] font-semibold text-[#6b7280]">{country}</span>
      </p>
      <p className="text-[9.5px] text-[#6b7280]">{program}</p>
      {children ? <div className="mt-1.5">{children}</div> : null}
    </div>
  )
}

/* ------------------------------------------------ Krishna Clinic: a morning of check-ins, a bill, a plan */

const KC_PATIENTS = [
  ['Mishti Patel', '6 yrs', 'Speech therapy', 'Dr. Hetal Shah', 82],
  ['Aryan Shah', '4 yrs', 'Occupational', 'Dr. Nirav Joshi', 74],
  ['Shreya Yadav', '8 yrs', 'Physiotherapy', 'Dr. Hetal Shah', 91],
  ['Vihaan Amin', '5 yrs', 'Speech therapy', 'Dr. Riya Modi', 68],
  ['Rudransh Jaiswal', '7 yrs', 'Occupational', 'Dr. Nirav Joshi', 77],
  ['Tithi Pandya', '3 yrs', 'Early intervention', 'Dr. Riya Modi', 86],
] as const
const KC_MS = [1900, 1900, 1900, 2300, 2300] as const

export function Krishna({ live }: { live: boolean }) {
  const ph = usePhase(5, KC_MS, live, 2)
  return (
    <div className="flex h-full bg-[#f5f8fb]" style={accent('#0e7490')}>
      <Side
        className="border-r border-[#e6edf3] bg-white"
        on={3}
        mark={
          <span className="flex items-center gap-2">
            <span className="grid size-7 place-items-center rounded-full bg-[#e0f2f7] text-[#0e7490]">
              <Icon name="medical" size={14} />
            </span>
            <span className="text-[10.5px] font-semibold leading-tight">Krishna Pediatric Rehab</span>
          </span>
        }
        items={[
          { icon: 'layers', label: 'Dashboard' },
          { icon: 'calendar', label: 'Calendar' },
          { icon: 'file', label: 'Assessments' },
          { icon: 'users', label: 'Patients' },
          { icon: 'check', label: 'Attendance' },
          { icon: 'banknote', label: 'Invoices' },
          { icon: 'pulse', label: 'Therapy plans' },
        ]}
      />
      <div className="relative min-w-0 flex-1 p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[17px] font-semibold tracking-[-0.02em]">Patients</p>
            <p className="text-[10px] text-[#6b7280]">Today · 18 sessions · 3 therapists</p>
          </div>
          <span className="flex gap-1">
            {['All', 'Speech', 'Occupational', 'Physio'].map((f, k) => (
              <span key={f} className={cn('rounded-full px-2.5 py-1 text-[9.5px] font-semibold', k === 0 ? 'bg-[#0e7490] text-white' : 'bg-white text-[#4b5563] shadow-[0_0_0_1px_rgb(11_15_21/0.08)]')}>
                {f}
              </span>
            ))}
          </span>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2.5">
          {KC_PATIENTS.map(([n, age, t, dr, att], k) => {
            const now = k === ph && ph < 3
            const inToday = k < Math.min(ph + (ph < 3 ? 1 : 0), 3) || (ph >= 3 && k < 3)
            const pct = att + (inToday ? 2 : 0)
            return (
              <Card key={n} className={cn('p-2.5 transition-shadow duration-500', now && 'shadow-[0_0_0_2px_#0e7490,0_12px_26px_-14px_rgb(14_116_144/0.8)]')}>
                <p className="flex items-center justify-between text-[11px] font-semibold">
                  {n}
                  {inToday ? (
                    <Chip tone="#16a34a">
                      <Icon name="check" size={9} strokeWidth={3} /> In
                    </Chip>
                  ) : (
                    <span className="text-[9px] font-medium text-[#9ca3af]">{['10:30', '11:00', '11:30', '12:00', '12:30', '1:00'][k]}</span>
                  )}
                </p>
                <p className="text-[9.5px] text-[#6b7280]">
                  PT-00{23 + k} · {age} · {t}
                </p>
                <p className="mt-1 text-[9.5px] text-[#374151]">{dr}</p>
                <div className="mt-2 flex items-center justify-between text-[9px] text-[#6b7280]">
                  <span>Attendance</span>
                  <span className="font-semibold tabular-nums text-[#0b0f15]">{pct}%</span>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-[#eef2f6]">
                  <div className="h-full rounded-full bg-[#16a34a] transition-[width] duration-700" style={{ width: `${pct}%` }} />
                </div>
              </Card>
            )
          })}
        </div>
        <Card className="mt-3 px-3 py-2.5">
          <p className="flex items-center justify-between text-[10.5px] font-semibold">
            Today
            <span className="text-[9.5px] font-medium text-[#6b7280]">{Math.min(ph + 1, 3)} of 6 seen · on time</span>
          </p>
          <div className="relative mt-2 grid grid-cols-6 gap-1.5">
            {['10:30', '11:00', '11:30', '12:00', '12:30', '1:00'].map((t, k) => (
              <span key={t} className={cn('rounded-[6px] px-2 py-1.5 text-[9px] font-semibold transition-colors duration-500', k < Math.min(ph + 1, 3) ? 'bg-[#dcfce7] text-[#15803d]' : k === Math.min(ph + 1, 3) ? 'bg-[#e0f2f7] text-[#0e7490]' : 'bg-[#f3f4f6] text-[#9ca3af]')}>
                {t}
                <span className="block font-medium">{KC_PATIENTS[k][0].split(' ')[0]}</span>
              </span>
            ))}
          </div>
        </Card>
        <Toast show={ph < 3} icon="check" tone="#0e7490" title={`${KC_PATIENTS[Math.min(ph, 2)][0]} checked in`} note="Attendance marked · therapist notified" />
        <Toast show={ph === 3} icon="whatsapp" tone="#16a34a" title="Invoice KC-582 · ₹ 2,400" note="Sent to the parent on WhatsApp" />
        <Toast show={ph === 4} icon="pulse" tone="#7c3aed" title="Therapy plan updated" note="Mishti · goal 3 of 5 met this month" />
      </div>
    </div>
  )
}

/* ------------------------------------------------ Mudra Yoga: a lead nudged, converted and renewed */

const MY_MS = [2000, 2000, 2200, 2000, 2200, 1600] as const

export function Mudra({ live }: { live: boolean }) {
  const ph = usePhase(6, MY_MS, live, 4)
  const conv = ph >= 2 && ph <= 5
  const renewed = ph >= 4 && ph <= 5
  const rows = [
    { n: 'Riya Patel', p: 'Hatha · 3 months', s: ph === 0 ? 'Hot lead' : ph === 1 ? 'Reminder sent' : conv ? 'Joined' : 'Hot lead', t: ph >= 2 && ph <= 5 ? '#16a34a' : ph === 1 ? '#0e7490' : '#d97706', on: ph <= 2 },
    { n: 'Karan Desai', p: 'Renews in 3 days', s: ph === 3 ? 'Reminder sent' : renewed ? 'Renewed' : 'Due', t: renewed ? '#16a34a' : ph === 3 ? '#0e7490' : '#b45309', on: ph === 3 || ph === 4 },
    { n: 'Sneha Joshi', p: 'Trial class · Sat', s: 'Follow-up', t: '#6b7280', on: false },
  ]
  return (
    <div className="flex h-full bg-[#f7f2ec]" style={accent('#5a2e1c')}>
      <Side
        className="border-r border-[#ece3d9] bg-[#fffcf8]"
        on={0}
        mark={
          <span className="flex items-center gap-2">
            <span className="grid size-7 place-items-center rounded-full border border-[#d8c3ad] text-[13px] text-[#5a2e1c]">ॐ</span>
            <span className="text-[12px] font-semibold text-[#5a2e1c]">Mudra Yoga</span>
          </span>
        }
        items={[
          { icon: 'layers', label: 'Dashboard' },
          { icon: 'users', label: 'Leads' },
          { icon: 'bell', label: 'Follow-ups' },
          { icon: 'users', label: 'Members' },
          { icon: 'package', label: 'Packages' },
          { icon: 'banknote', label: 'Payments' },
          { icon: 'whatsapp', label: 'WhatsApp logs' },
        ]}
      />
      <div className="relative min-w-0 flex-1 p-4">
        <p className="text-[17px] font-semibold tracking-[-0.02em] text-[#2b1a12]">Dashboard</p>
        <p className="text-[10px] text-[#8a7766]">Leads, members, renewals and revenue - click any card for its records</p>
        <div className="mt-3 grid grid-cols-4 gap-2">
          <Kpi label="Total leads" value={1844} icon="users" />
          <Kpi label="Converted" value={conv ? 313 : 312} icon="check" tone="#15803d" lit={ph === 2} />
          <Kpi label="Active members" value={conv ? 269 : 268} icon="users" lit={ph === 2} />
          <Kpi label="Upcoming renewals" value={renewed ? 21 : 22} icon="calendar" lit={ph === 4} />
          <Kpi label="Today's follow-ups" value={ph >= 2 && ph <= 5 ? 13 : 14} icon="bell" />
          <Kpi label="Hot leads" value={conv ? 125 : 126} icon="spark" tone="#c2410c" />
          <Kpi label="Revenue (month)" value={199890 + (conv ? 6500 : 0) + (renewed ? 4500 : 0)} icon="banknote" format={inr} lit={ph === 2 || ph === 4} />
          <Kpi label="Net profit" value={157780 + (conv ? 6500 : 0) + (renewed ? 4500 : 0)} icon="pulse" format={inr} />
        </div>
        <Card className="mt-3 p-3">
          <p className="text-[10.5px] font-semibold">Follow-ups today</p>
          <ul className="mt-1.5 grid gap-1">
            {rows.map((r) => (
              <li key={r.n} className={cn('flex items-center gap-3 rounded-[8px] px-2 py-1.5 transition-colors duration-500', r.on && 'bg-[#f7efe6]')}>
                <span className="grid size-6 place-items-center rounded-full bg-[#efe3d6] text-[9px] font-semibold text-[#5a2e1c]">
                  {r.n
                    .split(' ')
                    .map((w) => w[0])
                    .join('')}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[10.5px] font-medium">{r.n}</span>
                  <span className="block text-[9.5px] text-[#8a7766]">{r.p}</span>
                </span>
                <Chip tone={r.t}>{r.s}</Chip>
              </li>
            ))}
          </ul>
        </Card>
        <Toast show={ph === 1} icon="whatsapp" tone="#16a34a" title="Reminder sent to Riya on WhatsApp" note="Your first Hatha class is tomorrow, 7 am" />
        <Toast show={ph === 2} icon="check" tone="#5a2e1c" title="Riya joined · 3-month Hatha" note="₹ 6,500 received · member added" />
        <Toast show={ph === 3} icon="whatsapp" tone="#16a34a" title="Renewal reminder · Karan Desai" note="Package ends in 3 days" />
        <Toast show={ph === 4} icon="banknote" tone="#5a2e1c" title="Karan renewed · ₹ 4,500" note="Next renewal set for 3 months" />
      </div>
    </div>
  )
}

/* ------------------------------------------------ Orkay Tiles: an order loaded, dispatched, closed */

const OR_MS = [1800, 2100, 2400, 2200, 2200, 1200] as const

export function Orkay({ live }: { live: boolean }) {
  const ph = usePhase(6, OR_MS, live, 3)
  const ready = ph >= 1 && ph <= 4
  const loaded = ph >= 2 && ph <= 4
  const closed = ph >= 3 && ph <= 4
  const fresh = ph === 4
  const stage = ph === 0 || ph === 5 ? 0 : ph === 1 ? 1 : ph === 2 ? 2 : 3
  return (
    <div className="flex h-full bg-[#f3ece4]" style={accent('#8b1d1d')}>
      <aside className="flex w-[54px] shrink-0 flex-col items-center gap-2 border-r border-[#e8ddd2] bg-white py-4">
        <span className="mb-2 text-[8px] font-bold tracking-[0.12em] text-[#8b1d1d]">ORKAY</span>
        {(['layers', 'pulse', 'users', 'file', 'package', 'truck', 'bell'] as IconName[]).map((ic, k) => (
          <span key={ic} className={cn('grid size-8 place-items-center rounded-[9px]', k === 0 ? 'bg-[#8b1d1d] text-white' : 'text-[#8b7d72]')}>
            <Icon name={ic} size={14} />
          </span>
        ))}
      </aside>
      <div className="relative min-w-0 flex-1 p-4">
        <div className="flex items-center justify-end gap-2 text-[10px] text-[#6b5d52]">
          Reminders
          <span className="relative grid size-7 place-items-center rounded-full bg-white shadow-[0_0_0_1px_rgb(11_15_21/0.08)]">
            <Icon name="bell" size={13} />
            <span className="absolute -right-1 -top-1 rounded-full bg-[#b91c1c] px-1 text-[8px] font-bold tabular-nums text-white">{fresh ? 33 : 32}</span>
          </span>
        </div>
        <div className="mt-2 rounded-[12px] bg-[linear-gradient(110deg,#9b1c1c,#5a1f1a_70%,#3b2a24)] px-4 py-3 text-white">
          <p className="text-[18px] font-bold tracking-[-0.02em]">Dashboard</p>
          <p className="text-[10px] text-white/75">Clear metrics first. Click any card to open full order details.</p>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2.5">
          <Kpi label="Total orders" value={fresh ? 229 : 228} icon="package" lit={fresh} />
          <Kpi label="Pending orders" value={ready ? 189 : 190} icon="clock" tone="#b45309" lit={ph === 1} />
          <Kpi label="Pending boxes" value={loaded ? 371196 : 372436} icon="layers" tone="#b45309" lit={ph === 2} />
          <Kpi label="Ready to load" value={ready && !closed ? 10 : 9} icon="truck" lit={ph === 1} />
          <Kpi label="Half orders" value={0} icon="file" />
          <Kpi label="Completed" value={closed ? 31 : 30} icon="check" tone="#15803d" lit={ph === 3} />
        </div>
        {/* the order on the move */}
        <Card className="relative mt-3 overflow-hidden px-3 py-2.5">
          <div className="flex items-center justify-between text-[10.5px]">
            <span className="font-semibold">ORD-4471 · Vitrified 600×600 · 1,240 boxes</span>
            <span className="text-[#6b5d52]">Shah Ceramics, Morbi</span>
          </div>
          <div className="relative mt-2.5 grid grid-cols-4 text-[9.5px] font-medium">
            <span className="absolute left-[12.5%] right-[12.5%] top-[7px] h-[2px] bg-[#efe6dc]" />
            <span className="absolute left-[12.5%] top-[7px] h-[2px] bg-[#8b1d1d] transition-[width] duration-700" style={{ width: `${(stage / 3) * 75}%` }} />
            {['Pending', 'Ready to load', 'On the truck', 'Delivered'].map((s, k) => (
              <span key={s} className="relative flex flex-col items-center gap-1">
                <span className={cn('size-4 rounded-full border-2 transition-colors duration-500', k <= stage ? 'border-[#8b1d1d] bg-[#8b1d1d]' : 'border-[#e2d6ca] bg-white')} />
                <span className={k <= stage ? 'text-[#3b2a24]' : 'text-[#b3a597]'}>{s}</span>
              </span>
            ))}
            <span className={cn('pl-truck absolute top-[-9px] text-[#8b1d1d]', ph === 2 && 'is-on')}>
              <Icon name="truck" size={18} />
            </span>
          </div>
        </Card>
        <Toast show={ph === 1} icon="package" tone="#8b1d1d" title="ORD-4471 ready to load" note="Loading slip shared with the yard" />
        <Toast show={ph === 3} icon="truck" tone="#15803d" title="Delivered · GJ-03-BW-4471" note="Dealer signed on the app · order closed" />
        <Toast show={ph === 4} icon="bell" tone="#8b1d1d" title="New order ORD-4472" note="Patel Tiles placed it from the dealer app" />
      </div>
    </div>
  )
}

/* ------------------------------------------------ Odoo: from the apps to a won deal to a posted invoice */

const ODOO_APPS: { label: string; icon: IconName; c: string }[] = [
  { label: 'CRM', icon: 'users', c: 'linear-gradient(135deg,#17a2b8,#0d7a8b)' },
  { label: 'Sales', icon: 'banknote', c: 'linear-gradient(135deg,#f0883e,#d9622b)' },
  { label: 'Inventory', icon: 'package', c: 'linear-gradient(135deg,#a05cc9,#7b3fa6)' },
  { label: 'Accounting', icon: 'calculator', c: 'linear-gradient(135deg,#2fb47c,#1d8a5d)' },
  { label: 'Manufacturing', icon: 'factory', c: 'linear-gradient(135deg,#4a7bd4,#2f56a6)' },
  { label: 'Purchase', icon: 'file', c: 'linear-gradient(135deg,#e05b8a,#b83a68)' },
  { label: 'Employees', icon: 'users', c: 'linear-gradient(135deg,#f2b43d,#d68f14)' },
  { label: 'Website', icon: 'globe', c: 'linear-gradient(135deg,#3cc3d6,#1f97a9)' },
]
const ODOO_COLS = [
  { t: 'New', cards: [['Mehta Polymers', 120000], ['Sunrise Foods', 64000]] },
  { t: 'Qualified', cards: [['Krishna Textiles', 210000]] },
  { t: 'Proposition', cards: [['Aakar Infra', 350000]] },
  { t: 'Won', cards: [['Om Logistics', 95000]] },
] as const
const ODOO_MS = [2200, 1800, 2000, 2200, 2400, 900] as const

export function Odoo({ live }: { live: boolean }) {
  const ph = usePhase(6, ODOO_MS, live, 3)
  const home = ph === 0 || ph === 5
  const won = ph >= 2
  return (
    <div className="flex h-full flex-col bg-[#f8f9fa]" style={accent('#714b67')}>
      <div className="flex h-10 items-center gap-3 bg-[#714b67] px-4 text-white">
        <span className="grid grid-cols-3 gap-[2px]">
          {Array.from({ length: 9 }, (_, k) => (
            <span key={k} className="size-[3px] rounded-full bg-white/80" />
          ))}
        </span>
        <span className="text-[12px] font-semibold">{home ? 'Odoo' : ph === 4 ? 'Invoicing' : 'CRM'}</span>
        {!home ? <span className="text-[10.5px] text-white/70">{ph === 4 ? 'Customer invoices' : 'Pipeline'}</span> : null}
        <span className="ml-auto grid size-6 place-items-center rounded-full bg-white/20 text-[9px] font-semibold">RS</span>
      </div>
      <div className="relative flex-1">
        {/* the apps */}
        <div className={cn('absolute inset-0 grid place-items-center bg-[radial-gradient(70%_80%_at_50%_0%,#f3edf2,#f8f9fa)] transition-opacity duration-500', home ? 'opacity-100' : 'pointer-events-none opacity-0')}>
          <div className="grid grid-cols-4 gap-x-9 gap-y-5">
            {ODOO_APPS.map((a, k) => (
              <span key={a.label} className="flex flex-col items-center gap-1.5">
                <span className={cn('grid size-[58px] place-items-center rounded-[14px] text-white shadow-[0_8px_18px_-8px_rgb(11_15_21/0.4)] transition-transform duration-300', k === 0 && ph === 0 && 'pl-press-late')} style={{ background: a.c }}>
                  <Icon name={a.icon} size={24} />
                </span>
                <span className="text-[10.5px] font-medium text-[#374151]">{a.label}</span>
              </span>
            ))}
          </div>
        </div>
        {/* the pipeline */}
        <div className={cn('absolute inset-0 p-4 transition-opacity duration-500', !home && ph < 4 ? 'opacity-100' : 'pointer-events-none opacity-0')}>
          <div className="grid h-full grid-cols-4 gap-3">
            {ODOO_COLS.map((c, k) => {
              const total = c.cards.reduce((t, x) => t + x[1], 0) + (k === 2 && !won ? 480000 : 0) + (k === 3 && won ? 480000 : 0)
              return (
                <div key={c.t}>
                  <p className="flex items-baseline justify-between text-[11px] font-semibold">
                    {c.t}
                    <span className="text-[9.5px] font-medium tabular-nums text-[#6b7280]">{inr(total)}</span>
                  </p>
                  <div className="mt-1.5 h-[3px] overflow-hidden rounded-full bg-[#e5e7eb]">
                    <div className="h-full bg-[#2fb47c] transition-[width] duration-700" style={{ width: `${Math.min(100, total / 6000)}%` }} />
                  </div>
                  <div className="mt-2.5 grid gap-2">
                    {c.cards.map(([n, v]) => (
                      <OppCard key={n} name={n} value={v} />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
          <div className="absolute top-[121px] w-[calc((100%-68px)/4)] transition-transform duration-[900ms] ease-[var(--ease-in-out)]" style={{ left: 16, transform: `translateX(calc(${won ? 3 : 2} * (100% + 12px)))` }}>
            <OppCard name="Shreeji Engineering" value={480000} lit stars={3} />
          </div>
        </div>
        {/* the invoice */}
        <div className={cn('absolute inset-0 grid place-items-center bg-[#f8f9fa] p-4 transition-opacity duration-500', ph === 4 ? 'opacity-100' : 'pointer-events-none opacity-0')}>
          <Card className="w-[440px] p-4">
            <div className="flex items-center justify-between">
              <p className="text-[15px] font-semibold">INV/2026/00412</p>
              <span className={cn('rounded-[6px] border-2 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em] transition-all duration-500', ph === 4 ? 'rotate-[-4deg] border-[#15803d] text-[#15803d]' : 'border-[#9ca3af] text-[#9ca3af]')}>
                Posted
              </span>
            </div>
            <p className="mt-1 text-[10.5px] text-[#6b7280]">Shreeji Engineering, Rajkot · from S00412</p>
            {[
              ['Hydraulic press 60T', 2, 200000],
              ['Installation & training', 1, 80000],
            ].map(([d, q, a]) => (
              <div key={d as string} className="mt-2 flex justify-between border-t border-[#f1f2f4] pt-2 text-[11px]">
                <span>
                  {d} × {q}
                </span>
                <span className="tabular-nums">{inr((q as number) * (a as number))}</span>
              </div>
            ))}
            <div className="mt-2 flex justify-between border-t-2 border-[#0b0f15] pt-2 text-[12px] font-semibold">
              <span>Total incl. GST</span>
              <span className="tabular-nums">{inr(566400)}</span>
            </div>
          </Card>
        </div>
        <Pointer x={ph === 0 ? 255 : ph === 1 ? 500 : 690} y={ph === 0 ? 172 : ph === 1 ? 150 : 165} press={ph === 0} />
        <Toast show={ph === 3} icon="check" tone="#714b67" title="Won · quotation S00412 confirmed" note="Sales order created, stock reserved" />
        <Toast show={ph === 4} icon="calculator" tone="#15803d" title="Invoice posted · ₹ 5,66,400" note="In the books, GST worked out" />
      </div>
    </div>
  )
}

function OppCard({ name, value, lit, stars = 2 }: { name: string; value: number; lit?: boolean; stars?: number }) {
  return (
    <div className={cn('rounded-[8px] bg-white p-2 shadow-[0_1px_2px_rgb(11_15_21/0.1)]', lit && 'shadow-[0_0_0_2px_#714b67,0_14px_26px_-14px_rgb(113_75_103/0.8)]')}>
      <p className="truncate text-[10.5px] font-semibold">{name}</p>
      <p className="text-[9.5px] tabular-nums text-[#6b7280]">{inr(value)}</p>
      <p className="mt-1 flex items-center justify-between">
        <span className="flex gap-[1px] text-[#f2b43d]">
          {Array.from({ length: 3 }, (_, k) => (
            <Icon key={k} name="star" size={9} className={k < stars ? '' : 'opacity-25'} />
          ))}
        </span>
        <span className="grid size-4 place-items-center rounded-full bg-[#ede5ec] text-[7px] font-bold text-[#714b67]">RS</span>
      </p>
    </div>
  )
}

/* ------------------------------------------------ Wedding rental: a booking made, offline, then synced */

const RN_MS = [1700, 1800, 1700, 1700, 1800, 2400, 900] as const

export function Rental({ live }: { live: boolean }) {
  const ph = usePhase(7, RN_MS, live, 5)
  const items = ph >= 2 && ph <= 5 ? (ph >= 3 ? 2 : 1) : 0
  const total = useTween(items === 2 ? 5250 : items === 1 ? 3500 : 0, 600)
  const fields = [
    ['Shop', 'Mahavir Ambaram'],
    ['Pickup', '12 Mar · 10:00'],
    ['Wedding', '13 Mar'],
    ['Return', '15 Mar · 18:00'],
  ]
  return (
    <div className="flex h-full bg-[#f6f7fb]" style={accent('#4f46e5')}>
      <Side
        className="border-r border-[#e7e9f2] bg-white"
        on={4}
        mark={
          <span className="flex items-center gap-2">
            <span className="grid size-7 place-items-center rounded-[8px] bg-[#4f46e5] text-[12px] font-bold text-white">W</span>
            <span className="text-[12px] font-semibold">Rental System</span>
          </span>
        }
        items={[
          { icon: 'layers', label: 'Dashboard' },
          { icon: 'package', label: 'Products' },
          { icon: 'star', label: 'Accessories' },
          { icon: 'file', label: 'Orders' },
          { icon: 'plus', label: 'Create order' },
          { icon: 'users', label: 'Customers' },
          { icon: 'building', label: 'Shops' },
        ]}
      />
      <div className="relative min-w-0 flex-1 p-4">
        <div className="flex items-center gap-2">
          <p className="text-[17px] font-semibold tracking-[-0.02em]">Create order</p>
          <Chip tone={ph >= 5 ? '#16a34a' : '#6b7280'}>{ph >= 5 ? 'Synced' : 'Offline · saved on this PC'}</Chip>
          <span className="ml-auto flex gap-1 text-[9.5px] font-semibold">
            <span className="rounded-full bg-[#4f46e5] px-2.5 py-1 text-white">1 Products</span>
            <span className="rounded-full bg-white px-2.5 py-1 text-[#6b7280] shadow-[0_0_0_1px_rgb(11_15_21/0.08)]">2 Review</span>
          </span>
        </div>
        <div className="mt-3 grid grid-cols-[1.35fr_1fr] gap-3">
          <div className="grid content-start gap-3">
            <Card className="p-3">
              <p className="text-[10.5px] font-semibold">Order details</p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {fields.map(([l, v], k) => (
                  <span key={l} className="rounded-[7px] border border-[#e7e9f2] px-2 py-1.5">
                    <span className="block text-[8.5px] font-semibold uppercase tracking-[0.06em] text-[#9ca3af]">{l}</span>
                    <span className={cn('block text-[10.5px] font-medium transition-opacity duration-500', ph >= (k < 2 ? 0 : 1) && ph < 6 ? 'opacity-100' : 'opacity-0')}>{v}</span>
                  </span>
                ))}
              </div>
              <div className={cn('mt-2 flex items-center gap-2 rounded-[8px] border px-2 py-1.5 transition-colors duration-500', ph >= 1 && ph < 6 ? 'border-[#c7d2fe] bg-[#eef2ff]' : 'border-[#e7e9f2]')}>
                <Icon name="users" size={12} className="text-[#4f46e5]" />
                <span className="text-[10.5px] font-medium">{ph >= 1 && ph < 6 ? 'Jayesh Vora · 98765 43210' : 'Find a customer…'}</span>
              </div>
            </Card>
            <Card className="p-3">
              <p className="text-[10.5px] font-semibold">Available for 12-15 Mar</p>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {[
                  ['Indo-western', '#1e2a5a', 'Free', 3500],
                  ['Sherwani', '#7c1d2a', 'Free', 4200],
                  ['Lehenga', '#c2417a', 'Booked 12-14', 6800],
                ].map(([n, c, s, p], k) => (
                  <span key={n as string} className={cn('rounded-[9px] border p-1.5 transition-shadow duration-500', k === 0 && items >= 1 ? 'border-[#4f46e5] shadow-[0_0_0_2px_#c7d2fe]' : 'border-[#eceef4]')}>
                    <span className="block h-12 rounded-[6px]" style={{ background: `linear-gradient(160deg, ${c}, color-mix(in oklab, ${c} 55%, #000))` }} />
                    <span className="mt-1 block text-[9.5px] font-semibold">{n}</span>
                    <span className="flex items-center justify-between text-[8.5px]">
                      <span className={k === 2 ? 'text-[#b91c1c]' : 'text-[#15803d]'}>{s}</span>
                      <span className="tabular-nums text-[#6b7280]">₹{num(p as number)}</span>
                    </span>
                  </span>
                ))}
              </div>
            </Card>
          </div>
          <Card className="overflow-hidden">
            <p className="flex items-center justify-between bg-[#4f46e5] px-3 py-2 text-[10.5px] font-semibold text-white">
              Order cart <span className="rounded-full bg-white/20 px-1.5 tabular-nums">{items}</span>
            </p>
            <div className="grid gap-1.5 p-3">
              {[
                ['Indo-western suit', 'Navy · size 40', 3500],
                ['Safa & mojari set', 'Accessories', 1750],
              ].map(([n, d, p], k) => (
                <div key={n as string} className={cn('flex items-center gap-2 rounded-[8px] bg-[#f6f7fb] p-1.5 transition-all duration-500', k < items ? 'opacity-100' : 'translate-x-3 opacity-0')}>
                  <span className="size-7 rounded-[6px]" style={{ background: k === 0 ? '#1e2a5a' : '#c08a2b' }} />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[10px] font-semibold">{n}</span>
                    <span className="block text-[8.5px] text-[#6b7280]">{d}</span>
                  </span>
                  <span className="text-[10px] font-semibold tabular-nums">₹{num(p as number)}</span>
                </div>
              ))}
              <div className="mt-1 flex gap-1">
                {['Cash', 'UPI', 'Bank'].map((m) => (
                  <span key={m} className={cn('flex-1 rounded-[6px] border py-1 text-center text-[9.5px] font-semibold transition-colors duration-500', (m === 'UPI' ? ph >= 4 && ph < 6 : m === 'Cash' && (ph < 4 || ph === 6)) ? 'border-[#4f46e5] bg-[#eef2ff] text-[#4f46e5]' : 'border-[#e7e9f2] text-[#6b7280]')}>
                    {m}
                  </span>
                ))}
              </div>
              <div className="flex justify-between border-t border-[#eceef4] pt-2 text-[10px] text-[#6b7280]">
                <span>Deposit</span>
                <span className="tabular-nums">₹ 2,000</span>
              </div>
              <div className="flex justify-between text-[12px] font-semibold">
                <span>Total</span>
                <span className="tabular-nums">{inr(total)}</span>
              </div>
            </div>
          </Card>
        </div>
        <Toast show={ph === 5} icon="check" tone="#4f46e5" title="Order RN-1093 created" note="Return due 15 Mar · synced when back online" />
      </div>
    </div>
  )
}
