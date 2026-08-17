/**
 * Der Begriff des Tages – und die Frage, ob er wirklich einer ist.
 *
 * ## Was hier schiefgehen kann
 *
 * 1. **Er ist nicht deterministisch.** Dann zeigen zwei Aufrufe zwei
 *    Begriffe, und „Begriff des Tages" ist eine Behauptung. Das fällt im
 *    Betrieb kaum auf – die Seite sieht bei jedem Bau plausibel aus.
 * 2. **Die Reihenfolge ist gar nicht gemischt.** Wenn die Sortierung nichts
 *    tut, kommen die Begriffe alphabetisch, und das merkt man erst nach
 *    Wochen. Geprüft wird deshalb gegen die alphabetische Reihenfolge.
 * 3. **Es ist eine Ziehung statt eines Durchlaufs.** Dann kommt derselbe
 *    Begriff mehrfach, während andere nie drankommen – der Fall, gegen den
 *    die ganze Bauart gerichtet ist.
 * 4. **Die Bibliothek hat eine eigene Uhr.** Dann lässt sie sich nicht prüfen,
 *    und die Prüfungen hier sagen nichts über morgen.
 */

import { readFileSync } from 'node:fs'

import { begriffDesTages, reihenfolgeFuerJahr, tagImJahr } from '@/lib/begriff-des-tages'
import { getGlossar } from '@/lib/glossar'

let failed = 0

function pruefen(was: string, bedingung: boolean, hinweis = ''): void {
  if (bedingung) {
    console.log(`OK   ${was}`)
  } else {
    failed++
    console.log(`FEHL ${was}${hinweis ? `\n     ${hinweis}` : ''}`)
  }
}

const glossar = await getGlossar()
console.log(`${glossar.length} Glossarbegriffe\n`)

/* ------------------------------------------------------------ Der Tag im Jahr */

pruefen('1. Januar ist Tag 1', tagImJahr('2026-01-01') === 1)
pruefen('31. Dezember 2026 ist Tag 365', tagImJahr('2026-12-31') === 365)
pruefen(
  'Ein Schaltjahr hat 366 Tage',
  tagImJahr('2028-12-31') === 366,
  `${tagImJahr('2028-12-31')} – 2028 ist ein Schaltjahr, und der 29. Februar zählt mit.`
)

/* ----------------------------------------------------------- Deterministisch */

console.log('')

pruefen(
  'Derselbe Tag ergibt denselben Begriff',
  Array.from({ length: 20 }).every(
    () =>
      begriffDesTages(glossar, '2026-08-17')?.slug ===
      begriffDesTages(glossar, '2026-08-17')?.slug
  ),
  'Zwanzig Aufrufe, ein Ergebnis – sonst ist es kein Begriff des Tages.'
)

/*
  Die Gegenprobe: Verschiedene Tage müssen verschiedene Begriffe ergeben.

  Ohne sie bestünde die Prüfung oben auch dann, wenn die Funktion immer
  denselben Eintrag lieferte – und das wäre ebenfalls „deterministisch".
*/
const eineWoche = ['17', '18', '19', '20', '21', '22', '23'].map(
  (t) => begriffDesTages(glossar, `2026-08-${t}`)?.slug
)
pruefen(
  'Sieben aufeinanderfolgende Tage ergeben sieben verschiedene Begriffe',
  new Set(eineWoche).size === 7,
  `${eineWoche.join(', ')}`
)

/* ------------------------------------------------- Die Reihenfolge ist gemischt */

console.log('')

const reihenfolge = reihenfolgeFuerJahr(glossar, 2026)
const alphabetisch = glossar.map((e) => e.slug)

pruefen(
  'Die Jahresreihenfolge ist nicht die alphabetische',
  reihenfolge.map((e) => e.slug).join() !== alphabetisch.join(),
  'Tut die Sortierung nichts, kommen die Begriffe alphabetisch – wochenlang A, dann B.'
)

/*
  Und sie ist wirklich durchmischt, nicht nur an einer Stelle verschoben.

  Gezählt wird, wie viele Einträge an derselben Stelle geblieben sind. Bei
  einer echten Mischung ist das im Mittel genau einer, unabhängig von der
  Länge; mehr als ein Zehntel wäre keine Mischung.
*/
const anGleicherStelle = reihenfolge.filter((e, i) => e.slug === alphabetisch[i]).length
pruefen(
  'Die Mischung verschiebt fast alle Einträge',
  anGleicherStelle < glossar.length / 10,
  `${anGleicherStelle} von ${glossar.length} stehen noch an ihrer alphabetischen Stelle.`
)

pruefen(
  'Die Reihenfolge enthält jeden Begriff genau einmal',
  reihenfolge.length === glossar.length &&
    new Set(reihenfolge.map((e) => e.slug)).size === glossar.length,
  'Beim Sortieren darf nichts verlorengehen oder doppelt auftauchen.'
)

pruefen(
  'Ein anderes Jahr mischt anders',
  reihenfolgeFuerJahr(glossar, 2027)
    .map((e) => e.slug)
    .join() !== reihenfolge.map((e) => e.slug).join(),
  'Sonst käme jeder Begriff jedes Jahr am selben Tag.'
)

pruefen(
  'Dasselbe Jahr mischt gleich',
  reihenfolgeFuerJahr(glossar, 2026)
    .map((e) => e.slug)
    .join() === reihenfolge.map((e) => e.slug).join(),
  'Der Streuwert muss stabil sein – sonst wechselt der Begriff bei jedem Bau.'
)

/* ------------------------------------------------ Ein Durchlauf, keine Ziehung */

console.log('')

/*
  Der Kern der Bauart: Über so viele Tage, wie es Begriffe gibt, muss jeder
  genau einmal drankommen. Bei einer Zufallsziehung wäre etwa ein Drittel
  doppelt und ein Drittel gar nicht dabei.
*/
const einDurchlauf = Array.from({ length: glossar.length }, (_, i) => {
  const datum = new Date(Date.UTC(2026, 0, 1 + i))
  return begriffDesTages(glossar, datum.toISOString().slice(0, 10))?.slug
})
pruefen(
  `Über ${glossar.length} Tage kommt jeder Begriff genau einmal`,
  new Set(einDurchlauf).size === glossar.length,
  `${new Set(einDurchlauf).size} verschiedene über ${glossar.length} Tage – ` +
    'bei einer Ziehung mit Zurücklegen wären es rund zwei Drittel.'
)

pruefen(
  'Der 1. Januar ist der erste der Reihe',
  begriffDesTages(glossar, '2026-01-01')?.slug === reihenfolge[0].slug,
  'Ohne das „− 1" beginnt das Jahr beim zweiten Eintrag.'
)

/* ------------------------------------------------------------------ Ränder */

console.log('')

pruefen('Leere Liste ergibt null', begriffDesTages([], '2026-08-17') === null)
pruefen(
  'Ein unlesbares Datum ergibt null',
  begriffDesTages(glossar, 'kein Datum') === null,
  'Der Aufruf kommt aus einer Seite – werfen wäre die falsche Antwort.'
)
pruefen(
  'Ein einziger Eintrag kommt jeden Tag',
  begriffDesTages([{ slug: 'eins' }], '2026-08-17')?.slug === 'eins' &&
    begriffDesTages([{ slug: 'eins' }], '2026-08-18')?.slug === 'eins',
  'Der Rest der Division durch eins ist immer null – kein Sonderfall nötig.'
)

/* -------------------------------------------- Die Bibliothek hat keine Uhr */

console.log('')

/*
  Ohne Kommentare gelesen: Ein `new Date()` in einer Erklärung ist keines im
  Code. Diese Unterscheidung hat bei `lib/datenstand.ts` schon einmal einen
  falschen Befund erzeugt.
*/
const quelle = readFileSync('lib/begriff-des-tages.ts', 'utf8')
const ohneKommentare = quelle.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '')

pruefen(
  'Die Bibliothek liest die Uhr nicht selbst',
  !/new Date\(\s*\)|Date\.now/.test(ohneKommentare),
  'Wer den Tag hereinreicht, kann prüfen. Eine eigene Uhr kann das niemand.'
)
pruefen(
  'Die Gegenprobe: nach dem Strippen steht noch Code da',
  ohneKommentare.includes('export function begriffDesTages'),
  'Sonst prüft die Zeile darüber eine leere Zeichenkette.'
)

console.log(
  failed === 0 ? '\nAlle Prüfungen bestanden.' : `\n${failed} Prüfung(en) fehlgeschlagen.`
)
process.exit(failed === 0 ? 0 : 1)
