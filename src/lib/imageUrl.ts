import images from '@/content/generated/images.json'

const made = images as Record<string, { h: string; w: number }>

/**
 * Where a picture is served at a given width. Local pictures come ready-made at every width
 * (scripts/optimize-images.mjs), as static files the CDN can keep; Unsplash covers are sized by
 * Unsplash's own CDN. Anything else is served as it is.
 */
export function imageUrl({ src, width, quality }: { src: string; width: number; quality?: number }) {
  const m = made[src]
  if (m) return `/_img${src.replace(/\.[a-z]+$/i, '')}.${m.h}.${Math.min(width, m.w)}.webp`
  if (src.startsWith('https://images.unsplash.com/')) {
    const url = new URL(src)
    url.searchParams.set('w', String(width))
    url.searchParams.set('q', String(quality ?? 75))
    url.searchParams.set('auto', 'format')
    url.searchParams.set('fit', 'max')
    return url.href
  }
  return src
}
