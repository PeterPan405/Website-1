/**
 * Prüfungen für die Währungsumrechnung.
 *
 * Die Rechnung ist zweimal Dreisatz über den Euro. Sie steht trotzdem unter
 * Prüfung, weil ein vertauschter Bruch keinen Fehler auslöst, sondern eine
 * Zahl – und zwar eine, die in derselben Größenordnung liegt, wenn der
 * Wechselkurs nahe bei eins liegt. Dollar und Euro liegen nahe bei eins.
 */

import { rechneUm } from '../lib/devisen.ts'

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

/** Ein Euro kostet so viele Einheiten – echte Größenordnungen. */
const kurse = { USD: 1.1367, GBP: 0.8555, CHF: 0.9319, JPY: 186.32, CNY: 7.6969 }

function nahe(a: number | null, b: number, toleranz = 1e-6): boolean {
  return a !== null && Math.abs(a - b) < toleranz
}

console.log('\n— Umrechnung —')

pruefe('gleiche Währung bleibt gleich', rechneUm(100, 'USD', 'USD', kurse) === 100)

pruefe(
  '100 Euro sind 113,67 Dollar',
  nahe(rechneUm(100, 'EUR', 'USD', kurse), 113.67, 1e-9)
)
pruefe(
  '113,67 Dollar sind 100 Euro',
  nahe(rechneUm(113.67, 'USD', 'EUR', kurse), 100, 1e-9)
)

/*
  Der Fall, um den es eigentlich geht: Pfund nach Dollar, ohne dass der Euro
  vorkommt. 0,8555 Pfund und 1,1367 Dollar sind derselbe Euro, ein Pfund also
  1,3287 Dollar.
*/
const pfundInDollar = rechneUm(1, 'GBP', 'USD', kurse)
pruefe(
  'ein Pfund sind 1,3287 Dollar',
  nahe(pfundInDollar, 1.1367 / 0.8555, 1e-9),
  String(pfundInDollar)
)
pruefe('und das Pfund ist mehr wert als der Dollar', (pfundInDollar ?? 0) > 1)

/*
  Die Gegenprobe gegen den vertauschten Bruch: Der Yen ist viel weniger wert
  als der Dollar. Wer die Division dreht, bekommt hier keine leicht andere
  Zahl, sondern eine um den Faktor 30.000.
*/
const yenInDollar = rechneUm(1000, 'JPY', 'USD', kurse)
pruefe(
  '1000 Yen sind rund 6 Dollar',
  (yenInDollar ?? 0) > 5 && (yenInDollar ?? 0) < 7,
  String(yenInDollar)
)

pruefe(
  'hin und zurück ergibt den Ausgangswert',
  nahe(rechneUm(rechneUm(500, 'CHF', 'CNY', kurse) ?? 0, 'CNY', 'CHF', kurse), 500, 1e-9)
)

console.log('\n— Wo nicht gerechnet wird —')

pruefe('unbekannte Ausgangswährung', rechneUm(100, 'XXX', 'USD', kurse) === null)
pruefe('unbekannte Zielwährung', rechneUm(100, 'USD', 'XXX', kurse) === null)
pruefe('leere Kurstabelle', rechneUm(100, 'USD', 'GBP', {}) === null)
pruefe('kein Betrag', rechneUm(Number.NaN, 'USD', 'EUR', kurse) === null)
pruefe(
  'ein Kurs von null wird nicht zum Teiler',
  rechneUm(100, 'USD', 'EUR', { USD: 0 }) === null
)
pruefe(
  'ein negativer Kurs ebenso wenig',
  rechneUm(100, 'USD', 'EUR', { USD: -1.2 }) === null
)

console.log(`\n${bestanden} bestanden, ${gescheitert} gescheitert.`)
if (gescheitert > 0) process.exit(1)
console.log('Alle Prüfungen bestanden.')
