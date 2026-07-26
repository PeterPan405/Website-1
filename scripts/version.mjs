/**
 * Schreibt `public/version.txt` mit Commit und Bauzeitpunkt.
 *
 * Läuft als `prebuild`, also **vor** `next build`. Next kopiert alles aus
 * `public/` in das Ergebnis, egal ob als statischer Export nach `out/` oder als
 * Server-Anwendung. Damit ist die Datei anschließend unter `/version.txt`
 * abrufbar, ohne dass dieses Skript wissen muss, wohin gebaut wird.
 *
 * Vorher lief es als `postbuild` und schrieb direkt nach `out/`. Das ist beim
 * Hoster gescheitert: Dessen Build erzeugte kein `out/`, das Schreiben brach mit
 * ENOENT ab, und damit die gesamte Bereitstellung. Eine Diagnosedatei darf
 * niemals der Grund sein, warum eine Website nicht online geht – deshalb jetzt
 * vorher, in ein Verzeichnis, das sicher existiert, und zusätzlich abgesichert.
 *
 * Anlass für die Datei: Tagelang lag eine Fassung auf dem Server, die aus den
 * ersten 25 Minuten des Projekts stammte. Aufgefallen ist es allein daran, dass
 * die Seite noch den alten Markennamen trug. Welcher Stand ausgeliefert wird,
 * darf keine Detektivarbeit sein.
 */

import { execFileSync } from 'node:child_process'
import { writeFileSync } from 'node:fs'

/**
 * Ermittelt den Commit.
 *
 * Zuerst aus der Umgebung: CI-Systeme legen ihn dort ab, und im Build-Container
 * des Hosters ist oft nur ein flacher Klon ohne Git-Verzeichnis vorhanden. Erst
 * danach `git` fragen, und schlägt auch das fehl, lieber „unbekannt" schreiben.
 */
function commit() {
  const ausUmgebung =
    process.env.GITHUB_SHA ??
    process.env.CI_COMMIT_SHA ??
    process.env.VERCEL_GIT_COMMIT_SHA

  if (ausUmgebung) return ausUmgebung

  try {
    return execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim()
  } catch {
    return 'unbekannt'
  }
}

const zeilen = [
  `commit:  ${commit()}`,
  `gebaut:  ${new Date().toISOString().replace('T', ' ').slice(0, 19)} UTC`,
]

if (process.env.GITHUB_RUN_NUMBER) {
  zeilen.push(`lauf:    ${process.env.GITHUB_RUN_NUMBER}`)
}

const inhalt = zeilen.join('\n') + '\n'

/*
  Der Schreibvorgang selbst ist abgesichert. `public/` gehört zum Repository und
  ist immer vorhanden – aber genau diese Annahme hat schon einmal eine
  Bereitstellung gekostet. Schlägt es fehl, gibt es eine Warnung und der Build
  läuft weiter.
*/
try {
  writeFileSync('public/version.txt', inhalt)
  process.stdout.write(inhalt)
} catch (fehler) {
  process.stdout.write(
    `Warnung: version.txt konnte nicht geschrieben werden (${fehler.code}).\n`
  )
  process.stdout.write('Der Build läuft weiter – die Datei ist nur zur Diagnose da.\n')
}
