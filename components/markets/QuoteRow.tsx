import Link from 'next/link'

import { Zeilenzahlen } from '@/components/markets/Zeilenzahlen'
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
      {/*
        Kurs und Veränderung kommen aus `Zeilenzahlen`, weil sie sich im
        Browser auffrischen. Alles andere an dieser Zeile ist unveränderlich
        und bleibt damit aus dem Bau – Kürzel, Name und Verweisziel gehören
        nicht ins Client-Bündel.
      */}
      <Zeilenzahlen
        symbol={quote.symbol}
        decimals={quote.decimals}
        value={quote.value}
        basis={quote.value - quote.change}
        at={quote.asOf}
      />
      <span className="sr-only">{quote.unit}</span>
    </Link>
  )
}
