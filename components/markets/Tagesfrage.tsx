'use client'

import { useState } from 'react'
import Link from 'next/link'

import type { Tagesfrage as Frage } from '@/lib/tagesfrage'

/**
 * Die Tagesfrage zum Anklicken.
 *
 * ## Warum die Antwort nicht sofort dasteht
 *
 * Weil es sonst keine Frage wäre, sondern eine Aussage mit Fragezeichen. Der
 * Nutzen liegt in der Sekunde zwischen Lesen und Auflösen – wer erst tippt,
 * merkt sich die Zahl.
 *
 * ## Warum nach dem Klick alle Zahlen dastehen
 *
 * Nicht nur die richtige. Der Sinn der Frage ist der Vergleich, und wer
 * daneben lag, will wissen, wie weit. Eine Auflösung, die nur die richtige
 * Zahl nennt, beantwortet die Frage und erklärt nichts.
 *
 * ## Warum kein Fortschritt gespeichert wird
 *
 * Weil die Frage morgen eine andere ist. Ein Zähler „14 von 20 richtig" wäre
 * eine Statistik über etwas, das keine Reihe ist – und die Website legt für
 * die Lernstufen ohnehin schon einen Stand im Browser ab. Noch einer für ein
 * Tagesspiel wäre Datenhaltung ohne Zweck.
 */
export function Tagesfrage({ frage }: { frage: Frage }) {
  const [gewaehlt, setGewaehlt] = useState<number | null>(null)
  const aufgeloest = gewaehlt !== null

  return (
    <div>
      <p className="text-fg mt-2 text-xl font-bold">{frage.frage}</p>

      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {frage.antworten.map((antwort, index) => {
          const istRichtig = index === frage.richtigIndex
          const istGewaehlt = index === gewaehlt

          return (
            <li key={antwort.symbol}>
              <button
                type="button"
                onClick={() => setGewaehlt(index)}
                disabled={aufgeloest}
                aria-pressed={istGewaehlt}
                className={[
                  'flex w-full items-baseline justify-between gap-3 rounded-lg border px-4 py-3 text-left text-sm transition',
                  aufgeloest && istRichtig
                    ? 'border-brand bg-surface text-fg font-semibold'
                    : aufgeloest && istGewaehlt
                      ? 'border-border bg-surface-muted text-fg-muted'
                      : aufgeloest
                        ? 'border-border text-fg-subtle'
                        : 'border-border text-fg hover:border-brand hover:bg-surface',
                ].join(' ')}
              >
                <span>{antwort.label}</span>
                {/*
                  Nach dem Klick stehen alle Zahlen da, nicht nur die richtige.

                  Der Sinn der Frage ist der Vergleich; wer daneben lag, will
                  wissen, wie weit. Vorher stünde dort die Antwort.
                */}
                {aufgeloest && (
                  <span className="tabular-nums">
                    {antwort.wert > 0 ? '+' : ''}
                    {antwort.wert.toLocaleString('de-DE', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                    &nbsp;{frage.einheit}
                  </span>
                )}
              </button>
            </li>
          )
        })}
      </ul>

      {aufgeloest && (
        <div className="border-brand/40 bg-surface mt-4 rounded-lg border-l-4 p-4">
          <p className="text-fg-subtle text-xs font-semibold tracking-wide uppercase">
            {gewaehlt === frage.richtigIndex ? 'Richtig' : 'Nicht ganz'}
          </p>
          <p className="text-fg-muted mt-2 text-sm leading-relaxed">{frage.aufloesung}</p>
          <p className="text-fg-subtle mt-3 text-xs">
            Gerechnet aus den Schlusskursen vom {datumText(frage.stand)}.{' '}
            <Link href="/methoden" className="underline underline-offset-2">
              Wie das gerechnet wird
            </Link>
          </p>
        </div>
      )}
    </div>
  )
}

/**
 * Der Handelstag als deutsches Datum.
 *
 * Ausgeschrieben und nicht „gestern": Die Seite entsteht beim Bauen, und der
 * jüngste Handelstag kann der Freitag sein, wenn heute Montag ist.
 */
function datumText(iso: string): string {
  const [jahr, monat, tag] = iso.split('-')
  return `${Number(tag)}.${Number(monat)}.${jahr}`
}
