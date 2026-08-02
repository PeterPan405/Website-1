/**
 * Prüfungen für die Wochenrechnung des Rückblicks.
 *
 * Die Wochengrenze ist die eine Stelle, an der ein Denkfehler jede Zahl der
 * Seite gleichzeitig falsch macht – deshalb jeder Wochentag einzeln.
 */

import { letzteAbgeschlosseneWoche, wochenveraenderung } from '../lib/wochenrechnung.ts'

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

// 2026-08-02 ist ein Sonntag; der Freitag davor der 31. Juli.
const sonntag = letzteAbgeschlosseneWoche('2026-08-02')
pruefe(
  'Sonntag: die gerade beendete Woche',
  sonntag.montag === '2026-07-27' && sonntag.freitag === '2026-07-31',
  JSON.stringify(sonntag)
)
pruefe(
  'der Sonntag der Spanne ist der Bezugstag selbst',
  sonntag.sonntag === '2026-08-02'
)

const freitag = letzteAbgeschlosseneWoche('2026-07-31')
pruefe(
  'Freitag: die eigene Woche gilt als abgeschlossen',
  freitag.montag === '2026-07-27' && freitag.freitag === '2026-07-31'
)

const mittwoch = letzteAbgeschlosseneWoche('2026-07-29')
pruefe(
  'Mittwoch: die Vorwoche',
  mittwoch.montag === '2026-07-20' && mittwoch.freitag === '2026-07-24',
  JSON.stringify(mittwoch)
)

const montag = letzteAbgeschlosseneWoche('2026-07-27')
pruefe('Montag: die Vorwoche', montag.freitag === '2026-07-24')

const spanne = letzteAbgeschlosseneWoche('2026-08-01')

const aktienreihe = [
  { t: '2026-07-23', value: 100 },
  { t: '2026-07-24', value: 102 }, // Vorwochen-Freitag: die Basis
  { t: '2026-07-27', value: 101 },
  { t: '2026-07-31', value: 107.1 },
]
const aktie = wochenveraenderung(aktienreihe, spanne)
pruefe(
  'Basis ist der letzte Schluss vor dem Montag',
  aktie !== null && aktie.basis === 102 && aktie.schluss === 107.1
)
pruefe(
  'die Veränderung rechnet gegen diese Basis',
  aktie !== null && Math.abs(aktie.prozent - 5) < 1e-9,
  `prozent=${aktie?.prozent}`
)

const kryptoreihe = [
  { t: '2026-07-26', value: 200 }, // Sonntag davor – Krypto handelt durch
  { t: '2026-07-30', value: 210 },
]
const krypto = wochenveraenderung(kryptoreihe, spanne)
pruefe('bei Krypto ist der Sonntag davor die Basis', krypto?.basis === 200)
pruefe(
  'der letzte Schluss in der Woche zählt, samt Datum',
  krypto?.schluss === 210 && krypto?.schlussAm === '2026-07-30'
)

pruefe(
  'ohne Basis keine Zahl',
  wochenveraenderung([{ t: '2026-07-28', value: 5 }], spanne) === null
)
pruefe(
  'ohne Punkt in der Woche keine Zahl',
  wochenveraenderung([{ t: '2026-07-24', value: 5 }], spanne) === null
)
pruefe('leere Reihe: null', wochenveraenderung([], spanne) === null)

console.log(`\n${bestanden} Prüfungen bestanden, ${gescheitert} gescheitert.`)
if (gescheitert > 0) process.exit(1)
