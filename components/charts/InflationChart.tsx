'use client'

import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { ChartTooltip } from '@/components/charts/ChartTooltip'
import { axisProps, chartColors, gridProps } from '@/components/charts/chart-theme'
import type { InflationYear } from '@/lib/finance'
import { formatCurrencyRounded, formatNumber } from '@/lib/format'

/**
 * Zwei Linien für den Inflationsrechner.
 *
 * Die Referenzlinie auf dem Ausgangsbetrag macht die Schere sichtbar: Die
 * Kaufkraft sinkt darunter, der nötige Betrag steigt darüber – bei identischer
 * Inflationsrate.
 */
export function InflationChart({
  years,
  baseAmount,
  height = 300,
}: {
  years: InflationYear[]
  baseAmount: number
  height?: number
}) {
  const data = years.map((row) => ({
    year: row.year,
    purchasingPower: Math.round(row.purchasingPower),
    requiredAmount: Math.round(row.requiredAmount),
  }))

  /*
    Wie viele Jahre beschriftet werden, entscheidet das Diagramm.

    Vorher stand hier ein fester Abstand für zehn Beschriftungen. Zehnmal
    „30. J.“ passt auf einen Bildschirm und nicht auf ein Telefon – dort lagen
    sie übereinander. Ein fester Zahlenwert bei `interval` schaltet in Recharts
    zudem die Kollisionsprüfung ab; `minTickGap` wird dann nicht ausgewertet.
  */
  const MINDESTABSTAND = 26

  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 8,
            right: 8,
            bottom: 0,
            // Links Platz für die halbe erste Beschriftung – sie steht mittig
            // über ihrem Punkt und würde am Rand sonst angeschnitten.
            left: 16,
          }}
        >
          <CartesianGrid {...gridProps} />

          <XAxis
            dataKey="year"
            {...axisProps}
            interval="preserveStartEnd"
            minTickGap={MINDESTABSTAND}
            tickFormatter={(year: number) => `${year}. J.`}
          />
          <YAxis
            {...axisProps}
            width={80}
            orientation="right"
            tickFormatter={(value: number) =>
              Math.abs(value) >= 10000
                ? `${formatNumber(value / 1000, 0)} T €`
                : formatNumber(value, 0)
            }
          />

          <ReferenceLine
            y={baseAmount}
            stroke={chartColors.axis}
            strokeDasharray="4 4"
            label={{
              value: 'Ausgangsbetrag',
              position: 'insideTopLeft',
              fill: 'var(--c-fg-subtle)',
              fontSize: 11,
            }}
          />

          <Tooltip
            content={
              <ChartTooltip
                formatValue={formatCurrencyRounded}
                formatLabel={(label) => `Nach ${label} Jahren`}
                seriesLabels={{
                  purchasingPower: 'Verbleibende Kaufkraft',
                  requiredAmount: 'Nötiger Betrag',
                }}
              />
            }
          />

          <Line
            type="monotone"
            dataKey="requiredAmount"
            stroke={chartColors.warning}
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="purchasingPower"
            stroke={chartColors.danger}
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
