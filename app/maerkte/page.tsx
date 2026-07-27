import type { Metadata } from 'next'

import { QuoteCard } from '@/components/markets/QuoteCard'
import { JsonLd } from '@/components/seo/JsonLd'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { SourceSummary } from '@/components/markets/SourceNote'
import { PageHeader } from '@/components/ui/PageHeader'
import { Reveal } from '@/components/ui/Reveal'
import { formatDate, formatDateTime } from '@/lib/format'
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
  const commodityQuotes = quotes.filter((quote) => quote.kind === 'commodity')
  const cryptoQuotes = quotes.filter((quote) => quote.kind === 'crypto')
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
            <span>{indexQuotes.length} Indizes</span>
            <span aria-hidden="true">·</span>
            <span>{commodityQuotes.length} Rohstoffe</span>
            <span aria-hidden="true">·</span>
            <span>{fxQuotes.length} Währungspaare</span>
            <span aria-hidden="true">·</span>
            <span>{cryptoQuotes.length} Kryptowährung</span>
            {asOf && (
              <>
                <span aria-hidden="true">·</span>
                <span>
                  {quotes[0]?.intraday
                    ? `Stand ${formatDateTime(asOf)}`
                    : `Stand ${formatDate(asOf)}`}
                </span>
              </>
            )}
          </>
        }
      />

      <div className="fk-container py-12 sm:py-16">
        {/* Bewusst eine Zeile und kein Kasten: Herkunftsangaben sind Pflicht,
            aber sie sind nicht die Botschaft der Seite. */}
        <SourceSummary
          quotes={quotes}
          className="text-fg-subtle text-sm leading-relaxed"
        />

        <section aria-labelledby="indizes" className="mt-12">
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

        <section aria-labelledby="rohstoffe" className="mt-16">
          <h2 id="rohstoffe" className="text-fg text-2xl font-bold">
            Rohstoffe
          </h2>
          <p className="text-fg-muted mt-2 max-w-2xl leading-relaxed">
            Edelmetalle werden je Feinunze notiert – 31,1035 Gramm –, Rohöl je Fass zu 159
            Litern. Beides in US-Dollar: Wer in Euro rechnet, hat deshalb zwei Bewegungen
            im Preis, die des Rohstoffs und die des Wechselkurses. Anders als Aktien und
            Anleihen zahlen Rohstoffe keinen laufenden Ertrag – der gesamte Ertrag muss
            aus dem Preis kommen.
          </p>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {commodityQuotes.map((quote, index) => (
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

        <section aria-labelledby="waehrungen" className="mt-16">
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

        <section aria-labelledby="krypto" className="mt-16">
          <h2 id="krypto" className="text-fg text-2xl font-bold">
            Kryptowährungen
          </h2>
          <p className="text-fg-muted mt-2 max-w-2xl leading-relaxed">
            Gehandelt wird rund um die Uhr, auch an Wochenenden – einen Handelsschluss
            gibt es nicht. Anders als bei Aktien und Anleihen lässt sich hier kein Wert
            herleiten: Der Preis ergibt sich allein daraus, was der nächste Käufer zu
            zahlen bereit ist.
          </p>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cryptoQuotes.map((quote, index) => (
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
          name: 'Märkte – Indizes, Rohstoffe, Devisen und Krypto',
          description:
            'Übersicht über Aktienindizes, Rohstoffe, Wechselkurse und Kryptowährungen mit Verlaufscharts und Erklärungen.',
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
