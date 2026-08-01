/**
 * Welches Instrument zu einer Eingabe passt – und in welcher Reihenfolge.
 *
 * ## Warum das nicht die Seitensuche ist
 *
 * `lib/search-match.ts` sucht Seiten und bewertet Titel gegen Stichwörter. Hier
 * geht es um eine Auswahlliste: Der Nutzer weiß bereits, was er sucht, und
 * tippt den Anfang davon. Danach richtet sich die Rangfolge – wer „app“ tippt,
 * meint Apple und nicht „Applied Materials“, obwohl beide passen.
 *
 * Die Vereinheitlichung von Umlauten und Akzenten kommt trotzdem von dort: Wer
 * „nestle“ tippt, soll Nestlé finden, und diese Regel zweimal zu schreiben
 * hieße, sie irgendwann zweimal verschieden zu haben.
 *
 * Ohne Laufzeitimporte außer `normalize`, damit `tests/` das Modul direkt laden
 * kann.
 */

import { normalize } from './search-match.ts'

/** Was zum Finden eines Instruments gebraucht wird. */
export interface Suchbar {
  symbol: string
  name: string
  ticker: string
  /**
   * `null` ist ein eigener Zustand und kein fehlender Wert: Ein Rohstoff, ein
   * Währungspaar und ein Index haben keine Branche. `bewerte` behandelt beides
   * gleich – die Branchenstufe entfällt dann einfach.
   */
  branche?: string | null
}

/**
 * Wie gut ein Eintrag zur Eingabe passt. Kleiner ist besser, `null` heißt
 * „passt nicht“.
 *
 * Die Stufen in der Reihenfolge, in der ein Mensch sie erwartet:
 *
 * 0. Das Kürzel ist genau die Eingabe. Wer „SAP“ tippt, meint SAP.
 * 1. Der Name beginnt mit der Eingabe.
 * 2. Das Kürzel beginnt mit der Eingabe.
 * 3. Ein Wort im Namen beginnt mit der Eingabe – „micro“ findet
 *    „Advanced Micro Devices“.
 * 4. Die Eingabe steckt irgendwo im Namen oder Kürzel.
 * 5. Die Branche passt. Steht bewusst zuletzt: Wer „Halbleiter“ tippt, sucht
 *    eine Auswahl; wer „NVDA“ tippt, sucht einen Titel.
 */
export function bewerte(eintrag: Suchbar, eingabe: string): number | null {
  const suche = normalize(eingabe).trim()
  if (suche === '') return 4

  const name = normalize(eintrag.name)
  const ticker = normalize(eintrag.ticker)

  if (ticker === suche) return 0
  if (name.startsWith(suche)) return 1
  if (ticker.startsWith(suche)) return 2
  if (name.split(/[\s.-]+/).some((wort) => wort.startsWith(suche))) return 3
  if (name.includes(suche) || ticker.includes(suche)) return 4
  if (eintrag.branche && normalize(eintrag.branche).includes(suche)) return 5
  return null
}

/**
 * Die passenden Einträge, beste zuerst.
 *
 * `grenze` begrenzt die Liste. Nicht aus Sparsamkeit, sondern weil eine
 * Auswahlliste mit hundert Zeilen dasselbe Problem hat wie das Klappmenü, das
 * sie ersetzt: Man scrollt statt zu lesen. Wer seinen Titel nicht unter den
 * ersten Treffern sieht, tippt einen Buchstaben mehr – das ist schneller als
 * jedes Scrollen.
 */
export function filtere<T extends Suchbar>(
  eintraege: readonly T[],
  eingabe: string,
  grenze = 8
): T[] {
  const bewertet: { eintrag: T; rang: number }[] = []
  for (const eintrag of eintraege) {
    const rang = bewerte(eintrag, eingabe)
    if (rang !== null) bewertet.push({ eintrag, rang })
  }
  bewertet.sort(
    (a, b) => a.rang - b.rang || a.eintrag.name.localeCompare(b.eintrag.name, 'de')
  )
  return bewertet.slice(0, grenze).map((b) => b.eintrag)
}
