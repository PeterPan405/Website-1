'use client'

import type { ReactNode } from 'react'

import { Icon } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'

/**
 * Wiederverwendbare Bausteine für die Rechner-Oberflächen.
 *
 * Alle Rechner nutzen dasselbe Muster: links die Eingaben, rechts das
 * Ergebnis. Das reduziert die Einarbeitung von einem Rechner zum nächsten auf
 * null.
 */

export function CalculatorGrid({ children }: { children: ReactNode }) {
  return <div className="grid gap-6 lg:grid-cols-[22rem_minmax(0,1fr)]">{children}</div>
}

export function InputPanel({
  children,
  onReset,
  title = 'Eingaben',
}: {
  children: ReactNode
  onReset?: () => void
  title?: string
}) {
  return (
    <section aria-labelledby="rechner-eingaben" className="fk-card h-fit p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 id="rechner-eingaben" className="text-fg text-lg font-semibold">
          {title}
        </h2>
        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className="fk-btn-ghost px-3 py-1.5 text-xs"
          >
            <Icon name="arrow-left" className="size-3.5" />
            Zurücksetzen
          </button>
        )}
      </div>

      {/*
        Kein <form> mit Submit: Die Berechnung läuft bei jeder Änderung sofort,
        es gibt also nichts abzuschicken.
      */}
      <div className="mt-5 space-y-5">{children}</div>
    </section>
  )
}

export function ResultPanel({
  children,
  title = 'Ergebnis',
}: {
  children: ReactNode
  title?: string
}) {
  return (
    <section aria-labelledby="rechner-ergebnis" className="min-w-0 space-y-6">
      <h2 id="rechner-ergebnis" className="sr-only">
        {title}
      </h2>
      {children}
    </section>
  )
}

/** Hervorgehobenes Hauptergebnis. */
export function HeadlineResult({
  label,
  value,
  hint,
  tone = 'brand',
}: {
  label: string
  value: string
  hint?: string
  tone?: 'brand' | 'positive' | 'negative' | 'warning'
}) {
  const toneClass = {
    brand: 'text-brand',
    positive: 'text-success',
    negative: 'text-danger',
    warning: 'text-warning',
  }[tone]

  return (
    <div className="fk-card p-6 sm:p-7">
      <p className="text-fg-muted text-sm font-medium">{label}</p>
      <p className={cn('mt-1.5 text-3xl font-bold tabular-nums sm:text-4xl', toneClass)}>
        {value}
      </p>
      {hint && <p className="text-fg-subtle mt-2 text-sm leading-relaxed">{hint}</p>}
    </div>
  )
}

export interface ComparisonBar {
  label: string
  value: number
  /** Formatierter Wert für die Anzeige. */
  display: string
  /** Tailwind-Klasse für die Balkenfarbe. */
  barClass: string
  hint?: string
}

/**
 * Horizontale Balken zum Größenvergleich.
 *
 * Als reines CSS umgesetzt statt mit der Chart-Bibliothek: Bei drei bis fünf
 * Werten ist eine Liste mit Balken lesbarer als ein Diagramm – und sie bleibt
 * für Screenreader ein normaler Text.
 */
export function ComparisonBars({ bars }: { bars: ComparisonBar[] }) {
  const max = Math.max(...bars.map((bar) => Math.abs(bar.value)), 1)

  return (
    <dl className="space-y-4">
      {bars.map((bar) => (
        <div key={bar.label}>
          <div className="flex items-baseline justify-between gap-3">
            <dt className="text-fg-muted text-sm">{bar.label}</dt>
            <dd className="text-fg text-sm font-semibold tabular-nums">{bar.display}</dd>
          </div>
          <div
            aria-hidden="true"
            className="bg-surface-muted mt-1.5 h-2.5 w-full overflow-hidden rounded-full"
          >
            <div
              className={cn(
                'h-full rounded-full transition-[width] duration-500',
                bar.barClass
              )}
              style={{ width: `${(Math.abs(bar.value) / max) * 100}%` }}
            />
          </div>
          {bar.hint && <p className="text-fg-subtle mt-1 text-xs">{bar.hint}</p>}
        </div>
      ))}
    </dl>
  )
}
