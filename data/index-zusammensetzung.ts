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
}

export interface IndexZusammensetzung {
  /** Stichtag der Gewichtung im Format `YYYY-MM-DD`. */
  stand: string
  quelle: { label: string; url: string }
  /** Ein Satz, der die Aufteilung einordnet. */
  hinweis: string
  laender: Laendergewicht[]
}

export const indexZusammensetzung: Record<string, IndexZusammensetzung> = {
  'msci-world': {
    stand: '2026-06-30',
    quelle: {
      label: 'MSCI World Index Factsheet',
      url: 'https://www.msci.com/documents/10199/255599/msci-world-index.pdf',
    },
    hinweis:
      'MSCI weist die fünf größten Länder einzeln aus und fasst die übrigen Industrieländer zusammen. In dieser Sammelposition stecken unter anderem die Schweiz, Deutschland, Australien und die Niederlande.',
    laender: [
      { land: 'USA', anteil: 72.45 },
      { land: 'Japan', anteil: 5.69 },
      { land: 'Großbritannien', anteil: 3.45 },
      { land: 'Kanada', anteil: 3.34 },
      { land: 'Frankreich', anteil: 2.4 },
      { land: 'Übrige Industrieländer', anteil: 12.66, sammelposten: true },
    ],
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
