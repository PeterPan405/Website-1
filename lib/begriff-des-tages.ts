/**
 * Ein Glossarbegriff je Tag – aus dem Datum gerechnet, nicht gezogen.
 *
 * ## Warum kein Zufall
 *
 * Weil `Math.random()` bei jedem Aufruf etwas anderes liefert. Die Startseite
 * entsteht beim Bauen, der Besucher sieht das Ergebnis: Zwei Aufrufe mit zwei
 * Ergebnissen wären zwei verschiedene Karten für dieselbe Seite – und in einer
 * Anwendung, die im Browser weiterrechnet, ein Aufblitzen beim Laden.
 *
 * Aus dem Datum gerechnet ist der Begriff für alle derselbe, an jedem Ort und
 * bei jedem Neubau. Das ist keine technische Feinheit: „Begriff des Tages"
 * heißt, dass es **der** Begriff dieses Tages ist und nicht einer von vielen
 * möglichen.
 *
 * ## Warum eine gemischte Reihenfolge und kein Rest der Division
 *
 * `index = tagImJahr % anzahl` wäre der naheliegende Weg und liefert die
 * Begriffe in genau der Reihenfolge, in der sie im Glossar stehen – also
 * alphabetisch. Wochenlang A, dann wochenlang B. Der Begriff des Tages sähe
 * aus wie das, was er wäre: eine Liste, die durchgeklappert wird.
 *
 * Stattdessen wird die Liste **einmal je Jahr durchgemischt** – deterministisch,
 * aus dem Namen und der Jahreszahl. Daraus folgt beides, was man will:
 *
 * - Die Reihenfolge wirkt beliebig, ist aber für alle dieselbe.
 * - Es ist ein **Durchlauf**, keine Ziehung mit Zurücklegen: Jeder Begriff
 *   kommt einmal an die Reihe, bevor einer zum zweiten Mal kommt. Bei einer
 *   Zufallsziehung käme statistisch jeder dritte Tag ein Begriff, der schon
 *   dran war, während andere ein Jahr lang nie erscheinen.
 *
 * ## Warum der Tag hereingereicht wird
 *
 * Aus demselben Grund wie in `lib/datenstand.ts`: Eine Bibliothek mit eigener
 * Uhr lässt sich nicht prüfen. Wer sie aufruft, sagt, welcher Tag gemeint ist.
 */

/**
 * FNV-1a, 32 Bit.
 *
 * Ein bewusst simpler Streuwert: Er muss nicht sicher sein, sondern
 * **stabil** – dieselbe Zeichenkette muss in fünf Jahren dieselbe Zahl
 * ergeben. Deshalb hier ausgeschrieben und nicht aus einer Bibliothek, die
 * ihre Implementierung ändern darf.
 */
function streuwert(text: string): number {
  let h = 0x811c9dc5
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return h >>> 0
}

/** Der wievielte Tag des Jahres – 1 für den 1. Januar. */
export function tagImJahr(tag: string): number {
  const jahr = Number(tag.slice(0, 4))
  const datum = Date.UTC(jahr, Number(tag.slice(5, 7)) - 1, Number(tag.slice(8, 10)))
  const anfang = Date.UTC(jahr, 0, 1)
  return Math.round((datum - anfang) / 86_400_000) + 1
}

/**
 * Die Reihenfolge, in der die Begriffe in diesem Jahr drankommen.
 *
 * Nach dem Streuwert aus Kennung **und Jahr** sortiert: Damit ist sie
 * innerhalb eines Jahres fest und im nächsten eine andere. Ohne die Jahreszahl
 * käme jeder Begriff jedes Jahr am selben Tag – richtig gerechnet und
 * trotzdem falsch, weil ein Jahr später niemand denselben Begriff am
 * 14. März erwartet.
 */
export function reihenfolgeFuerJahr<T extends { slug: string }>(
  eintraege: readonly T[],
  jahr: number
): T[] {
  return [...eintraege].sort(
    (a, b) => streuwert(`${a.slug}#${jahr}`) - streuwert(`${b.slug}#${jahr}`)
  )
}

/**
 * Der Begriff des Tages.
 *
 * `null` bei leerer Liste – der Aufrufer zeigt dann nichts, statt eine leere
 * Karte zu bauen.
 */
export function begriffDesTages<T extends { slug: string }>(
  eintraege: readonly T[],
  tag: string
): T | null {
  if (eintraege.length === 0) return null

  const jahr = Number(tag.slice(0, 4))
  if (!Number.isFinite(jahr)) return null

  const reihenfolge = reihenfolgeFuerJahr(eintraege, jahr)

  /*
    `(tagImJahr − 1) % anzahl`, damit der 1. Januar der erste der Reihe ist.

    Ohne das `− 1` beginnt das Jahr beim zweiten Eintrag, und der erste kommt
    erst nach einem vollen Durchlauf. Fällt nie jemandem auf und ist trotzdem
    nicht das, was dasteht.
  */
  const index = (tagImJahr(tag) - 1) % reihenfolge.length
  return reihenfolge[index]
}
