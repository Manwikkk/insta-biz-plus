import { HEX, MARK_PIECES, svgPath } from '@/components/brand/markGeometry'

// w: node width in viewBox units, sized to the label
const NODES = [
  { label: 'Tally', x: -150, y: -96, w: 92 },
  { label: 'GST', x: 150, y: -96, w: 84 },
  { label: 'WhatsApp', x: -150, y: 104, w: 124 },
  { label: 'Payment gateways', x: 150, y: 104, w: 168 },
]

/**
 * Hero figure for /solutions: the software you get sits at the centre; the integrations
 * Indian businesses rely on plug into it along isometric runs, with data flowing in.
 */
export function IntegrationHub() {
  return (
    <div className="relative rounded-[18px] border border-line bg-raise p-4">
      <div className="flex items-center justify-between px-2 pb-2">
        <span className="t-label text-ink-3">Your system, connected</span>
        <span className="t-label text-ink-3">12 industries</span>
      </div>
      <svg
        viewBox="-240 -142 480 284"
        className="hub w-full"
        role="img"
        aria-label="Tally, GST, WhatsApp and payment gateways connected to your CRM or ERP"
      >
        {/* isometric runs */}
        {NODES.map((n, i) => {
          const d = `M ${n.x * 0.62} ${n.y * 0.62} L ${n.x * 0.3} ${n.y * 0.3 + (n.y > 0 ? -12 : 12)} L 0 0`
          return (
            <g key={n.label}>
              <path d={d} fill="none" stroke="var(--line-2)" strokeWidth="1.2" />
              <path
                d={d}
                fill="none"
                stroke="var(--teal)"
                strokeWidth="1.6"
                className="hub-flow"
                style={{ ['--i' as string]: i }}
                pathLength={1}
              />
            </g>
          )
        })}
        {/* core: the mark */}
        <g transform="scale(0.62)">
          <path d={svgPath(HEX, 100 * 1.18)} fill="var(--bg)" stroke="var(--line-2)" strokeWidth="1.5" />
          {MARK_PIECES.map((p) => (
            <path key={p.id} d={svgPath(p.pts, 100)} fill={p.color} />
          ))}
        </g>
        {/* nodes: anchored on their inner edge, so longer labels grow away from the core */}
        {NODES.map((n) => {
          const cx = n.x * 0.78 + (n.x > 0 ? (n.w - 124) / 2 : -(n.w - 124) / 2)
          return (
            <g key={n.label} transform={`translate(${cx} ${n.y * 0.78})`}>
              <rect x={-n.w / 2} y={-17} width={n.w} height={34} rx={9} fill="var(--bg)" stroke="var(--line-2)" />
              <circle cx={-n.w / 2 + 16} cy={0} r={3.5} fill="var(--teal)" className="hub-dot" />
              <text x={-n.w / 2 + 28} y={4.5} fontSize="12.5" fontWeight={600} fill="var(--ink)" style={{ fontFamily: 'var(--font-sans)' }}>
                {n.label}
              </text>
            </g>
          )
        })}
      </svg>
      <p className="t-label px-2 pt-1 text-ink-3">CRM · ERP · management software, built around your workflow</p>
    </div>
  )
}
