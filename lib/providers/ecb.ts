/**
 * Wechselkurse von der Europäischen Zentralbank.
 *
 * Die EZB veröffentlicht ihre Euro-Referenzkurse werktäglich gegen 16:00 Uhr
 * MEZ als XML – offiziell, kostenlos, ohne Registrierung und ohne Schlüssel.
 * Das passt zu dieser Website, weil alle Devisenpaare hier auf Euro lauten.
 *
 * Zwei Eigenschaften der Quelle wirken bis in die Oberfläche:
 *
 * 1. **Ein Wert pro Tag, kein Intraday.** Referenzkurse sind Tagesfixings, keine
 *    fortlaufenden Handelskurse. Ein Chart über „einen Handelstag“ lässt sich
 *    daraus nicht bilden – das muss die Oberfläche kenntlich machen, statt einen
 *    Verlauf zu zeigen, den es nicht gibt.
 * 2. **Nur Bankarbeitstage.** An Wochenenden und TARGET-Feiertagen fehlen Werte.
 *    Lücken sind also normal und dürfen nicht als Fehler behandelt werden.
 *
 * Fällt die Abfrage aus, liefern die Funktionen `null`. Der Aufrufer fällt dann
 * auf die gekennzeichneten Demo-Daten zurück. Ein Netzwerkfehler darf den Build
 * nicht abbrechen – sonst genügt eine kurze Störung bei der EZB, damit die
 * gesamte Website nicht mehr gebaut werden kann.
 */

/** Tageskurse: eine Datei, ein Datum. Klein und schnell. */
export const ECB_DAILY_URL =
  'https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml'

/** Historie der letzten 90 Tage – deckt die Zeiträume 1W und 1M ab. */
export const ECB_HISTORY_90D_URL =
  'https://www.ecb.europa.eu/stats/eurofxref/eurofxref-hist-90d.xml'

/** Vollständige Historie seit 1999 – nötig für die Zeiträume 1J und 5J. */
export const ECB_HISTORY_FULL_URL =
  'https://www.ecb.europa.eu/stats/eurofxref/eurofxref-hist.xml'

/** Kurse eines Tages, jeweils Euro zu Fremdwährung. */
export interface EcbDay {
  /** Handelstag im Format YYYY-MM-DD. */
  date: string
  /** Währungscode (ISO 4217) auf Kurs, z. B. `{ USD: 1.0812 }`. */
  rates: Record<string, number>
}

/**
 * Liest die Kurse aus einer EZB-XML-Datei.
 *
 * Bewusst ohne XML-Parser: Das Format ist seit Jahren unverändert, flach und
 * enthält keine Verschachtelung, die eine echte Baumverarbeitung erfordern
 * würde. Eine zusätzliche Abhängigkeit wäre hier mehr Risiko als Nutzen.
 *
 * Aufbau der Datei – Tagesdatei und Historie unterscheiden sich nur in der
 * Anzahl der Tages-Blöcke, weshalb dieselbe Funktion für beide reicht:
 *
 * ```xml
 * <Cube>
 *   <Cube time='2026-07-24'>
 *     <Cube currency='USD' rate='1.0812'/>
 *     <Cube currency='CHF' rate='0.9385'/>
 * ```
 *
 * Rückgabe ist aufsteigend nach Datum sortiert – die EZB liefert absteigend,
 * Zeitreihen für Charts brauchen es aber umgekehrt.
 */
export function parseEcbEnvelope(xml: string): EcbDay[] {
  const days: EcbDay[] = []

  // Jeder Tag beginnt mit einem Cube, das ein `time`-Attribut trägt.
  const dayPattern = /<Cube\s+time=['"](\d{4}-\d{2}-\d{2})['"]\s*>/g
  const starts: { date: string; from: number }[] = []
  let dayMatch: RegExpExecArray | null
  while ((dayMatch = dayPattern.exec(xml)) !== null) {
    starts.push({ date: dayMatch[1], from: dayMatch.index + dayMatch[0].length })
  }

  for (const [index, start] of starts.entries()) {
    // Der Block eines Tages endet dort, wo der nächste beginnt.
    const end = index + 1 < starts.length ? starts[index + 1].from : xml.length
    const block = xml.slice(start.from, end)

    const rates: Record<string, number> = {}
    const ratePattern = /currency=['"]([A-Z]{3})['"]\s+rate=['"]([^'"]+)['"]/g
    let rateMatch: RegExpExecArray | null
    while ((rateMatch = ratePattern.exec(block)) !== null) {
      const value = Number(rateMatch[2])
      // Die EZB schreibt bei ausgesetzten Kursen `N/A` in das Attribut.
      if (Number.isFinite(value) && value > 0) rates[rateMatch[1]] = value
    }

    if (Object.keys(rates).length > 0) days.push({ date: start.date, rates })
  }

  return days.sort((a, b) => a.date.localeCompare(b.date))
}

/**
 * Merkt sich das Ergebnis für die Laufzeit des Prozesses.
 *
 * Beim Build fragen viele Seiten dieselben Kurse ab. Ohne diese Zwischenablage
 * würde jede einzelne Seite die EZB erneut anfragen – bei über hundert Seiten
 * unnötig und unhöflich gegenüber der Quelle. Absichtlich nicht über das
 * Caching von Next gelöst: Der Build ist ein Prozess, damit genügt eine
 * Zuordnung im Modul, und das Verhalten hängt nicht an einer Framework-Version.
 */
const inFlight = new Map<string, Promise<EcbDay[] | null>>()

/** Setzt die Zwischenablage zurück – nur für Tests gedacht. */
export function clearEcbCache(): void {
  inFlight.clear()
}

async function loadEcb(url: string): Promise<EcbDay[] | null> {
  const cached = inFlight.get(url)
  if (cached) return cached

  const request = (async (): Promise<EcbDay[] | null> => {
    try {
      const response = await fetch(url, {
        // Falls Next doch zwischenspeichert, soll es das gerne tun.
        cache: 'force-cache',
        signal: AbortSignal.timeout(15_000),
        headers: { Accept: 'application/xml' },
      })
      if (!response.ok) {
        console.warn(`[ecb] ${url} antwortete mit ${response.status}`)
        return null
      }
      const days = parseEcbEnvelope(await response.text())
      if (days.length === 0) {
        console.warn(`[ecb] ${url} enthielt keine verwertbaren Kurse`)
        return null
      }
      return days
    } catch (error) {
      // Bewusst nur eine Warnung: Der Aufrufer weicht auf Demo-Daten aus.
      console.warn(`[ecb] Abruf von ${url} fehlgeschlagen:`, error)
      return null
    }
  })()

  inFlight.set(url, request)
  return request
}

/** Kurse des letzten Bankarbeitstags. */
export function fetchEcbLatest(): Promise<EcbDay[] | null> {
  return loadEcb(ECB_DAILY_URL)
}

/** Kurse der letzten 90 Tage, aufsteigend sortiert. */
export function fetchEcbHistory90d(): Promise<EcbDay[] | null> {
  return loadEcb(ECB_HISTORY_90D_URL)
}

/**
 * Vollständige Historie seit 1999, aufsteigend sortiert.
 *
 * Die Datei ist mehrere Megabyte groß. Sie wird pro Build einmal geladen und
 * ist damit vertretbar – für eine Abfrage pro Seitenaufruf wäre sie es nicht.
 */
export function fetchEcbHistoryFull(): Promise<EcbDay[] | null> {
  return loadEcb(ECB_HISTORY_FULL_URL)
}

/**
 * Zieht eine Zeitreihe für eine Währung aus den Tagesdaten.
 *
 * @param days Ergebnis einer der `fetchEcb*`-Funktionen.
 * @param currency Währungscode, z. B. `USD`.
 * @returns Aufsteigend sortierte Punkte; Tage ohne diesen Kurs fallen heraus.
 */
export function seriesForCurrency(
  days: readonly EcbDay[],
  currency: string
): { date: string; value: number }[] {
  return days
    .filter((day) => typeof day.rates[currency] === 'number')
    .map((day) => ({ date: day.date, value: day.rates[currency] }))
}
