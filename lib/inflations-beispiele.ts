import { calculateInflation, realRatePercent } from '@/lib/finance'

/**
 * Die Beispielrechnungen des Lernthemas Inflation.
 *
 * Gleiche Aufgabe wie `lib/zins-beispiele.ts`: Text, Tabelle und Grafik sollen
 * dieselbe Zahl zeigen. Als Literale an drei Stellen laufen sie auseinander,
 * und zwar unbemerkt – beim Zinseszins ist genau das passiert, dort wies die
 * Tabelle 478.000 Euro aus, während gerechnet 454.000 herauskamen.
 *
 * ## Warum diese Annahmen
 *
 * 2,5 Prozent liegen etwas über dem Ziel der Europäischen Zentralbank und
 * ungefähr im langjährigen Mittel des deutschen Verbraucherpreisindex. Sie
 * sind bewusst eine runde Annahme und keine aktuelle Rate: Eine aktuelle Rate
 * wäre einen Monat lang richtig.
 *
 * 30 Jahre, weil das der Zeitraum ist, um den es beim Vermögensaufbau geht –
 * und weil sich die Kaufkraft bei dieser Rate in ungefähr dieser Zeit halbiert.
 */
export const inflationsbeispiel = {
  betrag: 10_000,
  rate: 2.5,
  jahre: 30,
  /** Die Jahre, für die im Text eine Tabellenzeile steht. */
  stuetzjahre: [10, 20, 30],
} as const

export interface Kaufkraftpunkt {
  jahr: number
  /** Was der Betrag in heutigem Geld noch wert ist. */
  kaufkraft: number
  /** Was man in diesem Jahr bräuchte, um dieselbe Menge zu kaufen. */
  noetig: number
  verlustProzent: number
}

const ergebnis = calculateInflation({
  amount: inflationsbeispiel.betrag,
  annualRatePercent: inflationsbeispiel.rate,
  years: inflationsbeispiel.jahre,
})

/**
 * Die Kaufkraft Jahr für Jahr, beginnend bei Jahr 0.
 *
 * Jahr 0 gehört dazu, weil die Grafik sonst am linken Rand unter dem
 * Ausgangsbetrag anfinge – der Verlust sähe größer aus, als er ist.
 */
export function kaufkraftreihe(): Kaufkraftpunkt[] {
  return [
    {
      jahr: 0,
      kaufkraft: inflationsbeispiel.betrag,
      noetig: inflationsbeispiel.betrag,
      verlustProzent: 0,
    },
    ...ergebnis.years.map((zeile) => ({
      jahr: zeile.year,
      kaufkraft: zeile.purchasingPower,
      noetig: zeile.requiredAmount,
      verlustProzent: zeile.lossPercent,
    })),
  ]
}

/** Das Gesamtergebnis über den vollen Zeitraum. */
export const kaufkraftende = {
  kaufkraft: ergebnis.purchasingPower,
  noetig: ergebnis.requiredAmount,
  verlustProzent: ergebnis.lossPercent,
  halbierungNachJahren: ergebnis.halvingYears,
}

/**
 * Tagesgeld zu 2 Prozent bei 2,5 Prozent Inflation.
 *
 * Der Regelfall der 2010er Jahre und das Beispiel, an dem der Unterschied
 * zwischen nominal und real am schnellsten einleuchtet.
 */
export const realzinsbeispiel = {
  nominal: 2,
  inflation: inflationsbeispiel.rate,
  real: realRatePercent(2, inflationsbeispiel.rate),
}
