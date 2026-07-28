/**
 * Prüfungen für die Auswahllogik des Sprachumschalters.
 *
 * Übersetzt wird im Browser; was sich hier prüfen lässt, ist die Entscheidung
 * davor: Welcher Text geht überhaupt an den Übersetzer, und welcher nicht.
 * Diese Entscheidung trägt die Kosten – auf einer Kurstabelle ist die große
 * Mehrheit aller Textknoten eine Zahl, und jede unnötige Anfrage verlängert die
 * Zeit, in der die Seite halb übersetzt dasteht.
 */

import {
  ausweichAdresse,
  brauchtUebersetzung,
  inBloecke,
  SPRACH_SCHLUESSEL,
} from '../lib/uebersetzung.ts'

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

console.log('\n— Was übersetzt werden muss —')

pruefe('ein Satz', brauchtUebersetzung('Der Zinseszins wirkt über die Zeit.'))
pruefe('ein einzelnes Wort', brauchtUebersetzung('Marktkapitalisierung'))
pruefe('ein Wort mit Umlaut', brauchtUebersetzung('Währungsrisiko'))

console.log('\n— Was nicht —')

pruefe('leerer Text', !brauchtUebersetzung(''))
pruefe('nur Leerzeichen', !brauchtUebersetzung('   \n  '))
pruefe('eine Zahl', !brauchtUebersetzung('1.234,56'))
pruefe('ein Prozentwert', !brauchtUebersetzung('12,4 %'))
pruefe('ein Datum', !brauchtUebersetzung('28.07.2026'))
pruefe('ein Trennzeichen', !brauchtUebersetzung('·'))
pruefe('ein Gedankenstrich', !brauchtUebersetzung('–'))
pruefe('ein einzelner Buchstabe', !brauchtUebersetzung('A'))

/*
  Der Grenzfall, der die Regel begründet: Ein Währungsbetrag besteht aus einer
  Zahl und einem Kürzel. Das Kürzel hat zwei Buchstaben nebeneinander und geht
  deshalb durch – das ist beabsichtigt, denn „Mrd. USD“ heißt auf Englisch
  anders.
*/
pruefe('ein Betrag mit Einheit', brauchtUebersetzung('4,2 Mrd. USD'))

console.log('\n— Blockbildung —')

pruefe('gleichmässig teilbar', inBloecke([1, 2, 3, 4], 2).length === 2)
pruefe('mit Rest', inBloecke([1, 2, 3, 4, 5], 2).length === 3)
pruefe('letzter Block ist kürzer', inBloecke([1, 2, 3, 4, 5], 2)[2].length === 1)
pruefe('leere Liste ergibt keinen Block', inBloecke([], 5).length === 0)
pruefe(
  'kein Element geht verloren',
  inBloecke([1, 2, 3, 4, 5, 6, 7], 3).flat().join(',') === '1,2,3,4,5,6,7'
)
pruefe('Blockgrösse null ergibt einen Block', inBloecke([1, 2, 3], 0).length === 1)

console.log('\n— Ausweichweg —')

const adresse = ausweichAdresse('https://example.org/lernen/etf?a=1&b=2')
pruefe('die Seite steht kodiert in der Adresse', adresse.includes('%3Fa%3D1%26b%3D2'))
pruefe('Ausgangssprache Deutsch', adresse.includes('sl=de'))
pruefe('Zielsprache Englisch', adresse.includes('tl=en'))

console.log('\n— Der Schlüssel im Speicher —')

pruefe('ist gesetzt und kein Platzhalter', SPRACH_SCHLUESSEL === 'fk-sprache')

console.log(`\n${bestanden} bestanden, ${gescheitert} gescheitert.`)
if (gescheitert > 0) process.exit(1)
console.log('Alle Prüfungen bestanden.')
