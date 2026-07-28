import type { Metadata } from 'next'
import Link from 'next/link'

import { ArticleCard } from '@/components/news/ArticleCard'
import { JsonLd } from '@/components/seo/JsonLd'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { PageHeader } from '@/components/ui/PageHeader'
import { Reveal } from '@/components/ui/Reveal'
import { collectionPageSchema } from '@/lib/jsonld'
import { formatEditionDate, getEditions, getLatestEdition } from '@/lib/editions'
import {
  getCurrentNews,
  getFurtherNewsByDay,
  getNewsArticles,
  getNewsCategories,
} from '@/lib/news'
import { buildMetadata, withBrand } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: withBrand('Finanz-News: Meldungen mit Einordnung'),
  description:
    'Nachrichten zu Geldpolitik, Märkten, Vorsorge und Steuern – jeweils mit Erklärung, was die Meldung für Privatanleger konkret bedeutet.',
  path: '/news',
  ogTitle: 'Finanz-News mit Einordnung',
})

export default async function NewsOverviewPage() {
  const [articles, current, archivtage, categories, latestEdition, editions] =
    await Promise.all([
      getNewsArticles(),
      getCurrentNews(),
      getFurtherNewsByDay(),
      getNewsCategories(),
      getLatestEdition(),
      getEditions(),
    ])

  /*
    Der jüngste Artikel bekommt die große Karte, die übrigen aktuellen stehen
    darunter im Raster. „Weitere Artikel“ ist der Rest – wer dort landet,
    entscheidet allein das Alter (siehe `lib/news.ts`).
  */
  const [featured, ...moreCurrent] = current

  return (
    <>
      <PageHeader
        area="news"
        eyebrow="News"
        eyebrowIcon="newspaper"
        title="Nachrichten, die erklärt werden"
        lead="Eine Meldung allein hilft nicht weiter. Zu jedem Thema steht hier, welcher Mechanismus dahintersteckt und was daraus für die eigene Geldanlage folgt."
        breadcrumbs={<Breadcrumbs items={[{ name: 'News' }]} />}
        meta={
          <>
            <span>{articles.length} Artikel</span>
            <span aria-hidden="true">·</span>
            <span>{categories.length} Rubriken</span>
          </>
        }
      />

      <div className="fk-container py-12 sm:py-16">
        {/* Tagesüberblick zuerst: die Rubrik, die sich am häufigsten ändert. */}
        {latestEdition && (
          <section aria-labelledby="tagesueberblick" className="mt-10">
            <div className="fk-card border-news/30 p-6 sm:p-8">
              {/*
                Stand „Neueste Ausgabe“ statt „Jeden Morgen neu“: Der
                27. Juli 2026 hat eine Ausgabe, der 26. nicht. Ein Versprechen,
                das die eigene Archivseite widerlegt, ist keins.
              */}
              <p className="fk-chip bg-news-soft text-news">Neueste Ausgabe</p>
              <h2 id="tagesueberblick" className="mt-3 text-xl font-semibold sm:text-2xl">
                Tagesüberblick vom {formatEditionDate(latestEdition.date, false)}
              </h2>
              <p className="text-fg-muted mt-2 text-sm sm:text-base">
                {latestEdition.intro}
              </p>

              <ol className="mt-5 space-y-2">
                {latestEdition.top.map((item, index) => (
                  <li key={item.headline} className="flex gap-3 text-sm sm:text-base">
                    <span
                      className="text-news font-semibold tabular-nums"
                      aria-hidden="true"
                    >
                      {index + 1}
                    </span>
                    <span>{item.headline}</span>
                  </li>
                ))}
              </ol>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link href={`/news/tag/${latestEdition.date}`} className="fk-btn-primary">
                  Ausgabe lesen
                </Link>
                <Link href="/news/tag" className="fk-btn-secondary">
                  Archiv ({editions.length}{' '}
                  {editions.length === 1 ? 'Ausgabe' : 'Ausgaben'})
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Rubriken als Orientierung; eine echte Filterung folgt mit dem CMS. */}
        <section aria-labelledby="rubriken" className="mt-10">
          <h2 id="rubriken" className="sr-only">
            Rubriken
          </h2>
          <ul className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <li key={category} className="fk-chip bg-news-soft text-news">
                {category}
              </li>
            ))}
          </ul>
        </section>

        {featured && (
          <section aria-labelledby="aktuelles" className="mt-10">
            <h2
              id="aktuelles"
              className="text-fg-subtle text-xs font-semibold tracking-wide uppercase"
            >
              Aktuelles
            </h2>
            <div className="mt-5">
              <Reveal>
                <ArticleCard article={featured} featured />
              </Reveal>
            </div>

            {moreCurrent.length > 0 && (
              <ul className="mt-4 grid gap-4 md:grid-cols-2">
                {moreCurrent.map((article, index) => (
                  <li key={article.slug} className="relative">
                    <Reveal delay={index * 0.04} className="h-full">
                      <ArticleCard article={article} />
                    </Reveal>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {archivtage.length > 0 && (
          <section aria-labelledby="weitere" className="mt-12">
            <h2
              id="weitere"
              className="text-fg-subtle text-xs font-semibold tracking-wide uppercase"
            >
              Weitere Artikel
            </h2>
            <p className="text-fg-muted mt-2 max-w-2xl text-sm leading-relaxed">
              Nach Erscheinungstag geordnet. Das Archiv ist dauerhaft – kein Artikel fällt
              heraus.
            </p>

            {/*
              Aufgeklappt ist nur der jüngste Tag.

              Ohne das stünde hier eine Liste, die mit jedem Tag länger wird und
              nie wieder kürzer. Mit `<details>` statt eines Schalters bleibt es
              ohne JavaScript bedienbar, und die Browsersuche findet auch
              zugeklappte Einträge.
            */}
            <div className="mt-5 space-y-3">
              {archivtage.map((tag, tagIndex) => (
                <details
                  key={tag.datum}
                  open={tagIndex === 0}
                  className="fk-card group px-5 py-4 sm:px-6"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                    <span className="text-fg font-semibold">
                      {formatEditionDate(tag.datum)}
                    </span>
                    <span className="text-fg-subtle flex items-center gap-3 text-sm">
                      <span className="tabular-nums">
                        {tag.artikel.length}{' '}
                        {tag.artikel.length === 1 ? 'Artikel' : 'Artikel'}
                      </span>
                      <span
                        aria-hidden="true"
                        className="transition-transform group-open:rotate-90"
                      >
                        ›
                      </span>
                    </span>
                  </summary>

                  <ul className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {tag.artikel.map((article) => (
                      <li key={article.slug} className="relative">
                        <ArticleCard article={article} />
                      </li>
                    ))}
                  </ul>
                </details>
              ))}
            </div>
          </section>
        )}
      </div>

      <JsonLd
        data={collectionPageSchema({
          name: 'Finanz-News',
          description:
            'Nachrichten zu Geldpolitik, Märkten, Vorsorge und Steuern mit Einordnung für Privatanleger.',
          path: '/news',
          items: articles.map((article) => ({
            name: article.title,
            path: `/news/${article.slug}`,
          })),
        })}
      />
    </>
  )
}
