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
  // services
  | 'workflow'
  | 'smartphone'
  | 'sparkles'
  | 'database'
  | 'browser'
  | 'bot'
  | 'code'
  | 'modules'
  // industries
  | 'factory'
  | 'calculator'
  | 'globe'
  | 'building'
  | 'graduation'
  | 'plane'
  | 'shield'
  | 'banknote'
  | 'layers'
  | 'medical'
  | 'users'
  | 'package'
  // hero figures
  | 'truck'
  | 'file'
  | 'bell'
  | 'send'
  | 'lock'
  | 'scan'
  | 'pulse'
  | 'bed'
  // social
  | 'linkedin'
  | 'instagram'
  | 'x'
  | 'facebook'

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
  workflow: (
    <>
      <rect x="3" y="4" width="7" height="6" rx="1.6" />
      <rect x="14" y="14" width="7" height="6" rx="1.6" />
      <path d="M6.5 10v2.5A2.5 2.5 0 0 0 9 15h5" />
    </>
  ),
  smartphone: (
    <>
      <rect x="6.5" y="2.5" width="11" height="19" rx="2.6" />
      <path d="M10.8 18.2h2.4" />
    </>
  ),
  sparkles: (
    <>
      <path d="M11 4.5 12.6 9 17 10.5l-4.4 1.6L11 16.5l-1.6-4.4L5 10.5 9.4 9Z" />
      <path d="M18 15.5v4M16 17.5h4" />
    </>
  ),
  database: (
    <>
      <ellipse cx="12" cy="6" rx="7" ry="2.6" />
      <path d="M5 6v6c0 1.4 3.1 2.6 7 2.6s7-1.2 7-2.6V6M5 12v6c0 1.4 3.1 2.6 7 2.6s7-1.2 7-2.6v-6" />
    </>
  ),
  browser: (
    <>
      <rect x="3" y="4.5" width="18" height="15" rx="2.2" />
      <path d="M3 9h18M6.4 6.8h.01M9 6.8h.01" />
    </>
  ),
  bot: (
    <>
      <rect x="4.5" y="8" width="15" height="11" rx="3" />
      <path d="M12 4.5V8M9.5 12.5v1.5M14.5 12.5v1.5M2.5 13h2M19.5 13h2" />
      <circle cx="12" cy="3.6" r="1" />
    </>
  ),
  code: <path d="m8.5 8-4 4 4 4M15.5 8l4 4-4 4M13.5 5.5l-3 13" />,
  modules: (
    <>
      <rect x="4" y="4" width="7" height="7" rx="1.6" />
      <rect x="13" y="4" width="7" height="7" rx="1.6" />
      <rect x="4" y="13" width="7" height="7" rx="1.6" />
      <rect x="13" y="13" width="7" height="7" rx="1.6" />
    </>
  ),
  factory: <path d="M3 20h18M4.5 20v-9l5 3v-3l5 3v-3l5 3v6M16 11V5h3v7" />,
  calculator: (
    <>
      <rect x="5" y="3" width="14" height="18" rx="2.2" />
      <path d="M8.5 7h7M8.5 11h.01M12 11h.01M15.5 11h.01M8.5 14.5h.01M12 14.5h.01M15.5 14.5h.01M8.5 17.5h7" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17M12 3.5c2.4 2.3 3.6 5.1 3.6 8.5s-1.2 6.2-3.6 8.5c-2.4-2.3-3.6-5.1-3.6-8.5s1.2-6.2 3.6-8.5Z" />
    </>
  ),
  building: <path d="M4 20.5h16M6 20.5V7l6-3.5L18 7v13.5M10 20.5v-4h4v4M9.5 9.5h.01M14.5 9.5h.01M9.5 13h.01M14.5 13h.01" />,
  graduation: (
    <>
      <path d="m2.5 9 9.5-4.5L21.5 9 12 13.5Z" />
      <path d="M6.5 11v4.5c0 1.4 2.5 3 5.5 3s5.5-1.6 5.5-3V11M21.5 9v5" />
    </>
  ),
  plane: <path d="M20.5 15 13.5 11V5.5a1.5 1.5 0 0 0-3 0V11l-7 4v2l7-2.2V18l-2 1.4V21l3.5-1 3.5 1v-1.6l-2-1.4v-3.2l7 2.2Z" />,
  shield: (
    <>
      <path d="M12 3.5 5 6.4v5.1c0 4.2 2.9 7.8 7 9 4.1-1.2 7-4.8 7-9V6.4Z" />
      <path d="m9 12.2 2.1 2.1 3.9-4" />
    </>
  ),
  banknote: (
    <>
      <rect x="3" y="6" width="18" height="12" rx="2.2" />
      <circle cx="12" cy="12" r="2.6" />
      <path d="M6.5 9.5h.01M17.5 14.5h.01" />
    </>
  ),
  layers: <path d="m12 3.5 8.5 4.5-8.5 4.5L3.5 8ZM3.5 12l8.5 4.5 8.5-4.5M3.5 16l8.5 4.5 8.5-4.5" />,
  medical: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="3.5" />
      <path d="M12 8v8M8 12h8" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8.5" r="3" />
      <path d="M3.5 19c.6-3 2.8-4.8 5.5-4.8s4.9 1.8 5.5 4.8M15.5 5.8a3 3 0 0 1 0 5.4M17.5 14.6c1.6.6 2.7 2.1 3 4.4" />
    </>
  ),
  package: <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9ZM4 7.5l8 4.5 8-4.5M12 12v9" />,
  truck: (
    <>
      <path d="M2.5 16.5v-10h11v10M13.5 9.5h4l3 3.5v3.5h-1.3M9 16.5h6.8M2.5 16.5h2.3" />
      <circle cx="7" cy="17" r="2" />
      <circle cx="17.6" cy="17" r="2" />
    </>
  ),
  file: <path d="M14 3.5H7a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8.5ZM14 3.5v5h5M9 13h6M9 16.5h4" />,
  bell: <path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 1.5h-15ZM10 20.5a2.2 2.2 0 0 0 4 0" />,
  send: <path d="M20.5 3.5 10 14M20.5 3.5l-6.5 17-4-6.5-6.5-4Z" />,
  lock: (
    <>
      <rect x="5" y="10.5" width="14" height="10" rx="2" />
      <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
    </>
  ),
  scan: <path d="M4 8V5.5A1.5 1.5 0 0 1 5.5 4H8M16 4h2.5A1.5 1.5 0 0 1 20 5.5V8M20 16v2.5a1.5 1.5 0 0 1-1.5 1.5H16M8 20H5.5A1.5 1.5 0 0 1 4 18.5V16M8 8.5v7M11 8.5v7M13.5 8.5v7M16 8.5v7" />,
  pulse: <path d="M3 12h4l2-5 4 10 2.5-5H21" />,
  bed: (
    <>
      <path d="M3 18.5v-12M3 14.5h18v4M21 14.5V12a2.5 2.5 0 0 0-2.5-2.5H11v5" />
      <circle cx="7" cy="11.5" r="1.8" />
    </>
  ),
  linkedin: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="3.5" />
      <path d="M8 10.5v6M8 7.6v.01M11.5 16.5v-6M11.5 13.2c0-1.6 1-2.7 2.5-2.7s2.5 1.1 2.5 2.7v3.3" />
    </>
  ),
  instagram: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="3.8" />
      <path d="M17 7v.01" />
    </>
  ),
  x: <path d="M4.5 4h4.2l10.8 16h-4.2ZM19.3 4l-6.2 7.2M10.9 12.8 4.7 20" />,
  facebook: <path d="M14.8 3.5h-2.2A3.6 3.6 0 0 0 9 7.1v2.4H6.6v3.7H9v7.3h3.7v-7.3h2.6l.6-3.7h-3.2V7.6c0-.6.4-1 1-1h2.1Z" />,
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
