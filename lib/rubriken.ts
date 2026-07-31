/**
 * Die Rubriken der Nachrichten als eigene Seiten.
 *
 * ## Warum es sie bis Juli 2026 nicht gab
 *
 * Die Rubrik stand an jedem Artikel und auf der Übersicht als Reihe von
 * Merkzeichen – anklickbar war sie nirgends. Wer „alles zur Geldpolitik“ lesen
 * wollte, hatte keinen Weg dorthin. Im Quelltext stand dazu der Kommentar
 * „eine echte Filterung folgt mit dem CMS“; ein CMS gibt es hier nicht und
 * wird es nicht geben, weil die Website statisch ausgeliefert wird. Fünf
 * gebaute Seiten leisten dasselbe und kosten nichts.
 *
 * ## Warum der Adressteil nicht aus dem Namen entsteht
 *
 * Weil „Steuern & Recht“ ein Kaufmanns-Und enthält und ein Umlaut in „Märkte“
 * steckt. Beides ließe sich umschreiben, aber dann hinge die Adresse am Namen:
 * Eine spätere Umbenennung der Rubrik änderte still die Adresse und machte
 * jeden Verweis darauf ungültig. Der Adressteil steht deshalb ausgeschrieben
 * daneben und wird beim Umbenennen absichtlich **nicht** mitgeändert.
 *
 * Ohne Laufzeitimporte, damit `tests/` das Modul direkt laden kann.
 */

export interface Rubrik {
  /** Der Name, wie er an den Artikeln steht. */
  name: string
  /** Der Adressteil unter `/news/rubrik/`. */
  slug: string
  /** Ein Satz darüber, was in dieser Rubrik steht. */
  beschreibung: string
}

export const rubriken: readonly Rubrik[] = [
  {
    name: 'Geldpolitik',
    slug: 'geldpolitik',
    beschreibung:
      'Was Notenbanken entscheiden und was daraus für Sparzinsen, Kredite und Kurse folgt. Der Zins ist der Preis des Geldes – er wirkt auf alles andere.',
  },
  {
    name: 'Märkte',
    slug: 'maerkte',
    beschreibung:
      'Bewegungen an Aktien-, Anleihe- und Rohstoffmärkten, eingeordnet. Nicht jede Bewegung hat einen Grund, und nicht jeder genannte Grund ist einer.',
  },
  {
    name: 'Geldanlage',
    slug: 'geldanlage',
    beschreibung:
      'Wie man anlegt und welche Fehler dabei am meisten kosten. Kosten, Streuung und Geduld schlagen in der Summe fast jede Auswahl einzelner Titel.',
  },
  {
    name: 'Vorsorge',
    slug: 'vorsorge',
    beschreibung:
      'Rente, Rentenlücke und die Frage, wie viel man zurücklegen muss. Die Rechnung ist unangenehm und deshalb selten gemacht.',
  },
  {
    name: 'Steuern & Recht',
    slug: 'steuern-und-recht',
    beschreibung:
      'Abgeltungsteuer, Freistellungsauftrag, Vorabpauschale – und was sich davon ändert. Keine Steuerberatung, sondern die Erklärung der Regeln.',
  },
]

/** Eine Rubrik über ihren Adressteil, oder `null`. */
export function rubrikFuerSlug(slug: string): Rubrik | null {
  return rubriken.find((rubrik) => rubrik.slug === slug) ?? null
}

/** Eine Rubrik über ihren Namen, oder `null`. */
export function rubrikFuerNamen(name: string): Rubrik | null {
  return rubriken.find((rubrik) => rubrik.name === name) ?? null
}

/** Der Adressteil zu einem Rubriknamen, oder `null`. */
export function rubrikSlug(name: string): string | null {
  return rubrikFuerNamen(name)?.slug ?? null
}
