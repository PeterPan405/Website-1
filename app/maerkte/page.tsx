import type { Metadata } from 'next'
import Link from 'next/link'
import type { ReactNode } from 'react'

import { QuoteRow } from '@/components/markets/QuoteRow'
import { JsonLd } from '@/components/seo/JsonLd'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Icon } from '@/components/ui/Icon'
import { PageHeader } from '@/components/ui/PageHeader'
import { magnificentSeven } from '@/data/markets'
import { collectionPageSchema } from '@/lib/jsonld'
import { getFundamentalkennzahlen, getQuotes, type MarketQuote } from '@/lib/markets'
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
  const quotes = await getQuotes()

  const art = (kind: MarketQuote['kind']) => quotes.filter((quote) => quote.kind === kind)
  /*
    Die Magnificent Seven stehen getrennt von den übrigen Aktien – nicht
    wegen ihrer Bekanntheit, sondern wegen ihres Gewichts im S&P 500.
  */
  const magSevenQuotes = await sortiereNachBoersenwert(
    magnificentSeven
      .map((symbol) => quotes.find((quote) => quote.symbol === symbol))
      .filter((quote): quote is MarketQuote => Boolean(quote))
  )
  const aktienZahl = art('stock').length

  /*
    Weniger, nicht anders (29.10.2026). Der Betreiber: „immer noch sehr
    unübersichtlich … deutlich gekürzt … im Trade-Republic-Style". Die Seite
    war 19.583 Pixel hoch, auf dem Telefon 52.124 – über tausend Aktienzeilen
    am Stück, ein Vorspann unter jeder Überschrift, acht Verweise über den
    Kursen und zwei Stimmungstachos, deren Zahl nicht stimmte (Aktien 71,
    Krypto 82 „extreme Gier", während der verbreitete Kryptoindex am selben
    Tag 51 „neutral" zeigte).

    Jetzt: je Abschnitt Überschrift und Liste, die ersten Zeilen offen, der
    Rest hinter „Alle …". Die Einzelaktien stehen nach Branchen, im Screener
    und in den Auswertungen – nicht als Wand auf der Übersicht.
  */
  const abschnitte: { id: string; titel: string; liste: MarketQuote[]; offen: number }[] =
    [
      { id: 'indizes', titel: 'Indizes', liste: art('index'), offen: 8 },
      {
        id: 'magnificent-seven',
        titel: 'Magnificent Seven',
        liste: magSevenQuotes,
        offen: 8,
      },
      { id: 'etfs', titel: 'ETFs', liste: art('etf'), offen: 6 },
      { id: 'rohstoffe', titel: 'Rohstoffe', liste: art('commodity'), offen: 6 },
      { id: 'waehrungen', titel: 'Währungen', liste: art('fx'), offen: 6 },
      { id: 'krypto', titel: 'Krypto', liste: art('crypto'), offen: 6 },
    ]

  return (
    <>
      <PageHeader
        area="markets"
        eyebrow="Märkte"
        eyebrowIcon="chart"
        title="Kurse"
        breadcrumbs={<Breadcrumbs items={[{ name: 'Märkte' }]} />}
      />

      <div className="fk-container pb-16">
        {/* Die Abschnitte als Leiste zum Springen – wie die Reiter einer App. */}
        <nav aria-label="Abschnitte" className="-mx-1 overflow-x-auto">
          <ul className="flex gap-2 px-1 pb-1">
            {[...abschnitte, { id: 'aktien', titel: 'Aktien' }].map((a) => (
              <li key={a.id} className="shrink-0">
                <a
                  href={`#${a.id}`}
                  className="bg-surface-muted text-fg hover:bg-border inline-flex min-h-9 items-center rounded-full px-4 text-sm font-semibold transition-colors"
                >
                  {a.titel}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {abschnitte
          .filter((a) => a.liste.length > 0)
          .map((a) => (
            <Abschnitt key={a.id} id={a.id} titel={a.titel}>
              <Kursliste quotes={a.liste.slice(0, a.offen)} />
              {a.liste.length > a.offen && (
                <details className="group">
                  <summary className="text-fg-muted hover:text-fg flex min-h-11 cursor-pointer list-none items-center gap-1 text-sm font-medium [&::-webkit-details-marker]:hidden">
                    <span className="group-open:hidden">
                      Alle {a.liste.length} anzeigen
                    </span>
                    <span className="hidden group-open:inline">Weniger anzeigen</span>
                    <Icon
                      name="chevron-right"
                      className="size-4 transition group-open:rotate-90"
                    />
                  </summary>
                  <Kursliste quotes={a.liste.slice(a.offen)} />
                </details>
              )}
            </Abschnitt>
          ))}

        <Abschnitt id="aktien" titel="Aktien">
          <ul className="border-border grid gap-x-12 border-t sm:grid-cols-2">
            {[
              {
                href: '/maerkte/branchen',
                text: `Alle ${aktienZahl} Aktien nach Branchen`,
              },
              { href: '/maerkte/screener', text: 'Screener' },
              { href: '/maerkte/52-wochen', text: '52 Wochen' },
              { href: '/maerkte/dividenden', text: 'Dividenden' },
              { href: '/maerkte/vergleich', text: 'Vergleich' },
              { href: '/maerkte/merkliste', text: 'Merkliste' },
            ].map((ziel) => (
              <li key={ziel.href}>
                <Verweiszeile href={ziel.href}>{ziel.text}</Verweiszeile>
              </li>
            ))}
          </ul>
        </Abschnitt>

        <Abschnitt id="auswertungen" titel="Auswertungen">
          <ul className="border-border grid gap-x-12 border-t sm:grid-cols-2">
            {[
              { href: '/maerkte/tagesbild', text: 'Tagesbild' },
              { href: '/maerkte/zusammenhang', text: 'Zusammenhang und Schwankung' },
              { href: '/maerkte/saisonalitaet', text: 'Saisonalität' },
              {
                href: '/maerkte/waehrungen-im-weltindex',
                text: 'Währungen im Weltindex',
              },
              { href: '/maerkte/klumpenrisiko', text: 'Klumpenrisiko' },
              { href: '/maerkte/handelsfreie-tage', text: 'Handelsfreie Tage' },
            ].map((ziel) => (
              <li key={ziel.href}>
                <Verweiszeile href={ziel.href}>{ziel.text}</Verweiszeile>
              </li>
            ))}
          </ul>
        </Abschnitt>
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

/** Ein Abschnitt: Überschrift 20 px/700, darunter die Liste – kein Vorspann. */
function Abschnitt({
  id,
  titel,
  children,
}: {
  id: string
  titel: string
  children: ReactNode
}) {
  return (
    <section aria-labelledby={id} className="mt-10 scroll-mt-24">
      <h2 id={id} className="text-fg mb-3 text-xl font-bold">
        {titel}
      </h2>
      {children}
    </section>
  )
}

/**
 * Kurszeilen in zwei Spalten. `[&>li]:min-w-0` – ohne das schiebt sich die
 * Seite auf dem Telefon (Mindestbreite einer Kurszeile 389 px bei 375 px
 * Fenster; geprüft von `npm run breite`).
 */
function Kursliste({ quotes }: { quotes: MarketQuote[] }) {
  return (
    <ul className="border-border grid gap-x-12 border-t sm:grid-cols-2 [&>li]:min-w-0">
      {quotes.map((quote) => (
        <li key={quote.symbol}>
          <QuoteRow quote={quote} />
        </li>
      ))}
    </ul>
  )
}

/** Verweiszeile: Name links, Winkel rechts, Haarlinie darunter. */
function Verweiszeile({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="border-border group flex min-h-12 items-center justify-between gap-4 border-b py-2.5"
    >
      <span className="text-fg text-base font-semibold underline-offset-4 group-hover:underline">
        {children}
      </span>
      <Icon name="chevron-right" className="text-fg-muted size-4 shrink-0" />
    </Link>
  )
}
