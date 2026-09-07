/**
 * Meldetermine aus dem Kalender der Nasdaq.
 *
 * ## Warum diese Quelle dazugekommen ist
 *
 * Am 7. September 2026 stand auf der Kalenderseite, Oracle melde am 8.
 * September. Oracle meldete am 10. Der Betreiber hat das gesehen, und beim
 * Nachmessen war es nicht der Einzelfall: Von 186 Titeln, die dieser Kalender
 * in den nächsten acht Wochen führt, stimmten **122** mit unserer
 * Hochrechnung überein, **58 nicht** – und **25 davon um mehr als zwei
 * Wochen**. Tesla stand bei uns 155 Tage zu spät, Regeneron 183, IBM 98,
 * Goldman Sachs 93.
 *
 * Der Grund ist keine kaputte Rechnung, sondern die Art der Rechnung: Die
 * SEC-Ableitung nimmt den Vorjahrestag und legt ein Jahr drauf. Wo ein
 * Unternehmen sein Meldemuster verschoben hat, wandert unsere Schätzung um
 * ein ganzes Quartal – und die Seite sagt dann „nächste Zahlen im Januar",
 * während sie im Oktober kommen.
 *
 * ## Was diese Quelle ist – und was nicht
 *
 * Sie ist ein **veröffentlichter Terminplan**, kein statistischer Schluss.
 * Damit steht sie kategorisch über der Hochrechnung.
 *
 * Sie ist aber auch **keine Ankündigung des Unternehmens**. Der Kalender
 * nennt kein Feld dafür, ob ein Tag vom Unternehmen bestätigt oder von der
 * Nasdaq erwartet wird. Wer diese Termine als „angekündigt" ausgäbe,
 * behauptete eine Zusage, die die Quelle nicht deckt – derselbe Fehler wie
 * eine erfundene Uhrzeit, nur schwerer zu bemerken.
 *
 * Das einzige belastbare Signal ist die **Sitzungslage**: Steht in der Zeile
 * `time-after-hours` oder `time-pre-market`, weiß die Nasdaq, wann am Tag
 * gemeldet wird – und das weiß man nur von einem Unternehmen, das seinen
 * Termin herausgegeben hat. Gemessen am 7. September 2026: 30 von 186. Nur
 * diese tragen `angekuendigt`.
 *
 * ## Die Grenzen, gemessen und nicht geschätzt
 *
 * - **Reichweite: rund acht Wochen.** Am 7. September 2026 lieferte der
 *   Kalender Zeilen bis zum 30. Oktober, danach nichts mehr. Für die
 *   Quartale danach bleibt es bei der Hochrechnung; das ist kein Mangel
 *   dieser Anbindung, sondern der Zustand der Welt.
 * - **Ein Tag je Abruf.** Es gibt keinen Endpunkt für einen Zeitraum. Der
 *   Aufruf läuft die Handelstage einzeln ab.
 * - **Keine Dokumentation, kein Schlüssel.** Diese Adresse bedient die
 *   Kalenderseite der Nasdaq. Sie kann sich ohne Ankündigung ändern, und sie
 *   antwortet dann nicht mit einem Fehler, sondern mit null Zeilen. Deshalb
 *   meldet der Abruf eine leere Antwort **laut** – ein stiller Ausfall wäre
 *   hier besonders teuer, weil die Hochrechnung im selben Lauf weiterläuft
 *   und alles grün aussieht.
 */

/** Die Adresse hinter der Kalenderseite der Nasdaq. */
export const NASDAQ_KALENDER = 'https://api.nasdaq.com/api/calendar/earnings'

/**
 * Ohne diesen Kopf antwortet die Adresse nicht.
 *
 * Nicht als Tarnung, sondern weil der Endpunkt eine Browseroberfläche
 * bedient und Anfragen ohne Kennung abweist.
 */
const KOPF = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
    '(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  Accept: 'application/json',
} as const

/** Wird geworfen, wenn die Adresse über den ganzen Zeitraum nichts hergibt. */
export class NasdaqOhneZeilen extends Error {}

/** Ein Meldetermin, wie der Kalender ihn führt. */
export interface NasdaqTermin {
  /** Das Börsenkürzel, wie die Nasdaq es schreibt. */
  symbol: string
  /** Der Name, wie die Nasdaq ihn führt. */
  name: string
  /** Der Meldetag, `JJJJ-MM-TT`. */
  termin: string
  /**
   * Die Lage zur US-Sitzung – nur, wenn die Quelle sie nennt.
   *
   * `time-not-supplied` wird zu `undefined` und **nicht** zu einer Annahme.
   * An diesem Feld hängt, ob der Termin als angekündigt gilt; siehe oben.
   */
  lage?: 'vorboerse' | 'nachboerse'
  /**
   * Das Ende des gemeldeten Quartals, wie die Quelle es angibt – z. B.
   * `Aug/2026`. Unverändert übernommen: Der Bestand führt bei angekündigten
   * Terminen das Periodenende als Beleg, und eine eigene Umrechnung in ein
   * ISO-Datum wäre eine Angabe, die hier niemand gelesen hat.
   */
  quartalsende?: string
}

interface Zeile {
  symbol?: string
  name?: string
  time?: string
  fiscalQuarterEnding?: string
}

function lageAus(zeit: string | undefined): 'vorboerse' | 'nachboerse' | undefined {
  if (zeit === 'time-pre-market') return 'vorboerse'
  if (zeit === 'time-after-hours') return 'nachboerse'
  return undefined
}

/** Die Handelstage – Wochenenden fallen weg, Feiertage kosten einen leeren Abruf. */
export function handelstage(von: string, tage: number): string[] {
  const ergebnis: string[] = []
  const start = Date.parse(`${von}T00:00:00Z`)
  for (let i = 0; i < tage; i++) {
    const d = new Date(start + i * 86_400_000)
    const wochentag = d.getUTCDay()
    if (wochentag === 0 || wochentag === 6) continue
    ergebnis.push(d.toISOString().slice(0, 10))
  }
  return ergebnis
}

/**
 * Holt die Termine eines einzelnen Tages.
 *
 * Ein Tag ohne Meldungen ist normal – Feiertage, Wochenenden, ruhige Wochen
 * zwischen den Berichtssaisons. Deshalb ist eine leere Liste hier kein
 * Fehler; erst wenn **alle** Tage leer bleiben, stimmt etwas nicht, und das
 * entscheidet der Aufrufer.
 */
export async function holeNasdaqTag(tag: string): Promise<NasdaqTermin[]> {
  const antwort = await fetch(`${NASDAQ_KALENDER}?date=${tag}`, { headers: KOPF })
  if (!antwort.ok) {
    throw new Error(`Nasdaq-Kalender ${tag}: HTTP ${antwort.status}`)
  }

  const daten = (await antwort.json()) as { data?: { rows?: Zeile[] | null } }
  const zeilen = daten.data?.rows ?? []

  const ergebnis: NasdaqTermin[] = []
  for (const zeile of zeilen) {
    const symbol = zeile.symbol?.trim()
    if (!symbol) continue
    ergebnis.push({
      symbol,
      name: zeile.name?.trim() ?? symbol,
      termin: tag,
      ...(lageAus(zeile.time) ? { lage: lageAus(zeile.time)! } : {}),
      ...(zeile.fiscalQuarterEnding ? { quartalsende: zeile.fiscalQuarterEnding } : {}),
    })
  }
  return ergebnis
}

/** Was ein vollständiger Durchgang zurückgibt. */
export interface NasdaqBestand {
  termine: NasdaqTermin[]
  /** Wie viele Handelstage abgefragt wurden. */
  tageAbgefragt: number
  /** Wie viele davon Zeilen hatten – die Reichweite der Quelle. */
  tageMitZeilen: number
  /** Der letzte Tag, an dem etwas stand. */
  letzterTag: string | null
}

/**
 * Läuft den Kalender Tag für Tag ab.
 *
 * `pauseMs` ist Rücksicht, keine Vorsicht: Es sind rund fünfzig kleine
 * Abfragen an eine Adresse, die dafür nicht gedacht ist.
 */
export async function holeNasdaqTermine(
  von: string,
  tage = 70,
  pauseMs = 300
): Promise<NasdaqBestand> {
  const alle = handelstage(von, tage)
  const termine: NasdaqTermin[] = []
  let tageMitZeilen = 0
  let letzterTag: string | null = null

  for (const tag of alle) {
    const heutige = await holeNasdaqTag(tag)
    if (heutige.length > 0) {
      tageMitZeilen++
      letzterTag = tag
      termine.push(...heutige)
    }
    if (pauseMs > 0) await new Promise((r) => setTimeout(r, pauseMs))
  }

  if (termine.length === 0) {
    throw new NasdaqOhneZeilen(
      `Der Nasdaq-Kalender lieferte über ${alle.length} Handelstage keine einzige Zeile. ` +
        'Entweder hat sich die Adresse geändert oder sie weist den Abruf ab.'
    )
  }

  return { termine, tageAbgefragt: alle.length, tageMitZeilen, letzterTag }
}
