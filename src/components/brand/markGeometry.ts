/**
 * The IBW hexagon mark, rebuilt as exact isometric geometry.
 *
 * Traced from the original logo artwork and snapped to its construction: a pointy-top
 * hexagon (circumradius 1) cut into five pieces along the 30° isometric axes —
 * three teal "flow" bars and two navy "structure" pieces. Coordinates are y-up.
 */
import type { PartId } from '@/content/services'

export type Vec2 = [number, number]

export type MarkPiece = {
  id: Exclude<PartId, 'outline'>
  /** Base colour sampled from the logo. */
  color: string
  /** Secondary colour for the in-piece gradient (logo bars shade teal → blue). */
  color2: string
  pts: Vec2[]
  /** Direction the piece travels when the engine is exploded (unit-ish, y-up). */
  explode: [number, number, number]
}

export const HEX: Vec2[] = [
  [0, 1],
  [0.866, 0.5],
  [0.866, -0.5],
  [0, -1],
  [-0.866, -0.5],
  [-0.866, 0.5],
]

export const MARK_PIECES: MarkPiece[] = [
  {
    id: 'bar-top',
    color: '#05aec4',
    color2: '#0a8fb4',
    pts: [
      [-0.866, 0.5],
      [0, 1],
      [0.303, 0.825],
      [-0.563, 0.325],
    ],
    explode: [-0.55, 0.95, 0.5],
  },
  {
    id: 'bar-mid',
    color: '#0a95ba',
    color2: '#1167a2',
    pts: [
      [-0.433, 0.25],
      [0.433, 0.75],
      [0.736, 0.575],
      [-0.13, 0.075],
    ],
    explode: [0.9, 0.7, 0.25],
  },
  {
    id: 'frame-left',
    color: '#1f4b84',
    color2: '#1b3f73',
    pts: [
      [-0.866, 0.35],
      [-0.563, 0.175],
      [-0.563, -0.14],
      [-0.866, -0.315],
    ],
    explode: [-1.15, 0.05, -0.15],
  },
  {
    id: 'core',
    color: '#1d4d87',
    color2: '#173b6c',
    pts: [
      [0.593, 0.343],
      [0.866, 0.186],
      [0.866, -0.5],
      [0, -1],
      [-0.457, -0.736],
      [-0.16, -0.565],
      [0, -0.657],
      [0.571, -0.327],
      [0.571, -0.02],
      [0.186, -0.242],
      [-0.121, -0.065],
    ],
    explode: [0.55, -0.55, -0.35],
  },
  {
    id: 'bar-low',
    color: '#04b0c5',
    color2: '#0b93b6',
    pts: [
      [-0.866, -0.5],
      [-0.288, -0.167],
      [0.015, -0.342],
      [-0.563, -0.675],
    ],
    explode: [-0.8, -0.9, 0.45],
  },
]

/** Centroid of a polygon (area-weighted). */
export function centroid(pts: Vec2[]): Vec2 {
  let a = 0,
    cx = 0,
    cy = 0
  for (let i = 0; i < pts.length; i++) {
    const [x0, y0] = pts[i]
    const [x1, y1] = pts[(i + 1) % pts.length]
    const f = x0 * y1 - x1 * y0
    a += f
    cx += (x0 + x1) * f
    cy += (y0 + y1) * f
  }
  a *= 0.5
  return [cx / (6 * a), cy / (6 * a)]
}

/** SVG path (y-down) for a polygon, scaled. */
export function svgPath(pts: Vec2[], scale = 100): string {
  return pts.map(([x, y], i) => `${i ? 'L' : 'M'}${(x * scale).toFixed(2)} ${(-y * scale).toFixed(2)}`).join(' ') + ' Z'
}
