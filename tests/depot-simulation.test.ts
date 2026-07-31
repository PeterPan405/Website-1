/**
 * Prüfungen für die Depot-Simulation über echte Kursreihen.
 *
 * Ausführen mit `npm test`.
 *
 * Zwei Dinge gehen hier erfahrungsgemäß schief, und beide sehen im Ergebnis
 * völlig normal aus:
 *
 * 1. Der **gemeinsame Zeitraum**. Hat ein Titel eine kürzere Reihe, muss die
 *    ganze Rechnung darauf schrumpfen. Sonst steht dort eine
 *    Fünfjahresrendite, in der ein Titel drei Jahre gefehlt hat.
 * 2. Der **Rückschlag**. Er wird vom jeweils höchsten bis dahin erreichten
 *    Stand gemessen, nicht vom Anfang und nicht vom Gesamthoch. Wer das
 *    verwechselt, meldet zu kleine Zahlen – und zwar plausible.
 */

import {
  groesserRueckschlag,
  simuliere,
  type Kurspunkt,
} from '../lib/depot-simulation.ts'

let failed = 0
function check(name: string, actual: unknown, expected: unknown) {
  const a = JSON.stringify(actual)
  const e = JSON.stringify(expected)
  const ok = a === e
  if (!ok) failed++
  console.log(
    `${ok ? 'OK  ' : 'FEHL'} ${name}${ok ? '' : `\n     erwartet ${e}\n     erhalten ${a}`}`
  )
}
function nahe(name: string, actual: number, expected: number, toleranz = 1e-6) {
  const ok = Math.abs(actual - expected) <= toleranz
  if (!ok) failed++
  console.log(
    `${ok ? 'OK  ' : 'FEHL'} ${name}${ok ? '' : `\n     erwartet ${expected}\n     erhalten ${actual}`}`
  )
}

function reihe(tage: string[], kurse: number[]): Kurspunkt[] {
  return tage.map((d, i) => ({ d, c: kurse[i] }))
}

const tage = ['2021-01-01', '2021-07-01', '2022-01-01', '2022-07-01', '2023-01-01']

/* ------------------------------------------------------------- Rückschlag */

check(
  'ohne Rückgang gibt es keinen Rückschlag',
  groesserRueckschlag([
    { d: 'a', wert: 100 },
    { d: 'b', wert: 110 },
    { d: 'c', wert: 120 },
  ]),
  null
)

const zweiTaeler = groesserRueckschlag([
  { d: 'a', wert: 100 },
  { d: 'b', wert: 90 }, // −10 % vom Hoch bei 100
  { d: 'c', wert: 130 },
  { d: 'd', wert: 91 }, // −30 % vom Hoch bei 130 – das ist der größere
  { d: 'e', wert: 140 },
])!
nahe('der tiefere von zwei Rückschlägen zählt', zweiTaeler.prozent, -30)
check('gemessen vom Hoch davor', zweiTaeler.vonTag, 'c')
check('bis zum Tiefpunkt', zweiTaeler.bisTag, 'd')
check('und erholt, sobald das alte Hoch wieder da ist', zweiTaeler.erholtAm, 'e')

const nieErholt = groesserRueckschlag([
  { d: 'a', wert: 100 },
  { d: 'b', wert: 50 },
  { d: 'c', wert: 80 },
])!
nahe('halbiert', nieErholt.prozent, -50)
check('nicht erholt', nieErholt.erholtAm, null)

/* ----------------------------------------------------------- Simulation */

const reihen = new Map<string, Kurspunkt[]>([
  ['a', reihe(tage, [100, 120, 80, 100, 200])],
  ['b', reihe(tage, [50, 50, 50, 50, 50])],
])

const halbe = simuliere(
  reihen,
  [
    { symbol: 'a', anteil: 50 },
    { symbol: 'b', anteil: 50 },
  ],
  1000
)!

check('fünf Tage im Verlauf', halbe.verlauf.length, 5)
check('Anfang', halbe.vonTag, '2021-01-01')
check('Ende', halbe.bisTag, '2023-01-01')
nahe('Startwert ist der Einsatz', halbe.verlauf[0].wert, 1000)
/* a verdoppelt sich, b steht still: 500 → 1000, 500 → 500. */
nahe('Endwert', halbe.endwert, 1500)
nahe('plus 50 Prozent', halbe.gesamtProzent, 50)

check(
  'die Startgewichte sind die vorgegebenen',
  halbe.startgewichte.map((g) => Math.round(g.prozent)),
  [50, 50]
)
check(
  'die Endgewichte haben sich verschoben – ohne Umschichten',
  halbe.endgewichte.map((g) => Math.round(g.prozent)),
  [67, 33]
)

/*
  Der Einbruch von a auf 80 zieht das Depot mit – aber gedämpft, und genau
  darum geht es.

  a allein fällt von 120 auf 80, also um ein Drittel. Das Depot fällt von
  1.100 auf 900, also um 18,2 Prozent: Die Hälfte in b steht still und trägt
  den halben Wert unverändert weiter. Wer hier die 33 Prozent der Einzelaktie
  erwartet, verwechselt die Position mit dem Depot – und genau diese
  Verwechslung ist der Grund, warum die Zahl überhaupt angezeigt wird.
*/
nahe(
  'größter Rückschlag des Depots, nicht der Position',
  halbe.groesster!.prozent,
  -18.1818,
  0.001
)
check('vom Hoch am 01.07.2021', halbe.groesster!.vonTag, '2021-07-01')
check('bis zum 01.01.2022', halbe.groesster!.bisTag, '2022-01-01')
check('erholt am 01.01.2023', halbe.groesster!.erholtAm, '2023-01-01')

/* Anteile müssen sich nicht auf 100 summieren – sie werden normiert. */
const ungerade = simuliere(
  reihen,
  [
    { symbol: 'a', anteil: 1 },
    { symbol: 'b', anteil: 1 },
  ],
  1000
)!
nahe('1:1 ergibt dasselbe wie 50:50', ungerade.endwert, halbe.endwert)

/* --------------------------------------------- Der gemeinsame Zeitraum */

const kurz = new Map<string, Kurspunkt[]>([
  ['a', reihe(tage, [100, 120, 80, 100, 200])],
  /* c gibt es erst ab 2022. */
  ['c', reihe(tage.slice(2), [10, 10, 10])],
])
const beschnitten = simuliere(
  kurz,
  [
    { symbol: 'a', anteil: 50 },
    { symbol: 'c', anteil: 50 },
  ],
  1000
)!
check('der Zeitraum schrumpft auf den gemeinsamen', beschnitten.vonTag, '2022-01-01')
check('drei gemeinsame Tage', beschnitten.verlauf.length, 3)

/* ------------------------------------------------------------- Ausfälle */

check('ohne Positionen nichts', simuliere(reihen, [], 1000), null)
check(
  'Positionen ohne Gewicht zählen nicht',
  simuliere(reihen, [{ symbol: 'a', anteil: 0 }], 1000),
  null
)
check(
  'ein unbekanntes Symbol zählt nicht',
  simuliere(reihen, [{ symbol: 'weg', anteil: 50 }], 1000),
  null
)
check('ohne Einsatz nichts', simuliere(reihen, [{ symbol: 'a', anteil: 50 }], 0), null)
check(
  'ohne gemeinsame Tage nichts',
  simuliere(
    new Map<string, Kurspunkt[]>([
      ['a', reihe(['2021-01-01', '2021-02-01'], [1, 2])],
      ['b', reihe(['2022-01-01', '2022-02-01'], [1, 2])],
    ]),
    [
      { symbol: 'a', anteil: 50 },
      { symbol: 'b', anteil: 50 },
    ],
    1000
  ),
  null
)

/* Unter einem Jahr gibt es keine Jahresrate. */
const kurzeZeit = simuliere(
  new Map<string, Kurspunkt[]>([['a', reihe(['2021-01-01', '2021-04-01'], [100, 120])]]),
  [{ symbol: 'a', anteil: 100 }],
  1000
)!
check('keine hochgerechnete Jahresrate unter einem Jahr', kurzeZeit.jahresProzent, null)
check('über zwei Jahre schon', typeof halbe.jahresProzent, 'number')

console.log(
  failed === 0 ? '\nAlle Prüfungen bestanden.' : `\n${failed} Prüfung(en) fehlgeschlagen.`
)
process.exit(failed === 0 ? 0 : 1)
