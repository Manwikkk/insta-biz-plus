import { ImageResponse } from 'next/og'
import { HEX, MARK_PIECES, svgPath } from '@/components/brand/markGeometry'
import { solutionBySlug, solutions } from '@/content/data'

export const alt = 'Insta Biz Web industry software solution'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export function generateStaticParams() {
  return solutions.map((s) => ({ slug: s.slug }))
}

const INK = '#0b0f15'
const INK_2 = '#343b46'
const INK_3 = '#5f6570'
const PAPER = '#f2f0ea'
const TEAL = '#0aa2b5'

type Font = { name: string; data: ArrayBuffer; weight: 500 | 600 | 800; style: 'normal' }

/** Subset of a Google font as TTF (Satori can't read WOFF2). Returns null when offline — the image still renders. */
async function googleFont(family: string, weight: 500 | 600 | 800, text: string): Promise<Font | null> {
  try {
    const css = await (
      await fetch(`https://fonts.googleapis.com/css2?family=${family.replace(/ /g, '+')}:wght@${weight}&text=${encodeURIComponent(text)}`)
    ).text()
    const src = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)?.[1]
    if (!src) return null
    const res = await fetch(src)
    return res.ok ? { name: family, data: await res.arrayBuffer(), weight, style: 'normal' } : null
  } catch {
    return null
  }
}

/** Isometric lattice for the figure side: lines at ±30° and verticals, clipped to the frame. */
function lattice(w: number, h: number, step: number) {
  const d: string[] = []
  const t = Math.tan(Math.PI / 6)
  for (let x = -h / t; x < w + h / t; x += step / t) {
    d.push(`M${x.toFixed(1)} 0 L${(x + h / t).toFixed(1)} ${h}`)
    d.push(`M${x.toFixed(1)} ${h} L${(x + h / t).toFixed(1)} 0`)
  }
  for (let x = 0; x <= w; x += step / t / 2) d.push(`M${x.toFixed(1)} 0 L${x.toFixed(1)} ${h}`)
  return d.join(' ')
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const s = solutionBySlug(slug)
  const label = s?.label ?? 'Industry software'
  const summary = s?.summary ?? 'CRM, ERP and management software built around your workflow.'
  const group = s?.group ?? 'Industry software'
  const kicker = `Insta Biz Web · ${group}`.toUpperCase()
  // Long names would run to three lines at full size.
  const long = label.length > 18
  const foot = 'instabizweb.com AHMEDABAD, INDIA YOUR SYSTEM, CONNECTED'
  const fonts = (
    await Promise.all([
      googleFont('Mona Sans', 800, label),
      googleFont('Mona Sans', 500, summary),
      googleFont('Mona Sans', 600, kicker + foot),
    ])
  ).filter((x): x is Font => !!x)
  // Only name families that actually loaded; Satori chokes on an undefined fontFamily.
  const display = fonts.some((x) => x.name === 'Mona Sans') ? { fontFamily: 'Mona Sans' } : {}
  // labels: the same family in small tracked capitals
  const labelFont = { ...display, fontWeight: 600 }

  return new ImageResponse(
    <div style={{ width: '100%', height: '100%', display: 'flex', background: PAPER, color: INK }}>
      {/* copy */}
      <div style={{ width: 640, height: '100%', display: 'flex', flexDirection: 'column', padding: '64px 0 56px 72px' }}>
        <div style={{ display: 'flex', alignItems: 'center', ...labelFont, fontSize: 17, letterSpacing: 1.5, color: INK_3 }}>
          <div style={{ width: 12, height: 12, background: TEAL, marginRight: 14 }} />
          {kicker}
        </div>
        <div
          style={{
            display: 'flex',
            marginTop: long ? 38 : 46,
            ...display,
            fontSize: long ? 68 : 84,
            fontWeight: 800,
            lineHeight: 1.0,
            letterSpacing: -3.4,
          }}
        >
          {label}
        </div>
        <div
          style={{
            display: 'flex',
            marginTop: long ? 24 : 30,
            ...display,
            fontWeight: 500,
            fontSize: long ? 27 : 29,
            lineHeight: 1.4,
            color: INK_2,
            maxWidth: 530,
          }}
        >
          {summary}
        </div>
        <div
          style={{
            display: 'flex',
            marginTop: 'auto',
            alignItems: 'center',
            ...labelFont,
            fontSize: 17,
            letterSpacing: 1,
            color: INK_3,
          }}
        >
          <div style={{ display: 'flex', padding: '10px 18px', background: INK, color: PAPER, borderRadius: 8, marginRight: 18 }}>
            instabizweb.com
          </div>
          AHMEDABAD, INDIA
        </div>
      </div>

      {/* figure */}
      <div style={{ width: 560, height: '100%', display: 'flex', position: 'relative', borderLeft: '1px solid rgba(11,15,21,0.12)' }}>
        <svg width="560" height="630" viewBox="0 0 560 630" style={{ position: 'absolute', left: 0, top: 0 }}>
          <path d={lattice(560, 630, 44)} stroke="rgba(11,15,21,0.07)" strokeWidth="1" fill="none" />
        </svg>
        <svg width="560" height="630" viewBox="-280 -315 560 630" style={{ position: 'absolute', left: 0, top: 0 }}>
          <path d={svgPath(HEX, 196)} fill="none" stroke="rgba(11,15,21,0.28)" strokeWidth="1.5" strokeDasharray="6 8" />
          <path d="M -250 0 L 250 0" stroke="rgba(11,15,21,0.12)" strokeWidth="1" />
          <path d="M 0 -290 L 0 290" stroke="rgba(11,15,21,0.12)" strokeWidth="1" />
          {MARK_PIECES.map((p) => {
            const [ex, ey] = p.explode
            return (
              <path
                key={p.id}
                d={svgPath(p.pts, 160)}
                fill={p.color}
                transform={`translate(${(ex * 16).toFixed(1)} ${(-ey * 16).toFixed(1)})`}
              />
            )
          })}
        </svg>
        <div
          style={{
            position: 'absolute',
            right: 40,
            bottom: 40,
            display: 'flex',
            ...labelFont,
            fontSize: 15,
            letterSpacing: 1,
            color: INK_3,
          }}
        >
          YOUR SYSTEM, CONNECTED
        </div>
      </div>
    </div>,
    { ...size, ...(fonts.length ? { fonts } : {}) },
  )
}
