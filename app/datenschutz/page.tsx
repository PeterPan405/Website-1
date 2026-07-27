import type { Metadata } from 'next'
import Link from 'next/link'

import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { PageHeader } from '@/components/ui/PageHeader'
import { privacyPolicyDate, provider, supervisoryAuthority } from '@/lib/provider'
import { buildMetadata, withBrand } from '@/lib/seo'
import { siteConfig } from '@/lib/site'

export const metadata: Metadata = buildMetadata({
  title: withBrand('Datenschutzerklärung'),
  description:
    'Welche Daten beim Besuch dieser Website verarbeitet werden, warum es keine Cookies und kein Tracking gibt und welche Rechte Betroffene haben.',
  path: '/datenschutz',
  ogTitle: 'Datenschutzerklärung',
})

export default function PrivacyPage() {
  return (
    <>
      <PageHeader
        area="learn"
        title="Datenschutzerklärung"
        lead="Welche Daten beim Besuch dieser Website anfallen, wo sie verarbeitet werden und welche Rechte du hast."
        breadcrumbs={<Breadcrumbs items={[{ name: 'Datenschutz' }]} />}
      />

      <div className="fk-container py-12 sm:py-16">
        <div className="max-w-3xl">
          <section aria-labelledby="verantwortlicher" className="mt-12">
            <h2 id="verantwortlicher" className="text-fg text-2xl font-bold">
              1. Verantwortlicher
            </h2>
            <p className="text-fg-muted mt-4 leading-relaxed">
              Verantwortlich für die Datenverarbeitung auf dieser Website im Sinne von
              Art. 4 Nr. 7 DSGVO ist:
            </p>
            <address className="text-fg-muted mt-3 leading-relaxed not-italic">
              {provider.name}
              <br />
              {provider.street}
              <br />
              {provider.city}
              <br />
              {provider.country}
              <br />
              <a
                href={`mailto:${siteConfig.contactEmail}`}
                className="hover:text-brand underline"
              >
                {siteConfig.contactEmail}
              </a>
              <br />
              <a
                href={`tel:${siteConfig.contactPhoneLink}`}
                className="hover:text-brand underline"
              >
                {siteConfig.contactPhone}
              </a>
            </address>
            {/*
              Kein Abschnitt zur datenschutzbeauftragten Person: Die Bestellung
              ist nach § 38 BDSG erst ab zwanzig ständig mit der Verarbeitung
              beschäftigten Personen Pflicht. Ein Satz „nicht erforderlich“
              brächte niemandem etwas.
            */}
          </section>

          <section aria-labelledby="ueberblick" className="mt-12">
            <h2 id="ueberblick" className="text-fg text-2xl font-bold">
              2. Überblick: Was diese Website nicht tut
            </h2>
            <p className="text-fg-muted mt-4 leading-relaxed">
              Der Aufbau der Anwendung ist datensparsam. Konkret bedeutet das:
            </p>
            <ul className="text-fg-muted mt-4 space-y-2.5">
              {[
                'Es werden keine Cookies zu Analyse-, Marketing- oder Tracking-Zwecken gesetzt.',
                'Es sind keine Analyse- oder Statistik-Werkzeuge eingebunden.',
                'Es gibt keine Nutzerkonten und keine Anmeldung.',
                'Es sind keine Inhalte Dritter eingebettet – keine Karten, keine Videos, keine Social-Media-Widgets.',
                'Schriftarten werden nicht von einem externen Server geladen (siehe Abschnitt 5).',
                'Eingaben in die Rechner werden nicht an einen Server übertragen (siehe Abschnitt 4).',
              ].map((item) => (
                <li key={item} className="flex gap-3 leading-relaxed">
                  <span
                    aria-hidden="true"
                    className="bg-success mt-2 size-1.5 shrink-0 rounded-full"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="server-logs" className="mt-12">
            <h2 id="server-logs" className="text-fg text-2xl font-bold">
              3. Aufruf der Website und Server-Protokolle
            </h2>
            <p className="text-fg-muted mt-4 leading-relaxed">
              Beim Aufruf dieser Website übermittelt dein Browser technisch notwendige
              Daten an den Server des Hosting-Anbieters. Diese werden in Protokolldateien
              gespeichert und umfassen typischerweise: IP-Adresse, Datum und Uhrzeit des
              Zugriffs, aufgerufene Adresse, übertragene Datenmenge, Browsertyp und
              Betriebssystem sowie die zuvor besuchte Seite.
            </p>
            <p className="text-fg-muted mt-4 leading-relaxed">
              Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO. Das berechtigte Interesse
              liegt im technisch fehlerfreien Betrieb, in der Sicherheit der Systeme und
              in der Abwehr von Angriffen. Die Protokolldaten werden ausschließlich zu
              diesen Zwecken verwendet, nicht mit anderen Daten zusammengeführt und nach
              kurzer Zeit vom Hosting-Anbieter automatisch gelöscht.
            </p>
            <p className="text-fg-muted mt-4 leading-relaxed">
              Die Website wird bei{' '}
              <strong className="text-fg font-semibold">Hostinger</strong> gehostet, der
              damit als Auftragsverarbeiter im Sinne von Art. 28 DSGVO tätig wird. Die
              Speicherdauer der Protokolldateien und die Angaben zum Unternehmen ergeben
              sich aus dessen eigener Datenschutzerklärung.
            </p>
          </section>

          <section aria-labelledby="local-storage" className="mt-12">
            <h2 id="local-storage" className="text-fg text-2xl font-bold">
              4. Speicherung im Browser (localStorage)
            </h2>
            <p className="text-fg-muted mt-4 leading-relaxed">
              Diese Website speichert zwei Dinge im lokalen Speicher deines Browsers.
              Diese Daten verlassen dein Gerät nicht und werden zu keinem Zeitpunkt an
              einen Server übertragen:
            </p>
            <div className="rounded-card border-border mt-5 overflow-x-auto border">
              <table className="w-full min-w-[32rem] border-collapse text-sm">
                <thead className="bg-surface-muted">
                  <tr>
                    {['Schlüssel', 'Inhalt', 'Zweck'].map((head) => (
                      <th
                        key={head}
                        scope="col"
                        className="text-fg-subtle px-4 py-2.5 text-left text-xs font-semibold tracking-wide uppercase"
                      >
                        {head}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-border border-t">
                    <th
                      scope="row"
                      className="text-fg px-4 py-3 text-left font-mono text-xs"
                    >
                      fk-theme
                    </th>
                    <td className="text-fg-muted px-4 py-3">
                      Der Wert <code className="font-mono text-xs">light</code> oder{' '}
                      <code className="font-mono text-xs">dark</code>
                    </td>
                    <td className="text-fg-muted px-4 py-3">
                      Merkt sich die gewählte Farbdarstellung
                    </td>
                  </tr>
                  <tr className="border-border border-t">
                    <th
                      scope="row"
                      className="text-fg px-4 py-3 text-left font-mono text-xs"
                    >
                      fk-learn-progress
                    </th>
                    <td className="text-fg-muted px-4 py-3">
                      Liste der als erledigt markierten Lernstufen
                    </td>
                    <td className="text-fg-muted px-4 py-3">
                      Zeigt den Lernfortschritt ohne Nutzerkonto
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-fg-muted mt-4 leading-relaxed">
              Beide Einträge werden ausschließlich durch dein eigenes Handeln erzeugt –
              durch das Umschalten der Darstellung beziehungsweise das Markieren einer
              Lernstufe. Du kannst sie jederzeit über die Einstellungen deines Browsers
              löschen; der Lernfortschritt lässt sich zusätzlich direkt im{' '}
              <Link href="/lernen" className="text-brand font-semibold underline">
                Lernbereich
              </Link>{' '}
              zurücksetzen.
            </p>
            <p className="text-fg-muted mt-4 leading-relaxed">
              Die Eingaben in die Rechner werden ausschließlich im Arbeitsspeicher des
              Browsers verarbeitet. Sie werden nicht gespeichert und sind nach dem
              Neuladen der Seite verschwunden.
            </p>
          </section>

          <section aria-labelledby="schriften" className="mt-12">
            <h2 id="schriften" className="text-fg text-2xl font-bold">
              5. Schriftarten
            </h2>
            <p className="text-fg-muted mt-4 leading-relaxed">
              Diese Website verwendet die Schriftarten Inter und Sora. Sie werden nicht
              zur Laufzeit von einem externen Anbieter geladen, sondern bereits bei der
              Erstellung der Website heruntergeladen und vom eigenen Server ausgeliefert.
              Beim Besuch entsteht dadurch{' '}
              <strong className="text-fg font-semibold">
                keine Verbindung zu Google
              </strong>{' '}
              und es wird keine IP-Adresse an Dritte übermittelt.
            </p>
          </section>

          <section aria-labelledby="externe-daten" className="mt-12">
            <h2 id="externe-daten" className="text-fg text-2xl font-bold">
              6. Marktdaten und Nachrichten
            </h2>
            <p className="text-fg-muted mt-4 leading-relaxed">
              Kurse und Nachrichten stammen aus externen Quellen, werden aber nicht beim
              Aufruf der Seite geholt: Sie werden vorab abgerufen und fest in die
              ausgelieferten Seiten eingebaut. Beim Besuch dieser Website findet deshalb{' '}
              <strong className="text-fg font-semibold">kein Abruf bei Dritten</strong>{' '}
              statt – weder durch den Server noch durch deinen Browser. Es werden dabei
              keine Daten über dich an die Quellen übermittelt, und diese erfahren nicht,
              dass du diese Website aufgerufen hast.
            </p>
            <p className="text-fg-muted mt-4 leading-relaxed">
              Etwas anderes gilt erst, wenn du einen der angegebenen Quellenverweise
              anklickst. Dann rufst du die fremde Seite unmittelbar auf, und es gelten
              deren Datenschutzbestimmungen.
            </p>
          </section>

          <section aria-labelledby="kontaktaufnahme" className="mt-12">
            <h2 id="kontaktaufnahme" className="text-fg text-2xl font-bold">
              7. Kontaktaufnahme per E-Mail
            </h2>
            <p className="text-fg-muted mt-4 leading-relaxed">
              Wenn du uns per E-Mail schreibst, verarbeiten wir die übermittelten Daten
              ausschließlich zur Bearbeitung deiner Anfrage. Rechtsgrundlage ist Art. 6
              Abs. 1 lit. f DSGVO beziehungsweise – bei vertragsbezogenen Anfragen – Art.
              6 Abs. 1 lit. b DSGVO. Die Daten werden gelöscht, sobald die Anfrage
              abgeschlossen ist und keine gesetzlichen Aufbewahrungspflichten
              entgegenstehen.
            </p>
          </section>

          <section aria-labelledby="rechte" className="mt-12">
            <h2 id="rechte" className="text-fg text-2xl font-bold">
              8. Deine Rechte
            </h2>
            <p className="text-fg-muted mt-4 leading-relaxed">
              Dir stehen gegenüber dem Verantwortlichen die folgenden Rechte zu:
            </p>
            <ul className="text-fg-muted mt-4 space-y-2.5">
              {[
                ['Auskunft', 'Art. 15 DSGVO – welche Daten über dich verarbeitet werden'],
                ['Berichtigung', 'Art. 16 DSGVO – Korrektur unrichtiger Daten'],
                ['Löschung', 'Art. 17 DSGVO – Entfernung deiner Daten'],
                ['Einschränkung der Verarbeitung', 'Art. 18 DSGVO'],
                ['Datenübertragbarkeit', 'Art. 20 DSGVO'],
                [
                  'Widerspruch',
                  'Art. 21 DSGVO – gegen Verarbeitungen auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO',
                ],
              ].map(([right, basis]) => (
                <li key={right} className="flex gap-3 leading-relaxed">
                  <span
                    aria-hidden="true"
                    className="bg-brand mt-2 size-1.5 shrink-0 rounded-full"
                  />
                  <span>
                    <strong className="text-fg font-semibold">Recht auf {right}</strong> (
                    {basis})
                  </span>
                </li>
              ))}
            </ul>
            <p className="text-fg-muted mt-5 leading-relaxed">
              Außerdem hast du das Recht, sich bei einer Datenschutz-Aufsichtsbehörde über
              die Verarbeitung deiner personenbezogenen Daten zu beschweren (Art. 77
              DSGVO). Zuständig ist die Behörde des Bundeslandes, in dem der
              Verantwortliche seinen Sitz hat – hier{' '}
              <a
                href={supervisoryAuthority.url}
                target="_blank"
                rel="noreferrer"
                className="text-brand font-semibold underline"
              >
                {supervisoryAuthority.name}
              </a>{' '}
              mit Sitz in {supervisoryAuthority.seat}.
            </p>
          </section>

          <section aria-labelledby="aenderungen" className="mt-12">
            <h2 id="aenderungen" className="text-fg text-2xl font-bold">
              9. Änderungen dieser Erklärung
            </h2>
            <p className="text-fg-muted mt-4 leading-relaxed">
              Diese Datenschutzerklärung wird angepasst, sobald sich die Verarbeitung
              ändert – etwa durch neue Funktionen oder eingebundene Dienste. Stand dieser
              Fassung: {privacyPolicyDate}.
            </p>
          </section>
        </div>
      </div>
    </>
  )
}
