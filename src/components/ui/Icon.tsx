import type { SVGProps } from 'react'

type IconName =
  | 'arrow'
  | 'arrow-up-right'
  | 'arrow-down'
  | 'plus'
  | 'minus'
  | 'check'
  | 'mail'
  | 'phone'
  | 'whatsapp'
  | 'pin'
  | 'clock'
  | 'menu'
  | 'close'
  | 'chevron'
  | 'star'
  | 'calendar'
  | 'spark'
  | 'external'

const paths: Record<IconName, React.ReactNode> = {
  arrow: <path d="M4 12h15M13 6l6 6-6 6" />,
  'arrow-up-right': <path d="M7 17 17 7M9 7h8v8" />,
  'arrow-down': <path d="M12 4v15M6 13l6 6 6-6" />,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  check: <path d="m5 12.5 4.2 4.2L19 7" />,
  mail: (
    <>
      <rect x="3" y="5.5" width="18" height="13" rx="2" />
      <path d="m3.5 7 8.5 6.5L20.5 7" />
    </>
  ),
  phone: (
    <path d="M6.6 3.8 9 3.3l1.7 4.3-2.1 1.5a11 11 0 0 0 6.3 6.3l1.5-2.1 4.3 1.7-.5 2.4a2 2 0 0 1-2.2 1.6C10.4 18.3 5.7 13.6 5 6a2 2 0 0 1 1.6-2.2Z" />
  ),
  whatsapp: (
    <>
      <path d="M4.5 19.5 5.6 16A8 8 0 1 1 8.4 18.6Z" />
      <path d="M9.2 8.6c.2-.5.5-.5.8-.5h.5c.2 0 .4.1.5.4l.7 1.6c.1.3 0 .5-.1.7l-.4.5c-.1.2-.2.4 0 .6.6 1 1.4 1.8 2.4 2.3.2.1.4.1.6-.1l.6-.6c.2-.2.4-.2.6-.1l1.6.7c.3.1.4.3.4.6v.5c0 .4-.3.8-.7 1-.7.3-1.9.4-3.6-.4a9.5 9.5 0 0 1-3.8-3.7c-.8-1.5-.6-2.8-.4-3.4Z" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s-6.5-5.6-6.5-11A6.5 6.5 0 0 1 18.5 10c0 5.4-6.5 11-6.5 11Z" />
      <circle cx="12" cy="10" r="2.3" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  menu: <path d="M4 8h16M4 16h16" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  chevron: <path d="m7 10 5 5 5-5" />,
  star: <path d="m12 3.8 2.5 5.2 5.7.7-4.2 3.9 1.1 5.6L12 16.4l-5.1 2.8L8 13.6 3.8 9.7l5.7-.7Z" />,
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="15" rx="2" />
      <path d="M3.5 10h17M8 3v4M16 3v4" />
    </>
  ),
  spark: <path d="M12 3v5M12 16v5M3 12h5M16 12h5M6.3 6.3l2.9 2.9M14.8 14.8l2.9 2.9M17.7 6.3l-2.9 2.9M9.2 14.8l-2.9 2.9" />,
  external: <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />,
}

export function Icon({
  name,
  size = 18,
  strokeWidth = 1.6,
  ...rest
}: { name: IconName; size?: number; strokeWidth?: number } & SVGProps<SVGSVGElement>) {
  const filled = name === 'star'
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill={filled ? 'currentColor' : 'none'}
      stroke={filled ? 'none' : 'currentColor'}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...rest}
    >
      {paths[name]}
    </svg>
  )
}

export type { IconName }
