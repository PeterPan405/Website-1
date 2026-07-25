/**
 * Gemeinsame Chart-Einstellungen.
 *
 * Farben werden als CSS-Variablen übergeben, nicht als Hex-Werte. SVG löst
 * `var(--...)` genauso auf wie HTML – dadurch folgen alle Diagramme automatisch
 * dem Hell-/Dunkelmodus, ohne dass sie neu gerendert werden müssen.
 */

export const chartColors = {
  brand: 'var(--c-brand)',
  accent: 'var(--c-accent)',
  success: 'var(--c-success)',
  danger: 'var(--c-danger)',
  warning: 'var(--c-warning)',
  markets: 'var(--c-markets)',
  tools: 'var(--c-tools)',
  learn: 'var(--c-learn)',
  debt: 'var(--c-debt)',
  news: 'var(--c-news)',
  grid: 'var(--c-border)',
  axis: 'var(--c-fg-subtle)',
} as const

/**
 * Farbreihe für kategoriale Diagramme (z. B. Ausgabenverteilung).
 *
 * Die Reihenfolge ist so gewählt, dass benachbarte Segmente sich im Farbton
 * deutlich unterscheiden – wichtig, weil in einem Kreisdiagramm immer die
 * Nachbarn verglichen werden. Alle Werte sind in beiden Modi kontrastreich.
 */
export const categoricalColors = [
  'var(--c-brand)',
  'var(--c-markets)',
  'var(--c-learn)',
  'var(--c-accent)',
  'var(--c-debt)',
  'var(--c-tools)',
  'var(--c-warning)',
  'var(--c-news)',
] as const

/** Achsen-Grundeinstellungen, damit alle Diagramme gleich aussehen. */
export const axisProps = {
  stroke: chartColors.axis,
  tick: { fill: chartColors.axis, fontSize: 11 },
  tickLine: false,
  axisLine: false,
} as const

export const gridProps = {
  stroke: chartColors.grid,
  strokeDasharray: '3 3',
  vertical: false,
} as const

/**
 * Sinnvolle Achsengrenzen für Kursverläufe.
 *
 * Bei Null zu beginnen würde bei Kursen jede Bewegung platt drücken. Deshalb
 * wird der tatsächliche Wertebereich mit einem kleinen Rand versehen.
 */
export function paddedDomain(
  values: readonly number[],
  paddingRatio = 0.08
): [number, number] {
  if (values.length === 0) return [0, 1]
  const min = Math.min(...values)
  const max = Math.max(...values)
  const span = max - min || Math.abs(max) * 0.02 || 1
  return [min - span * paddingRatio, max + span * paddingRatio]
}
