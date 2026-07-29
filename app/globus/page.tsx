import type { Metadata } from 'next'
import Link from 'next/link'

import { GlobusAnsicht } from '@/components/globus/GlobusAnsicht'
import { Laendertabelle } from '@/components/globus/Laendertabelle'
import { TopicLinkList } from '@/components/learn/TopicLinkList'
import { JsonLd } from '@/components/seo/JsonLd'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { PageHeader } from '@/components/ui/PageHeader'
import { formatNumber } from '@/lib/format'
import { datasetSchema } from '@/lib/jsonld'
import {
  WELTBANK_JAHR,
  WELTBANK_QUELLE,
  getAbdeckung,
  getLaender,
  getUebernationaleKurse,
  lohnSchaetzung,
  vermoegenSchaetzung,
  metriken,
} from '@/lib/laender'
import { getTopicsBySlugs } from '@/lib/learn'
import { buildMetadata, withBrand } from '@/lib/seo'
import { kennzahlenQuellen } from '@/data/laender/kennzahlen'

export const metadata: Metadata = buildMetadata({
  title: withBrand('Globus – die Weltwirtschaft zum Drehen'),
  description:
    'Ein drehbarer Globus mit Wirtschaftsleistung, Einwohnern, BIP pro Kopf, Staatsverschuldung und Vermögen – samt den Indizes und Aktien jedes Landes.',
  path: '/globus',
  ogTitle: 'Der Globus: Weltwirtschaft zum Drehen',
})

export default async function GlobusPage() {
  const [laender, abdeckung, uebernational, relatedTopics] = await Promise.all([
    getLaender(),
    getAbdeckung(),
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
          /*
            Die Abdeckung wird ohnehin berechnet – bisher nur für die
            Kopfzeile. Sie gehört an jede einzelne Kennzahl: Wer „Gehälter“
            wählt und eine überwiegend graue Karte sieht, soll den Grund
            danebenstehen haben.
          */
          metriken={metriken.map((metrik) => ({
            ...metrik,
            belegt: abdeckung[metrik.id],
          }))}
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
          Kurz, aber die Namen bleiben.

          Die TopoJSON-Umsetzung der Kartengeometrie steht unter der
          ISC-Lizenz, die Weltbank stellt ihre Reihen unter CC BY 4.0 – in
          beiden Fällen ist die Namensnennung Bedingung der Nutzung und nicht
          Höflichkeit. CC BY lässt ausdrücklich zu, die Angaben auf einer eigenen
          Seite zu bündeln und dorthin zu verweisen; die Namen selbst stehen
          deshalb weiterhin hier, alles Weitere unter /quellen.
        */}
        <section aria-labelledby="quellen" className="border-border mt-14 border-t pt-6">
          <h2
            id="quellen"
            className="text-fg-subtle text-xs font-semibold tracking-wide uppercase"
          >
            Daten und Karte
          </h2>
          <p className="text-fg-subtle mt-2 max-w-3xl text-sm leading-relaxed">
            Wirtschaftsleistung und Einwohner: {WELTBANK_QUELLE.label} (CC BY 4.0),
            Bezugsjahr {WELTBANK_JAHR}. Weitere Kennzahlen von IWF, Eurostat und OECD.
            Karte: Natural Earth (gemeinfrei), TopoJSON-Umsetzung{' '}
            <code className="text-xs">world-atlas</code> unter ISC-Lizenz. Jeder Wert
            trägt in der Detailtafel seinen eigenen Zeitraum und seine eigene Quelle;
            Herkunft, Abgrenzung und Abrufdatum aller Reihen stehen unter{' '}
            <Link href="/quellen" className="underline underline-offset-2">
              Quellen
            </Link>
            .
          </p>

          {/*
            Die Güte der Schätzung gehört auf die Seite, nicht nur in den Code.

            Ein geschätzter Wert ohne Angabe, wie weit er danebenliegt, ist eine
            Behauptung. Die Zahlen kommen aus derselben Rechnung, die die
            Schätzung erzeugt – getippt wäre der Fehler beim nächsten Datenstand
            falsch, und zwar unbemerkt.
          */}
          {lohnSchaetzung.modell && lohnSchaetzung.fehlerProzent !== null && (
            <p className="text-fg-subtle mt-3 max-w-3xl text-sm leading-relaxed">
              <strong className="text-fg-muted font-semibold">
                Zu Gehalt und Vermögen:
              </strong>{' '}
              Die OECD erhebt beide nur bei ihren Mitgliedern – den Lohn für{' '}
              {lohnSchaetzung.modell?.beobachtungen ?? 0} Länder, das Vermögen für{' '}
              {`${vermoegenSchaetzung.modell?.beobachtungen ?? 0}. `}
              Bei allen übrigen steht dort eine{' '}
              <strong className="text-fg-muted font-semibold">Schätzung</strong> aus der
              Wirtschaftsleistung je Kopf. Lässt man ein Land mit gemessenem Wert aus der
              Rechnung und schätzt es aus den übrigen, liegt das Ergebnis beim Lohn
              typischerweise {formatNumber(lohnSchaetzung.fehlerProzent ?? 0, 1)} Prozent
              daneben, beim Vermögen{' '}
              {formatNumber(vermoegenSchaetzung.fehlerProzent ?? 0, 1)} – dort hängt der
              Wert stärker an Wohneigentum und Rentensystem als am Einkommen, und die
              gemessenen Länder sind durchweg wohlhabend. In der Detailtafel ist jeder
              geschätzte Wert als solcher ausgewiesen; wo ein gemessener vorliegt, gilt
              immer er. Für die{' '}
              <strong className="text-fg-muted font-semibold">Staatsverschuldung</strong>{' '}
              wird ausdrücklich nicht geschätzt: Sie hängt nicht am Wohlstand – Japan ist
              reich und hoch verschuldet, Norwegen reich und kaum. Das Bestimmtheitsmaß
              liegt bei 0,01, und eine Zahl daraus wäre keine Ableitung, sondern eine
              Erfindung.
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
          Kurz, aber die Namen bleiben.

          Die TopoJSON-Umsetzung der Kartengeometrie steht unter der
          ISC-Lizenz, die Weltbank stellt ihre Reihen unter CC BY 4.0 – in
          beiden Fällen ist die Namensnennung Bedingung der Nutzung und nicht
          Höflichkeit. CC BY lässt ausdrücklich zu, die Angaben auf einer eigenen
          Seite zu bündeln und dorthin zu verweisen; die Namen selbst stehen
          deshalb weiterhin hier, alles Weitere unter /quellen.
        */}
        <section aria-labelledby="quellen" className="border-border mt-14 border-t pt-6">
          <h2
            id="quellen"
            className="text-fg-subtle text-xs font-semibold tracking-wide uppercase"
          >
            Daten und Karte
          </h2>
          <p className="text-fg-subtle mt-2 max-w-3xl text-sm leading-relaxed">
            Wirtschaftsleistung und Einwohner: {WELTBANK_QUELLE.label} (CC BY 4.0),
            Bezugsjahr {WELTBANK_JAHR}. Weitere Kennzahlen von IWF, Eurostat und OECD.
            Karte: Natural Earth (gemeinfrei), TopoJSON-Umsetzung{' '}
            <code className="text-xs">world-atlas</code> unter ISC-Lizenz. Jeder Wert
            trägt in der Detailtafel seinen eigenen Zeitraum und seine eigene Quelle;
            Herkunft, Abgrenzung und Abrufdatum aller Reihen stehen unter{' '}
            <Link href="/quellen" className="underline underline-offset-2">
              Quellen
            </Link>
            .
          </p>

          {/*
            Die Güte der Schätzung gehört auf die Seite, nicht nur in den Code.

            Ein geschätzter Wert ohne Angabe, wie weit er danebenliegt, ist eine
            Behauptung. Die Zahlen kommen aus derselben Rechnung, die die
            Schätzung erzeugt – getippt wäre der Fehler beim nächsten Datenstand
            falsch, und zwar unbemerkt.
          */}
          {lohnSchaetzung.modell && lohnSchaetzung.fehlerProzent !== null && (
            <p className="text-fg-subtle mt-3 max-w-3xl text-sm leading-relaxed">
              <strong className="text-fg-muted font-semibold">
                Zu Gehalt und Vermögen:
              </strong>{' '}
              Die OECD erhebt beide nur bei ihren Mitgliedern – den Lohn für{' '}
              {lohnSchaetzung.modell?.beobachtungen ?? 0} Länder, das Vermögen für{' '}
              {`${vermoegenSchaetzung.modell?.beobachtungen ?? 0}. `}
              Bei allen übrigen steht dort eine{' '}
              <strong className="text-fg-muted font-semibold">Schätzung</strong> aus der
              Wirtschaftsleistung je Kopf. Lässt man ein Land mit gemessenem Wert aus der
              Rechnung und schätzt es aus den übrigen, liegt das Ergebnis beim Lohn
              typischerweise {formatNumber(lohnSchaetzung.fehlerProzent ?? 0, 1)} Prozent
              daneben, beim Vermögen{' '}
              {formatNumber(vermoegenSchaetzung.fehlerProzent ?? 0, 1)} – dort hängt der
              Wert stärker an Wohneigentum und Rentensystem als am Einkommen, und die
              gemessenen Länder sind durchweg wohlhabend. In der Detailtafel ist jeder
              geschätzte Wert als solcher ausgewiesen; wo ein gemessener vorliegt, gilt
              immer er. Für die{' '}
              <strong className="text-fg-muted font-semibold">Staatsverschuldung</strong>{' '}
              wird ausdrücklich nicht geschätzt: Sie hängt nicht am Wohlstand – Japan ist
              reich und hoch verschuldet, Norwegen reich und kaum. Das Bestimmtheitsmaß
              liegt bei 0,01, und eine Zahl daraus wäre keine Ableitung, sondern eine
              Erfindung.
            </p>
          )}
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
