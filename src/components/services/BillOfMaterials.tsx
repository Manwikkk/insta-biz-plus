import { services } from '@/content/services'
import { MarkBlueprint } from '@/components/brand/MarkBlueprint'

/** Hero figure for /services: the engine's parts list, like the title block of a drawing. */
export function BillOfMaterials() {
  return (
    <div className="relative overflow-hidden rounded-[18px] border border-line bg-raise">
      <div className="flex items-center justify-between border-b border-line px-5 py-3">
        <span className="t-label text-ink-3">Bill of materials</span>
        <span className="t-label text-ink-3">IBW · rev. 2026</span>
      </div>
      <div className="relative grid grid-cols-[1fr_auto]">
        <ul className="divide-y divide-line">
          {services.map((s) => (
            <li key={s.id}>
              <a href={`#${s.id}`} className="group flex items-center gap-4 px-5 py-3 transition-colors hover:bg-bg">
                <span className="t-label w-6 text-teal-ink">{s.n}</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[0.98rem] font-semibold tracking-[-0.01em]">{s.label}</span>
                  <span className="t-label mt-0.5 block truncate text-[0.62rem] text-ink-3 transition-colors group-hover:text-ink-2">
                    {s.avg.value} · {s.avg.label}
                  </span>
                </span>
                <span className="text-ink-3 transition-transform duration-500 group-hover:translate-y-0.5 group-hover:text-ink" aria-hidden>
                  ↓
                </span>
              </a>
            </li>
          ))}
        </ul>
        <div className="hidden w-[150px] place-items-center border-l border-line sm:grid">
          <MarkBlueprint filled className="w-[120px] text-ink-3" exploded={0.55} showConstruction={false} />
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-line px-5 py-3">
        <span className="t-label text-ink-3">5 parts · 1 accountable team</span>
        <span className="t-label text-ink-3">Avg. results</span>
      </div>
    </div>
  )
}
