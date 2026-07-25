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
}: {
  topicSlug: string
  className?: string
}) {
  const completed = useCompletedLevels()
  const done = learnLevelIds.filter((levelId) =>
    completed.includes(levelKey(topicSlug, levelId))
  ).length

  return (
    <ProgressBar
      value={done}
      max={learnLevelIds.length}
      label={`${done} von ${learnLevelIds.length} Stufen`}
      className={className}
    />
  )
}
