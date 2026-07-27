import momentaufnahme from '@/data/snapshots/fundamentaldaten.json'

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
 * Die SEC kennt nur Unternehmen, die nach US-Vorschriften bilanzieren. Von den
 * gut 420 geführten Aktien sind das rund 130. Für SAP, Toyota, Nestlé oder
 * Samsung gibt es keine vergleichbare offene Quelle: Jedes Land hat seine
 * eigene Aufsicht mit eigenem Format, und die kommerziellen Anbieter verlangen
 * einen Schlüssel und eine Lizenz.
 *
 * Dort steht deshalb „keine Angabe“. Das ist unbefriedigend, aber es ist die
 * Wahrheit – ein geschätztes Kurs-Gewinn-Verhältnis wäre schlimmer als gar
 * keins, weil es aussähe wie eine Tatsache.
 */

interface Momentaufnahme {
  abgerufenAm: string
  quelle: { label: string; url: string; abgrenzung: string }
  unternehmen: Record<string, Bilanzzahlen>
}

const daten = momentaufnahme as Momentaufnahme

/** Wann die Zahlen zuletzt geholt wurden. */
export const fundamentalStand: string = daten.abgerufenAm

/** Herkunft und Abgrenzung, wie sie unter der Tafel steht. */
export const fundamentalQuelle = daten.quelle

/**
 * Aktien, deren US-Notierung ein Hinterlegungsschein ist.
 *
 * Ein American Depositary Receipt ist nicht die Aktie selbst, sondern ein
 * Zertifikat darauf – und das Bezugsverhältnis ist nicht immer eins zu eins.
 * Ein Papier von Taiwan Semiconductor verbrieft fünf Stammaktien, eines von
 * Alibaba acht. Die Aktienzahl aus der Meldung zählt aber Stammaktien.
 *
 * Wer beides ungeprüft verrechnet, bekommt eine Marktkapitalisierung, die um
 * genau diesen Faktor danebenliegt – bei Taiwan Semiconductor also das
 * Fünffache. Das sähe aus wie eine Tatsache und wäre grob falsch. Für diese
 * Werte wird deshalb nichts gerechnet.
 *
 * Die meisten Kandidaten fallen ohnehin vorher heraus, weil sie nach
 * internationalen Vorschriften bilanzieren und in den US-Meldungen nur ihre
 * Aktienzahl hinterlassen. Die Liste fängt den Rest ab – und den nächsten Wert,
 * der ohne diesen Hinweis dazukäme.
 */
const HINTERLEGUNGSSCHEINE = new Set([
  'BABA', // Alibaba – ein Papier verbrieft acht Stammaktien
  'TSM', // Taiwan Semiconductor – fünf
  'UMC', // United Microelectronics – fünf
  'RYAAY', // Ryanair – fünf
  'ASML', // ASML – eins, aber Bilanz nach IFRS
  'SAP', // SAP – eins, Bilanz nach IFRS
  'NVO', // Novo Nordisk – eins, Bilanz nach IFRS
  'ARM', // Arm Holdings – eins, Bilanz nach IFRS
])

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

  return eintrag
}
