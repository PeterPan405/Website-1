'use client'

import { lektionKey, useCompletedLevels } from '@/components/learn/progress-store'
import { ProgressBar } from '@/components/ui/ProgressBar'

/**
 * Wie viele Lektionen einer Akademiewoche erledigt sind.
 *
 * ## Warum nicht `BereichFortschritt`
 *
 * Der zählt innerhalb **eines** Bereichs und bekommt deshalb nur Slugs. Eine
 * Woche schneidet quer durch alle fünf Bereiche – dieselben Slugs würden dort
 * gegen den falschen Schlüssel geprüft und der Balken bliebe immer leer. Kein
 * Fehler, keine Meldung, nur eine Zahl, die nie steigt.
 *
 * Gezählt wird derselbe Stand wie überall in der Akademie: Was auf einer
 * Lektionsseite abgehakt ist, zählt hier mit.
 */
export function WochenFortschritt({
  lektionen,
}: {
  lektionen: { bereich: string; slug: string }[]
}) {
  const erledigt = useCompletedLevels()
  const fertig = lektionen.filter((l) =>
    erledigt.includes(lektionKey(l.bereich, l.slug))
  ).length

  return (
    <div className="mt-4">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <p className="text-fg-muted text-sm">
          {fertig} von {lektionen.length} Lektionen erledigt
        </p>
      </div>
      <ProgressBar
        value={fertig}
        max={lektionen.length}
        label={`${fertig} von ${lektionen.length} Lektionen dieser Woche erledigt`}
        barClassName="bg-akademie"
        showValue={false}
        className="mt-2"
      />
    </div>
  )
}
