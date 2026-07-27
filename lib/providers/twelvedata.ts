/**
 * Tageskurse von Twelve Data.
 *
 * Der Rückfallweg, wenn Yahoo nicht liefert. Anders als Yahoo ist das eine
 * dokumentierte Schnittstelle mit Nutzungsbedingungen, die den Abruf
 * ausdrücklich vorsieht – der Preis dafür ist eine Registrierung.
 *
 * Der kostenlose Tarif erlaubt 800 Abrufe je Tag. Gebraucht werden sechs je
 * Börsentag, also etwa ein Prozent davon.
 *
 * Ohne hinterlegten Schlüssel meldet sich dieses Modul gar nicht erst: Es gibt
 * `null` zurück, und der Abruf bleibt bei Yahoo. Die Umschaltung ist damit eine
 * reine Einstellung und braucht keine Codeänderung.
 */

export const TWELVEDATA_BASE = 'https://api.twelvedata.com/time_series'

/** Ein Handelstag mit seinem Schlusskurs. */
export interface TwelveDataDay {
  /** Handelstag im Format YYYY-MM-DD. */
  date: string
  /** Schlusskurs. */
  close: number
}

/** Der Ausschnitt der Antwort, auf den es ankommt. */
interface TwelveDataAntwort {
  status?: string
  message?: string
  values?: { datetime?: string; close?: string }[]
}

/**
 * Liest die Schlusskurse aus einer Antwort von Twelve Data.
 *
 * Aufbau: `values` enthält je Handelstag ein Objekt mit `datetime` und `close`.
 * Beide Werte kommen als Zeichenkette, auch der Kurs.
 *
 * Bei einem Fehler antwortet Twelve Data mit Statuscode 200 und
 * `{"status":"error","message":"..."}` – deshalb wird der Status geprüft und
 * nicht nur der HTTP-Code.
 *
 * @returns Aufsteigend sortierte Handelstage, oder `null` bei einer Antwort,
 *   die keine Kursreihe ist.
 */
export function parseTwelveData(text: string): TwelveDataDay[] | null {
  let daten: TwelveDataAntwort
  try {
    daten = JSON.parse(text) as TwelveDataAntwort
  } catch {
    return null
  }

  if (daten.status === 'error' || !Array.isArray(daten.values)) return null

  const tage: TwelveDataDay[] = []
  for (const eintrag of daten.values) {
    const datum = eintrag.datetime?.slice(0, 10)
    const kurs = Number(eintrag.close)
    if (!datum || !/^\d{4}-\d{2}-\d{2}$/.test(datum)) continue
    if (!Number.isFinite(kurs) || kurs <= 0) continue
    tage.push({ date: datum, close: kurs })
  }

  if (tage.length === 0) return null
  return tage.sort((a, b) => a.date.localeCompare(b.date))
}

/**
 * Baut die Abrufadresse.
 *
 * `outputsize` steht auf dem Höchstwert des kostenlosen Tarifs; fünf Jahre
 * Handelstage sind rund 1.300 Werte.
 */
export function twelveDataUrl(symbol: string, apiKey: string): string {
  const params = new URLSearchParams({
    symbol,
    interval: '1day',
    outputsize: '5000',
    format: 'JSON',
    apikey: apiKey,
  })
  return `${TWELVEDATA_BASE}?${params.toString()}`
}

/** Kürzt eine unerwartete Antwort für das Protokoll. */
function describeResponse(text: string, maxLength = 300): string {
  const einzeilig = text.replace(/\s+/g, ' ').trim()
  return einzeilig.length > maxLength
    ? `${einzeilig.slice(0, maxLength)} … (${einzeilig.length} Zeichen insgesamt)`
    : einzeilig
}

/**
 * Holt die Tageskurse eines Symbols.
 *
 * @param apiKey Der Schlüssel aus der Umgebungsvariablen. Fehlt er, wird nichts
 *   abgerufen – das ist der Normalfall, solange Yahoo genügt.
 */
export async function fetchTwelveDataDaily(
  symbol: string,
  apiKey: string | undefined
): Promise<TwelveDataDay[] | null> {
  if (!apiKey) return null

  try {
    const response = await fetch(twelveDataUrl(symbol, apiKey), {
      signal: AbortSignal.timeout(20_000),
      headers: { Accept: 'application/json' },
    })

    const text = await response.text()
    if (!response.ok) {
      console.warn(
        `[twelvedata] ${symbol} antwortete mit ${response.status}.` +
          // Der Schlüssel steht in der Adresse – deshalb wird sie hier nicht
          // ausgegeben. Ein Protokoll ist öffentlich lesbar.
          `\n         Antwort: ${describeResponse(text)}`
      )
      return null
    }

    const tage = parseTwelveData(text)
    if (tage === null) {
      console.warn(
        `[twelvedata] ${symbol}: Antwort enthielt keine Kursreihe.` +
          `\n         Antwort: ${describeResponse(text)}`
      )
      return null
    }
    return tage
  } catch (error) {
    console.warn(`[twelvedata] Abruf von ${symbol} fehlgeschlagen:`, error)
    return null
  }
}
