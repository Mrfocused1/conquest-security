import type { SVGProps } from 'react'

const PATHS: Record<string, string> = {
  dashboard: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
  content: 'M12 3 3 8l9 5 9-5-9-5zM3 13l9 5 9-5M3 17l9 5 9-5',
  hero: 'M4 5h16v14H4zM4 9h16',
  trusted: 'M12 3l8 4v5c0 5-3.5 7.5-8 9-4.5-1.5-8-4-8-9V7l8-4zM9 12l2 2 4-4',
  services: 'M4 5h6v6H4zM14 5h6v6h-6zM4 15h6v4H4zM14 13h6v6h-6z',
  impact: 'M4 20V12M10 20V5M16 20v-9M22 20H2',
  cta: 'M3 11l13-5v12L3 13zM3 11v3a2 2 0 0 0 2 2h1M9 18l1 3',
  footer: 'M4 5h16v14H4zM4 15h16',
  navigation: 'M4 6h16M4 12h16M4 18h16',
  pages: 'M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9zM14 3v6h6',
  blog: 'M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z',
  media: 'M3 5h18v14H3zM3 16l5-5 4 4 3-3 5 5M9 9.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z',
  forms: 'M9 3h6v3H9zM7 5H5v16h14V5h-2M9 11h6M9 15h4',
  settings:
    'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 13.5l1.5 1.2-1.5 2.6-1.9-.5a6.6 6.6 0 0 1-1.6.9L15 20h-3l-.4-1.8a6.6 6.6 0 0 1-1.6-.9l-1.9.5L6.6 15l1.5-1.2a6.7 6.7 0 0 1 0-1.8L6.6 10.8l1.5-2.6 1.9.5c.5-.4 1-.7 1.6-.9L12 6h3l.4 1.8c.6.2 1.1.5 1.6.9l1.9-.5 1.5 2.6-1.5 1.2c.1.6.1 1.2 0 1.8z',
  users:
    'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8',
  audit: 'M9 6h11M9 12h11M9 18h7M4 6h.01M4 12h.01M4 18h.01',
  search: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.3-4.3',
  bell: 'M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0',
  moon: 'M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z',
  external: 'M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3',
  plus: 'M12 5v14M5 12h14',
  dots: 'M12 6h.01M12 12h.01M12 18h.01',
  grip: 'M9 6h.01M9 12h.01M9 18h.01M15 6h.01M15 12h.01M15 18h.01',
  trash: 'M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6',
  copy: 'M9 9h10v10H9zM5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1',
  eye: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7zM15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z',
  back: 'M19 12H5M12 19l-7-7 7-7',
  check: 'M20 6 9 17l-5-5',
  chevronDown: 'm6 9 6 6 6-6',
  chevronRight: 'm9 6 6 6-6 6',
  profile: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0z',
  shield: 'M12 2 4 5v6c0 5 8 11 8 11s8-6 8-11V5zM9 12l2 2 4-4',
  target: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2z',
  lock: 'M5 11h14v10H5zM8 11V7a4 4 0 0 1 8 0v4M12 15v3',
  upload: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2',
  building: 'M5 21V5a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v16M15 9h3a1 1 0 0 1 1 1v11M8 8h2M8 12h2M8 16h2',
  award: 'M12 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12zM9 14l-2 7 5-3 5 3-2-7',
  layout: 'M3 5h18v14H3zM9 5v14M3 12h6',
  reset: 'M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5',
}

type IconProps = Omit<SVGProps<SVGSVGElement>, 'stroke'> & {
  name: keyof typeof PATHS | string
  size?: number
  strokeW?: number
}

export function Icon({ name, size = 20, strokeW = 1.6, className, ...rest }: IconProps) {
  const d = PATHS[name] ?? ''
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeW}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...rest}
    >
      <path d={d} />
    </svg>
  )
}

/** Conquest "C" shield mark (filled). */
export function Mark({ className, size = 28 }: { className?: string; size?: number }) {
  return (
    <svg
      viewBox="0 0 200 240"
      width={size}
      height={(size * 240) / 200}
      className={className}
      aria-hidden="true"
    >
      <path
        d="M16 32 Q16 14 34 14 L166 14 Q184 14 184 32 L184 92 L162 92 L162 56 L58 56 L58 184 L162 184 L162 148 L184 148 L184 168 L168 184 L100 226 L16 168 Z"
        fill="currentColor"
      />
    </svg>
  )
}
