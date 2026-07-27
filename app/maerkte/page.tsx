import type { Metadata } from 'next'

import { QuoteCard } from '@/components/markets/QuoteCard'
import { QuoteRow } from '@/components/markets/QuoteRow'
import { JsonLd } from '@/components/seo/JsonLd'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { SourceSummary } from '@/components/markets/SourceNote'
import { PageHeader } from '@/components/ui/PageHeader'
import { Reveal } from '@/components/ui/Reveal'
import { magnificentSeven } from '@/data/markets'
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

  const fxQuotes = quotes.filter((quote) => quote.kind === 'fx')
  const indexQuotes = quotes.filter((quote) => quote.kind === 'index')
  const commodityQuotes = quotes.filter((quote) => quote.kind === 'commodity')
  const cryptoQuotes = quotes.filter((quote) => quote.kind === 'crypto')
  /*
    Die Magnificent Seven stehen getrennt von den übrigen Aktien.

    Nicht wegen ihrer Bekanntheit, sondern wegen ihres Gewichts: Zusammen
    machen sie einen erheblichen Teil des S&P 500 aus. Sie zwischen hundert
    andere Zeilen zu setzen, hieße genau die Konzentration zu verstecken, um
    die es geht.
  */
  const magSevenQuotes = magnificentSeven
    .map((symbol) => quotes.find((quote) => quote.symbol === symbol))
    .filter((quote): quote is (typeof quotes)[number] => Boolean(quote))
  const stockQuotes = quotes.filter(
    (quote) =>
      quote.kind === 'stock' &&
      !magnificentSeven.includes(quote.symbol as (typeof magnificentSeven)[number])
  )

  /*
    Mini-Verläufe nur für die Kachel-Abschnitte.

    Für die über hundert Einzelaktien wären es über hundert zusätzliche
    SVG-Verläufe auf einer Seite – ein Vielfaches an HTML für eine Grafik, die
    bei dieser Anzahl ohnehin niemand einzeln ansieht. Die Aktien stehen deshalb
    als kompakte Zeilen; ihren Verlauf gibt es auf der Detailseite.
  */
  const mitVerlauf = quotes.filter(
    (quote) =>
      quote.kind !== 'stock' ||
      magnificentSeven.includes(quote.symbol as (typeof magnificentSeven)[number])
  )
  const sparklines = await Promise.all(
    mitVerlauf.map(
      async (quote) => [quote.symbol, await getSparkline(quote.symbol)] as const
    )
  )
  const sparklineBySymbol = new Map(sparklines)

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
            <span>{cryptoQuotes.length} Kryptowährungen</span>
            <span aria-hidden="true">·</span>
            <span>{magSevenQuotes.length + stockQuotes.length} Einzelaktien</span>
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

        <section aria-labelledby="magnificent-seven" className="mt-16">
          <h2 id="magnificent-seven" className="text-fg text-2xl font-bold">
            Magnificent Seven
          </h2>
          <p className="text-fg-muted mt-2 max-w-2xl leading-relaxed">
            Die sieben schwersten Werte im S&amp;P 500. Zusammen machen sie einen
            erheblichen Teil des Index aus – und damit auch eines weltweit streuenden ETF.
            Wer breit gestreut anlegt, hält von diesen sieben Unternehmen meist deutlich
            mehr, als die Zahl der enthaltenen Titel vermuten lässt.
          </p>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {magSevenQuotes.map((quote, index) => (
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

        {/* Zuletzt, weil es der einzige Abschnitt ohne Kacheln ist: über
            hundert Zeilen am Stück würden jeden folgenden Abschnitt
            wegdrücken. Die Magnificent Seven stehen weiter oben, wo sie
            ihrem Gewicht nach hingehören. */}
        <section aria-labelledby="aktien" className="mt-16">
          <h2 id="aktien" className="text-fg text-2xl font-bold">
            Weitere Aktien
          </h2>
          <p className="text-fg-muted mt-2 max-w-2xl leading-relaxed">
            Einzelwerte aus den USA, Europa und Asien. Anders als ein Index trägt eine
            einzelne Aktie das Risiko genau dieses Unternehmens – dafür lässt sich an ihr
            nachvollziehen, was ein Geschäftsmodell für den Kurs bedeutet. Notiert wird in
            der Währung der jeweiligen Heimatbörse.
          </p>
          <ul className="border-border mt-6 grid gap-x-6 border-t sm:grid-cols-2 xl:grid-cols-3">
            {stockQuotes.map((quote) => (
              <li key={quote.symbol}>
                <QuoteRow quote={quote} />
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
