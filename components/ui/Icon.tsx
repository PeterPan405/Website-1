import type { ReactNode } from 'react'

/**
 * Kleines eigenes Icon-Set.
 *
 * Bewusst ohne Icon-Bibliothek: So landen nur die tatsächlich genutzten Pfade
 * im Bundle, und Icons sind auch in Server Components verwendbar.
 */

export type IconName =
  | 'menu'
  | 'close'
  | 'chevron-down'
  | 'chevron-right'
  | 'arrow-right'
  | 'arrow-left'
  | 'sun'
  | 'moon'
  | 'check'
  | 'check-circle'
  | 'trending-up'
  | 'trending-down'
  | 'calculator'
  | 'book'
  | 'newspaper'
  | 'chart'
  | 'globe'
  | 'expand'
  | 'compress'
  | 'scale'
  | 'sparkles'
  | 'info'
  | 'warning'
  | 'lightbulb'
  | 'target'
  | 'wallet'
  | 'shield'
  | 'compass'
  | 'pause'
  | 'play'
  | 'mail'
  | 'clock'
  | 'layers'
  | 'bookmark'
  | 'download'
  | 'phone'
  | 'search'
  | 'youtube'
  | 'instagram'

const paths: Record<IconName, ReactNode> = {
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  'chevron-down': <path d="m6 9 6 6 6-6" />,
  'chevron-right': <path d="m9 6 6 6-6 6" />,
  'arrow-right': <path d="M4 12h16m0 0-6-6m6 6-6 6" />,
  'arrow-left': <path d="M20 12H4m0 0 6-6m-6 6 6 6" />,
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4" />
    </>
  ),
  moon: <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a7 7 0 1 0 10.5 10.5Z" />,
  check: <path d="m5 13 4 4L19 7" />,
  'check-circle': (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12.5 2.5 2.5 4.5-5" />
    </>
  ),
  'trending-up': <path d="M3 17l6-6 4 4 8-8m0 0h-5m5 0v5" />,
  'trending-down': <path d="M3 7l6 6 4-4 8 8m0 0h-5m5 0v-5" />,
  calculator: (
    <>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M8 7h8M8 11h1m3 0h1m3 0h1M8 15h1m3 0h1m3 0h1M8 18h5" />
    </>
  ),
  book: (
    <>
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H19v15H6.5A2.5 2.5 0 0 0 4 20.5Z" />
      <path d="M4 20.5A2.5 2.5 0 0 1 6.5 18H19v3H6.5" />
    </>
  ),
  newspaper: (
    <>
      <path d="M4 5h13v14a2 2 0 0 0 2 2H6a2 2 0 0 1-2-2Z" />
      <path d="M17 8h2a2 2 0 0 1 2 2v9M7 9h7M7 13h7M7 17h4" />
    </>
  ),
  chart: (
    <>
      <path d="M4 4v16h16" />
      <path d="m7 15 3.5-4.5 3 2.5L20 6" />
    </>
  ),
  expand: (
    <>
      <path d="M4 9V4h5" />
      <path d="M20 9V4h-5" />
      <path d="M4 15v5h5" />
      <path d="M20 15v5h-5" />
    </>
  ),
  compress: (
    <>
      <path d="M9 4v5H4" />
      <path d="M15 4v5h5" />
      <path d="M9 20v-5H4" />
      <path d="M15 20v-5h5" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      {/* Ein Längen- und ein Breitenkreis genügen: Mehr Linien werden bei
          20 Pixeln Kantenlänge zu einem grauen Fleck. */}
      <path d="M3 12h18" />
      <path d="M12 3a15 15 0 0 1 0 18a15 15 0 0 1 0-18" />
    </>
  ),
  scale: (
    <>
      <path d="M12 4v16M7 20h10M5 8h14M5 8l-2.5 5h5L5 8Zm14 0-2.5 5h5L19 8Z" />
    </>
  ),
  sparkles: (
    <>
      <path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3Z" />
      <path d="M18 15l.8 2.2L21 18l-2.2.8L18 21l-.8-2.2L15 18l2.2-.8L18 15Z" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5m0-8.5v.5" />
    </>
  ),
  warning: <path d="M12 4 2.8 20h18.4L12 4Zm0 5v6m0 3v.5" />,
  lightbulb: (
    <>
      <path d="M9 17h6M10 21h4" />
      <path d="M12 3a6 6 0 0 0-3.5 10.9c.3.2.5.6.5 1V17h6v-2.1c0-.4.2-.8.5-1A6 6 0 0 0 12 3Z" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4" />
      <path d="M12 12h.01" />
    </>
  ),
  wallet: (
    <>
      <path d="M4 8a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" />
      <path d="M16 12h3v4h-3a2 2 0 0 1 0-4Z" />
    </>
  ),
  shield: <path d="M12 3l8 3v6c0 4.4-3.2 7.9-8 9-4.8-1.1-8-4.6-8-9V6l8-3Z" />,
  compass: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m15 9-2 4-4 2 2-4 4-2Z" />
    </>
  ),
  pause: <path d="M9 5v14M15 5v14" />,
  play: <path d="M7 4.5v15l13-7.5-13-7.5Z" />,
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </>
  ),
  layers: <path d="m12 3 9 5-9 5-9-5 9-5Zm9 9-9 5-9-5m18 4-9 5-9-5" />,
  // Lesezeichen für die Merkliste – gefüllt wirkt es nur über `fill` am Aufruf.
  bookmark: (
    <path d="M6 4.5A1.5 1.5 0 0 1 7.5 3h9A1.5 1.5 0 0 1 18 4.5V21l-6-4.2L6 21V4.5Z" />
  ),
  download: (
    <>
      <path d="M12 4v11m0 0 4-4m-4 4-4-4" />
      <path d="M4 17v1a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-1" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </>
  ),
  phone: (
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z" />
  ),
  /*
    Die beiden folgenden Zeichen sind nicht die offiziellen Markenlogos, sondern
    Umrisse im Stil der übrigen Icons. Das ist Absicht: Sie fügen sich in die
    Fußzeile ein und übernehmen deren Farbe. Die echten Logos unterliegen
    Gestaltungsvorgaben der Plattformen und dürften nicht eingefärbt werden.
  */
  youtube: (
    <>
      <path d="M2.5 17a24 24 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.5 49.5 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24 24 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.5 49.5 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <path d="m10 15 5-3-5-3Z" />
    </>
  ),
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="3.75" />
      {/*
        Der Punkt oben rechts entsteht aus einem Pfad ohne Länge: Mit
        strokeLinecap="round" zeichnet er einen Kreis in Strichstärke. Ein
        <circle> wäre hier ein Ring, weil das SVG grundsätzlich ohne Füllung
        arbeitet.
      */}
      <path d="M16.9 7.1h.01" />
    </>
  ),
}

export interface IconProps {
  name: IconName
  className?: string
  /**
   * Wenn das Icon eine eigene Bedeutung trägt (z. B. als einziger Inhalt eines
   * Buttons), hier einen Text übergeben. Ohne `label` wird das Icon als
   * dekorativ markiert und von Screenreadern übersprungen.
   */
  label?: string
  strokeWidth?: number
  /** Für flächige Icons wie `play`. */
  filled?: boolean
}

export function Icon({
  name,
  className = 'size-5',
  label,
  strokeWidth = 1.75,
  filled = false,
}: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill={filled ? 'currentColor' : 'none'}
      stroke={filled ? 'none' : 'currentColor'}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      {paths[name]}
    </svg>
  )
}
