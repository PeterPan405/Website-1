import type { Metadata } from 'next'

import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { PageHeader } from '@/components/ui/PageHeader'
import { provider } from '@/lib/provider'
import { buildMetadata, withBrand } from '@/lib/seo'
import { siteConfig } from '@/lib/site'

export const metadata: Metadata = buildMetadata({
  title: withBrand('Impressum und Anbieterkennzeichnung'),
  description:
    'Anbieterkennzeichnung nach § 5 Digitale-Dienste-Gesetz sowie Angaben zur inhaltlichen Verantwortung und Haftung für Inhalte und Links.',
  path: '/impressum',
  // Rechtliche Pflichtseiten brauchen keine Social-Vorschau.
  ogTitle: 'Impressum',
})

export default function ImprintPage() {
  return (
    <>
      <PageHeader
        area="learn"
        title="Impressum"
        lead="Anbieterkennzeichnung und Angaben zur inhaltlichen Verantwortung."
        breadcrumbs={<Breadcrumbs items={[{ name: 'Impressum' }]} />}
      />

      <div className="fk-container py-12 sm:py-16">
        <div className="max-w-3xl">
          {/*
            Die Anschrift steht am Seitenende, nicht am Anfang. § 5 DDG
            verlangt die Angaben leicht erkennbar auf der Impressumsseite –
            eine Reihenfolge innerhalb der Seite schreibt er nicht vor. Wer
            nur kurz hineinklickt, sieht so nicht als Erstes die
            Privatadresse; wer sie sucht, findet sie unter ihrer eigenen
            Überschrift. Nicht wieder nach oben ziehen.
          */}
          <section aria-labelledby="haftung">
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
            {/*
              Derselbe Absatz wie in der Fußzeile, und das mit Absicht: Ein
              Impressum, das weniger sagt als der Kasten auf jeder Seite, wäre die
              schwächere von zwei Fassungen – und im Zweifel wird die schwächere
              gelesen. Die Fassungen müssen deshalb zusammen gepflegt werden.
            */}
            <p className="text-fg-muted mt-4 leading-relaxed">
              Steuerliche Erläuterungen, Beispielrechnungen und die Ergebnisse der Rechner
              sind allgemeine und unverbindliche Information. Sie stellen{' '}
              <strong className="text-fg font-semibold">
                keine geschäftsmäßige Hilfeleistung in Steuersachen
              </strong>{' '}
              im Sinne des Steuerberatungsgesetzes dar und ersetzen nicht die Beratung
              durch eine Steuerberaterin, einen Steuerberater oder eine andere zur
              Hilfeleistung in Steuersachen befugte Person. Wie ein Sachverhalt
              tatsächlich besteuert wird, hängt von den persönlichen Verhältnissen ab und
              kann sich durch Gesetzgebung und Rechtsprechung ändern, unter Umständen auch
              rückwirkend. Verbindliche Auskunft erteilen allein das zuständige Finanzamt
              und die Angehörigen der steuerberatenden Berufe. Für Entscheidungen, die auf
              steuerliche Angaben dieser Website gestützt werden, wird keine Haftung
              übernommen.
            </p>
            <p className="text-fg-muted mt-4 leading-relaxed">
              Kurse werden als Tagesschlusskurse und zuletzt gehandelte Preise dargestellt
              und sind{' '}
              <strong className="text-fg font-semibold">keine Echtzeitdaten</strong>. Sie
              können von den Angaben anderer Anbieter abweichen und sind nicht für
              Handelszwecke bestimmt. Die Verschuldungszahlen sind Näherungswerte und
              keine amtliche Statistik. Für Aktualität, Richtigkeit und Vollständigkeit
              wird keine Gewähr übernommen; Herkunft und Stand stehen jeweils direkt an
              der Angabe.
            </p>
          </section>

          {/*
            Transparenz nach Art. 50 Abs. 4 der KI-Verordnung (EU) 2024/1689,
            anwendbar seit dem 2. August 2026. Die Kennzeichnungspflicht für
            KI-erzeugte Texte von öffentlichem Interesse entfällt zwar, wenn
            ein Mensch die Inhalte prüft und eine benannte Person die
            redaktionelle Verantwortung trägt – genau so arbeitet diese
            Website. Der Abschnitt sagt beides trotzdem ausdrücklich: den
            KI-Einsatz und die Prüfung. So hängt nichts an der Auslegung der
            Ausnahme, und der Leser erfährt, wie die Inhalte entstehen.
          */}
          <section aria-labelledby="ki-einsatz" className="mt-12">
            <h2 id="ki-einsatz" className="text-fg text-2xl font-bold">
              Einsatz künstlicher Intelligenz
            </h2>
            <p className="text-fg-muted mt-4 leading-relaxed">
              Texte und Erklärgrafiken dieser Website entstehen mit Unterstützung von
              künstlicher Intelligenz. Jeder Inhalt wird vor der Veröffentlichung von
              einem Menschen inhaltlich geprüft und freigegeben; die redaktionelle
              Verantwortung trägt die unter „Redaktionell verantwortlich“ genannte Person.
              Dieser Hinweis erfolgt mit Blick auf die Transparenzpflichten der Verordnung
              (EU) 2024/1689 (KI-Verordnung, Art. 50).
            </p>
            <p className="text-fg-muted mt-4 leading-relaxed">
              Kurse, Kennzahlen und Wirtschaftsdaten werden nicht von einer KI erzeugt,
              sondern stammen unverändert aus den jeweils an der Angabe genannten Quellen.
              Die Rechner arbeiten mit festen, auf der jeweiligen Seite offengelegten
              Formeln. Beim Besuch der Website selbst läuft keine künstliche Intelligenz:
              Es gibt keinen Chatbot, und es findet keine automatisierte
              Entscheidungsfindung über Besucherinnen und Besucher statt.
            </p>
          </section>

          <section aria-labelledby="anbieter" className="mt-12">
            <h2 id="anbieter" className="text-fg text-2xl font-bold">
              Angaben gemäß § 5 Digitale-Dienste-Gesetz (DDG)
            </h2>
            <dl className="mt-5 space-y-4">
              {[
                /*
                  Nur ausgefüllte Felder. Rechtsform und Vertretung fehlen
                  bewusst: Beide betreffen Gesellschaften. Für eine natürliche
                  Person verlangt § 5 DDG Name, Anschrift und schnelle
                  elektronische Kontaktmöglichkeit – und die stehen hier.

                  Eine leere Zeile mit Platzhalter wäre schlechter als keine
                  Zeile: Sie sieht aus wie eine vergessene Pflichtangabe.
                */
                { label: 'Anbieter', value: provider.name },
                { label: 'Straße und Hausnummer', value: provider.street },
                { label: 'Postleitzahl und Ort', value: provider.city },
                { label: 'Land', value: 'Deutschland' },
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
                // Aus siteConfig – dieselbe Quelle wie die Kontaktseite und die
                // strukturierten Daten. Eine Änderung dort wirkt hier mit.
                { label: 'Telefon', value: siteConfig.contactPhone },
                { label: 'E-Mail', value: siteConfig.contactEmail },
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

          {/*
            Der Abschnitt „Register und Steuern“ ist entfallen. Registergericht
            und Registernummer betreffen eingetragene Gesellschaften, eine
            Aufsichtsbehörde nur erlaubnispflichtige Tätigkeiten. Die
            Umsatzsteuer-Identifikationsnummer ist nur anzugeben, wenn eine
            vorhanden ist. Der Abschnitt kommt zurück, sobald eine dieser
            Angaben tatsächlich zutrifft.
          */}

          <section aria-labelledby="verantwortlich" className="mt-12">
            <h2 id="verantwortlich" className="text-fg text-2xl font-bold">
              Redaktionell verantwortlich
            </h2>
            {/*
              Die Anschrift steht hier ein zweites Mal, obwohl sie mit der des
              Anbieters übereinstimmt. § 18 Abs. 2 Medienstaatsvertrag verlangt
              die vollständige Angabe an dieser Stelle – ein Verweis nach oben
              genügt nicht.
            */}
            <p className="text-fg-muted mt-4 leading-relaxed">
              Verantwortlich für journalistisch-redaktionelle Inhalte im Sinne von § 18
              Abs. 2 Medienstaatsvertrag:
            </p>
            <address className="text-fg-muted mt-3 leading-relaxed not-italic">
              {provider.name}
              <br />
              {provider.street}
              <br />
              {provider.city}
            </address>
          </section>

          {/*
            Der Abschnitt „Streitschlichtung“ ist entfallen. Hier gehört eine
            Erklärung hin, ob eine Teilnahme an einem Streitbeilegungsverfahren
            vor einer Verbraucherschlichtungsstelle besteht. Das ist eine
            rechtliche Aussage über die Bereitschaft des Anbieters – die kann
            nur dieser selbst treffen, sie lässt sich nicht sinnvoll vorformulieren.
            Nach § 36 VSBG trifft die Hinweispflicht ohnehin erst Unternehmen mit
            mehr als zehn Beschäftigten.
          */}
        </div>
      </div>
    </>
  )
}
