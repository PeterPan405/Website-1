import type { Anleihe } from '@/lib/anleihen'
import type { Kreditparameter } from '@/lib/kredit'
import type { Optionsparameter } from '@/lib/optionen'

/**
 * Die durchgerechneten Beispielfälle des Lernbereichs.
 *
 * ## Warum die Annahmen hier stehen und nicht im Thema
 *
 * Ein Lerntext rechnet an einem Fall vor: eine Anleihe mit zwei Prozent Kupon
 * und zehn Jahren Restlaufzeit, ein Immobiliendarlehen über 300.000 Euro. Zu
 * jedem dieser Fälle gehört seit Neuestem eine Grafik – und die zeichnet
 * denselben Fall.
 *
 * Stünden die Annahmen zweimal da, einmal im Thema und einmal in der
 * Zeichnung, ginge das genau so lange gut, bis jemand eine davon ändert. Das
 * Ergebnis wäre eine Grafik, die neben ihrer eigenen Tabelle steht und etwas
 * anderes behauptet – der Fehler, den niemand bemerkt, weil beide Zahlen für
 * sich plausibel sind.
 *
 * Gerechnet wird nicht hier. Was hier steht, sind ausschließlich die
 * Annahmen; die Reihen entstehen bei jedem Verwender aus denselben geprüften
 * Funktionen (`lib/anleihen.ts`, `lib/optionen.ts`, `lib/kredit.ts`,
 * `lib/finance.ts`).
 *
 * ## Woher die Annahmen stammen
 *
 * Sie sind gewählt, nicht gemessen: runde Beträge, glatte Zinssätze, damit
 * die Rechnung im Kopf nachvollziehbar bleibt. Das ist bei einem Lehrbeispiel
 * richtig – es soll eine Mechanik zeigen, keinen Markt abbilden. Wo im Text
 * eine Größenordnung behauptet wird („Bauzinsen liegen bei rund dreieinhalb
 * Prozent“), ist sie als Annahme gekennzeichnet.
 */

// ------------------------------------------------------------------ Anleihen

/** Die Anleihe, an der das Thema Schuldverschreibung durchgerechnet wird. */
export const anleiheBeispiel: Anleihe = { kuponProzent: 2, jahre: 10 }

/** Der Marktzins beim Kauf – gleich dem Kupon, damit der Kurs bei 100 startet. */
export const anleiheMarktzins = 2

/** Der Marktzins nach dem Zinsanstieg, an dem der Kursverlust sichtbar wird. */
export const anleiheNeuerZins = 4

/** Restlaufzeiten für den Vergleich „je länger, desto heftiger“. */
export const anleiheLaufzeiten = [2, 5, 10, 20] as const

/** Zinsänderungen in Prozentpunkten für den Vergleich Näherung/Rechnung. */
export const anleiheSchocks = [1, 2, -1, -2] as const

// ------------------------------------------------------------------ Optionen

/**
 * Die Option, an der das Thema durchgerechnet wird.
 *
 * Am Geld (Kurs = Basispreis), drei Monate Restlaufzeit. Das ist der Fall, in
 * dem eine Option ausschließlich aus Zeitwert besteht – der Punkt, um den es
 * beim Verständnis geht.
 */
export const optionBasis: Optionsparameter = {
  kurs: 100,
  basispreis: 100,
  jahre: 0.25,
  volatilitaetProzent: 20,
  zinsProzent: 3,
}

/** Kurse des Basiswerts für die Aufteilung in inneren Wert und Zeitwert. */
export const optionKurse = [85, 95, 100, 105, 120] as const

/** Restlaufzeiten in Monaten für den Zeitwertverfall. */
export const optionMonate = [12, 6, 3, 1] as const

/** Erwartete Schwankungen in Prozent – der stärkste Preistreiber. */
export const optionVolatilitaeten = [15, 20, 30, 50] as const

// ------------------------------------------------------------------- Kredite

/** Ein gewöhnlicher Ratenkredit, wie ihn Banken für Anschaffungen vergeben. */
export const ratenkredit: Kreditparameter = { summe: 15_000, zinsProzent: 8 }

/** Laufzeiten in Jahren für den Vergleich Rate gegen Zinssumme. */
export const ratenkreditLaufzeiten = [3, 5, 7, 10] as const

/** Ein Immobiliendarlehen in der Größenordnung, die in Deutschland üblich ist. */
export const immobilienkredit: Kreditparameter = { summe: 300_000, zinsProzent: 3.5 }

/** Übliche Zinsbindung in Jahren – danach steht die Restschuld neu zur Debatte. */
export const immobilienZinsbindung = 10

/** Anfangstilgungen in Prozent, von der gerade noch zulässigen bis zur zügigen. */
export const immobilienTilgungssaetze = [1, 2, 3, 4] as const

// ---------------------------------------------------------------- Risiko

/**
 * Rückgänge, an denen die Asymmetrie von Verlust und Erholung gezeigt wird.
 *
 * Bis zwanzig Prozent, damit der harmlose Bereich vorkommt; bis neunzig, damit
 * der Bereich vorkommt, in dem die Rechnung kippt.
 */
export const risikoRueckgaenge = [10, 20, 30, 50, 70, 90] as const

// -------------------------------------------------------------- Markttiming

/**
 * Der Index, an dem das Auslassen der besten Wochen gerechnet wird.
 *
 * Der DAX und nicht ein Weltindex: Für ihn liegen auf dieser Website echte
 * Kurse vor. Eine Aussage über Markttiming aus Demo-Kursen wäre wertlos.
 */
export const timingIndex = 'dax'

/** Wie viele der besten Wochen jeweils ausgelassen werden. */
export const timingAuslassungen = [0, 5, 10, 20] as const

// ------------------------------------------------------------------- Rente

/**
 * Der Erwerbsverlauf, an dem die gesetzliche Rente vorgerechnet wird.
 *
 * Fünfzigtausend brutto liegen nahe am Durchschnittsentgelt, fünfzehn Jahre
 * gearbeitet und fünfundzwanzig vor sich beschreibt jemanden Anfang vierzig –
 * das Alter, in dem die Frage nach der Rentenlücke üblicherweise das erste Mal
 * gestellt wird.
 */
export const rentenBeispiel = {
  grossAnnualIncome: 50_000,
  yearsWorked: 15,
  yearsRemaining: 25,
} as const

/** Bruttoeinkommen für den Vergleich, wie viele Punkte sie im Jahr bringen. */
export const rentenEinkommen = [30_000, 45_000, 50_500, 70_000, 100_000] as const
