import { Eyebrow } from '@/components/ui/SectionHead'
import { SplitReveal } from '@/components/motion/SplitReveal'
import { about } from '@/content/about'

const pad = (n: number) => String(n).padStart(2, '0')

/** Keeps hyphenated words (Owner-minded) whole when a statement wraps. */
const keepHyphens = (text: string) =>
  text.split(/(\S+-\S+)/).map((part, i) =>
    i % 2 ? (
      <span key={i} className="whitespace-nowrap">
        {part}
      </span>
    ) : (
      part
    ),
  )

/**
 * Mission, vision and values as three wide rows, each statement set large with its reasoning
 * beside it. Then the principles, set in big capitals: what we choose stays, and a line is
 * struck through what we choose it over. Point at one and it comes forward: a marker runs
 * under the word we keep, and the word we pass over drops away under a red line.
 */
export function Drives() {
  const d = about.drives
  return (
    <section id="drives" className="rails relative border-b border-line">
      <div className="shell py-[clamp(72px,12vh,150px)]">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <Eyebrow>{d.eyebrow}</Eyebrow>
            <SplitReveal className="t-h2 mt-[clamp(10px,2vh,18px)]">{d.title}</SplitReveal>
          </div>
        </div>

        <ol className="mt-[clamp(32px,6vh,64px)] border-b border-line">
          {d.items.map((it, k) => (
            <li key={it.label} className="dv-row group" data-reveal="rise" style={{ ['--d' as string]: `${k * 90}ms` }}>
              <p className="t-label flex items-center gap-3 lg:col-span-2">
                <span className="dv-n">{pad(k + 1)}</span>
                <span className="text-teal-ink">{it.label}</span>
              </p>
              <h3 className="dv-title lg:col-span-6">{keepHyphens(it.title)}</h3>
              <p className="t-body lg:col-span-4 lg:pt-2">{it.body}</p>
            </li>
          ))}
        </ol>

        <div className="mt-[clamp(64px,12vh,140px)] text-center">
          <p className="t-label text-ink-3">
            <span aria-hidden>( </span>The principles we live by<span aria-hidden> )</span>
          </p>
          <ul className="dv-principles mt-[clamp(18px,3.6vh,36px)]" data-reveal="rise">
            {d.principles.map((p, i) => {
              const [keep, drop] = p.split(' over ')
              return (
                <li key={p} style={{ ['--i' as string]: i }}>
                  <span className="dv-keep">{keep}</span> <span className="dv-over">over</span> <span className="dv-drop">{drop}</span>
                  {i < d.principles.length - 1 ? ',' : '.'}
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}
