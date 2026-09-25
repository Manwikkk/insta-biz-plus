/**
 * Shared, mutable state for the growth-engine scene. GSAP ScrollTriggers write to it;
 * the R3F frame loop reads it and damps toward it, so the 3D never re-renders React.
 */
export type EngineTargets = {
  /** Placement of the whole engine in view units (x: -1 left … 1 right, y: -1 … 1). */
  x: number
  y: number
  scale: number
  /** Base orientation in radians. */
  rotX: number
  rotY: number
  rotZ: number
  /** 0 assembled → 1 exploded axonometric view (ordered). */
  explode: number
  /** 0 → 1 chaotic scatter: "disconnected parts". */
  scatter: number
  /** Index into MARK_PIECES of the highlighted part, -1 for none, 5 for the outline. */
  focus: number
  /** 0..1 blueprint hexagon outline. */
  outline: number
  /** 0..1 dims and desaturates the parts (problem state). */
  dim: number
  /** Idle rotation speed multiplier ("revs"). */
  rev: number
  /** 0..1 visibility of the part labels (tags, capabilities chapter). */
  labels: number
  /** 0..1 visibility of the hero callouts (leader lines to each module). */
  callouts: number
  /** 0..1 overall opacity. */
  opacity: number
}

export const engine: EngineTargets & {
  pointer: { x: number; y: number }
  drag: { vy: number; y: number; active: boolean; hovering: boolean }
  hover: number
  pulseAt: number
} = {
  x: 0.46,
  y: 0.02,
  scale: 1,
  rotX: -0.42,
  rotY: 0.42,
  rotZ: 0,
  explode: 0.06,
  scatter: 0,
  focus: -1,
  outline: 0,
  dim: 0,
  rev: 1,
  labels: 0,
  callouts: 0,
  opacity: 1,
  pointer: { x: 0, y: 0 },
  drag: { vy: 0, y: 0, active: false, hovering: false },
  hover: 0,
  pulseAt: -10,
}

/** Mark the moment the parts snap together (drives a light pulse). */
export function firePulse() {
  engine.pulseAt = performance.now() / 1000
}
