/**
 * Zeigt, was seit dem jüngsten Eintrag im Änderungsprotokoll passiert ist.
 *
 * Aufruf: `npm run aenderungen`
 *
 * ## Der Lauf schlägt vor, er schreibt nicht
 *
 * Ein Commit-Titel ist für Entwickler geschrieben. „Wortgrenzen gekoppelt,
 * elf Warnungen aufgelöst" beantwortet keine Frage, die ein Besucher hat.
 * Eine automatische Übersetzung in Lesersprache gäbe es nur um den Preis,
 * Bedeutung zu erfinden, wo im Titel keine steht.
 *
 * Was dieser Lauf verhindert, ist das andere Versagen: **dass etwas
 * untergeht.** Er listet auf, was seit dem letzten Eintrag gemergt wurde;
 * geschrieben wird `data/aenderungen.ts` von Hand.
 *
 * ## Warum die tägliche Mechanik herausfällt
 *
 * Kurse, Nachrichtenstände und Podcastfolgen erscheinen mehrmals täglich als
 * Commit. Sie stehen in keinem Änderungsprotokoll – sie **sind** der normale
 * Betrieb, und eine Liste, in der sie vorkommen, verdeckt das, worum es geht.
 *
 * Die Filterliste ist bewusst großzügig: Lieber ein Vorschlag zu viel, den
 * jemand verwirft, als ein übersehener. Ein Vorschlag kostet eine Zeile
 * Aufmerksamkeit, ein übersehener eine falsche Behauptung auf einer Seite,
 * die Vollständigkeit verspricht.
 */

import { execSync } from 'node:child_process'

import { AENDERUNGEN } from '../data/aenderungen.ts'

/** Was der normale Betrieb ist und deshalb nicht ins Protokoll gehört. */
const BETRIEB =
  /^(Kurse|Podcast: Stand|Podcast: Folge|Nachrichten: Stand|Marktbreite|Fundamentaldaten|Quartalstermine|Zinsen|Laender|Länder|Ticker|Quellen: Stand)/i

const juengster = AENDERUNGEN[0]?.datum
if (!juengster) {
  console.error('::error::[aenderungen] data/aenderungen.ts ist leer.')
  process.exit(1)
}

/*
  `--no-merges` und ab dem Tag **nach** dem jüngsten Eintrag.

  `--since` ist inklusiv: Ohne den Tagesversatz käme alles noch einmal, was
  am selben Tag schon eingetragen wurde – und eine Liste, die jedes Mal
  dasselbe vorschlägt, wird nach zwei Läufen nicht mehr gelesen.
*/
const ab = new Date(`${juengster}T00:00:00Z`)
ab.setUTCDate(ab.getUTCDate() + 1)
const abTag = ab.toISOString().slice(0, 10)

let zeilen: string[] = []
try {
  zeilen = execSync(
    `git log --since="${abTag}" --no-merges --date=short --pretty="%ad %s"`,
    { encoding: 'utf8' }
  )
    .split('\n')
    .filter(Boolean)
} catch (fehler) {
  console.error(`::error::[aenderungen] git log fehlgeschlagen: ${String(fehler)}`)
  process.exit(1)
}

/*
  Eine flache Historie fällt auf, statt still weniger zu melden.

  `paket-bauen.yml` klont mit `fetch-depth: 50`. Wer diesen Lauf dort
  einhängt, bekäme eine Liste, die nach fünfzig Commits aufhört – ohne
  Meldung. Bei rund zehn Commits am Tag sind das fünf Tage.
*/
const flach = execSync('git rev-parse --is-shallow-repository', {
  encoding: 'utf8',
}).trim()
if (flach === 'true') {
  console.log(
    '[aenderungen] ACHTUNG: flacher Klon. Die Liste unten ist womöglich\n' +
      '              unvollständig. Voller Verlauf: git fetch --unshallow'
  )
}

const vorschlaege = zeilen.filter((z) => !BETRIEB.test(z.slice(11)))

console.log(`[aenderungen] Jüngster Eintrag: ${juengster} (${AENDERUNGEN.length} gesamt)`)
console.log(
  `[aenderungen] Commits seit ${abTag}: ${zeilen.length}, davon Betrieb: ${zeilen.length - vorschlaege.length}\n`
)

if (vorschlaege.length === 0) {
  console.log('Nichts Neues – das Protokoll ist auf dem Stand.')
  process.exit(0)
}

console.log('Ohne Eintrag im Änderungsprotokoll:\n')
for (const zeile of vorschlaege) console.log(`  ${zeile}`)
console.log(
  '\nWas ein Besucher davon merkt, gehört nach data/aenderungen.ts – in seiner\n' +
    'Sprache, nicht in der des Commits. Was nur unter der Haube liegt, nicht.'
)
