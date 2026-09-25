import { EngineStage } from '@/components/home/EngineStage'
import { Hero } from '@/components/home/Hero'
import { Problem } from '@/components/home/Problem'
import { Capabilities } from '@/components/home/Capabilities'
import { Industries } from '@/components/home/Industries'
import { Process } from '@/components/home/Process'
import { Proof } from '@/components/home/Proof'
import { Brands, Voices } from '@/components/home/Voices'
import { Why } from '@/components/home/Why'
import { ConsultCTA } from '@/components/sections/ConsultCTA'

/**
 * The homepage is one story about one engine:
 * ignition → the problem (disconnected parts) → the parts, one by one → how they meet
 * an industry → how we work → proof → trust → the conversation.
 */
export default function HomePage() {
  return (
    <>
      <EngineStage hero={<Hero />} problem={<Problem />} capabilities={<Capabilities />} />
      <Industries />
      <Process />
      <Proof />
      <Voices />
      <Brands />
      <Why />
      <ConsultCTA index="08" />
    </>
  )
}
