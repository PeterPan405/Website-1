import type { Metadata } from 'next'
import Link from 'next/link'

import { JsonLd } from '@/components/seo/JsonLd'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { PageHeader } from '@/components/ui/PageHeader'
import { Reveal } from '@/components/ui/Reveal'
import {
  allItems,
  formatEditionDate,
  getEditionLibrary,
  getEditions,
} from '@/lib/editions'
import { collectionPageSchema } from '@/lib/jsonld'
import { buildMetadata, withBrand } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: withBrand('Tagesüberblick: Archiv aller Ausgaben'),
  description:
    'Alle bisher erschienenen Tagesüberblicke zum Nachlesen – jeden Morgen fünf Meldungen aus Wirtschaft und Finanzmärkten, nach Monaten geordnet.',
  path: '/news/tag',
  ogTitle: 'Archiv der Tagesüberblicke',
})

export default async function EditionLibraryPage() {
  const [library, editions] = await Promise.all([getEditionLibrary(), getEditions()])
  const itemCount = editions.reduce((sum, edition) => sum + allItems(edition).length, 0)

  return (
    <>
      <PageHeader
        area="news"
        eyebrow="Tagesüberblick"
        eyebrowIcon="newspaper"
        title="Alle Ausgaben zum Nachlesen"
        lead="Jeden Morgen erscheint eine Ausgabe mit fünf Meldungen, davon drei Top-Themen. Hier stehen alle bisherigen Tage – ältere Ausgaben verschwinden nicht."
        breadcrumbs={
          <Breadcrumbs
            items={[{ name: 'News', path: '/news' }, { name: 'Tagesüberblick' }]}
          />
        }
        meta={
          <>
            <span>
              {editions.length} {editions.length === 1 ? 'Ausgabe' : 'Ausgaben'}
            </span>
            <span aria-hidden="true">·</span>
            <span>{itemCount} Meldungen</span>
          </>
        }
      />

      <div className="fk-container py-12 sm:py-16">
        {library.length === 0 ? (
          <p className="text-fg-muted">Es ist noch keine Ausgabe erschienen.</p>
        ) : (
          library.map((month) => (
            <section
              key={month.key}
              aria-labelledby={`monat-${month.key}`}
              className="mb-12"
            >
              <h2
                id={`monat-${month.key}`}
                className="text-fg-subtle border-border border-b pb-2 text-xs font-semibold tracking-wide uppercase"
              >
                {month.label}
              </h2>
              <ul className="mt-5 grid gap-4 md:grid-cols-2">
                {month.editions.map((edition, index) => (
                  <li key={edition.date}>
                    <Reveal delay={index * 0.04} className="h-full">
                      <article className="fk-card-interactive h-full p-5">
                        <h3 className="text-base font-semibold">
                          <Link href={`/news/tag/${edition.date}`} className="block">
                            {/* Die ganze Karte ist klickbar – der Link deckt sie ab. */}
                            <span className="absolute inset-0" aria-hidden="true" />
                            {formatEditionDate(edition.date)}
                          </Link>
                        </h3>
                        <p className="text-fg-muted mt-2 text-sm">{edition.intro}</p>
                        <p className="text-fg-subtle mt-3 text-xs">
                          Top-Thema: {edition.top[0].headline}
                        </p>
                      </article>
                    </Reveal>
                  </li>
                ))}
              </ul>
            </section>
          ))
        )}
      </div>

      <JsonLd
        data={collectionPageSchema({
          name: 'Archiv der Tagesüberblicke',
          description:
            'Alle bisher erschienenen Tagesüberblicke von IM Invests, nach Monaten geordnet.',
          path: '/news/tag',
          items: editions.map((edition) => ({
            name: `Tagesüberblick ${formatEditionDate(edition.date, false)}`,
            path: `/news/tag/${edition.date}`,
          })),
        })}
      />
    </>
  )
}
