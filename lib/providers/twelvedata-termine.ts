/**
 * Bisherige Meldetermine von Twelve Data.
 *
 * ## Warum es dieses Modul gibt
 *
 * Die Quartalstermine dieser Website werden aus dem bisherigen Meldemuster
 * jedes Unternehmens abgeleitet. Die Vergangenheit dafür stammt bisher aus den
 * 8-K-Meldungen bei der US-Börsenaufsicht – und deckt damit ausschließlich
 * US-Emittenten ab: 158 der 1.029 geführten Aktien.
 *
 * Für die übrigen ist keine frei zugängliche Quelle gefunden worden. Sechs
 * wurden geprüft; die Befunde stehen im Kopf von
 * `.github/workflows/quellen-probe.yml`. Alle verlangen entweder einen
 * Schlüssel oder eine Kennung, die nur ein Browser erzeugt – und Letzteres
 * nachzubauen hieße, eine bewusst gesetzte Zugangssperre zu umgehen.
 *
 * Twelve Data ist der Ausweg, weil es beides nicht ist: eine dokumentierte
 * Schnittstelle mit Nutzungsbedingungen, die den Abruf vorsehen, gegen einen
 * kostenlosen Schlüssel. Derselbe Anbieter steht in diesem Projekt bereits als
 * Kursquelle bereit (`lib/providers/twelvedata.ts`).
 *
 * ## Was geliefert wird
 *
 * `/earnings` gibt die **vergangenen** Meldungen zurück, mit Datum, Schätzung
 * und tatsächlichem Ergebnis. Künftige Termine stehen dort nicht – das ist
 * kein Mangel, sondern genau das, was die Ableitung braucht: Sie rechnet aus
 * der Vergangenheit vor, statt eine Ankündigung zu wiederholen.
 *
 * ## Ohne Schlüssel
 *
 * Meldet sich dieses Modul gar nicht erst und gibt `null` zurück. Der Abruf
 * bleibt dann bei den 158 Unternehmen aus der SEC, und die Kalenderseite weist
 * die Lücke aus – so wie bisher.
 */

export const TWELVEDATA_EARNINGS_BASE = 'https://api.twelvedata.com/earnings'

/**
 * Börsenkürzel aus dem Yahoo-Symbol auf den Marktcode der Börse.
 *
 * Twelve Data führt ein blankes Kürzel; `CBK` allein gibt es an mehreren
 * Börsen. Ohne Marktcode käme im besten Fall nichts zurück, im schlechteren
 * die Termine eines gleichnamigen Unternehmens auf einem anderen Kontinent –
 * derselbe Fehler wie seinerzeit bei „WTI“, wo das Kürzel der Ölsorte auf ein
 * Ölförderunternehmen zeigte.
 *
 * Die Zuordnung folgt ISO 10383. Ein unbekanntes Suffix ergibt `null`, und
 * dann wird nicht abgefragt – lieber eine Lücke als ein Termin, der einem
 * anderen Unternehmen gehört.
 */
export const MARKTCODES: Record<string, string> = {
  DE: 'XETR', // Xetra, Frankfurt
  PA: 'XPAR', // Euronext Paris
  AS: 'XAMS', // Euronext Amsterdam
  BR: 'XBRU', // Euronext Brüssel
  LS: 'XLIS', // Euronext Lissabon
  MI: 'XMIL', // Borsa Italiana
  MC: 'XMAD', // Bolsa de Madrid
  SW: 'XSWX', // SIX Swiss Exchange
  VI: 'XWBO', // Wiener Börse
  L: 'XLON', // London Stock Exchange
  ST: 'XSTO', // Nasdaq Stockholm
  CO: 'XCSE', // Nasdaq Kopenhagen
  HE: 'XHEL', // Nasdaq Helsinki
  OL: 'XOSL', // Oslo Børs
  IR: 'XDUB', // Euronext Dublin
  WA: 'XWAR', // Warschauer Börse
  T: 'XTKS', // Tokyo Stock Exchange
  HK: 'XHKG', // Hong Kong Exchanges
  KS: 'XKRX', // Korea Exchange
  TW: 'XTAI', // Taiwan Stock Exchange
  NS: 'XNSE', // National Stock Exchange of India
  SI: 'XSES', // Singapore Exchange
  TO: 'XTSE', // Toronto Stock Exchange
  MX: 'XMEX', // Bolsa Mexicana de Valores
  SA: 'BVMF', // B3, São Paulo
  AX: 'XASX', // Australian Securities Exchange
}

/**
 * Der Marktcode zu einem Yahoo-Symbol, oder `null` für die USA.
 *
 * Amerikanische Kürzel tragen kein Suffix. Dort ist der Marktcode entbehrlich:
 * Ein blankes US-Kürzel ist bei Twelve Data eindeutig genug, und für diese
 * Werte greift ohnehin zuerst die SEC.
 */
export function marktcodeAusYahoo(yahooSymbol: string): string | null {
  const punkt = yahooSymbol.lastIndexOf('.')
  if (punkt === -1) return null
  return MARKTCODES[yahooSymbol.slice(punkt + 1)] ?? null
}

/** Ob ein Symbol überhaupt abgefragt werden kann. */
export function istAbfragbar(yahooSymbol: string): boolean {
  return !yahooSymbol.includes('.') || marktcodeAusYahoo(yahooSymbol) !== null
}

interface EarningsAntwort {
  status?: string
  message?: string
  earnings?: { date?: string }[]
}

/**
 * Liest die Meldetermine aus einer Antwort.
 *
 * Twelve Data antwortet bei einem Fehler mit Statuscode 200 und
 * `{"status":"error","message":"..."}` – deshalb wird der Status geprüft und
 * nicht nur der HTTP-Code. Dieselbe Falle wie beim Kursabruf.
 *
 * @returns Absteigend sortierte Termine, neueste zuerst, oder `null`, wenn die
 *   Antwort keine Terminreihe ist.
 */
export function parseTermine(text: string): string[] | null {
  let daten: EarningsAntwort
  try {
    daten = JSON.parse(text) as EarningsAntwort
  } catch {
    return null
  }

  if (daten.status === 'error' || !Array.isArray(daten.earnings)) return null

  const termine: string[] = []
  for (const eintrag of daten.earnings) {
    const datum = eintrag.date?.slice(0, 10)
    if (!datum || !/^\d{4}-\d{2}-\d{2}$/.test(datum)) continue
    termine.push(datum)
  }

  if (termine.length === 0) return null
  return [...new Set(termine)].sort((a, b) => b.localeCompare(a))
}

/** Baut die Abrufadresse für ein Kürzel an einer bestimmten Börse. */
export function termineUrl(
  symbol: string,
  marktcode: string | null,
  apiKey: string
): string {
  const params = new URLSearchParams({ symbol, apikey: apiKey })
  if (marktcode) params.set('mic_code', marktcode)
  return `${TWELVEDATA_EARNINGS_BASE}?${params.toString()}`
}

/** Kürzt eine unerwartete Antwort für das Protokoll. */
function kurzfassung(text: string, hoechstlaenge = 200): string {
  const einzeilig = text.replace(/\s+/g, ' ').trim()
  return einzeilig.length > hoechstlaenge
    ? `${einzeilig.slice(0, hoechstlaenge)} … (${einzeilig.length} Zeichen)`
    : einzeilig
}

/** Wird geworfen, wenn der Anbieter das Abrufkontingent gesperrt hat. */
export class KontingentErschoepft extends Error {}

/**
 * Holt die bisherigen Meldetermine eines Symbols.
 *
 * @param apiKey Der Schlüssel aus der Umgebung. Fehlt er, wird nichts
 *   abgerufen – der Normalfall, solange keiner hinterlegt ist.
 * @throws KontingentErschoepft bei Statuscode 429. Weiterzumachen wäre
 *   sinnlos: Jede weitere Anfrage bekäme dieselbe Antwort, und der Lauf
 *   verbrächte eine Stunde damit, Absagen einzusammeln.
 */
export async function holeTermine(
  symbol: string,
  marktcode: string | null,
  apiKey: string | undefined
): Promise<string[] | null> {
  if (!apiKey) return null

  try {
    const antwort = await fetch(termineUrl(symbol, marktcode, apiKey), {
      signal: AbortSignal.timeout(20_000),
      headers: { Accept: 'application/json' },
    })

    const text = await antwort.text()

    if (antwort.status === 429) {
      throw new KontingentErschoepft(kurzfassung(text))
    }

    if (!antwort.ok) {
      // Der Schlüssel steht in der Adresse – deshalb wird sie nicht
      // ausgegeben. Ein Protokoll eines Workflows ist öffentlich lesbar.
      console.warn(`  ${symbol}: ${antwort.status} – ${kurzfassung(text)}`)
      return null
    }

    return parseTermine(text)
  } catch (fehler) {
    if (fehler instanceof KontingentErschoepft) throw fehler
    console.warn(`  ${symbol}: ${(fehler as Error).message}`)
    return null
  }
}
