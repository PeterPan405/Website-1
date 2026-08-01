import { spawnSync } from 'node:child_process'
import { readdirSync } from 'node:fs'
import { join } from 'node:path'

/**
 * Findet und startet alle Tests – statt einer Liste, die jemand pflegen muss.
 *
 * ## Warum es dieses Skript gibt
 *
 * Der `test`-Eintrag in der package.json war eine Kette aus einundsechzig
 * `&&`-Gliedern, eines je Testdatei. Jede neue Datei musste dort von Hand
 * eingetragen werden – und am 1. August 2026 wäre genau das beinahe
 * unterblieben: Der Test zur Kalenderzeit existierte, lief lokal, und hätte
 * ohne den Eintrag in CI nie wieder jemanden gestört. Ein Test, der nicht
 * läuft, ist schlimmer als keiner, weil er nach Absicherung aussieht.
 *
 * Jetzt gilt: Was in `tests/` liegt und auf `.test.ts` endet, läuft. Eine
 * Datei anlegen genügt; vergessen geht nicht mehr.
 *
 * ## Warum nacheinander und nicht parallel
 *
 * Die Tests schreiben ihre Ergebnisse zeilenweise nach stdout, und einige
 * laden denselben Datenbestand. Parallel liefen sie ein paar Sekunden
 * schneller und schrieben ihre Ausgaben ineinander – bei einem Fehlschlag
 * zählt aber genau die Lesbarkeit der letzten Zeilen. Die gesamte Laufzeit
 * liegt ohnehin unter einer Minute.
 */

const ordner = join(import.meta.dirname, '..', 'tests')

const dateien = readdirSync(ordner)
  .filter((name) => name.endsWith('.test.ts'))
  .sort()

if (dateien.length === 0) {
  console.error('Keine Tests unter tests/ gefunden – das kann nicht stimmen.')
  process.exit(1)
}

const gescheitert = []

for (const datei of dateien) {
  const ergebnis = spawnSync(
    process.execPath,
    [
      '--experimental-strip-types',
      '--disable-warning=MODULE_TYPELESS_PACKAGE_JSON',
      join(ordner, datei),
    ],
    { stdio: 'inherit' }
  )
  if (ergebnis.status !== 0) gescheitert.push(datei)
}

console.log(
  `\n${dateien.length - gescheitert.length} von ${dateien.length} Testdateien bestanden.`
)

if (gescheitert.length > 0) {
  console.error('Gescheitert:')
  for (const datei of gescheitert) console.error(`  tests/${datei}`)
  process.exit(1)
}
