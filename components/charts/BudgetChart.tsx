'use client'

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

import { ChartTooltip } from '@/components/charts/ChartTooltip'
import { categoricalColors } from '@/components/charts/chart-theme'
import { formatCurrency, formatPercent } from '@/lib/format'

export interface BudgetSlice {
  label: string
  amount: number
  sharePercent: number
}

/**
 * Ringdiagramm der Ausgabenverteilung.
 *
 * Ein Ring statt einer Vollkreisfläche, damit in der Mitte die Gesamtsumme
 * stehen kann. Die Legende steht daneben als echte Liste mit Zahlen – ein
 * Kreisdiagramm allein lässt Anteile schlecht ablesen.
 */
export function BudgetChart({
  slices,
  total,
  height = 260,
}: {
  slices: BudgetSlice[]
  total: number
  height?: number
}) {
  if (slices.length === 0) {
    return (
      <p className="border-border-strong bg-surface-muted text-fg-muted rounded-xl border border-dashed p-6 text-center text-sm">
        Trage Ausgaben ein, um die Verteilung zu sehen.
      </p>
    )
  }

  return (
    <div className="grid items-center gap-6 sm:grid-cols-[minmax(0,14rem)_minmax(0,1fr)]">
      {/*
        `min-w-0` und `overflow-hidden` sind hier nicht kosmetisch: Recharts
        schreibt dem inneren Container eine Pixelbreite aus der letzten Messung.
        Ohne diese Begrenzung kann die Grid-Spalte diese Breite als Mindestmaß
        übernehmen und die ganze Seite auf schmalen Bildschirmen nach rechts
        aufziehen.
      */}
      <div style={{ height }} className="relative w-full min-w-0 overflow-hidden">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={slices}
              dataKey="amount"
              nameKey="label"
              innerRadius="62%"
              outerRadius="92%"
              paddingAngle={2}
              stroke="var(--c-surface)"
              strokeWidth={2}
            >
              {slices.map((slice, index) => (
                <Cell
                  key={slice.label}
                  fill={categoricalColors[index % categoricalColors.length]}
                />
              ))}
            </Pie>
            <Tooltip
              content={<ChartTooltip formatValue={(value) => formatCurrency(value, 2)} />}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Gesamtsumme in der Mitte des Rings. */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-fg-subtle text-xs">Ausgaben</span>
          <span className="text-fg text-lg font-bold tabular-nums">
            {formatCurrency(total, 0)}
          </span>
        </div>
      </div>

      <ul className="min-w-0 space-y-2">
        {slices.map((slice, index) => (
          <li key={slice.label} className="flex items-baseline gap-2.5 text-sm">
            <span
              aria-hidden="true"
              className="mt-1.5 size-2.5 shrink-0 rounded-sm"
              style={{
                backgroundColor: categoricalColors[index % categoricalColors.length],
              }}
            />
            <span className="text-fg-muted min-w-0 flex-1 truncate">{slice.label}</span>
            <span className="text-fg shrink-0 font-semibold tabular-nums">
              {formatCurrency(slice.amount, 0)}
            </span>
            <span className="text-fg-subtle w-14 shrink-0 text-right text-xs tabular-nums">
              {formatPercent(slice.sharePercent, 1)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
