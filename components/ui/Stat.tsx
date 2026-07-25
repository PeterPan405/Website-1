import type { ReactNode } from 'react'

import { cn } from '@/lib/cn'

/**
 * Einzelne Kennzahl mit Label.
 *
 * Wird für Kursdetails, Rechnerergebnisse und den Ländervergleich genutzt.
 * `tabular-nums` sorgt dafür, dass Ziffern in Listen exakt untereinander
 * stehen und beim Aktualisieren nicht springen.
 */
export function Stat({
  label,
  value,
  hint,
  tone = 'neutral',
  className,
}: {
  label: string
  value: ReactNode
  hint?: string
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
    <div
      className={cn('border-border bg-surface-muted rounded-xl border p-4', className)}
    >
      <dt className="text-fg-subtle text-xs font-medium tracking-wide uppercase">
        {label}
      </dt>
      <dd className={cn('mt-1.5 text-xl font-bold tabular-nums sm:text-2xl', toneClass)}>
        {value}
      </dd>
      {hint && <p className="text-fg-subtle mt-1 text-xs leading-relaxed">{hint}</p>}
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

  return <dl className={cn('grid gap-3', columnClass, className)}>{children}</dl>
}
