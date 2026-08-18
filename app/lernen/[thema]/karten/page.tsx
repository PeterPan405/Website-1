import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Callout } from '@/components/ui/Callout'
import { Druckknopf } from '@/components/ui/Druckknopf'
import { PageHeader } from '@/components/ui/PageHeader'
import { getLearnTopic, getLearnTopicSlugs } from '@/lib/learn'
import { kartenZumThema, stufenName, themenMitKarten } from '@/lib/lernkarten-daten'
import { boegen, umfang, type Bogen, type Platz } from '@/lib/lernkarten'
import { beschreibungAusTeilen, buildMetadata, withBrand } from '@/lib/seo'

type Props = { params: Promise<{ thema: string }> }

/**
 * Lernkarten eines Themas – zum Ausdrucken, Zuschneiden und Mitnehmen.
 *
 * ## Warum es diese Seite neben den Karteikarten im Browser gibt
 *
 * `/glossar/karteikarten` beantwortet „sitzt der Begriff noch?“ am Bildschirm,
 * mit wachsenden Abständen und einem Kasten, der sich selbst sortiert. Das ist
 * gut, solange man am Bildschirm ist. Auf Papier ist der Vorteil ein anderer:
 * kein Gerät, keine Ablenkung, und man kann die Karten auf den Tisch legen und
 * gruppieren – was am Bildschirm niemand nachbaut.
 *
 * ## Der Punkt, an dem so etwas schiefgeht
 *
 * Beim beidseitigen Druck. Wird die Rückseite in derselben Reihenfolge
 * gedruckt wie die Vorderseite, steht die Antwort zu Karte 1 hinter Karte 2 –
 * auf jedem Blatt, und sichtbar erst mit der Schere in der Hand. Die
 * Spiegelung steckt in `rueckseiten()` und wird von
 * `tests/lernkarten.test.ts` gegen eine ausgeschriebene Sollreihenfolge
 * geprüft.
 */
export async function generateStaticParams() {
  const slugs = await getLearnTopicSlugs()
  return themenMitKarten(slugs).map((thema) => ({ thema }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { thema } = await params
  const topic = await getLearnTopic(thema)

  if (!topic) {
    return buildMetadata({
      title: withBrand('Thema nicht gefunden'),
      description: 'Das gesuchte Lernthema existiert nicht.',
      path: `/lernen/${thema}/karten`,
      noIndex: true,
    })
  }

  return buildMetadata({
    title: withBrand(`Lernkarten: ${topic.title}`),
    /*
      Aus Teilen zusammengesetzt, weil der Titel aus den Daten kommt.

      „Wie funktioniert der Markt“ ist vierzehn Zeichen länger als „ETF“. Ein
      fester Satz, der für die heutigen Titel gerade passt, ist eine Wette auf
      den nächsten – fünf der vierunddreißig Themen rissen die Grenze, die
      übrigen neunundzwanzig nicht.
    */
    description: beschreibungAusTeilen([
      `Begriffe und Prüffragen zum Thema ${topic.title} als Kartenbogen zum Ausdrucken.`,
      'Acht Karten je A4-Blatt, beidseitig.',
      'Vorder- und Rückseite stehen passend zueinander.',
    ]),
    path: `/lernen/${thema}/karten`,
    ogTitle: `Lernkarten: ${topic.title}`,
  })
}

export default async function KartenSeite({ params }: Props) {
  const { thema } = await params
  const topic = await getLearnTopic(thema)
  if (!topic) notFound()

  const karten = kartenZumThema(thema)
  if (karten.length === 0) notFound()

  const blaetter = boegen(karten)
  const zahl = umfang(karten)

  return (
    <>
      <div data-drucken="aus">
        <PageHeader
          area="learn"
          eyebrow="Lernkarten"
          eyebrowIcon="layers"
          title={topic.title}
          lead="Acht Karten je Blatt, Vorder- und Rückseite passend gesetzt. Beidseitig drucken, zuschneiden, mitnehmen."
          breadcrumbs={
            <Breadcrumbs
              items={[
                { name: 'Lernen', path: '/lernen' },
                { name: topic.title, path: `/lernen/${thema}` },
                { name: 'Karten' },
              ]}
            />
          }
          meta={
            <>
              <span>{zahl.karten} Karten</span>
              <span aria-hidden="true">·</span>
              <span>
                {zahl.begriffe} Begriffe, {zahl.fragen} Fragen
              </span>
              <span aria-hidden="true">·</span>
              <span>
                {zahl.boegen} {zahl.boegen === 1 ? 'Blatt' : 'Blätter'}
              </span>
            </>
          }
        />
      </div>

      <div className="fk-container py-10 sm:py-14">
        <div data-drucken="aus">
          <Callout variant="info" title="So kommt die Antwort hinter ihre Frage">
            <ol className="ml-5 list-decimal space-y-2">
              <li>
                Im Druckdialog <strong>beidseitig</strong> wählen, gewendet über die{' '}
                <strong>lange Kante</strong> – das ist die übliche Voreinstellung.
              </li>
              <li>
                Skalierung auf <strong>100 Prozent</strong> stellen, nicht auf „an
                Seitengröße anpassen“. Sonst verschieben sich Vorder- und Rückseite
                gegeneinander.
              </li>
              <li>Entlang der Trennlinien schneiden – acht Karten je Blatt.</li>
            </ol>
            <p className="mt-3">
              Die Rückseiten stehen hier absichtlich seitenverkehrt: Beim Wenden über die
              lange Kante tauschen linke und rechte Spalte die Seite. Gedruckt landet
              dadurch jede Antwort hinter ihrer eigenen Frage.
            </p>
          </Callout>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <Druckknopf />
            <Link
              href={`/lernen/${thema}`}
              className="text-fg-muted hover:text-fg text-sm underline underline-offset-2"
            >
              Zurück zum Thema
            </Link>
            <Link
              href="/glossar/karteikarten"
              className="text-fg-muted hover:text-fg text-sm underline underline-offset-2"
            >
              Lieber am Bildschirm abfragen
            </Link>
          </div>
        </div>

        <div className="mt-10 space-y-10">
          {blaetter.map((bogen) => (
            <BogenPaar key={bogen.nummer} bogen={bogen} thema={topic.title} />
          ))}
        </div>

        {/* Auf Papier gehört die Herkunft ans Blatt – im Browser steht sie oben. */}
        <p data-drucken="nur" className="text-fg-subtle mt-6 text-xs">
          Lernkarten zum Thema {topic.title} – iminvests.de
        </p>
      </div>
    </>
  )
}

function BogenPaar({ bogen, thema }: { bogen: Bogen; thema: string }) {
  return (
    <section aria-label={`Blatt ${bogen.nummer}`} className="space-y-6">
      <Seite
        titel={`Blatt ${bogen.nummer}, Vorderseite`}
        plaetze={bogen.vorderseite}
        seite="vorn"
        thema={thema}
      />
      <Seite
        titel={`Blatt ${bogen.nummer}, Rückseite`}
        plaetze={bogen.rueckseite}
        seite="hinten"
        thema={thema}
      />
    </section>
  )
}

/**
 * Ein Blatt.
 *
 * `break-after: page` steht auf jedem Blatt, damit im Ausdruck genau ein Bogen
 * je Seite landet. Am Bildschirm ist es wirkungslos.
 */
function Seite({
  titel,
  plaetze,
  seite,
  thema,
}: {
  titel: string
  plaetze: Platz[]
  seite: 'vorn' | 'hinten'
  thema: string
}) {
  return (
    <div className="break-after-page">
      <p
        data-drucken="aus"
        className="text-fg-subtle mb-2 text-xs font-semibold tracking-wide uppercase"
      >
        {titel}
      </p>

      <div className="border-border grid grid-cols-2 border-t border-l">
        {plaetze.map((platz, index) => (
          <div
            key={index}
            className="border-border flex min-h-[8rem] flex-col justify-between border-r border-b p-3 sm:min-h-[9rem]"
          >
            {platz ? (
              <>
                <p
                  className={
                    seite === 'vorn'
                      ? 'text-fg text-base leading-snug font-semibold'
                      : 'text-fg-muted text-xs leading-snug whitespace-pre-line'
                  }
                >
                  {seite === 'vorn' ? platz.vorn : platz.hinten}
                </p>
                <p className="text-fg-subtle mt-2 flex items-baseline justify-between gap-2 text-[0.6rem] tracking-wide uppercase">
                  <span>{platz.art === 'begriff' ? 'Begriff' : 'Frage'}</span>
                  <span>{stufenName(platz.stufe) || thema}</span>
                </p>
              </>
            ) : (
              /*
                Ein leerer Platz bleibt leer und wird nicht weggelassen.

                Er hält die Spalte – ohne ihn rutschte die letzte Karte eines
                halb gefüllten Bogens in die falsche Spalte, und zwar nur auf
                dem letzten Blatt.
              */
              <span className="sr-only">leer</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
