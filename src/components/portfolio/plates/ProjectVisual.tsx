import type { Project } from '@/content/portfolio'
import { Shot } from '@/components/ui/Shot'

/** A project's plate: its whole screenshot. */
export function ProjectVisual({ p, sizes }: { p: Project; sizes: string }) {
  return <Shot src={p.image} alt={`${p.name} - ${p.category}`} sizes={sizes} quality={90} className="wi-img" />
}
