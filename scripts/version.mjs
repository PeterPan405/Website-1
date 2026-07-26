/**
 * Schreibt `out/version.txt` mit Commit und Bauzeitpunkt.
 *
 * Läuft als `postbuild`, also nach jedem `npm run build` – unabhängig davon,
 * wer baut. Das ist der Punkt: Die Website wird sowohl vom GitHub-Workflow als
 * auch von der Build-Anbindung des Hosters gebaut. Stünde die Datei nur im
 * Workflow, fehlte sie ausgerechnet bei den Builds, die tatsächlich online
 * gehen.
 *
 * Anlass: Tagelang lag eine Fassung auf dem Server, die aus den ersten
 * 25 Minuten des Projekts stammte. Aufgefallen ist es allein daran, dass die
 * Seite noch den alten Markennamen trug. Welcher Stand ausgeliefert wird, darf
 * keine Detektivarbeit sein – ein Aufruf von /version.txt beantwortet es.
 */

import { execFileSync } from 'node:child_process'
import { writeFileSync } from 'node:fs'

/**
 * Ermittelt den Commit.
 *
 * Zuerst aus der Umgebung: CI-Systeme legen ihn dort ab, und im Build-Container
 * des Hosters ist oft nur ein flacher Klon ohne Git-Verzeichnis vorhanden. Erst
 * danach `git` fragen, und schlägt auch das fehl, lieber „unbekannt" schreiben
 * als den Build wegen einer Diagnosedatei abzubrechen.
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
writeFileSync('out/version.txt', inhalt)
process.stdout.write(inhalt)
