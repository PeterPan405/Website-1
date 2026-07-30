/**
 * Prüfungen für die Kursanbieter und die Verdichtung der Momentaufnahme.
 *
 * Ausführen mit `npm test`. Geprüft wird ausschließlich das Zerlegen der
 * Antworten, nicht der Abruf – ein Test, der die Anbieter tatsächlich anfragt,
 * würde bei jeder Störung dort fehlschlagen und wäre kein Test dieses Codes.
 *
 * Der wichtigste Fall steht bei Yahoo: eine Antwort, die kein Kursmaterial
 * enthält. Der Vorgänger Stooq schickte einem Server statt der Daten eine
 * Bot-Prüfseite – mit Statuscode 200. Ohne Erkennung entstünde daraus eine
 * leere Reihe, und der Abruf ersetzte eine gute Momentaufnahme durch nichts.
 */

import { parseYahooChart, yahooUrl } from '../lib/providers/yahoo.ts'
import { parseTwelveData, twelveDataUrl } from '../lib/providers/twelvedata.ts'
import {
  checkPoints,
  serializeKursstand,
  thinPoints,
  type Kursstand,
} from '../lib/providers/snapshot.ts'

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

// ------------------------------------------------------------------- Yahoo

const yahooAntwort = JSON.stringify({
  chart: {
    result: [
      {
        meta: { regularMarketPrice: 25350.4, regularMarketTime: 1753360000 },
        timestamp: [1753142400, 1753228800, 1753315200],
        indicators: { quote: [{ close: [24812.44, null, 25099.03] }] },
      },
    ],
    error: null,
  },
})

check('liest Datum und Schlusskurs', parseYahooChart(yahooAntwort)?.days, [
  { date: '2025-07-22', close: 24812.44 },
  { date: '2025-07-24', close: 25099.03 },
])

// Der laufende Kurs ist der Grund, warum die Kachel nicht mehr den Schluss des
// Vortages zeigen muss.
check('liest den laufenden Kurs mit Zeitpunkt', parseYahooChart(yahooAntwort)?.latest, {
  value: 25350.4,
  at: '2025-07-24T12:26:40.000Z',
})

// Ohne meta bleibt es beim Schlusskurs - kein Fehler, nur kein laufender Preis.
check(
  'kommt ohne laufenden Kurs aus',
  parseYahooChart(
    JSON.stringify({
      chart: {
        result: [
          {
            timestamp: [1753142400],
            indicators: { quote: [{ close: [24812.44] }] },
          },
        ],
      },
    })
  )?.latest,
  null
)

check(
  'erkennt eine HTML-Seite als Nicht-Kursdaten',
  parseYahooChart('<!DOCTYPE html><html>'),
  null
)
check('erkennt eine leere Antwort', parseYahooChart(''), null)
check(
  'erkennt eine Fehlerantwort ohne Reihe',
  parseYahooChart(
    JSON.stringify({ chart: { result: null, error: { code: 'Not Found' } } })
  ),
  null
)
check(
  'erkennt eine Reihe ohne verwertbare Kurse',
  parseYahooChart(
    JSON.stringify({
      chart: {
        result: [{ timestamp: [1753142400], indicators: { quote: [{ close: [null] }] } }],
      },
    })
  ),
  null
)

check(
  'kodiert das Dach im Symbol',
  yahooUrl('^GDAXI'),
  'https://query1.finance.yahoo.com/v8/finance/chart/%5EGDAXI?range=5y&interval=1d&events=div'
)

/*
  Die Dividendenereignisse gehören zwingend an die Adresse.

  Ohne `events=div` liefert Yahoo dieselbe Kursreihe, aber keine Dividenden –
  und die Auswertung könnte nicht unterscheiden, ob ein Titel keine zahlt oder
  ob nur nicht danach gefragt wurde. Der Bestand ginge dann still leer aus.
*/
check(
  'fragt die Dividendenereignisse mit ab',
  yahooUrl('AAPL').includes('events=div'),
  true
)

// ------------------------------------------------------------- Twelve Data

const twelveAntwort = JSON.stringify({
  meta: { symbol: 'DAX' },
  values: [
    { datetime: '2026-07-24', close: '25099.03' },
    { datetime: '2026-07-23', close: '24763.12' },
  ],
  status: 'ok',
})

check('liest Werte und sortiert aufsteigend', parseTwelveData(twelveAntwort), [
  { date: '2026-07-23', close: 24763.12 },
  { date: '2026-07-24', close: 25099.03 },
])

// Twelve Data meldet Fehler mit Statuscode 200 – deshalb wird der Status geprueft.
check(
  'erkennt eine Fehlerantwort trotz Statuscode 200',
  parseTwelveData(JSON.stringify({ status: 'error', message: 'symbol not found' })),
  null
)
check('erkennt eine leere Antwort', parseTwelveData(''), null)

check(
  'haengt den Schluessel an die Adresse',
  twelveDataUrl('XAU/USD', 'geheim').includes('apikey=geheim'),
  true
)
check(
  'kodiert den Schraegstrich im Symbol',
  twelveDataUrl('XAU/USD', 'k').includes('symbol=XAU%2FUSD'),
  true
)

// ------------------------------------------------------------- Verdichtung

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
check(
  'haelt die Reihenfolge',
  [...verdichtet].sort((a, b) => a.d.localeCompare(b.d)),
  verdichtet
)
check('kommt mit einer leeren Reihe klar', thinPoints([], '2026-07-24'), [])

// ------------------------------------------------------------ Plausibilitaet

check('nimmt eine normale Reihe an', checkPoints(reihe(10)), [])
check('lehnt eine zu kurze Reihe ab', checkPoints([{ d: '2026-07-24', c: 1 }]).length, 1)
check(
  'erkennt ein verrutschtes Dezimalzeichen',
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

// ---------------------------------------------------------------- Kursstand

/*
  Der Kursstand ist die kleine Datei, die alle dreißig Minuten geschrieben
  wird. Zwei Eigenschaften entscheiden darüber, ob die Trennung ihren Zweck
  erfüllt, und beide lassen sich hier festhalten:

  1. Gleicher Inhalt ergibt gleichen Text. Sonst entstünde bei jedem Lauf ein
     Commit, obwohl sich kein Kurs geändert hat – genau der Fehler, den der
     Vergleich im Abrufskript verhindern soll.
  2. Das Ergebnis ist gültiges JSON. Die Datei wird beim Bauen importiert; ein
     Formatfehler bräche nicht den Abruf, sondern die ganze Website.
*/

const standA: Kursstand = {
  fetchedAt: '2026-07-30T11:49:24.416Z',
  latest: {
    zalando: { value: 31.2, at: '2026-07-30T15:35:00.000Z' },
    apple: { value: 338.19, at: '2026-07-30T15:35:00.000Z' },
  },
  devisen: { stand: '2026-07-29', jeEuro: { USD: 1.138, CHF: 0.9312 } },
}

/*
  Verglichen wird über den geparsten Baum, nicht über den Text: Der Serialisierer
  sortiert die Schlüssel, `JSON.stringify` behält die Einfügereihenfolge. Ein
  Textvergleich schlüge hier fehl, obwohl der Inhalt derselbe ist.
*/
const gelesen = JSON.parse(serializeKursstand(standA)) as Kursstand
check('schreibt gueltiges JSON: Zeitstempel', gelesen.fetchedAt, standA.fetchedAt)
check('schreibt gueltiges JSON: Kurse', gelesen.latest, {
  apple: standA.latest.apple,
  zalando: standA.latest.zalando,
})
check('schreibt gueltiges JSON: Devisen', gelesen.devisen?.jeEuro, {
  CHF: 0.9312,
  USD: 1.138,
})

check(
  'sortiert die Instrumente, damit die Reihenfolge des Abrufs egal ist',
  serializeKursstand(standA) ===
    serializeKursstand({
      ...standA,
      latest: {
        apple: standA.latest.apple,
        zalando: standA.latest.zalando,
      },
    }),
  true
)

check(
  'setzt eine Zeile je Instrument',
  serializeKursstand(standA)
    .split('\n')
    .filter((zeile) => zeile.includes('"at"')).length,
  2
)

check(
  'kommt ohne Devisen aus',
  JSON.parse(serializeKursstand({ fetchedAt: null, latest: {} })),
  { fetchedAt: null, latest: {} }
)

check(
  'meldet eine Kursaenderung als Textunterschied',
  serializeKursstand(standA) ===
    serializeKursstand({
      ...standA,
      latest: { ...standA.latest, apple: { value: 339, at: standA.latest.apple.at } },
    }),
  false
)

console.log(
  failed === 0 ? 'Alle Pruefungen bestanden' : `${failed} Pruefung(en) fehlgeschlagen`
)
if (failed > 0) process.exitCode = 1
