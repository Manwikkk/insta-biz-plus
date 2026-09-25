import Link from 'next/link'
import ReactMarkdown, { type Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'

const components: Components = {
  a({ href = '', children }) {
    const h = href.replace('https://www.instabizweb.com', '') || '/'
    if (/^(https?:|mailto:|tel:)/.test(h)) {
      return (
        <a href={h} {...(/^https?:/.test(h) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
          {children}
        </a>
      )
    }
    return <Link href={h}>{children}</Link>
  },
  table({ children }) {
    return (
      <div className="table-wrap">
        <table>{children}</table>
      </div>
    )
  },
}

/** Long-form markdown (articles, legal) with the site's prose styles. */
export function ArticleBody({ markdown, className }: { markdown: string; className?: string }) {
  return (
    <div className={className ?? 'prose-ibw'}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {markdown}
      </ReactMarkdown>
    </div>
  )
}
