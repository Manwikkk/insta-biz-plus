'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, Lightformer, Line } from '@react-three/drei'
import * as THREE from 'three'
import { useEffect, useMemo, useRef } from 'react'
import { MARK_PIECES, HEX, centroid, type MarkPiece } from '@/components/brand/markGeometry'
import { engine } from './engineState'
import { useTheme, type Theme } from '@/lib/theme'
import { services } from '@/content/services'

const DEPTH = 0.26
const BEVEL = 0.028

type Built = {
  piece: MarkPiece
  geo: THREE.ExtrudeGeometry
  c: [number, number]
  /** Largest distance from the centroid to a corner (local units). */
  radius: number
  scatterRot: THREE.Euler
  /** Where the hero callout points, relative to the centroid (local units). */
  anchor: [number, number]
}

/**
 * Where each part drifts during "the problem", in view units (-1…1), around the
 * headline rather than behind it. Order follows MARK_PIECES:
 * bar-top (web) · bar-mid (automation) · frame-left (AI) · core (CRM) · bar-low (mobile).
 */
const SCATTER: Array<[number, number, number]> = [
  [-0.72, 0.56, -0.5],
  [0.7, 0.6, -0.3],
  [-0.84, -0.1, -0.2],
  [0.8, -0.34, -0.6],
  [-0.56, -0.66, -0.4],
]

/** The same drift on a tall (phone) screen: parts keep to the bands above and below the copy. */
const SCATTER_TALL: Array<[number, number, number]> = [
  [-0.58, 0.76, -0.5],
  [0.62, 0.68, -0.3],
  [-0.72, -0.34, -0.2],
  [0.7, -0.6, -0.6],
  [-0.24, -0.84, -0.4],
]

/** Deterministic pseudo-random so the scatter is identical on every visit. */
function rand(seed: number) {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453
  return x - Math.floor(x)
}

function build(piece: MarkPiece, i: number): Built {
  const [cx, cy] = centroid(piece.pts)
  const shape = new THREE.Shape(piece.pts.map(([x, y]) => new THREE.Vector2(x - cx, y - cy)))
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: DEPTH,
    bevelEnabled: true,
    bevelThickness: BEVEL,
    bevelSize: BEVEL * 0.8,
    bevelOffset: -BEVEL * 0.8,
    bevelSegments: 3,
    curveSegments: 1,
  })
  geo.translate(0, 0, -DEPTH / 2)

  // Logo-faithful gradient across each bar: lighter teal at the upper-left, bluer toward the lower-right.
  const a = new THREE.Color(piece.color)
  const b = new THREE.Color(piece.color2)
  const pos = geo.attributes.position
  const colors = new Float32Array(pos.count * 3)
  const tmp = new THREE.Color()
  for (let v = 0; v < pos.count; v++) {
    const wx = pos.getX(v) + cx
    const wy = pos.getY(v) + cy
    const t = THREE.MathUtils.clamp(((wx + 0.9) / 1.8) * 0.75 + ((0.9 - wy) / 1.8) * 0.25, 0, 1)
    tmp.copy(a).lerp(b, t)
    colors.set([tmp.r, tmp.g, tmp.b], v * 3)
  }
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  const radius = Math.max(...piece.pts.map(([x, y]) => Math.hypot(x - cx, y - cy)))
  const r1 = rand(i + 1),
    r2 = rand(i + 7),
    r3 = rand(i + 13)
  const scatterRot = new THREE.Euler((r2 - 0.5) * 2.2, (r3 - 0.5) * 2.8, (r1 - 0.5) * 1.4)
  const [ax, ay] = piece.anchor ?? [cx, cy]
  return { piece, geo, c: [cx, cy], radius, scatterRot, anchor: [ax - cx, ay - cy] }
}

/** DOM overlay nodes, positioned each frame by projecting their 3D anchors (no extra React roots). */
const labelNodes: (HTMLDivElement | null)[] = []
const calloutNodes: (HTMLDivElement | null)[] = []
const leaderNodes: (SVGPolylineElement | null)[] = []
const dotNodes: (SVGCircleElement | null)[] = []
const _v = new THREE.Vector3()
const _c = new THREE.Vector3()
const _t = new THREE.Vector3()
const _a = new THREE.Vector3()

const KEYS = [
  'x',
  'y',
  'scale',
  'rotX',
  'rotY',
  'rotZ',
  'explode',
  'scatter',
  'dim',
  'rev',
  'labels',
  'callouts',
  'opacity',
] as const

function Engine({ theme }: { theme: Theme }) {
  const group = useRef<THREE.Group>(null)
  const meshes = useRef<(THREE.Mesh | null)[]>([])
  const pulseRef = useRef<THREE.Group>(null)
  const built = useMemo(() => MARK_PIECES.map(build), [])
  const cur = useRef(Object.fromEntries(KEYS.map((k) => [k, engine[k]])) as Record<(typeof KEYS)[number], number>)
  const focusW = useRef(new Float32Array(MARK_PIECES.length))
  const { viewport, camera, size } = useThree()

  const dark = theme === 'dark'
  const materials = useMemo(
    () =>
      built.map(
        (b) =>
          new THREE.MeshPhysicalMaterial({
            vertexColors: true,
            clearcoat: 1,
            transparent: true,
            emissive: new THREE.Color(b.piece.id.startsWith('bar') ? '#0bd0e6' : '#1f5fae'),
          }),
      ),
    [built],
  )
  useEffect(() => {
    for (const m of materials) {
      // Dark: less metal (a dark room would swallow it), a touch of inner glow, crisper coat.
      m.metalness = dark ? 0.16 : 0.28
      m.roughness = dark ? 0.3 : 0.32
      m.clearcoatRoughness = dark ? 0.08 : 0.2
      m.needsUpdate = true
    }
  }, [dark, materials])
  useEffect(() => () => materials.forEach((m) => m.dispose()), [materials])

  const hexPts = useMemo(() => [...HEX, HEX[0]].map(([x, y]) => new THREE.Vector3(x * 1.22, y * 1.22, 0)), [])

  useFrame((state, delta) => {
    const g = group.current
    if (!g) return
    const dt = Math.min(delta, 1 / 20)
    // Unhurried follow: the engine eases toward its scroll targets rather than snapping.
    const k = 1 - Math.exp(-dt * 3.4)
    const c = cur.current
    for (const key of KEYS) c[key] += (engine[key] - c[key]) * k

    const t = state.clock.elapsedTime
    const vw = viewport.width
    const vh = viewport.height
    const toPx = (v: THREE.Vector3) => [((v.x + 1) / 2) * size.width, ((1 - v.y) / 2) * size.height] as const

    // Placement + size (mark is ~2 units tall)
    g.position.set((c.x * vw) / 2, (c.y * vh) / 2, 0)
    const base = Math.min(vh * 0.26, vw * 0.2)
    g.scale.setScalar(base * c.scale)

    // Touch drag (phones/tablets only) with inertia, easing back to rest.
    const d = engine.drag
    if (!d.active) {
      d.y += d.vy * dt
      d.vy *= Math.exp(-dt * 2.2)
      d.y *= Math.exp(-dt * 0.35)
    }
    engine.hover += ((d.active ? 1 : 0) - engine.hover) * k

    // The engine turns a little toward the cursor.
    const p = engine.pointer
    g.rotation.x = c.rotX + p.y * 0.14 + Math.sin(t * 0.45) * 0.025
    g.rotation.y = c.rotY + p.x * 0.28 + Math.sin(t * 0.32) * 0.14 * c.rev + d.y
    g.rotation.z = c.rotZ + Math.sin(t * 0.27) * 0.015
    g.updateMatrixWorld()

    // Focus weights
    const fw = focusW.current
    let anyFocus = 0
    for (let i = 0; i < fw.length; i++) {
      fw[i] += ((Math.round(engine.focus) === i ? 1 : 0) - fw[i]) * k
      anyFocus = Math.max(anyFocus, fw[i])
    }

    const explode = c.explode + engine.hover * 0.12
    const sc = c.scatter
    const halfW = vw / 2
    const halfH = vh / 2
    built.forEach((b, i) => {
      const m = meshes.current[i]
      if (!m) return
      const [ex, ey, ez] = b.piece.explode
      // assembled / exploded position in the group's local space
      let px = b.c[0] + ex * explode * 0.62
      let py = b.c[1] + ey * explode * 0.62
      let pz = ez * explode * 0.9 + fw[i] * 0.55
      const pieceScale = 1 - sc * 0.28
      if (sc > 0.001) {
        // Scatter target lives in screen space and is clamped so the whole part stays in view.
        const r = b.radius * g.scale.x * pieceScale * 1.08
        const [nx, ny, nz] = (vh > vw * 1.15 ? SCATTER_TALL : SCATTER)[i]
        const tx = THREE.MathUtils.clamp(nx * halfW, -(halfW * 0.95 - r), halfW * 0.95 - r)
        const ty = THREE.MathUtils.clamp(ny * halfH, -(halfH * 0.9 - r), halfH * 0.9 - r)
        _t.set(tx + Math.sin(t * 0.4 + i) * 0.05, ty + Math.cos(t * 0.35 + i * 2) * 0.04, nz)
        g.worldToLocal(_t)
        px += (_t.x - px) * sc
        py += (_t.y - py) * sc
        pz += (_t.z - pz) * sc
      }
      m.position.set(px, py, pz)
      m.rotation.set(
        b.scatterRot.x * sc + Math.sin(t * 0.3 + i) * 0.12 * sc,
        b.scatterRot.y * sc + Math.cos(t * 0.25 + i) * 0.14 * sc,
        b.scatterRot.z * sc,
      )
      m.scale.setScalar(pieceScale * (1 + fw[i] * 0.07))
      const mat = materials[i]
      const dimOthers = anyFocus * (1 - fw[i]) * (dark ? 0.6 : 0.72)
      mat.opacity = c.opacity * (1 - dimOthers) * (1 - c.dim * 0.5)
      mat.emissiveIntensity = ((dark ? 0.2 : 0) + fw[i] * (dark ? 0.28 : 0.08)) * (1 - c.dim * 0.55)
      mat.color.setScalar(1 - c.dim * 0.62)

      const el = labelNodes[i]
      if (el) {
        const vis = Math.max(c.labels * (1 - sc), fw[i]) * c.opacity
        el.style.opacity = String(vis)
        el.dataset.active = fw[i] > 0.5 ? 'true' : 'false'
        if (vis > 0.01) {
          _v.set(b.piece.explode[0] * 0.5, b.piece.explode[1] * 0.5, DEPTH)
          m.localToWorld(_v)
          _v.project(camera)
          const [sx, sy] = toPx(_v)
          el.style.transform = `translate3d(${sx.toFixed(1)}px, ${sy.toFixed(1)}px, 0) translate(-50%, -50%)`
        }
      }
    })

    // Hero callouts: a leader from each part out past the engine's rim, then a short dogleg to its name.
    const cv = c.callouts * c.opacity * (1 - sc)
    if (calloutNodes.length) {
      _c.copy(g.position).project(camera)
      const [cx, cy] = toPx(_c)
      const ppu = size.height / vh
      const rim = g.scale.x * ppu * 1.02 + 30
      built.forEach((b, i) => {
        const label = calloutNodes[i]
        const leader = leaderNodes[i]
        const dot = dotNodes[i]
        if (!label || !leader || !dot) return
        label.style.opacity = String(cv)
        leader.style.opacity = String(cv)
        dot.style.opacity = String(cv)
        if (cv < 0.01) return
        const m = meshes.current[i]
        if (!m) return
        m.updateWorldMatrix(true, false)
        // The name sits out along the line from the engine's centre through the part (its mid-plane)…
        m.localToWorld(_v.set(b.anchor[0], b.anchor[1], 0))
        _v.project(camera)
        const [rx, ry] = toPx(_v)
        // …and the leader starts on the part's front face, where the eye reads it.
        m.localToWorld(_a.set(b.anchor[0], b.anchor[1], DEPTH / 2 + BEVEL))
        _a.project(camera)
        const [ax, ay] = toPx(_a)
        const dx = rx - cx
        const dy = ry - cy
        const len = Math.hypot(dx, dy) || 1
        const ux = dx / len
        const uy = dy / len
        const exx = cx + ux * rim
        const eyy = cy + uy * rim
        const side = ux >= 0 ? 1 : -1
        const tx = exx + side * 18
        leader.setAttribute(
          'points',
          `${ax.toFixed(1)},${ay.toFixed(1)} ${exx.toFixed(1)},${eyy.toFixed(1)} ${tx.toFixed(1)},${eyy.toFixed(1)}`,
        )
        dot.setAttribute('cx', ax.toFixed(1))
        dot.setAttribute('cy', ay.toFixed(1))
        label.style.transform = `translate3d(${(tx + side * 8).toFixed(1)}px, ${eyy.toFixed(1)}px, 0) translate(${side > 0 ? '0' : '-100%'}, -50%)`
      })
    }

    // Assembly pulse: a hexagon ring expands from the core when parts snap together
    if (pulseRef.current) {
      const age = performance.now() / 1000 - engine.pulseAt
      const on = age >= 0 && age < 1.6
      pulseRef.current.visible = on
      if (on) {
        const e = age / 1.6
        pulseRef.current.scale.setScalar(1 + e * 1.1)
        pulseRef.current.traverse((obj) => {
          const mat = (obj as THREE.Mesh).material as THREE.Material & { opacity?: number }
          if (mat && 'opacity' in mat) mat.opacity = (1 - e) * 0.9
        })
      }
    }
  })

  return (
    <group ref={group}>
      {built.map((b, i) => (
        <mesh
          key={b.piece.id}
          ref={(m) => {
            meshes.current[i] = m
          }}
          geometry={b.geo}
          material={materials[i]}
          position={[b.c[0], b.c[1], 0]}
        />
      ))}

      <group ref={pulseRef} visible={false}>
        <Line
          points={hexPts.map((v) => v.clone().multiplyScalar(0.86))}
          color={dark ? '#52d9e7' : '#0aa2b5'}
          lineWidth={2}
          transparent
          opacity={0}
        />
      </group>
    </group>
  )
}

function Lights({ theme }: { theme: Theme }) {
  const dark = theme === 'dark'
  return (
    <>
      <ambientLight intensity={dark ? 0.55 : 0.7} />
      <directionalLight position={[-3, 5, 6]} intensity={dark ? 1.9 : 2.1} color={dark ? '#e2f3ff' : '#fff6ea'} />
      <directionalLight position={[4, -2, 3]} intensity={dark ? 0.9 : 0.7} color={dark ? '#22c7d8' : '#d9eef2'} />
      <pointLight position={[-3, -2, -3]} intensity={dark ? 14 : 4} color={dark ? '#22c7d8' : '#9fdce4'} distance={12} />
      <Environment key={theme} resolution={256} frames={1}>
        <color attach="background" args={[dark ? '#06080b' : '#eeeae2']} />
        <Lightformer
          form="rect"
          intensity={dark ? 2.6 : 3}
          position={[0, 4, 3]}
          scale={[8, 1.6, 1]}
          rotation-x={Math.PI / 2.4}
          color="#ffffff"
        />
        <Lightformer
          form="rect"
          intensity={dark ? 3 : 1.2}
          position={[-5, 0.5, 1]}
          scale={[1.2, 6, 1]}
          rotation-y={Math.PI / 2}
          color={dark ? '#22c7d8' : '#ffffff'}
        />
        <Lightformer
          form="rect"
          intensity={dark ? 1.3 : 1.6}
          position={[5, -1, 2]}
          scale={[1.4, 5, 1]}
          rotation-y={-Math.PI / 2}
          color={dark ? '#3d74c2' : '#f4efe6'}
        />
        <Lightformer form="ring" intensity={dark ? 1.4 : 0.6} position={[0, 0, -6]} scale={4} color={dark ? '#0aa2b5' : '#ffffff'} />
      </Environment>
    </>
  )
}

const partService = (id: string) => services.find((s) => s.part === id)

/** Part tags (01 · Automation …) for the capabilities chapter: plain DOM positioned by the frame loop. */
function EngineLabels() {
  const labeled = MARK_PIECES.map((p) => partService(p.id))
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {labeled.map((svc, i) =>
        svc ? (
          <div
            key={svc.id}
            ref={(el) => {
              labelNodes[i] = el
              return () => {
                labelNodes[i] = null
              }
            }}
            className="engine-label absolute left-0 top-0"
            style={{ opacity: 0 }}
          >
            <span>{svc.n}</span>
            {svc.short}
          </div>
        ) : null,
      )}
    </div>
  )
}

/** Hero callouts: leader lines from each part to its module name, like an assembly drawing. */
function EngineCallouts() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <svg className="absolute inset-0 h-full w-full overflow-visible">
        {MARK_PIECES.map((p, i) => (
          <g key={p.id}>
            <polyline
              ref={(el) => {
                leaderNodes[i] = el
                return () => {
                  leaderNodes[i] = null
                }
              }}
              className="engine-leader"
              style={{ opacity: 0 }}
            />
            <circle
              ref={(el) => {
                dotNodes[i] = el
                return () => {
                  dotNodes[i] = null
                }
              }}
              className="engine-dot"
              r={3.5}
              style={{ opacity: 0 }}
            />
          </g>
        ))}
      </svg>
      {MARK_PIECES.map((p, i) => {
        const svc = partService(p.id)
        return svc ? (
          <div
            key={p.id}
            ref={(el) => {
              calloutNodes[i] = el
              return () => {
                calloutNodes[i] = null
              }
            }}
            className="engine-callout absolute left-0 top-0"
            style={{ opacity: 0 }}
          >
            <span className="n">{svc.n}</span>
            <span className="t">{svc.label}</span>
          </div>
        ) : null
      })}
    </div>
  )
}

export default function EngineCanvas({ active = true, callouts = false }: { active?: boolean; callouts?: boolean }) {
  const theme = useTheme()
  return (
    <>
      <Canvas
        className="!absolute inset-0"
        style={{ pointerEvents: 'none' }}
        frameloop={active ? 'always' : 'never'}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        camera={{ fov: 22, position: [0, 0, 10], near: 0.1, far: 60 }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.NeutralToneMapping
          gl.toneMappingExposure = 1.05
          gl.setClearColor(0x000000, 0)
        }}
        aria-hidden
      >
        <Lights theme={theme} />
        <Engine theme={theme} />
      </Canvas>
      <EngineLabels />
      {callouts ? <EngineCallouts /> : null}
    </>
  )
}
