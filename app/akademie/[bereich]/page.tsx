import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { JsonLd } from '@/components/seo/JsonLd'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Callout } from '@/components/ui/Callout'
import { Icon } from '@/components/ui/Icon'
import { PageHeader } from '@/components/ui/PageHeader'
import { Reveal } from '@/components/ui/Reveal'
import { belegarten, getBereich, getBereiche, getLektionen } from '@/lib/akademie'
import { collectionPageSchema } from '@/lib/jsonld'
import { buildMetadata, withBrand } from '@/lib/seo'

type Props = { params: Promise<{ bereich: string }> }

export function generateStaticParams() {
  return getBereiche().map((bereich) => ({ bereich: bereich.id }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { bereich } = await params
  const gefunden = getBereich(bereich)

  if (!gefunden) {
    return buildMetadata({
      title: withBrand('Bereich nicht gefunden'),
      description: 'Diesen Bereich der Akademie gibt es nicht.',
      path: `/akademie/${bereich}`,
      noIndex: true,
    })
  }

  return buildMetadata({
    title: withBrand(gefunden.titel),
    description: gefunden.kurz,
    path: `/akademie/${gefunden.id}`,
    ogTitle: gefunden.titel,
  })
}

export default async function BereichPage({ params }: Props) {
  const { bereich } = await params
  const gefunden = getBereich(bereich)

  if (!gefunden) notFound()

  const lektionen = getLektionen(gefunden.id)
  const minuten = lektionen.reduce((summe, lektion) => summe + lektion.dauer, 0)

  return (
    <>
      <PageHeader
        area="akademie"
        eyebrow="Akademie"
        eyebrowIcon={gefunden.id === 'technische-analyse' ? 'chart' : 'scale'}
        title={gefunden.titel}
        lead={gefunden.einleitung}
        breadcrumbs={
          <Breadcrumbs
            items={[{ name: 'Akademie', path: '/akademie' }, { name: gefunden.titel }]}
          />
        }
        meta={
          <>
            <span>{lektionen.length} Lektionen</span>
            <span aria-hidden="true">·</span>
            <span>zusammen etwa {minuten} Minuten</span>
          </>
        }
      />

      <div className="fk-container py-12 sm:py-16">
        <div className="max-w-3xl">
          {/*
            Die Grenzen stehen oben, nicht unten.

            Ein Kasten mit den Schwächen eines Verfahrens, den man erst nach
            dreizehn Lektionen erreicht, erfüllt seinen Zweck nicht.
          */}
          <Callout variant="warning" title={`Was ${gefunden.titel} nicht leistet`}>
            <ul>
              {gefunden.grenzen.map((grenze) => (
                <li key={grenze}>{grenze}</li>
              ))}
            </ul>
          </Callout>
        </div>

        <h2 className="text-fg mt-10 text-xl font-bold">Die Lektionen der Reihe nach</h2>
        <p className="text-fg-muted mt-2 max-w-3xl text-sm leading-relaxed">
          Die Reihenfolge ist aufbauend gemeint: Jede Lektion setzt voraus, was vorher
          erklärt wurde. Wer einen einzelnen Begriff nachschlagen will, kann trotzdem
          direkt einsteigen – die Voraussetzungen stehen auf jeder Seite oben.
        </p>

        <ol className="mt-6 space-y-3">
          {lektionen.map((lektion, nummer) => (
            <Reveal key={lektion.slug} delay={Math.min(nummer, 8) * 0.03}>
              <li>
                <Link
                  href={`/akademie/${gefunden.id}/${lektion.slug}`}
                  className="fk-card-interactive group flex gap-4 p-5"
                >
                  <span className="bg-akademie-soft text-akademie mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold tabular-nums">
                    {nummer + 1}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="text-fg text-lg font-semibold">
                        {lektion.titel}
                      </span>
                      <span className="border-border text-fg-subtle rounded-full border px-2 py-0.5 text-xs">
                        {belegarten[lektion.belegart].label}
                      </span>
                    </span>
                    <span className="text-fg-muted mt-1.5 block text-sm leading-relaxed">
                      {lektion.kurz}
                    </span>
                    <span className="text-fg-subtle mt-2 block text-xs">
                      {lektion.dauer} Min. Lesezeit
                    </span>
                  </span>

                  <Icon
                    name="chevron-right"
                    className="text-fg-subtle group-hover:text-akademie mt-1 size-5 shrink-0 transition"
                  />
                </Link>
              </li>
            </Reveal>
          ))}
        </ol>

        <div className="mt-10 max-w-3xl">
          <Callout variant="info" title="Die drei Einstufungen">
            <ul>
              {(['definition', 'beobachtung', 'deutung'] as const).map((art) => (
                <li key={art}>
                  <strong>{belegarten[art].label}:</strong> {belegarten[art].erklaerung}
                </li>
              ))}
            </ul>
          </Callout>
        </div>
      </div>

      <JsonLd
        data={collectionPageSchema({
          name: gefunden.titel,
          description: gefunden.kurz,
          path: `/akademie/${gefunden.id}`,
          items: lektionen.map((lektion) => ({
            name: lektion.titel,
            path: `/akademie/${gefunden.id}/${lektion.slug}`,
          })),
        })}
      />
    </>
  )
}
