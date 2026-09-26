import Link from 'next/link'
import { Logo } from './Logo'
import { MarkBlueprint } from '@/components/brand/MarkBlueprint'
import { Icon } from '@/components/ui/Icon'
import { footerGroups, locationLinks, site } from '@/content/site'
import { solutions } from '@/content/data'
import { BackToTop } from './BackToTop'
import { FooterWordmark } from './FooterWordmark'

export function Footer() {
  return (
    <footer className="rails relative overflow-hidden border-t border-line bg-bg">
      <div className="shell relative z-10 pt-20 lg:pt-28">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Logo variant="full" height={64} />
            <p className="t-lede mt-8 max-w-md">{site.footerBlurb}</p>
            <ul className="mt-8 grid gap-3 text-[0.95rem]">
              <li>
                <a href={site.mapUrl} target="_blank" rel="noopener noreferrer" className="group flex gap-3 text-ink-2 hover:text-ink">
                  <Icon name="pin" size={18} className="mt-0.5 shrink-0 text-teal-ink" />
                  <span>
                    <span className="t-label block text-ink-3">{site.address.label}</span>
                    <span className="link-draw">{site.address.full}</span>
                  </span>
                </a>
              </li>
              <li>
                <a href={`mailto:${site.email}`} className="flex items-center gap-3 text-ink-2 hover:text-ink">
                  <Icon name="mail" size={18} className="text-teal-ink" />
                  <span className="link-draw">{site.email}</span>
                </a>
              </li>
              <li>
                <a href={site.phoneHref} className="flex items-center gap-3 text-ink-2 hover:text-ink">
                  <Icon name="phone" size={18} className="text-teal-ink" />
                  <span className="link-draw">{site.phone}</span>
                </a>
              </li>
            </ul>
            <ul className="mt-8 flex flex-wrap gap-2">
              {site.social.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="tag hover:border-ink hover:text-ink">
                    {s.label}
                    <Icon name="arrow-up-right" size={12} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:col-span-7">
            {footerGroups.map((g) => (
              <div key={g.title}>
                <p className="t-label mb-4 text-ink-3">{g.title}</p>
                <ul className="grid gap-2.5">
                  {g.links.map((l) => (
                    <li key={l.href + l.label}>
                      <Link href={l.href} className="link-draw text-[0.95rem] text-ink-2 hover:text-ink">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="col-span-2 sm:col-span-2">
              <Link href="/solutions" className="t-label mb-4 inline-block text-ink-3 hover:text-ink">
                Industry Solutions
              </Link>
              <ul className="grid gap-2.5 sm:grid-cols-2 sm:gap-x-6">
                {solutions.map((s) => (
                  <li key={s.slug}>
                    <Link href={`/solutions/${s.slug}`} className="link-draw text-[0.95rem] text-ink-2 hover:text-ink">
                      {s.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="t-label mb-4 text-ink-3">In Ahmedabad</p>
              <ul className="grid gap-2.5">
                {locationLinks.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="link-draw text-[0.95rem] text-ink-2 hover:text-ink">
                      {l.short}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Blueprint of the mark, drawn as the footer enters, with the name in glass beside it */}
      <div
        className="pointer-events-none relative z-0 mt-10 h-[210px] overflow-hidden sm:h-[280px] lg:mt-10 lg:h-[clamp(240px,50vh,470px)]"
        aria-hidden
      >
        <MarkBlueprint
          className="absolute right-[-18%] top-0 w-[540px] text-ink-3 sm:right-[-8%] sm:w-[700px] lg:-top-14 lg:right-[-2%] lg:w-[860px]"
          exploded={0.35}
          strokeWidth={0.8}
        />
        <div className="shell relative h-full">
          <FooterWordmark className="absolute bottom-3 left-0 text-[min(20vw,5rem)] sm:text-[min(14vw,6.4rem)] lg:bottom-4 lg:text-[min(11vw,17vh,10.5rem)]" />
        </div>
      </div>

      <div className="relative z-10 border-t border-line">
        <div className="shell flex flex-col gap-3 py-6 text-sm text-ink-3 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 {site.legalName}. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <span className="t-label hidden sm:inline">From Ahmedabad to the world</span>
            <BackToTop />
          </div>
        </div>
      </div>
    </footer>
  )
}
