import Link from 'next/link'
import { MarkBlueprint } from '@/components/brand/MarkBlueprint'
import { KeyButton } from '@/components/ui/KeyButton'
import { primaryNav } from '@/content/site'

export default function NotFound() {
  return (
    <section className="rails relative flex min-h-[100svh] items-center overflow-hidden">
      <div aria-hidden className="absolute inset-0 [mask-image:radial-gradient(60%_60%_at_70%_50%,#000,transparent)]">
        <div className="iso-grid" />
      </div>
      <div className="shell relative grid gap-12 py-32 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-6">
          <p className="t-label text-ink-3">Error 404 · Part not found</p>
          <h1 className="mt-6 font-display text-[clamp(3rem,7vw,6.5rem)] font-[780] leading-[0.92] tracking-[-0.045em] [font-stretch:112%]">
            This page isn’t part of the engine.
          </h1>
          <p className="t-lede mt-6 max-w-md">The link may be old or mistyped. Everything we build is one click away from here.</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <KeyButton href="/">Back to home</KeyButton>
            <KeyButton href="/contact-us" variant="ghost" icon={null}>
              Contact us
            </KeyButton>
          </div>
          <ul className="mt-12 flex flex-wrap gap-x-6 gap-y-2">
            {primaryNav.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="link-draw text-ink-2 hover:text-ink">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-5 lg:col-start-8">
          <MarkBlueprint exploded={1.1} className="mx-auto w-[min(80vw,440px)] text-ink-3" />
        </div>
      </div>
    </section>
  )
}
