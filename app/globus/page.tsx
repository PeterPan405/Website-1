import type { Metadata } from 'next'
import Link from 'next/link'

import { GlobusAnsicht } from '@/components/globus/GlobusAnsicht'
import { Laendertabelle } from '@/components/globus/Laendertabelle'
import { TopicLinkList } from '@/components/learn/TopicLinkList'
import { JsonLd } from '@/components/seo/JsonLd'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { PageHeader } from '@/components/ui/PageHeader'
import { datasetSchema } from '@/lib/jsonld'
import {
  WELTBANK_JAHR,
  WELTBANK_QUELLE,
  getAbdeckung,
  getLaender,
  getQuellen,
  getUebernationaleKurse,
  metriken,
} from '@/lib/laender'
import { getTopicsBySlugs } from '@/lib/learn'
import { buildMetadata, withBrand } from '@/lib/seo'
import { kennzahlenQuellen } from '@/data/laender/kennzahlen'

export const metadata: Metadata = buildMetadata({
  title: withBrand('Globus – die Weltwirtschaft zum Drehen'),
  description:
    'Ein drehbarer Globus mit Wirtschaftsleistung, Einwohnern, BIP pro Kopf, Staatsverschuldung, Gehältern und Vermögen – und den Indizes und Aktien, die aus jedem Land kommen.',
  path: '/globus',
  ogTitle: 'Der Globus: Weltwirtschaft zum Drehen',
})

export default async function GlobusPage() {
  const [laender, abdeckung, quellen, uebernational, relatedTopics] = await Promise.all([
    getLaender(),
    getAbdeckung(),
    getQuellen(),
    getUebernationaleKurse(),
    getTopicsBySlugs([
      'aktien-laender-branchen',
      'waehrungen-wechselkurse',
      'staatsanleihe',
    ]),
  ])

  const mitKursen = laender.filter(
    (land) => land.indizes.length + land.aktien.length > 0
  ).length

  return (
    <>
      <PageHeader
        area="markets"
        eyebrow="Globus"
        eyebrowIcon="chart"
        title="Die Weltwirtschaft zum Drehen"
        lead="Dreh die Kugel, zoom hinein, klick ein Land an. Für jedes Land: Wirtschaftsleistung, Einwohner, Wohlstand pro Kopf – und die Indizes und Aktien, die von dort kommen."
        breadcrumbs={<Breadcrumbs items={[{ name: 'Globus' }]} />}
        meta={
          <>
            {/*
              „und Gebiete“, weil die feine Karte auch Hongkong, Guam und die
              Färöer zeichnet. Sie alle Länder zu nennen wäre bequem und falsch.
            */}
            <span>{laender.length} Länder und Gebiete</span>
            <span aria-hidden="true">·</span>
            <span>{abdeckung.bip} mit Wirtschaftsdaten</span>
            <span aria-hidden="true">·</span>
            <span>{mitKursen} mit Kursen auf dieser Seite</span>
          </>
        }
      />

      <div className="fk-container py-12 sm:py-16">
        <GlobusAnsicht
          laender={laender}
          metriken={metriken}
          quellen={kennzahlenQuellen}
          weltbankJahr={WELTBANK_JAHR}
        />

        {/* ------------------------------------------------------ Einordnung */}
        <section aria-labelledby="lesen" className="mt-14 max-w-3xl">
          <h2 id="lesen" className="text-fg text-2xl font-bold">
            Wie die Karte zu lesen ist
          </h2>
          <p className="text-fg-muted mt-4 leading-relaxed">
            Die Klassen sind so geschnitten, dass in jeder gleich viele Länder liegen. Die
            Farbe zeigt damit den <strong className="text-fg">Rang</strong>, nicht den
            Abstand – bei einer Spanne vom Zwanzigtausendfachen zwischen der größten und
            der kleinsten Volkswirtschaft ist das die einzige Einteilung, die überhaupt
            etwas zeigt. Die genaue Zahl steht bei jedem Land im Klartext. Grau heißt
            „keine Angabe“, nicht „null“.
          </p>
          {uebernational.length > 0 && (
            <p className="text-fg-muted mt-4 leading-relaxed">
              Zwei Kurse gehören keinem einzelnen Land:{' '}
              {uebernational.map((eintrag, index) => (
                <span key={eintrag.kurs.symbol}>
                  {index > 0 && ' und '}
                  <Link
                    href={`/maerkte/${eintrag.kurs.symbol}`}
                    className="text-brand font-medium underline underline-offset-2"
                  >
                    {eintrag.kurs.name}
                  </Link>
                </span>
              ))}
              . Sie stehen deshalb nicht auf der Kugel.
            </p>
          )}
        </section>

        {/* --------------------------------------------------------- Tabelle */}
        <section aria-labelledby="tabelle" className="mt-16">
          <h2 id="tabelle" className="text-fg text-2xl font-bold">
            Alle Länder als Tabelle
          </h2>
          <p className="text-fg-muted mt-2 max-w-3xl leading-relaxed">
            Dieselben Zahlen zum Nachlesen, sortiert nach Wirtschaftsleistung. Der Globus
            ist eine Zeichenfläche und für Screenreader nicht lesbar – diese Tabelle ist
            deshalb nicht die Beigabe, sondern die vollständige Fassung.
          </p>
          <Laendertabelle laender={laender} />
        </section>

        {/* --------------------------------------------------------- Quellen */}
        {/*
          Kurz, aber nicht weg.

          Die TopoJSON-Umsetzung der Kartengeometrie steht unter der
          ISC-Lizenz, und die verlangt ausdrücklich, dass der Urhebervermerk
          erhalten bleibt. Die Weltbank stellt ihre Reihen unter CC BY 4.0 –
          auch dort ist die Namensnennung Bedingung der Nutzung, nicht
          Höflichkeit. Aus einem eigenen Abschnitt sind deshalb drei Zeilen
          geworden; ganz streichen ließe sich das nicht.
        */}
        <section aria-labelledby="quellen" className="border-border mt-14 border-t pt-6">
          <h2
            id="quellen"
            className="text-fg-subtle text-xs font-semibold tracking-wide uppercase"
          >
            Daten und Karte
          </h2>
          <p className="text-fg-subtle mt-2 max-w-3xl text-sm leading-relaxed">
            Wirtschaftsleistung und Einwohner: {WELTBANK_QUELLE.label}, Bezugsjahr{' '}
            {WELTBANK_JAHR}.{' '}
            {quellen.map((quelle, index) => (
              <span key={quelle.url}>
                {index > 0 && ' · '}
                <a
                  href={quelle.url}
                  rel="noopener noreferrer nofollow"
                  target="_blank"
                  className="underline underline-offset-2"
                >
                  {quelle.label}
                </a>
              </span>
            ))}
            . Karte: Natural Earth (gemeinfrei), TopoJSON-Umsetzung{' '}
            <code className="text-xs">world-atlas</code> unter ISC-Lizenz. Jeder Wert
            trägt in der Detailtafel seinen eigenen Zeitraum und seine eigene Quelle.
          </p>
        </section>

        <div className="mt-16">
          <TopicLinkList
            topics={relatedTopics}
            description="Was hinter Ländern, Währungen und Staatsanleihen steckt – ausführlich erklärt."
          />
        </div>
      </div>

      <JsonLd
        data={datasetSchema({
          name: 'Länderkennzahlen und Marktzuordnung',
          description: `Wirtschaftsleistung, Einwohner und abgeleitete Kennzahlen für ${abdeckung.bip} Länder (Weltbank, ${WELTBANK_JAHR}) sowie die Zuordnung der auf IM Invests geführten Indizes und Aktien zu ihrem Herkunftsland.`,
          path: '/globus',
          temporalCoverage: String(WELTBANK_JAHR),
          keywords: [
            'Weltwirtschaft',
            'Bruttoinlandsprodukt',
            'Staatsverschuldung',
            'Aktienindizes',
            'Ländervergleich',
          ],
        })}
      />
    </>
  )
}
