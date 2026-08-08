/**
 * Die Zeit läuft nach rechts. In jeder Kursgrafik, ohne Ausnahme.
 *
 * ## Der Fehler, gegen den das hier steht
 *
 * Am 8. August 2026 fiel einem Leser auf, dass die drei Dreiecke im
 * Elliott-Kapitel wie Gekritzel aussahen. Die Ursache war in allen drei
 * Feldern dieselbe – und dieselbe nochmal in den beiden Diagonalen und in
 * der Diagonale der Umkehrbereiche: Um zu zeigen, dass Welle 4 in das
 * Gebiet der Welle 1 zurückreicht, hatte ich den Punkt **nach links**
 * gesetzt. Sechs Pfade, in denen der Stift über bereits gezeichnete Zeit
 * zurückfährt.
 *
 * Das ist keine Ungenauigkeit, sondern eine falsche Aussage: Ein Kurs kann
 * im Preis zurückkommen, niemals in der Zeit. Die Überlappung gehört auf
 * die y-Achse, der Fortschritt auf die x-Achse.
 *
 * ## Warum ein Test und nicht bloß Sorgfalt
 *
 * Weil es in keiner Prüfung auffiel. TypeScript sieht Zahlenpaare,
 * ESLint sieht gültiges JSX, der Bau erzeugt ein sauberes SVG. Nur das
 * Auge sieht es – und auch das erst, wenn es hinschaut. Ein falscher Pfad
 * sieht aus wie ein gewollt zappeliger Kursverlauf.
 *
 * ## Was der Test nicht kann
 *
 * Er liest den Quelltext, nicht das gerenderte Bild. Punktlisten, die aus
 * `lib/` kommen oder zur Laufzeit gerechnet werden, prüft er nicht – die
 * stammen aber ohnehin aus Datenreihen, die nach Datum sortiert sind. Er
 * prüft die von Hand gesetzten Koordinaten, und genau dort war der Fehler.
 */

import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const ordner = join(import.meta.dirname, '..', 'components', 'content', 'figures')

/**
 * Zeichnungen, in denen x bewusst keine Zeit ist.
 *
 * Wer hier etwas einträgt, behauptet: Diese Grafik hat keine Zeitachse –
 * etwa ein Streudiagramm aus Risiko und Rendite oder ein Schema ohne
 * Kursverlauf. Der Eintrag gehört mit einem Satz begründet, sonst ist er
 * nur eine abgeschaltete Prüfung.
 */
const OHNE_ZEITACHSE: readonly string[] = []

let gescheitert = 0
let geprueft = 0

function melde(datei: string, zeile: number, xs: number[], rueck: [number, number][]) {
  gescheitert++
  console.error(`FEHL ${datei}:${zeile} – x läuft rückwärts`)
  console.error(`     x-Folge:  ${xs.join(', ')}`)
  for (const [von, nach] of rueck) {
    console.error(`     Rücksprung: ${von} → ${nach}`)
  }
  console.error(
    '     Eine Überlappung gehört in die y-Werte (Preis), nicht in die x-Werte (Zeit).'
  )
}

/** Alle Zahlenpaare einer Klammer, in der Reihenfolge des Quelltexts. */
function paare(text: string): number[][] {
  const treffer = text.matchAll(/\[\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)\s*\]/g)
  return [...treffer].map((m) => [Number(m[1]), Number(m[2])])
}

for (const name of readdirSync(ordner).filter((n) => n.endsWith('.tsx'))) {
  if (OHNE_ZEITACHSE.includes(name)) continue
  const quelle = readFileSync(join(ordner, name), 'utf8')

  /*
    Zwei Schreibweisen kommen vor: die Punktliste direkt in `pfad(...)` und
    die vorher benannte Konstante, die dann an `pfad` geht. Beide werden
    erfasst; alles andere – etwa aus `lib/` geladene Reihen – bleibt außen
    vor.
  */
  const stellen = [
    /*
      Der zweite Klammerwert von `weich` ist die Spannung, eine Zahl. Er
      muss hier als `[\d.]` stehen und nicht als „irgendwas ohne Klammern“ –
      sonst verschluckt der Ausdruck die restlichen Punkte und prüft nur
      den ersten. Genau das tat der erste Entwurf dieses Tests, und er
      meldete brav 22 statt 49 Listen.
    */
    ...quelle.matchAll(/(?:pfad|weich)\(\s*\[([\s\S]*?)\]\s*(?:,\s*[\d.]+\s*)?\)/g),
    ...quelle.matchAll(/(?:const|let)\s+\w+[^=\n]*=\s*\[([\s\S]*?)\n\s*\]/g),
  ]

  for (const stelle of stellen) {
    const roh = stelle[1] ?? ''
    /*
      Listen mit Text darin sind Beschriftungstabellen wie
      `[[500, 112, '1'], …]`, keine Kursverläufe. Sie tragen die Zeit nicht
      in x, sondern verweisen auf Punkte, die anderswo schon geprüft sind.
    */
    if (/['"`]/.test(roh)) continue
    if (/\[\s*-?[\d.]+\s*,\s*-?[\d.]+\s*,/.test(roh)) continue
    const punkte = paare(roh)
    if (punkte.length < 3) continue
    geprueft++
    const xs = punkte.map((p) => p[0])
    const rueck: [number, number][] = []
    for (let i = 0; i < xs.length - 1; i += 1) {
      if (xs[i + 1] < xs[i]) rueck.push([xs[i], xs[i + 1]])
    }
    if (rueck.length > 0) {
      const zeile = quelle.slice(0, stelle.index).split('\n').length
      melde(name, zeile, xs, rueck)
    }
  }
}

/*
  Die Zahl ist eine Bremse gegen den stillen Ausfall: Ein Suchausdruck, der
  nichts mehr findet, meldet „bestanden“ und prüft nichts. Aktuell sind es
  33 – Punktlisten aus mindestens drei Punkten; die vielen Zweipunkt-Linien
  der Begrenzungen zählen nicht mit, bei ihnen gibt es keine Reihenfolge zu
  verletzen.
*/
if (geprueft < 30) {
  console.error(
    `FEHL Nur ${geprueft} Punktlisten gefunden – der Suchausdruck greift nicht mehr.`
  )
  gescheitert++
} else {
  console.log(`OK   ${geprueft} Punktlisten geprüft, x steigt überall an`)
}

console.log(
  gescheitert === 0
    ? '\nAlle Pruefungen bestanden'
    : `\n${gescheitert} Pruefung(en) fehlgeschlagen`
)
process.exit(gescheitert === 0 ? 0 : 1)
