import { marketKindMeta } from '@/data/markets'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { PriceChart } from '@/components/charts/PriceChart'
import { TopicLinkList } from '@/components/learn/TopicLinkList'
import { JsonLd } from '@/components/seo/JsonLd'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { SourceSummary } from '@/components/markets/SourceNote'
import { DemoNotice } from '@/components/ui/DemoNotice'
import { Icon } from '@/components/ui/Icon'
import { PageHeader } from '@/components/ui/PageHeader'
import { Stat, StatGrid } from '@/components/ui/Stat'
import { cn } from '@/lib/cn'
import {
  formatDateShort,
  formatDate,
  formatDateTime,
  formatNumber,
  formatNumberSigned,
  formatPercentSigned,
} from '@/lib/format'
import { datasetSchema } from '@/lib/jsonld'
import { getTopicsBySlugs } from '@/lib/learn'
import {
  getAllSeries,
  getDataCoverage,
  getInstrument,
  getInstrumentSymbols,
  getQuote,
  getQuotes,
} from '@/lib/markets'
import { buildMetadata, withBrand } from '@/lib/seo'

type MarketPageProps = { params: Promise<{ symbol: string }> }

export async function generateStaticParams() {
  const symbols = await getInstrumentSymbols()
  return symbols.map((symbol) => ({ symbol }))
}

export async function generateMetadata({ params }: MarketPageProps): Promise<Metadata> {
  const { symbol } = await params
  const instrument = await getInstrument(symbol)

  if (!instrument) {
    return buildMetadata({
      title: withBrand('Kurs nicht gefunden'),
      description: 'Der gesuchte Kurs ist auf dieser Plattform nicht verfügbar.',
      path: `/maerkte/${symbol}`,
      noIndex: true,
    })
  }

  const kindLabel = marketKindMeta[instrument.kind].short

  return buildMetadata({
    // Der Zusatz „aktuell … über 5 Jahre“ hebt kurze Ticker wie „DAX“ auf eine
    // für Suchergebnisse brauchbare Titellänge, ohne Füllwörter zu verwenden.
    title: `${instrument.ticker} aktuell: ${kindLabel}, Chart und Verlauf über 5 Jahre`,
    description: instrument.metaDescription,
    path: `/maerkte/${symbol}`,
    ogTitle: `${instrument.ticker} – ${instrument.name}`,
  })
}

export default async function MarketDetailPage({ params }: MarketPageProps) {
  const { symbol } = await params

  const [instrument, quote, ranges] = await Promise.all([
    getInstrument(symbol),
    getQuote(symbol),
    getAllSeries(symbol),
  ])

  if (!instrument || !quote || !ranges) notFound()

  const [relatedTopics, allQuotes, coverage] = await Promise.all([
    getTopicsBySlugs(instrument.relatedTopics),
    getQuotes(),
    getDataCoverage(),
  ])

  const positive = quote.changePercent >= 0
  const otherQuotes = allQuotes.filter((entry) => entry.symbol !== symbol).slice(0, 6)
  const kindLabel = marketKindMeta[instrument.kind].long

  return (
    <>
      <PageHeader
        area="markets"
        eyebrow={kindLabel}
        eyebrowIcon="chart"
        title={`${instrument.ticker} – ${instrument.name}`}
        lead={instrument.summary}
        breadcrumbs={
          <Breadcrumbs
            items={[{ name: 'Märkte', path: '/maerkte' }, { name: instrument.ticker }]}
          />
        }
        meta={
          <>
            <span className="text-fg text-lg font-bold tabular-nums">
              {formatNumber(quote.value, quote.decimals)} {instrument.unit}
            </span>
            <span
              className={cn(
                'flex items-center gap-1 font-semibold tabular-nums',
                positive ? 'text-success' : 'text-danger'
              )}
            >
              <Icon
                name={positive ? 'trending-up' : 'trending-down'}
                className="size-4"
              />
              {formatNumberSigned(quote.change, quote.decimals)} (
              {formatPercentSigned(quote.changePercent)})
            </span>
            <span aria-hidden="true">·</span>
            <span>
              {quote.source
                ? `Schluss ${formatDate(quote.asOf)}`
                : `Stand ${formatDateTime(quote.asOf)}`}
            </span>
          </>
        }
      />

      <div className="fk-container py-12 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div>
            {/* ------------------------------------------------ Kennzahlen */}
            <section aria-labelledby="kennzahlen">
              <h2 id="kennzahlen" className="text-fg text-2xl font-bold">
                Kennzahlen
              </h2>
              <StatGrid columns={4} className="mt-5">
                <Stat
                  label="Aktueller Stand"
                  value={`${formatNumber(quote.value, quote.decimals)}`}
                  hint={instrument.unit}
                />
                <Stat
                  label="Vortagesschluss"
                  value={formatNumber(quote.previousClose, quote.decimals)}
                  hint={`Veränderung ${formatPercentSigned(quote.changePercent)}`}
                  tone={positive ? 'positive' : 'negative'}
                />
                <Stat
                  label="52-Wochen-Hoch"
                  value={formatNumber(quote.high52w, quote.decimals)}
                  hint="Höchster Schlusskurs der letzten zwölf Monate"
                />
                <Stat
                  label="52-Wochen-Tief"
                  value={formatNumber(quote.low52w, quote.decimals)}
                  hint="Niedrigster Schlusskurs der letzten zwölf Monate"
                />
              </StatGrid>
              <StatGrid columns={2} className="mt-3">
                <Stat
                  label="Seit Jahresbeginn"
                  value={formatPercentSigned(quote.ytdPercent)}
                  tone={quote.ytdPercent >= 0 ? 'positive' : 'negative'}
                  hint="Gegenüber dem letzten Schlusskurs des Vorjahres"
                />
                <Stat
                  label="Abstand zum 52-Wochen-Hoch"
                  value={formatPercentSigned(
                    ((quote.value - quote.high52w) / quote.high52w) * 100
                  )}
                  hint="Wie weit der Kurs unter seinem Jahreshoch liegt"
                />
              </StatGrid>
            </section>

            {/* ----------------------------------------------------- Chart */}
            <section aria-labelledby="verlauf" className="mt-12">
              <h2 id="verlauf" className="text-fg text-2xl font-bold">
                Kursverlauf
              </h2>
              <p className="text-fg-muted mt-2 max-w-2xl leading-relaxed">
                Wähle den Zeitraum. Alle Zeiträume zeigen Tagesschlusskurse – einen Wert
                je Handelstag, keinen Verlauf innerhalb eines Tages.
              </p>
              <div className="fk-card mt-5 p-5 sm:p-6">
                <PriceChart
                  ranges={ranges}
                  decimals={instrument.decimals}
                  unit={instrument.unit}
                  ticker={instrument.ticker}
                />
              </div>
            </section>

            {/* ----------------------------------------------- Erklärung */}
            <section aria-labelledby="erklaerung" className="mt-12">
              <h2 id="erklaerung" className="text-fg text-2xl font-bold">
                Was {instrument.ticker} eigentlich abbildet
              </h2>
              <div className="text-fg-muted mt-4 space-y-4 leading-relaxed">
                {instrument.description.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </section>

            <div className="mt-10">
              {quote.source ? (
                <div className="rounded-card border-border bg-surface-muted border p-5 sm:p-6">
                  <SourceSummary quotes={[quote]} />
                  <p className="text-fg-subtle mt-2 text-xs">
                    Der Verlauf reicht vom {formatDateShort(coverage.from)} bis{' '}
                    {formatDateShort(coverage.to)}. Ältere Abschnitte sind auf einen Wert
                    je Woche verdichtet.
                  </p>
                </div>
              ) : (
                <DemoNotice title="Demo-Kurse">
                  <p>
                    Für dieses Instrument gibt es keine frei zugängliche Quelle. Der
                    gezeigte Verlauf ist{' '}
                    <strong className="text-fg font-semibold">rechnerisch erzeugt</strong>{' '}
                    und entspricht keinen echten Marktpreisen. Der Beispieldatensatz deckt
                    den Zeitraum vom {formatDateShort(coverage.from)} bis{' '}
                    {formatDateShort(coverage.to)} ab.
                  </p>
                </DemoNotice>
              )}
            </div>
          </div>

          {/* -------------------------------------------------- Seitenleiste */}
          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <TopicLinkList
              topics={relatedTopics}
              description="Was hinter diesem Kurs steckt – ausführlich erklärt."
            />

            <section aria-labelledby="weitere-kurse" className="fk-card p-6">
              <h2 id="weitere-kurse" className="text-fg text-lg font-semibold">
                Weitere Kurse
              </h2>
              <ul className="mt-4 space-y-1">
                {otherQuotes.map((entry) => {
                  const up = entry.changePercent >= 0
                  return (
                    <li key={entry.symbol}>
                      <Link
                        href={`/maerkte/${entry.symbol}`}
                        className="hover:bg-surface-muted flex items-center justify-between gap-3 rounded-xl p-2.5 transition"
                      >
                        <span className="min-w-0">
                          <span className="text-fg block text-sm font-semibold">
                            {entry.ticker}
                          </span>
                          <span className="text-fg-subtle block truncate text-xs">
                            {entry.name}
                          </span>
                        </span>
                        <span
                          className={cn(
                            'shrink-0 text-sm font-semibold tabular-nums',
                            up ? 'text-success' : 'text-danger'
                          )}
                        >
                          {formatPercentSigned(entry.changePercent)}
                        </span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
              <p className="mt-4">
                <Link href="/maerkte" className="fk-btn-ghost w-full">
                  Alle Kurse
                  <Icon name="arrow-right" className="size-4" />
                </Link>
              </p>
            </section>
          </aside>
        </div>
      </div>

      <JsonLd
        data={datasetSchema({
          name: `${instrument.ticker} Kursverlauf (Beispieldaten)`,
          description: `Verlaufsdaten für ${instrument.name}. ${instrument.summary}`,
          path: `/maerkte/${symbol}`,
          temporalCoverage: `${coverage.from}/${coverage.to}`,
          keywords: [instrument.ticker, instrument.name, kindLabel, 'Kursverlauf'],
        })}
      />
    </>
  )
}
