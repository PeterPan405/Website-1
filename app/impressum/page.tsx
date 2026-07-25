import type { Metadata } from 'next'

import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Callout } from '@/components/ui/Callout'
import { PageHeader } from '@/components/ui/PageHeader'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Impressum und Anbieterkennzeichnung | Finanzkompass',
  description:
    'Anbieterkennzeichnung nach § 5 Digitale-Dienste-Gesetz sowie Angaben zur inhaltlichen Verantwortung und Haftung für Inhalte und Links.',
  path: '/impressum',
  // Rechtliche Pflichtseiten brauchen keine Social-Vorschau.
  ogTitle: 'Impressum',
})

/**
 * Platzhalter-Impressum.
 *
 * Die Struktur folgt den üblichen Pflichtangaben für deutsche Websites. Alle
 * konkreten Angaben sind bewusst als Platzhalter markiert – sie müssen vor der
 * Veröffentlichung durch echte Daten ersetzt und geprüft werden.
 */
const PLACEHOLDER = '[BITTE ERSETZEN]'

export default function ImprintPage() {
  return (
    <>
      <PageHeader
        area="learn"
        eyebrow="Rechtliches"
        eyebrowIcon="info"
        title="Impressum"
        lead="Anbieterkennzeichnung und Angaben zur inhaltlichen Verantwortung."
        breadcrumbs={<Breadcrumbs items={[{ name: 'Impressum' }]} />}
      />

      <div className="fk-container py-12 sm:py-16">
        <div className="max-w-3xl">
          <Callout
            variant="warning"
            title="Platzhaltertext – vor Veröffentlichung ersetzen"
          >
            <p>
              Diese Seite enthält{' '}
              <strong className="text-fg font-semibold">keine echten Angaben</strong>.
              Alle mit <code className="font-mono text-xs">{PLACEHOLDER}</code>{' '}
              gekennzeichneten Felder müssen durch die tatsächlichen Daten des Anbieters
              ersetzt werden.
            </p>
            <p>
              Ein fehlendes oder unvollständiges Impressum ist abmahnfähig. Bei
              Finanzinhalten kommen je nach Ausgestaltung zusätzliche Anforderungen in
              Betracht – etwa aus dem Wertpapierhandelsrecht, wenn Inhalte als
              Anlageempfehlung gelten könnten. Eine anwaltliche Prüfung vor dem Live-Gang
              ist dringend zu empfehlen.
            </p>
          </Callout>

          <section aria-labelledby="anbieter" className="mt-12">
            <h2 id="anbieter" className="text-fg text-2xl font-bold">
              Angaben gemäß § 5 Digitale-Dienste-Gesetz (DDG)
            </h2>
            <dl className="mt-5 space-y-4">
              {[
                { label: 'Anbieter', value: `${PLACEHOLDER} (Name oder Firma)` },
                {
                  label: 'Rechtsform',
                  value: `${PLACEHOLDER} (z. B. Einzelunternehmen, GmbH, UG)`,
                },
                { label: 'Straße und Hausnummer', value: PLACEHOLDER },
                { label: 'Postleitzahl und Ort', value: PLACEHOLDER },
                { label: 'Land', value: 'Deutschland' },
                {
                  label: 'Vertreten durch',
                  value: `${PLACEHOLDER} (bei Gesellschaften: vertretungsberechtigte Person)`,
                },
              ].map((row) => (
                <div
                  key={row.label}
                  className="border-border grid gap-1 border-b pb-4 sm:grid-cols-[14rem_minmax(0,1fr)]"
                >
                  <dt className="text-fg text-sm font-semibold">{row.label}</dt>
                  <dd className="text-fg-muted text-sm">{row.value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section aria-labelledby="kontaktangaben" className="mt-12">
            <h2 id="kontaktangaben" className="text-fg text-2xl font-bold">
              Kontakt
            </h2>
            <dl className="mt-5 space-y-4">
              {[
                { label: 'Telefon', value: `${PLACEHOLDER} (optional, aber empfohlen)` },
                {
                  label: 'E-Mail',
                  value: `${PLACEHOLDER} (erreichbare Adresse, Pflichtangabe)`,
                },
              ].map((row) => (
                <div
                  key={row.label}
                  className="border-border grid gap-1 border-b pb-4 sm:grid-cols-[14rem_minmax(0,1fr)]"
                >
                  <dt className="text-fg text-sm font-semibold">{row.label}</dt>
                  <dd className="text-fg-muted text-sm">{row.value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section aria-labelledby="register" className="mt-12">
            <h2 id="register" className="text-fg text-2xl font-bold">
              Register und Steuern
            </h2>
            <p className="text-fg-muted mt-3 text-sm leading-relaxed">
              Nur anzugeben, soweit vorhanden beziehungsweise einschlägig.
            </p>
            <dl className="mt-5 space-y-4">
              {[
                { label: 'Registergericht', value: PLACEHOLDER },
                { label: 'Registernummer', value: PLACEHOLDER },
                {
                  label: 'Umsatzsteuer-Identifikationsnummer',
                  value: `${PLACEHOLDER} (gemäß § 27 a UStG)`,
                },
                {
                  label: 'Aufsichtsbehörde',
                  value: `${PLACEHOLDER} (nur bei erlaubnispflichtiger Tätigkeit)`,
                },
              ].map((row) => (
                <div
                  key={row.label}
                  className="border-border grid gap-1 border-b pb-4 sm:grid-cols-[14rem_minmax(0,1fr)]"
                >
                  <dt className="text-fg text-sm font-semibold">{row.label}</dt>
                  <dd className="text-fg-muted text-sm">{row.value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section aria-labelledby="verantwortlich" className="mt-12">
            <h2 id="verantwortlich" className="text-fg text-2xl font-bold">
              Redaktionell verantwortlich
            </h2>
            <p className="text-fg-muted mt-4 leading-relaxed">
              Verantwortlich für journalistisch-redaktionelle Inhalte im Sinne von § 18
              Abs. 2 Medienstaatsvertrag: {PLACEHOLDER} (Name und vollständige Anschrift,
              auch wenn sie mit den Anbieterangaben übereinstimmt).
            </p>
          </section>

          <section aria-labelledby="streitschlichtung" className="mt-12">
            <h2 id="streitschlichtung" className="text-fg text-2xl font-bold">
              Streitschlichtung
            </h2>
            <p className="text-fg-muted mt-4 leading-relaxed">
              {PLACEHOLDER} – hier ist anzugeben, ob eine Teilnahme an einem
              Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle besteht.
              Falls nicht: eine entsprechende Erklärung, dass keine Teilnahmebereitschaft
              besteht.
            </p>
          </section>

          <section aria-labelledby="haftung" className="mt-12">
            <h2 id="haftung" className="text-fg text-2xl font-bold">
              Haftung für Inhalte und Links
            </h2>
            <p className="text-fg-muted mt-4 leading-relaxed">
              Die Inhalte dieser Website werden mit Sorgfalt erstellt. Für die
              Richtigkeit, Vollständigkeit und Aktualität kann jedoch keine Gewähr
              übernommen werden. Als Diensteanbieter sind wir für eigene Inhalte
              verantwortlich, jedoch nicht verpflichtet, übermittelte oder gespeicherte
              fremde Informationen zu überwachen.
            </p>
            <p className="text-fg-muted mt-4 leading-relaxed">
              Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte
              wir keinen Einfluss haben. Für diese fremden Inhalte kann keine Gewähr
              übernommen werden. Zum Zeitpunkt der Verlinkung waren keine rechtswidrigen
              Inhalte erkennbar. Bei Bekanntwerden von Rechtsverstößen werden
              entsprechende Links unverzüglich entfernt.
            </p>
          </section>

          <section aria-labelledby="urheberrecht" className="mt-12">
            <h2 id="urheberrecht" className="text-fg text-2xl font-bold">
              Urheberrecht
            </h2>
            <p className="text-fg-muted mt-4 leading-relaxed">
              Die auf dieser Website erstellten Inhalte und Werke unterliegen dem
              deutschen Urheberrecht. Vervielfältigung, Bearbeitung, Verbreitung und jede
              Art der Verwertung außerhalb der Grenzen des Urheberrechts bedürfen der
              schriftlichen Zustimmung des jeweiligen Rechteinhabers.
            </p>
          </section>

          <section aria-labelledby="kein-rat" className="mt-12">
            <h2 id="kein-rat" className="text-fg text-2xl font-bold">
              Hinweis zu Finanzinhalten
            </h2>
            <p className="text-fg-muted mt-4 leading-relaxed">
              Alle Inhalte dieser Website dienen ausschließlich der allgemeinen
              Information und Bildung. Sie stellen keine Anlageberatung, Anlageempfehlung,
              Steuer- oder Rechtsberatung dar und berücksichtigen die persönlichen
              Verhältnisse einzelner Leserinnen und Leser nicht. Jede Kapitalanlage ist
              mit Risiken verbunden, bis zum vollständigen Verlust des eingesetzten
              Kapitals.
            </p>
            <p className="text-fg-muted mt-4 leading-relaxed">
              Die auf dieser Website gezeigten Kurse, Nachrichten und Verschuldungsdaten
              sind in der aktuellen Fassung{' '}
              <strong className="text-fg font-semibold">Beispieldaten</strong> und keine
              echten Marktinformationen.
            </p>
          </section>
        </div>
      </div>
    </>
  )
}
