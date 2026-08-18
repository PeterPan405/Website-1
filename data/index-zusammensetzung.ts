/**
 * Ländergewichtung von Indizes.
 *
 * ## Warum diese Zahlen nicht aus dem Kursabruf kommen
 *
 * Kurse holt `scripts/kurse-abrufen.ts` halbstündlich. Die Zusammensetzung eines
 * Index ist etwas anderes: Sie steht in einem PDF des Anbieters, wird monatlich
 * fortgeschrieben und ist über keine offene Schnittstelle abrufbar. Sie wird
 * deshalb von Hand gepflegt – und trägt aus genau diesem Grund ein sichtbares
 * `stand`-Datum. Eine Gewichtung ohne Datum wäre eine Behauptung.
 *
 * ## Woher die Zahlen stammen
 *
 * Aus dem offiziellen Factsheet des Indexanbieters, in dessen eigener
 * Aufteilung. Das MSCI-Factsheet weist die fünf größten Länder einzeln aus und
 * fasst den Rest zusammen; genau so steht es hier. Die Aufteilung selbst
 * nachzubauen – etwa den „Rest“ auf einzelne Länder zu verteilen – hieße,
 * Zahlen zu erfinden, die in der Quelle nicht stehen.
 *
 * Zum rechtlichen Rahmen: Prozentangaben sind Tatsachen und als solche nicht
 * geschützt (§ 2 UrhG schützt die Darstellung, nicht das Faktum). Übernommen
 * wird die Zahl, nicht die Gestaltung des Factsheets – mit Quellenangabe und
 * Link.
 */

export interface Laendergewicht {
  land: string
  /** Anteil am Index in Prozent. */
  anteil: number
  /** Wahr für die Sammelposition „übrige Länder“. */
  sammelposten?: boolean
  /**
   * Die Währung, in der die Aktien dieses Landes notieren.
   *
   * Fehlt beim Sammelposten: Dahinter stecken ein Dutzend Länder mit
   * mindestens sechs Währungen, und welche wie viel ausmacht, sagt das
   * Factsheet nicht. Eine Aufteilung zu schätzen wäre besonders verkehrt, weil
   * `/maerkte/waehrungen-im-weltindex` davon handelt, dass man Währungsanteile
   * kennen sollte.
   */
  waehrung?: string
}

/** Ein Einzelwert aus der Top-Liste des Factsheets. */
export interface Einzelwert {
  name: string
  /** Gewicht im Index in Prozent. */
  anteil: number
  /** Branche in der Einteilung des Blattes, deutsch. */
  branche?: string
  /** Streubesitz-Marktwert in Milliarden US-Dollar. */
  marktwertMrdUsd?: number
  /**
   * Das Unternehmen dahinter, wenn es nicht der Name ist.
   *
   * Alphabet steht mit zwei Aktiengattungen in der Liste. Wer „die zehn
   * größten Unternehmen“ sagt, zählt in Wahrheit neun – und genau dieser
   * Unterschied ist auf einer Seite über Klumpenrisiko der Punkt.
   */
  unternehmen?: string
}

/** Ein Branchengewicht in der Einteilung des Blattes. */
export interface Branchengewicht {
  /** Deutsche Bezeichnung – die des Blattes ist englisch. */
  branche: string
  anteil: number
}

/**
 * Die Kennzahlen, die das Blatt zum Index selbst nennt.
 *
 * Alle aus derselben Seite des Factsheets („Index Characteristics“ und
 * „Fundamentals“). Sie sind hier, weil sich mit ihnen nachrechnen lässt, was
 * „breit gestreut“ heißt: 1.282 Werte klingen nach viel, bis man den größten
 * gegen den Gleichgewichtsanteil hält.
 */
export interface IndexKennzahlen {
  /** Zahl der Indexwerte. */
  anzahlWerte: number
  /** Größter Einzelwert, Streubesitz-Marktwert in Millionen US-Dollar. */
  groessterMioUsd: number
  /** Kleinster Einzelwert, ebenso. */
  kleinsterMioUsd: number
  /** Arithmetisches Mittel der Marktwerte. */
  mittelMioUsd: number
  /** Median der Marktwerte. */
  medianMioUsd: number
  /** Dividendenrendite in Prozent. */
  dividendenrendite?: number
  /** Kurs-Gewinn-Verhältnis, laufend. */
  kgv?: number
  /** Kurs-Gewinn-Verhältnis auf Basis der Gewinnschätzung. */
  kgvErwartet?: number
  /** Kurs-Buchwert-Verhältnis. */
  kbv?: number
  /** Zahl der abgedeckten Länder. */
  laender?: number
  /** Anteil der Marktkapitalisierung je Land, den der Index abdeckt. */
  abdeckungProzent?: number
}

export interface IndexZusammensetzung {
  /** Stichtag der Gewichtung im Format `YYYY-MM-DD`. */
  stand: string
  quelle: { label: string; url: string }
  /** Ein Satz, der die Aufteilung einordnet. */
  hinweis: string
  laender: Laendergewicht[]
  /** Die größten Einzelwerte, soweit das Blatt sie nennt. */
  groesste?: Einzelwert[]
  /** Die Branchengewichte, soweit das Blatt sie nennt. */
  branchen?: Branchengewicht[]
  /** Marktwert des Index in Millionen US-Dollar, laut Blatt. */
  marktwertMioUsd?: number
  /** Was das Blatt sonst über den Index selbst sagt. */
  kennzahlen?: IndexKennzahlen
}

export const indexZusammensetzung: Record<string, IndexZusammensetzung> = {
  'msci-world': {
    stand: '2026-07-31',
    quelle: {
      label: 'MSCI World Index Factsheet',
      url: 'https://www.msci.com/documents/10199/178e6643-6ae6-47b9-82be-e1fc565ededb',
    },
    hinweis:
      'MSCI weist die fünf größten Länder einzeln aus und fasst die übrigen Industrieländer zusammen. In dieser Sammelposition stecken unter anderem die Schweiz, Deutschland, Australien und die Niederlande.',
    laender: [
      { land: 'USA', anteil: 72.03, waehrung: 'USD' },
      { land: 'Japan', anteil: 5.73, waehrung: 'JPY' },
      { land: 'Großbritannien', anteil: 3.61, waehrung: 'GBP' },
      { land: 'Kanada', anteil: 3.41, waehrung: 'CAD' },
      { land: 'Frankreich', anteil: 2.44, waehrung: 'EUR' },
      { land: 'Übrige Industrieländer', anteil: 12.78, sammelposten: true },
    ],
    /*
      Die größten Einzelwerte – die zweite Hälfte derselben Aussage.

      „Breit gestreut“ heißt nicht nur, dass drei Viertel in einer Währung
      stehen, sondern auch, dass zwei Unternehmen zusammen mehr wiegen als
      Japan. Beides steht in demselben Blatt.

      Die Reihenfolge ist die des Blattes und wird nicht geraten: Beim ersten
      Anlauf stand hier Apple an erster Stelle, weil es das bekanntere
      Unternehmen ist. Das Blatt sagt NVIDIA – seit Juli 2026 mit 5,18 % vor
      Apple mit 5,07 %. Wer die Rangfolge aus dem Gedächtnis schreibt, schreibt
      den Stand von vorgestern.
    */
    groesste: [
      {
        name: 'NVIDIA',
        anteil: 5.18,
        branche: 'Informationstechnologie',
        marktwertMrdUsd: 4634.31,
      },
      {
        name: 'Apple',
        anteil: 5.07,
        branche: 'Informationstechnologie',
        marktwertMrdUsd: 4535.15,
      },
      {
        name: 'Microsoft',
        anteil: 3.66,
        branche: 'Informationstechnologie',
        marktwertMrdUsd: 3278.3,
      },
      {
        name: 'Amazon.com',
        anteil: 2.94,
        branche: 'Zyklischer Konsum',
        marktwertMrdUsd: 2628.58,
      },
      {
        name: 'Alphabet A',
        anteil: 2.32,
        branche: 'Kommunikationsdienste',
        marktwertMrdUsd: 2073.39,
        unternehmen: 'Alphabet',
      },
      {
        name: 'Broadcom',
        anteil: 1.96,
        branche: 'Informationstechnologie',
        marktwertMrdUsd: 1750.96,
      },
      {
        name: 'Alphabet C',
        anteil: 1.84,
        branche: 'Kommunikationsdienste',
        marktwertMrdUsd: 1648.54,
        unternehmen: 'Alphabet',
      },
      {
        name: 'Meta Platforms A',
        anteil: 1.37,
        branche: 'Kommunikationsdienste',
        marktwertMrdUsd: 1222.56,
      },
      {
        name: 'JPMorgan Chase',
        anteil: 1.05,
        branche: 'Finanzwesen',
        marktwertMrdUsd: 943.58,
      },
      {
        name: 'Micron Technology',
        anteil: 1.04,
        branche: 'Informationstechnologie',
        marktwertMrdUsd: 928.16,
      },
    ],
    /*
      Die Branchengewichte in der Einteilung des Blattes (GICS), deutsch
      benannt. Die Reihenfolge ist die nach Gewicht, nicht die des Blattes –
      dort stehen sie in der Reihenfolge der Tortenstücke.
    */
    branchen: [
      { branche: 'Informationstechnologie', anteil: 28.87 },
      { branche: 'Finanzwesen', anteil: 16.81 },
      { branche: 'Industrie', anteil: 11.45 },
      { branche: 'Gesundheitswesen', anteil: 9.17 },
      { branche: 'Zyklischer Konsum', anteil: 9.02 },
      { branche: 'Kommunikationsdienste', anteil: 8.04 },
      { branche: 'Basiskonsumgüter', anteil: 5.1 },
      { branche: 'Energie', anteil: 4.02 },
      { branche: 'Grundstoffe', anteil: 3.26 },
      { branche: 'Versorger', anteil: 2.54 },
      { branche: 'Immobilien', anteil: 1.71 },
    ],
    marktwertMioUsd: 89_526_461.89,
    kennzahlen: {
      anzahlWerte: 1282,
      groessterMioUsd: 4_634_313.75,
      kleinsterMioUsd: 2753.75,
      mittelMioUsd: 69_833.43,
      medianMioUsd: 24_316.69,
      dividendenrendite: 1.53,
      kgv: 24.25,
      kgvErwartet: 18.76,
      kbv: 4.13,
      laender: 23,
      abdeckungProzent: 85,
    },
  },
}

/**
 * Prüft beim Bauen, dass sich eine Gewichtung zu hundert Prozent addiert.
 *
 * Eine Gewichtung, die auf 94 Prozent kommt, sieht in einem Balkendiagramm
 * völlig normal aus – die Balken sind nur alle etwas zu kurz. Genau deshalb
 * wirft diese Prüfung, statt zu warnen: Es gibt keinen Zeitpunkt, an dem so
 * eine Grafik auffiele.
 *
 * Eine halbe Prozentpunkt-Toleranz, weil die Quelle gerundete Werte ausweist.
 */
export function assertZusammensetzungVollstaendig(
  eintraege: Record<string, IndexZusammensetzung>
): void {
  for (const [symbol, satz] of Object.entries(eintraege)) {
    const summe = satz.laender.reduce((wert, land) => wert + land.anteil, 0)
    if (Math.abs(summe - 100) > 0.5) {
      throw new Error(
        `Ländergewichtung für ${symbol} ergibt ${summe.toFixed(2)} statt 100 Prozent.`
      )
    }
  }
}

assertZusammensetzungVollstaendig(indexZusammensetzung)
