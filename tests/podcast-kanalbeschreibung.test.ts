/**
 * Die Kanalbeschreibung darf nichts versprechen, was die Folge nicht hält.
 *
 * Ausführen mit `npm test`.
 *
 * ## Der Anlass
 *
 * Am 20. September 2026 stand im Feed noch, das Marktupdate fasse die Lage
 * „kompakt in rund fünf Minuten" zusammen, „immer mit Einordnung, was das für
 * Privatanleger bedeutet". Beides traf seit dem 16. September nicht mehr zu:
 * Die Einordnung ist auf ausdrücklichen Wunsch aus der Folge genommen worden
 * und steht nur noch auf der Website, und die letzten vierzehn Folgen dauern
 * im Mittel 4:10, die kürzeste 2:51.
 *
 * Das ist kein Schönheitsfehler. Diesen Text liest ein Hörer **vor** dem
 * Abonnieren; er ist eine Zusage, und es ist schon einmal eine falsche
 * dringestanden – am 17. August „von einem Menschen inhaltlich geprüft",
 * während die Kette ohne jeden Halt veröffentlichte.
 *
 * Dreimal dieselbe Sorte Fehler: Der Text bleibt stehen, während sich das
 * ändert, worüber er etwas behauptet. Niemand merkt es, weil ein Feed
 * niemandem widerspricht.
 *
 * ## Was diese Datei prüft – und was nicht
 *
 * Sie kann nicht wissen, ob eine Zusage stimmt. Sie kann nur die Sorte Zusage
 * verbieten, die **zwangsläufig** veraltet:
 *
 * - eine Zahl von Minuten – die Länge schwankt mit der Nachrichtenlage
 * - eine zugesagte Einordnung – die gibt es in der Folge nicht mehr
 * - eine Prüfung durch einen Menschen – die gibt es nicht
 *
 * Und sie verlangt umgekehrt, dass die beiden Hinweise dastehen, die stimmen
 * müssen: erzeugte Stimme und keine Anlageberatung.
 *
 * ## Warum der Quelltext gelesen wird
 *
 * `scripts/podcast-feed-schreiben.ts` liest beim Laden das Folgenregister und
 * schreibt Dateien; ein Import wäre ein Lauf. Gelesen wird deshalb der Text –
 * dasselbe Vorgehen wie in `tests/globus-kennzahlen.test.ts`.
 */

import { readFileSync } from 'node:fs'
import { join } from 'node:path'

let failed = 0
function pruefen(was: string, bedingung: boolean, hinweis = ''): void {
  if (bedingung) {
    console.log(`OK   ${was}`)
  } else {
    failed++
    console.log(`FEHL ${was}${hinweis ? `\n     ${hinweis}` : ''}`)
  }
}

const wurzel = join(import.meta.dirname, '..')
const QUELLE = readFileSync(join(wurzel, 'scripts/podcast-feed-schreiben.ts'), 'utf8')

/**
 * Der Wert von `kopfBeschreibung` als ein Stück Fliesstext.
 *
 * Er steht als Kette aneinandergehängter Zeichenketten da, zwischen denen
 * Kommentare stehen dürfen. Genommen werden deshalb die Zeichenketten selbst,
 * nicht der Quelltext dazwischen – sonst prüfte diese Datei die Begründung
 * mit, in der die verbotenen Wörter absichtlich vorkommen.
 */
function kanalbeschreibung(quelle: string): string {
  const beginn = quelle.indexOf('const kopfBeschreibung =')
  if (beginn < 0) return ''
  const ende = quelle.indexOf('\n\n', beginn)
  const block = quelle.slice(beginn, ende < 0 ? undefined : ende)
  return [...block.matchAll(/'((?:[^'\\]|\\.)*)'/g)].map((treffer) => treffer[1]).join('')
}

const TEXT = kanalbeschreibung(QUELLE)

pruefen(
  'die Kanalbeschreibung ist auffindbar',
  TEXT.length > 100,
  `Gefunden: ${TEXT.length} Zeichen. Heisst die Konstante noch kopfBeschreibung?`
)

/** Die Zusagen, die von selbst veralten, mit dem Grund dazu. */
const VERBOTEN: ReadonlyArray<readonly [RegExp, string]> = [
  [
    /\b(\d+|ein|zwei|drei|vier|fünf|sechs|sieben|acht|neun|zehn)\s+Minuten\b/i,
    'Eine Zahl von Minuten veraltet mit der Nachrichtenlage. „in wenigen Minuten" sagt dasselbe und bleibt wahr.',
  ],
  [
    /\bEinordnung\b/i,
    'Die Einordnung ist am 16. September 2026 aus der Folge genommen worden und steht nur noch auf der Website.',
  ],
  [
    /\bwas (das|dies) für (Privat)?[Aa]nleger bedeutet\b/i,
    'Dasselbe Versprechen in anderen Worten – gesprochen werden Nachrichten ohne Bewertung.',
  ],
  [
    /\bvon einem Menschen\b/i,
    'Am 17. August 2026 schon einmal gestrichen: Die Kette veröffentlicht ohne Halt.',
  ],
]

for (const [muster, grund] of VERBOTEN) {
  const treffer = TEXT.match(muster)
  pruefen(
    `keine Zusage der Art ${muster.source.slice(0, 34)}…`,
    treffer === null,
    treffer ? `„${treffer[0]}" steht in der Kanalbeschreibung. ${grund}` : ''
  )
}

/** Und die Hinweise, die dastehen müssen. */
for (const [teil, warum] of [
  ['künstlich erzeugt', 'Die Stimme ist erzeugt; das gehört vor das Abonnieren.'],
  ['Keine Anlageberatung', 'Der Rechtshinweis gehört in die Kanalbeschreibung.'],
] as const) {
  pruefen(`die Beschreibung nennt „${teil}"`, TEXT.includes(teil), warum)
}

/*
  Die Gegenprobe. Eine Absicherung, die nie anschlägt, sieht aus wie Ruhe –
  deshalb bekommt sie hier genau den Text vorgelegt, der bis zum 20. September
  2026 im Feed stand. Beanstandet sie den nicht, prüft sie nichts.
*/
const ALT =
  'Dein tägliches Marktupdate von IM Invests. Jeden Morgen fassen wir ' +
  'kompakt in rund fünf Minuten die wichtigsten Entwicklungen an den ' +
  'Finanzmärkten zusammen: Aktien, Anleihen, Rohstoffe, Notenbanken – immer ' +
  'mit Einordnung, was das für Privatanleger bedeutet.'

const beanstandet = VERBOTEN.filter(([muster]) => muster.test(ALT))
pruefen(
  `die alte Fassung wird beanstandet (${beanstandet.length} von ${VERBOTEN.length} Mustern)`,
  beanstandet.length >= 3,
  'Die Prüfung findet an der Fassung, die den Anlass gab, zu wenig – sie prüft nichts.'
)

if (failed) {
  console.log(`\n${failed} Prüfung(en) fehlgeschlagen.`)
  process.exit(1)
}
console.log('\nAlle Prüfungen bestanden.')
