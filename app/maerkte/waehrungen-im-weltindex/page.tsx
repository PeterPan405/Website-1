import type { Metadata } from 'next'
import Link from 'next/link'

import { JsonLd } from '@/components/seo/JsonLd'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Callout } from '@/components/ui/Callout'
import { PageHeader } from '@/components/ui/PageHeader'
import { Stat, StatGrid } from '@/components/ui/Stat'
import {
  WELTINDEX_GROESSTE,
  WELTINDEX_HERKUNFT,
  WELTINDEX_LAENDER,
} from '@/data/weltindex'
import { formatDate, formatNumber, formatPercent } from '@/lib/format'
import { collectionPageSchema } from '@/lib/jsonld'
import { buildMetadata, withBrand } from '@/lib/seo'
import { dollaranteil, gewichtGroesste, waehrungsanteile } from '@/lib/weltindex'

export const metadata: Metadata = buildMetadata({
  // 154 Zeichen. Die Grenze liegt bei 160 (`scripts/paket-pruefen.ts`).
  title: withBrand('Wie viel Dollar in „weltweit" steckt'),
  description:
    'Ein Weltdepot ist zu fast drei Vierteln eine Dollarposition – mit den Ländergewichten des MSCI World aus dem Factsheet des Indexanbieters, nicht geschätzt.',
  path: '/maerkte/waehrungen-im-weltindex',
  ogTitle: 'Wie viel Dollar in „weltweit" steckt',
})

/**
 * Die Währungsaufteilung eines Weltdepots.
 *
 * ## Warum diese Seite mit einer Absage anfängt
 *
 * Weil der naheliegende Weg falsch war. Aus dem eigenen Kurskatalog gerechnet
 * kam ein Dollaranteil von 86,4 % heraus – und die Zahl maß die Datenlücke,
 * nicht den Markt: Aktienzahlen liegen für amerikanische Titel zu 95 % vor,
 * für japanische zu 6 %. Das steht auf der Seite, weil es die Antwort
 * einordnet.
 *
 * ## Was die Seite zeigt
 *
 * Die Ländergewichte aus dem Factsheet des Indexanbieters, zu Währungen
 * zusammengefasst – und die Sammelposition „Übrige" bleibt stehen, statt
 * verteilt zu werden.
 */
export default function WaehrungenImWeltindexSeite() {
  const anteile = waehrungsanteile()
  const usd = dollaranteil()
  const japan = WELTINDEX_LAENDER.find((l) => l.land === 'Japan')?.prozent ?? 0

  return (
    <>
      <PageHeader
        area="markets"
        eyebrow="Märkte"
        eyebrowIcon="chart"
        title="Wie viel Dollar in „weltweit“ steckt"
        lead="„Weltweit gestreut“ klingt nach Ausgewogenheit. Tatsächlich notiert der größte Teil in einer einzigen Währung – und wer den Anteil nicht kennt, hält eine Wette, die er nie eingegangen ist."
        breadcrumbs={
          <Breadcrumbs
            items={[
              { name: 'Märkte', path: '/maerkte' },
              { name: 'Währungen im Weltindex' },
            ]}
          />
        }
        meta={
          <>
            <span>{WELTINDEX_HERKUNFT.index}</span>
            <span aria-hidden="true">·</span>
            <span>Stand {formatDate(WELTINDEX_HERKUNFT.stand)}</span>
          </>
        }
      />

      <div className="fk-container py-12 sm:py-16">
        <StatGrid columns={3}>
          <Stat
            label="Anteil in US-Dollar"
            value={formatPercent(usd, 2)}
            tone="negative"
            hint="Amerikanische Aktien notieren in Dollar – das ist die Währung, deren Schwankung im Depot ankommt."
          />
          <Stat
            label="Zweitgrößte Währung"
            value={`${anteile[1]?.bezeichnung} ${formatPercent(anteile[1]?.prozent ?? 0, 2)}`}
            hint="Der Abstand ist die eigentliche Auskunft."
          />
          <Stat
            label="Die zwei größten Unternehmen"
            value={formatPercent(gewichtGroesste(), 2)}
            tone="negative"
            hint={`${WELTINDEX_GROESSTE.map((e) => e.name).join(' und ')} zusammen – mehr als ganz Japan mit ${formatPercent(japan, 2)}.`}
          />
        </StatGrid>

        {/*
          Eine Tabelle mit Balken, keine Torte.

          Bei einem Anteil von 72 zu 5,7 zu 3,6 Prozent ist ein Kreis
          unlesbar: Alles außer dem größten Stück wird zum Strich. Balken
          nebeneinander lassen sich vergleichen, auch wenn einer zwanzigmal so
          lang ist wie der nächste.
        */}
        <div className="fk-card mt-10 p-5 sm:p-6">
          <h2 className="text-fg text-lg font-semibold">Die Währungen im Einzelnen</h2>
          <p className="text-fg-muted mt-1.5 text-sm leading-relaxed">
            Aus den Ländergewichten des Factsheets. Für die einzeln genannten Länder ist
            die Zuordnung eindeutig; die Sammelposition bleibt stehen, weil das Blatt sie
            nicht aufschlüsselt.
          </p>

          <table className="mt-6 w-full text-sm">
            <caption className="sr-only">
              Währungsanteile im {WELTINDEX_HERKUNFT.index}
            </caption>
            <thead>
              <tr className="text-fg-subtle border-border border-b text-left text-xs uppercase">
                <th scope="col" className="py-2 pr-4 font-semibold">
                  Währung
                </th>
                <th scope="col" className="py-2 pr-4 font-semibold">
                  Länder
                </th>
                <th scope="col" className="py-2 text-right font-semibold">
                  Anteil
                </th>
              </tr>
            </thead>
            <tbody>
              {anteile.map((anteil) => (
                <tr
                  key={anteil.bezeichnung}
                  className="border-border/60 border-b align-middle last:border-0"
                >
                  <th scope="row" className="text-fg py-3 pr-4 text-left font-semibold">
                    {anteil.bezeichnung}
                  </th>
                  <td className="text-fg-muted py-3 pr-4">
                    <span className="block">{anteil.laender.join(', ')}</span>
                    <span
                      aria-hidden="true"
                      className="bg-border mt-1.5 block h-1.5 max-w-full rounded-full"
                    >
                      <span
                        className={`block h-full rounded-full ${
                          anteil.waehrung === null ? 'bg-border-strong' : 'bg-markets'
                        }`}
                        style={{ width: `${anteil.prozent}%` }}
                      />
                    </span>
                  </td>
                  <td className="text-fg py-3 text-right font-semibold tabular-nums">
                    {formatPercent(anteil.prozent, 2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Callout variant="info" title="Notierungswährung ist nicht Währungsrisiko">
          <p>
            Ein Schweizer Konzern notiert in Franken und verdient sein Geld in Dollar; ein
            amerikanischer Zulieferer notiert in Dollar und verkauft nach Asien. Die
            Notierungswährung ist die, in der der Kurs steht – und damit die, deren
            Schwankung unmittelbar im Depot ankommt. Wie viel Dollargeschäft in den
            Unternehmen selbst steckt, ist eine andere und schwerere Frage, und diese
            Aufstellung beantwortet sie nicht.
          </p>
          <p className="mt-3">
            Praktisch heißt das: Der Dollaranteil oben ist die Untergrenze der
            Dollarabhängigkeit, nicht ihre Obergrenze.
          </p>
        </Callout>

        <Callout
          variant="warning"
          title="Warum hier nicht unsere eigenen Kurse gerechnet werden"
        >
          <p>
            Der naheliegende Weg wäre, den Marktwert aller hier geführten Aktien zu
            addieren – Aktienzahl mal Kurs – und nach Währung zu sortieren. Das ist
            gerechnet worden und hat <strong className="text-fg">86,4 Prozent</strong>{' '}
            Dollar ergeben.
          </p>
          <p className="mt-3">
            Die Zahl war falsch, und zwar auf die gefährliche Art: Aktienzahlen liegen für
            461 der 1.029 geführten Aktien vor, und die Lücke fällt fast vollständig
            außerhalb der USA an – 95 Prozent Abdeckung bei amerikanischen Titeln, 28 bei
            europäischen, 6 bei japanischen, 4 bei indischen. Die 86,4 Prozent hätten also
            unsere Datenabdeckung gemessen und ausgesehen wie eine Eigenschaft des
            Marktes.
          </p>
          <p className="mt-3">
            Deshalb stehen hier die Zahlen des Indexanbieters. Sie decken weniger ab – die
            Sammelposition bleibt unaufgeschlüsselt –, aber was sie sagen, stimmt.
          </p>
        </Callout>

        <div className="text-fg-muted mt-12 max-w-3xl space-y-4 text-sm leading-relaxed">
          <p>
            <strong className="text-fg">Quelle:</strong> {WELTINDEX_HERKUNFT.quelle} zum{' '}
            {formatDate(WELTINDEX_HERKUNFT.stand)}, abgerufen am{' '}
            {formatDate(WELTINDEX_HERKUNFT.abgerufenAm)}. Der Index umfasst laut Blatt
            einen Marktwert von{' '}
            {formatNumber(WELTINDEX_HERKUNFT.marktwertMioUsd / 1_000_000, 1)} Billionen
            US-Dollar.{' '}
            <a
              href={WELTINDEX_HERKUNFT.url}
              target="_blank"
              rel="noreferrer"
              className="hover:text-markets underline underline-offset-2"
            >
              Zum Factsheet
            </a>
          </p>
          <p>
            Was die Kaufkraft einer Währung über die Zeit mit dem Wechselkurs macht,
            rechnet der{' '}
            <Link
              href="/rechner/kaufkraft"
              className="hover:text-markets underline underline-offset-2"
            >
              Kaufkraftrechner
            </Link>
            . Warum „nominal“ und „real“ dabei nicht dasselbe sind, steht bei den{' '}
            <Link
              href="/verwechslungen#nominal-real"
              className="hover:text-markets underline underline-offset-2"
            >
              Verwechslungen
            </Link>
            .
          </p>
        </div>
      </div>

      <JsonLd
        data={collectionPageSchema({
          name: 'Wie viel Dollar in „weltweit" steckt',
          description:
            'Die Währungsaufteilung eines Weltdepots aus den Ländergewichten des MSCI World.',
          path: '/maerkte/waehrungen-im-weltindex',
          items: anteile.map((a) => ({
            name: `${a.bezeichnung}: ${a.prozent.toFixed(2)} %`,
            path: '/maerkte/waehrungen-im-weltindex',
          })),
        })}
      />
    </>
  )
}
