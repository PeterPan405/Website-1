import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { JsonLd } from '@/components/seo/JsonLd'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Icon } from '@/components/ui/Icon'
import { PageHeader } from '@/components/ui/PageHeader'
import { Reveal } from '@/components/ui/Reveal'
import { formatDate, formatMonthYearLong, formatReadingTime } from '@/lib/format'
import { collectionPageSchema } from '@/lib/jsonld'
import { getNewsByMonth } from '@/lib/news'
import { buildMetadata, withBrand } from '@/lib/seo'

/**
 * Ein Monat des Nachrichtenarchivs – alle Artikel, chronologisch absteigend.
 *
 * Aufbau wie die Rubrikseiten (eine Liste mit Datum, Lesezeit, Anriss), denn
 * beide beantworten dieselbe Art Frage mit anderem Schnitt: dort „alles zu
 * einem Thema“, hier „alles aus einer Zeit“. Zwei Register, eine Form.
 */

export async function generateStaticParams() {
  const monate = await getNewsByMonth()
  return monate.map((eintrag) => ({ monat: eintrag.monat }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ monat: string }>
}): Promise<Metadata> {
  const { monat } = await params
  const monate = await getNewsByMonth()
  const eintrag = monate.find((kandidat) => kandidat.monat === monat)
  if (!eintrag) return {}

  const name = formatMonthYearLong(`${monat}-01`)
  return buildMetadata({
    title: withBrand(`Nachrichten im ${name}`),
    description: `Alle ${eintrag.artikel.length} Artikel aus dem ${name} – Meldungen mit Lehrwinkel, dauerhaft nachlesbar im Archiv.`,
    path: `/news/monat/${monat}`,
  })
}

export default async function MonatsSeite({
  params,
}: {
  params: Promise<{ monat: string }>
}) {
  const { monat } = await params
  const monate = await getNewsByMonth()
  const index = monate.findIndex((kandidat) => kandidat.monat === monat)
  if (index === -1) notFound()

  const eintrag = monate[index]
  const name = formatMonthYearLong(`${monat}-01`)
  // Die Liste ist absteigend sortiert: „neuer“ steht vor diesem Monat.
  const neuer = monate[index - 1] ?? null
  const aelter = monate[index + 1] ?? null

  return (
    <>
      <PageHeader
        area="news"
        eyebrow="Archiv"
        eyebrowIcon="newspaper"
        title={name}
        lead={`Alle Artikel, die im ${name} erschienen sind – vollständig und dauerhaft. Die neuesten zuerst.`}
        breadcrumbs={
          <Breadcrumbs
            items={[
              { name: 'News', path: '/news' },
              { name: 'Monate', path: '/news/monat' },
              { name },
            ]}
          />
        }
        meta={
          <span>
            {eintrag.artikel.length}{' '}
            {eintrag.artikel.length === 1 ? 'Artikel' : 'Artikel'}
          </span>
        }
      />

      <div className="fk-container py-12 sm:py-16">
        <ul className="border-border border-t">
          {eintrag.artikel.map((artikel, position) => (
            <li key={artikel.slug}>
              <Reveal delay={Math.min(position, 12) * 0.03}>
                <Link
                  href={`/news/${artikel.slug}`}
                  className="border-border hover:bg-surface-subtle group block border-b px-2 py-5 transition-colors"
                >
                  <div className="text-fg-subtle flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
                    <span>{formatDate(artikel.publishedAt)}</span>
                    <span aria-hidden="true">·</span>
                    <span>{artikel.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{formatReadingTime(artikel.readingMinutes)}</span>
                  </div>
                  <h2 className="text-fg group-hover:text-news mt-1.5 text-lg font-semibold">
                    {artikel.title}
                  </h2>
                  <p className="text-fg-muted mt-1.5 max-w-3xl leading-relaxed">
                    {artikel.teaser}
                  </p>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>

        <nav
          aria-label="Benachbarte Monate"
          className="mt-10 flex flex-wrap items-center gap-3"
        >
          {aelter && (
            <Link
              href={`/news/monat/${aelter.monat}`}
              className="fk-btn-secondary text-sm"
            >
              <Icon name="arrow-left" className="size-4" />
              {formatMonthYearLong(`${aelter.monat}-01`)}
            </Link>
          )}
          {neuer && (
            <Link
              href={`/news/monat/${neuer.monat}`}
              className="fk-btn-secondary text-sm"
            >
              {formatMonthYearLong(`${neuer.monat}-01`)}
              <Icon name="arrow-right" className="size-4" />
            </Link>
          )}
          <Link
            href="/news/monat"
            className="text-news font-medium underline underline-offset-2"
          >
            Alle Monate
          </Link>
        </nav>
      </div>

      <JsonLd
        data={collectionPageSchema({
          name: `Nachrichten im ${name}`,
          description: `Alle Artikel aus dem ${name}.`,
          path: `/news/monat/${monat}`,
          items: eintrag.artikel.slice(0, 20).map((artikel) => ({
            name: artikel.title,
            path: `/news/${artikel.slug}`,
          })),
        })}
      />
    </>
  )
}
