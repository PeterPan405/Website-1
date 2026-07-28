import type { Metadata } from 'next'
import Link from 'next/link'

import { JsonLd } from '@/components/seo/JsonLd'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { PageHeader } from '@/components/ui/PageHeader'
import { Reveal } from '@/components/ui/Reveal'
import {
  formatEditionDate,
  getEditionLibrary,
  getEditionStats,
  getEditions,
} from '@/lib/editions'
import { collectionPageSchema } from '@/lib/jsonld'
import { buildMetadata, withBrand } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: withBrand('Tagesüberblick: Archiv aller Ausgaben'),
  description:
    'Alle bisher erschienenen Tagesüberblicke zum Nachlesen – die Meldungen des Tages aus Wirtschaft und Finanzmärkten, nach Monaten geordnet.',
  path: '/news/tag',
  ogTitle: 'Archiv der Tagesüberblicke',
})

export default async function EditionLibraryPage() {
  const [library, editions, stats] = await Promise.all([
    getEditionLibrary(),
    getEditions(),
    getEditionStats(),
  ])

  /*
    Der Umfang als gezählte Angabe, nicht als Versprechen im Fließtext.

    Sind alle Ausgaben gleich lang, steht dort eine Zahl; sobald sie es nicht
    mehr sind, von selbst eine Spanne. So kann die Zeile nicht falsch werden,
    ohne dass jemand daran denken muss.
  */
  const umfang = stats.jeAusgabe
    ? stats.jeAusgabe.min === stats.jeAusgabe.max
      ? `${stats.jeAusgabe.min} je Ausgabe`
      : `${stats.jeAusgabe.min} bis ${stats.jeAusgabe.max} je Ausgabe`
    : null

  return (
    <>
      <PageHeader
        area="news"
        eyebrow="Tagesüberblick"
        eyebrowIcon="newspaper"
        title="Alle Ausgaben zum Nachlesen"
        lead="Jede Ausgabe bündelt die Meldungen eines Tages, die wichtigsten zuerst. Wie viele es sind, gibt die Nachrichtenlage vor. Hier stehen alle bisherigen Tage, ältere Ausgaben verschwinden nicht."
        breadcrumbs={
          <Breadcrumbs
            items={[{ name: 'News', path: '/news' }, { name: 'Tagesüberblick' }]}
          />
        }
        meta={
          <>
            <span>
              {stats.ausgaben} {stats.ausgaben === 1 ? 'Ausgabe' : 'Ausgaben'}
            </span>
            <span aria-hidden="true">·</span>
            <span>{stats.meldungen} Meldungen</span>
            {umfang && (
              <>
                <span aria-hidden="true">·</span>
                <span>{umfang}</span>
              </>
            )}
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
