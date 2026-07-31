import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { JsonLd } from '@/components/seo/JsonLd'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { PageHeader } from '@/components/ui/PageHeader'
import { Reveal } from '@/components/ui/Reveal'
import { formatDate, formatReadingTime } from '@/lib/format'
import { collectionPageSchema } from '@/lib/jsonld'
import { getNewsArticles } from '@/lib/news'
import { rubriken, rubrikFuerSlug } from '@/lib/rubriken'
import { buildMetadata, withBrand } from '@/lib/seo'

/**
 * Alle Artikel einer Rubrik.
 *
 * Fünf Seiten aus vorhandenen Daten. Was sie nebenbei sichtbar macht, ist
 * unbequem und deshalb nützlich: Die Verteilung über die Rubriken ist sehr
 * ungleich, und das steht jetzt an jeder einzelnen dran.
 */
export function generateStaticParams() {
  return rubriken.map((rubrik) => ({ kategorie: rubrik.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ kategorie: string }>
}): Promise<Metadata> {
  const { kategorie } = await params
  const rubrik = rubrikFuerSlug(kategorie)
  if (!rubrik) return {}

  return buildMetadata({
    title: withBrand(`${rubrik.name}: alle Artikel`),
    description: rubrik.beschreibung,
    path: `/news/rubrik/${rubrik.slug}`,
  })
}

export default async function RubrikSeite({
  params,
}: {
  params: Promise<{ kategorie: string }>
}) {
  const { kategorie } = await params
  const rubrik = rubrikFuerSlug(kategorie)
  if (!rubrik) notFound()

  const alle = await getNewsArticles()
  const artikel = alle.filter((eintrag) => eintrag.category === rubrik.name)

  return (
    <>
      <PageHeader
        area="news"
        eyebrow="Rubrik"
        eyebrowIcon="newspaper"
        title={rubrik.name}
        lead={rubrik.beschreibung}
        breadcrumbs={
          <Breadcrumbs items={[{ name: 'News', path: '/news' }, { name: rubrik.name }]} />
        }
        meta={
          <>
            <span>
              {artikel.length} von {alle.length} Artikeln
            </span>
            {artikel[0] && (
              <>
                <span aria-hidden="true">·</span>
                <span>zuletzt {formatDate(artikel[0].publishedAt)}</span>
              </>
            )}
          </>
        }
      />

      <div className="fk-container py-12 sm:py-16">
        <nav aria-label="Weitere Rubriken">
          <ul className="flex flex-wrap gap-2">
            {rubriken.map((eintrag) => (
              <li key={eintrag.slug}>
                <Link
                  href={`/news/rubrik/${eintrag.slug}`}
                  aria-current={eintrag.slug === rubrik.slug ? 'page' : undefined}
                  className={
                    eintrag.slug === rubrik.slug
                      ? 'fk-chip bg-news text-white'
                      : 'fk-chip bg-news-soft text-news hover:bg-news transition-colors hover:text-white'
                  }
                >
                  {eintrag.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {artikel.length === 0 ? (
          /*
            Eine leere Rubrik wird nicht versteckt.

            „Steuern & Recht“ hat derzeit keinen Artikel, „Vorsorge“ einen von
            fünfundvierzig. Die Seite trotzdem zu bauen und die Lücke zu
            benennen ist die ehrlichere Lösung – und die einzige, die dazu
            führt, dass jemand sie schließt.
          */
          <p className="text-fg-muted mt-10 max-w-2xl leading-relaxed">
            In dieser Rubrik steht noch kein Artikel. Das ist keine Aussage über die
            Wichtigkeit des Themas, sondern über das, was hier bisher geschrieben wurde –
            und sichtbar, damit es sich ändert.
          </p>
        ) : (
          <ul className="border-border mt-10 border-t">
            {artikel.map((eintrag, index) => (
              <li key={eintrag.slug}>
                <Reveal delay={Math.min(index, 12) * 0.03}>
                  <Link
                    href={`/news/${eintrag.slug}`}
                    className="border-border hover:bg-surface-subtle group block border-b px-2 py-5 transition-colors"
                  >
                    <div className="text-fg-subtle flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
                      <span>{formatDate(eintrag.publishedAt)}</span>
                      <span aria-hidden="true">·</span>
                      <span>{formatReadingTime(eintrag.readingMinutes)}</span>
                    </div>
                    <h2 className="text-fg group-hover:text-news mt-1.5 text-lg font-semibold">
                      {eintrag.title}
                    </h2>
                    <p className="text-fg-muted mt-1.5 max-w-3xl leading-relaxed">
                      {eintrag.teaser}
                    </p>
                  </Link>
                </Reveal>
              </li>
            ))}
          </ul>
        )}

        <p className="mt-10">
          <Link
            href="/news"
            className="text-news font-medium underline underline-offset-2"
          >
            Alle Nachrichten
          </Link>
        </p>
      </div>

      <JsonLd
        data={collectionPageSchema({
          name: `${rubrik.name} – Nachrichten`,
          description: rubrik.beschreibung,
          path: `/news/rubrik/${rubrik.slug}`,
          items: artikel.slice(0, 20).map((eintrag) => ({
            name: eintrag.title,
            path: `/news/${eintrag.slug}`,
          })),
        })}
      />
    </>
  )
}
