import type { Metadata } from 'next'
import { buildMetadata, pageJsonLd } from '@/lib/seo'
import { JsonLd } from '@/components/seo/JsonLd'
import { PageHero } from '@/components/sections/PageHero'
import { KeyButton } from '@/components/ui/KeyButton'
import { SectionHead } from '@/components/ui/SectionHead'
import { PostCard } from '@/components/blog/PostCard'
import { BlogGrid } from '@/components/blog/BlogGrid'
import { Digest } from '@/components/blog/Digest'
import { blogIndex, orderedPosts, postBySlug } from '@/content/data'

export const metadata: Metadata = buildMetadata('/blogs')

export default function BlogIndexPage() {
  const featured = postBySlug(blogIndex.featured)!
  const all = orderedPosts()
  const [tag, ...note] = blogIndex.eyebrow.split(' ')
  return (
    <>
      <JsonLd data={pageJsonLd('/blogs')} />
      <PageHero
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Blog' }]}
        tag={tag}
        tagNote={note.join(' ')}
        title={blogIndex.h1}
        intro={blogIndex.intro}
        chips={blogIndex.chips}
        actions={
          <>
            <KeyButton href="#all-posts" icon="arrow-down">
              Browse all posts
            </KeyButton>
            <KeyButton href="#newsletter" variant="ghost" icon={null}>
              Get monthly digest
            </KeyButton>
          </>
        }
        figure={
          <div className="rounded-[18px] border border-line bg-raise p-4">
            <p className="t-label mb-4 flex items-center gap-2 px-1 text-ink-3">
              <span className="live-dot" /> Featured this month
            </p>
            <PostCard post={featured} priority />
          </div>
        }
      />

      <section className="rails section border-b border-line scroll-mt-24" id="all-posts">
        <div className="shell">
          <SectionHead eyebrow="All articles" title="Find the post that fits your stage" align="split" />
          <div className="mt-12">
            <BlogGrid posts={all} />
          </div>
        </div>
      </section>

      <Digest />
    </>
  )
}
