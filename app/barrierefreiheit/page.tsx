import type { Metadata } from 'next'
import Link from 'next/link'

import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { PageHeader } from '@/components/ui/PageHeader'
import { buildMetadata, withBrand } from '@/lib/seo'
import { siteConfig } from '@/lib/site'

/**
 * Die Erklärung zur Barrierefreiheit.
 *
 * ## Warum es diese Seite gibt
 *
 * Seit dem Barrierefreiheitsstärkungsgesetz (Juni 2025) ist eine solche
 * Erklärung für viele Angebote Pflicht – und unabhängig von der Pflicht ist
 * sie hier vor allem eines: längst verdient. Die Prüfwerkzeuge existieren
 * seit Monaten (Kontrast der tatsächlichen Farbpaarungen, Tastaturbedienung,
 * Vorlese-Kennzeichnung der Grafiken, Alternativtexte im Paketprüfer), nur
 * die Seite, die davon erzählt, fehlte.
 *
 * ## Der Grundsatz beim Schreiben
 *
 * Nur behaupten, was ein Prüfskript deckt oder was sich am Bau nachweisen
 * lässt. Eine Erklärung, die „vollständig barrierefrei“ verspricht, ist bei
 * einer Website mit tausend Seiten und täglichen Datenläufen nicht zu halten
 * – ehrlicher ist der Stand samt Meldeweg für das, was trotzdem hakt.
 */

export const metadata: Metadata = buildMetadata({
  title: withBrand('Erklärung zur Barrierefreiheit'),
  description:
    'Wie diese Website auf Barrierefreiheit geprüft wird – Kontraste, Tastaturbedienung, Vorlesbarkeit –, wo die Grenzen liegen und wie sich Barrieren melden lassen.',
  path: '/barrierefreiheit',
  ogTitle: 'Erklärung zur Barrierefreiheit',
})

export default function BarrierefreiheitPage() {
  return (
    <>
      <PageHeader
        area="learn"
        title="Erklärung zur Barrierefreiheit"
        lead="Was diese Website für Zugänglichkeit tut, wie das laufend geprüft wird, wo die Grenzen liegen – und wohin du dich wendest, wenn etwas nicht bedienbar ist."
        breadcrumbs={<Breadcrumbs items={[{ name: 'Barrierefreiheit' }]} />}
      />

      <div className="fk-container py-12 sm:py-16">
        <div className="max-w-3xl">
          <section aria-labelledby="anspruch" className="mt-4">
            <h2 id="anspruch" className="text-fg text-2xl font-bold">
              Der Anspruch
            </h2>
            <p className="text-fg-muted mt-4 leading-relaxed">
              {siteConfig.name} soll für alle bedienbar sein – mit Tastatur, mit
              Vorleseprogramm, mit schwachem Sehvermögen, auf kleinen Bildschirmen.
              Maßstab sind die Web Content Accessibility Guidelines (WCAG) 2.1 auf der
              Stufe AA. Diese Erklärung beschreibt den Stand ehrlich: was geprüft wird,
              was davon automatisch geschieht und was noch offen ist.
            </p>
          </section>

          <section aria-labelledby="geprueft" className="mt-12">
            <h2 id="geprueft" className="text-fg text-2xl font-bold">
              Was laufend geprüft wird
            </h2>
            <p className="text-fg-muted mt-4 leading-relaxed">
              Barrierefreiheit ist hier keine einmalige Abnahme, sondern Teil der
              Prüfkette, die vor jeder Veröffentlichung läuft. Im Einzelnen:
            </p>
            <ul className="text-fg-muted mt-4 list-disc space-y-3 pl-5 leading-relaxed">
              <li>
                <strong className="text-fg">Kontraste:</strong> Ein Prüfskript misst die
                tatsächlich verwendeten Farbpaarungen aus Text und Hintergrund in beiden
                Farbschemata gegen die AA-Grenzwerte – nicht eine Farbliste auf dem
                Papier, sondern die gebauten Seiten.
              </li>
              <li>
                <strong className="text-fg">Tastaturbedienung:</strong> Ein Skript bedient
                die wichtigsten Seiten ausschließlich per Tastatur und prüft, dass alles
                Interaktive erreichbar ist und der Fokus sichtbar bleibt.
              </li>
              <li>
                <strong className="text-fg">Alternativtexte:</strong> Der Paketprüfer
                weist jeden Bau zurück, in dem ein Bild ohne Alternativtext steht.
              </li>
              <li>
                <strong className="text-fg">Vorlesbarkeit:</strong> Diagramme und
                Erklärgrafiken tragen Beschreibungen für Vorleseprogramme; rein dekorative
                Elemente sind als solche gekennzeichnet. Auszeichnungen, die nur farblich
                sichtbar wären – etwa „liegt vorn“ in Vergleichstabellen – haben einen
                mitlesbaren Text.
              </li>
              <li>
                <strong className="text-fg">Überschriftenstruktur:</strong> Der
                Paketprüfer kontrolliert die Hierarchie der Überschriften auf allen
                Seiten.
              </li>
              <li>
                <strong className="text-fg">Schriftgrößen und Zoom:</strong> Die Seiten
                verwenden relative Einheiten und funktionieren bei Textvergrößerung; ein
                Breitenprüfer stellt sicher, dass sich keine Seite auf dem Telefon
                seitlich schieben lässt oder herausgezoomt wird.
              </li>
              <li>
                <strong className="text-fg">Bewegung:</strong> Einblendanimationen
                respektieren die Systemeinstellung für reduzierte Bewegung.
              </li>
            </ul>
          </section>

          <section aria-labelledby="grenzen" className="mt-12">
            <h2 id="grenzen" className="text-fg text-2xl font-bold">
              Bekannte Grenzen
            </h2>
            <ul className="text-fg-muted mt-4 list-disc space-y-3 pl-5 leading-relaxed">
              <li>
                <strong className="text-fg">Diagramme:</strong> Kursverläufe und
                interaktive Grafiken sind visuelle Werkzeuge. Die zugrunde liegenden
                Zahlen stehen als Text, Tabelle oder CSV-Download bereit, die Kurven
                selbst sind aber nicht Punkt für Punkt vorlesbar.
              </li>
              <li>
                <strong className="text-fg">Der Globus:</strong> Die drehbare Weltkarte
                ist mit dem Zeiger gebaut. Ihre Daten gibt es vollständig als
                Ländertabelle auf derselben Seite.
              </li>
              <li>
                <strong className="text-fg">Podcast:</strong> Die Folgen liegen bisher nur
                als Ton vor; Transkripte fehlen, solange keine verlässliche Quelle dafür
                bereitsteht.
              </li>
              <li>
                <strong className="text-fg">Automatisch prüfen hat Grenzen:</strong> Die
                Skripte fangen messbare Fehler. Ob eine Erklärung wirklich verständlich
                ist, kann nur ein Mensch beurteilen – deshalb der Meldeweg unten.
              </li>
            </ul>
          </section>

          <section aria-labelledby="melden" className="mt-12">
            <h2 id="melden" className="text-fg text-2xl font-bold">
              Barriere gefunden?
            </h2>
            <p className="text-fg-muted mt-4 leading-relaxed">
              Wenn etwas mit deiner Technik nicht bedienbar ist – ein Element, das die
              Tastatur nicht erreicht, ein Diagramm ohne verständliche Beschreibung, zu
              wenig Kontrast –, schreib an{' '}
              <a
                href={`mailto:${siteConfig.contactEmail}?subject=${encodeURIComponent('Barriere auf der Website')}`}
                className="hover:text-brand underline"
              >
                {siteConfig.contactEmail}
              </a>
              . Hilfreich sind die Adresse der Seite und das verwendete Hilfsmittel.
              Gemeldete Barrieren werden wie inhaltliche Fehler behandelt: beheben, nicht
              wegerklären.
            </p>
            <p className="text-fg-muted mt-4 leading-relaxed">
              Diese Erklärung wird gepflegt wie der Rest der Website – ändert sich der
              Stand, ändert sie sich mit. Verwandte Seiten:{' '}
              <Link href="/datenschutz" className="hover:text-brand underline">
                Datenschutz
              </Link>{' '}
              und{' '}
              <Link href="/impressum" className="hover:text-brand underline">
                Impressum
              </Link>
              .
            </p>
          </section>
        </div>
      </div>
    </>
  )
}
