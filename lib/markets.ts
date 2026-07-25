import {
  featuredSymbols,
  MARKET_DATA_AS_OF,
  marketDefinitions,
  type MarketDefinition,
  type MarketInstrument,
  type MarketRange,
  type SeriesPoint,
} from '@/data/markets'
import { downsample, getInstrumentSeries, sliceRange } from '@/lib/market-series'

/**
 * Service-Schicht für Marktdaten.
 *
 * Alle Komponenten greifen ausschließlich über diese Funktionen auf Kurse zu.
 * Die Signaturen sind absichtlich `async`, obwohl die Demo-Daten synchron
 * vorliegen: Beim Umstieg auf eine echte Kurs-API (z. B. per `fetch` mit
 * API-Key) ändert sich dann nur der Funktionsrumpf, kein einziger Aufrufer.
 *
 * Die Umstellung betrifft genau diese Datei plus `data/markets.ts`;
 * `lib/market-series.ts` kann danach gelöscht werden.
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
  /** Zeitstempel des Datenstands (ISO 8601). */
  asOf: string
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
  const { daily } = getInstrumentSeries(definition)
  const latest = daily[daily.length - 1]
  const previous = daily[daily.length - 2]

  const lastYear = daily.slice(-252)
  const values = lastYear.map((point) => point.value)

  const currentYear = latest.t.slice(0, 4)
  // Letzter Schlusskurs, der noch im Vorjahr liegt – Basis für die YTD-Zahl.
  const lastYearClose =
    [...daily].reverse().find((point) => point.t.slice(0, 4) < currentYear)?.value ??
    daily[0].value

  const change = latest.value - previous.value

  return {
    symbol: definition.symbol,
    ticker: definition.ticker,
    name: definition.name,
    kind: definition.kind,
    unit: definition.unit,
    decimals: definition.decimals,
    value: latest.value,
    previousClose: previous.value,
    change,
    changePercent: (change / previous.value) * 100,
    high52w: Math.max(...values),
    low52w: Math.min(...values),
    ytdPercent: ((latest.value - lastYearClose) / lastYearClose) * 100,
    asOf: MARKET_DATA_AS_OF,
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
  return sliceRange(getInstrumentSeries(definition), range)
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

  const series = getInstrumentSeries(definition)
  return {
    '1T': sliceRange(series, '1T'),
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
  return downsample(getInstrumentSeries(definition).daily.slice(-tradingDays), 44)
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

/** Zeitraum, den die Demo-Daten abdecken – für schema.org `temporalCoverage`. */
export async function getDataCoverage(): Promise<{ from: string; to: string }> {
  const series = getInstrumentSeries(marketDefinitions[0])
  return { from: series.daily[0].t, to: series.daily[series.daily.length - 1].t }
}
