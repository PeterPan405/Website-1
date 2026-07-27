import {
  MARKET_DATA_AS_OF,
  type MarketDefinition,
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

export interface InstrumentSeries {
  daily: SeriesPoint[]
}

// Der Zuschnitt liegt in einem eigenen, importfreien Modul, damit er testbar
// ist. Hier weitergereicht, damit Aufrufer nur eine Adresse kennen müssen.
export { downsample, sliceRange } from '@/lib/market-range'

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
  const series: InstrumentSeries = { daily: generateDailySeries(definition, tradingDays) }
  seriesCache.set(definition.symbol, series)
  return series
}
