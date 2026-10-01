import { process } from '@/content/home'
import { SectionHead } from '@/components/ui/SectionHead'
import { Workflow } from '@/components/sections/Workflow'

/** Chapter 4 — the seven steps from the first call to launch, and what our team does in each. */
export function Process() {
  return (
    <section className="rails section relative border-t border-line" id="process">
      <div className="shell">
        <SectionHead eyebrow={process.eyebrow} index="04" title={process.title} intro={process.intro} align="split" />
        <Workflow steps={process.steps} className="mt-14 lg:mt-[clamp(32px,7vh,84px)]" />
      </div>
    </section>
  )
}
