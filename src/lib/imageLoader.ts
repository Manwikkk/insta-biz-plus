'use client'

import { imageUrl } from './imageUrl'

/** next/image's loader (next.config.ts): pictures made ahead of time, see imageUrl. */
export default function imageLoader(props: { src: string; width: number; quality?: number }) {
  return imageUrl(props)
}
