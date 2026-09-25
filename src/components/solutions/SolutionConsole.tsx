import type { Solution } from '@/content/data'
import { MarkBlueprint } from '@/components/brand/MarkBlueprint'

/**
 * Hero figure for a solution: the product as a system window — its first features as
 * the navigation, its integrations as live connections.
 */
export function SolutionConsole({ s }: { s: Solution }) {
  const nav = s.features.items.slice(0, 5)
  const ints = s.overview.integrations.slice(0, 5)
  return (
    <div className="sol-console overflow-hidden rounded-[18px] border border-line bg-raise shadow-[var(--shadow-float)]">
      <div className="flex h-9 items-center gap-1.5 border-b border-line px-4">
        <span className="size-2 rounded-full bg-line-2" />
        <span className="size-2 rounded-full bg-line-2" />
        <span className="size-2 rounded-full bg-line-2" />
        <span className="t-label ml-3 truncate text-[0.62rem] text-ink-3">{s.productName}</span>
      </div>
      <div className="grid grid-cols-[minmax(0,1fr)] sm:grid-cols-[180px_minmax(0,1fr)]">
        <ul className="hidden border-r border-line py-3 sm:block">
          {nav.map((f, i) => (
            <li
              key={f.n}
              className={
                i === 0 ? 'mx-2 rounded-[8px] bg-ink px-3 py-2 text-[0.8rem] font-medium text-bg' : 'px-5 py-2 text-[0.8rem] text-ink-2'
              }
            >
              {f.title}
            </li>
          ))}
        </ul>
        <div className="relative min-w-0 p-4">
          <div className="absolute right-3 top-3 opacity-60">
            <MarkBlueprint filled showConstruction={false} className="w-10" />
          </div>
          <p className="t-label text-ink-3">Integrations</p>
          <ul className="mt-3 grid gap-2">
            {ints.map((it, i) => (
              <li
                key={it}
                className="sol-sync flex items-center gap-3 rounded-[8px] border border-line bg-bg px-3 py-2"
                style={{ ['--i' as string]: i }}
              >
                <span className="size-2 shrink-0 rounded-full bg-teal" />
                <span className="flex-1 truncate text-[0.82rem] font-medium">{it}</span>
                <span className="t-label text-[0.56rem] text-teal-ink">sync</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 grid grid-cols-1 gap-2 min-[420px]:grid-cols-3">
            {s.heroBullets.map((b) => (
              <p
                key={b}
                className="rounded-[8px] border border-dashed border-line-2 px-2 py-2 text-center text-[0.68rem] leading-tight text-ink-2"
              >
                {b}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
