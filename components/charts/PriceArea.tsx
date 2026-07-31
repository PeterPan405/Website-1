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

  /*
    Die Beschriftung der Zeitachse überlässt die Auswahl dem Diagramm.

    Vorher stand hier ein fester Abstand: jeder n-te Punkt, gerechnet als
    `points.length / 6`. Sechs Beschriftungen passen auf einen Bildschirm,
    aber nicht auf ein Telefon – dort blieben nach Abzug der Werteachse rund
    230 Pixel für sechsmal „09.2025“, und die Angaben lagen übereinander. Auf
    dem Handy war die Zeitachse damit unlesbar.

    Ein fester Zahlenwert bei `interval` schaltet in Recharts außerdem die
    Kollisionsprüfung ab: `minTickGap` wird dann gar nicht ausgewertet. Mit
    `preserveStartEnd` misst das Diagramm die Beschriftungen selbst und lässt
    so viele weg, wie nötig sind – auf dem Telefon drei, auf dem Bildschirm
    acht. Anfang und Ende bleiben in jedem Fall stehen, denn sie sagen, worauf
    sich die Prozentangabe darüber bezieht.
  */
  const MINDESTABSTAND = 30

  return (
    /* Zeichnet Kurse – vor dem Einfrieren abgedeckt, siehe Sparkline.tsx. */
    <div style={{ height }} className="w-full" data-fliesst="">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={points as SeriesPoint[]}
          /*
            Links Platz für die halbe erste Datumsangabe.

            Beschriftungen der Zeitachse stehen mittig über ihrem Punkt. Der
            erste Punkt liegt am linken Rand – ohne diesen Abstand wird die
            linke Hälfte von „27.07.2025“ abgeschnitten. Rechts entsteht der
            Platz von selbst, weil dort die Werteachse steht.
          */
          margin={{ top: 8, right: 8, bottom: 0, left: 28 }}
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
            interval="preserveStartEnd"
            tickFormatter={formatAxisLabel}
            minTickGap={MINDESTABSTAND}
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
