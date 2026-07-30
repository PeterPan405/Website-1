/**
 * Prüfungen für den gerechneten Marktbericht.
 *
 * Die interessanteste Zahl ist die Breite, und sie ist auch die einzige, bei
 * der ein Denkfehler naheliegt: An einem Tag, an dem der Markt fällt, lautet
 * die Frage „wie viele fallen mit“ und nicht „wie viele steigen“. Wer immer
 * gegen null misst, meldet an einem schwachen Tag eine schmale Bewegung,
 * obwohl sie breit ist.
 */

import { baueMarktbericht, lagesatz, type Berichtsposten } from '../lib/marktbericht.ts'

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

function posten(werte: [string, number, string | null][]): Berichtsposten[] {
  return werte.map(([ticker, veraenderung, branche]) => ({
    symbol: ticker.toLowerCase(),
    ticker,
    name: ticker,
    veraenderung,
    branche,
  }))
}

console.log('\n— Zaehlen —')

const gemischt = baueMarktbericht(
  posten([
    ['A', 2, 'Halbleiter'],
    ['B', 1, 'Halbleiter'],
    ['C', -1, 'Banken'],
    ['D', 0, 'Banken'],
  ])
)
pruefe('zaehlt die Titel', gemischt?.titel === 4)
pruefe('zaehlt die steigenden', gemischt?.steigend === 2)
pruefe('zaehlt die fallenden', gemischt?.fallend === 1)
pruefe('zaehlt die unveraenderten', gemischt?.unveraendert === 1)
pruefe(
  'mittelt ungewichtet',
  Math.abs((gemischt?.schnitt ?? 0) - 0.5) < 1e-9,
  String(gemischt?.schnitt)
)

console.log('\n— Die Breite —')

/*
  Der Kern: An einem fallenden Tag misst die Breite die fallenden Titel. Hier
  fallen acht von neun bewegten – das ist eine breite Abwaertsbewegung, und
  wer gegen null maesse, meldete 11 Prozent.
*/
const schwach = baueMarktbericht(
  posten([
    ['A', 1, null],
    ['B', -2, null],
    ['C', -2, null],
    ['D', -2, null],
    ['E', -2, null],
    ['F', -2, null],
    ['G', -2, null],
    ['H', -2, null],
    ['I', -2, null],
  ])
)
pruefe('der Schnitt ist negativ', (schwach?.schnitt ?? 0) < 0)
pruefe(
  'die Breite misst die fallenden, nicht die steigenden',
  Math.abs((schwach?.breiteProzent ?? 0) - (8 / 9) * 100) < 1e-9,
  String(schwach?.breiteProzent)
)
pruefe(
  'und wird als breit beschrieben',
  lagesatz(schwach!).includes('breit durch den Markt')
)

const geteilt = baueMarktbericht(
  posten([
    ['A', 1, null],
    ['B', 1, null],
    ['C', -1, null],
    ['D', -0.8, null],
  ])
)
pruefe(
  'ein geteilter Markt heisst geteilt',
  lagesatz(geteilt!).includes('geteilt'),
  lagesatz(geteilt!)
)

/*
  Unveraenderte Titel gehoeren nicht in den Nenner der Breite: Wer sich nicht
  bewegt, traegt keine Bewegung – weder mit noch gegen.
*/
const vieleNullen = baueMarktbericht(
  posten([
    ['A', 1, null],
    ['B', 1, null],
    ['C', 1, null],
    ['D', 0, null],
    ['E', 0, null],
    ['F', 0, null],
    ['G', -1, null],
  ])
)
pruefe(
  'unveraenderte zaehlen bei der Breite nicht mit',
  Math.abs((vieleNullen?.breiteProzent ?? 0) - 75) < 1e-9,
  String(vieleNullen?.breiteProzent)
)

console.log('\n— Branchen —')

const mitBranchen = baueMarktbericht(
  posten([
    ['A', 5, 'Halbleiter'],
    ['B', 5, 'Halbleiter'],
    ['C', 5, 'Halbleiter'],
    ['D', 5, 'Halbleiter'],
    ['E', -3, 'Banken'],
    ['F', -3, 'Banken'],
    ['G', -3, 'Banken'],
    ['H', -3, 'Banken'],
    ['I', 9, 'Winzig'],
  ])
)
pruefe(
  'die stärkste Branche steht vorn',
  mitBranchen?.starkeBranchen[0].name === 'Halbleiter'
)
pruefe('die schwächste ebenfalls', mitBranchen?.schwacheBranchen[0].name === 'Banken')
/*
  Eine Branche mit einem einzigen Titel ist keine Branchenbewegung, sondern
  eine Aktie. Sie waere sonst mit +9 Prozent die stärkste des Tages.
*/
pruefe(
  'eine Branche mit einem Titel taucht nicht auf',
  !mitBranchen?.starkeBranchen.some((b) => b.name === 'Winzig'),
  mitBranchen?.starkeBranchen.map((b) => b.name).join(',')
)

console.log('\n— Gewinner und Verlierer —')

const spanne = baueMarktbericht(
  posten([
    ['A', 10, null],
    ['B', 5, null],
    ['C', 0, null],
    ['D', -5, null],
    ['E', -10, null],
  ])
)
pruefe('der groesste Gewinn steht oben', spanne?.gewinner[0].ticker === 'A')
pruefe('der groesste Verlust ebenfalls', spanne?.verlierer[0].ticker === 'E')
pruefe('und die Reihenfolge stimmt', spanne?.verlierer[1].ticker === 'D')

console.log('\n— Randfaelle —')

pruefe('ohne Titel gibt es keinen Bericht', baueMarktbericht([]) === null)
pruefe(
  'unbrauchbare Werte fallen heraus',
  baueMarktbericht(
    posten([
      ['A', NaN, null],
      ['B', 1, null],
    ])
  )?.titel === 1
)
pruefe(
  'lauter unveraenderte ergeben eine Breite von null',
  baueMarktbericht(
    posten([
      ['A', 0, null],
      ['B', 0, null],
    ])
  )?.breiteProzent === 0
)

console.log(`\n${bestanden} bestanden, ${gescheitert} gescheitert.`)
if (gescheitert > 0) process.exit(1)
console.log('Alle Prüfungen bestanden.')
