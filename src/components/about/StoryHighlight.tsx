import Link from 'next/link'
import { Eyebrow } from '@/components/ui/SectionHead'
import { Icon } from '@/components/ui/Icon'

/** Phrases of the story that carry it; each gets a highlighter stroke as the paragraph arrives. */
const KEY_PHRASES = [
  'small businesses deserve big-tech quality',
  'two-person studio in Ahmedabad',
  'full-stack digital partner',
  'founder-led',
]

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

/** "Five years. One mission." The story as one large paragraph, its key lines highlighted. */
export function StoryHighlight({ eyebrow, title, body, cta }: { eyebrow: string; title: string; body: string; cta: string }) {
  return (
    <section className="rails section relative border-b border-line" id="story">
      <div className="shell">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Eyebrow>{eyebrow}</Eyebrow>
            <h2 className="t-h2 mt-[clamp(10px,2vh,18px)]">{title}</h2>
          </div>
          <Link href="/portfolio" className="group inline-flex items-center gap-2 text-[1rem] font-medium">
            <span className="link-draw">{cta}</span>
            <Icon name="arrow" size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        <p
          className="story-text mt-[clamp(20px,4.4vh,48px)] max-w-[62rem] font-display text-[clamp(1.4rem,min(2.7vw,5vh),2.6rem)] font-[560] leading-[1.24] tracking-[-0.025em] text-ink-2"
          data-reveal="fade"
        >
          {marked(body)}
        </p>
      </div>
    </section>
  )
}
