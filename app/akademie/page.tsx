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
  title: withBrand('Akademie: Analyse, Depot, Konjunktur, Verhalten'),
  description:
    'Fünf Bereiche in einzelnen Lektionen: Charts lesen, Kennzahlen einordnen, ein Depot zusammensetzen, Konjunkturdaten deuten und die eigenen Denkfehler kennen.',
  path: '/akademie',
  ogTitle: 'Akademie: fünf Bereiche mit benannten Grenzen',
})

export default function AkademiePage() {
  const bereiche = getBereiche()

  return (
    <>
      <PageHeader
        area="akademie"
        eyebrow="Akademie"
        eyebrowIcon="scale"
        title="Beurteilen lernen, nicht nur benennen"
        lead="Der Lernbereich erklärt, was es gibt. Die Akademie erklärt, wie man beurteilt, was man vor sich hat – und wo jedes dieser Verfahren an seine Grenzen kommt."
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
          Hier stand ein Hinweiskasten über die drei Einstufungen – Rechenweg,
          Beobachtung, Auslegung – und darüber, dass nichts davon eine
          Anlageempfehlung ist.

          Er ist weg. Die Einstufung steht an jeder Lektion, dort wo sie
          gebraucht wird; sie vorab zu erklären hieß, den Leser auf etwas
          vorzubereiten, das ihm zwei Klicks später ohnehin begegnet und sich
          dann von selbst versteht. „Jede mit benannten Grenzen" steht als
          drittes Merkmal im Kopf darüber, und der Haftungshinweis steht in der
          Fußzeile jeder Seite.
        */}

        {/*
          Die ganze Kachel ist der Verweis, nicht nur die Zeile darunter.

          Vorher war jeder Lektionstitel für sich verlinkt und der Fußlink
          führte auf den Bereich – vier Dutzend Ziele auf einer Übersicht, von
          denen keines das offensichtliche war. Jetzt gibt es je Bereich genau
          ein Ziel: die Bereichsseite, auf der dieselben Lektionen als Kacheln
          samt Bearbeitungsstand stehen. Die Titel hier bleiben als Vorschau
          stehen, aber als Text – ein Verweis im Verweis ginge weder mit der
          Maus noch mit der Tastatur gut aus.
        */}
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {bereiche.map((bereich, stelle) => {
            const lektionen = getLektionen(bereich.id)
            return (
              <Reveal key={bereich.id} delay={stelle * 0.06} className="h-full">
                <Link
                  href={`/akademie/${bereich.id}`}
                  className="fk-card-interactive group flex h-full flex-col p-6 sm:p-7"
                >
                  <span className="bg-akademie-soft text-akademie flex size-11 items-center justify-center rounded-xl">
                    <Icon name={bereich.sinnbild} className="size-5" />
                  </span>

                  <h2 className="text-fg group-hover:text-akademie mt-4 text-2xl font-bold transition">
                    {bereich.titel}
                  </h2>
                  <p className="text-fg-muted mt-2 leading-relaxed">
                    {bereich.einleitung}
                  </p>

                  {/*
                    Drei Lektionen als Vorschau statt aller.

                    Fünf Kacheln mit je acht bis zwölf Zeilen ergaben auf dem
                    Telefon eine Kolonne über mehrere Bildschirmhöhen – und
                    keine davon war anklickbar, weil das Ziel die Kachel ist.
                    Drei Titel zeigen, worum es geht; die vollständige Liste
                    steht einen Klick weiter auf der Bereichsseite.
                  */}
                  <ol className="mt-5 flex-1 space-y-1.5">
                    {lektionen.slice(0, 3).map((lektion, nummer) => (
                      <li
                        key={lektion.slug}
                        className="text-fg-muted flex items-start gap-2.5 text-sm"
                      >
                        <span className="text-fg-subtle w-5 shrink-0 text-right tabular-nums">
                          {nummer + 1}
                        </span>
                        <span>{lektion.titel}</span>
                      </li>
                    ))}
                    {lektionen.length > 3 && (
                      <li className="text-fg-subtle flex items-start gap-2.5 text-sm">
                        <span className="w-5 shrink-0 text-right">+</span>
                        <span>
                          {lektionen.length - 3} weitere{' '}
                          {lektionen.length - 3 === 1 ? 'Lektion' : 'Lektionen'}
                        </span>
                      </li>
                    )}
                  </ol>

                  <span className="text-akademie mt-6 flex items-center gap-1 text-sm font-semibold">
                    Alle {lektionen.length} Lektionen
                    <Icon
                      name="arrow-right"
                      className="size-4 transition-transform group-hover:translate-x-0.5"
                    />
                  </span>
                </Link>
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
              Die Bereiche bauen <em>nicht</em> aufeinander auf. Man kann mit jedem
              anfangen und die übrigen weglassen. Wer schon anlegt und nur einen lesen
              will, nimmt <strong>Anlegerverhalten</strong> – dort geht es um die Fehler,
              die am meisten kosten und am wenigsten auffallen.
            </p>
          </Callout>

          {/*
            Der Verweis auf die drei Wochen steht unter dem Hinweiskasten, nicht
            über den Bereichskacheln.

            Die Bereiche sind der Regelfall: Wer hierherkommt, hat meist eine
            Frage und will ein Verfahren. Die Wochenreihenfolge ist die Antwort
            auf die andere Frage – „und in welcher Reihenfolge das alles?" –,
            und die stellt sich erst, wenn man die fünf Kacheln gesehen hat.
          */}
          <Link
            href="/akademie/drei-wochen"
            className="fk-card-interactive group mt-6 flex items-center gap-4 p-5"
          >
            <span className="bg-akademie-soft text-akademie flex size-11 shrink-0 items-center justify-center rounded-xl">
              <Icon name="calendar" className="size-5" />
            </span>
            <span className="min-w-0">
              <span className="text-fg group-hover:text-akademie block font-semibold transition">
                Lieber alles der Reihe nach? Die Akademie in drei Wochen
              </span>
              <span className="text-fg-muted mt-1 block text-sm leading-relaxed">
                Alle {lektionenGesamt()} Lektionen quer durch die Bereiche, in einer
                Reihenfolge, die keine Voraussetzung überspringt – rund 23 je Woche.
              </span>
            </span>
            <Icon
              name="arrow-right"
              className="text-akademie size-5 shrink-0 transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      </div>

      <JsonLd
        data={collectionPageSchema({
          name: 'Akademie',
          description:
            'Fünf Bereiche in einzelnen Lektionen, jeweils mit benannten Grenzen.',
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
