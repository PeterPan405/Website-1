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
  const style = areaStyles[area]

  return (
    /*
      Kein weißer Kasten mehr um den Seitenkopf: Er steht direkt auf dem
      grauen Seitengrund, die Trennung zum Inhalt macht der Weißraum. Der
      weichgezeichnete Farbverlauf davor und die weiße Fläche danach waren
      beide Versuche, eine Zone zu markieren, die keine Markierung braucht.
    */
    <div>
      <div className="fk-container pt-12 pb-10 sm:pt-16 sm:pb-12">
        {breadcrumbs && <div className="mb-6">{breadcrumbs}</div>}

        {/*
          Stille Dachzeile statt farbiger Kapsel – dasselbe Register wie im
          Hero der Startseite: gesperrte Kleinzeile in der Bereichsfarbe.
        */}
        {eyebrow && (
          <p
            className={cn(
              'flex items-center gap-1.5 text-xs font-semibold tracking-[0.16em] uppercase',
              style.text
            )}
          >
            {eyebrowIcon && <Icon name={eyebrowIcon} className="size-3.5" />}
            {eyebrow}
          </p>
        )}

        {/*
          Ohne Eyebrow entfällt auch dessen Abstand nach oben – sonst klaffte
          über der Überschrift eine Lücke, wo nichts steht.
        */}
        <h1
          className={cn(
            'text-fg max-w-3xl text-4xl font-bold tracking-[-0.025em] sm:text-5xl',
            eyebrow && 'mt-4'
          )}
        >
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
