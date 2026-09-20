/**
 * Nirgends darf stehen, ein Mensch prüfe jeden Inhalt vor der Veröffentlichung.
 *
 * ## Warum es diese Prüfung gibt
 *
 * Weil derselbe Satz dreimal aufgefallen ist und zweimal nur dort berichtigt
 * wurde, wo er aufgefallen war:
 *
 *     06.08.2026  KI-Hinweis unter jeder Folge:  „werden vor der
 *                 Veröffentlichung von einem Menschen inhaltlich geprüft"
 *     17.08.2026  beides gestrichen – Kanalbeschreibung und Folgenhinweis.
 *                 Begründung im Code: „Die Kette veröffentlicht ohne Halt;
 *                 die Zusage traf nicht zu."
 *     20.09.2026  derselbe Satz steht weiter im **Impressum**.
 *
 * Es wurde die Stelle berichtigt, nicht die Aussage. Ausgerechnet im
 * Impressum wiegt sie am schwersten: An ihr hängt die Ausnahme von der
 * Kennzeichnungspflicht in Art. 50 Abs. 4 der KI-Verordnung.
 *
 * Die Tagesausgabe geht gegen 3 Uhr hinaus, die Folge gegen 4, und an keiner
 * Stelle dazwischen wartet etwas auf einen Menschen. Solange das so ist, darf
 * es nirgends anders stehen.
 *
 * ## Was geprüft wird und was nicht
 *
 * Ob eine Zusage stimmt, kann diese Datei nicht wissen. Sie kann diese eine
 * Zusage verbieten, von der feststeht, dass sie nicht zutrifft – an **allen**
 * Stellen auf einmal, statt eine nach der anderen.
 *
 * Kommentare zählen nicht mit. In ihnen steht der alte Satz mit Absicht, samt
 * Begründung, warum er weg ist; eine Prüfung, die das beanstandet, bringt
 * jemanden dazu, die Begründung zu löschen.
 *
 * `FRUEHERE_HINWEISE` in `lib/podcast-hinweis.ts` ist aus demselben Grund
 * ausgenommen: Die Liste **muss** die alten Fassungen enthalten, sonst
 * erkennt `angeglichen()` sie nicht mehr und setzt einen zweiten Hinweis
 * daneben.
 */

import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { KI_HINWEIS, KI_HINWEIS_GESPROCHEN } from '@/lib/sprechfassung'
import { FRUEHERE_HINWEISE } from '@/lib/podcast-hinweis'

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

/**
 * Die Zusage, um die es geht – „ein Mensch prüft/gibt frei", in einem Satz.
 *
 * Bewusst weit gefasst: Es geht nicht um eine Formulierung, sondern um die
 * Aussage. Wer sie umschreibt, umgeht die Prüfung sonst versehentlich.
 *
 * **Und bewusst stumpf: Sie erkennt keine Verneinung.** Der erste Entwurf des
 * berichtigten Abschnitts hiess „… ohne dass jede einzelne Meldung vorab von
 * einem Menschen freigegeben wird" – inhaltlich das Gegenteil, und die
 * Prüfung schlug trotzdem an. Der Text ist umgeschrieben worden, nicht die
 * Prüfung.
 *
 * Das ist die richtige Richtung. Eine Regel, die deutsche Verneinung zu lesen
 * versucht, wird an der nächsten Formulierung still danebenliegen, und still
 * danebenliegen heisst hier: Die Zusage steht wieder da. Ein Fehlalarm kostet
 * eine Umformulierung, ein übersehener Treffer steht im Impressum.
 */
const ZUSAGE = /von einem Menschen[^.]{0,80}?(geprüft|freigegeben|durchgesehen)/i

/** Kommentare heraus – dort steht der alte Satz mit Absicht. */
function ohneKommentare(quelle: string): string {
  return quelle
    .replaceAll(/\{\s*\/\*[\s\S]*?\*\/\s*\}/g, ' ') // {/* … */} in JSX
    .replaceAll(/\/\*[\s\S]*?\*\//g, ' ') // /* … */
    .replaceAll(/^\s*\/\/.*$/gm, ' ') // // …
}

const DATEIEN = [
  'app/impressum/page.tsx',
  'app/datenschutz/page.tsx',
  'scripts/podcast-feed-schreiben.ts',
  'lib/rechtshinweis.ts',
  'lib/sprechfassung.ts',
]

for (const pfad of DATEIEN) {
  const text = ohneKommentare(readFileSync(join(wurzel, pfad), 'utf8'))
  const treffer = ZUSAGE.exec(text)
  pruefen(
    `${pfad}: keine Zusage einer Prüfung durch einen Menschen`,
    treffer === null,
    treffer
      ? `„${treffer[0]}" steht dort. Die Kette veröffentlicht ohne Halt – ` +
          `Tagesausgabe gegen 3 Uhr, Folge gegen 4.`
      : ''
  )
}

/*
  `lib/podcast-hinweis.ts` steht nicht in der Liste, weil `FRUEHERE_HINWEISE`
  die alten Fassungen enthalten **muss**. Geprüft wird dort stattdessen, dass
  die alte Fassung wirklich nur noch in der Geschichte steht.
*/
pruefen(
  'der gültige KI-Hinweis verspricht keine Prüfung durch einen Menschen',
  !ZUSAGE.test(KI_HINWEIS) && !ZUSAGE.test(KI_HINWEIS_GESPROCHEN),
  `„${KI_HINWEIS}"`
)
pruefen(
  'er nennt stattdessen, dass es automatisiert geschieht',
  /automatisiert/i.test(KI_HINWEIS) && /automatisiert/i.test(KI_HINWEIS_GESPROCHEN)
)

/*
  Die Gegenprobe. Ohne sie wäre oben nur bewiesen, dass die Prüfung nichts
  findet – nicht, dass sie etwas finden **kann**. Vorgelegt wird der Satz, wie
  er bis heute im Impressum stand, und die Fassung, die am 17. August aus dem
  Folgenhinweis fiel. Beide müssen beanstandet werden.
*/
const ALT = [
  'Jeder Inhalt wird vor der Veröffentlichung von einem Menschen inhaltlich ' +
    'geprüft und freigegeben; die redaktionelle Verantwortung trägt …',
  FRUEHERE_HINWEISE[0],
]

for (const [i, satz] of ALT.entries()) {
  pruefen(
    `die alte Fassung ${i + 1} würde beanstandet`,
    ZUSAGE.test(satz),
    'Wenn das hier durchgeht, prüft diese Datei nichts.'
  )
}

if (failed) {
  console.log(`\n${failed} Prüfung(en) fehlgeschlagen.`)
  process.exit(1)
}
console.log('\nAlle Prüfungen bestanden.')
