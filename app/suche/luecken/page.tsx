import type { Metadata } from 'next'
import Link from 'next/link'

import { Suchlueckentafel } from '@/components/layout/Suchlueckentafel'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Callout } from '@/components/ui/Callout'
import { PageHeader } from '@/components/ui/PageHeader'
import { siteConfig } from '@/lib/site'
import { buildMetadata, withBrand } from '@/lib/seo'
import { HALTBARKEIT_TAGE, HOECHSTZAHL } from '@/lib/suchluecken'

export const metadata: Metadata = buildMetadata({
  title: withBrand('Was du gesucht und nicht gefunden hast'),
  description:
    'Erfolglose Suchen bleiben in deinem Browser. Diese Seite zeigt sie – Zeile für Zeile, löschbar, und nur auf deinen Knopfdruck zu verschicken.',
  path: '/suche/luecken',
  ogTitle: 'Was hier fehlt – aus deiner Sicht',
  /*
    Nicht in den Index, aus demselben Grund wie bei der Merkliste: Für eine
    Suchmaschine ist die Seite immer leer. Ein leerer Treffer ist schlechter
    als kein Treffer.
  */
  noIndex: true,
})

/**
 * Das Protokoll der erfolglosen Suchen.
 *
 * ## Warum es diese Seite gibt
 *
 * Weil es die ehrlichste Liste fehlender Inhalte ist, die zu bekommen ist. Was
 * jemand sucht und nicht findet, ist eine Angabe über eine Lücke – und zwar
 * eine, die von außen kommt statt aus der eigenen Vorstellung davon, was fehlen
 * könnte. Zwanzig vergebliche Suchen nach „Rürup“ sagen mehr als jede
 * Themenliste, die am Schreibtisch entsteht.
 *
 * ## Warum nicht im Hintergrund gesammelt wird
 *
 * Ein Suchfeld nimmt entgegen, was jemand eintippt, und das ist gelegentlich
 * mehr als ein Stichwort. Es unbemerkt fortzuschicken wäre genau das Tracking,
 * das diese Website an keiner Stelle betreibt. Das Protokoll bleibt deshalb im
 * Browser, steht hier vollständig sichtbar und geht nur weg, wenn jemand es
 * selbst kopiert – wer es abschickt, hat es vorher gelesen.
 *
 * Der Preis ist derselbe wie bei der Merkliste und wird genannt: Was
 * niemand schickt, kommt hier nie an. Eine Auswertung im Hintergrund brächte
 * mehr Zahlen; sie brächte sie über Leute, die nicht gefragt wurden.
 */
export default function SuchlueckenSeite() {
  return (
    <>
      <PageHeader
        area="learn"
        eyebrow="Suche"
        eyebrowIcon="search"
        title="Was du gesucht und nicht gefunden hast"
        lead="Diese Liste steht in deinem Browser und nirgends sonst. Sie ist der direkteste Hinweis darauf, was hier fehlt – wenn du sie uns schickst."
        breadcrumbs={<Breadcrumbs items={[{ name: 'Suche' }, { name: 'Lücken' }]} />}
      />

      <div className="fk-container py-12 sm:py-16">
        <div className="max-w-3xl">
          <Suchlueckentafel kontaktMail={siteConfig.contactEmail} />

          <Callout
            variant="info"
            title="Was hier passiert – und was nicht"
            className="mt-10"
          >
            <p>
              Aufgezeichnet wird eine Suche nur, wenn sie <strong>nichts gefunden</strong>{' '}
              hat und die Eingabe eine Sekunde lang stehen geblieben ist. Findet eine
              spätere, längere Eingabe doch etwas, verschwinden ihre bereits notierten
              Anfänge wieder – sonst bestünde die Liste zu neun Zehnteln aus
              Tippzwischenständen.
            </p>
            <p>
              Gespeichert wird <strong>nur die Eingabe, ein Zähler und ein Datum</strong>.
              Keine Kennung, kein Gerät, keine Sitzung, nichts, was sich auf eine Person
              zurückführen ließe. Es bleibt bei höchstens {HOECHSTZAHL} Anfragen, und was
              länger als {HALTBARKEIT_TAGE} Tage nicht mehr gesucht wurde, fällt heraus.
            </p>
            <p>
              <strong>Übertragen wird nichts.</strong> Es gibt keinen Server, der etwas
              entgegennähme – diese Website wird statisch ausgeliefert. Wenn du willst,
              dass wir davon erfahren, musst du die Liste kopieren und schicken. Das ist
              umständlicher als eine automatische Auswertung und der Grund, warum es diese
              Seite überhaupt gibt.
            </p>
          </Callout>

          <p className="text-fg-subtle mt-8 text-sm leading-relaxed">
            Die Liste gilt für diesen Browser. Am Telefon steht eine andere als am
            Rechner, und wer die Browserdaten löscht, löscht sie mit – dieselbe
            Einschränkung wie bei der{' '}
            <Link href="/maerkte/merkliste" className="text-brand hover:underline">
              Merkliste
            </Link>
            . Was uns sonst noch hilft, steht auf der{' '}
            <Link href="/kontakt" className="text-brand hover:underline">
              Kontaktseite
            </Link>
            .
          </p>
        </div>
      </div>
    </>
  )
}
