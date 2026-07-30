import type { Metadata } from 'next'
import Link from 'next/link'

import { QuoteCard } from '@/components/markets/QuoteCard'
import { QuoteRow } from '@/components/markets/QuoteRow'
import { Stimmungskachel } from '@/components/markets/Stimmungskachel'
import { JsonLd } from '@/components/seo/JsonLd'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { SourceSummary } from '@/components/markets/SourceNote'
import { PageHeader } from '@/components/ui/PageHeader'
import { Reveal } from '@/components/ui/Reveal'
import { magnificentSeven } from '@/data/markets'
import { getBranchen } from '@/lib/branchen'
import { formatDate, formatDateTime } from '@/lib/format'
import { collectionPageSchema } from '@/lib/jsonld'
import {
  getFundamentalkennzahlen,
  getMarktstimmung,
  getQuotes,
  getSparkline,
} from '@/lib/markets'
import { buildMetadata, withBrand } from '@/lib/seo'

/**
 * Sortiert Aktien nach ihrem Börsenwert, den größten zuerst.
 *
 * ## Warum gerechnet und nicht aufgeschrieben
 *
 * Die Rangfolge der schwersten Werte ändert sich, und eine aufgeschriebene
 * veraltet still: In `data/markets.ts` stand Nvidia an erster Stelle und
 * Microsoft vor Alphabet. Beides war einmal richtig. Aufgefallen ist es erst,
 * als ein Leser es gemeldet hat – nicht der Website.
 *
 * Der Börsenwert liegt ohnehin vor: Er entsteht aus dem Kurs, der alle
 * dreißig Minuten neu abgerufen wird, und der Aktienzahl aus den
 * Pflichtmeldungen. Damit stimmt die Reihenfolge nach jedem Kursabruf von
 * selbst.
 *
 * ## Was passiert, wenn eine Zahl fehlt
 *
 * Wer keinen Börsenwert hat, steht hinten statt zu verschwinden – eine Aktie
 * ohne gemeldete Aktienzahl gehört trotzdem in die Übersicht. Untereinander
 * bleiben diese in der übergebenen Reihenfolge.
 *
 * ## Grenze: nur innerhalb einer Währung
 *
 * Der Börsenwert steht in der Währung des Unternehmensberichts. Ein Vergleich
 * über Währungen hinweg wäre damit schief – 4 Billionen Yen sind nicht mehr
 * als 3 Billionen Dollar. Für die sieben, um die es hier geht, melden alle in
 * Dollar. Wer diese Funktion auf eine gemischte Liste anwendet, muss vorher
 * umrechnen.
 */
async function sortiereNachBoersenwert<T extends { symbol: string }>(
  aktien: readonly T[]
): Promise<T[]> {
  const werte = await Promise.all(
    aktien.map(async (aktie) => {
      const befund = await getFundamentalkennzahlen(aktie.symbol)
      const wert =
        befund?.art === 'zahlen' ? befund.kennzahlen.marktkapitalisierung.wert : null
      return { aktie, wert: wert ?? -1 }
    })
  )
  return werte.sort((a, b) => b.wert - a.wert).map((eintrag) => eintrag.aktie)
}

export const metadata: Metadata = buildMetadata({
  title: withBrand('Märkte: Wechselkurse und Indizes'),
  description:
    'Wechselkurse und Aktienindizes mit Verlaufscharts und einer Erklärung, was jeder Kurs tatsächlich abbildet – vom DAX bis EUR/USD.',
  path: '/maerkte',
  ogTitle: 'Wechselkurse und Indizes im Überblick',
})

export default async function MarketsOverviewPage() {
  const [quotes, stimmungAktien, stimmungKrypto] = await Promise.all([
    getQuotes(),
    getMarktstimmung('aktien'),
    getMarktstimmung('krypto'),
  ])

  const branchenZahl = getBranchen().length

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
  const magSevenQuotes = await sortiereNachBoersenwert(
    magnificentSeven
      .map((symbol) => quotes.find((quote) => quote.symbol === symbol))
      .filter((quote): quote is (typeof quotes)[number] => Boolean(quote))
  )
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

        {/*
          Der Verweis aufs Tagesbild steht ganz oben, weil er die Frage
          beantwortet, mit der die meisten auf diese Seite kommen: Wie steht es
          heute? Ein Blick auf einzelne Kacheln beantwortet sie nicht.
        */}
        <p className="text-fg-muted mt-4 leading-relaxed">
          Wie breit sich der Markt heute bewegt – gezählt über alle{' '}
          {magSevenQuotes.length + stockQuotes.length} Einzelaktien:{' '}
          <Link
            href="/maerkte/tagesbild"
            className="text-markets font-medium underline underline-offset-2"
          >
            das Tagesbild
          </Link>
          .
        </p>

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
            {/*
              Die Stimmung als letzte Kachel der Reihe.

              Sie gehört zu den Indizes und nicht darüber: Sie beschreibt den
              Aktienmarkt als Ganzes, genau wie ein Index – nur mit einer
              anderen Größe. Über die volle Seitenbreite wirkte sie wie die
              Hauptaussage der Seite.
            */}
            {stimmungAktien && (
              <li>
                <Reveal delay={indexQuotes.length * 0.04} className="h-full">
                  <Stimmungskachel
                    stimmung={stimmungAktien}
                    titel="Angst und Gier am Aktienmarkt"
                    bereich="aktien"
                  />
                </Reveal>
              </li>
            )}
          </ul>
        </section>

        <section aria-labelledby="magnificent-seven" className="mt-16">
          <h2 id="magnificent-seven" className="text-fg text-2xl font-bold">
            Magnificent Seven
          </h2>
          <p className="text-fg-muted mt-2 max-w-2xl leading-relaxed">
            Die sieben schwersten Werte im S&amp;P 500, sortiert nach ihrem Börsenwert –
            Kurs mal Aktienzahl, gerechnet aus den aktuellen Kursen. Zusammen machen sie
            einen erheblichen Teil des Index aus und damit auch eines weltweit streuenden
            ETF. Wer breit gestreut anlegt, hält von diesen sieben Unternehmen meist
            deutlich mehr, als die Zahl der enthaltenen Titel vermuten lässt.
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
            {/* Eigener Maßstab, gleiche Kachelgröße: Zehn Prozent Abstand zum
                Halbjahrestrend sind hier ein ruhiger Monat. */}
            {stimmungKrypto && (
              <li>
                <Reveal delay={cryptoQuotes.length * 0.04} className="h-full">
                  <Stimmungskachel
                    stimmung={stimmungKrypto}
                    titel="Angst und Gier am Kryptomarkt"
                    bereich="krypto"
                  />
                </Reveal>
              </li>
            )}
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
          {/*
            Der Verweis auf die Branchen steht über der Liste, nicht darunter:
            Wer hier ankommt und über tausend Zeilen vor sich hat, sucht meistens
            keinen bestimmten Titel, sondern eine Gruppe. Unter der Liste hätte
            er den Hinweis erst nach dem Scrollen gefunden – also dann, wenn er
            ihn nicht mehr braucht.
          */}
          <p className="text-fg-muted mt-3 max-w-2xl leading-relaxed">
            Sortiert nach Geschäft statt nach Alphabet:{' '}
            <Link
              href="/maerkte/branchen"
              className="text-markets font-medium underline underline-offset-2"
            >
              die Aktien nach Branchen
            </Link>{' '}
            – {branchenZahl} Gruppen von Banken bis Versorger. Wer nur ein paar Titel
            verfolgt, legt sie auf die{' '}
            <Link
              href="/maerkte/merkliste"
              className="text-markets font-medium underline underline-offset-2"
            >
              Merkliste
            </Link>{' '}
            – sie bleibt im Browser und braucht kein Konto.
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
