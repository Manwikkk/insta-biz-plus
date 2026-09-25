/** Structured data from the audited site, emitted verbatim. */
export function JsonLd({ data }: { data: Array<Record<string, unknown>> | Record<string, unknown> }) {
  const list = Array.isArray(data) ? data : [data]
  return (
    <>
      {list.map((d, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(d).replace(/</g, '\\u003c') }} />
      ))}
    </>
  )
}
