import { KeyButton } from '@/components/ui/KeyButton'
import { site } from '@/content/site'
import { leadMessage, waHref } from '@/lib/whatsapp'
import { cn } from '@/lib/cn'

/**
 * When a form cannot be delivered, nothing the visitor wrote is lost: it goes to the team over
 * WhatsApp or email instead, already written out, in one tap.
 */
export function LeadFallback({
  error,
  lead,
  tone = 'light',
  className,
}: {
  error: string
  lead: Parameters<typeof leadMessage>[0]
  tone?: 'light' | 'stage'
  className?: string
}) {
  const stage = tone === 'stage'
  const text = leadMessage(lead)
  const subject = lead.subject?.trim() || `New project enquiry${lead.name?.trim() ? ` from ${lead.name.trim()}` : ''}`
  return (
    <div role="alert" className={cn('rounded-[12px] border border-ember/50 bg-ember/10 px-4 py-3.5 text-[0.9rem]', className)}>
      <p className={stage ? 'text-stage-ink' : 'text-ink'}>{error}</p>
      <p className={cn('mt-1', stage ? 'text-stage-ink-2' : 'text-ink-2')}>Nothing you wrote is lost: send it straight to the team.</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <KeyButton href={waHref(text)} size="sm" variant="teal" icon="whatsapp">
          Send on WhatsApp
        </KeyButton>
        <KeyButton
          href={`mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`}
          size="sm"
          variant={stage ? 'stage-ghost' : 'ghost'}
          icon="mail"
        >
          Email it instead
        </KeyButton>
      </div>
    </div>
  )
}
