'use client'

import { lektionKey, useCompletedLevels } from '@/components/learn/progress-store'
import { Icon } from '@/components/ui/Icon'
import { ProgressBar } from '@/components/ui/ProgressBar'

/**
 * Wie viele Lektionen eines Bereichs erledigt sind.
 *
 * Steht über dem Kachelraster. Solange nichts markiert ist, erklärt die Zeile,
 * wie eine Markierung zustande kommt – ein leerer Balken ohne Erklärung sieht
 * aus, als wäre etwas kaputt.
 */
export function BereichFortschritt({
  bereich,
  slugs,
}: {
  bereich: string
  slugs: string[]
}) {
  const erledigt = useCompletedLevels()
  const fertig = slugs.filter((slug) =>
    erledigt.includes(lektionKey(bereich, slug))
  ).length

  return (
    <div className="fk-card mt-6 p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h3 className="text-fg text-sm font-semibold">Dein Stand in diesem Bereich</h3>
        <p className="text-fg-muted text-sm tabular-nums">
          {fertig} von {slugs.length} Lektionen
        </p>
      </div>

      <ProgressBar
        value={fertig}
        max={slugs.length}
        label={`${fertig} von ${slugs.length} Lektionen erledigt`}
        barClassName="bg-akademie"
        showValue={false}
        className="mt-3"
      />

      <p className="text-fg-subtle mt-3 flex items-start gap-2 text-xs leading-relaxed">
        <Icon name="shield" className="mt-0.5 size-3.5 shrink-0" />
        {fertig === 0
          ? 'Am Ende jeder Lektion steht ein Schalter „Als erledigt markieren“. Der Stand bleibt nur in diesem Browser – kein Konto, keine Übertragung.'
          : 'Der Stand liegt nur in diesem Browser. Auf einem anderen Gerät fängt die Zählung wieder bei null an.'}
      </p>
    </div>
  )
}
