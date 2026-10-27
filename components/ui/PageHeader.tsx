import type { ReactNode } from 'react'

import { type IconName } from '@/components/ui/Icon'
import { cn } from '@/lib/cn'
import { type AreaId } from '@/lib/site'

/**
 * Einheitlicher Seitenkopf für alle Unterseiten.
 *
 * Enthält das einzige <h1> der Seite. Die dekorative Fläche dahinter nimmt die
 * Farbe des jeweiligen Bereichs auf, damit Besucher sofort erkennen, wo sie
 * sich befinden.
 */
export function PageHeader({
  title,
  lead,
  meta,
  actions,
  breadcrumbs,
}: {
  area: AreaId
  /**
   * Kurzer Bereichs- oder Kategorie-Hinweis über der Überschrift.
   *
   * Optional: Auf Seiten, die zu keinem inhaltlichen Bereich gehören – etwa
   * Impressum, Datenschutz, Kontakt und Über uns – trüge er nur eine Einordnung
   * nach, die die Überschrift ohnehin liefert. Er nähme dort zudem die Farbe
   * eines fremden Bereichs an, weil `area` ein Pflichtfeld ist.
   */
  eyebrow?: string
  eyebrowIcon?: IconName
  title: string
  lead?: string
  /** Zusatzinformationen wie Datum oder Lesedauer. */
  meta?: ReactNode
  actions?: ReactNode
  breadcrumbs?: ReactNode
}) {
  return (
    /*
      Kein Kasten um den Seitenkopf – die Trennung zum Inhalt macht der
      Weißraum. Seitentitel 28 px/700, Lauftext 17 px (GESTALTUNG.md § 2).
    */
    <div>
      <div className="fk-container pt-12 pb-8">
        {breadcrumbs && <div className="mb-6">{breadcrumbs}</div>}

        {/*
          Keine Dachzeile mehr über der Überschrift (27.10.2026, „die ganze
          Seite ein wenig minimalistischer"). Wo sie stand, stehen schon die
          Brotkrumen – sie sagte dasselbe ein zweites Mal. `eyebrow` und
          `eyebrowIcon` bleiben in der Schnittstelle, damit die Seiten, die sie
          setzen, nicht alle angefasst werden müssen.
        */}
        <h1 className="text-fg max-w-3xl text-3xl font-bold">{title}</h1>

        {lead && <p className="text-fg-muted mt-3 max-w-2xl text-lg">{lead}</p>}

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
        {/* Ohne Dachzeile (27.10.2026) – siehe PageHeader. */}
        <h2 id={id} className="text-fg text-xl font-bold">
          {title}
        </h2>
        {lead && <p className="text-fg-muted mt-2">{lead}</p>}
      </div>
      {action}
    </div>
  )
}
