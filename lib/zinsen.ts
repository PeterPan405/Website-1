import momentaufnahme from '@/data/snapshots/zinsen.json'

/**
 * Leitzins und Inflationsrate aus dem Bestand.
 *
 * Die Momentaufnahme entsteht wöchentlich durch `.github/workflows/zinsen.yml`
 * aus dem Datenportal der Europäischen Zentralbank. Zur Laufzeit gibt es keinen
 * Server, der etwas nachladen könnte.
 *
 * ## Warum diese Zahlen die Beispielrechnungen nicht ersetzen
 *
 * Weil sie etwas anderes sind. Die 2,5 Prozent in `lib/inflations-beispiele.ts`
 * sind eine gerundete Annahme über dreißig Jahre – eine Rechengröße, die
 * bewusst nicht der aktuellen Rate folgt, weil eine aktuelle Rate über dreißig
 * Jahre nichts aussagt. Was hier steht, ist die Messung eines Monats.
 *
 * Beides nebeneinander ist genau richtig: Die Annahme zeigt, wie Inflation
 * wirkt, die Messung zeigt, wo sie gerade steht. Eines durch das andere zu
 * ersetzen wäre in beide Richtungen falsch.
 *
 * ## Solange nichts abgerufen wurde
 *
 * ist der Bestand leer und jede Funktion gibt `null` zurück. Die Seiten zeigen
 * dann ihre Angaben ohne den aktuellen Wert – eine fehlende Zahl ist ein
 * Zustand, kein Fehler.
 */

export interface Zinsreihe {
  bezeichnung: string
  einheit: string
  aktuell: { t: string; wert: number } | null
  vorEinemJahr: { t: string; wert: number } | null
  verlauf: { t: string; wert: number }[]
  quelle: { label: string; url: string }
  abgrenzung: string
}

interface Momentaufnahme {
  abgerufenAm: string | null
  reihen: Record<string, Zinsreihe>
}

const daten = momentaufnahme as Momentaufnahme

/** Wann zuletzt abgerufen wurde – `null`, solange kein Lauf war. */
export const zinsenStand: string | null = daten.abgerufenAm

/** Eine Reihe über ihre Kennung, oder `null`. */
export function getZinsreihe(id: string): Zinsreihe | null {
  return daten.reihen[id] ?? null
}

/** Alle vorhandenen Reihen. */
export function getZinsreihen(): Zinsreihe[] {
  return Object.values(daten.reihen)
}

/**
 * Ein Monatszeitpunkt wie `2026-06` als deutscher Text.
 *
 * Die EZB führt Monatsreihen als `JJJJ-MM` und Tagesreihen als `JJJJ-MM-TT`.
 * Beides muss lesbar werden, ohne dass jemand am Aufrufort raten muss, was
 * gerade vorliegt.
 */
const MONATE = [
  'Januar',
  'Februar',
  'März',
  'April',
  'Mai',
  'Juni',
  'Juli',
  'August',
  'September',
  'Oktober',
  'November',
  'Dezember',
]

export function zeitpunktText(t: string): string {
  const teile = t.split('-')
  const monat = MONATE[Number(teile[1]) - 1]
  if (teile.length >= 3) return `${Number(teile[2])}. ${monat} ${teile[0]}`
  if (monat) return `${monat} ${teile[0]}`
  return t
}
