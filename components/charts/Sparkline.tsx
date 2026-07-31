import type { SeriesPoint } from '@/data/markets'

/**
 * Winziger Kursverlauf als reines Inline-SVG.
 *
 * Absichtlich ohne Chart-Bibliothek: Diese Grafik steht auf der Startseite im
 * sichtbaren Bereich. Eine Server-gerenderte SVG-Kurve braucht kein JavaScript,
 * belastet den Largest Contentful Paint nicht und funktioniert auch ohne
 * Hydration.
 */
export function Sparkline({
  points,
  positive,
  className = 'h-14 w-full',
  strokeWidth = 1.75,
}: {
  points: readonly SeriesPoint[]
  /** Steuert die Farbe: aufwärts grün, abwärts rot. */
  positive: boolean
  className?: string
  strokeWidth?: number
}) {
  if (points.length < 2) return null

  // Festes Koordinatensystem; die Skalierung übernimmt später preserveAspectRatio.
  const width = 100
  const height = 32
  const padding = 2

  const values = points.map((point) => point.value)
  const min = Math.min(...values)
  const max = Math.max(...values)
  const span = max - min || 1

  const coordinates = points.map((point, index) => {
    const x = (index / (points.length - 1)) * width
    const y = padding + (1 - (point.value - min) / span) * (height - padding * 2)
    return `${x.toFixed(2)},${y.toFixed(2)}`
  })

  const line = `M${coordinates.join(' L')}`
  const area = `${line} L${width},${height} L0,${height} Z`
  const color = positive ? 'var(--c-success)' : 'var(--c-danger)'
  // Eindeutige ID, damit mehrere Sparklines auf einer Seite nicht kollidieren.
  const gradientId = `spark-${positive ? 'up' : 'down'}-${points[0].t}-${points.length}`

  /*
    `data-fliesst` markiert eine Zeichnung, die Kurse zeigt und sich damit bei
    jedem Abruf ändert. `scripts/referenzbilder.mjs` deckt solche Stellen vor
    dem Einfrieren ab – ohne das wäre jedes Referenzbild binnen einer halben
    Stunde veraltet und die Prüfung nach einem Tag abgeschaltet.
  */
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
      data-fliesst=""
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gradientId})`} />
      <path
        d={line}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}
