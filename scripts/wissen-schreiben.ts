/**
 * Schreibt das Projektgedächtnis als Obsidian-Notizen nach `wissen/`.
 *
 * Aufruf:  npm run wissen               – vergleichen, nichts anfassen
 *          ANWENDEN=1 npm run wissen    – schreiben
 *
 * ## Warum der Vergleich der Regelfall ist und das Schreiben die Ausnahme
 *
 * Dieselbe Bauart wie `npm run zahlen`, und aus demselben Grund: Ein Abbild,
 * das niemand nachzieht, wird stillschweigend falsch. Der Vergleich läuft
 * deshalb in `tests/wissen.test.ts` mit – wer `ENTSCHEIDUNGEN.md` oder
 * `AGENTS.md` ändert und den Ordner stehen lässt, bekommt einen roten Lauf
 * statt eines Vaults, der eine Woche alte Regeln zeigt.
 *
 * ## Was dieses Skript nicht tut
 *
 * Es fasst den Vault nicht an. Es kann ihn nicht einmal sehen: Diese Umgebung
 * erreicht nur GitHub, und Obsidian läuft auf dem Rechner des Betreibers. Der
 * Weg dorthin ist `werkzeuge/wissen-in-vault.ps1`, ausgeführt von der lokalen
 * Sitzung.
 */

import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import { join } from 'node:path'

import {
  alleNotizen,
  unaufloesbareVerweise,
  zerlegeEntscheidungen,
} from '../lib/wissen.ts'

const ORDNER = 'wissen'
const ANWENDEN = process.env.ANWENDEN === '1'

const entscheidungen = readFileSync('ENTSCHEIDUNGEN.md', 'utf8')
const agents = readFileSync('AGENTS.md', 'utf8')

/*
  Zuerst die Verweise, und zwar **vor** dem Schreiben.

  Ein Verweis in `AGENTS.md`, zu dem es keine Überschrift mehr gibt, ist im
  Repository nur ein toter Satz – im Vault wäre er ein Link, der auf eine
  Notiz zeigt, die es nicht gibt, und Obsidian legt sie beim Klicken leer an.
  Aus einem übersehenen Verweis würde so eine erfundene Notiz.
*/
const abschnitte = zerlegeEntscheidungen(entscheidungen)
const tot = unaufloesbareVerweise(agents, abschnitte)
if (tot.length > 0) {
  console.error(
    `::error::[wissen] ${tot.length} Verweis(e) in AGENTS.md zeigen ins Leere:`
  )
  for (const v of tot) console.error(`  – „${v.replace(/\s+/g, ' ')}"`)
  console.error('  Entweder die Überschrift in ENTSCHEIDUNGEN.md ist umbenannt worden,')
  console.error(
    '  oder der Verweis meint etwas, das es nicht gibt. Beides gehört behoben.'
  )
  process.exit(1)
}

const soll = alleNotizen(entscheidungen, agents)
const ist = new Map<string, string>()
if (existsSync(ORDNER)) {
  for (const name of readdirSync(ORDNER)) {
    if (name.endsWith('.md')) ist.set(name, readFileSync(join(ORDNER, name), 'utf8'))
  }
}

const neu = [...soll.keys()].filter((n) => !ist.has(n))
const geaendert = [...soll.keys()].filter((n) => ist.has(n) && ist.get(n) !== soll.get(n))

/*
  Übrig heißt nicht „darf weg".

  Gelöscht wird nur, was dieses Skript selbst geschrieben hat – erkennbar am
  `quelle:`-Feld im Kopf. Eine Datei ohne diesen Kopf hat jemand von Hand
  abgelegt, und Bestand zu löschen, den man nicht angelegt hat, ist genau das,
  was `AGENTS.md` ausnimmt.
*/
const uebrig = [...ist.keys()].filter((n) => !soll.has(n))
const eigene = uebrig.filter((n) => /^---\n(.*\n)*?quelle: /m.test(ist.get(n) ?? ''))
const fremde = uebrig.filter((n) => !eigene.includes(n))

console.log(`[wissen] ${soll.size} Notizen aus ${abschnitte.length} Abschnitten.`)
for (const n of neu) console.log(`  neu        ${n}`)
for (const n of geaendert) console.log(`  geändert   ${n}`)
for (const n of eigene) console.log(`  entfällt   ${n}`)
for (const n of fremde) console.log(`  fremd      ${n} – bleibt liegen, nicht von hier`)

if (neu.length + geaendert.length + eigene.length === 0) {
  console.log('[wissen] Der Ordner ist auf Stand.')
  process.exit(0)
}

if (!ANWENDEN) {
  console.error(
    `::error::[wissen] Der Ordner ${ORDNER}/ ist nicht auf Stand ` +
      `(${neu.length} neu, ${geaendert.length} geändert, ${eigene.length} entfallen).`
  )
  console.error('  Nachziehen mit: ANWENDEN=1 npm run wissen')
  process.exit(1)
}

mkdirSync(ORDNER, { recursive: true })
for (const [name, inhalt] of soll) writeFileSync(join(ORDNER, name), inhalt)
for (const name of eigene) rmSync(join(ORDNER, name))
console.log(`[wissen] Geschrieben: ${soll.size} Notizen, ${eigene.length} entfernt.`)
