import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { SplitReveal } from '@/components/motion/SplitReveal'

/** Section label: a numbered chip (or a small dot) and the name. */
export function Eyebrow({ children, className, index }: { children: ReactNode; className?: string; index?: string }) {
  return (
    <p className={cn('eyebrow t-label', className)}>
      {index ? <span className="eyebrow-n">{index}</span> : <span className="eyebrow-dot" aria-hidden />}
      <span>{children}</span>
    </p>
  )
}

/**
 * Section heading block: eyebrow, a line-masked headline and an optional intro.
 * `align="split"` puts the intro in a second column on wide screens.
 */
export function SectionHead({
  eyebrow,
  index,
  title,
  intro,
  align = 'left',
  size = 'h2',
  className,
  titleClassName,
  as = 'h2',
  children,
}: {
  eyebrow?: ReactNode
  index?: string
  title: ReactNode
  intro?: ReactNode
  align?: 'left' | 'center' | 'split'
  size?: 'h2' | 'display'
  className?: string
  titleClassName?: string
  as?: 'h1' | 'h2' | 'h3'
  children?: ReactNode
}) {
  const titleCls = cn(size === 'display' ? 't-display' : 't-h2', titleClassName)
  if (align === 'split') {
    return (
      <div className={cn('grid gap-8 lg:grid-cols-12 lg:items-end', className)}>
        <div className="lg:col-span-7">
          {eyebrow ? (
            <Eyebrow index={index} className="mb-6">
              {eyebrow}
            </Eyebrow>
          ) : null}
          <SplitReveal as={as} className={titleCls}>
            {title}
          </SplitReveal>
        </div>
        {intro || children ? (
          <div className="lg:col-span-4 lg:col-start-9" data-reveal="rise" style={{ ['--d' as string]: '120ms' }}>
            {intro ? <p className="t-lede">{intro}</p> : null}
            {children}
          </div>
        ) : null}
      </div>
    )
  }
  return (
    <div className={cn(align === 'center' && 'mx-auto max-w-3xl text-center', className)}>
      {eyebrow ? (
        <Eyebrow index={index} className={cn('mb-6', align === 'center' && 'justify-center')}>
          {eyebrow}
        </Eyebrow>
      ) : null}
      <SplitReveal as={as} className={titleCls}>
        {title}
      </SplitReveal>
      {intro ? (
        <p
          className={cn('t-lede mt-6 max-w-2xl', align === 'center' && 'mx-auto')}
          data-reveal="rise"
          style={{ ['--d' as string]: '140ms' }}
        >
          {intro}
        </p>
      ) : null}
      {children}
    </div>
  )
}
