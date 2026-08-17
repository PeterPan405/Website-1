import type { ReactNode } from 'react'

/**
 * Der Rechenweg unter dem Ergebnis – mit den Zahlen, die wirklich drinstehen.
 *
 * ## Warum das mehr ist als Zierrat
 *
 * Ein Rechner ohne Rechenweg ist ein Automat: Man wirft Zahlen hinein und
 * bekommt eine Zahl heraus, die man glauben muss. Mit Rechenweg wird er ein
 * **Lehrmittel** – und, was noch mehr zählt, das Ergebnis wird nachprüfbar.
 * Wer die Schritte mit dem Taschenrechner nachvollzieht, braucht dieser
 * Website an dieser Stelle nicht mehr zu vertrauen.
 *
 * Das ist der Unterschied zwischen „stimmt schon" und „ich habe es
 * nachgerechnet", und er ist der Grund, warum `/methoden` existiert. Dort
 * steht die Formel allgemein, hier steht sie mit den eingesetzten Zahlen.
 *
 * ## Warum zugeklappt
 *
 * Weil die meisten Besucher das Ergebnis wollen und nicht die Herleitung. Ein
 * aufgeklappter Rechenweg schiebt die Kennzahlen nach unten und macht die
 * Seite für alle länger, damit wenige nicht klicken müssen. Wer ihn sucht,
 * findet ihn – und die Überschrift sagt, was drinsteht.
 *
 * ## Warum die eingesetzte Zeile Pflicht ist
 *
 * Eine Formel allein ist eine Behauptung über den Code. Erst die Zeile mit den
 * echten Zahlen macht sie überprüfbar: Wenn dort „300.000 × 0,038 ÷ 12" steht
 * und daneben ein Ergebnis, das nicht dazu passt, sieht das jeder, der es
 * eintippt. Genau deshalb kommt sie aus denselben Werten wie die Anzeige und
 * ist nicht danebengeschrieben.
 */

export interface Rechenschritt {
  /** Was in diesem Schritt passiert – ein halber Satz, keine Überschrift. */
  was: string
  /** Die Formel, allgemein. */
  formel: string
  /** Dieselbe Formel mit den tatsächlich eingesetzten Zahlen. */
  eingesetzt: string
  /** Das Ergebnis dieses Schritts, formatiert wie in der Anzeige. */
  ergebnis: string
  /** Warum es so gerechnet wird – nur, wo es nicht selbstverständlich ist. */
  hinweis?: string
}

export function Rechenweg({
  schritte,
  titel = 'Rechenweg mit deinen Zahlen',
  einleitung,
  fussnote,
}: {
  schritte: readonly Rechenschritt[]
  titel?: string
  einleitung?: ReactNode
  fussnote?: ReactNode
}) {
  if (schritte.length === 0) return null

  return (
    <details className="fk-card group p-5 sm:p-6">
      <summary className="text-fg cursor-pointer list-none text-base font-semibold">
        <span className="group-open:hidden">{titel} anzeigen</span>
        <span className="hidden group-open:inline">{titel}</span>
      </summary>

      <p className="text-fg-muted mt-3 text-sm leading-relaxed">
        {einleitung ?? (
          <>
            Jeder Schritt mit den Zahlen, die oben eingetragen sind. Wer möchte, kann das
            mit dem Taschenrechner nachvollziehen – dann muss man dieser Seite an dieser
            Stelle nicht glauben.
          </>
        )}
      </p>

      <ol className="mt-5 space-y-5">
        {schritte.map((schritt, index) => (
          <li key={schritt.was} className="flex gap-4">
            <span className="border-border text-fg-subtle mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border text-xs font-semibold tabular-nums">
              {index + 1}
            </span>
            <div className="min-w-0">
              <p className="text-fg text-sm font-semibold">{schritt.was}</p>

              {/*
                Die allgemeine Formel steht kleiner über der eingesetzten.

                Andersherum – Zahlen oben, Formel darunter – liest sich der
                Schritt wie ein Ergebnis mit Fußnote. So liest er sich wie eine
                Rechnung: erst die Regel, dann der Fall.
              */}
              <p className="text-fg-subtle mt-1.5 font-mono text-xs break-words">
                {schritt.formel}
              </p>
              <p className="text-fg-muted mt-1 font-mono text-sm break-words">
                {schritt.eingesetzt}{' '}
                <span aria-hidden="true" className="text-fg-subtle">
                  =
                </span>{' '}
                <strong className="text-fg tabular-nums">{schritt.ergebnis}</strong>
              </p>

              {schritt.hinweis && (
                <p className="text-fg-muted mt-2 text-sm leading-relaxed">
                  {schritt.hinweis}
                </p>
              )}
            </div>
          </li>
        ))}
      </ol>

      {fussnote && (
        <p className="text-fg-subtle mt-6 text-sm leading-relaxed">{fussnote}</p>
      )}
    </details>
  )
}
