'use client'

import { useRef } from 'react'
import { engine } from '@/components/three/engineState'
import { useStage } from './stageContext'

/** Invisible grab surface over the engine on touch layouts: drag sideways to spin it, with inertia. */
export function EngineHandle() {
  const last = useRef({ x: 0, t: 0 })
  const { mode } = useStage()
  if (mode !== '3d') return null
  return (
    <div
      aria-hidden
      className="absolute inset-0 cursor-grab touch-pan-y active:cursor-grabbing"
      onPointerEnter={() => (engine.drag.hovering = true)}
      onPointerLeave={() => {
        engine.drag.hovering = false
        engine.drag.active = false
      }}
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId)
        engine.drag.active = true
        engine.drag.vy = 0
        last.current = { x: e.clientX, t: performance.now() }
      }}
      onPointerMove={(e) => {
        if (!engine.drag.active) return
        const now = performance.now()
        const dx = e.clientX - last.current.x
        const dt = Math.max(8, now - last.current.t) / 1000
        engine.drag.y += dx * 0.0095
        engine.drag.vy = (dx * 0.0095) / dt
        last.current = { x: e.clientX, t: now }
      }}
      onPointerUp={(e) => {
        engine.drag.active = false
        e.currentTarget.releasePointerCapture(e.pointerId)
      }}
    />
  )
}
