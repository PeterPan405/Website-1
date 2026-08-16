import type { MarketQuote } from '@/lib/markets'

/**
 * Wo ein Kurs innerhalb seiner Zwölfmonatsspanne steht.
 *
 * ## Warum das eine eigene Datei ist
 *
 * Der Abstand zum Jahreshoch stand bis zum 16. August 2026 als Ausdruck
 * mitten in `app/maerkte/[symbol]/page.tsx`:
 *
 *     ((quote.value - quote.high52w) / quote.high52w) * 100
 *
 * Solange es eine Stelle war, ging das. Eine Übersichtsseite über alle Werte
 * braucht dieselbe Zahl ein zweites Mal – und zwei Stellen, die dasselbe
 * rechnen, laufen irgendwann auseinander. Hier steht sie einmal; die
 * Einzelseite zieht sie von hier.
 *
 * ## Was die Zahlen bedeuten – und was nicht
 *
 * `abstandHoch` ist nie positiv, `abstandTief` nie negativ. Das ist keine
 * Zusicherung dieser Datei, sondern eine von `computeQuoteFigures()`: Dort
 * zählt der angezeigte Kurs beim Bilden von Hoch und Tief mit. Ohne das könnte
 * ein laufender Kurs über dem Jahreshoch stehen und der „Abstand nach unten"
 * wäre eine positive Zahl.
 *
 * **Keine dieser Kennzahlen sagt etwas über die Zukunft.** Ein Wert dicht am
 * Jahreshoch ist weder teuer noch billig; er ist dicht am Jahreshoch. Beides –
 * „nahe am Hoch, also Aufwärtstrend" und „nahe am Hoch, also überkauft" – wird
 * regelmäßig behauptet, und die Zahl selbst trägt keines von beidem.
 *
 * ## Warum es Abstand **und** Position gibt
 *
 * Weil sie verschiedene Fragen beantworten und leicht verwechselt werden.
 *
 * Zwei Titel, beide 10 % unter ihrem Jahreshoch:
 *
 * | Titel | Tief | Hoch | Kurs | Abstand Hoch | Position |
 * | ----- | ---- | ---- | ---- | ------------ | -------- |
 * | A     |   85 |  100 |   90 |       −10 %  |     33 % |
 * | B     |   50 |  100 |   90 |       −10 %  |     80 % |
 *
 * Derselbe Abstand zum Hoch – und A steht im unteren Drittel seines Jahres,
 * B im oberen Fünftel. Wer nur eine der beiden Zahlen zeigt, lädt zu dieser
 * Verwechslung ein.
 */

/** Ein Instrument mit seiner Lage in der Zwölfmonatsspanne. */
export interface Spannenwert {
  symbol: string
  name: string
  ticker: string
  kind: MarketQuote['kind']
  unit: string
  decimals: number
  value: number
  high52w: number
  low52w: number
  /** Abstand zum Jahreshoch in Prozent. Null am Hoch, sonst negativ. */
  abstandHoch: number
  /** Abstand zum Jahrestief in Prozent. Null am Tief, sonst positiv. */
  abstandTief: number
  /**
   * Wo der Kurs in der Spanne steht: 0 = am Tief, 100 = am Hoch.
   *
   * `null`, wenn die Spanne keine ist – siehe `spannenPosition()`.
   */
  position: number | null
  asOf: string
  intraday: boolean
  source: MarketQuote['source']
  sourcePlanned: boolean
}

/** Nach welcher Spalte die Übersicht sortiert werden kann. */
export type SpannenSortierung = 'name' | 'abstandHoch' | 'abstandTief' | 'position'

/**
 * Abstand zum Jahreshoch in Prozent – null oder negativ.
 *
 * Bei einem Hoch von 0 gibt es keinen sinnvollen relativen Abstand; dann steht
 * 0 statt `Infinity`. Der Fall kommt bei Kursen nicht vor, aber eine kaputte
 * Reihe soll die Seite nicht mit „∞ %" füllen.
 */
export function abstandZumHoch(quote: { value: number; high52w: number }): number {
  if (quote.high52w === 0) return 0
  return ((quote.value - quote.high52w) / quote.high52w) * 100
}

/** Abstand zum Jahrestief in Prozent – null oder positiv. */
export function abstandZumTief(quote: { value: number; low52w: number }): number {
  if (quote.low52w === 0) return 0
  return ((quote.value - quote.low52w) / quote.low52w) * 100
}

/**
 * Wo der Kurs zwischen Tief und Hoch steht, in Prozent der Spanne.
 *
 * `null`, wenn Hoch und Tief zusammenfallen. Das ist kein theoretischer Fall:
 * Ein Instrument, das erst seit einem Abruf im Bestand liegt, hat genau einen
 * Punkt – Hoch = Tief = Kurs. Rechnerisch wäre das 0/0.
 *
 * **Warum nicht 100 oder 50 statt `null`:** Weil beides eine Aussage wäre, die
 * die Daten nicht hergeben. „Steht am Jahreshoch" über einen Wert zu schreiben,
 * von dem ein einziger Kurs bekannt ist, ist schlicht falsch – und es sähe auf
 * der Seite aus wie jeder andere Titel am Hoch.
 */
export function spannenPosition(quote: {
  value: number
  high52w: number
  low52w: number
}): number | null {
  const spanne = quote.high52w - quote.low52w
  if (spanne <= 0) return null
  return ((quote.value - quote.low52w) / spanne) * 100
}

/** Einen Kurs in seine Lage innerhalb der Jahresspanne übersetzen. */
export function spannenwert(quote: MarketQuote): Spannenwert {
  return {
    symbol: quote.symbol,
    name: quote.name,
    ticker: quote.ticker,
    kind: quote.kind,
    unit: quote.unit,
    decimals: quote.decimals,
    value: quote.value,
    high52w: quote.high52w,
    low52w: quote.low52w,
    abstandHoch: abstandZumHoch(quote),
    abstandTief: abstandZumTief(quote),
    position: spannenPosition(quote),
    asOf: quote.asOf,
    intraday: quote.intraday,
    source: quote.source,
    sourcePlanned: quote.sourcePlanned,
  }
}

/**
 * Alle Kurse als Spannenwerte, absteigend nach Nähe zum Hoch.
 *
 * Die Voreinstellung ist bewusst „am nächsten am Hoch zuerst" und nicht
 * „am weitesten entfernt zuerst": Eine Liste, die mit den größten Verlusten
 * beginnt, liest sich als Rangliste des Scheiterns, und das ist eine Wertung,
 * die die Kennzahl nicht enthält.
 */
export function jahresspanne(quotes: readonly MarketQuote[]): Spannenwert[] {
  return sortiereSpanne(quotes.map(spannenwert), 'abstandHoch', 'desc')
}

/**
 * Sortiert Spannenwerte – mit den Lücken am Ende, in beiden Richtungen.
 *
 * `position` kann `null` sein. Ein `null` in einem Zahlenvergleich ergäbe über
 * `-` den Wert `NaN`, und `NaN` in einem Vergleich heißt „weder kleiner noch
 * größer": Die Reihenfolge wäre dann von der Ausgangsreihenfolge abhängig und
 * damit vom Zufall. Lücken stehen deshalb ausdrücklich hinten – auch wenn
 * umgekehrt sortiert wird, denn „keine Angabe" ist kein besonders kleiner Wert.
 */
export function sortiereSpanne(
  werte: readonly Spannenwert[],
  nach: SpannenSortierung,
  richtung: 'asc' | 'desc'
): Spannenwert[] {
  const faktor = richtung === 'asc' ? 1 : -1

  return [...werte].sort((a, b) => {
    if (nach === 'name') return a.name.localeCompare(b.name, 'de-DE') * faktor

    const linkeSeite = a[nach]
    const rechteSeite = b[nach]

    if (linkeSeite === null && rechteSeite === null) {
      return a.name.localeCompare(b.name, 'de-DE')
    }
    if (linkeSeite === null) return 1
    if (rechteSeite === null) return -1

    if (linkeSeite !== rechteSeite) return (linkeSeite - rechteSeite) * faktor

    // Gleichstand: nach Namen, damit die Reihenfolge zwischen zwei Bauten steht.
    return a.name.localeCompare(b.name, 'de-DE')
  })
}
