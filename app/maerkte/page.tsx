import type { Metadata } from 'next'

import { QuoteCard } from '@/components/markets/QuoteCard'
import { JsonLd } from '@/components/seo/JsonLd'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { DemoNotice } from '@/components/ui/DemoNotice'
import { PageHeader } from '@/components/ui/PageHeader'
import { Reveal } from '@/components/ui/Reveal'
import { formatDateTime } from '@/lib/format'
import { collectionPageSchema } from '@/lib/jsonld'
import { getQuotes, getSparkline } from '@/lib/markets'
import { buildMetadata, withBrand } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: withBrand('Märkte: Wechselkurse und Indizes'),
  description:
    'Wechselkurse und Aktienindizes mit Verlaufscharts und einer Erklärung, was jeder Kurs tatsächlich abbildet – vom DAX bis EUR/USD.',
  path: '/maerkte',
  ogTitle: 'Wechselkurse und Indizes im Überblick',
})

export default async function MarketsOverviewPage() {
  const quotes = await getQuotes()

  // Mini-Verläufe parallel laden, damit die Seite nicht seriell wartet.
  const sparklines = await Promise.all(
    quotes.map(async (quote) => [quote.symbol, await getSparkline(quote.symbol)] as const)
  )
  const sparklineBySymbol = new Map(sparklines)

  const fxQuotes = quotes.filter((quote) => quote.kind === 'fx')
  const indexQuotes = quotes.filter((quote) => quote.kind === 'index')
  const asOf = quotes[0]?.asOf

  return (
    <>
      <PageHeader
        area="markets"
        eyebrow="Märkte"
        eyebrowIcon="chart"
        title="Kurse, die auch erklärt werden"
        lead="Ein Indexstand von 24.000 Punkten sagt für sich genommen nichts. Auf jeder Detailseite steht deshalb, was der Kurs abbildet, was ihn bewegt und worauf du dabei achten solltest."
        breadcrumbs={<Breadcrumbs items={[{ name: 'Märkte' }]} />}
        meta={
          <>
            <span>{fxQuotes.length} Währungspaare</span>
            <span aria-hidden="true">·</span>
            <span>{indexQuotes.length} Indizes</span>
            {asOf && (
              <>
                <span aria-hidden="true">·</span>
                <span>Datenstand {formatDateTime(asOf)}</span>
              </>
            )}
          </>
        }
      />

      <div className="fk-container py-12 sm:py-16">
        <DemoNotice title="Demo-Kurse, keine echten Marktdaten">
          <p>
            Die Kursverläufe dieser Version werden aus festen Startwerten{' '}
            <strong className="text-fg font-semibold">rechnerisch erzeugt</strong>. Sie
            sehen realistisch aus, entsprechen aber keinen tatsächlichen Marktpreisen und
            sind für Anlageentscheidungen unbrauchbar.
          </p>
          <p>
            Die Datenzugriffe liegen hinter einer eigenen Service-Schicht (
            <code className="font-mono text-xs">lib/markets.ts</code>), sodass eine echte
            Kurs-API später eingesetzt werden kann, ohne eine einzige Seite anzupassen.
          </p>
        </DemoNotice>

        <section aria-labelledby="waehrungen" className="mt-12">
          <h2 id="waehrungen" className="text-fg text-2xl font-bold">
            Währungspaare
          </h2>
          <p className="text-fg-muted mt-2 max-w-2xl leading-relaxed">
            Ein Wechselkurs gibt an, wie viel der zweiten Währung eine Einheit der ersten
            kostet. Steigt EUR/USD, wird der Euro gegenüber dem Dollar stärker.
          </p>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {fxQuotes.map((quote, index) => (
              <li key={quote.symbol}>
                <Reveal delay={index * 0.04} className="h-full">
                  <QuoteCard
                    quote={quote}
                    sparkline={sparklineBySymbol.get(quote.symbol)}
                  />
                </Reveal>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="indizes" className="mt-16">
          <h2 id="indizes" className="text-fg text-2xl font-bold">
            Aktienindizes
          </h2>
          <p className="text-fg-muted mt-2 max-w-2xl leading-relaxed">
            Ein Index misst die Entwicklung eines festgelegten Korbs von Aktien. Sein
            Stand in Punkten ist kein Geldbetrag, sondern ein Vergleichswert gegenüber dem
            Startdatum.
          </p>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {indexQuotes.map((quote, index) => (
              <li key={quote.symbol}>
                <Reveal delay={index * 0.04} className="h-full">
                  <QuoteCard
                    quote={quote}
                    sparkline={sparklineBySymbol.get(quote.symbol)}
                  />
                </Reveal>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <JsonLd
        data={collectionPageSchema({
          name: 'Märkte – Wechselkurse und Indizes',
          description:
            'Übersicht über Wechselkurse und Aktienindizes mit Verlaufscharts und Erklärungen.',
          path: '/maerkte',
          items: quotes.map((quote) => ({
            name: quote.name,
            path: `/maerkte/${quote.symbol}`,
          })),
        })}
      />
    </>
  )
}
