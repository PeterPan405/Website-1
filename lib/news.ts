import { newsArticles, type NewsArticle, type NewsCategory } from '@/data/news'

import { assertNewsValid } from '@/lib/news-validate'

/**
 * Service-Schicht für Nachrichten.
 *
 * Alle Funktionen sind asynchron, damit der Wechsel auf eine echte News-API
 * (oder ein CMS) keine Änderung an den aufrufenden Komponenten erfordert.
 */

export type { NewsArticle, NewsCategory, NewsSource } from '@/data/news'

/*
  Prüfung beim Laden des Moduls und damit bei jedem Build.

  Nachrichten werden schnell geschrieben und schnell ausgetauscht. Ein Artikel
  ohne Quelle oder mit einem Themen-Slug, den es nicht gibt, soll den Build
  abbrechen statt still online zu gehen.
*/
assertNewsValid(newsArticles)

/**
 * Wie viele Artikel unter „Aktuelles“ stehen.
 *
 * Das ist die ganze Mechanik des rollierenden Systems: Die fünf jüngsten
 * Artikel stehen vorne, alles Ältere rutscht in „Weitere Artikel“. Kommt eine
 * neue Meldung dazu, verschiebt sich die Grenze von selbst.
 *
 * Bewusst nach Rang und nicht nach Uhrzeit („alles aus den letzten 48
 * Stunden“): Die Website wird statisch gebaut, das „jetzt“ wäre also der
 * Zeitpunkt des letzten Builds. Nach ein paar Tagen ohne neue Ausgabe wäre der
 * Bereich „Aktuelles“ dann leer – und eine leere Startseite ist schlimmer als
 * eine mit Meldungen von vorgestern. Die 48 Stunden sind die redaktionelle
 * Vorgabe für die Recherche, nicht die technische Anzeigelogik.
 */
export const CURRENT_NEWS_COUNT = 5

/**
 * Reduzierte Artikel-Darstellung ohne Fließtext.
 *
 * Das Karussell auf der Startseite ist eine Client-Komponente. Bekäme sie die
 * vollständigen Artikel, landete jeder Artikeltext im JavaScript-Bundle. Diese
 * Variante enthält nur, was für Überschrift und Verlinkung nötig ist.
 */
export interface NewsHeadline {
  slug: string
  title: string
  teaser: string
  category: NewsCategory
  publishedAt: string
  readingMinutes: number
}

function byNewestFirst(a: NewsArticle, b: NewsArticle): number {
  return Date.parse(b.publishedAt) - Date.parse(a.publishedAt)
}

function sortedArticles(): NewsArticle[] {
  return [...newsArticles].sort(byNewestFirst)
}

function toHeadline(article: NewsArticle): NewsHeadline {
  return {
    slug: article.slug,
    title: article.title,
    teaser: article.teaser,
    category: article.category,
    publishedAt: article.publishedAt,
    readingMinutes: article.readingMinutes,
  }
}

/** Alle Artikel, neueste zuerst. */
export async function getNewsArticles(limit?: number): Promise<NewsArticle[]> {
  const articles = sortedArticles()
  return typeof limit === 'number' ? articles.slice(0, limit) : articles
}

/**
 * Die aktuellen Meldungen – der vordere Teil des rollierenden Systems.
 *
 * Dieselbe Auswahl steht auf der Startseite und oben auf der News-Übersicht.
 */
export async function getCurrentNews(): Promise<NewsArticle[]> {
  return sortedArticles().slice(0, CURRENT_NEWS_COUNT)
}

/**
 * Alles, was aus „Aktuelles“ herausgerutscht ist.
 *
 * Kein eigenes Kennzeichen in den Daten: Was hier landet, ergibt sich allein
 * aus der Reihenfolge. Ein Artikel wandert also von selbst nach hinten, sobald
 * fünf neuere existieren.
 */
export async function getFurtherNews(): Promise<NewsArticle[]> {
  return sortedArticles().slice(CURRENT_NEWS_COUNT)
}

export async function getNewsArticle(slug: string): Promise<NewsArticle | null> {
  return newsArticles.find((article) => article.slug === slug) ?? null
}

/** Für `generateStaticParams` und die Sitemap. */
export async function getNewsSlugs(): Promise<string[]> {
  return sortedArticles().map((article) => article.slug)
}

/** Kurzfassungen für Karussell und Teaser-Listen. */
export async function getNewsHeadlines(
  limit = CURRENT_NEWS_COUNT
): Promise<NewsHeadline[]> {
  return sortedArticles().slice(0, limit).map(toHeadline)
}

/** Vorhandene Kategorien in der Reihenfolge ihres ersten Auftretens. */
export async function getNewsCategories(): Promise<NewsCategory[]> {
  return [...new Set(sortedArticles().map((article) => article.category))]
}

/**
 * Passende weitere Artikel.
 *
 * Priorität haben Artikel derselben Kategorie; danach wird mit den aktuellsten
 * übrigen aufgefüllt, damit immer die gewünschte Anzahl zurückkommt.
 */
export async function getRelatedArticles(
  slug: string,
  limit = 3
): Promise<NewsArticle[]> {
  const current = await getNewsArticle(slug)
  if (!current) return []

  const others = sortedArticles().filter((article) => article.slug !== slug)
  const sameCategory = others.filter((article) => article.category === current.category)
  const rest = others.filter((article) => article.category !== current.category)

  return [...sameCategory, ...rest].slice(0, limit)
}

/** Zeitpunkt der jüngsten Veröffentlichung – für `lastModified` in der Sitemap. */
export async function getLatestNewsDate(): Promise<string> {
  return sortedArticles()[0]?.publishedAt ?? new Date().toISOString()
}
