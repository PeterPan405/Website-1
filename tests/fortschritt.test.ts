/**
 * Prüfungen für die Schlüssel des Lernfortschritts.
 *
 * ## Warum ausgerechnet die Schlüssel
 *
 * Weil sie das Einzige an diesem Speicher sind, das stumm falsch sein kann.
 * Ob ein Haken gesetzt wird, sieht man sofort; ob er beim nächsten Besuch
 * wieder da ist, auch. Was man nicht sieht: dass zwei verschiedene Dinge
 * denselben Schlüssel bekommen.
 *
 * Lernbereich und Akademie teilen sich eine Liste im localStorage. Das ist
 * Absicht – es ist derselbe Fortschritt, und zwei Speicher hießen zwei
 * Zurücksetzen-Schalter. Der Preis ist, dass ein Lernthema und eine Lektion
 * niemals denselben Schlüssel bilden dürfen. Sonst hakt das Abschließen einer
 * Lektion irgendwo im Lernbereich eine Stufe mit ab, und niemand käme darauf,
 * dort nachzusehen.
 *
 * Geprüft wird deshalb gegen die echten Daten, nicht gegen ein Beispiel: alle
 * Lernthemen mal drei Stufen gegen alle Lektionen beider Bereiche.
 *
 * Die Lernthemen kommen dabei aus den Dateinamen unter `data/learn/topics/`.
 * `data/learn/index.ts` selbst lässt sich hier nicht laden – es benutzt den
 * `@/`-Alias, den nur der Bündler kennt, nicht das nackte Node. Dass Dateiname
 * und Slug übereinstimmen, prüft dieser Test gleich mit.
 */

import { readdirSync, readFileSync } from 'node:fs'

import { lektionKey, levelKey } from '../components/learn/progress-store.ts'
import { fundamentalanalyseLektionen } from '../data/akademie/fundamentalanalyse.ts'
import { technischeAnalyseLektionen } from '../data/akademie/technische-analyse.ts'

const THEMENORDNER = 'data/learn/topics'

const themendateien = readdirSync(THEMENORDNER).filter((name) => name.endsWith('.ts'))
const learnTopics = themendateien.map((name) => {
  const slug = name.replace(/\.ts$/, '')
  const inhalt = readFileSync(`${THEMENORDNER}/${name}`, 'utf8')
  return { slug, eigenerSlug: inhalt.match(/^  slug: '([^']+)'/m)?.[1] }
})

let bestanden = 0
let gescheitert = 0

function pruefe(name: string, bedingung: boolean, hinweis?: string) {
  if (bedingung) {
    bestanden++
    console.log(`OK   ${name}`)
  } else {
    gescheitert++
    console.error(`FEHL ${name}${hinweis ? ` – ${hinweis}` : ''}`)
  }
}

const stufen = ['beginner', 'fortgeschritten', 'profi']
const lektionen = [...technischeAnalyseLektionen, ...fundamentalanalyseLektionen]

const lernschluessel = learnTopics.flatMap((thema) =>
  stufen.map((stufe) => levelKey(thema.slug, stufe))
)
const akademieschluessel = lektionen.map((lektion) =>
  lektionKey(lektion.bereich, lektion.slug)
)

console.log('\n— Form —')

pruefe(
  'ein Lernschlüssel hat die Form thema:stufe',
  levelKey('aktie', 'beginner') === 'aktie:beginner'
)
pruefe(
  'ein Akademieschlüssel trägt den Präfix akademie:',
  lektionKey('technische-analyse', 'macd') === 'akademie:technische-analyse/macd'
)

console.log('\n— Eindeutigkeit —')

pruefe(
  'kein Lernschlüssel kommt doppelt vor',
  new Set(lernschluessel).size === lernschluessel.length
)
pruefe(
  'kein Akademieschlüssel kommt doppelt vor',
  new Set(akademieschluessel).size === akademieschluessel.length,
  akademieschluessel.filter((s, i) => akademieschluessel.indexOf(s) !== i).join(', ')
)

/*
  Der eigentliche Fall. Eine Kollision entstünde, wenn es je ein Lernthema
  namens „akademie“ gäbe: `levelKey('akademie', 'technische-analyse/macd')`
  ergäbe denselben Text. Die Stufen heißen zwar anders, aber sie sind es, die
  sich ändern könnten – der Präfix bleibt.
*/
const zusammen = new Set([...lernschluessel, ...akademieschluessel])
pruefe(
  'Lernbereich und Akademie überschneiden sich in keinem Schlüssel',
  zusammen.size === lernschluessel.length + akademieschluessel.length,
  lernschluessel.filter((s) => akademieschluessel.includes(s)).join(', ')
)
pruefe(
  'und kein Lernthema heißt „akademie“',
  !learnTopics.some((thema) => thema.slug === 'akademie')
)

pruefe(
  'jeder Dateiname unter data/learn/topics trägt den Slug seines Themas',
  learnTopics.every((thema) => thema.eigenerSlug === thema.slug),
  learnTopics
    .filter((thema) => thema.eigenerSlug !== thema.slug)
    .map((thema) => `${thema.slug}.ts enthält ${thema.eigenerSlug}`)
    .join(', ')
)

console.log('\n— Umfang —')

pruefe(
  `alle ${learnTopics.length} Lernthemen sind erfasst`,
  lernschluessel.length === learnTopics.length * 3
)
pruefe(
  `alle ${lektionen.length} Lektionen sind erfasst`,
  akademieschluessel.length === lektionen.length
)

console.log(`\n${bestanden} bestanden, ${gescheitert} gescheitert.`)
if (gescheitert > 0) process.exit(1)
console.log('Alle Prüfungen bestanden.')
