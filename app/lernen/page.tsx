import type { Metadata } from 'next'
import Link from 'next/link'

import { OverallProgress } from '@/components/learn/OverallProgress'
import { TopicCard } from '@/components/learn/TopicCard'
import { JsonLd } from '@/components/seo/JsonLd'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Icon } from '@/components/ui/Icon'
import { PageHeader, SectionHeading } from '@/components/ui/PageHeader'
import { Reveal } from '@/components/ui/Reveal'
import { learnLevelIds, learnLevelMeta } from '@/data/learn/types'
import { collectionPageSchema } from '@/lib/jsonld'
import {
  getCompleteTopics,
  getLearnSections,
  getLearnStats,
  getLearnTopics,
} from '@/lib/learn'
import { getLernpfade } from '@/lib/lernpfade'
import { buildMetadata, withBrand } from '@/lib/seo'
import { LEARN_TOPIC_COUNT } from '@/lib/site'

export const metadata: Metadata = buildMetadata({
  title: withBrand(`Lernbereich: ${LEARN_TOPIC_COUNT} Finanzthemen in drei Stufen`),
  description: `Von den Grundlagen bis zur Vorsorge: ${LEARN_TOPIC_COUNT} Themen in einer Reihenfolge, die aufeinander aufbaut – jeweils als Beginner, Fortgeschritten und Profi.`,
  path: '/lernen',
  ogTitle: `${LEARN_TOPIC_COUNT} Finanzthemen in drei Lernstufen`,
})

export default async function LearnOverviewPage() {
  const [topics, sections, stats, completeTopics, pfade] = await Promise.all([
    getLearnTopics(),
    getLearnSections(),
    getLearnStats(),
    getCompleteTopics(),
    getLernpfade(),
  ])

  const topicSlugs = topics.map((topic) => topic.slug)
  const readingHours = Math.round(stats.totalReadingMinutes / 60)

  return (
    <>
      <PageHeader
        area="learn"
        eyebrow="Lernbereich"
        eyebrowIcon="book"
        title="Finanzwissen in drei Stufen"
        lead="Jedes Thema gibt es dreimal – und jede Stufe geht weiter, statt sich zu wiederholen. Beginner klärt die Begriffe, Fortgeschritten die Umsetzung, Profi die Sonderfälle, Kennzahlen und Steuern."
        breadcrumbs={<Breadcrumbs items={[{ name: 'Lernen' }]} />}
        meta={
          <>
            <span>{stats.topicCount} Themen</span>
            <span aria-hidden="true">·</span>
            <span>{stats.levelCount} Lernstufen</span>
            <span aria-hidden="true">·</span>
            <span>rund {readingHours} Stunden Lesestoff</span>
            <span aria-hidden="true">·</span>
            <span>{stats.quizQuestionCount} Quizfragen</span>
          </>
        }
      />

      <div className="fk-container py-12 sm:py-16">
        <OverallProgress topicSlugs={topicSlugs} />

        {/*
          Zwei Wege, die neben dem Fortschrittsbalken stehen müssen und nicht
          irgendwo unten: Wer nicht bei null anfängt, will nicht scrollen, um
          das zu sagen – und wer alles abgehakt hat, hat die interessantere
          Frage noch vor sich, nämlich ob es in vier Wochen noch sitzt.
        */}
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/lernen/stand" className="fk-btn-secondary">
            Lernstand und Einstufungstest
          </Link>
          <Link href="/lernen/wiederholen" className="fk-btn-secondary">
            Wiederholen
          </Link>
          {/*
            Das Schaufenster der Erklärgrafiken.

            Es war gebaut, es stand in der Sitemap – und kein einziger Verweis
            führte dorthin. Aufgefallen ist das keinem Auge, sondern
            `npm run verwaist`. Hier gehört es hin: Wer sich einen Überblick
            über den Lernbereich verschafft, sucht auch nach den Bildern
            darin.
          */}
          <Link href="/lernen/grafiken" className="fk-btn-secondary">
            Alle Erklärgrafiken
          </Link>
        </div>

        {/* ------------------------------------------------- Lernpfade */}
        {/*
          Steht bewusst vor den Stufen und weit vor dem Themen-Grid: Wer mit
          einer konkreten Frage kommt, soll nicht erst an 33 Kacheln vorbei.
        */}
        <section
          aria-labelledby="pfade"
          className="rounded-card border-learn/25 bg-learn-soft mt-12 border p-6 sm:p-8"
        >
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div className="max-w-2xl">
              <p className="text-learn text-xs font-semibold tracking-wide uppercase">
                Neu
              </p>
              <h2 id="pfade" className="text-fg mt-1.5 text-xl font-bold sm:text-2xl">
                Du hast eine konkrete Frage? Nimm einen Pfad.
              </h2>
              <p className="text-fg-muted mt-3 text-sm leading-relaxed">
                {pfade.length} geführte Wege durch den Bestand – vom ersten Sparplan über
                eine geerbte Summe bis zur Vorsorgelücke. Ein Pfad greift sich die Stufen
                heraus, auf die es beim jeweiligen Anlass ankommt, und begründet bei jedem
                Schritt, warum ausgerechnet er jetzt dran ist.
              </p>
            </div>
            <Link href="/lernen/pfade" className="fk-btn-primary">
              Pfade ansehen
              <Icon name="arrow-right" className="size-4" />
            </Link>
          </div>

          <ul className="mt-6 flex flex-wrap gap-2">
            {pfade.map((pfad) => (
              <li key={pfad.slug}>
                <Link
                  href={`/lernen/pfade/${pfad.slug}`}
                  className="fk-btn-secondary text-sm"
                >
                  <Icon name="compass" className="text-learn size-4" />
                  {pfad.titel}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* --------------------------------------------- Stufen erklären */}
        <section aria-labelledby="stufen" className="mt-14">
          <SectionHeading
            id="stufen"
            eyebrow="Aufbau"
            title="Was die drei Stufen unterscheidet"
          />
          <ul className="mt-6 grid gap-4 md:grid-cols-3">
            {learnLevelIds.map((levelId, index) => (
              <li key={levelId}>
                <Reveal delay={index * 0.06}>
                  <div className="fk-card h-full p-6">
                    <span className="bg-learn-soft text-learn flex size-9 items-center justify-center rounded-full text-sm font-bold">
                      {index + 1}
                    </span>
                    <h3 className="text-fg mt-4 text-lg font-semibold">
                      {learnLevelMeta[levelId].label}
                    </h3>
                    <p className="text-fg-muted mt-2 text-sm leading-relaxed">
                      {learnLevelMeta[levelId].promise}
                    </p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </section>

        {/* ------------------------------------------- Bearbeitungsstand */}
        <section
          aria-labelledby="stand"
          className="rounded-card border-border bg-surface-muted mt-12 border p-6 sm:p-8"
        >
          <h2 id="stand" className="text-fg text-lg font-semibold">
            Bearbeitungsstand der Inhalte
          </h2>
          <p className="text-fg-muted mt-2 max-w-3xl text-sm leading-relaxed">
            {completeTopics.length} von {stats.topicCount} Themen sind in allen drei
            Stufen vollständig ausformuliert ({stats.completeLevelCount} von{' '}
            {stats.levelCount} Stufen).{' '}
            {completeTopics.length < stats.topicCount
              ? 'Alle übrigen Themen haben bereits eigene Seiten mit Meta-Daten, Permalink und einer inhaltlichen Gliederung – der Fließtext wird Thema für Thema ergänzt. Das ist auf jeder betroffenen Seite deutlich gekennzeichnet.'
              : 'Damit steht zu jedem Thema fertiger Text; solange das nicht galt, war der Bearbeitungsstand auf jeder betroffenen Seite gekennzeichnet.'}
          </p>
          <ul className="mt-5 flex flex-wrap gap-3">
            {completeTopics.map((topic) => (
              <li key={topic.slug}>
                <Link
                  href={`/lernen/${topic.slug}`}
                  className="fk-btn-secondary border-success/40 hover:border-success hover:text-success"
                >
                  <Icon name="check-circle" className="text-success size-4" />
                  {topic.title}
                </Link>
              </li>
            ))}
          </ul>

          <p className="text-fg-muted mt-6 flex items-start gap-2.5 text-sm leading-relaxed">
            <Icon name="target" className="text-learn mt-0.5 size-4 shrink-0" />
            <span>
              Diese Stufen enthalten am Ende einen{' '}
              <strong className="text-fg font-semibold">Wissenscheck</strong>:{' '}
              {stats.quizQuestionCount} Fragen in {stats.levelsWithQuizCount} Stufen,
              jeweils mit Begründung zu jeder Antwort. Die übrigen Stufen bekommen ihr
              Quiz zusammen mit dem Fließtext.
            </span>
          </p>
        </section>

        {/* -------------------------------------------------- Themen-Grid */}
        <section aria-labelledby="alle-themen" className="mt-14">
          <SectionHeading
            id="alle-themen"
            eyebrow="Alle Themen"
            title={`${stats.topicCount} Themen in ${sections.length} Abschnitten`}
            lead="Die Reihenfolge baut aufeinander auf: erst die Größen, die über alles andere entscheiden, dann der sichere Sockel, dann die Anlageklassen. Ein Vorschlag, keine Vorgabe – jedes Thema ist auch für sich verständlich."
          />

          {/*
            Die Abschnitte kommen aus `data/learn`, nicht aus dieser Datei.
            Wer dort ein Thema verschiebt, verschiebt es damit auch hier.
          */}
          {sections.map((section) => (
            <div key={section.id} className="mt-12 first:mt-8">
              <h3
                id={`abschnitt-${section.id}`}
                className="text-fg flex items-baseline gap-3 text-xl font-semibold"
              >
                <span className="text-learn tabular-nums">
                  {section.offset + 1}–{section.offset + section.topics.length}
                </span>
                {section.label}
              </h3>
              <p className="text-fg-muted mt-2 max-w-3xl text-sm leading-relaxed">
                {section.description}
              </p>

              <ul
                aria-labelledby={`abschnitt-${section.id}`}
                className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
              >
                {section.topics.map((topic, index) => (
                  <li key={topic.slug} className="relative">
                    <Reveal delay={Math.min(index, 8) * 0.03} className="h-full">
                      <TopicCard topic={topic} index={section.offset + index} />
                    </Reveal>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      </div>

      <JsonLd
        data={collectionPageSchema({
          name: 'Lernbereich – Finanzwissen in drei Stufen',
          description: `${LEARN_TOPIC_COUNT} Finanzthemen, jeweils in den Lernstufen Beginner, Fortgeschritten und Profi.`,
          path: '/lernen',
          items: topics.map((topic) => ({
            name: topic.title,
            path: `/lernen/${topic.slug}`,
          })),
        })}
      />
    </>
  )
}
