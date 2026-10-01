import { ClientLogo } from '@/components/ui/ClientLogo'
import { ArrowLink } from '@/components/ui/KeyButton'
import { Eyebrow } from '@/components/ui/SectionHead'
import { about } from '@/content/about'
import { brands } from '@/content/home'

/**
 * The brands we build with, written out in capitals as one long sentence. Under the pointer
 * a name comes forward while the rest step back, and its own logo surfaces above it.
 */
export function BrandWall() {
  const n = about.networks
  const last = brands.items.length - 1
  return (
    <section id="networks" className="rails relative border-b border-line" aria-labelledby="networks-title">
      <div className="shell py-[clamp(72px,12vh,150px)]">
        <div className="grid gap-4 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Eyebrow>{n.eyebrow}</Eyebrow>
            <h2 id="networks-title" className="t-h3 mt-3">
              {n.title}
            </h2>
          </div>
          <p className="t-small text-ink-2 lg:col-span-4 lg:col-start-9 lg:text-right">{n.intro}</p>
        </div>

        <ul className="bw-list mt-[clamp(40px,8vh,96px)]">
          {brands.items.map((b, i) => (
            <li key={b.name} className="bw-item" data-reveal="rise" style={{ ['--d' as string]: `${i * 70}ms` }}>
              <span className="bw-name">{b.name}</span>
              <span className="bw-mark" aria-hidden>
                {i < last ? ',' : '…'}
              </span>
              <span className="bw-pop" aria-hidden>
                <ClientLogo name={b.name} ratio={1.9} decorative sizes="190px" />
                <span className="t-label text-ink-3">{b.category}</span>
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-[clamp(32px,6vh,64px)] flex justify-center">
          <ArrowLink href="/portfolio" tone="teal">
            {brands.cta}
          </ArrowLink>
        </div>
      </div>
    </section>
  )
}
