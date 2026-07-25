'use client'

import {
  levelKey,
  resetProgress,
  useCompletedLevels,
} from '@/components/learn/progress-store'
import { Icon } from '@/components/ui/Icon'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { learnLevelIds } from '@/data/learn/types'
import { formatNumber } from '@/lib/format'

/**
 * Gesamtfortschritt über alle Themen.
 *
 * Steht auf der Übersichtsseite des Lernbereichs und macht sichtbar, wie viel
 * schon geschafft ist – der Kern des Gamification-Ansatzes: sichtbarer,
 * messbarer Fortschritt.
 */
export function OverallProgress({ topicSlugs }: { topicSlugs: string[] }) {
  const completed = useCompletedLevels()

  const allKeys = topicSlugs.flatMap((slug) =>
    learnLevelIds.map((levelId) => levelKey(slug, levelId))
  )
  const done = allKeys.filter((key) => completed.includes(key)).length
  const total = allKeys.length

  /** Themen, in denen alle drei Stufen erledigt sind. */
  const finishedTopics = topicSlugs.filter((slug) =>
    learnLevelIds.every((levelId) => completed.includes(levelKey(slug, levelId)))
  ).length

  return (
    <section aria-labelledby="fortschritt" className="fk-card p-6 sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 id="fortschritt" className="text-fg text-lg font-semibold">
            Dein Fortschritt
          </h2>
          <p className="text-fg-muted mt-1 text-sm">
            {done === 0
              ? 'Noch nichts markiert. Öffne ein Thema und markiere eine Stufe als erledigt.'
              : `${formatNumber(done, 0)} von ${formatNumber(total, 0)} Stufen erledigt${
                  finishedTopics > 0
                    ? finishedTopics === 1
                      ? ', ein Thema vollständig'
                      : `, ${formatNumber(finishedTopics, 0)} Themen vollständig`
                    : ''
                }.`}
          </p>
        </div>

        {done > 0 && (
          <button
            type="button"
            onClick={() => {
              resetProgress()
            }}
            className="fk-btn-ghost px-3 py-1.5 text-xs"
          >
            <Icon name="close" className="size-3.5" />
            Fortschritt zurücksetzen
          </button>
        )}
      </div>

      <ProgressBar
        value={done}
        max={total}
        label={`${done} von ${total} Lernstufen abgeschlossen`}
        className="mt-5"
      />

      <p className="text-fg-subtle mt-4 flex items-start gap-2 text-xs leading-relaxed">
        <Icon name="shield" className="mt-0.5 size-3.5 shrink-0" />
        Der Fortschritt wird ausschließlich in diesem Browser gespeichert. Kein Konto,
        keine Übertragung an einen Server – dafür ist er auf anderen Geräten nicht
        sichtbar.
      </p>
    </section>
  )
}
