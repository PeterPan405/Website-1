import type { MetadataRoute } from 'next'

import { getAlleLektionen, getBereiche } from '@/lib/akademie'
import { calculators } from '@/data/calculators'
import { PHILOSOPHY_PUBLISHED } from '@/data/philosophy'

import { getLearnLevelParams, getLearnTopicSlugs } from '@/lib/learn'
import { getBranchen } from '@/lib/branchen'
import { getLernpfadSlugs } from '@/lib/lernpfade'
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
  const [
    newsArticles,
    latestNewsDate,
    symbols,
    topicSlugs,
    levelParams,
    editionDates,
    pfadSlugs,
  ] = await Promise.all([
    getNewsArticles(),
    getLatestNewsDate(),
    getInstrumentSymbols(),
    getLearnTopicSlugs(),
    getLearnLevelParams(),
    getEditionDates(),
    getLernpfadSlugs(),
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
    { url: absoluteUrl('/glossar'), changeFrequency: 'monthly', priority: 0.7 },
    { url: absoluteUrl('/quellen'), changeFrequency: 'monthly', priority: 0.3 },
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

  /*
    Die Branchenseiten ändern sich mit jedem Kursabruf – die Reihenfolge der
    Titel hängt an der Tagesveränderung. Der Bestand an Titeln dagegen ändert
    sich selten, deshalb `daily` und nicht `hourly`: Für eine Suchmaschine ist
    das die ehrlichere Angabe.
  */
  const branchenPages: MetadataRoute.Sitemap = [
    // Das Tagesbild rechnet sich mit jedem Kursabruf neu.
    { url: absoluteUrl('/maerkte/tagesbild'), changeFrequency: 'hourly', priority: 0.7 },
    { url: absoluteUrl('/maerkte/branchen'), changeFrequency: 'weekly', priority: 0.7 },
    ...getBranchen().map((branche) => ({
      url: absoluteUrl(`/maerkte/branchen/${branche.slug}`),
      changeFrequency: 'daily' as const,
      priority: 0.6,
    })),
  ]

  /*
    Die beiden Stimmungsseiten stehen fest und nicht in `symbols`.

    Sie hängen nicht an einem Instrument, sondern an einem Marktbereich –
    deshalb kommen sie nicht aus derselben Liste. Vergessen worden wären sie
    beinahe; gefunden hat es die Paketprüfung, die jede erreichbare Seite gegen
    die Sitemap hält.
  */
  const stimmungsPages: MetadataRoute.Sitemap = ['aktien', 'krypto'].map((bereich) => ({
    url: absoluteUrl(`/maerkte/stimmung/${bereich}`),
    changeFrequency: 'daily',
    priority: 0.6,
  }))

  /*
    Die Rechner kommen aus ihrer eigenen Liste.

    Hier standen sie zweimal – einmal in `data/calculators.ts` und einmal
    abgetippt an dieser Stelle. Der sechste Rechner hat die Doppelung sofort
    auffliegen lassen: Er war gebaut, verlinkt und gebaut worden, stand aber
    nicht in der Sitemap. Gemerkt hat es die Paketprüfung, nicht der Mensch.
  */
  const calculatorPages: MetadataRoute.Sitemap = calculators.map((rechner) => ({
    url: absoluteUrl(`/rechner/${rechner.slug}`),
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

  /*
    Die Akademie: Übersicht, zwei Bereiche, alle Lektionen.

    Abgeleitet und nicht abgetippt – aus demselben Grund wie bei den Rechnern
    einen Absatz weiter oben. Dort stand die Liste einmal von Hand da, und der
    sechste Rechner fehlte still in der Sitemap.
  */
  const akademiePages: MetadataRoute.Sitemap = [
    { url: absoluteUrl('/akademie'), changeFrequency: 'monthly', priority: 0.8 },
    ...getBereiche().map((bereich) => ({
      url: absoluteUrl(`/akademie/${bereich.id}`),
      changeFrequency: 'monthly' as const,
      priority: 0.75,
    })),
    ...getAlleLektionen().map((lektion) => ({
      url: absoluteUrl(`/akademie/${lektion.bereich}/${lektion.slug}`),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]

  const pfadPages: MetadataRoute.Sitemap = [
    { url: absoluteUrl('/lernen/pfade'), changeFrequency: 'monthly', priority: 0.8 },
    ...pfadSlugs.map((slug) => ({
      url: absoluteUrl(`/lernen/pfade/${slug}`),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]

  return [
    ...staticPages,
    ...akademiePages,
    ...pfadPages,
    ...topicPages,
    ...levelPages,
    ...calculatorPages,
    ...marketPages,
    ...branchenPages,
    ...stimmungsPages,
    ...newsPages,
    ...editionPages,
  ].map((entry) => ({ lastModified: buildDate, ...entry }))
}
