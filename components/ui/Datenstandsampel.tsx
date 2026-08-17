'use client'

import { useSyncExternalStore } from 'react'

import { cn } from '@/lib/cn'
import { beurteile, type Erwartung } from '@/lib/datenstand'
import { formatDate, formatDateTime } from '@/lib/format'

/**
 * Wie alt eine Zahl ist – und ab wann das zu alt wäre.
 *
 * ## Warum das im Browser rechnet und nicht beim Bauen
 *
 * Weil eine Ampel, die beim Bau rechnet, **niemals rot werden kann**. Sie
 * stünde auf Grün, weil der Wert beim Bauen frisch war, und bliebe grün,
 * solange die Seite ausgeliefert wird – im Cache eines Besuchers, in einem
 * geöffneten Tab, in der Vorschau einer Suchmaschine.
 *
 * Das wäre eine Absicherung, die aussieht wie Ruhe: Der Besucher liest „auf
 * dem Stand des letzten Handelsschlusses“ und hat eine drei Tage alte Zahl
 * vor sich. Der stille Fehler, nicht der laute.
 *
 * Deshalb `useSyncExternalStore` mit zwei Momentaufnahmen: Server und Bau
 * bekommen `null` und liefern nur das nackte Datum ohne Urteil, der Browser
 * bekommt seine eigene Uhr. Wer kein JavaScript ausführt, sieht das Datum –
 * also weniger, aber nichts Falsches.
 *
 * Der Nebeneffekt ist der eigentliche Gewinn: Ein Tab, der über Nacht offen
 * bleibt, bekommt die Ampel **nachgeführt**. Eine einmalige Messung beim
 * Laden hätte dasselbe Problem eine Stufe kleiner – sie wäre auf den Moment
 * des Ladens eingefroren statt auf den des Bauens.
 *
 * ## Warum die Farbe nie allein steht
 *
 * Neben jeder Stufe steht ein ganzer Satz, und der trägt die Aussage. Farbe
 * allein ist für einen Screenreader nicht vorhanden und für rund acht Prozent
 * der Männer schlecht zu unterscheiden. Der Punkt ist deshalb `aria-hidden`
 * und die Form unterscheidet zusätzlich zur Farbe.
 */

/*
  Die Farben kommen aus den Rollen-Tokens, nicht aus festen Werten.

  `success`, `warning` und `danger` sind in `app/globals.css` für beide
  Schemata getrennt definiert. Ein hier eingetragenes `#16a34a` wäre im
  dunklen Schema zu dunkel für den Hintergrund – und zwar lautlos.
*/
const stufen = {
  frisch: {
    farbe: 'bg-success',
    rahmen: 'border-success/30 bg-success-soft',
    wort: 'Aktuell',
  },
  aelter: {
    farbe: 'bg-warning',
    rahmen: 'border-warning/30 bg-warning-soft',
    wort: 'Älter',
  },
  veraltet: {
    farbe: 'bg-danger',
    rahmen: 'border-danger/30 bg-danger-soft',
    wort: 'Veraltet',
  },
} as const

/**
 * Die Uhr des Besuchers, auf die Minute gerundet.
 *
 * Gerundet, weil `useSyncExternalStore` bei jedem Rendern denselben Wert
 * zurückbekommen muss. Ein ungerundetes `Date.now()` wäre jedes Mal ein
 * anderer und träte eine Endlosschleife los.
 *
 * Eine Minute ist fein genug: Die gröbste Stufe dieser Ampel ist ein Tag.
 */
const MINUTE_MS = 60_000

function jetztAufDieMinute(): number {
  return Math.floor(Date.now() / MINUTE_MS) * MINUTE_MS
}

/** Auf dem Server gibt es keine Gegenwart – also auch kein Urteil. */
function beimBauen(): null {
  return null
}

function abonniere(melden: () => void): () => void {
  const uhr = setInterval(melden, MINUTE_MS)
  return () => clearInterval(uhr)
}

export function Datenstandsampel({
  stand,
  erwartung,
  quelle,
  className,
}: {
  /** Der Zeitstempel der Zahl – `YYYY-MM-DD` oder vollständig mit Uhrzeit. */
  stand: string
  erwartung: Erwartung
  /** Woher die Zahl kommt, falls das nicht schon danebensteht. */
  quelle?: { label: string; url?: string }
  className?: string
}) {
  /*
    `null`, bis der Browser seine Uhr beisteuert.

    Nicht etwa eine vorberechnete Stufe als Startwert: Die käme aus dem Bau
    und wäre genau die eingefrorene Ampel, um die es oben geht. Zwischen
    Auslieferung und erstem Rendern steht deshalb das Datum allein.
  */
  const jetztMs = useSyncExternalStore(abonniere, jetztAufDieMinute, beimBauen)
  const befund = jetztMs === null ? null : beurteile(stand, erwartung, new Date(jetztMs))

  const datum = stand.length === 10 ? formatDate(stand) : formatDateTime(stand)

  if (!befund) {
    return (
      <p className={cn('text-fg-subtle text-xs', className)}>
        Stand {datum}
        {quelle && <> · Quelle: {quelle.label}</>}
      </p>
    )
  }

  const stufe = stufen[befund.frische]

  return (
    <div
      className={cn('rounded-lg border px-3 py-2 text-xs', stufe.rahmen, className)}
      /*
        `polite`, nicht `assertive`: Der Befund erscheint eine Sekunde nach dem
        Laden. Ein Screenreader soll ihn erwähnen, wenn er ohnehin Luft hat,
        und nicht mitten im Satz unterbrechen.
      */
      aria-live="polite"
    >
      <p className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <span
          aria-hidden="true"
          className={cn(
            'inline-block size-2 shrink-0 translate-y-px rounded-full',
            stufe.farbe
          )}
        />
        <strong className="text-fg font-semibold">{stufe.wort}</strong>
        <span className="text-fg-muted">Stand {datum}</span>
      </p>
      <p className="text-fg-muted mt-1.5 leading-relaxed">
        {befund.satz}
        {quelle && (
          <>
            {' '}
            Quelle:{' '}
            {quelle.url ? (
              <a
                href={quelle.url}
                rel="noopener noreferrer"
                target="_blank"
                className="underline underline-offset-2"
              >
                {quelle.label}
              </a>
            ) : (
              quelle.label
            )}
            .
          </>
        )}
      </p>
    </div>
  )
}
