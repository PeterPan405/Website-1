import Link from 'next/link'

import { Icon } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'
import { formatNumber, formatPercentSigned } from '@/lib/format'
import type { MarketQuote } from '@/lib/markets'

/**
 * Ein Kurs als kompakte Zeile statt als Kachel.
 *
 * Für die über hundert Einzelaktien: Kacheln mit Mini-Verlauf sind bei dieser
 * Anzahl kein Überblick mehr, sondern eine Wand. Eine Zeile zeigt, was beim
 * Überfliegen zählt – Kürzel, Kurs, Tagesveränderung – und führt zur
 * Detailseite, wo der Verlauf steht.
 *
 * Bei den Indizes, Rohstoffen und Devisen bleibt es bei `QuoteCard`: Dort sind
 * es wenige Werte, und der Verlauf ist auf einen Blick nützlich.
 */
export function QuoteRow({ quote }: { quote: MarketQuote }) {
  const positive = quote.changePercent >= 0

  return (
    <Link
      href={`/maerkte/${quote.symbol}`}
      className="border-border hover:bg-surface-muted flex items-baseline gap-3 border-b py-2.5 transition"
    >
      <span className="text-fg w-20 shrink-0 truncate text-sm font-semibold">
        {quote.ticker}
      </span>
      <span className="text-fg-muted min-w-0 flex-1 truncate text-sm">{quote.name}</span>
      <span className="text-fg shrink-0 text-sm tabular-nums">
        {formatNumber(quote.value, quote.decimals)}
      </span>
      <span
        className={cn(
          'flex w-20 shrink-0 items-center justify-end gap-0.5 text-sm font-medium tabular-nums',
          positive ? 'text-success' : 'text-danger'
        )}
      >
        <Icon
          name={positive ? 'trending-up' : 'trending-down'}
          className="size-3.5"
          aria-hidden="true"
        />
        {formatPercentSigned(quote.changePercent)}
      </span>
      <span className="sr-only">{quote.unit}</span>
    </Link>
  )
}
