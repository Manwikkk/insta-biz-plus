import Image from 'next/image'
import logos from '@/content/generated/logos.json'
import { cn } from '@/lib/cn'

type LogoFile = { src: string; width: number; height: number; ink: number; plate: string | null; colour: boolean }
const files = logos as Record<string, LogoFile>

/**
 * Where a logo sits inside its plate, as fractions of the plate: every logo covers about
 * the same area, so a wide wordmark and a compact emblem read at the same visual weight.
 * Dense artwork is set a touch smaller and airy artwork a touch larger.
 */
function fit(l: LogoFile, plateRatio: number, area: number) {
  const r = l.width / l.height
  const weight = Math.min(1.1, Math.max(0.9, (0.3 / l.ink) ** 0.25))
  let h = Math.sqrt((area * plateRatio) / r) * weight
  let w = h * r
  const maxW = plateRatio * 0.74
  const maxH = 0.64
  if (w > maxW) [w, h] = [maxW, maxW / r]
  if (h > maxH) [w, h] = [maxH * r, maxH]
  return { w: w / plateRatio, h }
}

/**
 * A client's logo on its plate. It rests in greyscale and turns to its own colours when
 * a `.logo-hover` ancestor (or the plate itself) is hovered or focused. Logos drawn for a
 * dark ground bring their own plate colour. `ratio` is the plate's width / height.
 */
export function ClientLogo({
  name,
  ratio = 2,
  area = 0.2,
  sizes = '160px',
  decorative = false,
  className,
}: {
  name: string
  ratio?: number
  area?: number
  sizes?: string
  decorative?: boolean
  className?: string
}) {
  const l = files[name]
  if (!l) return null
  const { w } = fit(l, ratio, area)
  return (
    <span
      className={cn('client-logo', l.plate && 'has-plate', className)}
      style={{ aspectRatio: ratio, ...(l.plate ? { ['--plate' as string]: l.plate } : {}) }}
    >
      <Image
        src={l.src}
        alt={decorative ? '' : `${name} logo`}
        width={l.width}
        height={l.height}
        sizes={sizes}
        quality={90}
        style={{ width: `${(w * 100).toFixed(1)}%` }}
      />
    </span>
  )
}
