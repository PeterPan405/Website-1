/**
 * Der Kursverlauf für eine Instagram-Kachel – aus dem Kursbestand der
 * Website, nicht aus einem eigenen Abruf.
 *
 * Welche Kachel einen bekommt, entscheidet `kursZurKachel()` in
 * `lib/instagram-motive.ts`. Hier wird gerechnet, beschriftet – und
 * **abgelehnt**, was der Kachel widerspricht.
 *
 * ## Warum es die Ablehnung gibt
 *
 * Am 17.10.2026 ging „Brent nahe 110 $" hinaus, darunter eine Grafik mit
 * „105,92 $ −2,6 %". Der Betreiber hat den Beitrag gelöscht: „Das können wir
 * uns nicht erlauben." Zwei Fehler auf einmal:
 *
 *   – Die Tagesreihe endete am 15.10.; der Freitag, von dem die Meldung
 *     handelte (Brent 109,69 $, +3,6 %), stand nur im laufenden Kurs.
 *   – Die Prozentzahl war die Veränderung über 30 Tage, die Meldung sprach
 *     vom Tag.
 *
 * Deshalb: Der laufende Kurs schließt die Reihe ab, die Prozentzahl ist die
 * des Tages, und eine Grafik, die nicht den letzten Handelstag vor der
 * Ausgabe zeigt oder einer Zahl oder Richtung der Kachel widerspricht,
 * erscheint nicht. Lieber keine Grafik als eine, die etwas anderes sagt.
 */
import { marketDefinitions } from '@/data/markets'
import type { KachelKurs } from '@/lib/instagram-bild'
import { formatNumber } from '@/lib/format'
import {
  getQuotes,
  getSparkline,
  type MarketQuote,
  type SeriesPoint,
} from '@/lib/markets'

export const KURS_TAGE = 30

/** Wie weit eine Zahl der Kachel vom gezeigten Kurs abweichen darf – „nahe 110" bei 109,69. */
export const ZAHL_TOLERANZ = 0.03

const EINHEIT: Record<string, string> = {
  USD: '$',
  EUR: '€',
  Punkte: 'Punkte',
}

/** Kurze Namen für die Kachel – „Brent Rohöl (Nordsee)" passt nicht in eine Zeile. */
const KURZNAME: Record<string, string> = {
  brent: 'Brent',
  gold: 'Gold',
  silber: 'Silber',
  dax: 'Dax',
  sp500: 'S&P 500',
  'nasdaq-100': 'Nasdaq 100',
  'dow-jones': 'Dow Jones',
  bitcoin: 'Bitcoin',
}

const STEIGT =
  /(?<![\p{L}])(steig\p{L}*|stieg\p{L}*|zieht? an|zog\p{L}* an|leg\p{L}* zu|spring\p{L}*|sprang\p{L}*|kletter\p{L}*|Rekord\p{L}*|Hoch|Plus|gewinn\p{L}*|erhol\p{L}*)(?![\p{L}])/iu
const FAELLT =
  /(?<![\p{L}])(f[aä]ll\p{L}*|fiel\p{L}*|sink\p{L}*|sank\p{L}*|verl[io]r\p{L}*|bricht? ein|brach\p{L}* ein|Einbruch|gibt nach|gab\p{L}* nach|Tief|Minus|rutsch\p{L}*|Ausverkauf)(?![\p{L}])/iu

/** Zahlen mit Einheit in der Kachel: „110 $", „4.200 Dollar", „25.600 Punkte". */
export function preiseIn(text: string): number[] {
  const muster =
    /(\d{1,3}(?:\.\d{3})+|\d+)(?:,(\d+))?\s*(?:\$|Dollar|US-Dollar|€|Euro|Punkte|Zähler)(?![\p{L}])/gu
  return [...text.matchAll(muster)].map((m) =>
    Number(`${m[1].replace(/\./g, '')}.${m[2] ?? '0'}`)
  )
}

/** Der letzte Handelstag vor dem Tag der Ausgabe – am Samstag, Sonntag und Montag der Freitag. */
export function letzterHandelstag(datum: string): string {
  const d = new Date(`${datum}T12:00:00Z`)
  do d.setUTCDate(d.getUTCDate() - 1)
  while (d.getUTCDay() === 0 || d.getUTCDay() === 6)
  return d.toISOString().slice(0, 10)
}

/**
 * Rechnet die Grafik – oder sagt, warum es keine gibt.
 *
 * Ohne `kachel` und `datum` (Aufruf aus Tests oder ohne Ausgabe) entfallen
 * die Prüfungen gegen die Meldung; die Reihe wird trotzdem um den laufenden
 * Kurs ergänzt.
 */
export function kursFuerKachel(
  symbol: string,
  reihe: SeriesPoint[],
  kurs: MarketQuote | undefined,
  kachel?: { titel: string; text: string },
  datum?: string
): { kurs: KachelKurs } | { grund: string } {
  const definition = marketDefinitions.find((m) => m.symbol === symbol)
  if (!definition) return { grund: `${symbol} steht nicht im Kursbestand.` }

  const punkte = reihe.map((p) => ({ t: p.t.slice(0, 10), value: p.value }))
  const kursTag = kurs?.asOf.slice(0, 10)
  if (kurs && kursTag && (punkte.length === 0 || kursTag > punkte.at(-1)!.t))
    punkte.push({ t: kursTag, value: kurs.value })
  else if (kurs && kursTag && kursTag === punkte.at(-1)?.t)
    punkte[punkte.length - 1] = { t: kursTag, value: kurs.value }
  if (punkte.length < 5) return { grund: `${symbol}: zu wenige Kurse für einen Verlauf.` }

  const letzter = punkte.at(-1)!
  const vortag = punkte.at(-2)!.value
  const aenderung =
    kurs && kursTag === letzter.t
      ? kurs.changePercent
      : ((letzter.value - vortag) / vortag) * 100

  if (datum && letzter.t < letzterHandelstag(datum))
    return {
      grund: `${symbol}: Der Kurs endet am ${letzter.t}, die Meldung handelt vom ${letzterHandelstag(datum)}.`,
    }

  if (kachel) {
    const ganz = `${kachel.titel} ${kachel.text}`
    for (const zahl of preiseIn(ganz))
      if (Math.abs(zahl - letzter.value) / letzter.value > ZAHL_TOLERANZ)
        return {
          grund: `${symbol}: Die Kachel nennt ${zahl}, die Grafik zeigte ${letzter.value}.`,
        }
    const hoch = STEIGT.test(ganz)
    const runter = FAELLT.test(ganz)
    if (hoch && runter)
      return {
        grund: `${symbol}: Die Kachel nennt Anstieg und Rückgang – welche Richtung gilt, ist offen.`,
      }
    if (hoch && aenderung < 0)
      return {
        grund: `${symbol}: Die Kachel spricht von einem Anstieg, der Kurs fiel um ${aenderung.toFixed(1)} %.`,
      }
    if (runter && aenderung > 0)
      return {
        grund: `${symbol}: Die Kachel spricht von einem Rückgang, der Kurs stieg um ${aenderung.toFixed(1)} %.`,
      }
  }

  const einheit = EINHEIT[definition.unit] ?? definition.unit
  const [, monat, tag] = letzter.t.split('-')
  return {
    kurs: {
      name: KURZNAME[symbol] ?? definition.name.replace(/\s*\(.*\)$/, ''),
      punkte: punkte.map((p) => p.value),
      tage: punkte.map((p) => p.t),
      wert: `${formatNumber(letzter.value, definition.unit === 'Punkte' ? 0 : definition.decimals)} ${einheit}`,
      aenderung,
      unterzeile: `Stand ${tag}.${monat}. · Prozent zum Vortag · Verlauf ${KURS_TAGE} Tage`,
    },
  }
}

export async function kachelKurs(
  symbol: string,
  kachel?: { titel: string; text: string },
  datum?: string
): Promise<KachelKurs | null> {
  const [reihe, [kurs]] = await Promise.all([
    getSparkline(symbol, KURS_TAGE),
    getQuotes([symbol]),
  ])
  const ergebnis = kursFuerKachel(symbol, reihe, kurs, kachel, datum)
  if ('grund' in ergebnis) {
    console.warn(`[instagram] Keine Kursgrafik – ${ergebnis.grund}`)
    return null
  }
  return ergebnis.kurs
}
