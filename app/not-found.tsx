import type { Metadata } from 'next'
import Link from 'next/link'

import { SucheOeffnenKnopf } from '@/components/layout/SucheOeffnenKnopf'
import { Icon, type IconName } from '@/components/ui/Icon'
import { areas, areaStyles, type AreaId } from '@/lib/site'
import { buildMetadata, withBrand } from '@/lib/seo'
import { cn } from '@/lib/cn'

export const metadata: Metadata = buildMetadata({
  title: withBrand('Seite nicht gefunden'),
  description:
    'Diese Adresse führt zu keiner Seite. Hier geht es weiter zum Lernbereich, zu den Rechnern, den Marktdaten und den News.',
  path: '/404',
  // Eine Fehlerseite gehört nicht in den Index.
  noIndex: true,
})

const suggestions: { area: AreaId; icon: IconName }[] = [
  { area: 'learn', icon: 'book' },
  { area: 'tools', icon: 'calculator' },
  { area: 'markets', icon: 'chart' },
  { area: 'news', icon: 'newspaper' },
]

export default function NotFound() {
  return (
    <div className="fk-container py-20 sm:py-28">
      <div className="max-w-2xl">
        <p className="fk-chip bg-brand-soft text-brand">Fehler 404</p>
        <h1 className="text-fg mt-5 text-4xl font-bold sm:text-5xl">
          Diese Seite gibt es nicht
        </h1>
        <p className="text-fg-muted mt-5 text-lg leading-relaxed">
          Möglicherweise hat sich die Adresse geändert oder es hat sich ein Tippfehler
          eingeschlichen. Über die Bereiche unten findest du zurück in die Inhalte.
        </p>
        {/*
          Die Suche zuerst: Wer hier landet, hat meist etwas Bestimmtes
          gesucht – eine veraltete Adresse aus einem Lesezeichen, ein Tippfehler.
          Die Startseite ist der Rückzug, die Suche der kürzere Weg zum Ziel.
        */}
        <div className="mt-8 flex flex-wrap gap-3">
          <SucheOeffnenKnopf />
          <Link href="/" className="fk-btn-primary">
            <Icon name="arrow-left" className="size-4" />
            Zur Startseite
          </Link>
        </div>
      </div>

      <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {suggestions.map(({ area, icon }) => {
          const config = areas[area]
          const style = areaStyles[area]
          return (
            <li key={area}>
              <Link
                href={config.href}
                className="fk-card-interactive group flex h-full flex-col p-5"
              >
                <span
                  className={cn(
                    'flex size-10 items-center justify-center rounded-xl',
                    style.soft
                  )}
                >
                  <Icon name={icon} className="size-5" />
                </span>
                <span className="text-fg mt-4 font-semibold">{config.label}</span>
                <span className="text-fg-muted mt-1.5 flex-1 text-sm leading-relaxed">
                  {config.description}
                </span>
                <span
                  className={cn(
                    'mt-4 flex items-center gap-1 text-sm font-semibold',
                    style.text
                  )}
                >
                  Öffnen
                  <Icon
                    name="arrow-right"
                    className="size-4 transition-transform group-hover:translate-x-0.5"
                  />
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
