import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

/** An application window for the hero figures: three lights, a title, and whatever it shows. */
export function HeroWindow({
  title,
  right,
  children,
  className,
  tone = 'light',
}: {
  title: ReactNode
  right?: ReactNode
  children: ReactNode
  className?: string
  tone?: 'light' | 'dark'
}) {
  const dark = tone === 'dark'
  return (
    <div
      className={cn(
        'overflow-hidden rounded-[18px] border shadow-[var(--shadow-float)]',
        dark ? 'border-stage-line bg-stage text-stage-ink' : 'border-line bg-raise',
        className,
      )}
    >
      <div className={cn('flex h-10 items-center gap-1.5 border-b px-4', dark ? 'border-stage-line' : 'border-line')}>
        <span className={cn('size-2.5 rounded-full', dark ? 'bg-stage-line' : 'bg-line-2')} />
        <span className={cn('size-2.5 rounded-full', dark ? 'bg-stage-line' : 'bg-line-2')} />
        <span className={cn('size-2.5 rounded-full', dark ? 'bg-stage-line' : 'bg-line-2')} />
        <span className={cn('t-label ml-3 min-w-0 truncate text-[0.62rem]', dark ? 'text-stage-ink-2' : 'text-ink-3')}>{title}</span>
        {right ? <span className="ml-auto flex shrink-0 items-center gap-2">{right}</span> : null}
      </div>
      {children}
    </div>
  )
}

/** "● Live" for a window's title bar. */
export function LiveTag({ label = 'Live', dark = false }: { label?: string; dark?: boolean }) {
  return (
    <span className={cn('t-label flex items-center gap-1.5 text-[0.58rem]', dark ? 'text-stage-ink-2' : 'text-ink-3')}>
      <span className="live-dot" aria-hidden />
      {label}
    </span>
  )
}
