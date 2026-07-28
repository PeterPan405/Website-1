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
import { getBilanzwaehrung, getBilanzzahlen } from '@/lib/fundamentaldaten'
import {
  berechneFundamentalkennzahlen,
  type Fundamentalkennzahlen,
} from '@/lib/fundamentalkennzahlen'
import { berechneKennzahlen, type Kennzahlen } from '@/lib/kennzahlen'
import { getLiveSeries, type QuoteSource } from '@/lib/market-live'
import { computeQuoteFigures } from '@/lib/market-quote'
import { sliceByDays } from '@/lib/market-range'
import { downsample, getInstrumentSeries, sliceRange } from '@/lib/market-series'
import {
  MASSSTAB_AKTIEN,
  MASSSTAB_KRYPTO,
  berechneStimmung,
  stimmungAm,
  type Kurspunkt,
  type Stimmung,
} from '@/lib/stimmungsindex'

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
export { fundamentalQuelle, fundamentalStand } from '@/lib/fundamentaldaten'
export type { Fundamentalkennzahlen } from '@/lib/fundamentalkennzahlen'
export type { Bestandteil, Stimmung, Stimmungsstufe } from '@/lib/stimmungsindex'
export { STUFEN_TEXT } from '@/lib/stimmungsindex'

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

  // Die Rechnung liegt in `lib/market-quote.ts`, weil sie dort ohne Datenschicht
  // prüfbar ist – hier steckten drei Fehler, die von außen nur als „die Zahlen
  // stimmen nicht“ auffielen.
  const zahlen = computeQuoteFigures(daily, laufend)

  return {
    symbol: definition.symbol,
    ticker: definition.ticker,
    name: definition.name,
    kind: definition.kind,
    unit: definition.unit,
    decimals: definition.decimals,
    value: zahlen.value,
    previousClose: zahlen.previousClose,
    change: zahlen.change,
    changePercent: zahlen.changePercent,
    high52w: zahlen.high52w,
    low52w: zahlen.low52w,
    ytdPercent: zahlen.ytdPercent,
    asOf: laufend?.at ?? asOf,
    intraday: zahlen.intraday,
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
 * Die gerechneten Kennzahlen zu einem Instrument.
 *
 * Gilt für **jeden** geführten Wert – Aktie, Index, Rohstoff, Währungspaar,
 * Kryptowährung –, weil alle dieselbe Art von Tagesreihe haben. Was die Zahlen
 * bedeuten und warum es gerade diese sind, steht in `lib/kennzahlen.ts`.
 */
export async function getKennzahlen(symbol: string): Promise<Kennzahlen | null> {
  const definition = findDefinition(symbol)
  if (!definition) return null
  return berechneKennzahlen(basisFor(definition).daily)
}

/**
 * Was die Unternehmenszahlen zu einer Aktie hergeben.
 *
 * Bewusst kein `null` für den Fehlschlag, sondern ein benannter Grund: Auf der
 * Seite steht dann, **warum** nichts dasteht. „Keine Angabe“ ohne Begründung
 * ist auf einer Bildungsseite die schlechteste aller Antworten.
 */
export type Fundamentalbefund =
  | {
      art: 'zahlen'
      kennzahlen: Fundamentalkennzahlen
      /** Die Währung, in der Bilanz **und** Kurs stehen – geprüft, nicht geraten. */
      waehrung: string
    }
  /** Das Unternehmen meldet nicht bei der US-Börsenaufsicht. */
  | { art: 'keineMeldung' }
  /** Zahlen ja, aber kein echter Kurs – dann ergäbe jede Verhältniszahl Unsinn. */
  | { art: 'keinEchterKurs' }

/**
 * Die gemeldeten Unternehmenszahlen zu einer Aktie – oder `null`.
 *
 * Anders als `getKennzahlen` gilt das **nicht** für jeden geführten Wert: Ein
 * Index hat keinen Umsatz, Gold keinen Gewinn, ein Währungspaar keine Aktien.
 * Für alles außer Aktien kommt deshalb `null` zurück, und die Seite lässt den
 * Abschnitt ganz weg.
 */
export async function getFundamentalkennzahlen(
  symbol: string
): Promise<Fundamentalbefund | null> {
  const definition = findDefinition(symbol)
  if (!definition || definition.kind !== 'stock') return null

  /*
    Bilanz und Kurs müssen dieselbe Währung tragen.

    Die us-gaap-Melder berichten in US-Dollar, die IFRS-Melder in ihrer
    Heimatwährung – Toyota in Yen, Santander in Euro. Passt das zur Währung des
    Kurses, lässt sich rechnen; passt es nicht, käme ein Kurs-Gewinn-Verhältnis
    heraus, das um den Wechselkurs danebenliegt, ohne dass man ihm etwas
    ansieht.

    Umgerechnet wird bewusst nicht: Das brächte einen zweiten Stichtag ins
    Spiel – der Kurs von heute, die Bilanz vom Jahresende – und einen weiteren
    Weg, still falsch zu liegen. Die Lücke ist die ehrlichere Antwort.
  */
  if (definition.unit !== getBilanzwaehrung(definition.ticker)) {
    return { art: 'keineMeldung' }
  }

  const zahlen = getBilanzzahlen(definition.ticker)
  if (!zahlen) return { art: 'keineMeldung' }

  const quote = buildQuote(definition)

  /*
    Nur mit einem echten Kurs.

    Für Instrumente ohne eingerichtete Quelle erzeugt `basisFor` gekennzeichnete
    Demo-Daten. Bei einem Chart ist das vertretbar, weil daneben steht, was es
    ist. Hier wäre es das nicht: Der erste Versuch hat Moderna eine
    Marktkapitalisierung von 160 Milliarden Dollar bescheinigt – echte
    Aktienzahl aus der Bilanz, erfundener Kurs. Herausgekommen wäre eine Zahl,
    die weder als Demo erkennbar noch annähernd richtig ist.

    Eine halb echte Kennzahl ist schlimmer als keine.
  */
  if (quote.source === null) return { art: 'keinEchterKurs' }

  const kennzahlen = berechneFundamentalkennzahlen(zahlen, quote.value)
  return kennzahlen.belegt > 0
    ? { art: 'zahlen', kennzahlen, waehrung: definition.unit }
    : { art: 'keineMeldung' }
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
export async function getSparkline(symbol: string, days = 120): Promise<SeriesPoint[]> {
  const definition = findDefinition(symbol)
  if (!definition) return []
  /*
    Nach Kalendertagen zugeschnitten, nicht nach Anzahl der Punkte.

    Bei 90 Punkten deckte der Mini-Verlauf für eine Aktie rund vier Monate ab,
    für Bitcoin mit seinen sieben Handelstagen je Woche nur drei. Zwei Kacheln
    nebeneinander zeigten damit verschieden lange Zeiträume, ohne dass es
    irgendwo stand.
  */
  return downsample(sliceByDays(basisFor(definition).daily, days), 44)
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

/**
 * Angst und Gier für einen Anlagebereich.
 *
 * Gemeint ist ausdrücklich der **Bereich**, nicht der einzelne Titel: ein Wert
 * für Aktien, einer für Kryptowährungen – so, wie man solche Anzeigen kennt.
 * Eine Stimmungszahl für eine einzelne Aktie wäre auch keine Stimmung, sondern
 * nur ihr Kursverlauf mit anderer Beschriftung.
 *
 * ## Nur echte Kurse
 *
 * Entscheidend ist der Filter auf `source`: Die breite Aktienauswahl wartet
 * noch auf ihren ersten Abruf und zeigt bis dahin erzeugte Reihen. Eine
 * Marktbreite über erzeugte Kurse wäre eine Zahl über Zufallszahlen – richtig
 * gerechnet und vollkommen bedeutungslos. Wer keine echte Quelle hat, zählt
 * nicht mit; bleiben zu wenige übrig, entfällt der Bestandteil, und bleibt gar
 * nichts, kommt `null` zurück und die Seite zeigt den Tacho nicht.
 *
 * Der Leitkurs ist das erste Instrument der Liste, das echte Daten hat – für
 * Aktien der breiteste verfügbare Index, für Krypto Bitcoin.
 */
export type Marktbereich = 'aktien' | 'krypto'

export async function getMarktstimmung(bereich: Marktbereich): Promise<Stimmung | null> {
  const leitkandidaten =
    bereich === 'aktien'
      ? ['sp500', 'msci-world', 'nasdaq-100', 'dax']
      : ['bitcoin', 'ethereum']

  const mitEchtenDaten = (definition: MarketDefinition) =>
    basisFor(definition).source !== null

  const leitDefinition = leitkandidaten
    .map((symbol) => findDefinition(symbol))
    .find(
      (definition): definition is MarketDefinition =>
        definition !== undefined && definition !== null && mitEchtenDaten(definition)
    )
  if (!leitDefinition) return null

  const arten: MarketInstrument['kind'][] =
    bereich === 'aktien' ? ['stock', 'index'] : ['crypto']

  const einzelreihen = marketDefinitions
    .filter((definition) => arten.includes(definition.kind) && mitEchtenDaten(definition))
    .map((definition) => zuKurspunkten(basisFor(definition).daily))

  return berechneStimmung(
    zuKurspunkten(basisFor(leitDefinition).daily),
    einzelreihen,
    bereich === 'aktien' ? MASSSTAB_AKTIEN : MASSSTAB_KRYPTO
  )
}

/**
 * Die Reihen, aus denen die Stimmung eines Bereichs entsteht.
 *
 * Herausgezogen, weil der Verlauf dieselben braucht. Stünden sie zweimal da,
 * könnte der Verlauf irgendwann auf einem anderen Leitkurs beruhen als der
 * Wert darüber – und das wäre nicht zu sehen.
 */
function stimmungsgrundlage(bereich: Marktbereich): {
  leit: MarketDefinition
  leitreihe: Kurspunkt[]
  einzelreihen: Kurspunkt[][]
  massstab: typeof MASSSTAB_AKTIEN
} | null {
  const leitkandidaten =
    bereich === 'aktien'
      ? ['sp500', 'msci-world', 'nasdaq-100', 'dax']
      : ['bitcoin', 'ethereum']

  const mitEchtenDaten = (definition: MarketDefinition) =>
    basisFor(definition).source !== null

  const leit = leitkandidaten
    .map((symbol) => findDefinition(symbol))
    .find(
      (definition): definition is MarketDefinition =>
        definition !== undefined && definition !== null && mitEchtenDaten(definition)
    )
  if (!leit) return null

  const arten: MarketInstrument['kind'][] =
    bereich === 'aktien' ? ['stock', 'index'] : ['crypto']

  return {
    leit,
    leitreihe: zuKurspunkten(basisFor(leit).daily),
    einzelreihen: marketDefinitions
      .filter((d) => arten.includes(d.kind) && mitEchtenDaten(d))
      .map((d) => zuKurspunkten(basisFor(d).daily)),
    massstab: bereich === 'aktien' ? MASSSTAB_AKTIEN : MASSSTAB_KRYPTO,
  }
}

/** Ein Stichtag im Verlauf. */
export interface Stimmungsstand {
  /** Beschriftung, etwa „vor einer Woche“. */
  label: string
  /** Der Handelstag, auf den gerechnet wurde. */
  datum: string
  /**
   * `null`, wenn die Kursreihe am Stichtag noch wöchentlich war.
   *
   * Das ist kein Fehler, sondern der Kern der Sache: Das Tagesarchiv beginnt
   * mit dem ersten eigenen Abruf. Vorher lägen der Rechnung Wochenwerte
   * zugrunde, und das Ergebnis wäre mit dem heutigen nicht vergleichbar.
   */
  stimmung: Stimmung | null
}

export interface Stimmungsverlauf {
  jetzt: Stimmung
  /** Der Handelstag, auf den sich `jetzt` bezieht. */
  stand: string
  frueher: Stimmungsstand[]
  /** Woran gerechnet wurde – gehört sichtbar auf die Seite. */
  leitkurs: { symbol: string; name: string }
  /** Wie viele Einzelreihen in die Marktbreite eingehen. */
  einzelwerte: number
}

/** Ein ISO-Datum um Tage / Monate / Jahre zurückversetzen. */
function zurueck(iso: string, teil: 'tage' | 'monate' | 'jahre', menge: number): string {
  const datum = new Date(`${iso}T00:00:00Z`)
  if (teil === 'tage') datum.setUTCDate(datum.getUTCDate() - menge)
  if (teil === 'monate') datum.setUTCMonth(datum.getUTCMonth() - menge)
  if (teil === 'jahre') datum.setUTCFullYear(datum.getUTCFullYear() - menge)
  return datum.toISOString().slice(0, 10)
}

/**
 * Angst und Gier über die Zeit – heute und an vier früheren Stichtagen.
 *
 * ## Warum kein Archiv nötig ist
 *
 * Die Werte werden nicht nachgeschlagen, sondern erneut gerechnet: dieselbe
 * Funktion, dieselben Reihen, nur am Stichtag abgeschnitten. Dadurch gibt es
 * den Verlauf ab dem ersten Tag, ohne dass jemals jemand einen Wert
 * gespeichert hätte – und er kann nicht nach einem anderen Verfahren
 * entstanden sein als die Zahl darüber.
 *
 * Der Preis dafür steht in `stimmungAm`: Wo die Kursreihe damals nur
 * wöchentlich war, kommt kein Wert. Die Seite zeigt dann die Lücke samt Grund,
 * statt eine Zahl zu erfinden.
 */
export async function getStimmungsverlauf(
  bereich: Marktbereich
): Promise<Stimmungsverlauf | null> {
  const grundlage = stimmungsgrundlage(bereich)
  if (!grundlage) return null

  const { leit, leitreihe, einzelreihen, massstab } = grundlage
  const jetzt = berechneStimmung(leitreihe, einzelreihen, massstab)
  if (!jetzt) return null

  const letzter = leitreihe[leitreihe.length - 1]?.d
  const vorletzter = leitreihe[leitreihe.length - 2]?.d
  if (!letzter || !vorletzter) return null

  /*
    Dieselben vier Stufen, die man von solchen Anzeigen kennt.

    „Vorheriger Schluss“ ist ausdrücklich der vorherige *Handelstag*, nicht
    gestern: Am Montag wäre gestern ein Sonntag, an dem die Börse zu hatte.
  */
  const stichtage: { label: string; datum: string }[] = [
    { label: 'Vorheriger Schluss', datum: vorletzter },
    { label: 'Vor einer Woche', datum: zurueck(letzter, 'tage', 7) },
    { label: 'Vor einem Monat', datum: zurueck(letzter, 'monate', 1) },
    { label: 'Vor einem Jahr', datum: zurueck(letzter, 'jahre', 1) },
  ]

  return {
    jetzt,
    stand: letzter,
    leitkurs: { symbol: leit.symbol, name: leit.name },
    einzelwerte: einzelreihen.length,
    frueher: stichtage.map(({ label, datum }) => ({
      label,
      datum,
      stimmung: stimmungAm(leitreihe, einzelreihen, massstab, datum),
    })),
  }
}

/**
 * Von der Reihenform der Seite in die der Rechnung.
 *
 * `{ t, value }` heißt es hier, `{ d, c }` in der Momentaufnahme und im
 * Rechenmodul – letzteres ist import-frei und kennt die Typen dieser Datei
 * nicht. Eine Zeile Übersetzung ist der Preis dafür, dass sich die Rechnung
 * ohne das halbe Projekt prüfen lässt.
 */
function zuKurspunkten(reihe: readonly SeriesPoint[]): Kurspunkt[] {
  return reihe.map((punkt) => ({ d: punkt.t, c: punkt.value }))
}
