import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import type { EditionItem } from '@/lib/editions'

import { JsonLd } from '@/components/seo/JsonLd'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { PageHeader } from '@/components/ui/PageHeader'
import { Reveal } from '@/components/ui/Reveal'
import {
  formatEditionDate,
  getEdition,
  getEditionDates,
  getEditionNeighbours,
} from '@/lib/editions'
import { breadcrumbSchema, newsArticleSchema } from '@/lib/jsonld'
import { siteConfig } from '@/lib/site'
import { buildMetadata, withBrand } from '@/lib/seo'

interface PageProps {
  // In dieser Next-Version sind die Routen-Parameter ein Promise.
  params: Promise<{ datum: string }>
}

export async function generateStaticParams() {
  const dates = await getEditionDates()
  return dates.map((datum) => ({ datum }))
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { datum } = await props.params
  const edition = await getEdition(datum)
  if (!edition) {
    return buildMetadata({
      title: withBrand('Ausgabe nicht gefunden'),
      description:
        'Zu diesem Datum ist kein Tagesüberblick erschienen. Im Archiv stehen alle bisher veröffentlichten Ausgaben zum Nachlesen bereit.',
      path: `/news/tag/${datum}`,
      noIndex: true,
    })
  }

  const short = formatEditionDate(edition.date, false)
  return buildMetadata({
    title: withBrand(`Tagesüberblick ${short}`),
    description: edition.intro,
    path: `/news/tag/${edition.date}`,
    ogTitle: `Tagesüberblick ${short}`,
    type: 'article',
    publishedTime: `${edition.date}T06:00:00+02:00`,
  })
}

/** Eine einzelne Meldung. Top-Meldungen werden hervorgehoben. */
function Item({ item, top }: { item: EditionItem; top?: boolean }) {
  return (
    <article className={`fk-card p-5 sm:p-6 ${top ? 'border-news/30' : ''}`}>
      <p className="fk-chip bg-news-soft text-news">{item.category}</p>
      <h3 className="mt-3 text-lg font-semibold sm:text-xl">{item.headline}</h3>

      <div className="mt-3 space-y-3">
        {item.summary.map((paragraph) => (
          <p
            key={paragraph}
            className="text-fg-muted text-sm leading-relaxed sm:text-base"
          >
            {paragraph}
          </p>
        ))}
      </div>

      <div className="bg-surface-muted mt-4 rounded-xl p-4">
        <p className="text-fg-subtle text-xs font-semibold tracking-wide uppercase">
          Was das für dich bedeutet
        </p>
        <p className="text-fg mt-1.5 text-sm leading-relaxed">{item.whyItMatters}</p>
      </div>

      {item.relatedTopics.length > 0 && (
        <p className="mt-4 flex flex-wrap items-center gap-2 text-sm">
          <span className="text-fg-subtle">Dazu passend:</span>
          {item.relatedTopics.map((slug) => (
            <Link
              key={slug}
              href={`/lernen/${slug}`}
              className="text-brand font-medium hover:underline"
            >
              {slug.replace(/-/g, ' ')}
            </Link>
          ))}
        </p>
      )}

      <footer className="border-border mt-4 border-t pt-3">
        <p className="text-fg-subtle text-xs">
          {/*
            Verlinkung statt Übernahme: Die Zusammenfassung oben ist selbst
            geschrieben, die Quelle bleibt nachprüfbar und behält ihren Verkehr.
          */}
          Quellen:{' '}
          {item.sources.map((source, index) => (
            <span key={source.url}>
              {index > 0 && ', '}
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-fg underline"
              >
                {source.label}
              </a>
            </span>
          ))}
        </p>
      </footer>
    </article>
  )
}

export default async function EditionPage(props: PageProps) {
  const { datum } = await props.params
  const edition = await getEdition(datum)
  if (!edition) notFound()

  const { previous, next } = await getEditionNeighbours(edition.date)
  const short = formatEditionDate(edition.date, false)

  return (
    <>
      <PageHeader
        area="news"
        eyebrow="Tagesüberblick"
        eyebrowIcon="newspaper"
        title={formatEditionDate(edition.date)}
        lead={edition.intro}
        breadcrumbs={
          <Breadcrumbs
            items={[
              { name: 'News', path: '/news' },
              { name: 'Tagesüberblick', path: '/news/tag' },
              { name: short },
            ]}
          />
        }
        meta={
          <>
            <span>3 Top-Themen</span>
            <span aria-hidden="true">·</span>
            <span>5 Meldungen</span>
            <span aria-hidden="true">·</span>
            <Link href="/news/tag" className="hover:text-fg underline">
              Alle Ausgaben
            </Link>
          </>
        }
      />

      <div className="fk-container py-12 sm:py-16">
        <section aria-labelledby="top-themen">
          <h2 id="top-themen" className="text-xl font-semibold sm:text-2xl">
            Die drei wichtigsten Meldungen
          </h2>
          <ul className="mt-5 space-y-5">
            {edition.top.map((item, index) => (
              <li key={item.headline}>
                <Reveal delay={index * 0.05}>
                  <Item item={item} top />
                </Reveal>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="weitere-meldungen" className="mt-14">
          <h2 id="weitere-meldungen" className="text-xl font-semibold sm:text-2xl">
            Außerdem wichtig
          </h2>
          <ul className="mt-5 space-y-5">
            {edition.further.map((item, index) => (
              <li key={item.headline}>
                <Reveal delay={index * 0.05}>
                  <Item item={item} />
                </Reveal>
              </li>
            ))}
          </ul>
        </section>

        {/* Blättern durch das Archiv – nur anzeigen, was es tatsächlich gibt. */}
        <nav aria-label="Weitere Ausgaben" className="border-border mt-14 border-t pt-6">
          <ul className="flex flex-wrap justify-between gap-4">
            <li>
              {previous && (
                <Link href={`/news/tag/${previous.date}`} className="fk-btn-secondary">
                  <span aria-hidden="true">←</span>
                  {formatEditionDate(previous.date, false)}
                </Link>
              )}
            </li>
            <li>
              {next && (
                <Link href={`/news/tag/${next.date}`} className="fk-btn-secondary">
                  {formatEditionDate(next.date, false)}
                  <span aria-hidden="true">→</span>
                </Link>
              )}
            </li>
          </ul>
        </nav>
      </div>

      <JsonLd
        data={newsArticleSchema({
          headline: `Tagesüberblick ${short}`,
          description: edition.intro,
          path: `/news/tag/${edition.date}`,
          publishedAt: `${edition.date}T06:00:00+02:00`,
          section: 'Tagesüberblick',
          keywords: [...new Set(edition.top.map((item) => item.category))],
          author: siteConfig.name,
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Startseite', path: '/' },
          { name: 'News', path: '/news' },
          { name: 'Tagesüberblick', path: '/news/tag' },
          { name: short, path: `/news/tag/${edition.date}` },
        ])}
      />
    </>
  )
}
