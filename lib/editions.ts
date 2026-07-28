import { editions } from '@/data/editions'
import type { DailyEdition, EditionItem } from '@/data/editions'
import { learnTopics } from '@/data/learn'
import { marketDefinitions } from '@/data/markets'

import { formatMonthKey } from '@/lib/edition-date'
import { assertEditionsValid } from '@/lib/editions-validate'

export type { DailyEdition, EditionItem }

/**
 * Service-Schicht für die Tagesausgaben.
 *
 * Wie bei den übrigen Bereichen greifen die Seiten ausschließlich hierüber auf
 * die Daten zu. Zieht die Redaktion später in ein CMS um, ändert sich nur diese
 * Datei – die Signaturen sind schon asynchron.
 */

/*
  Prüfung beim Laden des Moduls und damit bei jedem Build.

  Die Ausgaben schreibt eine Routine automatisch, ohne dass jemand darüberliest.
  Ein Fehler darin soll den Build abbrechen, statt still auf die Website zu
  gelangen – eine fehlende Ausgabe fällt auf, eine kaputte nicht.
*/
assertEditionsValid(editions, {
  topicSlugs: new Set(learnTopics.map((topic) => topic.slug)),
  symbols: new Set(marketDefinitions.map((definition) => definition.symbol)),
})

/** Neueste Ausgabe zuerst. */
function sortedEditions(): DailyEdition[] {
  return [...editions].sort((a, b) => b.date.localeCompare(a.date))
}

/** Alle Meldungen einer Ausgabe in Anzeigereihenfolge. */
export function allItems(edition: DailyEdition): EditionItem[] {
  return [...edition.top, ...edition.further]
}

/** Kennzahlen des Archivs – für die Zeile unter der Überschrift. */
export interface EditionStats {
  ausgaben: number
  meldungen: number
  /** Wenigste und meiste Meldungen einer einzelnen Ausgabe. */
  jeAusgabe: { min: number; max: number } | null
}

/**
 * Zählt das Archiv aus.
 *
 * Steht hier und nicht in der Seite, weil auf der Seite sonst wieder eine Zahl
 * im Text stünde. Genau das war der Fehler: „fünf Meldungen“ war einmal richtig
 * und blieb stehen, als es nicht mehr stimmte. Gezählte Zahlen veralten nicht.
 */
export async function getEditionStats(): Promise<EditionStats> {
  const alle = sortedEditions()
  const zahlen = alle.map((edition) => allItems(edition).length)

  return {
    ausgaben: alle.length,
    meldungen: zahlen.reduce((summe, wert) => summe + wert, 0),
    jeAusgabe: zahlen.length
      ? { min: Math.min(...zahlen), max: Math.max(...zahlen) }
      : null,
  }
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
