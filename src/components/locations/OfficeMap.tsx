import Image from 'next/image'
import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

/**
 * Where the office is: a still map of the Naranpura neighbourhood (rendered once from
 * OpenStreetMap by scripts/office-map.mjs and toned to the site palette, light and dark),
 * with the office pinned at its centre. The map is shown at its own scale, so street names
 * stay legible whatever the size of the panel; the panel just reveals more or less of it.
 */
export function OfficeMap({
  className,
  label = 'Insta Biz Web HQ',
  children,
}: {
  className?: string
  label?: string
  children?: ReactNode
}) {
  return (
    <div
      className={cn('office-map relative isolate overflow-hidden', className)}
      role="img"
      aria-label="Map of Naranpura, Ahmedabad, with the Insta Biz Web office at the centre"
    >
      <Image src="/maps/office-light.webp" alt="" fill unoptimized className="object-none dark:hidden" />
      <Image src="/maps/office-dark.webp" alt="" fill unoptimized className="hidden object-none dark:block" />
      <span className="map-pin" aria-hidden>
        <span className="map-pin-label">{label}</span>
        <span className="map-pin-dot" />
      </span>
      <a
        href="https://www.openstreetmap.org/copyright"
        target="_blank"
        rel="noopener noreferrer"
        className="map-credit"
      >
        © OpenStreetMap contributors
      </a>
      {children}
    </div>
  )
}
