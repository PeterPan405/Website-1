import type { Metadata } from 'next'
import Link from 'next/link'

import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { PageHeader } from '@/components/ui/PageHeader'
import { buildMetadata, withBrand } from '@/lib/seo'
import { siteConfig } from '@/lib/site'

/**
 * Die Seite, die sagt, was diese Website **nicht** tut.
 *
 * ## Warum es sie gibt
 *
 * Die Trackingfreiheit ist ein Alleinstellungsmerkmal dieser Website und
 * stand bisher nur dort, wo niemand freiwillig liest: in der
 * Datenschutzerklärung. Diese Seite sagt es dort, wo es hingehört – als
 * eigenes Versprechen, in verständlicher Sprache, mit einer Anleitung zum
 * Selbst-Nachprüfen.
 *
 * ## Der Grundsatz beim Schreiben
 *
 * Derselbe wie bei der Barrierefreiheits-Erklärung: **nur behaupten, was
 * messbar ist.** Jede Aussage hier ist im gebauten Stand nachgeprüft –
 * acht repräsentative Seiten (Startseite, News, Märkte, Rechner, Lernthema,
 * Podcast, Globus, Akademie) stellen zusammen null Anfragen an fremde
 * Server und setzen null Cookies. Wer eine Zeile hinzufügt, die das ändert
 * (externes Skript, eingebettetes Video, Zählpixel), macht diese Seite zur
 * Lüge – dann muss sie mitgeändert oder die Zeile verworfen werden.
 */

export const metadata: Metadata = buildMetadata({
  title: withBrand('Keine Cookies, kein Tracking'),
  description:
    'Diese Website setzt keine Cookies, bindet keine Analyse-Werkzeuge ein und lädt nichts von fremden Servern. Was das heißt – und wie du es selbst nachprüfst.',
  path: '/keine-cookies',
  ogTitle: 'Keine Cookies, kein Tracking',
})

export default function KeineCookiesPage() {
  return (
    <>
      <PageHeader
        area="learn"
        title="Keine Cookies, kein Tracking"
        lead="Deshalb fragt dich hier auch kein Banner um Zustimmung: Es gibt nichts, wozu du zustimmen müsstest. Was das konkret bedeutet – und wie du es in einer Minute selbst nachprüfst."
        breadcrumbs={<Breadcrumbs items={[{ name: 'Keine Cookies' }]} />}
      />

      <div className="fk-container py-12 sm:py-16">
        <div className="max-w-3xl">
          <section aria-labelledby="konkret" className="mt-4">
            <h2 id="konkret" className="text-fg text-2xl font-bold">
              Was das konkret heißt
            </h2>
            <ul className="text-fg-muted mt-4 list-disc space-y-3 pl-5 leading-relaxed">
              <li>
                <strong className="text-fg">Keine Cookies.</strong> Auch keine „technisch
                notwendigen“ – die Website funktioniert ohne. Deshalb gibt es kein
                Zustimmungsbanner: Wo nichts gesetzt wird, ist nichts zu erlauben.
              </li>
              <li>
                <strong className="text-fg">Keine Analyse-Werkzeuge.</strong> Kein Google
                Analytics, kein Matomo, keine Zählpixel, keine „datenschutzfreundliche“
                Statistik. Niemand zählt hier mit, welche Seiten du liest, wie lange du
                bleibst oder woher du kommst.
              </li>
              <li>
                <strong className="text-fg">Nichts von fremden Servern.</strong>{' '}
                Schriften, Skripte, Diagramme, Kurse – alles liegt auf dem eigenen Server.
                Dein Browser spricht beim Besuch ausschließlich mit dieser Website; kein
                Schriften-Dienst und kein Kartendienst erfährt davon.
              </li>
              <li>
                <strong className="text-fg">
                  Kurse werden nicht in deinem Browser geholt.
                </strong>{' '}
                Alle Marktdaten kommen beim Bauen der Seiten auf den Server, nicht beim
                Lesen in deinen Browser. Der Datenanbieter sieht unsere Abrufe, nie deine.
              </li>
              <li>
                <strong className="text-fg">Ausgänge sind gekennzeichnet.</strong>{' '}
                Quellenlinks unter Artikeln und der Podcast-Link führen zu fremden
                Anbietern – aber erst, wenn du klickst. Ab dort gelten deren Regeln,
                vorher erfahren sie nichts von dir.
              </li>
            </ul>
          </section>

          <section aria-labelledby="speicher" className="mt-12">
            <h2 id="speicher" className="text-fg text-2xl font-bold">
              Was auf deinem Gerät bleibt
            </h2>
            <p className="text-fg-muted mt-4 leading-relaxed">
              Einige Funktionen merken sich etwas – aber im Speicher deines Browsers
              (localStorage), nicht auf unserem Server: das Farbschema, dein
              Lernfortschritt, die Merkliste, die Vermögensübersicht. Diese Daten
              verlassen dein Gerät nie; wir können sie nicht lesen, nicht zählen und nicht
              verknüpfen. Du löschst sie jederzeit selbst über die Browserdaten – verloren
              geht dann nur dein eigener Stand. Auf ein neues Gerät kommt er per{' '}
              <Link href="/umzug" className="hover:text-brand underline">
                Umzugsdatei
              </Link>
              , nicht per Konto. Die rechtliche Einordnung steht in der{' '}
              <Link href="/datenschutz" className="hover:text-brand underline">
                Datenschutzerklärung
              </Link>
              .
            </p>
            <p className="text-fg-muted mt-4 leading-relaxed">
              Vollständig ehrlich gehört dazu: Der Server, der die Seiten ausliefert,
              führt wie jeder Webserver technische Zugriffsprotokolle. Was darin steht und
              wie lange, beschreibt ebenfalls die Datenschutzerklärung.
            </p>
          </section>

          <section aria-labelledby="nachpruefen" className="mt-12">
            <h2 id="nachpruefen" className="text-fg text-2xl font-bold">
              Glaub es nicht – prüf es nach
            </h2>
            <p className="text-fg-muted mt-4 leading-relaxed">
              Diese Behauptungen kannst du in jedem Browser selbst kontrollieren, ganz
              ohne Fachwissen:
            </p>
            <ol className="text-fg-muted mt-4 list-decimal space-y-3 pl-5 leading-relaxed">
              <li>
                Öffne die Entwicklerwerkzeuge (<kbd>F12</kbd> oder Rechtsklick →
                „Untersuchen“) und darin den Reiter <strong>Netzwerk</strong>. Lade die
                Seite neu: Jede einzelne Anfrage geht an diese Website – keine an Google,
                keine an ein Werbenetz, keine an einen Statistikdienst.
              </li>
              <li>
                Wechsle zum Reiter <strong>Anwendung</strong> (Chrome) bzw.{' '}
                <strong>Speicher</strong> (Firefox) und sieh unter „Cookies“ nach: Die
                Liste ist leer.
              </li>
            </ol>
            <p className="text-fg-muted mt-4 leading-relaxed">
              Genau diese beiden Messungen laufen auch bei uns – im gebauten Stand, über
              mehrere Seiten, bevor veröffentlicht wird.
            </p>
          </section>

          <section aria-labelledby="warum" className="mt-12">
            <h2 id="warum" className="text-fg text-2xl font-bold">
              Warum wir das so machen
            </h2>
            <p className="text-fg-muted mt-4 leading-relaxed">
              {siteConfig.name} ist ein Bildungsangebot. Wer lernen will, wie Geld
              funktioniert, soll dafür nicht mit seinen Daten bezahlen – und schon gar
              nicht auf einer Website, die an anderer Stelle erklärt, worauf man bei
              Anbietern achten sollte. Verzicht auf Tracking ist hier kein Feature,
              sondern die Voraussetzung dafür, dass der Rest glaubwürdig ist.
            </p>
          </section>
        </div>
      </div>
    </>
  )
}
