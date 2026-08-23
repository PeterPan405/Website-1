import type { Metadata } from 'next'
import Link from 'next/link'

import { WochenFortschritt } from '@/components/akademie/WochenFortschritt'
import { JsonLd } from '@/components/seo/JsonLd'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Callout } from '@/components/ui/Callout'
import { Icon } from '@/components/ui/Icon'
import { PageHeader } from '@/components/ui/PageHeader'
import { Reveal } from '@/components/ui/Reveal'
import { belegarten, getBereich, lektionenGesamt } from '@/lib/akademie'
import { getAkademiewochen } from '@/lib/akademie-wochen'
import { collectionPageSchema } from '@/lib/jsonld'
import { buildMetadata, withBrand } from '@/lib/seo'

/**
 * Die Akademie in drei Wochen – der Rhythmus über dem Bestand.
 *
 * Dasselbe Muster wie `/lernen/30-tage`: kein neuer Inhalt, sondern eine
 * Reihenfolge über vorhandenen Lektionen. Nur ist sie hier gerechnet und nicht
 * aufgeschrieben – warum, steht in `lib/akademie-wochen.ts`.
 */

export const metadata: Metadata = buildMetadata({
  title: withBrand('Die Akademie in drei Wochen'),
  description:
    'Alle Lektionen der Akademie in drei Wochen, ohne übersprungene Voraussetzung: erst die Grundbegriffe, dann die Kennzahlen, dann die Verfahren.',
  path: '/akademie/drei-wochen',
  ogTitle: 'Die Akademie in drei Wochen',
})

export default function DreiWochenSeite() {
  const wochen = getAkademiewochen()
  const minuten = wochen.map((woche) =>
    woche.lektionen.reduce((summe, lektion) => summe + lektion.dauer, 0)
  )

  return (
    <>
      <PageHeader
        area="akademie"
        eyebrow="Akademie"
        eyebrowIcon="calendar"
        title="Die Akademie in drei Wochen"
        lead="Die Lektionen bauen aufeinander auf, aber quer durch die fünf Bereiche. Diese Seite legt sie in eine Reihenfolge, in der nichts vorkommt, dessen Grundlage noch fehlt – und teilt sie in drei Wochen, passend zu den drei Stufen des Lernbereichs."
        breadcrumbs={
          <Breadcrumbs
            items={[{ name: 'Akademie', path: '/akademie' }, { name: 'Drei Wochen' }]}
          />
        }
        meta={
          <>
            <span>3 Wochen</span>
            <span aria-hidden="true">·</span>
            <span>{lektionenGesamt()} Lektionen</span>
            <span aria-hidden="true">·</span>
            <span>
              rund {Math.round(minuten.reduce((a, b) => a + b, 0) / 21)} Minuten am Tag
            </span>
          </>
        }
      />

      <div className="fk-container py-12 sm:py-16">
        <div className="max-w-3xl">
          <Callout variant="tip" title="Kein neuer Stoff">
            <p>
              Hier steht keine einzige Zeile, die es nicht schon in den fünf Bereichen
              gäbe – nur eine andere Reihenfolge. Wer lieber ein Verfahren am Stück liest,
              ist auf der{' '}
              <Link
                href="/akademie"
                className="text-akademie font-medium underline underline-offset-2"
              >
                Bereichsübersicht
              </Link>{' '}
              besser aufgehoben; die Bereiche bauen nicht aufeinander auf.
            </p>
            <p>
              Die drei Wochen laufen parallel zu den drei Stufen im{' '}
              <Link
                href="/lernen"
                className="text-akademie font-medium underline underline-offset-2"
              >
                Lernbereich
              </Link>
              . Der erklärt, was es gibt; die Akademie, wie man es beurteilt. Beides
              zusammen ergibt drei Wochen, in denen jeden Tag ungefähr eine halbe Stunde
              zu lesen ist.
            </p>
          </Callout>
        </div>

        {wochen.map((woche, stelle) => (
          <section
            key={woche.nummer}
            aria-labelledby={`woche-${woche.nummer}`}
            className="mt-12"
          >
            <div className="max-w-3xl">
              <p className="text-akademie text-sm font-semibold">
                Woche {woche.nummer} · parallel zu {woche.parallelZu} ·{' '}
                {woche.lektionen.length} Lektionen · rund {minuten[stelle]} Minuten
              </p>
              <h2
                id={`woche-${woche.nummer}`}
                className="text-fg mt-1 text-2xl font-bold sm:text-3xl"
              >
                {woche.titel}
              </h2>
              <p className="text-fg-muted mt-2 leading-relaxed">{woche.warum}</p>
              <WochenFortschritt
                lektionen={woche.lektionen.map((lektion) => ({
                  bereich: lektion.bereich,
                  slug: lektion.slug,
                }))}
              />
            </div>

            <ol className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {woche.lektionen.map((lektion, nummer) => {
                const bereich = getBereich(lektion.bereich)
                return (
                  <li key={lektion.slug} className="h-full">
                    <Reveal delay={Math.min(nummer, 8) * 0.03} className="h-full">
                      <Link
                        href={`/akademie/${lektion.bereich}/${lektion.slug}`}
                        className="fk-card-interactive group flex h-full flex-col p-5"
                      >
                        <p className="text-fg-subtle flex items-center gap-2 text-xs font-medium">
                          {bereich && (
                            <Icon name={bereich.sinnbild} className="size-3.5" />
                          )}
                          <span>{bereich?.titel ?? lektion.bereich}</span>
                        </p>
                        <h3 className="text-fg group-hover:text-akademie mt-2 font-semibold transition">
                          {lektion.titel}
                        </h3>
                        <p className="text-fg-muted mt-1.5 flex-1 text-sm leading-relaxed">
                          {lektion.kurz}
                        </p>
                        <p className="text-fg-subtle mt-4 text-xs">
                          {belegarten[lektion.belegart].label} · {lektion.dauer} Min.
                        </p>
                      </Link>
                    </Reveal>
                  </li>
                )
              })}
            </ol>
          </section>
        ))}

        {/*
          Der Hinweis steht am Ende, nicht oben.

          Oben hätte er jeden begrüßt, der die Seite aufschlägt – und die
          Reihenfolge ist für die meisten schlicht richtig. Wer bis hierher
          gescrollt hat, sucht dagegen den Haken.
        */}
        <div className="mt-12 max-w-3xl">
          <Callout variant="info" title="Woher die Reihenfolge kommt">
            <p>
              Jede Lektion nennt, was vorher verstanden sein muss. Aus diesen Angaben wird
              die Reihenfolge gerechnet, nicht von Hand gepflegt: Eine Lektion steht
              hinter allen, die sie voraussetzt, und der Schnitt in Wochen ergibt drei
              möglichst gleich große Teile.
            </p>
            <p>
              Das heißt auch: Kommt eine Lektion dazu, rückt sie von selbst an die
              richtige Stelle. Eine Woche kann dadurch eine Lektion länger werden – die
              Reihenfolge bleibt richtig.
            </p>
          </Callout>
        </div>
      </div>

      <JsonLd
        data={collectionPageSchema({
          name: 'Die Akademie in drei Wochen',
          description:
            'Alle Lektionen der Akademie in einer Reihenfolge ohne übersprungene Voraussetzungen, verteilt auf drei Wochen.',
          path: '/akademie/drei-wochen',
          items: wochen.map((woche) => ({
            name: `Woche ${woche.nummer}: ${woche.titel}`,
            path: `/akademie/drei-wochen#woche-${woche.nummer}`,
          })),
        })}
      />
    </>
  )
}
