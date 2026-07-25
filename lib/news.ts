import { newsArticles, type NewsArticle, type NewsCategory } from '@/data/news'

/**
 * Service-Schicht für Nachrichten.
 *
 * Alle Funktionen sind asynchron, damit der Wechsel auf eine echte News-API
 * (oder ein CMS) keine Änderung an den aufrufenden Komponenten erfordert.
 */

export type { NewsArticle, NewsCategory } from '@/data/news'

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

export async function getNewsArticle(slug: string): Promise<NewsArticle | null> {
  return newsArticles.find((article) => article.slug === slug) ?? null
}

/** Für `generateStaticParams` und die Sitemap. */
export async function getNewsSlugs(): Promise<string[]> {
  return sortedArticles().map((article) => article.slug)
}

/** Kurzfassungen für Karussell und Teaser-Listen. */
export async function getNewsHeadlines(limit = 6): Promise<NewsHeadline[]> {
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
