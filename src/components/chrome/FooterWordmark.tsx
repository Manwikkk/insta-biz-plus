import { cn } from '@/lib/cn'

/**
 * The name, set big and quiet beside the footer's blueprint: two soft tints of the brand
 * colours, no effects, no motion.
 */
export function FooterWordmark({ className }: { className?: string }) {
  return (
    <p className={cn('footer-mark', className)} aria-hidden>
      <span className="footer-mark-a block">Insta</span>
      <span className="footer-mark-a block">Biz</span>
      <span className="footer-mark-b block">Web</span>
    </p>
  )
}
