/**
 * Prüfungen für die Meldetermine von Twelve Data.
 *
 * Zwei Dinge sind hier heikel und beide schon einmal schiefgegangen:
 *
 * 1. **Die Börsenzuordnung.** Twelve Data führt blanke Kürzel; `CBK` gibt es
 *    an mehreren Börsen. Ein fehlender Marktcode holt im schlechtesten Fall
 *    die Termine eines gleichnamigen Unternehmens auf einem anderen
 *    Kontinent – derselbe Fehler wie bei „WTI“, wo das Kürzel der Ölsorte auf
 *    ein Ölförderunternehmen zeigte. Beim ersten Entwurf fehlten sieben
 *    Börsenplätze, und 47 Aktien wären lautlos ausgefallen.
 *
 * 2. **Der Fehlerfall mit Statuscode 200.** Twelve Data meldet Fehler nicht
 *    über den HTTP-Code, sondern im Rumpf. Wer nur den Code prüft, hält eine
 *    Absage für eine Antwort.
 */

import {
  istAbfragbar,
  MARKTCODES,
  marktcodeAusYahoo,
  parseTermine,
  termineUrl,
} from '../lib/providers/twelvedata-termine.ts'

let failed = 0

function gleich(name: string, actual: unknown, expected: unknown) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected)
  if (!ok) failed++
  console.log(
    `${ok ? 'OK  ' : 'FEHL'} ${name}${ok ? '' : `\n     erwartet ${JSON.stringify(expected)}\n     erhalten ${JSON.stringify(actual)}`}`
  )
}

function wahr(name: string, bedingung: boolean) {
  if (!bedingung) failed++
  console.log(`${bedingung ? 'OK  ' : 'FEHL'} ${name}`)
}

console.log('— Die Börsenzuordnung —')
gleich('Xetra aus .DE', marktcodeAusYahoo('CBK.DE'), 'XETR')
gleich('Tokio aus .T', marktcodeAusYahoo('7203.T'), 'XTKS')
gleich('Taiwan aus .TW', marktcodeAusYahoo('2330.TW'), 'XTAI')
gleich('São Paulo aus .SA', marktcodeAusYahoo('PETR4.SA'), 'BVMF')
// Ein US-Kürzel hat kein Suffix – dort ist der Marktcode entbehrlich.
gleich('ohne Suffix kein Marktcode', marktcodeAusYahoo('AAPL'), null)
// Ein unbekanntes Suffix darf nicht stillschweigend zu einer Abfrage führen.
gleich('unbekanntes Suffix ergibt null', marktcodeAusYahoo('XYZ.ZZ'), null)
wahr('US-Kürzel sind abfragbar', istAbfragbar('AAPL'))
wahr('bekanntes Suffix ist abfragbar', istAbfragbar('SAP.DE'))
wahr('unbekanntes Suffix ist es nicht', !istAbfragbar('XYZ.ZZ'))
wahr(
  'jeder Marktcode hat vier Zeichen',
  Object.values(MARKTCODES).every((code) => /^[A-Z0-9]{4}$/.test(code))
)
wahr(
  'kein Marktcode kommt doppelt vor',
  new Set(Object.values(MARKTCODES)).size === Object.values(MARKTCODES).length
)

console.log('\n— Die Adresse —')
{
  const url = termineUrl('SAP', 'XETR', 'geheim')
  wahr('das Kürzel steht drin', url.includes('symbol=SAP'))
  wahr('der Marktcode steht drin', url.includes('mic_code=XETR'))
  // Ohne Marktcode darf der Parameter fehlen und nicht leer gesetzt werden –
  // ein leerer Marktcode ist für die Gegenstelle etwas anderes als keiner.
  wahr(
    'ohne Marktcode fehlt der Parameter',
    !termineUrl('AAPL', null, 'x').includes('mic_code')
  )
}

console.log('\n— Die Antwort —')
{
  // Aufbau wie in der echten Antwort, gekürzt.
  const echt = JSON.stringify({
    meta: { symbol: 'AAPL', exchange: 'NASDAQ' },
    earnings: [
      { date: '2026-07-20', eps_estimate: 1.29, eps_actual: 1.17 },
      { date: '2026-04-30', eps_estimate: 0.24, eps_actual: 0.34 },
      { date: '2026-01-29', eps_estimate: 2.1, eps_actual: 2.4 },
    ],
  })
  gleich('Termine, neueste zuerst', parseTermine(echt), [
    '2026-07-20',
    '2026-04-30',
    '2026-01-29',
  ])
}
{
  // Der Fehlerfall kommt mit Statuscode 200 – nur der Rumpf verrät ihn.
  const fehler = '{"code":403,"message":"Bitte eigenen Schlüssel","status":"error"}'
  gleich('ein Fehlerrumpf ergibt null', parseTermine(fehler), null)
}
gleich('kaputtes JSON ergibt null', parseTermine('{nicht json'), null)
gleich('eine leere Reihe ergibt null', parseTermine('{"earnings":[]}'), null)
gleich('ohne earnings-Feld null', parseTermine('{"meta":{}}'), null)
{
  // Unbrauchbare Daten werden übersprungen, nicht durchgereicht.
  const gemischt = '{"earnings":[{"date":"2026-07-20"},{"date":"morgen"},{}]}'
  gleich('unbrauchbare Einträge fallen weg', parseTermine(gemischt), ['2026-07-20'])
}
{
  // Ein Tag kann mehrfach gemeldet werden; doppelt im Kalender wäre falsch.
  const doppelt = '{"earnings":[{"date":"2026-07-20"},{"date":"2026-07-20"}]}'
  gleich('Dubletten verschwinden', parseTermine(doppelt), ['2026-07-20'])
}

console.log(
  failed === 0 ? '\nAlle Prüfungen bestanden.' : `\n${failed} Prüfung(en) fehlgeschlagen.`
)
process.exit(failed === 0 ? 0 : 1)
