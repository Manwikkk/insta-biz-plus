import Image, { type ImageProps } from 'next/image'
import { cn } from '@/lib/cn'

/**
 * A screenshot shown whole, never cropped: it fits its frame, and a blurred copy of itself
 * fills whatever room is left. Fills its positioned parent.
 */
export function Shot({ className, loading, ...props }: Omit<ImageProps, 'fill'>) {
  return (
    <>
      <Image src={props.src} alt="" aria-hidden fill sizes="64px" quality={60} loading={loading} className="shot-ambient" />
      <Image {...props} fill loading={loading} className={cn('object-contain', className)} />
    </>
  )
}
