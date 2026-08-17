import type { Metadata } from 'next'
import Link from 'next/link'

import { BranchenHeatmap } from '@/components/markets/BranchenHeatmap'
import { Breitenverlauf } from '@/components/markets/Breitenverlauf'
import { QuoteRow } from '@/components/markets/QuoteRow'
import { SourceSummary } from '@/components/markets/SourceNote'
import { JsonLd } from '@/components/seo/JsonLd'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Callout } from '@/components/ui/Callout'
import { PageHeader } from '@/components/ui/PageHeader'
import { Stat, StatGrid } from '@/components/ui/Stat'
import { getBreiteneinordnung, getBreitenverlauf } from '@/lib/breitenverlauf'
import { formatDateTime, formatNumber, formatPercentSigned } from '@/lib/format'
import { collectionPageSchema } from '@/lib/jsonld'
import { baueMarktbericht, lagesatz } from '@/lib/marktbericht'
import { getQuotes } from '@/lib/markets'
import { buildMetadata, withBrand } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: withBrand('Das Tagesbild: der Markt in Zahlen'),
  description:
    'Wie viele der über tausend geführten Aktien heute steigen, welche Branche vorn liegt und wie breit die Bewegung getragen ist – gezählt, nicht gedeutet.',
  path: '/maerkte/tagesbild',
  ogTitle: 'Steigt der Markt – oder nur drei schwere Werte?',
})

export default async function TagesbildSeite() {
  const quotes = await getQuotes()
  const aktien = quotes.filter((quote) => quote.kind === 'stock')

  const bericht = baueMarktbericht(
    aktien.map((quote) => ({
      symbol: quote.symbol,
      ticker: quote.ticker,
      name: quote.name,
      veraenderung: quote.changePercent,
      branche: quote.branche ?? null,
    }))
  )
  if (!bericht) return null

  const nachSymbol = new Map(aktien.map((quote) => [quote.symbol, quote]))
  const stand = aktien[0]?.asOf

  /*
    Die Einordnung der heutigen Breite in den bisherigen Verlauf.

    Sie ist der eigentliche Zweck der Aufzeichnung: „49 Prozent“ bedeutet für
    sich genommen nichts. Solange zu wenig Geschichte da ist, sagt der Satz
    genau das, statt aus drei Tagen einen Maßstab zu machen.
  */
  const verlauf = getBreitenverlauf()
  const { einordnung, satz } = getBreiteneinordnung(
    bericht.breiteProzent,
    stand?.slice(0, 10)
  )

  return (
    <>
      <PageHeader
        area="markets"
        eyebrow="Tagesbild"
        eyebrowIcon="chart"
        title="Steigt der Markt – oder nur drei schwere Werte?"
        lead="Ein Index kann steigen, weil alles steigt, oder weil ein paar schwere Titel steigen und der Rest fällt. Am Indexstand sieht beides gleich aus. Diese Seite zählt nach: über alle Aktien, die hier geführt werden, jede mit demselben Gewicht."
        breadcrumbs={
          <Breadcrumbs
            items={[{ name: 'Märkte', path: '/maerkte' }, { name: 'Tagesbild' }]}
          />
        }
        meta={
          <>
            <span>{bericht.titel} Aktien</span>
            <span aria-hidden="true">·</span>
            <span>{lagesatz(bericht)}</span>
            {stand && (
              <>
                <span aria-hidden="true">·</span>
                <span>Stand {formatDateTime(stand)}</span>
              </>
            )}
          </>
        }
      />

      <div className="fk-container py-12 sm:py-16">
        <StatGrid>
          <Stat
            label="Im Plus"
            value={String(bericht.steigend)}
            tone="positive"
            hint={`von ${bericht.titel} Aktien`}
          />
          <Stat
            label="Im Minus"
            value={String(bericht.fallend)}
            tone="negative"
            hint={`${bericht.unveraendert} unverändert`}
          />
          <Stat
            label="Im Mittel"
            value={formatPercentSigned(bericht.schnitt)}
            tone={bericht.schnitt >= 0 ? 'positive' : 'negative'}
            hint="Ungewichtet – jede Aktie zählt gleich, unabhängig von ihrer Größe"
          />
          <Stat
            label="Breite"
            value={`${formatNumber(bericht.breiteProzent, 0)} %`}
            hint="Wie viele der bewegten Titel in die Richtung des Marktes gingen"
          />
        </StatGrid>

        <Callout variant="info" title="Was die Breite sagt" className="mt-8">
          <p>
            Sie ist die Zahl, die ein Indexstand verschweigt. Steigt der Markt um ein
            Prozent, weil neun von zehn Titeln steigen, ist das etwas anderes, als wenn er
            um ein Prozent steigt, weil drei Schwergewichte zulegen und sechs von zehn
            fallen. Das Erste ist eine Marktbewegung, das Zweite eine Bewegung in wenigen
            Aktien.
          </p>
          <p>
            Hier gilt: <strong>{lagesatz(bericht)}</strong>
          </p>
          {/*
            Der Vergleich mit den bisherigen Tagen. Er steht in derselben Box
            wie die Erklärung, weil er dieselbe Frage beantwortet: Was heißt
            diese Zahl?
          */}
          <p>{satz}</p>
        </Callout>

        {verlauf.length >= 2 && (
          <section aria-labelledby="breitenverlauf" className="mt-12">
            <h2 id="breitenverlauf" className="text-fg text-2xl font-bold">
              Wie breit der Markt zuletzt war
            </h2>
            <p className="text-fg-muted mt-2 max-w-2xl leading-relaxed">
              Aufgezeichnet wird beim Kursabruf, ein Wert je Handelstag. Die Reihe beginnt
              an dem Tag, an dem diese Aufzeichnung eingeführt wurde – sie reicht also
              nicht weiter zurück, als hier zu sehen ist, und das ist keine Aussage über
              den Markt vor dieser Zeit.
              {einordnung &&
                ` Über die bisherigen ${einordnung.tage} Tage liegt der Median bei ${Math.round(einordnung.median)} Prozent.`}
            </p>
            <Breitenverlauf reihe={verlauf} />
          </section>
        )}

        {bericht.branchen.length > 0 && (
          <section aria-labelledby="branchen" className="mt-12">
            <h2 id="branchen" className="text-fg text-2xl font-bold">
              Branchen des Tages
            </h2>
            <p className="text-fg-muted mt-2 max-w-2xl leading-relaxed">
              Der ungewichtete Schnitt je Branche als Farbfeld, stärkste zuerst – nur für
              Branchen mit mindestens vier Titeln. Eine Branche mit einem einzigen Titel
              ist keine Branchenbewegung, sondern eine Aktie. Die Tönung skaliert mit dem
              stärksten Ausschlag des Tages: An einem ruhigen Tag bleiben alle Felder
              blass.
            </p>
            <div className="mt-6">
              <BranchenHeatmap branchen={bericht.branchen} />
            </div>
          </section>
        )}

        <section aria-labelledby="ausschlaege" className="mt-12">
          <h2 id="ausschlaege" className="text-fg text-2xl font-bold">
            Die größten Ausschläge
          </h2>
          <p className="text-fg-muted mt-2 max-w-2xl leading-relaxed">
            Fünf nach oben, fünf nach unten. Ein einzelner großer Ausschlag hat fast immer
            einen Grund im Unternehmen – Quartalszahlen, eine Übernahme, eine Meldung.
            Welchen, steht hier nicht: Diese Seite zählt, sie recherchiert nicht.
          </p>
          <div className="mt-6 grid gap-8 sm:grid-cols-2">
            {[
              { titel: 'Nach oben', liste: bericht.gewinner },
              { titel: 'Nach unten', liste: bericht.verlierer },
            ].map((block) => (
              <div key={block.titel}>
                <h3 className="text-fg-subtle text-xs font-medium tracking-wide uppercase">
                  {block.titel}
                </h3>
                <ul className="border-border mt-3 border-t">
                  {block.liste.map((posten) => {
                    const quote = nachSymbol.get(posten.symbol)
                    return quote ? (
                      <li key={posten.symbol}>
                        <QuoteRow quote={quote} />
                      </li>
                    ) : null
                  })}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="abgrenzung" className="mt-12">
          <h2 id="abgrenzung" className="text-fg text-2xl font-bold">
            Was hier bewusst fehlt
          </h2>
          <div className="text-fg-muted mt-3 max-w-2xl space-y-4 leading-relaxed">
            <p>
              Jede Erklärung. Auf dieser Seite steht keine einzige Ursache – kein „wegen
              der Zinsentscheidung“, kein „nach schwachen Konjunkturdaten“. Solche Sätze
              lassen sich aus Kursen nicht ableiten, und wer sie trotzdem schreibt,
              behauptet einen Zusammenhang, den er nicht geprüft hat.
            </p>
            <p>
              Was recherchiert ist, steht bei den{' '}
              <Link
                href="/news"
                className="text-news font-medium underline underline-offset-2"
              >
                Nachrichten
              </Link>{' '}
              – mit benannten Quellen und einer Einordnung, die jemand verantwortet. Diese
              Seite hier rechnet, und sie rechnet mit jedem Kursabruf neu.
            </p>
          </div>
          <div className="border-border mt-8 border-t pt-5">
            <SourceSummary quotes={aktien} />
          </div>
        </section>
      </div>

      <JsonLd
        data={collectionPageSchema({
          name: 'Das Tagesbild: der Markt in Zahlen',
          description:
            'Wie viele Aktien steigen, welche Branchen vorn liegen und wie breit die Bewegung getragen ist.',
          path: '/maerkte/tagesbild',
          items: bericht.gewinner.map((posten) => ({
            name: posten.name,
            path: `/maerkte/${posten.symbol}`,
          })),
        })}
      />
    </>
  )
}
