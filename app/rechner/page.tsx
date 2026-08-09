import type { Metadata } from 'next'
import Link from 'next/link'

import { JsonLd } from '@/components/seo/JsonLd'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Callout } from '@/components/ui/Callout'
import { Icon } from '@/components/ui/Icon'
import { PageHeader } from '@/components/ui/PageHeader'
import { Reveal } from '@/components/ui/Reveal'
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

      <div className="fk-container py-12 sm:py-16">
        <ul className="grid gap-5 md:grid-cols-2">
          {calculators.map((calculator, index) => (
            <li key={calculator.slug}>
              <Reveal delay={index * 0.05} className="h-full">
                <Link
                  href={`/rechner/${calculator.slug}`}
                  className="fk-card-interactive group flex h-full flex-col p-6"
                >
                  <span className="bg-tools-soft text-tools flex size-11 items-center justify-center rounded-xl">
                    <Icon name="calculator" className="size-5" />
                  </span>

                  <h2 className="text-fg mt-4 text-xl font-semibold">
                    {calculator.title}
                  </h2>
                  <p className="text-fg-muted mt-2 text-sm leading-relaxed">
                    {calculator.lead}
                  </p>

                  <ul className="mt-4 flex-1 space-y-1.5">
                    {calculator.featureList.slice(0, 3).map((feature) => (
                      <li
                        key={feature}
                        className="text-fg-subtle flex items-start gap-2 text-xs"
                      >
                        <Icon
                          name="check"
                          className="text-tools mt-0.5 size-3.5 shrink-0"
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <span className="text-tools mt-5 flex items-center gap-1 text-sm font-semibold">
                    Rechner öffnen
                    <Icon
                      name="arrow-right"
                      className="size-4 transition-transform group-hover:translate-x-0.5"
                    />
                  </span>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
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
