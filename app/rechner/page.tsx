import type { Metadata } from 'next'
import Link from 'next/link'

import { JsonLd } from '@/components/seo/JsonLd'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Icon } from '@/components/ui/Icon'
import { PageHeader } from '@/components/ui/PageHeader'
import { calculators } from '@/data/calculators'
import { collectionPageSchema } from '@/lib/jsonld'
import { buildMetadata, withBrand } from '@/lib/seo'
import { RECHNER_ANZAHL } from '@/lib/site'

export const metadata: Metadata = buildMetadata({
  title: withBrand('Finanzrechner: Zinsen, Inflation, Rente'),
  description:
    // Höchstens 160 Zeichen – darüber schneidet Google ab, und `npm run
    // pruefen` beanstandet es. Deshalb hier nicht alle acht Rechner aufzählen.
    `${RECHNER_ANZAHL} Rechner für Zinsen, Kosten, Steuern, Vermögen, Inflation und Rente – jeweils mit offengelegter Formel und benannten Annahmen.`,
  path: '/rechner',
  ogTitle: `${RECHNER_ANZAHL} Finanzrechner mit offener Methodik`,
})

export default function CalculatorsOverviewPage() {
  return (
    <>
      <PageHeader
        area="tools"
        eyebrow="Rechner"
        eyebrowIcon="calculator"
        title="Selbst nachrechnen statt glauben"
        lead="Jeder Rechner zeigt nicht nur ein Ergebnis, sondern auch die Formel dahinter und die Annahmen, auf denen er beruht. Nur so lässt sich eine Zahl einordnen."
        breadcrumbs={<Breadcrumbs items={[{ name: 'Rechner' }]} />}
        meta={
          <>
            <span>{calculators.length} Rechner</span>
            <span aria-hidden="true">·</span>
            <span>Berechnung vollständig im Browser</span>
            <span aria-hidden="true">·</span>
            <span>Keine Datenübertragung</span>
          </>
        }
      />

      {/*
        Register statt Kachelraster.

        Bis zum 28. August 2026 stand hier ein Raster aus sechzehn Karten, jede
        mit Sinnbild, vier Zeilen Beschreibung, drei Häkchenpunkten und einem
        „Rechner öffnen". Auf dem Telefon füllte **eine** davon den ganzen
        Schirm: Wer wissen wollte, welche sechzehn es gibt, scrollte sechzehn
        Bildschirme weit und hatte am Ende trotzdem keine Übersicht.

        Dieselbe Stelle gab es auf der Startseite schon einmal, und dort steht
        die Begründung seit Juli: „Sieben Karten mit Sinnbild oben links waren
        die vielleicht deutlichste Baukasten-Stelle der Startseite … Eine
        Haarlinien-Liste mit laufender Nummer liest sich wie ein
        Inhaltsverzeichnis: ruhig, eindeutig, ohne Restzeile." Was für sieben
        galt, gilt für sechzehn doppelt.

        Verloren geht dabei nichts, was diese Seite leisten muss: Die
        Häkchenliste stand ohnehin vollständig auf der Rechnerseite selbst, und
        die Beschreibung steht weiter da – nur einzeilig, weil eine Übersicht
        einordnen und nicht erklären soll.
      */}
      <div className="fk-container py-12 sm:py-16">
        <div className="border-border border-t">
          <ul>
            {calculators.map((calculator, index) => (
              <li key={calculator.slug}>
                <Link
                  href={`/rechner/${calculator.slug}`}
                  className="group border-border hover:bg-surface-muted flex items-center gap-5 border-b px-1 py-5 transition sm:gap-8 sm:px-3"
                >
                  <span className="text-fg-subtle w-7 shrink-0 font-mono text-sm tabular-nums">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="text-fg font-display shrink-0 text-lg font-semibold sm:w-72 sm:text-xl">
                    {calculator.title}
                  </span>
                  <span className="text-fg-muted hidden min-w-0 flex-1 truncate text-sm leading-relaxed md:block">
                    {calculator.lead}
                  </span>
                  <Icon
                    name="arrow-right"
                    className="text-fg-subtle ml-auto size-4 shrink-0 transition-transform group-hover:translate-x-1"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <JsonLd
        data={collectionPageSchema({
          name: 'Finanzrechner',
          description: `${RECHNER_ANZAHL} Rechner für Zinseszins, Kosten, Steuern, Vermögen, Inflation, Rente, Rentenlücke und Haushaltsbudget.`,
          path: '/rechner',
          items: calculators.map((calculator) => ({
            name: calculator.title,
            path: `/rechner/${calculator.slug}`,
          })),
        })}
      />
    </>
  )
}
