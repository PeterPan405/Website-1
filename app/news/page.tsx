import type { Metadata } from 'next'

import { ArticleCard } from '@/components/news/ArticleCard'
import { JsonLd } from '@/components/seo/JsonLd'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { DemoNotice } from '@/components/ui/DemoNotice'
import { PageHeader } from '@/components/ui/PageHeader'
import { Reveal } from '@/components/ui/Reveal'
import { collectionPageSchema } from '@/lib/jsonld'
import { getNewsArticles, getNewsCategories } from '@/lib/news'
import { buildMetadata, withBrand } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: withBrand('Finanz-News: Meldungen mit Einordnung'),
  description:
    'Nachrichten zu Geldpolitik, Märkten, Vorsorge und Steuern – jeweils mit Erklärung, was die Meldung für Privatanleger konkret bedeutet.',
  path: '/news',
  ogTitle: 'Finanz-News mit Einordnung',
})

export default async function NewsOverviewPage() {
  const [articles, categories] = await Promise.all([
    getNewsArticles(),
    getNewsCategories(),
  ])

  const [featured, ...rest] = articles

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
        <DemoNotice>
          <p>
            Die Artikel in dieser Version sind{' '}
            <strong className="text-fg font-semibold">erfundene Beispieltexte</strong>.
            Sie zeigen Aufbau, Verlinkung und strukturierte Daten der Nachrichtenseiten –
            sie berichten nicht über tatsächliche Ereignisse.
          </p>
        </DemoNotice>

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
          <section aria-labelledby="aktuell" className="mt-10">
            <h2 id="aktuell" className="sr-only">
              Aktuellster Artikel
            </h2>
            <Reveal>
              <ArticleCard article={featured} featured />
            </Reveal>
          </section>
        )}

        {rest.length > 0 && (
          <section aria-labelledby="weitere" className="mt-12">
            <h2
              id="weitere"
              className="text-fg-subtle text-xs font-semibold tracking-wide uppercase"
            >
              Weitere Artikel
            </h2>
            <ul className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {rest.map((article, index) => (
                <li key={article.slug} className="relative">
                  <Reveal delay={index * 0.04} className="h-full">
                    <ArticleCard article={article} />
                  </Reveal>
                </li>
              ))}
            </ul>
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
