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
import { getCompleteTopics, getLearnStats, getLearnTopics } from '@/lib/learn'
import { buildMetadata, withBrand } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: withBrand('Lernbereich: 23 Finanzthemen in drei Stufen'),
  description:
    'Von Aktie bis Zinseszins: 23 Themen, jeweils als Beginner, Fortgeschritten und Profi. Mit Fortschrittsanzeige und ohne Produktempfehlungen.',
  path: '/lernen',
  ogTitle: '23 Finanzthemen in drei Lernstufen',
})

export default async function LearnOverviewPage() {
  const [topics, stats, completeTopics] = await Promise.all([
    getLearnTopics(),
    getLearnStats(),
    getCompleteTopics(),
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
            {stats.levelCount} Stufen). Alle übrigen Themen haben bereits eigene Seiten
            mit Meta-Daten, Permalink und einer inhaltlichen Gliederung – der Fließtext
            wird Thema für Thema ergänzt. Das ist auf jeder betroffenen Seite deutlich
            gekennzeichnet.
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
            title={`${stats.topicCount} Themen von Aktie bis Sparerpauschbetrag`}
            lead="Die Reihenfolge ist ein Vorschlag, keine Vorgabe – jedes Thema ist für sich verständlich."
          />

          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {topics.map((topic, index) => (
              <li key={topic.slug} className="relative">
                <Reveal delay={Math.min(index, 8) * 0.03} className="h-full">
                  <TopicCard topic={topic} index={index} />
                </Reveal>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <JsonLd
        data={collectionPageSchema({
          name: 'Lernbereich – Finanzwissen in drei Stufen',
          description:
            '23 Finanzthemen, jeweils in den Lernstufen Beginner, Fortgeschritten und Profi.',
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
