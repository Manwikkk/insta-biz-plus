import type { Metadata } from 'next'
import { buildMetadata, pageJsonLd } from '@/lib/seo'
import { JsonLd } from '@/components/seo/JsonLd'
import { LegalDoc } from '@/components/legal/LegalDoc'
import { legal } from '@/content/data'

export const metadata: Metadata = buildMetadata('/privacy-policy')

export default function Page() {
  return (
    <>
      <JsonLd data={pageJsonLd('/privacy-policy')} />
      <LegalDoc doc={legal['privacy-policy']} />
    </>
  )
}
