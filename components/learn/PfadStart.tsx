'use client'

import Link from 'next/link'

import { useCompletedLevels } from '@/components/learn/progress-store'
import { Icon } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'

export interface StartSchritt {
  /** `thema:stufe` bei Stufen, `rechner:…` bei Rechnern. */
  kennung: string
  href: string
  titel: string
  art: 'stufe' | 'rechner'
}

/**
 * Der eine Knopf, mit dem ein Pfad losgeht – oder weitergeht.
 *
 * Der Betreiber am 16.10.2026: „die Lernwelt mit den Pfaden einfacher
 * gestalten, dass man gleich loslegen kann". Bis dahin führte ein Pfad
 * erst über eine Übersichtsseite mit Steckbrief, Fortschritt und dreizehn
 * Karten; den Anfang musste man sich selbst suchen.
 *
 * Ziel ist die erste Stufe, die noch nicht abgehakt ist – derselbe Speicher
 * wie überall im Lernbereich. Rechner zählen nicht (niemand weiß, ob dort
 * gerechnet wurde); steht einer **vor** der nächsten offenen Stufe, beginnt
 * der Knopf bei ihm, damit er nicht übersprungen wird.
 *
 * Vor der Übernahme durch den Browser kennt der Server keinen Fortschritt –
 * dann zeigt der Knopf Schritt 1, und das ist für jeden Erstbesuch richtig.
 */
export function PfadStart({
  schritte,
  className,
  zusatz,
}: {
  schritte: StartSchritt[]
  className?: string
  /** Kleine Zeile unter dem Knopf, etwa die Lesezeit. */
  zusatz?: string
}) {
  const erledigt = useCompletedLevels()
  const offen = schritte.findIndex(
    (s) => s.art === 'stufe' && !erledigt.includes(s.kennung)
  )
  const begonnen = schritte.some((s) => s.art === 'stufe' && erledigt.includes(s.kennung))

  if (offen === -1 && schritte.some((s) => s.art === 'stufe')) {
    return (
      <p className={cn('text-success flex items-center gap-2 font-semibold', className)}>
        <Icon name="check-circle" className="size-5" />
        Alle Stufen dieses Pfades gelesen.
      </p>
    )
  }

  /* Rechner direkt vor der nächsten offenen Stufe kommen zuerst dran. */
  let ziel = Math.max(offen, 0)
  while (ziel > 0 && schritte[ziel - 1].art === 'rechner') ziel--
  const schritt = schritte[ziel]

  return (
    <div className={className}>
      <Link href={schritt.href} className="fk-btn-primary">
        {begonnen ? `Weiter mit Schritt ${ziel + 1}` : 'Jetzt loslegen'}
        <Icon name="arrow-right" className="size-4" />
      </Link>
      <p className="text-fg-subtle mt-2 text-xs leading-relaxed">
        {begonnen ? 'Als Nächstes' : 'Erster Schritt'}: {schritt.titel}
        {zusatz ? ` · ${zusatz}` : ''}
      </p>
    </div>
  )
}
