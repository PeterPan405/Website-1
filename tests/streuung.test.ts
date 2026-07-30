/**
 * Prüfungen für die Streuungsauswertung der Merkliste.
 *
 * Der Fehler, um den es geht, ist eine beruhigende Zahl: „acht Titel in fünf
 * Branchen“ klingt gut und kann trotzdem eine Auswahl beschreiben, die zur
 * Hälfte an einem Faden hängt. Deshalb zählt nicht die Zahl der Gruppen,
 * sondern die Größe der größten – und deshalb wird genau das hier geprüft.
 */

import { ordneEin, werteStreuung, type Streuposten } from '../lib/streuung.ts'

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

function posten(paare: [string | null, string | null][]): Streuposten[] {
  return paare.map(([branche, sitzland]) => ({ branche, sitzland }))
}

console.log('\n— Zaehlen und sortieren —')

const gemischt = werteStreuung(
  posten([
    ['Halbleiter', '840'],
    ['Halbleiter', '840'],
    ['Banken', '276'],
    ['Pharma', '756'],
  ])
)
pruefe('zaehlt die Titel', gemischt.titel === 4)
pruefe('zaehlt die Branchen', gemischt.branchen.length === 3)
pruefe('groesste Branche zuerst', gemischt.branchen[0].name === 'Halbleiter')
pruefe('mit ihrer Anzahl', gemischt.branchen[0].anzahl === 2)
pruefe(
  'und ihrem Anteil',
  Math.abs(gemischt.branchen[0].anteilProzent - 50) < 1e-9,
  String(gemischt.branchen[0].anteilProzent)
)
pruefe('zaehlt die Laender', gemischt.laender.length === 3)

/*
  Bei gleicher Anzahl entscheidet der Name. Ohne diesen zweiten Schluessel
  haenge die Reihenfolge an der Merkreihenfolge, und die Anzeige spraenge,
  sobald jemand einen Titel entfernt und wieder hinzufuegt.
*/
const gleichauf = werteStreuung(
  posten([
    ['Zahlungsverkehr', '840'],
    ['Banken', '840'],
  ])
)
pruefe(
  'bei gleicher Anzahl entscheidet der Name',
  gleichauf.branchen.map((b) => b.name).join(',') === 'Banken,Zahlungsverkehr'
)

console.log('\n— Der Bezugswert des Anteils —')

/*
  Der Anteil bezieht sich auf die zugeordneten Titel, nicht auf alle. Sonst
  saehe ein Klumpen kleiner aus, blosz weil bei anderen Titeln Daten fehlen –
  und ausgerechnet die Warnung fiele dann schwaecher aus.
*/
const mitLuecken = werteStreuung(
  posten([
    ['Halbleiter', '840'],
    ['Halbleiter', '840'],
    ['Halbleiter', '840'],
    ['Halbleiter', '840'],
    ['Halbleiter', '840'],
    [null, null],
    [null, null],
    ['Banken', '276'],
  ])
)
pruefe(
  'der Anteil rechnet ohne die Titel ohne Branche',
  Math.abs(mitLuecken.branchen[0].anteilProzent - (5 / 6) * 100) < 1e-9,
  String(mitLuecken.branchen[0].anteilProzent)
)
pruefe('die Luecken werden ausgewiesen', mitLuecken.ohneBranche === 2)
pruefe('auch beim Land', mitLuecken.ohneLand === 2)

console.log('\n— Einordnung —')

pruefe(
  'die Haelfte in einer Branche heisst einseitig',
  ordneEin(gemischt) === 'einseitig'
)

/*
  Der Fall, um den es geht: Fuenf Branchen klingen breit, aber vier von acht
  Titeln in einer heisst, dass die Haelfte am selben Faden haengt.
*/
const truegerisch = werteStreuung(
  posten([
    ['Halbleiter', '840'],
    ['Halbleiter', '840'],
    ['Halbleiter', '840'],
    ['Halbleiter', '840'],
    ['Banken', '276'],
    ['Pharma', '756'],
    ['Energie', '826'],
    ['Handel', '840'],
  ])
)
pruefe('fuenf Branchen und trotzdem einseitig', truegerisch.branchen.length === 5)
pruefe('weil die Haelfte in einer sitzt', ordneEin(truegerisch) === 'einseitig')

const breit = werteStreuung(
  posten([
    ['Halbleiter', '840'],
    ['Banken', '276'],
    ['Pharma', '756'],
    ['Energie', '826'],
    ['Handel', '392'],
    ['Konsum', '250'],
  ])
)
pruefe('sechs Branchen zu je einem Titel sind breit', ordneEin(breit) === 'breit')

const dazwischen = werteStreuung(
  posten([
    ['Halbleiter', '840'],
    ['Halbleiter', '840'],
    ['Banken', '276'],
    ['Pharma', '756'],
    ['Energie', '826'],
  ])
)
pruefe(
  'zwei von fuenf in einer Branche sind gemischt',
  ordneEin(dazwischen) === 'gemischt'
)

console.log('\n— Randfaelle —')

pruefe(
  'ueber einen einzigen Titel gibt es nichts zu sagen',
  ordneEin(werteStreuung(posten([['Banken', '276']]))) === null
)
pruefe(
  'und auch keinen Klumpen',
  werteStreuung(posten([['Banken', '276']])).groessterKlumpen === null
)
pruefe('eine leere Auswahl ergibt nichts', ordneEin(werteStreuung([])) === null)
pruefe('eine leere Auswahl hat keine Branchen', werteStreuung([]).branchen.length === 0)
pruefe(
  'lauter Titel ohne Branche ergeben keine Gruppen',
  werteStreuung(
    posten([
      [null, null],
      [null, null],
    ])
  ).branchen.length === 0
)
pruefe(
  'und dann auch keinen Klumpen',
  werteStreuung(
    posten([
      [null, null],
      [null, null],
    ])
  ).groessterKlumpen === null
)

console.log(`\n${bestanden} bestanden, ${gescheitert} gescheitert.`)
if (gescheitert > 0) process.exit(1)
console.log('Alle Prüfungen bestanden.')
