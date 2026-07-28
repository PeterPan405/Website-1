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
import { axisProps, chartColors, gridProps } from '@/components/charts/chart-theme'
import type { CompoundInterestYear } from '@/lib/finance'
import { formatCurrencyRounded, formatNumber } from '@/lib/format'

/**
 * Gestapelte Flächen für den Zinsrechner.
 *
 * Die Stapelung ist hier die eigentliche Aussage: Sie zeigt auf einen Blick, ab
 * welchem Jahr die Erträge die eigenen Einzahlungen übersteigen – die zentrale
 * Erkenntnis des Zinseszinseffekts.
 */
export function CompoundChart({
  years,
  height = 300,
}: {
  years: CompoundInterestYear[]
  height?: number
}) {
  const data = years.map((row) => ({
    year: row.year,
    deposits: Math.round(row.cumulativeDeposits),
    interest: Math.round(row.cumulativeInterest),
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
        <AreaChart
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
          <defs>
            <linearGradient id="compound-deposits" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={chartColors.tools} stopOpacity={0.55} />
              <stop offset="100%" stopColor={chartColors.tools} stopOpacity={0.15} />
            </linearGradient>
            <linearGradient id="compound-interest" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={chartColors.success} stopOpacity={0.6} />
              <stop offset="100%" stopColor={chartColors.success} stopOpacity={0.18} />
            </linearGradient>
          </defs>

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
              // Große Beträge kompakt: 120.000 € wird zu „120 T €“.
              Math.abs(value) >= 10000
                ? `${formatNumber(value / 1000, 0)} T €`
                : formatNumber(value, 0)
            }
          />

          <Tooltip
            content={
              <ChartTooltip
                formatValue={formatCurrencyRounded}
                formatLabel={(label) => `Nach ${label} Jahren`}
                seriesLabels={{
                  deposits: 'Einzahlungen',
                  interest: 'Erträge',
                }}
              />
            }
          />

          <Area
            type="monotone"
            dataKey="deposits"
            stackId="capital"
            stroke={chartColors.tools}
            strokeWidth={2}
            fill="url(#compound-deposits)"
            dot={false}
          />
          <Area
            type="monotone"
            dataKey="interest"
            stackId="capital"
            stroke={chartColors.success}
            strokeWidth={2}
            fill="url(#compound-interest)"
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
