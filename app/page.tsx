import type { Metadata } from 'next'
import Link from 'next/link'
import type { ReactNode } from 'react'

import { QuoteRow } from '@/components/markets/QuoteRow'
import { Tagesfrage } from '@/components/markets/Tagesfrage'
import { SourceSummary } from '@/components/markets/SourceNote'
import { Icon } from '@/components/ui/Icon'
import { formatDate } from '@/lib/format'
import { gleicheGattung, tagesfrage } from '@/lib/tagesfrage'
import { getCompleteTopics, getLearnStats } from '@/lib/learn'
import { getMarketOverview, getQuotes } from '@/lib/markets'
import { getNewsHeadlines } from '@/lib/news'
import { folgenAdresse, getFolgen } from '@/lib/podcast'
import { buildMetadata } from '@/lib/seo'
import { LEARN_TOPIC_COUNT, RECHNER_ANZAHL_WORT, siteConfig } from '@/lib/site'

export const metadata: Metadata = buildMetadata({
  title: `${siteConfig.name} – Finanzen verstehen, Fehler vermeiden`,
  description: `Finanzwissen in drei Lernstufen: ${LEARN_TOPIC_COUNT} Themen in aufbauender Reihenfolge, ${RECHNER_ANZAHL_WORT} Rechner, Marktdaten und eingeordnete News – verständlich und ohne Verkaufsdruck.`,
  path: '/',
  ogTitle: `${siteConfig.name} – Finanzen verstehen, Fehler vermeiden`,
})

const calculatorTiles = [
  {
    href: '/rechner/zinsrechner',
    label: 'Zinsrechner',
  },
  {
    href: '/rechner/inflationsrechner',
    label: 'Inflationsrechner',
  },
  {
    href: '/rechner/rentenrechner',
    label: 'Rentenrechner',
  },
  {
    href: '/rechner/rentenluecke',
    label: 'Rentenlücke',
  },
  {
    href: '/rechner/haushaltsrechner',
    label: 'Haushaltsrechner',
  },
  {
    href: '/rechner/vermoegensuebersicht',
    label: 'Vermögensübersicht',
  },
]

export default async function HomePage() {
  const [headlines, marketPreviews, learnStats, completeTopics] = await Promise.all([
    // Ohne Angabe: genau die Meldungen, die auch unter „Aktuelles“ stehen.
    getNewsHeadlines(),
    getMarketOverview(),
    getLearnStats(),
    getCompleteTopics(),
  ])

  // Die jüngste Folge; alles Weitere steht unter /podcast.
  const podcastfolgen = getFolgen().slice(0, 1)

  const heute = new Date().toISOString().slice(0, 10)

  /*
    Die Tagesfrage – aus denselben Kursen, die auch die Kacheln zeigen.

    Vier Indizes, nie gemischt mit Aktien oder Rohstoffen: Sonst wäre die eine
    Aktie unter drei Indizes die auffällige Antwort. `tagesfrage()` verwirft
    die Frage, wenn die beiden besten Antworten zu dicht beieinander liegen –
    an einem ruhigen Tag steht deshalb keine da, und das ist der Punkt.
  */
  const frage = tagesfrage(
    gleicheGattung(
      (await getQuotes()).map((quote) => ({
        symbol: quote.symbol,
        name: quote.name,
        kind: quote.kind,
        changePercent: quote.changePercent,
        ytdPercent: quote.ytdPercent,
        value: quote.value,
        high52w: quote.high52w,
        asOf: quote.asOf,
      })),
      'index'
    ),
    heute
  )

  return (
    <>
      {/*
        Weniger, nicht anders (27.10.2026). Der Betreiber nach der Umstellung
        auf die IM-Capital-Sprache: „sieht immer noch nach sehr viel aus".
        Gestrichen ist, was sich doppelte oder nur begleitete: das Karussell
        (jetzt eine stille Liste), die Kursleiste über der Kursliste, die
        Vorspänne unter jeder Überschrift, „Heute vor einem Jahr" und der
        Begriff des Tages (beide stehen im Glossar bzw. auf den Kursseiten).
        Jeder Abschnitt: Überschrift, „Alle" rechts, eine Liste.
      */}
      <section className="fk-container pt-16 pb-12 lg:pt-24">
        <h1 className="text-fg text-4xl font-bold sm:text-5xl lg:text-6xl">
          <span className="block">Finanzen verstehen,</span>
          <span className="text-fg-muted block">Fehler vermeiden</span>
        </h1>
        <p className="text-fg-muted mt-6 max-w-xl text-lg">
          {learnStats.topicCount} Themen in drei Stufen, {RECHNER_ANZAHL_WORT} Rechner,
          Kurse und Nachrichten – jeweils mit Erklärung.
        </p>
        <div className="mt-8">
          <Link href="/lernen" className="fk-btn-primary">
            Lernbereich öffnen
            <Icon name="arrow-right" className="size-4" />
          </Link>
        </div>
      </section>

      {headlines.length > 0 && (
        <Abschnitt
          id="aktuell"
          titel="Aktuell"
          alle={{ href: '/news', text: 'Alle News' }}
        >
          <ul className="border-border border-t">
            {headlines.slice(0, 4).map((headline) => (
              <li key={headline.slug}>
                <Link
                  href={`/news/${headline.slug}`}
                  className="border-border group flex min-h-14 items-baseline gap-4 border-b py-3"
                >
                  <span className="text-fg-muted w-24 shrink-0 text-sm max-sm:hidden">
                    {headline.category}
                  </span>
                  <span className="text-fg min-w-0 flex-1 text-base font-semibold underline-offset-4 group-hover:underline">
                    {headline.title}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Abschnitt>
      )}

      <Abschnitt id="kurse" titel="Kurse" alle={{ href: '/maerkte', text: 'Alle Kurse' }}>
        <ul className="border-border grid gap-x-12 border-t sm:grid-cols-2 [&>li]:min-w-0">
          {marketPreviews.map(({ quote }) => (
            <li key={quote.symbol}>
              <QuoteRow quote={quote} />
            </li>
          ))}
        </ul>
        <SourceSummary
          quotes={marketPreviews.map((preview) => preview.quote)}
          className="text-fg-muted mt-4 text-xs"
        />
      </Abschnitt>

      <Abschnitt
        id="rechner"
        titel="Rechner"
        alle={{ href: '/rechner', text: 'Alle Rechner' }}
      >
        <ul className="border-border grid gap-x-12 border-t sm:grid-cols-2">
          {calculatorTiles.map((tile) => (
            <li key={tile.href}>
              <Verweiszeile href={tile.href}>{tile.label}</Verweiszeile>
            </li>
          ))}
        </ul>
      </Abschnitt>

      {completeTopics.length > 0 && (
        <Abschnitt
          id="lernen"
          titel="Womit man anfängt"
          alle={{ href: '/lernen', text: `Alle ${learnStats.topicCount} Themen` }}
        >
          <ul className="border-border grid gap-x-12 border-t sm:grid-cols-2">
            {completeTopics.slice(0, 6).map((topic) => (
              <li key={topic.slug}>
                <Verweiszeile href={`/lernen/${topic.slug}`}>{topic.title}</Verweiszeile>
              </li>
            ))}
          </ul>
        </Abschnitt>
      )}

      {/*
        Die Tagesfrage bleibt – sie ist das eine, was man auf der Startseite
        tut statt liest. Erscheint nur, wenn eine eindeutige Frage zustande kam.
      */}
      {frage && (
        <Abschnitt id="tagesfrage" titel="Frage des Tages">
          <Tagesfrage frage={frage} />
        </Abschnitt>
      )}

      {/* Die jüngste Folge; alles Weitere steht unter /podcast. */}
      {podcastfolgen.length > 0 && (
        <Abschnitt
          id="podcast"
          titel="Podcast"
          alle={{ href: '/podcast', text: 'Alle Folgen' }}
        >
          <ul className="border-border border-t">
            {podcastfolgen.map((folge) => (
              <li key={folge.slug}>
                <Link
                  href={folgenAdresse(folge)}
                  className="border-border group flex min-h-14 items-baseline gap-4 border-b py-3"
                >
                  <span className="text-fg-muted w-24 shrink-0 text-sm">
                    {folge.datum ? formatDate(folge.datum) : ''}
                  </span>
                  <span className="text-fg min-w-0 flex-1 text-base font-semibold underline-offset-4 group-hover:underline">
                    {folge.titel}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Abschnitt>
      )}

      {/*
        Der Absatz Haltung beschließt die Seite – auf Wunsch des Betreibers
        ans Ende verlegt. Seit dem 27.10.2026 ein Satz statt einer Bühne.
      */}
      <section aria-labelledby="haltung" className="fk-container py-16">
        <div className="border-border border-t pt-8">
          <h2 id="haltung" className="text-fg max-w-2xl text-xl font-bold">
            Geldanlage ist kein Geheimwissen, sondern ein Handwerk.
          </h2>
          <p className="text-fg-muted mt-2 max-w-2xl">
            Diese Seite verkauft nichts und empfiehlt kein Produkt. Jede Formel liegt
            offen, jede Zahl nennt Herkunft und Stand.{' '}
            <Link href="/ueber-uns" className="text-brand underline underline-offset-4">
              Wer dahintersteht
            </Link>
          </p>
        </div>
      </section>
    </>
  )
}

/**
 * Ein Abschnitt der Startseite: Haarlinie darüber, Überschrift 20 px/700,
 * „Alle …" rechts als leiser Verweis, darunter der Inhalt – kein Vorspann.
 */
function Abschnitt({
  id,
  titel,
  alle,
  children,
}: {
  id: string
  titel: string
  alle?: { href: string; text: string }
  children: ReactNode
}) {
  return (
    <section aria-labelledby={id} className="fk-container py-10">
      <div className="mb-4 flex items-baseline justify-between gap-4">
        <h2 id={id} className="text-fg text-xl font-bold">
          {titel}
        </h2>
        {alle && (
          <Link
            href={alle.href}
            className="text-fg-muted hover:text-fg flex items-center gap-1 text-sm font-medium"
          >
            {alle.text}
            <Icon name="chevron-right" className="size-4" />
          </Link>
        )}
      </div>
      {children}
    </section>
  )
}

/** Verweiszeile: Name links, Winkel rechts, Haarlinie darunter, 44 px hoch. */
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
