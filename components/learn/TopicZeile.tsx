import Link from 'next/link'

import { learnLevelIds } from '@/data/learn/types'
import type { LearnTopic } from '@/lib/learn'

/**
 * Ein Thema als Zeile im Inhaltsverzeichnis von /lernen.
 *
 * Ersetzt am 27.10.2026 die Kachel (`TopicCard`) auf der Übersicht. Der
 * Betreiber: die Lernseite „ordentlich strukturiert und übersichtlich",
 * „nicht von den Lerninhalten, aber von den Anzeigen". 34 Kacheln mit
 * Nummernkästchen, Vorspann und Meta-Zeile waren sieben Bildschirmhöhen;
 * als Zeilen sind es zwei. Der Vorspann steht auf der Themenseite selbst.
 */
export function TopicZeile({ topic, index }: { topic: LearnTopic; index: number }) {
  const minuten = learnLevelIds.reduce(
    (sum, levelId) => sum + topic.levels[levelId].readingMinutes,
    0
  )
  const fertig = learnLevelIds.every(
    (levelId) => topic.levels[levelId].status === 'complete'
  )

  return (
    <Link
      href={`/lernen/${topic.slug}`}
      className="group border-border flex items-baseline gap-4 border-b py-3"
    >
      <span className="text-fg-subtle w-6 shrink-0 text-right text-sm tabular-nums">
        {index + 1}
      </span>
      <span className="text-fg group-hover:text-brand min-w-0 flex-1 font-medium transition">
        {topic.title}
        {!fertig && <span className="text-fg-subtle ml-2 text-xs">Gliederung</span>}
      </span>
      <span className="text-fg-subtle shrink-0 text-sm tabular-nums">{minuten} Min.</span>
    </Link>
  )
}
