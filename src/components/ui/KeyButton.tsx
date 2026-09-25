import Link from 'next/link'
import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { Icon, type IconName } from './Icon'

type Variant = 'key' | 'teal' | 'ghost' | 'stage' | 'stage-ghost'

const variantClass: Record<Variant, string> = {
  key: '',
  teal: 'btn-teal',
  ghost: 'btn-ghost',
  stage: 'btn-on-stage',
  'stage-ghost': 'btn-ghost btn-stage-ghost',
}

/** Arrow socket: two arrows swap places on hover. */
function Socket({ icon }: { icon: IconName }) {
  return (
    <span className="btn-socket" aria-hidden>
      <Icon name={icon} size={16} strokeWidth={1.9} />
      <Icon name={icon} size={16} strokeWidth={1.9} />
    </span>
  )
}

type Common = {
  children: ReactNode
  variant?: Variant
  size?: 'md' | 'sm'
  icon?: IconName | null
  className?: string
}

/** The machined "keycap" button: presses down on click, arrow swaps on hover. */
export function KeyButton({
  href,
  children,
  variant = 'key',
  size = 'md',
  icon = 'arrow',
  className,
  external,
  ...rest
}: Common & { href: string; external?: boolean } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'children'>) {
  const cls = cn('btn', variantClass[variant], size === 'sm' && 'btn-sm', !icon && 'px-5', className)
  const inner = (
    <>
      <span>{children}</span>
      {icon ? <Socket icon={icon} /> : null}
    </>
  )
  const isExternal = external ?? /^(https?:|mailto:|tel:)/.test(href)
  if (isExternal) {
    return (
      <a href={href} className={cls} {...(/^https?:/.test(href) ? { target: '_blank', rel: 'noopener noreferrer' } : {})} {...rest}>
        {inner}
      </a>
    )
  }
  return (
    <Link href={href} className={cls} {...rest}>
      {inner}
    </Link>
  )
}

export function KeyAction({
  children,
  variant = 'key',
  size = 'md',
  icon = 'arrow',
  className,
  ...rest
}: Common & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={cn('btn', variantClass[variant], size === 'sm' && 'btn-sm', !icon && 'px-5', className)} {...rest}>
      <span>{children}</span>
      {icon ? <Socket icon={icon} /> : null}
    </button>
  )
}

/** Quiet text link with an arrow that nudges on hover. */
export function ArrowLink({
  href,
  children,
  className,
  tone = 'ink',
}: {
  href: string
  children: ReactNode
  className?: string
  tone?: 'ink' | 'teal'
}) {
  const external = /^(https?:|mailto:|tel:)/.test(href)
  const cls = cn('group inline-flex items-center gap-2 font-medium', tone === 'teal' ? 'text-teal-ink' : 'text-ink', className)
  const body = (
    <>
      <span className="link-draw">{children}</span>
      <Icon
        name={external && /^https?:/.test(href) ? 'arrow-up-right' : 'arrow'}
        size={16}
        className="transition-transform duration-500 ease-[var(--ease-out)] group-hover:translate-x-1"
      />
    </>
  )
  if (external)
    return (
      <a href={href} className={cls} {...(/^https?:/.test(href) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
        {body}
      </a>
    )
  return (
    <Link href={href} className={cls}>
      {body}
    </Link>
  )
}
