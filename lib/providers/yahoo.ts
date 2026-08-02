/**
 * Tageskurse von Yahoo Finance.
 *
 * Ersetzt Stooq. Der dortige Abruf lief in eine Bot-Prüfung: Statt der
 * CSV-Datei kam eine HTML-Seite mit dem Satz „This site requires JavaScript to
 * verify your browser“ – und zwar mit Statuscode 200, weshalb es von außen wie
 * Erfolg aussah. Das ist eine bewusst gesetzte Zugangssperre des Betreibers und
 * kein Fehler, den man wegkonfiguriert.
 *
 * Yahoo bietet unter `/v8/finance/chart/` eine JSON-Schnittstelle ohne
 * Registrierung. Sie ist nicht offiziell dokumentiert – das ist der Preis dafür,
 * dass sie ohne Schlüssel auskommt. Deshalb steht in `lib/providers/twelvedata.ts`
 * ein zweiter Anbieter bereit, der einspringt, sobald ein Schlüssel hinterlegt
 * ist.
 *
 * Wie bei allen Quellen hier: ein Wert je Handelstag, kein Intraday.
 */

/** Basisadresse der Chart-Schnittstelle. */
export const YAHOO_CHART_BASE = 'https://query1.finance.yahoo.com/v8/finance/chart/'

/** Ein Handelstag mit seinem Schlusskurs. */
export interface YahooDay {
  /** Handelstag im Format YYYY-MM-DD. */
  date: string
  /** Schlusskurs. */
  close: number
}

/** Der Ausschnitt der Antwort, auf den es ankommt. */
interface YahooChartAntwort {
  chart?: {
    result?: {
      meta?: { regularMarketPrice?: number; regularMarketTime?: number }
      timestamp?: number[]
      indicators?: { quote?: { close?: (number | null)[] }[] }
      /*
        Dividenden kommen nur, wenn `events=div` mit angefragt wird. Der
        Schlüssel ist der Zeitstempel als Zeichenkette, der Wert enthält ihn
        noch einmal als Zahl – gelesen wird die Zahl, weil der Schlüssel bei
        manchen Titeln von der Uhrzeit im Wert abweicht.
      */
      events?: {
        dividends?: Record<string, { amount?: number; date?: number }>
      }
    }[]
    error?: { code?: string; description?: string } | null
  }
}

/** Eine gezahlte Dividende, wie Yahoo sie meldet. */
export interface YahooDividende {
  /** Der Tag, ab dem die Aktie ohne Dividendenanspruch handelt. */
  date: string
  /** Betrag je Aktie, in derselben Einheit wie der Kurs. */
  amount: number
}

/** Der zuletzt gehandelte Preis mit seinem Zeitpunkt. */
export interface YahooLatest {
  value: number
  /** ISO 8601 mit Zeitzone. */
  at: string
}

export interface YahooSeries {
  /** Tagesschlusskurse, aufsteigend sortiert. */
  days: YahooDay[]
  /**
   * Die gemeldeten Dividenden, aufsteigend sortiert.
   *
   * Leer, wenn der Titel keine zahlt – oder wenn `events=div` nicht angefragt
   * wurde. Beides ist von hier aus nicht zu unterscheiden, deshalb fragt der
   * Abruf die Ereignisse immer mit.
   *
   * Die Beträge stehen in der Einheit des Kurses. Für die Londoner Börse also
   * in Pence, für Johannesburg in Cent. Das ist kein Problem, solange nur
   * Dividende durch Kurs gerechnet wird – dabei kürzt sich die Einheit heraus.
   * Wer den Betrag einzeln anzeigt, muss die Einheit dazuschreiben.
   */
  dividends: YahooDividende[]
  /**
   * Der zuletzt gehandelte Preis, wenn die Antwort einen enthält.
   *
   * Das ist etwas anderes als der letzte Schlusskurs: Während der Handelszeit
   * steht hier der Preis von eben, danach der Schluss des Tages. Beides in
   * einen Topf zu werfen wäre falsch – ein Verlauf besteht aus Schlusskursen,
   * eine Kachel soll den aktuellen Stand zeigen. Deshalb getrennt.
   */
  latest: YahooLatest | null
}

/**
 * Liest die Schlusskurse aus einer Chart-Antwort.
 *
 * Aufbau: `timestamp` enthält je Handelstag einen Unix-Zeitstempel in Sekunden,
 * `indicators.quote[0].close` an derselben Stelle den Schlusskurs. Beide Listen
 * sind gleich lang; an Tagen ohne Handel steht `null` im Kurs.
 *
 * Zusätzlich wird `meta.regularMarketPrice` gelesen – der zuletzt gehandelte
 * Preis. Er beantwortet die Frage, die ein Schlusskurs nicht beantwortet:
 * „Was kostet es jetzt?“
 *
 * @returns Die Reihe, oder `null`, wenn die Antwort nicht die erwartete Form
 *   hat – dann ist etwas anderes zurückgekommen als Kursdaten, und der Aufrufer
 *   soll den bisherigen Stand behalten.
 */
export function parseYahooChart(text: string): YahooSeries | null {
  let daten: YahooChartAntwort
  try {
    daten = JSON.parse(text) as YahooChartAntwort
  } catch {
    return null
  }

  const ergebnis = daten.chart?.result?.[0]
  const zeiten = ergebnis?.timestamp
  const kurse = ergebnis?.indicators?.quote?.[0]?.close
  if (!Array.isArray(zeiten) || !Array.isArray(kurse)) return null

  const tage: YahooDay[] = []
  for (const [index, sekunden] of zeiten.entries()) {
    const kurs = kurse[index]
    if (typeof kurs !== 'number' || !Number.isFinite(kurs) || kurs <= 0) continue
    if (!Number.isFinite(sekunden)) continue

    // Yahoo liefert den Zeitstempel der Börseneröffnung in UTC. Für einen
    // Tagesschlusskurs zählt nur der Tag, deshalb wird die Uhrzeit verworfen.
    tage.push({ date: new Date(sekunden * 1000).toISOString().slice(0, 10), close: kurs })
  }

  if (tage.length === 0) return null
  tage.sort((a, b) => a.date.localeCompare(b.date))

  const meta = ergebnis?.meta
  const preis = meta?.regularMarketPrice
  const zeit = meta?.regularMarketTime
  const latest: YahooLatest | null =
    typeof preis === 'number' &&
    Number.isFinite(preis) &&
    preis > 0 &&
    typeof zeit === 'number' &&
    Number.isFinite(zeit)
      ? { value: preis, at: new Date(zeit * 1000).toISOString() }
      : null

  /*
    Die Dividenden stehen außerhalb der Kursreihe und sind unabhängig von ihr:
    Ein Titel ohne Dividenden liefert hier eine leere Liste, keinen Fehler.
  */
  const dividenden: YahooDividende[] = []
  for (const eintrag of Object.values(ergebnis?.events?.dividends ?? {})) {
    const betrag = eintrag?.amount
    const sekunden = eintrag?.date
    if (typeof betrag !== 'number' || !Number.isFinite(betrag) || betrag <= 0) continue
    if (typeof sekunden !== 'number' || !Number.isFinite(sekunden)) continue
    dividenden.push({
      date: new Date(sekunden * 1000).toISOString().slice(0, 10),
      amount: betrag,
    })
  }
  dividenden.sort((a, b) => a.date.localeCompare(b.date))

  return { days: tage, latest, dividends: dividenden }
}

/** Baut die Abrufadresse für ein Yahoo-Symbol, z. B. `^GDAXI`. */
export function yahooUrl(symbol: string, range = '5y'): string {
  /*
    `events=div` kostet nichts – dieselbe Anfrage, ein Feld mehr in der
    Antwort. Ein zweiter Abruf nur für Dividenden hieße, jeden der über
    tausend Titel ein zweites Mal anzufragen; das wäre die Verdopplung der
    Last für Daten, die hier ohnehin mitkommen.
  */
  return `${YAHOO_CHART_BASE}${encodeURIComponent(symbol)}?range=${range}&interval=1d&events=div`
}

/**
 * Kennung, mit der sich der Abruf zu erkennen gibt.
 *
 * Ohne Angabe antwortet Yahoo auf Anfragen ohne Browser-Kennung häufig mit
 * einer Fehlerseite. Die Kennung nennt die Website und den Zweck – wer
 * mitliest, kann uns zuordnen und im Zweifel ansprechen.
 */
export const YAHOO_USER_AGENT =
  'Mozilla/5.0 (compatible; IMInvestsBot/1.0; +https://iminvests.de) Kursabruf einmal je Boersentag'

/** Kürzt eine unerwartete Antwort für das Protokoll. */
export function describeResponse(text: string, maxLength = 300): string {
  const einzeilig = text.replace(/\s+/g, ' ').trim()
  return einzeilig.length > maxLength
    ? `${einzeilig.slice(0, maxLength)} … (${einzeilig.length} Zeichen insgesamt)`
    : einzeilig
}

/**
 * Holt die Tageskurse eines Symbols.
 *
 * Fällt der Abruf aus, kommt `null` zurück und der Aufrufer behält den
 * bisherigen Stand. Was genau zurückkam, steht im Protokoll – ohne diese
 * Ausgabe war beim Vorgänger tagelang nicht zu klären, woran es lag.
 */
/**
 * HTTP-Status der letzten Antwort, je Yahoo-Symbol.
 *
 * `fetchYahooDaily` gibt bei jedem Fehlschlag `null` zurück – damit kann der
 * Aufrufer ein 404 (Yahoo kennt das Symbol nicht mehr, meist eine
 * Umbenennung) nicht von 429 oder einer Zeitüberschreitung unterscheiden
 * (vorübergehende Störung, heilt von selbst). Für den Ausfall-Sammler des
 * Kurslaufs ist genau dieser Unterschied die Information: Nur das 404 gehört
 * gezählt und gemeldet.
 *
 * Netzfehler ohne Antwort hinterlassen keinen Eintrag – kein Status ist dann
 * die richtige Auskunft.
 */
export const letzterAntwortstatus = new Map<string, number>()

export async function fetchYahooDaily(
  symbol: string,
  /**
   * Wie weit die Reihe zurückreicht.
   *
   * `5y` für den täglichen Lauf, der die Historie fortschreibt. `1d` für den
   * halbstündlichen, der nur den laufenden Preis braucht: Die Antwort schrumpft
   * damit von rund 1.250 Tageskerzen auf eine – bei über tausend Instrumenten
   * ist das der Unterschied zwischen Minuten und Sekunden Übertragungszeit.
   *
   * `meta.regularMarketPrice` steht in beiden Antworten; daran hängt der
   * laufende Kurs. Was bei `1d` fehlt, ist die Historie – und die ändert sich
   * ohnehin nur einmal je Handelstag.
   */
  range = '5y'
): Promise<YahooSeries | null> {
  const url = yahooUrl(symbol, range)

  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(20_000),
      headers: { Accept: 'application/json', 'User-Agent': YAHOO_USER_AGENT },
    })

    const text = await response.text()
    letzterAntwortstatus.set(symbol, response.status)
    if (!response.ok) {
      console.warn(
        `[yahoo] ${symbol} antwortete mit ${response.status}.` +
          `\n         Antwort: ${describeResponse(text)}`
      )
      return null
    }

    const reihe = parseYahooChart(text)
    if (reihe === null) {
      console.warn(
        `[yahoo] ${symbol}: Antwort enthielt keine Kursreihe.` +
          `\n         URL:          ${url}` +
          `\n         Content-Type: ${response.headers.get('content-type') ?? 'keiner'}` +
          `\n         Antwort:      ${describeResponse(text)}`
      )
      return null
    }
    return reihe
  } catch (error) {
    console.warn(`[yahoo] Abruf von ${symbol} fehlgeschlagen:`, error)
    return null
  }
}
