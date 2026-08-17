'use client'

import { useMemo, useState } from 'react'

import {
  CalculatorGrid,
  HeadlineResult,
  InputPanel,
  ResultPanel,
} from '@/components/calculators/CalculatorPanels'
import { useErgebnisbericht } from '@/components/calculators/ErgebnisDownload'
import { NumberField } from '@/components/calculators/NumberField'
import { Callout } from '@/components/ui/Callout'
import { Stat, StatGrid } from '@/components/ui/Stat'
import { getCalculatorDefinition } from '@/data/calculators'
import { entnahmeplan, MAX_JAHRE } from '@/lib/entnahme'
import { formatCurrency, formatNumber, formatPercent } from '@/lib/format'

/**
 * Der umgekehrte Sparplan: Wie lange trägt ein Kapital, aus dem gelebt wird?
 *
 * ## Warum die Entnahme in heutiger Kaufkraft eingegeben wird
 *
 * Weil das die Zahl ist, die jemand kennt: „Ich brauche 2.000 € im Monat" heißt
 * 2.000 € von **heute**. Ein Rechner, der diesen Betrag dreißig Jahre lang
 * gleich lässt, rechnet eine Kürzung ein, die niemand beschlossen hat – und
 * liefert eine Reichweite, die zu freundlich ist.
 *
 * Deshalb steht die nominale Entnahme des letzten Jahres als eigene Zahl
 * daneben. Sie ist der Teil, der die meisten überrascht.
 *
 * ## Warum drei Zahlen und nicht eine
 *
 * Die Reichweite allein beantwortet nur die halbe Frage. Daneben stehen die
 * Entnahme, die das Kapital **erhalten** würde, und die, die es über die
 * gewünschte Dauer genau aufbraucht. Erst zu dritt zeigen sie, wo die eigene
 * Eingabe steht – und wie weit man von der anderen Seite entfernt ist.
 */

const standard = {
  kapital: 500_000,
  entnahmeProMonat: 2_000,
  renditeProzent: 5,
  inflationProzent: 2,
  zieldauerJahre: 30,
}

export function Entnahmeplan() {
  const [kapital, setKapital] = useState(standard.kapital)
  const [entnahme, setEntnahme] = useState(standard.entnahmeProMonat)
  const [rendite, setRendite] = useState(standard.renditeProzent)
  const [inflation, setInflation] = useState(standard.inflationProzent)
  const [zieldauer, setZieldauer] = useState(standard.zieldauerJahre)

  const ergebnis = useMemo(
    () =>
      entnahmeplan({
        kapital,
        entnahmeProMonat: entnahme,
        renditeProzent: rendite,
        inflationProzent: inflation,
        zieldauerJahre: zieldauer,
      }),
    [kapital, entnahme, rendite, inflation, zieldauer]
  )

  const reichweiteText = ergebnis.dauerhaft
    ? 'trägt dauerhaft'
    : ergebnis.reichweiteJahre === null
      ? `über ${MAX_JAHRE} Jahre`
      : `${formatNumber(ergebnis.reichweiteJahre)} Jahre`

  /* Das letzte Jahr, in dem die volle Entnahme noch möglich war. */
  const letztesVolles =
    ergebnis.reichweiteJahre === null
      ? ergebnis.verlauf.at(-1)
      : (ergebnis.verlauf.at(-2) ?? ergebnis.verlauf.at(-1))

  useErgebnisbericht({
    titel: 'Entnahmeplan',
    pfad: '/rechner/entnahmeplan',
    annahmen: [
      { bezeichnung: 'Vorhandenes Kapital', wert: formatCurrency(kapital) },
      {
        bezeichnung: 'Gewünschte Entnahme monatlich',
        wert: formatCurrency(entnahme),
        hinweis: 'In heutiger Kaufkraft; steigt jedes Jahr mit der Inflation.',
      },
      { bezeichnung: 'Erwartete Rendite je Jahr', wert: formatPercent(rendite, 2) },
      { bezeichnung: 'Erwartete Inflation je Jahr', wert: formatPercent(inflation, 2) },
      {
        bezeichnung: 'Gewünschte Dauer',
        wert: `${formatNumber(zieldauer)} Jahre`,
      },
    ],
    ergebnisse: [
      {
        bezeichnung: 'Reichweite',
        wert: reichweiteText,
        hinweis: ergebnis.dauerhaft
          ? 'Die Entnahme bleibt unter dem realen Ertrag – das Kapital wächst trotzdem.'
          : 'Bis das Kapital aufgebraucht ist.',
      },
      {
        bezeichnung: 'Entnahmequote im ersten Jahr',
        wert: formatPercent(ergebnis.entnahmequoteProzent, 2),
      },
      {
        bezeichnung: 'Dauerhaft möglich',
        wert: formatCurrency(ergebnis.dauerhaftProMonat),
        hinweis: 'Monatlich, ohne das Kapital real zu verringern.',
      },
      {
        bezeichnung: `Möglich über ${formatNumber(zieldauer)} Jahre`,
        wert: formatCurrency(ergebnis.fuerZieldauerProMonat),
        hinweis: 'Monatlich, wenn am Ende nichts übrig bleiben soll.',
      },
      { bezeichnung: 'Realzins', wert: formatPercent(ergebnis.realzinsProzent, 2) },
    ],
    grenzen: getCalculatorDefinition('entnahmeplan')!.grenzen,
  })

  function zuruecksetzen() {
    setKapital(standard.kapital)
    setEntnahme(standard.entnahmeProMonat)
    setRendite(standard.renditeProzent)
    setInflation(standard.inflationProzent)
    setZieldauer(standard.zieldauerJahre)
  }

  return (
    <CalculatorGrid>
      <InputPanel onReset={zuruecksetzen}>
        <NumberField
          label="Vorhandenes Kapital"
          value={kapital}
          onChange={setKapital}
          min={0}
          max={20_000_000}
          suffix="€"
          hint="Was zu Beginn der Entnahme da ist – Depot, Tagesgeld, alles, woraus entnommen werden soll."
        />
        <NumberField
          label="Gewünschte Entnahme"
          value={entnahme}
          onChange={setEntnahme}
          min={0}
          max={100_000}
          suffix="€/Monat"
          hint="In heutiger Kaufkraft. Die Rechnung erhöht diesen Betrag jedes Jahr um die Inflation – sonst wäre es eine schleichende Kürzung."
        />
        <NumberField
          label="Gewünschte Dauer"
          value={zieldauer}
          onChange={setZieldauer}
          min={1}
          max={MAX_JAHRE}
          step={1}
          decimals={0}
          suffix="Jahre"
          hint="Wie lange es tragen soll. Wer mit 65 aufhört, rechnet eher mit 30 als mit 20 Jahren – die Hälfte aller 65-Jährigen erlebt den 85. Geburtstag."
        />

        <div className="border-border space-y-5 border-t pt-5">
          <NumberField
            label="Erwartete Rendite (nominal)"
            value={rendite}
            onChange={setRendite}
            min={0}
            max={15}
            step={0.1}
            suffix="%"
            hint="Vor Inflation. In der Entnahmephase liegt der Aktienanteil meist niedriger als davor."
          />
          <NumberField
            label="Erwartete Inflationsrate"
            value={inflation}
            onChange={setInflation}
            min={0}
            max={10}
            step={0.1}
            suffix="%"
          />
        </div>
      </InputPanel>

      <ResultPanel>
        <HeadlineResult
          label="Das Kapital trägt"
          value={reichweiteText}
          tone={
            ergebnis.dauerhaft
              ? 'positive'
              : ergebnis.zieldauerGedeckt
                ? 'brand'
                : 'negative'
          }
          hint={
            ergebnis.dauerhaft
              ? `Die Entnahme von ${formatPercent(ergebnis.entnahmequoteProzent, 2)} bleibt unter dem Realzins von ${formatPercent(ergebnis.realzinsProzent, 2)} – das Kapital wächst trotz Entnahme.`
              : ergebnis.zieldauerGedeckt
                ? `Die gewünschten ${formatNumber(zieldauer)} Jahre sind gedeckt; danach bleiben rechnerisch ${formatCurrency(ergebnis.restKapital, 0)} in heutiger Kaufkraft.`
                : `Das sind ${formatNumber(zieldauer - (ergebnis.reichweiteJahre ?? 0))} Jahre weniger als gewünscht. Möglich wären ${formatCurrency(ergebnis.fuerZieldauerProMonat, 0)} im Monat.`
          }
        />

        <StatGrid columns={3}>
          <Stat
            label="Entnahmequote"
            value={formatPercent(ergebnis.entnahmequoteProzent, 2)}
            hint="Jahresentnahme am Kapital – die Zahl, an der die Vier-Prozent-Regel hängt."
          />
          <Stat
            label="Realzins"
            value={formatPercent(ergebnis.realzinsProzent, 2)}
            tone={ergebnis.realzinsProzent > 0 ? 'positive' : 'negative'}
            hint={`Aus ${formatPercent(rendite, 1)} Rendite und ${formatPercent(inflation, 1)} Inflation – nicht die Differenz, sondern der Quotient.`}
          />
          <Stat
            label="Rest nach den gewünschten Jahren"
            value={formatCurrency(ergebnis.restKapital, 0)}
            tone={ergebnis.restKapital > 0 ? 'positive' : 'negative'}
            hint="In heutiger Kaufkraft."
          />
        </StatGrid>

        {/*
          Die beiden Vergleichsbeträge stehen absichtlich zusammen in einem
          Kasten und nicht bei den Kennzahlen: Sie beantworten dieselbe Frage
          von der anderen Seite – nicht „wie lange reicht mein Betrag", sondern
          „welcher Betrag reicht".
        */}
        <div className="fk-card p-5 sm:p-6">
          <h3 className="text-fg text-base font-semibold">
            Von der anderen Seite gefragt
          </h3>
          <p className="text-fg-muted mt-1.5 text-sm">
            Nicht „wie lange reicht mein Betrag“, sondern „welcher Betrag reicht“. Beide
            Zahlen in heutiger Kaufkraft, monatlich.
          </p>
          <StatGrid columns={2} className="mt-5">
            <Stat
              label="Kapital bleibt erhalten"
              value={
                ergebnis.dauerhaftProMonat > 0
                  ? formatCurrency(ergebnis.dauerhaftProMonat, 0)
                  : 'nicht möglich'
              }
              hint={
                ergebnis.dauerhaftProMonat > 0
                  ? 'Nur der reale Ertrag wird entnommen. Das Kapital behält seine Kaufkraft – auch für Erben.'
                  : 'Bei einem Realzins von null oder darunter verliert das Kapital auch ohne jede Entnahme an Kaufkraft.'
              }
            />
            <Stat
              label={`Kapital reicht genau ${formatNumber(zieldauer)} Jahre`}
              value={formatCurrency(ergebnis.fuerZieldauerProMonat, 0)}
              hint="Am Ende dieser Dauer ist nichts mehr da. Das ist kein Fehler, sondern eine Entscheidung – sie setzt aber voraus, dass die Dauer stimmt."
            />
          </StatGrid>
        </div>

        {/*
          Der Verlauf als Tabelle, nicht als Diagramm.

          Die Aussage steckt im Nebeneinander von realer und nominaler Spalte:
          Die Entnahme bleibt links gleich und wächst rechts. Eine Kurve zeigt
          den Endwert, aber nicht diesen Unterschied — und er ist der Grund,
          warum es diesen Rechner gibt.
        */}
        <div className="fk-card p-5 sm:p-6">
          <h3 className="text-fg text-base font-semibold">Der Verlauf, Jahr für Jahr</h3>
          <p className="text-fg-muted mt-1.5 text-sm">
            Links in heutiger Kaufkraft, rechts in den Euro des jeweiligen Jahres. Die
            Entnahme bleibt links gleich – und wächst rechts.
          </p>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[34rem] text-sm">
              <caption className="sr-only">
                Entnahmeplan Jahr für Jahr, real und nominal
              </caption>
              <thead>
                <tr className="text-fg-subtle border-border border-b text-left text-xs uppercase">
                  <th scope="col" className="py-2 pr-3 font-semibold">
                    Jahr
                  </th>
                  <th scope="col" className="py-2 pr-3 text-right font-semibold">
                    Entnahme real
                  </th>
                  <th scope="col" className="py-2 pr-3 text-right font-semibold">
                    Entnahme nominal
                  </th>
                  <th scope="col" className="py-2 pr-3 text-right font-semibold">
                    Depot real
                  </th>
                  <th scope="col" className="py-2 text-right font-semibold">
                    Depot nominal
                  </th>
                </tr>
              </thead>
              <tbody className="tabular-nums">
                {ergebnis.verlauf.map((jahr) => (
                  <tr key={jahr.jahr} className="border-border/60 border-b last:border-0">
                    <th scope="row" className="text-fg-muted py-2 pr-3 font-medium">
                      {jahr.jahr}
                    </th>
                    <td className="text-fg-muted py-2 pr-3 text-right">
                      {formatCurrency(jahr.entnahme, 0)}
                    </td>
                    <td className="text-fg py-2 pr-3 text-right">
                      {formatCurrency(jahr.entnahmeNominal, 0)}
                    </td>
                    <td className="text-fg-muted py-2 pr-3 text-right">
                      {formatCurrency(jahr.endwert, 0)}
                    </td>
                    <td className="text-fg py-2 text-right">
                      {formatCurrency(jahr.endwertNominal, 0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {letztesVolles && inflation > 0 && (
            <p className="text-fg-muted mt-4 text-sm leading-relaxed">
              Im Jahr {letztesVolles.jahr} sind aus {formatCurrency(entnahme, 0)} im Monat{' '}
              <strong className="text-fg">
                {formatCurrency(letztesVolles.entnahmeNominal / 12, 0)}
              </strong>{' '}
              geworden – derselbe Warenkorb, ein anderer Preis. Wer stattdessen mit einer
              festen Entnahme rechnet, plant diese Kürzung unbemerkt ein.
            </p>
          )}
        </div>

        <Callout variant="tip" title="Rechne die schlechte Variante mit">
          <p>
            Eine einzelne Zahl trägt über dreißig Jahre nicht. Setze die Rendite einen
            Prozentpunkt niedriger, die Inflation einen Prozentpunkt höher und die Dauer
            fünf Jahre länger – und schau, was von der Reichweite bleibt. Wenn der Plan
            das aushält, hält er einiges aus.
          </p>
        </Callout>
      </ResultPanel>
    </CalculatorGrid>
  )
}
