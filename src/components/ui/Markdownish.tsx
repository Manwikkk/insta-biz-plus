import Link from 'next/link'
import { Fragment } from 'react'

/**
 * Renders the small inline markdown the content uses in short strings:
 * [links](href), **bold** — nothing else. Long-form content uses ArticleBody.
 */
export function Markdownish({ text }: { text: string }) {
  const parts: React.ReactNode[] = []
  const re = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*/g
  let last = 0
  let m: RegExpExecArray | null
  let k = 0
  while ((m = re.exec(text))) {
    if (m.index > last) parts.push(<Fragment key={k++}>{text.slice(last, m.index)}</Fragment>)
    if (m[1]) {
      const href = m[2].replace('https://www.instabizweb.com', '') || '/'
      const external = /^(https?:|mailto:|tel:)/.test(href)
      parts.push(
        external ? (
          <a
            key={k++}
            href={href}
            className="link-under text-teal-ink"
            {...(/^https?:/.test(href) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          >
            {m[1]}
          </a>
        ) : (
          <Link key={k++} href={href} className="link-under text-teal-ink">
            {m[1]}
          </Link>
        ),
      )
    } else if (m[3]) {
      parts.push(
        <strong key={k++} className="font-semibold text-ink">
          {m[3]}
        </strong>,
      )
    }
    last = m.index + m[0].length
  }
  if (last < text.length) parts.push(<Fragment key={k++}>{text.slice(last)}</Fragment>)
  return <>{parts}</>
}
