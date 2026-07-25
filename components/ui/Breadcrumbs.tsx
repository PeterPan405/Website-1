import Link from 'next/link'

import { JsonLd } from '@/components/seo/JsonLd'
import { Icon } from '@/components/ui/Icon'
import { breadcrumbSchema, type BreadcrumbItem } from '@/lib/jsonld'

/**
 * Brotkrumen-Navigation inklusive passender BreadcrumbList-Auszeichnung.
 *
 * Sichtbare Navigation und strukturierte Daten kommen absichtlich aus einer
 * Komponente: So können sie nicht auseinanderlaufen.
 *
 * @param items Pfad ohne die Startseite – die wird automatisch vorangestellt.
 *              Beim letzten Eintrag `path` weglassen, er ist die aktuelle Seite.
 */
export function Breadcrumbs({ items }: { items: readonly BreadcrumbItem[] }) {
  const trail: BreadcrumbItem[] = [{ name: 'Startseite', path: '/' }, ...items]

  return (
    <>
      <nav aria-label="Brotkrumen-Navigation">
        <ol className="text-fg-muted flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm">
          {trail.map((item, index) => {
            const isLast = index === trail.length - 1
            return (
              <li key={`${item.name}-${index}`} className="flex items-center gap-1.5">
                {index > 0 && (
                  <Icon name="chevron-right" className="text-fg-subtle size-3.5" />
                )}
                {isLast || !item.path ? (
                  <span aria-current="page" className="text-fg font-medium">
                    {item.name}
                  </span>
                ) : (
                  <Link href={item.path} className="hover:text-brand transition">
                    {item.name}
                  </Link>
                )}
              </li>
            )
          })}
        </ol>
      </nav>
      <JsonLd data={breadcrumbSchema(trail)} />
    </>
  )
}
