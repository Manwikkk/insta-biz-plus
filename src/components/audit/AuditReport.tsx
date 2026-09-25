import { audit } from '@/content/audit'

/**
 * Hero figure for /audit: the report being reviewed. A scan line passes down the
 * 13-point checklist and each check is marked as reviewed — no invented scores.
 */
export function AuditReport() {
  const checks = audit.checks.items.slice(0, 8)
  return (
    <div className="audit-report relative overflow-hidden rounded-[18px] border border-line bg-raise shadow-[var(--shadow-float)]">
      <div className="flex items-center justify-between border-b border-line px-5 py-3">
        <span className="t-label text-ink-3">Website audit · personalised report</span>
        <span className="t-label text-teal-ink">13 checks</span>
      </div>
      <div className="relative">
        <span
          className="audit-scan pointer-events-none absolute inset-x-0 h-16 bg-gradient-to-b from-transparent via-teal/15 to-transparent"
          aria-hidden
        />
        <ol className="divide-y divide-line">
          {checks.map((c, i) => (
            <li key={c.title} className="audit-row flex items-center gap-4 px-5 py-3" style={{ ['--i' as string]: i }}>
              <span className="t-label w-6 text-ink-3">{String(i + 1).padStart(2, '0')}</span>
              <span className="flex-1 text-[0.92rem] font-medium">{c.title}</span>
              <span className="audit-tick t-label flex items-center gap-1.5 text-[0.6rem] text-teal-ink">
                <span className="size-1.5 rounded-full bg-teal" /> reviewed
              </span>
            </li>
          ))}
          <li className="px-5 py-3 text-[0.85rem] text-ink-3">+ {audit.checks.items.length - checks.length} more checks</li>
        </ol>
      </div>
      <div className="grid grid-cols-2 border-t border-line">
        <div className="border-r border-line px-5 py-4">
          <p className="t-label text-ink-3">Delivered</p>
          <p className="mt-1 t-numeral text-[1.5rem]">24 hrs</p>
        </div>
        <div className="px-5 py-4">
          <p className="t-label text-ink-3">Reviewed by</p>
          <p className="mt-1 text-[0.95rem] font-semibold">a senior engineer</p>
        </div>
      </div>
    </div>
  )
}
