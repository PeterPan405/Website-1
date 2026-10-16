import type { Metadata } from 'next'
import Link from 'next/link'

import { OverallProgress } from '@/components/learn/OverallProgress'
import { PfadStart } from '@/components/learn/PfadStart'
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
import { getLernpfade, startSchritte } from '@/lib/lernpfade'
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
  const einstieg = pfade.find((pfad) => pfad.slug === 'erste-schritte')
  const weitere = pfade.filter((pfad) => pfad !== einstieg)
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
        {/* ------------------------------------------------- Loslegen */}
        {/*
          Der Betreiber am 16.10.2026: „die Lernwelt mit den Pfaden einfacher
          gestalten, dass man gleich loslegen kann – das ist ein wenig komplex
          gestaltet". Bis dahin standen über den Themen ein Fortschrittsbalken,
          drei Knöpfe, ein Pfade-Kasten mit fünf weiteren Knöpfen, die
          Erklärung der Stufen und der Bearbeitungsstand – und nirgends ein
          Knopf, der einfach mit dem ersten Schritt beginnt.

          Jetzt zuerst eine Frage mit drei Antworten. Wer bei null anfängt,
          kommt mit einem Klick in die erste Stufe – oder, wenn er schon
          gelesen hat, in die nächste offene (`PfadStart`).
        */}
        <section aria-labelledby="loslegen">
          <h2 id="loslegen" className="text-fg text-2xl font-bold sm:text-3xl">
            Wo willst du anfangen?
          </h2>
          <div className="mt-6 grid gap-5 lg:grid-cols-3">
            {einstieg && (
              <div className="rounded-card border-learn/30 bg-learn-soft flex flex-col border p-6">
                <h3 className="text-fg text-lg font-bold">Ich fange bei null an</h3>
                <p className="text-fg-muted mt-2 flex-1 text-sm leading-relaxed">
                  {einstieg.kurz} Schritt für Schritt, jeder baut auf dem davor auf.
                </p>
                <PfadStart
                  schritte={startSchritte(einstieg)}
                  zusatz={`rund ${Math.round(einstieg.lesezeit / 5) * 5} Minuten insgesamt`}
                  className="mt-5"
                />
              </div>
            )}
            <div className="fk-card flex flex-col p-6">
              <h3 className="text-fg text-lg font-bold">Ich habe eine konkrete Frage</h3>
              <ul className="mt-3 flex-1 space-y-3">
                {weitere.map((pfad) => (
                  <li key={pfad.slug}>
                    <Link
                      href={`/lernen/pfade/${pfad.slug}`}
                      className="group flex items-start gap-2"
                    >
                      <Icon
                        name="compass"
                        className="text-learn mt-0.5 size-4 shrink-0"
                      />
                      <span>
                        <span className="text-fg group-hover:text-learn font-semibold">
                          {pfad.titel}
                        </span>
                        <span className="text-fg-subtle block text-xs leading-relaxed">
                          {pfad.kurz}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="fk-card flex flex-col p-6">
              <h3 className="text-fg text-lg font-bold">Ich weiß schon einiges</h3>
              <p className="text-fg-muted mt-2 flex-1 text-sm leading-relaxed">
                Der Einstufungstest zeigt, welche Stufen du überspringen kannst – und wo
                es sich lohnt, noch einmal hinzuschauen.
              </p>
              <Link href="/lernen/stand" className="fk-btn-secondary mt-5 self-start">
                Zum Einstufungstest
                <Icon name="arrow-right" className="size-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ------------------------------------- Fortschritt und Werkzeuge */}
        <div className="mt-12">
          <OverallProgress topicSlugs={topicSlugs} />
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">
            <Link
              href="/lernen/wiederholen"
              className="text-learn font-medium hover:underline"
            >
              Wiederholen
            </Link>
            <Link
              href="/lernen/30-tage"
              className="text-learn font-medium hover:underline"
            >
              30-Tage-Programm
            </Link>
            <Link href="/lernen/pfade" className="text-learn font-medium hover:underline">
              Alle Pfade
            </Link>
            {/*
              Das Schaufenster der Erklärgrafiken – gebaut, in der Sitemap und
              lange ohne einen einzigen Verweis (gefunden von `npm run
              verwaist`). Es bleibt verlinkt, nur leiser.
            */}
            <Link
              href="/lernen/grafiken"
              className="text-learn font-medium hover:underline"
            >
              Alle Erklärgrafiken
            </Link>
          </div>
        </div>

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
                className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
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
        {/* --------------------------------------------- Stufen erklären */}
        <section aria-labelledby="stufen" className="mt-14">
          <SectionHeading
            id="stufen"
            eyebrow="Aufbau"
            title="Was die drei Stufen unterscheidet"
          />
          <ul className="mt-6 grid gap-5 md:grid-cols-3">
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
        {/*
          Ohne Kasten, seit dem 29. August 2026.

          Dieser Abschnitt ist Auskunft über die Redaktion, nicht über den
          Lernstoff – er gehört ans Ende und braucht dort kein eigenes Gehäuse.
          Auf dem Weg zu den 34 Themen standen bis dahin fünf gerahmte Blöcke
          untereinander; dieser war der vierte. Eine Linie über der Überschrift
          sagt „hier fängt etwas Neues an" genauso gut.

          Seit dem 16.10.2026 steht er nur noch, solange nicht alle Themen
          fertig sind – mit „34 von 34" sagte er nichts mehr.
        */}
        {completeTopics.length < stats.topicCount && (
          <section aria-labelledby="stand" className="border-border mt-12 border-t pt-8">
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
            {/*
            Die Liste der fertigen Themen erscheint nur, solange sie etwas
            aussagt – also solange es unfertige gibt.

            Seit alle 34 vollständig sind, wiederholte sie bloß den Satz
            darüber („34 von 34“) in Form einer Knopfkolonne über zwei
            Bildschirmhöhen. Die vollständige Themenliste steht ohnehin
            zwei Abschnitte tiefer, dort nach Abschnitten geordnet.
          */}
            {completeTopics.length < stats.topicCount && (
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
            )}

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
        )}
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
