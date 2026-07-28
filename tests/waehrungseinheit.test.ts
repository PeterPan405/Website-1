/**
 * Prüfungen für Untereinheiten – Pence und Pfund.
 *
 * Die Rechnung ist eine Division durch hundert, und trotzdem steht sie hier:
 * Der Fehler, den sie behebt, war ein Faktor 100 auf 26 Aktienseiten, und
 * gemerkt hat ihn niemand, weil neben dem falschen Kurs ein plausibles
 * Währungskürzel stand.
 */

import { gleicheWaehrung, inHauptwaehrung } from '../lib/waehrungseinheit.ts'

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

console.log('\n— Umrechnung in die Hauptwährung —')

const bp = inHauptwaehrung(525.7, 'GBp')
pruefe('525,70 Pence sind 5,257 Pfund', Math.abs(bp.wert - 5.257) < 1e-9, String(bp.wert))
pruefe('und heißen dann GBP', bp.waehrung === 'GBP', bp.waehrung)

const dollar = inHauptwaehrung(212.5, 'USD')
pruefe('ein Dollarkurs bleibt unverändert', dollar.wert === 212.5)
pruefe('und behält seine Währung', dollar.waehrung === 'USD')

const yen = inHauptwaehrung(2900, 'JPY')
pruefe('ein Yenkurs bleibt unverändert', yen.wert === 2900 && yen.waehrung === 'JPY')

/*
  Der Fall, der den Fehler ausgelöst hat: `GBP` mit grossem P ist bereits die
  Hauptwährung. Wer hier durch hundert teilte, machte aus 5 Pfund 5 Pence.
*/
const pfund = inHauptwaehrung(5.26, 'GBP')
pruefe(
  'GBP mit grossem P wird nicht geteilt',
  pfund.wert === 5.26 && pfund.waehrung === 'GBP'
)

console.log('\n— Gleichheit zweier Währungsangaben —')

pruefe('GBp und GBP meinen dieselbe Währung', gleicheWaehrung('GBp', 'GBP'))
pruefe('und das in beide Richtungen', gleicheWaehrung('GBP', 'GBp'))
pruefe('GBp mit sich selbst', gleicheWaehrung('GBp', 'GBp'))
pruefe('USD und EUR nicht', !gleicheWaehrung('USD', 'EUR'))
pruefe('GBP und USD nicht', !gleicheWaehrung('GBP', 'USD'))
pruefe('GBp und USD nicht', !gleicheWaehrung('GBp', 'USD'))

/*
  Die Gegenprobe zur Gegenprobe: Ein Vergleich ohne Rücksicht auf Gross- und
  Kleinschreibung hielte `GBp` und `GBP` ebenfalls für gleich – und wäre
  trotzdem falsch, weil er den Faktor 100 unterschlägt. Deshalb muss die
  Umrechnung dieselbe Antwort tragen wie der Vergleich.
*/
pruefe(
  'wo die Währungen gleich heissen, rechnet die Umrechnung sie auch zusammen',
  inHauptwaehrung(100, 'GBp').wert === inHauptwaehrung(1, 'GBP').wert
)

console.log(`\n${bestanden} bestanden, ${gescheitert} gescheitert.`)
if (gescheitert > 0) process.exit(1)
console.log('Alle Prüfungen bestanden.')
