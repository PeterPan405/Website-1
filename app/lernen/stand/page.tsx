import type { Metadata } from 'next'
import Link from 'next/link'

import { Einstufungstest } from '@/components/learn/Einstufungstest'
import { Lernstand, type Themenstand } from '@/components/learn/Lernstand'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Callout } from '@/components/ui/Callout'
import { PageHeader } from '@/components/ui/PageHeader'
import { learnTopics } from '@/data/learn'
import { learnLevelIds } from '@/data/learn/types'
import { TESTLAENGE } from '@/lib/einstufung'
import { buildMetadata, withBrand } from '@/lib/seo'

/**
 * Lernstand und Einstufungstest an einer Stelle.
 *
 * ## Warum zusammen
 *
 * Beide beantworten dieselbe Frage – „wo stehe ich?“ –, nur für verschiedene
 * Leute. Wer hier schon gelernt hat, findet die Antwort im gespeicherten Stand.
 * Wer neu ist, hat keinen Stand, und für den ist der Test da.
 *
 * Auf zwei Seiten verteilt landete jeder auf der falschen: Der Neue sähe eine
 * leere Fortschrittstafel, der Wiederkehrende einen Test, den er nicht braucht.
 */
export const metadata: Metadata = buildMetadata({
  title: withBrand('Dein Lernstand'),
  description:
    'Welche Lernstufen erledigt sind, wo Quiz-Ergebnisse fehlen – und ein Einstufungstest für alle, die nicht bei null anfangen.',
  path: '/lernen/stand',
  ogTitle: 'Wo stehst du im Lernbereich?',
})

export default function LernstandSeite() {
  const themen: Themenstand[] = learnTopics.map((thema) => ({
    slug: thema.slug,
    titel: thema.title,
    ausformuliert: learnLevelIds.filter(
      (stufe) => thema.levels[stufe].status === 'complete'
    ),
  }))

  const themennamen = Object.fromEntries(
    learnTopics.map((thema) => [thema.slug, thema.title])
  )

  const stufenGesamt = themen.length * learnLevelIds.length

  return (
    <>
      <PageHeader
        area="learn"
        eyebrow="Lernen"
        eyebrowIcon="chart"
        title="Wo stehst du?"
        lead="Zwei Wege zu derselben Antwort: Wer hier schon gelernt hat, sieht seinen gespeicherten Stand. Wer neu ist, aber nicht bei null anfängt, macht den Einstufungstest und weiß danach, welche Stufe sich lohnt."
        breadcrumbs={
          <Breadcrumbs
            items={[{ name: 'Lernen', path: '/lernen' }, { name: 'Lernstand' }]}
          />
        }
        meta={
          <>
            <span>{themen.length} Themen</span>
            <span aria-hidden="true">·</span>
            <span>{stufenGesamt} Stufen</span>
            <span aria-hidden="true">·</span>
            <span>{TESTLAENGE} Fragen im Test</span>
          </>
        }
      />

      <div className="fk-container py-12 sm:py-16">
        <section aria-labelledby="stand">
          <h2 id="stand" className="text-fg text-2xl font-bold">
            Dein gespeicherter Stand
          </h2>
          <p className="text-fg-muted mt-2 max-w-2xl leading-relaxed">
            Der Haken je Stufe und das beste Quiz-Ergebnis stehen sonst nur auf der Seite,
            auf der sie entstehen. Nebeneinander gelegt zeigen sie etwas, das einzeln
            nicht auffällt: eine abgehakte Stufe ohne Quiz-Ergebnis ist gelesen, nicht
            geprüft.
          </p>
          <div className="mt-8">
            <Lernstand themen={themen} />
          </div>
        </section>

        <section aria-labelledby="einstufung" className="mt-16">
          <h2 id="einstufung" className="text-fg text-2xl font-bold">
            Einstufungstest
          </h2>
          <p className="text-fg-muted mt-2 max-w-2xl leading-relaxed">
            {stufenGesamt} Stufen sind viel, wenn man nicht weiß, welche davon einem etwas
            bringen. Der Test stellt {TESTLAENGE} Fragen quer über alle Themen und sagt
            danach, wo der Einstieg sich lohnt.
          </p>
          <div className="mt-8">
            <Einstufungstest themennamen={themennamen} />
          </div>
        </section>

        <Callout variant="tip" title="Und danach?" className="mt-16">
          <p>
            Eine Stufe abzuhaken heißt, sie gelesen zu haben. Ob sie in vier Wochen noch
            sitzt, ist eine andere Frage – und die beantwortet nur ein Abruf nach einem
            Abstand. Dafür gibt es die{' '}
            <Link
              href="/lernen/wiederholen"
              className="text-learn font-medium underline underline-offset-2"
            >
              verteilte Wiederholung
            </Link>
            : dieselben Fragen, aber in wachsenden Abständen wieder vorgelegt.
          </p>
        </Callout>

        <section aria-labelledby="grenzen" className="mt-16">
          <h2 id="grenzen" className="text-fg text-2xl font-bold">
            Was diese Seite nicht weiß
          </h2>
          <div className="text-fg-muted mt-3 max-w-2xl space-y-4 leading-relaxed">
            <p>
              Ob du etwas gelernt hast. Sie weiß, welche Haken in diesem Browser gesetzt
              sind – und ein Haken ist eine Selbsteinschätzung. Wer eine Stufe überfliegt
              und abhakt, sieht hier denselben Fortschritt wie jemand, der sie
              durchgearbeitet hat.
            </p>
            <p>
              Deshalb steht die Spalte mit den Quiz-Ergebnissen daneben. Sie ist die
              einzige Zahl auf dieser Seite, die nicht auf einer Selbsteinschätzung
              beruht.
            </p>
            <p>
              Und sie weiß nichts von deinen anderen Geräten. Der Stand liegt im
              localStorage; die{' '}
              <Link
                href="/akademie"
                className="text-academy font-medium underline underline-offset-2"
              >
                Akademie
              </Link>{' '}
              führt ihren Fortschritt im selben Speicher, wird hier aber nicht mitgezählt
              – dort geht es um Verfahren, nicht um Grundlagen.
            </p>
          </div>
        </section>
      </div>
    </>
  )
}
