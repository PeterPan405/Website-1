/**
 * Die drei Elliott-Regeln – gegen die eigenen Zeichnungen gerechnet.
 *
 * ## Warum das nötig war
 *
 * Am 8. August 2026 hat die Nachprüfung der Grafik `ta-elliott-extension`
 * zwei Verstöße ergeben, und zwar in derselben Lektion, in der die Regeln
 * drei Absätze weiter oben stehen:
 *
 * - Feld „Streckung in Welle 1“: Welle 3 endete **unter** dem Hoch der
 *   Welle 1, und Welle 4 reichte in deren Kursbereich hinein. Das ist die
 *   dritte Regel, wörtlich verletzt – in einem Lehrbild.
 * - Feld „Streckung in Welle 3“: Welle 5 blieb unter dem Hoch der Welle 3.
 *   Das ist eine Verkürzung, ein eigenes Phänomen, und sie hat in einer
 *   Grafik über Streckungen nichts zu suchen.
 *
 * Beides sah gezeichnet völlig unauffällig aus. Ein Kursverlauf mit fünf
 * Zacken wirkt richtig, solange die Zacken abwechseln – ob Welle 4 zwei
 * Pixel über oder unter dem Hoch der Welle 1 endet, sieht niemand.
 *
 * ## Warum die Koordinaten hier noch einmal stehen
 *
 * Weil sie sonst nicht prüfbar wären: Die Grafik ist eine React-Komponente
 * mit JSX, und dieser Test läuft ohne Bündler. Die Liste hier ist eine
 * Kopie – und der letzte Abschnitt des Tests stellt sicher, dass sie eine
 * Kopie **bleibt**: Er liest die Zeichnung im Quelltext und vergleicht.
 * Ändert jemand die Grafik, ohne hier nachzuziehen, schlägt der Test fehl.
 */

import { readFileSync } from 'node:fs'
import { join } from 'node:path'

let gescheitert = 0

function pruefe(name: string, bedingung: boolean, hinweis?: string) {
  if (bedingung) {
    console.log(`OK   ${name}`)
  } else {
    gescheitert++
    console.error(`FEHL ${name}${hinweis ? ` – ${hinweis}` : ''}`)
  }
}

/**
 * Ein Impuls als sechs y-Werte: Start und die Enden der Wellen 1 bis 5.
 *
 * y wächst nach unten – ein kleinerer Wert ist der höhere Kurs. Alle
 * Vergleiche hier sind für eine **Aufwärts**bewegung geschrieben.
 */
type Impuls = readonly [number, number, number, number, number, number]

function pruefeImpuls(name: string, y: Impuls, { verkuerzt = false } = {}) {
  const [start, w1, w2, w3, w4, w5] = y
  const laenge = { eins: start - w1, drei: w2 - w3, fuenf: w4 - w5 }
  const kuerzeste = Math.min(laenge.eins, laenge.drei, laenge.fuenf)

  pruefe(
    `${name}: Welle 2 läuft nicht über den Start zurück`,
    w2 < start,
    `Welle 2 endet bei ${w2}, der Start liegt bei ${start}`
  )
  pruefe(
    `${name}: Welle 3 ist nicht die kürzeste der drei`,
    laenge.drei > kuerzeste || laenge.drei === Math.max(...Object.values(laenge)),
    `Längen 1/3/5: ${laenge.eins}/${laenge.drei}/${laenge.fuenf}`
  )
  pruefe(
    `${name}: Welle 4 bleibt außerhalb des Gebiets der Welle 1`,
    w4 < w1,
    `Welle 4 endet bei ${w4}, das Hoch der Welle 1 liegt bei ${w1}`
  )
  pruefe(
    `${name}: Welle 3 überbietet das Hoch der Welle 1`,
    w3 < w1,
    `Welle 3 endet bei ${w3}, das Hoch der Welle 1 liegt bei ${w1}`
  )
  if (verkuerzt) {
    pruefe(
      `${name}: Welle 5 bleibt unter dem Hoch der Welle 3 – hier gewollt`,
      w5 > w3,
      'die Grafik soll gerade die Verkürzung zeigen'
    )
  } else {
    pruefe(
      `${name}: Welle 5 überbietet das Hoch der Welle 3`,
      w5 < w3,
      `Welle 5 endet bei ${w5}, das Hoch der Welle 3 liegt bei ${w3}`
    )
  }
}

/* --------------------------------------------- ta-elliott-extension */

const streckung: Record<string, Impuls> = {
  'Streckung in Welle 3': [130, 96, 112, 34, 62, 22],
  'Streckung in Welle 5': [130, 104, 118, 78, 94, 24],
  'Streckung in Welle 1': [130, 48, 78, 30, 42, 20],
}

for (const [name, y] of Object.entries(streckung)) pruefeImpuls(name, y)

/* Genau eine der drei Wellen ist gestreckt – das ist die Aussage der Grafik. */
for (const [name, y] of Object.entries(streckung)) {
  const [start, w1, w2, w3, w4, w5] = y
  const laengen = [start - w1, w2 - w3, w4 - w5]
  const nummer = laengen.indexOf(Math.max(...laengen)) * 2 + 1
  const erwartet = Number(name.slice(-1))
  pruefe(
    `${name}: die längste Welle ist tatsächlich Welle ${erwartet}`,
    nummer === erwartet,
    `am längsten ist Welle ${nummer} (Längen ${laengen.join('/')})`
  )
}

/* --------------------------------------------- ta-elliott-verkuerzung */

pruefeImpuls('Verkürzung', [210, 140, 172, 60, 108, 76], { verkuerzt: true })

/* ------------------------------ Stimmt die Kopie noch mit der Zeichnung? */

const quelle = readFileSync(
  join(import.meta.dirname, '..', 'components', 'content', 'figures', 'akademie.tsx'),
  'utf8'
)

/**
 * Die y-Werte aus dem Quelltext der Grafik zurücklesen.
 *
 * Gesucht wird der Block zwischen `titel: '…'` und dem zugehörigen
 * `lang:` – darin stehen genau die sechs Punkte des Zuges.
 */
function ausQuelltext(titel: string): number[] {
  const anfang = quelle.indexOf(`titel: '${titel}'`)
  if (anfang < 0) return []
  const ende = quelle.indexOf('lang:', anfang)
  const block = quelle.slice(anfang, ende)
  return [...block.matchAll(/\[\s*-?[\d.]+\s*,\s*(-?[\d.]+)\s*\]/g)].map((m) =>
    Number(m[1])
  )
}

for (const [name, y] of Object.entries(streckung)) {
  const gezeichnet = ausQuelltext(name)
  pruefe(
    `${name}: die geprüften Werte sind die gezeichneten`,
    gezeichnet.length === 6 && gezeichnet.every((wert, i) => wert === y[i]),
    `Zeichnung ${gezeichnet.join(',')} – geprüft ${y.join(',')}`
  )
}

console.log(
  gescheitert === 0
    ? '\nAlle Pruefungen bestanden'
    : `\n${gescheitert} Pruefung(en) fehlgeschlagen`
)
process.exit(gescheitert === 0 ? 0 : 1)
