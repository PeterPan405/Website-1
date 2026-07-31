import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import type { Instrumentenbilanz } from '@/lib/jahresrueckblick-daten'

import { Monatsstreifen } from '@/components/news/Monatsstreifen'
import { JsonLd } from '@/components/seo/JsonLd'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Callout } from '@/components/ui/Callout'
import { PageHeader } from '@/components/ui/PageHeader'
import { Reveal } from '@/components/ui/Reveal'
import { formatDateShort, formatNumber, formatPercentSigned } from '@/lib/format'
import { bilanzsatz, MONATSNAMEN, zahlwort, zahlwortDativ } from '@/lib/jahresrueckblick'
import {
  getJahresrueckblick,
  getRueckblickJahre,
  type Jahresrueckblick,
} from '@/lib/jahresrueckblick-daten'
import { breadcrumbSchema } from '@/lib/jsonld'
import { buildMetadata, withBrand } from '@/lib/seo'

interface PageProps {
  // In dieser Next-Version sind die Routen-Parameter ein Promise.
  params: Promise<{ jahr: string }>
}

export async function generateStaticParams() {
  const jahre = await getRueckblickJahre()
  return jahre.map((jahr) => ({ jahr: String(jahr) }))
}

/**
 * Ein Satz, der das Jahr benennt, ohne es zu bewerten.
 *
 * Rein aus den Zahlen: wie viele Märkte im Plus stehen, welcher am weitesten
 * ausschlug. Kein „turbulentes Jahr“, kein „Jahr der Anleihen“ – solche Sätze
 * werden pro Jahrgang geschrieben und nie wieder angesehen, und dieser hier
 * entsteht bei jedem Build neu.
 */
function lead(rueckblick: Jahresrueckblick): string {
  const satz = bilanzsatz(rueckblick.instrumente.map((i) => i.bilanz.prozent))
  const raender = rueckblick.raender
  if (!raender) return satz

  const name =
    rueckblick.instrumente.find((i) => i.symbol === raender.staerkste.symbol)?.name ?? ''
  /*
    „Am weitesten oben“ und nicht „am stärksten gestiegen“: In einem Jahr, in
    dem alles fällt, ist der Erste der am wenigsten Gefallene, und der Satz
    stimmt trotzdem.
  */
  return `${satz} Am weitesten oben stand ${name} mit ${formatPercentSigned(raender.staerkste.bilanz.prozent, 1)}.`
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { jahr } = await props.params
  const rueckblick = await getJahresrueckblick(Number(jahr))
  if (!rueckblick) {
    return buildMetadata({
      title: withBrand(`Jahresrückblick ${jahr}`),
      description:
        'Für dieses Jahr liegen keine durchgehenden Kursreihen vor. Die Jahre mit Rückblick stehen in der Übersicht.',
      path: `/news/jahr/${jahr}`,
      noIndex: true,
    })
  }

  const beschreibung = `Was ${jahr} an den Märkten geschah: ${rueckblick.instrumente.length} Indizes, Rohstoffe und Kurse mit Jahresveränderung, Hoch, Tief und größtem Rückschlag – belegt mit den Artikeln des Archivs.`

  return buildMetadata({
    title: withBrand(`Jahresrückblick ${jahr}`),
    description: beschreibung,
    path: `/news/jahr/${jahr}`,
    ogTitle: `Jahresrückblick ${jahr}`,
    type: 'article',
  })
}

/** Eine Zeile der Jahrestabelle. */
function Zeile({ eintrag }: { eintrag: Instrumentenbilanz }) {
  const { bilanz } = eintrag
  const rauf = bilanz.prozent >= 0

  return (
    <tr className="border-border border-t">
      <th scope="row" className="py-3 pr-3 text-left font-medium">
        <Link href={`/maerkte/${eintrag.symbol}`} className="hover:text-brand underline">
          {eintrag.name}
        </Link>
        <span className="text-fg-subtle ml-2 text-xs">{eintrag.ticker}</span>
      </th>
      <td className="text-fg-muted py-3 pr-3 text-right tabular-nums">
        {formatNumber(bilanz.basisKurs, eintrag.decimals)}
      </td>
      <td className="text-fg-muted py-3 pr-3 text-right tabular-nums">
        {formatNumber(bilanz.endeKurs, eintrag.decimals)}
      </td>
      <td
        className={`py-3 pr-3 text-right font-semibold tabular-nums ${
          rauf ? 'text-success' : 'text-danger'
        }`}
      >
        {formatPercentSigned(bilanz.prozent, 1)}
      </td>
      <td className="text-fg-muted py-3 pr-3 text-right text-sm tabular-nums">
        {formatNumber(bilanz.hoch.c, eintrag.decimals)}
        <span className="text-fg-subtle block text-xs">
          {formatDateShort(bilanz.hoch.d)}
        </span>
      </td>
      <td className="text-fg-muted py-3 pr-3 text-right text-sm tabular-nums">
        {formatNumber(bilanz.tief.c, eintrag.decimals)}
        <span className="text-fg-subtle block text-xs">
          {formatDateShort(bilanz.tief.d)}
        </span>
      </td>
      <td className="text-danger py-3 text-right text-sm font-medium tabular-nums">
        {bilanz.rueckschlag ? (
          <>
            {formatPercentSigned(bilanz.rueckschlag.prozent, 1)}
            <span className="text-fg-subtle block text-xs">
              {formatDateShort(bilanz.rueckschlag.vonTag)} –{' '}
              {formatDateShort(bilanz.rueckschlag.bisTag)}
            </span>
          </>
        ) : (
          <span className="text-fg-subtle">–</span>
        )}
      </td>
    </tr>
  )
}

/** Eine der drei Randmarken über der Tabelle. */
function Randkachel({
  titel,
  erklaerung,
  eintrag,
  wert,
  ton,
}: {
  titel: string
  erklaerung: string
  eintrag: Instrumentenbilanz | undefined
  wert: string
  ton: 'success' | 'danger'
}) {
  if (!eintrag) return null
  return (
    <div className="fk-card p-5">
      <p className="text-fg-subtle text-xs font-semibold tracking-wide uppercase">
        {titel}
      </p>
      <p className="text-fg mt-2 text-base font-semibold">{eintrag.name}</p>
      <p
        className={`mt-1 text-2xl font-bold tabular-nums ${
          ton === 'success' ? 'text-success' : 'text-danger'
        }`}
      >
        {wert}
      </p>
      <p className="text-fg-subtle mt-2 text-xs leading-relaxed">{erklaerung}</p>
    </div>
  )
}

export default async function JahresrueckblickPage(props: PageProps) {
  const { jahr } = await props.params
  const zahl = Number(jahr)
  const rueckblick = Number.isInteger(zahl) ? await getJahresrueckblick(zahl) : null
  if (!rueckblick) notFound()

  const alleJahre = await getRueckblickJahre()
  const vorher = alleJahre.find((j) => j < zahl)
  const nachher = [...alleJahre].reverse().find((j) => j > zahl)

  const finde = (symbol: string | undefined) =>
    rueckblick.instrumente.find((i) => i.symbol === symbol)

  const bis = rueckblick.leitindex?.bilanz.endeTag

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: 'News', path: '/news' },
          { name: 'Jahresrückblick', path: '/news/jahr' },
          { name: String(zahl), path: `/news/jahr/${zahl}` },
        ])}
      />

      <PageHeader
        area="news"
        eyebrow="Jahresrückblick"
        eyebrowIcon="newspaper"
        title={`Das Marktjahr ${zahl}`}
        lead={lead(rueckblick)}
        breadcrumbs={
          <Breadcrumbs
            items={[
              { name: 'News', path: '/news' },
              { name: 'Jahresrückblick', path: '/news/jahr' },
              { name: String(zahl) },
            ]}
          />
        }
        meta={
          <>
            <span>{rueckblick.instrumente.length} Märkte</span>
            <span aria-hidden="true">·</span>
            <span>
              {rueckblick.abdeckung.gesamtzahl}{' '}
              {rueckblick.abdeckung.gesamtzahl === 1
                ? 'eigener Artikel'
                : 'eigene Artikel'}
            </span>
            {bis && (
              <>
                <span aria-hidden="true">·</span>
                <span>Kurse bis {formatDateShort(bis)}</span>
              </>
            )}
          </>
        }
      />

      <div className="fk-container py-12 sm:py-16">
        {/*
          Der Hinweis steht ganz oben und nicht unten. Ein unvollständiges Jahr
          als Jahresbilanz zu lesen ist der wahrscheinlichste Fehler auf dieser
          Seite, und er passiert in den ersten fünf Sekunden.
        */}
        {!rueckblick.vollesJahr && (
          <Callout variant="warning" title="Dieses Jahr ist noch nicht zu Ende">
            <p>
              Die Kursreihen reichen bis zum{' '}
              {bis ? formatDateShort(bis) : 'letzten abgerufenen Handelstag'}. Was hier
              steht, ist die Veränderung <strong>seit dem Jahreswechsel</strong> – keine
              Jahresrendite. Der Unterschied ist derselbe wie zwischen einem Zwischenstand
              und einem Endstand, und er wird beim Vergleich mit abgeschlossenen Jahren
              gern übersehen.
            </p>
          </Callout>
        )}

        {/* ------------------------------------------------- Die Ränder */}
        {rueckblick.raender && (
          <section aria-labelledby="raender" className="mt-10 first:mt-0">
            <h2 id="raender" className="text-xl font-semibold sm:text-2xl">
              Die drei Ränder des Jahres
            </h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <Randkachel
                titel="Am weitesten oben"
                eintrag={finde(rueckblick.raender.staerkste.symbol)}
                wert={formatPercentSigned(rueckblick.raender.staerkste.bilanz.prozent, 1)}
                ton="success"
                erklaerung="Vom letzten Kurs des Vorjahres bis zum letzten Kurs dieses Jahres."
              />
              <Randkachel
                titel="Am weitesten unten"
                eintrag={finde(rueckblick.raender.schwaechste.symbol)}
                wert={formatPercentSigned(
                  rueckblick.raender.schwaechste.bilanz.prozent,
                  1
                )}
                ton="danger"
                erklaerung="Derselbe Zeitraum – nur am anderen Ende der Liste."
              />
              <Randkachel
                titel="Tiefster Rückschlag"
                eintrag={finde(rueckblick.raender.tiefster.symbol)}
                wert={formatPercentSigned(
                  rueckblick.raender.tiefster.bilanz.rueckschlag?.prozent ?? 0,
                  1
                )}
                ton="danger"
                erklaerung="Der größte Rückgang vom jeweils höchsten bis dahin erreichten Stand – eine andere Frage als der Endstand."
              />
            </div>
            <p className="text-fg-subtle mt-4 text-sm leading-relaxed">
              Die dritte Kachel ist die, die in Jahresrückblicken fehlt. Ein Markt kann
              das Jahr im Plus beenden und zwischendurch ein Drittel verloren haben; wer
              nur den Endstand liest, hält ihn für ruhig.
            </p>
          </section>
        )}

        {/* ------------------------------------------------ Die Tabelle */}
        <section aria-labelledby="maerkte" className="mt-14">
          <h2 id="maerkte" className="text-xl font-semibold sm:text-2xl">
            Was die Märkte machten
          </h2>
          <div className="fk-card mt-5 overflow-x-auto p-4 sm:p-6">
            <table className="w-full min-w-[46rem] text-sm">
              <caption className="text-fg-subtle pb-3 text-left text-xs">
                Schlusskurse aus der gespeicherten Kursreihe. „Jahresanfang“ ist der
                letzte Kurs des Vorjahres – die Kurslücke über den Jahreswechsel gehört
                ins Jahr.
              </caption>
              <thead>
                <tr className="text-fg-subtle text-xs tracking-wide uppercase">
                  <th scope="col" className="pr-3 pb-2 text-left font-semibold">
                    Markt
                  </th>
                  <th scope="col" className="pr-3 pb-2 text-right font-semibold">
                    Jahresanfang
                  </th>
                  <th scope="col" className="pr-3 pb-2 text-right font-semibold">
                    Zuletzt
                  </th>
                  <th scope="col" className="pr-3 pb-2 text-right font-semibold">
                    Veränderung
                  </th>
                  <th scope="col" className="pr-3 pb-2 text-right font-semibold">
                    Hoch
                  </th>
                  <th scope="col" className="pr-3 pb-2 text-right font-semibold">
                    Tief
                  </th>
                  <th scope="col" className="pb-2 text-right font-semibold">
                    Größter Rückschlag
                  </th>
                </tr>
              </thead>
              <tbody>
                {rueckblick.instrumente.map((eintrag) => (
                  <Zeile key={eintrag.symbol} eintrag={eintrag} />
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ------------------------------------------- Der Jahresverlauf */}
        {rueckblick.leitindex && rueckblick.monate.length > 0 && (
          <section aria-labelledby="verlauf" className="mt-14">
            <h2 id="verlauf" className="text-xl font-semibold sm:text-2xl">
              Wann es passierte
            </h2>
            <p className="text-fg-muted mt-3 leading-relaxed">
              Die Monate des {rueckblick.leitindex.name} – jeder Balken gegenüber dem
              Schlusskurs des Vormonats.
            </p>
            <div className="fk-card mt-5 p-5 sm:p-6">
              <Monatsstreifen
                schritte={rueckblick.monate}
                jahr={zahl}
                name={rueckblick.leitindex.name}
              />
            </div>
          </section>
        )}

        {/* ------------------------------------------------ Das Archiv */}
        <section aria-labelledby="archiv" className="mt-14">
          <h2 id="archiv" className="text-xl font-semibold sm:text-2xl">
            Was wir dazu geschrieben haben
          </h2>

          {rueckblick.archiv.length === 0 ? (
            <p className="text-fg-muted mt-3 leading-relaxed">
              Aus diesem Jahr steht kein eigener Artikel im Archiv. Das ist kein Versehen
              und wird auch keins: Das Archiv beginnt dort, wo es beginnt, und rückwirkend
              etwas hineinzuschreiben hieße, ein Datum zu erfinden.
            </p>
          ) : (
            <>
              <p className="text-fg-muted mt-3 leading-relaxed">
                {rueckblick.abdeckung.gesamtzahl} Artikel aus{' '}
                {zahlwortDativ(rueckblick.abdeckung.monateMitArtikeln)}{' '}
                {rueckblick.abdeckung.monateMitArtikeln === 1 ? 'Monat' : 'Monaten'} von{' '}
                {zahlwort(rueckblick.abdeckung.monateVergangen)}, die dieses Jahr bisher
                vergangen sind.
              </p>
              <div className="mt-6 space-y-6">
                {rueckblick.archiv.map((monat, index) => (
                  <Reveal key={monat.monat} delay={index * 0.05}>
                    <div className="fk-card p-5 sm:p-6">
                      <h3 className="text-fg text-base font-semibold">
                        {MONATSNAMEN[monat.monat]} {zahl}
                        <span className="text-fg-subtle ml-2 text-sm font-normal">
                          {monat.artikel.length}{' '}
                          {monat.artikel.length === 1 ? 'Artikel' : 'Artikel'}
                        </span>
                      </h3>
                      <ul className="mt-3 space-y-2">
                        {monat.artikel.map((artikel) => (
                          <li key={artikel.slug} className="text-sm">
                            <Link
                              href={`/news/${artikel.slug}`}
                              className="text-fg hover:text-brand font-medium underline"
                            >
                              {artikel.title}
                            </Link>
                            <span className="text-fg-subtle ml-2 text-xs">
                              {formatDateShort(artikel.publishedAt)} · {artikel.category}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Reveal>
                ))}
              </div>
            </>
          )}

          {rueckblick.ausgaben.length > 0 && (
            <div className="mt-6">
              <h3 className="text-fg text-base font-semibold">
                Tagesüberblicke aus {zahl}
              </h3>
              <ul className="mt-3 flex flex-wrap gap-2">
                {rueckblick.ausgaben.map((datum) => (
                  <li key={datum}>
                    <Link href={`/news/tag/${datum}`} className="fk-btn-ghost text-sm">
                      {formatDateShort(datum)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {/* --------------------------------------- Was hier nicht steht */}
        <section aria-labelledby="grenzen" className="mt-14">
          <h2 id="grenzen" className="text-xl font-semibold sm:text-2xl">
            Was dieser Rückblick nicht sagt
          </h2>
          <div className="mt-5 space-y-4">
            <Callout variant="info" title="Kursreihen, keine Gesamtrendite">
              <p>
                Gerechnet wird mit Schlusskursen. Dividenden und Zinsen sind nicht darin –
                bei einem Aktienindex wie dem DAX, der Ausschüttungen einrechnet, stehen
                sie bereits im Kurs, beim S&amp;P 500 und beim FTSE 100 nicht. Zwei Zahlen
                dieser Tabelle nebeneinanderzulegen heißt deshalb nicht immer, dasselbe zu
                vergleichen.
              </p>
              <p>
                Auch die Währung bleibt, wie sie notiert. Ein US-Index in Dollar hat für
                jemanden, der in Euro rechnet, ein zweites Ergebnis – das steht in der
                Zeile{' '}
                <Link href="/maerkte/eur-usd" className="underline">
                  EUR/USD
                </Link>{' '}
                darunter, aber nicht in den Indexzeilen.
              </p>
            </Callout>

            <Callout variant="info" title="Wie fein die Reihen sind">
              <p>
                Die Momentaufnahme trägt für zurückliegende Jahre Wochenschlusskurse und
                erst seit Mitte 2025 Tageskurse. Dieses Jahr liegt bei rund{' '}
                {rueckblick.leitindex?.bilanz.punkteJeMonat ?? 0} Kurspunkten je Monat.
              </p>
              <p>
                Das betrifft vor allem die letzte Spalte: Auf Wochenwerten fällt jeder
                Rückschlag kleiner aus, der innerhalb einer Woche begann und endete –
                gemessen wird ja nur freitags. Hoch, Tief und Rückschlag eines
                Wochenjahres sind deshalb Untergrenzen, nicht die tatsächlichen Extreme.
              </p>
            </Callout>

            <Callout variant="warning" title="Und keine Aussage über das nächste Jahr">
              <p>
                Ein Jahresrückblick beschreibt einen Zeitraum, der vorbei ist. Er sagt
                nichts darüber, was danach kommt – auch dann nicht, wenn sich drei Jahre
                hintereinander ähnlich lesen. Wer daraus eine Erwartung ableitet, hat den{' '}
                <Link href="/lernen/anlegerpsychologie" className="underline">
                  Denkfehler
                </Link>{' '}
                und nicht die Daten auf seiner Seite.
              </p>
            </Callout>
          </div>
        </section>

        {/* Blättern durch die Jahrgänge. */}
        <nav
          aria-label="Weitere Jahrgänge"
          className="border-border mt-14 flex flex-col gap-3 border-t pt-6 sm:flex-row sm:justify-between"
        >
          {vorher ? (
            <Link href={`/news/jahr/${vorher}`} className="fk-btn-ghost justify-start">
              Rückblick {vorher}
            </Link>
          ) : (
            <Link href="/news/jahr" className="fk-btn-ghost justify-start">
              Alle Jahrgänge
            </Link>
          )}
          {nachher && (
            <Link href={`/news/jahr/${nachher}`} className="fk-btn-ghost justify-end">
              Rückblick {nachher}
            </Link>
          )}
        </nav>
      </div>
    </>
  )
}
