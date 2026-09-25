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

/** Only offered when there is a live engine to spin. */
export function DragHint({ className, label = 'Drag to spin the engine' }: { className?: string; label?: string }) {
  const { mode } = useStage()
  if (mode !== '3d') return null
  return (
    <p className={`t-label pointer-events-none absolute flex items-center gap-2 text-ink-3 ${className ?? ''}`}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
        <path d="M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3" strokeLinecap="round" />
        <path d="M18 3v4h-4M6 21v-4h4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {label}
    </p>
  )
}
