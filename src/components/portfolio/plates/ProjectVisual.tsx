'use client'

import Image from 'next/image'
import type { MotionScene, Project, ProjectVisual as Visual } from '@/content/portfolio'
import { Canvas, useLive } from './kit'
import { AppPlate } from './AppPlate'
import { Cottons, Doclinks, GrandSud, Krishna, Mudra, Odoo, Orkay, Rental } from './CrmPlates'
import { IndiaMart, LinkedIn, Ping, Workflow } from './FlowPlates'

const SCENES: Record<MotionScene, (p: { live: boolean }) => React.JSX.Element> = {
  cottons: Cottons,
  doclinks: Doclinks,
  'grand-sud': GrandSud,
  krishna: Krishna,
  mudra: Mudra,
  orkay: Orkay,
  odoo: Odoo,
  rental: Rental,
  linkedin: LinkedIn,
  indiamart: IndiaMart,
  ping: Ping,
  workflow: Workflow,
}

/**
 * A project's plate: its screenshot (the whole screen, with a blurred copy of it filling any
 * room left), or, for apps and solution projects, the work itself running. Live plates only
 * run while they are on screen.
 */
export function ProjectVisual({ p, sizes }: { p: Project; sizes: string }) {
  if (p.visual) return <LivePlate p={p} v={p.visual} />
  return (
    <>
      <Image src={p.image} alt="" aria-hidden fill sizes="64px" quality={60} className="wi-ambient" />
      <Image src={p.image} alt={`${p.name} - ${p.category}`} fill sizes={sizes} quality={80} className="wi-img object-contain" />
    </>
  )
}

function LivePlate({ p, v }: { p: Project; v: Visual }) {
  const { ref, live } = useLive<HTMLSpanElement>()
  const Scene = v.kind === 'motion' ? SCENES[v.scene] : null
  return (
    <span ref={ref} role="img" aria-label={`${p.name} - ${p.category}`} className="pl-live absolute inset-0 block">
      <Canvas live={live}>{v.kind === 'app' ? <AppPlate p={p} v={v} live={live} /> : Scene ? <Scene live={live} /> : null}</Canvas>
    </span>
  )
}
