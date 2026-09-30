import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/cn'

/**
 * The original Insta Biz Web logo (mark + wordmark), in its theme-appropriate
 * colourway. Both variants are rendered; CSS shows the one matching the theme so the
 * server markup never depends on client state.
 */
export function Logo({
  variant = 'lockup',
  className,
  height = 34,
  preload = false,
  href = '/',
}: {
  variant?: 'lockup' | 'full'
  className?: string
  height?: number
  preload?: boolean
  href?: string | null
}) {
  const dims = variant === 'lockup' ? { w: 798, h: 164 } : { w: 950, h: 298 }
  const width = Math.round((dims.w / dims.h) * height)
  const src = variant === 'lockup' ? 'lockup' : 'logo-full'
  // the pictures never take the pointer: the whole mark is one link (a hand, never a text cursor, never dragged)
  const img = (
    <span className={cn('pointer-events-none relative block select-none', className)} style={{ width, height }}>
      <Image
        src={`/brand/${src}-light.png`}
        alt="Insta Biz Web logo"
        width={width}
        height={height}
        preload={preload}
        draggable={false}
        className="block dark:hidden"
        sizes={`${width}px`}
        quality={90}
      />
      <Image
        src={`/brand/${src}-dark.png`}
        alt="Insta Biz Web logo"
        width={width}
        height={height}
        draggable={false}
        className="hidden dark:block"
        sizes={`${width}px`}
        quality={90}
      />
    </span>
  )
  if (!href) return img
  return (
    <Link
      href={href}
      aria-label="Insta Biz Web, home"
      draggable={false}
      className="-my-2 inline-flex shrink-0 cursor-pointer select-none items-center py-2 [-webkit-touch-callout:none] [-webkit-user-drag:none]"
    >
      {img}
    </Link>
  )
}
