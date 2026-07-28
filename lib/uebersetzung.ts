/**
 * Die Mechanik hinter dem Sprachumschalter.
 *
 * Bewusst ohne Importe, damit `tests/` die Auswahllogik direkt laden kann – der
 * Alias `@/` steht dort nicht zur Verfügung.
 *
 * ## Warum keine zweite Fassung der Website
 *
 * Der naheliegende Weg wäre ein zweiter Routenbaum unter `/en` mit übersetzten
 * Inhalten. Dagegen spricht der Umfang: Unter `data/` stehen 99 Lernstufen,
 * 396 Quizfragen, über 500 Aktienbeschreibungen und die Tagesausgaben – rund
 * eine Viertelmillion Wörter. Eine Maschinenübersetzung davon ungelesen zu
 * veröffentlichen wäre bei Finanzthemen unverantwortlich, und eine geprüfte
 * Übersetzung ist Monatsarbeit, keine Funktion.
 *
 * Was stattdessen hier passiert: Die Seite wird **im Browser** übersetzt, Text
 * für Text, und zwar mit dem Übersetzer, den moderne Browser eingebaut haben.
 * Der läuft auf dem Gerät – es verlässt kein Text die Maschine des Besuchers.
 * Das ist nicht nur datenschutzrechtlich der saubere Weg, es funktioniert auch
 * auf allen 741 Seiten gleich gut, ohne dass eine einzige davon doppelt
 * gepflegt werden muss.
 *
 * ## Was passiert, wenn der Browser das nicht kann
 *
 * Dann bleibt die Seite deutsch, und der Umschalter bietet stattdessen an, sie
 * bei einem Übersetzungsdienst zu öffnen. Das ist ein gewöhnlicher Verweis nach
 * außen, den der Besucher anklickt oder nicht – kein eingebettetes fremdes
 * Skript, das schon beim Aufruf der Seite mitliest.
 */

/** Der Schlüssel im localStorage für die gewählte Sprache. */
export const SPRACH_SCHLUESSEL = 'fk-sprache'

/** Elemente, deren Inhalt nicht übersetzt werden darf. */
const TABU = new Set(['SCRIPT', 'STYLE', 'CODE', 'PRE', 'KBD', 'SAMP', 'NOSCRIPT'])

/**
 * Ob ein Textstück überhaupt Übersetzung braucht.
 *
 * Reine Zahlen, Währungskürzel und einzelne Zeichen gehen unverändert durch.
 * Das ist kein Feinschliff, sondern der Unterschied zwischen ein paar hundert
 * und ein paar tausend Aufrufen je Seite – in einer Kurstabelle ist die große
 * Mehrheit aller Textknoten eine Zahl.
 */
export function brauchtUebersetzung(text: string): boolean {
  const sauber = text.trim()
  if (sauber.length < 2) return false
  // Enthält mindestens zwei aufeinanderfolgende Buchstaben?
  return /\p{L}\p{L}/u.test(sauber)
}

/**
 * Ob ein Element und alles darin übersetzt werden darf.
 *
 * `data-nicht-uebersetzen` ist der Ausweg für Stellen, an denen eine
 * Übersetzung schadet – ein Kürzel, ein Eigenname, eine Formel.
 */
export function darfUebersetzen(element: Element): boolean {
  if (TABU.has(element.tagName)) return false
  if (element.hasAttribute('data-nicht-uebersetzen')) return false
  if (element.getAttribute('translate') === 'no') return false
  return true
}

/**
 * Teilt eine Liste in Blöcke fester Größe.
 *
 * Der Übersetzer bekommt die Stücke blockweise und nicht alle auf einmal:
 * Tausend gleichzeitige Aufrufe bringen die Warteschlange des Browsers zum
 * Stocken, und der Bildschirm friert ein, bis alles fertig ist. Blockweise
 * erscheint die Übersetzung nach und nach, von oben nach unten.
 */
export function inBloecke<T>(liste: readonly T[], groesse: number): T[][] {
  if (groesse < 1) return [liste.slice()]
  const bloecke: T[][] = []
  for (let i = 0; i < liste.length; i += groesse) {
    bloecke.push(liste.slice(i, i + groesse))
  }
  return bloecke
}

/**
 * Die Adresse, unter der ein Übersetzungsdienst diese Seite anzeigt.
 *
 * Nur für den Fall, dass der Browser keinen eigenen Übersetzer mitbringt. Der
 * Aufruf geschieht erst auf Klick und in einem neuen Tab.
 */
export function ausweichAdresse(seite: string): string {
  const ziel = encodeURIComponent(seite)
  return `https://translate.google.com/translate?sl=de&tl=en&u=${ziel}`
}
