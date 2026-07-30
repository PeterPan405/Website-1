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
import { readFileSync, writeFileSync } from 'node:fs'

/**
 * Der Zeitpunkt, zu dem die Kurse zuletzt abgerufen wurden.
 *
 * Er steht auf der Marktseite als deutscher Satz – „Stand 30. Juli 2026 um
 * 13:33 Uhr“. Für einen Menschen ist das die richtige Form, für eine Prüfung
 * von außen die falsche: Niemand soll deutsche Datumsangaben aus HTML klauben
 * müssen, um festzustellen, ob der Abruf noch läuft.
 *
 * Deshalb steht der Zeitstempel hier zusätzlich maschinenlesbar. Der
 * tägliche Prüflauf liest ihn und schlägt an, wenn er zu alt ist – ein still
 * ausgefallener Abruf fällt sonst erst auf, wenn jemand nachsieht. Genau das
 * ist schon passiert.
 */
function datenstand() {
  /*
    Zuerst der Kursstand, erst danach die Historie.

    Seit die Momentaufnahme geteilt ist, tragen beide Dateien ein `fetchedAt` –
    aber nur `kurse-aktuell.json` wird alle dreißig Minuten neu geschrieben.
    `markets.json` wächst einmal je Handelstag, und übers Wochenende gar nicht.
    Wer den Zeitstempel von dort läse, meldete montags um sieben einen
    zweiundsiebzig Stunden alten Abruf – der Prüflauf schlägt ab dreißig Stunden
    an, und die Warnung wäre jedes Wochenende falsch.
  */
  for (const datei of [
    'data/snapshots/kurse-aktuell.json',
    'data/snapshots/markets.json',
  ]) {
    try {
      const roh = readFileSync(datei, 'utf8')
      // Nur den Kopf lesen: Die Historie ist neunzehn Megabyte groß, der
      // Zeitstempel steht im ersten Feld. JSON.parse darüber wäre Verschwendung.
      const treffer = roh.slice(0, 400).match(/"fetchedAt":\s*"([^"]+)"/)
      if (treffer) return treffer[1]
    } catch {
      // Datei fehlt oder ist unlesbar – die nächste versuchen.
    }
  }
  return 'unbekannt'
}

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
  `kurse:   ${datenstand()}`,
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
