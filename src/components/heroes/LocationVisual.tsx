'use client'

import { HeroWindow, LiveTag } from './HeroWindow'
import { useCycle } from './useCycle'
import { Icon, type IconName } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'

/** The office line under every Ahmedabad hero figure. */
function Place({ note }: { note: string }) {
  return (
    <div className="mt-3 flex flex-wrap items-center justify-between gap-2 px-1">
      <p className="t-label flex items-center gap-1.5 text-ink-2">
        <Icon name="pin" size={13} className="text-teal-ink" />
        Naranpura, Ahmedabad
      </p>
      <p className="t-label text-ink-3">{note}</p>
    </div>
  )
}

/* ------------------------------------------------ web development */
/** A site assembling itself: wireframe → content → brand → live, ending on its Lighthouse score. */
function WebBuild() {
  const { ref, i: phase } = useCycle<HTMLDivElement>(4, 1600)
  // one fill per block and phase, so no two background utilities ever compete
  const block = (on: boolean, fill: 'line' | 'ink' | 'teal' = 'line') =>
    cn(
      'build-wire rounded-[4px] border',
      !on
        ? 'border-dashed border-line-2 bg-transparent'
        : phase >= 2 && fill === 'teal'
          ? 'border-transparent bg-teal'
          : phase >= 2 && fill === 'ink'
            ? 'border-transparent bg-ink'
            : 'border-transparent bg-line-2',
    )
  const score = phase === 3 ? 96 : phase * 22
  return (
    <div ref={ref}>
      <HeroWindow title="yourbrand.in" right={<LiveTag label={phase === 3 ? 'Live' : 'Building'} />}>
        <div className="p-4 sm:p-5">
          <div className="rounded-[12px] border border-line bg-bg p-3.5">
            <div className="flex items-center gap-2">
              <span className={cn(block(phase >= 1, 'teal'), 'h-3 w-12')} />
              <span className="ml-auto flex gap-1.5">
                {[0, 1, 2].map((k) => (
                  <span key={k} className={cn(block(phase >= 1), 'h-2 w-8')} />
                ))}
              </span>
              <span className={cn(block(phase >= 1, 'teal'), 'h-5 w-14')} />
            </div>
            <div className="mt-4 grid grid-cols-[1.2fr_1fr] gap-3">
              <div className="grid content-start gap-2">
                <span className={cn(block(phase >= 1, 'ink'), 'h-4 w-[90%]')} />
                <span className={cn(block(phase >= 1, 'ink'), 'h-4 w-[70%]')} />
                <span className={cn(block(phase >= 1), 'mt-1 h-2 w-full')} />
                <span className={cn(block(phase >= 1), 'h-2 w-[85%]')} />
                <span className={cn(block(phase >= 1, 'teal'), 'mt-2 h-6 w-24')} />
              </div>
              <div
                className={cn(
                  'build-wire aspect-[4/3] rounded-[8px] border',
                  phase === 0 ? 'border-dashed border-line-2' : phase === 1 ? 'border-transparent bg-sink' : 'border-transparent bg-[linear-gradient(135deg,var(--teal-soft),var(--navy))] opacity-90',
                )}
              />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {[0, 1, 2].map((k) => (
                <div key={k} className={cn('build-wire grid gap-1.5 rounded-[8px] border p-2', phase >= 1 ? 'border-line bg-raise' : 'border-dashed border-line-2')}>
                  <span className={cn(block(phase >= 1, k === 0 ? 'teal' : 'line'), 'h-5 w-5')} />
                  <span className={cn(block(phase >= 1), 'h-1.5 w-full')} />
                  <span className={cn(block(phase >= 1), 'h-1.5 w-2/3')} />
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 flex items-center gap-4">
            <div className="relative size-[64px] shrink-0">
              <svg viewBox="0 0 36 36" className="size-full -rotate-90" aria-hidden>
                <circle cx="18" cy="18" r="15.5" fill="none" stroke="var(--line-2)" strokeWidth="3" />
                <circle
                  cx="18"
                  cy="18"
                  r="15.5"
                  fill="none"
                  stroke="var(--teal)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  pathLength={100}
                  strokeDasharray={`${score} 100`}
                  className="transition-[stroke-dasharray] duration-1000 ease-[var(--ease-out)]"
                />
              </svg>
              <span className="t-numeral absolute inset-0 grid place-items-center text-[1.05rem]">{phase === 3 ? '95+' : score}</span>
            </div>
            <div className="min-w-0">
              <p className="t-label text-ink-3">Lighthouse · on first deploy</p>
              <ul className="mt-2 flex flex-wrap gap-1.5">
                {['SEO-ready', 'Core Web Vitals', 'Mobile-first'].map((t, k) => (
                  <li key={t} className={cn('tag h-6 text-[0.6rem] transition-opacity duration-500', phase >= 2 + (k > 0 ? 1 : 0) ? 'opacity-100' : 'opacity-35')}>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </HeroWindow>
      <Place note="Next.js · React · WordPress · Shopify" />
    </div>
  )
}

/* ------------------------------------------------ software development */
const CODE: Array<Array<[string, string?]>> = [
  [['export async function ', 'k'], ['createOrder', 'f'], ['(req) {']],
  [['  const ', 'k'], ['order = '], ['await ', 'k'], ['db.orders.'], ['create', 'f'], ['(req.body)']],
  [['  await ', 'k'], ['notify.'], ['whatsapp', 'f'], ['(order.customer, '], ["'Order confirmed'", 's'], [')']],
  [['  return ', 'k'], ['ok', 'f'], ['(order)']],
  [['}']],
]
const PIPE = ['Build', 'Test', 'Deploy']

/** An API being written line by line, then built, tested and shipped. */
function CodePipeline() {
  const { ref, i } = useCycle<HTMLDivElement>(CODE.length + PIPE.length + 1, 850)
  const typed = Math.min(i + 1, CODE.length)
  const stage = i - CODE.length // -n … 3
  const tone = (t?: string) => (t === 'k' ? 'text-teal-ink' : t === 'f' ? 'text-navy dark:text-[#7ea8e6]' : t === 's' ? 'text-ember' : 'text-ink-2')
  return (
    <div ref={ref}>
      <HeroWindow title="api / orders.ts" right={<LiveTag label={stage >= PIPE.length ? 'Shipped' : 'Coding'} />}>
        <div className="grid grid-cols-[28px_minmax(0,1fr)] gap-x-3 px-4 py-4 font-mono text-[0.74rem] leading-[1.9] sm:px-5">
          {CODE.map((line, k) => (
            <div key={k} className="contents">
              <span className="select-none text-right text-ink-3">{k + 1}</span>
              <span className={cn('code-line whitespace-pre', k < typed && 'is-typed')}>
                {line.map(([text, t], j) => (
                  <span key={j} className={tone(t)}>
                    {text}
                  </span>
                ))}
              </span>
            </div>
          ))}
        </div>
        <div className="border-t border-line px-4 py-3.5 sm:px-5">
          <ol className="flex items-center gap-2">
            {PIPE.map((p, k) => {
              const done = stage > k
              const run = stage === k
              return (
                <li key={p} className="flex flex-1 items-center gap-2">
                  <span
                    className={cn(
                      'grid size-6 shrink-0 place-items-center rounded-full border transition-colors duration-500',
                      done ? 'border-teal bg-teal text-[#04161a]' : run ? 'border-teal text-teal-ink' : 'border-line-2 text-ink-3',
                    )}
                  >
                    {done ? <Icon name="check" size={13} strokeWidth={2.4} /> : run ? <span className="size-2 animate-pulse rounded-full bg-teal" /> : <span className="size-1.5 rounded-full bg-line-2" />}
                  </span>
                  <span className={cn('text-[0.82rem] font-medium', done || run ? 'text-ink' : 'text-ink-3')}>{p}</span>
                  {k < PIPE.length - 1 ? <span className={cn('h-px flex-1 transition-colors duration-500', done ? 'bg-teal' : 'bg-line-2')} /> : null}
                </li>
              )
            })}
          </ol>
          <p className={cn('t-label mt-3 flex items-center gap-2 transition-opacity duration-500', stage >= PIPE.length ? 'text-teal-ink opacity-100' : 'text-ink-3 opacity-50')}>
            <Icon name="check" size={12} strokeWidth={2.4} />
            Deployed to production · tests passing
          </p>
        </div>
      </HeroWindow>
      <Place note="Custom software · APIs · SaaS" />
    </div>
  )
}

/* ------------------------------------------------ mobile apps */
/** An app in hand: onboarding, the home feed with a push, and an order confirmed. */
function AppScreens() {
  const { ref, i } = useCycle<HTMLDivElement>(3, 2300)
  return (
    <div ref={ref}>
      <div className="relative grid overflow-hidden rounded-[18px] border border-line bg-raise p-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-6">
        <span className="dot-grid opacity-50" aria-hidden />
        <div className="relative mx-auto h-[330px] w-[176px] rounded-[30px] border border-line-2 bg-bg p-2 shadow-[var(--shadow-float)] sm:order-2">
          <div className="absolute left-1/2 top-2 z-20 h-4 w-14 -translate-x-1/2 rounded-full bg-ink" />
          <div className="relative h-full overflow-hidden rounded-[23px] bg-sink">
            <div className="flex h-full transition-transform duration-700 ease-[var(--ease-out)]" style={{ transform: `translateX(${-i * 100}%)` }}>
              {/* onboarding */}
              <div className="flex h-full w-full shrink-0 flex-col items-center justify-center gap-3 px-4 text-center">
                <span className="grid size-12 place-items-center rounded-[14px] bg-teal text-[#04161a]">
                  <Icon name="sparkles" size={22} />
                </span>
                <p className="text-[0.85rem] font-semibold">Welcome</p>
                <span className="h-1.5 w-24 rounded bg-line-2" />
                <span className="h-1.5 w-16 rounded bg-line-2" />
                <span className="mt-2 grid h-8 w-28 place-items-center rounded-full bg-ink text-[0.66rem] font-semibold text-bg">Get started</span>
              </div>
              {/* home */}
              <div className="grid h-full w-full shrink-0 content-start gap-2 px-3 pt-9">
                <span className="h-16 rounded-[12px] bg-[linear-gradient(135deg,var(--teal),var(--navy))]" />
                <div className="grid grid-cols-2 gap-2">
                  {[0, 1, 2, 3].map((k) => (
                    <span key={k} className="h-14 rounded-[10px] bg-raise" />
                  ))}
                </div>
                <span className="h-9 rounded-[10px] bg-raise" />
              </div>
              {/* order confirmed */}
              <div className="flex h-full w-full shrink-0 flex-col items-center justify-center gap-3 px-4 text-center">
                <span className="grid size-12 place-items-center rounded-full bg-teal text-[#04161a]">
                  <Icon name="check" size={22} strokeWidth={2.4} />
                </span>
                <p className="text-[0.85rem] font-semibold">Order confirmed</p>
                <span className="h-1.5 w-20 rounded bg-line-2" />
              </div>
            </div>
            <div
              className={cn(
                'absolute inset-x-2 top-8 z-10 rounded-[12px] border border-line bg-raise/95 p-2 shadow-lg backdrop-blur transition-[transform,opacity] duration-700 ease-[var(--ease-out)]',
                i === 1 ? 'translate-y-0 opacity-100' : '-translate-y-[140%] opacity-0',
              )}
            >
              <p className="t-label text-[0.5rem] text-teal-ink">Push · just now</p>
              <p className="text-[0.66rem] leading-snug">Your order is on its way</p>
            </div>
          </div>
        </div>
        <ul className="relative mt-5 grid content-center gap-2 sm:order-1 sm:mt-0">
          {[
            ['smartphone', 'iOS + Android', 'Flutter · React Native · Swift'],
            ['users', '10K+ downloads', 'Across our shipped apps'],
            ['check', 'Store launch', 'Play Store + App Store support'],
          ].map(([icon, title, note], k) => (
            <li
              key={title}
              className={cn('flex items-center gap-3 rounded-[12px] border px-3 py-2.5 transition-colors duration-500', i === k ? 'border-teal/50 bg-teal-soft' : 'border-line bg-bg')}
            >
              <span className="grid size-8 shrink-0 place-items-center rounded-[9px] border border-line bg-raise text-teal-ink">
                <Icon name={icon as IconName} size={15} />
              </span>
              <span className="min-w-0">
                <span className="block text-[0.86rem] font-semibold">{title}</span>
                <span className="t-small block truncate text-[0.74rem]">{note}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
      <Place note="iOS · Android · cross-platform" />
    </div>
  )
}

/* ------------------------------------------------ Odoo */
const MODULES: Array<[string, IconName]> = [
  ['CRM', 'database'],
  ['Sales', 'banknote'],
  ['Inventory', 'package'],
  ['Accounting', 'calculator'],
  ['Purchase', 'layers'],
  ['Manufacturing', 'factory'],
  ['Employees', 'users'],
  ['Website', 'browser'],
]

/** Odoo going live: each app installed and configured in turn, the go-live bar filling. */
function OdooModules() {
  const { ref, i } = useCycle<HTMLDivElement>(MODULES.length + 2, 750)
  const done = Math.min(i, MODULES.length)
  const pct = Math.round((done / MODULES.length) * 100)
  return (
    <div ref={ref}>
      <HeroWindow title="Odoo · go-live plan" right={<LiveTag label={pct === 100 ? 'Live' : 'Configuring'} />}>
        <div className="grid grid-cols-4 gap-2 p-4 sm:p-5">
          {MODULES.map(([name, icon], k) => (
            <div
              key={name}
              className={cn(
                'flex flex-col items-center gap-1.5 rounded-[12px] border px-1 py-3 text-center transition-[background-color,border-color,opacity] duration-500',
                k < done ? 'border-line bg-bg' : k === done ? 'border-teal/60 bg-teal-soft' : 'border-dashed border-line-2 opacity-55',
              )}
            >
              <span className={cn('grid size-9 place-items-center rounded-[10px] transition-colors duration-500', k < done ? 'bg-ink text-bg' : 'bg-raise text-ink-3')}>
                <Icon name={icon} size={17} />
              </span>
              <span className="w-full truncate text-[0.7rem] font-medium">{name}</span>
              <span className={cn('t-label text-[0.5rem]', k < done ? 'text-teal-ink' : 'text-ink-3')}>{k < done ? 'Ready' : k === done ? 'Setting up' : 'Planned'}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-line px-4 py-3.5 sm:px-5">
          <div className="flex items-baseline justify-between">
            <p className="t-label text-ink-3">Go-live</p>
            <p className="t-numeral text-[1.05rem]">{pct}%</p>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-sink">
            <div className="h-full rounded-full bg-teal transition-[width] duration-700 ease-[var(--ease-out)]" style={{ width: `${pct}%` }} />
          </div>
          <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
            {[
              ['Data migrated', 50],
              ['Workflows mapped', 75],
              ['Team trained', 100],
            ].map(([t, at]) => (
              <li key={t} className={cn('t-label flex items-center gap-1.5 transition-colors duration-500', pct >= Number(at) ? 'text-teal-ink' : 'text-ink-3')}>
                <Icon name="check" size={11} strokeWidth={2.4} />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </HeroWindow>
      <Place note="Odoo Community & Enterprise" />
    </div>
  )
}

const BY_SLUG: Record<string, () => React.JSX.Element> = {
  'web-development-company-in-ahmedabad': WebBuild,
  'software-development-company-in-ahmedabad': CodePipeline,
  'mobile-app-development-company-in-ahmedabad': AppScreens,
  'odoo-implementation-company-in-ahmedabad': OdooModules,
}

/** Hero figure for the Ahmedabad pages: the service the page is about, shown working. */
export function LocationVisual({ slug }: { slug: string }) {
  const Visual = BY_SLUG[slug] ?? WebBuild
  return <Visual />
}
