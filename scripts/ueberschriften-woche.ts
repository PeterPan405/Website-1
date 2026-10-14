/**
 * Die Überschriften der letzten sieben Erscheinungstage – dieselbe Liste,
 * gegen die der Riegel einen Entwurf prüft.
 *
 *     STICHTAG=2026-10-15 node --experimental-strip-types \
 *       --import ./scripts/alias-hook.mjs scripts/ueberschriften-woche.ts
 *
 * Für den Agenten (`nachrichten-agent.yml`): Er liest sie, bevor er
 * auswählt. Vorher stand dort ein `grep` über `data/news.ts`, der die
 * Zahl der Tage nur ungefähr traf – ein Agent, der gegen eine andere Liste
 * plant als der Riegel prüft, plant für die Zurückweisung.
 */
import { readFileSync } from 'node:fs'
import {
  ueberschriftenLetzteTage,
  WIEDERHOLUNG_TAGE,
} from '../lib/nachrichten-wiederholung.ts'

const stichtag = process.env.STICHTAG || new Date().toISOString().slice(0, 10)
const liste = ueberschriftenLetzteTage(readFileSync('data/news.ts', 'utf8'), stichtag)
console.log(
  `Überschriften der letzten ${WIEDERHOLUNG_TAGE} Erscheinungstage vor ${stichtag}:`
)
for (const { tag, titel } of liste) console.log(`${tag}  ${titel}`)
