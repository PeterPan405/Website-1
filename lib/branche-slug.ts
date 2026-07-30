/**
 * Der Adressteil einer Branche.
 *
 * Eigene Datei, damit `tests/` sie ohne Laufzeitimporte laden kann: `lib/branchen.ts`
 * zieht den ganzen Instrumentenkatalog nach, und der lässt sich mit
 * `node --experimental-strip-types` nicht auflösen. Die Umwandlung selbst ist
 * reine Textarbeit und braucht davon nichts.
 */

/**
 * Macht aus einem Branchennamen einen Slug.
 *
 * Umlaute werden ausgeschrieben, nicht weggeworfen: `Rüstung` wird zu
 * `ruestung` und nicht zu `rstung`. Die naheliegende Abkürzung wäre eine
 * Normalisierung nach NFD mit anschließendem Entfernen der Diakritika – die
 * macht aus `Rüstung` aber `rustung` und aus `Größe` `grosse`, und im
 * Deutschen ist das schlicht falsch geschrieben.
 */
export function brancheSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}
