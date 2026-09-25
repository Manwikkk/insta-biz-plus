import Link from 'next/link'
import { Eyebrow } from '@/components/ui/SectionHead'
import { Icon } from '@/components/ui/Icon'

/** Phrases of the story that carry it; each gets a highlighter stroke as the paragraph arrives. */
const KEY_PHRASES = ['small businesses deserve big-tech quality', 'founder-led', 'full-stack digital partner']

function marked(body: string) {
  const re = new RegExp(`(${KEY_PHRASES.map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'g')
  let k = 0
  return body.split(re).map((part, i) =>
    KEY_PHRASES.includes(part) ? (
      <mark key={i} className="story-mark" style={{ ['--i' as string]: k++ }}>
        {part}
      </mark>
    ) : (
      part
    ),
  )
}

/** "Five years. One mission." The story in two sentences beside its title, key lines highlighted. */
export function StoryHighlight({ eyebrow, title, body, cta }: { eyebrow: string; title: string; body: string; cta: string }) {
  return (
    <section className="rails section-tight relative border-b border-line" id="story">
      <div className="shell grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-10">
        <div className="lg:col-span-5">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h2 className="t-h2 mt-[clamp(10px,2vh,18px)]">{title}</h2>
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <p className="story-text text-[clamp(1.1rem,1.45vw,1.32rem)] leading-[1.6] tracking-[-0.01em] text-ink-2" data-reveal="fade">
            {marked(body)}
          </p>
          <Link href="/portfolio" className="group mt-5 inline-flex items-center gap-2 text-[0.98rem] font-medium">
            <span className="link-draw">{cta}</span>
            <Icon name="arrow" size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  )
}
