import { marketDefinitions } from '@/data/markets'
import { newsArticles } from '@/data/news'

import { getEditionDates } from '@/lib/editions'
import {
  archivJeMonat,
  archivabdeckung,
  bilanz,
  monatsschritte,
  raender,
  rechenbareJahre,
  type Archivabdeckung,
  type Archivmonat,
  type Jahresbilanz,
  type Monatsschritt,
} from '@/lib/jahresrueckblick'
import { getLiveSeries } from '@/lib/market-live'

/**
 * Der Jahresrückblick als Datensatz.
 *
 * Bindeglied zwischen der Rechnung in `lib/jahresrueckblick.ts` und den
 * Beständen: Kursreihen aus der Momentaufnahme, Artikel aus dem eigenen
 * Archiv, Tagesausgaben aus `data/editions`. Getrennt, damit die Rechnung
 * ohne Datenschicht prüfbar bleibt – dieselbe Aufteilung wie bei
 * `lib/geldsystem-daten.ts` und `lib/depot-simulation.ts`.
 *
 * ## Warum eine feste Auswahl an Instrumenten
 *
 * Weil ein Rückblick über tausend Instrumente kein Rückblick ist, sondern eine
 * Tabelle. Die zwölf hier sind die Märkte, über die ein Jahr geredet wird:
 * fünf Aktienindizes aus vier Regionen, zwei Edelmetalle und Öl, zwei
 * Kryptowährungen, ein Wechselkurs. Jedes andere Instrument steht einzeln
 * unter `/maerkte`.
 *
 * Die Reihenfolge ist fest und keine Sortierung nach Ergebnis. So steht in
 * jedem Jahrgang dieselbe Zeile an derselben Stelle, und zwei Jahre lassen
 * sich nebeneinanderhalten, ohne dass die Zeilen springen.
 */

/** Die Instrumente des Rückblicks, in fester Reihenfolge. */
export const RUECKBLICK_SYMBOLE = [
  'dax',
  'euro-stoxx-50',
  'sp500',
  'nasdaq-100',
  'ftse-100',
  'nikkei-225',
  'gold',
  'silber',
  'brent',
  'bitcoin',
  'ethereum',
  'eur-usd',
] as const

/**
 * Der Index, dessen Monate den Jahresverlauf tragen.
 *
 * Der DAX und nicht der S&P 500: Die Website schreibt auf Deutsch für Leser,
 * die in Euro rechnen, und der Monatsstreifen erzählt das Jahr aus deren
 * Blickwinkel. Was die übrigen Märkte gemacht haben, steht vollständig in der
 * Tabelle darüber – der Streifen ersetzt sie nicht, er ordnet sie zeitlich.
 */
export const LEITINDEX_SYMBOL = 'dax'

export interface Instrumentenbilanz {
  symbol: string
  name: string
  ticker: string
  unit: string
  decimals: number
  bilanz: Jahresbilanz
}

export interface Jahresrueckblick {
  jahr: number
  /** Die Bilanzen in der Reihenfolge von `RUECKBLICK_SYMBOLE`. */
  instrumente: Instrumentenbilanz[]
  /** Stärkste, schwächste und die mit dem tiefsten Rückschlag. */
  raender: ReturnType<typeof raender>
  /** Die Monatsschritte des Leitindex. */
  monate: Monatsschritt[]
  leitindex: Instrumentenbilanz | null
  /** Die eigenen Artikel des Jahres, jüngster Monat zuerst. */
  archiv: Archivmonat[]
  abdeckung: Archivabdeckung
  /** Tagesausgaben aus diesem Jahr, jüngste zuerst. */
  ausgaben: string[]
  /**
   * Ob alle Reihen bis ans Jahresende reichen.
   *
   * Eine einzige unvollständige genügt für `false`. Die Seite stellt die
   * Instrumente untereinander; eine Zeile, die nur bis Juli reicht, wäre neben
   * elf vollen Jahren nicht als solche zu erkennen.
   */
  vollesJahr: boolean
}

function punkteVon(symbol: string): { d: string; c: number }[] {
  const reihe = getLiveSeries(symbol)
  if (!reihe) return []
  return reihe.daily.map((punkt) => ({ d: punkt.t.slice(0, 10), c: punkt.value }))
}

/**
 * Die Jahre, für die es einen Rückblick gibt – jüngstes zuerst.
 *
 * Maßgeblich ist der Leitindex: Ohne ihn gäbe es keinen Jahresverlauf. Das
 * erste Jahr der Momentaufnahme fällt heraus, weil ihm der Vorjahresschluss
 * fehlt und eine Jahresveränderung ohne Bezugspunkt keine ist.
 */
export async function getRueckblickJahre(): Promise<number[]> {
  return rechenbareJahre(punkteVon(LEITINDEX_SYMBOL))
}

/**
 * Der Rückblick auf ein Jahr – `null`, wenn das Jahr nicht rechenbar ist.
 *
 * `heute` steuert allein die Abdeckungsangabe („von sieben vergangenen
 * Monaten"). Voreingestellt ist der jüngste Kurstag des Leitindex und nicht
 * `new Date()`: Die Seite wird statisch gebaut, ein Datum aus der Bauzeit
 * stünde falsch da, sobald der Build ein paar Tage alt ist.
 */
export async function getJahresrueckblick(
  jahr: number,
  heute?: string
): Promise<Jahresrueckblick | null> {
  const leitpunkte = punkteVon(LEITINDEX_SYMBOL)
  const leitbilanz = bilanz(leitpunkte, jahr)
  if (!leitbilanz) return null

  const stichtag = heute ?? leitbilanz.endeTag

  const instrumente: Instrumentenbilanz[] = []
  for (const symbol of RUECKBLICK_SYMBOLE) {
    const definition = marketDefinitions.find((d) => d.symbol === symbol)
    if (!definition) continue
    const eigene = bilanz(punkteVon(symbol), jahr)
    if (!eigene) continue
    instrumente.push({
      symbol,
      name: definition.name,
      ticker: definition.ticker,
      unit: definition.unit,
      decimals: definition.decimals,
      bilanz: eigene,
    })
  }

  const artikel = newsArticles.map((a) => ({
    slug: a.slug,
    title: a.title,
    publishedAt: a.publishedAt,
    category: a.category as string,
  }))

  const alleAusgaben = await getEditionDates()

  return {
    jahr,
    instrumente,
    raender: raender(instrumente.map((i) => ({ symbol: i.symbol, bilanz: i.bilanz }))),
    monate: monatsschritte(leitpunkte, jahr),
    leitindex: instrumente.find((i) => i.symbol === LEITINDEX_SYMBOL) ?? null,
    archiv: archivJeMonat(artikel, jahr),
    abdeckung: archivabdeckung(artikel, jahr, stichtag),
    ausgaben: alleAusgaben
      .filter((datum) => Number(datum.slice(0, 4)) === jahr)
      .sort()
      .reverse(),
    vollesJahr: instrumente.every((i) => i.bilanz.vollesJahr),
  }
}
