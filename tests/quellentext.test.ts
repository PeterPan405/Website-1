/**
 * Die Aufbereitung der Quellendatei behält die Links.
 *
 * Ausführen mit `npm test`. Die Prüfung selbst steht in Python, im
 * Selbsttest von `scripts/quellentext.py` – dieselbe, die
 * `quellen-sammeln.yml` vor jedem Abruf fährt. Hier läuft sie zusätzlich,
 * damit eine Änderung schon im Pull Request auffällt und nicht erst nachts.
 *
 * Ohne `python3` ist der Test rot, nicht übersprungen: Ein übersprungener
 * Test sieht aus wie ein bestandener.
 */
import { spawnSync } from 'node:child_process'

const ergebnis = spawnSync('python3', ['-I', 'scripts/quellentext.py', '--selbsttest'], {
  encoding: 'utf8',
})
if (ergebnis.error) {
  console.log(`FEHL python3 ließ sich nicht starten: ${ergebnis.error.message}`)
  process.exit(1)
}
process.stdout.write(ergebnis.stdout)
if (ergebnis.stderr) process.stderr.write(ergebnis.stderr)
process.exit(ergebnis.status ?? 1)
