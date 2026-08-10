import Link from 'next/link'

import { Sparkline } from '@/components/charts/Sparkline'
import { Kachelzahlen } from '@/components/markets/Kachelzahlen'
import type { SeriesPoint } from '@/data/markets'
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
      <Kachelzahlen
        symbol={quote.symbol}
        ticker={quote.ticker}
        name={quote.name}
        decimals={quote.decimals}
        unit={quote.unit}
        value={quote.value}
        /* Der Schlusskurs davor – Preis minus Veränderung, aus dem Bau. */
        basis={quote.value - quote.change}
        at={quote.asOf}
      >
        {!compact && sparkline && sparkline.length > 1 ? (
          <Sparkline points={sparkline} positive={quote.changePercent >= 0} />
        ) : null}
      </Kachelzahlen>
    </Link>
  )
}
