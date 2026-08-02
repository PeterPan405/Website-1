import type { ReactNode } from 'react'

import { Icon } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'

/**
 * Ein zugeklappter Abschnitt – dasselbe Muster wie die Archivtage der
 * Nachrichtenseite, nur für die Unterthemen einer Detailseite.
 *
 * ## Warum zugeklappt
 *
 * Eine Aktienseite trägt inzwischen ein Dutzend Abschnitte: Erklärung,
 * Nachrichten, Dividende, Unternehmenszahlen, Branchenvergleich, Bewertung,
 * Kennzahlen … Untereinander ausgeklappt ist das eine halbe Stunde
 * Rollweg, und der Unterschied zwischen „gibt es hier" und „will ich jetzt
 * lesen" verschwindet. Als Kacheln mit Titel bleibt beides sichtbar: was
 * die Seite weiß, und dass man es nur bei Bedarf aufmacht.
 *
 * ## Handwerkliches
 *
 * - `<details>` statt eines Schalters: ohne JavaScript bedienbar, und die
 *   Browsersuche findet auch zugeklappte Inhalte.
 * - Die Überschrift lebt in der `<summary>`; die eigene `<h2>` des
 *   umschlossenen Abschnitts wird per Selektor ausgeblendet, damit sie beim
 *   Aufklappen nicht doppelt dasteht. Für Vorleseprogramme bleibt sie als
 *   Beschriftung des Abschnitts erhalten.
 * - Im Ausdruck sind alle Abschnitte offen (`data-drucken`-Regeln der
 *   Druck-CSS öffnen `<details>` nicht – deshalb `print:` hier direkt):
 *   Papier kann nicht klicken.
 */
export function Klappabschnitt({
  titel,
  hinweis,
  children,
  className,
}: {
  titel: string
  /** Kleine Zeile unter dem Titel – z. B. worum es im Abschnitt geht. */
  hinweis?: string
  children: ReactNode
  className?: string
}) {
  return (
    <details
      className={cn(
        'fk-card group px-5 py-4 sm:px-6',
        // Beim Aufklappen die innere Abschnittsüberschrift verstecken – die
        // Summary trägt denselben Titel schon.
        '[&>div>section]:mt-0 [&>div>section>h2:first-of-type]:hidden',
        'print:[&>div]:block',
        className
      )}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
        <span className="min-w-0">
          <span className="text-fg block text-lg font-semibold">{titel}</span>
          {hinweis && (
            <span className="text-fg-subtle mt-0.5 block text-sm">{hinweis}</span>
          )}
        </span>
        <span
          aria-hidden="true"
          className="text-fg-subtle shrink-0 transition-transform group-open:rotate-90"
        >
          <Icon name="chevron-right" className="size-5" />
        </span>
      </summary>
      <div className="mt-4">{children}</div>
    </details>
  )
}
