import momentaufnahme from '@/data/snapshots/fundamentaldaten.json'

import { HINTERLEGUNGSSCHEINE } from '@/lib/hinterlegungsscheine'
import type { Bilanzzahlen } from '@/lib/fundamentalkennzahlen'

/**
 * Zugriff auf die Bilanzzahlen aus den Pflichtmeldungen.
 *
 * Die Momentaufnahme liegt als JSON im Repository und wird beim Bauen
 * eingebunden; erneuert wird sie monatlich durch
 * `.github/workflows/fundamentaldaten.yml`. Zur Laufzeit gibt es keinen Server,
 * der etwas nachladen könnte – die Website ist statisch.
 *
 * ## Warum längst nicht jede Aktie dabei ist
 *
 * Erfasst ist, wer bei der SEC einreicht – und das sind mehr als lange
 * angenommen. Neben den amerikanischen Unternehmen gehören dazu alle mit einem
 * Hinterlegungsschein in New York: Toyota, Shell, die Royal Bank of Canada, die
 * japanischen Großbanken. Sie reichen jährlich einen `20-F` ein, kanadische
 * Gesellschaften einen `40-F`, beide im selben Format wie ein amerikanischer
 * `10-K`.
 *
 * ## Die zweite Quelle: ESEF
 *
 * Wer keine US-Notierung hat, meldet trotzdem – nur woanders. Seit dem
 * Geschäftsjahr 2021 muss jeder Emittent an einem geregelten EU-Markt seinen
 * Konzernabschluss maschinenlesbar abgeben, ausgezeichnet nach `ifrs-full`.
 * Damit sind Airbus, L'Oréal, Enel, Kone und rund siebzig weitere europäische
 * Werte hinzugekommen, die vorher ohne Zahlen dastanden.
 *
 * Beide Quellen liegen in derselben Momentaufnahme. `esefKuerzel` sagt, welche
 * Einträge aus welcher stammen – das ist keine Buchhaltung um ihrer selbst
 * willen, sondern steht auf der Seite: Wer eine Zahl nachprüfen will, muss
 * wissen, wo er nachsehen muss.
 *
 * ## Was auch damit nicht abgedeckt ist
 *
 * Der deutsche Markt fast vollständig – Allianz, BMW, BASF melden an den
 * Bundesanzeiger, und der taucht im ESEF-Verzeichnis nicht auf. Ebenso alles
 * außerhalb der EU und ohne US-Notierung: Japan, Korea, Indien, Taiwan,
 * Hongkong. Jedes dieser Länder hat eine eigene Aufsicht mit eigenem Format,
 * teils mit Registrierungspflicht.
 *
 * Dort steht weiterhin „keine Angabe“. Das ist unbefriedigend, aber es ist die
 * Wahrheit – ein geschätztes Kurs-Gewinn-Verhältnis wäre schlimmer als gar
 * keins, weil es aussähe wie eine Tatsache.
 */

export interface Datenquelle {
  label: string
  url: string
  abgrenzung: string
}

interface Momentaufnahme {
  abgerufenAm: string
  quelle: Datenquelle
  unternehmen: Record<string, Bilanzzahlen & { waehrung?: string }>
  /** Nur vorhanden, sobald der ESEF-Abruf einmal gelaufen ist. */
  quelleEsef?: Datenquelle
  /** Die Kürzel, deren Zahlen aus den ESEF-Meldungen stammen. */
  esefKuerzel?: string[]
}

const daten = momentaufnahme as Momentaufnahme

/** Wann die Zahlen zuletzt geholt wurden. */
export const fundamentalStand: string = daten.abgerufenAm

/** Herkunft und Abgrenzung, wie sie unter der Tafel steht. */
export const fundamentalQuelle = daten.quelle

/** Dieselbe Angabe für die europäischen Werte, sofern es welche gibt. */
export const fundamentalQuelleEsef = daten.quelleEsef ?? null

const ausEsef = new Set(daten.esefKuerzel ?? [])

/**
 * Welche der beiden Quellen die Zahlen eines Kürzels geliefert hat.
 *
 * Steht unter der Kennzahlentafel jeder Aktie. Ohne diese Unterscheidung
 * stünde dort für Airbus die SEC – eine Behörde, bei der Airbus nichts
 * einreicht.
 */
export function getFundamentalquelle(ticker: string): Datenquelle | null {
  if (!daten.unternehmen[ticker]) return null
  return ausEsef.has(ticker) ? (daten.quelleEsef ?? daten.quelle) : daten.quelle
}

/** Wie viele Datensätze aus welcher Quelle stammen – für die Quellenseite. */
export function fundamentalHerkunft(): { sec: number; esef: number } {
  const gesamt = Object.keys(daten.unternehmen).length
  const esef = Object.keys(daten.unternehmen).filter((ticker) =>
    ausEsef.has(ticker)
  ).length
  return { sec: gesamt - esef, esef }
}

/**
 * Die Währung, in der ein Datensatz gemeldet ist.
 *
 * Fehlt sie, sind es US-Dollar: So kommen die Zahlen aus der us-gaap-Runde,
 * und dort ist der Dollar in der Abfrage festgelegt. Nur die IFRS-Melder
 * tragen eine eigene Währung, weil sie in ihrer Heimatwährung berichten.
 */
export function getBilanzwaehrung(ticker: string): string {
  return daten.unternehmen[ticker]?.waehrung ?? 'USD'
}

/**
 * Die gemeldeten Bilanzzahlen zu einem Börsenkürzel – oder `null`.
 *
 * `null` heißt: Dieses Unternehmen meldet nicht bei der SEC, oder seine
 * US-Notierung ist ein Hinterlegungsschein und die Zahlen ließen sich nicht
 * verlässlich auf ein Papier umrechnen.
 */
export function getBilanzzahlen(ticker: string): Bilanzzahlen | null {
  if (HINTERLEGUNGSSCHEINE.has(ticker)) return null

  const eintrag = daten.unternehmen[ticker]
  if (!eintrag) return null

  /*
    Ein Datensatz mit nur einer Größe ist keiner.

    Wer ausschließlich eine Aktienzahl meldet, bilanziert fast immer nach
    internationalen Vorschriften – die eigentlichen Zahlen stehen dann in einer
    Taxonomie, die diese Quelle nicht führt. Aus der Aktienzahl allein ließe
    sich nur die Marktkapitalisierung bilden, und die wäre bei einem
    Hinterlegungsschein womöglich um ein Vielfaches falsch.
  */
  const belegt = Object.values(eintrag).filter(
    (zahl) => typeof zahl === 'number' && Number.isFinite(zahl)
  ).length
  if (belegt < 2) return null

  // `waehrung` ist keine Bilanzgroesse und hat in der Rechnung nichts verloren.
  const zahlen: Bilanzzahlen & { waehrung?: string } = { ...eintrag }
  delete zahlen.waehrung
  return zahlen
}
