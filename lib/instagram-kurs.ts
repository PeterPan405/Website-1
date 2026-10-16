/**
 * Der Kursverlauf für eine Instagram-Kachel – aus dem Kursbestand der
 * Website, nicht aus einem eigenen Abruf.
 *
 * Welche Kachel einen bekommt, entscheidet `kursZurKachel()` in
 * `lib/instagram-motive.ts`. Hier wird nur gerechnet und beschriftet.
 */
import { marketDefinitions } from '@/data/markets'
import type { KachelKurs } from '@/lib/instagram-bild'
import { formatNumber } from '@/lib/format'
import { getSparkline } from '@/lib/markets'

export const KURS_TAGE = 30

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

export async function kachelKurs(symbol: string): Promise<KachelKurs | null> {
  const definition = marketDefinitions.find((m) => m.symbol === symbol)
  if (!definition) return null
  const reihe = await getSparkline(symbol, KURS_TAGE)
  if (reihe.length < 5) return null
  const punkte = reihe.map((p) => p.value)
  const erster = punkte[0]
  const letzter = punkte.at(-1)!
  const einheit = EINHEIT[definition.unit] ?? definition.unit
  const stand = reihe.at(-1)!.t.slice(0, 10).split('-')
  return {
    name: KURZNAME[symbol] ?? definition.name.replace(/\s*\(.*\)$/, ''),
    punkte,
    wert: `${formatNumber(letzter, definition.unit === 'Punkte' ? 0 : definition.decimals)} ${einheit}`,
    aenderung: erster ? ((letzter - erster) / erster) * 100 : 0,
    unterzeile: `letzte ${KURS_TAGE} Tage · Stand ${stand[2]}.${stand[1]}.`,
  }
}
