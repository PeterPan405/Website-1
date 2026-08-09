'use client'

import { learnLevelIds } from '@/data/learn/types'
import { levelKey, useCompletedLevels } from '@/components/learn/progress-store'
import { ProgressBar } from '@/components/ui/ProgressBar'

/**
 * Fortschrittsbalken für ein einzelnes Thema.
 *
 * Vor der Hydration ist der Fortschritt null (der Server kennt den localStorage
 * nicht). Der Balken füllt sich anschließend animiert – als Bewegung wirkt das
 * angenehm, während ein harter Sprung störend wäre.
 */
export function TopicProgress({
  topicSlug,
  className,
  nurWennBegonnen = false,
}: {
  topicSlug: string
  className?: string
  /**
   * Nichts anzeigen, solange an diesem Thema nichts erledigt ist.
   *
   * Für die Themenübersicht: Dort standen 34 Balken untereinander, alle auf
   * null – eine Fortschrittsanzeige, die nichts anzeigt, ist Rauschen. Wer
   * begonnen hat, sieht seinen Stand weiterhin genau dort. In der
   * Seitenleiste eines Themas bleibt der Balken dagegen immer sichtbar: Dort
   * ist er die Antwort auf eine Frage, die der Besucher gestellt hat.
   */
  nurWennBegonnen?: boolean
}) {
  const completed = useCompletedLevels()
  const done = learnLevelIds.filter((levelId) =>
    completed.includes(levelKey(topicSlug, levelId))
  ).length

  if (nurWennBegonnen && done === 0) return null

  return (
    <ProgressBar
      value={done}
      max={learnLevelIds.length}
      label={`${done} von ${learnLevelIds.length} Stufen`}
      className={className}
    />
  )
}
