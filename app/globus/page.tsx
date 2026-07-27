import type { Metadata } from 'next'
import Link from 'next/link'

import { GlobusAnsicht } from '@/components/globus/GlobusAnsicht'
import { Laendertabelle } from '@/components/globus/Laendertabelle'
import { TopicLinkList } from '@/components/learn/TopicLinkList'
import { JsonLd } from '@/components/seo/JsonLd'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Callout } from '@/components/ui/Callout'
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
            <span>{laender.length} Länder</span>
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
        <section aria-labelledby="lesen" className="mt-16 max-w-3xl">
          <h2 id="lesen" className="text-fg text-2xl font-bold">
            Was diese Karte zeigt – und was nicht
          </h2>

          <p className="text-fg-muted mt-4 leading-relaxed">
            Eine eingefärbte Weltkarte wirkt vollständig, auch wenn sie es nicht ist.
            Deshalb drei Dinge vorweg, die beim Lesen den Unterschied machen.
          </p>

          <h3 className="text-fg mt-8 text-lg font-semibold sm:text-xl">
            Die Farbe zeigt den Rang, nicht den Abstand
          </h3>
          <p className="text-fg-muted mt-3 leading-relaxed">
            Die Klassen sind so geschnitten, dass in jeder gleich viele Länder liegen. Das
            ist bei diesen Größenordnungen die einzige brauchbare Wahl: Die größte
            Volkswirtschaft ist rund zwanzigtausendmal so groß wie die kleinste. Bei
            gleich breiten Klassen läge alles außer zwei Ländern in derselben Farbe – die
            Karte wäre hübsch und leer. Der Preis ist, dass zwei benachbarte Farbstufen
            mal ein paar Milliarden und mal ein paar Tausend auseinanderliegen. Die genaue
            Zahl steht deshalb bei jedem Land im Klartext.
          </p>

          <h3 className="text-fg mt-8 text-lg font-semibold sm:text-xl">
            Grau heißt „keine Angabe“, nicht „null“
          </h3>
          <p className="text-fg-muted mt-3 leading-relaxed">
            Wirtschaftsleistung und Einwohnerzahl liegen für {abdeckung.bip} Länder vor
            und werden automatisch aus den Reihen der Weltbank geholt. Für
            Staatsverschuldung, Durchschnittsgehalt und Vermögen gibt es keine
            vergleichbar offene Datei – diese Werte sind von Hand gepflegt und decken
            bisher {abdeckung.schuldenquote}, {abdeckung.durchschnittsgehalt}
            beziehungsweise {abdeckung.medianvermoegen} Länder ab. Wo nichts hinterlegt
            ist, steht das auch so da. Ein Land ohne Datensatz darf nicht aussehen wie ein
            Land ohne Schulden.
          </p>

          <h3 className="text-fg mt-8 text-lg font-semibold sm:text-xl">
            Die Kurse zeigen unsere Auswahl, nicht die Welt
          </h3>
          <p className="text-fg-muted mt-3 leading-relaxed">
            {mitKursen} Länder haben hier Kurse – der Rest der Welt nicht. Das sagt nichts
            über diese Länder und alles über die Auswahl auf dieser Seite: Sie folgt dem,
            was für ein deutschsprachiges Publikum erreichbar und gebräuchlich ist. Wer
            die Kennzahl „Kurse auf dieser Seite“ einschaltet, sieht genau diese
            Schlagseite.
          </p>

          {uebernational.length > 0 && (
            <Callout
              variant="info"
              title="Zwei Kurse gehören keinem Land"
              className="mt-6"
            >
              {uebernational.map((eintrag) => (
                <p key={eintrag.kurs.symbol}>
                  <Link
                    href={`/maerkte/${eintrag.kurs.symbol}`}
                    className="text-brand font-medium underline underline-offset-2"
                  >
                    {eintrag.kurs.name}
                  </Link>{' '}
                  – {eintrag.begruendung}
                </p>
              ))}
            </Callout>
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
        <section aria-labelledby="quellen" className="mt-16 max-w-3xl">
          <h2 id="quellen" className="text-fg text-2xl font-bold">
            Herkunft der Daten
          </h2>
          <dl className="mt-6 space-y-5">
            <div>
              <dt className="text-fg text-sm font-semibold">
                Bruttoinlandsprodukt und Einwohner – Bezugsjahr {WELTBANK_JAHR}
              </dt>
              <dd className="text-fg-muted mt-1 text-sm leading-relaxed">
                {WELTBANK_QUELLE.label}. Beide Reihen stammen aus demselben Jahr, damit
                das BIP pro Kopf eine gültige Division ist. Abgerufen von{' '}
                <code className="text-fg-subtle text-xs">scripts/laender-abrufen.ts</code>
                .
              </dd>
            </div>
            {quellen.map((quelle) => (
              <div key={quelle.url}>
                <dt className="text-fg text-sm font-semibold">
                  <a
                    href={quelle.url}
                    rel="noopener noreferrer nofollow"
                    target="_blank"
                    className="text-brand underline underline-offset-2"
                  >
                    {quelle.label}
                  </a>
                </dt>
                <dd className="text-fg-muted mt-1 text-sm leading-relaxed">
                  {quelle.abgrenzung}
                </dd>
              </div>
            ))}
          </dl>

          <Callout
            variant="warning"
            title="Warum die Abdeckung lückenhaft ist"
            className="mt-6"
          >
            <p>
              Schuldenquoten, Gehälter und Vermögen veröffentlichen IWF, Eurostat, OECD
              und UBS in Berichten und hinter Abfragemasken, nicht als offene Datei. Jeder
              hier eingetragene Wert trägt deshalb seinen eigenen Zeitraum und seine
              eigene Quelle – und es sind nur die, die sich belegen ließen.
            </p>
            <p>
              Besonders bei der Staatsverschuldung ist das keine Formalie: Eine Quote nach
              Maastricht-Abgrenzung (Eurostat) und eine nach IWF-Abgrenzung sind
              verschiedene Größen. Für dieselben USA unterscheiden sie sich um mehrere
              Prozentpunkte. Sie unkommentiert in eine Spalte zu schreiben wäre bequem und
              falsch.
            </p>
            <p>
              Kartengeometrie: Natural Earth (gemeinfrei), TopoJSON-Umsetzung{' '}
              <code className="text-xs">world-atlas</code> unter ISC-Lizenz.
            </p>
          </Callout>
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
