/**
 * Der `intro`-Korridor passt zur Meta-Description.
 *
 * ## Warum diese Prüfung existiert
 *
 * Am 16. August 2026 stand die Ausgabe des Tages nicht, obwohl der Agent
 * geliefert hatte. Der Bau brach ab mit:
 *
 *     /news/tag/2026-08-16/: Meta-Description ist 165 Zeichen lang (erlaubt 160)
 *
 * Zwei Grenzen für dieselbe Zeichenkette, in zwei Dateien:
 *
 *     lib/editions-validate.ts   INTRO_MAX        165
 *     scripts/paket-pruefen.ts   BESCHREIBUNG_MAX 160
 *
 * `app/news/tag/[datum]/page.tsx` setzt `description: edition.intro` **ohne zu
 * kürzen**. Jedes `intro` zwischen 161 und 165 Zeichen war damit erlaubt und
 * brach trotzdem den Bau.
 *
 * **Zwanzig Ausgaben lang fiel das nicht auf**, weil zufällig keine über 160
 * kam – nachgezählt: null von einundzwanzig. Eine Grenze, die nie erreicht
 * wird, ist keine Grenze, sondern eine Wette; hier ist sie am
 * einundzwanzigsten Tag eingelöst worden, und der Preis war die Ausgabe.
 *
 * ## Was sie prüft
 *
 * Nicht die Zahlen selbst – die dürfen sich ändern. Sondern **dass die
 * Obergrenze des `intro` die der Meta-Description nicht überschreitet.** Wer
 * eine der beiden anfasst, bekommt hier Bescheid.
 *
 * ## Warum der Quelltext gelesen wird
 *
 * `scripts/paket-pruefen.ts` exportiert seine Konstante nicht – sie ist eine
 * Zahl in einem Skript, kein Modulvertrag. Sie dafür zu exportieren hieße,
 * die Datei für den Test umzubauen; gelesen wird sie deshalb da, wo sie steht.
 */

import { readFileSync } from 'node:fs'

const VALIDIERUNG = 'lib/editions-validate.ts'
const BAUPRUEFUNG = 'scripts/paket-pruefen.ts'
const ENTWURFSPRUEFUNG = 'scripts/nachrichten-erzeugen.ts'
const SEITE = 'app/news/tag/[datum]/page.tsx'

let failed = 0

function pruefen(was: string, bedingung: boolean, hinweis: string): void {
  if (bedingung) {
    console.log(`OK   ${was}`)
  } else {
    failed++
    console.log(`FEHL ${was}\n     ${hinweis}`)
  }
}

/** Liest eine `const NAME = 123` aus einer Datei. */
function zahl(datei: string, name: string): number {
  const treffer = readFileSync(datei, 'utf8').match(
    new RegExp(`const ${name}\\s*=\\s*(\\d+)`)
  )
  if (!treffer) {
    throw new Error(
      `${name} steht nicht in ${datei}. Umbenannt? Dann gehört diese Prüfung ` +
        'angepasst – nicht gelöscht: Die Kopplung bleibt, auch unter anderem Namen.'
    )
  }
  return Number(treffer[1])
}

const introMax = zahl(VALIDIERUNG, 'INTRO_MAX')
const introMin = zahl(VALIDIERUNG, 'INTRO_MIN')
const beschreibungMax = zahl(BAUPRUEFUNG, 'BESCHREIBUNG_MAX')

console.log(
  `INTRO_MIN ${introMin}, INTRO_MAX ${introMax}, BESCHREIBUNG_MAX ${beschreibungMax}\n`
)

pruefen(
  `Ein erlaubtes intro passt immer in die Meta-Description (${introMax} ≤ ${beschreibungMax})`,
  introMax <= beschreibungMax,
  `INTRO_MAX ist ${introMax}, BESCHREIBUNG_MAX ist ${beschreibungMax}.\n` +
    `     Jedes intro zwischen ${beschreibungMax + 1} und ${introMax} Zeichen wäre erlaubt\n` +
    '     und bräche trotzdem den Bau – genau so ist am 16. August 2026 die\n' +
    '     Ausgabe des Tages ausgefallen.'
)

pruefen(
  'Der Korridor ist nicht leer',
  introMin < introMax,
  `INTRO_MIN ${introMin} liegt nicht unter INTRO_MAX ${introMax}.`
)

/*
  Die dritte Stelle.

  `scripts/nachrichten-erzeugen.ts` spiegelt die Regeln, damit ein untauglicher
  Entwurf auffällt, **bevor** gebaut wird. Steht dort die alte 165, winkt es
  genau den Entwurf durch, an dem der Bau zwanzig Minuten später scheitert –
  die Vorverlegung der Prüfung wäre dann wertlos.
*/
const introMaxEntwurf = zahl(ENTWURFSPRUEFUNG, 'INTRO_MAX')
pruefen(
  `Die Entwurfsprüfung nennt dieselbe Grenze (${introMaxEntwurf})`,
  introMaxEntwurf === introMax,
  `${ENTWURFSPRUEFUNG} sagt ${introMaxEntwurf}, ${VALIDIERUNG} sagt ${introMax}.\n` +
    '     Die Entwurfsprüfung soll den Bruch vorwegnehmen, nicht ihn verpassen.'
)

/*
  Und die Annahme, auf der das Ganze ruht: Die Seite nimmt das `intro`
  unverändert. Kürzte sie, wäre die Kopplung nicht nötig – und diese Prüfung
  wachte über etwas, das es nicht mehr gibt.
*/
const seite = readFileSync(SEITE, 'utf8')
pruefen(
  'Die Tagesseite nimmt das intro unverändert als Description',
  /description:\s*edition\.intro\b/.test(seite),
  `In ${SEITE} steht kein \`description: edition.intro\` mehr.\n` +
    '     Wird gekürzt, ist die Kopplung oben überflüssig; wird etwas anderes\n' +
    '     gesetzt, wacht diese Prüfung über die falsche Stelle. Beides gehört\n' +
    '     angesehen, bevor sie angepasst wird.'
)

console.log(
  failed === 0 ? '\nAlle Prüfungen bestanden.' : `\n${failed} Prüfung(en) fehlgeschlagen.`
)
process.exit(failed === 0 ? 0 : 1)
