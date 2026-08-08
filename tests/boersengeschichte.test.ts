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
  geschichtsvorspann,
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
  'der Satz nennt Richtung, Betrag und Zeitraum',
  fund !== null &&
    geschichtssatz(fund) === 'DAX fiel an einem einzigen Handelstag um 10,0 Prozent.'
)
pruefe(
  'der Vorspann sagt „heute“, wenn der Tag der Jahrestag ist',
  fund !== null && geschichtsvorspann(fund) === 'Heute vor einem Jahr'
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

console.log('\n— Wochenwerte dürfen keine Tagesbewegung sein —')

/*
  Der Fehler vom 9. August 2026. Die Fünfjahresreihen sind im älteren Teil nur
  wöchentlich dicht; „der Punkt davor“ liegt dort sieben Tage zurück. Vorher
  stand darüber „an einem einzigen Handelstag“.

  Die Zahlen sind die echten des Nikkei 225: 38.468,63 am 29. Juli 2024,
  31.458,42 am 5. August. Das sind −18,2 Prozent in einer Woche – der Verlust
  jenes einen Handelstags betrug −12,4 Prozent.
*/
const wochenluecke = reihe('nikkei-225', [
  ['2024-07-29', 38468.63],
  ['2024-08-05', 31458.42],
])
const fundWoche = findeGeschichte([wochenluecke], '2026-08-08')
pruefe(
  'die Spanne wird aus den Daten übernommen',
  fundWoche?.spanneTage === 7,
  `spanneTage=${fundWoche?.spanneTage}`
)
pruefe(
  'eine Wochenbewegung heißt nicht mehr Handelstag',
  fundWoche !== null &&
    geschichtssatz(fundWoche) === 'NIKKEI-225 fiel binnen einer Woche um 18,2 Prozent.',
  fundWoche ? geschichtssatz(fundWoche) : 'kein Fund'
)

/* Der Tag daneben darf nicht „heute“ heißen: 5. August, Stichtag 8. August. */
pruefe(
  'der Vorspann lässt „heute“ weg, wenn der Tag danebenliegt',
  fundWoche !== null && geschichtsvorspann(fundWoche) === 'Vor 2 Jahren',
  fundWoche ? geschichtsvorspann(fundWoche) : 'kein Fund'
)

/* Freitag → Montag sind aufeinanderfolgende Handelstage, keine Woche. */
const wochenende = reihe('dax', [
  ['2025-08-01', 100],
  ['2025-08-04', 94],
])
const fundWE = findeGeschichte([wochenende], '2026-08-04')
pruefe(
  'Freitag auf Montag bleibt ein Handelstag',
  fundWE !== null &&
    geschichtssatz(fundWE) === 'DAX fiel an einem einzigen Handelstag um 6,0 Prozent.',
  fundWE ? geschichtssatz(fundWE) : 'kein Fund'
)

/*
  Der Kern der Rangfolge: Ein echter Tagesausschlag schlägt die größere
  Wochenbewegung. Sonst zeigte die Kachel dauerhaft Wochenwerte, weil die
  betragsmäßig fast immer gewinnen.
*/
const tagKlein = reihe('dax', [
  ['2025-08-07', 100],
  ['2025-08-08', 93],
])
const wocheGross = reihe('bitcoin', [
  ['2025-08-01', 100],
  ['2025-08-08', 75],
])
pruefe(
  'der echte Tagesausschlag schlägt die größere Wochenbewegung',
  findeGeschichte([wocheGross, tagKlein], '2026-08-08')?.symbol === 'dax'
)

console.log(`\n${bestanden} Prüfungen bestanden, ${gescheitert} gescheitert.`)
if (gescheitert > 0) process.exit(1)
