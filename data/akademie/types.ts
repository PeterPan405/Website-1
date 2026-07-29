/**
 * Das Datenmodell der Akademie.
 *
 * ## Warum ein eigener Bereich und keine vierte Lernstufe
 *
 * Der Lernbereich beantwortet die Frage, was es gibt: Was ist eine Aktie, wie
 * funktioniert ein ETF, was passiert bei einer Zinserhöhung. Die Akademie
 * beantwortet die Frage danach: Wie beurteilt man, was man vor sich hat. Das
 * ist ein anderes Handwerk und setzt den Lernbereich nicht voraus – wer einen
 * Chart lesen lernen will, muss nicht vorher 33 Themen durchgearbeitet haben.
 *
 * ## Warum die Lektionen flach liegen
 *
 * Ein Lernthema hat drei Stufen, weil dieselbe Sache dreimal unterschiedlich
 * tief erklärt wird. Eine Lektion der Akademie hat das nicht: „Was ein
 * gleitender Durchschnitt ist“ gibt es nicht in drei Tiefen, sondern einmal
 * richtig. Stattdessen bauen die Lektionen aufeinander auf – und in welcher
 * Reihenfolge, sagt `reihenfolge` in der Bereichsdatei, nicht eine Stufe im
 * Datensatz.
 */

import type { ContentBlock } from '@/data/content'

/** Die beiden Zweige der Akademie. */
export type BereichId = 'technische-analyse' | 'fundamentalanalyse'

/**
 * Wie gesichert eine Methode ist.
 *
 * ## Warum das an jeder Lektion steht
 *
 * Weil es der einzige ehrliche Umgang mit diesem Stoff ist. Zwischen „ein
 * gleitender Durchschnitt ist der Mittelwert der letzten n Schlusskurse“ und
 * „eine goldene Kreuzung kündigt einen Aufwärtstrend an“ liegt der Unterschied
 * zwischen einer Definition und einer Behauptung. Eine Seite, die beides in
 * derselben Schriftart nebeneinanderstellt, führt in die Irre – auch wenn
 * jeder einzelne Satz für sich stimmt.
 *
 * Die Einstufung bewertet nicht die Methode, sondern die Beleglage:
 *
 * - `definition` – rechnerisch festgelegt. Hier gibt es nichts zu glauben.
 * - `beobachtung` – ein Muster, das sich in Kursreihen wiederfindet, dessen
 *   Vorhersagekraft aber umstritten ist.
 * - `deutung` – eine Auslegung, die von der Person abhängt, die sie vornimmt.
 *   Zwei Fachleute kommen beim selben Chart zu verschiedenen Ergebnissen.
 */
export type Belegart = 'definition' | 'beobachtung' | 'deutung'

export const belegarten: Record<Belegart, { label: string; erklaerung: string }> = {
  definition: {
    label: 'Rechenweg',
    erklaerung:
      'Festgelegt und nachrechenbar. Über das Ergebnis kann man nicht streiten, nur über seine Verwendung.',
  },
  beobachtung: {
    label: 'Beobachtung',
    erklaerung:
      'Ein Muster, das sich in Kursreihen zeigt. Ob es künftige Kurse vorhersagt, ist umstritten und je nach Markt und Zeitraum verschieden.',
  },
  deutung: {
    label: 'Auslegung',
    erklaerung:
      'Hängt von der Person ab, die sie vornimmt. Zwei Fachleute können denselben Chart unterschiedlich einzeichnen und zu gegenteiligen Schlüssen kommen.',
  },
}

export interface Lektion {
  slug: string
  bereich: BereichId
  titel: string
  /** Ein Satz für Übersichten und die Meta-Beschreibung. */
  kurz: string
  /**
   * Der Satz, der hängen bleiben soll, wenn sonst nichts hängen bleibt.
   *
   * Steht oben auf der Lektionsseite hervorgehoben. Pflichtfeld: Eine Lektion,
   * für die sich keine Kernaussage formulieren lässt, hat keine.
   */
  kernaussage: string
  belegart: Belegart
  /** Lesezeit in Minuten, geschätzt. */
  dauer: number
  /** Begriffe, die zum Auffinden über die Suche taugen. */
  stichworte: string[]
  /** Slugs anderer Lektionen, die man vorher gelesen haben sollte. */
  setztVoraus?: string[]
  /** Slugs von Lernthemen unter `/lernen`, die den Stoff ergänzen. */
  lernthemen?: string[]
  /** Slugs von Rechnern unter `/rechner`, die hier passen. */
  rechner?: string[]
  inhalt: ContentBlock[]
}

export interface Bereich {
  id: BereichId
  titel: string
  /** Ein Satz für die Übersichtsseite. */
  kurz: string
  /** Der einleitende Absatz auf der Bereichsseite. */
  einleitung: string
  /**
   * Was dieser Zweig nicht leistet.
   *
   * Steht als eigener Kasten auf der Bereichsseite und ist Pflicht. Beide
   * Verfahren haben bekannte Grenzen, und eine Bildungsseite, die sie
   * verschweigt, verkauft eine Methode statt sie zu erklären.
   */
  grenzen: string[]
  /** Die Reihenfolge der Lektionen – aufbauend, nicht alphabetisch. */
  reihenfolge: string[]
}
