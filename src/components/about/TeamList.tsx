import Image from 'next/image'
import { SectionHead } from '@/components/ui/SectionHead'
import { media, site } from '@/content/site'
import { cn } from '@/lib/cn'

type Person = { name: string; role: string; photo: string; bio: string }

/** A portrait in a plain rectangular frame, in colour, at one steady size. */
function Portrait({ p, large = false }: { p: Person; large?: boolean }) {
  return (
    <span
      className={cn(
        'relative block shrink-0 overflow-hidden rounded-[12px] bg-sink ring-1 ring-line',
        large ? 'h-[clamp(92px,15vh,112px)] w-[clamp(76px,12.4vh,92px)]' : 'h-[clamp(80px,13vh,96px)] w-[clamp(66px,10.7vh,78px)]',
      )}
    >
      <Image
        src={media(p.photo)}
        alt={`${p.name}, ${p.role}`}
        fill
        sizes="96px"
        quality={90}
        className="object-cover object-[center_18%]"
      />
    </span>
  )
}

/**
 * The team: the founder first, across the width, then the founding team as a grid of
 * cards. Every card shows the person's photo, name, role and a line about them.
 */
export function TeamList({
  eyebrow,
  title,
  intro,
  founder,
  groupLabel,
  members,
  join,
}: {
  eyebrow: string
  title: string
  intro: string
  founder: Person
  groupLabel: string
  members: Person[]
  join: string
}) {
  return (
    <section className="rails relative border-b border-line py-[clamp(30px,5.2vh,110px)]" id="team">
      <div className="shell">
        <SectionHead eyebrow={eyebrow} title={title} intro={intro} align="split">
          <p className="mt-3 text-[0.95rem] text-ink-2">
            {join}{' '}
            <a href={`mailto:${site.email}`} className="link-under text-ink">
              {site.email} →
            </a>
          </p>
        </SectionHead>

        {/* the founder */}
        <article
          className="team-card mt-[clamp(14px,2.6vh,40px)] grid items-center gap-x-6 gap-y-3 rounded-[20px] border border-line bg-raise p-[clamp(12px,2vh,18px)] sm:grid-cols-[auto_minmax(0,1fr)] lg:grid-cols-[auto_minmax(0,0.8fr)_minmax(0,2fr)]"
          data-reveal="rise"
        >
          <Portrait p={founder} large />
          <div>
            <p className="t-label text-teal-ink">{founder.role}</p>
            <h3 className="mt-1 font-display text-[clamp(1.3rem,min(2vw,3.8vh),1.7rem)] font-[700] leading-tight tracking-[-0.025em]">
              {founder.name}
            </h3>
          </div>
          <p className="text-[0.94rem] leading-[1.55] text-ink-2 sm:col-span-2 lg:col-span-1">{founder.bio}</p>
        </article>

        {/* the founding team */}
        <p className="t-label mt-[clamp(12px,2.2vh,28px)] text-ink-3">{groupLabel}</p>
        <ul className="mt-[clamp(8px,1.4vh,12px)] grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((m, k) => (
            <li
              key={m.name}
              className="team-card flex gap-4 rounded-[18px] border border-line bg-raise p-[clamp(10px,1.8vh,14px)]"
              data-reveal="rise"
              style={{ ['--d' as string]: `${(k % 3) * 80}ms` }}
            >
              <Portrait p={m} />
              <div className="min-w-0 py-0.5">
                <p className="flex flex-wrap items-baseline gap-x-2">
                  <span className="text-[1.02rem] font-semibold tracking-[-0.012em]">{m.name}</span>
                  <span className="t-label text-ink-3">{m.role}</span>
                </p>
                <p className="mt-1 text-[0.84rem] leading-[1.5] text-ink-2">{m.bio}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
