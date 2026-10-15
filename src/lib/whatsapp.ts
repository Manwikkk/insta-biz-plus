import { site } from '@/content/site'

/** The first line of a chat started from the site. */
export const HELLO = "Hi Insta Biz Web, I'd like to discuss a project."

/** A chat with the team on WhatsApp, its first message already written. */
export const waHref = (text: string) => `${site.whatsapp}?text=${encodeURIComponent(text)}`

/** What a visitor typed into a form, as one message the team can act on straight away. */
export function leadMessage(l: { name?: string; email?: string; phone?: string; needs?: string[]; timeline?: string; subject?: string; message?: string }) {
  return [
    `Hi Insta Biz Web! I'm ${l.name?.trim() || 'getting in touch'} and I'd like to discuss a project.`,
    l.needs?.length ? `Need: ${l.needs.join(', ')}` : '',
    l.timeline ? `Start: ${l.timeline}` : '',
    l.subject?.trim() ? `Subject: ${l.subject.trim()}` : '',
    l.message?.trim() ? `\n${l.message.trim()}\n` : '',
    [l.email?.trim() && `Email: ${l.email.trim()}`, l.phone?.trim() && `Phone: ${l.phone.trim()}`].filter(Boolean).join(' · '),
  ]
    .filter(Boolean)
    .join('\n')
}
