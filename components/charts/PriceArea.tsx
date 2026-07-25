'use client'

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { ChartTooltip } from '@/components/charts/ChartTooltip'
import { axisProps, gridProps, paddedDomain } from '@/components/charts/chart-theme'
import type { SeriesPoint } from '@/data/markets'

/**
 * Flächendiagramm für einen Kursverlauf.
 *
 * Enthält nur die Recharts-Darstellung. Die Zeitraumauswahl liegt eine Ebene
 * höher (`PriceChart`), damit die Bedienelemente sofort da sind, während dieses
 * Modul nachgeladen wird.
 */
export function PriceArea({
  points,
  color,
  formatValue,
  formatAxisLabel,
  formatTooltipLabel,
  height = 340,
  gradientId,
}: {
  points: readonly SeriesPoint[]
  /** CSS-Variable oder Farbwert für Linie und Fläche. */
  color: string
  formatValue: (value: number) => string
  formatAxisLabel: (iso: string) => string
  formatTooltipLabel: (iso: string) => string
  height?: number
  /** Muss pro Diagramm eindeutig sein. */
  gradientId: string
}) {
  const values = points.map((point) => point.value)
  const [min, max] = paddedDomain(values)

  // Bei vielen Punkten nur jeden n-ten beschriften, sonst überlappen die Labels.
  const tickInterval = Math.max(0, Math.floor(points.length / 6) - 1)

  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={points as SeriesPoint[]}
          margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.3} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid {...gridProps} />

          <XAxis
            dataKey="t"
            {...axisProps}
            interval={tickInterval}
            tickFormatter={formatAxisLabel}
            minTickGap={16}
          />
          <YAxis
            {...axisProps}
            domain={[min, max]}
            tickFormatter={formatValue}
            width={78}
            orientation="right"
          />

          <Tooltip
            content={
              <ChartTooltip
                formatValue={formatValue}
                formatLabel={formatTooltipLabel}
                seriesLabels={{ value: 'Kurs' }}
              />
            }
          />

          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            fill={`url(#${gradientId})`}
            // Punkte erst beim Überfahren zeigen – sonst wird die Linie unruhig.
            dot={false}
            activeDot={{ r: 4, strokeWidth: 2, fill: 'var(--c-surface)' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
