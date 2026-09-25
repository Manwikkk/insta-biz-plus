import { HEX, MARK_PIECES, svgPath } from './markGeometry'
import { cn } from '@/lib/cn'

/**
 * The IBW mark as a technical line drawing: hexagon envelope, isometric construction
 * lines and the five pieces, drawn stroke-by-stroke when scrolled into view.
 */
export function MarkBlueprint({
  className,
  exploded = 0,
  filled = false,
  showConstruction = true,
  strokeWidth = 1,
}: {
  className?: string
  exploded?: number
  filled?: boolean
  showConstruction?: boolean
  strokeWidth?: number
}) {
  const S = 100
  return (
    <svg
      viewBox="-150 -150 300 300"
      className={cn('mark-blueprint overflow-visible', className)}
      data-reveal="draw"
      aria-hidden
      fill="none"
      strokeLinejoin="round"
      strokeLinecap="round"
    >
      {showConstruction ? (
        <g className="mb-con" stroke="currentColor" strokeWidth={strokeWidth * 0.6}>
          <path pathLength={1} d={`M ${-150} ${150 * 0.577} L ${150} ${-150 * 0.577}`} />
          <path pathLength={1} d={`M ${-150} ${-150 * 0.577} L ${150} ${150 * 0.577}`} />
          <path pathLength={1} d="M 0 -150 L 0 150" />
        </g>
      ) : null}
      <path className="mb-hex" pathLength={1} d={svgPath(HEX, S * 1.14)} stroke="currentColor" strokeWidth={strokeWidth} opacity="0.5" />
      {MARK_PIECES.map((p, i) => {
        const [ex, ey] = p.explode
        const dx = ex * exploded * 40
        const dy = -ey * exploded * 40
        return (
          <path
            key={p.id}
            className="mb-piece"
            pathLength={1}
            d={svgPath(p.pts, S)}
            transform={`translate(${dx.toFixed(1)} ${dy.toFixed(1)})`}
            stroke={filled ? 'none' : i === 3 || i === 2 ? 'var(--navy)' : 'var(--teal)'}
            fill={filled ? p.color : 'none'}
            strokeWidth={strokeWidth * 1.4}
            style={{ ['--i' as string]: i }}
          />
        )
      })}
    </svg>
  )
}
