import type { Metadata } from 'next'
import Link from 'next/link'

import { JsonLd } from '@/components/seo/JsonLd'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { Callout } from '@/components/ui/Callout'
import { PageHeader } from '@/components/ui/PageHeader'
import { Stat, StatGrid } from '@/components/ui/Stat'
import { formatDate, formatNumber, formatPercent } from '@/lib/format'
import { collectionPageSchema } from '@/lib/jsonld'
import {
  branchenDerGroessten,
  branchenNachGewicht,
  klumpenbefundWeltindex,
  unternehmenGezaehlt,
} from '@/lib/klumpenrisiko'
import { buildMetadata, withBrand } from '@/lib/seo'
import { weltindex } from '@/lib/weltindex'

export const metadata: Metadata = buildMetadata({
  // 152 Zeichen. Die Grenze liegt bei 160 (`scripts/paket-pruefen.ts`).
  title: withBrand('Klumpenrisiko im Weltindex'),
  description:
    'Der MSCI World hält 1.282 Werte – und die zehn größten tragen gut ein Viertel. Mit den Zahlen des Factsheets nachgerechnet statt behauptet.',
  path: '/maerkte/klumpenrisiko',
  ogTitle: 'Klumpenrisiko im Weltindex',
})

/**
 * „Breit gestreut“ als Behauptung, die man nachrechnen kann.
 *
 * ## Was die Seite nicht tut
 *
 * Sie nennt kein Konzentrationsmaß über den ganzen Index. Für einen
 * Herfindahl-Index oder eine „effektive Zahl der Werte“ bräuchte man alle
 * 1.282 Gewichte; das Blatt nennt zehn. Eine solche Kennzahl aus zehn Werten
 * sähe aus wie eine Messung und wäre eine Schätzung mit unbekanntem Fehler –
 * derselbe Fehler, an dem auf `/maerkte/waehrungen-im-weltindex` schon einmal
 * eine ganze Auswertung gescheitert ist.
 *
 * Gezeigt wird deshalb nur, was aus den vorhandenen Zahlen exakt folgt. Das
 * reicht: Die Antwort steht schon im Vergleich des größten Gewichts mit dem
 * Gleichgewichtsanteil.
 */
export default function KlumpenrisikoSeite() {
  const satz = weltindex()
  const befund = klumpenbefundWeltindex()
  const branchen = branchenNachGewicht()
  const unternehmen = unternehmenGezaehlt()
  const branchenOben = branchenDerGroessten()
  const kennzahlen = satz.kennzahlen

  /*
    Alphabet steht mit zwei Gattungen in der Liste. Die Zahl der Unternehmen
    ist deshalb kleiner als die Zahl der Werte – und das ist keine Fußnote,
    sondern der Punkt: Wer die Zeilen einzeln liest, unterschätzt Alphabet.
  */
  const mehrfach = unternehmen.filter((u) => u.gattungen > 1)

  /*
    Die beiden Branchen, die zusammen die Antwort tragen. Nicht fest
    hineingeschrieben: Sie kommen aus der Liste der größten Werte, damit der
    Satz beim nächsten Blatt nicht stehen bleibt, während sich die Zahlen
    darunter bewegen.
  */
  const obenAuf = branchenOben.slice(0, 2)
  const obenAufAnteilImIndex = obenAuf.reduce(
    (summe, b) => summe + (branchen.find((x) => x.branche === b.branche)?.anteil ?? 0),
    0
  )
  const obenAufAnzahl = obenAuf.reduce((summe, b) => summe + b.anzahl, 0)

  return (
    <>
      <PageHeader
        area="markets"
        eyebrow="Märkte"
        eyebrowIcon="chart"
        title="Wie breit ist „breit gestreut“?"
        lead="Ein Weltindex mit 1.282 Werten klingt nach Streuung, die keine Frage mehr offenlässt. Die Frage lässt sich nachrechnen – mit den Zahlen, die der Indexanbieter selbst veröffentlicht."
        breadcrumbs={
          <Breadcrumbs
            items={[{ name: 'Märkte', path: '/maerkte' }, { name: 'Klumpenrisiko' }]}
          />
        }
        meta={
          <>
            <span>{satz.quelle.label}</span>
            <span aria-hidden="true">·</span>
            <span>Stand {formatDate(satz.stand)}</span>
          </>
        }
      />

      <div className="fk-container py-12 sm:py-16">
        <StatGrid columns={3}>
          <Stat
            label={`Die ${befund.anzahlGenannte} größten Werte`}
            value={formatPercent(befund.anteilGenannte, 2)}
            tone="negative"
            hint={`${formatPercent(befund.anteilDerWerteProzent, 2)} der ${formatNumber(befund.anzahlWerte)} Werte tragen gut ein Viertel des Index.`}
          />
          <Stat
            label="Gleichgewicht wäre"
            value={formatPercent(befund.gleichgewichtProzent, 3)}
            hint={`So viel wöge jeder Wert, wenn alle gleich schwer wären: 100 geteilt durch ${formatNumber(befund.anzahlWerte)}.`}
          />
          <Stat
            label={`${befund.groesster.name} wiegt`}
            value={`${formatNumber(befund.faktorGroesster, 0)}-fach`}
            tone="negative"
            hint={`${formatPercent(befund.groesster.anteil, 2)} statt ${formatPercent(befund.gleichgewichtProzent, 3)} – so oft passt der Gleichgewichtsanteil in den größten Wert.`}
          />
        </StatGrid>

        <div className="text-fg-muted mt-10 max-w-3xl space-y-4 text-sm leading-relaxed">
          <p>
            Damit ist die Frage im Grunde beantwortet. Ein Index streut über 1.282
            Unternehmen, aber er streut sie nicht gleichmäßig: Er gewichtet nach
            Marktwert, und Marktwerte sind extrem ungleich verteilt. Das ist keine Panne,
            sondern die Bauart – ein nach Marktwert gewichteter Index soll den Markt
            abbilden, und der Markt sieht so aus.
          </p>
          <p>
            Was daraus folgt, ist trotzdem eine Entscheidung: Wer einen solchen Index
            kauft, kauft eine Streuung über 1.282 Werte{' '}
            <strong className="text-fg">und</strong> eine Wette auf eine Handvoll davon.
            Beides gehört zusammen gewusst.
          </p>
        </div>

        {/*
          Die zehn größten als Tabelle mit Balken, gemessen am Gleichgewicht.

          Der Balken zeigt nicht den Anteil am Index – der wäre bei 5 % ein
          Strich –, sondern das Vielfache des Gleichgewichtsanteils. Genau
          dieser Vergleich ist die Aussage der Seite, und ein Balken, der die
          Aussage nicht trägt, ist Schmuck.
        */}
        <div className="fk-card mt-10 p-5 sm:p-6">
          <h2 className="text-fg text-lg font-semibold">
            Die {befund.anzahlGenannte} größten Werte
          </h2>
          <p className="text-fg-muted mt-1.5 text-sm leading-relaxed">
            Der Balken zeigt das Vielfache des Gleichgewichtsanteils von{' '}
            {formatPercent(befund.gleichgewichtProzent, 3)} – nicht den Anteil am Index.
            Bei fünf Prozent wäre der ein Strich, und der Vergleich, um den es geht, wäre
            unsichtbar.
          </p>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[34rem] text-sm">
              <caption className="sr-only">
                Die größten Einzelwerte im {satz.quelle.label}
              </caption>
              <thead>
                <tr className="text-fg-subtle border-border border-b text-left text-xs uppercase">
                  <th scope="col" className="py-2 pr-4 font-semibold">
                    Wert
                  </th>
                  <th scope="col" className="py-2 pr-4 font-semibold">
                    Branche
                  </th>
                  <th scope="col" className="py-2 pr-4 text-right font-semibold">
                    Anteil
                  </th>
                  <th scope="col" className="py-2 text-right font-semibold">
                    Vielfaches
                  </th>
                </tr>
              </thead>
              <tbody>
                {(satz.groesste ?? []).map((wert) => {
                  const faktor = wert.anteil / befund.gleichgewichtProzent
                  const breite =
                    (faktor / (befund.groesster.anteil / befund.gleichgewichtProzent)) *
                    100
                  return (
                    <tr
                      key={wert.name}
                      className="border-border/60 border-b align-middle last:border-0"
                    >
                      <th
                        scope="row"
                        className="text-fg py-3 pr-4 text-left font-semibold"
                      >
                        {wert.name}
                        {wert.unternehmen ? (
                          <span className="text-fg-subtle block text-xs font-normal">
                            Gattung von {wert.unternehmen}
                          </span>
                        ) : null}
                      </th>
                      <td className="text-fg-muted py-3 pr-4">
                        <span className="block">{wert.branche}</span>
                        <span
                          aria-hidden="true"
                          className="bg-border mt-1.5 block h-1.5 max-w-full rounded-full"
                        >
                          <span
                            className="bg-markets block h-full rounded-full"
                            style={{ width: `${breite}%` }}
                          />
                        </span>
                      </td>
                      <td className="text-fg py-3 pr-4 text-right font-semibold tabular-nums">
                        {formatPercent(wert.anteil, 2)}
                      </td>
                      <td className="text-fg-muted py-3 text-right tabular-nums">
                        {formatNumber(faktor, 0)}×
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {mehrfach.length > 0 ? (
          <Callout variant="info" title="Zehn Werte sind nicht zehn Unternehmen">
            <p>
              {mehrfach.map((u) => u.name).join(', ')} steht mit{' '}
              {mehrfach[0].gattungen === 2 ? 'zwei' : formatNumber(mehrfach[0].gattungen)}{' '}
              Aktiengattungen in der Liste – stimmberechtigte und stimmrechtslose Anteile
              desselben Unternehmens, getrennt geführt, weil sie getrennt gehandelt
              werden. In der Tabelle stehen {formatNumber(befund.anzahlGenannte)} Zeilen,
              dahinter stecken {formatNumber(unternehmen.length)} Unternehmen.
            </p>
            <p className="mt-3">
              Für {mehrfach[0].name} heißt das:{' '}
              <strong className="text-fg">{formatPercent(mehrfach[0].anteil, 2)}</strong>{' '}
              statt der{' '}
              {(satz.groesste ?? [])
                .filter((w) => w.unternehmen === mehrfach[0].name)
                .map((w) => formatPercent(w.anteil, 2))
                .join(' und ')}
              , die einzeln dastehen. Wer die Zeilen einzeln liest, unterschätzt das
              Gewicht – ein Fehler, den die Liste selbst nahelegt.
            </p>
          </Callout>
        ) : null}

        {/* --------------------------------------------------- Die Branchen */}

        <div className="fk-card mt-10 p-5 sm:p-6">
          <h2 className="text-fg text-lg font-semibold">Und nach Branchen</h2>
          <p className="text-fg-muted mt-1.5 text-sm leading-relaxed">
            Dieselbe Frage eine Ebene höher. {obenAufAnzahl} der{' '}
            {formatNumber(befund.anzahlGenannte)} größten Werte gehören zu{' '}
            {obenAuf.map((b) => b.branche).join(' oder ')} – und diese beiden Branchen
            wiegen im ganzen Index{' '}
            <strong className="text-fg">{formatPercent(obenAufAnteilImIndex, 2)}</strong>.
          </p>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[26rem] text-sm">
              <caption className="sr-only">
                Branchengewichte im {satz.quelle.label}
              </caption>
              <thead>
                <tr className="text-fg-subtle border-border border-b text-left text-xs uppercase">
                  <th scope="col" className="py-2 pr-4 font-semibold">
                    Branche
                  </th>
                  <th scope="col" className="py-2 pr-4 font-semibold">
                    <span className="sr-only">Balken</span>
                  </th>
                  <th scope="col" className="py-2 text-right font-semibold">
                    Anteil
                  </th>
                </tr>
              </thead>
              <tbody>
                {branchen.map((b) => (
                  <tr
                    key={b.branche}
                    className="border-border/60 border-b align-middle last:border-0"
                  >
                    <th scope="row" className="text-fg py-3 pr-4 text-left font-medium">
                      {b.branche}
                    </th>
                    <td className="py-3 pr-4">
                      <span
                        aria-hidden="true"
                        className="bg-border block h-1.5 w-full rounded-full"
                      >
                        <span
                          className="bg-markets block h-full rounded-full"
                          style={{ width: `${(b.anteil / branchen[0].anteil) * 100}%` }}
                        />
                      </span>
                    </td>
                    <td className="text-fg py-3 text-right font-semibold tabular-nums">
                      {formatPercent(b.anteil, 2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ------------------------------------- Der Blick, den niemand sucht */}

        {kennzahlen ? (
          <Callout variant="info" title="Mittelwert gegen Median – dieselbe Auskunft">
            <p>
              Der durchschnittliche Indexwert ist{' '}
              {formatNumber(kennzahlen.mittelMioUsd / 1000, 1)} Mrd US-Dollar schwer, der
              mittlere nur {formatNumber(kennzahlen.medianMioUsd / 1000, 1)} Mrd. Der
              Durchschnitt liegt also{' '}
              <strong className="text-fg">
                {formatNumber(befund.mittelZuMedian, 1)}-mal
              </strong>{' '}
              so hoch wie die Mitte.
            </p>
            <p className="mt-3">
              Das ist die Konzentration noch einmal, aus einer Zahl, die niemand dafür
              ansieht: Ein Mittelwert weit über dem Median heißt immer, dass wenige sehr
              große Fälle ihn hochziehen. Zwischen dem größten Wert (
              {formatNumber(kennzahlen.groessterMioUsd / 1000, 0)} Mrd) und dem kleinsten
              ({formatNumber(kennzahlen.kleinsterMioUsd / 1000, 1)} Mrd) liegt der Faktor{' '}
              {formatNumber(kennzahlen.groessterMioUsd / kennzahlen.kleinsterMioUsd, 0)}.
            </p>
          </Callout>
        ) : null}

        <Callout variant="warning" title="Was hier bewusst nicht steht">
          <p>
            Kein Herfindahl-Index, keine „effektive Zahl der Werte“, kein
            Gini-Koeffizient. Solche Maße brauchen{' '}
            <strong className="text-fg">alle</strong> {formatNumber(befund.anzahlWerte)}{' '}
            Gewichte; das Factsheet nennt {formatNumber(befund.anzahlGenannte)}. Aus zehn
            Werten gerechnet sähen sie aus wie eine Messung und wären eine Schätzung mit
            unbekanntem Fehler.
          </p>
          <p className="mt-3">
            Der Vergleich oben braucht sie nicht: Dass der größte Wert das{' '}
            {formatNumber(befund.faktorGroesster, 0)}-Fache des Gleichgewichtsanteils
            wiegt, folgt aus zwei Zahlen, die beide im Blatt stehen.
          </p>
        </Callout>

        <div className="text-fg-muted mt-12 max-w-3xl space-y-4 text-sm leading-relaxed">
          <p>
            <strong className="text-fg">Quelle:</strong> {satz.quelle.label} zum{' '}
            {formatDate(satz.stand)}. Der Index umfasst laut Blatt{' '}
            {formatNumber(befund.anzahlWerte)} Werte aus{' '}
            {formatNumber(kennzahlen?.laender ?? 0)} Industrieländern und deckt darin rund{' '}
            {formatNumber(kennzahlen?.abdeckungProzent ?? 0)} Prozent der
            streubesitzbereinigten Marktkapitalisierung ab.{' '}
            <a
              href={satz.quelle.url}
              target="_blank"
              rel="noreferrer"
              className="hover:text-markets underline underline-offset-2"
            >
              Zum Factsheet
            </a>
          </p>
          <p>
            Wie einseitig dieselbe Aufstellung nach{' '}
            <Link
              href="/maerkte/waehrungen-im-weltindex"
              className="hover:text-markets underline underline-offset-2"
            >
              Währungen
            </Link>{' '}
            aussieht, steht nebenan. Warum Streuung überhaupt hilft und ab wann kaum noch,
            erklärt das Lernthema{' '}
            <Link
              href="/lernen/aktien-laender-branchen"
              className="hover:text-markets underline underline-offset-2"
            >
              Aktien: Länder und Branchen
            </Link>
            .
          </p>
        </div>
      </div>

      <JsonLd
        data={collectionPageSchema({
          name: 'Klumpenrisiko im Weltindex',
          description:
            'Wie ungleich ein nach Marktwert gewichteter Weltindex verteilt ist – nachgerechnet aus den Zahlen des Factsheets.',
          path: '/maerkte/klumpenrisiko',
          items: (satz.groesste ?? []).map((wert) => ({
            name: `${wert.name}: ${wert.anteil.toFixed(2)} %`,
            path: '/maerkte/klumpenrisiko',
          })),
        })}
      />
    </>
  )
}
