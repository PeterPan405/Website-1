/**
 * Holt die Wirtschaftstermine der Woche von ForexFactory und mischt sie in
 * `data/snapshots/forexfactory.json`.
 *
 * Gestartet von `.github/workflows/konjunkturkalender.yml`. Was mit den Daten
 * geschieht, steht in `lib/konjunkturkalender.ts`.
 *
 * **Geprüft wird der Inhalt, nicht der Statuscode.** Eine Drosselung kommt
 * je nach Laune des Servers als 429 oder als Seite mit 200 – beides darf
 * nicht als leere Woche in der Momentaufnahme landen.
 *
 *   nicht erreichbar, 429, 5xx   → Warnung, die alte Momentaufnahme bleibt;
 *                                  der nächste Lauf holt nach
 *   Antwort da, aber kein Kalender → roter Lauf: Dann hat sich die Quelle
 *                                  geändert, und das muss jemand ansehen
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs'

import {
  konjunkturtermine,
  mischeFeed,
  pruefeFeed,
  serialisiereFf,
  type FfEreignis,
  type FfMomentaufnahme,
} from '../lib/konjunkturkalender.ts'

const ADRESSE = 'https://nfs.faireconomy.media/ff_calendar_thisweek.json'
const DATEI = 'data/snapshots/forexfactory.json'

let antwort: Response
try {
  antwort = await fetch(ADRESSE, {
    headers: { 'User-Agent': 'iminvests.de Kalender (einmal am Tag)' },
    signal: AbortSignal.timeout(30_000),
  })
} catch (fehler) {
  console.log(`::warning::ForexFactory nicht erreichbar – ${(fehler as Error).message}`)
  process.exit(0)
}
if (antwort.status === 429 || antwort.status >= 500) {
  console.log(`::warning::ForexFactory antwortet mit ${antwort.status} – nächster Lauf.`)
  process.exit(0)
}
const roh = await antwort.text()
let daten: unknown
try {
  daten = JSON.parse(roh)
} catch {
  console.log(
    `::error::ForexFactory antwortet (${antwort.status}), aber nicht mit JSON: ${roh.slice(0, 200)}`
  )
  process.exit(1)
}
const fehler = pruefeFeed(daten)
if (fehler.length) {
  console.log(`::error::Die Antwort ist kein Wochenkalender:\n  ${fehler.join('\n  ')}`)
  process.exit(1)
}

const alt: FfMomentaufnahme | null = existsSync(DATEI)
  ? JSON.parse(readFileSync(DATEI, 'utf8'))
  : null
const neu = mischeFeed(alt, daten as FfEreignis[], new Date())
/*
  Nur schreiben, wenn sich an den Terminen etwas geändert hat. Sonst
  entstünde zweimal am Tag ein Commit, der nur den Zeitstempel verschiebt –
  der erste Lauf am 16.10.2026 tat genau das.
*/
const gleich =
  alt !== null && JSON.stringify(alt.ereignisse) === JSON.stringify(neu.ereignisse)
if (gleich)
  console.log('Keine neuen oder geänderten Termine – die Datei bleibt, wie sie ist.')
else writeFileSync(DATEI, serialisiereFf(neu))

const { termine, ohneEinordnung } = konjunkturtermine(neu.ereignisse)
console.log(
  `${(daten as unknown[]).length} Einträge geholt, ${neu.ereignisse.length} in der Momentaufnahme, ${termine.length} Kalendertermine daraus.`
)
for (const t of termine.slice(-12))
  console.log(`  ${t.datum} ${t.uhrzeit ?? ''} ${t.titel}`)
if (ohneEinordnung.length) {
  console.log('Hoch oder mittel eingestuft, aber ohne Einordnung (nicht im Kalender):')
  for (const z of ohneEinordnung) console.log(`  ${z}`)
}
