/**
 * Alle Meldungen zu einem Wert oder einem Thema, chronologisch.
 *
 * ## Wozu
 *
 * Das Archiv wächst täglich, und bisher war es nur über den Kalender
 * erreichbar: nach Tag, Monat, Jahr. Wer wissen wollte, was über die Zeit zum
 * Ölpreis geschrieben wurde, musste die Tage durchgehen. Die Verbindung stand
 * dabei längst in den Daten – jeder Artikel führt unter `relatedSymbols` die
 * Kurse und unter `relatedTopics` die Themen, um die es geht.
 *
 * Diese Datei liest dieselbe Liste andersherum. Kein zweites Feld, keine
 * zweite Pflege, nichts, was auseinanderlaufen kann.
 *
 * ## Warum nicht für jeden Wert ein Strang entsteht
 *
 * Weil ein Strang aus einem Artikel keiner ist. Am 18. August 2026 gemessen:
 * 68 Werte haben überhaupt eine Meldung, aber **34 davon genau eine**, und nur
 * 24 haben drei oder mehr. Eine eigene Seite mit einem einzigen Verweis wäre
 * ein Umweg zum Artikel und für Suchmaschinen eine dünne Seite mehr.
 *
 * Die Grenze steht deshalb bei `MINDEST_ARTIKEL`, und sie ist nicht willkürlich
 * gewählt: Die Kursseite zeigt bereits die vier jüngsten Meldungen inline. Ein
 * Strang lohnt sich also erst, wenn er mehr zeigt als das – sonst wäre er
 * dieselbe Liste an einer zweiten Stelle.
 *
 * ## Was hier nicht passiert
 *
 * Keine Zusammenfassung, keine Einordnung, keine Verbindung zwischen den
 * Meldungen. Ein Strang ist eine Liste in zeitlicher Ordnung. Was sich aus
 * mehreren Meldungen ergibt, steht nicht in den Daten und wäre erfunden.
 */

/** Was ein Strang über einen Artikel braucht. */
export interface Strangartikel {
  slug: string
  title: string
  teaser: string
  publishedAt: string
  relatedSymbols: readonly string[]
  relatedTopics: readonly string[]
}

/**
 * Ab wie vielen Meldungen ein Strang eine eigene Seite bekommt.
 *
 * Fünf, weil die Kursseite vier zeigt: Darunter wäre der Strang dieselbe Liste
 * an einer zweiten Stelle. Bei den Lernthemen gibt es keine solche Inline-Liste,
 * dieselbe Grenze gilt trotzdem – eine Seite mit drei Verweisen ist kein Strang.
 */
export const MINDEST_ARTIKEL = 5

/** Ein Strang: der Schlüssel und die Meldungen dazu, jüngste zuerst. */
export interface Strang {
  schluessel: string
  artikel: Strangartikel[]
  /** Der Tag der ältesten Meldung – der Anfang des Strangs. */
  von: string
  /** Der Tag der jüngsten. */
  bis: string
}

/** Nach welchem Feld gebündelt wird. */
export type Strangart = 'symbol' | 'thema'

function schluesselVon(artikel: Strangartikel, art: Strangart): readonly string[] {
  return art === 'symbol' ? artikel.relatedSymbols : artikel.relatedTopics
}

/**
 * Alle Meldungen zu einem Schlüssel, jüngste zuerst.
 *
 * Ohne Begrenzung – das ist der Unterschied zur Kursseite. Wer den Strang
 * öffnet, will die ganze Reihe.
 */
export function strangFuer(
  artikel: readonly Strangartikel[],
  art: Strangart,
  schluessel: string
): Strangartikel[] {
  return [...artikel]
    .filter((eintrag) => schluesselVon(eintrag, art).includes(schluessel))
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
}

/**
 * Alle Stränge einer Art, die die Mindestzahl erreichen – längster zuerst.
 *
 * Die Sortierung nach Länge und nicht alphabetisch: Wer eine Übersicht öffnet,
 * sucht die Werte, zu denen es etwas zu lesen gibt.
 */
export function straenge(
  artikel: readonly Strangartikel[],
  art: Strangart,
  mindestens = MINDEST_ARTIKEL
): Strang[] {
  const nachSchluessel = new Map<string, Strangartikel[]>()

  for (const eintrag of artikel) {
    for (const schluessel of schluesselVon(eintrag, art)) {
      const bisher = nachSchluessel.get(schluessel) ?? []
      bisher.push(eintrag)
      nachSchluessel.set(schluessel, bisher)
    }
  }

  return [...nachSchluessel.entries()]
    .filter(([, eintraege]) => eintraege.length >= mindestens)
    .map(([schluessel, eintraege]) => {
      const sortiert = [...eintraege].sort((a, b) =>
        b.publishedAt.localeCompare(a.publishedAt)
      )
      return {
        schluessel,
        artikel: sortiert,
        von: sortiert[sortiert.length - 1].publishedAt.slice(0, 10),
        bis: sortiert[0].publishedAt.slice(0, 10),
      }
    })
    .sort(
      (a, b) =>
        b.artikel.length - a.artikel.length ||
        a.schluessel.localeCompare(b.schluessel, 'de')
    )
}

/** Die Schlüssel, für die eine Seite gebaut wird. */
export function strangSchluessel(
  artikel: readonly Strangartikel[],
  art: Strangart,
  mindestens = MINDEST_ARTIKEL
): string[] {
  return straenge(artikel, art, mindestens).map((strang) => strang.schluessel)
}

/** Ein Jahrgang innerhalb eines Strangs. */
export interface Strangjahr {
  jahr: string
  artikel: Strangartikel[]
}

/**
 * Den Strang nach Jahren gliedern, jüngstes zuerst.
 *
 * Nach Jahren und nicht nach Monaten: Ein Strang über zwei Jahre hat bei
 * Monatsüberschriften mehr Überschriften als Meldungen. Die Jahreszahl ist die
 * Gliederung, die bei jeder Länge trägt.
 */
export function nachJahren(artikel: readonly Strangartikel[]): Strangjahr[] {
  const jahre = new Map<string, Strangartikel[]>()

  for (const eintrag of artikel) {
    const jahr = eintrag.publishedAt.slice(0, 4)
    const bisher = jahre.get(jahr) ?? []
    bisher.push(eintrag)
    jahre.set(jahr, bisher)
  }

  return [...jahre.entries()]
    .map(([jahr, eintraege]) => ({ jahr, artikel: eintraege }))
    .sort((a, b) => b.jahr.localeCompare(a.jahr))
}
