import type { Metadata } from 'next'
import Link from 'next/link'

import { JsonLd } from '@/components/seo/JsonLd'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Callout } from '@/components/ui/Callout'
import { PageHeader } from '@/components/ui/PageHeader'
import { Reveal } from '@/components/ui/Reveal'
import { formatDateShort, formatPercentSigned } from '@/lib/format'
import { zahlwort, zahlwortDativ } from '@/lib/jahresrueckblick'
import {
  getJahresrueckblick,
  getRueckblickJahre,
  LEITINDEX_SYMBOL,
} from '@/lib/jahresrueckblick-daten'
import { collectionPageSchema } from '@/lib/jsonld'
import { buildMetadata, withBrand } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: withBrand('Jahresrückblick: die Marktjahre im Überblick'),
  description:
    'Was jedes Jahr an den Märkten brachte – Veränderung, Hoch, Tief und größter Rückschlag für zwölf Märkte, gerechnet aus den gespeicherten Kursreihen.',
  path: '/news/jahr',
  ogTitle: 'Die Marktjahre im Überblick',
})

export default async function JahrgangsPage() {
  const jahre = await getRueckblickJahre()
  const rueckblicke = await Promise.all(jahre.map((jahr) => getJahresrueckblick(jahr)))
  const vorhanden = rueckblicke.filter((r) => r !== null)

  return (
    <>
      <JsonLd
        data={collectionPageSchema({
          name: 'Jahresrückblick',
          description:
            'Die Marktjahre im Überblick, gerechnet aus den gespeicherten Kursreihen.',
          path: '/news/jahr',
          items: vorhanden.map((r) => ({
            name: `Das Marktjahr ${r.jahr}`,
            path: `/news/jahr/${r.jahr}`,
          })),
        })}
      />

      <PageHeader
        area="news"
        eyebrow="Jahresrückblick"
        eyebrowIcon="newspaper"
        title="Die Marktjahre im Überblick"
        lead="Ein Jahresrückblick, der nichts behauptet: Was in der Tabelle steht, kommt aus derselben Kursreihe wie die Kurse auf jeder Marktseite. Dazu die eigenen Artikel des Archivs – als Beleg, was wann Thema war."
        breadcrumbs={
          <Breadcrumbs
            items={[{ name: 'News', path: '/news' }, { name: 'Jahresrückblick' }]}
          />
        }
        meta={
          <>
            <span>
              {vorhanden.length} {vorhanden.length === 1 ? 'Jahrgang' : 'Jahrgänge'}
            </span>
            <span aria-hidden="true">·</span>
            <Link href="/news/tag" className="hover:text-fg underline">
              Tagesüberblicke
            </Link>
          </>
        }
      />

      <div className="fk-container py-12 sm:py-16">
        <ul className="space-y-5">
          {vorhanden.map((rueckblick, index) => {
            const leit = rueckblick.leitindex
            return (
              <li key={rueckblick.jahr}>
                <Reveal delay={index * 0.05}>
                  <Link
                    href={`/news/jahr/${rueckblick.jahr}`}
                    className="fk-card hover:border-news/40 block p-5 transition sm:p-6"
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-3">
                      <h2 className="text-fg text-xl font-semibold sm:text-2xl">
                        {rueckblick.jahr}
                        {!rueckblick.vollesJahr && (
                          <span className="fk-chip bg-warning-soft text-warning ml-3 align-middle">
                            läuft noch
                          </span>
                        )}
                      </h2>
                      {leit && (
                        <p
                          className={`text-lg font-bold tabular-nums ${
                            leit.bilanz.prozent >= 0 ? 'text-success' : 'text-danger'
                          }`}
                        >
                          {leit.ticker} {formatPercentSigned(leit.bilanz.prozent, 1)}
                        </p>
                      )}
                    </div>

                    <dl className="text-fg-muted mt-4 grid gap-3 text-sm sm:grid-cols-3">
                      <div>
                        <dt className="text-fg-subtle text-xs tracking-wide uppercase">
                          Am weitesten oben
                        </dt>
                        <dd className="mt-0.5">
                          {rueckblick.raender
                            ? `${
                                rueckblick.instrumente.find(
                                  (i) => i.symbol === rueckblick.raender!.staerkste.symbol
                                )?.name
                              } ${formatPercentSigned(
                                rueckblick.raender.staerkste.bilanz.prozent,
                                1
                              )}`
                            : '–'}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-fg-subtle text-xs tracking-wide uppercase">
                          Am weitesten unten
                        </dt>
                        <dd className="mt-0.5">
                          {rueckblick.raender
                            ? `${
                                rueckblick.instrumente.find(
                                  (i) =>
                                    i.symbol === rueckblick.raender!.schwaechste.symbol
                                )?.name
                              } ${formatPercentSigned(
                                rueckblick.raender.schwaechste.bilanz.prozent,
                                1
                              )}`
                            : '–'}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-fg-subtle text-xs tracking-wide uppercase">
                          Eigene Artikel
                        </dt>
                        <dd className="mt-0.5">
                          {rueckblick.abdeckung.gesamtzahl === 0
                            ? 'keine'
                            : `${rueckblick.abdeckung.gesamtzahl} aus ${zahlwortDativ(rueckblick.abdeckung.monateMitArtikeln)} von ${zahlwort(rueckblick.abdeckung.monateVergangen)} Monaten`}
                        </dd>
                      </div>
                    </dl>

                    {leit && (
                      <p className="text-fg-subtle mt-4 text-xs">
                        Kurse bis {formatDateShort(leit.bilanz.endeTag)} · rund{' '}
                        {leit.bilanz.punkteJeMonat} Kurspunkte je Monat
                      </p>
                    )}
                  </Link>
                </Reveal>
              </li>
            )
          })}
        </ul>

        <Callout variant="info" title="Warum das erste Jahr fehlt" className="mt-10">
          <p>
            Eine Jahresveränderung braucht einen Bezugspunkt: den letzten Kurs des
            Vorjahres. Für das erste Jahr der gespeicherten Reihe gibt es den nicht, und
            ihn aus dem ersten vorhandenen Kurs zu bilden hieße, die Monate davor
            wegzulassen und das Ergebnis trotzdem „Jahr“ zu nennen.
          </p>
          <p>
            Aus demselben Grund beginnt der Bezug beim Vorjahresschluss und nicht beim
            ersten Handelstag im Januar: Die Kurslücke über den Jahreswechsel gehört zum
            Jahr, denn wer am Silvesterabend investiert war, hat sie erlebt. Maßgeblich
            für die Auswahl der Jahrgänge ist die Reihe des{' '}
            <Link href={`/maerkte/${LEITINDEX_SYMBOL}`} className="underline">
              DAX
            </Link>
            .
          </p>
        </Callout>
      </div>
    </>
  )
}
