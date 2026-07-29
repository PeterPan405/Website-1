import momentaufnahme from '@/data/snapshots/fundamentaldaten.json'

import { HINTERLEGUNGSSCHEINE } from '@/lib/hinterlegungsscheine'
import type { Bilanzzahlen } from '@/lib/fundamentalkennzahlen'

/**
 * Zugriff auf die Bilanzzahlen der US-Börsenaufsicht.
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
 * Nicht erfasst ist, wer keine US-Notierung hat – Nestlé, Allianz, BMW,
 * Samsung, der Großteil der deutschen und französischen Werte. Für sie gibt es
 * keine vergleichbare offene Quelle: Jedes Land hat seine eigene Aufsicht mit
 * eigenem Format, und die kommerziellen Anbieter verlangen einen Schlüssel und
 * eine Lizenz.
 *
 * Dort steht deshalb „keine Angabe“. Das ist unbefriedigend, aber es ist die
 * Wahrheit – ein geschätztes Kurs-Gewinn-Verhältnis wäre schlimmer als gar
 * keins, weil es aussähe wie eine Tatsache.
 */

interface Momentaufnahme {
  abgerufenAm: string
  quelle: { label: string; url: string; abgrenzung: string }
  unternehmen: Record<string, Bilanzzahlen & { waehrung?: string }>
}

const daten = momentaufnahme as Momentaufnahme

/** Wann die Zahlen zuletzt geholt wurden. */
export const fundamentalStand: string = daten.abgerufenAm

/** Herkunft und Abgrenzung, wie sie unter der Tafel steht. */
export const fundamentalQuelle = daten.quelle

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
