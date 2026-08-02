/**
 * Prüfungen für den CSV-Export der Merkliste.
 *
 * Die Datei entsteht im Browser – ein Fehler hier fiele in keiner Bauprüfung
 * auf, sondern erst in der Tabellenkalkulation eines Besuchers. Deshalb die
 * Regeln einzeln: Trennzeichen, Dezimalpunkt, leere Felder, und das eine
 * Feld, das Anführungszeichen braucht.
 */

import { baueMerklisteCsv } from '../lib/merkliste-csv.ts'

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

const beispiel = [
  {
    symbol: 'apple',
    ticker: 'AAPL',
    name: 'Apple',
    einheit: 'USD',
    stellen: 2,
    wert: 308.911,
    veraenderung: 2.525,
    rendite: 0.4,
    termine: [{ tag: '2026-08-07', art: 'Dividende' }],
    branche: 'Technologie',
    sitzland: '840',
  },
  {
    symbol: 'dax',
    ticker: 'DAX',
    name: 'DAX; der Leitindex',
    einheit: 'Punkte',
    stellen: 0,
    wert: 24000.4,
    veraenderung: -0.1,
    rendite: null,
    termine: [],
    branche: null,
    sitzland: null,
  },
]

const csv = baueMerklisteCsv(beispiel, '2026-08-01')
const zeilen = csv.trimEnd().split('\n')

pruefe('zwei Kommentarzeilen, ein Kopf, zwei Datenzeilen', zeilen.length === 5)
pruefe('der Stand steht in der ersten Zeile', zeilen[0].includes('2026-08-01'))
pruefe(
  'die Kopfzeile trennt mit Semikolon',
  zeilen[2].startsWith('Symbol;Ticker;Name;Kurs')
)
pruefe(
  'Kurse mit Punkt und in der Genauigkeit des Instruments',
  zeilen[3].includes(';308.91;') && zeilen[4].includes(';24000;')
)
pruefe(
  'ein Semikolon im Namen erzwingt Anführungszeichen',
  zeilen[4].includes('"DAX; der Leitindex"')
)
pruefe('ohne Rendite und Termin bleiben die Felder leer', zeilen[4].endsWith(';-0.10;;;'))
pruefe(
  'Termin samt Art steht in der Apple-Zeile',
  zeilen[3].endsWith(';2026-08-07;Dividende')
)
pruefe('die Datei endet mit einem Zeilenumbruch', csv.endsWith('\n'))

console.log(`\n${bestanden} Prüfungen bestanden, ${gescheitert} gescheitert.`)
if (gescheitert > 0) process.exit(1)
