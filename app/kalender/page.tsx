import type { Metadata } from 'next'

import { KalenderAnsicht } from '@/components/kalender/KalenderAnsicht'
import { TopicLinkList } from '@/components/learn/TopicLinkList'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Callout } from '@/components/ui/Callout'
import { PageHeader } from '@/components/ui/PageHeader'
import {
  getKalenderZeitraum,
  getTerminAnzahl,
  getTermineNachMonat,
  terminArtMeta,
  terminArtReihenfolge,
} from '@/lib/kalender'
import { getLearnTopics, getTopicsBySlugs } from '@/lib/learn'
import { getInstruments } from '@/lib/markets'
import { buildMetadata, withBrand } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: withBrand('Börsenkalender – Termine, die feststehen'),
  description:
    'Zinsentscheide von EZB und Fed, Berichtssaison, Verfallstage, Börsenfeiertage und Wahlen – mit einer Einordnung, was jeder Termin für Anleger bedeutet.',
  path: '/kalender',
  ogTitle: 'Der Börsenkalender: Termine, die feststehen',
})

export default async function KalenderPage() {
  const [gruppen, anzahl, zeitraum, relatedTopics, themen, instrumente] =
    await Promise.all([
      getTermineNachMonat(),
      getTerminAnzahl(),
      getKalenderZeitraum(),
      getTopicsBySlugs(['notenbanken-geldpolitik', 'wann-kaufen-verkaufen', 'boerse']),
      getLearnTopics(),
      getInstruments(),
    ])

  /*
    Namen statt Kennungen.

    Die Termine verweisen über Slugs und Symbole – im Browser soll aber
    „Währungen und Wechselkurse“ stehen und nicht „waehrungen-wechselkurse“.
    Aufgelöst wird das hier auf dem Server, damit die Lern- und Kursdaten nicht
    ins Browser-Bundle wandern.
  */
  const themennamen = Object.fromEntries(themen.map((thema) => [thema.slug, thema.title]))
  const kursnamen = Object.fromEntries(
    instrumente.map((eintrag) => [eintrag.symbol, eintrag.ticker])
  )

  const gesamt = gruppen.reduce((summe, gruppe) => summe + gruppe.termine.length, 0)

  return (
    <>
      <PageHeader
        area="calendar"
        eyebrow="Kalender"
        eyebrowIcon="clock"
        title="Termine, die feststehen"
        lead="Zinsentscheide, Berichtssaison, Verfallstage, Börsenfeiertage und Wahlen – und bei jedem Termin ein Satz dazu, was er für dein Geld bedeutet."
        breadcrumbs={<Breadcrumbs items={[{ name: 'Kalender' }]} />}
        meta={
          <>
            <span>{gesamt} Termine</span>
            <span aria-hidden="true">·</span>
            <span>bis {new Date(zeitraum.bis).getFullYear()}</span>
            <span aria-hidden="true">·</span>
            <span>jeder mit Quelle</span>
          </>
        }
      />

      <div className="fk-container py-12 sm:py-16">
        <div className="max-w-3xl">
          <KalenderAnsicht
            gruppen={gruppen}
            artMeta={terminArtMeta}
            reihenfolge={terminArtReihenfolge}
            anzahl={anzahl}
            themennamen={themennamen}
            kursnamen={kursnamen}
          />

          {/* ---------------------------------------------------- Einordnung */}
          <section aria-labelledby="hinweis" className="mt-16">
            <h2 id="hinweis" className="text-fg text-2xl font-bold">
              Warum hier keine geschätzten Termine stehen
            </h2>
            <p className="text-fg-muted mt-4 leading-relaxed">
              In diesem Kalender steht nur, was im Voraus feststeht und veröffentlicht
              ist. Notenbanken geben ihre Sitzungstermine ein Jahr vorher bekannt, Börsen
              ihre Feiertage, Verfallstage folgen einer festen Regel – dem dritten Freitag
              der Quartalsmonate –, und Wahltermine stehen im Gesetz.
            </p>
            <p className="text-fg-muted mt-4 leading-relaxed">
              Wann genau ein einzelnes Unternehmen seine Quartalszahlen vorlegt, kündigt
              es dagegen selbst an, meist wenige Wochen vorher. Für alle Aktien dieser
              Seite ein Jahr im Voraus ist das schlicht nicht bekannt. Deshalb stehen für
              die Berichtssaison <strong className="text-fg">Zeitfenster</strong> im
              Kalender und einzelne Tage nur dort, wo sie bestätigt sind. Ein Kalender,
              der geratene Daten wie Fakten ausweist, wäre schlimmer als einer mit Lücken:
              Wer danach plant, verpasst den echten Termin.
            </p>

            <Callout variant="tip" title="Was Termine mit Kursen machen" className="mt-6">
              <p>
                Ein bekannter Termin bewegt für sich genommen nichts. Was am Mittwoch
                erwartet wird, steckt schon im Kurs vom Dienstag – bewegt wird erst die
                Abweichung von dieser Erwartung.
              </p>
              <p>
                Nützlich ist der Kalender deshalb anders herum: Er erklärt hinterher,
                warum ein Tag unruhig war. Ein Verfallstag oder ein Zinsentscheid ist der
                häufigste Grund für einen Ausschlag, hinter dem keinerlei Nachricht über
                ein Unternehmen steckt.
              </p>
            </Callout>
          </section>

          <div className="mt-16">
            <TopicLinkList
              topics={relatedTopics}
              description="Was hinter Notenbanken, Verfallstagen und dem richtigen Zeitpunkt steckt."
            />
          </div>
        </div>
      </div>
    </>
  )
}
