import type { Metadata } from 'next'
import { buildMetadata, pageJsonLd } from '@/lib/seo'
import { JsonLd } from '@/components/seo/JsonLd'
import { Eyebrow } from '@/components/ui/SectionHead'
import { SplitReveal } from '@/components/motion/SplitReveal'
import { AboutHero } from '@/components/about/AboutHero'
import { StoryFill } from '@/components/about/StoryFill'
import { Rooted } from '@/components/about/Rooted'
import { Drives } from '@/components/about/Drives'
import { Journey } from '@/components/about/Journey'
import { BrandWall } from '@/components/about/BrandWall'
import { WayFlow } from '@/components/about/WayFlow'
import { OfficeCard } from '@/components/about/OfficeCard'
import { BriefClose } from '@/components/about/BriefClose'
import { ConsultCTA } from '@/components/sections/ConsultCTA'
import { about as a } from '@/content/about'

export const metadata: Metadata = buildMetadata('/about-us')

/**
 * Who we are, in order: the line that opens onto the studio, the story, where we are and
 * who we build for, what drives us, the road from 2020, the brands, how we work, the office,
 * and the way in.
 */
export default function AboutPage() {
  return (
    <>
      <JsonLd data={pageJsonLd('/about-us')} />
      <AboutHero />
      <StoryFill />
      <Rooted />
      <Drives />
      <Journey />
      <BrandWall />
      <WayFlow />

      {/* the office: the address, the time there right now, and the ways to come by */}
      <section className="rails relative border-b border-line py-[clamp(72px,12vh,150px)]" id="office">
        <div className="shell">
          <div className="grid gap-4 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <Eyebrow>{a.office.eyebrow}</Eyebrow>
              <SplitReveal className="t-h2 mt-[clamp(10px,2vh,18px)]">{a.office.title}</SplitReveal>
            </div>
            <p className="t-lede lg:col-span-4 lg:col-start-9" data-reveal="rise">
              {a.office.intro}
            </p>
          </div>
          <div className="mt-[clamp(28px,5vh,56px)]">
            <OfficeCard />
          </div>
        </div>
      </section>

      <BriefClose />
      <ConsultCTA />
    </>
  )
}
