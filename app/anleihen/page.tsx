import type { Metadata } from 'next'
import Link from 'next/link'

import { Anleihenrechner } from '@/components/anleihen/Anleihenrechner'
import { JsonLd } from '@/components/seo/JsonLd'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Callout } from '@/components/ui/Callout'
import { PageHeader } from '@/components/ui/PageHeader'
import { Stat, StatGrid } from '@/components/ui/Stat'
import { kurs, zinsschock } from '@/lib/anleihen'
import { formatDateShort, formatNumber, formatPercentSigned } from '@/lib/format'
import { howToSchema, webApplicationSchema } from '@/lib/jsonld'
import { buildMetadata, withBrand } from '@/lib/seo'
import { getZinsreihe, zinsenStand } from '@/lib/zinsen'

export const metadata: Metadata = buildMetadata({
  title: withBrand('Anleihen: warum der Kurs fällt, wenn der Zins steigt'),
  description:
    'Der gegenläufige Zusammenhang zwischen Marktzins und Anleihekurs – mit Rechner für Duration und Konvexität und dem tatsächlichen EZB-Leitzins als Beleg.',
  path: '/anleihen',
  ogTitle: 'Anleihen: Zins hoch, Kurs runter',
})

/**
 * Der Anleihebereich.
 *
 * ## Warum eine eigene Seite und nicht nur ein Lernthema
 *
 * Weil es die Lernthemen `staatsanleihe` und `schuldverschreibung` längst gibt
 * und sie den Stoff erklären. Was fehlte, war der **Regler**: Der
 * Zusammenhang zwischen Marktzins und Kurs ist gegenläufig, und gegenläufige
 * Zusammenhänge glaubt niemand vom Lesen. Wer die Restlaufzeit von drei auf
 * dreißig Jahre schiebt und zusieht, wie aus zwei Prozent Kursverlust zwanzig
 * werden, hat es begriffen.
 *
 * `lib/anleihen.ts` stand seit Langem gebaut und geprüft im Repository und
 * wurde an genau zwei Stellen benutzt – für zwei Zeichnungen in Lernstufen.
 * Diese Seite ist der Ort, an dem die Rechnung selbst bedienbar wird.
 *
 * ## Warum der Leitzins danebensteht
 *
 * Weil der Rechner sonst eine Behauptung über etwas Ausgedachtes wäre. Die
 * EZB hat ihren Hauptrefinanzierungssatz im vergangenen Jahr bewegt; was das
 * mit einer laufenden Anleihe gemacht hat, steht damit nicht als Beispiel da,
 * sondern als Rechnung an einer Zahl, die jeder nachschlagen kann.
 *
 * Solange kein Abruf lief, ist die Reihe leer. Dann entfällt der Abschnitt –
 * eine fehlende Zahl ist ein Zustand, kein Fehler.
 */

/** Die Beispielanleihe des Belegabschnitts: zehn Jahre, zwei Prozent Kupon. */
const BEISPIEL = { kuponProzent: 2, jahre: 10 }

export default function AnleihenSeite() {
  const leitzins = getZinsreihe('leitzins')

  /*
    Der Beleg entsteht aus zwei tatsächlichen Ständen der EZB-Reihe: heute und
    vor einem Jahr. Gerechnet wird, was diese Bewegung mit einer laufenden
    Anleihe gemacht hätte – nicht, was sie mit irgendeiner gemacht hat.

    Der Unterschied ist wichtig genug, um ihn auf der Seite zu nennen: Der
    Leitzins ist nicht der Zins, zu dem eine zehnjährige Anleihe bewertet wird.
    Er bewegt das kurze Ende der Zinskurve, das lange folgt ihm nur teilweise.
  */
  const beleg =
    leitzins?.aktuell && leitzins.vorEinemJahr
      ? {
          von: leitzins.vorEinemJahr,
          bis: leitzins.aktuell,
          aenderung: leitzins.aktuell.wert - leitzins.vorEinemJahr.wert,
          schock: zinsschock(
            BEISPIEL,
            leitzins.vorEinemJahr.wert,
            leitzins.aktuell.wert - leitzins.vorEinemJahr.wert
          ),
        }
      : null

  return (
    <>
      <PageHeader
        area="markets"
        eyebrow="Anleihen"
        eyebrowIcon="scale"
        title="Warum der Kurs fällt, wenn der Zins steigt"
        lead="Der Zins steigt – eine gute Nachricht. Und der Anleihefonds im Depot verliert. Beides gehört zusammen, und wer nur den zweiten Teil sieht, hält den Fonds für schlecht gemanagt."
        breadcrumbs={<Breadcrumbs items={[{ name: 'Anleihen' }]} />}
      />

      <div className="fk-container py-12 sm:py-16">
        <div className="max-w-3xl">
          <h2 className="text-fg text-2xl font-bold">
            Der Kupon steht fest, der Kurs nicht
          </h2>
          <p className="text-fg-muted mt-4 leading-relaxed">
            Eine Anleihe verspricht bei der Ausgabe einen festen jährlichen Zins auf den
            Nennwert – den <strong className="text-fg font-semibold">Kupon</strong>. Er
            ändert sich nie wieder. Wer eine Anleihe mit zwei Prozent Kupon hält und am
            Markt gibt es plötzlich neue Anleihen mit drei Prozent, hat ein Papier, das
            niemand mehr zum vollen Preis haben will.
          </p>
          <p className="text-fg-muted mt-4 leading-relaxed">
            Verhandelt wird deshalb nicht der Zins, sondern der{' '}
            <strong className="text-fg font-semibold">Preis</strong>. Er fällt so weit,
            dass ein Käufer über Kupons und Rückzahlung am Ende auf dieselben drei Prozent
            kommt. Genau das ist der ganze Mechanismus – und er läuft zwangsläufig
            gegenläufig zum Zins.
          </p>
          <p className="text-fg-muted mt-4 leading-relaxed">
            Wie stark der Kurs fällt, hängt fast ausschließlich an der{' '}
            <strong className="text-fg font-semibold">Restlaufzeit</strong>. Bei einer
            Anleihe, die in zwei Jahren zurückgezahlt wird, ist der Nachteil zweimal zu
            ertragen; bei einer mit dreißig Jahren dreißigmal. Deshalb schwanken lange
            Anleihen wie Aktien, und deshalb ist „sicher wie eine Anleihe“ ein Satz, der
            nur für die Rückzahlung gilt und nicht für den Kurs unterwegs.
          </p>
        </div>

        <div className="mt-12">
          <Anleihenrechner />
        </div>

        {beleg && leitzins && (
          <section aria-labelledby="beleg" className="mt-16 max-w-3xl">
            <h2 id="beleg" className="text-fg text-2xl font-bold">
              Das ist nicht ausgedacht
            </h2>
            <p className="text-fg-muted mt-4 leading-relaxed">
              Der Leitzins der Europäischen Zentralbank stand am{' '}
              {formatDateShort(beleg.von.t)} bei {formatNumber(beleg.von.wert, 2)} Prozent
              und am {formatDateShort(beleg.bis.t)} bei {formatNumber(beleg.bis.wert, 2)}{' '}
              Prozent – eine Bewegung um {formatNumber(Math.abs(beleg.aenderung), 2)}{' '}
              Prozentpunkte
              {beleg.aenderung >= 0 ? ' nach oben' : ' nach unten'}. Was eine zehnjährige
              Anleihe mit zwei Prozent Kupon dabei gemacht hätte:
            </p>

            <StatGrid className="mt-6">
              <Stat
                label={`Kurs bei ${formatNumber(beleg.von.wert, 2)} %`}
                value={`${formatNumber(beleg.schock.vorher, 2)} %`}
                hint="In Prozent des Nennwerts."
              />
              <Stat
                label={`Kurs bei ${formatNumber(beleg.bis.wert, 2)} %`}
                value={`${formatNumber(beleg.schock.nachher, 2)} %`}
                hint="Derselbe Kupon, derselbe Nennwert – nur ein anderer Marktzins."
              />
              <Stat
                label="Kursänderung"
                value={formatPercentSigned(beleg.schock.tatsaechlichProzent)}
                hint="Ohne dass am Papier selbst irgendetwas passiert wäre."
              />
              <Stat
                label="Kurs bei Rückzahlung"
                value={`${formatNumber(kurs(BEISPIEL, BEISPIEL.kuponProzent), 0)} %`}
                hint="Am Ende gibt es den Nennwert – unabhängig vom Kurs dazwischen."
              />
            </StatGrid>

            <Callout variant="info" title="Was diese Rechnung nicht ist" className="mt-8">
              <p>
                Der Leitzins ist{' '}
                <strong>
                  nicht der Zins, zu dem eine zehnjährige Anleihe bewertet wird
                </strong>
                . Er ist der Satz, zu dem sich Banken bei der Zentralbank Geld leihen, und
                bewegt vor allem das kurze Ende der Zinskurve. Das lange Ende folgt ihm
                nur teilweise und manchmal gar nicht.
              </p>
              <p>
                Hier steht er als <strong>belegbare Zinsbewegung</strong>, an der sich die
                Mechanik zeigen lässt – nicht als Bewertungsgrundlage für eine konkrete
                Anleihe. Wer den tatsächlichen Kurs einer Bundesanleihe will, findet ihn
                bei seinem Broker.
              </p>
              <p className="text-sm">
                {leitzins.abgrenzung} Quelle:{' '}
                <a
                  href={leitzins.quelle.url}
                  className="text-markets hover:underline"
                  rel="noreferrer"
                >
                  {leitzins.quelle.label}
                </a>
                {zinsenStand && `, abgerufen am ${formatDateShort(zinsenStand)}`}.
              </p>
            </Callout>
          </section>
        )}

        <section aria-labelledby="weiter" className="mt-16 max-w-3xl">
          <h2 id="weiter" className="text-fg text-2xl font-bold">
            Weiterlesen
          </h2>
          <p className="text-fg-muted mt-4 leading-relaxed">
            Diese Seite erklärt einen einzelnen Zusammenhang und rechnet ihn vor. Was eine
            Anleihe darüber hinaus ist – Bonität, Rangfolge im Insolvenzfall, der
            Unterschied zwischen Staat und Unternehmen –, steht in den Lernthemen:
          </p>
          <ul className="mt-5 space-y-3">
            {[
              {
                href: '/lernen/staatsanleihe',
                titel: 'Staatsanleihe',
                text: 'Wer leiht wem, was Bonität bedeutet und warum ein Staat anders ausfällt als ein Unternehmen.',
              },
              {
                href: '/lernen/schuldverschreibung',
                titel: 'Schuldverschreibung',
                text: 'Die Gattung dahinter: Rangfolge, Besicherung und was im Insolvenzfall in welcher Reihenfolge bedient wird.',
              },
              {
                href: '/lernen/notenbanken-geldpolitik',
                titel: 'Notenbanken und Geldpolitik',
                text: 'Woher der Leitzins kommt, den diese Seite als Beleg benutzt.',
              },
            ].map((eintrag) => (
              <li key={eintrag.href}>
                <Link
                  href={eintrag.href}
                  className="fk-card hover:border-markets block p-5 transition"
                >
                  <span className="text-fg font-semibold">{eintrag.titel}</span>
                  <span className="text-fg-muted mt-1 block text-sm leading-relaxed">
                    {eintrag.text}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <JsonLd
        data={webApplicationSchema({
          name: 'Anleihenrechner',
          description:
            'Kurs, Duration und Konvexität einer Anleihe bei einer Zinsänderung – mit Vergleich über fünf Restlaufzeiten.',
          path: '/anleihen',
          featureList: [
            'Kurs als Barwert aller Zahlungen',
            'Modifizierte Duration',
            'Näherung über die Duration gegen exakte Rechnung',
            'Dieselbe Zinsänderung über fünf Restlaufzeiten',
          ],
        })}
      />
      <JsonLd
        data={howToSchema({
          name: 'Anleihekurs bei einer Zinsänderung berechnen',
          description:
            'Kupon, Restlaufzeit, Marktzins und Zinsänderung eingeben – der Rechner zeigt den Kurs davor und danach.',
          path: '/anleihen',
          schritte: [
            'Kupon in Prozent des Nennwerts eintragen – der feste jährliche Zins der Anleihe.',
            'Restlaufzeit in Jahren bis zur Rückzahlung angeben.',
            'Marktzins heute eintragen: was eine neue Anleihe gleicher Laufzeit bietet.',
            'Zinsänderung in Prozentpunkten wählen; negative Werte sind erlaubt.',
            'Kurs davor und danach ablesen, dazu die Näherung über die Duration und den tatsächlichen Wert.',
          ],
        })}
      />
    </>
  )
}
