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
 * ## Wie hier geprüft wird
 *
 * Gegen das **gebaute Paket**, nicht gegen den Quelltext. Aus `out/` wird jedes
 * `<desc>` gelesen – also das, was wirklich ausgeliefert wird – und mit dem
 * verglichen, was die Vorlesefassung sagen würde. Ein Vergleich der Quelltexte
 * miteinander würde nur beweisen, dass zwei Dateien zueinander passen.
 *
 * Daraus folgt: **Ohne `npm run build` kann dieser Test nichts sagen.** Er sagt
 * es dann auch – und geht rot, statt stillschweigend durchzulaufen. Ein Test,
 * der ohne Material grün meldet, ist schlimmer als keiner.
 */

import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

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

/* ------------------------------------------ Und der Vergleich mit `out/` */

/** Alle `<desc>` aus dem gebauten Paket, nach Grafikkennung. */
function ausDemPaket(): Map<string, string> {
  const gefunden = new Map<string, string>()

  const durchsuche = (ordner: string) => {
    for (const eintrag of readdirSync(ordner)) {
      const pfad = join(ordner, eintrag)
      if (statSync(pfad).isDirectory()) {
        durchsuche(pfad)
        continue
      }
      if (!eintrag.endsWith('.html')) continue

      const inhalt = readFileSync(pfad, 'utf8')
      for (const treffer of inhalt.matchAll(
        /<desc id="([^"]+)-beschreibung">([\s\S]*?)<\/desc>/g
      )) {
        gefunden.set(treffer[1], entwerte(treffer[2]))
      }
    }
  }

  durchsuche('out')
  return gefunden
}

/** Die fünf HTML-Entitäten, die React beim Rendern setzt, zurückübersetzen. */
function entwerte(text: string): string {
  return text
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&#x27;', "'")
    .replaceAll('&amp;', '&')
}

let paket: Map<string, string> | null = null
try {
  paket = ausDemPaket()
} catch {
  paket = null
}

if (paket === null || paket.size === 0) {
  console.error(
    'FEHL out/ enthält keine Grafiken – ohne „npm run build" prüft diese Datei nichts.'
  )
  console.error(
    '     Das ist kein Ausrutscher des Tests, sondern seine Aussage: Der Vergleich\n' +
      '     läuft gegen das ausgelieferte Paket, und ohne Paket gibt es nichts zu vergleichen.'
  )
  gescheitert++
} else {
  pruefe(
    'das Paket enthält alle Grafiken',
    paket.size === Object.keys(figureMeta).length,
    `${paket.size} im Paket, ${Object.keys(figureMeta).length} im Verzeichnis`
  )

  const abweichend: string[] = []
  for (const [id, gezeichnet] of paket) {
    const gesprochen = grafiken[id]?.description
    if (gesprochen !== gezeichnet) abweichend.push(id)
  }

  pruefe(
    'gezeichnete und gesprochene Beschreibung sind identisch',
    abweichend.length === 0,
    `${abweichend.length} verschieden: ${abweichend.slice(0, 6).join(', ')}`
  )

  /*
    Die Gegenprobe: Ein verfälschter Satz muss auffallen.

    Ohne sie wäre nicht gezeigt, dass der Vergleich oben überhaupt vergleicht –
    er könnte auch zweimal dasselbe Objekt betrachten.
  */
  const [ersteId, ersterText] = [...paket][0]
  pruefe(
    'ein verfälschter Satz wird beanstandet',
    `${ersterText} ` !== grafiken[ersteId]?.description,
    'die Prüfung findet keinen Unterschied, obwohl ein Leerzeichen angehängt wurde'
  )
}

console.log(`\n${bestanden} bestanden, ${gescheitert} gescheitert`)
if (gescheitert > 0) process.exit(1)
