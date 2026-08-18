import {
  type Branchengewicht,
  type Einzelwert,
  type IndexKennzahlen,
} from '@/data/index-zusammensetzung'
import { weltindex } from '@/lib/weltindex'

/**
 * „Breit gestreut“ ist eine Behauptung, die man nachrechnen kann.
 *
 * ## Warum diese Datei nicht mehr rechnet, als das Blatt hergibt
 *
 * Für ein Konzentrationsmaß über den ganzen Index – Herfindahl-Index,
 * Gini-Koeffizient, „effektive Zahl der Werte“ – bräuchte man alle 1.282
 * Gewichte. Das Factsheet nennt zehn. Ein Herfindahl aus zehn Werten sähe aus
 * wie eine Kennzahl und wäre eine Schätzung mit unbekanntem Fehler.
 *
 * Deshalb rechnet hier nur, was aus den vorhandenen Zahlen **exakt** folgt:
 *
 * - der Anteil der zehn größten (steht im Blatt, wird nachgeprüft),
 * - der Gleichgewichtsanteil (100 geteilt durch die Zahl der Werte),
 * - das Verhältnis beider (wie oft das Gewicht des größten in den
 *   Gleichgewichtsanteil passt),
 * - der Abstand zwischen Mittel und Median (beides steht im Blatt).
 *
 * Das ist weniger, als eine Kennzahl verspricht, und es stimmt.
 *
 * ## Was Mittel gegen Median hier bedeutet
 *
 * Der Durchschnitt eines Indexwerts liegt bei rund 70 Mrd USD, der Median bei
 * rund 24. Ein Mittelwert weit über dem Median heißt: Wenige sehr große Werte
 * ziehen ihn hoch. Das ist dieselbe Aussage wie die Gewichtstabelle, nur an
 * einer Stelle, an der niemand sie sucht – und sie kommt ohne die 1.282
 * Einzelgewichte aus.
 */

/** Was sich über die Konzentration eines Index sagen lässt. */
export interface Klumpenbefund {
  /** Zahl der Werte im Index. */
  anzahlWerte: number
  /** Was ein Wert wöge, wenn alle gleich schwer wären, in Prozent. */
  gleichgewichtProzent: number
  /** Der größte Einzelwert. */
  groesster: Einzelwert
  /** Wie oft der Gleichgewichtsanteil in das Gewicht des größten passt. */
  faktorGroesster: number
  /** Was die genannten größten Werte zusammen wiegen, in Prozent. */
  anteilGenannte: number
  /** Wie viele Werte das sind. */
  anzahlGenannte: number
  /** Wie viel Prozent aller Werte das sind. */
  anteilDerWerteProzent: number
  /** Mittel geteilt durch Median der Marktwerte. */
  mittelZuMedian: number
}

/**
 * Der Anteil der `anzahl` größten Werte in Prozent.
 *
 * Ohne Argument: alle, die das Blatt nennt. Mehr als die genannten gibt es
 * nicht – wer nach zwanzig fragt, bekommt zehn und muss es merken, deshalb
 * wird die tatsächlich verwendete Zahl mitgeliefert (`anteilGroesste` gibt
 * nur die Summe, `klumpenbefund` nennt beides).
 */
export function anteilGroesste(
  anzahl?: number,
  werte: readonly Einzelwert[] = weltindex().groesste ?? []
): number {
  const genommen = anzahl === undefined ? werte : werte.slice(0, anzahl)
  return genommen.reduce((summe, wert) => summe + wert.anteil, 0)
}

/**
 * Was ein einzelner Wert wöge, wenn alle gleich schwer wären.
 *
 * Die Vergleichszahl, an der sich jedes Gewicht messen lässt: Bei 1.282
 * Werten sind das 0,078 %. Wer 5,18 % daneben hält, sieht die Antwort ohne
 * weitere Erklärung.
 */
export function gleichgewichtProzent(anzahlWerte: number): number {
  if (anzahlWerte <= 0) {
    throw new Error('Ein Index ohne Werte hat keinen Gleichgewichtsanteil.')
  }
  return 100 / anzahlWerte
}

/**
 * Die Branchen, nach Gewicht sortiert.
 *
 * Sortiert wird hier und nicht in der Datei: Die Datei hält die Zahlen des
 * Blattes, die Reihenfolge ist eine Darstellungsfrage.
 */
export function branchenNachGewicht(
  branchen: readonly Branchengewicht[] = weltindex().branchen ?? []
): Branchengewicht[] {
  return [...branchen].sort((a, b) => b.anteil - a.anteil)
}

/**
 * Wie viele Unternehmen hinter den genannten Einzelwerten stecken.
 *
 * Nicht dasselbe wie ihre Zahl: Alphabet steht mit zwei Aktiengattungen in
 * der Liste. „Die zehn größten Unternehmen“ sind in Wahrheit neun, und wer
 * ihre Gewichte einzeln liest, unterschätzt Alphabet um die Hälfte.
 */
export function unternehmenGezaehlt(
  werte: readonly Einzelwert[] = weltindex().groesste ?? []
): { name: string; anteil: number; gattungen: number }[] {
  const summe = new Map<string, { anteil: number; gattungen: number }>()
  for (const wert of werte) {
    const name = wert.unternehmen ?? wert.name
    const bisher = summe.get(name) ?? { anteil: 0, gattungen: 0 }
    bisher.anteil += wert.anteil
    bisher.gattungen += 1
    summe.set(name, bisher)
  }
  return [...summe.entries()]
    .map(([name, eintrag]) => ({ name, ...eintrag }))
    .sort((a, b) => b.anteil - a.anteil)
}

/**
 * Was die genannten Branchen der größten Werte zusammen ausmachen.
 *
 * Die Gegenprobe zur Branchentabelle: Sechs der zehn größten Werte sind
 * Technologie oder Kommunikation – zusammen wiegen diese beiden Branchen im
 * ganzen Index 37 %. Beide Zahlen stehen im selben Blatt, und erst
 * nebeneinander sagen sie etwas.
 */
export function branchenDerGroessten(
  werte: readonly Einzelwert[] = weltindex().groesste ?? []
): { branche: string; anzahl: number; anteil: number }[] {
  const summe = new Map<string, { anzahl: number; anteil: number }>()
  for (const wert of werte) {
    if (!wert.branche) continue
    const bisher = summe.get(wert.branche) ?? { anzahl: 0, anteil: 0 }
    bisher.anzahl += 1
    bisher.anteil += wert.anteil
    summe.set(wert.branche, bisher)
  }
  return [...summe.entries()]
    .map(([branche, eintrag]) => ({ branche, ...eintrag }))
    .sort((a, b) => b.anteil - a.anteil)
}

/**
 * Der Befund in einem Stück.
 *
 * Wirft, wenn die Kennzahlen fehlen: Eine Seite über Klumpenrisiko ohne die
 * Zahl der Indexwerte wäre eine Seite ohne Aussage, und ein stiller Rückfall
 * auf Nullen wäre schlimmer als ein roter Bau.
 *
 * ## Warum hier keine Standardwerte stehen
 *
 * Zuerst hatten beide Parameter welche – `weltindex().groesste` und
 * `weltindex().kennzahlen`. Damit war die Absicherung unerreichbar: In
 * JavaScript greift der Standardwert auch dann, wenn `undefined`
 * **übergeben** wird, und der Aufruf `klumpenbefund(werte, undefined)` landete
 * wieder beim gepflegten Datensatz. Die Prüfung dazu schlug an, und das war
 * ihr Zweck – eine Absicherung, die nie anschlägt, sieht aus wie Ruhe.
 *
 * Wer den gepflegten Weltindex meint, nimmt `klumpenbefundWeltindex()`.
 */
export function klumpenbefund(
  werte: readonly Einzelwert[],
  kennzahlen: IndexKennzahlen | undefined
): Klumpenbefund {
  if (!kennzahlen) {
    throw new Error('Ohne Kennzahlen des Blattes gibt es keinen Klumpenbefund.')
  }
  if (werte.length === 0) {
    throw new Error('Ohne genannte Einzelwerte gibt es keinen Klumpenbefund.')
  }

  const gleich = gleichgewichtProzent(kennzahlen.anzahlWerte)
  const groesster = werte.reduce((a, b) => (b.anteil > a.anteil ? b : a))

  return {
    anzahlWerte: kennzahlen.anzahlWerte,
    gleichgewichtProzent: gleich,
    groesster,
    faktorGroesster: groesster.anteil / gleich,
    anteilGenannte: anteilGroesste(undefined, werte),
    anzahlGenannte: werte.length,
    anteilDerWerteProzent: (werte.length / kennzahlen.anzahlWerte) * 100,
    mittelZuMedian: kennzahlen.mittelMioUsd / kennzahlen.medianMioUsd,
  }
}

/** Der Befund für den gepflegten Weltindex – der Aufruf, den die Seite macht. */
export function klumpenbefundWeltindex(): Klumpenbefund {
  const satz = weltindex()
  return klumpenbefund(satz.groesste ?? [], satz.kennzahlen)
}
