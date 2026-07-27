import {
  featuredSymbols,
  MARKET_DATA_AS_OF,
  marketDefinitions,
  marketSources,
  type MarketDefinition,
  type MarketInstrument,
  type MarketRange,
  type SeriesPoint,
} from '@/data/markets'
import { getLiveSeries, type QuoteSource } from '@/lib/market-live'
import { downsample, getInstrumentSeries, sliceRange } from '@/lib/market-series'

/**
 * Service-Schicht für Marktdaten.
 *
 * Alle Komponenten greifen ausschließlich über diese Funktionen auf Kurse zu.
 * Die Signaturen sind absichtlich `async`, obwohl die Demo-Daten synchron
 * vorliegen: Beim Umstieg auf eine echte Kurs-API (z. B. per `fetch` mit
 * API-Key) ändert sich dann nur der Funktionsrumpf, kein einziger Aufrufer.
 *
 * Kurse kommen aus der werktäglich abgerufenen Momentaufnahme
 * (`lib/market-live.ts`). Wo es dafür keine Quelle gibt – derzeit `msci-world` –,
 * greifen weiterhin die erzeugten Demo-Daten aus `lib/market-series.ts`. Welcher
 * Fall vorliegt, steht in `MarketQuote.source` und gehört sichtbar auf die Seite.
 */

export type { MarketInstrument, MarketRange, SeriesPoint } from '@/data/markets'

/** Momentaufnahme eines Kurses inklusive der wichtigsten Kennzahlen. */
export interface MarketQuote {
  symbol: string
  ticker: string
  name: string
  kind: MarketInstrument['kind']
  unit: string
  decimals: number
  /** Aktueller Kurs beziehungsweise Schlusskurs des Datenstands. */
  value: number
  /** Schlusskurs des vorherigen Handelstags. */
  previousClose: number
  /** Veränderung zum Vortag in Punkten bzw. Kurseinheiten. */
  change: number
  /** Veränderung zum Vortag in Prozent. */
  changePercent: number
  /** Höchst- und Tiefstkurs der letzten zwölf Monate. */
  high52w: number
  low52w: number
  /** Veränderung seit dem letzten Schlusskurs des Vorjahres, in Prozent. */
  ytdPercent: number
  /**
   * Datenstand.
   *
   * Bei echten Kursen der Handelstag als `YYYY-MM-DD` – die Quellen liefern
   * Tagesschlusskurse, eine Uhrzeit gäbe es nur erfunden. Bei Demo-Daten ein
   * vollständiger Zeitstempel. Zum Formatieren deshalb `source` abfragen, nicht
   * die Länge der Zeichenkette raten.
   */
  asOf: string
  /**
   * Ob `value` ein laufender Kurs ist oder ein Tagesschluss.
   *
   * Bei `true` steht in `asOf` ein Zeitstempel mit Uhrzeit, bei `false` nur ein
   * Datum. Die Oberfläche schreibt entsprechend „Stand 27.07., 14:32“ oder
   * „Schluss 24.07.“ – die beiden Preisarten sind nicht dasselbe, und das darf
   * nicht in einer Formulierung verschwimmen.
   */
  intraday: boolean
  /**
   * Herkunft der Kurse – `null` bedeutet Demo-Daten.
   *
   * Steht sichtbar an jeder Kachel und unter jedem Chart. Solange echte und
   * erzeugte Kurse nebeneinander vorkommen, kann die Kennzeichnung nicht
   * pauschal über der Seite stehen, sondern muss am einzelnen Wert hängen.
   */
  source: QuoteSource | null
  /**
   * Ob für dieses Instrument überhaupt eine Quelle eingerichtet ist.
   *
   * Trennt zwei Fälle, die sonst gleich aussehen und es nicht sind: `MSCI World`
   * hat dauerhaft keine frei zugängliche Quelle, ein gerade erst angelegtes
   * Instrument dagegen schon – es wartet nur auf den nächsten Abruf. Beides als
   * „keine Quelle vorhanden“ zu beschriften wäre schlicht falsch.
   */
  sourcePlanned: boolean
}

export type { QuoteSource } from '@/lib/market-live'

/**
 * Die Kursreihe eines Instruments plus ihre Herkunft.
 *
 * Eine Stelle entscheidet zwischen echt und erzeugt; alles Weitere rechnet
 * unverändert weiter. Ohne diese Bündelung müsste jede Funktion die Fallunter-
 * scheidung wiederholen.
 */
function basisFor(definition: MarketDefinition): {
  daily: SeriesPoint[]
  asOf: string
  source: QuoteSource | null
  latest: { value: number; at: string } | null
} {
  const live = getLiveSeries(definition.symbol)
  if (live) {
    return {
      daily: live.daily,
      asOf: live.asOf,
      source: live.source,
      latest: live.latest,
    }
  }

  const { daily } = getInstrumentSeries(definition)
  return { daily, asOf: MARKET_DATA_AS_OF, source: null, latest: null }
}

/**
 * Entfernt die Generierungsparameter, bevor Daten nach außen gehen.
 *
 * Die Felder werden absichtlich einzeln aufgeführt statt per Rest-Operator
 * kopiert: So kann auch ein künftiges internes Feld in `MarketDefinition` nicht
 * versehentlich im Browser-Bundle landen.
 */
function toInstrument(definition: MarketDefinition): MarketInstrument {
  return {
    symbol: definition.symbol,
    ticker: definition.ticker,
    name: definition.name,
    kind: definition.kind,
    unit: definition.unit,
    decimals: definition.decimals,
    summary: definition.summary,
    metaDescription: definition.metaDescription,
    description: definition.description,
    relatedTopics: definition.relatedTopics,
  }
}

function findDefinition(symbol: string): MarketDefinition | undefined {
  return marketDefinitions.find((definition) => definition.symbol === symbol)
}

function buildQuote(definition: MarketDefinition): MarketQuote {
  const { daily, asOf, source, latest: laufend } = basisFor(definition)
  const latest = daily[daily.length - 1]
  const previous = daily[daily.length - 2]

  /*
    Der laufende Kurs verdrängt den Schlusskurs als angezeigten Wert.

    Damit steht auf der Kachel die Zahl, nach der jemand sucht – und die
    Tagesveränderung misst dann gegen den letzten Schluss, nicht gegen den
    vorletzten. Genau so wird sie überall sonst auch gerechnet.

    Der Chart bleibt unberührt: Ein Verlauf aus Schlusskursen mit einem
    laufenden Preis am Ende hätte dort einen Knick, der nichts bedeutet.
  */
  const wert = laufend?.value ?? latest.value
  const vergleich = laufend ? latest.value : previous.value

  const lastYear = daily.slice(-252)
  // Der laufende Kurs zählt beim Jahreshoch mit – sonst könnte der angezeigte
  // Wert über dem „52-Wochen-Hoch“ liegen, und die Kennzahl daneben wäre falsch.
  const values = [...lastYear.map((point) => point.value), wert]

  const currentYear = latest.t.slice(0, 4)
  // Letzter Schlusskurs, der noch im Vorjahr liegt – Basis für die YTD-Zahl.
  const lastYearClose =
    [...daily].reverse().find((point) => point.t.slice(0, 4) < currentYear)?.value ??
    daily[0].value

  const change = wert - vergleich

  return {
    symbol: definition.symbol,
    ticker: definition.ticker,
    name: definition.name,
    kind: definition.kind,
    unit: definition.unit,
    decimals: definition.decimals,
    value: wert,
    previousClose: vergleich,
    change,
    changePercent: (change / vergleich) * 100,
    high52w: Math.max(...values),
    low52w: Math.min(...values),
    ytdPercent: ((wert - lastYearClose) / lastYearClose) * 100,
    asOf: laufend?.at ?? asOf,
    intraday: Boolean(laufend),
    source,
    sourcePlanned: definition.symbol in marketSources,
  }
}

/** Alle verfügbaren Instrumente – Devisen zuerst, dann Indizes. */
export async function getInstruments(): Promise<MarketInstrument[]> {
  return marketDefinitions.map(toInstrument)
}

/** Alle Slugs – wird für `generateStaticParams` und die Sitemap gebraucht. */
export async function getInstrumentSymbols(): Promise<string[]> {
  return marketDefinitions.map((definition) => definition.symbol)
}

export async function getInstrument(symbol: string): Promise<MarketInstrument | null> {
  const definition = findDefinition(symbol)
  return definition ? toInstrument(definition) : null
}

export async function getQuote(symbol: string): Promise<MarketQuote | null> {
  const definition = findDefinition(symbol)
  return definition ? buildQuote(definition) : null
}

/**
 * Mehrere Kurse auf einmal.
 *
 * @param symbols Wenn leer gelassen, werden alle Instrumente geliefert.
 */
export async function getQuotes(symbols?: readonly string[]): Promise<MarketQuote[]> {
  const definitions = symbols
    ? symbols
        .map(findDefinition)
        .filter((definition): definition is MarketDefinition => Boolean(definition))
    : marketDefinitions
  return definitions.map(buildQuote)
}

/**
 * Wechselkurs zwischen zwei Währungen.
 *
 * @example getExchangeRate('EUR', 'USD')
 * @returns Der Kurs oder `null`, wenn das Paar nicht vorliegt.
 */
export async function getExchangeRate(
  base: string,
  quote: string
): Promise<number | null> {
  const symbol = `${base.toLowerCase()}-${quote.toLowerCase()}`
  const definition = findDefinition(symbol)
  if (!definition || definition.kind !== 'fx') return null
  return buildQuote(definition).value
}

/** Stand eines Index, z. B. `getIndex('dax')`. */
export async function getIndex(symbol: string): Promise<MarketQuote | null> {
  const definition = findDefinition(symbol)
  if (!definition || definition.kind !== 'index') return null
  return buildQuote(definition)
}

/** Zeitreihe für genau einen Zeitraum. */
export async function getSeries(
  symbol: string,
  range: MarketRange
): Promise<SeriesPoint[]> {
  const definition = findDefinition(symbol)
  if (!definition) return []
  return sliceRange(basisFor(definition).daily, range)
}

/**
 * Alle Zeiträume gebündelt.
 *
 * Die Detailseite lädt sie einmal auf dem Server und übergibt sie an den
 * Chart. Der Zeitraumwechsel läuft dann ohne Nachladen im Browser.
 */
export async function getAllSeries(
  symbol: string
): Promise<Record<MarketRange, SeriesPoint[]> | null> {
  const definition = findDefinition(symbol)
  if (!definition) return null

  const series = basisFor(definition).daily
  return {
    '1W': sliceRange(series, '1W'),
    '1M': sliceRange(series, '1M'),
    '1J': sliceRange(series, '1J'),
    '5J': sliceRange(series, '5J'),
  }
}

/** Sehr kurze Reihe für die Vorschau-Charts auf der Startseite. */
export async function getSparkline(
  symbol: string,
  tradingDays = 90
): Promise<SeriesPoint[]> {
  const definition = findDefinition(symbol)
  if (!definition) return []
  return downsample(basisFor(definition).daily.slice(-tradingDays), 44)
}

export interface MarketPreview {
  quote: MarketQuote
  sparkline: SeriesPoint[]
}

/** Kurzüberblick für die Startseite: hervorgehobene Kurse plus Mini-Chart. */
export async function getMarketOverview(): Promise<MarketPreview[]> {
  const quotes = await getQuotes(featuredSymbols)
  return Promise.all(
    quotes.map(async (quote) => ({
      quote,
      sparkline: await getSparkline(quote.symbol),
    }))
  )
}

/**
 * Zeitraum, den die Kursreihen abdecken – für schema.org `temporalCoverage`.
 *
 * Genommen wird die Reihe des ersten Instruments stellvertretend für alle: Sie
 * reichen alle über denselben Fünfjahreszeitraum.
 */
export async function getDataCoverage(): Promise<{ from: string; to: string }> {
  const { daily } = basisFor(marketDefinitions[0])
  return { from: daily[0].t, to: daily[daily.length - 1].t }
}
