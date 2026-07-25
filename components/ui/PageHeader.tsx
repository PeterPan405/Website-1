import type { ReactNode } from 'react'

import { Icon, type IconName } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'
import { areaStyles, type AreaId } from '@/lib/site'

/**
 * Einheitlicher Seitenkopf für alle Unterseiten.
 *
 * Enthält das einzige <h1> der Seite. Die dekorative Fläche dahinter nimmt die
 * Farbe des jeweiligen Bereichs auf, damit Besucher sofort erkennen, wo sie
 * sich befinden.
 */
export function PageHeader({
  area,
  eyebrow,
  eyebrowIcon,
  title,
  lead,
  meta,
  actions,
  breadcrumbs,
}: {
  area: AreaId
  /** Kurzer Bereichs- oder Kategorie-Hinweis über der Überschrift. */
  eyebrow: string
  eyebrowIcon?: IconName
  title: string
  lead?: string
  /** Zusatzinformationen wie Datum oder Lesedauer. */
  meta?: ReactNode
  actions?: ReactNode
  breadcrumbs?: ReactNode
}) {
  const style = areaStyles[area]

  return (
    <div className="border-border bg-surface relative overflow-hidden border-b">
      {/* Dekorativer Farbverlauf in der Bereichsfarbe. */}
      <div
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute inset-x-0 -top-32 h-64 bg-gradient-to-b blur-2xl',
          style.gradient
        )}
      />
      <div className="fk-container relative py-10 sm:py-14">
        {breadcrumbs && <div className="mb-6">{breadcrumbs}</div>}

        <p className={cn('fk-chip', style.soft)}>
          {eyebrowIcon && <Icon name={eyebrowIcon} className="size-3.5" />}
          {eyebrow}
        </p>

        <h1 className="text-fg mt-4 max-w-3xl text-3xl font-bold sm:text-4xl lg:text-5xl">
          {title}
        </h1>

        {lead && (
          <p className="text-fg-muted mt-4 max-w-2xl text-base leading-relaxed sm:text-lg">
            {lead}
          </p>
        )}

        {meta && (
          <div className="text-fg-subtle mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
            {meta}
          </div>
        )}

        {actions && <div className="mt-7 flex flex-wrap gap-3">{actions}</div>}
      </div>
    </div>
  )
}

/** Zwischenüberschrift (h2) mit optionaler Einleitung. */
export function SectionHeading({
  id,
  eyebrow,
  title,
  lead,
  className,
  action,
}: {
  id?: string
  eyebrow?: string
  title: string
  lead?: string
  className?: string
  action?: ReactNode
}) {
  return (
    <div className={cn('flex flex-wrap items-end justify-between gap-4', className)}>
      <div className="max-w-2xl">
        {eyebrow && (
          <p className="text-fg-subtle text-xs font-semibold tracking-wide uppercase">
            {eyebrow}
          </p>
        )}
        <h2 id={id} className="text-fg mt-1.5 text-2xl font-bold sm:text-3xl">
          {title}
        </h2>
        {lead && <p className="text-fg-muted mt-3 leading-relaxed">{lead}</p>}
      </div>
      {action}
    </div>
  )
}
