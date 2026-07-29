import type { Metadata } from 'next'
import Link from 'next/link'

import { NewsCarousel } from '@/components/home/NewsCarousel'
import { QuoteCard } from '@/components/markets/QuoteCard'
import { SourceSummary } from '@/components/markets/SourceNote'
import { Icon, type IconName } from '@/components/ui/Icon'
import { SectionHeading } from '@/components/ui/PageHeader'
import { Reveal } from '@/components/ui/Reveal'
import { cn } from '@/lib/cn'
import { getCompleteTopics, getLearnStats } from '@/lib/learn'
import { getMarketOverview } from '@/lib/markets'
import { getNewsHeadlines } from '@/lib/news'
import { buildMetadata } from '@/lib/seo'
import {
  areas,
  areaStyles,
  LEARN_TOPIC_COUNT,
  RECHNER_ANZAHL,
  RECHNER_ANZAHL_WORT,
  siteConfig,
  type AreaId,
} from '@/lib/site'

export const metadata: Metadata = buildMetadata({
  title: `${siteConfig.name} – Finanzen verstehen, Fehler vermeiden`,
  description: `Finanzwissen in drei Lernstufen: ${LEARN_TOPIC_COUNT} Themen in aufbauender Reihenfolge, ${RECHNER_ANZAHL_WORT} Rechner, Marktdaten und eingeordnete News – verständlich und ohne Verkaufsdruck.`,
  path: '/',
  ogTitle: `${siteConfig.name} – Finanzen verstehen, Fehler vermeiden`,
})

/**
 * Kacheln für den Schnellzugriff auf die Hauptbereiche.
 *
 * Ohne Staatsverschuldung: Der Bereich bleibt über die Kopf- und Fußzeile
 * erreichbar, ist auf der Startseite aber kein gleichrangiger Einstieg neben
 * Lernen, Rechnern, Märkten und News.
 */
const areaTiles: { area: AreaId; icon: IconName }[] = [
  { area: 'learn', icon: 'book' },
  { area: 'tools', icon: 'calculator' },
  { area: 'markets', icon: 'chart' },
  { area: 'globe', icon: 'globe' },
  // Zwischen Globus und Kalender – dieselbe Stelle wie in der Kopfzeile.
  { area: 'akademie', icon: 'scale' },
  { area: 'calendar', icon: 'clock' },
  { area: 'news', icon: 'newspaper' },
]

/**
 * Die Anzahl der Bereiche ausgeschrieben.
 *
 * Steht nicht als Wort im Text: Beim Anlegen des Globus wurde aus „Vier
 * Bereiche“ nicht von selbst „Fünf“ – dieselbe Sorte Fehler, die auf
 * `/ueber-uns` monatelang stand. Jetzt folgt das Wort der Liste.
 */
const ZAHLWOERTER = ['Null', 'Ein', 'Zwei', 'Drei', 'Vier', 'Fünf', 'Sechs', 'Sieben']

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
]

export default async function HomePage() {
  const [headlines, marketPreviews, learnStats, completeTopics] = await Promise.all([
    // Ohne Angabe: genau die Meldungen, die auch unter „Aktuelles“ stehen.
    getNewsHeadlines(),
    getMarketOverview(),
    getLearnStats(),
    getCompleteTopics(),
  ])

  return (
    <>
      {/* ------------------------------------------------------------ Hero */}
      <section className="border-border bg-surface relative overflow-hidden border-b">
        <div
          aria-hidden="true"
          className="from-brand/18 to-brand/0 pointer-events-none absolute inset-x-0 -top-40 h-80 bg-gradient-to-b blur-3xl"
        />
        <div className="fk-container relative grid items-center gap-10 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
          <div>
            <p className="fk-chip bg-brand-soft text-brand">
              <Icon name="compass" className="size-3.5" />
              Finanzbildung in drei Stufen
            </p>

            {/*
              Zwei Zeilen, erzwungen über `block` statt über einen Umbruch nach
              Platz. Der Gleichklang lebt davon, dass „Finanzen“ und „Fehler“
              untereinander stehen und die Anfangsbuchstaben eine Achse bilden –
              bei automatischem Umbruch wäre das von der Fensterbreite abhängig.
            */}
            <h1 className="text-fg mt-5 text-4xl font-bold sm:text-5xl lg:text-6xl">
              <span className="block">Finanzen verstehen,</span>
              <span className="from-brand to-accent block bg-gradient-to-r bg-clip-text text-transparent">
                Fehler vermeiden
              </span>
            </h1>

            <p className="text-fg-muted mt-5 max-w-xl text-lg leading-relaxed">
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

            <dl className="border-border mt-10 grid max-w-lg grid-cols-3 gap-4 border-t pt-6">
              <div>
                <dt className="text-fg-subtle text-xs font-medium tracking-wide uppercase">
                  Themen
                </dt>
                <dd className="text-fg mt-1 text-2xl font-bold tabular-nums">
                  {learnStats.topicCount}
                </dd>
              </div>
              <div>
                <dt className="text-fg-subtle text-xs font-medium tracking-wide uppercase">
                  Lernstufen
                </dt>
                <dd className="text-fg mt-1 text-2xl font-bold tabular-nums">
                  {learnStats.levelCount}
                </dd>
              </div>
              <div>
                <dt className="text-fg-subtle text-xs font-medium tracking-wide uppercase">
                  Rechner
                </dt>
                <dd className="text-fg mt-1 text-2xl font-bold tabular-nums">
                  {RECHNER_ANZAHL}
                </dd>
              </div>
            </dl>
          </div>

          {/* Die drehende News-Säule. */}
          <NewsCarousel headlines={headlines} />
        </div>
      </section>

      {/* -------------------------------------------------- Schnellzugriff */}
      <section aria-labelledby="bereiche" className="fk-container py-14 sm:py-20">
        <SectionHeading
          id="bereiche"
          eyebrow="Überblick"
          title={`${ZAHLWOERTER[areaTiles.length] ?? areaTiles.length} Bereiche, ein Ziel`}
          lead="Jeder Bereich beantwortet eine andere Frage – vom ersten Begriff bis zur konkreten Rechnung."
        />

        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {areaTiles.map(({ area, icon }, index) => {
            const config = areas[area]
            const style = areaStyles[area]
            return (
              <li key={area}>
                <Reveal delay={index * 0.05}>
                  <Link
                    href={config.href}
                    className="fk-card-interactive group flex h-full flex-col p-6"
                  >
                    <span
                      className={cn(
                        'flex size-11 items-center justify-center rounded-xl',
                        style.soft
                      )}
                    >
                      <Icon name={icon} className="size-5" />
                    </span>
                    <h3 className="text-fg mt-4 text-lg font-semibold">{config.label}</h3>
                    <p className="text-fg-muted mt-2 flex-1 text-sm leading-relaxed">
                      {config.description}
                    </p>
                    <span
                      className={cn(
                        'mt-4 flex items-center gap-1 text-sm font-semibold',
                        style.text
                      )}
                    >
                      Ansehen
                      <Icon
                        name="arrow-right"
                        className="size-4 transition-transform group-hover:translate-x-0.5"
                      />
                    </span>
                  </Link>
                </Reveal>
              </li>
            )
          })}
        </ul>
      </section>

      {/* -------------------------------------------------------- Märkte */}
      <section
        aria-labelledby="kurse"
        className="border-border bg-surface border-y py-14 sm:py-20"
      >
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

          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {marketPreviews.map(({ quote, sparkline }, index) => (
              <li key={quote.symbol}>
                <Reveal delay={index * 0.05} className="h-full">
                  <QuoteCard quote={quote} sparkline={sparkline} />
                </Reveal>
              </li>
            ))}
          </ul>

          <SourceSummary
            quotes={marketPreviews.map((preview) => preview.quote)}
            className="text-fg-subtle mt-6 text-sm leading-relaxed"
          />
        </div>
      </section>

      {/* ------------------------------------------------------- Rechner */}
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

        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {calculatorTiles.map((tile, index) => (
            <li key={tile.href}>
              <Reveal delay={index * 0.04}>
                <Link
                  href={tile.href}
                  className="fk-card-interactive group flex h-full items-start gap-4 p-5"
                >
                  <span className="bg-tools-soft text-tools flex size-10 shrink-0 items-center justify-center rounded-xl">
                    <Icon name="calculator" className="size-5" />
                  </span>
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
      <section
        aria-labelledby="lernen"
        className="border-border bg-surface border-y py-14 sm:py-20"
      >
        <div className="fk-container">
          <SectionHeading
            id="lernen"
            eyebrow="Lernbereich"
            title="Drei Stufen, die wirklich aufeinander aufbauen"
            lead="Die Profi-Stufe wiederholt nicht die Grundlagen, sondern behandelt Kennzahlen, Sonderfälle, Risiken und Steuern."
          />

          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {[
              {
                label: 'Beginner',
                text: 'Begriffe klären, Grundmechanik verstehen, die häufigsten Missverständnisse ausräumen.',
                icon: 'sparkles' as IconName,
              },
              {
                label: 'Fortgeschritten',
                text: 'Varianten unterscheiden, Kennzahlen kritisch lesen, in der Praxis richtig umsetzen.',
                icon: 'layers' as IconName,
              },
              {
                label: 'Profi',
                text: 'Bewertung, Bilanzwarnzeichen, Sonderfälle und die deutsche Besteuerung im Detail.',
                icon: 'target' as IconName,
              },
            ].map((level, index) => (
              <Reveal key={level.label} delay={index * 0.06}>
                <div className="fk-card h-full p-6">
                  <span className="bg-learn-soft text-learn flex size-11 items-center justify-center rounded-xl">
                    <Icon name={level.icon} className="size-5" />
                  </span>
                  <h3 className="text-fg mt-4 text-lg font-semibold">{level.label}</h3>
                  <p className="text-fg-muted mt-2 text-sm leading-relaxed">
                    {level.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          {completeTopics.length > 0 && (
            <div className="rounded-card border-border bg-surface-muted mt-10 border p-6 sm:p-8">
              <h3 className="text-fg text-lg font-semibold">Vollständig ausgearbeitet</h3>
              <p className="text-fg-muted mt-2 max-w-2xl text-sm leading-relaxed">
                Diese Themen liegen in allen drei Stufen als fertiger Text vor. Die
                übrigen Themen haben bereits eigene Seiten mit Gliederung – der Fließtext
                wird Thema für Thema ergänzt.
              </p>
              <ul className="mt-5 flex flex-wrap gap-3">
                {completeTopics.map((topic) => (
                  <li key={topic.slug}>
                    <Link
                      href={`/lernen/${topic.slug}`}
                      className="fk-btn-secondary border-learn/40 text-fg hover:border-learn hover:text-learn"
                    >
                      <Icon name="check-circle" className="text-learn size-4" />
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

      {/* ----------------------------------------------- Abschluss-Hinweis */}
      <section className="fk-container py-14 sm:py-20">
        <div className="fk-card overflow-hidden p-7 sm:p-10">
          <div className="max-w-2xl">
            <p className="fk-chip bg-brand-soft text-brand">
              <Icon name="shield" className="size-3.5" />
              Unser Anspruch
            </p>
            <h2 className="text-fg mt-4 text-2xl font-bold sm:text-3xl">
              Keine Produktempfehlungen, keine Renditeversprechen
            </h2>
            <p className="text-fg-muted mt-4 leading-relaxed">
              Diese Plattform verkauft nichts. Sie erklärt Mechanismen, legt Formeln offen
              und benennt Risiken so deutlich wie Chancen. Wo eine Aussage von Annahmen
              abhängt, stehen die Annahmen dabei – und wo eine Frage steuerlich oder
              rechtlich wird, steht der Hinweis, dass fachlicher Rat nötig ist.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/ueber-uns" className="fk-btn-secondary">
                Über uns
                <Icon name="arrow-right" className="size-4" />
              </Link>
              <Link href="/lernen/worauf-achten-einsteiger" className="fk-btn-ghost">
                Tipps für Einsteiger
                <Icon name="arrow-right" className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
