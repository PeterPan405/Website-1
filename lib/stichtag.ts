/**
 * Prüft, welche Stichtagswerte überholt sind.
 *
 * ## Warum die Typen hier noch einmal stehen
 *
 * Dieses Modul kommt ohne Laufzeitimporte aus, damit `tests/` es direkt laden
 * kann – der Alias `@/` steht dort nicht zur Verfügung. Statt aus
 * `data/stichtagswerte.ts` zu importieren, beschreibt es die Form, die es
 * braucht, und nimmt alles entgegen, was dazu passt. TypeScript prüft das
 * strukturell; der echte Datensatz erfüllt es, ohne dass eine der beiden
 * Dateien von der anderen wüsste.
 *
 * ## Warum ein Wert nicht „falsch“ heißt, sondern „überholt“
 *
 * Der Basiszins von 2,53 Prozent war für 2025 richtig und ist es für 2025
 * immer noch. Falsch wird er erst durch die Behauptung, er gelte auch jetzt.
 * Diese Unterscheidung steht in den Meldungen, weil sie den Unterschied
 * zwischen einem Fehler und einer Pflegeaufgabe ausmacht.
 */

/** Die Form, die dieses Modul von einem Stichtagswert braucht. */
export interface GeprueferterWert {
  id: string
  bezeichnung: string
  gilt: number
  turnus: 'jaehrlich' | 'unbestimmt'
  pflege: string
}

export interface Befund<T extends GeprueferterWert> {
  wert: T
  /** Um wie viele Jahre der Wert hinterherhinkt. */
  jahreZurueck: number
}

/**
 * Die Werte, deren Jahr vorbei ist.
 *
 * Nur `jaehrlich` gesetzte Werte können überholt sein. Ein Betrag, der im
 * Gesetz steht, läuft nicht ab – er ändert sich, wenn der Gesetzgeber ihn
 * ändert, und darauf hilft kein Kalender.
 */
export function ueberholt<T extends GeprueferterWert>(
  werte: readonly T[],
  jahr: number
): Befund<T>[] {
  return werte
    .filter((wert) => wert.turnus === 'jaehrlich' && wert.gilt < jahr)
    .map((wert) => ({ wert, jahreZurueck: jahr - wert.gilt }))
    .sort((a, b) => b.jahreZurueck - a.jahreZurueck)
}

/**
 * Der Satz, der beim Wert steht.
 *
 * Er wird abgeleitet und nicht getippt. Vorher stand im Steuerrechner von Hand
 * „Für 2025 lag er bei 2,53 Prozent“ – ein Satz, der beim nächsten Wert
 * mitgeändert werden müsste und es erfahrungsgemäß nicht wird.
 */
export function geltungssatz(
  bezeichnung: string,
  gilt: number,
  wertText: string,
  jahr: number
): string {
  if (gilt >= jahr) {
    return `${bezeichnung}: für ${gilt} bekanntgegeben mit ${wertText}.`
  }
  return (
    `${bezeichnung}: zuletzt für ${gilt} bekanntgegeben mit ${wertText}. ` +
    `Für ${jahr} liegt hier noch kein Wert vor – bitte selbst nachsehen.`
  )
}
