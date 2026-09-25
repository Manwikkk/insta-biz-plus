'use client'

import { useMemo, useState } from 'react'
import { AnimatePresence, LayoutGroup, motion } from 'motion/react'
import { BLOG_FILTERS, type Post } from '@/content/data'
import { PostCard } from './PostCard'
import { cn } from '@/lib/cn'

const ease = [0.16, 1, 0.3, 1] as const

/** "Find the post that fits your stage" — filter chips and a reflowing grid. */
export function BlogGrid({ posts }: { posts: Post[] }) {
  const [f, setF] = useState(BLOG_FILTERS[0].label)
  const count = (label: string) => {
    const cats = BLOG_FILTERS.find((x) => x.label === label)!.categories
    return cats.length ? posts.filter((p) => cats.includes(p.category)).length : posts.length
  }
  const list = useMemo(() => {
    const cats = BLOG_FILTERS.find((x) => x.label === f)!.categories
    return cats.length ? posts.filter((p) => cats.includes(p.category)) : posts
  }, [f, posts])

  return (
    <div>
      <LayoutGroup>
        <div role="tablist" aria-label="Filter posts" className="flex flex-wrap gap-2">
          {BLOG_FILTERS.map((x) => (
            <button
              key={x.label}
              role="tab"
              aria-selected={f === x.label}
              onClick={() => setF(x.label)}
              className={cn(
                'relative inline-flex h-10 items-center gap-2 rounded-[10px] border px-4 text-[0.9rem] font-medium transition-colors',
                f === x.label ? 'border-ink text-bg' : 'border-line-2 text-ink-2 hover:border-ink hover:text-ink',
              )}
            >
              {f === x.label ? (
                <motion.span
                  layoutId="blog-filter"
                  className="absolute inset-0 rounded-[9px] bg-ink"
                  transition={{ duration: 0.45, ease }}
                />
              ) : null}
              <span className="relative">{x.label}</span>
              <span className={cn('t-label relative', f === x.label ? 'text-teal' : 'text-ink-3')}>{count(x.label)}</span>
            </button>
          ))}
        </div>
      </LayoutGroup>
      <p className="t-label mt-6 text-ink-3" aria-live="polite">
        Showing {list.length} of {posts.length} posts
      </p>
      <motion.ul layout className="mt-8 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout" initial={false}>
          {list.map((p, i) => (
            <motion.li
              key={p.slug}
              layout
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.5, ease, delay: Math.min(i, 6) * 0.03 }}
            >
              <PostCard post={p} />
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
    </div>
  )
}
