import type { MetadataRoute } from 'next'

import { PHILOSOPHY_PUBLISHED } from '@/data/philosophy'

import { getLearnLevelParams, getLearnTopicSlugs } from '@/lib/learn'
import { getEditionDates } from '@/lib/editions'
import { getInstrumentSymbols } from '@/lib/markets'
import { getLatestNewsDate, getNewsArticles } from '@/lib/news'
import { absoluteUrl } from '@/lib/site'

/**
 * sitemap.xml – wird von Next.js aus dieser Datei generiert.
 *
 * Enthält alle Unterseiten inklusive der dynamischen Routen: News-Artikel,
 * Marktseiten, Lernthemen und jede der drei Lernstufen pro Thema. Die Liste
 * wird aus derselben Service-Schicht gespeist wie die Seiten selbst – dadurch
 * kann keine neue Seite versehentlich in der Sitemap fehlen.
 *
 * Die Datei entsteht beim Build und wird als statische Datei ausgeliefert, nicht
 * pro Anfrage erzeugt – Voraussetzung für den statischen Export.
 */
export const dynamic = 'force-static'

/** Bezugszeitpunkt für Seiten ohne eigenes Änderungsdatum. */
const buildDate = new Date()

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [newsArticles, latestNewsDate, symbols, topicSlugs, levelParams, editionDates] =
    await Promise.all([
      getNewsArticles(),
      getLatestNewsDate(),
      getInstrumentSymbols(),
      getLearnTopicSlugs(),
      getLearnLevelParams(),
      getEditionDates(),
    ])

  const staticPages: MetadataRoute.Sitemap = [
    { url: absoluteUrl('/'), changeFrequency: 'daily', priority: 1 },
    { url: absoluteUrl('/lernen'), changeFrequency: 'weekly', priority: 0.9 },
    { url: absoluteUrl('/rechner'), changeFrequency: 'monthly', priority: 0.9 },
    { url: absoluteUrl('/maerkte'), changeFrequency: 'hourly', priority: 0.8 },
    {
      url: absoluteUrl('/news'),
      lastModified: new Date(latestNewsDate),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      // Das Archiv wächst mit jeder Ausgabe – der jüngste Tag ist der Änderungsstand.
      url: absoluteUrl('/news/tag'),
      lastModified: editionDates[0] ? new Date(editionDates[0]) : buildDate,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: absoluteUrl('/globus'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      // Termine laufen ab und kommen dazu – häufiger als die Länderdaten.
      url: absoluteUrl('/kalender'),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: absoluteUrl('/staatsverschuldung'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    { url: absoluteUrl('/ueber-uns'), changeFrequency: 'yearly', priority: 0.4 },
    // Die Philosophie-Seite erscheint erst in der Sitemap, wenn ihr Text steht –
    // sonst würde eine noindex-Seite zur Indexierung angemeldet.
    ...(PHILOSOPHY_PUBLISHED
      ? ([
          {
            url: absoluteUrl('/unternehmensphilosophie'),
            changeFrequency: 'yearly' as const,
            priority: 0.5,
          },
        ] satisfies MetadataRoute.Sitemap)
      : []),
    { url: absoluteUrl('/kontakt'), changeFrequency: 'yearly', priority: 0.4 },
    { url: absoluteUrl('/impressum'), changeFrequency: 'yearly', priority: 0.2 },
    { url: absoluteUrl('/datenschutz'), changeFrequency: 'yearly', priority: 0.2 },
  ]

  const newsPages: MetadataRoute.Sitemap = newsArticles.map((article) => ({
    url: absoluteUrl(`/news/${article.slug}`),
    lastModified: new Date(article.updatedAt ?? article.publishedAt),
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  const editionPages: MetadataRoute.Sitemap = editionDates.map((date) => ({
    url: absoluteUrl(`/news/tag/${date}`),
    lastModified: new Date(date),
    // Eine erschienene Ausgabe wird nicht mehr geändert.
    changeFrequency: 'never',
    priority: 0.6,
  }))

  const marketPages: MetadataRoute.Sitemap = symbols.map((symbol) => ({
    url: absoluteUrl(`/maerkte/${symbol}`),
    changeFrequency: 'hourly',
    priority: 0.6,
  }))

  const calculatorPages: MetadataRoute.Sitemap = [
    'zinsrechner',
    'inflationsrechner',
    'rentenrechner',
    'rentenluecke',
    'haushaltsrechner',
  ].map((slug) => ({
    url: absoluteUrl(`/rechner/${slug}`),
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  const topicPages: MetadataRoute.Sitemap = topicSlugs.map((slug) => ({
    url: absoluteUrl(`/lernen/${slug}`),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  const levelPages: MetadataRoute.Sitemap = levelParams.map(({ thema, stufe }) => ({
    url: absoluteUrl(`/lernen/${thema}/${stufe}`),
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  return [
    ...staticPages,
    ...topicPages,
    ...levelPages,
    ...calculatorPages,
    ...marketPages,
    ...newsPages,
    ...editionPages,
  ].map((entry) => ({ lastModified: buildDate, ...entry }))
}
