'use client'

import { useState } from 'react'
import { OfficeMap } from '@/components/locations/OfficeMap'
import { KeyAction } from '@/components/ui/KeyButton'
import { site } from '@/content/site'

/**
 * The office on a still map; Google Maps loads only when asked for, so there are no
 * third-party requests until then.
 */
export function MapEmbed() {
  const [on, setOn] = useState(false)
  if (on) {
    return (
      <div className="overflow-hidden rounded-[18px] border border-line">
        <iframe
          title="Insta Biz Web - Headquarters, Naranpura"
          src={site.mapEmbed}
          className="aspect-[4/3] w-full"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    )
  }
  return (
    <OfficeMap className="aspect-[4/3] w-full rounded-[18px] border border-line">
      <div className="absolute bottom-9 left-1/2 z-[3] -translate-x-1/2">
        <KeyAction type="button" size="sm" icon="pin" onClick={() => setOn(true)}>
          Load interactive map
        </KeyAction>
      </div>
    </OfficeMap>
  )
}
