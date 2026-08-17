/**
 * Zieht den KI-Hinweis im **eigenen** Folgenregister nach.
 *
 * Aufruf:  npm run register-hinweis        – zeigt, was sich ändern würde
 *          ANWENDEN=1 npm run register-hinweis
 *
 * ## Warum das ein zweiter Lauf ist
 *
 * Es gibt zwei Orte, an denen die Beschreibung einer veröffentlichten Folge
 * liegt, und sie gehören verschiedenen Leuten:
 *
 *     data/podcast-eigener-feed.json   uns – speist den RSS-Feed
 *     YouTube                          Google – `npm run hinweis`
 *
 * Dieses Skript fasst nur das Erste an. Das Zweite braucht Zugangsdaten,
 * schreibt auf einen fremden Dienst und bleibt deshalb ein eigener Lauf mit
 * eigenem Trockenlauf.
 *
 * ## Warum das Register überhaupt nachgezogen wird
 *
 * Weil der Feed daraus entsteht. Ein Hörer in einer Podcast-App liest, was
 * dort steht – und dort stand bis zum 17. August 2026 die Zusage, jede Folge
 * werde vor der Veröffentlichung von einem Menschen geprüft. Sie trifft nicht
 * zu. Eine falsche Angabe in einer alten Folge wird nicht dadurch richtig,
 * dass die neuen es besser machen.
 *
 * Die Aufnahmen selbst bleiben, wie sie sind: In den acht Folgen vom 10. bis
 * 17. August ist der Hinweis nicht gesprochen, und das lässt sich ohne
 * Neuvertonung nicht ändern. Die Beschreibung ist der Weg, der offensteht.
 *
 * ## Die Kennung bleibt unangetastet
 *
 * Geändert wird ausschließlich `beschreibung`. `fassung` bleibt, wo sie ist –
 * eine erhöhte Fassungsnummer erzeugt bei jedem Hörer eine „neue Folge", und
 * das für eine korrigierte Fußnote wäre unverhältnismäßig.
 */

import { readFileSync, writeFileSync } from 'node:fs'

import { angeglichen } from '../lib/podcast-hinweis.ts'

const REGISTER = 'data/podcast-eigener-feed.json'
const ANWENDEN = process.env.ANWENDEN === '1'

type Folge = { datum: string; beschreibung?: string }
type Register = { folgen: Folge[] }

const register = JSON.parse(readFileSync(REGISTER, 'utf8')) as Register

let geaendert = 0
for (const folge of register.folgen) {
  const neu = angeglichen(folge.beschreibung ?? '')
  if (neu === null) continue
  console.log(`  ${folge.datum}  wird angeglichen`)
  folge.beschreibung = neu
  geaendert++
}

if (geaendert === 0) {
  console.log(
    `[register] Alle ${register.folgen.length} Folgen tragen den heutigen Hinweis.`
  )
  process.exit(0)
}

if (!ANWENDEN) {
  console.log(
    `\n[register] Trockenlauf – ${geaendert} von ${register.folgen.length} Folgen ` +
      'würden geändert.\n           Scharf stellen mit ANWENDEN=1.'
  )
  process.exit(0)
}

/*
  Mit abschließendem Zeilenumbruch geschrieben, wie die Datei vorlag.

  Ohne ihn meldet Prettier bei jedem Bau einen Formatfehler – und ein Lauf,
  der die Prüfung rot macht, wird beim nächsten Mal nicht mehr benutzt.
*/
writeFileSync(REGISTER, JSON.stringify(register, null, 2) + '\n')
console.log(`\n[register] ${geaendert} Folgen angeglichen, ${REGISTER} geschrieben.`)
