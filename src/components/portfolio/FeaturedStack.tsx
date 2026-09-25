import Image from 'next/image'
import { featured, projects } from '@/content/portfolio'
import { media } from '@/content/site'

/** Hero figure: the four featured builds as a stack of prints; hover fans them out. */
export function FeaturedStack() {
  const items = featured.map((f) => ({ ...f, p: projects.find((p) => p.name === f.name)! })).filter((x) => x.p)
  return (
    <div className="stack group/stack relative mx-auto aspect-[5/4] w-full max-w-[520px]" aria-label="Featured projects">
      {items.map((it, i) => (
        <figure
          key={it.name}
          className="stack-card absolute inset-x-[6%] top-[8%] overflow-hidden rounded-[14px] border border-line bg-raise shadow-[var(--shadow-float)]"
          style={{ ['--i' as string]: i, zIndex: items.length - i }}
        >
          <div className="relative aspect-[16/10]">
            <Image
              src={media(it.p.image)}
              alt={`${it.p.name} - ${it.p.category}`}
              fill
              sizes="(min-width: 1024px) 460px, 90vw"
              quality={75}
              className="object-cover object-top"
              {...(i === 0 ? { preload: true } : { loading: 'eager' as const })}
            />
          </div>
          <figcaption className="flex items-center justify-between gap-3 border-t border-line px-4 py-3">
            <span className="text-[0.95rem] font-semibold">{it.name}</span>
            <span className="t-label text-ink-3">{it.note}</span>
          </figcaption>
        </figure>
      ))}
    </div>
  )
}
