import Link from 'next/link'
import type { LegalBlock, LegalPage } from '@/content/data'
import { Breadcrumbs } from '@/components/sections/PageHero'
import { Markdownish } from '@/components/ui/Markdownish'
import { Icon } from '@/components/ui/Icon'
import { site } from '@/content/site'

/** Cloudflare's email obfuscation leaked into the extracted text; restore the real address. */
const clean = (t: string) => t.replace(/\[email(?:&#160;|\s)protected\]/g, site.email)

function Block({ b }: { b: LegalBlock }) {
  switch (b.type) {
    case 'p':
      return (
        <p className="text-[1.03rem] leading-[1.75] text-ink-2">
          <Markdownish text={clean(b.text)} />
        </p>
      )
    case 'h3':
      return <h3 className="t-h4 mt-4">{b.text}</h3>
    case 'list':
      return (
        <ul className="grid gap-2.5">
          {b.items.map((it) => (
            <li key={it} className="flex gap-3 text-[1rem] leading-relaxed text-ink-2">
              <span className="mt-[0.62em] size-[7px] shrink-0 bg-teal [clip-path:polygon(50%_0,100%_25%,100%_75%,50%_100%,0_75%,0_25%)]" />
              <span>
                <Markdownish text={clean(it)} />
              </span>
            </li>
          ))}
        </ul>
      )
    case 'checks':
      return (
        <ul className="grid gap-2.5 sm:grid-cols-2">
          {b.items.map((it) => (
            <li key={it} className="flex gap-3 rounded-[10px] border border-line bg-raise p-4 text-[0.95rem] text-ink-2">
              <Icon name="check" size={16} strokeWidth={2} className="mt-[3px] shrink-0 text-teal-ink" />
              {it}
            </li>
          ))}
        </ul>
      )
    case 'numbered':
      return (
        <ol className="grid gap-3">
          {b.items.map((it) => (
            <li key={it.n} className="grid grid-cols-[40px_1fr] gap-3 border-b border-line pb-3 last:border-b-0">
              <span className="t-label pt-1 text-teal-ink">{it.n.padStart(2, '0')}</span>
              <span>
                <span className="block font-semibold text-ink">{it.title}</span>
                <span className="mt-1 block text-[0.97rem] text-ink-2">
                  <Markdownish text={clean(it.body)} />
                </span>
              </span>
            </li>
          ))}
        </ol>
      )
    case 'terms':
    case 'kv':
      return (
        <dl className="overflow-hidden rounded-[12px] border border-line">
          {b.items.map((it) => (
            <div key={it.term} className="grid gap-1 border-b border-line px-5 py-3.5 last:border-b-0 sm:grid-cols-[200px_1fr] sm:gap-6">
              <dt className="font-semibold text-ink">{it.term}</dt>
              <dd className="text-[0.97rem] text-ink-2">
                <Markdownish text={clean(it.def)} />
              </dd>
            </div>
          ))}
        </dl>
      )
  }
}

/** A policy page laid out like a document: numbered sections, a sticky index, related policies. */
export function LegalDoc({ doc }: { doc: LegalPage }) {
  return (
    <>
      <header className="rails relative overflow-hidden border-b border-line">
        <div aria-hidden className="absolute inset-0 [mask-image:radial-gradient(70%_80%_at_85%_0%,#000,transparent_70%)]">
          <div className="iso-grid" />
        </div>
        <div className="shell relative pb-14 pt-[120px] lg:pt-[152px]">
          <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: doc.h1 }]} className="enter-fade" />
          <p className="enter-fade mt-10 inline-flex h-6 items-center rounded-[4px] bg-ink px-2 font-label text-[0.62rem] font-medium uppercase tracking-[0.08em] text-bg">
            {doc.eyebrow}
          </p>
          <h1 className="mt-6 font-display text-[clamp(2.6rem,5.6vw,5.2rem)] font-[760] leading-[0.95] tracking-[-0.042em] [font-stretch:108%]">
            <span className="enter-line">
              <span style={{ ['--d' as string]: '100ms' }}>{doc.h1}</span>
            </span>
          </h1>
          <p className="enter-fade t-lede mt-6 max-w-2xl" style={{ ['--d' as string]: '260ms' }}>
            {doc.intro}
          </p>
          {doc.updated ? (
            <p className="enter-fade t-label mt-6 text-ink-3" style={{ ['--d' as string]: '320ms' }}>
              {doc.updated}
            </p>
          ) : null}
        </div>
      </header>

      <div className="rails">
        <div className="shell grid gap-12 py-16 lg:grid-cols-12 lg:py-24">
          <nav aria-label="Sections" className="hidden lg:col-span-3 lg:block">
            <div className="sticky top-28">
              <p className="t-label text-ink-3">Contents</p>
              <ol className="mt-4 grid gap-1 border-l border-line-2 pl-4">
                {doc.sections.map((s) => (
                  <li key={s.n}>
                    <a href={`#s-${s.n}`} className="flex gap-3 py-1 text-[0.9rem] text-ink-2 transition-colors hover:text-ink">
                      <span className="t-label w-5 pt-[2px] text-[0.62rem] text-ink-3">{s.n}</span>
                      {s.title}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </nav>
          <div className="min-w-0 lg:col-span-8 lg:col-start-5">
            {doc.sections.map((s) => (
              <section key={s.n} id={`s-${s.n}`} className="scroll-mt-28 border-t border-line py-10 first:border-t-0 first:pt-0">
                <h2 className="flex items-baseline gap-4">
                  <span className="t-label text-teal-ink">{s.n}</span>
                  <span className="t-h3">{s.title}</span>
                </h2>
                <div className="mt-6 grid gap-5">
                  {s.blocks.map((b, i) => (
                    <Block key={i} b={b} />
                  ))}
                </div>
              </section>
            ))}
            <div className="mt-8 rounded-[16px] border border-line bg-raise p-6">
              <p className="t-label text-ink-3">Related</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {doc.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="group inline-flex items-center gap-2 rounded-[9px] border border-line-2 px-4 py-2 text-[0.92rem] font-medium hover:border-ink"
                    >
                      {l.label}
                      <Icon name="arrow" size={14} className="transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
