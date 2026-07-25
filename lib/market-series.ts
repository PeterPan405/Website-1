import {
  MARKET_DATA_AS_OF,
  type MarketDefinition,
  type MarketRange,
  type SeriesPoint,
} from '@/data/markets'

/**
 * Deterministische Erzeugung der Demo-Kursverläufe.
 *
 * Warum nicht einfach ein paar Zahlen ins Repository schreiben? Fünf Jahre
 * Tageskurse für zehn Instrumente wären rund 13.000 handgepflegte Werte. Statt
 * dessen wird der Verlauf aus einem festen Startwert plus festem Zufalls-Seed
 * berechnet. Ergebnis: bei jedem Aufruf exakt dieselbe Reihe, ohne dass die
 * Daten im Repository liegen.
 *
 * Sobald eine echte Kurs-API angebunden wird, entfällt diese Datei komplett –
 * die Komponenten sprechen ausschließlich mit `lib/markets.ts`.
 */

/** Handelstage pro Jahr – üblicher Näherungswert an Aktienmärkten. */
const TRADING_DAYS_PER_YEAR = 252

/** Intraday-Fenster: 09:00 bis 17:30 in 5-Minuten-Schritten. */
const INTRADAY_START_MINUTES = 9 * 60
const INTRADAY_END_MINUTES = 17 * 60 + 30
const INTRADAY_STEP_MINUTES = 5

/** Anzahl Handelstage, für die Intraday-Werte erzeugt werden. */
const INTRADAY_DAYS = 5

/**
 * Mulberry32 – kleiner, schneller Pseudozufallsgenerator.
 *
 * Wichtig ist hier nicht die statistische Qualität, sondern dass dieselbe Saat
 * immer dieselbe Zahlenfolge liefert. `Math.random()` wäre dafür unbrauchbar.
 */
function createRng(seed: number): () => number {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Standardnormalverteilte Zufallszahl (Box-Muller-Transformation). */
function createGaussian(rng: () => number): () => number {
  return () => {
    // Nullen ausschließen, sonst ist der Logarithmus nicht definiert.
    const u = 1 - rng()
    const v = rng()
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
  }
}

function toDateKey(date: Date): string {
  return date.toISOString().slice(0, 10)
}

/**
 * Alle Handelstage (Mo–Fr) der letzten `years` Jahre bis einschließlich
 * `asOf`, aufsteigend sortiert. Feiertage werden bewusst ignoriert – für
 * Demo-Daten ist das ohne Belang.
 */
function collectTradingDays(asOf: Date, years: number): string[] {
  const days: string[] = []
  const cursor = new Date(
    Date.UTC(asOf.getUTCFullYear(), asOf.getUTCMonth(), asOf.getUTCDate())
  )
  const earliest = new Date(cursor)
  earliest.setUTCFullYear(earliest.getUTCFullYear() - years)

  while (cursor >= earliest) {
    const weekday = cursor.getUTCDay()
    if (weekday !== 0 && weekday !== 6) {
      days.push(toDateKey(cursor))
    }
    cursor.setUTCDate(cursor.getUTCDate() - 1)
  }

  return days.reverse()
}

function roundTo(value: number, decimals: number): number {
  const factor = 10 ** decimals
  return Math.round(value * factor) / factor
}

/**
 * Stärke der Rückkehr zum Trend.
 *
 * Eine reine geometrische Irrfahrt driftet über fünf Jahre so weit ab, dass
 * einzelne Reihen völlig unglaubwürdig enden (im Test etwa ein DAX bei 9.500
 * Punkten). Der Rückholterm zieht den Kurs sanft auf die Trendlinie zurück:
 * Zwischenzeitliche Einbrüche von 20 bis 30 Prozent bleiben erhalten, das
 * Endergebnis liegt aber in der Nähe des vorgegebenen Trends.
 */
const TREND_REVERSION = 1.8

/**
 * Tageskurse als geometrische Irrfahrt mit Trendlinie und Rückkehrterm.
 *
 * Zusätzlich moduliert ein langsam wandernder „Regime“-Faktor die
 * Schwankungsbreite. Ohne ihn sähe die Kurve gleichmäßig verrauscht aus; echte
 * Märkte wechseln dagegen zwischen ruhigen und nervösen Phasen.
 */
function generateDailySeries(
  definition: MarketDefinition,
  tradingDays: string[]
): SeriesPoint[] {
  const { startValue, annualDrift, annualVolatility, seed } = definition.seed
  const rng = createRng(seed)
  const gaussian = createGaussian(rng)

  const dt = 1 / TRADING_DAYS_PER_YEAR
  const sqrtDt = Math.sqrt(dt)

  let value = startValue
  let regime = 0

  return tradingDays.map((day, index) => {
    if (index > 0) {
      // AR(1)-Prozess: erzeugt Phasen erhöhter und verringerter Nervosität.
      regime = 0.985 * regime + 0.175 * gaussian()
      const volatility =
        annualVolatility * Math.min(2.2, Math.max(0.45, 1 + 0.35 * regime))

      // Wo der Kurs bei reinem Trendverlauf stehen würde.
      const trend = startValue * Math.exp(annualDrift * (index / TRADING_DAYS_PER_YEAR))
      const reversion = TREND_REVERSION * Math.log(trend / value) * dt

      value *= Math.exp(
        (annualDrift - 0.5 * volatility ** 2) * dt +
          reversion +
          volatility * sqrtDt * gaussian()
      )
    }
    return { t: day, value: roundTo(value, definition.decimals) }
  })
}

/**
 * Intraday-Werte für die letzten Handelstage.
 *
 * Konstruiert als Brownsche Brücke: Der erste Wert des Tages ist der
 * Vortagesschluss, der letzte exakt der Tagesschluss aus der Tagesreihe. Damit
 * widersprechen sich Intraday- und Tagesansicht nie.
 */
function generateIntradaySeries(
  definition: MarketDefinition,
  daily: SeriesPoint[]
): SeriesPoint[] {
  // Eigener Saat-Offset, damit die Intraday-Reihe nicht dieselbe Zahlenfolge
  // wie die Tagesreihe verwendet.
  const gaussian = createGaussian(createRng(definition.seed.seed + 5_000))
  const stepsPerDay = Math.round(
    (INTRADAY_END_MINUTES - INTRADAY_START_MINUTES) / INTRADAY_STEP_MINUTES
  )

  // Tagesschwankung grob aus der Jahresvolatilität herunterskaliert.
  const dailyVolatility =
    (definition.seed.annualVolatility / Math.sqrt(TRADING_DAYS_PER_YEAR)) * 0.65

  const firstIndex = Math.max(1, daily.length - INTRADAY_DAYS)
  const points: SeriesPoint[] = []

  for (let dayIndex = firstIndex; dayIndex < daily.length; dayIndex += 1) {
    const previousClose = daily[dayIndex - 1].value
    const close = daily[dayIndex].value
    const dayKey = daily[dayIndex].t

    // Zufallspfad, der anschließend an beiden Enden auf null gezogen wird.
    const walk: number[] = [0]
    for (let step = 1; step <= stepsPerDay; step += 1) {
      walk.push(walk[step - 1] + gaussian())
    }
    const scale = (close * dailyVolatility) / Math.sqrt(stepsPerDay)

    for (let step = 0; step <= stepsPerDay; step += 1) {
      const progress = step / stepsPerDay
      const bridge = walk[step] - progress * walk[stepsPerDay]
      const value = previousClose + (close - previousClose) * progress + scale * bridge

      const minutes = INTRADAY_START_MINUTES + step * INTRADAY_STEP_MINUTES
      const hh = String(Math.floor(minutes / 60)).padStart(2, '0')
      const mm = String(minutes % 60).padStart(2, '0')

      points.push({
        // Der Datenstand liegt in der Sommerzeit, daher fest +02:00 (MESZ).
        t: `${dayKey}T${hh}:${mm}:00+02:00`,
        value: roundTo(step === stepsPerDay ? close : value, definition.decimals),
      })
    }
  }

  return points
}

export interface InstrumentSeries {
  daily: SeriesPoint[]
  intraday: SeriesPoint[]
}

/**
 * Ergebnis-Cache pro Prozess.
 *
 * Die Reihen sind bei gleichem Seed konstant, müssen also nur einmal berechnet
 * werden – auch wenn viele Seiten sie gleichzeitig anfragen.
 */
const seriesCache = new Map<string, InstrumentSeries>()

export function getInstrumentSeries(definition: MarketDefinition): InstrumentSeries {
  const cached = seriesCache.get(definition.symbol)
  if (cached) return cached

  const tradingDays = collectTradingDays(new Date(MARKET_DATA_AS_OF), 5)
  const daily = generateDailySeries(definition, tradingDays)
  const intraday = generateIntradaySeries(definition, daily)

  const series: InstrumentSeries = { daily, intraday }
  seriesCache.set(definition.symbol, series)
  return series
}

/**
 * Reduziert eine Reihe auf höchstens `maxPoints` Werte.
 *
 * Charts brauchen keine 1.300 Punkte auf 800 Pixel Breite – jeder überflüssige
 * Punkt wandert sonst unnötig ins Browser-Bundle. Erster und letzter Wert
 * bleiben immer erhalten, damit Start und aktueller Kurs exakt stimmen.
 */
export function downsample(points: SeriesPoint[], maxPoints: number): SeriesPoint[] {
  if (points.length <= maxPoints) return points

  const step = (points.length - 1) / (maxPoints - 1)
  const result: SeriesPoint[] = []
  for (let i = 0; i < maxPoints - 1; i += 1) {
    result.push(points[Math.round(i * step)])
  }
  result.push(points[points.length - 1])
  return result
}

/** Wie viele Handelstage bzw. Punkte ein Zeitraum umfasst. */
const rangeConfig: Record<
  MarketRange,
  { source: 'intraday' | 'daily'; tradingDays?: number; maxPoints: number }
> = {
  '1T': { source: 'intraday', maxPoints: 110 },
  '1W': { source: 'intraday', maxPoints: 90 },
  '1M': { source: 'daily', tradingDays: 22, maxPoints: 22 },
  '1J': { source: 'daily', tradingDays: TRADING_DAYS_PER_YEAR, maxPoints: 130 },
  '5J': { source: 'daily', maxPoints: 260 },
}

/** Schneidet die passende Teilreihe für einen Zeitraum zu. */
export function sliceRange(series: InstrumentSeries, range: MarketRange): SeriesPoint[] {
  const config = rangeConfig[range]

  if (config.source === 'intraday') {
    // '1T' zeigt ausschließlich den letzten Handelstag, '1W' alle erzeugten.
    const points =
      range === '1T' ? lastTradingDayPoints(series.intraday) : series.intraday
    return downsample(points, config.maxPoints)
  }

  const points = config.tradingDays
    ? series.daily.slice(-config.tradingDays)
    : series.daily
  return downsample(points, config.maxPoints)
}

/** Alle Intraday-Punkte, die auf denselben Tag wie der letzte Punkt fallen. */
function lastTradingDayPoints(intraday: SeriesPoint[]): SeriesPoint[] {
  const lastDay = intraday[intraday.length - 1].t.slice(0, 10)
  const startIndex = intraday.findIndex((point) => point.t.startsWith(lastDay))
  return intraday.slice(startIndex)
}
