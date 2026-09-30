import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { buildMetadata, pageJsonLd } from '@/lib/seo'
import { JsonLd } from '@/components/seo/JsonLd'
import { Breadcrumbs } from '@/components/sections/PageHero'
import { ArticleBody } from '@/components/blog/ArticleBody'
import { Toc } from '@/components/blog/Toc'
import { PostCard } from '@/components/blog/PostCard'
import { Digest } from '@/components/blog/Digest'
import { Faq } from '@/components/sections/Faq'
import { Eyebrow } from '@/components/ui/SectionHead'
import { ArrowLink } from '@/components/ui/KeyButton'
import { Icon } from '@/components/ui/Icon'
import { postBySlug, posts } from '@/content/data'

export const dynamicParams = false

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  return buildMetadata(`/blogs/${slug}`)
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = postBySlug(slug)
  if (!post) notFound()
  const related = post.related.map((r) => postBySlug(r)).filter(Boolean) as NonNullable<ReturnType<typeof postBySlug>>[]
  const tocItems = [...post.toc.filter((t) => post.sections.some((s) => s.id === t.id))]

  return (
    <>
      <JsonLd data={pageJsonLd(`/blogs/${slug}`)} />
      <article id="article">
        <header className="rails relative overflow-hidden border-b border-line">
          <div aria-hidden className="absolute inset-0 [mask-image:radial-gradient(70%_80%_at_80%_10%,#000,transparent_70%)]">
            <div className="iso-grid" />
          </div>
          <div className="shell relative pb-12 pt-[120px] lg:pt-[152px]">
            <Breadcrumbs
              items={[{ label: 'Home', href: '/' }, { label: 'Blog', href: '/blogs' }, { label: post.category }]}
              className="enter-fade"
            />
            <div className="mt-10 max-w-[980px]">
              <p className="enter-fade inline-flex h-6 items-center rounded-[4px] bg-ink px-2 font-label text-[0.62rem] font-medium uppercase tracking-[0.08em] text-bg">
                {post.category}
              </p>
              <h1
                className="enter-fade mt-6 font-display text-[clamp(2.1rem,4.4vw,4.2rem)] font-[740] leading-[1.02] tracking-[-0.038em] [font-stretch:104%]"
                style={{ ['--d' as string]: '80ms' }}
              >
                {post.title}
              </h1>
              <p className="enter-fade t-lede mt-7 max-w-[46rem]" style={{ ['--d' as string]: '180ms' }}>
                {post.dek}
              </p>
              <p className="enter-fade mt-8 flex flex-wrap items-center gap-x-5 gap-y-2" style={{ ['--d' as string]: '260ms' }}>
                <span className="flex items-center gap-3">
                  <span className="grid size-9 place-items-center bg-ink font-label text-[0.6rem] font-semibold text-bg [clip-path:polygon(50%_0,100%_25%,100%_75%,50%_100%,0_75%,0_25%)]">
                    IB
                  </span>
                  <span className="font-semibold">{post.author}</span>
                  <span className="text-ink-3">· Insta Biz Web</span>
                </span>
                <span className="t-label text-ink-3">{post.displayDate}</span>
                <span className="t-label text-ink-3">{post.readTime} min read</span>
              </p>
            </div>
          </div>
          {post.cover ? (
            <div className="shell relative pb-14">
              <div
                className="enter-fade relative aspect-[21/9] overflow-hidden rounded-[18px] border border-line bg-sink"
                style={{ ['--d' as string]: '320ms' }}
              >
                <Image
                  src={post.cover.src}
                  alt={post.cover.alt}
                  fill
                  sizes="(min-width: 1320px) 1320px, 94vw"
                  quality={75}
                  preload
                  className="object-cover"
                />
              </div>
            </div>
          ) : null}
        </header>

        <div className="rails">
          <div className="shell grid gap-12 py-16 lg:grid-cols-12 lg:py-24">
            <aside className="hidden lg:col-span-3 lg:block">
              <div className="sticky top-28">
                <Toc items={tocItems} articleId="article-body" />
                <div className="mt-10 rounded-[14px] border border-line bg-raise p-5">
                  <p className="t-label text-ink-3">Tags</p>
                  <ul className="mt-3 flex flex-wrap gap-1.5">
                    {post.tags.map((t) => (
                      <li key={t} className="tag">
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </aside>

            <div id="article-body" className="min-w-0 lg:col-span-8 lg:col-start-5">
              {/* mobile TOC */}
              <details className="mb-10 rounded-[14px] border border-line bg-raise p-5 lg:hidden">
                <summary className="t-label cursor-pointer text-ink-2">On this page ({tocItems.length})</summary>
                <ol className="mt-4 grid gap-2">
                  {tocItems.map((t, i) => (
                    <li key={t.id}>
                      <a href={`#${t.id}`} className="flex gap-3 text-[0.95rem] text-ink-2">
                        <span className="t-label w-5 text-ink-3">{String(i + 1).padStart(2, '0')}</span>
                        {t.label}
                      </a>
                    </li>
                  ))}
                </ol>
              </details>

              <ArticleBody markdown={post.lede} className="prose-ibw max-w-[46rem] text-[1.25rem] leading-relaxed text-ink" />
              {post.sections.map((s) => (
                <section key={s.id} id={s.id} className="max-w-[46rem] scroll-mt-28">
                  <h2 className="mt-16 font-display text-[clamp(1.6rem,2.4vw,2.2rem)] font-[720] leading-[1.08] tracking-[-0.03em] text-ink [font-stretch:104%]">
                    {s.heading}
                  </h2>
                  <ArticleBody markdown={s.markdown} className="prose-ibw mt-6" />
                </section>
              ))}

              {post.faqs.length ? (
                <section id="faq" className="mt-20 max-w-[46rem] scroll-mt-28">
                  <h2 className="t-h3 mb-8">{post.faqHeading ?? 'Frequently asked questions'}</h2>
                  <Faq items={post.faqs} firstOpen={false} />
                </section>
              ) : null}

              {post.furtherReading ? (
                <section id="further-reading" className="mt-20 max-w-[46rem] scroll-mt-28">
                  <h2 className="t-h3">{post.furtherHeading ?? 'Keep going deeper'}</h2>
                  <div className="mt-8 grid gap-8 sm:grid-cols-2">
                    <div>
                      <p className="t-label text-ink-3">From the IBW journal</p>
                      <ul className="mt-4 border-t border-line">
                        {post.furtherReading.journal.map((j) => (
                          <li key={j.href + j.label} className="border-b border-line py-3">
                            <ArrowLink href={j.href}>{j.label}</ArrowLink>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="t-label text-ink-3">Sources</p>
                      <ul className="mt-4 border-t border-line">
                        {post.furtherReading.sources.map((s) => (
                          <li key={s.href} className="border-b border-line py-3">
                            <a
                              href={s.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group flex items-start justify-between gap-3 text-[0.95rem]"
                            >
                              <span>
                                <span className="link-draw">{s.label}</span>
                                {s.domain ? <span className="t-label mt-1 block text-ink-3">{s.domain}</span> : null}
                              </span>
                              <Icon name="arrow-up-right" size={15} className="mt-1 shrink-0 text-ink-3 group-hover:text-ink" />
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </section>
              ) : null}

              <div className="mt-16 flex max-w-[46rem] flex-col gap-5 rounded-[18px] bg-ink p-7 text-bg sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="t-h4">Work with the team</p>
                  <p className="mt-1 text-[0.95rem] text-bg/70">The people who wrote this ship it for founders every day.</p>
                </div>
                <Link href="/contact-us" className="btn btn-teal btn-sm shrink-0">
                  <span>Book a call →</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </article>

      {related.length ? (
        <section className="rails section-tight border-t border-line">
          <div className="shell">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <Eyebrow>Keep reading</Eyebrow>
                <h2 className="t-h3 mt-4">More from the IBW journal</h2>
              </div>
              <Link href="/blogs" className="link-draw font-medium">
                All articles
              </Link>
            </div>
            <ul className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <li key={r.slug}>
                  <PostCard post={r} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <Digest />
    </>
  )
}
