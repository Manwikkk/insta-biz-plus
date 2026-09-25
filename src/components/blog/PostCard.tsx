import Image from 'next/image'
import Link from 'next/link'
import type { Post } from '@/content/data'
import { cn } from '@/lib/cn'

export function PostCard({ post, size = 'md', priority = false }: { post: Post; size?: 'md' | 'lg'; priority?: boolean }) {
  return (
    <Link href={`/blogs/${post.slug}`} className="group block h-full">
      <div
        className={cn(
          'relative overflow-hidden rounded-[14px] border border-line bg-sink',
          size === 'lg' ? 'aspect-[16/10]' : 'aspect-[16/10]',
        )}
      >
        {post.cover ? (
          <Image
            src={post.cover.src}
            alt={post.cover.alt}
            fill
            sizes={size === 'lg' ? '(min-width: 1024px) 640px, 92vw' : '(min-width: 1024px) 400px, (min-width: 640px) 45vw, 92vw'}
            quality={60}
            preload={priority}
            className="object-cover transition-transform duration-[1.2s] ease-[var(--ease-out)] group-hover:scale-[1.04]"
          />
        ) : null}
        <span className="absolute left-3 top-3 inline-flex h-6 items-center rounded-[5px] bg-bg/90 px-2 font-label text-[0.6rem] uppercase tracking-[0.07em] text-ink backdrop-blur">
          {post.category}
        </span>
      </div>
      <p className="t-label mt-5 flex items-center gap-3 text-ink-3">
        <span>{post.displayDate}</span>
        <span className="h-px w-5 bg-line-2" />
        <span>{post.readTime} min read</span>
      </p>
      <h3 className={cn('mt-3 transition-colors group-hover:text-teal-ink', size === 'lg' ? 't-h2' : 't-h4 text-[1.2rem] leading-snug')}>
        {post.title}
      </h3>
      <p className={cn('mt-3 text-ink-2', size === 'lg' ? 't-lede' : 't-small line-clamp-3')}>{post.dek}</p>
    </Link>
  )
}
