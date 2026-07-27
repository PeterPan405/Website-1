/**
 * Prüfungen für den Stooq-Parser und die Verdichtung der Momentaufnahme.
 *
 * Ausführen mit `npm test`. Wie beim EZB-Test wird ausschließlich das Zerlegen
 * der Antwort geprüft, nicht der Abruf – ein Test, der Stooq tatsächlich
 * anfragt, würde bei jeder Störung dort fehlschlagen und wäre damit kein Test
 * dieses Codes.
 *
 * Der wichtigste Fall steht weiter unten: Bei überschrittenem Tageslimit
 * antwortet Stooq mit Statuscode 200 und einem Satz Klartext. Ohne Erkennung
 * würde daraus eine leere Kursreihe – und der Abruf ersetzte eine gute
 * Momentaufnahme durch eine leere.
 */

import { parseStooqCsv, stooqUrl } from '../lib/providers/stooq.ts'
import { checkPoints, thinPoints } from '../lib/providers/snapshot.ts'

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

// ------------------------------------------------------------------ Parser

const mitVolumen = `Date,Open,High,Low,Close,Volume
2026-07-22,24980.11,25010.50,24700.01,24812.44,0
2026-07-23,24812.44,24900.00,24610.00,24763.12,0
2026-07-24,24800.00,25120.90,24790.30,25099.03,0`

check('liest Datum und Schlusskurs', parseStooqCsv(mitVolumen), [
  { date: '2026-07-22', close: 24812.44 },
  { date: '2026-07-23', close: 24763.12 },
  { date: '2026-07-24', close: 25099.03 },
])

// Manche Instrumente liefern keine Umsatzspalte – die Spalten muessen deshalb
// ueber die Kopfzeile aufgeloest werden, nicht ueber feste Positionen.
const ohneVolumen = `Date,Open,High,Low,Close
2026-07-23,4041.20,4066.80,4020.10,4053.70
2026-07-24,4053.70,4070.00,4030.00,4058.10`

check('kommt ohne Umsatzspalte aus', parseStooqCsv(ohneVolumen), [
  { date: '2026-07-23', close: 4053.7 },
  { date: '2026-07-24', close: 4058.1 },
])

// Stooq liefert absteigend oder aufsteigend, je nach Symbol.
const absteigend = `Date,Open,High,Low,Close,Volume
2026-07-24,1,1,1,1.0812,0
2026-07-23,1,1,1,1.0790,0`

check('sortiert aufsteigend', parseStooqCsv(absteigend), [
  { date: '2026-07-23', close: 1.079 },
  { date: '2026-07-24', close: 1.0812 },
])

const mitLuecken = `Date,Open,High,Low,Close,Volume
2026-07-22,1,1,1,N/A,0
2026-07-23,1,1,1,0,0
2026-07-24,1,1,1,1.0812,0
kaputte Zeile ohne alles`

check('wirft unbrauchbare Zeilen weg', parseStooqCsv(mitLuecken), [
  { date: '2026-07-24', close: 1.0812 },
])

// Der Fall, der ohne Pruefung stillen Datenverlust erzeugt haette.
check(
  'erkennt das Tageslimit als Nicht-CSV',
  parseStooqCsv('Exceeded the daily hits limit\n'),
  null
)
check('erkennt eine leere Antwort', parseStooqCsv(''), null)
check('erkennt eine Antwort ohne Kopfzeile', parseStooqCsv('2026-07-24,1.08'), null)

check(
  'kodiert das Dach im Symbol',
  stooqUrl('^dax'),
  'https://stooq.com/q/d/l/?s=%5Edax&i=d'
)

// ------------------------------------------------------------- Verdichtung

/** Baut eine tageweise Reihe rueckwaerts ab einem Stichtag. */
function reihe(tage: number, bis = '2026-07-24'): { d: string; c: number }[] {
  const ende = Date.parse(`${bis}T00:00:00Z`)
  const punkte = []
  for (let i = tage - 1; i >= 0; i -= 1) {
    punkte.push({
      d: new Date(ende - i * 86_400_000).toISOString().slice(0, 10),
      c: 100 + i,
    })
  }
  return punkte
}

const langeReihe = reihe(1500)
const verdichtet = thinPoints(langeReihe, '2026-07-24')

check(
  'behaelt den juengsten Wert',
  verdichtet[verdichtet.length - 1],
  langeReihe[langeReihe.length - 1]
)
check(
  'verdichtet auf deutlich weniger Punkte',
  verdichtet.length < langeReihe.length / 2,
  true
)
// 401 und nicht 400: Das Fenster ist an beiden Enden einschliesslich, der
// Stichtag selbst zaehlt also mit.
check(
  'laesst das Tagesfenster ungekuerzt',
  verdichtet.filter(
    (p) =>
      Date.parse(`${p.d}T00:00:00Z`) >=
      Date.parse('2026-07-24T00:00:00Z') - 400 * 86_400_000
  ).length,
  401
)
check(
  'haelt die Reihenfolge',
  [...verdichtet].sort((a, b) => a.d.localeCompare(b.d)),
  verdichtet
)
check('kommt mit einer leeren Reihe klar', thinPoints([], '2026-07-24'), [])

// -------------------------------------------------------- Plausibilitaet

check('nimmt eine normale Reihe an', checkPoints(reihe(10)), [])
check('lehnt eine zu kurze Reihe ab', checkPoints([{ d: '2026-07-24', c: 1 }]).length, 1)
check(
  'faellt auf ein verrutschtes Dezimalzeichen herein? nein',
  checkPoints([{ d: '2026-07-24', c: 10812 }], [{ d: '2026-07-23', c: 1.0812 }]).length >
    0,
  true
)
check(
  'laesst normale Tagesbewegung durch',
  checkPoints(
    [
      { d: '2026-07-23', c: 1.079 },
      { d: '2026-07-24', c: 1.0812 },
    ],
    [{ d: '2026-07-22', c: 1.075 }]
  ),
  []
)
check(
  'beanstandet einen unbrauchbaren Kurs',
  checkPoints([
    { d: '2026-07-23', c: 1.079 },
    { d: '2026-07-24', c: -3 },
  ]).length > 0,
  true
)

console.log(
  failed === 0 ? 'Alle Pruefungen bestanden' : `${failed} Pruefung(en) fehlgeschlagen`
)
if (failed > 0) process.exitCode = 1
