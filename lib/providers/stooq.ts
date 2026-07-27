/**
 * Tageskurse von Stooq.
 *
 * Stooq liefert historische Schlusskurse als CSV, ohne Registrierung und ohne
 * Schlüssel. Damit sind die Instrumente abgedeckt, für die es keine amtliche
 * Quelle wie die EZB gibt: Indizes und Edelmetalle.
 *
 * Drei Eigenschaften der Quelle wirken bis in die Oberfläche:
 *
 * 1. **Ein Schlusskurs pro Tag, kein Intraday.** Wie bei der EZB lässt sich
 *    daraus kein Verlauf über einen einzelnen Handelstag bilden.
 * 2. **Keine Zusage über Verfügbarkeit oder Genauigkeit.** Stooq ist ein freier
 *    Dienst. Ein Ausfall ist normal und darf nichts kaputtmachen.
 * 3. **Tageslimit.** Bei zu vielen Abrufen antwortet Stooq mit einem Klartext
 *    statt mit CSV. Das sieht auf den ersten Blick wie eine gültige Antwort aus
 *    – Statuscode 200, Inhalt vorhanden – und ist der Grund, warum
 *    {@link parseStooqCsv} die Kopfzeile prüft, statt einfach loszuparsen.
 *
 * Rechtlicher Hinweis: Indexstände sind lizenziertes Eigentum der jeweiligen
 * Anbieter. Die Nutzungsbedingungen freier Quellen decken eine Weitergabe auf
 * einer eigenen Website in der Regel nicht ab. Das ist eine bewusste
 * Entscheidung des Betreibers, keine Empfehlung dieses Moduls.
 */

/** Basisadresse des CSV-Abrufs. `s` ist das Symbol, `i=d` steht für täglich. */
export const STOOQ_CSV_BASE = 'https://stooq.com/q/d/l/'

/** Ein Handelstag mit seinem Schlusskurs. */
export interface StooqDay {
  /** Handelstag im Format YYYY-MM-DD. */
  date: string
  /** Schlusskurs. */
  close: number
}

/**
 * Liest die Schlusskurse aus einer CSV-Antwort von Stooq.
 *
 * Erwartet wird eine Kopfzeile und danach je Handelstag eine Zeile:
 *
 * ```csv
 * Date,Open,High,Low,Close,Volume
 * 2026-07-23,24980.11,25010.50,24700.01,24763.12,0
 * 2026-07-24,24800.00,25120.90,24790.30,25099.03,0
 * ```
 *
 * Die Spalte `Volume` fehlt bei manchen Instrumenten. Deshalb werden die
 * Spalten über die Kopfzeile aufgelöst und nicht über feste Positionen.
 *
 * Rückgabe ist aufsteigend nach Datum sortiert. Zeilen ohne verwertbaren
 * Schlusskurs – Stooq schreibt dort `N/A` – fallen heraus.
 *
 * @returns Die Handelstage, oder `null`, wenn die Antwort kein CSV ist.
 */
export function parseStooqCsv(text: string): StooqDay[] | null {
  const lines = text.trim().split(/\r?\n/)
  if (lines.length < 2) return null

  const header = lines[0].split(',').map((name) => name.trim().toLowerCase())
  const dateIndex = header.indexOf('date')
  const closeIndex = header.indexOf('close')

  /*
    Die Prüfung der Kopfzeile ist der eigentliche Zweck des null-Rückgabewerts.

    Bei überschrittenem Tageslimit antwortet Stooq mit Statuscode 200 und einem
    Satz Klartext. Ohne diese Prüfung entstünde daraus eine leere Kursreihe, die
    von einem echten „keine Daten“ nicht zu unterscheiden wäre – und der Abruf
    würde eine gute Momentaufnahme durch eine leere ersetzen.
  */
  if (dateIndex === -1 || closeIndex === -1) return null

  const days: StooqDay[] = []
  for (const line of lines.slice(1)) {
    const columns = line.split(',')
    const date = columns[dateIndex]?.trim()
    const close = Number(columns[closeIndex])

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date ?? '')) continue
    if (!Number.isFinite(close) || close <= 0) continue

    days.push({ date, close })
  }

  return days.sort((a, b) => a.date.localeCompare(b.date))
}

/** Baut die Abrufadresse für ein Stooq-Symbol, z. B. `^dax`. */
export function stooqUrl(symbol: string): string {
  return `${STOOQ_CSV_BASE}?s=${encodeURIComponent(symbol)}&i=d`
}

/**
 * Kennung, mit der sich der Abruf zu erkennen gibt.
 *
 * Ohne Angabe schickt Node einen leeren beziehungsweise generischen Wert. Viele
 * Anbieter antworten darauf mit einer Sperrseite statt mit Daten – und zwar mit
 * Statuscode 200, was von außen wie Erfolg aussieht. Eine ehrliche Kennung mit
 * Adresse ist außerdem das, was Betreiber erwarten: Sie können sehen, wer
 * abfragt, und im Zweifel die Website ansprechen statt stumm zu sperren.
 */
export const STOOQ_USER_AGENT =
  'IMInvestsBot/1.0 (+https://iminvests.de; Kursabruf einmal je Boersentag)'

/**
 * Kürzt eine unerwartete Antwort für die Protokollausgabe.
 *
 * Der erste Lauf im Workflow endete für alle sechs Stooq-Symbole mit „Antwort
 * war kein CSV“ – und damit war die Ursache nicht zu klären. Ob ein Tageslimit,
 * eine Sperre für Rechenzentren oder eine geänderte Adresse dahintersteckt,
 * steht in der Antwort selbst. Also gehört sie ins Protokoll.
 *
 * Zeilenumbrüche werden ersetzt, damit eine HTML-Seite nicht das halbe
 * Protokoll füllt.
 */
export function describeResponse(text: string, maxLength = 300): string {
  const einzeilig = text.replace(/\s+/g, ' ').trim()
  return einzeilig.length > maxLength
    ? `${einzeilig.slice(0, maxLength)} … (${einzeilig.length} Zeichen insgesamt)`
    : einzeilig
}

/**
 * Holt die Tageskurse eines Symbols.
 *
 * Fällt der Abruf aus, kommt `null` zurück. Der Aufrufer behält dann den
 * bisherigen Stand – eine kaputte Momentaufnahme wäre schlechter als eine alte.
 */
export async function fetchStooqDaily(symbol: string): Promise<StooqDay[] | null> {
  const url = stooqUrl(symbol)

  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(20_000),
      headers: {
        Accept: 'text/csv,text/plain,*/*',
        'User-Agent': STOOQ_USER_AGENT,
      },
    })
    if (!response.ok) {
      console.warn(`[stooq] ${symbol} antwortete mit ${response.status}`)
      return null
    }

    const text = await response.text()
    const days = parseStooqCsv(text)
    if (days === null) {
      // Der Inhalt der Antwort ist die einzige Auskunft über den Grund.
      console.warn(
        `[stooq] ${symbol}: Antwort war kein CSV.` +
          `\n         URL:          ${url}` +
          `\n         Content-Type: ${response.headers.get('content-type') ?? 'keiner'}` +
          `\n         Antwort:      ${describeResponse(text)}`
      )
      return null
    }
    if (days.length === 0) {
      console.warn(`[stooq] ${symbol}: CSV enthielt keine verwertbaren Kurse`)
      return null
    }
    return days
  } catch (error) {
    console.warn(`[stooq] Abruf von ${symbol} fehlgeschlagen:`, error)
    return null
  }
}
