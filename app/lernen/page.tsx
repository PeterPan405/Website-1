import type { Metadata } from 'next'
import Link from 'next/link'

import { OverallProgress } from '@/components/learn/OverallProgress'
import { PfadStart } from '@/components/learn/PfadStart'
import { TopicZeile } from '@/components/learn/TopicZeile'
import { JsonLd } from '@/components/seo/JsonLd'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Icon } from '@/components/ui/Icon'
import { PageHeader } from '@/components/ui/PageHeader'
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

  return (
    <>
      <PageHeader
        area="learn"
        title="Finanzwissen in drei Stufen"
        lead="Jedes Thema gibt es dreimal: Beginner klärt die Begriffe, Fortgeschritten die Umsetzung, Profi die Sonderfälle, Kennzahlen und Steuern."
        breadcrumbs={<Breadcrumbs items={[{ name: 'Lernen' }]} />}
      />

      <div className="fk-container py-12 sm:py-16">
        {/* ------------------------------------------------- Loslegen */}
        {/*
          Der Betreiber am 16.10.2026: „die Lernwelt mit den Pfaden einfacher
          gestalten, dass man gleich loslegen kann". Am 27.10.2026 dann: „das
          mit der Lernseite … ist einfach viel zu viel … übersichtlicher
          gestaltet, nicht von den Lerninhalten, aber von den Anzeigen".

          Die drei Einstiege bleiben, aber als Spalten ohne Kasten, Farbfläche
          und Symbole; die Pfade ohne Unterzeile. Weg sind die Kachel-Wand der
          34 Themen (jetzt ein Inhaltsverzeichnis, `TopicZeile`), die Erklärung
          der drei Stufen (steht im Vorspann) und die farbige Linkzeile.
        */}
        <section aria-labelledby="loslegen">
          <h2 id="loslegen" className="text-fg text-2xl font-semibold">
            Wo willst du anfangen?
          </h2>
          <div className="border-border mt-6 grid gap-8 border-t pt-6 lg:grid-cols-3">
            {einstieg && (
              <div className="flex flex-col">
                <h3 className="text-fg font-semibold">Ich fange bei null an</h3>
                <p className="text-fg-muted mt-1 flex-1 text-sm leading-relaxed">
                  {einstieg.kurz}
                </p>
                <PfadStart
                  schritte={startSchritte(einstieg)}
                  zusatz={`rund ${Math.round(einstieg.lesezeit / 5) * 5} Minuten insgesamt`}
                  className="mt-4"
                />
              </div>
            )}
            <div>
              <h3 className="text-fg font-semibold">Ich habe eine konkrete Frage</h3>
              <ul className="mt-2 space-y-1.5 text-sm">
                {weitere.map((pfad) => (
                  <li key={pfad.slug}>
                    <Link
                      href={`/lernen/pfade/${pfad.slug}`}
                      className="text-fg hover:text-brand underline-offset-4 hover:underline"
                    >
                      {pfad.titel}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-fg font-semibold">Ich weiß schon einiges</h3>
              <p className="text-fg-muted mt-1 text-sm leading-relaxed">
                Der Einstufungstest zeigt, welche Stufen du überspringen kannst.
              </p>
              <Link
                href="/lernen/stand"
                className="text-brand mt-3 inline-block text-sm font-semibold hover:underline"
              >
                Zum Einstufungstest →
              </Link>
            </div>
          </div>
        </section>

        <div className="mt-12">
          <OverallProgress topicSlugs={topicSlugs} />
        </div>

        {/* ---------------------------------------------- Inhaltsverzeichnis */}
        <section aria-labelledby="alle-themen" className="mt-14">
          <h2 id="alle-themen" className="text-fg text-2xl font-semibold">
            Alle {stats.topicCount} Themen
          </h2>
          <p className="text-fg-muted mt-2 max-w-2xl text-sm leading-relaxed">
            In dieser Reihenfolge bauen sie aufeinander auf – jedes ist aber auch für sich
            verständlich.
          </p>

          {/*
            Die Abschnitte kommen aus `data/learn`, nicht aus dieser Datei.
            Wer dort ein Thema verschiebt, verschiebt es damit auch hier.
          */}
          <div className="mt-8 grid gap-x-12 gap-y-10 lg:grid-cols-2">
            {sections.map((section) => (
              <div key={section.id}>
                <h3
                  id={`abschnitt-${section.id}`}
                  className="text-fg border-fg border-b pb-2 font-semibold"
                >
                  {section.label}
                </h3>
                <ul aria-labelledby={`abschnitt-${section.id}`}>
                  {section.topics.map((topic, index) => (
                    <li key={topic.slug}>
                      <TopicZeile topic={topic} index={section.offset + index} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <p className="text-fg-muted mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <Link href="/lernen/wiederholen" className="hover:text-fg hover:underline">
              Wiederholen
            </Link>
            <Link href="/lernen/30-tage" className="hover:text-fg hover:underline">
              30-Tage-Programm
            </Link>
            <Link href="/lernen/pfade" className="hover:text-fg hover:underline">
              Alle Pfade
            </Link>
            {/* Lange ohne einen einzigen Verweis (`npm run verwaist`) – bleibt verlinkt. */}
            <Link href="/lernen/grafiken" className="hover:text-fg hover:underline">
              Alle Erklärgrafiken
            </Link>
          </p>
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
