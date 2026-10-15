import Image, { type ImageProps } from 'next/image'
import { imageUrl } from '@/lib/imageUrl'
import { cn } from '@/lib/cn'

/**
 * A screenshot shown whole, never cropped: it fits its frame, and a blurred copy of itself
 * fills whatever room is left (one small file: blurred, a bigger one would look the same).
 * Fills its positioned parent.
 */
export function Shot({ className, loading, ...props }: Omit<ImageProps, 'fill'>) {
  const ambient = typeof props.src === 'string' ? imageUrl({ src: props.src, width: 128 }) : props.src
  return (
    <>
      <Image src={ambient} alt="" aria-hidden fill unoptimized loading={loading} className="shot-ambient" />
      <Image {...props} fill loading={loading} className={cn('object-contain', className)} />
    </>
  )
}
