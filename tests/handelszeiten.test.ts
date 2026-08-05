import assert from 'node:assert/strict'
import { test } from 'node:test'

import {
  handelsplatzFuer,
  istGeoeffnet,
  ortszeit,
  verpassteSitzungen,
} from '../lib/handelszeiten.ts'

test('der Handelsplatz kommt aus dem Ticker, nicht aus dem Sitzland', () => {
  const honda = handelsplatzFuer({ symbol: 'honda', ticker: '7267.T', kind: 'stock' })
  assert.equal(honda?.name, 'Börse Tokio')

  const sap = handelsplatzFuer({ symbol: 'sap', ticker: 'SAP.DE', kind: 'stock' })
  assert.equal(sap?.name, 'Xetra')

  // Ohne Kürzel notiert ein Wert in diesem Katalog in den USA.
  const apple = handelsplatzFuer({ symbol: 'apple', ticker: 'AAPL', kind: 'stock' })
  assert.equal(apple?.name, 'New York')
})

test('Indizes tragen ihren Platz ausdrücklich', () => {
  assert.equal(
    handelsplatzFuer({ symbol: 'nikkei-225', ticker: 'Nikkei 225', kind: 'index' })?.name,
    'Börse Tokio'
  )
  assert.equal(
    handelsplatzFuer({ symbol: 'dax', ticker: 'DAX', kind: 'index' })?.name,
    'Xetra'
  )
})

test('durchgehend gehandelte Werte haben keinen Platz', () => {
  /*
    Kein Versehen, sondern die Aussage: Bei Krypto, Devisen und
    Terminkontrakten erklärt „die Börse hat zu“ keinen alten Kurs. Dort ist ein
    alter Kurs ein Ausfall.
  */
  for (const kind of ['crypto', 'fx', 'commodity']) {
    assert.equal(handelsplatzFuer({ symbol: 'x', ticker: 'X', kind }), null, kind)
  }
})

test('unbekannte Endung behauptet nichts', () => {
  assert.equal(handelsplatzFuer({ symbol: 'x', ticker: 'ABC.ZZ', kind: 'stock' }), null)
})

test('Ortszeit rechnet über die Zeitzonendatenbank', () => {
  // 5. August 2026, 06:25 UTC – in Tokio ist es 15:25 Uhr, ein Mittwoch.
  const t = ortszeit(new Date('2026-08-05T06:25:00Z'), 'Asia/Tokyo')
  assert.equal(t.datum, '2026-08-05')
  assert.equal(t.wochentag, 3)
  assert.equal(t.minute, 15 * 60 + 25)
})

test('Tokio ist um 06:25 UTC im Sommer noch offen, um 07:00 UTC nicht mehr', () => {
  const tokio = handelsplatzFuer({
    symbol: 'nikkei-225',
    ticker: 'Nikkei 225',
    kind: 'index',
  })!
  assert.equal(istGeoeffnet(tokio, new Date('2026-08-05T06:25:00Z')), true)
  assert.equal(istGeoeffnet(tokio, new Date('2026-08-05T07:00:00Z')), false)
})

test('am Wochenende ist zu', () => {
  const xetra = handelsplatzFuer({ symbol: 'dax', ticker: 'DAX', kind: 'index' })!
  // 8. August 2026 ist ein Samstag.
  assert.equal(istGeoeffnet(xetra, new Date('2026-08-08T10:00:00Z')), false)
})

test('der Fall vom 5. August: eine verpasste Sitzung', () => {
  /*
    Genau der Befund, der diese Datei ausgelöst hat: Auf der Nikkei-Seite stand
    am Mittwochmorgen der Schluss vom Dienstag. Dazwischen lag der Mittwochs-
    schluss um 15:30 Uhr Tokioter Zeit – eine Sitzung, die fehlte.
  */
  const tokio = handelsplatzFuer({
    symbol: 'nikkei-225',
    ticker: 'Nikkei 225',
    kind: 'index',
  })!
  const stand = new Date('2026-08-04T06:45:00Z')
  const jetzt = new Date('2026-08-05T06:41:00Z')
  assert.equal(verpassteSitzungen(tokio, stand, jetzt), 1)
})

test('frischer Schlusskurs verpasst nichts', () => {
  const tokio = handelsplatzFuer({
    symbol: 'nikkei-225',
    ticker: 'Nikkei 225',
    kind: 'index',
  })!
  // Der Schluss von heute, eine Stunde später abgefragt.
  const stand = new Date('2026-08-05T06:25:00Z')
  const jetzt = new Date('2026-08-05T07:30:00Z')
  assert.equal(verpassteSitzungen(tokio, stand, jetzt), 0)
})

test('über das Wochenende verpasst ein Freitagsschluss nichts', () => {
  /*
    Der Grund, warum hier Sitzungen gezählt werden und nicht Stunden: Ein Kurs
    vom Freitagabend ist am Montagmorgen sechzig Stunden alt und völlig in
    Ordnung.
  */
  const xetra = handelsplatzFuer({ symbol: 'dax', ticker: 'DAX', kind: 'index' })!
  const freitagsschluss = new Date('2026-08-07T15:30:00Z')
  const montagmorgen = new Date('2026-08-10T06:00:00Z')
  assert.equal(verpassteSitzungen(xetra, freitagsschluss, montagmorgen), 0)
})

test('derselbe Kurs am Dienstag hat eine Sitzung verpasst', () => {
  const xetra = handelsplatzFuer({ symbol: 'dax', ticker: 'DAX', kind: 'index' })!
  const freitagsschluss = new Date('2026-08-07T15:30:00Z')
  const dienstagmorgen = new Date('2026-08-11T06:00:00Z')
  assert.equal(verpassteSitzungen(xetra, freitagsschluss, dienstagmorgen), 1)
})

test('New York wechselt mit der Sommerzeit, Tokio nicht', () => {
  const ny = handelsplatzFuer({ symbol: 'sp500', ticker: 'S&P 500', kind: 'index' })!
  // Im Sommer öffnet New York um 13:30 UTC, im Winter um 14:30 UTC.
  assert.equal(istGeoeffnet(ny, new Date('2026-08-05T13:35:00Z')), true)
  assert.equal(istGeoeffnet(ny, new Date('2026-01-14T13:35:00Z')), false)
  assert.equal(istGeoeffnet(ny, new Date('2026-01-14T14:35:00Z')), true)
})

test('ein beschreibender Name ist kein Börsenkürzel', () => {
  /*
    Die ETFs dieses Katalogs tragen statt eines Kürzels einen Namen. Ohne
    Prüfung fielen sie in die Regel „ohne Punkt heißt New York“ und bekämen
    amerikanische Handelszeiten – für europäische UCITS-Fonds falsch.
  */
  assert.equal(
    handelsplatzFuer({
      symbol: 'etf-msci-world',
      ticker: 'MSCI World ETF',
      kind: 'etf',
    }),
    null
  )
})

test('die New Yorker Notierung eines europäischen Unternehmens zählt', () => {
  // SAP, ASML und NVO werden in New York gehandelt – von dort kommt der Kurs.
  assert.equal(
    handelsplatzFuer({ symbol: 'sap', ticker: 'SAP', kind: 'stock' })?.name,
    'New York'
  )
})
