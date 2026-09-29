/**
 * Der Selbsttest von `scripts/einrichten.sh` – hier angehängt, damit er läuft.
 *
 * Ausführen mit `npm test`.
 *
 * ## Warum diese Datei nur einen Befehl startet
 *
 * `scripts/einrichten.sh` bringt seine Prüfungen selbst mit, wie
 * `scripts/netz.py` und `scripts/sprechstimme.py` auch. Deren Selbsttests
 * hängen an den Workflows, die sie benutzen – vor dem Sprechen, vor dem
 * Abrufen. Die Einrichtung benutzt kein Workflow: Sie läuft von Hand, auf dem
 * Rechner des Betreibers, ein- oder zweimal überhaupt.
 *
 * Damit wäre der Selbsttest genau das, wovor `AGENTS.md` warnt – eine
 * Absicherung, die nie anschlägt und deshalb aussieht wie Ruhe. Wer in einem
 * halben Jahr die Formprüfung umbaut, bekäme es erst in dem Augenblick zu
 * spüren, in dem er einen Schlüssel in der Hand hält und es eilig hat.
 *
 * Deshalb hier. Der Selbsttest braucht kein Netz, kein `gh` und keine
 * Zugangsdaten und ist in einer Fünftelsekunde durch.
 *
 * ## Was er prüft
 *
 * Die Entscheidungen, die das Skript selbst trifft: dass die Formprüfung
 * abweist, was sie abweisen muss (leere Eingabe, mitkopiertes Leerzeichen,
 * ID und Secret verwechselt), dass sie ein gültiges Paar durchlässt, dass
 * Spotifys drei Antwortformen richtig gedeutet werden – und dass keine
 * Meldung den Antworttext weitergibt, in dem stehen kann, was gesendet wurde.
 *
 * Jede dieser Prüfungen ist einmal gegen ein absichtlich beschädigtes Skript
 * gehalten worden und hat angeschlagen; die Fälle stehen im Pull Request vom
 * 10. September 2026.
 */

import { spawnSync } from 'node:child_process'
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
const lauf = spawnSync('bash', ['scripts/einrichten.sh', '--selbsttest'], {
  cwd: wurzel,
  encoding: 'utf8',
})

const ausgabe = `${lauf.stdout ?? ''}${lauf.stderr ?? ''}`

pruefen(
  'der Selbsttest der Einrichtung läuft durch',
  lauf.status === 0,
  ausgabe.trim() || `Rückgabewert ${lauf.status}`
)

/*
  Und er muss auch wirklich etwas geprüft haben.

  Ein Skript, dessen Selbsttest zu einem `exit 0` verkümmert, bestünde die
  Prüfung darüber ebenfalls – dieselbe Falle, gegen die diese Datei
  angeschrieben ist, eine Ebene höher.
*/
const bestanden = (ausgabe.match(/^ *OK /gm) ?? []).length
pruefen(
  `er hat dabei etwas geprüft (${bestanden} Einzelprüfungen)`,
  bestanden >= 10,
  `nur ${bestanden} – ist der Selbsttest ausgehöhlt worden?`
)

console.log(
  failed === 0 ? '\nAlle Prüfungen bestanden.' : `\n${failed} Prüfung(en) fehlgeschlagen.`
)
process.exit(failed === 0 ? 0 : 1)
