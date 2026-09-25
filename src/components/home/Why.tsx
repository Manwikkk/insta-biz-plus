import Link from 'next/link'
import { why } from '@/content/home'
import { SectionHead } from '@/components/ui/SectionHead'
import { Odometer } from '@/components/ui/Odometer'
import { Icon } from '@/components/ui/Icon'

/** Chapter 7 — why one partner. Four pillars read like a spec sheet. */
export function Why() {
  return (
    <section className="rails section relative" id="why">
      <div className="shell">
        <SectionHead eyebrow={why.eyebrow} index="07" title={why.title} intro={why.intro} align="split">
          <Link
            href="/about-us"
            className="group mt-[clamp(16px,3.4vh,32px)] inline-flex items-center gap-4 rounded-[12px] border border-line bg-raise py-3 pl-3 pr-5"
          >
            <span className="flex -space-x-2">
              {['#0aa2b5', '#1b4480', '#0b0f15'].map((c, i) => (
                <span
                  key={i}
                  className="size-8 border-2 border-raise [clip-path:polygon(50%_0,100%_25%,100%_75%,50%_100%,0_75%,0_25%)]"
                  style={{ background: c }}
                />
              ))}
            </span>
            <span>
              <span className="block text-[0.95rem] font-semibold">{why.team.label}</span>
              <span className="t-small block">{why.team.note}</span>
            </span>
            <Icon name="arrow" size={16} className="ml-2 transition-transform group-hover:translate-x-1" />
          </Link>
        </SectionHead>

        <ul className="cells mt-16 grid-cols-1 sm:grid-cols-2 lg:mt-[clamp(28px,6vh,80px)] lg:grid-cols-4">
          {why.pillars.map((p, i) => (
            <li
              key={p.label}
              className="group relative p-6 transition-colors duration-500 hover:bg-raise sm:p-8 lg:py-[clamp(20px,4vh,32px)]"
              data-reveal="rise"
              style={{ ['--d' as string]: `${i * 90}ms` }}
            >
              <p className="t-label text-ink-3">
                {String(i + 1).padStart(2, '0')} · {p.label}
              </p>
              <p className="t-num mt-8 text-[clamp(2.4rem,min(4.4vw,7.4vh),4.2rem)] lg:mt-[clamp(14px,3.4vh,32px)]">
                <Odometer value={p.value} delay={i * 110} />
              </p>
              <h3 className="t-h4 mt-8 lg:mt-[clamp(14px,3.4vh,32px)]">{p.title}</h3>
              <p className="t-small mt-2 text-ink-2">{p.body}</p>
              <span className="absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 bg-teal transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-x-100" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
