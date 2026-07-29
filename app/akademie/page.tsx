import type { Metadata } from 'next'
import Link from 'next/link'

import { JsonLd } from '@/components/seo/JsonLd'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Callout } from '@/components/ui/Callout'
import { Icon } from '@/components/ui/Icon'
import { PageHeader } from '@/components/ui/PageHeader'
import { Reveal } from '@/components/ui/Reveal'
import { getBereiche, getLektionen, lektionenGesamt } from '@/lib/akademie'
import { collectionPageSchema } from '@/lib/jsonld'
import { buildMetadata, withBrand } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: withBrand('Akademie: technische und fundamentale Analyse'),
  description:
    'Wie Charts gelesen und Kennzahlen eingeordnet werden – Trends, Indikatoren, Bilanz und Cashflow in einzelnen Lektionen, samt den Grenzen beider Verfahren.',
  path: '/akademie',
  ogTitle: 'Akademie: Charts lesen, Kennzahlen einordnen',
})

export default function AkademiePage() {
  const bereiche = getBereiche()

  return (
    <>
      <PageHeader
        area="akademie"
        eyebrow="Akademie"
        eyebrowIcon="scale"
        title="Charts lesen, Kennzahlen einordnen"
        lead="Der Lernbereich erklärt, was es gibt. Die Akademie erklärt, wie man beurteilt, was man vor sich hat – und wo die Verfahren an ihre Grenzen kommen."
        breadcrumbs={<Breadcrumbs items={[{ name: 'Akademie' }]} />}
        meta={
          <>
            <span>{bereiche.length} Bereiche</span>
            <span aria-hidden="true">·</span>
            <span>{lektionenGesamt()} Lektionen</span>
            <span aria-hidden="true">·</span>
            <span>Jede mit benannten Grenzen</span>
          </>
        }
      />

      <div className="fk-container py-12 sm:py-16">
        {/*
          Die Einordnung steht vor den Bereichen und nicht darunter.

          Wer eine Seite über technische Analyse aufschlägt, soll wissen, woran
          er ist, bevor er die erste Lektion anklickt – nicht danach.
        */}
        <div className="max-w-3xl">
          <Callout variant="info" title="Was hier erklärt wird und was nicht">
            <p>
              Beide Verfahren sind in der Praxis verbreitet und in ihrer Aussagekraft
              unterschiedlich gut belegt. Jede Lektion trägt deshalb eine Einstufung:{' '}
              <strong>Rechenweg</strong> für das, was schlicht Arithmetik ist,{' '}
              <strong>Beobachtung</strong> für Muster, deren Vorhersagekraft umstritten
              ist, und <strong>Auslegung</strong> für alles, bei dem zwei Fachleute zu
              verschiedenen Ergebnissen kommen können.
            </p>
            <p>
              Nichts davon ist eine Anlageempfehlung. Die Akademie erklärt Verfahren – sie
              sagt nicht, was zu kaufen ist.
            </p>
          </Callout>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {bereiche.map((bereich, stelle) => {
            const lektionen = getLektionen(bereich.id)
            return (
              <Reveal key={bereich.id} delay={stelle * 0.06} className="h-full">
                <section className="fk-card flex h-full flex-col p-6 sm:p-7">
                  <span className="bg-akademie-soft text-akademie flex size-11 items-center justify-center rounded-xl">
                    <Icon
                      name={bereich.id === 'technische-analyse' ? 'chart' : 'scale'}
                      className="size-5"
                    />
                  </span>

                  <h2 className="text-fg mt-4 text-2xl font-bold">{bereich.titel}</h2>
                  <p className="text-fg-muted mt-2 leading-relaxed">
                    {bereich.einleitung}
                  </p>

                  <ol className="mt-5 flex-1 space-y-1.5">
                    {lektionen.map((lektion, nummer) => (
                      <li key={lektion.slug}>
                        <Link
                          href={`/akademie/${bereich.id}/${lektion.slug}`}
                          className="text-fg-muted hover:text-akademie flex items-start gap-2.5 text-sm transition"
                        >
                          <span className="text-fg-subtle w-5 shrink-0 text-right tabular-nums">
                            {nummer + 1}
                          </span>
                          <span>{lektion.titel}</span>
                        </Link>
                      </li>
                    ))}
                  </ol>

                  <Link
                    href={`/akademie/${bereich.id}`}
                    className="text-akademie mt-6 flex items-center gap-1 text-sm font-semibold"
                  >
                    {bereich.titel} öffnen
                    <Icon name="arrow-right" className="size-4" />
                  </Link>
                </section>
              </Reveal>
            )
          })}
        </div>

        <div className="mt-10 max-w-3xl">
          <Callout variant="tip" title="Wo man anfängt">
            <p>
              Die Lektionen bauen innerhalb ihres Bereichs aufeinander auf. Wer die
              Begriffe aus der Finanzberichterstattung einordnen will – 200-Tage-Linie,
              überkauft, goldenes Kreuz –, beginnt bei der technischen Analyse. Wer wissen
              will, was hinter einem Kurs steht, bei der Fundamentalanalyse.
            </p>
            <p>
              Die beiden Zweige bauen <em>nicht</em> aufeinander auf. Man kann mit jedem
              von beiden anfangen und den anderen weglassen.
            </p>
          </Callout>
        </div>
      </div>

      <JsonLd
        data={collectionPageSchema({
          name: 'Akademie',
          description:
            'Technische und fundamentale Analyse in einzelnen Lektionen, jeweils mit benannten Grenzen.',
          path: '/akademie',
          items: bereiche.map((bereich) => ({
            name: bereich.titel,
            path: `/akademie/${bereich.id}`,
          })),
        })}
      />
    </>
  )
}
