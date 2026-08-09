import Link from 'next/link'

import { TopicProgress } from '@/components/learn/TopicProgress'
import { learnLevelIds } from '@/data/learn/types'
import type { LearnTopic } from '@/lib/learn'

/**
 * Kachel eines Lernthemas für das Übersichts-Grid.
 *
 * Zeigt an, ob der Fließtext des Themas schon vollständig vorliegt – so ist der
 * Bearbeitungsstand transparent, statt Besucher auf einer Gliederung überraschen
 * zu lassen.
 */
export function TopicCard({ topic, index }: { topic: LearnTopic; index: number }) {
  const isComplete = learnLevelIds.every(
    (levelId) => topic.levels[levelId].status === 'complete'
  )
  const totalMinutes = learnLevelIds.reduce(
    (sum, levelId) => sum + topic.levels[levelId].readingMinutes,
    0
  )

  return (
    <article className="fk-card-interactive group flex h-full flex-col p-6">
      {/*
        Das Etikett erscheint nur, wenn es etwas zu melden gibt.

        „Ausgearbeitet“ stand auf jeder der 34 Kacheln, seit jedes Thema
        fertig ist – ein Hinweis, der auf allen gilt, unterscheidet nichts
        und kostet nur Zeile. Umgekehrt bleibt „Gliederung“ wichtig: Wer auf
        eine solche Seite klickt, soll es vorher wissen.
      */}
      <div className="flex items-start justify-between gap-3">
        <span className="bg-learn-soft text-learn flex size-9 items-center justify-center rounded-xl text-sm font-bold">
          {index + 1}
        </span>
        {!isComplete && (
          <span className="fk-chip bg-surface-muted text-fg-subtle">Gliederung</span>
        )}
      </div>

      <h3 className="text-fg mt-4 text-lg font-semibold">
        <Link
          href={`/lernen/${topic.slug}`}
          className="group-hover:text-brand transition"
        >
          <span aria-hidden="true" className="absolute inset-0" />
          {topic.title}
        </Link>
      </h3>

      <p className="text-fg-muted mt-2 flex-1 text-sm leading-relaxed">{topic.lead}</p>

      <TopicProgress topicSlug={topic.slug} nurWennBegonnen className="mt-5" />

      {/* Ohne „Öffnen →“: Die Kachel ist der Link, 34-mal derselbe Pfeil nicht. */}
      <p className="text-fg-subtle mt-4 text-xs">3 Stufen · {totalMinutes} Min.</p>
    </article>
  )
}
