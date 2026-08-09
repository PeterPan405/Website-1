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
    /*
      `min-w-0` ist hier kein Feinschliff, sondern trägt das Layout auf dem
      Telefon.

      Die Kachel steht in einem Raster, und ein Rasterfeld hat von sich aus
      `min-width: auto` – es schrumpft also **nicht** unter die kleinste Breite
      seines Inhalts. Der Name darin trägt `truncate`, und das heißt
      `white-space: nowrap`: Für die Rechnung des Browsers ist die kleinste
      Breite dieses Textes seine **volle** Breite, Auslassungspunkte hin oder
      her. Das Feld wird so breit wie der längste Name, das Raster wird breiter
      als der Bildschirm, und die ganze Seite lässt sich seitlich schieben.

      Bei „DAX“ oder „Brent“ fällt das nie auf. Mit den ETFs kam
      „iShares Core MSCI World UCITS ETF USD (Acc)“ dazu – gemessen: 527 Pixel
      Seitenbreite bei 390 Pixel Fenster.

      Behoben wird es deshalb an der Wurzel: Der Name trägt `line-clamp-1`
      statt `truncate`. Beide kürzen auf eine Zeile, aber `line-clamp` kommt
      ohne `nowrap` aus – die Mindestbreite bleibt klein, und das Rasterfeld
      darf schrumpfen. Das `min-w-0` an der Kachel bleibt als zweiter Riegel.

      Bewusst hier und nicht an den sechs Rasterlisten in `app/maerkte/page.tsx`:
      Wer die siebte anlegt, denkt nicht daran. Die Kachel bringt es mit.
    */
    <Link
      href={`/maerkte/${quote.symbol}`}
      className="fk-card-interactive group block min-w-0 overflow-hidden p-5"
    >
      <div className="flex items-start justify-between gap-3">
        {/*
          `min-h`: Kacheln mit und ohne Namenszeile stehen im selben Raster.
          Ohne festes Maß säße die Kurszahl mal höher, mal tiefer – eine
          Reihe aus vier Kacheln bekäme drei Grundlinien.
        */}
        <div className="min-h-[2.625rem] min-w-0">
          <p className="font-display text-fg text-base font-semibold">{quote.ticker}</p>
          {/*
            Nur, wenn der Name mehr sagt als der Ticker. „S&P 500" unter
            „S&P 500" stand auf einem Drittel der Kacheln doppelt – das las
            sich wie ein Versehen und kostete eine Zeile Platz.
          */}
          {quote.name !== quote.ticker && (
            <p className="text-fg-muted mt-0.5 line-clamp-1 text-xs">{quote.name}</p>
          )}
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

      {/*
        Ohne „Details ansehen →“-Fußzeile und ohne Bildunterschrift.

        Beides stand auf **jeder** Kachel – auf der Marktübersicht 22-mal
        derselbe Satz mit demselben Pfeil untereinander. Die ganze Kachel ist
        der Link und sagt das beim Überfahren selbst; was der Verlauf zeigt,
        erklärt die Einleitung der Seite einmal für alle.
      */}
      {!compact && sparkline && sparkline.length > 1 && (
        <div className="mt-4">
          <Sparkline points={sparkline} positive={positive} />
        </div>
      )}
    </Link>
  )
}
