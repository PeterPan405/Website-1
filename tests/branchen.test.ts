/**
 * Prüfungen für die Brancheneinteilung.
 *
 * Zwei Arten von Fehlern sind hier möglich, und beide sind von der fertigen
 * Seite aus schwer zu sehen: eine Aktie, die in keiner Branche auftaucht, und
 * ein Slug, der nicht zurück auf seinen Namen führt. Das erste fällt niemandem
 * auf, weil die übrigen tausend Titel da sind; das zweite erzeugt eine Adresse,
 * die auf eine leere Seite zeigt.
 *
 * `brancheSlug` läuft ohne Laufzeitimporte und wird deshalb direkt geprüft. Für
 * die Zuordnung selbst wird die echte Liste gelesen – eine erfundene wäre kein
 * Test der Daten, um die es geht.
 */

import { readFileSync } from 'node:fs'

import { brancheSlug } from '../lib/branche-slug.ts'

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

console.log('\n— Slugs —')

pruefe('macht aus Halbleiter halbleiter', brancheSlug('Halbleiter') === 'halbleiter')
pruefe('schreibt Umlaute aus', brancheSlug('Rüstung') === 'ruestung')
pruefe('auch mitten im Wort', brancheSlug('Glücksspiel') === 'gluecksspiel')
pruefe('und das scharfe s', brancheSlug('Großhandel') === 'grosshandel')
pruefe(
  'ersetzt Leerzeichen durch Bindestriche',
  brancheSlug('Erneuerbare Energien') === 'erneuerbare-energien'
)
pruefe(
  'laesst keine Bindestriche am Rand stehen',
  brancheSlug(' Handel & Vertrieb ') === 'handel-vertrieb',
  brancheSlug(' Handel & Vertrieb ')
)

/*
  Der eigentliche Grund für das Ausschreiben: Ohne die Umlautregel wuerde aus
  „Rüstung“ die Adresse `rstung` – lesbar ist das nicht, und zwei verschiedene
  Branchen koennten auf denselben Slug fallen.
*/
pruefe('wirft keinen Umlaut ersatzlos weg', !brancheSlug('Rüstung').includes('rstung'))

console.log('\n— Die echte Liste —')

const zeilen = readFileSync('data/aktien-liste.txt', 'utf8')
  .split('\n')
  .filter((zeile) => !zeile.startsWith('#') && zeile.includes('|'))

const branchen = zeilen.map((zeile) => zeile.split('|')[5]?.trim() ?? '')

pruefe(
  'jede Zeile der Aktienliste hat eine Branche',
  branchen.every((branche) => branche.length > 0),
  `${branchen.filter((b) => !b).length} ohne`
)

const slugs = new Map<string, string>()
let kollision: string | null = null
for (const branche of new Set(branchen)) {
  const slug = brancheSlug(branche)
  const vorher = slugs.get(slug)
  if (vorher && vorher !== branche) kollision = `${vorher} und ${branche} → ${slug}`
  slugs.set(slug, branche)
}
pruefe('keine zwei Branchen teilen sich einen Slug', kollision === null, kollision ?? '')

pruefe(
  'jeder Slug besteht nur aus Kleinbuchstaben, Ziffern und Bindestrichen',
  [...slugs.keys()].every((slug) => /^[a-z0-9-]+$/.test(slug)),
  [...slugs.keys()].filter((slug) => !/^[a-z0-9-]+$/.test(slug)).join(', ')
)

/*
  Einzahl und Mehrzahl derselben Branche waeren zwei Seiten mit fast gleichem
  Namen. Genau das stand hier: „Dienstleistung“ mit dreizehn Titeln und
  „Dienstleistungen“ mit einem.
*/
const namen = [...new Set(branchen)]
const fastGleich = namen.filter((eine) =>
  namen.some((andere) => andere !== eine && andere === `${eine}n`)
)
pruefe(
  'keine Branche steht zugleich in Einzahl und Mehrzahl da',
  fastGleich.length === 0,
  fastGleich.join(', ')
)

console.log(`\n${bestanden} bestanden, ${gescheitert} gescheitert.`)
if (gescheitert > 0) process.exit(1)
console.log('Alle Prüfungen bestanden.')
