import {
  calculateCompoundInterest,
  compoundBalance,
  simpleInterestBalance,
} from '@/lib/finance'

/**
 * Die durchgerechneten Beispiele des Lernthemas Zinseszins.
 *
 * ## Warum es dieses Modul gibt
 *
 * Die Zahlen tauchen an drei Stellen auf: in den Tabellen des Lerntexts, in den
 * Grafiken daneben und im Fließtext, der sie kommentiert. Als Literale
 * geschrieben wären das drei unabhängige Quellen für dieselbe Zahl. Sie gehen
 * auseinander – und zwar unbemerkt, weil eine falsche Zahl in einer Tabelle
 * genauso plausibel aussieht wie eine richtige.
 *
 * Beim Anlegen dieses Moduls hat sich genau das gezeigt: Die Sparplantabelle
 * wies für einen Start mit 25 Jahren 478.000 Euro aus. Nachgerechnet sind es
 * rund 454.000 Euro. Auch in der Kostentabelle stimmte nur eine von vier
 * Zeilen. Beides ist mit dieser Umstellung behoben.
 *
 * ## Konventionen
 *
 * Gerechnet wird mit `lib/finance.ts` – denselben Funktionen wie die Rechner
 * auf der Website. Ein Zinsrechner, der etwas anderes ausgibt als der Lerntext
 * daneben, wäre die nächste Fehlerquelle.
 *
 * Endbeträge werden auf volle hundert Euro gerundet. Das ist keine Kosmetik:
 * Ein auf den Cent ausgewiesenes Ergebnis einer Modellrechnung über vierzig
 * Jahre behauptet eine Genauigkeit, die es nicht gibt.
 */

/** Auf volle hundert Euro – die Genauigkeit, die eine Modellrechnung hergibt. */
function aufHundert(betrag: number): number {
  return Math.round(betrag / 100) * 100
}

// ------------------------------------------------- Einfacher Zins und Zinseszins

export const grundbeispiel = {
  kapital: 10_000,
  zinssatz: 6,
  /** Stützjahre der Tabelle. Die Grafik zeichnet jedes Jahr dazwischen. */
  jahre: [10, 20, 30, 40],
  maxJahre: 40,
} as const

export interface Grundpunkt {
  jahr: number
  einfach: number
  zinseszins: number
}

/**
 * Beide Verläufe Jahr für Jahr.
 *
 * `bis` steuert nur die Länge: Die Tabelle greift sich vier Stützjahre heraus,
 * die Grafik nimmt alle 41 Punkte.
 */
export function grundbeispielReihe(bis = grundbeispiel.maxJahre): Grundpunkt[] {
  return Array.from({ length: bis + 1 }, (_, jahr) => ({
    jahr,
    einfach: simpleInterestBalance(grundbeispiel.kapital, grundbeispiel.zinssatz, jahr),
    zinseszins: compoundBalance(grundbeispiel.kapital, grundbeispiel.zinssatz, jahr),
  }))
}

// ----------------------------------------------------- Startalter gegen Rate

export const sparbeispiel = {
  rate: 200,
  zinssatz: 6,
  endalter: 67,
  startalter: [25, 35, 45],
} as const

export interface Sparfall {
  startalter: number
  jahre: number
  /** Summe aller Raten. */
  eingezahlt: number
  endkapital: number
  ertraege: number
}

export function sparbeispielReihe(): Sparfall[] {
  return sparbeispiel.startalter.map((startalter) => {
    const jahre = sparbeispiel.endalter - startalter
    const ergebnis = calculateCompoundInterest({
      principal: 0,
      annualRatePercent: sparbeispiel.zinssatz,
      years: jahre,
      contribution: sparbeispiel.rate,
      interval: 'monthly',
    })
    const eingezahlt = sparbeispiel.rate * jahre * 12
    const endkapital = aufHundert(ergebnis.finalBalance)
    return {
      startalter,
      jahre,
      eingezahlt,
      endkapital,
      // Aus den gerundeten Werten, damit Balken und Tabelle sich nicht um
      // hundert Euro widersprechen.
      ertraege: endkapital - eingezahlt,
    }
  })
}

// ------------------------------------------------------- Wirkung der Kosten

export const kostenbeispiel = {
  rate: 200,
  jahre: 30,
  bruttoRendite: 6,
  quoten: [0.2, 0.5, 1.0, 1.8],
} as const

export interface Kostenfall {
  /** Laufende Kostenquote in Prozent pro Jahr. */
  quote: number
  /** Was nach Abzug der Kosten an Rendite übrig bleibt. */
  nettoRendite: number
  endkapital: number
  /** Was die Kosten gegenüber einer Anlage ohne Gebühren gekostet haben. */
  kosten: number
}

/** Das Ergebnis ganz ohne Kosten – der Maßstab, gegen den gemessen wird. */
export function kostenbeispielBrutto(): number {
  return aufHundert(
    calculateCompoundInterest({
      principal: 0,
      annualRatePercent: kostenbeispiel.bruttoRendite,
      years: kostenbeispiel.jahre,
      contribution: kostenbeispiel.rate,
      interval: 'monthly',
    }).finalBalance
  )
}

export function kostenbeispielReihe(): Kostenfall[] {
  const brutto = kostenbeispielBrutto()
  return kostenbeispiel.quoten.map((quote) => {
    const nettoRendite = kostenbeispiel.bruttoRendite - quote
    const endkapital = aufHundert(
      calculateCompoundInterest({
        principal: 0,
        annualRatePercent: nettoRendite,
        years: kostenbeispiel.jahre,
        contribution: kostenbeispiel.rate,
        interval: 'monthly',
      }).finalBalance
    )
    return { quote, nettoRendite, endkapital, kosten: brutto - endkapital }
  })
}

/** Summe aller Einzahlungen im Kostenbeispiel. */
export function kostenbeispielEinzahlungen(): number {
  return kostenbeispiel.rate * kostenbeispiel.jahre * 12
}
