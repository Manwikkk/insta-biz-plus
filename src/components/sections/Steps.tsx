import { cn } from '@/lib/cn'

export type Step = { n: string; title: string; body: string; when?: string; outputs?: string[] }

/**
 * Numbered steps on a vertical rail. Timeframes read as dimension marks in the
 * margin; outputs are listed as deliverable tags.
 */
export function Steps({ steps, className }: { steps: Step[]; className?: string }) {
  const timed = steps.some((s) => s.when)
  return (
    <ol className={cn('relative', className)}>
      {steps.map((s, i) => (
        <li
          key={s.n + s.title}
          className={cn(
            'group relative grid gap-4 border-t border-line py-8 last:border-b sm:grid-cols-[88px_1fr] lg:gap-8',
            timed ? 'lg:grid-cols-[180px_88px_1fr_1fr]' : 'lg:grid-cols-[88px_1fr_1.2fr]',
          )}
          data-reveal="rise"
          style={{ ['--d' as string]: `${i * 70}ms` }}
        >
          {timed ? (
            <p className="t-label hidden items-start text-ink-3 lg:flex">
              {s.when ? (
                <span className="flex w-full items-center gap-2">
                  <span className="h-3 w-px bg-line-2" />
                  <span className="whitespace-nowrap text-ink-2">{s.when}</span>
                  <span className="h-px flex-1 bg-line-2" />
                </span>
              ) : null}
            </p>
          ) : null}
          <p className="t-numeral text-[2.6rem] text-ink transition-colors duration-500 group-hover:text-teal-ink">
            {s.n}
          </p>
          <div>
            {s.when ? <p className="t-label mb-2 text-teal-ink lg:hidden">{s.when}</p> : null}
            <h3 className="t-h3">{s.title}</h3>
          </div>
          <div className="sm:col-start-2 lg:col-start-auto">
            <p className="t-body">{s.body}</p>
            {s.outputs?.length ? (
              <ul className="mt-4 flex flex-wrap gap-1.5">
                {s.outputs.map((o) => (
                  <li key={o} className="tag">
                    {o}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  )
}
