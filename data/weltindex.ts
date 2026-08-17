/**
 * Die Länderaufteilung des MSCI World – aus dem Factsheet des Indexanbieters.
 *
 * ## Warum nicht aus dem eigenen Katalog gerechnet
 *
 * Das war der erste Weg und er ist verworfen worden. Marktwert = Aktienzahl ×
 * Kurs lässt sich über den Katalog rechnen, und es kam ein Dollaranteil von
 * 86,4 % heraus. Die Zahl war falsch, und zwar auf die gefährliche Art: Die
 * Aktienzahlen liegen für 461 der 1.029 geführten Aktien vor, und die Lücke
 * fällt fast vollständig außerhalb der USA an – 95 % Abdeckung bei
 * amerikanischen Titeln, 28 % bei europäischen, 6 % bei japanischen, 4 % bei
 * indischen.
 *
 * Die 86,4 % hätten also die Datenabdeckung gemessen und ausgesehen wie eine
 * Eigenschaft des Marktes. Genau die Sorte Zahl, gegen die dieses Repository
 * an allen Ecken gebaut ist.
 *
 * ## Woher die Zahlen stattdessen kommen
 *
 * Aus dem **Factsheet des Indexanbieters selbst**, abgerufen am 17. August
 * 2026 über `.github/workflows/quellen-holen.yml` – die Entwicklungsumgebung
 * dieses Projekts erreicht keine externen Adressen, und eine Zahl, die niemand
 * abgerufen hat, gehört nicht in dieses Repository.
 *
 * MSCI veröffentlicht das Blatt monatlich. Es nennt die fünf größten Länder
 * einzeln und fasst den Rest zusammen – mehr steht dort nicht, und mehr steht
 * deshalb auch hier nicht.
 *
 * ## Warum eine gepflegte Datei und kein Abruf beim Bauen
 *
 * Weil sich die Zahlen einmal im Monat ändern und das Blatt ein PDF ist. Ein
 * Abruf bei jedem Bau wäre Aufwand für einen Wert, der vier Wochen steht.
 * Damit die Datei nicht still veraltet, prüft `weltindex-pruefen.yml` sie
 * monatlich gegen die Quelle und meldet, wenn die Gewichte gewandert sind.
 */

/** Ein Land mit seinem Gewicht im Index. */
export interface Landgewicht {
  land: string
  prozent: number
  /**
   * Die Währung, in der die Aktien dieses Landes notieren.
   *
   * `null` bei der Sammelposition: Hinter „Übrige" stecken ein Dutzend Länder
   * mit mindestens sechs Währungen, und welche wie viel ausmacht, sagt das
   * Factsheet nicht. Eine Aufteilung zu schätzen wäre hier besonders verkehrt –
   * die Seite handelt davon, dass man Währungsanteile kennen sollte.
   */
  waehrung: string | null
}

/**
 * Die Länder mit ihrem Gewicht, Stand des Factsheets.
 *
 * Reihenfolge wie im Blatt: absteigend, die Sammelposition zuletzt.
 */
export const WELTINDEX_LAENDER: readonly Landgewicht[] = [
  { land: 'Vereinigte Staaten', prozent: 72.03, waehrung: 'USD' },
  { land: 'Japan', prozent: 5.73, waehrung: 'JPY' },
  { land: 'Vereinigtes Königreich', prozent: 3.61, waehrung: 'GBP' },
  { land: 'Kanada', prozent: 3.41, waehrung: 'CAD' },
  { land: 'Frankreich', prozent: 2.44, waehrung: 'EUR' },
  { land: 'Übrige Länder', prozent: 12.78, waehrung: null },
]

/**
 * Die größten Einzelwerte – für die zweite Hälfte der Aussage.
 *
 * „Weltweit gestreut" heißt nicht nur, dass drei Viertel in einer Währung
 * stehen, sondern auch, dass zwei Unternehmen zusammen mehr wiegen als
 * Japan. Beides steht im selben Blatt.
 */
export const WELTINDEX_GROESSTE: readonly { name: string; prozent: number }[] = [
  { name: 'Apple', prozent: 5.07 },
  { name: 'Microsoft', prozent: 3.66 },
]

export const WELTINDEX_HERKUNFT = {
  index: 'MSCI World Index (USD)',
  quelle: 'MSCI, Index Factsheet',
  url: 'https://www.msci.com/documents/10199/178e6643-6ae6-47b9-82be-e1fc565ededb',
  /** Stichtag der Daten, wie ihn das Blatt selbst nennt. */
  stand: '2026-07-31',
  abgerufenAm: '2026-08-17',
  /** Marktwert des Index in Millionen US-Dollar, laut Blatt. */
  marktwertMioUsd: 89_526_461.89,
} as const
