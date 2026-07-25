import { editions } from '@/data/editions'
import type { DailyEdition, EditionItem } from '@/data/editions'

import { formatMonthKey } from '@/lib/edition-date'

export type { DailyEdition, EditionItem }

/**
 * Service-Schicht für die Tagesausgaben.
 *
 * Wie bei den übrigen Bereichen greifen die Seiten ausschließlich hierüber auf
 * die Daten zu. Zieht die Redaktion später in ein CMS um, ändert sich nur diese
 * Datei – die Signaturen sind schon asynchron.
 */

/** Neueste Ausgabe zuerst. */
function sortedEditions(): DailyEdition[] {
  return [...editions].sort((a, b) => b.date.localeCompare(a.date))
}

/** Alle fünf Meldungen einer Ausgabe in Anzeigereihenfolge. */
export function allItems(edition: DailyEdition): EditionItem[] {
  return [...edition.top, ...edition.further]
}

export async function getEditions(limit?: number): Promise<DailyEdition[]> {
  const all = sortedEditions()
  return typeof limit === 'number' ? all.slice(0, limit) : all
}

/** Die Ausgabe des jüngsten Erscheinungstags. */
export async function getLatestEdition(): Promise<DailyEdition | null> {
  return sortedEditions()[0] ?? null
}

export async function getEdition(date: string): Promise<DailyEdition | null> {
  return editions.find((edition) => edition.date === date) ?? null
}

/** Alle Erscheinungstage – für `generateStaticParams` und die Sitemap. */
export async function getEditionDates(): Promise<string[]> {
  return sortedEditions().map((edition) => edition.date)
}

/**
 * Vorherige und nächste Ausgabe – für die Blätternavigation.
 *
 * `previous` ist die zeitlich frühere Ausgabe, `next` die spätere. Am Rand des
 * Archivs ist der jeweilige Wert `null`.
 */
export async function getEditionNeighbours(
  date: string
): Promise<{ previous: DailyEdition | null; next: DailyEdition | null }> {
  const all = sortedEditions()
  const index = all.findIndex((edition) => edition.date === date)
  if (index === -1) return { previous: null, next: null }
  return {
    // Die Liste ist absteigend sortiert: der nächste Eintrag ist der ältere.
    previous: all[index + 1] ?? null,
    next: all[index - 1] ?? null,
  }
}

/** Eine Gruppe der Bibliothek: ein Monat mit seinen Ausgaben. */
export interface EditionMonth {
  /** Sortierschlüssel im Format YYYY-MM. */
  key: string
  /** Ausgeschrieben, z. B. „Juli 2026“. */
  label: string
  editions: DailyEdition[]
}

/**
 * Die Bibliothek, nach Monaten gruppiert.
 *
 * Gruppierung statt einer durchlaufenden Liste, weil das Archiv mit jedem Tag
 * wächst: Nach einem Jahr sind es über 300 Einträge, die ohne Zwischentitel
 * nicht mehr überschaubar sind.
 *
 * Die Monatsnamen stehen absichtlich als Liste im Code und kommen nicht aus
 * `toLocaleDateString`: Das Ergebnis wäre von der Zeitzone und den installierten
 * Gebietsdaten des Servers abhängig und könnte sich zwischen Build und Browser
 * unterscheiden.
 */
export async function getEditionLibrary(): Promise<EditionMonth[]> {
  const groups = new Map<string, DailyEdition[]>()

  for (const edition of sortedEditions()) {
    const key = edition.date.slice(0, 7)
    const list = groups.get(key)
    if (list) list.push(edition)
    else groups.set(key, [edition])
  }

  return [...groups.entries()].map(([key, list]) => ({
    key,
    label: formatMonthKey(key),
    editions: list,
  }))
}

/**
 * Weiterreichen der Datumsformatierung.
 *
 * Die Seiten sollen nur die Service-Schicht kennen müssen; die Rechnung selbst
 * liegt in `lib/edition-date.ts`, damit sie ohne Datenschicht testbar bleibt.
 */
export { formatEditionDate } from '@/lib/edition-date'
