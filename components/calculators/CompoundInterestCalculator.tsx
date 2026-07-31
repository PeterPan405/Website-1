'use client'

import { useMemo, useState } from 'react'
import { getCalculatorDefinition } from '@/data/calculators'

import {
  CalculatorGrid,
  ComparisonBars,
  HeadlineResult,
  InputPanel,
  ResultPanel,
} from '@/components/calculators/CalculatorPanels'
import { NumberField, SelectField } from '@/components/calculators/NumberField'
import { useErgebnisbericht } from '@/components/calculators/ErgebnisDownload'
import { CompoundChart } from '@/components/charts/CompoundChart'
import { Stat, StatGrid } from '@/components/ui/Stat'
import {
  calculateCompoundInterest,
  contributionIntervalLabels,
  doublingTimeYears,
  exactDoublingTimeYears,
  type ContributionInterval,
} from '@/lib/finance'
import { formatCurrency, formatNumber, formatPercent } from '@/lib/format'

const defaults = {
  principal: 5000,
  contribution: 200,
  interval: 'monthly' as ContributionInterval,
  rate: 6,
  years: 25,
  timing: 'end' as 'start' | 'end',
}

export function CompoundInterestCalculator() {
  const [principal, setPrincipal] = useState(defaults.principal)
  const [contribution, setContribution] = useState(defaults.contribution)
  const [interval, setInterval] = useState<ContributionInterval>(defaults.interval)
  const [rate, setRate] = useState(defaults.rate)
  const [years, setYears] = useState(defaults.years)
  const [timing, setTiming] = useState<'start' | 'end'>(defaults.timing)

  const result = useMemo(
    () =>
      calculateCompoundInterest({
        principal,
        annualRatePercent: rate,
        years,
        contribution,
        interval,
        timing,
      }),
    [principal, rate, years, contribution, interval, timing]
  )

  useErgebnisbericht({
    titel: 'Zinsrechner',
    pfad: '/rechner/zinsrechner',
    annahmen: [
      { bezeichnung: 'Startkapital', wert: formatCurrency(principal) },
      {
        bezeichnung: `Sparrate (${contributionIntervalLabels[interval]})`,
        wert: formatCurrency(contribution),
      },
      { bezeichnung: 'Zinssatz je Jahr', wert: formatPercent(rate, 2) },
      { bezeichnung: 'Laufzeit', wert: `${formatNumber(years)} Jahre` },
      {
        bezeichnung: 'Einzahlung',
        wert: timing === 'start' ? 'zu Periodenbeginn' : 'zum Periodenende',
      },
    ],
    ergebnisse: [
      { bezeichnung: 'Endkapital', wert: formatCurrency(result.finalBalance) },
      { bezeichnung: 'davon Einzahlungen', wert: formatCurrency(result.totalDeposits) },
      { bezeichnung: 'davon Zinsen', wert: formatCurrency(result.totalInterest) },
      {
        bezeichnung: 'Zinsanteil am Endkapital',
        wert: formatPercent(result.interestSharePercent, 1),
      },
    ],
    bloecke: [
      {
        titel: 'Jahresverlauf',
        zeilen: result.years.map((j) => ({
          bezeichnung: `Jahr ${j.year}`,
          wert: formatCurrency(j.endBalance),
        })),
      },
    ],
    grenzen: getCalculatorDefinition('zinsrechner')!.grenzen,
  })

  const approximateDoubling = doublingTimeYears(rate)
  const exactDoubling = exactDoublingTimeYears(rate)

  function reset() {
    setPrincipal(defaults.principal)
    setContribution(defaults.contribution)
    setInterval(defaults.interval)
    setRate(defaults.rate)
    setYears(defaults.years)
    setTiming(defaults.timing)
  }

  return (
    <CalculatorGrid>
      <InputPanel onReset={reset}>
        <NumberField
          label="Startkapital"
          value={principal}
          onChange={setPrincipal}
          min={0}
          max={10_000_000}
          suffix="€"
          hint="Einmaliger Betrag, der zu Beginn angelegt wird. 0 ist erlaubt."
        />
        <NumberField
          label="Sparrate"
          value={contribution}
          onChange={setContribution}
          min={0}
          max={100_000}
          suffix="€"
          hint="Höhe einer einzelnen Einzahlung im gewählten Intervall."
        />
        <SelectField<ContributionInterval>
          label="Einzahlungsintervall"
          value={interval}
          onChange={setInterval}
          options={[
            { value: 'monthly', label: contributionIntervalLabels.monthly },
            { value: 'quarterly', label: contributionIntervalLabels.quarterly },
            { value: 'yearly', label: contributionIntervalLabels.yearly },
          ]}
        />
        <NumberField
          label="Zinssatz pro Jahr"
          value={rate}
          onChange={setRate}
          min={0}
          max={20}
          step={0.1}
          suffix="%"
          hint="Deine Annahme. Für breite Aktienmärkte werden langfristig oft 6 bis 8 Prozent nominal angesetzt – das ist keine Zusage."
        />
        <NumberField
          label="Laufzeit"
          value={years}
          onChange={setYears}
          min={1}
          max={60}
          step={1}
          decimals={0}
          suffix="Jahre"
        />
        <SelectField<'start' | 'end'>
          label="Zahlungsweise"
          value={timing}
          onChange={setTiming}
          options={[
            { value: 'end', label: 'nachschüssig (Ende der Periode)' },
            { value: 'start', label: 'vorschüssig (Anfang der Periode)' },
          ]}
          hint="Vorschüssig verzinst sich jede Rate eine Periode länger."
        />
      </InputPanel>

      <ResultPanel>
        <HeadlineResult
          label={`Endkapital nach ${formatNumber(years, 0)} Jahren`}
          value={formatCurrency(result.finalBalance, 0)}
          hint={`Davon ${formatCurrency(result.totalInterest, 0)} Erträge – das sind ${formatPercent(
            result.interestSharePercent,
            1
          )} des Endkapitals.`}
        />

        <div className="fk-card p-5 sm:p-6">
          <h3 className="text-fg text-base font-semibold">
            Woraus sich das Endkapital zusammensetzt
          </h3>
          <div className="mt-5">
            <ComparisonBars
              bars={[
                {
                  label: 'Deine Einzahlungen (inkl. Startkapital)',
                  value: result.totalDeposits,
                  display: formatCurrency(result.totalDeposits, 0),
                  barClass: 'bg-tools',
                },
                {
                  label: 'Erträge aus Zins und Zinseszins',
                  value: result.totalInterest,
                  display: formatCurrency(result.totalInterest, 0),
                  barClass: 'bg-success',
                },
              ]}
            />
          </div>
        </div>

        <div className="fk-card p-5 sm:p-6">
          <h3 className="text-fg text-base font-semibold">Verlauf über die Jahre</h3>
          <p className="text-fg-muted mt-1.5 text-sm">
            Die untere Fläche sind deine Einzahlungen, die obere die Erträge. Interessant
            ist der Punkt, an dem die obere Fläche die untere überholt.
          </p>
          <div className="mt-5">
            <CompoundChart years={result.years} />
          </div>
        </div>

        <StatGrid columns={3}>
          <Stat
            label="Eingezahlt"
            value={formatCurrency(result.totalDeposits, 0)}
            hint="Startkapital plus alle Raten"
          />
          <Stat
            label="Erträge"
            value={formatCurrency(result.totalInterest, 0)}
            tone="positive"
            hint="Zinsen inklusive Zinseszins"
          />
          <Stat
            label="Verdopplungszeit"
            value={
              approximateDoubling
                ? `${formatNumber(approximateDoubling, 1)} Jahre`
                : 'nicht definiert'
            }
            hint={
              exactDoubling
                ? `72er-Regel; exakt sind es ${formatNumber(exactDoubling, 1)} Jahre.`
                : 'Bei einem Zinssatz von 0 verdoppelt sich nichts.'
            }
          />
        </StatGrid>

        {/* Jahrestabelle: für Screenreader und zum genauen Nachlesen. */}
        <details className="fk-card overflow-hidden">
          <summary className="text-fg cursor-pointer list-none px-5 py-4 font-semibold sm:px-6">
            Jahr-für-Jahr-Tabelle anzeigen
          </summary>
          <div className="border-border overflow-x-auto border-t">
            <table className="w-full min-w-[36rem] border-collapse text-sm">
              <caption className="sr-only">
                Entwicklung des Kapitals je Jahr mit Einzahlungen und Erträgen
              </caption>
              <thead className="bg-surface-muted">
                <tr>
                  {['Jahr', 'Einzahlungen', 'Erträge', 'Kapital am Jahresende'].map(
                    (head) => (
                      <th
                        key={head}
                        scope="col"
                        className="text-fg-subtle px-4 py-2.5 text-left text-xs font-semibold tracking-wide uppercase"
                      >
                        {head}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {result.years.map((row) => (
                  <tr key={row.year} className="border-border border-t">
                    <th scope="row" className="text-fg px-4 py-2.5 text-left font-medium">
                      {row.year}
                    </th>
                    <td className="text-fg-muted px-4 py-2.5 tabular-nums">
                      {formatCurrency(row.contributions, 0)}
                    </td>
                    <td className="text-success px-4 py-2.5 tabular-nums">
                      {formatCurrency(row.interest, 0)}
                    </td>
                    <td className="text-fg px-4 py-2.5 font-semibold tabular-nums">
                      {formatCurrency(row.endBalance, 0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      </ResultPanel>
    </CalculatorGrid>
  )
}
