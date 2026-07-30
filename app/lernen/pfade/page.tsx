import type { Metadata } from 'next'
import Link from 'next/link'

import { PfadFortschritt } from '@/components/learn/PfadFortschritt'
import { JsonLd } from '@/components/seo/JsonLd'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Icon } from '@/components/ui/Icon'
import { PageHeader } from '@/components/ui/PageHeader'
import { Reveal } from '@/components/ui/Reveal'
import { collectionPageSchema } from '@/lib/jsonld'
import { getLernpfade } from '@/lib/lernpfade'
import { buildMetadata, withBrand } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: withBrand('Lernpfade: Wege durch den Lernbereich'),
  description:
    'Fünf geführte Wege für konkrete Anlässe – vom ersten Sparplan über eine geerbte Summe bis zur Vorsorgelücke. Jeder Schritt mit Begründung, warum er dort steht.',
  path: '/lernen/pfade',
  ogTitle: 'Fünf geführte Wege durch den Lernbereich',
})

export default async function LernpfadeSeite() {
  const pfade = await getLernpfade()

  return (
    <>
      <PageHeader
        area="learn"
        eyebrow="Lernpfade"
        eyebrowIcon="compass"
        title="Nicht alles lesen, sondern das Richtige"
        lead="Die Themenübersicht ist nach Sachlogik geordnet – die richtige Reihenfolge, wenn man alles lesen will. Wer eine konkrete Frage hat, braucht etwas anderes: eine Auswahl, und bei jedem Schritt die Begründung, warum ausgerechnet er jetzt dran ist."
        breadcrumbs={
          <Breadcrumbs items={[{ name: 'Lernen', path: '/lernen' }, { name: 'Pfade' }]} />
        }
        meta={
          <>
            <span>{pfade.length} Pfade</span>
            <span aria-hidden="true">·</span>
            <span>
              {pfade.reduce((summe, pfad) => summe + pfad.schritte.length, 0)} Schritte
            </span>
            <span aria-hidden="true">·</span>
            <span>alle aus vorhandenen Inhalten</span>
          </>
        }
      />

      <div className="fk-container py-12 sm:py-16">
        <ul className="grid gap-6 lg:grid-cols-2">
          {pfade.map((pfad, index) => (
            <li key={pfad.slug}>
              <Reveal delay={index * 0.05}>
                {/*
                  `relative` gehört zum gestreckten Link im Titel: Sein
                  after-Element füllt den nächstpositionierten Vorfahren. Ohne
                  `relative` war das – sobald die Einblendanimation ihre
                  Transformation abgelegt hatte – nicht mehr die Karte, sondern
                  die Seite: Fünf Klickflächen übereinander, nur die oberste
                  gewann, die übrigen Pfade waren von hier nicht mehr zu
                  öffnen.
                */}
                <article className="fk-card relative flex h-full flex-col p-6 sm:p-7">
                  <h2 className="text-fg text-xl font-bold">
                    <Link
                      href={`/lernen/pfade/${pfad.slug}`}
                      className="hover:text-learn after:absolute after:inset-0"
                    >
                      {pfad.titel}
                    </Link>
                  </h2>
                  <p className="text-fg-muted mt-2 leading-relaxed">{pfad.kurz}</p>

                  <p className="text-fg-subtle mt-4 text-sm leading-relaxed">
                    {pfad.fuerWen}
                  </p>

                  <dl className="text-fg-subtle mt-5 flex flex-wrap gap-x-4 gap-y-1 text-xs">
                    <div className="flex gap-1.5">
                      <dt>Stufen:</dt>
                      <dd className="text-fg font-semibold">{pfad.stufenzahl}</dd>
                    </div>
                    {pfad.rechnerzahl > 0 && (
                      <div className="flex gap-1.5">
                        <dt>Rechner:</dt>
                        <dd className="text-fg font-semibold">{pfad.rechnerzahl}</dd>
                      </div>
                    )}
                    <div className="flex gap-1.5">
                      <dt>Lesezeit:</dt>
                      <dd className="text-fg font-semibold">
                        rund {Math.round(pfad.lesezeit / 5) * 5} Minuten
                      </dd>
                    </div>
                  </dl>

                  <PfadFortschritt kennungen={pfad.stufenkennungen} className="mt-5" />

                  <p className="text-learn mt-5 flex items-center gap-1.5 text-sm font-semibold">
                    Pfad ansehen
                    <Icon name="arrow-right" className="size-4" />
                  </p>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>

        <section
          aria-labelledby="wozu"
          className="rounded-card border-border bg-surface-muted mt-12 border p-6 sm:p-8"
        >
          <h2 id="wozu" className="text-fg text-lg font-semibold">
            Was ein Pfad ist – und was nicht
          </h2>
          <p className="text-fg-muted mt-2 max-w-3xl text-sm leading-relaxed">
            Ein Pfad enthält keinen eigenen Inhalt. Er zeigt auf Stufen und Rechner, die
            es ohnehin gibt, und ordnet sie für einen bestimmten Anlass. Der Unterschied
            zu einer Linkliste ist die Begründung an jedem Schritt: Sie sagt, warum gerade
            dieser jetzt dran ist – und macht damit auch nachvollziehbar, wenn du einen
            überspringen willst.
          </p>
          <p className="text-fg-muted mt-3 max-w-3xl text-sm leading-relaxed">
            Der Fortschritt ist derselbe wie im Lernbereich. Was du dort abhakst, gilt
            hier als gelesen, und umgekehrt. Er liegt im Browser dieses Geräts, nicht auf
            einem Server.
          </p>
          <Link href="/lernen" className="fk-btn-secondary mt-5">
            Zur vollständigen Themenübersicht
            <Icon name="arrow-right" className="size-4" />
          </Link>
        </section>
      </div>

      <JsonLd
        data={collectionPageSchema({
          name: 'Lernpfade',
          description:
            'Geführte Wege durch den Lernbereich für konkrete Anlässe – vom ersten Sparplan bis zur Vorsorgelücke.',
          path: '/lernen/pfade',
          items: pfade.map((pfad) => ({
            name: pfad.titel,
            path: `/lernen/pfade/${pfad.slug}`,
          })),
        })}
      />
    </>
  )
}
