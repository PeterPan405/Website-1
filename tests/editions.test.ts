/**
 * Prüfungen für die Tagesausgaben.
 *
 * ## Warum es diese Datei gibt
 *
 * In `data/editions/index.ts` stand seit jeher: „Der Test unter
 * `tests/editions.test.ts` prüft, dass keine Ausgabe im Ordner liegt, die hier
 * fehlt.“ Diese Datei gab es nicht. Der Kommentar beschrieb eine Sicherung, auf
 * die sich niemand hätte verlassen dürfen – und eine vergessene Ausgabe wäre
 * genau so ausgegangen, wie er es ausschließen wollte: Die Datei liegt im
 * Ordner, die Website kennt sie nicht, und niemand merkt es, weil nichts fehlt,
 * das jemand vermisst.
 *
 * ## Was hier geprüft wird
 *
 * Erstens die Registrierung: Jede Ausgabe im Ordner muss in `index.ts` stehen.
 * Das läuft über den Dateitext, weil die Alias-Pfade (`@/data/…`) außerhalb des
 * Next-Builds nicht auflösbar sind.
 *
 * Zweitens der Umfang. Die Zahl der Meldungen stand einmal im Typ – `top` und
 * `further` waren Tupel, drei plus zwei. Diese Regel ist gefallen, weil sie über
 * die Nachrichtenlage bestimmen wollte. Was bleibt, sind Unter- und Obergrenzen
 * zur Laufzeit, und die sind nur dann eine Sicherung, wenn sie selbst geprüft
 * sind.
 */

import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

import { validateEditions, type Bezuege } from '../lib/editions-validate.ts'

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

const ordner = join(import.meta.dirname, '..', 'data', 'editions')

/* ---------------------------------------------------------------------------
   Jede Ausgabe im Ordner ist eingetragen
--------------------------------------------------------------------------- */

console.log('\n— Die Liste der Ausgaben —')

const dateien = readdirSync(ordner)
  .filter((name) => /^\d{4}-\d{2}-\d{2}\.ts$/.test(name))
  .map((name) => name.replace(/\.ts$/, ''))
  .sort()

const index = readFileSync(join(ordner, 'index.ts'), 'utf8')

pruefe('es liegt überhaupt eine Ausgabe im Ordner', dateien.length > 0)

for (const datum of dateien) {
  pruefe(
    `${datum} ist in index.ts eingetragen`,
    index.includes(`./${datum}'`),
    'Datei angelegt, aber nicht importiert – die Ausgabe erscheint nicht auf der Website'
  )
}

/*
  Die Gegenrichtung: ein Import ohne Datei.

  Das bräche zwar den Build, aber die Meldung des Compilers erklärt nicht, was
  eigentlich passiert ist. Diese hier tut es.
*/
const importiert = [...index.matchAll(/from '\.\/(\d{4}-\d{2}-\d{2})'/g)].map((t) => t[1])
for (const datum of importiert) {
  pruefe(`${datum} hat auch eine Datei`, dateien.includes(datum))
}

pruefe(
  'Ordner und Liste sind gleich lang',
  importiert.length === dateien.length,
  `${dateien.length} Dateien, ${importiert.length} Einträge`
)

/* ---------------------------------------------------------------------------
   Der erlaubte Umfang einer Ausgabe
--------------------------------------------------------------------------- */

console.log('\n— Der Umfang einer Ausgabe —')

const bezuege: Bezuege = { topicSlugs: new Set(['etf']), symbols: new Set(['AAPL']) }

/** Eine Meldung, die für sich genommen fehlerfrei ist. */
function meldung(headline: string) {
  return {
    headline,
    summary: ['Ein Absatz, der lang genug ist, um die Mindestlänge zu erfüllen.'],
    category: 'Märkte' as const,
    whyItMatters: 'Auch dieser Satz ist lang genug, um die Prüfung zu bestehen.',
    relatedTopics: ['etf'],
    relatedSymbols: ['AAPL'],
    sources: [{ label: 'Quelle', url: 'https://example.org' }],
  }
}

function ausgabe(top: number, further: number) {
  return {
    date: '2026-07-28',
    intro:
      'Ein Vorspann von passender Länge, der den Tag in einem Satz zusammenfasst und dabei den Zielkorridor der Meta-Description trifft.',
    top: Array.from({ length: top }, (_, i) => meldung(`Top ${i}`)),
    further: Array.from({ length: further }, (_, i) => meldung(`Weiter ${i}`)),
  }
}

function umfangsfehler(top: number, further: number): string[] {
  return validateEditions([ausgabe(top, further)], bezuege).filter(
    (p) => p.includes('Top-Meldungen') || p.includes('Meldungen insgesamt')
  )
}

pruefe('drei plus zwei ist in Ordnung', umfangsfehler(3, 2).length === 0)
pruefe('zwei plus eins ebenso', umfangsfehler(2, 1).length === 0)
pruefe('vier plus vier ebenso', umfangsfehler(4, 4).length === 0)
pruefe('drei ohne weitere Meldungen ebenso', umfangsfehler(3, 0).length === 0)

pruefe(
  'zwei Meldungen sind zu wenig für einen Tagesüberblick',
  umfangsfehler(2, 0).length === 1
)
pruefe('ohne Top-Meldung geht es nicht', umfangsfehler(0, 5).length === 1)
pruefe(
  'sieben Top-Meldungen sind keine Top-Meldungen mehr',
  umfangsfehler(7, 0).length > 0
)
pruefe('dreizehn Meldungen deuten auf ein Versehen', umfangsfehler(3, 10).length === 1)

/* ---------------------------------------------------------------------------
   Die inhaltlichen Prüfungen greifen weiterhin
--------------------------------------------------------------------------- */

console.log('\n— Verweise und Pflichtangaben —')

function nurMeldungsfehler(
  veraendern: (m: ReturnType<typeof meldung>) => void
): string[] {
  const a = ausgabe(3, 2)
  veraendern(a.top[0])
  return validateEditions([a], bezuege)
}

pruefe(
  'ein erfundenes Lernthema fällt auf',
  nurMeldungsfehler((m) => {
    m.relatedTopics = ['gibt-es-nicht']
  }).some((p) => p.includes('Lernthema'))
)

pruefe(
  'ein erfundener Kurs fällt auf',
  nurMeldungsfehler((m) => {
    m.relatedSymbols = ['XXXX']
  }).some((p) => p.includes('Kurs'))
)

pruefe(
  'eine Meldung ohne Quelle fällt auf',
  nurMeldungsfehler((m) => {
    m.sources = []
  }).some((p) => p.includes('Quelle ist Pflicht'))
)

pruefe(
  'eine Quelle ohne https fällt auf',
  nurMeldungsfehler((m) => {
    m.sources = [{ label: 'Unsicher', url: 'http://example.org' }]
  }).some((p) => p.includes('https'))
)

pruefe(
  'zwei gleiche Überschriften fallen auf',
  (() => {
    const a = ausgabe(3, 2)
    a.further[0].headline = a.top[0].headline
    return validateEditions([a], bezuege).some((p) => p.includes('doppelt'))
  })()
)

pruefe(
  'eine fehlerfreie Ausgabe meldet nichts',
  validateEditions([ausgabe(3, 2)], bezuege).length === 0
)

console.log(`\n${bestanden} bestanden, ${gescheitert} gescheitert.`)
if (gescheitert > 0) process.exit(1)
console.log('Alle Prüfungen bestanden.')
