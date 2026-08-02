import type { SeriesPoint } from '../data/markets'

/**
 * Der Wochenrückblick – gerechnet, nicht geschrieben.
 *
 * ## Das Prinzip (dasselbe wie beim Tagesbild)
 *
 * Kein Satz entsteht frei, jede Zahl kommt aus den vorhandenen Kursreihen
 * und Tagesausgaben. Die Seite wird bei jeder Veröffentlichung neu gebaut
 * und zeigt immer die **letzte abgeschlossene Handelswoche** (Montag bis
 * Freitag): Eine halbe Woche zusammenzufassen wäre eine Zahl, die sich bis
 * Freitag noch dreimal ändert – ein Rückblick blickt zurück.
 *
 * ## Woche und Wochenende
 *
 * Die Kurse enden freitags, die Nachrichten nicht: Krypto handelt durch,
 * und die Tagesausgaben erscheinen auch am Wochenende. Deshalb zählt die
 * Kursrechnung Montag bis Freitag, die Ausgabenliste Montag bis Sonntag
 * derselben Woche.
 *
 * ## Die Zahl der Woche
 *
 * Der größte Wochenausschlag unter den festen Bezugswerten – keine Wahl,
 * keine Redaktion, nur ein Maximum über Beträgen. Interessant ist sie
 * gerade deshalb: Mal ist es Bitcoin, mal Öl, mal ein Index, und die
 * Auswahl selbst erzählt, wo die Woche stattfand.
 */

/** Die festen Bezugswerte – breit über Anlageklassen, nicht kuratiert je Woche. */
export const BEZUGSWERTE = [
  'dax',
  'sp500',
  'nasdaq-100',
  'msci-world',
  'gold',
  'brent',
  'bitcoin',
  'eur-usd',
] as const

export interface Wochenspanne {
  /** Montag der Woche, `JJJJ-MM-TT`. */
  montag: string
  /** Freitag derselben Woche. */
  freitag: string
  /** Sonntag derselben Woche – Grenze für die Tagesausgaben. */
  sonntag: string
}

function alsTag(zeit: number): string {
  return new Date(zeit).toISOString().slice(0, 10)
}

/**
 * Die letzte Handelswoche, deren Freitag am Bezugstag schon vorbei ist.
 *
 * Am Samstag, Sonntag und Freitag ist das die laufende Woche; Montag bis
 * Donnerstag die davor. Gerechnet in UTC auf Tagesstrings – ohne Uhrzeit
 * gibt es nichts, was eine Zeitzone verschieben könnte.
 */
export function letzteAbgeschlosseneWoche(bezugstag: string): Wochenspanne {
  const zeit = Date.parse(`${bezugstag}T00:00:00Z`)
  const wochentag = new Date(zeit).getUTCDay() // 0 = Sonntag
  // Abstand zum Montag der laufenden Woche.
  const zumMontag = (wochentag + 6) % 7
  let montag = zeit - zumMontag * 86_400_000
  const freitagLaufend = montag + 4 * 86_400_000
  if (freitagLaufend > zeit) montag -= 7 * 86_400_000

  return {
    montag: alsTag(montag),
    freitag: alsTag(montag + 4 * 86_400_000),
    sonntag: alsTag(montag + 6 * 86_400_000),
  }
}

export interface Wochenbewegung {
  /** Letzter Schlusskurs vor der Woche – die Basis. */
  basis: number
  /** Letzter Schlusskurs innerhalb der Woche. */
  schluss: number
  /** Tag dieses Schlusskurses. */
  schlussAm: string
  prozent: number
}

/**
 * Die Veränderung einer Tagesreihe über die Woche.
 *
 * Basis ist der letzte Schluss **vor** dem Montag – der Vorwochen-Freitag
 * bei Aktien, der Sonntag bei Krypto. `null`, wenn die Reihe die Woche gar
 * nicht erreicht oder keine Basis hat: lieber keine Zahl als eine, die eine
 * andere Zeitspanne misst als behauptet.
 */
export function wochenveraenderung(
  punkte: readonly SeriesPoint[],
  spanne: Wochenspanne
): Wochenbewegung | null {
  let basis: SeriesPoint | null = null
  let schluss: SeriesPoint | null = null

  for (const punkt of punkte) {
    const tag = punkt.t.slice(0, 10)
    if (tag < spanne.montag) basis = punkt
    else if (tag <= spanne.freitag) schluss = punkt
  }

  if (!basis || !schluss || basis.value === 0) return null
  return {
    basis: basis.value,
    schluss: schluss.value,
    schlussAm: schluss.t.slice(0, 10),
    prozent: ((schluss.value - basis.value) / basis.value) * 100,
  }
}
