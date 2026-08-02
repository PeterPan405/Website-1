import { getEditions } from '@/lib/editions'
import { getInstrument, getSeries } from '@/lib/markets'
import type { DailyEdition } from '@/data/editions/types'

import {
  BEZUGSWERTE,
  letzteAbgeschlosseneWoche,
  wochenveraenderung,
  type Wochenbewegung,
  type Wochenspanne,
} from '@/lib/wochenrechnung'

/**
 * Der Wochenrückblick, zusammengesetzt aus den vorhandenen Bestaenden.
 *
 * Die Rechenregeln (Wochengrenze, Basis, Bezugswerte) stehen samt
 * Begründung und Prüfungen in `lib/wochenrechnung.ts` – hier wird nur
 * geholt und zusammengesetzt.
 */

export { BEZUGSWERTE, letzteAbgeschlosseneWoche, wochenveraenderung }
export type { Wochenbewegung, Wochenspanne }

export interface Wochenwert {
  symbol: string
  name: string
  ticker: string
  einheit: string
  stellen: number
  bewegung: Wochenbewegung
}

export interface Wochenrueckblick {
  spanne: Wochenspanne
  werte: Wochenwert[]
  /** Der größte Ausschlag unter den Bezugswerten. */
  zahlDerWoche: Wochenwert | null
  /** Die Tagesausgaben der Woche, älteste zuerst. */
  ausgaben: DailyEdition[]
}

export async function getWochenrueckblick(): Promise<Wochenrueckblick> {
  const spanne = letzteAbgeschlosseneWoche(new Date().toISOString().slice(0, 10))

  const werte: Wochenwert[] = []
  for (const symbol of BEZUGSWERTE) {
    const [instrument, reihe] = await Promise.all([
      getInstrument(symbol),
      getSeries(symbol, '1M'),
    ])
    if (!instrument) continue
    const bewegung = wochenveraenderung(reihe, spanne)
    if (!bewegung) continue
    werte.push({
      symbol,
      name: instrument.name,
      ticker: instrument.ticker,
      einheit: instrument.unit,
      stellen: instrument.decimals,
      bewegung,
    })
  }

  const zahlDerWoche =
    werte.length > 0
      ? werte.reduce((groesster, wert) =>
          Math.abs(wert.bewegung.prozent) > Math.abs(groesster.bewegung.prozent)
            ? wert
            : groesster
        )
      : null

  const ausgaben = (await getEditions())
    .filter((ausgabe) => ausgabe.date >= spanne.montag && ausgabe.date <= spanne.sonntag)
    .sort((a, b) => a.date.localeCompare(b.date))

  return { spanne, werte, zahlDerWoche, ausgaben }
}
