import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { PfadFortschritt, SchrittMarke } from '@/components/learn/PfadFortschritt'
import { JsonLd } from '@/components/seo/JsonLd'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Callout } from '@/components/ui/Callout'
import { Icon } from '@/components/ui/Icon'
import { PageHeader } from '@/components/ui/PageHeader'
import { Reveal } from '@/components/ui/Reveal'
import { collectionPageSchema } from '@/lib/jsonld'
import { getLernpfad, getLernpfadSlugs } from '@/lib/lernpfade'
import { buildMetadata } from '@/lib/seo'

export async function generateStaticParams() {
  const slugs = await getLernpfadSlugs()
  return slugs.map((pfad) => ({ pfad }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pfad: string }>
}): Promise<Metadata> {
  const { pfad: slug } = await params
  const pfad = await getLernpfad(slug)
  if (!pfad) return {}

  return buildMetadata({
    title: pfad.metaTitle,
    description: pfad.metaDescription,
    path: `/lernen/pfade/${pfad.slug}`,
  })
}

export default async function LernpfadSeite({
  params,
}: {
  params: Promise<{ pfad: string }>
}) {
  const { pfad: slug } = await params
  const pfad = await getLernpfad(slug)
  if (!pfad) notFound()

  const unfertig = pfad.aufgeloest.filter(
    (schritt) => schritt.art === 'stufe' && !schritt.fertig
  ).length

  return (
    <>
      <PageHeader
        area="learn"
        eyebrow="Lernpfad"
        eyebrowIcon="compass"
        title={pfad.headline}
        lead={pfad.lead}
        breadcrumbs={
          <Breadcrumbs
            items={[
              { name: 'Lernen', path: '/lernen' },
              { name: 'Pfade', path: '/lernen/pfade' },
              { name: pfad.titel },
            ]}
          />
        }
        meta={
          <>
            <span>{pfad.schritte.length} Schritte</span>
            <span aria-hidden="true">·</span>
            <span>rund {Math.round(pfad.lesezeit / 5) * 5} Minuten Lesezeit</span>
            {pfad.rechnerzahl > 0 && (
              <>
                <span aria-hidden="true">·</span>
                <span>
                  {pfad.rechnerzahl} {pfad.rechnerzahl === 1 ? 'Rechner' : 'Rechner'}
                </span>
              </>
            )}
          </>
        }
      />

      <div className="fk-container py-12 sm:py-16">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <div className="min-w-0">
            {/* ------------------------------------------------ Einordnung */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="fk-card p-5">
                <h2 className="text-fg-subtle text-xs font-semibold tracking-wide uppercase">
                  Für wen
                </h2>
                <p className="text-fg-muted mt-2 text-sm leading-relaxed">
                  {pfad.fuerWen}
                </p>
              </div>
              <div className="fk-card p-5">
                <h2 className="text-fg-subtle text-xs font-semibold tracking-wide uppercase">
                  Danach kannst du
                </h2>
                <p className="text-fg-muted mt-2 text-sm leading-relaxed">
                  {pfad.ergebnis}
                </p>
              </div>
            </div>

            {/* ---------------------------------------------- Die Schritte */}
            <h2 id="schritte" className="text-fg mt-10 text-2xl font-bold sm:text-3xl">
              Die Schritte
            </h2>

            <ol aria-labelledby="schritte" className="mt-6 space-y-4">
              {pfad.aufgeloest.map((schritt, index) => (
                <li key={schritt.kennung}>
                  <Reveal delay={Math.min(index, 6) * 0.04}>
                    <article className="fk-card relative flex gap-4 p-5 sm:p-6">
                      <SchrittMarke
                        kennung={schritt.art === 'stufe' ? schritt.kennung : undefined}
                        nummer={index + 1}
                      />

                      <div className="min-w-0">
                        <p className="text-fg-subtle flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-medium">
                          {schritt.art === 'stufe' ? (
                            <>
                              <span>{schritt.themaTitel}</span>
                              <span aria-hidden="true">·</span>
                              <span className="bg-learn-soft text-learn rounded-full px-2 py-0.5">
                                {schritt.stufeLabel}
                              </span>
                              <span aria-hidden="true">·</span>
                              <span>{schritt.lesezeit} Min.</span>
                              {!schritt.fertig && (
                                <>
                                  <span aria-hidden="true">·</span>
                                  <span className="text-warning">
                                    bisher als Gliederung
                                  </span>
                                </>
                              )}
                            </>
                          ) : (
                            <span className="bg-tools-soft text-tools rounded-full px-2 py-0.5">
                              Rechner
                            </span>
                          )}
                        </p>

                        <h3 className="text-fg mt-1.5 font-semibold">
                          <Link
                            href={schritt.href}
                            className="hover:text-learn after:absolute after:inset-0"
                          >
                            {schritt.titel}
                          </Link>
                        </h3>

                        {/*
                          Die Begründung steht über der Beschreibung des Ziels –
                          sie ist der Grund, warum dieser Schritt hier steht, und
                          das Einzige, was der Pfad zum vorhandenen Inhalt
                          beiträgt.
                        */}
                        <p className="text-fg mt-2 text-sm leading-relaxed">
                          {schritt.warum}
                        </p>
                        <p className="text-fg-subtle mt-1.5 text-sm leading-relaxed">
                          {schritt.lead}
                        </p>
                      </div>
                    </article>
                  </Reveal>
                </li>
              ))}
            </ol>

            {unfertig > 0 && (
              <Callout
                variant="draft"
                title="Ein Teil dieses Pfades ist noch Gliederung"
                className="mt-8"
              >
                <p>
                  {unfertig} der {pfad.stufenzahl} Stufen liegen bisher als Gliederung vor
                  – sie haben eine Seite mit Aufbau und Meta-Daten, aber noch keinen
                  Fließtext. Die betroffenen Schritte sind oben gekennzeichnet. Der Weg
                  stimmt trotzdem; er wird an diesen Stellen nur noch ausführlicher.
                </p>
              </Callout>
            )}
          </div>

          {/* ------------------------------------------------- Seitenspalte */}
          <aside className="lg:sticky lg:top-24 lg:h-fit">
            <div className="fk-card p-5">
              <h2 className="text-fg text-sm font-semibold">Dein Stand</h2>
              <PfadFortschritt kennungen={pfad.stufenkennungen} className="mt-3" />
              <p className="text-fg-subtle mt-3 text-xs leading-relaxed">
                Gezählt wird derselbe Fortschritt wie im Lernbereich: Was du dort abhakst,
                gilt hier als gelesen. Rechner zählen nicht mit – ob jemand gerechnet hat,
                weiß niemand.
              </p>
            </div>

            <div className="fk-card mt-4 p-5">
              <h2 className="text-fg text-sm font-semibold">Andere Wege</h2>
              <p className="text-fg-subtle mt-2 text-xs leading-relaxed">
                Wenn dieser Pfad nicht zu deiner Frage passt, passt vielleicht ein anderer
                – oder die vollständige Übersicht.
              </p>
              <div className="mt-4 flex flex-col gap-2">
                <Link href="/lernen/pfade" className="fk-btn-secondary text-sm">
                  Alle Pfade
                  <Icon name="arrow-right" className="size-4" />
                </Link>
                <Link href="/lernen" className="fk-btn-ghost text-sm">
                  Themenübersicht
                  <Icon name="arrow-right" className="size-4" />
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <JsonLd
        data={collectionPageSchema({
          name: pfad.titel,
          description: pfad.metaDescription,
          path: `/lernen/pfade/${pfad.slug}`,
          items: pfad.aufgeloest.map((schritt) => ({
            name: schritt.titel,
            path: schritt.href,
          })),
        })}
      />
    </>
  )
}
