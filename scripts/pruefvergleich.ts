/**
 * Vorbefund gegen Nachbefund halten – und sagen, ob die Ausgabe hinausdarf.
 *
 * Aufruf, im Nachrichtenlauf:
 *
 *     node --experimental-strip-types --import ./scripts/alias-hook.mjs \
 *       scripts/pruefvergleich.ts <vorher> <nachher>
 *
 * Beide Argumente sind Verzeichnisse, die `scripts/pruefkette.sh` gefüllt
 * hat. Das Urteil fällt `vergleiche()` in `lib/pruefvergleich.ts`; dieses
 * Skript liest die Dateien, ruft sie auf und schreibt das Ergebnis dorthin,
 * wo der Workflow es braucht:
 *
 * - ins Protokoll, mit `::error::` für neue und `::warning::` für
 *   vorbestehende Befunde,
 * - in die Zusammenfassung des Laufs (`GITHUB_STEP_SUMMARY`),
 * - als Schrittausgaben `veroeffentlichen=ja|nein` und `vorbestehend=ja|nein`
 *   (`GITHUB_OUTPUT`).
 *
 * Der Rückgabewert ist 1 genau dann, wenn die Ausgabe **nicht** veröffentlicht
 * werden darf. Vorbestehende Befunde allein machen ihn nicht rot – das tut
 * der Workflow selbst, als letzten Schritt, **nach** dem Veröffentlichen.
 */

import { appendFileSync, existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'

import { vergleiche, type Befund, type Pruefstand } from '@/lib/pruefvergleich'

/** Die Prüfungen, die `pruefkette.sh` ausführt – in ihrer Reihenfolge. */
export const PRUEFUNGEN = ['tsc', 'lint', 'test', 'build', 'pruefen', 'format'] as const

/**
 * Ein Verzeichnis der Prüfkette einlesen.
 *
 * Fehlt die Statusdatei einer Prüfung, gilt sie als **nicht gelaufen** und
 * wird nicht aufgenommen – im Vorbefund heißt das „kein Vorbefund", und
 * `vergleiche()` wertet dann jeden Befund danach als neu. Im Nachbefund
 * heißt es „rot ohne Einzelbefund": Eine Prüfung, die nicht einmal gelaufen
 * ist, hat nicht bestanden.
 */
export function pruefstandLesen(verzeichnis: string, nachbefund: boolean): Pruefstand {
  const stand: Pruefstand = {}
  for (const name of PRUEFUNGEN) {
    const statusDatei = join(verzeichnis, `${name}.status`)
    if (!existsSync(statusDatei)) {
      if (nachbefund) stand[name] = { ok: false, befunde: [] }
      continue
    }
    const ok = readFileSync(statusDatei, 'utf8').trim() === '0'
    const befundDatei = join(verzeichnis, `${name}.befunde`)
    const befunde = existsSync(befundDatei)
      ? readFileSync(befundDatei, 'utf8')
          .split('\n')
          .map((z) => z.trim())
          .filter(Boolean)
      : []
    stand[name] = { ok, befunde }
  }
  return stand
}

function liste(befunde: Befund[]): string {
  return befunde.map((b) => `- \`${b.pruefung}\`: ${b.text}`).join('\n')
}

function kommandozeile(): void {
  const [vorherDir, nachherDir] = process.argv.slice(2)
  if (!vorherDir || !nachherDir) {
    console.error('Aufruf: pruefvergleich.ts <Verzeichnis vorher> <Verzeichnis nachher>')
    process.exit(2)
  }

  const vorher = pruefstandLesen(vorherDir, false)
  const nachher = pruefstandLesen(nachherDir, true)
  const urteil = vergleiche(vorher, nachher)

  console.log('Vorbefund:')
  for (const name of PRUEFUNGEN) {
    const v = vorher[name]
    console.log(
      `  ${name.padEnd(8)} ${v ? (v.ok ? 'grün' : `ROT (${v.befunde.length} Befunde)`) : 'nicht gelaufen'}`
    )
  }
  console.log('Nachbefund:')
  for (const name of PRUEFUNGEN) {
    const n = nachher[name]
    console.log(
      `  ${name.padEnd(8)} ${n.ok ? 'grün' : `ROT (${n.befunde.length} Befunde)`}`
    )
  }
  console.log('')

  for (const b of urteil.neu)
    console.log(`::error::Neu mit der Ausgabe – ${b.pruefung}: ${b.text}`)
  for (const b of urteil.vorbestehend) {
    console.log(`::warning::Schon vorher rot – ${b.pruefung}: ${b.text}`)
  }
  console.log('')
  console.log(
    `Urteil: ${urteil.veroeffentlichen ? 'VERÖFFENTLICHEN' : 'NICHT veröffentlichen'} – ${urteil.grund}`
  )

  const zusammenfassung = [
    `### Prüfung: ${urteil.veroeffentlichen ? 'die Ausgabe darf hinaus' : 'die Ausgabe bleibt liegen'}`,
    '',
    urteil.grund,
    '',
    urteil.neu.length > 0
      ? `**Neu mit der Ausgabe (${urteil.neu.length}):**\n\n${liste(urteil.neu)}\n`
      : '',
    urteil.vorbestehend.length > 0
      ? `**Schon vor der Ausgabe rot (${urteil.vorbestehend.length}) – das ist nicht ihre Schuld, aber es ist offen:**\n\n${liste(urteil.vorbestehend)}\n`
      : '',
  ]
    .filter((z) => z !== '')
    .join('\n')

  if (process.env.GITHUB_STEP_SUMMARY) {
    appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${zusammenfassung}\n`)
  }
  if (process.env.GITHUB_OUTPUT) {
    appendFileSync(
      process.env.GITHUB_OUTPUT,
      `veroeffentlichen=${urteil.veroeffentlichen ? 'ja' : 'nein'}\n` +
        `vorbestehend=${urteil.vorbestehend.length > 0 ? 'ja' : 'nein'}\n`
    )
  }

  process.exit(urteil.veroeffentlichen ? 0 : 1)
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  kommandozeile()
}
