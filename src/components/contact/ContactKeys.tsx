'use client'

import { useEffect, useState } from 'react'
import { site } from '@/content/site'
import { Icon, type IconName } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'

/** Open or closed right now, in Ahmedabad (Mon-Fri 9-6, Sat 10-4); null until mounted so server and client agree. */
function useOpen() {
  const [now, setNow] = useState<{ open: boolean; time: string } | null>(null)
  useEffect(() => {
    const read = () => {
      const p = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date())
      const get = (t: string) => p.find((x) => x.type === t)?.value ?? ''
      const h = Number(get('hour')) + Number(get('minute')) / 60
      const day = get('weekday')
      const open = day === 'Sun' ? false : day === 'Sat' ? h >= 10 && h < 16 : h >= 9 && h < 18
      setNow({ open, time: `${get('hour')}:${get('minute')}` })
    }
    read()
    const id = window.setInterval(read, 30000)
    return () => window.clearInterval(id)
  }, [])
  return now
}

function Row({ icon, kind, value, note, href, onClick, done, id }: { icon: IconName; kind: string; value: string; note?: React.ReactNode; href?: string; onClick?: () => void; done?: boolean; id?: string }) {
  const body = (
    <>
      <span className="ct-key-icon">
        <Icon name={done ? 'check' : icon} size={18} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="t-label block text-ink-3 transition-colors duration-500 group-hover:text-bg/60">{kind}</span>
        <span className="mt-0.5 block truncate text-[1.05rem] font-semibold tracking-[-0.01em]">{done ? 'Copied to clipboard' : value}</span>
      </span>
      {note ? <span className="t-label hidden shrink-0 text-ink-3 transition-colors duration-500 group-hover:text-bg/60 sm:block">{note}</span> : null}
      <Icon name={onClick ? 'plus' : 'arrow-up-right'} size={16} className="shrink-0 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </>
  )
  const cls = 'ct-key group'
  if (onClick)
    return (
      <button id={id} type="button" onClick={onClick} className={cls} aria-label={`Copy ${value}`}>
        {body}
      </button>
    )
  return (
    <a id={id} href={href} className={cls} {...(/^https?:/.test(href ?? '') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
      {body}
    </a>
  )
}

/**
 * Every way in, as keys: the email (copied with a tap), WhatsApp, a call with whether we are
 * open right now, and the office for directions. No map - just the way there.
 */
export function ContactKeys() {
  const now = useOpen()
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(site.email)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      window.location.href = `mailto:${site.email}`
    }
  }
  return (
    <div id="reach-us" className="grid scroll-mt-28 gap-2">
      <Row icon="mail" kind="Email" value={site.email} note="Tap to copy" onClick={copy} done={copied} />
      <Row icon="whatsapp" kind="WhatsApp" value="Chat with the team" note="Voice notes welcome" href={site.whatsapp} />
      <Row
        icon="phone"
        kind="Call"
        value={site.phone}
        href={site.phoneHref}
        note={
          now ? (
            <span className="inline-flex items-center gap-1.5">
              <span className={cn('size-1.5 rounded-full', now.open ? 'bg-teal' : 'bg-ember')} />
              {now.open ? `Open · ${now.time} IST` : 'Closed · we reply first thing'}
            </span>
          ) : null
        }
      />
      <Row id="visit-us" icon="pin" kind="Visit" value="Swanik Arcade, Naranpura" note="Ahmedabad · directions" href={site.mapUrl} />
    </div>
  )
}
