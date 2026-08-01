/**
 * Prüfungen für „Heute vor X Jahren“.
 *
 * Die Auswertung läuft beim Bau über echte Reihen; hier läuft sie über
 * gestellte, damit jede Regel einzeln kippen kann: die Jahrestagssuche mit
 * Handelspausen, die Drei-Tage-Grenze, der Betragsvergleich, der Vorzug des
 * älteren Jahres bei Gleichstand und der 29. Februar.
 */

import {
  findeGeschichte,
  geschichtssatz,
  type Geschichtsquelle,
} from '../lib/boersengeschichte.ts'

let bestanden = 0
let gescheitert = 0

function pruefe(name: string, bedingung: boolean, hinweis?: string) {
  if (bedingung) {
    bestanden++
    console.log(`OK   ${name}`)
  } else {
    gescheitert++
    console.error(`FEHL ${name}${hinweis ? ` – ${hinweis}` : ''}`)
  }
}

function reihe(symbol: string, punkte: [string, number][]): Geschichtsquelle {
  return {
    symbol,
    name: symbol.toUpperCase(),
    punkte: punkte.map(([t, value]) => ({ t, value })),
  }
}

console.log('\n— Grundfälle —')

/* Vor einem Jahr fiel der Wert um 10 %, vor zwei Jahren stieg er um 5 %. */
const einfach = reihe('dax', [
  ['2024-07-31', 100],
  ['2024-08-01', 105],
  ['2025-07-31', 100],
  ['2025-08-01', 90],
])

const fund = findeGeschichte([einfach], '2026-08-01')
pruefe('der größte Ausschlag gewinnt', fund?.prozent === -10 && fund.jahre === 1)
pruefe('das Datum ist der gefundene Handelstag', fund?.datum === '2025-08-01')
pruefe(
  'der Satz nennt Richtung, Betrag und Abstand',
  fund !== null &&
    geschichtssatz(fund) ===
      'Heute vor einem Jahr fiel DAX an einem einzigen Handelstag um 10,0 Prozent.'
)

console.log('\n— Handelspausen —')

/* Der Jahrestag (01.08.2025) war handelsfrei; der nächste Handelstag liegt
   zwei Tage später und zählt. */
const pause = reihe('sp500', [
  ['2025-07-30', 200],
  ['2025-08-03', 220],
])
const fundPause = findeGeschichte([pause], '2026-08-01')
pruefe(
  'ein naher Handelstag ersetzt den handelsfreien Jahrestag',
  fundPause?.prozent === 10 && fundPause.datum === '2025-08-03'
)

/* Liegt der nächste Handelstag weiter als drei Tage entfernt, zählt das Jahr
   nicht – sonst würde ein Wochenschluss als Tagesbewegung ausgegeben. */
const zuWeit = reihe('gold', [
  ['2025-07-20', 100],
  ['2025-08-09', 130],
])
pruefe(
  'mehr als drei Tage Abstand zählen nicht',
  findeGeschichte([zuWeit], '2026-08-01') === null
)

console.log('\n— Vergleich und Ränder —')

/* Gleicher Betrag in zwei Jahren: der ältere gewinnt. */
const gleichstand = reihe('brent', [
  ['2024-08-01', 100],
  ['2024-08-02', 110],
  ['2025-08-01', 100],
  ['2025-08-02', 110],
])
pruefe(
  'bei Gleichstand gewinnt das ältere Jahr',
  findeGeschichte([gleichstand], '2026-08-02')?.jahre === 2
)

/* Über mehrere Quellen hinweg gewinnt der größte Betrag, egal woher. */
const klein = reihe('dax', [
  ['2025-08-01', 100],
  ['2025-08-02', 101],
])
const gross = reihe('bitcoin', [
  ['2025-08-01', 100],
  ['2025-08-02', 88],
])
pruefe(
  'über Quellen hinweg zählt der Betrag',
  findeGeschichte([klein, gross], '2026-08-02')?.symbol === 'bitcoin'
)

pruefe('leere Quellen ergeben null', findeGeschichte([], '2026-08-01') === null)
pruefe(
  'eine Reihe mit nur einem Punkt wird übergangen',
  findeGeschichte([reihe('dax', [['2025-08-01', 100]])], '2026-08-01') === null
)

/* Der 29. Februar hat nicht jedes Jahr einen Jahrestag – er wird zum 28. */
const schalt = reihe('dax', [
  ['2025-02-27', 100],
  ['2025-02-28', 97],
])
pruefe(
  'der 29. Februar fällt auf den 28. zurück',
  findeGeschichte([schalt], '2028-02-29')?.datum === '2025-02-28'
)

console.log(`\n${bestanden} Prüfungen bestanden, ${gescheitert} gescheitert.`)
if (gescheitert > 0) process.exit(1)
