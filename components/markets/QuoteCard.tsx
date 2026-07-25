import Link from 'next/link'

import { Sparkline } from '@/components/charts/Sparkline'
import { Icon } from '@/components/ui/Icon'
import type { SeriesPoint } from '@/data/markets'
import { cn } from '@/lib/cn'
import { formatNumber, formatNumberSigned, formatPercentSigned } from '@/lib/format'
import type { MarketQuote } from '@/lib/markets'

/**
 * Kurskachel mit Mini-Verlauf.
 *
 * Wird auf der Startseite und in der Marktübersicht verwendet. Die ganze Kachel
 * ist ein Link; der Verlauf ist dekorativ, alle Zahlen stehen als Text daneben.
 */
export function QuoteCard({
  quote,
  sparkline,
  compact = false,
}: {
  quote: MarketQuote
  sparkline?: readonly SeriesPoint[]
  /** Kompakte Variante ohne Verlaufsgrafik. */
  compact?: boolean
}) {
  const positive = quote.changePercent >= 0

  return (
    <Link
      href={`/maerkte/${quote.symbol}`}
      className="fk-card-interactive group block overflow-hidden p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-display text-fg text-base font-semibold">{quote.ticker}</p>
          <p className="text-fg-muted mt-0.5 truncate text-xs">{quote.name}</p>
        </div>
        <span
          className={cn(
            'fk-chip shrink-0',
            positive ? 'bg-success-soft text-success' : 'bg-danger-soft text-danger'
          )}
        >
          <Icon name={positive ? 'trending-up' : 'trending-down'} className="size-3.5" />
          {formatPercentSigned(quote.changePercent)}
        </span>
      </div>

      <p className="text-fg mt-4 text-2xl font-bold tabular-nums">
        {formatNumber(quote.value, quote.decimals)}
        <span className="text-fg-subtle ml-1.5 text-sm font-medium">{quote.unit}</span>
      </p>

      <p
        className={cn(
          'mt-1 text-sm font-medium tabular-nums',
          positive ? 'text-success' : 'text-danger'
        )}
      >
        {formatNumberSigned(quote.change, quote.decimals)} zum Vortag
      </p>

      {!compact && sparkline && sparkline.length > 1 && (
        <div className="mt-4">
          <Sparkline points={sparkline} positive={positive} />
          <p className="text-fg-subtle mt-1.5 text-xs">Verlauf der letzten Monate</p>
        </div>
      )}

      <p className="text-brand mt-4 flex items-center gap-1 text-sm font-semibold">
        Details ansehen
        <Icon
          name="arrow-right"
          className="size-4 transition-transform group-hover:translate-x-0.5"
        />
      </p>
    </Link>
  )
}
