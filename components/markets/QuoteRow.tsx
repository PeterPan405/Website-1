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
      {/*
        `line-clamp-1` und nicht `truncate`.

        Beide kürzen auf eine Zeile. `truncate` tut es über
        `white-space: nowrap`, und damit ist die **kleinste** Breite dieses
        Textes für den Browser seine volle Breite – gemessen 250 Pixel bei
        „Advanced Micro Devices“. Auf der Marktübersicht steht diese Liste in
        einem Raster, und ein Rasterfeld schrumpft nicht unter die kleinste
        Breite seines Inhalts: Die Seite wurde 527 Pixel breit bei 375 Pixel
        Fenster und ließ sich seitlich schieben.

        `line-clamp-1` kommt ohne `nowrap` aus – die kleinste Breite ist das
        längste Wort. Das `min-w-0` bleibt: Es regelt das Schrumpfen im Flex,
        `line-clamp` die Mindestbreite im Raster. Beide werden gebraucht.

        Auf den Branchenseiten fiel nichts auf, weil die Liste dort einspaltig
        und kein Raster ist. Geprüft wird es jetzt von `npm run breite`.
      */}
      <span className="text-fg-muted line-clamp-1 min-w-0 flex-1 text-sm">
        {quote.name}
      </span>
      <span className="text-fg shrink-0 text-sm tabular-nums">
        {formatNumber(quote.value, quote.decimals)}
      </span>
      {/*
        `w-24` und `whitespace-nowrap`, nicht `w-20`.

        Bei zweistelligen Prozentzahlen brach „+19,50 %“ hinter dem Pfeil um,
        und die Zeile wurde doppelt so hoch – bei einem Dutzend Titeln
        nebeneinander sah die Liste aus, als sei sie kaputt. Aufgefallen ist es
        an einem Tag, an dem der ganze Halbleiterbereich zweistellig zulegte:
        Auf der Marktübersicht steht eine solche Zahl selten, auf einer
        Branchenseite stehen an so einem Tag vierzig davon untereinander.
      */}
      <span
        className={cn(
          'flex w-24 shrink-0 items-center justify-end gap-0.5 text-sm font-medium whitespace-nowrap tabular-nums',
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
