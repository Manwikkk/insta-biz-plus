import { HEX, MARK_PIECES, svgPath } from '@/components/brand/markGeometry'

const S = 100

/**
 * The IBW mark in fine line at the top of the portfolio hero, centred behind the headline:
 * the hexagon and its five pieces, still, fading out downward into the page.
 */
export function HeroMark() {
  return (
    <div className="pf-mark" aria-hidden>
      <svg viewBox="-150 -150 300 300" fill="none" strokeLinejoin="round">
        <path className="pf-mark-rim" d={svgPath(HEX, S * 1.16)} />
        {MARK_PIECES.map((p) => (
          <path key={p.id} className="pf-mark-piece" d={svgPath(p.pts, S)} />
        ))}
        {HEX.map(([x, y]) => (
          <circle key={`${x}-${y}`} className="pf-mark-node" cx={x * S * 1.16} cy={-y * S * 1.16} r="1.8" />
        ))}
      </svg>
    </div>
  )
}
