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

/** Splits the pages' coverage sentence ("… including A, B and C, as well as … cities like D and E.") into its two lists. */
function coverageLists(text: string) {
  const plain = text.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
  // "A, B and C" or "A, B, and C"
  const list = (s: string | undefined) => (s ? s.split(/,\s*(?:and\s+)?|\s+and\s+/).map((x) => x.trim()).filter(Boolean) : [])
  return {
    areas: list(plain.match(/including (.+?),? as well as/)?.[1]),
    cities: list(plain.match(/cities like (.+?)\./)?.[1]),
  }
}

/**
 * Hero figure for the Ahmedabad pages: the office on the map, with the neighbourhoods and
 * Gujarat cities the page says we serve listed underneath.
 */
export function ServiceArea({ coverage }: { coverage: string }) {
  const { areas, cities } = coverageLists(coverage)
  return (
    <figure className="overflow-hidden rounded-[20px] border border-line bg-raise">
      <OfficeMap className="h-[clamp(150px,26vh,240px)] border-b border-line" />
      {areas.length ? (
        <figcaption className="grid gap-3 p-4 sm:p-5">
          <div>
            <p className="t-label text-ink-3">Ahmedabad neighbourhoods we serve</p>
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {areas.map((a) => (
                <li key={a} className="area-chip">
                  {a}
                </li>
              ))}
            </ul>
          </div>
          {cities.length ? (
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 border-t border-line pt-3">
              <p className="t-label text-ink-3">Across Gujarat</p>
              <ul className="flex flex-wrap gap-1.5">
                {cities.map((c) => (
                  <li key={c} className="area-chip is-city">
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </figcaption>
      ) : null}
    </figure>
  )
}
