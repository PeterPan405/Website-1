/**
 * Prüfungen für die Reihenfolge des zweiten Weges.
 *
 * Der Fehler, gegen den das schützt, ist ein stillstehender Kalender: 817
 * erreichbare Titel bei 8,5 Sekunden Pause sind mehr als zwei Stunden, der
 * Workflow hat zwei. Ein Lauf schafft das Feld also nicht in einem Stück –
 * und ohne Reihenfolge fragte jeder Lauf dieselben ersten Kürzel ab. Die
 * Abdeckung bliebe bei 158 stehen, obwohl jede Woche zwei Stunden abgerufen
 * werden. Von außen sähe das aus wie eine Quelle, die nichts hergibt.
 *
 * Der Import dieser Datei darf `main()` nicht auslösen; die Wache am Ende des
 * Skripts sorgt dafür. Bliebe sie aus, führte jeder Testlauf zwei Stunden
 * Abrufe durch und überschriebe den Bestand.
 */

import { reihenfolgeFuerZweitenWeg } from '../scripts/quartalstermine-abrufen.ts'

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

console.log('\n— Reihenfolge —')

const versuche = {
  ALT: '2026-07-01',
  MITTE: '2026-07-15',
  NEU: '2026-07-29',
}

pruefe(
  'wer noch nie versucht wurde, steht vorn',
  reihenfolgeFuerZweitenWeg(['NEU', 'FRISCH', 'ALT'], versuche)[0] === 'FRISCH',
  reihenfolgeFuerZweitenWeg(['NEU', 'FRISCH', 'ALT'], versuche).join(',')
)

pruefe(
  'danach der aelteste Versuch',
  reihenfolgeFuerZweitenWeg(['NEU', 'MITTE', 'ALT'], versuche).join(',') ===
    'ALT,MITTE,NEU',
  reihenfolgeFuerZweitenWeg(['NEU', 'MITTE', 'ALT'], versuche).join(',')
)

/*
  Ohne zweiten Schluessel haenge die Reihenfolge gleich alter Eintraege an der
  Aufzaehlung des Katalogs – und aenderte sich still, sobald eine Aktie
  dazukommt. Zwei Laeufe wuerden dann verschiedene Kuerzel abfragen, ohne dass
  sich etwas geaendert haette.
*/
const gleichAlt = { AAA: '2026-07-01', BBB: '2026-07-01', CCC: '2026-07-01' }
pruefe(
  'bei gleichem Datum entscheidet das Kuerzel',
  reihenfolgeFuerZweitenWeg(['CCC', 'AAA', 'BBB'], gleichAlt).join(',') === 'AAA,BBB,CCC'
)
pruefe(
  'und das unabhaengig von der Eingabereihenfolge',
  reihenfolgeFuerZweitenWeg(['BBB', 'CCC', 'AAA'], gleichAlt).join(',') ===
    reihenfolgeFuerZweitenWeg(['CCC', 'AAA', 'BBB'], gleichAlt).join(',')
)

pruefe(
  'die Eingabe bleibt unveraendert',
  (() => {
    const eingabe = ['NEU', 'ALT']
    reihenfolgeFuerZweitenWeg(eingabe, versuche)
    return eingabe.join(',') === 'NEU,ALT'
  })()
)

pruefe(
  'eine leere Liste bleibt leer',
  reihenfolgeFuerZweitenWeg([], versuche).length === 0
)

pruefe(
  'ohne jeden Vermerk bleibt es alphabetisch',
  reihenfolgeFuerZweitenWeg(['ZZZ', 'AAA', 'MMM'], {}).join(',') === 'AAA,MMM,ZZZ'
)

/*
  Der Kern: Zwei aufeinanderfolgende Laeufe muessen verschiedene Kuerzel
  vornehmen. Hier nachgestellt mit einem Budget von zwei Abfragen je Lauf.
*/
console.log('\n— Zwei Laeufe hintereinander —')

const alle = ['A', 'B', 'C', 'D', 'E']
const vermerkt: Record<string, string> = {}
const ersterLauf = reihenfolgeFuerZweitenWeg(alle, vermerkt).slice(0, 2)
for (const k of ersterLauf) vermerkt[k] = '2026-07-30'
const zweiterLauf = reihenfolgeFuerZweitenWeg(alle, vermerkt).slice(0, 2)

pruefe('der erste Lauf nimmt zwei', ersterLauf.length === 2, ersterLauf.join(','))
pruefe(
  'der zweite Lauf nimmt andere',
  ersterLauf.every((k) => !zweiterLauf.includes(k)),
  `${ersterLauf.join(',')} dann ${zweiterLauf.join(',')}`
)

const dritterLauf = (() => {
  for (const k of zweiterLauf) vermerkt[k] = '2026-07-30'
  return reihenfolgeFuerZweitenWeg(alle, vermerkt).slice(0, 2)
})()
pruefe(
  'nach drei Laeufen ist das Feld einmal durch',
  new Set([...ersterLauf, ...zweiterLauf, ...dritterLauf]).size === 5,
  [...ersterLauf, ...zweiterLauf, ...dritterLauf].join(',')
)

console.log(`\n${bestanden} bestanden, ${gescheitert} gescheitert.`)
if (gescheitert > 0) process.exit(1)
console.log('Alle Prüfungen bestanden.')
