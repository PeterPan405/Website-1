import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { ContentBlocks } from '@/components/content/ContentBlocks'
import { TopicLinkList } from '@/components/learn/TopicLinkList'
import { ArticleCard } from '@/components/news/ArticleCard'
import { JsonLd } from '@/components/seo/JsonLd'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Icon } from '@/components/ui/Icon'
import { PageHeader } from '@/components/ui/PageHeader'
import { TagLinks } from '@/components/ui/TagLinks'
import { formatDate, formatDateTime, formatNumber } from '@/lib/format'
import { newsArticleSchema } from '@/lib/jsonld'
import { getTopicsBySlugs } from '@/lib/learn'
import { absoluteUrl, siteConfig } from '@/lib/site'
import { getQuotes } from '@/lib/markets'
import { getNewsArticle, getNewsSlugs, getRelatedArticles } from '@/lib/news'
import { buildMetadata, withBrand } from '@/lib/seo'

type NewsPageProps = { params: Promise<{ slug: string }> }

/**
 * Alle Artikel werden zur Build-Zeit vorgerendert.
 *
 * Nachrichteninhalte müssen für Suchmaschinen vollständig im HTML stehen –
 * statische Generierung ist hier die zuverlässigste Variante.
 */
export async function generateStaticParams() {
  const slugs = await getNewsSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: NewsPageProps): Promise<Metadata> {
  const { slug } = await params
  const article = await getNewsArticle(slug)

  if (!article) {
    return buildMetadata({
      title: withBrand('Artikel nicht gefunden'),
      description: 'Der gesuchte Artikel existiert nicht oder wurde entfernt.',
      path: `/news/${slug}`,
      noIndex: true,
    })
  }

  return buildMetadata({
    // Redaktionelle Überschriften sind oft länger als das, was in
    // Suchergebnissen angezeigt wird – dann greift der kürzere metaTitle.
    title: article.metaTitle ?? article.title,
    description: article.teaser,
    // Die Social-Vorschau zeigt bewusst die volle Überschrift.
    ogTitle: article.title,
    path: `/news/${slug}`,
    type: 'article',
    publishedTime: article.publishedAt,
    modifiedTime: article.updatedAt,
    tags: article.tags,
  })
}

export default async function NewsArticlePage({ params }: NewsPageProps) {
  const { slug } = await params
  const article = await getNewsArticle(slug)

  if (!article) notFound()

  const [relatedTopics, relatedArticles, quotes] = await Promise.all([
    getTopicsBySlugs(article.relatedTopics),
    getRelatedArticles(slug, 3),
    getQuotes(article.relatedSymbols),
  ])

  return (
    <>
      <PageHeader
        area="news"
        eyebrow={article.category}
        eyebrowIcon="newspaper"
        title={article.title}
        lead={article.teaser}
        breadcrumbs={
          <Breadcrumbs
            items={[{ name: 'News', path: '/news' }, { name: article.title }]}
          />
        }
        meta={
          <>
            <span>{article.author}</span>
            <span aria-hidden="true">·</span>
            <time dateTime={article.publishedAt}>
              {formatDateTime(article.publishedAt)}
            </time>
            {article.updatedAt && (
              <>
                <span aria-hidden="true">·</span>
                <span>Aktualisiert am {formatDate(article.updatedAt)}</span>
              </>
            )}
            <span aria-hidden="true">·</span>
            <span>{article.readingMinutes} Min. Lesezeit</span>
          </>
        }
      />

      <div className="fk-container py-12 sm:py-16">
        <div className="grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,1fr)_20rem]">
          {/* --------------------------------------------------- Artikeltext */}
          {/*
            `min-w-0` ist hier nicht kosmetisch.

            Ein Rasterfeld darf sich standardmäßig nicht kleiner machen als
            sein Inhalt. Steht im Artikel eine breite Tabelle, wächst deshalb
            die Spalte mit – und zwar über den Bildschirmrand hinaus. Auf dem
            Handy zoomt der Browser die ganze Seite heraus, um sie
            unterzubringen: Der Text wird winzig, obwohl mit ihm nichts ist.

            Die Tabelle bringt ihren eigenen Scrollbereich mit. Der greift nur,
            wenn ihm jemand eine Grenze setzt, und das ist diese Zeile.
          */}
          <article className="min-w-0">
            <ContentBlocks blocks={article.body} />

            {/*
              Quellen direkt unter dem Text, nicht in der Seitenleiste.

              Die Zusammenfassung ist selbst geschrieben; nachprüfbar wird sie
              erst durch die Verlinkung. Deshalb steht sie im Lesefluss und
              nicht als Beiwerk daneben.
            */}
            <div className="border-border mt-10 border-t pt-6">
              <h2 className="text-fg-subtle text-xs font-semibold tracking-wide uppercase">
                Quellen
              </h2>
              <ul className="mt-3 space-y-2">
                {article.sources.map((source) => (
                  <li key={source.url} className="text-sm">
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-fg-muted hover:text-fg underline underline-offset-4"
                    >
                      {source.label}
                    </a>
                  </li>
                ))}
              </ul>
              <p className="text-fg-subtle mt-3 text-xs">
                Die Zusammenfassung ist redaktionell verfasst. Für die Inhalte verlinkter
                Seiten sind deren Betreiber verantwortlich.{' '}
                {/*
                  Der Meldeweg steht bei den Quellen, weil beides zusammen ein
                  Versprechen ist: Jede Zahl ist nachprüfbar – und wer beim
                  Nachprüfen einen Fehler findet, kann ihn ohne Umweg melden.
                  Betreff und Verweis sind vorausgefüllt; die Korrektur landet
                  dann als Vermerk am Artikel, nicht in einer stillen Änderung.
                */}
                <a
                  className="hover:text-fg underline underline-offset-4"
                  href={`mailto:${siteConfig.contactEmail}?subject=${encodeURIComponent(
                    `Fehler im Artikel: ${article.title}`
                  )}&body=${encodeURIComponent(
                    `Artikel: ${absoluteUrl(`/news/${article.slug}`)}\n\nWas ist falsch (Zahl, Aussage oder Quelle), und woran sieht man es?\n\n`
                  )}`}
                >
                  Fehler in diesem Artikel melden
                </a>
              </p>
            </div>

            {/*
              Der Änderungsvermerk, wenn es einen gibt.

              Er steht unter den Quellen und über den Schlagwörtern: nach dem,
              was den Artikel belegt, und vor dem, was ihn einordnet. Wer eine
              korrigierte Zahl im Kopf hat, soll sie an derselben Stelle
              wiederfinden, an der er die Quelle nachschlägt.

              Stillschweigend zu korrigieren wäre schlimmer als der Fehler
              selbst: Wer den Artikel vorher gelesen hat, trüge die alte Zahl
              weiter mit sich und erführe nie, dass sie überholt ist.
            */}
            {article.korrekturen && article.korrekturen.length > 0 && (
              <div className="border-border mt-10 border-t pt-6">
                <h2 className="text-fg-subtle text-xs font-semibold tracking-wide uppercase">
                  Was nach der Veröffentlichung geändert wurde
                </h2>
                <ul className="mt-3 space-y-2">
                  {article.korrekturen.map((korrektur) => (
                    <li
                      key={korrektur.am}
                      className="text-fg-muted text-sm leading-relaxed"
                    >
                      <time dateTime={korrektur.am} className="text-fg font-medium">
                        {formatDate(korrektur.am)}
                      </time>
                      {' – '}
                      {korrektur.was}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {article.tags.length > 0 && (
              <div className="border-border mt-10 border-t pt-6">
                <h2 className="text-fg-subtle text-xs font-semibold tracking-wide uppercase">
                  Schlagwörter
                </h2>
                <TagLinks
                  tags={article.tags}
                  note="Schlagwörter mit Pfeil führen zum passenden Lernthema, Kurs oder Rechner."
                />
              </div>
            )}

            <p className="mt-8">
              <Link href="/news" className="fk-btn-secondary">
                <Icon name="arrow-left" className="size-4" />
                Alle News
              </Link>
            </p>
          </article>

          {/* ------------------------------------------------------ Seitenleiste */}
          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <TopicLinkList
              topics={relatedTopics}
              description="Die Mechanismen hinter dieser Meldung – ausführlich erklärt."
            />

            {quotes.length > 0 && (
              <section aria-labelledby="passende-kurse" className="fk-card p-6">
                <h2 id="passende-kurse" className="text-fg text-lg font-semibold">
                  Passende Kurse
                </h2>
                <ul className="mt-4 space-y-2">
                  {quotes.map((quote) => (
                    <li key={quote.symbol}>
                      <Link
                        href={`/maerkte/${quote.symbol}`}
                        className="hover:bg-surface-muted flex items-center justify-between gap-3 rounded-xl p-2.5 transition"
                      >
                        <span className="text-fg text-sm font-semibold">
                          {quote.ticker}
                        </span>
                        <span className="text-fg-muted text-sm tabular-nums">
                          {formatNumber(quote.value, quote.decimals)}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <p className="text-fg-subtle mt-3 text-xs">
                  Tagesschlusskurse, keine Echtzeitdaten.
                </p>
              </section>
            )}
          </aside>
        </div>

        {relatedArticles.length > 0 && (
          <section aria-labelledby="weiterlesen" className="mt-16">
            <h2 id="weiterlesen" className="text-fg text-2xl font-bold">
              Weiterlesen
            </h2>
            <ul className="mt-6 grid gap-4 md:grid-cols-3">
              {relatedArticles.map((related) => (
                <li key={related.slug} className="relative">
                  <ArticleCard article={related} />
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      <JsonLd
        data={newsArticleSchema({
          headline: article.title,
          description: article.teaser,
          path: `/news/${article.slug}`,
          publishedAt: article.publishedAt,
          updatedAt: article.updatedAt,
          author: article.author,
          section: article.category,
          keywords: article.tags,
        })}
      />
    </>
  )
}
