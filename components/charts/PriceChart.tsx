'use client'

import dynamic from 'next/dynamic'
import { useMemo, useState } from 'react'

import { ChartSkeleton } from '@/components/charts/ChartSkeleton'
import { Icon } from '@/components/ui/Icon'
import {
  marketRangeLabels,
  marketRanges,
  type MarketRange,
  type SeriesPoint,
} from '@/data/markets'
import { cn } from '@/lib/cn'
import {
  formatDateShort,
  formatMonthYear,
  formatNumber,
  formatPercentSigned,
} from '@/lib/format'

/**
 * Das eigentliche Diagramm wird erst im Browser geladen.
 *
 * Recharts ist die größte Abhängigkeit der Website. Über den dynamischen Import
 * landet es nicht im ersten JavaScript-Bündel der Seite; die Zeitraum-Buttons
 * sind trotzdem sofort bedienbar.
 */
const PriceArea = dynamic(
  () => import('@/components/charts/PriceArea').then((module) => module.PriceArea),
  { ssr: false, loading: () => <ChartSkeleton /> }
)

export function PriceChart({
  ranges,
  decimals,
  unit,
  ticker,
  initialRange = '1J',
}: {
  ranges: Record<MarketRange, SeriesPoint[]>
  decimals: number
  unit: string
  ticker: string
  initialRange?: MarketRange
}) {
  const [range, setRange] = useState<MarketRange>(initialRange)
  const points = ranges[range]

  const changePercent = useMemo(() => {
    if (points.length < 2) return 0
    const first = points[0].value
    const last = points[points.length - 1].value
    return first === 0 ? 0 : ((last - first) / first) * 100
  }, [points])

  const positive = changePercent >= 0
  const color = positive ? 'var(--c-success)' : 'var(--c-danger)'

  const formatValue = (value: number) => formatNumber(value, decimals)

  /*
    Alle Zeiträume zeigen Tagesdaten – Uhrzeiten gibt es nicht mehr.

    Beide Quellen liefern einen Schlusskurs je Handelstag. Der frühere Zeitraum
    „Ein Handelstag“ ist deshalb entfallen, und mit ihm die Uhrzeit-Beschriftung.
  */
  const formatAxisLabel = (iso: string) =>
    range === '5J' ? formatMonthYear(iso) : formatDateShort(iso)

  const formatTooltipLabel = (iso: string) => formatDateShort(iso)

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        {/* Zeitraumauswahl als Gruppe zusammengehöriger Umschalter. */}
        <div
          role="group"
          aria-label="Zeitraum des Kursverlaufs"
          className="border-border bg-surface-muted flex flex-wrap gap-1 rounded-full border p-1"
        >
          {marketRanges.map((option) => {
            const active = option === range
            return (
              <button
                key={option}
                type="button"
                onClick={() => setRange(option)}
                aria-pressed={active}
                title={marketRangeLabels[option]}
                className={cn(
                  'rounded-full px-3 py-1.5 text-sm font-semibold transition',
                  active
                    ? 'bg-surface text-fg shadow-card'
                    : 'text-fg-muted hover:text-fg'
                )}
              >
                {option}
              </button>
            )
          })}
        </div>

        <p
          className={cn(
            'flex items-center gap-1.5 text-sm font-semibold tabular-nums',
            positive ? 'text-success' : 'text-danger'
          )}
        >
          <Icon name={positive ? 'trending-up' : 'trending-down'} className="size-4" />
          {formatPercentSigned(changePercent)}
          <span className="text-fg-subtle font-normal">
            im Zeitraum {marketRangeLabels[range].toLowerCase()}
          </span>
        </p>
      </div>

      <PriceArea
        points={points}
        color={color}
        formatValue={formatValue}
        formatAxisLabel={formatAxisLabel}
        formatTooltipLabel={formatTooltipLabel}
        // Die ID muss eindeutig sein, sonst teilen sich mehrere Charts denselben Verlauf.
        gradientId={`price-${ticker.replace(/[^a-zA-Z0-9]/g, '')}-${range}`}
      />

      <p className="text-fg-subtle mt-3 text-xs">
        Angaben in {unit}. Die Prozentangabe bezieht sich auf den ersten und letzten Wert
        des gewählten Zeitraums.
      </p>
    </div>
  )
}
