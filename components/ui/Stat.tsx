import type { ReactNode } from 'react'

import { cn } from '@/lib/cn'

/**
 * Einzelne Kennzahl mit Label.
 *
 * Wird für Kursdetails, Rechnerergebnisse und den Ländervergleich genutzt.
 * `tabular-nums` sorgt dafür, dass Ziffern in Listen exakt untereinander
 * stehen und beim Aktualisieren nicht springen.
 *
 * ## Warum hier kein Kasten mehr steht
 *
 * Bis zum 28. August 2026 war jede Kennzahl eine gerundete Kachel mit Rahmen
 * und eigener Füllung. Auf der Aktienseite standen davon sechs nebeneinander,
 * jede mit einem drei Zeilen langen Erklärsatz darin – zwei Reihen ungleich
 * hoher Kästen, bevor der erste Kurs zu sehen war. Der Betreiber hat es an
 * diesem Tag so beschrieben: „an vielen Stellen sehr unübersichtlich".
 *
 * Sechs Rahmen sagen sechsmal dasselbe: „hier fängt etwas an". Das sagt eine
 * Haarlinie auch, und sie kostet keine Fläche. Übrig bleibt die Anordnung
 * selbst – Etikett oben, Zahl groß darunter –, und die trägt die Gliederung
 * ohnehin allein.
 *
 * Das Muster ist nicht neu erfunden, sondern von der Startseite übernommen:
 * Die drei Zahlen unter dem Titel („Themen, Lernstufen, Rechner") stehen seit
 * jeher so da, in gesperrter Kleinschrift über einer großen Ziffer mit einer
 * Linie darüber. Sie waren die ruhigste Stelle der Website; jetzt sind es alle
 * Kennzahlen.
 */
export function Stat({
  label,
  value,
  hint,
  hinweisFliesst = false,
  tone = 'neutral',
  className,
}: {
  label: string
  value: ReactNode
  hint?: string
  /**
   * Ob im Hinweis laufende Daten stehen – ein Kurs, ein Stand, eine
   * Tagesveränderung.
   *
   * Der Wert oben trägt `tabular-nums` und wird davon schon erfasst; der
   * Hinweis ist Fließtext und sieht statisch aus. Steht dort trotzdem eine
   * Zahl, die sich alle dreißig Minuten ändert, muss sie vor dem Einfrieren
   * abgedeckt werden – sonst schlägt `npm run bilder` bei jedem Kursabruf an.
   */
  hinweisFliesst?: boolean
  tone?: 'neutral' | 'positive' | 'negative' | 'brand'
  className?: string
}) {
  const toneClass = {
    neutral: 'text-fg',
    positive: 'text-success',
    negative: 'text-danger',
    brand: 'text-brand',
  }[tone]

  return (
    <div className={cn('border-border border-t pt-3', className)}>
      <dt className="text-fg-subtle font-mono text-xs font-medium tracking-wide uppercase">
        {label}
      </dt>
      <dd
        className={cn(
          'font-display mt-1.5 text-2xl font-semibold tabular-nums sm:text-3xl',
          toneClass
        )}
      >
        {value}
      </dd>
      {hint && (
        <p
          className="text-fg-subtle mt-1.5 text-xs leading-relaxed"
          data-fliesst={hinweisFliesst ? '' : undefined}
        >
          {hint}
        </p>
      )}
    </div>
  )
}

/** Container für mehrere {@link Stat}-Elemente als Definitionsliste. */
export function StatGrid({
  children,
  columns = 3,
  className,
}: {
  children: ReactNode
  columns?: 2 | 3 | 4
  className?: string
}) {
  const columnClass = {
    2: 'sm:grid-cols-2',
    3: 'sm:grid-cols-2 lg:grid-cols-3',
    4: 'sm:grid-cols-2 lg:grid-cols-4',
  }[columns]

  // Weite Spalten, luftige Zeilen: Ohne Rahmen muss der Abstand die Trennung
  // machen, die vorher die Kante gemacht hat. Zu eng gesetzt liefe sonst die
  // Erklärzeile der einen Zahl optisch unter die nächste.
  return (
    <dl className={cn('grid gap-x-8 gap-y-6', columnClass, className)}>{children}</dl>
  )
}
