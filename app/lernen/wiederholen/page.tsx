import type { Metadata } from 'next'
import Link from 'next/link'

import { Wiederholung } from '@/components/learn/Wiederholung'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Callout } from '@/components/ui/Callout'
import { PageHeader } from '@/components/ui/PageHeader'
import { alleFragen, fragenJeStufe, themenMitFragen } from '@/lib/fragenbestand'
import { buildMetadata, withBrand } from '@/lib/seo'

/**
 * Verteilte Wiederholung über alle Lernthemen.
 *
 * ## Warum es diese Seite gibt
 *
 * Der Wissenscheck am Ende einer Stufe prüft, ob der Text gerade verstanden
 * wurde. Vier Wochen später ist das keine Aussage mehr. Wer den Stoff behalten
 * will, muss ihn abrufen, und zwar in wachsenden Abständen – die Alternative
 * ist Wiederlesen, und das fühlt sich gut an, ohne zu wirken.
 *
 * Die 408 Fragen stehen ohnehin da. Sie einmal quer über alle Themen nutzbar
 * zu machen kostet eine Seite und einen Speicher.
 */
export const metadata: Metadata = buildMetadata({
  title: withBrand('Wiederholen'),
  description:
    'Die Fragen aus allen Lernthemen in wachsenden Abständen wiederholen – was sitzt, kommt später wieder, was nicht saß, schon morgen.',
  path: '/lernen/wiederholen',
  ogTitle: 'Behalten statt nur verstanden haben',
})

export default function WiederholenSeite() {
  const fragen = alleFragen()
  const jeStufe = fragenJeStufe()
  const themen = themenMitFragen()

  return (
    <>
      <PageHeader
        area="learn"
        eyebrow="Lernen"
        eyebrowIcon="target"
        title="Wiederholen, bevor du es vergisst"
        lead="Verstanden zu haben und behalten zu haben sind zwei verschiedene Dinge. Diese Seite legt dir die Fragen aus allen Lernthemen in wachsenden Abständen wieder vor: was du konntest, in Wochen – was du nicht konntest, morgen."
        breadcrumbs={
          <Breadcrumbs
            items={[{ name: 'Lernen', path: '/lernen' }, { name: 'Wiederholen' }]}
          />
        }
        meta={
          <>
            <span>{fragen.length} Fragen</span>
            <span aria-hidden="true">·</span>
            <span>{themen} Themen</span>
            <span aria-hidden="true">·</span>
            <span>ohne Konto</span>
          </>
        }
      />

      <div className="fk-container py-12 sm:py-16">
        <Wiederholung />

        <section aria-labelledby="verfahren" className="mt-16">
          <h2 id="verfahren" className="text-fg text-2xl font-bold">
            Warum Abstände und nicht Wiederlesen
          </h2>
          <div className="text-fg-muted mt-3 max-w-2xl space-y-4 leading-relaxed">
            <p>
              Einen Text ein zweites Mal zu lesen fühlt sich an wie Lernen: Alles kommt
              bekannt vor, nichts stockt. Genau das ist die Täuschung – vertraut heißt
              nicht abrufbar. Geprüft wird das Gedächtnis erst, wenn man etwas{' '}
              <strong>ohne die Vorlage</strong> hervorholen muss, und das ist zugleich der
              Vorgang, der es festigt.
            </p>
            <p>
              Der zweite Teil ist der Abstand. Eine Frage, die man heute und morgen und
              übermorgen beantwortet, ist nach einem Monat trotzdem weg. Eine, die nach
              einem Tag, nach drei, nach einer Woche, nach drei Wochen wiederkommt, sitzt
              – bei gleichem Aufwand. Der Aufwand verteilt sich nur anders.
            </p>
            <p>
              Deshalb steckt hinter dieser Seite kein Zeitplan, den man einhalten muss,
              sondern eine Frage: Was ist heute dran? Wer drei Tage aussetzt, findet
              danach mehr Karten vor – und keinen Vorwurf.
            </p>
          </div>
        </section>

        <section aria-labelledby="bestand" className="mt-12">
          <h2 id="bestand" className="text-fg text-2xl font-bold">
            Woher die Fragen kommen
          </h2>
          <div className="text-fg-muted mt-3 max-w-2xl space-y-4 leading-relaxed">
            <p>
              Es sind dieselben {fragen.length} Fragen, die am Ende der Lernstufen stehen:{' '}
              {jeStufe.beginner} auf der Einsteigerstufe, {jeStufe.fortgeschritten} auf
              der fortgeschrittenen und {jeStufe.profi} auf der Profistufe. Keine eigene
              Sammlung, die neben den Texten her veraltet – wird eine Frage im Lernbereich
              geändert, ändert sie sich hier mit.
            </p>
            <p>
              Zu jeder Antwort steht die Begründung und der Verweis auf die Stufe, aus der
              die Frage stammt. Wer dreimal an derselben Stelle scheitert, sollte nicht
              die Karte weiterüben, sondern den{' '}
              <Link
                href="/lernen"
                className="text-learn font-medium underline underline-offset-2"
              >
                Text noch einmal lesen
              </Link>
              .
            </p>
          </div>
        </section>

        <Callout variant="info" title="Was hier nicht passiert" className="mt-12">
          <p>
            Der Stand liegt im <strong>localStorage dieses Browsers</strong>. Es gibt kein
            Konto, keine Übertragung an einen Server und keine Auswertung, die irgendwo
            landet. Der Preis dafür: Auf einem anderen Gerät fängst du von vorn an, und
            beim Löschen der Browserdaten ist der Stand weg.
          </p>
          <p>
            Das ist ein bewusster Tausch. Ein Lernstand über Geräte hinweg hieße
            Anmeldung, Passwort und personenbezogene Daten auf einem Server – für eine
            Bequemlichkeit, die den meisten weniger wert ist als das, was sie kostet.
          </p>
        </Callout>
      </div>
    </>
  )
}
