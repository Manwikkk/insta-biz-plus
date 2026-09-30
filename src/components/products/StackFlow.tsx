import { products } from '@/content/products'
import { Icon } from '@/components/ui/Icon'

/**
 * The four products as one pipeline, from first lead to closed deal: a rail with leads
 * travelling along it, and a station for each product (each one jumps to its section).
 */
export function StackFlow() {
  return (
    <div className="stack-flow relative">
      {/* the rail and the leads moving along it */}
      <div aria-hidden className="stack-rail">
        {[0, 1, 2].map((k) => (
          <span key={k} className="stack-lead" style={{ ['--k' as string]: k }} />
        ))}
      </div>
      <ol className="relative grid gap-4 lg:grid-cols-4 lg:gap-5">
        {products.map((p, i) => (
          <li key={p.id} data-reveal="rise" style={{ ['--d' as string]: `${i * 110}ms` }}>
            <a href={`#${p.id}`} className="stack-station group">
              <span className="stack-node" aria-hidden>
                <Icon name={p.icon} size={20} />
              </span>
              <span className="min-w-0">
                <span className="t-label block text-teal-ink">
                  {String(i + 1).padStart(2, '0')} · {p.step.verb}
                </span>
                <span className="mt-2 block font-display text-[clamp(1.5rem,2.2vw,1.9rem)] font-[720] leading-none tracking-[-0.03em]">
                  {p.name}
                </span>
                <span className="mt-2.5 block text-[0.95rem] leading-snug text-ink-2">{p.step.line}</span>
                <span className="mt-4 inline-flex items-center gap-1.5 text-[0.88rem] font-medium text-ink">
                  <span className="link-draw">See {p.name}</span>
                  <Icon name="arrow-down" size={14} className="transition-transform duration-500 group-hover:translate-y-0.5" />
                </span>
              </span>
            </a>
          </li>
        ))}
      </ol>
    </div>
  )
}
