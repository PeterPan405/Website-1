'use client'

import { useCompletedLevels } from '@/components/learn/progress-store'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Icon } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'

/**
 * Fortschritt auf einem Lernpfad.
 *
 * Gezählt wird derselbe Speicher, den der Lernbereich schreibt: Wer eine Stufe
 * dort abhakt, sieht sie hier als erledigt. Ein eigener Pfadfortschritt wäre
 * eine zweite Wahrheit über dieselbe Sache – und beide liefen auseinander,
 * sobald jemand ein Thema einmal über die Übersicht und einmal über den Pfad
 * öffnet.
 *
 * Rechner zählen nicht mit. Ob jemand eine Zahl eingegeben hat, weiß niemand,
 * und ein Häkchen dafür wäre geraten.
 */
export function PfadFortschritt({
  kennungen,
  className,
}: {
  kennungen: string[]
  className?: string
}) {
  const erledigt = useCompletedLevels()
  const fertig = kennungen.filter((kennung) => erledigt.includes(kennung)).length

  return (
    <ProgressBar
      value={fertig}
      max={kennungen.length}
      label={`${fertig} von ${kennungen.length} Stufen gelesen`}
      className={className}
    />
  )
}

/**
 * Das Häkchen an einem einzelnen Schritt.
 *
 * Vor der Übernahme durch den Browser ist nichts als erledigt bekannt – der
 * Server kennt den localStorage nicht. Der Punkt zeigt deshalb zunächst die
 * Schrittnummer und wird erst danach zum Haken.
 */
export function SchrittMarke({
  kennung,
  nummer,
}: {
  /** Fehlt bei Rechnern – die führen keinen Fortschritt. */
  kennung?: string
  nummer: number
}) {
  const erledigt = useCompletedLevels()
  const fertig = Boolean(kennung && erledigt.includes(kennung))

  return (
    <span
      className={cn(
        'flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-bold',
        fertig ? 'bg-success text-brand-contrast' : 'bg-learn-soft text-learn'
      )}
      aria-hidden="true"
    >
      {fertig ? <Icon name="check" className="size-4" /> : nummer}
    </span>
  )
}
