import type { Metadata } from 'next'

import { Jahresspannentafel } from '@/components/markets/Jahresspannentafel'
import { JsonLd } from '@/components/seo/JsonLd'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Callout } from '@/components/ui/Callout'
import { PageHeader } from '@/components/ui/PageHeader'
import { Stat, StatGrid } from '@/components/ui/Stat'
import { formatPercent } from '@/lib/format'
import { jahresspanne } from '@/lib/jahresspanne'
import { collectionPageSchema } from '@/lib/jsonld'
import { getQuotes } from '@/lib/markets'
import { buildMetadata, withBrand } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: withBrand('52 Wochen: Abstand zum Hoch'),
  // 151 Zeichen. Die Grenze liegt bei 160 (`scripts/paket-pruefen.ts`), und
  // sie ist hart: Ein längerer Text bricht den Bau, nicht nur die Vorschau.
  description:
    'Wo jeder Wert in seiner Zwölfmonatsspanne steht: Abstand zum Hoch, Abstand zum Tief und die Position dazwischen – sortierbar, für alle geführten Werte.',
  path: '/maerkte/52-wochen',
  ogTitle: 'Wo steht welcher Wert in seinem Jahr?',
})

export default async function Jahresspannenseite() {
  const quotes = await getQuotes()
  const werte = jahresspanne(quotes)

  /*
    Drei Zahlen, die die Tabelle nicht auf einen Blick hergibt.

    „Am Hoch“ ist mit einem halben Prozent Toleranz gerechnet: Exakt auf dem
    Jahreshoch zu schließen ist ein Zufall, „so gut wie am Hoch“ die Aussage,
    die jemand meint.
  */
  const amHoch = werte.filter((wert) => wert.abstandHoch > -0.5).length
  const amTief = werte.filter((wert) => wert.abstandTief < 0.5).length
  const mitSpanne = werte.filter((wert) => wert.position !== null)
  const mittlerePosition =
    mitSpanne.length > 0
      ? mitSpanne.reduce((summe, wert) => summe + (wert.position ?? 0), 0) /
        mitSpanne.length
      : 0

  return (
    <>
      <PageHeader
        area="markets"
        eyebrow="52 Wochen"
        eyebrowIcon="chart"
        title="Wo steht welcher Wert in seinem Jahr?"
        lead="Jeder Kurs hat in den letzten zwölf Monaten ein Hoch und ein Tief gehabt. Diese Seite zeigt, wo er heute dazwischen steht – für alle geführten Werte nebeneinander, sortierbar."
        breadcrumbs={
          <Breadcrumbs
            items={[{ name: 'Märkte', path: '/maerkte' }, { name: '52 Wochen' }]}
          />
        }
        meta={
          <>
            <span>{werte.length} Werte</span>
            <span aria-hidden="true">·</span>
            <span>Zwölf Monate rollierend</span>
          </>
        }
      />

      <div className="fk-container py-12 sm:py-16">
        <StatGrid>
          <Stat
            label="So gut wie am Jahreshoch"
            value={String(amHoch)}
            hint="Weniger als ein halbes Prozent darunter"
          />
          <Stat
            label="So gut wie am Jahrestief"
            value={String(amTief)}
            hint="Weniger als ein halbes Prozent darüber"
          />
          <Stat
            label="Mittlere Position"
            value={formatPercent(mittlerePosition, 0)}
            hint="Ungewichtet über alle Werte mit einer Spanne"
          />
        </StatGrid>

        <Callout variant="info" className="mt-8" title="Was diese Zahlen nicht sagen">
          <p>
            Ein Kurs dicht am Jahreshoch ist weder teuer noch billig. Er ist dicht am
            Jahreshoch. Beide gängigen Deutungen – „nahe am Hoch, also Aufwärtstrend“ und
            „nahe am Hoch, also überkauft“ – werden regelmäßig behauptet, und die Zahl
            selbst trägt keine von beiden.
          </p>
          <p className="mt-3">
            Die Spanne hängt außerdem am Zeitfenster: Zwölf Monate sind eine Konvention,
            keine Eigenschaft des Marktes. Ein Wert, der vor dreizehn Monaten deutlich
            höher stand, sieht hier aus, als stünde er am Hoch.
          </p>
        </Callout>

        <section aria-labelledby="tafel" className="mt-12">
          <h2 id="tafel" className="text-fg text-2xl font-bold">
            Alle Werte
          </h2>
          <p className="text-fg-muted mt-2 max-w-3xl leading-relaxed">
            <strong className="text-fg">Abstand zum Hoch</strong> sagt, wie weit es von
            hier bis zum Jahreshoch wäre.{' '}
            <strong className="text-fg">Position in der Spanne</strong> sagt, wo der Kurs
            zwischen Tief und Hoch steht. Die beiden sind nicht dasselbe: Zwei Werte,
            beide zehn Prozent unter ihrem Hoch, stehen bei enger Spanne im unteren
            Drittel und bei weiter Spanne im oberen Fünftel.
          </p>

          <Jahresspannentafel werte={werte} className="mt-8" />
        </section>

        {/*
          Keine Stand-Zeile für die Seite – dieselbe Entscheidung wie auf der
          Marktübersicht. Sie nennte den Zeitpunkt des Baus, nicht den der
          Kurse, und wäre damit die einzige veraltete Angabe auf einer Seite
          voller frischer Zahlen. Der Stand steht in der Tabelle, je Zeile.
        */}
      </div>

      <JsonLd
        data={collectionPageSchema({
          name: '52 Wochen: Abstand zum Hoch',
          description:
            'Wo jeder Wert in seiner Zwölfmonatsspanne steht – Abstand zum Hoch, Abstand zum Tief und die Position dazwischen.',
          path: '/maerkte/52-wochen',
          items: werte.slice(0, 20).map((wert) => ({
            name: wert.name,
            path: `/maerkte/${wert.symbol}`,
          })),
        })}
      />
    </>
  )
}
