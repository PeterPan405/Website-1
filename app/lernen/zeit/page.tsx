import type { Metadata } from 'next'
import Link from 'next/link'

import { JsonLd } from '@/components/seo/JsonLd'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Callout } from '@/components/ui/Callout'
import { PageHeader } from '@/components/ui/PageHeader'
import { collectionPageSchema } from '@/lib/jsonld'
import { buildMetadata, withBrand } from '@/lib/seo'
import {
  ZEITFENSTER,
  dauerText,
  kleinstesFenster,
  vorschlaegeFuer,
} from '@/lib/zeitbudget'
import { alleVorschlaege } from '@/lib/zeitbudget-daten'

export const metadata: Metadata = buildMetadata({
  // 157 Zeichen. Die Grenze liegt bei 160 (`scripts/paket-pruefen.ts`).
  title: withBrand('Ich habe fünf Minuten'),
  description:
    'Einstieg nach verfügbarer Zeit statt nach Thema: fünf Minuten, eine Viertelstunde, eine Stunde, ein Abend – mit der Dauer, die in den Daten steht.',
  path: '/lernen/zeit',
  ogTitle: 'Ich habe fünf Minuten',
})

/**
 * Einstieg nach Zeit.
 *
 * ## Die Messung, aus der der Aufbau folgt
 *
 * Die 102 Lernstufen dieser Website brauchen zwischen **9 und 15 Minuten**.
 * Es gibt hier nichts, was fünf Minuten dauert und eine Lernstufe wäre.
 *
 * Daraus folgt alles Weitere: Das Fünf-Minuten-Fenster bietet eine
 * Podcastfolge an (3 bis 6 Minuten, gemessen), einen Irrtum oder ein
 * Verwechslungspaar – und sagt ausdrücklich, dass die kürzeste Lernstufe neun
 * Minuten braucht. Eine anzubieten und zu hoffen wäre der bequeme Weg gewesen.
 *
 * ## Warum manche Vorschläge keine Zahl tragen
 *
 * Weil sie keine haben. `readingMinutes`, `dauerSekunden` und die Summe eines
 * Lernpfads stehen in den Daten; wie lange ein Glossarbegriff dauert, steht
 * nirgends. Auf einer Seite, die Zeitangaben verspricht, wäre eine geschätzte
 * Minutenzahl genau die Zahl, der man glaubt.
 */
export default async function ZeitSeite() {
  const alle = await alleVorschlaege()
  const kleinstes = kleinstesFenster()

  const abschnitte = ZEITFENSTER.map((fenster) => ({
    fenster,
    vorschlaege: vorschlaegeFuer(alle, fenster, 6, kleinstes),
  }))

  return (
    <>
      <PageHeader
        area="learn"
        eyebrow="Einstieg"
        eyebrowIcon="clock"
        title="Ich habe fünf Minuten"
        lead="Sortiert nach der Zeit, die du hast – nicht nach dem Thema. Jede Angabe steht so in den Daten; wo keine hinterlegt ist, steht auch keine da."
        breadcrumbs={
          <Breadcrumbs
            items={[{ name: 'Lernen', path: '/lernen' }, { name: 'Nach Zeit' }]}
          />
        }
        meta={
          <>
            <span>{ZEITFENSTER.length} Zeitfenster</span>
            <span aria-hidden="true">·</span>
            <span>Dauer aus den Inhalten gerechnet</span>
          </>
        }
      />

      <div className="fk-container py-12 sm:py-16">
        <Callout variant="info" title="Was fünf Minuten hier heißt">
          <p>
            Die Lernstufen dieser Website brauchen zwischen{' '}
            <strong>9 und 15 Minuten</strong>. Es gibt hier also nichts, was in fünf
            Minuten passt und eine Lernstufe wäre – und deshalb steht im ersten Fenster
            keine.
          </p>
          <p className="mt-3">
            Stattdessen: eine Podcastfolge, deren Länge gemessen ist, oder eine Seite zum
            Aufschlagen. Wo keine Dauer hinterlegt ist, steht keine Zahl, sondern der
            Hinweis, dass es keine gibt.
          </p>
        </Callout>

        <div className="mt-12 space-y-14">
          {abschnitte.map(({ fenster, vorschlaege }) => (
            <section key={fenster.id} id={fenster.id} aria-labelledby={`f-${fenster.id}`}>
              <h2
                id={`f-${fenster.id}`}
                className="text-fg border-border border-b pb-3 text-2xl font-bold"
              >
                {fenster.label}
              </h2>
              <p className="text-fg-muted mt-3 max-w-3xl leading-relaxed">
                {fenster.lead}
              </p>

              {vorschlaege.length === 0 ? (
                /*
                  Ein leeres Fenster ist kein Fehler, aber es muss etwas sagen.

                  Eine leere Liste sieht aus wie eine leere Liste – und niemand
                  wüsste, ob nichts passt oder etwas kaputt ist.
                */
                <p className="text-fg-subtle mt-6 text-sm">
                  Für dieses Fenster gibt es zurzeit nichts, dessen Dauer hinterlegt ist.
                </p>
              ) : (
                <ul className="mt-6 space-y-3">
                  {vorschlaege.map((vorschlag) => (
                    <li key={vorschlag.id}>
                      <Link
                        href={vorschlag.href}
                        className="border-border hover:border-brand hover:bg-surface block rounded-lg border p-4 transition"
                      >
                        <p className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                          <span className="text-fg font-semibold">{vorschlag.titel}</span>
                          <span className="text-fg-subtle text-sm tabular-nums">
                            {dauerText(vorschlag.dauer)}
                          </span>
                        </p>
                        <p className="text-fg-muted mt-1.5 text-sm leading-relaxed">
                          {vorschlag.hinweis}
                        </p>
                        <p className="text-fg-subtle mt-2 text-xs tracking-wide uppercase">
                          {vorschlag.herkunft}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        <p className="text-fg-subtle mt-16 max-w-3xl text-sm leading-relaxed">
          Die Minutenangaben stammen aus den Inhalten selbst: die Lesezeit einer
          Lernstufe, die gemessene Länge einer Podcastfolge, die Summe eines{' '}
          <Link href="/lernen/pfade" className="underline underline-offset-2">
            Lernpfads
          </Link>{' '}
          ohne die Rechner darin – deren Dauer kennt niemand. Damit ist ein Pfad eher zu
          kurz als zu lang angegeben, und das ist bei einer Zusage die richtige Richtung.
        </p>
      </div>

      <JsonLd
        data={collectionPageSchema({
          name: 'Ich habe fünf Minuten',
          description:
            'Einstieg in die Finanzbildung nach verfügbarer Zeit – fünf Minuten bis ein Abend.',
          path: '/lernen/zeit',
          items: ZEITFENSTER.map((fenster) => ({
            name: fenster.label,
            path: `/lernen/zeit#${fenster.id}`,
          })),
        })}
      />
    </>
  )
}
