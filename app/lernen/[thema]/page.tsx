import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { LevelNav, type LevelNavEntry } from '@/components/learn/LevelNav'
import { TopicLinkList } from '@/components/learn/TopicLinkList'
import { TopicProgress } from '@/components/learn/TopicProgress'
import { JsonLd } from '@/components/seo/JsonLd'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Callout } from '@/components/ui/Callout'
import { Icon } from '@/components/ui/Icon'
import { PageHeader } from '@/components/ui/PageHeader'
import { TagLinks } from '@/components/ui/TagLinks'
import { getCalculatorDefinition } from '@/data/calculators'
import { learnLevelIds } from '@/data/learn/types'
import { lektionenZumThema } from '@/lib/akademie'
import { collectionPageSchema } from '@/lib/jsonld'
import { getLearnTopic, getLearnTopicSlugs, getRelatedTopics } from '@/lib/learn'
import { kartenZumThema } from '@/lib/lernkarten-daten'
import { getQuotes } from '@/lib/markets'
import { buildMetadata, withBrand } from '@/lib/seo'

type TopicPageProps = { params: Promise<{ thema: string }> }

/**
 * Wie viele Lektionen die Vertiefungskarte zeigt.
 *
 * Zehn der sechsundzwanzig Lektionen nennen „aktie“ als Grundlage – fast die
 * gesamte Fundamentalanalyse baut darauf auf. Ungekürzt wäre die Karte in der
 * Randspalte länger als der Fortschrittsblock daneben und hätte den Charakter
 * eines zweiten Inhaltsverzeichnisses. Sie soll aber ein Hinweis sein, kein
 * Verzeichnis: fünf Einstiege, der Rest über die Übersicht.
 *
 * Die Reihenfolge ist die des Lehrplans, nicht Zufall – die einführenden
 * Lektionen stehen in beiden Bereichen vorn und damit auch hier.
 */
const VERTIEFUNG_HOECHSTENS = 5

export async function generateStaticParams() {
  const slugs = await getLearnTopicSlugs()
  return slugs.map((thema) => ({ thema }))
}

export async function generateMetadata({ params }: TopicPageProps): Promise<Metadata> {
  const { thema } = await params
  const topic = await getLearnTopic(thema)

  if (!topic) {
    return buildMetadata({
      title: withBrand('Thema nicht gefunden'),
      description: 'Das gesuchte Lernthema existiert nicht.',
      path: `/lernen/${thema}`,
      noIndex: true,
    })
  }

  return buildMetadata({
    title: topic.metaTitle,
    description: topic.metaDescription,
    path: `/lernen/${thema}`,
    ogTitle: topic.headline,
  })
}

export default async function TopicPage({ params }: TopicPageProps) {
  const { thema } = await params
  const topic = await getLearnTopic(thema)

  if (!topic) notFound()

  const akademieLektionen = lektionenZumThema(thema)
  const uebrigeLektionen = akademieLektionen.length - VERTIEFUNG_HOECHSTENS
  const kartenzahl = kartenZumThema(thema).length

  const [relatedTopics, quotes] = await Promise.all([
    getRelatedTopics(thema),
    getQuotes(topic.symbols ?? []),
  ])

  const levelEntries: LevelNavEntry[] = learnLevelIds.map((levelId) => ({
    id: levelId,
    title: topic.levels[levelId].title,
    readingMinutes: topic.levels[levelId].readingMinutes,
    status: topic.levels[levelId].status,
    hasQuiz: (topic.levels[levelId].quiz?.length ?? 0) > 0,
  }))

  const totalMinutes = levelEntries.reduce((sum, entry) => sum + entry.readingMinutes, 0)
  const isOutline = levelEntries.every((entry) => entry.status === 'outline')

  return (
    <>
      <PageHeader
        area="learn"
        eyebrow="Lernthema"
        eyebrowIcon="book"
        title={topic.headline}
        lead={topic.lead}
        breadcrumbs={
          <Breadcrumbs
            items={[{ name: 'Lernen', path: '/lernen' }, { name: topic.title }]}
          />
        }
        meta={
          <>
            <span>3 Stufen</span>
            <span aria-hidden="true">·</span>
            <span>{totalMinutes} Min. gesamt</span>
            <span aria-hidden="true">·</span>
            <span>
              {isOutline ? 'Gliederung vorhanden' : 'Vollständig ausgearbeitet'}
            </span>
          </>
        }
      />

      <div className="fk-container py-12 sm:py-16">
        <div className="grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <div>
            {/* ------------------------------------------------ Einordnung */}
            <section aria-labelledby="einordnung">
              <h2 id="einordnung" className="text-fg text-2xl font-bold">
                Worum es geht
              </h2>
              <div className="text-fg-muted mt-4 space-y-4 leading-relaxed">
                {topic.overview.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </section>

            {isOutline && (
              <div className="mt-8">
                <Callout variant="info" title="Fließtext folgt noch">
                  <p>
                    Die drei Stufen dieses Themas liegen bislang als{' '}
                    <strong className="text-fg font-semibold">Gliederung</strong> vor: Die
                    Seiten existieren mit eigenem Permalink und eigenen Meta-Daten, der
                    ausformulierte Text wird ergänzt.
                  </p>
                  <p>
                    Vollständig ausgearbeitet sind bereits{' '}
                    <Link
                      href="/lernen/aktie"
                      className="text-brand font-semibold underline"
                    >
                      Aktie
                    </Link>{' '}
                    und{' '}
                    <Link
                      href="/lernen/zinseszins"
                      className="text-brand font-semibold underline"
                    >
                      Zinseszins
                    </Link>
                    .
                  </p>
                </Callout>
              </div>
            )}

            {/* ---------------------------------------------------- Stufen */}
            <section aria-labelledby="stufen" className="mt-12">
              <h2 id="stufen" className="text-fg text-2xl font-bold">
                Die drei Stufen
              </h2>
              <p className="text-fg-muted mt-2 max-w-2xl leading-relaxed">
                Fang bei Beginner an, wenn du das Thema neu angehst. Wer die Grundlagen
                kennt, springt direkt weiter – die Stufen sind einzeln lesbar.
              </p>
              <div className="mt-6">
                <LevelNav topicSlug={topic.slug} entries={levelEntries} layout="cards" />
              </div>
            </section>

            {/* --------------------------------------------- Schlagwörter */}
            {topic.keywords.length > 0 && (
              <section aria-labelledby="schlagwoerter" className="mt-12">
                <h2
                  id="schlagwoerter"
                  className="text-fg-subtle text-xs font-semibold tracking-wide uppercase"
                >
                  Begriffe in diesem Thema
                </h2>
                {/*
                  Die eigenen Stichwörter zeigen zwangsläufig auf diese Seite –
                  „Tagesgeld“ steht bei den Begriffen des Themas Tagesgeld.
                  Deshalb der Pfad: Verweise auf sich selbst entfallen.
                */}
                <TagLinks
                  tags={topic.keywords}
                  currentPath={`/lernen/${topic.slug}`}
                  note="Begriffe mit Pfeil führen zu der Seite, die sie erklärt."
                />
              </section>
            )}
          </div>

          {/* ------------------------------------------------ Seitenleiste */}
          <aside className="space-y-7 lg:sticky lg:top-24 lg:self-start">
            <section aria-labelledby="fortschritt-thema" className="fk-block">
              <h2 id="fortschritt-thema" className="text-fg text-base font-semibold">
                Dein Fortschritt
              </h2>
              <div className="mt-4">
                <TopicProgress topicSlug={topic.slug} />
              </div>
              <div className="border-border mt-5 border-t pt-4">
                <LevelNav topicSlug={topic.slug} entries={levelEntries} />
              </div>
            </section>

            {/*
              Die Karten zum Ausdrucken.

              Sie stehen in der Leiste und nicht unter dem Text: Wer sie sucht,
              sucht sie am Anfang – bevor er liest, nicht danach. Der Kasten
              erscheint nur, wenn es für dieses Thema Karten gibt; ein Verweis
              auf eine leere Seite wäre schlimmer als keiner.
            */}
            {kartenzahl > 0 && (
              <section aria-labelledby="karten-thema" className="fk-block">
                <h2 id="karten-thema" className="text-fg text-base font-semibold">
                  Zum Ausdrucken
                </h2>
                <p className="text-fg-muted mt-2 text-sm leading-relaxed">
                  {kartenzahl} Lernkarten aus den Begriffen und Prüffragen dieses Themas –
                  acht je Blatt, Vorder- und Rückseite passend gesetzt.
                </p>
                <Link
                  href={`/lernen/${topic.slug}/karten`}
                  className="text-learn mt-3 inline-flex items-center gap-2 text-sm font-medium underline underline-offset-2"
                >
                  <Icon name="layers" className="size-4" aria-hidden="true" />
                  Kartenbogen ansehen
                </Link>
              </section>
            )}

            {topic.calculators && topic.calculators.length > 0 && (
              <section aria-labelledby="passende-rechner" className="fk-block">
                <h2 id="passende-rechner" className="text-fg text-base font-semibold">
                  Passende Rechner
                </h2>
                <ul className="mt-4 space-y-2">
                  {topic.calculators.map((href) => {
                    // Den Namen aus der Rechner-Definition holen statt ihn aus dem
                    // Slug zu bilden – sonst würde aus „rentenluecke“ nie „Rentenlücke“.
                    const definition = getCalculatorDefinition(
                      href.split('/').pop() ?? ''
                    )
                    if (!definition) return null
                    return (
                      <li key={href}>
                        <Link
                          href={href}
                          className="text-fg hover:bg-surface-muted hover:text-brand flex items-center gap-2.5 rounded-xl p-2.5 text-sm font-medium transition"
                        >
                          <Icon name="calculator" className="text-tools size-4" />
                          {definition.title}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </section>
            )}

            {/*
              Die Vertiefung steht vor den Kursen und nach den Rechnern.

              Reihenfolge nach Nähe zum Text: Ein Rechner rechnet nach, was der
              Artikel erklärt hat; die Akademie erklärt dasselbe Thema eine
              Stufe genauer; die Kurse sind Anschauungsmaterial. Die Liste ist
              nicht gepflegt, sondern abgeleitet – jede Lektion nennt selbst,
              worauf sie aufbaut.
            */}
            {akademieLektionen.length > 0 && (
              <section aria-labelledby="vertiefung" className="fk-block">
                <h2 id="vertiefung" className="text-fg text-base font-semibold">
                  Vertiefung in der Akademie
                </h2>
                <ul className="mt-4 space-y-2">
                  {akademieLektionen.slice(0, VERTIEFUNG_HOECHSTENS).map((lektion) => (
                    <li key={lektion.slug}>
                      <Link
                        href={`/akademie/${lektion.bereich}/${lektion.slug}`}
                        className="text-fg hover:bg-surface-muted hover:text-brand flex items-start gap-2.5 rounded-xl p-2.5 text-sm font-medium transition"
                      >
                        <Icon
                          name={
                            lektion.bereich === 'technische-analyse' ? 'chart' : 'scale'
                          }
                          className="text-akademie mt-0.5 size-4 shrink-0"
                        />
                        {lektion.titel}
                      </Link>
                    </li>
                  ))}
                </ul>
                {uebrigeLektionen > 0 && (
                  <Link
                    href="/akademie"
                    className="text-fg-muted hover:text-akademie mt-3 inline-flex items-center gap-1.5 px-2.5 text-sm transition"
                  >
                    {uebrigeLektionen === 1
                      ? 'eine weitere Lektion'
                      : `${uebrigeLektionen} weitere Lektionen`}
                    <Icon name="arrow-right" className="size-3.5" />
                  </Link>
                )}
              </section>
            )}

            {quotes.length > 0 && (
              <section aria-labelledby="passende-kurse-thema" className="fk-block">
                <h2 id="passende-kurse-thema" className="text-fg text-base font-semibold">
                  Dazu passende Kurse
                </h2>
                <ul className="mt-4 space-y-2">
                  {quotes.map((quote) => (
                    <li key={quote.symbol}>
                      <Link
                        href={`/maerkte/${quote.symbol}`}
                        className="text-fg hover:bg-surface-muted hover:text-brand flex items-center gap-2.5 rounded-xl p-2.5 text-sm font-medium transition"
                      >
                        <Icon name="chart" className="text-markets size-4" />
                        {quote.ticker}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <TopicLinkList topics={relatedTopics} title="Verwandte Themen" />
          </aside>
        </div>
      </div>

      <JsonLd
        data={collectionPageSchema({
          name: topic.headline,
          description: topic.metaDescription,
          path: `/lernen/${topic.slug}`,
          items: learnLevelIds.map((levelId) => ({
            name: topic.levels[levelId].title,
            path: `/lernen/${topic.slug}/${levelId}`,
          })),
        })}
      />
    </>
  )
}
