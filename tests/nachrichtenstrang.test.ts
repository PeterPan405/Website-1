/**
 * Nachrichtenstränge – und ob sie zeigen, was sie versprechen.
 *
 * ## Was hier schiefgehen kann
 *
 * 1. **Ein Artikel landet in keinem Strang.** Er nennt zwei Symbole, kommt
 *    aber nur beim ersten an – dann fehlt er im anderen Strang, und niemand
 *    vermisst ihn.
 * 2. **Die Reihenfolge ist die der Datei statt die der Zeit.** Ein Strang,
 *    der nicht chronologisch ist, ist eine Liste.
 * 3. **Ein Strang aus einem Artikel bekommt eine Seite.** Dann gibt es
 *    dutzende Seiten mit je einem Verweis – ein Umweg zum Artikel.
 * 4. **Die Eckdaten sind vertauscht.** `von` ist der älteste, `bis` der
 *    jüngste Tag; andersherum sähe genauso plausibel aus.
 */

import {
  MINDEST_ARTIKEL,
  nachJahren,
  straenge,
  strangFuer,
  strangSchluessel,
  type Strangartikel,
} from '@/lib/nachrichtenstrang'

let failed = 0

function pruefen(was: string, bedingung: boolean, hinweis = ''): void {
  if (bedingung) {
    console.log(`OK   ${was}`)
  } else {
    failed++
    console.log(`FEHL ${was}${hinweis ? `\n     ${hinweis}` : ''}`)
  }
}

/** Baut einen Artikel. */
function artikel(
  slug: string,
  tag: string,
  symbole: string[],
  themen: string[] = []
): Strangartikel {
  return {
    slug,
    title: `Titel ${slug}`,
    teaser: `Anriss ${slug}`,
    publishedAt: `${tag}T06:00:00.000Z`,
    relatedSymbols: symbole,
    relatedTopics: themen,
  }
}

/*
  Ein Bestand, der die echte Verteilung nachbildet: ein Wert mit vielen
  Meldungen, einer mit wenigen, einer mit genau einer.
*/
const bestand: Strangartikel[] = [
  artikel('a', '2026-08-10', ['dax', 'gold'], ['aktie']),
  artikel('b', '2026-08-12', ['dax'], ['aktie', 'inflation']),
  artikel('c', '2026-08-14', ['dax', 'gold'], ['aktie']),
  artikel('d', '2026-08-16', ['dax'], ['inflation']),
  artikel('e', '2026-08-18', ['dax'], ['aktie']),
  artikel('f', '2025-12-01', ['gold'], ['rohstoffe']),
  artikel('g', '2025-11-01', ['brent'], ['rohstoffe']),
]

/* ---------------------------------------- Ein Artikel in mehreren Strängen */

const daxStrang = strangFuer(bestand, 'symbol', 'dax')
const goldStrang = strangFuer(bestand, 'symbol', 'gold')

pruefen(
  'Der DAX-Strang hat fünf Meldungen',
  daxStrang.length === 5,
  `${daxStrang.map((a) => a.slug).join(', ')}`
)

/*
  Der Fall, der leicht durchrutscht: Artikel „a" und „c" nennen DAX **und**
  Gold. Wer beim ersten Treffer aufhört, verliert sie im zweiten Strang.
*/
pruefen(
  'Ein Artikel mit zwei Symbolen steht in beiden Strängen',
  goldStrang
    .map((a) => a.slug)
    .sort()
    .join() === 'a,c,f' && daxStrang.some((a) => a.slug === 'a'),
  `Gold: ${goldStrang.map((a) => a.slug).join(', ')}`
)

pruefen(
  'Ein unbekanntes Symbol ergibt einen leeren Strang',
  strangFuer(bestand, 'symbol', 'gibtesnicht').length === 0
)

/* ------------------------------------------------------ Die Reihenfolge */

console.log('')

pruefen(
  'Der Strang steht jüngste Meldung zuerst',
  daxStrang.map((a) => a.slug).join() === 'e,d,c,b,a',
  `${daxStrang.map((a) => a.slug).join()} – die Datei liefert sie andersherum.`
)

pruefen(
  'Themenstränge lesen dasselbe Feld andersherum',
  strangFuer(bestand, 'thema', 'inflation')
    .map((a) => a.slug)
    .join() === 'd,b',
  `${strangFuer(bestand, 'thema', 'inflation')
    .map((a) => a.slug)
    .join()}`
)

/* --------------------------------------------- Die Mindestzahl */

console.log('')

const symbolstraenge = straenge(bestand, 'symbol')

pruefen(
  `Nur Stränge ab ${MINDEST_ARTIKEL} Meldungen bekommen eine Seite`,
  symbolstraenge.map((s) => s.schluessel).join() === 'dax',
  `${symbolstraenge.map((s) => `${s.schluessel}(${s.artikel.length})`).join(', ')}\n` +
    '     Gold hat drei, Brent eine – beide sind zu kurz für eine eigene Seite.'
)

/*
  Die Gegenprobe zur Grenze: Mit einer niedrigeren kommen mehr durch. Ohne sie
  wäre nicht ausgeschlossen, dass die Funktion einfach immer nur den längsten
  liefert.
*/
pruefen(
  'Eine niedrigere Grenze lässt mehr durch',
  straenge(bestand, 'symbol', 3)
    .map((s) => s.schluessel)
    .join() === 'dax,gold',
  `${straenge(bestand, 'symbol', 3)
    .map((s) => s.schluessel)
    .join()}`
)

pruefen(
  'Die längsten Stränge stehen vorn',
  straenge(bestand, 'symbol', 1).map((s) => s.artikel.length)[0] === 5,
  `${straenge(bestand, 'symbol', 1)
    .map((s) => `${s.schluessel}:${s.artikel.length}`)
    .join(', ')}`
)

pruefen(
  'Bei gleicher Länge entscheidet der Name',
  (() => {
    const gleich = [
      artikel('x', '2026-01-01', ['zeta']),
      artikel('y', '2026-01-02', ['alpha']),
    ]
    return straenge(gleich, 'symbol', 1)[0].schluessel === 'alpha'
  })(),
  'Sonst wackelt die Reihenfolge zwischen zwei Bauten.'
)

pruefen(
  'strangSchluessel liefert dieselbe Auswahl',
  strangSchluessel(bestand, 'symbol').join() === 'dax',
  `${strangSchluessel(bestand, 'symbol').join()}`
)

/* ------------------------------------------------------- Die Eckdaten */

console.log('')

const dax = symbolstraenge[0]
pruefen(
  'von ist der älteste Tag, bis der jüngste',
  dax.von === '2026-08-10' && dax.bis === '2026-08-18',
  `von ${dax.von}, bis ${dax.bis} – vertauscht sähe es genauso plausibel aus.`
)

/* ----------------------------------------------------- Die Jahrgänge */

console.log('')

const jahre = nachJahren(strangFuer(bestand, 'symbol', 'gold'))

pruefen(
  'Der Strang zerfällt in Jahrgänge, jüngster zuerst',
  jahre.map((j) => j.jahr).join() === '2026,2025',
  `${jahre.map((j) => `${j.jahr}(${j.artikel.length})`).join(', ')}`
)

pruefen(
  'Beim Gliedern geht keine Meldung verloren',
  jahre.reduce((summe, j) => summe + j.artikel.length, 0) === goldStrang.length
)

pruefen(
  'Ein leerer Strang ergibt keine Jahrgänge',
  nachJahren([]).length === 0,
  'Sonst stünde eine Jahreszahl ohne Meldungen darunter.'
)

console.log(
  failed === 0 ? '\nAlle Prüfungen bestanden.' : `\n${failed} Prüfung(en) fehlgeschlagen.`
)
process.exit(failed === 0 ? 0 : 1)
