'use client'

import type { ReactNode } from 'react'

/**
 * Einheitlicher Tooltip für alle Recharts-Diagramme.
 *
 * Recharts übergibt an `content` ein locker typisiertes Payload-Objekt. Statt
 * die internen Typen der Bibliothek nachzubauen, wird hier eine minimale eigene
 * Struktur definiert und defensiv ausgelesen.
 */

export interface TooltipEntry {
  name?: string | number
  value?: number | string
  color?: string
  dataKey?: string | number
  payload?: Record<string, unknown>
}

export interface ChartTooltipProps {
  active?: boolean
  payload?: TooltipEntry[]
  label?: string | number
  /** Formatiert die Kopfzeile (meist das Datum). */
  formatLabel?: (label: string) => string
  /** Formatiert einen Wert inklusive Einheit. */
  formatValue: (value: number) => string
  /** Überschreibt die Bezeichnung einer Reihe. */
  seriesLabels?: Record<string, string>
  /** Zusätzliche Zeile unter den Werten. */
  footer?: ReactNode
}

export function ChartTooltip({
  active,
  payload,
  label,
  formatLabel,
  formatValue,
  seriesLabels,
  footer,
}: ChartTooltipProps) {
  if (!active || !payload || payload.length === 0) return null

  const heading =
    typeof label === 'string' ? (formatLabel?.(label) ?? label) : String(label ?? '')

  return (
    <div className="border-border bg-surface shadow-lift rounded-xl border px-3 py-2">
      {heading && <p className="text-fg-subtle text-xs font-medium">{heading}</p>}
      <ul className="mt-1 space-y-0.5">
        {payload.map((entry, index) => {
          const key = String(entry.dataKey ?? index)
          const name = seriesLabels?.[key] ?? String(entry.name ?? key)
          const numeric =
            typeof entry.value === 'number' ? entry.value : Number(entry.value)

          return (
            <li key={key} className="flex items-baseline gap-2 text-sm">
              <span
                aria-hidden="true"
                className="size-2 shrink-0 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-fg-muted">{name}</span>
              <span className="text-fg ml-auto font-semibold tabular-nums">
                {Number.isFinite(numeric) ? formatValue(numeric) : '–'}
              </span>
            </li>
          )
        })}
      </ul>
      {footer && <div className="text-fg-subtle mt-1.5 text-xs">{footer}</div>}
    </div>
  )
}
