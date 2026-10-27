import type { Metadata } from 'next'
import Link from 'next/link'

import { NewsCarousel } from '@/components/home/NewsCarousel'
import { QuoteRow } from '@/components/markets/QuoteRow'
import { Tagesfrage } from '@/components/markets/Tagesfrage'
import { SourceSummary } from '@/components/markets/SourceNote'
import { Icon } from '@/components/ui/Icon'
import { SectionHeading } from '@/components/ui/PageHeader'
import { Reveal } from '@/components/ui/Reveal'
import {
  findeGeschichte,
  geschichtssatz,
  geschichtsvorspann,
} from '@/lib/boersengeschichte'
import { cn } from '@/lib/cn'
import { formatDate, formatNumber, formatPercentSigned } from '@/lib/format'
import { begriffDesTages } from '@/lib/begriff-des-tages'
import { gleicheGattung, tagesfrage } from '@/lib/tagesfrage'
import { getGlossar } from '@/lib/glossar'
import { getCompleteTopics, getLearnStats } from '@/lib/learn'
import { getInstrument, getMarketOverview, getQuotes, getSeries } from '@/lib/markets'
import { getNewsHeadlines } from '@/lib/news'
import { folgenAdresse, folgenDauer, getFolgen, kurzfassung } from '@/lib/podcast'
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
    hint: 'Zinseszins mit Sparplan – zeigt, wie viel vom Ergebnis aus Erträgen stammt.',
  },
  {
    href: '/rechner/inflationsrechner',
    label: 'Inflationsrechner',
    hint: 'Was von einem Betrag nach Jahren an Kaufkraft übrig bleibt.',
  },
  {
    href: '/rechner/rentenrechner',
    label: 'Rentenrechner',
    hint: 'Grobe Schätzung des Alterseinkommens über Rentenpunkte.',
  },
  {
    href: '/rechner/rentenluecke',
    label: 'Rentenlücke',
    hint: 'Bedarf gegen Erwartung – und die nötige monatliche Sparrate.',
  },
  {
    href: '/rechner/haushaltsrechner',
    label: 'Haushaltsrechner',
    hint: 'Einnahmen, Ausgaben und deine tatsächliche Sparquote.',
  },
  {
    href: '/rechner/vermoegensuebersicht',
    label: 'Vermögensübersicht',
    hint: 'Besitz und Schulden erfassen, Nettovermögen ausrechnen – als PDF zum Abheften.',
  },
]

/**
 * Die Instrumente, in deren Reihen nach dem Jahrestag gesucht wird.
 *
 * Breit gestreute Indizes, Gold, Öl und Bitcoin – Werte, deren Tagesbewegung
 * für sich spricht. Einzelaktien bleiben draußen: Ein Kurssprung nach
 * Quartalszahlen ist keine Marktgeschichte, sondern eine Unternehmensmeldung.
 */
const GESCHICHTS_SYMBOLE = [
  'dax',
  'sp500',
  'nasdaq-100',
  'euro-stoxx-50',
  'nikkei-225',
  'gold',
  'brent',
  'bitcoin',
] as const

export default async function HomePage() {
  const [headlines, marketPreviews, learnStats, completeTopics] = await Promise.all([
    // Ohne Angabe: genau die Meldungen, die auch unter „Aktuelles“ stehen.
    getNewsHeadlines(),
    getMarketOverview(),
    getLearnStats(),
    getCompleteTopics(),
  ])

  // Die drei jüngsten Folgen; alles Weitere steht unter /podcast.
  const podcastfolgen = getFolgen().slice(0, 3)

  /*
    „Heute“ ist der Tag des Baus – und das ist hier richtig so: Die Website
    wird täglich neu gebaut (Paketbau 04:15 UTC), die Kachel wandert also
    jeden Tag von selbst weiter. Beim Kalender wäre dieselbe Annahme falsch,
    weil dort Zukunft von Vergangenheit zu trennen ist; hier geht es um den
    Kalendertag, und der stimmt nach jedem Bau.
  */
  const geschichtsquellen = await Promise.all(
    GESCHICHTS_SYMBOLE.map(async (symbol) => {
      const [instrument, punkte] = await Promise.all([
        getInstrument(symbol),
        getSeries(symbol, '5J'),
      ])
      return { symbol, name: instrument?.name ?? symbol, punkte }
    })
  )
  const heute = new Date().toISOString().slice(0, 10)
  const geschichte = findeGeschichte(geschichtsquellen, heute)

  /*
    Der Begriff des Tages – aus demselben „heute" wie die Geschichtskachel.

    Beim Bauen gerechnet und nicht im Browser: Sonst zeigte die ausgelieferte
    Seite einen Begriff und der Browser einen anderen, und beim Laden blitzte
    der Wechsel auf. Der Tag des Baus genügt, weil die Website mehrmals täglich
    neu entsteht.
  */
  const begriff = begriffDesTages(await getGlossar(), heute)

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
      {/* ------------------------------------------------------------ Hero */}
      {/*
        Der Hero steht wie alles andere auf dem grauen Grund – kein weißer
        Kasten, kein Blur-Fleck. Die Bühne macht der Weißraum.
      */}
      <section>
        <div className="fk-container grid items-center gap-10 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
          <div>
            {/*
              Stille Dachzeile statt farbiger Pille: Eine Kapsel über der
              Überschrift ist das erste, was nach Baukasten aussieht – die
              Information trägt auch eine gesperrte Kleinzeile.
            */}

            {/*
              Zwei Zeilen, erzwungen über `block` statt über einen Umbruch nach
              Platz. Der Gleichklang lebt davon, dass „Finanzen“ und „Fehler“
              untereinander stehen und die Anfangsbuchstaben eine Achse bilden –
              bei automatischem Umbruch wäre das von der Fensterbreite abhängig.
            */}
            {/*
              Halbfett statt fett und enger gesperrt: In dieser Größe wirkt
              das volle Fettgewicht plump; die Eleganz kommt aus Größe und
              Laufweite, nicht aus Schwärze.
            */}
            <h1 className="text-fg mt-5 text-4xl font-semibold tracking-[-0.03em] sm:text-5xl lg:text-6xl">
              <span className="block">Finanzen verstehen,</span>
              {/*
                Volle Farbe statt Farbverlauf: Verlaufs-Schrift ist das
                Erkennungszeichen generierter Startseiten. Das Navy allein
                setzt denselben Akzent, nur ruhiger.
              */}
              <span className="text-brand block">Fehler vermeiden</span>
            </h1>

            <p className="text-fg-muted mt-6 max-w-xl text-lg leading-relaxed sm:text-xl">
              {learnStats.topicCount} Finanzthemen, jeweils in den Stufen Beginner,
              Fortgeschritten und Profi. Dazu {RECHNER_ANZAHL_WORT} Rechner mit
              offengelegter Methodik, Marktdaten mit Erklärung und Nachrichten, die
              eingeordnet werden – statt nur gemeldet.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/lernen" className="fk-btn-primary">
                Lernbereich öffnen
                <Icon name="arrow-right" className="size-4" />
              </Link>
              <Link href="/rechner/zinsrechner" className="fk-btn-secondary">
                <Icon name="calculator" className="size-4" />
                Zinsrechner ausprobieren
              </Link>
            </div>
          </div>

          {/* Die drehende News-Säule. */}
          <NewsCarousel headlines={headlines} />
        </div>

        {/*
          Die Ticker-Zeile: die Leitwerte des Tages in einer Haarlinien-Leiste,
          jede Zahl ein Verweis auf ihre Detailseite. Kein Laufband – die Werte
          stehen, auf schmalen Schirmen wird die Zeile seitlich geschoben.
          `data-fliesst`, weil sich die Zahlen mit jedem Bau ändern.
        */}
        <div className="border-border border-y" data-fliesst="">
          <ul className="fk-container flex [scrollbar-width:none] items-center gap-8 overflow-x-auto py-3 whitespace-nowrap [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {marketPreviews.slice(0, 8).map(({ quote }) => (
              <li key={quote.symbol} className="shrink-0">
                <Link
                  href={`/maerkte/${quote.symbol}`}
                  className="group flex items-baseline gap-2"
                >
                  <span className="text-fg-subtle group-hover:text-fg text-[0.7rem] font-semibold transition">
                    {quote.ticker}
                  </span>
                  <span className="text-fg text-sm font-medium tabular-nums">
                    {formatNumber(quote.value, quote.decimals)}
                  </span>
                  <span
                    className={cn(
                      'text-xs font-medium tabular-nums',
                      quote.changePercent >= 0 ? 'text-success' : 'text-danger'
                    )}
                  >
                    {formatPercentSigned(quote.changePercent)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/*
        Hier stand bis zum 27.10.2026 „Sieben Bereiche, ein Ziel“ – eine Liste
        der Menüpunkte, die zwei Zentimeter darüber schon im Kopf stehen. Der
        Betreiber: „die ganze Seite ein wenig minimalistischer … ordentlich
        strukturiert und übersichtlich“.
      */}
      {/* -------------------------------------------------------- Märkte */}
      {/*
        Keine weißen Bänder mehr zwischen den Abschnitten: Auf dem
        durchgehenden grauen Grund lägen weiße Karten in einem weißen Band
        unsichtbar. Den Rhythmus machen Abstand und Zwischenüberschriften.
      */}
      <section aria-labelledby="kurse" className="py-14 sm:py-20">
        <div className="fk-container">
          <SectionHeading
            id="kurse"
            eyebrow="Märkte"
            title="Kurse mit Erklärung"
            lead="Zu jedem Kurs steht dabei, was er eigentlich abbildet – ein Indexstand allein sagt wenig."
            action={
              <Link href="/maerkte" className="fk-btn-secondary">
                Alle Kurse
                <Icon name="arrow-right" className="size-4" />
              </Link>
            }
          />

          {/*
            Zeilen statt Karten (27.10.2026): Acht gerahmte Kacheln mit
            Kennzeichen, Kurve und Unterzeile waren der dichteste Kasten-Block
            der Startseite. Als Kursliste – wie im Wirtschaftsteil einer
            Zeitung – steht dieselbe Auskunft auf einem Drittel der Fläche;
            die Kurve gibt es auf der Seite jedes Kurses.
          */}
          <ul className="border-border mt-8 grid gap-x-12 border-t sm:grid-cols-2">
            {marketPreviews.map(({ quote }) => (
              <li key={quote.symbol}>
                <QuoteRow quote={quote} />
              </li>
            ))}
          </ul>

          <SourceSummary
            quotes={marketPreviews.map((preview) => preview.quote)}
            className="text-fg-subtle mt-6 text-sm leading-relaxed"
          />

          {/*
            Heute vor X Jahren – der auffälligste Handelstag zum Kalendertag,
            gerechnet aus den Reihen, die ohnehin im Bestand liegen. Die
            Kachel ändert sich täglich von selbst; `data-fliesst` nimmt sie
            deshalb aus dem Bildvergleich, wie jede andere Stelle mit
            beweglichen Zahlen.
          */}
          {geschichte && (
            <div data-fliesst="" className="border-border mt-10 border-l-2 pl-5">
              <p className="text-fg-subtle text-[0.8125rem] font-semibold">
                {geschichtsvorspann(geschichte)}
              </p>
              <p className="text-fg mt-2 leading-relaxed">
                {geschichtssatz(geschichte)}{' '}
                <span className="text-fg-muted">
                  Am {formatDate(geschichte.datum)} – angekündigt hatte das niemand.
                  Solche Tage ballen sich, und wer sie mit Markttiming umgehen will,
                  verpasst regelmäßig auch die besten.
                </span>
              </p>
              <p className="mt-3 text-sm">
                <Link
                  href={`/maerkte/${geschichte.symbol}`}
                  className="text-markets font-medium underline underline-offset-4"
                >
                  Den Verlauf von {geschichte.name} ansehen
                </Link>
                <span className="text-fg-subtle"> · </span>
                <Link
                  href="/lernen/wann-kaufen-verkaufen"
                  className="text-fg-muted hover:text-fg underline underline-offset-4"
                >
                  Warum Markttiming daran scheitert
                </Link>
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ------------------------------------------------------- Rechner */}
      {/*
        Hier stand bis zum 26.10.2026 ein dunkles Band mit drei Zahlen in
        Schaugröße („1.075 · 365 · 0") und darüber im Seitenkopf noch einmal
        drei (Themen, Lernstufen, Rechner). Zahlenzähler sind das
        Erkennungszeichen generierter Startseiten – der Betreiber: „dass es
        nicht mehr nach dem klassischen 0815-Vibe-Coding aussieht". Was sie
        sagten, steht im Text: die Zahl der Themen und Rechner im Vorspann,
        „verkauft nichts" im Schlussabsatz.
      */}
      <section aria-labelledby="rechner" className="fk-container py-14 sm:py-20">
        <SectionHeading
          id="rechner"
          eyebrow="Rechner"
          title="Selbst nachrechnen statt glauben"
          lead="Jeder Rechner legt seine Formel offen. Wer die Methodik kennt, kann das Ergebnis einordnen."
          action={
            <Link href="/rechner" className="fk-btn-secondary">
              Alle Rechner
              <Icon name="arrow-right" className="size-4" />
            </Link>
          }
        />

        <ul className="border-border mt-8 grid gap-x-12 border-t sm:grid-cols-2">
          {calculatorTiles.map((tile) => (
            <li key={tile.href}>
              <Reveal>
                <Link
                  href={tile.href}
                  className="group border-border flex h-full items-start gap-4 border-b py-4"
                >
                  <span className="min-w-0">
                    <span className="text-fg block font-semibold">{tile.label}</span>
                    <span className="text-fg-muted mt-1 block text-sm leading-relaxed">
                      {tile.hint}
                    </span>
                  </span>
                  <Icon
                    name="chevron-right"
                    className="text-fg-subtle mt-2.5 size-4 shrink-0 transition-transform group-hover:translate-x-0.5"
                  />
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      {/* -------------------------------------------------------- Lernen */}
      <section aria-labelledby="lernen" className="py-14 sm:py-20">
        <div className="fk-container">
          <SectionHeading
            id="lernen"
            eyebrow="Lernbereich"
            title="Drei Stufen, die wirklich aufeinander aufbauen"
            lead="Die Profi-Stufe wiederholt nicht die Grundlagen, sondern behandelt Kennzahlen, Sonderfälle, Risiken und Steuern."
          />

          {/*
            Nur der Anfang der Lernstrecke, nicht ihr Inhaltsverzeichnis.

            Hier standen alle Themen als Knopfliste – inzwischen 34 Stück, auf
            dem Telefon eine Kolonne über zwei Bildschirmhöhen. Eine
            vollständige Liste ist die Aufgabe von `/lernen`; auf der
            Startseite ist sie eine Wand. Die ersten sechs Themen stehen in
            der didaktischen Reihenfolge und sind damit genau die, mit denen
            man anfängt.
          */}
          {completeTopics.length > 0 && (
            <div className="mt-8">
              <h3 className="text-fg text-lg font-semibold">Womit man anfängt</h3>
              <p className="text-fg-muted mt-2 max-w-2xl text-sm leading-relaxed">
                Die Lernstrecke ist als Reihenfolge gedacht – das sind ihre ersten
                Stationen. Alle {learnStats.topicCount} Themen liegen in den drei Stufen
                als fertiger Text vor.
              </p>
              <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                {completeTopics.slice(0, 6).map((topic) => (
                  <li key={topic.slug}>
                    <Link
                      href={`/lernen/${topic.slug}`}
                      className="text-fg hover:text-brand underline underline-offset-4"
                    >
                      {topic.title}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/lernen" className="fk-btn-ghost">
                    Alle {learnStats.topicCount} Themen
                    <Icon name="arrow-right" className="size-4" />
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* --------------------------------------------- Begriff des Tages */}
      {/*
        Eine Karte, kein Abschnitt mit Überschrift und Rand.

        Der Begriff des Tages ist ein Angebot im Vorbeigehen und kein Kapitel
        der Startseite. Bekäme er dieselbe Bühne wie Lernbereich oder Märkte,
        stünde ein Glossareintrag neben vier Bereichen – und sähe wichtiger
        aus, als er ist.

        Ohne Glossar entfällt er ganz. Ein Kasten mit „bald mehr" wäre eine
        leere Versprechung, wie beim Podcast darunter.
      */}
      {/*
        Die Tagesfrage.

        Sie steht vor dem Begriff des Tages: Eine Frage zieht mehr als eine
        Erklärung, und wer sie beantwortet hat, liest die Erklärung darunter
        mit anderem Blick.

        Erscheint nur, wenn eine eindeutige Frage zustande kam. An einem Tag,
        an dem vier Indizes innerhalb weniger Zehntel beieinanderliegen, gibt
        es keine – lieber keine Tagesfrage als eine, die den Falschen tadelt.
      */}
      {frage && (
        <section aria-labelledby="tagesfrage" className="fk-container py-6 sm:py-8">
          <div className="border-border border-t pt-8">
            <p className="text-fg-subtle text-[0.8125rem] font-semibold">
              Frage des Tages
            </p>
            <h2 id="tagesfrage" className="sr-only">
              Frage des Tages
            </h2>
            <Tagesfrage frage={frage} />
          </div>
        </section>
      )}

      {begriff && (
        <section aria-labelledby="begriff" className="fk-container py-6 sm:py-8">
          <div className="border-border border-t pt-8">
            <p className="text-fg-subtle text-[0.8125rem] font-semibold">
              Begriff des Tages
            </p>
            <h2 id="begriff" className="text-fg mt-2 text-2xl font-bold">
              {begriff.begriff}
            </h2>
            <p className="text-fg-muted mt-3 max-w-3xl leading-relaxed">{begriff.kurz}</p>
            <p className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">
              <Link
                href={`/glossar#${begriff.slug}`}
                className="text-brand font-medium underline underline-offset-2"
              >
                Im Glossar nachschlagen
              </Link>
              {begriff.thema && begriff.themaTitel && (
                <Link
                  href={`/lernen/${begriff.thema}`}
                  className="text-fg-subtle hover:text-fg underline underline-offset-2"
                >
                  Lernthema {begriff.themaTitel}
                </Link>
              )}
              {begriff.rechner && begriff.rechnerTitel && (
                <Link
                  href={`/rechner/${begriff.rechner}`}
                  className="text-fg-subtle hover:text-fg underline underline-offset-2"
                >
                  {begriff.rechnerTitel}
                </Link>
              )}
            </p>
          </div>
        </section>
      )}

      {/* ------------------------------------------------------- Podcast */}
      {/*
        Der Podcast stand auf der Startseite nur in der Fußzeile – ein Verweis
        unter siebzig. Gezählt: Lernen 42, News 14, Rechner 11, Märkte 10,
        Podcast 1. Wenn er auf der Website stattfinden soll, gehört die
        jüngste Folge hierher.

        Ohne Folgen im Bestand entfällt der Abschnitt vollständig. Ein Kasten
        mit „bald mehr“ wäre eine leere Versprechung.
      */}
      {podcastfolgen.length > 0 && (
        <section aria-labelledby="podcast" className="fk-container py-14 sm:py-20">
          <SectionHeading
            id="podcast"
            eyebrow="Podcast"
            title="Dieselben Themen, zum Hören"
            lead="Wer lieber hört als liest, findet hier die Folgen – mit Titel, Datum und Inhalt zum Nachlesen."
          />
          <ul className="border-border mt-8 border-t">
            {podcastfolgen.map((folge, index) => (
              <li key={folge.slug}>
                <Reveal delay={index * 0.04}>
                  <Link
                    href={folgenAdresse(folge)}
                    className="border-border hover:bg-surface-muted group block border-b px-2 py-4 transition-colors"
                  >
                    <div className="text-fg-subtle flex flex-wrap items-center gap-x-2 text-xs">
                      {folge.datum && <span>{formatDate(folge.datum)}</span>}
                      {folgenDauer(folge) && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span>{folgenDauer(folge)}</span>
                        </>
                      )}
                    </div>
                    <span className="text-fg group-hover:text-news mt-1 block font-semibold">
                      {folge.titel}
                    </span>
                    {folge.beschreibung && (
                      <span className="text-fg-muted mt-1 block max-w-3xl text-sm leading-relaxed">
                        {kurzfassung(folge.beschreibung, 180)}
                      </span>
                    )}
                  </Link>
                </Reveal>
              </li>
            ))}
          </ul>
          <p className="mt-6">
            <Link
              href="/podcast"
              className="text-news font-medium underline underline-offset-2"
            >
              Alle Folgen im Überblick
            </Link>
          </p>
        </section>
      )}

      {/* ------------------------------------------------------- Manifest */}
      {/*
        Der Absatz Haltung beschließt die Seite – auf Wunsch des Betreibers
        vom Seitenanfang hierher verlegt, hinter das Schluss-Band. Aufbau
        nach dem Vorbild (amp.framer.media/company, per seite-abbilden.yml
        angesehen): die These groß und farbig links, die Begründung rechts.

        Die Farbe ist das Navy der Marke, nicht das Bordeaux: Der rote Ton
        war ein Versuch, die Wärme des Vorbilds zu treffen, wirkte hier aber
        wie eine Warnung. Auf dem warmen Papiergrund trägt das Navy dieselbe
        Wirkung, ohne fremd zu sein.
      */}
      <section aria-labelledby="haltung" className="fk-container py-16 sm:py-24">
        <p className="text-fg-subtle text-[0.8125rem] font-semibold">
          Warum es diese Seite gibt
        </p>
        <div className="mt-6 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <h2
            id="haltung"
            className="text-brand text-3xl leading-tight font-semibold sm:text-4xl lg:text-5xl"
          >
            Geldanlage ist kein Geheimwissen. Sie ist ein Handwerk – und ein Handwerk kann
            man lernen.
          </h2>
          <div className="text-fg-muted space-y-5 leading-relaxed">
            <p>
              Diese Seite verkauft nichts und empfiehlt kein Produkt. Sie erklärt die
              Mechanismen hinter Kursen, Zinsen und Kennzahlen – in drei Stufen, vom
              ersten Begriff bis zur Bilanz. Jede Formel liegt offen, jede Zahl nennt ihre
              Herkunft und ihren Stand.
            </p>
            <p>
              Was hier steht, wird täglich neu gerechnet statt einmal behauptet: Kurse,
              Nachrichten und die Folge des Tages entstehen jeden Morgen aufs Neue.{' '}
              <Link
                href="/ueber-uns"
                className="text-brand font-medium underline underline-offset-4"
              >
                Wer dahintersteht und wie wir arbeiten
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
