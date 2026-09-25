import { cn } from '@/lib/cn'

/**
 * Mechanical counter. Every digit is a physical drum that spins one full turn before
 * settling on its value, right-to-left like an odometer. Without JS the drums rest on
 * their final values; the accessible label is always the literal figure.
 */
export function Odometer({ value, className, delay = 0 }: { value: string; className?: string; delay?: number }) {
  const chars = [...value]
  const digitCount = chars.filter((c) => /\d/.test(c)).length
  let seen = 0
  return (
    <span data-reveal="odo" className={cn('odo inline-flex items-baseline', className)} aria-label={value} role="text">
      {chars.map((c, i) => {
        if (!/\d/.test(c)) {
          return (
            <span key={i} aria-hidden className="odo-sym">
              {c}
            </span>
          )
        }
        const n = Number(c)
        const order = digitCount - 1 - seen++
        return (
          <span key={i} aria-hidden className="odo-cell">
            <span className="odo-drum" style={{ ['--n' as string]: n, ['--od' as string]: `${delay + order * 90}ms` }}>
              {'01234567890123456789'.split('').map((d, k) => (
                <span key={k}>{d}</span>
              ))}
            </span>
          </span>
        )
      })}
    </span>
  )
}
