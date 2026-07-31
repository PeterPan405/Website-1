/**
 * Prüfungen für den Merklisten-Code.
 *
 * Der Code wird kopiert, in eine Nachricht geklebt und woanders wieder
 * eingefügt – dabei bekommt er Zeilenumbrüche, Leerzeichen und
 * Grossbuchstaben ab. Wer daraufhin „nichts erkannt“ meldet, hat eine
 * Funktion gebaut, die im Alltag nicht funktioniert.
 */

import { baueMerkcode, leseMerkcode, siehtWieCodeAus, VORSATZ } from '../lib/merkcode.ts'

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

console.log('\n— Bauen —')

pruefe('mit Vorsatz', baueMerkcode(['apple']).startsWith(VORSATZ))
pruefe('durch Komma getrennt', baueMerkcode(['apple', 'sap']) === 'IMI1:apple,sap')
pruefe('leere Liste ergibt nur den Vorsatz', baueMerkcode([]) === VORSATZ)

console.log('\n— Lesen —')

pruefe(
  'was gebaut wurde, kommt zurück',
  leseMerkcode(baueMerkcode(['apple', 'sap'])).join() === 'apple,sap'
)
/*
  Die Reihenfolge bleibt. Sie ist die Reihenfolge der Liste; sortiert
  zurueckzugeben waere ein stiller Verlust.
*/
pruefe(
  'die Reihenfolge bleibt',
  leseMerkcode('IMI1:sap,apple,nvidia').join() === 'sap,apple,nvidia'
)

console.log('\n— Was aus der Zwischenablage kommt —')

pruefe('ohne Vorsatz geht auch', leseMerkcode('apple,sap').length === 2)
pruefe('Leerzeichen stoeren nicht', leseMerkcode('IMI1: apple , sap ').length === 2)
/*
  Ein Nachrichtenprogramm bricht lange Zeilen um. Der Code kommt dann mit
  einem Zeilenumbruch mittendrin an — und ist trotzdem vollstaendig.
*/
pruefe(
  'Zeilenumbrueche auch nicht',
  leseMerkcode('IMI1:apple,\nsap\nnvidia').length === 3
)
pruefe(
  'Grossbuchstaben werden kleingeschrieben',
  leseMerkcode('IMI1:APPLE').join() === 'apple'
)

/*
  Doppelte fallen zusammen. Wer zwei Codes hintereinander einliest, hat sonst
  denselben Titel zweimal in der Liste.
*/
pruefe('doppelte Eintraege einmal', leseMerkcode('IMI1:apple,apple,sap').length === 2)

/*
  Fremde Zeichen fallen heraus, statt den ganzen Code zu verwerfen. Aus diesen
  Zeichenketten werden spaeter Adressen gebaut — was hier durchkommt, landet in
  einem `href`.
*/
pruefe(
  'unerlaubte Zeichen fallen heraus',
  leseMerkcode('IMI1:apple,<script>,sap').join() === 'apple,sap'
)
pruefe('Pfadangaben ebenso', leseMerkcode('IMI1:../../etc,apple').join() === 'apple')
pruefe('leerer Text ergibt nichts', leseMerkcode('').length === 0)
pruefe('nur der Vorsatz ergibt nichts', leseMerkcode(VORSATZ).length === 0)

console.log('\n— Erkennung —')

pruefe('ein Code wird erkannt', siehtWieCodeAus('IMI1:apple'))
pruefe('leerer Text nicht', !siehtWieCodeAus('   '))
pruefe('Satzzeichen allein auch nicht', !siehtWieCodeAus('??? !!!'))
/*
  Was diese Funktion NICHT kann: Fliesstext von einem Code unterscheiden.
  „Hallo wie geht es dir“ besteht aus lauter erlaubten Zeichenfolgen und
  kommt deshalb als fuenf „Symbole“ zurueck. Das ist hingenommen: Die
  eingelesenen Symbole werden anschliessend gegen den Katalog gehalten, und
  dort faellt jedes Wort heraus, das kein Instrument ist. Diese Pruefung
  haelt das Verhalten fest, damit niemand spaeter mehr von ihr erwartet.
*/
pruefe(
  'Fliesstext wird nicht erkannt – und das ist bekannt',
  siehtWieCodeAus('hallo wie geht es dir')
)

console.log(`\n${bestanden} bestanden, ${gescheitert} gescheitert.`)
if (gescheitert > 0) process.exit(1)
console.log('Alle Prüfungen bestanden.')
