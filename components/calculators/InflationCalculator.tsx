'use client'

import { useMemo, useState } from 'react'

import {
  CalculatorGrid,
  ComparisonBars,
  HeadlineResult,
  InputPanel,
  ResultPanel,
} from '@/components/calculators/CalculatorPanels'
import { NumberField } from '@/components/calculators/NumberField'
import { InflationChart } from '@/components/charts/InflationChart'
import { Callout } from '@/components/ui/Callout'
import { Stat, StatGrid } from '@/components/ui/Stat'
import { calculateInflation, realRatePercent } from '@/lib/finance'
import { formatCurrency, formatNumber, formatPercent } from '@/lib/format'

const defaults = {
  amount: 10_000,
  rate: 2.5,
  years: 20,
  nominalReturn: 4,
}

export function InflationCalculator() {
  const [amount, setAmount] = useState(defaults.amount)
  const [rate, setRate] = useState(defaults.rate)
  const [years, setYears] = useState(defaults.years)
  const [nominalReturn, setNominalReturn] = useState(defaults.nominalReturn)

  const result = useMemo(
    () => calculateInflation({ amount, annualRatePercent: rate, years }),
    [amount, rate, years]
  )

  const real = realRatePercent(nominalReturn, rate)
  const approximation = nominalReturn - rate

  function reset() {
    setAmount(defaults.amount)
    setRate(defaults.rate)
    setYears(defaults.years)
    setNominalReturn(defaults.nominalReturn)
  }

  return (
    <CalculatorGrid>
      <InputPanel onReset={reset}>
        <NumberField
          label="Betrag"
          value={amount}
          onChange={setAmount}
          min={1}
          max={100_000_000}
          suffix="€"
          hint="Die Summe, deren Kaufkraft du betrachten willst."
        />
        <NumberField
          label="Inflationsrate pro Jahr"
          value={rate}
          onChange={setRate}
          min={0}
          max={20}
          step={0.1}
          suffix="%"
          hint="Das Ziel der Europäischen Zentralbank liegt bei 2 Prozent. Historisch lag der Wert in Deutschland oft zwischen 1 und 3 Prozent, in Einzeljahren deutlich höher."
        />
        <NumberField
          label="Zeitraum"
          value={years}
          onChange={setYears}
          min={1}
          max={60}
          step={1}
          decimals={0}
          suffix="Jahre"
        />

        <div className="border-border border-t pt-5">
          <NumberField
            label="Nominale Rendite deiner Anlage"
            value={nominalReturn}
            onChange={setNominalReturn}
            min={0}
            max={20}
            step={0.1}
            suffix="%"
            hint="Optional – damit wird unten der exakte Realzins berechnet."
          />
        </div>
      </InputPanel>

      <ResultPanel>
        <HeadlineResult
          label={`Kaufkraft von ${formatCurrency(amount, 0)} nach ${formatNumber(years, 0)} Jahren`}
          value={formatCurrency(result.purchasingPower, 0)}
          tone="negative"
          hint={`Das entspricht einem Kaufkraftverlust von ${formatCurrency(
            result.absoluteLoss,
            0
          )} beziehungsweise ${formatPercent(result.lossPercent, 1)}.`}
        />

        <div className="fk-card p-5 sm:p-6">
          <h3 className="text-fg text-base font-semibold">
            Die Schere in beide Richtungen
          </h3>
          <p className="text-fg-muted mt-1.5 text-sm">
            Dieselbe Inflationsrate wirkt zweifach: Sie senkt den Wert deines Geldes und
            erhöht den Betrag, den du später für dieselben Güter brauchst.
          </p>
          <div className="mt-5">
            <ComparisonBars
              bars={[
                {
                  label: 'Heutiger Betrag',
                  value: amount,
                  display: formatCurrency(amount, 0),
                  barClass: 'bg-brand',
                },
                {
                  label: `Verbleibende Kaufkraft nach ${formatNumber(years, 0)} Jahren`,
                  value: result.purchasingPower,
                  display: formatCurrency(result.purchasingPower, 0),
                  barClass: 'bg-danger',
                },
                {
                  label: 'Nötiger Betrag für gleiche Kaufkraft',
                  value: result.requiredAmount,
                  display: formatCurrency(result.requiredAmount, 0),
                  barClass: 'bg-warning',
                },
              ]}
            />
          </div>
        </div>

        <div className="fk-card p-5 sm:p-6">
          <h3 className="text-fg text-base font-semibold">Verlauf über die Jahre</h3>
          <div className="mt-5">
            <InflationChart years={result.years} baseAmount={amount} />
          </div>
        </div>

        <StatGrid columns={3}>
          <Stat
            label="Halbierung der Kaufkraft"
            value={
              result.halvingYears
                ? `nach ${formatNumber(result.halvingYears, 1)} Jahren`
                : 'nie'
            }
            hint={
              result.halvingYears
                ? 'Bei unveränderter Inflationsrate.'
                : 'Bei einer Inflationsrate von 0 bleibt die Kaufkraft erhalten.'
            }
          />
          <Stat
            label="Exakter Realzins"
            value={formatPercent(real, 2)}
            tone={real >= 0 ? 'positive' : 'negative'}
            hint={`Bei ${formatPercent(nominalReturn, 1)} nominaler Rendite.`}
          />
          <Stat
            label="Genäherter Realzins"
            value={formatPercent(approximation, 2)}
            hint="Nominalzins minus Inflation – die verbreitete, aber ungenaue Faustformel."
          />
        </StatGrid>

        <Callout variant="info" title="Warum der Unterschied wichtig ist">
          <p>
            Die Differenz zwischen exaktem und genähertem Realzins beträgt hier{' '}
            {formatPercent(Math.abs(real - approximation), 2)} pro Jahr. Klingt nach
            nichts – über 30 Jahre summiert sich das über den Zinseszinseffekt zu mehreren
            Prozent des Endvermögens.
          </p>
          <p>
            Für langfristige Planungen rechnest du am besten durchgehend real: mit dem
            Realzins und ohne Inflationsaufschlag auf die Sparrate. Dann sind alle
            Ergebnisse in heutiger Kaufkraft und damit einschätzbar.
          </p>
        </Callout>
      </ResultPanel>
    </CalculatorGrid>
  )
}
