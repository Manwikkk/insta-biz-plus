import { Eyebrow } from '@/components/ui/SectionHead'
import { SplitReveal } from '@/components/motion/SplitReveal'

type Statement = { label: string; title: string; body: string }

/** Keeps hyphenated words (Owner-minded) whole when a headline wraps. */
function keepHyphens(text: string) {
  return text.split(/(\S+-\S+)/).map((part, i) =>
    /\S+-\S+/.test(part) ? (
      <span key={i} className="whitespace-nowrap">
        {part}
      </span>
    ) : (
      part
    ),
  )
}

/**
 * Mission, vision and values on one board: the three statements side by side, the
 * principles along its foot. Everything reads in a single view.
 */
export function Manifesto({
  eyebrow,
  title,
  items,
  principles,
}: {
  eyebrow: string
  title: string
  items: Statement[]
  principles: string[]
}) {
  return (
    <section className="rails relative border-b border-line py-[clamp(40px,7.4vh,110px)]" id="drives">
      <div className="shell">
        <Eyebrow>{eyebrow}</Eyebrow>
        <SplitReveal as="h2" className="t-h2 mt-[clamp(10px,2vh,18px)]">
          {title}
        </SplitReveal>

        <div className="mt-[clamp(20px,4vh,44px)] overflow-hidden rounded-[22px] border border-line">
          <ol className="grid gap-px bg-line lg:grid-cols-3">
            {items.map((it, k) => (
              <li
                key={it.label}
                className="drive-cell group relative bg-bg p-[clamp(18px,3.2vh,32px)]"
                data-reveal="rise"
                style={{ ['--d' as string]: `${k * 110}ms` }}
              >
                <p className="eyebrow t-label">
                  <span className="eyebrow-n">{String(k + 1).padStart(2, '0')}</span>
                  <span className="text-teal-ink">{it.label}</span>
                </p>
                <h3 className="mt-[clamp(12px,2.4vh,22px)] max-w-[21ch] font-display text-[clamp(1.4rem,min(2.2vw,4.1vh),2.1rem)] font-[700] leading-[1.06] tracking-[-0.03em]">
                  {keepHyphens(it.title)}
                </h3>
                <p className="mt-[clamp(8px,1.6vh,14px)] text-[0.95rem] leading-[1.58] text-ink-2">{it.body}</p>
              </li>
            ))}
          </ol>
          <ul className="grid grid-cols-2 gap-px border-t border-line bg-line lg:grid-cols-4" aria-label="Principles">
            {principles.map((p, k) => (
              <li
                key={p}
                className="flex items-center gap-2.5 bg-raise px-[clamp(16px,1.6vw,24px)] py-[clamp(12px,2.2vh,18px)] text-[0.95rem] font-semibold tracking-[-0.01em]"
                data-reveal="rise"
                style={{ ['--d' as string]: `${320 + k * 70}ms` }}
              >
                <span className="size-1.5 shrink-0 rounded-full bg-teal" aria-hidden />
                {p}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
