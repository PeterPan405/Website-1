/**
 * Prüfungen für die Vorlesefassungen der Grafiken.
 *
 * ## Der Fehler, den es hier zu verhindern gilt
 *
 * Eine Grafik hat zwei Leser, die nie dasselbe zu Gesicht bekommen:
 *
 * - Ein Screenreader liest `<desc>` aus dem gezeichneten SVG.
 * - Die Aufnahme und die Vorleseleiste lesen, was `vorleseAbschnitte()` sagt.
 *
 * Bis zum 23. August 2026 waren das zwei getrennte Quellen. 53 der 135 Grafiken
 * rechneten ihre Beschreibung in der Zeichnung, weil sie fest in
 * `data/figures.ts` nach der ersten Aktualisierung falsch gewesen wäre – und
 * `vorleseAbschnitte()` sah davon nichts und fiel auf die Bildunterschrift
 * zurück. Dieselbe Grafik hatte damit eine volle Beschreibung und eine Zeile,
 * je nachdem, wer las. Beides sah für sich in Ordnung aus, nichts brach, nichts
 * warnte.
 *
 * ## Was hier geprüft wird – und was nicht
 *
 * Hier steht, was **ohne Bau** zu prüfen ist: dass jede der 135 Grafiken
 * überhaupt eine Vorlesefassung hat, und dass keine zwei trägt – eine feste in
 * `data/figures.ts` und eine gerechnete in `lib/grafik-beschreibungen.ts`
 * zugleich. Genau diese Doppelung ist die Ursache des Fehlers oben.
 *
 * Der eigentliche Vergleich – jedes `<desc>` aus dem gebauten Paket gegen das,
 * was gesprochen würde – steht in `scripts/paket-pruefen.ts` und läuft mit
 * `npm run pruefen`. Er gehört dorthin und nicht hierher: Er braucht `out/`,
 * und in CI laufen die Tests **vor** dem Bau. Hier stünde er entweder ständig
 * rot oder – schlimmer – überspränge sich selbst und meldete grün.
 */

import { figureMeta } from '@/data/figures'
import { alleGrafikBeschreibungen, vorlesegrafiken } from '@/lib/grafik-beschreibungen'

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

/* ------------------------------------------- Was ohne Bau schon geht */

const grafiken = vorlesegrafiken()
const ohne = Object.entries(grafiken)
  .filter(([, g]) => !(g.description ?? '').trim())
  .map(([id]) => id)

pruefe(
  'jede Grafik hat eine Vorlesefassung',
  ohne.length === 0,
  `${ohne.length} ohne: ${ohne.slice(0, 8).join(', ')}`
)

pruefe(
  'die Zusammenführung kennt alle Grafiken',
  Object.keys(grafiken).length === Object.keys(figureMeta).length,
  `${Object.keys(grafiken).length} gegen ${Object.keys(figureMeta).length}`
)

/*
  Keine Grafik darf beides haben.

  Eine feste Beschreibung in `data/figures.ts` **und** eine gerechnete wäre
  genau die Doppelung, die diese Datei abschafft: `vorlesegrafiken()` nähme die
  feste, `FigureSvg` die gerechnete, und die beiden liefen auseinander, sobald
  jemand eine von beiden ändert.
*/
const gerechnet = alleGrafikBeschreibungen()
const doppelt = Object.keys(gerechnet).filter((id) =>
  (figureMeta[id as keyof typeof figureMeta]?.description ?? '').trim()
)

pruefe('keine Grafik hat zwei Beschreibungen', doppelt.length === 0, doppelt.join(', '))

console.log(`\n${bestanden} bestanden, ${gescheitert} gescheitert`)
if (gescheitert > 0) process.exit(1)
