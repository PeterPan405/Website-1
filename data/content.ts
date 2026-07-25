/**
 * Gemeinsames Inhaltsmodell für Lerntexte und News-Artikel.
 *
 * Inhalte liegen als strukturierte Blöcke vor, nicht als HTML-Strings. Das hat
 * drei Vorteile: Die Überschriftenhierarchie lässt sich zentral erzwingen (für
 * SEO wichtig), es kann kein unerwünschtes Markup eingeschleust werden, und
 * derselbe Datensatz ließe sich später auch für andere Ausgabekanäle nutzen.
 */

export type ContentCalloutVariant = 'info' | 'tip' | 'warning'

export type ContentBlock =
  /**
   * Zwischenüberschrift. Auf Detailseiten ist das <h1> immer der Seitentitel,
   * daher beginnen Inhaltsüberschriften bei Ebene 2 – Ebenen dürfen nicht
   * übersprungen werden.
   */
  | { type: 'heading'; level: 2 | 3; text: string }
  /** Fließtext. `**fett**` wird beim Rendern in <strong> umgesetzt. */
  | { type: 'paragraph'; text: string }
  | { type: 'list'; ordered?: boolean; items: string[] }
  | { type: 'callout'; variant: ContentCalloutVariant; title?: string; items: string[] }
  | { type: 'quote'; text: string; source?: string }
  | { type: 'table'; caption?: string; head: string[]; rows: string[][] }
  /** Formel mit Erläuterung – für Zins-, Inflations- und Rentenrechnungen. */
  | { type: 'formula'; expression: string; description: string }
  /** Kompakte Faktenliste, z. B. „Risiko: hoch“. */
  | { type: 'keyfacts'; items: { label: string; value: string }[] }

/** Erzeugt aus einem Überschriftentext eine stabile Sprungmarke. */
export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replaceAll('ä', 'ae')
    .replaceAll('ö', 'oe')
    .replaceAll('ü', 'ue')
    .replaceAll('ß', 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
