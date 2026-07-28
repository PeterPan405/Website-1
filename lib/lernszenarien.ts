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

// ------------------------------------------------------------ Sparplan

/**
 * Ein halbes Jahr Sparplan über einen Kurseinbruch hinweg.
 *
 * Der Verlauf ist so gewählt, dass er den Punkt zeigt und nichts beschönigt:
 * Der Kurs steht am Ende genau da, wo er angefangen hat. Was übrig bleibt,
 * ist allein die Wirkung der gleichbleibenden Rate – kein Kursgewinn, der
 * sich als Effekt ausgeben ließe.
 */
export const sparplanRate = 100

/** Die Kurse der sechs Kaufzeitpunkte, in dieser Reihenfolge. */
export const sparplanKurse = [50, 40, 25, 40, 50, 50] as const

// ------------------------------------------------------------ Fremdwährung

/** Ein Betrag, der in einer Fremdwährung angelegt wird. */
export const waehrungEinsatz = 10_000

/** Der Wechselkurs beim Kauf, in Dollar je Euro. */
export const waehrungKursStart = 1.1

/** Der Kursgewinn der Anlage selbst, in Prozent – vor der Währungsrechnung. */
export const waehrungKursgewinn = 10

/** Wechselkurse beim Verkauf, von der Aufwertung des Euro bis zur Abwertung. */
export const waehrungKurse = [1.0, 1.1, 1.2, 1.3] as const

// ---------------------------------------------------------------- Hebel

/** Der eingesetzte Betrag, an dem die Hebelwirkung gezeigt wird. */
export const derivatEinsatz = 1000

/**
 * Sicherheitsleistungen in Prozent des Positionswerts.
 *
 * Von der halben Deckung bis zu zwei Prozent – das ist die Spanne zwischen
 * einem konservativen Termingeschäft und dem, was im Differenzkontrakthandel
 * üblich war, bevor die Aufsicht eingriff.
 */
export const derivatSicherheitssaetze = [50, 20, 10, 5, 2] as const

// -------------------------------------------------------- Einlagensicherung

/** Gesetzlich gesicherte Einlagen je Kunde und Bank, in Euro. */
export const einlagensicherungGrenze = 100_000

/** Vorübergehend erhöhte Sicherung, etwa nach einem Hausverkauf. */
export const einlagensicherungErhoeht = 500_000

// -------------------------------------------------------------- Orderbuch

/**
 * Ein Orderbuch als Beispiel, keine Momentaufnahme.
 *
 * Ein echtes Orderbuch ändert sich mehrmals pro Sekunde; abgedruckt wäre es
 * eine Zahlenreihe ohne Aussage. Dieses hier ist so gebaut, dass es die drei
 * Dinge zeigt, um die es im Text geht: dass zwischen den besten Geboten eine
 * Lücke klafft, dass in den ersten Lagen wenig liegt, und dass ein großer
 * Auftrag sich durch mehrere Lagen frisst.
 *
 * Geld- und Briefkurs entsprechen der Spread-Grafik im Thema Aktie – beide
 * Themen sollen dasselbe Papier beschreiben.
 */
export const orderbuchBeispiel = {
  /** Verkaufsseite, absteigend – die beste (niedrigste) Forderung steht zuletzt. */
  brief: [
    { preis: 50.16, stueck: 900 },
    { preis: 50.14, stueck: 400 },
    { preis: 50.12, stueck: 250 },
    { preis: 50.1, stueck: 120 },
  ],
  /** Kaufseite, absteigend – das beste (höchste) Gebot steht zuerst. */
  geld: [
    { preis: 49.9, stueck: 150 },
    { preis: 49.88, stueck: 300 },
    { preis: 49.85, stueck: 450 },
    { preis: 49.8, stueck: 800 },
  ],
} as const

/**
 * Stückzahl eines sofort ausgeführten Kaufauftrags.
 *
 * Größer als die beste Lage und kleiner als die ersten drei zusammen – nur
 * dann zeigt die Rechnung, worum es geht: Der Auftrag bekommt einen Teil zum
 * besten Kurs und den Rest teurer.
 */
export const orderbuchMarktauftrag = 600

// -------------------------------------------------------------- Sparfall

/**
 * Der Sparplan, an dem in mehreren Themen dieselbe Wirkung gezeigt wird.
 *
 * Dreihundert Euro über dreißig Jahre bei sechs Prozent brutto: Das ist der
 * Fall, an dem sowohl die Kostenwirkung als auch die Verhaltenslücke
 * durchgerechnet werden. Beide Themen beschreiben denselben Sparer – sonst
 * ließen sich ihre Ergebnisse nicht nebeneinanderlegen.
 */
export const sparfall = { rate: 300, jahre: 30, brutto: 6 } as const

/** Laufende Kostenquoten in Prozent, vom günstigen ETF bis zum teuren Fonds. */
export const kostenstufen = [0.2, 0.5, 1, 1.5, 2] as const

/**
 * Die Verhaltenslücke in Prozentpunkten pro Jahr.
 *
 * Untersuchungen, die die Wertentwicklung von Fonds mit der tatsächlichen
 * Rendite ihrer Anleger vergleichen, finden diese Größenordnung. Sie ist
 * gesetzt, nicht gemessen – der Punkt ist der Unterschied, nicht der
 * Endbetrag.
 */
export const verhaltensluecke = 1

// ---------------------------------------------------- Sparen gegen Rendite

/** Der Ausgangssparplan für die Frage, welcher Hebel mehr bringt. */
export const hebelAusgang = { rate: 300, rendite: 6 } as const

/** Der eine Hebel: fünfzig Euro mehr im Monat. */
export const hebelMehrRate = 50

/** Der andere: ein Prozentpunkt mehr Rendite im Jahr. */
export const hebelMehrRendite = 1

/** Zeiträume in Jahren, über die beide Hebel verglichen werden. */
export const hebelZeitraeume = [10, 20, 30, 40] as const

// ------------------------------------------------------- Portfolio-Drift

/**
 * Die Ausgangsmischung, die von allein riskanter wird.
 *
 * Die angenommenen Renditen sind Größenordnungen für eine gute Phase, keine
 * Prognose: Ein Aktienteil, der jahrelang deutlich stärker wächst als der
 * sichere, ist genau die Lage, in der Rebalancing gebraucht wird.
 */
export const portfolioStart = { aktien: 70, sicher: 30 } as const

/** Angenommene Jahresrendite des Aktienteils in einer guten Phase, in Prozent. */
export const portfolioRenditeAktien = 9

/** Angenommene Verzinsung des sicheren Teils, in Prozent. */
export const portfolioRenditeSicher = 2

/** Über wie viele Jahre die Verschiebung gezeigt wird. */
export const portfolioJahre = 10

// ------------------------------------------------------- Sequenzrisiko

/**
 * Ein Ruhestandsdepot, an dem die Reihenfolge der Renditejahre gezeigt wird.
 *
 * Eine halbe Million, zweitausend Euro Entnahme im Monat, zwölf Jahre. Die
 * Entnahmequote liegt damit bei knapp fünf Prozent des Startkapitals – hoch
 * genug, dass die Reihenfolge sichtbar wird, und niedrig genug, dass das Depot
 * in keiner der beiden Reihenfolgen leerläuft. Liefe es leer, verschöbe sich
 * die Aussage von „unterschiedlich viel übrig“ zu „einmal reicht es nicht“ –
 * auch wahr, aber ein anderer Satz.
 */
export const sequenzStartkapital = 500_000

/** Entnahme im Jahr, gleichbleibend. */
export const sequenzEntnahme = 24_000

/**
 * Zwölf Jahresrenditen in Prozent.
 *
 * Konstruiert, nicht gemessen: drei schlechte Jahre, ein mittleres Feld, drei
 * gute. Die Streuung entspricht der Größenordnung, die ein Aktiendepot über
 * zwölf Jahre erlebt; die Reihenfolge wird in der Grafik ohnehin beide Male
 * umsortiert, sodass hier nur die Menge der Werte zählt.
 */
export const sequenzRenditen = [-30, -15, -5, 3, 5, 7, 8, 10, 12, 15, 18, 25] as const

// -------------------------------------------------------------- Steuer

/**
 * Der Sparerpauschbetrag für Alleinstehende, in Euro.
 *
 * Ein gesetzlicher Wert, kein gewählter – er kann sich ändern, und der Text
 * sagt das auch. Er steht hier, weil Thema und Grafik denselben brauchen.
 */
export const sparerPauschbetrag = 1_000

/**
 * Laufende Erträge in Prozent des Depotwerts.
 *
 * Von einem thesaurierenden Welt-ETF, bei dem fast nur die Vorabpauschale
 * anfällt, bis zu einem ausschüttungsstarken Depot. Die Spanne entscheidet
 * darüber, bei welchem Depotwert der Freibetrag aufgebraucht ist.
 */
export const sparerRenditen = [1, 2, 3, 4] as const

// -------------------------------------------------------------- Immobilie

/** Der Kaufpreis, an dem die Mietrendite vorgerechnet wird. */
export const immobilieKaufpreis = 300_000

/** Kaufnebenkosten in Prozent – Grunderwerbsteuer, Notar, Grundbuch, Makler. */
export const immobilieNebenkostenProzent = 10

/** Die Jahreskaltmiete, mit der geworben wird. */
export const immobilieJahresmiete = 12_000

/**
 * Laufende Kosten, die der Vermieter trägt und nicht umlegen kann.
 *
 * Größenordnungen, keine Messwerte – im Text stehen sie als solche. Sie sind
 * der Grund, warum aus einer beworbenen Bruttorendite regelmäßig weniger als
 * die Hälfte wird.
 */
export const immobilieVerwaltung = 400
export const immobilieInstandhaltung = 1_800

/** Kalkulierter Mietausfall in Prozent der Jahresmiete – Leerstand und Ausfälle. */
export const immobilieMietausfallProzent = 3

// ------------------------------------------------------------ Orderkosten

/**
 * Ordergrößen für den Vergleich von Gebühr und Spread.
 *
 * Von der kleinen Sparplanausführung bis zur größeren Einmalanlage: Bei
 * welcher Größe welcher Kostenblock überwiegt, ist die Frage, um die es geht.
 */
export const ordergroessen = [500, 1_000, 5_000, 25_000] as const

/** Ein üblicher Festpreis je Order, in Euro. */
export const ordergebuehrFest = 4.9

/**
 * Der Spread in Prozent des Ordervolumens.
 *
 * Er fällt zweimal an – beim Kauf und beim Verkauf –, gezeigt wird hier nur
 * die eine Hälfte, also der Kauf. Ein halber Prozentpunkt ist für einen
 * gängigen ETF außerhalb der Referenzzeiten eine realistische Größe.
 */
export const spreadProzent = 0.3

// ------------------------------------------------------------------ Krypto

/** Die Blockbelohnung zu Beginn, in Münzen. */
export const bitcoinStartbelohnung = 50

/** Nach so vielen Blöcken halbiert sich die Belohnung – das Halving. */
export const bitcoinBloeckeJeEpoche = 210_000

/** Wie lange ein Block im Mittel dauert, in Minuten. Die Zeitachse der Grafik. */
export const bitcoinMinutenJeBlock = 10

/** Das Jahr des ersten Blocks. */
export const bitcoinStartjahr = 2009

/**
 * Die Obergrenze der Bitcoin-Menge.
 *
 * Keine Annahme, sondern eine Folge des Emissionsplans: 50 Münzen je Block,
 * alle 210.000 Blöcke halbiert. Die Summe dieser geometrischen Reihe läuft
 * gegen knapp 21 Millionen.
 */
export const bitcoinObergrenze = bitcoinStartbelohnung * bitcoinBloeckeJeEpoche * 2

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
